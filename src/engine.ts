import { evaluateCondition, evaluateExpression, parseExpression, type ExpressionNode } from "./expression";
import { DERIVED_FIELDS, type AdvanceResult, type Availability, type BillRow, type Changes, type DerivedField, type FightProjection, type FightVerdict, type Fighter, type Foe, type GameRecord, type GameState, type LogEntry, type Objective, type Stat, type TooltipBlock, type WorldState } from "./types";

const UNBOUNDED = 1_000_000_000_000;
const EPSILON = 1e-9;
export const WAITING_MAX = 6;
/** Discounts stack, but nothing costs less than half its listed amount. */
export const MAX_DISCOUNT = 0.5;
export const BANK_BASE_CAP = 3600;
export const EXP_PER_LEVEL = 60;
/** Two stores whose amount is an occupancy count: the engine fills them in, content only raises their caps. */
export const HOME_SPACE = "home_space";
export const ATTUNE_SLOTS = "attune_slots";
/** The cultivator's fight stats; apart from Life only their `max` carries meaning. */
export const LIFE = "life";
export const STRIKE = "strike";
export const GUARD = "guard";
export const SPEED = "speed";
export const HIT = "hit";
export const DODGE = "dodge";
export const FIGHT_STATS = [STRIKE, GUARD, SPEED, HIT, DODGE] as const;
/** A side swings each time its gauge, filling at its Speed per second, reaches this: Speed 1 swings every 5 s. */
export const GAUGE = 5;
/** No one is untouchable. */
export const DODGE_MAX = 60;
const FIGHT_HELD = "A fight cannot be left halfway.";
export const FIGHT_LINES = 200;
/** Verdicts from worst to best; a flip is a change that moves the verdict up this list. */
export const FIGHT_VERDICTS: readonly FightVerdict[] = ["hopeless", "loss", "close", "likely", "certain"];
/** A run that never completes still ends a projection somewhere: a day of fight seconds. */
const FIGHT_SECONDS_MAX = 86_400;
/** Said of a cap that no record in the content can raise. */
const NOTHING_RAISES = "Nothing you know of raises this further.";

const derivedFields = new Set<string>(DERIVED_FIELDS);
/** Two stores the engine fills in; content only raises their caps, and neither is ever a reward. */
const countedStores = new Set([HOME_SPACE, ATTUNE_SLOTS]);
const shown = (amount: number): number => Math.round(amount * 100) / 100;
const passiveKinds = new Set(["resource", "family", "flag", "lead"]);
const oneShotKinds = new Set(["purchase", "arrangement", "home", "class", "breakthrough", "teaching", "recipe"]);
const clone = <T>(value: T): T => structuredClone(value);
/** A record name inside a sentence: "through a larger coin pouch", not "through A larger coin pouch". */
const inSentence = (name: string): string => name.replace(/^(A|An|The) /, article => article.toLowerCase());
const list = (items: string[]): string => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
/** `coin` and `coin.value` are one path. */
const fieldPath = (path: string): string => path.includes(".") ? path : `${path}.value`;
/** How far a line has grown past content's own number, and the records responsible. */
interface Growth { amount: number; labels: string[] }
/** When an `at` step pays: "at level 3" on a knowledge, "after 30 s" of practice, "at 5 uses" otherwise. */
const thresholdText = (record: GameRecord, threshold: number): string =>
  record.kind === "family" ? `at level ${threshold}` : record.length === "continuous" ? `after ${threshold} s` : `at ${threshold} uses`;

type Amount = number | string;
/** A contribution to one derived field of one record. */
interface DerivedEntry { id: string; field: DerivedField | "bank"; amount: Amount }
/** `X.mod.Y`: a contribution to what record X itself pays toward Y. */
interface PatchEntry { target: string; path: string; amount: Amount }
interface Table { derived: DerivedEntry[]; patches: PatchEntry[]; effects: [string, Amount][] }
interface Compiled {
  record: GameRecord;
  /** `mod`: paid once while owned, or per unit held for a resource. */
  owned: Table;
  /** `perLevel`: a family's payout for every level it holds, and the table `X.mod.Y` patches. */
  perLevel: Table;
  /** `held`: paid while the technique holds an attunement place. */
  held: Table;
  at: { threshold: number; table: Table }[];
  every: { period: number; table: Table }[];
}

const emptyTable = (): Table => ({ derived: [], patches: [], effects: [] });

function compileTable(changes: Changes | undefined): Table {
  const table = emptyTable();
  for (const [path, amount] of Object.entries(changes ?? {})) {
    const parts = path.split("."), id = parts[0]!, field = parts[1] ?? "value";
    if (parts.length > 2 && field === "mod") table.patches.push({ target: id, path: parts.slice(2).join("."), amount });
    else if (parts.length > 2) table.effects.push([path, amount]);
    else if (id === "bank" && (field === "max" || field === "cap")) table.derived.push({ id, field: "bank", amount });
    else if (derivedFields.has(field)) table.derived.push({ id, field: field as DerivedField, amount });
    else table.effects.push([path, amount]);
  }
  return table;
}

const tableEntries = (table: Table): number => table.derived.length + table.patches.length + table.effects.length;
const isDynamic = (table: Table): boolean =>
  table.derived.some(entry => typeof entry.amount === "string") || table.patches.some(entry => typeof entry.amount === "string");

/** One authoritative simulation shared by the browser, offline settlement and tests. */
export class GameEngine {
  readonly records: readonly GameRecord[];
  state: GameState;
  private readonly byId: Map<string, GameRecord>;
  private readonly compiled: Compiled[];
  private readonly compiledById: Map<string, Compiled>;
  private readonly baselines: Map<string, Pick<Stat, DerivedField>>;
  /** Discovery is a set, so it is kept in content order and a delta save round-trips it exactly. */
  private readonly order: Map<string, number>;
  private readonly tagged: Map<string, GameRecord[]>;
  /** Modifier amounts written as expressions can read what the pass itself settles, so it must iterate. */
  private readonly dynamicMods: boolean;
  private pendingCaps = new Set<string>();
  private lastReason: string | undefined;
  /** Every swing in a fight rolls against this; tests script it. */
  random: () => number = Math.random;

  constructor(records: readonly GameRecord[], state?: GameState) {
    this.records = records;
    this.byId = new Map(records.map(record => [record.id, record]));
    if (this.byId.size !== records.length) throw new Error("Content contains duplicate record ids.");
    this.compiled = records.map(record => ({
      record,
      owned: compileTable(record.mod),
      perLevel: compileTable(record.perLevel),
      held: compileTable(record.held),
      at: Object.entries(record.at ?? {}).map(([threshold, changes]) => ({ threshold: Number(threshold), table: compileTable(changes) })),
      every: Object.entries(record.every ?? {}).map(([period, changes]) => ({ period: Number(period), table: compileTable(changes) })),
    }));
    this.compiledById = new Map(this.compiled.map(entry => [entry.record.id, entry]));
    this.order = new Map(records.map((record, index) => [record.id, index]));
    this.baselines = new Map(records.map(record => [record.id, GameEngine.baseline(record)]));
    this.dynamicMods = this.compiled.some(entry =>
      [entry.owned, entry.perLevel, entry.held, ...entry.at.map(step => step.table), ...entry.every.map(step => step.table)].some(isDynamic));
    this.tagged = new Map();
    for (const record of records) {
      for (const tag of record.tags ?? []) {
        const members = this.tagged.get(tag) ?? [];
        members.push(record);
        this.tagged.set(tag, members);
      }
    }
    if (state) {
      this.state = clone(state);
      // A loaded life recomputes everything derivable before it is asked anything.
      this.reconcile(false);
      return;
    }
    const stats: Record<string, Stat> = {};
    for (const record of records) stats[record.id] = GameEngine.initialStat(record);
    const world: WorldState = {
      stats, active: null, waiting: [], activitySeconds: 0,
      visibleIds: [], lockedIds: [], attuned: [], eventIds: [], capHits: [], log: [], wallRemainder: 0,
    };
    this.state = { ...world, bank: { seconds: 0, cap: BANK_BASE_CAP, accelerating: false } };
    this.reconcile(false);
  }

  /** Content's own starting point for a record, before any modifier reaches it. */
  static initialStat(record: GameRecord): Stat {
    return {
      value: 0, exp: 0, reps: 0, ticks: 0, started: false, paid: false,
      ...GameEngine.baseline(record),
      ...record.initial,
    };
  }

  private static baseline(record: GameRecord): Pick<Stat, DerivedField> {
    return {
      max: record.max ?? (oneShotKinds.has(record.kind) || record.kind === "flag" ? 1 : UNBOUNDED),
      rate: record.kind === "resource" ? 0 : 1,
      open: true,
      length: typeof record.length === "number" ? record.length : 0,
      yield: 0,
      discount: 0,
      ...pickDerived(record.initial),
    };
  }

  has(id: string): boolean { return this.byId.has(id); }

  record(id: string): GameRecord {
    const record = this.byId.get(id);
    if (!record) throw new Error(`Unknown record: ${id}`);
    return record;
  }

  stat(id: string): Stat {
    const stat = this.state.stats[id];
    if (!stat || !Object.hasOwn(this.state.stats, id)) throw new Error(`Unknown stat: ${id}`);
    return stat;
  }

  snapshot(): GameState { return clone(this.state); }

  /** How many owned records carry a tag; the counter behind `g.t_<tag>`. */
  tagCount(tag: string): number {
    let count = 0;
    for (const record of this.tagged.get(tag) ?? []) {
      if (this.stat(record.id).value > 0 && !this.state.lockedIds.includes(record.id)) count++;
    }
    return count;
  }

  resolve = (path: string): number | boolean => {
    const normalized = path.startsWith("g.") ? path.slice(2) : path;
    if (normalized === "bank" || normalized === "bank.value" || normalized === "bank.seconds") return this.state.bank.seconds;
    if (normalized === "bank.max" || normalized === "bank.cap") return this.state.bank.cap;
    const [id, field = "value", ...rest] = normalized.split(".");
    if (rest.length) throw new Error(`Unsupported stat path: ${path}`);
    // A tag is read by its own name: `tags: ["t_channel"]` is counted by `g.t_channel`.
    if (!this.byId.has(id!)) {
      if (field === "value" && this.tagged.has(id!)) return this.tagCount(id!);
      throw new Error(`Unknown stat: ${id}`);
    }
    const stat = this.stat(id!);
    if (!Object.hasOwn(stat, field)) throw new Error(`Unknown stat field: ${path}`);
    const value = stat[field as keyof Stat];
    return typeof value === "boolean" ? Number(value) : value;
  };

  value(value: Amount): number {
    const result = typeof value === "number" ? value : Number(evaluateExpression(value, this.resolve));
    if (!Number.isFinite(result)) throw new Error("Content produced a non-finite amount.");
    return result;
  }

  condition(expression?: string): boolean { return evaluateCondition(expression, this.resolve); }

  // ---------------------------------------------------------------- recompute

  /**
   * Rebuilds every derived field from content and the character's authoritative history: starting
   * values, the modifiers of owned records, a family's payout for each level, thresholds already
   * passed, repetition curves, and the per-unit modifiers of resources held. `X.mod.Y` patches are
   * folded into X's own payout before X pays it, so a late upgrade raises what early levels gave.
   * Nothing else may write these fields; it runs after every mutation and on load.
   */
  recompute(): void {
    for (let pass = 0; pass < 8; pass++) {
      const moved = this.recomputeOnce();
      // With constant modifiers the derived fields are a pure function of what the pass just settled,
      // so a single sweep is already the fixed point unless an occupancy or a cap clamp moved.
      if (!moved.counts && !(this.dynamicMods && moved.derived)) return;
    }
  }

