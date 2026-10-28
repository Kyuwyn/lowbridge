/** Content is declarative; expression strings are interpreted by expression.ts. */
export type Expression = string;
export type Changes = Record<string, number | Expression>;
/** `recipe`: a timed run at the workbench that fills a store. `preparation`: an instant action spending a dose from a store. */
export type RecordKind = "resource" | "family" | "task" | "site" | "arrangement" | "home" | "class" | "breakthrough" | "teaching" | "recipe" | "preparation" | "technique" | "purchase" | "flag" | "lead";

/**
 * Six of these fields are derived: `recompute` rebuilds `max`, `rate`, `open`, `length`, `yield`
 * and `discount` from content and owned records every time anything changes. The rest is the
 * authoritative record of what the character has done, and only it is saved.
 */
export interface Stat {
  value: number;
  max: number;
  exp: number;
  rate: number;
  reps: number;
  open: boolean;
  length: number;
  yield: number;
  /** Share taken off costs: on an action, everything it spends; on a resource, that resource wherever it is spent. */
  discount: number;
  ticks: number;
  started: boolean;
  /** A finite run's entry bill is paid and the run is unfinished. */
  paid: boolean;
}

/** The fields `recompute` owns; nothing else may write them. */
export const DERIVED_FIELDS = ["max", "rate", "open", "length", "yield", "discount"] as const;
export type DerivedField = (typeof DERIVED_FIELDS)[number];

export interface NarrativeEvent {
  id: string;
  when: Expression;
  text: string;
  changes?: Changes;
}

export interface Breakthrough {
  title?: string;
  core: Expression;
  coreLabel?: string;
  pointers: { label: string; when: Expression }[];
  required: number;
}

export interface GameRecord {
  id: string;
  kind: RecordKind;
  name?: string;
  desc?: string;
  /** Italic closing line of the tooltip; never load-bearing. */
  flavor?: string;
  group?: string;
  /** Counted by `g.t_<tag>` in expressions: how many owned records carry the tag. */
  tags?: string[];
  require?: Expression;
  need?: Expression;
  needtext?: string;
  initial?: Partial<Stat>;
  max?: number;
  buy?: Changes;
  cost?: Changes;
  length?: number | "continuous";
  /** Positive run amounts are resources consumed per activity second. */
  run?: Changes;
  effect?: Changes;
  result?: Changes;
  /** Paid once while owned, per unit held for a resource; `X.mod.Y` patches another record's payout. */
  mod?: Changes;
  /** A family's payout for every level it holds; the table `X.mod.Y` patches. */
  perLevel?: Changes;
  /** First start only, even when that activity is subsequently interrupted. */
  onStart?: Changes;
  /** Repetition thresholds; for continuous practice these are activity seconds, for a family its levels. */
  at?: Record<string, Changes>;
  every?: Record<string, Changes>;
  /** Resources whose caps end the run: the activity stops once all of them are full. */
  fill?: string | string[];
  /** Records this one removes for good when it is acquired. */
  lock?: string[];
  /** Records this one restores, undoing an earlier lock. */
  enable?: string[];
  /** Confirmation text shown before an irreversible action. */
  warn?: string;
  /** A technique that occupies an attunement slot before it can be used. */
  attune?: boolean;
  space?: number;
  train?: string;
  strain?: Changes;
  events?: NarrativeEvent[];
  breakthrough?: Breakthrough;
  /** An idle filler: it starts by itself whenever the activity slot is empty and nothing waiting can resume. */
  autoStart?: boolean;
  /** Timed runs go faster while the flag is held; one completion spends it. */
  boost?: { flag: string; multiplier: number };
  /** Typed places a home offers; one arrangement per place. */
  slots?: string[];
  /** The home place this arrangement occupies instead of floor spans. */
  slot?: string;
  /** Shown as the character's standing while this class is held. */
  title?: string;
  /** Standing modifiers paid while this technique holds an attunement place or this preparation is in effect. */
  held?: Changes;
  /** Fought across the timed run: each side swings whenever its gauge fills, until one side falls or the run's length runs out. */
  encounter?: Encounter;
  /** A continuous practice that may run in the hobby place at half pace beside the activity slot. */
  hobby?: boolean;
  /** A preparation whose `held` table is paid for this many activity seconds after it is taken. */
  lasts?: number;
}

/** Hit and dodge are percentages. */
export interface Fighter { strike: number; guard: number; speed: number; hit: number; dodge: number }

export interface Foe extends Fighter {
  name: string;
  life: number;
  /** Every `every`-th swing of the foe, counted across the whole fight, uses `strike` instead of its ordinary strike. */
  technique?: { name: string; every: number; strike: number };
}

