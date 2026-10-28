import { records as sourceRecords } from "../src/content";
import { GameEngine } from "../src/engine";
import type { GameRecord, GameState, LogEntry, Objective } from "../src/types";

/** These priorities are the two preserved Python preferences, with `foundation` renamed to `settling`. */
export const ROUTES = {
  "channel-only": {
    prefer: ["settling", "coin_pouch", "shu_apprentice", "jade_slip", "practice_mat", "steady_breath", "fragment_notes", "breath_gathering",
      "field_kit", "cut_timber", "channel_observe", "clear_channel", "channel_arrangement", "carry_current", "channel_exercise",
      "lean_to", "herb_rack", "straw_pallet"],
    avoid: ["fernhollow_observe", "sit_fernhollow", "steady_attention", "settle_breath", "shu_reading", "strongbox",
      "garden_plot", "cot", "sparring_bout"],
  },
  "hollow-only": {
    prefer: ["settling", "coin_pouch", "shu_apprentice", "jade_slip", "breath_gathering", "fragment_notes", "practice_mat", "steady_breath",
      "fernhollow_observe", "sit_fernhollow", "steady_attention", "settle_breath", "shu_reading", "field_kit", "cut_timber",
      "lean_to", "straw_pallet"],
    avoid: ["clear_channel", "channel_arrangement", "channel_exercise", "carry_current", "channel_observe", "herb_rack",
      "strongbox", "garden_plot", "cot", "sparring_bout"],
  },
} as const;

export type OpeningRoute = keyof typeof ROUTES;

/**
 * The quickest sensible play of each opening: only what the Foundation panel asks for, chores clicked during every
 * long run, the next pursuit started as soon as one ends, and the carried current spent on the next site.
 * Pacing floors bind on these, not on the preference routes.
 */
export const DIRECT_ROUTES = {
  "channel-direct": {
    preferences: {
      prefer: ["settling", "shu_apprentice", "jade_slip", "straw_pallet", "coin_pouch", "practice_mat", "steady_breath", "field_kit",
        "channel_observe", "clear_channel", "channel_arrangement", "carry_current", "channel_exercise", "fernhollow_observe", "fragment_notes", "breath_gathering"],
      // Settling takes 3 of 4. A 90-second walk to Fernhollow is cheaper than forty coin and six timber, so the lean-to is the detour.
      avoid: ["sit_fernhollow", "steady_attention", "settle_breath", "lean_to", "herb_rack", "strongbox",
        "cot", "garden_plot", "shu_reading", "cut_timber"],
      others: 999,
    },
    // The mat is the second attunement place, so both methods can be worn at once.
    attune: ["carry_current", "steady_breath"],
    qiSense: 4,
    // Lore 1 buys the field kit the channel stones need; Circulation 2 is the core.
    enough: { fragment_notes: "g.lore >= 1", carry_current: "g.current_carried > 0", channel_exercise: "g.circulation >= 2" },
  },
  "hollow-direct": {
    preferences: {
      prefer: ["settling", "shu_apprentice", "jade_slip", "straw_pallet", "coin_pouch", "practice_mat", "steady_breath",
        "fernhollow_observe", "sit_fernhollow", "channel_observe", "steady_attention", "settle_breath", "breath_gathering"],
      // The hollow's Foundation asks for no Lore and no timber, so neither the notes nor the field kit and the lean-to behind it.
      avoid: ["clear_channel", "channel_arrangement", "channel_exercise", "carry_current", "field_kit", "cut_timber",
        "lean_to", "herb_rack", "strongbox", "cot", "garden_plot"],
      others: 999,
    },
    attune: ["settle_breath", "steady_breath"],
    enough: { steady_attention: "g.circulation >= 2" },
  },
} satisfies Record<string, Pick<RouteOptions, "preferences" | "enough" | "qiSense" | "attune">>;
export type DirectRoute = keyof typeof DIRECT_ROUTES;

export function runDirectRoute(name: DirectRoute, options: RouteOptions = {}): RouteResult {
  return runRoute(name, { ...DIRECT_ROUTES[name], attentive: true, ...options });
}
/** `others` ranks every record named in neither list; 999 keeps a route to exactly what it names. */
export interface RoutePreferences { prefer: readonly string[]; avoid: readonly string[]; others?: number }
export interface RouteResult {
  name: string;
  success: boolean;
  reason: string;
  activitySeconds: number;
  /** Activity seconds already behind the route's starting state. */
  startSeconds: number;
  foundationSeconds: number | null;
  /** When the route's goal flag was first held; Foundation for the opening routes. */
  goalSeconds: number | null;
  actions: { id: string; at: number; elapsed: number; objective: Objective; unlocks: string[]; attune?: true; release?: string; hobby?: true }[];
  unlocks: { id: string; at: number }[];
  reached: string[];
  completed: string[];
  caps: Record<string, number>;
  repetitions: Record<string, number>;
  levels: Record<string, number>;
  /** The most methods this route held attuned at one time. */
  heldAtOnce: number;
  capLog: LogEntry[];
  unsourcedCapLog: LogEntry[];
  /** Ids this route names that content no longer has; a renamed record shows up here, not as a crash. */
  unknownIds: string[];
  log: LogEntry[];
  state: GameState;
}

/**
 * These routes name content by id. When content renames or retires one, the simulation must say so
 * rather than throw, so every lookup outside the record being ranked goes through here.
 */
const held = (engine: GameEngine, id: string, field: "value" | "max" | "reps" = "value"): number =>
  engine.has(id) ? engine.stat(id)[field] : 0;