  private recomputeOnce(): { derived: boolean; counts: boolean } {
    const totals = new Map<string, Partial<Record<DerivedField, number>>>();
    const patched = new Map<string, Map<string, number>>();
    let bankCap = BANK_BASE_CAP;
    const add = (id: string, field: DerivedField | "bank", amount: number) => {
      if (!Number.isFinite(amount)) throw new Error(`Non-finite modifier to ${id}.${field}.`);
      if (field === "bank") { bankCap += amount; return; }
      if (!this.byId.has(id)) throw new Error(`Modifier names unknown record ${id}.`);
      const target = totals.get(id) ?? {};
      target[field] = (target[field] ?? 0) + amount;
      totals.set(id, target);
    };

    this.eachContribution((table, scale) => {
      for (const entry of table.derived) add(entry.id, entry.field, this.value(entry.amount) * scale);
      for (const entry of table.patches) {
        const target = patched.get(entry.target) ?? new Map<string, number>();
        target.set(entry.path, (target.get(entry.path) ?? 0) + this.value(entry.amount) * scale);
        patched.set(entry.target, target);
      }
    });
    // Patches are folded into X's own payout, so they reach every level and every unit X already has.
    for (const [id, paths] of patched) {
      const compiled = this.compiledById.get(id);
      if (!compiled) throw new Error(`Modifier patch names unknown record ${id}.`);
      const scale = this.payoutScale(compiled);
      if (!scale) continue;
      for (const [path, amount] of paths) {
        const [target, field = "value"] = path.split(".");
        if (target === "bank" && (field === "max" || field === "cap")) { bankCap += amount * scale; continue; }
        if (derivedFields.has(field)) add(target!, field as DerivedField, amount * scale);
      }
    }

    let derived = false;
    for (const { record } of this.compiled) {
      const stat = this.stat(record.id), base = this.baselines.get(record.id)!, total = totals.get(record.id);
      for (const field of DERIVED_FIELDS) {
        const sum = total?.[field] ?? 0;
        let next: number | boolean;
        if (field === "open") next = base.open || sum > 0;
        else if (field === "length") next = record.length === "continuous" ? 0 : Math.max(1, base.length + sum);
        else next = Math.max(0, (base[field] as number) + sum);
        if (stat[field] !== next) { (stat as unknown as Record<string, unknown>)[field] = next; derived = true; }
      }
    }
    if (this.state.bank.cap !== bankCap) { this.state.bank.cap = Math.max(0, bankCap); derived = true; }
    this.state.bank.seconds = Math.min(this.state.bank.seconds, this.state.bank.cap);
    return { derived, counts: this.settleCounts() };
  }

  /** Occupancy counts and cap clamps; they close the loop because other modifiers scale with them. */
  private settleCounts(): boolean {
    let changed = false;
    const set = (id: string, amount: number) => {
      if (!this.byId.has(id)) return;
      const stat = this.stat(id);
      if (stat.value === amount) return;
      stat.value = amount;
      changed = true;
    };
    let spans = 0;
    for (const record of this.records) if (record.space && this.stat(record.id).value > 0) spans += record.space;
    set(HOME_SPACE, spans);
    if (this.byId.has(ATTUNE_SLOTS)) {
      const limit = Math.floor(this.stat(ATTUNE_SLOTS).max + EPSILON);
      if (this.state.attuned.length > limit) {
        for (const id of this.state.attuned.splice(Math.max(0, limit))) this.log("method", `${this.record(id).name ?? id} is released: there is no place left to hold it.`);
        changed = true;
      }
      set(ATTUNE_SLOTS, this.state.attuned.length);
    }
    for (const record of this.records) {
      const stat = this.stat(record.id);
      if (stat.value > stat.max) { stat.value = stat.max; changed = true; }
      else if (stat.value < stat.max && stat.max - stat.value < EPSILON) stat.value = stat.max;
      if (record.kind === "family" && stat.value >= stat.max && stat.exp !== 0) stat.exp = 0;
    }
    return changed;
  }

  /** Every table a record currently pays from, with the multiplier it pays at, the paying record, and an `at` step's threshold. */
  private eachContribution(visit: (table: Table, scale: number, source: GameRecord, threshold?: number) => void): void {
    for (const compiled of this.compiled) {
      const source = compiled.record, value = this.stat(source.id).value;
      if (tableEntries(compiled.owned)) {
        const scale = source.kind === "resource" ? value : value > 0 ? 1 : 0;
        if (scale) visit(compiled.owned, scale, source);
      }
      if (value && tableEntries(compiled.perLevel)) visit(compiled.perLevel, value, source);
      if (tableEntries(compiled.held) && this.state.attuned.includes(source.id)) visit(compiled.held, 1, source);
      if (!compiled.at.length && !compiled.every.length) continue;
      const count = this.count(source);
      for (const { threshold, table } of compiled.at) if (count + EPSILON >= threshold) visit(table, 1, source, threshold);
      for (const { period, table } of compiled.every) {
        const times = period > 0 ? Math.floor(count / period) : 0;
        if (times > 0) visit(table, times, source);
      }
    }
  }

  /**
   * Who pays into `id.field` now and how much, for the "(+2 from 40 uses)" note on a grown value. With `patchOf`,
   * it is the `X.mod.Y` patches into record `patchOf`'s own payout path `id.field` instead, before that record's
   * own scale. A threshold on the viewed record's own curve is named by its count alone.
   */
  private contributions(path: string, viewer: string, patchOf?: string): Growth {
    const bySource = new Map<string, { amount: number; label: string; threshold: number }>();
    this.eachContribution((table, scale, source, threshold) => {
      let amount = 0;
      if (patchOf === undefined) {
        for (const entry of table.derived) if (`${entry.id}.${entry.field}` === path) amount += this.value(entry.amount) * scale;
      } else {
        for (const entry of table.patches) if (entry.target === patchOf && fieldPath(entry.path) === path) amount += this.value(entry.amount) * scale;
      }
      if (!amount) return;
      const name = source.name ?? source.id, perLevel = table === this.compiledById.get(source.id)!.perLevel;
      const counted = threshold === undefined ? "" : source.kind === "family" ? `${name} ${threshold}`
        : `${threshold}${source.length === "continuous" ? " s" : " uses"}`;
      const label = perLevel ? `${name} ${shown(this.stat(source.id).value)}`
        : counted && source.kind !== "family" && source.id !== viewer ? `${name} ${counted}` : counted || name;
      const key = `${source.id}:${perLevel ? "level" : threshold === undefined ? "own" : "at"}`, known = bySource.get(key);
      if (!known) bySource.set(key, { amount, label, threshold: threshold ?? 0 });
      else {
        known.amount += amount;
        if ((threshold ?? 0) >= known.threshold) Object.assign(known, { label, threshold: threshold ?? 0 });
      }
    });
    const entries = [...bySource.values()].filter(entry => Math.abs(entry.amount) > EPSILON);
    return { amount: entries.reduce((sum, entry) => sum + entry.amount, 0), labels: entries.map(entry => entry.label) };
  }

  /** What a patch into X's own payout is multiplied by: a family's levels, a resource's units, else ownership. */
  private payoutScale(compiled: Compiled): number {
    const value = this.stat(compiled.record.id).value;
    if (compiled.record.kind === "family") return value;
    return compiled.record.kind === "resource" ? value : value > 0 ? 1 : 0;
  }

  /** What a record's thresholds count: levels for a family, activity seconds for practice, completions otherwise. */
  private count(record: GameRecord): number {
    const stat = this.stat(record.id);
    if (record.kind === "family") return stat.value;
    return record.length === "continuous" ? stat.ticks : stat.reps;
  }

  // ------------------------------------------------------------ availability

  /**
   * A wall: the need fails only on at-limit comparisons (a stat against its own max), never on unmet requirements.
   * Floor and attunement places are occupancy the player can free, so a comparison against them is never a wall.
   */
  atLimitWall(record: GameRecord): boolean {
    if (!record.need || this.condition(record.need)) return false;
    const atoms: ExpressionNode[] = [];
    const collect = (node: ExpressionNode): void => {
      if (node.kind === "binary" && (node.operator === "&&" || node.operator === "||")) { collect(node.left); collect(node.right); }
      else atoms.push(node);
    };
    collect(parseExpression(record.need));
    const failing = atoms.filter(atom => !evaluateExpression(atom, this.resolve));
    return failing.length > 0 && failing.every(atom => {
      const refs: string[] = [];
      const gather = (node: ExpressionNode): void => {
        if (node.kind === "reference") refs.push(node.path);
        else if (node.kind === "unary") gather(node.operand);
        else if (node.kind === "binary") { gather(node.left); gather(node.right); }
      };
      gather(atom);
      return refs.some(ref => {
        const store = ref.replace(/^g\./, "").slice(0, -4);
        return ref.endsWith(".max") && refs.includes(ref.slice(0, -4)) && !countedStores.has(store);
      });
    });
  }

  /** A locked record is gone from the world, not merely undiscovered. */
  locked(id: string): boolean { return this.state.lockedIds.includes(id); }
  visible(id: string): boolean { return this.state.visibleIds.includes(id) && !this.locked(id); }

  /** Resources whose caps end a run; an empty list means the activity has no such stopping point. */
  fillTargets(record: GameRecord): string[] {
    const named = record.fill === undefined ? [] : typeof record.fill === "string" ? [record.fill] : record.fill;
    return named.filter(id => this.byId.has(id));
  }

  filled(record: GameRecord): boolean {
    const targets = this.fillTargets(record);
    return targets.length > 0 && targets.every(id => this.stat(id).value + EPSILON >= this.stat(id).max);
  }

  /** Persistence can reuse the action contract after validating the JSON's shape. */
  objectiveAvailability(id: string, objective: Objective, progress?: number): Availability {
    const record = this.record(id), stat = this.stat(id);
    if (record.length === undefined || passiveKinds.has(record.kind)) return { ok: false, reason: "This record cannot have an active objective." };
    if (progress !== undefined && (!Number.isFinite(progress) || progress < 0 || (record.length !== "continuous" && progress + EPSILON >= stat.length))) {
      return { ok: false, reason: "The saved activity progress is outside its current duration." };
    }
    if (record.length !== "continuous" && (!this.visible(id) || stat.value >= stat.max || stat.reps >= stat.max)) {
      return { ok: false, reason: "The saved activity is no longer available." };
    }
    const reason = this.objectiveProblem(record, objective);
    return reason ? { ok: false, reason } : { ok: true, reason: "Ready." };
  }

  availability(id: string): Availability {
    const record = this.record(id), stat = this.stat(id);
    const fail = (reason: string): Availability => ({ ok: false, reason });
    if (this.locked(id)) return fail("This chapter has closed.");
    if (!this.visible(id)) return fail("This has not been discovered.");
    if (passiveKinds.has(record.kind)) return fail(record.kind === "lead" ? "This lead continues beyond the opening." : "This is a capability, not an activity.");
    if (stat.value >= stat.max || stat.reps >= stat.max) return fail("Completed.");
    if (record.attune && !this.isAttuned(id)) return fail(`${record.name ?? id} must be attuned before it can be used.`);
    if (this.filled(record)) {
      const names = this.fillTargets(record).map(target => this.record(target).name ?? target);
      return fail(`${list(names)} ${names.length > 1 ? "are" : "is"} already full.`);
    }
    if (record.breakthrough) {
      if (!this.condition(record.breakthrough.core)) return fail(record.breakthrough.coreLabel ?? "The core method is not ready.");
      const ready = record.breakthrough.pointers.filter(pointer => this.condition(pointer.when)).length;
      if (ready < record.breakthrough.required) return fail(`${ready} of ${record.breakthrough.required} supporting conditions are ready.`);
    }
    // A paid, unfinished run is already bought; only its resumption remains.
    if (!stat.paid) {
      if (record.space && this.stat(HOME_SPACE).max - this.stat(HOME_SPACE).value < record.space) {
        return fail(this.floorSpaceReason(record.space));
      }
      if (record.slot) {
        if (!this.homeSlots().includes(record.slot)) return fail(`This home has no ${record.slot} place.`);
        const holder = this.slotHolder(record.slot);
        if (holder && holder.id !== id) return fail(`The ${record.slot} place holds ${holder.name ?? holder.id}; take it down on Home first.`);
      }
      const payment = this.payment(record);
      // A bill larger than the store can hold needs a bigger store first, which the need text alone does not say.
      for (const [resource, amount] of Object.entries(payment)) {
        const held = this.stat(resource);
        if (amount <= held.max + EPSILON) continue;
        const sources = this.capSources(resource).map(source => inSentence(source.name ?? source.id));
        return fail(`${this.record(resource).name ?? resource}: ${shown(amount)} needed, but you can hold only ${held.max}${sources.length ? `; raise it through ${sources.join(" or ")}` : ""}.`);
      }
      // What is short is named before the need, which would otherwise recite the whole bill.
      const short = Object.entries(payment).filter(([resource, amount]) => this.stat(resource).value + EPSILON < amount)
        .map(([resource, amount]) => `${this.record(resource).name ?? resource}: ${shown(amount)} needed, ${Math.floor(this.stat(resource).value * 10 + EPSILON) / 10} held.`);
      if (short.length) return fail(short.join(" "));
      if (!this.condition(record.need)) return fail(record.needtext ?? "The requirements are not met.");
    }
    const short = record.length === undefined ? undefined : this.unsustained(record);
    if (short) return fail(`${this.record(short).name ?? short} cannot sustain this activity.`);
    if (record.encounter && this.stat(LIFE).value + EPSILON < 1) {
      const life = this.stat(LIFE), regen = this.state.active ? this.netRate(LIFE) : life.open ? life.rate : 0;
      const wait = regen > EPSILON ? Math.ceil((1 - life.value) / regen - EPSILON) : undefined;
      const ready = wait === undefined ? "" : wait < 120 ? `; ready in ~${wait} s` : `; ready in ~${Math.round(wait / 60)} min`;
      return fail(`${this.record(LIFE).name ?? LIFE}: you are in no state to fight${ready}.`);
    }
    // An encounter cannot stop halfway, so it starts only with enough in reserve to finish.
    if (record.encounter) {
      for (const [resource, needed] of Object.entries(this.reserveNeeded(record))) {
        if (this.stat(resource).value + EPSILON < needed) return fail(`${this.record(resource).name ?? resource}: ${needed} needed to see it through.`);
      }
    }
    return { ok: true, reason: "Ready." };
  }

