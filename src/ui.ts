import { GAUGE, WAITING_MAX, type GameEngine } from "./engine";
import type { ActiveTask, GameRecord, GameState, LogEntry, Objective, Stat, TooltipBlock, TooltipBlockKind } from "./types";
import { openingContext } from "./content";

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

type Tab = "tasks" | "fight" | "techniques" | "home" | "character";
type Mode = "instant" | "timed" | "continuous";
const tabs: { id: Tab; name: string }[] = [
  { id: "tasks", name: "Tasks" }, { id: "fight", name: "Fight" }, { id: "techniques", name: "Techniques" },
  { id: "home", name: "Home" }, { id: "character", name: "Character" },
];
const groups: { id: string; title: string; tab: Tab; matches(record: GameRecord): boolean }[] = [
  { id: "work", title: "Village work", tab: "tasks", matches: record => record.group === "Work" },
  { id: "practice", title: "Practice", tab: "tasks", matches: record => record.group === "Practice" && record.kind === "task" },
  { id: "sites", title: "Places beyond the village", tab: "tasks", matches: record => record.group === "Sites" },
  { id: "fights", title: "Fights", tab: "tasks", matches: record => record.group === "Fights" },
  { id: "purchases", title: "Purchases", tab: "tasks", matches: record => record.group === "Purchases" && record.kind !== "class" },
  { id: "classes", title: "Standing", tab: "tasks", matches: record => record.kind === "class" },
  { id: "trade", title: "Village trade", tab: "tasks", matches: record => record.group === "Trade" },
  { id: "techniques", title: "Techniques", tab: "techniques", matches: record => record.kind === "technique" },
  { id: "shelter", title: "Shelter", tab: "home", matches: record => record.group === "Home" && record.kind === "home" },
  { id: "arrangements", title: "Arrangements", tab: "home", matches: record => record.group === "Home" && record.kind === "arrangement" },
];
const notActions = new Set(["resource", "family", "flag", "breakthrough", "lead"]);
const bodyIds = ["vigor", "qi", "life", "strain"];
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
function modeOf(record: GameRecord): Mode {
  return record.length === undefined ? "instant" : record.length === "continuous" ? "continuous" : "timed";
}
/** Where a record's primary cell lives; practice is mirrored under its knowledge on Character as well. */
function recordTab(record: GameRecord): Tab {
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
          <p>Time away follows the saved objective until it stops; the remainder enters the bank.</p><p class="settings-feedback" data-ui="settings-feedback" role="status" hidden></p>
        </div></details></div>
      </header>
      <div class="workspace">
        <aside class="ledger-column" aria-label="Resources and knowledge">
          <section class="panel ledger"><div class="panel-heading"><h2>Resources</h2><span>Held / max</span></div>
            <details class="ledger-section" open><summary><h3>Currency</h3></summary><div data-ui="currency"></div></details>
            <details class="ledger-section" open><summary><h3>Materials</h3></summary><div data-ui="materials"></div></details>
            <details class="ledger-section" open data-ui="families-panel" hidden><summary><h3>Knowledge <span>Level / limit</span></h3></summary><div class="family-list" data-ui="families"></div></details>
          </section>
          <section class="panel location-panel"><div class="panel-heading"><h2>Lowbridge</h2></div><p>The mill stream meets the ferry road. Beyond the barns, the water runs toward the wilds.</p><span class="location-foot" data-ui="location-stage"></span></section>
        </aside>
        <main class="centre-column" id="activities" tabindex="-1">
          <section class="confirmation" data-ui="confirmation" role="alertdialog" aria-labelledby="confirmation-text" hidden><p id="confirmation-text" data-ui="confirmation-text"></p><div class="banner-actions"><button type="button" class="danger-button" data-ui="confirm">Confirm</button><button type="button" data-ui="cancel">Cancel</button></div></section>
          <section class="completion-banner" data-ui="completion" hidden><div><strong data-ui="completion-title">Foundation reached</strong><span data-ui="completion-text">The method holds.</span></div><div class="banner-actions"><button type="button" data-ui="review-foundation">Review Foundation</button><button type="button" class="text-button" data-ui="completion-dismiss">Dismiss</button></div></section>
          <section class="return-banner" data-ui="return" hidden><div><strong data-ui="return-title"></strong><ul class="return-list" data-ui="return-list"></ul></div><button type="button" data-ui="return-dismiss">Continue</button></section>
          <section class="return-banner notice-banner" data-ui="notice" role="status" hidden><div><p class="notice-story" data-ui="notice-story"></p><p class="notice-new" data-ui="notice-text"></p></div><button type="button" data-ui="notice-dismiss">Dismiss</button></section>
          <section class="panel activity-panel"><nav class="activity-nav" role="tablist" aria-label="Game views" data-ui="tabs"></nav><div data-ui="tab-panels"></div></section>
        </main>
        <aside class="status-column" aria-label="Current activity and character">
          <section class="panel activity-slot"><div class="panel-heading"><h2>Current activity</h2><span class="activity-state" data-ui="active-mode">Idle</span></div><div class="slot-body"><h3 data-ui="objective-name">No activity</h3><p class="slot-goal" data-ui="objective-progress"></p><div data-ui="active-meter"></div><p class="slot-progress numeric" data-ui="active-progress"></p><p class="slot-eta" data-ui="active-eta" hidden></p><p class="slot-current" data-ui="carried" hidden></p>
            <div class="objective-editor" data-ui="objective-editor" hidden><label>Stop when <select data-ui="objective-kind"></select></label><label data-ui="objective-target-label">Target <input type="number" data-ui="objective-target" inputmode="numeric" /></label><p class="slot-error" data-ui="objective-error" role="status"></p></div>
            <div class="slot-actions"><button type="button" data-ui="stop" data-action="stop">Stop</button><button type="button" class="text-button" data-ui="locate-active" hidden>Show activity</button></div><p class="slot-note" data-ui="bank-note"></p><p class="slot-last" data-ui="last-stop" hidden></p>
            <div class="waiting"><h4>Waiting</h4><ol class="waiting-list" data-ui="waiting"></ol><p class="empty-state" data-ui="waiting-empty">Nothing is waiting. Shift-click an action to queue it.</p></div></div></section>
          <section class="panel body-panel"><div class="panel-heading"><h2>Body</h2><span>Held / max</span></div><div class="body-list" data-ui="body"></div></section>
          <section class="panel character-status"><div class="panel-heading"><h2>Character</h2><span data-ui="character-stage">Mortal</span></div><div class="status-body"><dl class="status-list"><div class="home-status"><dt>Home</dt><dd data-ui="home-name"></dd></div><div><dt>Floor space</dt><dd data-ui="home-space"></dd></div></dl></div></section>
          <section class="panel journal-panel" aria-labelledby="journal-heading"><div class="panel-heading"><h2 id="journal-heading">Journal</h2><select data-ui="journal-filter" aria-label="Journal entries"><option value="key">Story, discoveries &amp; limits</option><option value="all">All entries</option></select></div><ol class="journal-list" data-ui="journal"></ol><p class="empty-state journal-empty" data-ui="journal-empty">The mill wheel turns below the hayloft.</p></section>
        </aside>
      </div>
      <footer class="game-footer"><span>Lowbridge · Village to Foundation</span><span data-ui="activity-time"></span></footer>
      <p class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-ui="announcement"></p>
    </div>`;

  function ui<T extends HTMLElement = HTMLElement>(key: string): T {
    const node = root!.querySelector<T>(`[data-ui="${key}"]`);
    if (!node) throw new Error(`Missing UI node: ${key}`);
    return node;
  }
  function label(id: string): string { return engine.records.find(record => record.id === id)?.name ?? id.replaceAll("_", " "); }
  function current(id: string): number { return engine.state.stats[id]?.value ?? 0; }
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
  /** One confirm panel for every irreversible step: replacing the save, and any action the engine warns about. */
  function confirmAction(message: string, action: () => Promise<void> | void): void {
    pendingConfirmation = action;
    confirmationTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    root!.querySelector<HTMLDetailsElement>(".settings")!.open = false;
    setText(ui("confirmation-text"), message); ui("confirmation").hidden = false; ui("cancel").focus();
  }
  /**
   * Every step the engine warns about asks before it happens, and cancelling leaves the game exactly as
   * it was. Which step that is belongs to the engine: a chore closes its rival on first completion, a
   * technique closes its rival the moment it is taken up, and `warnText` is what distinguishes them.
   */
  function askFirst(id: string, act: () => Promise<void>): void {
    const warning = engine.warnText(id);
    if (warning) confirmAction(warning, act); else void act();
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
      confirmAction("Replace the current journey with this file? Export the current save first if you want to keep it.", () => settingsAction(() => callbacks.onImport(state)));
    });
  });
  ui("new-game").addEventListener("click", () => confirmAction("Begin again in the hayloft? This replaces the current save. An exported save can be imported later.", () => settingsAction(callbacks.onNewGame)));
  ui("cancel").addEventListener("click", () => { pendingConfirmation = null; ui("confirmation").hidden = true; confirmationTrigger?.focus(); });
  ui("confirm").addEventListener("click", () => {
    const action = pendingConfirmation; pendingConfirmation = null; ui("confirmation").hidden = true;
    if (action) void Promise.resolve(action()).then(() => confirmationTrigger?.focus());
  });
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
  const homePanel = tabViews.get("home")!.panel, characterPanel = tabViews.get("character")!.panel;
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
  const techniqueIntro = element("div", "view-intro");
  const attuneCount = element("p", "attune-count"); attuneCount.dataset.ui = "attune-count";
  techniqueIntro.append(element("h2", "", "Techniques"), element("p", "", "What the method can do on command. Only an attuned technique is ready to use; attunement holds it in mind, and there is room for only so many."), attuneCount);
  techniquesPanel.append(techniqueIntro);
  const homeIntro = element("div", "view-intro");
  const homeTitle = element("h2"), homeCapacity = element("p"); homeIntro.append(homeTitle, homeCapacity); homePanel.append(homeIntro);
  const places = element("section", "places"); places.dataset.ui = "places";
  const placeList = element("ul", "place-list");
  places.append(element("h3", "", "Places"), placeList); homePanel.append(places);
  let placeKey = "";
  function renderPlaces(): void {
    const slots = engine.homeSlots(), key = slots.join(",");
    if (key !== placeKey) {
      placeKey = key;
      placeList.replaceChildren(...slots.map(slot => {
        const row = element("li", "place-row"); row.dataset.slot = slot;
        const take = element("button", "text-button", "Take down"); take.type = "button"; take.dataset.action = "remove";
        take.addEventListener("click", () => {
          const holder = engine.slotHolder(slot);
          if (holder) void change(() => { const result = engine.remove(holder.id); announce(result.ok ? `${holder.name ?? holder.id} has been taken down.` : result.reason); });
        });
        row.append(element("span", "place-name", slot), element("span", "place-holder"), take);
        return row;
      }));
    }
    places.hidden = slots.length === 0;
    for (const row of placeList.children) {
      const holder = engine.slotHolder((row as HTMLElement).dataset.slot!);
      setText(row.querySelector<HTMLElement>(".place-holder")!, holder?.name ?? "empty");
      row.querySelector<HTMLButtonElement>("button")!.hidden = !holder;
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
   * line is clipped at the edge of the button and the tooltip is one hover away.
   */
  function cardSummary(blocks: TooltipBlock[], mode: Mode): string {
    if (mode === "timed") return [...blockLines(blocks, "time", "cost"), ...blockLines(blocks, "fight").filter(line => line.startsWith("Projected"))].join(" · ");
    const cost = blockLines(blocks, "cost").join(" · ");
    const payoff = mode === "continuous" ? blockLines(blocks, "effect") : [...blockLines(blocks, "result"), ...blockLines(blocks, "mod")];
    const headline = payoff.length > 1 ? `${payoff[0]} +${payoff.length - 1} more` : payoff[0] ?? "";
    if (mode === "continuous") return [headline, cost].filter(Boolean).join(" · ");
    return cost && headline ? `${cost} → ${headline}` : cost || headline;
  }
  function recordTouchesResource(record: GameRecord, resourceId: string): boolean {
    for (const changes of [record.cost, record.buy, record.run, record.strain, record.result, record.effect, record.mod, ...Object.values(record.every ?? {}), ...Object.values(record.at ?? {})]) {
      for (const path of Object.keys(changes ?? {})) if (path.split(".")[0] === resourceId) return true;
    }
    return false;
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
    return { text: `${duration(active.progress)} / ${duration(length)} this completion`, value: active.progress, max: length };
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
    const projection = fight.result ? undefined : engine.fight(record.id);
    setText(fightYou.odds, projection ? `Your swings land ${Math.round(projection.yourChance * 100)}% for ${projection.yourDamage}.` : `Landed ${fight.landed} of ${fight.swings} swings.`);
    setText(fightFoe.odds, projection ? `Theirs land ${Math.round(projection.foeChance * 100)}% for ${projection.foeDamage}.` : `Landed ${fight.foeLanded} of ${fight.foeSwings} swings.`);
    setText(fightSummary, projection ? `${projection.likely ? "Likely win" : "Likely loss"} · you have landed ${fight.landed} of ${fight.swings}, ${foe.name} ${fight.foeLanded} of ${fight.foeSwings}.`
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
    const grid = element("div", "task-grid");
    details.append(summary, grid);
    tabViews.get(tab)!.panel.append(details);
    return { details, count, grid };
  }
  const groupViews = groups.map(definition => {
    const group = makeGroup(definition.id, definition.title, definition.tab, !closedGroups.has(definition.id));
    group.details.addEventListener("toggle", () => {
      if (group.details.open) closedGroups.delete(definition.id); else closedGroups.add(definition.id);
      try { localStorage.setItem(groupsKey, JSON.stringify([...closedGroups])); } catch { /* A preference only. */ }
    });
    const members = engine.records.filter(record => !notActions.has(record.kind) && definition.matches(record))
      .sort((a, b) => Number(modeOf(b) === "continuous") - Number(modeOf(a) === "continuous"));
    return { definition, ...group, cells: members.map(record => createCell(record, group.grid, definition.tab)) };
  });
  const cells = groupViews.flatMap(view => view.cells);
  // Owned purchases and completed one-off visits leave the working grid for a closed Done group at the end of their tab.
  const doneGroups = new Map<Tab, GroupView>();
  for (const tab of ["tasks", "home"] as const) doneGroups.set(tab, makeGroup(`done-${tab}`, "Done", tab, false));
  function doneWith(record: GameRecord, stat: Stat): boolean {
    return (record.kind === "purchase" || record.kind === "site" || record.kind === "class" || record.kind === "teaching") && (stat.value >= stat.max || stat.reps >= stat.max);
  }

  function createCell(record: GameRecord, grid: HTMLElement, tab: Tab) {
    const mode = modeOf(record), name = record.name ?? record.id, tipId = `tip-${tab}-${record.id}`;
    const cell = element("div", "task-cell");
    const button = element("button", "task-button");
    button.type = "button"; button.dataset.recordId = record.id; button.dataset.action = "start"; button.dataset.actionMode = mode;
    button.setAttribute("aria-describedby", tipId);
    const sub = element("span", "task-sub"), badge = element("span", "task-badge"), fill = element("span", "task-fill");
    fill.setAttribute("aria-hidden", "true");
    button.append(element("span", "task-name", name), sub, badge, fill);
    const info = element("button", "task-info", "i");
    info.type = "button"; info.setAttribute("aria-label", `Details for ${name}`); info.setAttribute("aria-controls", tipId); info.setAttribute("aria-expanded", "false");
    cell.append(button, info); grid.append(cell);
    let queue: HTMLButtonElement | undefined;
    if (mode !== "instant") {
      queue = element("button", "task-queue", "Queue");
      queue.type = "button"; queue.dataset.action = "queue"; queue.dataset.queueId = record.id;
      queue.setAttribute("aria-label", `Queue ${name}`);
      queue.addEventListener("click", () => { void change(() => { const result = engine.queue(record.id); announce(result.ok ? `${name} is waiting.` : result.reason); }); });
      cell.append(queue);
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
      cell.append(attune);
    }
    const tip = attachTip(cell, tipId); tip.dataset.recordDetails = record.id;
    const modeLine = element("p", "tip-mode"); tip.append(modeLine);
    const blocks = blockList("tip-blocks"); tip.append(blocks.root);
    const countLine = element("p", "tip-count"); tip.append(countLine);
    let remove: HTMLButtonElement | undefined;
    if (engine.removable(record)) {
      remove = element("button", "tip-remove", "Take down (no refund)");
      remove.type = "button"; remove.dataset.action = "remove"; tip.append(remove);
      remove.addEventListener("click", () => { void change(() => { const result = engine.remove(record.id); announce(result.ok ? `${name} has been taken down.` : result.reason); }); });
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
    const modeText = mode === "timed" ? "Timed · takes the activity slot until done · Shift-click to queue" : mode === "continuous" ? "Continuous · takes the activity slot until its objective · Shift-click to queue"
      : record.cost && "vigor" in record.cost ? "Instant chore · spends Vigor" : "Instant · leaves the activity running";
    function update(): boolean {
      const visible = engine.visible(record.id);
      cell.hidden = !visible; if (!visible) return false;
      const stat = engine.stat(record.id), running = engine.state.active?.id === record.id, availability = engine.availability(record.id);
      const owned = !running && (stat.value >= stat.max || stat.reps >= stat.max), locked = !running && !owned && !availability.ok;
      // A wall (limited until something raises the cap) leaves the grid entirely; a missing requirement stays and says so.
      // Self-starting fillers like Rest, and the spellbook's own pages, are controls and never leave.
      if (locked && !record.autoStart && record.kind !== "technique" && engine.atLimitWall(record)) { cell.hidden = true; return false; }
      // A queued pursuit lives in the Waiting list; its grid cell is a dead duplicate.
      if (!running && engine.state.waiting.some(entry => entry.id === record.id)) { cell.hidden = true; return false; }
      const resume = !running && stat.paid, waste = !locked && !owned ? wasteText(stat) : "";
      const place = engine.state.waiting.findIndex(entry => entry.id === record.id) + 1;
      if (queue) queue.hidden = running || owned || place > 0 || Boolean(record.autoStart);
      const isNew = !seenIds.has(record.id) && !owned && !running && record.id !== "rest";
      const matchesResource = Boolean(filterResource && recordTouchesResource(record, filterResource));
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
      button.classList.toggle("is-running", running); button.classList.toggle("is-owned", owned);
      button.classList.toggle("is-locked", locked); button.classList.toggle("is-runnable", !running && !owned && !locked);
      button.classList.toggle("is-capped", Boolean(waste)); button.classList.toggle("is-new", isNew);
      button.classList.toggle("is-resource-match", matchesResource);
      button.disabled = owned;
      if (locked) button.setAttribute("aria-disabled", "true"); else button.removeAttribute("aria-disabled");
      if (mode !== "instant") button.setAttribute("aria-pressed", String(running));
      setText(sub, locked ? availability.reason : cardSummary(detail, mode));
      setText(badge, running ? "Running" : owned ? ownedText : place ? `Waiting #${place}` : resume ? `Resume ${clock(stat.exp)}` : waste || (isNew ? "New" : "")); badge.hidden = !badge.textContent;
      const progress = running ? activityProgress(record) : resume ? { value: stat.exp, max: stat.length } : { value: 0, max: 1 };
      fill.style.width = `${progress.max > 0 ? Math.min(100, progress.value / progress.max * 100) : 0}%`;
      setText(modeLine, modeText);
      blocks.update(detail);
      setText(countLine, `Completed ${number(stat.reps)} ${stat.reps === 1 ? "time" : "times"}`); countLine.hidden = record.max === 1 || mode === "continuous";
      if (remove) remove.hidden = stat.value < 1;
      cell.classList.toggle("tip-flip", cell.offsetLeft + 300 > home.clientWidth);
      return !running && !owned && !locked;
    }
    return { record, cell, tab, update };
  }

  const ledgerRows = engine.records.filter(record => record.kind === "resource" && record.group === "Resources").map(record => {
    const body = bodyIds.includes(record.id);
    const row = element("div", body ? "resource-row body-row" : "resource-row"); row.dataset.resource = record.id;
    const heading = element("div", "resource-heading"), amount = element("span", "resource-value numeric");
    heading.append(element("span", "resource-name", record.name ?? record.id), amount);
    const bar = meter(body ? `${record.id}-meter` : ""), note = element("p", "resource-rate");
    row.tabIndex = 0; row.setAttribute("aria-describedby", `ledger-tip-${record.id}`);
    row.append(heading, bar.root);
    if (body) row.append(note);
    const tip = attachTip(row, `ledger-tip-${record.id}`), detail = blockList("tip-blocks"), tipFlow = element("p", "tip-flow");
    tip.append(detail.root, tipFlow);
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
    ui(body ? "body" : record.id === "coin" ? "currency" : "materials").append(row);
    return { record, body, row, amount, bar, note, detail, tipFlow };
  });
  const familyRows = engine.records.filter(record => record.kind === "family").map(record => {
    const row = element("div", "family-row"); row.dataset.family = record.id;
    const heading = element("div", "family-heading"), amount = element("span", "family-value numeric");
    heading.append(element("span", "family-name", record.name ?? record.id), amount);
    const pips = element("div", "family-pips"); pips.setAttribute("aria-hidden", "true");
    const exp = element("p", "family-exp");
    row.tabIndex = 0; row.setAttribute("aria-describedby", `ledger-tip-${record.id}`);
    row.append(heading, pips, exp);
    const tip = attachTip(row, `ledger-tip-${record.id}`), detail = blockList("tip-blocks");
    tip.append(detail.root);
    // Knowledge is explained in full beside the practice that raises it, on Character.
    row.addEventListener("click", () => selectTab("character"));
    ui("families").append(row);
    return { record, row, amount, pips, exp, detail };
  });

  characterPanel.innerHTML = `<div class="view-intro"><h2 data-ui="character-title">A life in Lowbridge</h2><p data-ui="scene-description"></p></div><div class="character-facts"><dl><div><dt>Stage</dt><dd data-ui="character-stage-detail"></dd></div><div><dt>Activity</dt><dd data-ui="character-time"></dd></div></dl></div><section class="character-methods" data-ui="character-methods" hidden><div class="section-heading"><h3>Cultivation</h3><span>What each knowledge gives, and the practice that raises it</span></div><div data-ui="family-explanations"></div></section><details class="slip" data-ui="slip" hidden><summary>The Cracked Jade Slip · leaves 1, 2, 8</summary><blockquote><p><em>Lesser Breath-Gathering Method.</em> “Sit as water sits. Draw the breath past the throat and let it pool below the navel. Feel for what is not air.”</p><p>Leaf 8: “…when the pooled breath turns, do not follow it. Wait at the turning. The rest is…” The remaining characters are chipped away.</p></blockquote></details><section class="foundation-record" data-ui="completion-detail" hidden><div class="section-heading"><h3 data-ui="completion-heading">Beyond Foundation</h3><span data-ui="completion-stage">The ridge lies ahead</span></div><div class="completion-copy"><p>The pooled breath turns and returns. A method that once ended in a broken sentence has become your own.</p><p class="completion-note" data-ui="completion-note"></p></div><ul class="lead-list" data-ui="leads"></ul></section>`;
  setText(ui("scene-description"), openingContext.introduction);
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
  function checklistItem(text: string) {
    const row = element("li"), check = element("span", "foundation-check"); check.setAttribute("aria-hidden", "true");
    row.append(check, element("span", "", text));
    return { row, update(ok: boolean) { row.classList.toggle("complete", ok); setText(check, ok ? "✓" : "○"); row.setAttribute("aria-label", `${ok ? "Met" : "Unmet"}: ${text}`); } };
  }
  const breakthroughs = element("div", "breakthrough-list"); breakthroughs.dataset.ui = "breakthroughs";
  groupViews.find(view => view.definition.id === "practice")!.details.insertAdjacentElement("afterend", breakthroughs);
  /** One panel per breakthrough; the first (Foundation) keeps the `foundation-*` hooks the smoke test drives. */
  const breakthroughPanels = engine.records.filter(record => record.breakthrough).map((record, index) => {
    const breakthrough = record.breakthrough!, primary = index === 0, settlingLabel = record.id === "settling";
    const panel = element("section", "foundation-panel");
    panel.innerHTML = `<div class="section-heading"><h3 data-part="title"></h3><span class="mode-badge mode-timed">Timed breakthrough</span></div><div class="foundation-body"><div class="foundation-checks"><div><h4>The core</h4><ul class="foundation-list" data-part="core"></ul></div><div><h4 data-part="count"></h4><ul class="foundation-list" data-part="pointers"></ul></div></div><div class="foundation-footer"><div><p class="card-facts" data-part="bill"></p><p class="foundation-rewards" data-part="rewards"></p><p class="card-requirement" data-part="need"></p></div><button type="button" class="primary-button card-button" data-part="start" data-action="start"></button></div><details class="action-details"><summary>Breakthrough details</summary><p class="card-description" data-part="description"></p></details></div>`;
    const part = <T extends HTMLElement = HTMLElement>(name: string) => {
      const node = panel.querySelector<T>(`[data-part="${name}"]`)!;
      if (primary) node.dataset.ui = `foundation-${name}`;
      return node;
    };
    const parts = { title: part("title"), core: part("core"), count: part("count"), pointers: part("pointers"), bill: part("bill"), rewards: part("rewards"), need: part("need"), start: part<HTMLButtonElement>("start"), description: part("description") };
    if (primary) panel.dataset.ui = "foundation";
    panel.dataset.recordId = record.id; panel.dataset.actionMode = "timed";
    panel.querySelector("details")!.dataset.recordDetails = record.id;
    setText(parts.title, breakthrough.title ?? record.name ?? record.id);
    setText(parts.description, record.desc ?? "");
    const coreItem = checklistItem(breakthrough.coreLabel ?? "The core method"); parts.core.append(coreItem.row);
    const pointerItems = breakthrough.pointers.map(pointer => { const item = checklistItem(pointer.label); parts.pointers.append(item.row); return { pointer, item }; });
    parts.start.addEventListener("click", () => askFirst(record.id, () => change(() => { engine.start(record.id); })));
    ui("breakthroughs").append(panel);
    const granted = Object.keys(record.result ?? {}).filter(id => !id.includes(".") && engine.record(id).kind === "class").map(id => label(id));
    function update(active: ActiveTask | null): void {
      const stat = engine.stat(record.id);
      panel.hidden = !engine.visible(record.id) || stat.value >= stat.max;
      if (panel.hidden) return;
      coreItem.update(engine.condition(breakthrough.core)); let met = 0;
      for (const { pointer, item } of pointerItems) { const ok = engine.condition(pointer.when); if (ok) met++; item.update(ok); }
      setText(parts.count, `Supporting signs · ${met}/${breakthrough.pointers.length} · ${breakthrough.required} needed`);
      const availability = engine.availability(record.id), running = active?.id === record.id, detail = engine.tooltip(record.id);
      setText(parts.bill, [...blockLines(detail, "cost", "time"), stat.paid ? "paid" : ""].filter(Boolean).join(" · "));
      setText(parts.rewards, `On completion: ${[...blockLines(detail, "mod", "result"), ...granted.map(name => `the standing of ${name}`)].join("; ")}.`);
      setText(parts.need, availability.reason || record.needtext || ""); parts.need.hidden = availability.ok || running;
      parts.start.disabled = !availability.ok || running;
      setText(parts.start, settlingLabel
        ? running ? "Settling…" : stat.paid ? `Resume settling · ${clock(stat.exp)}` : "Settle the foundation"
        : running ? "Breaking through…" : stat.paid ? `Resume · ${clock(stat.exp)}` : `Begin: ${record.name ?? record.id}`);
    }
    return { record, update };
  });

  ui("review-foundation").addEventListener("click", () => selectTab("tasks", true));
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
      setText(view.detail, [`until ${objectiveText(entry.objective)}`, stat.paid ? `resumes at ${clock(stat.exp)} / ${clock(stat.length)}` : "",
        engine.availability(entry.id).ok ? "" : engine.availability(entry.id).reason].filter(Boolean).join(" · "));
      view.remove.setAttribute("aria-label", `Remove ${record.name ?? entry.id} from the waiting list`);
    });
    ui("waiting-empty").hidden = waiting.length > 0;
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
  ui("completion-dismiss").addEventListener("click", () => {
    const latest = [...breakthroughPanels].reverse().find(view => current(view.record.id) > 0)?.record;
    if (latest) seenCompletion = latest.id;
    try { localStorage.setItem(seenCompletionKey, seenCompletion); } catch { /* A preference only. */ }
    render();
  });

  const logNodes = new Map<number, HTMLLIElement>();
  const previous = new Map<string, number>();
  /** The net change the running activity produces, with the time until the resource is full or empty. */
  function resourceRate(id: string): string {
    const rate = engine.netRate(id), stat = engine.stat(id);
    if (Math.abs(rate) < 1e-9) return "";
    const signed = `${rate > 0 ? "+" : "−"}${Math.abs(rate) < 0.1 ? `${rateNumber(Math.abs(rate) * 60)}/min` : `${rateNumber(Math.abs(rate))}/s`}`;
    if (rate > 0 && stat.value < stat.max) return `${signed} · full in ~${duration((stat.max - stat.value) / rate)}`;
    if (rate < 0 && stat.value > 0) return `${signed} · empty in ~${duration(stat.value / -rate)}`;
    return signed;
  }
  /** Wall-clock seconds until the objective stops: acceleration spends one banked second per real second. */
  function wallClockToObjective(): number | undefined {
    const eta = engine.timeToObjective(), bank = engine.state.bank;
    if (eta === undefined) return undefined;
    return bank.accelerating ? Math.max(eta / 2, eta - bank.seconds) : eta;
  }
  function render(status?: string): void {
    if (disposed) return;
    if (status !== undefined) saveStatus = status;
    const state = engine.state, active = state.active, foundationReached = current("foundation") > 0;
    const bankFull = state.bank.seconds + 1e-9 >= state.bank.cap, accelerating = state.bank.accelerating;
    const filler = active ? engine.record(active.id).autoStart === true : false;
    setText(ui("save-status"), saveStatus); setText(ui("bank-amount"), `${duration(state.bank.seconds)} / ${duration(state.bank.cap)}`); bankMeter.update(state.bank.seconds, state.bank.cap);
    ui("bank").classList.toggle("is-full", bankFull && !active); ui("bank").classList.toggle("is-accelerating", accelerating);
    setText(ui("stage"), current("waystation") > 0 ? "The ridge" : foundationReached ? "Foundation" : "The village");
    setText(ui("location-stage"), foundationReached ? "The opening · Foundation reached" : "The opening · toward Foundation");
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
    setText(accelerate, accelerating && active ? `Accelerating · ${objectiveText(active.objective)}` : active && state.bank.seconds >= 1 ? `Accelerate · ${objectiveText(active.objective)}` : "Accelerate");
    accelerate.title = accelerating ? "Stop spending the bank." : active ? "Spend one banked second per real second on this objective." : "Start an activity to spend the bank on it.";
    const stop = ui<HTMLButtonElement>("stop");
    const fighting = engine.fighting();
    stop.disabled = !active || filler || fighting;
    stop.title = filler ? "Rest ends by itself when Vigor is full, or when another activity replaces it." : fighting ? "A fight cannot be left halfway." : "";
    setText(ui("bank-note"), !active ? bankFull ? "The bank is full; further idle time is not kept." : "Unused time gathers in the bank."
      : accelerating ? "Spending the bank: two activity seconds pass each real second." : state.bank.seconds < 1 ? "The bank is empty; the activity runs at ordinary speed." : "Accelerate, beside the bank, spends banked time on this objective.");
    ui("last-stop").hidden = !state.lastStop; if (state.lastStop) setText(ui("last-stop"), state.lastStop);
    const standing = engine.title();
    setText(ui("character-stage"), foundationReached ? (standing === "Mortal" ? "Foundation" : `${standing} · Foundation`) : standing);
    const home = engine.records.find(record => record.kind === "home" && current(record.id) > 0 && engine.visible(record.id));
    const homeName = home?.name ?? openingContext.place, homeSpace = engine.stat("home_space"), placeSummary = engine.homeSlots().map(slot => `${slot}: ${engine.slotHolder(slot)?.name ?? "empty"}`).join(" · ");
    setText(ui("home-name"), homeName); setText(ui("home-space"), `${number(homeSpace.value)} / ${number(homeSpace.max)} occupied${placeSummary ? ` · ${placeSummary}` : ""}`);
    renderPlaces();
    renderWaiting();
    const beat = [...openingContext.beats].reverse().find(beat => engine.condition(beat.when)) ?? openingContext.beats[0]!;
    setText(nowTitle, beat.title); setText(nowText, beat.text); setText(nowNext, beat.next);
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
    setText(homeTitle, homeName); setText(homeCapacity, `${number(homeSpace.value)} of ${number(homeSpace.max)} floor spans occupied. Installed arrangements move with you; those you take down are not refunded.`);
    for (const view of ledgerRows) {
      const stat = engine.stat(view.record.id); view.row.hidden = !engine.visible(view.record.id);
      setText(view.amount, `${held(stat.value)} / ${number(stat.max)}`); view.bar.update(stat.value, stat.max);
      const capped = stat.value >= stat.max; view.row.classList.toggle("at-cap", capped);
      view.row.classList.toggle("is-filtering", filterResource === view.record.id);
      const rate = resourceRate(view.record.id);
      if (view.body) { setText(view.note, rate); view.note.hidden = !rate; }
      view.detail.update(engine.tooltip(view.record.id));
      setText(view.tipFlow, [rate, capped ? "At capacity" : ""].filter(Boolean).join(" · ")); view.tipFlow.hidden = !view.tipFlow.textContent;
      const before = previous.get(view.record.id); previous.set(view.record.id, stat.value);
      if (!view.body && before !== undefined && stat.value > before + 1e-9) pulse(view.row, "tick-up", 600);
    }
    let visibleFamilies = 0;
    for (const view of familyRows) {
      const stat = engine.stat(view.record.id); view.row.hidden = !engine.visible(view.record.id); if (view.row.hidden) continue;
      visibleFamilies++; setText(view.amount, `${number(stat.value)} / ${number(stat.max)}`);
      while (view.pips.children.length < Math.floor(stat.max)) view.pips.append(element("span", "family-pip"));
      while (view.pips.children.length > Math.floor(stat.max)) view.pips.lastElementChild!.remove();
      Array.from(view.pips.children).forEach((pip, index) => pip.classList.toggle("filled", index < stat.value));
      setText(view.exp, !stat.open ? view.record.needtext ?? "Method not open." : stat.value >= stat.max ? "Current limit reached" : `${number(stat.exp)} / ${60 * (stat.value + 1)} XP toward level ${stat.value + 1}`);
      view.detail.update(engine.tooltip(view.record.id));
    }
    ui("families-panel").hidden = visibleFamilies === 0;
    const startable = new Map<Tab, number>();
    for (const view of groupViews) {
      let count = 0;
      for (const cell of view.cells) if (cell.update()) count++;
      view.details.hidden = view.grid.querySelector(".task-cell:not([hidden])") === null;
      setText(view.count, count ? String(count) : "");
      startable.set(view.definition.tab, (startable.get(view.definition.tab) ?? 0) + count);
    }
    for (const view of familyExplanations) {
      view.row.hidden = !engine.visible(view.record.id);
      const stat = engine.stat(view.record.id);
      setText(view.headingLevel, `Level ${number(stat.value)} / ${number(stat.max)}`);
      view.detail.update(engine.tooltip(view.record.id));
      let count = 0;
      for (const cell of view.cells) if (cell.update()) count++;
      startable.set("character", (startable.get("character") ?? 0) + count);
      view.practice.hidden = view.cells.every(cell => cell.cell.hidden);
    }
    for (const group of doneGroups.values()) {
      const shown = group.grid.querySelectorAll(".task-cell:not([hidden])").length;
      group.details.hidden = shown === 0; setText(group.count, shown ? String(shown) : "");
    }
    const apprenticed = current("shu_apprentice") > 0;
    // The spellbook opens with the first technique the method makes available.
    const techniquesVisible = cells.some(cell => cell.tab === "techniques" && !cell.cell.hidden);
    // How many methods are held ready, of how many can be; absent until the content defines attunement at all.
    const slots = engine.records.some(record => record.id === "attune_slots") ? engine.stat("attune_slots") : undefined;
    setText(ui("attune-count"), slots ? `Attuned ${number(slots.value)} / ${number(slots.max)}` : "");
    ui("attune-count").hidden = !slots;
    tabViews.get("techniques")!.button.hidden = !techniquesVisible;
    tabViews.get("home")!.button.hidden = !apprenticed;
    if ((selectedTab === "techniques" && !techniquesVisible) || (selectedTab === "home" && !apprenticed)) selectedTab = "tasks";
    for (const id of ["techniques", "home"] as const) {
      const shown = !tabViews.get(id)!.button.hidden;
      if (shown && tabShown.get(id) === false && selectedTab !== id) unseenTabs.add(id);
      tabShown.set(id, shown);
    }
    for (const [id, view] of tabViews) {
      const count = startable.get(id) ?? 0;
      setText(view.count, count ? String(count) : "");
      const hasNew = id !== selectedTab && !view.button.hidden && (unseenTabs.has(id)
        || cells.some(cell => cell.tab === id && !cell.cell.hidden && !seenIds.has(cell.record.id) && !doneWith(cell.record, engine.stat(cell.record.id)))
        || engine.records.some(record => engine.visible(record.id) && !seenIds.has(record.id) && (
          id === "character" ? record.kind === "lead"
            : id === "tasks" && Boolean(record.breakthrough) && engine.stat(record.id).value < engine.stat(record.id).max)));
      view.badge.hidden = !hasNew;
      view.button.setAttribute("aria-selected", String(id === selectedTab)); view.button.tabIndex = id === selectedTab ? 0 : -1; view.panel.hidden = id !== selectedTab;
    }
    for (const view of breakthroughPanels) view.update(active);
    const latest = [...breakthroughPanels].reverse().find(view => current(view.record.id) > 0)?.record;
    ui("completion").hidden = !latest || seenCompletion === latest.id; ui("completion-detail").hidden = !foundationReached;
    if (latest) {
      setText(ui("completion-title"), latest.id === "settling" ? "Foundation reached" : `${latest.breakthrough?.title ?? latest.name}: ${standing}`);
      setText(ui("completion-text"), latest.id === "settling" ? "The method holds. What was an incomplete reading is now your own." : "The direction holds. The road beyond the ridge is open.");
      setText(ui("review-foundation"), latest.id === "settling" ? "Review Foundation" : "Review your path");
    }
    const atWaystation = current("waystation") > 0;
    setText(ui("completion-heading"), atWaystation ? "Beyond the waystation" : "Beyond Foundation");
    setText(ui("completion-stage"), atWaystation ? "Stage complete" : "The ridge lies ahead");
    setText(ui("completion-note"), atWaystation
      ? "These leads continue beyond the ridge waystation. Their journeys are not yet available."
      : "Old Ridge rises beyond the porters' path. Walk its outskirts to find the teachings that choose a First Direction; any one of them carries you to the waystation.");
    ui("slip").hidden = current("jade_slip") === 0; ui("character-methods").hidden = visibleFamilies === 0;
    setText(ui("character-stage-detail"), !foundationReached ? "Mortal, no breakthrough yet" : latest && latest.id !== "settling" ? `Foundation · ${latest.breakthrough?.title ?? latest.name}` : "Foundation");
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
      setText(meta.firstElementChild as HTMLElement, entry.kind === "cap" ? "Limit" : entry.kind === "story" ? "Story" : entry.kind === "fight" ? "Fight" : entry.kind); setText(meta.lastElementChild as HTMLElement, duration(entry.activitySeconds)); setText(node.lastElementChild as HTMLElement, entry.text);
      if (journal.children[index] !== node) journal.insertBefore(node, journal.children[index] ?? null);
    });
    ui("journal-empty").hidden = entries.length > 0;
    const lastMeaningful = [...state.log].reverse().find(entry => entry.kind !== "completion"); if (lastMeaningful) announce(lastMeaningful.text);
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
    setText(ui("return-title"), `While you were away · ${duration(summary.awaySeconds)}`);
    ui("return-list").replaceChildren(...lines.map(text => element("li", "", text)));
    ui("return").hidden = false;
  }
  render();
  return {
    render,
    showReturn,
    setEngine(next: GameEngine) {
      engine = next; editorFor = undefined; previous.clear(); seenIds = new Set(engine.state.visibleIds); filterResource = null;
      // A confirmation left open belongs to the journey that has just been replaced.
      pendingConfirmation = null; ui("confirmation").hidden = true;
      ui("return").hidden = true; render();
    },
    destroy() { disposed = true; root.replaceChildren(); },
  };
}