function objectiveFor(engine: GameEngine, record: GameRecord, focused: boolean, qiSense = 3): Objective {
  // Past the Qi Sense it needs, a focused player sits the breath method only for the reservoir.
  if (focused && record.id === "breath_gathering" && held(engine, "qi_sense") >= qiSense) return { kind: "resource", id: "qi", target: held(engine, "qi", "max") };
  if (record.length === "continuous" && record.train) {
    const family = engine.stat(record.train);
    if (family.value < family.max) return { kind: "level", id: record.train, target: family.value + 1 };
    // At the Qi Sense wall the same breath method can finish filling the reservoir.
    if (record.id === "breath_gathering") return { kind: "resource", id: "qi", target: held(engine, "qi", "max") };
  }
  if (record.length === "continuous") return engine.defaultObjective(record.id);
  return { kind: "repetitions", id: record.id, target: engine.stat(record.id).reps + 1 };
}

/** A focused player practises no further than the village needs; coverage branches explore past it. */
function productive(engine: GameEngine, record: GameRecord, focused: boolean, qiSense = 3): boolean {
  if (record.kind === "resource" || record.kind === "family" || record.kind === "flag" || record.kind === "lead") return false;
  if (focused) {
    // Lore 2 opens everything the village sells: the field kit at 1 and Shu's reading at 2.
    if (record.id === "fragment_notes" && held(engine, "lore") >= 2) return false;
    if (record.id === "breath_gathering" && held(engine, "qi_sense") >= qiSense && held(engine, "qi") >= held(engine, "qi", "max")) return false;
  }
  if (record.id === "sit_fernhollow") return engine.stat(record.id).reps < 3 || (!focused && held(engine, "qi_sense") < held(engine, "qi_sense", "max"));
  // A piece swapped out of its place was the lesser one; swapping it back gains nothing.
  if (engine.kept(record.id)) return false;
  if (record.max === 1 || record.kind === "breakthrough" || record.kind === "teaching" || record.length === "continuous") return true;
  // A preparation that lasts is worth taking whenever it is not in effect.
  if (record.kind === "preparation" && record.lasts) return !engine.state.effects.some(effect => effect.id === record.id);
  // A trade out of a full store is worth making even into a full purse: it keeps the method paid back in that material usable.
  if (record.group === "Trade" && Object.keys(record.cost ?? {}).some(id => engine.has(id) && engine.stat(id).value >= engine.stat(id).max)) return true;
  return Object.keys(record.result ?? {}).some(path => {
    const [id, field] = path.split(".");
    if (!engine.has(id!)) return false;
    // Uncapped tallies such as lifetime wages never make a chore worth repeating.
    if (engine.record(id!).group === "Ledger") return false;
    const stat = engine.stat(id!);
    return field === "exp" ? stat.value < stat.max : field !== undefined || stat.value < stat.max;
  });
}

function preference(engine: GameEngine, id: string, preferences: RoutePreferences): number {
  if (preferences.avoid.includes(id)) return 999;
  if (id === "sort_herbs") return engine.stat(id).reps < 3 || (held(engine, "herbs") < 10 && held(engine, "qi_sense") < 1) ? 799 : 802;
  if (id === "mill_work") return 800;
  // Before Foundation ten bundles pay the bill; after it the ridge bills want a full store.
  if (id === "gather_herbs") return held(engine, "herbs") < (held(engine, "foundation") > 0 ? held(engine, "herbs", "max") : 10) ? 798 : 999;
  if (id === "rest") return 850;
  if (id === "steady_breath") return held(engine, "vigor") < 4 ? 790 : 999;
  if (id === "carry_current") return held(engine, "current_carried") < 1 && held(engine, "qi") >= held(engine, "qi", "max") ? 795 : 999;
  const index = preferences.prefer.indexOf(id);
  return index < 0 ? preferences.others ?? 500 : index;
}

export interface RouteOptions {
  records?: GameRecord[];
  preferences?: RoutePreferences;
  /** Activity seconds this route may spend beyond its starting state. */
  maxSeconds?: number;
  maxActions?: number;
  /** Chosen, once each, after the goal is reached and before the route ends. */
  afterFoundation?: readonly string[];
  beforeFoundation?: readonly string[];
  prelude?: readonly string[];
  /** Techniques this route holds in its attunement slots, best first; defaults to those it prefers. */
  attune?: readonly string[];
  /** Defaults to true for the pacing routes; coverage branches explore past Foundation's needs. */
  focused?: boolean;
  /** The Qi Sense level a focused player trains to before sitting only for the reservoir; 3 by default. */
  qiSense?: number;
  /** Continue an existing life instead of a cold start. */
  start?: GameState;
  /** The flag that ends the route; Foundation by default. */
  goal?: string;
  /** A record stops being worth choosing once its condition holds. */
  enough?: Record<string, string | ((engine: GameEngine) => boolean)>;
  /**
   * During a sustained run the player also clicks the best instant chores and purchases each second, as a direct player does.
   * Without it, chores wait until the slot is free, which overstates the time to each goal.
   */
  attentive?: boolean;
  /** A practice run in the hobby place as soon as the place exists; it is kept out of the activity slot by `avoid`. */
  hobby?: string;
  /** Keep at least this much timber cut, instead of cutting toward the next listed piece alone. */
  timber?: number;
}