  /** Whole units each drained reservoir must hold for the rest of this run, after its own regeneration. */
  reserveNeeded(record: GameRecord): Record<string, number> {
    const stat = this.stat(record.id), needed: Record<string, number> = {};
    if (typeof record.length !== "number") return needed;
    const seconds = Math.max(0, stat.length - stat.exp) / Math.max(this.speed(record), EPSILON);
    for (const [id, amount] of Object.entries(this.drain(record))) {
      const reservoir = this.stat(id), regen = reservoir.open ? reservoir.rate : 0;
      const units = Math.ceil((amount - regen) * seconds - EPSILON);
      if (units > 0) needed[id] = Math.min(reservoir.max, units);
    }
    return needed;
  }

  /** The first reservoir that cannot pay one more second of this activity's drain. */
  private unsustained(record: GameRecord): string | undefined {
    const drain = this.drain(record);
    return Object.keys(drain).find(id => {
      const resource = this.stat(id);
      return resource.value + (resource.open ? resource.rate : 0) + EPSILON < drain[id]!;
    });
  }

  /** Per-second spending of a running activity, after discounts. */
  drain(record: GameRecord): Record<string, number> {
    const drain: Record<string, number> = {};
    for (const changes of [record.run, record.strain]) {
      for (const [id, amount] of Object.entries(changes ?? {})) drain[id] = (drain[id] ?? 0) + this.discounted(record, id, this.value(amount));
    }
    return drain;
  }

  private discounted(record: GameRecord, resource: string, amount: number): number {
    const kept = (1 - this.stat(record.id).discount) * (1 - this.stat(resource).discount);
    return amount * Math.max(1 - MAX_DISCOUNT, Math.min(1, kept));
  }

  /**
   * A waiting pursuit that drains a regenerating reservoir resumes only once the reservoir covers the rest of
   * its run (whole units), or is full for continuous practice, so it does not stop again a second later.
   */
  private recovered(record: GameRecord): boolean {
    const stat = this.stat(record.id);
    const seconds = record.length === "continuous" ? Infinity : Math.max(0, stat.length - stat.exp) / Math.max(this.speed(record), EPSILON);
    return Object.entries(this.drain(record)).every(([id, amount]) => {
      const reservoir = this.stat(id), regen = reservoir.open ? reservoir.rate : 0;
      if (regen <= 0 || amount - regen <= EPSILON) return true;
      return reservoir.value + EPSILON >= Math.min(reservoir.max, Math.ceil((amount - regen) * seconds - EPSILON));
    });
  }

  /** Places offered by the current home. */
  homeSlots(): string[] {
    const home = this.records.find(record => record.kind === "home" && this.stat(record.id).value > 0 && !this.locked(record.id));
    return home?.slots ?? [];
  }

  slotHolder(slot: string): GameRecord | undefined {
    return this.records.find(record => record.slot === slot && this.stat(record.id).value > 0);
  }

  /**
   * The character's standing: the title of the highest class held, "Mortal" before any. Once a breakthrough is
   * held, only a class a breakthrough grants still names the character, and without one the breakthrough's
   * milestone does ("Foundation"), so the apprenticeship stops naming someone who has outgrown it.
   */
  title(): string {
    const breakthroughs = this.records.filter(record => record.kind === "breakthrough" && this.stat(record.id).value > 0);
    const granted = breakthroughs.flatMap(record => Object.keys(record.result ?? {}).filter(path => this.byId.has(path)).map(path => this.record(path)));
    let best: GameRecord | undefined;
    for (const record of this.records) {
      if (record.kind !== "class" || !record.title || this.stat(record.id).value <= 0) continue;
      if (breakthroughs.length && !granted.includes(record)) continue;
      if (!best || this.stat(record.id).value >= this.stat(best.id).value) best = record;
    }
    const milestone = granted.filter(record => record.kind === "flag").at(-1);
    return best?.title ?? milestone?.name ?? breakthroughs.at(-1)?.breakthrough?.title ?? "Mortal";
  }

  // --------------------------------------------------------------- attunement

  isAttuned(id: string): boolean { return this.state.attuned.includes(id); }

  /** Techniques that must hold an attunement slot before they can run. */
  attunable(id: string): boolean { return this.record(id).attune === true && this.visible(id); }

  attune(id: string): Availability {
    const record = this.record(id);
    if (!record.attune) return { ok: false, reason: "This needs no attunement." };
    if (this.locked(id)) return { ok: false, reason: "This chapter has closed." };
    if (!this.visible(id)) return { ok: false, reason: "This has not been discovered." };
    if (this.isAttuned(id)) return { ok: false, reason: "Already attuned." };
    if (!this.byId.has(ATTUNE_SLOTS)) return { ok: false, reason: "You have no way to hold a technique yet." };
    const limit = Math.floor(this.stat(ATTUNE_SLOTS).max + EPSILON);
    if (this.state.attuned.length >= limit) {
      return { ok: false, reason: limit === 0 ? "You have no attunement slot yet." : `All ${limit} attunement slots are taken; release one first.` };
    }
    this.state.attuned.push(id);
    // Taking up a technique is how it is acquired, so this is where its locks fall.
    this.applyLocks(record);
    this.log("method", `${record.name ?? id} is attuned.`);
    this.reconcile();
    return { ok: true, reason: "Attuned." };
  }

  /** Releasing is deliberate, so the technique leaves the slot outright instead of waiting to resume. */
  unattune(id: string): Availability {
    if (!this.isAttuned(id)) return { ok: false, reason: "This is not attuned." };
    const name = this.record(id).name ?? id;
    this.state.attuned = this.state.attuned.filter(entry => entry !== id);
    this.state.waiting = this.state.waiting.filter(entry => entry.id !== id);
    if (this.state.active?.id === id) {
      this.state.lastStop = this.lastReason = `${name} is no longer attuned.`;
      this.release();
      this.log("pause", this.state.lastStop);
    }
    this.log("method", `${name} is released.`);
    this.reconcile();
    return { ok: true, reason: "Released." };
  }

  // ------------------------------------------------------------------ actions

  defaultObjective(id: string): Objective {
    const record = this.record(id), stat = this.stat(id);
    if (record.length === "continuous") {
      const filling = this.fillTargets(record).find(target => this.stat(target).value < this.stat(target).max);
      if (filling) return { kind: "resource", id: filling, target: this.stat(filling).max };
      // Practice runs to the family's current cap rather than stopping at every level.
      if (record.train && this.stat(record.train).value < this.stat(record.train).max) {
        return { kind: "level", id: record.train, target: this.stat(record.train).max };
      }
      const outputs = { ...record.effect, ...Object.assign({}, ...Object.values(record.every ?? {})) } as Changes;
      const resource = Object.keys(outputs).find(path => !path.includes(".") && this.byId.get(path)?.kind === "resource" && this.value(outputs[path]!) > 0 && this.stat(path).value < this.stat(path).max);
      if (resource) return { kind: "resource", id: resource, target: this.stat(resource).max };
      if (record.train) return { kind: "level", id: record.train, target: this.stat(record.train).max };
    }
    return { kind: "repetitions", id, target: stat.reps + 1 };
  }

  /** The player's choice. Starting something is also what clears the last fight's report and the last stop. */
  start(id: string, objective?: Objective): Availability {
    return this.begin(id, objective, true);
  }

  /** A start the player chose, or one the slot made by itself: resuming the waiting list, or the idle filler. */
  private begin(id: string, objective: Objective | undefined, chosenByPlayer: boolean): Availability {
    const record = this.record(id);
    // Changing the objective of the running action does not buy its first run twice.
    if (this.state.active?.id === id) {
      const chosen = objective ?? this.defaultObjective(id);
      const invalid = this.objectiveProblem(record, chosen);
      if (invalid) return { ok: false, reason: invalid };
      this.state.active.objective = clone(chosen);
      return { ok: true, reason: "Objective updated." };
    }
    const available = this.availability(id);
    if (!available.ok) return available;
    if (record.length !== undefined && this.fighting()) return { ok: false, reason: FIGHT_HELD };
    const chosen = objective ?? this.defaultObjective(id);
    if (record.length !== undefined) {
      // A finished fight's report stays until the player chooses something; the slot refilling itself does not clear it.
      if (chosenByPlayer && this.state.fight?.result) delete this.state.fight;
      const invalid = this.objectiveProblem(record, chosen);
      if (invalid) return { ok: false, reason: invalid };
      // Only another sustained activity takes over the primary activity slot; an interrupted pursuit waits first in line.
      const interrupted = this.state.active;
      this.release();
      const queued = this.state.waiting.findIndex(entry => entry.id === id);
      if (queued >= 0) this.state.waiting.splice(queued, 1);
      if (interrupted && !this.record(interrupted.id).autoStart && this.state.waiting.length < WAITING_MAX) {
        this.state.waiting.unshift({ id: interrupted.id, progress: 0, objective: clone(interrupted.objective) });
      }
    }
    const stat = this.stat(id);
    if (typeof record.length !== "number") this.pay(record);
    else if (!stat.paid) this.payEntry(record);
    if (!stat.started) {
      stat.started = true;
      this.effects(record.onStart);
    }
    if (record.length === undefined) {
      this.complete(record);
      if (oneShotKinds.has(record.kind)) this.log("purchase", `${record.name ?? id} is now part of your life.`);
      this.reconcile();
      this.checkActive();
      this.fillIdle();
    } else {
      if (chosenByPlayer) delete this.state.lastStop;
      this.state.active = { id, progress: record.length === "continuous" ? 0 : stat.exp, objective: clone(chosen) };
      this.reconcile();
    }
    return { ok: true, reason: "Started." };
  }

  /** Adds a sustained pursuit to the end of the waiting list; it pays when it actually starts. */
  queue(id: string, objective?: Objective): Availability {
    const record = this.record(id);
    const fail = (reason: string): Availability => ({ ok: false, reason });
    if (record.length === undefined || passiveKinds.has(record.kind)) return fail("Only sustained activities can wait.");
    if (this.locked(id)) return fail("This chapter has closed.");
    if (!this.visible(id)) return fail("This has not been discovered.");
    if (this.state.active?.id === id) return fail("Already running.");
    if (this.state.waiting.some(entry => entry.id === id)) return fail("Already waiting.");
    if (this.state.waiting.length >= WAITING_MAX) return fail(`The waiting list is full (${WAITING_MAX}).`);
    const chosen = objective ?? this.defaultObjective(id);
    const invalid = this.objectiveProblem(record, chosen);
    if (invalid) return fail(invalid);
    this.state.waiting.push({ id, progress: 0, objective: clone(chosen) });
    if (!this.state.active || this.record(this.state.active.id).autoStart) this.resumeWaiting();
    return { ok: true, reason: "Waiting." };
  }

