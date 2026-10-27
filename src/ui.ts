import { GAUGE, GameEngine, WAITING_MAX } from "./engine";
import type { ActiveTask, BillRow, Changes, GameRecord, GameState, LogEntry, Objective, Stat, TooltipBlock, TooltipBlockKind } from "./types";
import { openingContext, routeKeys } from "./content";

export interface UICallbacks {
  beforeChange?(): void;
  onChange(): Promise<void> | void;
  onExport(): Promise<void> | void;
  /** Reads and validates a chosen file; throws with a player-facing message when it cannot be loaded. */
  readImport(file: File): Promise<GameState>;
  onImport(state: GameState): Promise<void> | void;
  onNewGame(): Promise<void> | void;
}

/** The settlement of time away, as reported by `GameEngine.advance` plus the journal lines it produced. */
export interface ReturnSummary {
  awaySeconds: number;
  activitySeconds: number;
  spentSeconds: number;
  bankedSeconds: number;
  entries: LogEntry[];
  /** Stat values before the settlement, keyed by record id, so the summary can report what was gained. */
  before: Record<string, number>;
}

type Tab = "tasks" | "fight" | "techniques" | "home" | "craft" | "character";
type Mode = "instant" | "timed" | "continuous";
const tabs: { id: Tab; name: string }[] = [
  { id: "tasks", name: "Tasks" }, { id: "fight", name: "Fight" }, { id: "techniques", name: "Techniques" },
  { id: "home", name: "Home" }, { id: "craft", name: "Craft" }, { id: "character", name: "Character" },
];
const groups: { id: string; title: string; tab: Tab; matches(record: GameRecord): boolean }[] = [
  { id: "work", title: "Village work", tab: "tasks", matches: record => record.group === "Work" },
  { id: "practice", title: "Practice", tab: "tasks", matches: record => record.group === "Practice" && record.kind === "task" },
  { id: "sites", title: "Places beyond the village", tab: "tasks", matches: record => record.group === "Sites" },
  { id: "commissions", title: "Commissions", tab: "tasks", matches: record => record.group === "Commissions" },
  { id: "fights", title: "Fights", tab: "tasks", matches: record => record.group === "Fights" },
  { id: "purchases", title: "Purchases", tab: "tasks", matches: record => record.group === "Purchases" && record.kind !== "class" },
  { id: "classes", title: "Standing", tab: "tasks", matches: record => record.kind === "class" },
  { id: "trade", title: "Village trade", tab: "tasks", matches: record => record.group === "Trade" },
  { id: "techniques", title: "Techniques", tab: "techniques", matches: record => record.kind === "technique" && !record.stance },
  { id: "stances", title: "Stances", tab: "techniques", matches: record => record.kind === "technique" && record.stance === true },
  { id: "shelter", title: "Shelter", tab: "home", matches: record => record.group === "Home" && record.kind === "home" },
  { id: "arrangements", title: "Arrangements", tab: "home", matches: record => record.group === "Home" && record.kind === "arrangement" },
  { id: "workbench", title: "Workbench", tab: "craft", matches: record => record.kind === "recipe" },
  { id: "preparations", title: "Preparations", tab: "craft", matches: record => record.kind === "preparation" },
];
const notActions = new Set(["resource", "family", "flag", "breakthrough", "lead"]);
const bodyIds = ["vigor", "qi", "life", "strain", "focus"];
/** The slip's leaf eight as each reading completes it: the chipped sentence is finished by the method you settle on. */
const rebuiltLeaf: Record<string, string> = {
  carry_current: "“…when the pooled breath turns, do not follow it. Wait at the turning. The rest is to take it up and carry it where you are going.”",
  settle_breath: "“…when the pooled breath turns, do not follow it. Wait at the turning. The rest is to let it down and keep still while it settles.”",
};
/** How far ahead the unattended-runway probe may look: a day is longer than any bank. */
const runwayHorizon = 86400;
const groupsKey = "lowbridge.ui.groups";

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", text = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function setText(node: HTMLElement, text: string): void {
  if (node.textContent !== text) node.textContent = text;
}
/** "A", "A and B", "A, B and C". */
function listText(items: string[]): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}
function placeName(slot: string): string {
  return `${slot.charAt(0).toUpperCase()}${slot.slice(1)} place`;
}
/** Route keys in words, as the tooltip and the commit confirmation name them. */
function keyNames(record: GameRecord): string[] {
  return (record.tags ?? []).map(tag => routeKeys[tag]?.name ?? tag);
}
/** Whether a record pays a resource in (results, effects, modifiers, thresholds) or out (bills and running costs). */
function resourceUse(record: GameRecord, resourceId: string): { gives: boolean; spends: boolean } {
  const touches = (tables: (Changes | undefined)[]) => tables.some(changes => Object.keys(changes ?? {}).some(path => path.split(".")[0] === resourceId));
  return {
    gives: touches([record.result, record.effect, record.mod, ...Object.values(record.every ?? {}), ...Object.values(record.at ?? {})]),
    spends: touches([record.cost, record.buy, record.run, record.strain]),
  };
}
interface ConfirmOptions {
  /** A loss (replacing the journey, taking something down) reads as danger; a commitment the content warns about reads as a choice. */
  tone: "danger" | "commit";
  label?: string;
  /** One more line under the question: what a commitment brings with it. */
  detail?: string;
}
/** One line of a breakthrough's checklist: a met/unmet mark and a label that can change as what it counts fills. */
interface ChecklistItem {
  row: HTMLLIElement;
  update(ok: boolean, shown?: string): void;
}
const quantityFormat = new Intl.NumberFormat("en-US", { useGrouping: false, maximumFractionDigits: 2 });
const rateFormat = new Intl.NumberFormat("en-US", { useGrouping: false, maximumSignificantDigits: 2 });
function number(value: number): string {
  return quantityFormat.format(value);
}
/** Rates are estimates; two significant figures read as one, where "+0.5202/min" reads as noise. */
function rateNumber(value: number): string {
  return rateFormat.format(value);
}
/** A held amount counts only whole units, as bills do: 2.005 qi shows as 2. */
function held(value: number): string {
  return number(Math.floor(value + 1e-9));
}
function duration(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  if (whole < 60) return `${whole}s`;
  const hours = Math.floor(whole / 3600), minutes = Math.floor((whole % 3600) / 60), rest = whole % 60;
  if (hours) return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  return `${minutes}m ${rest.toString().padStart(2, "0")}s`;
}
function clock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${(whole % 60).toString().padStart(2, "0")}`;
}
function meter(className = "") {
  const root = element("div", `meter ${className}`.trim()), fill = element("div", "meter-fill");
  root.setAttribute("aria-hidden", "true");
  root.append(fill);
  return { root, update(value: number, max: number) { fill.style.width = `${max > 0 ? Math.min(100, Math.max(0, value / max * 100)) : 0}%`; } };
}
/** One pip per unit of a small capacity, filled up to the amount held. */
function syncPips(pips: HTMLElement, value: number, max: number, className: string): void {
  const count = Math.floor(max);
  while (pips.children.length < count) pips.append(element("span", className));
  while (pips.children.length > count) pips.lastElementChild!.remove();
  Array.from(pips.children).forEach((pip, index) => pip.classList.toggle("filled", index < value));
}
function modeOf(record: GameRecord): Mode {
  return record.length === undefined ? "instant" : record.length === "continuous" ? "continuous" : "timed";
}
/** Sustained before instant, as the slot reads them; a self-starting filler like Rest is a control and goes last. */
function sortRank(record: GameRecord): number {
  return record.autoStart ? 2 : modeOf(record) === "continuous" ? 0 : 1;
}
/** The journal's kind labels, in the player's words rather than the engine's. */
const journalKinds: Record<LogEntry["kind"], string> = {
  discovery: "Discovery", story: "Story", cap: "Limit", completion: "Done", pause: "Stopped",
  purchase: "Acquired", method: "Method", home: "Home", fight: "Fight",
};
/** Where a record's primary cell lives; practice is mirrored under its knowledge on Character as well. */
function recordTab(record: GameRecord): Tab {
  if (record.kind === "recipe" || record.kind === "preparation") return "craft";
  return record.group === "Home" ? "home" : record.kind === "technique" ? "techniques" : "tasks";
}
const seenDiscoveryKey = "lowbridge.ui.seenDiscovery";
const seenCompletionKey = "lowbridge.ui.seenCompletion";
function readClosedGroups(): Set<string> {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(groupsKey) ?? "[]");
    return new Set(Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : []);
  } catch { return new Set(); }
}
const pulseTimers = new Map<HTMLElement, number>();
/** Restarts a short CSS animation class, even on rapid repeats. */
function pulse(node: HTMLElement, className: string, ms: number): void {
  window.clearTimeout(pulseTimers.get(node));
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
  pulseTimers.set(node, window.setTimeout(() => node.classList.remove(className), ms));
}

/** The live view over one journey: the shell is built once, then driven by these four calls. */
export interface LowbridgeUI {
  render(status?: string): void;
  showReturn(summary: ReturnSummary): void;
  /** Swaps in a replacement journey (an import, a new game) and redraws against it. */
  setEngine(next: GameEngine): void;
  destroy(): void;
}

/** Nodes are mounted once; ticking updates never recreate inputs, details, or focused controls. */
export function createUI(initialEngine: GameEngine, callbacks: UICallbacks): LowbridgeUI {
  let engine = initialEngine, selectedTab: Tab = "tasks", saveStatus = "Save ready";
  let latestAnnouncement = "", settingsBusy = false, disposed = false;
  // Why the last save action failed. Held rather than written straight to the node, so that the message
  // survives every later render and is replaced only by the next action, not by whichever call ran last.
  let settingsError = "";
  // The journal speaks for itself only when it grows; replaying the latest line every tick would talk over refusals.
  let announcedLogId = engine.state.log.at(-1)?.id ?? 0;
  const root = document.querySelector<HTMLElement>("#app");
  if (!root) throw new Error("Lowbridge needs an #app element.");
  root.innerHTML = `
    <a class="skip-link" href="#activities">Skip to activities</a>
    <div class="game-shell">
      <header class="game-toolbar">
        <div class="brand"><svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 20c3.5-7.5 7.5-10.5 12-10.5S24.5 12.5 28 20M7 25h18M11 18v4m10-4v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><h1>Lowbridge</h1><span class="stage-label" data-ui="stage">The village</span></div>
        <div class="toolbar-bank" data-ui="bank"><div class="toolbar-bank-heading"><span>Time bank</span><strong class="numeric" data-ui="bank-amount"></strong></div><div data-ui="bank-meter"></div>
          <button type="button" class="accelerate-toggle" data-ui="accelerate" data-action="accelerate" aria-pressed="false">Accelerate</button></div>
        <div class="toolbar-end"><span class="save-status" data-ui="save-status" role="status"></span><details class="settings"><summary>Save &amp; settings</summary><div class="settings-body">
          <div class="settings-buttons"><button type="button" data-ui="export">Export save</button><button type="button" data-ui="import">Import save</button><button type="button" class="danger-button" data-ui="new-game">New game</button></div>
          <input type="file" accept=".json,application/json" data-ui="file" hidden />
          <p>Time away runs the current activity to its objective, then the waiting list in order; what is left enters the bank.</p><p class="settings-feedback" data-ui="settings-feedback" role="status" hidden></p>
        </div></details></div>
      </header>
      <div class="workspace">
        <aside class="ledger-column" aria-label="Resources and knowledge">
          <section class="panel ledger"><div class="panel-heading"><h2>Resources</h2><span>Held / max</span></div>
            <details class="ledger-section" open><summary><h3>Currency</h3></summary><div data-ui="currency"></div></details>
            <details class="ledger-section" open><summary><h3>Materials</h3></summary><div data-ui="materials"></div></details>
            <details class="ledger-section" open data-ui="preparations-panel" hidden><summary><h3>Preparations</h3></summary><div data-ui="preparations"></div><div class="in-effect" data-ui="in-effect" hidden></div></details>
            <details class="ledger-section" open data-ui="families-panel" hidden><summary><h3>Knowledge <span>Level / limit</span></h3></summary><div class="family-list" data-ui="families"></div></details>
          </section>
          <section class="panel location-panel"><div class="panel-heading"><h2 data-ui="location-place"></h2></div><p data-ui="location-text"></p></section>
        </aside>
        <main class="centre-column">
          <dialog class="confirmation" data-ui="confirmation" role="alertdialog" aria-labelledby="confirmation-text" aria-describedby="confirmation-detail"><div class="confirmation-copy"><p id="confirmation-text" data-ui="confirmation-text"></p><p class="confirmation-detail" id="confirmation-detail" data-ui="confirmation-detail" hidden></p></div><div class="banner-actions"><button type="button" class="danger-button" data-ui="confirm">Confirm</button><button type="button" data-ui="cancel">Cancel</button></div></dialog>
          <section class="completion-banner" data-ui="completion" role="region" aria-labelledby="completion-title" hidden><div class="completion-main"><strong class="completion-title" id="completion-title" data-ui="completion-title"></strong><p class="completion-text" data-ui="completion-text"></p><p class="completion-story" data-ui="completion-story" hidden></p><div class="completion-changes" data-ui="completion-changes-block" hidden><h3 data-ui="completion-changes-heading"></h3><ul data-ui="completion-changes"></ul></div></div><div class="banner-actions"><button type="button" data-ui="review-foundation">Review Foundation</button><button type="button" class="text-button" data-ui="completion-dismiss">Dismiss</button></div></section>
          <section class="return-banner" data-ui="return" role="region" aria-labelledby="return-title" hidden><div><strong id="return-title" data-ui="return-title"></strong><ul class="return-list" data-ui="return-list"></ul></div><button type="button" data-ui="return-dismiss">Continue</button></section>
          <section class="return-banner notice-banner" data-ui="notice" role="status" hidden><div><p class="notice-story" data-ui="notice-story"></p><p class="notice-new" data-ui="notice-text"></p></div><button type="button" data-ui="notice-dismiss">Dismiss</button></section>
          <section class="panel activity-panel" id="activities" tabindex="-1"><nav class="activity-nav" role="tablist" aria-label="Game views" data-ui="tabs"></nav><div data-ui="tab-panels"></div></section>
        </main>
        <aside class="status-column" aria-label="Current activity and character">
          <section class="panel activity-slot"><div class="panel-heading"><h2>Current activity</h2><span class="activity-state" data-ui="active-mode">Idle</span></div><div class="slot-body"><h3 data-ui="objective-name">No activity</h3><p class="slot-goal" data-ui="objective-progress"></p><div data-ui="active-meter"></div><p class="slot-progress numeric" data-ui="active-progress"></p><p class="slot-eta" data-ui="active-eta" hidden></p><p class="slot-current" data-ui="carried" hidden></p>
            <div class="objective-editor" data-ui="objective-editor" hidden><label>Stop when <select data-ui="objective-kind"></select></label><label data-ui="objective-target-label">Target <input type="number" data-ui="objective-target" inputmode="numeric" /></label><p class="slot-error" data-ui="objective-error" role="status"></p></div>
            <div class="slot-actions"><button type="button" data-ui="stop" data-action="stop" aria-describedby="stop-reason">Stop</button><button type="button" class="text-button" data-ui="locate-active" hidden>Show activity</button></div><p class="slot-reason" id="stop-reason" data-ui="stop-reason" hidden></p><p class="slot-note" data-ui="bank-note"></p><p class="slot-last" data-ui="last-stop" hidden></p>
            <div class="hobby" data-ui="hobby" hidden><p class="hobby-line"><span data-ui="hobby-name"></span><button type="button" class="text-button" data-ui="hobby-stop" data-action="hobby-stop">Stop</button></p></div>
            <div class="waiting" data-ui="waiting-block" hidden><h4>Waiting</h4><ol class="waiting-list" data-ui="waiting"></ol><p class="empty-state" data-ui="waiting-empty">Nothing is waiting. Shift-click an action to queue it; the list keeps running while you are away.</p><p class="waiting-runway" data-ui="waiting-runway" hidden></p></div></div></section>
          <section class="panel body-panel"><div class="panel-heading"><h2>Body</h2><span>Held / max</span></div><div class="body-list" data-ui="body"></div></section>
          <section class="panel character-status"><div class="panel-heading"><h2>Character</h2><span data-ui="character-stage">Mortal</span></div><div class="status-body"><dl class="status-list" data-ui="status-list"><div class="home-status"><dt>Home</dt><dd data-ui="home-name"></dd></div><div><dt>Floor space</dt><dd data-ui="home-space"></dd></div></dl></div></section>
          <section class="panel journal-panel" aria-labelledby="journal-heading"><div class="panel-heading"><h2 id="journal-heading">Journal</h2><select data-ui="journal-filter" aria-label="Journal entries"><option value="key">Story, discoveries &amp; limits</option><option value="all">All entries</option></select></div><ol class="journal-list" data-ui="journal"></ol><p class="empty-state journal-empty" data-ui="journal-empty">The mill wheel turns below the hayloft.</p></section>
        </aside>
      </div>
      <footer class="game-footer"><span data-ui="bound"></span><span data-ui="activity-time"></span></footer>
      <p class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-ui="announcement"></p>
      <p class="sr-only" aria-live="polite" aria-atomic="true" data-ui="journal-announcement"></p>
    </div>`;
  const shell = root.querySelector<HTMLElement>(".game-shell")!;
  function ui<T extends HTMLElement = HTMLElement>(key: string): T {
    const node = root!.querySelector<T>(`[data-ui="${key}"]`);
    if (!node) throw new Error(`Missing UI node: ${key}`);
    return node;
  }
  function label(id: string): string { return engine.records.find(record => record.id === id)?.name ?? id.replaceAll("_", " "); }
  function current(id: string): number { return engine.state.stats[id]?.value ?? 0; }
  /** Timed work is counted in effort; the player reads it in real seconds at the current completion rate. */
  function realSeconds(record: GameRecord, work: number): number { return work / Math.max(engine.speed(record), 1e-9); }
  function announce(message: string): void {
    if (message && message !== latestAnnouncement) { latestAnnouncement = message; setText(ui("announcement"), message); }
  }
  async function change(action: () => void): Promise<void> {
    try { callbacks.beforeChange?.(); action(); render(); await callbacks.onChange(); }
    catch (error) { showSettingsError(error); }
  }
  function showSettingsError(error: unknown): void {
    settingsError = error instanceof Error ? error.message : String(error);
    root!.querySelector<HTMLDetailsElement>(".settings")!.open = true;
    render();
  }
  async function settingsAction(action: () => Promise<void> | void): Promise<void> {
    if (settingsBusy) return;
    settingsBusy = true; settingsError = ""; render();
    try { await action(); } catch (error) { showSettingsError(error); }
    finally { settingsBusy = false; render(); }
  }
  let pendingConfirmation: (() => Promise<void> | void) | null = null;
  let confirmationTrigger: HTMLElement | null = null;
  /** One confirm panel for every step that cannot be undone: replacing the save, taking something down, and any action the engine warns about. */
  function confirmAction(message: string, action: () => Promise<void> | void, { tone, label = "Confirm", detail = "" }: ConfirmOptions): void {
    pendingConfirmation = action;
    confirmationTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    root!.querySelector<HTMLDetailsElement>(".settings")!.open = false;
    const dialog = ui<HTMLDialogElement>("confirmation"), confirm = ui("confirm"), extra = ui("confirmation-detail");
    dialog.dataset.tone = tone;
    confirm.classList.toggle("danger-button", tone === "danger"); confirm.classList.toggle("primary-button", tone === "commit");
    setText(confirm, label); setText(ui("confirmation-text"), message);
    setText(extra, detail); extra.hidden = !detail;
    dialog.showModal(); ui("cancel").focus();
  }
  /**
   * Every step the engine warns about asks before it happens, and cancelling leaves the game exactly as
   * it was. Which step that is belongs to the engine: a chore closes its rival on first completion, a
   * technique closes its rival the moment it is taken up, and `warnText` is what distinguishes them.
   */
  function askFirst(id: string, act: () => Promise<void>): void {
    const warning = engine.warnText(id);
    if (warning) confirmAction(warning, act, { tone: "commit", detail: carriesText(engine.record(id)) }); else void act();
  }
  /** What a commitment brings with it, read off its own detail blocks: the stats it holds and the route keys it carries, or else what it gives. */
  function carriesText(record: GameRecord): string {
    const detail = engine.tooltip(record.id), keys = keyNames(record);
    const held = blockLines(detail, "mod").filter(line => line.endsWith("while attuned"));
    if (held.length || keys.length) {
      return `${[held.length ? `Holds ${listText(held)}` : "", keys.length ? `Carries the route ${keys.length === 1 ? "key" : "keys"} ${listText(keys)}` : ""].filter(Boolean).join(" · ")}.`;
    }
    const gives = [...blockLines(detail, "mod"), ...standingsOf(record).map(name => `the standing of ${name}`)];
    return gives.length ? `Brings ${listText(gives)}.` : "";
  }
  /** Taking something down returns nothing and can release a held method; the engine says which, and the player confirms. */
  function takeDown(record: GameRecord): void {
    const name = record.name ?? record.id;
    confirmAction(engine.removeWarning(record.id), () => change(() => {
      const result = engine.remove(record.id);
      announce(result.ok ? `${name} has been taken down.` : result.reason);
    }), { tone: "danger", label: "Take down" });
  }
  ui("export").addEventListener("click", () => { void settingsAction(callbacks.onExport); });
  ui("import").addEventListener("click", () => ui<HTMLInputElement>("file").click());
  ui<HTMLInputElement>("file").addEventListener("change", event => {
    const input = event.currentTarget as HTMLInputElement, file = input.files?.[0];
    input.value = "";
    if (!file) return;
    // A file that cannot be loaded is refused before anyone is asked to replace a journey with it.
    void settingsAction(async () => {
      const state = await callbacks.readImport(file);
      confirmAction("Replace the current journey with this file? Export the current save first if you want to keep it.", () => settingsAction(() => callbacks.onImport(state)), { tone: "danger", label: "Replace" });
    });
  });
  ui("new-game").addEventListener("click", () => confirmAction("Begin again in the hayloft? This replaces the current save. An exported save can be imported later.", () => settingsAction(callbacks.onNewGame), { tone: "danger", label: "Begin again" }));
  function closeConfirmation(): void { pendingConfirmation = null; const dialog = ui<HTMLDialogElement>("confirmation"); if (dialog.open) dialog.close(); }
  ui("cancel").addEventListener("click", () => { closeConfirmation(); confirmationTrigger?.focus(); });
  ui("confirm").addEventListener("click", () => {
    const action = pendingConfirmation; closeConfirmation();
    if (action) void Promise.resolve(action()).then(() => confirmationTrigger?.focus());
  });
  // Escape on a modal dialog is a cancel, and must leave the game exactly as it was.
  ui("confirmation").addEventListener("cancel", event => { event.preventDefault(); ui("cancel").click(); });
  ui("accelerate").addEventListener("click", () => {
    void change(() => { const result = engine.setAccelerating(!engine.state.bank.accelerating); if (!result.ok) announce(result.reason); });
  });
  ui("stop").addEventListener("click", () => { void change(() => { const result = engine.stop(); if (!result.ok) announce(result.reason); }); });
  ui("return-dismiss").addEventListener("click", () => { ui("return").hidden = true; root.querySelector<HTMLElement>("#activities")?.focus(); });
  ui("journal-filter").addEventListener("change", () => render());
  const unpinTips = (keep?: Element | null): void => {
    for (const tip of root.querySelectorAll<HTMLElement>(".task-tip.is-pinned")) {
      const cell = tip.parentElement!;
      if (keep && cell.contains(keep)) continue;
      tip.classList.remove("is-pinned");
      cell.querySelector(".task-info")?.setAttribute("aria-expanded", "false");
    }
  };
  root.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      unpinTips();
      if (pendingConfirmation) ui("cancel").click();
      if (filterResource) { filterResource = null; render(); }
    }
  });
  document.addEventListener("pointerdown", event => unpinTips(event.target instanceof Element ? event.target : null));
  const bankMeter = meter(), activeMeter = meter("active-meter");
  ui("bank-meter").append(bankMeter.root); ui("active-meter").append(activeMeter.root);
  let seenIds = new Set(engine.state.visibleIds);
  let filterResource: string | null = null;
  /** Whether the waiting list is shown: once there is a second sustained pursuit to hand the slot to, or something already waits. */
  let queueing = false;
  /** Records the Now panel's next step points at; their cards carry a Next mark. */
  let nextIds = new Set<string>();
  const tabViews = new Map<Tab, { button: HTMLButtonElement; count: HTMLSpanElement; badge: HTMLSpanElement; panel: HTMLDivElement }>();
  function markTabSeen(id: Tab): void {
    for (const cell of cells) if (cell.tab === id && engine.visible(cell.record.id)) seenIds.add(cell.record.id);
    for (const record of engine.records) {
      if (!engine.visible(record.id)) continue;
      if ((id === "character" && record.kind === "lead") || (id === "tasks" && record.breakthrough)) seenIds.add(record.id);
    }
  }
  /** Tabs that appeared during this visit and have not been opened since. */
  const unseenTabs = new Set<Tab>(), tabShown = new Map<Tab, boolean>();
  function selectTab(id: Tab, focus = false): void {
    selectedTab = id; markTabSeen(id); unseenTabs.delete(id); render();
    if (focus) tabViews.get(id)?.button.focus();
  }
  for (const tab of tabs) {
    const button = element("button", "activity-tab", tab.name);
    button.type = "button"; button.dataset.tab = tab.id; button.id = `tab-${tab.id}`;
    button.setAttribute("role", "tab"); button.setAttribute("aria-controls", `view-${tab.id}`);
    const count = element("span", "tab-count"); count.setAttribute("aria-hidden", "true");
    const badge = element("span", "tab-new", "New"); badge.hidden = true;
    button.append(count, badge);
    button.addEventListener("click", () => selectTab(tab.id));
    button.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const visible = tabs.filter(candidate => !tabViews.get(candidate.id)!.button.hidden);
      const index = visible.findIndex(candidate => candidate.id === tab.id);
      const next = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + visible.length) % visible.length;
      selectTab(visible[next]!.id, true);
    });
    const panel = element("div", "tab-panel"); panel.id = `view-${tab.id}`;
    panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", button.id);
    ui("tabs").append(button); ui("tab-panels").append(panel); tabViews.set(tab.id, { button, count, badge, panel });
  }
  const tasksPanel = tabViews.get("tasks")!.panel, techniquesPanel = tabViews.get("techniques")!.panel;
  const homePanel = tabViews.get("home")!.panel, characterPanel = tabViews.get("character")!.panel, craftPanel = tabViews.get("craft")!.panel;
  /** The Fight view: both sides with Life and readiness, the odds while it runs, and the blow-by-blow. */
  function fightSide(className: string) {
    const root = element("section", `fight-side ${className}`), name = element("h3", "fight-name");
    const lifeText = element("p", "fight-meter-label numeric"), life = meter("life-meter");
    const gaugeText = element("p", "fight-meter-label"), gauge = meter("gauge-meter");
    const stats = element("p", "fight-stats numeric"), odds = element("p", "fight-odds");
    root.append(name, lifeText, life.root, gaugeText, gauge.root, stats, odds);
    return { root, name, lifeText, life, gaugeText, gauge, stats, odds };
  }
  const fightView = element("section", "fight-pane");
  const fightTitle = element("h2", "fight-title"), fightStatus = element("p", "fight-status");
  const fightSides = element("div", "fight-sides"), fightYou = fightSide("is-you"), fightFoe = fightSide("is-foe");
  const fightSummary = element("p", "fight-summary"), fightLog = element("ol", "fight-log");
  fightLog.setAttribute("aria-live", "polite"); fightLog.setAttribute("aria-label", "Blow by blow");
  fightSides.append(fightYou.root, fightFoe.root);
  fightView.append(fightTitle, fightStatus, fightSides, fightSummary, fightLog);
  tabViews.get("fight")!.panel.append(fightView);
  let wasFighting = false;
  const now = element("section", "now-panel"); now.dataset.ui = "now";
  const nowTitle = element("h2"), nowText = element("p", "now-text"), nowNext = element("p", "now-next");
  now.append(element("span", "now-kicker", "Now"), nowTitle, nowText, nowNext);
  tasksPanel.append(now);
  /** A screen's heading row, as Arcanum's Home reads "Floor Space: 128 / 387": title and note, then a held / max count with a pip per unit. */
  function viewHead(panel: HTMLElement, title: string, note: string, gaugeLabel: string, gaugeKey: string) {
    const head = element("div", "view-intro view-head"), text = element("div", "view-head-text"), heading = element("h2", "", title);
    const gauge = element("div", "view-gauge"), count = element("p", "view-gauge-text"), value = element("strong", "numeric"), pips = element("div", "gauge-pips");
    count.dataset.ui = gaugeKey; count.append(`${gaugeLabel} `, value); pips.setAttribute("aria-hidden", "true");
    text.append(heading, element("p", "", note)); gauge.append(count, pips); head.append(text, gauge); panel.append(head);
    return { heading, gauge, value, pips };
  }
  const techniqueHead = viewHead(techniquesPanel, "Techniques", "What the method can do on command. Only an attuned technique is ready to use; attunement holds it in mind, and there is room for only so many.", "Attuned", "attune-count");
  const homeHead = viewHead(homePanel, "", "Installed arrangements move with you; those you take down are not refunded.", "Floor spans", "home-floor");
  const craftIntro = element("div", "view-intro");
  craftIntro.append(element("h2", "", "Craft"), element("p", "", "What the workbench turns materials into. A recipe holds the activity slot while it runs and stops when what it makes is kept; a preparation is taken on the instant. What you have made is listed under Preparations on the left."));
  craftPanel.append(craftIntro);
  const places = element("section", "places"); places.dataset.ui = "places";
  const placeList = element("ul", "place-list");
  places.append(element("h3", "", "Places"), placeList); homePanel.append(places);
  let placeKey = "";
  const statusList = ui("status-list");
  /** The home's places, twice: as rows with Take down on Home, and one line each in the Character panel. */
  function renderPlaces(): void {
    const slots = engine.homeSlots(), key = slots.join(",");
    if (key !== placeKey) {
      placeKey = key;
      placeList.replaceChildren(...slots.map(slot => {
        const row = element("li", "place-row"); row.dataset.slot = slot;
        const take = element("button", "text-button", "Take down"); take.type = "button"; take.dataset.action = "remove";
        take.addEventListener("click", () => {
          const holder = engine.slotHolder(slot);
          if (holder) takeDown(holder);
        });
        row.append(element("span", "place-name", slot), element("span", "place-holder"), take);
        return row;
      }));
      for (const row of statusList.querySelectorAll(".status-place")) row.remove();
      statusList.append(...slots.map(slot => {
        const row = element("div", "status-place"); row.dataset.slot = slot;
        row.append(element("dt", "", placeName(slot)), element("dd"));
        return row;
      }));
    }
    places.hidden = slots.length === 0;
    for (const row of placeList.children) {
      const holder = engine.slotHolder((row as HTMLElement).dataset.slot!);
      setText(row.querySelector<HTMLElement>(".place-holder")!, holder?.name ?? "empty");
      row.classList.toggle("is-empty", !holder);
      row.querySelector<HTMLButtonElement>("button")!.hidden = !holder;
    }
    for (const row of statusList.querySelectorAll<HTMLElement>(".status-place")) {
      const holder = engine.slotHolder(row.dataset.slot!);
      setText(row.querySelector("dd")!, holder?.name ?? "empty"); row.classList.toggle("is-empty", !holder);
    }
  }
  /**
   * The one detail template. Every record, resource and family renders the ordered blocks the engine
   * supplies; the UI holds no per-kind wording of its own.
   */
  function blockList(className: string) {
    const root = element("div", className);
    let key = "";
    const update = (blocks: TooltipBlock[]): void => {
      const next = blocks.map(block => `${block.kind}\u0000${block.label ?? ""}\u0000${block.lines.join("\u0001")}`).join("\u0002");
      if (next !== key) {
        key = next;
        root.replaceChildren(...blocks.map(block => {
          const node = element("div", `tip-block tip-${block.kind}${block.label ? "" : " is-plain"}`);
          if (block.label) node.append(element("span", "tip-label", block.label));
          const lines = element("div", "tip-lines");
          lines.append(...block.lines.map(line => element("span", "tip-line", line)));
          node.append(lines);
          return node;
        }));
      }
      root.hidden = blocks.length === 0;
    };
    return { root, update };
  }
  /** Every line of one kind of block; `cost` appears twice, as the entry bill and the per-second one. */
  function blockLines(blocks: TooltipBlock[], ...kinds: TooltipBlockKind[]): string[] {
    return blocks.filter(block => kinds.includes(block.kind)).flatMap(block => block.lines);
  }
  /**
   * The card face, from the same blocks: one line the player can read at a glance. A chore's bill and its
   * headline payout fit; the thresholds and side effects behind it are counted, not spelled out, since the
   * line is clipped at the edge of the button and the tooltip is one hover away. A fight leads with its
   * verdict, the one thing on its face that decides whether to start it.
   */
  function cardSummary(record: GameRecord, blocks: TooltipBlock[], mode: Mode): string {
    if (mode === "timed") return [record.encounter ? engine.fight(record.id).verdictText : "", ...blockLines(blocks, "time", "cost")].filter(Boolean).join(" · ");
    const cost = blockLines(blocks, "cost").join(" · ");
    const payoff = mode === "continuous" ? blockLines(blocks, "effect") : [...blockLines(blocks, "result"), ...blockLines(blocks, "mod")];
    const headline = payoff.length > 1 ? `${payoff[0]} +${payoff.length - 1} more` : payoff[0] ?? "";
    if (mode === "continuous") return [headline, cost].filter(Boolean).join(" · ");
    return cost && headline ? `${cost} → ${headline}` : cost || headline;
  }
  /** A held boost that would speed this record's next run. */
  function carried(record: GameRecord): boolean {
    return Boolean(record.boost && current(record.boost.flag) > 0);
  }
  function objectiveText(objective: Objective): string {
    if (objective.kind === "repetitions") return `${number(objective.target)} total ${objective.target === 1 ? "completion" : "completions"}`;
    if (objective.kind === "level") return `${label(objective.id)} level ${number(objective.target)}`;
    // A sustained filler runs to the brim, which reads better than the number it happens to stop at.
    if (objective.target + 1e-9 >= engine.stat(objective.id).max) return `${label(objective.id)} full`;
    return `${number(objective.target)} ${label(objective.id).toLowerCase()} held`;
  }
  function activityProgress(record: GameRecord): { text: string; value: number; max: number } {
    const active = engine.state.active!;
    if (active.objective.kind === "resource") {
      const stat = engine.stat(active.objective.id);
      return { text: `${held(stat.value)} / ${number(active.objective.target)} ${label(active.objective.id)} held`, value: stat.value, max: active.objective.target };
    }
    if (record.length === "continuous" && record.train) {
      const family = engine.stat(record.train), max = 60 * (family.value + 1);
      return { text: `${number(family.exp)} / ${max} XP · ${label(record.train)} ${family.value + 1}`, value: family.exp, max };
    }
    if (record.length === "continuous") {
      const period = Number(Object.keys(record.every ?? {})[0] ?? 0);
      if (period > 0) {
        const progress = engine.stat(record.id).ticks % period;
        return { text: `${number(progress)} / ${period}s toward pulse · ${duration(active.progress)} elapsed`, value: progress, max: period };
      }
      return { text: `${duration(active.progress)} elapsed`, value: 1, max: 1 };
    }
    const length = engine.stat(record.id).length;
    // Same clock as the card and tooltip: real seconds at the current completion rate, not units of work.
    return { text: `${duration(realSeconds(record, active.progress))} / ${duration(realSeconds(record, length))} this completion`, value: active.progress, max: length };
  }
  /** The Fight tab shows the fight under way, or the last one until the player starts something else; it opens itself when a fight begins. */
  function renderFight(): void {
    const fight = engine.state.fight, record = fight ? engine.records.find(candidate => candidate.id === fight.id) : undefined;
    const fighting = engine.fighting();
    if (fighting && !wasFighting) { selectedTab = "fight"; markTabSeen("fight"); }
    wasFighting = fighting;
    tabViews.get("fight")!.button.hidden = !fight || !record?.encounter;
    if (!fight || !record?.encounter) { if (selectedTab === "fight") selectedTab = "tasks"; return; }
    const { foe } = record.encounter, Foe = `${foe.name.charAt(0).toUpperCase()}${foe.name.slice(1)}`, lifeName = label("life");
    const limit = engine.stat(record.id).length, life = engine.stat("life");
    setText(fightTitle, label(record.id));
    setText(fightStatus, !fight.result ? `Fighting ${foe.name} · ${duration(fight.seconds)} of ${duration(limit)}`
      : fight.result === "won" ? `${Foe} falls after ${duration(fight.seconds)}.`
        : fight.result === "life" ? `Lost after ${duration(fight.seconds)}: your ${lifeName} ran out.` : `Lost: ${foe.name} outlasted the ${duration(limit)}.`);
    fightView.classList.toggle("is-won", fight.result === "won");
    fightView.classList.toggle("is-lost", fight.result !== undefined && fight.result !== "won");
    const lifeNow = Math.floor(life.value + 1e-9);
    setText(fightYou.name, "You");
    setText(fightYou.lifeText, `${lifeName} ${lifeNow} / ${number(life.max)}`); fightYou.life.update(lifeNow, life.max);
    fightYou.gauge.update(fight.result ? 0 : fight.yourGauge, GAUGE);
    setText(fightFoe.name, Foe);
    setText(fightFoe.lifeText, `Life ${fight.foeLife} / ${foe.life}`); fightFoe.life.update(fight.foeLife, foe.life);
    fightFoe.gauge.update(fight.result ? 0 : fight.foeGauge, GAUGE);
    for (const [view, side] of [[fightYou, fight.you], [fightFoe, foe]] as const) {
      setText(view.gaugeText, `Readiness · swings every ${number(Math.round(GAUGE / side.speed * 10) / 10)} s`);
      setText(view.stats, `Strike ${side.strike} · Guard ${side.guard} · Speed ${number(side.speed)} · Hit ${number(side.hit)}% · Dodge ${number(side.dodge)}%`);
    }
    if (foe.technique) {
      const ordinal = ({ 2: "second", 3: "third", 4: "fourth", 5: "fifth" } as Record<number, string>)[foe.technique.every] ?? `${foe.technique.every}th`;
      setText(fightFoe.stats, `${fightFoe.stats.textContent} · every ${ordinal} swing: ${foe.technique.name}, Strike ${foe.technique.strike}`);
    }
    const projection = fight.result ? undefined : engine.fight(record.id);
    setText(fightYou.odds, projection ? `Your swings land ${Math.round(projection.yourChance * 100)}% for ${projection.yourDamage}.` : `Landed ${fight.landed} of ${fight.swings} swings.`);
    setText(fightFoe.odds, projection ? `Theirs land ${Math.round(projection.foeChance * 100)}% for ${projection.foeDamage}.` : `Landed ${fight.foeLanded} of ${fight.foeSwings} swings.`);
    setText(fightSummary, projection ? `${projection.verdictText} · you have landed ${fight.landed} of ${fight.swings}, ${foe.name} ${fight.foeLanded} of ${fight.foeSwings}.`
      : fight.result === "won" ? "The fight is yours." : record.encounter.failureText.charAt(0).toUpperCase() + record.encounter.failureText.slice(1));
    const grew = fightLog.children.length !== fight.lines.length;
    while (fightLog.children.length > fight.lines.length) fightLog.lastElementChild!.remove();
    fight.lines.forEach((line, index) => setText((fightLog.children[index] as HTMLElement | undefined) ?? fightLog.appendChild(element("li")), line));
    if (grew) fightLog.scrollTop = fightLog.scrollHeight;
  }
  /** One tooltip shape for action cells and ledger rows: hover, focus or a pinned touch toggle. */
  function attachTip(host: HTMLElement, id: string): HTMLDivElement {
    const tip = element("div", "task-tip");
    tip.id = id; tip.setAttribute("role", "tooltip");
    host.classList.add("has-tip"); host.append(tip);
    return tip;
  }

  const closedGroups = readClosedGroups();
  interface GroupView { details: HTMLDetailsElement; count: HTMLSpanElement; grid: HTMLDivElement }
  function makeGroup(id: string, title: string, tab: Tab, open: boolean): GroupView {
    const details = element("details", "task-group");
    details.dataset.group = id; details.open = open;
    const summary = element("summary"), count = element("span", "group-count numeric");
    count.setAttribute("aria-hidden", "true");
    summary.append(element("h3", "", title), count);
    // Home and Techniques read as Arcanum's furniture table and spell list: one row per record, columns aligned down the list.
    const grid = element("div", tab === "home" || tab === "techniques" ? "task-grid task-rows" : "task-grid");
    details.append(summary, grid);
    tabViews.get(tab)!.panel.append(details);
    return { details, count, grid };
  }
  const groupViews = groups.map(definition => {
    // A tab with one group has no use for its header: the screen's own heading already names it, so it stays open.
    const sole = groups.filter(other => other.tab === definition.tab).length === 1;
    const group = makeGroup(definition.id, definition.title, definition.tab, sole || !closedGroups.has(definition.id));
    if (sole) group.details.classList.add("is-sole");
    group.details.addEventListener("toggle", () => {
      if (group.details.open) closedGroups.delete(definition.id); else closedGroups.add(definition.id);
      try { localStorage.setItem(groupsKey, JSON.stringify([...closedGroups])); } catch { /* A preference only. */ }
    });
    const members = engine.records.filter(record => !notActions.has(record.kind) && definition.matches(record))
      .sort((a, b) => sortRank(a) - sortRank(b));
    return { definition, ...group, cells: members.map(record => createCell(record, group.grid, definition.tab)) };
  });
  const cells = groupViews.flatMap(view => view.cells);
  // Owned purchases and completed one-off visits leave the working grid for a closed Done group at the end of their tab.
  const doneGroups = new Map<Tab, GroupView>();
  for (const tab of ["tasks", "home", "craft"] as const) doneGroups.set(tab, makeGroup(`done-${tab}`, "Done", tab, false));
  function doneWith(record: GameRecord, stat: Stat): boolean {
    return (record.kind === "purchase" || record.kind === "site" || record.kind === "class" || record.kind === "teaching" || record.kind === "recipe") && (stat.value >= stat.max || stat.reps >= stat.max);
  }

  function createCell(record: GameRecord, grid: HTMLElement, tab: Tab) {
    const mode = modeOf(record), name = record.name ?? record.id, tipId = `tip-${tab}-${record.id}`;
    const cell = element("div", "task-cell");
    const button = element("button", "task-button");
    button.type = "button"; button.dataset.recordId = record.id; button.dataset.action = "start"; button.dataset.actionMode = mode;
    button.setAttribute("aria-describedby", tipId);
    const sub = element("span", "task-sub"), badge = element("span", "task-badge"), fill = element("span", "task-fill");
    fill.setAttribute("aria-hidden", "true");
    // What a home record takes or gives, read off its fields: the place it fills, the floor it uses, the places it offers.
    const lead = record.slot ? `${record.slot.charAt(0).toUpperCase()}${record.slot.slice(1)} place` : record.space ? `${record.space} ${record.space === 1 ? "span" : "spans"}`
      : record.slots ? `${record.slots.length} places` : "";
    button.append(element("span", "task-name", name), ...(lead ? [element("span", "task-lead", lead)] : []), sub, badge, fill);
    button.classList.toggle("has-lead", Boolean(lead)); button.classList.toggle("is-fight", Boolean(record.encounter));
    const info = element("button", "task-info", "i");
    info.type = "button"; info.setAttribute("aria-label", `Details for ${name}`); info.setAttribute("aria-controls", tipId); info.setAttribute("aria-expanded", "false");
    cell.append(button, info); grid.append(cell);
    let queue: HTMLButtonElement | undefined;
    if (mode !== "instant" && !record.stance) {
      queue = element("button", "task-queue", "Queue");
      queue.type = "button"; queue.dataset.action = "queue"; queue.dataset.queueId = record.id;
      queue.setAttribute("aria-label", `Queue ${name}`);
      queue.addEventListener("click", () => { void change(() => { const result = engine.queue(record.id); announce(result.ok ? `${name} is waiting.` : result.reason); }); });
      cell.append(queue);
    }
    let hobby: HTMLButtonElement | undefined;
    if (record.hobby) {
      hobby = element("button", "task-hobby", "Hobby");
      hobby.type = "button"; hobby.dataset.action = "hobby"; hobby.dataset.hobbyId = record.id; hobby.hidden = true;
      hobby.setAttribute("aria-label", `Run ${name} as the hobby`);
      hobby.addEventListener("click", () => { void change(() => { const result = engine.startHobby(record.id); announce(result.ok ? `${name} is the hobby now, at half pace.` : result.reason); }); });
      cell.insertBefore(hobby, info);
    }
    let attune: HTMLButtonElement | undefined;
    if (record.attune) {
      attune = element("button", "task-attune");
      attune.type = "button"; attune.dataset.action = "attune"; attune.dataset.attuneId = record.id;
      attune.addEventListener("click", () => {
        if (engine.isAttuned(record.id)) {
          void change(() => { const result = engine.unattune(record.id); announce(result.ok ? `${name} is set aside.` : result.reason); });
          return;
        }
        askFirst(record.id, () => change(() => {
          const result = engine.attune(record.id);
          announce(result.ok ? `${name} is attuned.` : result.reason);
        }));
      });
      cell.insertBefore(attune, info);
    }
    const tip = attachTip(cell, tipId); tip.dataset.recordDetails = record.id;
    const modeLine = element("p", "tip-mode"); tip.append(modeLine);
    const blocks = blockList("tip-blocks"); tip.append(blocks.root);
    const keys = keyNames(record);
    if (keys.length) tip.append(element("p", "tip-keys", `Route keys: ${keys.join(", ")}`));
    const countLine = element("p", "tip-count"); tip.append(countLine);
    let remove: HTMLButtonElement | undefined;
    if (engine.removable(record)) {
      remove = element("button", "tip-remove", "Take down (no refund)");
      remove.type = "button"; remove.dataset.action = "remove"; tip.append(remove);
      remove.addEventListener("click", () => takeDown(record));
    }
    const pin = (pinned: boolean) => {
      if (pinned) unpinTips();
      tip.classList.toggle("is-pinned", pinned); info.setAttribute("aria-expanded", String(pinned));
    };
    const see = () => {
      if (!seenIds.has(record.id)) {
        seenIds.add(record.id);
        render();
      }
    };
    info.addEventListener("click", () => { see(); pin(!tip.classList.contains("is-pinned")); });
    cell.addEventListener("pointerenter", event => { if (event.pointerType === "mouse") see(); });
    cell.addEventListener("pointerleave", event => { if (event.pointerType === "mouse") pin(false); });
    button.addEventListener("focus", see);
    const begin = () => change(() => {
      const result = engine.start(record.id);
      if (!result.ok) announce(result.reason);
      else if (mode === "instant") pulse(button, "flash", 320);
    }).then(() => {
      // A one-shot that just completed is disabled or moved to Done; keyboard focus continues in its group.
      if (document.activeElement !== document.body) return;
      const selector = ".task-cell:not([hidden]) .task-button:not(:disabled)", view = tabViews.get(tab)!;
      const next = grid.querySelector<HTMLElement>(selector) ?? view.panel.querySelector<HTMLElement>(selector) ?? view.button;
      next?.focus();
    });
    button.addEventListener("click", event => {
      see();
      if (record.stance) {
        void change(() => {
          const result = engine.state.stance === record.id ? engine.dropStance() : engine.takeStance(record.id);
          announce(result.ok ? (engine.state.stance === record.id ? `${name} is taken.` : `${name} is dropped.`) : result.reason);
        });
        return;
      }
      if (queue && event.shiftKey) { queue.click(); return; }
      if (engine.state.active?.id === record.id) { if (!record.autoStart) void change(() => { const result = engine.stop(); if (!result.ok) announce(result.reason); }); return; }
      const available = engine.availability(record.id);
      if (!available.ok) {
        // Mouse hover and keyboard focus already show the reason; only touch needs the tip held open.
        const pointer = (event as PointerEvent).pointerType;
        if (pointer === "touch" || pointer === "pen") pin(true);
        announce(available.reason); return;
      }
      askFirst(record.id, begin);
    });
    /** Instant gains that would spill over a full resource. */
    function wasteText(stat: Stat): string {
      if (mode !== "instant") return "";
      for (const [path, raw] of Object.entries(record.result ?? {})) {
        if (path.includes(".") || engine.record(path).kind !== "resource") continue;
        const target = engine.stat(path), waste = target.value + engine.value(raw) + stat.yield - target.max;
        if (waste > 1e-9) return `Wastes ${number(waste)} ${label(path)}`;
      }
      return "";
    }
    const ownedText = mode !== "instant" ? "Done" : record.kind === "home" ? "Current home" : record.kind === "arrangement" ? "Installed" : "Owned";
    const modeText = mode === "timed" ? "Timed · takes the activity slot until done" : mode === "continuous" ? "Continuous · takes the activity slot until its objective"
      : record.cost && "vigor" in record.cost ? "Instant chore · spends Vigor" : "Instant · leaves the activity running";
    /** Redraws the cell and says what the tab counts: whether it carries a New or Next mark, and whether it matches the ledger filter. */
    function update(): { marked: boolean; match: boolean } {
      const unshown = { marked: false, match: false };
      const visible = engine.visible(record.id);
      cell.hidden = !visible; if (!visible) return unshown;
      const stat = engine.stat(record.id), running = engine.state.active?.id === record.id, availability = engine.availability(record.id);
      const owned = !running && (stat.value >= stat.max || stat.reps >= stat.max), locked = !running && !owned && !availability.ok;
      // A wall (limited until something raises the cap) leaves the grid entirely; a missing requirement stays and says so.
      // Self-starting fillers like Rest, and the spellbook's own pages, are controls and never leave.
      if (locked && !record.autoStart && record.kind !== "technique" && engine.atLimitWall(record)) { cell.hidden = true; return unshown; }
      // A queued pursuit lives in the Waiting list; its grid cell is a dead duplicate.
      if (!running && engine.state.waiting.some(entry => entry.id === record.id)) { cell.hidden = true; return unshown; }
      // Next points at a step the player can take: not one whose own requirement is unmet, and not a
      // commitment that closes a door, which is the player's to choose rather than the guide's.
      const steerable = !(record.warn && record.lock?.length) && (!record.need || engine.condition(record.need));
      const resume = !running && stat.paid, waste = !locked && !owned ? wasteText(stat) : "", isNext = nextIds.has(record.id) && !owned && !running && steerable;
      const place = engine.state.waiting.findIndex(entry => entry.id === record.id) + 1;
      if (queue) queue.hidden = !queueing || running || owned || place > 0 || Boolean(record.autoStart);
      const isNew = !seenIds.has(record.id) && !owned && !running && record.id !== "rest" && !isNext;
      const use = filterResource ? resourceUse(record, filterResource) : { gives: false, spends: false };
      const mark = running || owned ? "" : use.gives && use.spends ? "Gives · spends" : use.gives ? "Gives" : use.spends ? "Spends" : "";
      const home = (doneWith(record, stat) ? doneGroups.get(tab)?.grid : undefined) ?? grid;
      if (cell.parentElement !== home) home.append(cell);
      const detail = engine.tooltip(record.id);
      if (attune) {
        const held = engine.isAttuned(record.id);
        cell.classList.toggle("is-attuned", held);
        setText(attune, held ? "Unattune" : "Attune");
        attune.setAttribute("aria-pressed", String(held));
        attune.setAttribute("aria-label", `${held ? "Unattune" : "Attune"} ${name}`);
      }
      if (record.stance) {
        // A stance is held, not spent: the card is a toggle, Take or Taken, and never a run.
        const taken = engine.state.stance === record.id;
        cell.classList.toggle("is-attuned", taken);
        setText(sub, taken ? "Taken: its numbers stand until another stance replaces it." : "Take it before a fight; the one stance taken replaces any other.");
        button.classList.toggle("is-running", false); button.classList.toggle("is-owned", false); button.classList.toggle("is-locked", locked); button.classList.toggle("is-runnable", !locked);
        button.disabled = false; button.setAttribute("aria-pressed", String(taken));
        setText(badge, taken ? "Taken" : locked ? "" : isNew ? "New" : ""); badge.hidden = !badge.textContent;
        setText(modeLine, "Stance · held, not spent"); blocks.update(detail); countLine.hidden = true;
        return { marked: isNew, match: false };
      }
      if (hobby) {
        const asHobby = engine.state.hobby === record.id;
        hobby.hidden = running || owned || !engine.has("hobby_slots") || engine.stat("hobby_slots").max < 1;
        setText(hobby, asHobby ? "Hobby · running" : "Hobby");
        hobby.disabled = asHobby;
        hobby.setAttribute("aria-pressed", String(asHobby));
        cell.classList.toggle("is-hobby", asHobby); cell.classList.toggle("has-hobby", !hobby.hidden);
      }
      button.classList.toggle("is-running", running); button.classList.toggle("is-owned", owned);
      button.classList.toggle("is-locked", locked); button.classList.toggle("is-runnable", !running && !owned && !locked);
      button.classList.toggle("is-capped", Boolean(waste)); button.classList.toggle("is-new", isNew);
      button.classList.toggle("is-resource-match", use.gives || use.spends); button.classList.toggle("is-gives", use.gives); button.classList.toggle("is-spends", use.spends);
      button.classList.toggle("is-next", isNext); button.classList.toggle("is-marked", Boolean(mark));
      button.disabled = owned;
      if (locked) button.setAttribute("aria-disabled", "true"); else button.removeAttribute("aria-disabled");
      if (mode !== "instant") button.setAttribute("aria-pressed", String(running));
      setText(sub, locked ? availability.reason : cardSummary(record, detail, mode));
      // While the ledger filter is on, its mark is what the player is scanning for; it gives way only to the slot's own state.
      setText(badge, running ? "Running" : owned ? ownedText : mark || (place ? `Waiting #${place}` : resume ? `Resume · ${clock(realSeconds(record, stat.length - stat.exp))} left` : waste || (isNext ? "Next" : isNew ? "New" : "")));
      badge.hidden = !badge.textContent;
      const progress = running ? activityProgress(record) : resume ? { value: stat.exp, max: stat.length } : { value: 0, max: 1 };
      fill.style.width = `${progress.max > 0 ? Math.min(100, progress.value / progress.max * 100) : 0}%`;
      setText(modeLine, queueing && mode !== "instant" ? `${modeText} · Shift-click to queue` : modeText);
      blocks.update(detail);
      setText(countLine, `Completed ${number(stat.reps)} ${stat.reps === 1 ? "time" : "times"}`); countLine.hidden = record.max === 1 || mode === "continuous";
      if (remove) remove.hidden = stat.value < 1;
      cell.classList.toggle("tip-flip", cell.offsetLeft + 300 > home.clientWidth);
      return { marked: isNext || isNew, match: Boolean(mark) };
    }
    return { record, cell, tab, update };
  }

  const ledgerRows = engine.records.filter(record => record.kind === "resource" && (record.group === "Resources" || record.group === "Preparations")).map(record => {
    const body = bodyIds.includes(record.id), preparation = record.group === "Preparations";
    const row = element("div", body ? "resource-row body-row" : "resource-row"); row.dataset.resource = record.id;
    const heading = element("div", "resource-heading"), amount = element("span", "resource-value numeric");
    heading.append(element("span", "resource-name", record.name ?? record.id), amount);
    const bar = meter(body ? `${record.id}-meter` : ""), note = element("p", "resource-rate");
    row.tabIndex = 0; row.setAttribute("role", "button"); row.setAttribute("aria-pressed", "false");
    row.setAttribute("aria-label", `${record.name ?? record.id}: mark the actions that give or spend it`); row.setAttribute("aria-describedby", `ledger-tip-${record.id}`);
    row.append(heading, bar.root);
    if (body) row.append(note);
    const tip = attachTip(row, `ledger-tip-${record.id}`), detail = blockList("tip-blocks"), tipFlow = element("p", "tip-flow");
    tip.append(detail.root, tipFlow, element("p", "tip-count", `Select to mark every action that gives or spends ${record.name ?? record.id}, with a count on each tab; select again or press Escape to clear.`));
    row.addEventListener("click", () => {
      filterResource = filterResource === record.id ? null : record.id;
      render();
    });
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        filterResource = filterResource === record.id ? null : record.id;
        render();
      }
    });
    ui(preparation ? "preparations" : body ? "body" : record.id === "coin" ? "currency" : "materials").append(row);
    return { record, body, preparation, row, amount, bar, note, detail, tipFlow };
  });
  const familyRows = engine.records.filter(record => record.kind === "family").map(record => {
    const row = element("div", "family-row"); row.dataset.family = record.id;
    const heading = element("div", "family-heading"), amount = element("span", "family-value numeric");
    heading.append(element("span", "family-name", record.name ?? record.id), amount);
    const pips = element("div", "family-pips"); pips.setAttribute("aria-hidden", "true");
    const exp = element("p", "family-exp");
    row.tabIndex = 0; row.setAttribute("role", "button");
    row.setAttribute("aria-label", `${record.name ?? record.id}: open on Character`); row.setAttribute("aria-describedby", `ledger-tip-${record.id}`);
    row.append(heading, pips, exp);
    row.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectTab("character"); } });
    const tip = attachTip(row, `ledger-tip-${record.id}`), detail = blockList("tip-blocks");
    tip.append(detail.root);
    // Knowledge is explained in full beside the practice that raises it, on Character.
    row.addEventListener("click", () => selectTab("character"));
    ui("families").append(row);
    return { record, row, amount, pips, exp, detail };
  });

  characterPanel.innerHTML = `<div class="view-intro"><h2 data-ui="character-title">A life in Lowbridge</h2><p data-ui="scene-description"></p></div><div class="character-facts"><dl><div><dt>Stage</dt><dd data-ui="character-stage-detail"></dd></div><div><dt>Activity</dt><dd data-ui="character-time"></dd></div></dl></div><section class="character-methods" data-ui="character-methods" hidden><div class="section-heading"><h3>Cultivation</h3><span>What each knowledge gives, and the practice that raises it</span></div><div data-ui="family-explanations"></div></section><details class="slip" data-ui="slip" hidden><summary data-ui="slip-summary">The Cracked Jade Slip · leaves 1, 2, 8</summary><blockquote><p><em>Lesser Breath-Gathering Method.</em> “Sit as water sits. Draw the breath past the throat and let it pool below the navel. Feel for what is not air.”</p><p>Leaf 8: “…when the pooled breath turns, do not follow it. Wait at the turning. The rest is…” The remaining characters are chipped away.</p><p class="slip-rebuilt" data-ui="slip-rebuilt" hidden></p></blockquote></details><section class="foundation-record" data-ui="completion-detail" tabindex="-1" hidden><div class="section-heading"><h3 data-ui="completion-heading">Beyond Foundation</h3><span data-ui="completion-stage">The ridge lies ahead</span></div><div class="completion-copy"><p data-ui="completion-lead"></p><p class="completion-note" data-ui="completion-note"></p></div><ul class="lead-list" data-ui="leads"></ul></section>`;
  /** Route keys in words: what the held methods are made of, which later teachings ask about (ADR 0024). */
  const keySection = element("section", "route-keys"); keySection.dataset.ui = "route-keys"; keySection.hidden = true;
  const keyHeading = element("div", "section-heading"), keyList = element("ul", "lead-list");
  keyHeading.append(element("h3", "", "Route keys"), element("span", "", "What your methods are made of; later teachings ask for these"));
  keySection.append(keyHeading, keyList); ui("character-methods").insertAdjacentElement("afterend", keySection);
  const keyItems = Object.entries(routeKeys).map(([tag, key]) => {
    const item = element("li"), carriers = element("p");
    item.append(element("h4", "", key.name), element("p", "", key.desc), carriers); keyList.append(item);
    return { tag, item, carriers };
  });
  /** A knowledge and the practice that raises it, together: the mechanical half of cultivation. */
  const familyExplanations = engine.records.filter(record => record.kind === "family").map(record => {
    const row = element("article", "family-explanation"), heading = element("h4"), detail = blockList("knowledge-block");
    const headingLevel = element("span", "family-explanation-level numeric");
    heading.append(element("span", "", record.name ?? record.id), headingLevel);
    const practice = element("div", "family-practice"), grid = element("div", "task-grid");
    practice.append(element("h5", "", "Practice"), grid);
    row.append(heading, detail.root, practice); ui("family-explanations").append(row);
    const trainers = engine.records.filter(candidate => candidate.length === "continuous" && candidate.train === record.id);
    return { record, row, headingLevel, detail, practice, cells: trainers.map(trainer => createCell(trainer, grid, "character")) };
  });
  cells.push(...familyExplanations.flatMap(view => view.cells));
  const leadItems = engine.records.filter(record => record.kind === "lead").map(record => {
    const item = element("li"), description = element("p"); item.append(element("h4", "", record.name ?? record.id), description); ui("leads").append(item);
    return { record, item, description };
  });
  /** One line of a breakthrough's checklist; its text can change as the thing it counts fills. */
  function checklistItem(text: string): ChecklistItem {
    const row = element("li"), check = element("span", "foundation-check"), words = element("span", "", text); check.setAttribute("aria-hidden", "true");
    row.append(check, words);
    return { row, update(ok: boolean, shown = text) { setText(words, shown); row.classList.toggle("complete", ok); setText(check, ok ? "✓" : "○"); row.setAttribute("aria-label", `${ok ? "Met" : "Unmet"}: ${shown}`); } };
  }
  /** The titles a breakthrough has granted, by its result or by the events that read them from what was held. */
  function standingsOf(record: GameRecord): string[] {
    const granted = [...Object.keys(record.result ?? {}), ...(record.events ?? []).flatMap(event => Object.keys(event.changes ?? {}))];
    return [...new Set(granted)].filter(id => !id.includes(".") && engine.has(id) && engine.record(id).kind === "class" && current(id) > 0).map(id => label(id));
  }
  const breakthroughs = element("div", "breakthrough-list"); breakthroughs.dataset.ui = "breakthroughs";
  groupViews.find(view => view.definition.id === "practice")!.details.insertAdjacentElement("afterend", breakthroughs);
  /** One panel per breakthrough; Foundation's keeps the `foundation-*` hooks the smoke test drives. */
  const journeyRank = (id: string) => { const index = openingContext.breakthroughs.indexOf(id); return index < 0 ? openingContext.breakthroughs.length : index; };
  const breakthroughPanels = engine.records.filter(record => record.breakthrough).sort((a, b) => journeyRank(a.id) - journeyRank(b.id)).map(record => {
    const breakthrough = record.breakthrough!, settlingLabel = record.id === "settling", primary = settlingLabel;
    const panel = element("section", "foundation-panel");
    panel.innerHTML = `<div class="section-heading"><h3 data-part="title"></h3><span class="mode-badge mode-timed">Timed breakthrough</span></div><div class="foundation-body"><div class="foundation-checks"><div><h4>The core</h4><ul class="foundation-list" data-part="core"></ul></div><div><h4 data-part="count"></h4><ul class="foundation-list" data-part="pointers"></ul></div></div><div class="foundation-footer"><div><h4 class="foundation-bill-heading">The bill</h4><ul class="foundation-list foundation-bill" data-part="bill"></ul><p class="card-facts" data-part="time"></p><h4 class="foundation-rewards-heading">On completion</h4><ul class="foundation-rewards" data-part="rewards"></ul><p class="card-requirement" data-part="need"></p></div><button type="button" class="primary-button card-button" data-part="start" data-action="start"></button></div><details class="action-details"><summary>Breakthrough details</summary><p class="card-description" data-part="description"></p></details></div>`;
    const part = <T extends HTMLElement = HTMLElement>(name: string) => {
      const node = panel.querySelector<T>(`[data-part="${name}"]`)!;
      if (primary) node.dataset.ui = `foundation-${name}`;
      return node;
    };
    const parts = { title: part("title"), core: part("core"), count: part("count"), pointers: part("pointers"), bill: part("bill"), time: part("time"), rewards: part("rewards"), need: part("need"), start: part<HTMLButtonElement>("start"), description: part("description") };
    if (primary) panel.dataset.ui = "foundation";
    panel.dataset.recordId = record.id; panel.dataset.actionMode = "timed";
    panel.querySelector("details")!.dataset.recordDetails = record.id;
    setText(parts.title, breakthrough.title ?? record.name ?? record.id);
    setText(parts.description, record.desc ?? "");
    const coreItem = checklistItem(breakthrough.coreLabel ?? "The core method"); parts.core.append(coreItem.row);
    const pointerItems = breakthrough.pointers.map(pointer => { const item = checklistItem(pointer.label); parts.pointers.append(item.row); return { pointer, item }; });
    parts.start.addEventListener("click", () => askFirst(record.id, () => change(() => { engine.start(record.id); })));
    ui("breakthroughs").append(panel);
    let rewardsKey = "", billKey = "", billItems: ChecklistItem[] = [];
    function update(active: ActiveTask | null): void {
      const stat = engine.stat(record.id);
      panel.hidden = !engine.visible(record.id) || stat.value >= stat.max;
      if (panel.hidden) return;
      coreItem.update(engine.condition(breakthrough.core)); let met = 0;
      for (const { pointer, item } of pointerItems) {
        const ok = engine.condition(pointer.when); if (ok) met++;
        const progress = ok ? undefined : engine.pointerProgress(pointer);
        item.update(ok, progress ? `${pointer.label} · ${held(progress.value)} / ${number(progress.target)}` : pointer.label);
      }
      setText(parts.count, `Supporting signs · ${met}/${breakthrough.pointers.length} · ${breakthrough.required} needed`);
      const availability = engine.availability(record.id), running = active?.id === record.id, detail = engine.tooltip(record.id);
      const bill: BillRow[] = engine.billProgress(record.id), key = bill.map(row => row.id).join(",");
      if (key !== billKey) { billKey = key; billItems = bill.map(row => checklistItem(row.label)); parts.bill.replaceChildren(...billItems.map(item => item.row)); }
      // Once paid, the bill is settled for this attempt; what is held now no longer matters to it.
      bill.forEach((row, index) => billItems[index]!.update(stat.paid || row.held >= row.need, stat.paid ? `${row.label} ${number(row.need)} · paid` : `${row.label} ${held(row.held)} / ${number(row.need)}`));
      parts.bill.hidden = bill.length === 0;
      setText(parts.time, blockLines(detail, "time").join(" · "));
      const rewards = blockLines(detail, "mod", "result");
      if (rewards.join("\u0000") !== rewardsKey) { rewardsKey = rewards.join("\u0000"); parts.rewards.replaceChildren(...rewards.map(line => element("li", "", line))); }
      setText(parts.need, availability.reason || record.needtext || ""); parts.need.hidden = availability.ok || running;
      parts.start.disabled = !availability.ok || running;
      const left = `${clock(realSeconds(record, stat.length - stat.exp))} left`;
      setText(parts.start, settlingLabel
        ? running ? "Settling…" : stat.paid ? `Resume settling · ${left}` : "Settle the foundation"
        : running ? "Breaking through…" : stat.paid ? `Resume · ${left}` : "Begin the breakthrough");
    }
    return { record, update };
  });

  // Review opens what the completion changed: Character's section beyond it, not the panel that has just closed.
  ui("review-foundation").addEventListener("click", () => {
    selectTab("character");
    const detail = ui("completion-detail"); detail.scrollIntoView({ block: "start" }); detail.focus();
  });
  ui("locate-active").addEventListener("click", () => {
    const active = engine.state.active; if (!active) return;
    if (engine.fighting()) { selectTab("fight"); return; }
    selectTab(recordTab(engine.record(active.id)));
    const node = root!.querySelector<HTMLElement>(`[data-record-id="${active.id}"]`); node?.scrollIntoView({ block: "nearest" }); node?.focus();
  });

  const objectiveKind = ui<HTMLSelectElement>("objective-kind"), objectiveTarget = ui<HTMLInputElement>("objective-target");
  const objectiveError = ui("objective-error");
  /** Undefined forces a rebuild after the engine is replaced. */
  let editorFor: string | null | undefined;
  function objectiveChoices(record: GameRecord): { value: string; text: string }[] {
    if (record.max === 1) return [];
    const choices: { value: string; text: string }[] = [];
    if (typeof record.length === "number") choices.push({ value: `repetitions:${record.id}`, text: "Total completions" });
    const families = new Set<string>(), resources = new Set<string>();
    if (record.train) families.add(record.train);
    for (const changes of [record.result, record.effect, ...Object.values(record.every ?? {})]) for (const path of Object.keys(changes ?? {})) {
      const [id, field] = path.split("."), output = engine.records.find(candidate => candidate.id === id);
      if (field === "exp" && output?.kind === "family") families.add(id!);
      if (!field && output?.kind === "resource" && output.group === "Resources") resources.add(id!);
    }
    for (const id of families) choices.push({ value: `level:${id}`, text: `${label(id)} level` });
    for (const id of resources) choices.push({ value: `resource:${id}`, text: `${label(id)} held` });
    return choices;
  }
  function prefillTarget(): void {
    const [kind, id] = objectiveKind.value.split(":"), stat = engine.stat(id!);
    const value = kind === "repetitions" ? stat.reps + 1 : kind === "level" ? stat.value + 1 : stat.max;
    objectiveTarget.value = String(value);
    objectiveTarget.step = kind === "resource" ? "any" : "1";
    objectiveTarget.min = String(Math.floor(kind === "repetitions" ? stat.reps : stat.value) + (kind === "resource" ? 0 : 1));
    if (kind === "repetitions") objectiveTarget.removeAttribute("max"); else objectiveTarget.max = String(stat.max);
  }
  function rebuildEditor(): void {
    const active = engine.state.active;
    editorFor = active?.id ?? null;
    setText(objectiveError, "");
    objectiveKind.replaceChildren();
    const choices = active ? objectiveChoices(engine.record(active.id)) : [];
    ui("objective-editor").hidden = choices.length === 0;
    if (!active || !choices.length) return;
    const fallback = engine.defaultObjective(active.id);
    objectiveKind.append(new Option(`Default · ${objectiveText(fallback)}`, ""));
    for (const choice of choices) objectiveKind.append(new Option(choice.text, choice.value));
    const chosen = `${active.objective.kind}:${active.objective.id}`;
    const isDefault = fallback.kind === active.objective.kind && fallback.id === active.objective.id && fallback.target === active.objective.target;
    objectiveKind.value = !isDefault && choices.some(choice => choice.value === chosen) ? chosen : "";
    ui("objective-target-label").hidden = !objectiveKind.value;
    if (objectiveKind.value) { prefillTarget(); objectiveTarget.value = String(active.objective.target); }
  }
  function applyObjective(): void {
    const id = engine.state.active?.id;
    if (!id) return;
    let objective: Objective | undefined;
    if (objectiveKind.value) {
      const [kind, target] = [objectiveKind.value.split(":"), Number(objectiveTarget.value)];
      if (objectiveTarget.value === "" || !Number.isFinite(target)) { setText(objectiveError, "Enter a target."); return; }
      objective = { kind: kind[0] as Objective["kind"], id: kind[1]!, target };
    }
    void change(() => {
      // Settling time first can finish the run; never restart it from the editor.
      if (engine.state.active?.id !== id) return;
      const result = engine.start(id, objective);
      setText(objectiveError, result.ok ? "" : result.reason);
    });
  }
  objectiveKind.addEventListener("change", () => {
    ui("objective-target-label").hidden = !objectiveKind.value;
    if (objectiveKind.value) prefillTarget();
    applyObjective();
  });
  objectiveTarget.addEventListener("input", applyObjective);

  const waitingRows = Array.from({ length: WAITING_MAX }, (_, index) => {
    const row = element("li", "waiting-row"), name = element("span", "waiting-name"), detail = element("span", "waiting-detail");
    const remove = element("button", "text-button", "Remove"); remove.type = "button"; remove.dataset.action = "dequeue";
    remove.addEventListener("click", () => { void change(() => { engine.dequeue(index); }); });
    row.append(name, detail, remove); row.hidden = true; ui("waiting").append(row);
    return { row, name, detail, remove };
  });
  function renderWaiting(): void {
    const waiting = engine.state.waiting;
    waitingRows.forEach((view, index) => {
      const entry = waiting[index]; view.row.hidden = !entry; if (!entry) return;
      const record = engine.record(entry.id), stat = engine.stat(entry.id);
      view.row.dataset.recordId = entry.id;
      setText(view.name, label(entry.id));
      setText(view.detail, [`until ${objectiveText(entry.objective)}`, stat.paid ? `resumes at ${clock(realSeconds(record, stat.exp))} / ${clock(realSeconds(record, stat.length))}` : "",
        engine.availability(entry.id).ok ? "" : engine.availability(entry.id).reason].filter(Boolean).join(" · "));
      view.remove.setAttribute("aria-label", `Remove ${record.name ?? entry.id} from the waiting list`);
    });
    ui("waiting-empty").hidden = waiting.length > 0;
    renderHobby();
    ui("waiting-block").hidden = !queueing;
    const runway = queueing && engine.state.active ? unattendedSeconds() : 0, note = ui("waiting-runway");
    note.hidden = runway < 1;
    if (!note.hidden) setText(note, `Runs ~${duration(runway)} unattended, then time gathers in the bank.`);
  }
  /** The hobby place under the slot: a practice at half pace, with its own Stop. It shows only once the place exists. */
  ui("hobby-stop").addEventListener("click", () => { void change(() => { const result = engine.stopHobby(); if (!result.ok) announce(result.reason); }); });
  function renderHobby(): void {
    const block = ui("hobby"), place = engine.records.some(record => record.id === "hobby_slots") && engine.stat("hobby_slots").max >= 1;
    block.hidden = !place;
    if (!place) return;
    const hobby = engine.state.hobby;
    setText(ui("hobby-name"), hobby ? `Hobby: ${label(hobby)} (half pace)` : "Hobby: none. A marked practice can run here at half pace.");
    ui<HTMLButtonElement>("hobby-stop").hidden = !hobby;
  }
  let runwayKey = "", runwayEnd = 0;
  /**
   * Activity seconds the slot will keep itself busy with nobody here: the engine's own settlement of
   * time away, played on a copy. Measured again when the slot or the list changes, and each minute.
   */
  function unattendedSeconds(): number {
    const state = engine.state;
    const key = JSON.stringify([state.active?.id, state.active?.objective, state.waiting, Math.floor(state.activitySeconds / 60)]);
    if (key !== runwayKey) {
      runwayKey = key;
      const probe = new GameEngine(engine.records, state);
      probe.state.bank.accelerating = false;
      runwayEnd = state.activitySeconds + probe.advance(runwayHorizon).activitySeconds;
    }
    return Math.max(0, runwayEnd - state.activitySeconds);
  }
  let seenDiscovery = 0;
  try { seenDiscovery = Number(localStorage.getItem(seenDiscoveryKey)) || 0; } catch { /* A preference only. */ }
  const noticeKinds = new Set<LogEntry["kind"]>(["discovery", "story"]);
  ui("notice-dismiss").addEventListener("click", () => {
    seenDiscovery = [...engine.state.log].reverse().find(entry => noticeKinds.has(entry.kind))?.id ?? seenDiscovery;
    try { localStorage.setItem(seenDiscoveryKey, String(seenDiscovery)); } catch { /* A preference only. */ }
    render();
  });
  let seenCompletion = "";
  try { seenCompletion = localStorage.getItem(seenCompletionKey) ?? ""; } catch { /* A preference only. */ }
  /** The breakthrough reached most recently, in the journey's order. */
  function latestBreakthrough(): GameRecord | undefined {
    const rank = (id: string) => { const index = openingContext.breakthroughs.indexOf(id); return index < 0 ? -1 : index; };
    return [...breakthroughPanels].sort((a, b) => rank(b.record.id) - rank(a.record.id)).find(view => current(view.record.id) > 0)?.record;
  }
  /** What the completion banner celebrates: Reedmarket, the latest breakthrough, or arriving at the waystation, which ends the ridge. */
  function latestCompletion(): GameRecord | undefined {
    if (current("reedmarket") > 0) return engine.record("reedmarket");
    const reached = latestBreakthrough();
    return current("waystation") > 0 && reached?.id !== "second_direction" ? engine.record("waystation") : reached;
  }
  ui("completion-dismiss").addEventListener("click", () => {
    const latest = latestCompletion();
    if (latest) seenCompletion = latest.id;
    try { localStorage.setItem(seenCompletionKey, seenCompletion); } catch { /* A preference only. */ }
    render();
  });
  let changesKey = "";
  /**
   * The completion banner: a ceremony of its own, never a pause. Foundation lists what it changed; a
   * direction names the standing it gives; the waystation names the road taken and the time it took.
   */
  function renderCompletion(completion: GameRecord): void {
    const reached = latestBreakthrough(), standings = reached ? standingsOf(reached) : [];
    let title: string, text: string, story = "", heading = "", changes: string[] = [], review: string;
    if (completion.id === "waystation") {
      // The crossing's own completion entry dates the arrival; time spent resting there since does not count.
      const crossing = engine.records.find(record => record.result && "waystation" in record.result && engine.stat(record.id).reps > 0);
      const arrived = crossing && engine.state.log.find(entry => entry.kind === "completion" && entry.text.startsWith(`${crossing.name ?? crossing.id}:`));
      title = label("waystation");
      text = [reached?.breakthrough?.title, ...standings, `${duration(arrived?.activitySeconds ?? engine.state.activitySeconds)} of activity`].filter(Boolean).join(" · ");
      story = "A fire, a ledger, and a keeper who asks which way you came up. The road goes on above the waystation.";
      review = "Review the road ahead";
    } else if (completion.id === "settling") {
      title = "Foundation reached";
      text = "The method holds. What was an incomplete reading is now your own.";
      heading = "What Foundation changed"; changes = blockLines(engine.tooltip(completion.id), "mod");
      review = "Review Foundation";
    } else if (completion.id === "reedmarket") {
      title = label("reedmarket");
      text = [engine.title(), `${duration(engine.state.activitySeconds)} of activity`].join(" · ");
      story = "A street of stalls at the basin's edge, and three leaves of the slip somewhere beyond it.";
      review = "Review the road ahead";
    } else {
      const second = completion.id === "second_direction";
      title = `${completion.breakthrough?.title ?? label(completion.id)}${standings.length ? `: ${standings.join(" · ")}` : ""}`;
      text = second ? "The title is read from what you hold. A fifth method can be held, a hobby runs beside the slot, and the terrace above the slide is open."
        : `${completion.breakthrough?.title ?? label(completion.id)}. The direction holds, and the way up to the ridge waystation is open to a held method of its school.`;
      heading = "What the direction changed"; changes = [...blockLines(engine.tooltip(completion.id), "mod"), ...standings.map(name => `The title of ${name}`)];
      review = "Review your path";
    }
    ui("completion").dataset.completion = completion.id;
    setText(ui("completion-title"), title); setText(ui("completion-text"), text);
    setText(ui("completion-story"), story); ui("completion-story").hidden = !story;
    setText(ui("completion-changes-heading"), heading); ui("completion-changes-block").hidden = changes.length === 0;
    if (changes.join("\u0000") !== changesKey) { changesKey = changes.join("\u0000"); ui("completion-changes").replaceChildren(...changes.map(line => element("li", "", line))); }
    setText(ui("review-foundation"), review);
  }

  const logNodes = new Map<number, HTMLLIElement>();
  const previous = new Map<string, number>();
  /** The net change the running activity produces, with the time until the resource is full or empty. */
  function resourceRate(id: string): string {
    const rate = engine.netRate(id), stat = engine.stat(id);
    if (Math.abs(rate) < 1e-9) return "";
    const signed = `${rate > 0 ? "+" : "−"}${Math.abs(rate) < 0.1 ? `${rateNumber(Math.abs(rate) * 60)}/min` : `${rateNumber(Math.abs(rate))}/s`}`;
    if ((rate > 0 && stat.value >= stat.max) || (rate < 0 && stat.value <= 0)) return signed;
    // "~0s" beside a meter that is visibly short of full reads as a stall.
    const left = rate > 0 ? (stat.max - stat.value) / rate : stat.value / -rate, when = left < 1 ? "under a second" : `~${duration(left)}`;
    return `${signed} · ${rate > 0 ? "full" : "empty"} in ${when}`;
  }
  /** Wall-clock seconds until the objective stops: acceleration spends one banked second per real second. */
  function wallClockToObjective(): number | undefined {
    const eta = engine.timeToObjective(), bank = engine.state.bank;
    if (eta === undefined) return undefined;
    return bank.accelerating ? Math.max(eta / 2, eta - bank.seconds) : eta;
  }
  /** The Now panel's beat: the last one whose condition holds. */
  function currentBeat() {
    return [...openingContext.beats].reverse().find(beat => engine.condition(beat.when)) ?? openingContext.beats[0]!;
  }
  function render(status?: string): void {
    if (disposed) return;
    if (status !== undefined) saveStatus = status;
    const state = engine.state, active = state.active, foundationReached = current("foundation") > 0;
    const bankFull = state.bank.seconds + 1e-9 >= state.bank.cap, accelerating = state.bank.accelerating;
    const filler = active ? engine.record(active.id).autoStart === true : false;
    setText(ui("save-status"), saveStatus); setText(ui("bank-amount"), `${duration(state.bank.seconds)} / ${duration(state.bank.cap)}`); bankMeter.update(state.bank.seconds, state.bank.cap);
    ui("bank").classList.toggle("is-full", bankFull && !active); ui("bank").classList.toggle("is-accelerating", accelerating);
    setText(ui("stage"), current("reedmarket") > 0 ? "Reedmarket" : current("second_direction") > 0 ? "The basin road" : current("waystation") > 0 ? "The ridge" : foundationReached ? "Foundation" : "The village");
    const scene = [...openingContext.scenes].reverse().find(candidate => engine.condition(candidate.when)) ?? openingContext.scenes[0]!;
    // The scene sets the stage's accent, so the climb from the village reads in the chrome as well as the copy.
    shell.dataset.stage = scene.id;
    setText(ui("location-place"), scene.place); setText(ui("location-text"), scene.location);
    setText(ui("character-title"), scene.title); setText(ui("scene-description"), scene.introduction);
    setText(ui("bound"), `${openingContext.title} · ${scene.bound}`);
    setText(ui("activity-time"), `${duration(state.activitySeconds)} of activity`);
    for (const id of ["export", "import", "new-game"]) ui<HTMLButtonElement>(id).disabled = settingsBusy;
    const feedback = ui("settings-feedback");
    setText(feedback, settingsError); feedback.hidden = !settingsError;
    setText(ui("objective-name"), active ? label(active.id) : "No activity");
    setText(ui("objective-progress"), active ? `Until ${objectiveText(active.objective)}` : "Idle. Choose an activity; Rest starts by itself when Vigor is short.");
    setText(ui("active-mode"), active ? engine.record(active.id).length === "continuous" ? "Continuous" : "Timed" : "Idle");
    activeMeter.root.hidden = !active; ui("active-progress").hidden = !active; ui("locate-active").hidden = !active;
    if (active) { const progress = activityProgress(engine.record(active.id)); activeMeter.update(progress.value, progress.max); setText(ui("active-progress"), progress.text); }
    const eta = wallClockToObjective();
    ui("active-eta").hidden = !active || eta === undefined;
    if (active && eta !== undefined) setText(ui("active-eta"), `${eta < 1 ? "Finishing" : `~${duration(eta)} left`}${accelerating ? " · accelerating" : ""}`);
    renderFight();
    const carriedFlag = engine.records.find(record => record.boost && current(record.boost.flag) > 0)?.boost;
    ui("carried").hidden = !carriedFlag;
    if (carriedFlag) {
      const speeding = active && carried(engine.record(active.id));
      setText(ui("carried"), `${label(carriedFlag.flag)}: ${speeding ? `this run goes ×${number(carriedFlag.multiplier)} faster` : `the next site visit or exercise goes ×${number(carriedFlag.multiplier)} faster`}.`);
    }
    if ((active?.id ?? null) !== editorFor) rebuildEditor();
    const accelerate = ui<HTMLButtonElement>("accelerate");
    accelerate.disabled = !active || (state.bank.seconds < 1 && !accelerating);
    accelerate.setAttribute("aria-pressed", String(accelerating));
    // A disabled control cannot be hovered on touch or focused by keyboard, so its reason is part of its label.
    setText(accelerate, accelerating && active ? `Accelerating · ${objectiveText(active.objective)}` : !active ? "Accelerate · needs an activity"
      : state.bank.seconds < 1 ? "Accelerate · bank empty" : `Accelerate · ${objectiveText(active.objective)}`);
    const stop = ui<HTMLButtonElement>("stop"), stopReason = ui("stop-reason");
    const fighting = engine.fighting();
    stop.disabled = !active || filler || fighting;
    setText(stopReason, filler ? "Rest ends by itself when Vigor is full, or when another activity replaces it." : fighting ? "A fight cannot be left halfway." : "");
    stopReason.hidden = !stopReason.textContent;
    setText(ui("bank-note"), !active ? bankFull ? "The bank is full; further idle time is not kept." : "Unused time gathers in the bank."
      : accelerating ? "Spending the bank: two activity seconds pass each real second." : state.bank.seconds < 1 ? "The bank is empty; the activity runs at ordinary speed." : "Accelerate, beside the bank, spends banked time on this objective.");
    ui("last-stop").hidden = !state.lastStop; if (state.lastStop) setText(ui("last-stop"), state.lastStop);
    // Past Foundation the engine names the standing itself: the highest class held, else Foundation.
    setText(ui("character-stage"), engine.title());
    const home = engine.records.find(record => record.kind === "home" && current(record.id) > 0 && engine.visible(record.id));
    const homeName = home?.name ?? openingContext.place, homeSpace = engine.stat("home_space");
    setText(ui("home-name"), homeName); setText(ui("home-space"), `${number(homeSpace.value)} / ${number(homeSpace.max)} occupied`);
    // The waiting list matters once there is a second sustained pursuit to hand the slot to.
    const sustained = new Set(cells.filter(cell => modeOf(cell.record) !== "instant" && !cell.record.autoStart && engine.visible(cell.record.id)).map(cell => cell.record.id));
    queueing = sustained.size >= 2 || state.waiting.length > 0;
    renderPlaces();
    renderWaiting();
    const beat = currentBeat();
    setText(nowTitle, beat.title); setText(nowText, beat.text); setText(nowNext, beat.next); nextIds = new Set(beat.focus);
    // The newest moment of news: its story first, then what it made known, in one banner.
    const newest = [...state.log].reverse().find(entry => noticeKinds.has(entry.kind));
    if (seenDiscovery > (state.log.at(-1)?.id ?? 0)) seenDiscovery = 0;
    ui("notice").hidden = !newest || newest.id <= seenDiscovery;
    if (newest) {
      const batch = state.log.filter(entry => noticeKinds.has(entry.kind) && entry.activitySeconds === newest.activitySeconds && entry.id > seenDiscovery);
      const stories = batch.filter(entry => entry.kind === "story").map(entry => entry.text);
      const known = batch.filter(entry => entry.kind === "discovery").map(entry => entry.text.replace(/ is now known\.$/, ""));
      setText(ui("notice-story"), stories.join(" ")); ui("notice-story").hidden = !stories.length;
      setText(ui("notice-text"), stories.length ? `New: ${known.join(", ")}.` : known.length === 1 ? `${known[0]} is now known.` : `Now known: ${known.join(", ")}.`);
      ui("notice-text").hidden = !known.length;
    }
    setText(homeHead.heading, homeName); setText(homeHead.value, `${number(homeSpace.value)} / ${number(homeSpace.max)}`);
    syncPips(homeHead.pips, homeSpace.value, homeSpace.max, "gauge-pip");
    let visiblePreparations = 0;
    for (const view of ledgerRows) {
      const stat = engine.stat(view.record.id); view.row.hidden = !engine.visible(view.record.id);
      if (view.preparation && !view.row.hidden) visiblePreparations++;
      setText(view.amount, `${held(stat.value)} / ${number(stat.max)}`); view.bar.update(stat.value, stat.max);
      const capped = stat.value >= stat.max; view.row.classList.toggle("at-cap", capped);
      view.row.classList.toggle("is-filtering", filterResource === view.record.id); view.row.setAttribute("aria-pressed", String(filterResource === view.record.id));
      const rate = resourceRate(view.record.id);
      if (view.body) { setText(view.note, rate); view.note.hidden = !rate; }
      view.detail.update(engine.tooltip(view.record.id));
      setText(view.tipFlow, [rate, capped ? "At capacity" : ""].filter(Boolean).join(" · ")); view.tipFlow.hidden = !view.tipFlow.textContent;
      const before = previous.get(view.record.id); previous.set(view.record.id, stat.value);
      if (!view.body && before !== undefined && stat.value > before + 1e-9) pulse(view.row, "tick-up", 600);
    }
    // Preparations in effect: what is standing and for how long, under what is kept.
    const inEffect = ui("in-effect");
    const effectLines = engine.state.effects.map(effect => `${label(effect.id)} · ${clock(effect.remaining)} left`);
    inEffect.hidden = effectLines.length === 0;
    if (effectLines.length) { inEffect.replaceChildren(...effectLines.map(line => element("p", "in-effect-line", line))); visiblePreparations++; }
    ui("preparations-panel").hidden = visiblePreparations === 0;
    let visibleFamilies = 0;
    for (const view of familyRows) {
      const stat = engine.stat(view.record.id); view.row.hidden = !engine.visible(view.record.id); if (view.row.hidden) continue;
      visibleFamilies++; setText(view.amount, `${number(stat.value)} / ${number(stat.max)}`);
      syncPips(view.pips, stat.value, stat.max, "family-pip");
      setText(view.exp, !stat.open ? view.record.needtext ?? "Method not open." : stat.value >= stat.max ? "Current limit reached" : `${number(stat.exp)} / ${60 * (stat.value + 1)} XP toward level ${stat.value + 1}`);
      view.detail.update(engine.tooltip(view.record.id));
    }
    ui("families-panel").hidden = visibleFamilies === 0;
    // Tab and group counts measure what can be finished: cards marked New or Next. While the ledger filter is on, a tab counts its matches instead.
    const marked = new Map<Tab, number>(), matched = new Map<Tab, number>();
    const tally = (tab: Tab, result: { marked: boolean; match: boolean }): void => {
      if (result.marked) marked.set(tab, (marked.get(tab) ?? 0) + 1);
      if (result.match) matched.set(tab, (matched.get(tab) ?? 0) + 1);
    };
    for (const view of groupViews) {
      let count = 0;
      for (const cell of view.cells) { const result = cell.update(); if (result.marked) count++; tally(view.definition.tab, result); }
      view.details.hidden = view.grid.querySelector(".task-cell:not([hidden])") === null;
      setText(view.count, count ? String(count) : "");
    }
    for (const view of familyExplanations) {
      view.row.hidden = !engine.visible(view.record.id);
      const stat = engine.stat(view.record.id);
      setText(view.headingLevel, `Level ${number(stat.value)} / ${number(stat.max)}`);
      view.detail.update(engine.tooltip(view.record.id));
      for (const cell of view.cells) tally("character", cell.update());
      view.practice.hidden = view.cells.every(cell => cell.cell.hidden);
    }
    for (const group of doneGroups.values()) {
      const shown = group.grid.querySelectorAll(".task-cell:not([hidden])").length;
      group.details.hidden = shown === 0; setText(group.count, shown ? String(shown) : "");
    }
    const apprenticed = current("shu_apprentice") > 0;
    // The spellbook opens with the first technique the method makes available.
    const techniquesVisible = cells.some(cell => cell.tab === "techniques" && !cell.cell.hidden);
    const craftVisible = cells.some(cell => cell.tab === "craft" && !cell.cell.hidden);
    // How many methods are held ready, of how many can be; absent until the content defines attunement at all.
    const slots = engine.records.some(record => record.id === "attune_slots") ? engine.stat("attune_slots") : undefined;
    techniqueHead.gauge.hidden = !slots;
    if (slots) {
      const stance = engine.state.stance ? engine.record(engine.state.stance) : undefined;
      setText(techniqueHead.value, `${number(slots.value)} / ${number(slots.max)}${stance ? ` · Stance: ${stance.name ?? stance.id}` : ""}`);
      syncPips(techniqueHead.pips, slots.value, slots.max, "gauge-pip");
    }
    tabViews.get("techniques")!.button.hidden = !techniquesVisible;
    tabViews.get("home")!.button.hidden = !apprenticed;
    tabViews.get("craft")!.button.hidden = !craftVisible;
    if ((selectedTab === "techniques" && !techniquesVisible) || (selectedTab === "home" && !apprenticed) || (selectedTab === "craft" && !craftVisible)) selectedTab = "tasks";
    for (const id of ["techniques", "home", "craft"] as const) {
      const shown = !tabViews.get(id)!.button.hidden;
      if (shown && tabShown.get(id) === false && selectedTab !== id) unseenTabs.add(id);
      tabShown.set(id, shown);
    }
    for (const [id, view] of tabViews) {
      const count = (filterResource ? matched : marked).get(id) ?? 0;
      setText(view.count, count ? String(count) : ""); view.count.classList.toggle("is-match", Boolean(filterResource));
      const hasNew = id !== selectedTab && !view.button.hidden && (unseenTabs.has(id)
        || cells.some(cell => cell.tab === id && !cell.cell.hidden && !seenIds.has(cell.record.id) && !doneWith(cell.record, engine.stat(cell.record.id)))
        || engine.records.some(record => engine.visible(record.id) && !seenIds.has(record.id) && (
          id === "character" ? record.kind === "lead"
            : id === "tasks" && Boolean(record.breakthrough) && engine.stat(record.id).value < engine.stat(record.id).max)));
      view.badge.hidden = !hasNew;
      view.button.setAttribute("aria-selected", String(id === selectedTab)); view.button.tabIndex = id === selectedTab ? 0 : -1; view.panel.hidden = id !== selectedTab;
    }
    for (const view of breakthroughPanels) view.update(active);
    const completion = latestCompletion();
    ui("completion").hidden = !completion || seenCompletion === completion.id; ui("completion-detail").hidden = !foundationReached;
    if (completion) renderCompletion(completion);
    const atWaystation = current("waystation") > 0, atReedmarket = current("reedmarket") > 0, secondTaken = current("second_direction") > 0;
    setText(ui("completion-heading"), atReedmarket ? "Beyond Reedmarket" : secondTaken ? "Beyond the Second Direction" : atWaystation ? "Beyond the waystation" : "Beyond Foundation");
    setText(ui("completion-stage"), atReedmarket ? "Stage complete" : secondTaken ? "The terrace lies ahead" : atWaystation ? "The basin road lies ahead" : "The ridge lies ahead");
    setText(ui("completion-lead"), atReedmarket
      ? "The terrace came down into reed beds and a street of stalls. Reedmarket's porters pay better than Han, and the basin is beyond."
      : secondTaken
        ? "The Second Direction has read a title from what you hold. A fifth method can be held, and a hobby runs beside the slot."
        : atWaystation
          ? "You came up the ridge by a method you held, and the waystation keeper has written it down beside your name."
          : "The pooled breath turns and returns. A method that once ended in a broken sentence has become your own.");
    setText(ui("completion-note"), atReedmarket
      ? "The three leaves the ledger could not place are somewhere in the basin. That is the next stage of the journey."
      : secondTaken
        ? "The terrace above the slide is a day's carry to Reedmarket, on the Cloudwell basin's edge."
        : atWaystation
          ? "Four things on Han's board: route records toward the basin, a chime at dusk, a spur that ends at a slide, and the slip's other nine leaves. Each sphere carried to five opens a deeper teaching; two spheres deepened and three methods held take the Second Direction."
          : "Old Ridge rises beyond the porters' path. Walk its outskirts to find the teachings; any sphere carried to four takes the First Direction, and a held method of its school carries you to the waystation.");
    ui("slip").hidden = current("jade_slip") === 0; ui("character-methods").hidden = visibleFamilies === 0;
    // A reading is settled once its rival has closed, which happens the moment it is first attuned.
    const reading = Object.keys(rebuiltLeaf).find(id => engine.has(id) && !engine.locked(id) && (engine.record(id).lock ?? []).some(other => engine.locked(other)));
    setText(ui("slip-summary"), reading ? "The Cracked Jade Slip · leaves 1, 2 and 8, the eighth rebuilt" : "The Cracked Jade Slip · leaves 1, 2, 8");
    ui("slip-rebuilt").hidden = !reading;
    if (reading) setText(ui("slip-rebuilt"), `Leaf 8, as you have rebuilt it through ${label(reading)}: ${rebuiltLeaf[reading]}`);
    let keysHeld = 0;
    for (const { tag, item, carriers } of keyItems) {
      const holders = engine.records.filter(record => record.tags?.includes(tag) && current(record.id) > 0 && !engine.locked(record.id)).map(record => record.name ?? record.id);
      item.hidden = holders.length === 0; if (!item.hidden) keysHeld++;
      setText(carriers, `Carried by ${holders.join(" and ")}.`);
    }
    keySection.hidden = keysHeld === 0;
    const reached = latestBreakthrough();
    setText(ui("character-stage-detail"), !foundationReached ? "Mortal, no breakthrough yet" : reached && reached.id !== "settling" ? `Foundation · ${reached.breakthrough?.title ?? reached.name}` : "Foundation");
    setText(ui("character-time"), duration(state.activitySeconds));
    for (const { record, item, description } of leadItems) {
      item.hidden = !engine.visible(record.id); setText(description, `${record.desc ?? ""}${record.need && !engine.condition(record.need) ? ` ${record.needtext ?? ""}` : ""}`);
    }
    const allEntries = ui<HTMLSelectElement>("journal-filter").value === "all";
    const entries = state.log.filter(entry => allEntries || entry.kind !== "completion").reverse(), keep = new Set(entries.map(entry => entry.id));
    for (const [id, node] of logNodes) if (!keep.has(id)) { node.remove(); logNodes.delete(id); }
    const journal = ui("journal");
    entries.forEach((entry, index) => {
      let node = logNodes.get(entry.id);
      if (!node) { node = element("li", "journal-entry"); const meta = element("div", "journal-meta"); meta.append(element("span"), element("span", "journal-time")); node.append(meta, element("p", "journal-text")); logNodes.set(entry.id, node); }
      node.dataset.kind = entry.kind; const meta = node.firstElementChild!;
      setText(meta.firstElementChild as HTMLElement, journalKinds[entry.kind]); setText(meta.lastElementChild as HTMLElement, duration(entry.activitySeconds)); setText(node.lastElementChild as HTMLElement, entry.text);
      if (journal.children[index] !== node) journal.insertBefore(node, journal.children[index] ?? null);
    });
    ui("journal-empty").hidden = entries.length > 0;
    const lastMeaningful = [...state.log].reverse().find(entry => entry.kind !== "completion");
    if (lastMeaningful && lastMeaningful.id > announcedLogId) { announcedLogId = lastMeaningful.id; setText(ui("journal-announcement"), lastMeaningful.text); }
  }
  /** What a return visit settled: shown once, above the game views, until dismissed. */
  function showReturn(summary: ReturnSummary): void {
    const bank = engine.state.bank, lines: string[] = [];
    if (summary.activitySeconds > 0) lines.push(`Your activity continued for ${duration(summary.activitySeconds)}${summary.spentSeconds > 0 ? `, spending ${duration(summary.spentSeconds)} from the bank` : ""}.`);
    if (summary.bankedSeconds > 0) lines.push(`${duration(summary.bankedSeconds)} entered the bank${bank.seconds + 1e-9 >= bank.cap ? ", which is now full" : ""}.`);
    else if (summary.activitySeconds === 0) lines.push("Nothing changed: the bank was already full.");
    const gains: string[] = [], done: string[] = [], levels: string[] = [];
    for (const record of engine.records) {
      const before = summary.before[record.id], stat = engine.state.stats[record.id];
      if (before === undefined || !stat) continue;
      const gained = Math.floor(stat.value + 1e-9) - Math.floor(before + 1e-9);
      if (record.kind === "resource" && record.group === "Resources" && !bodyIds.includes(record.id) && gained > 0) gains.push(`+${number(gained)} ${label(record.id).toLowerCase()}`);
      if (record.kind === "family" && stat.value > before) levels.push(`${label(record.id)} reached level ${number(stat.value)}.`);
      const runs = stat.reps - (summary.before[`${record.id}.reps`] ?? stat.reps);
      if (typeof record.length === "number" && runs > 0) done.push(runs > 1 ? `${label(record.id)} ×${runs}` : label(record.id));
    }
    if (done.length) lines.push(`Completed: ${done.join(", ")}.`);
    if (gains.length) lines.push(`Gained ${gains.join(", ")}.`);
    lines.push(...levels);
    for (const entry of summary.entries.filter(entry => entry.kind !== "completion").slice(-4)) lines.push(entry.text);
    // The summary hands over to what comes next: what is still queued, then the current step.
    const ahead: string[] = [], waiting = engine.state.waiting.map(entry => label(entry.id));
    if (waiting.length) ahead.push(`Still waiting: ${listText(waiting)}.`);
    ahead.push(`Next: ${currentBeat().next}`);
    setText(ui("return-title"), `While you were away · ${duration(summary.awaySeconds)}`);
    ui("return-list").replaceChildren(...lines.map(text => element("li", "", text)), ...ahead.map(text => element("li", "is-ahead", text)));
    ui("return").hidden = false;
    announce(`While you were away for ${duration(summary.awaySeconds)}: ${[...lines, ...ahead].join(" ")}`);
  }
  render();
  return {
    render,
    showReturn,
    setEngine(next: GameEngine) {
      engine = next; editorFor = undefined; previous.clear(); seenIds = new Set(engine.state.visibleIds); filterResource = null;
      announcedLogId = engine.state.log.at(-1)?.id ?? 0;
      // A confirmation left open belongs to the journey that has just been replaced.
      closeConfirmation();
      ui("return").hidden = true; render();
    },
    destroy() { disposed = true; root.replaceChildren(); },
  };
}