/** Real one-second engine ticks; there is no duplicated reward or leveling model here. */
export function runRoute(name: string, options: RouteOptions = {}): RouteResult {
  const chosen: RoutePreferences | undefined = options.preferences ?? ROUTES[name as OpeningRoute];
  if (!chosen) throw new Error(`No preferences for route ${name}`);
  const engine = new GameEngine(options.records ?? sourceRecords, options.start);
  // Content as the engine reads it: a dungeon's length is derived, so the runner sees it as the timed run it is.
  const records = engine.records;
  // A fixed-seed generator keeps every route's fights, and so its timings, the same from run to run.
  let seed = 0x2f6b1d;
  engine.random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Content may retire an id this route names. Drop it, and report it instead of failing on a lookup.
  const unknownIds = new Set<string>();
  const kept = (ids: readonly string[] | undefined): string[] => (ids ?? []).filter(id => engine.has(id) || !unknownIds.add(id));
  const preferences: RoutePreferences = { prefer: kept(chosen.prefer), avoid: kept(chosen.avoid), others: chosen.others };
  const prelude = kept(options.prelude);
  const beforeGoal = kept(options.beforeFoundation);
  const afterGoal = kept(options.afterFoundation);
  const enough = Object.fromEntries(Object.entries(options.enough ?? {}).filter(([id, when]) => {
    if (!engine.has(id)) return unknownIds.add(id) && false;
    if (typeof when === "function") return true;
    try { engine.condition(when); return true; } catch { return unknownIds.add(id) && false; }
  }));
  const satisfied = (id: string): boolean => {
    const when = enough[id];
    return when !== undefined && (typeof when === "function" ? when(engine) : engine.condition(when));
  };
  /** Timber is cut only toward the next piece the route still means to build, never into a full stack; a route with a `timber` floor keeps that much cut. */
  const timberShort = (): boolean => {
    if (options.timber !== undefined) return held(engine, "timber") < options.timber;
    for (const id of [...afterGoal.filter(id => engine.stat(id).reps < 1).slice(0, 1), ...preferences.prefer]) {
      if (held(engine, id) > 0 || engine.locked(id) || satisfied(id)) continue;
      const timber = engine.billProgress(id).find(row => row.id === "timber");
      if (timber) return timber.held < timber.need;
    }
    return false;
  };
  const actions: RouteResult["actions"] = [];
  const unlocks: RouteResult["unlocks"] = [];
  const seen = new Set<string>();
  const reached = new Set<string>();
  const log = new Map<number, LogEntry>();
  const startSeconds = engine.state.activitySeconds;
  const maxSeconds = startSeconds + (options.maxSeconds ?? 10800);
  const focused = options.focused ?? true;
  const goal = options.goal ?? "foundation";
  let foundationSeconds: number | null = null;
  let goalSeconds: number | null = null;
  let reason = "No productive available action";
  let heldAtOnce = 0;
  const observe = () => {
    for (const entry of engine.state.log) log.set(entry.id, { ...entry });
    for (const record of records) {
      if (engine.visible(record.id) && !seen.has(record.id)) {
        seen.add(record.id);
        unlocks.push({ id: record.id, at: engine.state.activitySeconds });
      }
      if (!engine.visible(record.id)) continue;
      const stat = engine.stat(record.id);
      if (record.kind === "family" ? stat.open : record.kind === "lead"
        ? engine.condition(record.need)
        : record.kind === "resource" || record.kind === "flag" || stat.reps > 0 || stat.value > 0 || stat.ticks > 0) reached.add(record.id);
    }
    heldAtOnce = Math.max(heldAtOnce, engine.state.attuned.length);
    if (foundationSeconds === null && held(engine, "foundation") > 0) foundationSeconds = engine.state.activitySeconds;
    if (goalSeconds === null && held(engine, goal) > 0) goalSeconds = engine.state.activitySeconds;
  };
  observe();
  let preludeIndex = 0;
  const attentive = options.attentive ?? false;
  /**
   * Attunement slots are scarce, so a player holds the techniques this route ranks highest and
   * swaps one out when a better one becomes available. Nothing attune-gated can run otherwise.
   */
  const wanted = kept(options.attune ?? chosen.prefer.filter(id => engine.has(id) && engine.record(id).attune));
  const rank = (id: string) => { const index = wanted.indexOf(id); return index < 0 ? Infinity : index; };
  const holdTechniques = () => {
    for (const id of wanted) {
      if (engine.isAttuned(id) || !engine.visible(id)) continue;
      let release: string | undefined;
      if (!engine.attune(id).ok) {
        const give = [...engine.state.attuned].sort((a, b) => rank(b) - rank(a))[0];
        if (give === undefined || rank(give) <= rank(id)) continue;
        engine.unattune(give);
        engine.attune(id);
        release = give;
      }
      actions.push({ id, at: engine.state.activitySeconds, elapsed: 0, objective: objectiveFor(engine, engine.record(id), focused, options.qiSense), unlocks: [], attune: true, release });
    }
    observe();
  };
  holdTechniques();
  const candidates = (instantOnly: boolean) => records
    // A parked pursuit is left to resume by itself; clicking it again would only run it until it stops.
    .filter(record => (!instantOnly || record.length === undefined)
      && (record.id === "cut_timber" ? timberShort() : productive(engine, record, focused, options.qiSense))
      && !satisfied(record.id) && !engine.state.waiting.some(entry => entry.id === record.id)
      && engine.availability(record.id).ok && preference(engine, record.id, preferences) < 900)
    .filter(record => record.id !== "settling" || beforeGoal.every(id => engine.stat(id).reps > 0))
    // Once the hobby has a place of its own, the slot leaves it alone.
    .filter(record => record.id !== options.hobby || engine.state.hobby !== record.id)
    .sort((a, b) => preference(engine, a.id, preferences) - preference(engine, b.id, preferences));
  /** Instant actions clicked alongside the running activity; they never replace it. */
  const chores = () => {
    // Rest is the recovery itself; spending Vigor during it would never let it end.
    if (engine.state.active && engine.record(engine.state.active.id).autoStart) return;
    const filling = engine.state.active?.objective.kind === "resource" ? engine.state.active.objective.id : undefined;
    const spends = (record: GameRecord, id: string) => [record.cost, record.buy].some(changes => Object.hasOwn(changes ?? {}, id));
    for (let clicks = 0; clicks < 20; clicks++) {
      // A chore that spends what the running objective is filling would keep it from ever stopping.
      const chore = candidates(true).find(record => !filling || !spends(record, filling));
      if (!chore) return;
      actions.push({ id: chore.id, at: engine.state.activitySeconds, elapsed: 0, objective: objectiveFor(engine, chore, focused, options.qiSense), unlocks: [] });
      engine.start(chore.id);
      observe();
    }
  };
  /** A hobby is started as soon as there is a place for it, and kept. */
  const keepLoadout = () => {
    const hobby = options.hobby;
    if (hobby && engine.has(hobby) && engine.state.hobby !== hobby && engine.startHobby(hobby).ok) {
      actions.push({ id: hobby, at: engine.state.activitySeconds, elapsed: 0, objective: objectiveFor(engine, engine.record(hobby), focused, options.qiSense), unlocks: [], hobby: true });
    }
  };
  for (let count = 0; count < (options.maxActions ?? 1200); count++) {
    holdTechniques();
    keepLoadout();
    const founded = goalSeconds !== null;
    const after = afterGoal.find(id => engine.stat(id).reps < 1);
    if (founded && !after) { reason = `${engine.has(goal) ? engine.record(goal).name ?? goal : goal} reached`; break; }
    let selected: GameRecord | undefined;
    if (preludeIndex < prelude.length) {
      const id = prelude[preludeIndex]!;
      if (!engine.availability(id).ok) { reason = `Prelude ${id}: ${engine.availability(id).reason}`; break; }
      selected = engine.record(id);
      preludeIndex++;
    } else if (founded && after && engine.state.waiting.some(entry => entry.id === after)) selected = undefined; // parked: wait for it to resume
    else if (founded && after && engine.availability(after).ok) selected = engine.record(after);
    else selected = candidates(false)[0];
    // A dungeon's next room may be shut (a door, Life for its fight, a gauge short of the room) with the dungeon parked or released; the player waits for it.
    const door = founded && after !== undefined && engine.record(after).rooms !== undefined;
    if (!selected && (engine.state.waiting.length || door)) {
      // Nothing else is worth doing: wait, as a player would, for the parked pursuit to resume or the room to open.
      const waitedFrom = engine.state.activitySeconds;
      const blocked = () => engine.state.waiting.length > 0 || (door && !engine.availability(after!).ok);
      for (let idle = 0; idle < 86400 && !(engine.state.active && !engine.record(engine.state.active.id).autoStart) && blocked(); idle++) engine.advance(1);
      observe();
      const resumed = engine.state.active;
      if (resumed && !engine.record(resumed.id).autoStart) {
        const action = { id: resumed.id, at: waitedFrom, elapsed: 0, objective: resumed.objective, unlocks: [] as string[] };
        actions.push(action);
        while (engine.state.active && engine.state.activitySeconds < maxSeconds) { if (attentive) chores(); engine.advance(1); observe(); }
        action.elapsed = engine.state.activitySeconds - action.at;
        continue;
      }
      if (door && engine.availability(after!).ok && engine.state.activitySeconds < maxSeconds) continue;
    }
    if (!selected) break;
    const objective = objectiveFor(engine, selected, focused, options.qiSense);
    const action = { id: selected.id, at: engine.state.activitySeconds, elapsed: 0, objective, unlocks: [] as string[] };
    const priorUnlockCount = unlocks.length;
    actions.push(action);
    engine.start(selected.id, objective);
    observe();
    // Instant actions leave the slot alone; an auto-started filler keeps running behind the next click, as in play.
    // An attentive player starts the next pursuit at once rather than sitting out the Rest that fills the slot.
    while (engine.state.active && selected.length !== undefined
      && (!attentive || engine.state.active.id === selected.id || !engine.record(engine.state.active.id).autoStart)) {
      if (attentive && preludeIndex >= prelude.length) chores();
      engine.advance(1);
      observe();
      if (engine.state.activitySeconds >= maxSeconds) { reason = `Activity budget ${maxSeconds}s exceeded`; break; }
    }
    action.elapsed = engine.state.activitySeconds - action.at;
    action.unlocks = unlocks.slice(priorUnlockCount).map(item => item.id);
    if (engine.state.activitySeconds >= maxSeconds) break;
    if (count === (options.maxActions ?? 1200) - 1) reason = "Action budget exceeded";
  }
  observe();
  const fullLog = [...log.values()];
  const capLog = fullLog.filter(entry => entry.kind === "cap");
  return {
    name, success: goalSeconds !== null, reason,
    activitySeconds: engine.state.activitySeconds, startSeconds, foundationSeconds, goalSeconds, actions, unlocks,
    reached: [...reached],
    completed: records.filter(record => engine.stat(record.id).reps > 0 || engine.stat(record.id).value > 0).map(record => record.id),
    caps: Object.fromEntries(records.filter(record => record.kind === "family" || record.kind === "resource").map(record => [record.id, engine.stat(record.id).max])),
    repetitions: Object.fromEntries(records.filter(record => engine.stat(record.id).reps > 0).map(record => [record.id, engine.stat(record.id).reps])),
    levels: Object.fromEntries(records.filter(record => record.kind === "family").map(record => [record.id, engine.stat(record.id).value])),
    heldAtOnce,
    capLog, unsourcedCapLog: capLog.filter(entry => /unknown|unseen|no visible|not yet|not been discovered|undiscovered|elsewhere/i.test(entry.text)),
    unknownIds: [...unknownIds], log: fullLog,
    state: structuredClone(engine.state),
  };
}