  dequeue(index: number): Availability {
    if (!Number.isInteger(index) || index < 0 || index >= this.state.waiting.length) return { ok: false, reason: "Nothing is waiting there." };
    this.state.waiting.splice(index, 1);
    return { ok: true, reason: "Removed from the waiting list." };
  }

  /** Arrangements without an `.open` modifier can be taken down; the bill is not returned. */
  removable(record: GameRecord): boolean {
    return record.kind === "arrangement" && !Object.keys(record.mod ?? {}).some(path => path.endsWith(".open"));
  }

  remove(id: string): Availability {
    const record = this.record(id), stat = this.stat(id);
    if (!this.removable(record)) return { ok: false, reason: "This cannot be taken down." };
    if (stat.value < 1) return { ok: false, reason: "This is not installed." };
    Object.assign(stat, { value: 0, reps: 0, exp: 0, paid: false });
    this.log("home", `${record.name ?? id} has been taken down. Its cost is not returned.`);
    this.reconcile();
    return { ok: true, reason: "Taken down." };
  }

  /** The take-down confirmation: the bill stays spent, and a lost attunement place releases a method. */
  removeWarning(id: string): string {
    const name = this.record(id).name ?? id, subject = /^(A|An|The) /.test(name) ? inSentence(name) : `the ${name}`;
    const trial = this.snapshot();
    Object.assign(trial.stats[id]!, { value: 0, reps: 0, exp: 0, paid: false });
    const after = new GameEngine(this.records, trial).state.attuned;
    const released = this.state.attuned.filter(method => !after.includes(method)).map(method => this.record(method).name ?? method);
    if (!released.length) return `Take down ${subject}? Its cost is not returned.`;
    const room = after.length === 0 ? "no method" : after.length === 1 ? "one method" : `${after.length} methods`;
    return `Taking down ${subject} leaves room for ${room}; ${list(released)} would be released. Its cost is not returned.`;
  }

  /** One row per resource the record's bill spends: what is held against what starting it takes. */
  billProgress(id: string): BillRow[] {
    return Object.entries(this.payment(this.record(id))).map(([resource, need]) =>
      ({ id: resource, label: this.record(resource).name ?? resource, held: this.stat(resource).value, need }));
  }

  /** How far a breakthrough's sign has come, when it is a single `g.x >= N` comparison. */
  pointerProgress(pointer: { when: string }): { value: number; target: number } | undefined {
    const node = parseExpression(pointer.when);
    if (node.kind !== "binary" || node.operator !== ">=" || node.left.kind !== "reference" || node.right.kind !== "literal" || typeof node.right.value !== "number") return undefined;
    return { value: Number(this.resolve(node.left.path)), target: node.right.value };
  }

  /** The player's stop; a fight in progress cannot be left halfway. */
  stop(): Availability {
    if (this.fighting()) return { ok: false, reason: FIGHT_HELD };
    this.release();
    return { ok: true, reason: "Stopped." };
  }

  private release(): void {
    const active = this.state.active;
    if (active && typeof this.record(active.id).length === "number" && this.stat(active.id).paid) this.stat(active.id).exp = active.progress;
    this.state.active = null;
    this.state.bank.accelerating = false;
    if (this.state.wallRemainder) {
      this.creditBank(this.state.wallRemainder);
      this.state.wallRemainder = 0;
    }
  }

  /**
   * Wall time advances the chosen activity first; only unused time enters the bank.
   * While accelerating, each wall second also spends one banked second on the same objective.
   * An empty slot is filled by an `autoStart` record whenever one is startable.
   */
  advance(seconds: number): AdvanceResult {
    this.requireSeconds(seconds);
    this.lastReason = undefined;
    const result: AdvanceResult = { activitySeconds: 0, bankedSeconds: 0, spentSeconds: 0 };
    let remaining = seconds + this.state.wallRemainder;
    this.state.wallRemainder = 0;
    this.fillIdle();
    let stalls = 0;
    while (remaining + EPSILON >= 1) {
      if (this.state.active) {
        if (this.tick()) {
          stalls = 0;
          remaining = Math.max(0, remaining - 1);
          result.activitySeconds++;
          if (this.state.active && this.state.bank.accelerating) this.bankTick(result);
        } else if (++stalls > 2) {
          // Content that starts but can never tick must not spin; the slot is cleared instead.
          this.release();
          break;
        }
        if (!this.state.active) this.fillIdle();
      } else if (this.state.waiting.length && this.passiveMoving()) {
        // Content thresholds sit on whole units and caps, so checking at each crossing resumes on the same second as checking every second.
        const step = Math.min(Math.floor(remaining + EPSILON), this.nextPassiveCrossing());
        this.passive(step);
        remaining -= step;
        result.bankedSeconds += this.creditBank(step);
        this.fillIdle();
      } else {
        const idle = Math.floor(remaining + EPSILON);
        this.passive(idle);
        result.bankedSeconds += this.creditBank(idle);
        remaining = Math.max(0, remaining - idle);
        break;
      }
    }
    if (this.state.active) this.state.wallRemainder = Math.max(0, remaining);
    else result.bankedSeconds += this.creditBank(Math.max(0, remaining));
    if (this.lastReason) result.reason = this.lastReason;
    return result;
  }

  /** Turns bank spending on or off for the running activity's objective. */
  setAccelerating(on: boolean): Availability {
    if (!on) { this.state.bank.accelerating = false; return { ok: true, reason: "Acceleration stopped." }; }
    if (!this.state.active) return { ok: false, reason: "Nothing is running to accelerate." };
    if (this.state.bank.seconds < 1) return { ok: false, reason: "The bank is empty." };
    this.state.bank.accelerating = true;
    return { ok: true, reason: "Accelerating." };
  }

  private bankTick(result: AdvanceResult): void {
    this.state.bank.seconds = Math.max(0, this.state.bank.seconds - 1);
    if (this.tick()) result.spentSeconds++;
    else this.state.bank.seconds = Math.min(this.state.bank.cap, this.state.bank.seconds + 1);
    if (this.state.bank.seconds + EPSILON < 1) this.state.bank.accelerating = false;
  }

  /** Passive income while no activity runs. */
  private passive(seconds: number): void {
    if (seconds <= 0) return;
    for (const record of this.records) {
      const stat = this.stat(record.id);
      if (record.kind === "resource" && stat.open && stat.rate > 0) this.change(record.id, stat.rate * seconds);
    }
    this.reconcile();
  }

  private passiveMoving(): boolean {
    return this.records.some(record => {
      const stat = this.stat(record.id);
      return record.kind === "resource" && stat.open && stat.rate > 0 && stat.value < stat.max;
    });
  }

  /** Whole seconds until some regenerating resource reaches its next whole unit or its cap. */
  private nextPassiveCrossing(): number {
    let seconds = Infinity;
    for (const record of this.records) {
      const stat = this.stat(record.id);
      if (record.kind !== "resource" || !stat.open || stat.rate <= 0 || stat.value >= stat.max) continue;
      const target = Math.min(stat.max, Math.floor(stat.value + EPSILON) + 1);
      seconds = Math.min(seconds, Math.ceil((target - stat.value) / stat.rate - EPSILON));
    }
    return Math.max(1, seconds);
  }

  private fillIdle(): void {
    if (this.state.active || this.resumeWaiting()) return;
    const filler = this.records.find(record => record.autoStart && this.availability(record.id).ok);
    if (!filler) return;
    this.begin(filler.id, undefined, false);
  }

  /** Starts the first waiting pursuit that can run, replacing an idle filler; drops entries that can never resume. */
  private resumeWaiting(): boolean {
    const waiting = this.state.waiting;
    for (let index = 0; index < waiting.length; index++) {
      const entry = waiting[index]!, record = this.record(entry.id), stat = this.stat(entry.id);
      const gone = this.locked(entry.id) ? "This chapter has closed."
        : stat.value >= stat.max || stat.reps >= stat.max ? "Completed." : this.objectiveProblem(record, entry.objective);
      if (gone) {
        waiting.splice(index--, 1);
        this.log("completion", `${record.name ?? entry.id} left the waiting list: ${gone}`);
        continue;
      }
      if (!this.availability(entry.id).ok || !this.recovered(record)) continue;
      waiting.splice(index, 1);
      return this.begin(entry.id, entry.objective, false).ok;
    }
    return false;
  }

  /** Records whose modifiers raise this store's cap; a family whose own levels are spent names its trainers instead. */
  capSources(id: string, indirect = true): GameRecord[] {
    const target = `${id}.max`;
    const sources = new Set<GameRecord>();
    for (const record of this.records) {
      if (!this.visible(record.id)) continue;
      const stat = this.stat(record.id);
      if (record.kind === "family" && stat.open && stat.value >= stat.max && indirect && this.value(record.perLevel?.[target] ?? 0) > 0) {
        for (const source of this.capSources(record.id, false)) sources.add(source);
      } else if (this.directSource(record, stat, target)) sources.add(record);
    }
    return [...sources];
  }

  /** Visible, still-usable records that give this family experience. */
  familyTrainers(id: string): GameRecord[] {
    const exp = `${id}.exp`;
    return this.records.filter(record => {
      if (record.id === id || !this.visible(record.id)) return false;
      const stat = this.stat(record.id);
      if (stat.value >= stat.max || stat.reps >= stat.max) return false;
      const changes = [record.result, record.effect, record.onStart, ...Object.values(record.at ?? {}), ...Object.values(record.every ?? {})];
      return record.train === id || changes.some(change => change?.[exp] !== undefined);
    });
  }

  private directSource(record: GameRecord, stat: Stat, target: string): boolean {
    if (record.kind === "family") {
      return stat.open && stat.value < stat.max && this.value(record.perLevel?.[target] ?? 0) > 0;
    }
    if (stat.value >= stat.max || stat.reps >= stat.max) return false;
    if (this.value(record.mod?.[target] ?? 0) > 0) return true;
    const count = this.count(record);
    const thresholds = Object.entries(record.at ?? {}).some(([threshold, changes]) => Number(threshold) > count && this.value(changes[target] ?? 0) > 0);
    const repeated = Object.values(record.every ?? {}).some(changes => this.value(changes[target] ?? 0) > 0);
    return thresholds || repeated;
  }

  /** Net change of a resource per activity second while the current activity runs; 0 when idle. */
  netRate(id: string): number {
    const active = this.state.active;
    if (!active) return 0;
    const stat = this.stat(id), record = this.record(active.id), task = this.stat(active.id);
    const timed = typeof record.length === "number";
    // Timed results and thresholds land per completion; continuous thresholds count activity seconds.
    const perCount = timed ? this.speed(record) / Math.max(task.length, 1) : 1;
    let rate = stat.open ? stat.rate : 0;
    if (record.effect?.[id] !== undefined) rate += this.value(record.effect[id]!) * task.rate;
    rate -= this.drain(record)[id] ?? 0;
    if (timed && record.result?.[id] !== undefined) rate += (this.value(record.result[id]!) + task.yield) * perCount;
    for (const [period, changes] of Object.entries(record.every ?? {})) {
      if (changes[id] !== undefined && Number(period) > 0) rate += this.value(changes[id]!) * perCount / Number(period);
    }
    return rate;
  }

  /** Activity seconds until the current objective stops at today's rates; undefined when it cannot be estimated. */
  timeToObjective(): number | undefined {
    const active = this.state.active;
    if (!active) return undefined;
    const record = this.record(active.id), task = this.stat(active.id), objective = active.objective;
    const timed = typeof record.length === "number";
    const runSeconds = timed ? Math.max(task.length, 1) / Math.max(task.rate, EPSILON) : 0;
    // A boost lasts one completion, so only the current run is sped up.
    const thisRun = timed ? Math.max(0, task.length - active.progress) / Math.max(this.speed(record), EPSILON) : 0;
    const runsToSeconds = (runs: number) => (runs <= 0 ? 0 : thisRun + (runs - 1) * runSeconds);
    if (objective.kind === "repetitions") return runsToSeconds(objective.target - task.reps);
    const target = this.stat(objective.id);
    if (objective.kind === "resource") {
      const remaining = objective.target - target.value;
      if (remaining <= EPSILON) return 0;
      if (timed) {
        const perRun = this.value(record.result?.[objective.id] ?? 0) + task.yield;
        return perRun > EPSILON ? runsToSeconds(Math.ceil(remaining / perRun - EPSILON)) : undefined;
      }
      const rate = this.netRate(objective.id);
      return rate > EPSILON ? remaining / rate : undefined;
    }
    if (!target.open) return undefined;
    let need = -target.exp;
    for (let level = target.value + 1; level <= Math.min(objective.target, target.max); level++) need += EXP_PER_LEVEL * level;
    if (need <= EPSILON) return 0;
    const path = `${objective.id}.exp`;
    if (timed) {
      const perRun = this.value(record.result?.[path] ?? 0) * target.rate;
      return perRun > EPSILON ? runsToSeconds(Math.ceil(need / perRun - EPSILON)) : undefined;
    }
    const perSecond = this.value(record.effect?.[path] ?? 0) * task.rate * target.rate;
    return perSecond > EPSILON ? need / perSecond : undefined;
  }