export interface Encounter {
  foe: Foe;
  success: Changes;
  failureText: string;
}

/**
 * A fight as it would go if started now. The race times are averages; `winChance` is exact under the real
 * swing rules, though a real fight still rolls every swing.
 */
export interface FightProjection {
  foe: Foe;
  you: Fighter;
  life: number;
  lifeMax: number;
  /** What each attuned technique's `held` table adds to the fight stats. */
  held: { id: string; adds: Partial<Fighter> }[];
  /** Chance a swing lands, 0 to 1, and what it takes when it does. */
  yourChance: number; foeChance: number; yourDamage: number; foeDamage: number;
  /** Average seconds for each side to fell the other; Infinity when its swings cannot hurt. */
  winSeconds: number; loseSeconds: number;
  limit: number;
  /** Probability, 0 to 1, of felling the foe within the limit, from Life held now and the foe at full. */
  winChance: number;
  verdict: FightVerdict;
  /** The verdict in the player's words: "Likely win · about 84%". */
  verdictText: string;
  /** The cheapest change that would improve the verdict, when there is one. */
  flip?: string;
  /** `winChance` is at least one half. */
  likely: boolean;
}

/** At least 0.95, 0.75 to 0.95, 0.5 to 0.75, below 0.5, and no damage at all. */
export type FightVerdict = "certain" | "likely" | "close" | "loss" | "hopeless";

/** One resource of a record's bill: what is held against what starting it spends. */
export interface BillRow { id: string; label: string; held: number; need: number }

export interface Objective {
  kind: "repetitions" | "level" | "resource";
  id: string;
  /** Absolute total, not an additional amount. */
  target: number;
}

export interface ActiveTask {
  id: string;
  progress: number;
  objective: Objective;
}

export interface LogEntry {
  id: number;
  kind: "discovery" | "story" | "cap" | "completion" | "pause" | "purchase" | "method" | "home" | "fight";
  text: string;
  activitySeconds: number;
}

export interface Bank {
  seconds: number;
  cap: number;
  /** While set and an activity runs, every wall second also spends one banked second on it. Cleared when the activity stops. */
  accelerating: boolean;
}

/** Exact character/world snapshot. The bank balance lives outside it. */
export interface WorldState {
  stats: Record<string, Stat>;
  active: ActiveTask | null;
  /** Pursuits that resume, in order, whenever the activity slot frees and they are startable. */
  waiting: ActiveTask[];
  activitySeconds: number;
  visibleIds: string[];
  /** Records another record has removed; they are hidden until something enables them again. */
  lockedIds: string[];
  /** Techniques currently held in attunement slots, in the order they were taken. */
  attuned: string[];
  eventIds: string[];
  capHits: string[];
  log: LogEntry[];
  /** Sub-second wall time reserved toward the next 1-second activity tick. */
  wallRemainder: number;
  /** Why the last sustained activity left the slot; cleared when the player starts another. */
  lastStop?: string;
  /** The fight being played out, or the last one until the player starts something else. */
  fight?: FightState;
  /** The practice running in the hobby place at half pace, if any. */
  hobby: string | null;
  /** Lasting preparations in effect, each with the activity seconds it has left. */
  effects: { id: string; remaining: number }[];
}

/** A fight under way or just finished. Your stats are taken as it begins; your Life is the live store. */
export interface FightState {
  id: string;
  you: Fighter;
  /** Whole Life you entered with. */
  life: number;
  foeLife: number;
  /** Action gauges; a side swings each time its gauge reaches the fight's gauge length. */
  yourGauge: number;
  foeGauge: number;
  /** Fight seconds played. */
  seconds: number;
  /** Swings taken and landed by each side. */
  swings: number;
  landed: number;
  foeSwings: number;
  foeLanded: number;
  /** Absent while the fight runs. */
  result?: "won" | "life" | "outlasted";
  /** The fight's own log, newest last. */
  lines: string[];
}

export interface GameState extends WorldState {
  bank: Bank;
}

export interface Availability {
  ok: boolean;
  reason: string;
}

/** The tooltip schema: every record kind renders these blocks, in this order, empty ones omitted. */
export const TOOLTIP_BLOCKS = ["title", "type", "rate", "desc", "time", "fight", "need", "cost", "effect", "mod", "result", "lock", "flavor"] as const;
export type TooltipBlockKind = (typeof TOOLTIP_BLOCKS)[number];

export interface TooltipBlock {
  kind: TooltipBlockKind;
  /** Heading for the block; absent on title, description and flavour. */
  label?: string;
  lines: string[];
}

export interface AdvanceResult {
  activitySeconds: number;
  bankedSeconds: number;
  spentSeconds: number;
  reason?: string;
}