/** Separate furniture choices matter: the four-span Lean-to cannot hold all five spans. */
export function runCoverageBranches(records: GameRecord[] = sourceRecords): RouteResult[] {
  const homeBase = ["coin_pouch", "shu_apprentice", "jade_slip", "fragment_notes", "breath_gathering", "field_kit", "cut_timber", "lean_to", "strongbox"];
  return [
    // This branch goes straight to the cot rather than laying the straw pallet first.
    runRoute("furnished-hollow", {
      records, maxSeconds: 36000, maxActions: 4000, focused: false,
      preferences: { prefer: [...homeBase, "practice_mat", "herb_rack", "garden_plot", "cot", "shu_reading", "channel_observe", "clear_channel", "fernhollow_observe", "sit_fernhollow", "steady_attention", "steady_breath", "settle_breath", "settling"], avoid: ["channel_arrangement", "channel_exercise", "straw_pallet", "sparring_bout"] },
      beforeFoundation: ["practice_mat", "herb_rack", "lean_to", "strongbox", "garden_plot", "cot"],
      // The mat follows the slip now, so the slip has to be bought before the prelude can reach for it.
      prelude: ["sort_herbs", "sort_herbs", "sort_herbs", "mill_work", "mill_work", "mill_work", "shu_apprentice", "rest", "mill_work", "mill_work", "rest", "mill_work", "mill_work", "jade_slip", "rest", "mill_work", "mill_work", "practice_mat"],
      afterFoundation: ["ferry_hauling"],
    }),
    // The other half of the optional content: the strongbox and the channel stones.
    runRoute("stones-and-storage", {
      records, maxSeconds: 36000, maxActions: 4000, focused: false,
      preferences: { prefer: [...homeBase, "herb_rack", "shu_reading", "channel_observe", "clear_channel", "channel_arrangement", "channel_exercise", "fernhollow_observe", "steady_breath", "carry_current", "settling"], avoid: ["practice_mat", "sit_fernhollow", "steady_attention", "garden_plot", "cot", "sparring_bout"] },
      beforeFoundation: ["herb_rack", "lean_to", "strongbox", "channel_arrangement"],
      prelude: ["sort_herbs", "sort_herbs", "sort_herbs", "mill_work", "mill_work", "shu_apprentice"],
      afterFoundation: ["ferry_hauling"],
    }),
  ];
}