  private objectiveProblem(record: GameRecord, objective: Objective): string | undefined {
    if (!this.byId.has(objective.id) || !Number.isFinite(objective.target) || objective.target < 0 || objective.target > UNBOUNDED) return "The objective is invalid.";
    if (!["repetitions", "level", "resource"].includes(objective.kind)) return "The objective kind is invalid.";
    if (objective.kind !== "resource" && !Number.isInteger(objective.target)) return "Levels and repetitions need a whole-number objective.";
    if (objective.kind === "repetitions" && (objective.id !== record.id || record.length === "continuous")) return "Choose this activity's repetitions or its trained family.";
    if (objective.kind === "level" && this.record(objective.id).kind !== "family") return "A level objective needs a technique family.";
    if (objective.kind === "resource" && this.record(objective.id).kind !== "resource") return "A resource objective needs a resource.";
    if (objective.kind === "repetitions" && objective.target > this.stat(record.id).max) return "This activity cannot be completed that many times.";
    if (objective.kind === "level" && objective.target > this.stat(objective.id).max) return "That objective lies beyond the family's current cap.";
    if (objective.kind === "resource" && objective.target > this.stat(objective.id).max) return "That objective lies beyond the resource's current cap.";
    if (objective.kind !== "repetitions") {
      const changes = [record.effect, record.result, ...Object.values(record.at ?? {}), ...Object.values(record.every ?? {})];
      const paths = objective.kind === "level" ? [`${objective.id}.exp`] : [objective.id, `${objective.id}.value`];
      const directlyEarned = changes.some(change => paths.some(path => this.value(change?.[path] ?? 0) > 0));
      const passiveIncome = objective.kind === "resource" && this.stat(objective.id).open && this.stat(objective.id).rate > 0;
      const fills = objective.kind === "resource" && this.fillTargets(record).includes(objective.id);
      if (!directlyEarned && !passiveIncome && !fills) return "This activity cannot advance that objective.";
    }
    const current = objective.kind === "repetitions" ? this.stat(objective.id).reps : this.stat(objective.id).value;
    return objective.target <= current + EPSILON ? "That objective is already complete." : undefined;
  }

  private reached(objective: Objective): boolean {
    const stat = this.stat(objective.id);
    return (objective.kind === "repetitions" ? stat.reps : stat.value) + EPSILON >= objective.target;
  }

  private tick(): boolean {
    // Rest yields to a waiting pursuit the moment one can resume.
    if (this.state.active && this.record(this.state.active.id).autoStart) this.resumeWaiting();
    this.checkActive();
    const active = this.state.active;
    if (!active) return false;
    const record = this.record(active.id), stat = this.stat(active.id);
    const short = this.unsustained(record);
    if (short) {
      this.pause(`${this.record(short).name ?? short} cannot sustain this activity.`);
      return false;
    }
    this.state.activitySeconds++;
    stat.ticks++;
    const levelBefore = record.train ? this.stat(record.train).value : 0;
    for (const resource of this.records) {
      const current = this.stat(resource.id);
      if (resource.kind === "resource" && current.open && current.rate) this.change(resource.id, current.rate);
    }
    this.effects(record.run, -1);
    this.effects(record.strain, -1);
    this.effects(record.effect, stat.rate);
    if (record.length === "continuous") {
      active.progress++;
      this.thresholds(record, stat.ticks);
      if (record.train) {
        const gained = this.stat(record.train).value - levelBefore;
        stat.reps += gained;
        stat.value = Math.min(stat.max, stat.value + gained);
      }
      if (this.reached(active.objective)) this.finishObjective();
    } else {
      if (record.encounter) this.enterFight(record);
      active.progress += this.speed(record);
      // A decided fight ends its run then and there, however much of the run's length is left.
      if (record.encounter && this.playSwings(record)) active.progress = Math.max(active.progress, stat.length);
      while (this.state.active === active && active.progress + EPSILON >= stat.length) {
        active.progress = Math.max(0, active.progress - stat.length);
        const lost = this.complete(record);
        if (lost) {
          // A lost encounter neither repeats nor waits: its preparation is gone.
          this.state.lastStop = this.lastReason = lost;
          this.release();
          break;
        }
        if (this.reached(active.objective)) this.finishObjective();
        this.reconcile();
        if (this.state.active === active) {
          const available = this.availability(record.id);
          if (!available.ok) this.pause(available.reason);
          else this.payEntry(record);
        }
      }
    }
    this.reconcile();
    if (this.state.active === active && this.filled(record)) this.finishFill(record);
    return true;
  }

  /** Progress per activity second of a timed run, including a held boost. */
  speed(record: GameRecord): number {
    const rate = this.stat(record.id).rate;
    return record.boost && this.stat(record.boost.flag).value > 0 ? rate * record.boost.multiplier : rate;
  }

  /**
   * The fight as it would go if started now, without touching state. Each side's swings land at Hit × (1 − the
   * other's Dodge) for Strike over the other's Guard, and come every GAUGE / Speed seconds. The race times are
   * averages; the win chance plays out every swing the real fight would roll. While this record's fight runs,
   * your side is the one you entered with.
   */
  fight(id: string, lifeHeld?: number): FightProjection {
    if (![LIFE, ...FIGHT_STATS].every(stat => this.byId.has(stat))) throw new Error(`A fight needs the resource records ${[LIFE, ...FIGHT_STATS].join(", ")}.`);
    const record = this.record(id), encounter = record.encounter;
    if (!encounter) throw new Error(`${id} holds no fight.`);
    const { foe } = encounter, live = this.state.fight?.id === id && !this.state.fight.result ? this.state.fight : undefined;
    const you: Fighter = live ? { ...live.you } : this.fighter();
    const lifeValue = lifeHeld ?? live?.life ?? this.stat(LIFE).value, life = Math.floor(lifeValue + EPSILON);
    const held: FightProjection["held"] = [];
    for (const attuned of this.state.attuned) {
      const adds = this.heldAdds(attuned);
      if (Object.keys(adds).length) held.push({ id: attuned, adds });
    }
    const odds = exchange(you, foe);
    const race = (toFell: number, damage: number, chance: number, speed: number) =>
      damage > 0 && chance > 0 && speed > 0 ? Math.ceil(toFell / damage) / chance * GAUGE / speed : Infinity;
    const winSeconds = race(foe.life, odds.yourDamage, odds.yourChance, you.speed), loseSeconds = race(life, odds.foeDamage, odds.foeChance, foe.speed);
    const winChance = this.winChance(record, you, lifeValue), verdict = fightVerdict(winChance, odds.yourDamage);
    const projection: FightProjection = { foe, you, life, lifeMax: this.stat(LIFE).max, held, ...odds, winSeconds, loseSeconds,
      limit: this.stat(id).length, winChance, verdict, verdictText: this.verdictText(winChance, verdict, you, foe), likely: winChance + EPSILON >= 0.5 };
    const flip = live ? undefined : this.flip(record, projection, lifeValue);
    if (flip) projection.flip = flip;
    return projection;
  }

  /** The fight stats you would enter a fight with now, plus what a method not yet held would add. */
  private fighter(adds: Partial<Fighter> = {}): Fighter {
    const max = (id: (typeof FIGHT_STATS)[number]) => this.stat(id).max + (adds[id] ?? 0);
    return { strike: Math.floor(max(STRIKE) + EPSILON), guard: Math.floor(max(GUARD) + EPSILON), speed: max(SPEED),
      hit: Math.min(100, max(HIT)), dodge: Math.min(DODGE_MAX, max(DODGE)) };
  }

  /** What a technique's `held` table adds to the fight stats while it holds a place. */
  private heldAdds(id: string): Partial<Fighter> {
    const adds: Partial<Fighter> = {};
    for (const [path, amount] of Object.entries(this.record(id).held ?? {})) {
      const stat = FIGHT_STATS.find(key => path === `${key}.max`);
      if (stat) adds[stat] = (adds[stat] ?? 0) + this.value(amount);
    }
    return adds;
  }

  /** The exact chance of a win if this fight began now with these stats and this much Life. */
  private winChance(record: GameRecord, you: Fighter, life: number): number {
    const run = this.stat(record.id), lifeStat = this.stat(LIFE), speed = this.speed(record);
    // The run ends on the second its progress reaches its length, so that is the fight's last second.
    const seconds = speed > EPSILON ? Math.max(1, Math.ceil((run.length - run.exp) / speed - EPSILON)) : FIGHT_SECONDS_MAX;
    return winChance({ you, foe: record.encounter!.foe, life, lifeMax: lifeStat.max, regen: lifeStat.open ? lifeStat.rate : 0,
      seconds: Math.min(seconds, FIGHT_SECONDS_MAX) });
  }

  private verdictText(chance: number, verdict: FightVerdict, you: Fighter, foe: Fighter): string {
    if (verdict === "hopeless") return `Cannot win: ${this.record(STRIKE).name ?? STRIKE} ${you.strike} does not pass ${this.record(GUARD).name ?? GUARD} ${foe.guard}`;
    if (chance <= 0) return "Cannot win inside the time limit";
    if (chance >= 1 - EPSILON) return "Certain win";
    return `${{ certain: "Near-certain win", likely: "Likely win", close: "Close", loss: "Likely loss" }[verdict]} · ${percent(chance)}`;
  }

  /**
   * The cheapest change that would move the verdict up a band, cheapest first: resting to full Life, holding a
   * method in a free attunement place, then a higher Strike and what raises it.
   */
  private flip(record: GameRecord, projection: FightProjection, life: number): string | undefined {
    if (projection.verdict === "certain") return undefined;
    const { foe } = projection, rank = FIGHT_VERDICTS.indexOf(projection.verdict);
    const better = (chance: number, you: Fighter) => FIGHT_VERDICTS.indexOf(fightVerdict(chance, Math.max(0, you.strike - foe.guard))) > rank;
    const lifeMax = this.stat(LIFE).max;
    if (life + EPSILON < lifeMax) {
      const rested = this.winChance(record, projection.you, lifeMax);
      if (better(rested, projection.you)) return `Rested to full ${this.record(LIFE).name ?? LIFE}: ${percent(rested)}`;
    }
    if (this.byId.has(ATTUNE_SLOTS) && this.state.attuned.length < Math.floor(this.stat(ATTUNE_SLOTS).max + EPSILON)) {
      let best: { name: string; chance: number } | undefined;
      for (const method of this.records) {
        if (!method.attune || this.isAttuned(method.id) || !this.visible(method.id)) continue;
        const adds = this.heldAdds(method.id);
        if (!Object.keys(adds).length) continue;
        const you = this.fighter(adds), chance = this.winChance(record, you, life);
        if (better(chance, you) && (!best || chance > best.chance)) best = { name: method.name ?? method.id, chance };
      }
      if (best) return `Holding ${best.name} as well: ${percent(best.chance)}`;
    }
    const strikeName = this.record(STRIKE).name ?? STRIKE, sources = this.capSources(STRIKE).map(source => source.name ?? source.id);
    const raisers = sources.length ? `raised by ${sources.join(" or ")}` : "nothing you know of raises it further";
    if (projection.verdict === "hopeless") return `${strikeName} ${foe.guard + 1} passes ${this.record(GUARD).name ?? GUARD} ${foe.guard}: ${raisers}`;
    if (!sources.length) return undefined;
    const stronger = { ...projection.you, strike: projection.you.strike + 1 }, chance = this.winChance(record, stronger, life);
    return better(chance, stronger) ? `${strikeName} ${stronger.strike}: ${percent(chance)}; ${raisers}` : undefined;
  }

  /** A fight is under way in the activity slot and has not yet been decided. */
  fighting(): boolean {
    const fight = this.state.fight;
    return Boolean(fight && !fight.result && this.state.active?.id === fight.id);
  }

  /** A fight is entered on the first second of its run, with the stats and whole Life held then. */
  private enterFight(record: GameRecord): void {
    if (this.state.fight?.id === record.id && !this.state.fight.result) return;
    this.state.fight = { id: record.id, you: this.fighter(), life: Math.floor(this.stat(LIFE).value + EPSILON), foeLife: record.encounter!.foe.life,
      yourGauge: 0, foeGauge: 0, seconds: 0, swings: 0, landed: 0, foeSwings: 0, foeLanded: 0, lines: [] };
  }

  /**
   * One fight second: both gauges fill, and every full gauge swings, the fuller first and you before the foe
   * when level. Your blows fall on the live Life store. Returns true once a side has fallen.
   */
  private playSwings(record: GameRecord): boolean {
    const fight = this.state.fight!, { foe } = record.encounter!, projection = exchange(fight.you, foe), name = record.name ?? record.id;
    const Foe = `${foe.name.charAt(0).toUpperCase()}${foe.name.slice(1)}`, lifeName = this.record(LIFE).name ?? LIFE;
    fight.seconds++;
    fight.yourGauge += fight.you.speed;
    fight.foeGauge += foe.speed;
    while (!fight.result) {
      const yours = fight.yourGauge + EPSILON >= GAUGE, theirs = fight.foeGauge + EPSILON >= GAUGE;
      if (!yours && !theirs) break;
      let text: string;
      if (yours && (!theirs || fight.yourGauge + EPSILON >= fight.foeGauge)) {
        fight.yourGauge -= GAUGE;
        fight.swings++;
        if (this.random() >= projection.yourChance) text = `${Foe} slips your strike.`;
        else {
          fight.landed++;
          fight.foeLife = Math.max(0, fight.foeLife - projection.yourDamage);
          text = projection.yourDamage === 0 ? `Your strike lands, but ${foe.name}'s guard turns it.`
            : `You strike ${foe.name} for ${projection.yourDamage} (${fight.foeLife}/${foe.life}).`;
          if (fight.foeLife === 0) {
            fight.result = "won";
            text += ` ${Foe} falls.`;
          }
        }
      } else {
        fight.foeGauge -= GAUGE;
        fight.foeSwings++;
        if (this.random() >= projection.foeChance) text = `You slip ${foe.name}'s strike.`;
        else {
          fight.foeLanded++;
          this.change(LIFE, -projection.foeDamage);
          const left = Math.floor(this.stat(LIFE).value + EPSILON);
          text = projection.foeDamage === 0 ? `${Foe}'s strike lands, but your guard turns it.`
            : `${Foe} strikes you for ${projection.foeDamage} (${lifeName} ${left}).`;
          if (left < 1) {
            // Taking every whole point empties the store, so a regenerated fraction does not linger.
            this.change(LIFE, -this.stat(LIFE).value);
            fight.result = "life";
            text += " You go down.";
          }
        }
      }
      fight.lines.push(`${fightClock(fight.seconds)} ${text}`);
      if (fight.lines.length > FIGHT_LINES) fight.lines.splice(0, fight.lines.length - FIGHT_LINES);
      this.log("fight", `${name}: ${text}`);
    }
    return fight.result !== undefined;
  }

  /** Returns the journal text when an encounter is lost; nothing else of the run applies then. */
  private complete(record: GameRecord): string | undefined {
    const stat = this.stat(record.id), previousYield = stat.yield, name = record.name ?? record.id;
    if (typeof record.length === "number") {
      stat.exp = 0;
      stat.paid = false;
      if (record.boost && this.stat(record.boost.flag).value > 0) {
        this.change(record.boost.flag, -1);
        this.log("completion", `The carried current spent itself on ${name}.`);
      }
    }
    if (record.encounter) {
      if (this.state.fight?.id !== record.id) this.enterFight(record);
      // A run that reaches its length undecided is outlasted.
      const fight = this.state.fight!, foe = record.encounter.foe.name, lifeName = this.record(LIFE).name ?? LIFE;
      fight.result ??= "outlasted";
      const tally = `you landed ${fight.landed} of ${fight.swings} swings, ${foe} ${fight.foeLanded} of ${fight.foeSwings}`;
      if (fight.result !== "won") {
        const reason = fight.result === "life" ? `your ${lifeName} runs out` : `${foe} outlasts you`;
        const text = `${name} (lost after ${fightClock(fight.seconds)}: ${reason}; ${tally}): ${record.encounter.failureText}`;
        this.log("pause", text);
        return text;
      }
      this.log("story", `${name}: ${foe} falls after ${fightClock(fight.seconds)}; ${tally}. ${lifeName} ${fight.life} → ${Math.floor(this.stat(LIFE).value + EPSILON)}.`);
      this.effects(record.encounter.success);
    }
    stat.reps++;
    stat.value = Math.min(stat.max, stat.value + 1);
    // Caps this completion raises must stand before the same completion's experience lands.
    this.recompute();
    for (const [path, amount] of Object.entries(record.result ?? {})) {
      const bonus = !path.includes(".") && this.byId.get(path)?.kind === "resource" && this.value(amount) > 0 ? previousYield : 0;
      this.change(path, this.value(amount) + bonus);
    }
    this.thresholdEffects(record, stat.reps);
    if (stat.reps === 1) {
      this.effects(record.mod);
      // A timed run's locks fell when its bill was paid.
      if (typeof record.length !== "number") this.applyLocks(record);
    }
    this.recompute();
    return undefined;
  }

  /**
   * A timed run's entry bill. Paying it is the commitment, so the run's locks fall then, the way a technique's
   * fall when it is taken up, and the confirmation that names them lands on the click that pays.
   */
  private payEntry(record: GameRecord): void {
    const stat = this.stat(record.id);
    this.pay(record);
    stat.paid = true;
    if (stat.reps === 0) this.applyLocks(record);
  }

  /** Locking removes a record from the world, including its place in the waiting list; enabling gives it back. */
  private applyLocks(record: GameRecord): void {
    for (const id of record.lock ?? []) {
      if (!this.byId.has(id) || this.locked(id)) continue;
      this.state.lockedIds.push(id);
      const name = this.record(id).name ?? id;
      if (this.state.waiting.some(entry => entry.id === id)) {
        this.state.waiting = this.state.waiting.filter(entry => entry.id !== id);
        this.log("pause", `${name} left the waiting list: this chapter has closed.${this.stat(id).paid ? " What it cost is not returned." : ""}`);
      }
      if (this.isAttuned(id)) {
        this.state.attuned = this.state.attuned.filter(entry => entry !== id);
        this.log("method", `${name} is released: this chapter has closed.`);
      }
    }
    for (const id of record.enable ?? []) {
      this.state.lockedIds = this.state.lockedIds.filter(entry => entry !== id);
    }
  }

  /** Standing modifiers from a crossed threshold must land before its one-off payout reads a cap. */
  private thresholds(record: GameRecord, count: number): void {
    const compiled = this.compiledById.get(record.id)!;
    const crossed = compiled.at.some(step => step.threshold === count)
      || compiled.every.some(step => step.period > 0 && count % step.period === 0);
    if (!crossed) return;
    this.recompute();
    this.thresholdEffects(record, count);
  }

  /** The one-off part of a crossed threshold; its standing modifiers belong to recompute. */
  private thresholdEffects(record: GameRecord, count: number): void {
    const compiled = this.compiledById.get(record.id)!;
    for (const { threshold, table } of compiled.at) if (threshold === count) this.applyEffects(table);
    for (const { period, table } of compiled.every) if (period > 0 && count % period === 0) this.applyEffects(table);
  }

  private applyEffects(table: Table, multiplier = 1): void {
    for (const [path, amount] of table.effects) this.change(path, this.value(amount) * multiplier);
  }

  /** What starting this record spends, after discounts. */
  payment(record: GameRecord): Record<string, number> {
    const result: Record<string, number> = {};
    for (const changes of [record.buy, record.cost]) {
      for (const [id, amount] of Object.entries(changes ?? {})) {
        const evaluated = this.value(amount);
        if (evaluated < 0) throw new Error(`Negative purchase cost in ${record.id}.`);
        result[id] = (result[id] ?? 0) + this.discounted(record, id, evaluated);
      }
    }
    return result;
  }

  private floorSpaceReason(needed: number): string {
    const space = this.stat(HOME_SPACE), free = Math.max(0, space.max - space.value);
    const sources = this.capSources(HOME_SPACE).map(record => inSentence(record.name ?? record.id));
    const removable = this.records.filter(record => record.space && this.removable(record) && this.stat(record.id).value > 0).map(record => record.name ?? record.id);
    const options: string[] = [];
    if (sources.length) options.push(`move to ${sources.join(" or ")}`);
    if (removable.length) options.push(`take down ${removable.join(" or ")} on Home`);
    return `${needed} free ${needed === 1 ? "span" : "spans"} of floor needed (${free} of ${space.max} free${options.length ? `; ${options.join(" or ")}` : ""}).`;
  }

  private pay(record: GameRecord): void {
    for (const [id, amount] of Object.entries(this.payment(record))) this.change(id, -amount);
  }

  /** The one-off half of a change map; standing modifiers in it are recompute's business. */
  private effects(changes?: Changes, multiplier = 1): void {
    for (const [path, amount] of Object.entries(changes ?? {})) {
      const [id, field = "value", tail] = path.split(".");
      if (tail || derivedFields.has(field) || (id === "bank" && (field === "max" || field === "cap"))) continue;
      this.change(path, this.value(amount) * multiplier);
    }
  }

  private change(path: string, amount: number): void {
    if (!Number.isFinite(amount)) throw new Error(`Non-finite change to ${path}.`);
    if (path === "bank" || path === "bank.value" || path === "bank.seconds") {
      this.state.bank.seconds = Math.max(0, Math.min(this.state.bank.cap, this.state.bank.seconds + amount)); return;
    }
    const [id, field = "value", ...rest] = path.split(".");
    if (rest.length) throw new Error(`Unsupported change path: ${path}`);
    const stat = this.stat(id!), record = this.record(id!);
    if (derivedFields.has(field)) return;
    if (field === "started") { if (amount) stat.started = amount > 0; return; }
    if (field === "exp") {
      if (record.kind !== "family" || !stat.open || stat.value >= stat.max) return;
      stat.exp = Math.max(0, stat.exp + amount * stat.rate);
      while (stat.value < stat.max && stat.exp + EPSILON >= EXP_PER_LEVEL * (stat.value + 1)) {
        stat.exp = Math.max(0, stat.exp - EXP_PER_LEVEL * (stat.value + 1));
        stat.value++;
        this.log("completion", `${record.name ?? id} reaches level ${stat.value}.`);
        // The level's own payout is derived; only its one-off milestones fire here.
        this.recompute();
        this.thresholdEffects(record, stat.value);
      }
      if (stat.value >= stat.max) { stat.exp = 0; this.pendingCaps.add(id!); }
      return;
    }
    if (field === "value") {
      const before = stat.value;
      stat.value = Math.max(0, Math.min(stat.max, stat.value + amount));
      // Repeated fractional rates leave slivers such as 9.9999999; a resource within EPSILON of its cap is full.
      if (stat.max - stat.value < EPSILON) stat.value = stat.max;
      // Only filling up is news; a store that opens full, or stays full, says nothing.
      if (amount > 0 && before < stat.max && stat.value >= stat.max && record.kind === "resource") this.pendingCaps.add(id!);
      return;
    }
    if (!Object.hasOwn(stat, field)) throw new Error(`Unsupported change field: ${path}`);
    const numeric = field as "reps" | "ticks";
    stat[numeric] = Math.max(0, stat[numeric] + amount);
  }