/** One First Direction each, continued from a life at Foundation. */
export const RIDGE_ROUTES = {
  "direction-body": { teaching: "body_teaching", arrangement: "load_frame", drills: "body_drills", site: "survey_marker", direction: "first_direction", crossing: "cross_body", entry: "circulation", material: "marrow_herbs", chore: "dig_marrow_herbs", method: "sink_the_load", half: "rise_with_load" },
  "direction-sword": { teaching: "sword_teaching", arrangement: "practice_post", drills: "blade_drills", site: "inscription_face", direction: "first_direction", crossing: "cross_sword", entry: "blade_intent", material: "whetstone_grit", chore: "scrape_whetstone_grit", method: "cut_by_intent", half: "let_the_blade_wait" },
  "direction-earth": { teaching: "earth_teaching", arrangement: "survey_stakes", drills: "ground_drills", site: "stable_point", direction: "first_direction", crossing: "cross_earth", entry: "ground_reading", material: "veined_ore", chore: "pry_veined_ore", method: "read_the_grain", half: "walk_the_slide" },
  "direction-formation": { teaching: "formation_teaching", arrangement: "drawing_board", drills: "array_drills", site: "fixed_layout", direction: "first_direction", crossing: "cross_formation", entry: "array_craft", material: "inked_tokens", chore: "ink_tokens", method: "fix_the_layout", half: "open_the_layout" },
} as const;
export type RidgeRoute = keyof typeof RIDGE_ROUTES;
type RidgeLine = (typeof RIDGE_ROUTES)[RidgeRoute];

function ridgeOptions(line: RidgeLine, records: GameRecord[], start: GameState, extra: readonly string[] = []): RouteOptions {
  const stocked = `g.${line.material} >= 12 || g.${line.direction} > 0 && g.${line.material} >= 3`;
  return {
    records, start, goal: "waystation", maxSeconds: 21600, focused: false,
    preferences: {
      prefer: [line.direction, line.crossing, ...extra, "ridge_outskirts", line.teaching, "field_kit", "lean_to", "strongbox", line.arrangement, "coffer", "cottage", "herb_rack",
        line.drills, line.method, line.chore, line.site, "fragment_notes", "cut_timber", "ferry_hauling"],
      avoid: [], others: 999,
    },
    // A sensible player stops each pursuit once the First Direction bill and core are covered.
    enough: {
      // The direction asks for the entry knowledge *and* the drills begun, so reaching the level is not enough.
      [line.drills]: `g.${line.entry} >= 4 && g.${line.drills}.reps > 0`,
      [line.site]: stocked, [line.chore]: stocked, [line.method]: stocked,
      fragment_notes: "g.lore >= 3", ferry_hauling: "g.coin >= g.coin.max",
      // The Lean-to's four spans hold the channel stones and one more piece; the strongbox claims it first, or wages stop at fifty.
      herb_rack: "g.strongbox < 1 && g.cottage < 1", [line.arrangement]: "g.strongbox < 1 && g.cottage < 1",
    },
    afterFoundation: ["waystation_work", `trade_${line.material}`],
  };
}