  private reconcile(logReveals = true): void {
    this.recompute();
    // Event changes can reveal another event, but every event can fire only once.
    let changed: boolean, revealed = false;
    do {
      changed = false;
      for (const record of this.records) {
        if (!this.state.visibleIds.includes(record.id) && this.condition(record.require)) {
          this.state.visibleIds.push(record.id);
          revealed = true;
          // A flag is a state, told by its own story line; "The path is clear is now known" reads as nonsense.
          if (logReveals && record.require && record.kind !== "flag" && !this.locked(record.id)) this.log("discovery", `${record.name ?? record.id} is now known.`);
        }
        for (const event of record.events ?? []) {
          if (!this.state.eventIds.includes(event.id) && this.condition(event.when)) {
            this.state.eventIds.push(event.id);
            this.effects(event.changes);
            this.recompute();
            this.log("story", event.text);
            this.lastReason = event.text;
            changed = true;
          }
        }
      }
    } while (changed);
    if (revealed) this.state.visibleIds.sort((a, b) => this.order.get(a)! - this.order.get(b)!);
    if (this.state.active && this.locked(this.state.active.id)) this.pause("This chapter has closed.");
    for (const id of this.pendingCaps) {
      const stat = this.stat(id), key = `${id}:${stat.max}`;
      if (stat.value < stat.max || this.state.capHits.includes(key)) continue;
      this.state.capHits.push(key);
      const sources = this.capSources(id).map(record => inSentence(record.name ?? record.id));
      this.log("cap", `${this.record(id).name ?? id} has reached ${stat.value}/${stat.max}. ${sources.length ? `A higher cap is possible through ${sources.join(" or ")}.` : this.raisable(id) ? "Further ways to raise this cap have not been discovered." : NOTHING_RAISES}`);
    }
    this.pendingCaps.clear();
  }

  /** Whether anything in the content, discovered or not, could still raise this store's cap. */
  private raisable(id: string, asked = new Set<string>()): boolean {
    asked.add(id);
    const target = `${id}.max`;
    const raises = (table: Table) => table.patches.some(entry => entry.path === target)
      || table.derived.some(entry => `${entry.id}.${entry.field}` === target && (typeof entry.amount === "string" || entry.amount > 0));
    return this.compiled.some(({ record, owned, perLevel, held, at, every }) => {
      if (this.locked(record.id)) return false;
      const stat = this.stat(record.id), done = record.kind !== "resource" && stat.value >= stat.max;
      // A knowledge at its cap pays more per level only once its own cap can rise.
      if (raises(perLevel) && (!done || (!asked.has(record.id) && this.raisable(record.id, asked)))) return true;
      if (raises(held) && !this.isAttuned(record.id)) return true;
      if (at.some(step => step.threshold > this.count(record) && raises(step.table))) return true;
      return !done && (raises(owned) || every.some(step => raises(step.table)));
    });
  }

  private checkActive(): void {
    const active = this.state.active;
    if (!active) return;
    const record = this.record(active.id);
    if (this.reached(active.objective)) this.finishObjective();
    else if (this.locked(active.id)) this.pause("This chapter has closed.");
    else if (record.attune && !this.isAttuned(active.id)) this.pause(`${record.name ?? active.id} is no longer attuned.`);
    else if (this.filled(record)) this.finishFill(record);
    else if (record.length === "continuous" && !this.condition(record.need)) this.pause(record.needtext ?? "This activity has reached its current limit.");
    else if (active.objective.kind !== "repetitions" && active.objective.target > this.stat(active.objective.id).max + EPSILON) this.pause("The objective now lies beyond the current cap.");
    // A finite run has already paid its entry bill. Its original need/cost is
    // checked again only if another repetition is about to begin.
  }

  /** Everything the activity fills is at cap: it leaves the slot to whatever is waiting. */
  private finishFill(record: GameRecord): void {
    const names = this.fillTargets(record).map(id => this.record(id).name ?? id);
    this.lastReason = `${record.name ?? record.id}: ${list(names)} ${names.length > 1 ? "are" : "is"} full.`;
    if (!record.autoStart) this.state.lastStop = this.lastReason;
    this.log("completion", this.lastReason);
    this.release();
    if (!this.resumeWaiting()) this.fillIdle();
  }

  private finishObjective(): void {
    const active = this.state.active;
    if (!active) return;
    const name = this.record(active.id).name ?? active.id;
    this.lastReason = `${name}: objective complete.`;
    if (!this.record(active.id).autoStart) this.state.lastStop = this.lastReason;
    this.log("completion", this.lastReason);
    this.release();
  }

  /** A blocked pursuit joins the end of the waiting list and resumes by itself once it can. */
  private pause(reason: string): void {
    const active = this.state.active;
    const pursuit = active && !this.record(active.id).autoStart ? active : null;
    const parked = pursuit && !this.locked(pursuit.id) && this.state.waiting.length < WAITING_MAX;
    const text = parked ? `${this.record(pursuit.id).name ?? pursuit.id} is waiting: ${reason}` : reason;
    if (pursuit) this.state.lastStop = text;
    this.release();
    if (parked) this.state.waiting.push({ id: pursuit.id, progress: 0, objective: clone(pursuit.objective) });
    this.lastReason = text;
    this.log("pause", text);
  }

  private log(kind: LogEntry["kind"], text: string): void {
    const id = (this.state.log.at(-1)?.id ?? 0) + 1;
    this.state.log.push({ id, kind, text, activitySeconds: this.state.activitySeconds });
    if (this.state.log.length > 160) this.state.log.splice(0, this.state.log.length - 160);
  }

  private creditBank(seconds: number): number {
    const amount = Math.max(0, Math.min(seconds, this.state.bank.cap - this.state.bank.seconds));
    this.state.bank.seconds += amount;
    return amount;
  }

  private requireSeconds(seconds: number): void {
    if (!Number.isFinite(seconds) || seconds < 0 || seconds > UNBOUNDED) throw new Error("Elapsed time must be a finite, nonnegative number of seconds.");
  }

  // --------------------------------------------------------------- presentation

  /**
   * Confirmation text for an irreversible action, or undefined when none is needed. Any record it would still
   * close asks, seen or not; the authored warning, when there is one, says it in the content's own words.
   */
  warnText(id: string): string | undefined {
    const record = this.record(id);
    const doors = (record.lock ?? []).filter(target => this.byId.has(target)), open = doors.filter(target => !this.locked(target));
    // The warning is about the transition, not the record: once every door it names has shut there is
    // nothing left to confirm, so a repeatable chore stops asking after the haul that closed the mill.
    if (doors.length && !open.length) return undefined;
    return record.warn ?? (open.length ? `This closes ${list(open.map(target => this.record(target).name ?? target))} for good.` : undefined);
  }

  /**
   * The whole hover panel as data, in the schema every record kind shares: title, type, rate,
   * description, completion time, need, cost, effect, modifications, results, locks, flavour.
   * Empty blocks are omitted; the UI renders what it is given and decides nothing.
   */
  tooltip(id: string): TooltipBlock[] {
    const record = this.record(id), stat = this.stat(id);
    const blocks: TooltipBlock[] = [];
    const block = (kind: TooltipBlock["kind"], lines: (string | undefined)[], label?: string) => {
      const kept = lines.filter((line): line is string => Boolean(line));
      if (kept.length) blocks.push(label === undefined ? { kind, lines: kept } : { kind, label, lines: kept });
    };
    const name = record.name ?? record.id;
    const timed = typeof record.length === "number";
    const unbounded = stat.max >= UNBOUNDED;

    block("title", [name, record.kind === "family" ? `Level ${shown(stat.value)}/${shown(stat.max)}`
      : record.kind === "resource" ? `${shown(stat.value)}${unbounded ? "" : `/${shown(stat.max)}`}`
      : unbounded ? (stat.reps ? `${stat.reps} completed` : undefined) : `${shown(stat.value)}/${shown(stat.max)}`]);
    // Route keys are not a type; the UI names them in words beside the blocks.
    block("type", [kindLabel(record), record.slot ? `Place: ${record.slot}` : undefined,
      record.attune ? (this.isAttuned(id) ? "Attuned" : "Needs an attunement slot") : undefined]);
    block("rate", [
      record.kind === "family" && stat.open ? `Experience: ${shown(stat.exp)}/${EXP_PER_LEVEL * (stat.value + 1)}` : undefined,
      timed && stat.rate !== 1 ? `Completion rate: ${Math.round(stat.rate * 100)}%` : undefined,
      record.kind === "resource" && stat.open && stat.rate ? `${shown(stat.rate)}/s` : undefined,
      stat.discount ? `−${amountText(stat.discount * 100)}% cost` : undefined,
    ]);
    block("desc", [record.desc, record.breakthrough?.coreLabel]);
    const fullTime = stat.length / Math.max(this.speed(record), EPSILON);
    block("time", [!timed ? undefined : record.encounter ? `Time limit: ${clock(fullTime)}` : `Completion time: ${clock(fullTime)}`]);
    if (record.encounter) {
      const live = this.fighting() && this.state.active?.id === id;
      const projection = this.fight(id), { foe, you } = projection, lifeName = this.record(LIFE).name ?? LIFE;
      const [foeStats, yourStats] = [foe, you].map(fighter =>
        `strike ${fighter.strike}, guard ${fighter.guard}, speed ${shown(fighter.speed)}, hit ${shown(fighter.hit)}%, dodge ${shown(fighter.dodge)}%`);
      const held = projection.held.map(entry => `${this.record(entry.id).name ?? entry.id} ${Object.entries(entry.adds)
        .map(([key, amount]) => `${key} +${shown(amount)}${key === HIT || key === DODGE ? "%" : ""}`).join(" ")}`);
      const yours = projection.winSeconds === Infinity ? `your swings cannot hurt ${foe.name}` : `you fell ${foe.name} in ~${Math.round(projection.winSeconds)} s`;
      const theirs = projection.loseSeconds === Infinity ? `${foe.name} cannot hurt you` : `${foe.name} fells you in ~${Math.round(projection.loseSeconds)} s`;
      block("fight", [
        projection.verdictText,
        projection.flip,
        `${foe.name.charAt(0).toUpperCase()}${foe.name.slice(1)}: life ${foe.life}, ${foeStats}`,
        `You: ${lifeName} ${projection.life}/${shown(projection.lifeMax)}, ${yourStats}${live ? " (as you entered)" : ""}`,
        held.length && !live ? `Held methods: ${held.join(", ")}` : undefined,
        `Your swings land ${Math.round(projection.yourChance * 100)}% of the time for ${projection.yourDamage}; ${foe.name}'s land ${Math.round(projection.foeChance * 100)}% for ${projection.foeDamage}.`,
        `On average ${yours}; ${theirs}.`,
      ], "Fight");
    }
    // A store or a knowledge is not an action, so its "cannot be started" reason is not a need.
    const availability = passiveKinds.has(record.kind) ? { ok: true, reason: "" } : this.availability(id);
    block("need", [record.needtext, !availability.ok && availability.reason !== record.needtext ? availability.reason : undefined], "Need");
    // Costs read as paid after discounts, payouts as they pay now, each naming what made it grow.
    const paid = (path: string, base: number): Growth => {
      const resource = fieldPath(path).split(".")[0]!, discounts = [`${id}.discount`, `${resource}.discount`].map(target => this.contributions(target, id));
      return { amount: this.discounted(record, resource, base) - base, labels: discounts.flatMap(found => found.labels) };
    };
    block("cost", this.lines(record.buy, "", paid).concat(this.lines(record.cost, "", paid)), "Cost");
    block("cost", this.lines(record.run, "/s", paid).concat(this.lines(record.strain, "/s", paid)), "Progress cost");
    block("effect", this.lines(record.effect, "/s", (_, base) => ({ amount: base * (stat.rate - 1), labels: this.contributions(`${id}.rate`, id).labels }))
      .map(line => this.fullMark(record, line)), "Effect");
    // `X.mod.Y` patches raise what this record pays: per level for a knowledge, once owned for anything else.
    const patched = (path: string): Growth => this.contributions(fieldPath(path), id, id);
    const payout = { ...(record.kind === "family" ? record.perLevel : record.mod) };
    for (const path of this.patchedPaths(id)) if (!Object.keys(payout).some(own => fieldPath(own) === fieldPath(path))) payout[path] = 0;
    block("mod", (record.kind === "family" ? this.lines(record.mod).concat(this.lines(payout, " per level", patched)) : this.lines(payout, "", patched))
      .concat(this.lines(record.held, " while attuned"))
      .concat(Object.entries(record.at ?? {}).flatMap(([threshold, changes]) => this.lines(changes, ` ${thresholdText(record, Number(threshold))}`))), "Modifies");
    // A completion adds the record's yield to every resource it pays, as `complete` does.
    block("result", this.lines(record.result, "", (path, base) => !path.includes(".") && base > 0 && this.byId.get(path)?.kind === "resource"
      ? { amount: stat.yield, labels: this.contributions(`${id}.yield`, id).labels } : undefined)
      .concat(this.lines(record.onStart, " on first start"))
      .concat(record.encounter ? this.lines(record.encounter.success, " if won") : []), "Gives");
    // Once nothing it closes is still open, the closing has happened and the note goes with the warning.
    const warning = this.warnText(id);
    block("lock", [
      warning && (record.lock ?? []).length ? `Closes ${list((record.lock ?? []).map(target => this.byId.get(target)?.name ?? target))}` : undefined,
      (record.enable ?? []).length ? `Reopens ${list((record.enable ?? []).map(target => this.byId.get(target)?.name ?? target))}` : undefined,
      this.fillTargets(record).length ? `Stops when ${list(this.fillTargets(record).map(target => this.record(target).name ?? target))} ${this.fillTargets(record).length > 1 ? "are" : "is"} full` : undefined,
      warning && record.warn,
    ], "Note");
    block("flavor", [record.flavor]);
    return blocks;
  }

  private fullMark(record: GameRecord, line: string): string {
    const targets = this.fillTargets(record);
    const full = targets.some(target => line.startsWith(`${this.record(target).name ?? target}:`) && this.stat(target).value >= this.stat(target).max);
    return full ? `${line} (Full)` : line;
  }

  /** Paths some record now patches into this record's own payout. */
  private patchedPaths(target: string): string[] {
    const paths = new Set<string>();
    this.eachContribution(table => { for (const entry of table.patches) if (entry.target === target) paths.add(entry.path); });
    return [...paths];
  }

  /**
   * One line per change. `grow` says how much more (or less) a line pays now than content's own number and who
   * is responsible, so the line shows the grown value and names them: "Coin: 5 (+2 from 40 uses)".
   */
  private lines(changes: Changes | undefined, suffix = "", grow?: (path: string, base: number) => Growth | undefined): string[] {
    return Object.entries(changes ?? {}).filter(([path]) => this.worthShowing(path)).map(([path, amount]) => {
      const base = typeof amount === "number" ? amount : this.safeValue(amount);
      if (base === undefined) return `${this.pathLabel(path)}: ${amount}${suffix}`;
      const growth = grow?.(path, base), grown = growth && Math.abs(growth.amount) > EPSILON ? growth : undefined;
      const note = grown?.labels.length ? ` (${this.quantity(path, grown.amount, true)} from ${list(grown.labels)})` : "";
      return `${this.changeLine(path, base + (grown?.amount ?? 0), suffix)}${note}`;
    });
  }

  /** A change in the player's words: "+25% Rest speed", "+0.005 Qi/s", "−15% Qi cost", "Max Vigor: 2". */
  private changeLine(path: string, value: number, suffix: string): string {
    const parts = path.split("."), id = parts[0]!, field = parts[1] ?? "value", record = this.byId.get(id), name = record?.name ?? id;
    if (field === "mod" && parts.length > 2) return `${name} ➢ ${this.changeLine(parts.slice(2).join("."), value, suffix)}`;
    // A switch thrown once reads as its name: "Foundation", "Body Disciple", "Strain opens", not "Foundation: 1".
    const once = record !== undefined && (record.kind === "flag" || oneShotKinds.has(record.kind));
    if (value === 1 && suffix !== "/s" && (field === "open" || (field === "value" && once))) return `${this.pathLabel(path)}${suffix}`;
    if (id === "bank") return `${this.pathLabel(path)}: ${span(value)}${suffix}`;
    if (field === "rate") return `${this.quantity(path, value, true)} ${name}${record?.kind === "resource" ? "/s" : record?.kind === "family" ? " experience" : " speed"}${suffix}`;
    if (field === "discount") return `${this.quantity(path, value, true)} ${name} cost${suffix}`;
    return `${this.pathLabel(path)}: ${this.quantity(path, value, false)}${suffix}`;
  }

  /** A change's number: an action's speed and any discount in percent (a discount as a cut), the rest as it is. */
  private quantity(path: string, value: number, signed: boolean): string {
    const [id, field = "value"] = fieldPath(path).split("."), resource = this.byId.get(id!)?.kind === "resource";
    const percent = field === "discount" || (field === "rate" && !resource), amount = field === "discount" ? -value : value;
    const text = percent ? `${amountText(Math.abs(amount) * 100)}%` : amountText(Math.abs(amount));
    return signed ? `${amount < 0 ? "−" : "+"}${text}` : `${amount < 0 ? "−" : ""}${text}`;
  }

  /**
   * Bookkeeping is not a reward and an unmet knowledge is not yet a thing to want. An uncapped store
   * is a lifetime tally the player never spends, an occupancy count is the engine's own, and practice
   * toward a family that is closed or undiscovered names something they have no use for yet.
   */
  private worthShowing(path: string): boolean {
    const [id, field = "value"] = path.split(".");
    const record = this.byId.get(id!);
    if (!record) return true;
    if (record.kind === "resource" && field === "value") {
      return !countedStores.has(id!) && this.stat(id!).max < UNBOUNDED;
    }
    if (record.kind === "family" && field === "exp") return this.visible(id!) && this.stat(id!).open;
    return true;
  }

  private safeValue(expression: string): number | undefined {
    try { return this.value(expression); } catch { return undefined; }
  }

  /** A modifier path in the player's words: `qi.max` is "Max Qi", `scrolls.mod.lore.rate` is "Scrolls ➢ Lore rate". */
  pathLabel(path: string): string {
    const parts = path.split("."), id = parts[0]!, field = parts[1] ?? "value";
    if (id === "bank") return field === "value" || field === "seconds" ? "Time bank" : "Max time bank";
    const name = this.byId.get(id)?.name ?? id;
    if (field === "mod" && parts.length > 2) return `${name} ➢ ${this.pathLabel(parts.slice(2).join("."))}`;
    switch (field) {
      case "value": return name;
      case "max": return this.byId.get(id)?.group === "Combat" ? name : `Max ${name}`;
      case "rate": return `${name} rate`;
      case "exp": return `${name} experience`;
      case "open": return `${name} opens`;
      case "yield": return `${name} yield`;
      case "discount": return `${name} discount`;
      case "length": return `${name} duration`;
      default: return `${name} ${field}`;
    }
  }
}

function pickDerived(initial: Partial<Stat> | undefined): Partial<Pick<Stat, DerivedField>> {
  const picked: Partial<Pick<Stat, DerivedField>> = {};
  for (const field of DERIVED_FIELDS) if (initial && Object.hasOwn(initial, field)) (picked as Record<string, unknown>)[field] = initial[field];
  return picked;
}

function kindLabel(record: GameRecord): string {
  if (record.encounter) return "Fight";
  if (record.length === "continuous") return "Practice";
  if (typeof record.length === "number") return record.kind === "site" ? "Outing" : "Timed task";
  return { resource: "Store", family: "Knowledge", flag: "State", lead: "Lead", purchase: "Purchase", arrangement: "Arrangement",
    home: "Home", class: "Standing", breakthrough: "Breakthrough", teaching: "Teaching", recipe: "Recipe", technique: "Technique",
    task: "Chore", site: "Place" }[record.kind] ?? record.kind;
}

/** Trickles are real: a per-level 0.002 must not round away to "0" on the card that sells it. */
function amountText(value: number): string {
  if (value === 0 || Math.abs(value) >= 0.01) return String(Math.round(value * 100) / 100);
  return value.toFixed(Math.min(6, Math.max(2, 1 - Math.floor(Math.log10(Math.abs(value))))));
}

/** Banked time in the toolbar's own units: "5h", "1h 30m", "45m". */
function span(seconds: number): string {
  const whole = Math.round(seconds), hours = Math.floor(whole / 3600), minutes = Math.floor((whole % 3600) / 60), rest = whole % 60;
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", rest || !whole ? `${rest}s` : ""].filter(Boolean).join(" ");
}

/** Fights are short: "0:15". */
function fightClock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function clock(seconds: number): string {
  const whole = Math.max(0, Math.ceil(seconds));
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(Math.floor(whole / 3600))}:${pad(Math.floor(whole / 60) % 60)}:${pad(whole % 60)}`;
}

/** What one swing of each side is worth: its chance to land and what it takes when it does. */
function exchange(you: Fighter, foe: Fighter): Pick<FightProjection, "yourChance" | "foeChance" | "yourDamage" | "foeDamage"> {
  return { yourChance: you.hit / 100 * (1 - foe.dodge / 100), foeChance: foe.hit / 100 * (1 - you.dodge / 100),
    yourDamage: Math.max(0, you.strike - foe.guard), foeDamage: Math.max(0, foe.strike - you.guard) };
}

/** The band a win chance falls in; a fight your swings cannot hurt is hopeless whatever else holds. */
export function fightVerdict(winChance: number, yourDamage: number): FightVerdict {
  if (yourDamage <= 0) return "hopeless";
  const chance = winChance + EPSILON;
  return chance >= 0.95 ? "certain" : chance >= 0.75 ? "likely" : chance >= 0.5 ? "close" : "loss";
}

/** "about 84%"; a chance short of certain never reads 100, and one above nothing never reads 0. */
function percent(chance: number): string {
  return chance < 0.005 ? "under 1%" : `about ${Math.min(99, Math.round(chance * 100))}%`;
}

interface Race { you: Fighter; foe: Foe; life: number; lifeMax: number; regen: number; seconds: number }

/**
 * The exact chance that the foe falls before your Life drops below 1 or the seconds run out, under the rules
 * `playSwings` rolls (ADR 0026 §3). Swings come on gauges that fill whatever lands, so the order of swings is
 * fixed and only the two Life totals vary: their distribution is carried swing by swing, with your Life
 * regenerating at the start of each second and kept in bounds exactly as the store keeps it.
 */
function winChance({ you, foe, life, lifeMax, regen, seconds }: Race): number {
  const { yourChance, foeChance, yourDamage, foeDamage } = exchange(you, foe);
  if (yourDamage <= 0 || yourChance <= 0) return 0;
  const store = (value: number): number => {
    const kept = Math.max(0, Math.min(lifeMax, value));
    return lifeMax - kept < EPSILON ? lifeMax : kept;
  };
  interface Side { life: number; foeLife: number; chance: number }
  // Life totals that differ only by rounding in the order regeneration and blows were added are one total.
  const add = (into: Map<string, Side>, life: number, foeLife: number, chance: number): void => {
    if (chance <= 0) return;
    const key = `${Math.round(life / EPSILON)}:${foeLife}`, side = into.get(key);
    if (side) side.chance += chance; else into.set(key, { life, foeLife, chance });
  };
  let sides = new Map<string, Side>();
  add(sides, life, foe.life, 1);
  let won = 0, yourGauge = 0, foeGauge = 0;
  for (let second = 0; second < seconds && sides.size; second++) {
    if (regen) {
      const rested = new Map<string, Side>();
      for (const side of sides.values()) add(rested, store(side.life + regen), side.foeLife, side.chance);
      sides = rested;
    }
    yourGauge += you.speed;
    foeGauge += foe.speed;
    for (;;) {
      const yours = yourGauge + EPSILON >= GAUGE, theirs = foeGauge + EPSILON >= GAUGE;
      if (!yours && !theirs) break;
      const next = new Map<string, Side>();
      if (yours && (!theirs || yourGauge + EPSILON >= foeGauge)) {
        yourGauge -= GAUGE;
        for (const side of sides.values()) {
          const foeLife = Math.max(0, side.foeLife - yourDamage);
          if (foeLife === 0) won += side.chance * yourChance;
          else add(next, side.life, foeLife, side.chance * yourChance);
          add(next, side.life, side.foeLife, side.chance * (1 - yourChance));
        }
      } else {
        foeGauge -= GAUGE;
        for (const side of sides.values()) {
          const hurt = store(side.life - foeDamage);
          if (Math.floor(hurt + EPSILON) >= 1) add(next, hurt, side.foeLife, side.chance * foeChance);
          add(next, side.life, side.foeLife, side.chance * (1 - foeChance));
        }
      }
      sides = next;
    }
  }
  return Math.min(1, won);
}