export function runRidgeRoute(name: RidgeRoute, records: GameRecord[] = sourceRecords, start = runRoute("channel-only", { records }).state, overrides: RouteOptions = {}): RouteResult {
  return runRoute(name, { ...ridgeOptions(RIDGE_ROUTES[name], records, start), ...overrides });
}

/**
 * The quickest sensible ridge play from either direct Foundation: no cottage or coffer, the strongbox before line
 * furniture, the line's method attuned in Foundation's third place, chores during every run, the next pursuit started
 * as soon as one ends, and the cache taken for the bill it shortens: traced by the earth or formation teaching, or
 * reached by fighting the bandit once the projected fight is won.
 */
export function runDirectRidgeRoute(name: RidgeRoute, records: GameRecord[] = sourceRecords, from: DirectRoute = "channel-direct", start = runDirectRoute(from, { records }).state): RouteResult {
  const line = RIDGE_ROUTES[name];
  const beatable = (engine: GameEngine) => engine.has("ridge_bandit") && engine.visible("ridge_bandit") && engine.fight("ridge_bandit").likely;
  // Four from the cache count once the cache can be reached (fought for or traced) and is still unsearched.
  const stocked = (engine: GameEngine) => held(engine, line.material) >= 12 || held(engine, line.direction) > 0 && held(engine, line.material) >= 3
    || held(engine, "ridge_cache") < 1 && held(engine, line.material) >= 8
    && (beatable(engine) || held(engine, "cache_found") > 0 || ["trace_cache_ground", "trace_cache_layout"].some(id => engine.has(id) && engine.visible(id)));
  return runRoute(from === "channel-direct" ? `${name}-direct` : `${name}-hollow-direct`, {
    records, start, goal: "waystation", maxSeconds: 21600, focused: false, attentive: true,
    preferences: {
      prefer: [line.direction, line.crossing, "ridge_cache", "trace_cache_ground", "trace_cache_layout", "ridge_bandit", "ridge_outskirts", line.teaching, "field_kit", "lean_to", "strongbox", line.arrangement,
        line.drills, line.method, line.chore, line.site, "fragment_notes", "cut_timber", "ferry_hauling"],
      avoid: ["steady_breath"], others: 999,
    },
    enough: {
      [line.drills]: `g.${line.entry} >= 4 && g.${line.drills}.reps > 0`,
      [line.site]: stocked, [line.chore]: stocked, [line.method]: stocked,
      fragment_notes: "g.lore >= 3", ferry_hauling: "g.coin >= g.coin.max",
      [line.arrangement]: "g.strongbox < 1",
      ridge_bandit: engine => !beatable(engine),
    },
    afterFoundation: ["waystation_work", `trade_${line.material}`],
  });
}

/** The bandit can be met before any direction; the Body line's Circulation decides it. */
export function runRidgeCoverage(records: GameRecord[] = sourceRecords, start = runRoute("channel-only", { records }).state): RouteResult[] {
  const line = RIDGE_ROUTES["direction-body"], extras = ["ridge_bandit", "ridge_cache", "reading_desk", "sparring_bout"];
  const options = ridgeOptions(line, records, start);
  return [runRoute("ridge-bandit-and-cottage", {
    ...options,
    // The bandit and the cottage come before the direction here, so the win is witnessed before the crossing ends the route.
    preferences: { ...options.preferences!, prefer: [...extras, ...options.preferences!.prefer] },
    enough: { ...options.enough, ridge_bandit: engine => !engine.fight("ridge_bandit").likely, sparring_bout: "g.sparring_bout.reps >= 1" },
    // The bout is won without a blow taken, so the deliberate bandit loss after the study still starts at full Life.
    prelude: ["sparring_bout", "ridge_outskirts", "fragment_notes", "sort_herbs", "sort_herbs", "sort_herbs", "ridge_bandit"],
  }),
  // The bench needs a span the Lean-to no longer has, so the cottage comes first; every teaching is read so each line's piece is made.
  runRoute("ridge-workbench", {
    ...options,
    preferences: { ...options.preferences!, prefer: ["waystation_work", "scrape_whetstone_grit", "pry_veined_ore", "ink_tokens", ...options.preferences!.prefer] },
    enough: { ...options.enough, scrape_whetstone_grit: "g.whetstone_grit >= 3", pry_veined_ore: "g.veined_ore >= 3", ink_tokens: "g.inked_tokens >= 3" },
    afterFoundation: ["waystation_work", "trade_marrow_herbs", "coffer", "cottage", "workbench",
      "craft_walking_staff", "craft_herb_poultice", "take_herb_poultice", "craft_marrow_tonic", "take_marrow_tonic",
      "sword_teaching", "inscription_face", "craft_honed_edge",
      "earth_teaching", "stable_point", "craft_weighted_stakes",
      "formation_teaching", "fixed_layout", "craft_warding_strip"],
    maxActions: 4000, maxSeconds: 36000,
  })];
}

/** What each sphere offers on the basin road; the first four continue the ridge lines, the pill sphere opens from Shu's leaves. */
export const SPHERES = {
  body: { ridge: "direction-body", family: "circulation", teaching: "conditioning_sheets", halves: ["temper_the_marrow", "carry_without_rest"], site: "scree_climb", commission: "haul_the_stores", kit: [] },
  sword: { ridge: "direction-sword", family: "blade_intent", teaching: "tam_lessons", halves: ["sever_the_knot", "send_the_intent"], site: "rope_gallery", commission: "recut_the_lines", kit: ["craft_honed_edge"] },
  earth: { ridge: "direction-earth", family: "ground_reading", teaching: "current_accounts", halves: ["root_to_the_vein", "listen_for_water"], site: "undercut_bank", commission: "shore_the_cellar", kit: ["craft_weighted_stakes"] },
  formation: { ridge: "direction-formation", family: "array_craft", teaching: "overlay_plan", halves: ["anchor_the_array", "ward_the_threshold"], site: "relay_stones", commission: "lay_the_ward_lines", kit: ["craft_warding_strip"] },
  pill: { ridge: undefined, family: "refining", teaching: "shu_three_leaves", halves: ["draw_the_essence", "temper_the_fire"], site: "pale_root_bank", commission: "stock_the_still_room", kit: ["craft_settling_draught"] },
} as const;
export type Sphere = keyof typeof SPHERES;

interface DeepSpec {
  first: Sphere; firstHalf: 0 | 1; second: Sphere; secondHalf: 0 | 1;
  /** The title record the Second Direction must read. */
  title: string;
  /** Fights the pair at the spur once the projection is likely, or deliberately before anything, to witness the loss. */
  fight?: true; loss?: true;
  specimen?: true; draughts?: true;
  hobby?: string;
}
export type DeepRoute = "pure-body" | "pure-sword" | "pure-earth" | "pure-formation" | "pill" | "pill-fire" | "mountain-vessel" | "blade-body" | "earth-array" | "intent-warden";
/**
 * Ten ways from the waystation to the Second Direction, at least one per title: the first sphere is the ridge direction's,
 * deepened with one half of its pair; the second is deepened with one half of its own, so every half is witnessed
 * across them. The pure titles fall to the sphere trained higher when the two are not a hybrid pair.
 */
export const DEEP_ROUTES: Record<DeepRoute, DeepSpec> = {
  "pure-body": { first: "body", firstHalf: 0, second: "formation", secondHalf: 1, title: "iron_marrow_adept", fight: true },
  "pure-sword": { first: "sword", firstHalf: 0, second: "earth", secondHalf: 1, title: "spirit_blade" },
  "pure-earth": { first: "earth", firstHalf: 0, second: "sword", secondHalf: 1, title: "deep_listener" },
  "pure-formation": { first: "formation", firstHalf: 0, second: "body", secondHalf: 1, title: "array_keeper", specimen: true },
  "pill": { first: "body", firstHalf: 1, second: "pill", secondHalf: 0, title: "pill_refiner", hobby: "refining_drills", draughts: true },
  "pill-fire": { first: "earth", firstHalf: 0, second: "pill", secondHalf: 1, title: "pill_refiner" },
  "mountain-vessel": { first: "body", firstHalf: 1, second: "earth", secondHalf: 0, title: "mountain_vessel" },
  "blade-body": { first: "sword", firstHalf: 1, second: "body", secondHalf: 0, title: "blade_body", loss: true },
  "earth-array": { first: "earth", firstHalf: 1, second: "formation", secondHalf: 0, title: "earth_array_adept" },
  "intent-warden": { first: "formation", firstHalf: 1, second: "sword", secondHalf: 0, title: "intent_warden" },
};

export function runDeepRoute(name: DeepRoute, records: GameRecord[] = sourceRecords, start?: GameState): RouteResult {
  const deep = DEEP_ROUTES[name], first = SPHERES[deep.first], second = SPHERES[deep.second];
  if (!first.ridge) throw new Error(`${name}: the first sphere must be a ridge direction`);
  const from = RIDGE_ROUTES[first.ridge], firstHalf = first.halves[deep.firstHalf], secondHalf = second.halves[deep.secondHalf];
  const secondLine = second.ridge ? RIDGE_ROUTES[second.ridge] : undefined;
  const waystation = start ?? runRidgeRoute(first.ridge, records).state;
  /** The ridge pair's other half for the second sphere, so both halves of every ridge pair are witnessed across the routes. */
  const secondRidgeHalf = secondLine?.half;
  const beatable = (engine: GameEngine) => engine.has("spur_pair") && engine.visible("spur_pair") && engine.fight("spur_pair").likely;
  const pillSetup = second.ridge ? [] : ["clay_vessel", "spur_clearing", "craft_walking_staff", "refining_drills", "pale_root_bank", "dig_pale_root", "craft_settling_draught", "take_settling_draught"];
  const materials = [from.material, ...secondLine ? [secondLine.material] : []];
  const repTarget = (half: string) => half === firstHalf ? 12 : 3;
  const needOf = (half: string) => records.find(record => record.id === half)?.need ?? "";
  const vigorPaid = [firstHalf, secondHalf].filter(half => /g\.vigor </.test(needOf(half)));
  // The herb trickle fills the store while away; a method paid back in herbs needs a sink until it has been used enough, and the poultice is the one every route can make.
  const herbPaid = [firstHalf, secondHalf].filter(half => /g\.herbs </.test(needOf(half)));
  const herbSinkEnough = herbPaid.map(half => `g.${half}.reps >= ${repTarget(half)}`).join(" && ");
  // The bench and the room come first: the runner cuts timber only toward the next unbuilt piece it lists, and the kit wants the bench.
  const prefer = [
    "second_direction",
    ...deep.fight ? ["spur_pair"] : [],
    "coffer", "cottage", "workbench", "ridge_room", "reading_desk",
    first.teaching, firstHalf, first.site, first.commission, ...first.kit,
    ...secondLine ? [secondLine.teaching, secondLine.arrangement, secondLine.drills, secondRidgeHalf!] : [],
    second.teaching, ...pillSetup, secondHalf, second.site, ...herbPaid.length ? ["craft_herb_poultice", "take_herb_poultice"] : [],
    ...deep.draughts ? ["craft_settling_draught", "take_settling_draught", "stock_the_still_room"] : [],
    "chime_watch", "relay_test", "spur_clearing", "craft_walking_staff", "chime_leaf", "spur_leaf", "keeper_leaf", "shu_three_leaves",
    "herb_rack", "fragment_notes", from.drills, ...secondLine ? [secondLine.chore] : [], from.chore,
    ...materials.map(material => `trade_${material}`), "breath_gathering", "waystation_work", "cut_timber", "ferry_hauling",
  ];
  // The dungeons come after Reedmarket so the arrival window keeps measuring the road alone, and before the pale-root trade, which not every route can stock.
  const after = [
    ...deep.specimen ? ["craft_specimen_case", "deliver_specimen_case"] : [],
    ...deep.draughts ? ["craft_marrow_draught", "take_marrow_draught", "craft_clear_pill", "take_clear_pill"] : [],
    "landslide_rise", "terrace_bypass", "reedmarket_work", "survey_tunnel", "reedmarket_cistern", "cistern_slip_leaf", "trade_pale_root",
  ];
  return runRoute(name, {
    records, start: waystation, goal: "second_direction", maxSeconds: 21600, maxActions: 4000, focused: false, attentive: true, timber: 6,
    preferences: { prefer, avoid: [], others: 999 },
    attune: [firstHalf, secondHalf, from.method, ...secondRidgeHalf ? [secondRidgeHalf] : [], "steady_breath"],
    hobby: deep.hobby,
    // A deliberate loss first, at Foundation stats: it keeps nothing and costs only the preparation.
    prelude: deep.loss ? ["spur_pair"] : [],
    enough: {
      [from.drills]: `g.${first.family} >= 6`,
      ...secondLine ? { [secondLine.drills]: `g.${second.family} >= 5`, [secondLine.chore]: `g.${secondLine.material} >= 6`, [secondRidgeHalf!]: `g.${secondRidgeHalf}.reps >= 1` } : { refining_drills: "g.refining >= 5", dig_pale_root: "g.pale_root >= 6" },
      [firstHalf]: `g.${firstHalf}.reps >= 12`, [secondHalf]: `g.${secondHalf}.reps >= 3`,
      [first.site]: `g.${first.site}.reps >= 2`, [second.site]: `g.${second.site}.reps >= 2`,
      [from.chore]: `g.${from.material} >= 6`,
      // A store is traded only when it is nearly full, so a method that pays into it can still be used; wages stop short of the purse so trades stay worth making.
      ...Object.fromEntries(materials.map(material => [`trade_${material}`, `g.${material} < g.${material}.max - 2`])),
      // A method paid back in Vigor is used between chores, so wages go on until it has been used enough.
      waystation_work: `g.coin >= g.coin.max - 30${vigorPaid.length ? ` && ${vigorPaid.map(half => `g.${half}.reps >= ${repTarget(half)}`).join(" && ")}` : ""}`,
      fragment_notes: "g.lore >= 6", ferry_hauling: "g.coin >= g.coin.max - 30", herb_rack: "g.cottage < 1 && g.ridge_room < 1",
      // Herbs are gathered toward the bill, not into a full store, so a method paid back in herbs can still be used.
      gather_herbs: "g.herbs >= 34", sort_herbs: "g.herbs >= 34",
      craft_settling_draught: "g.settling_draught >= 2",
      ...herbPaid.length ? { craft_herb_poultice: herbSinkEnough, take_herb_poultice: herbSinkEnough } : {},
      spur_pair: engine => engine.stat("spur_pair").reps >= 1 || !beatable(engine),
    },
    afterFoundation: after,
  });
}

export function compactRoute(result: RouteResult) {
  const { state, actions, ...report } = result;
  return { ...report, actionCount: actions.length, bank: state.bank };
}

/** A readable trace of every opening; the pace bands themselves are enforced only by `bun run validate`. */
if (import.meta.main) {
  const results = [
    ...(Object.keys(ROUTES) as OpeningRoute[]).map(name => runRoute(name)),
    ...(Object.keys(DIRECT_ROUTES) as DirectRoute[]).map(name => runDirectRoute(name)),
  ];
  if (process.argv.includes("--json")) console.log(JSON.stringify(results.map(compactRoute), null, 2));
  else for (const result of results) {
    console.log(`${result.name}: Foundation ${result.success ? "YES" : "NO"}; ${(result.activitySeconds / 60).toFixed(2)} active min; ${result.reason}`);
    console.log(`  ${result.unlocks.map(item => `${(item.at / 60).toFixed(2)}m ${item.id}`).join(" → ")}`);
    console.log(`  ${result.unsourcedCapLog.length} cap lines naming nothing that raises them`);
  }
  if (results.some(result => !result.success)) process.exitCode = 1;
}
