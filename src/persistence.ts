import type { ActiveTask, FightState, GameRecord, GameState, LogEntry, Objective, Stat, WorldState } from './types';
import { DODGE_MAX, FIGHT_LINES, GAUGE, GameEngine, WAITING_MAX } from './engine';

export const SAVE_FORMAT = 'lowbridge-save';
export const SAVE_VERSION = 7;
export const DATABASE_NAME = 'lowbridge-first-slice';
const LOG_KINDS = ['discovery', 'story', 'cap', 'completion', 'pause', 'purchase', 'method', 'home', 'fight'];
const OBJECTIVE_KINDS = ['repetitions', 'level', 'resource'];
const FIGHT_RESULTS = ['won', 'life', 'outlasted'];
/** Everything else about a record (caps, rates, durations, yields, discounts) is recomputed on load. */
const SAVED_FIELDS = ['value', 'exp', 'reps', 'ticks', 'started', 'paid'] as const;
const ITEM_KEYS = new Set<string>([...SAVED_FIELDS, 'seen', 'locked']);

/** What one record remembers; absent fields are at their content defaults. */
export interface SavedItem {
  value?: number;
  exp?: number;
  reps?: number;
  ticks?: number;
  started?: boolean;
  paid?: boolean;
  /** Discovered. Most entries in a real save are nothing but this. */
  seen?: boolean;
  /** Removed by another record. */
  locked?: boolean;
}

/** A sparse delta keyed by stable record id, not a copy of the content. */
export interface SaveFile {
  format: typeof SAVE_FORMAT;
  version: typeof SAVE_VERSION;
  savedAt: number;
  activitySeconds: number;
  wallRemainder: number;
  /** Banked seconds; the cap is derived from owned records. */
  bank: number;
  /** Set only while the bank is being spent on a running activity. */
  accelerating?: boolean;
  items: Record<string, SavedItem>;
  active: ActiveTask | null;
  waiting: ActiveTask[];
  attuned: string[];
  events: string[];
  capHits: string[];
  log: LogEntry[];
  lastStop?: string;
  fight?: FightState;
  hobby: string | null;
  effects: { id: string; remaining: number }[];
  stance: string | null;
}

export interface DecodedSave {
  save: SaveFile;
  state: GameState;
}

// The explicit annotation is what lets TypeScript treat a failed check as a narrowing.
const fail: (message: string) => never = message => { throw new Error(`Save could not be loaded: ${message}`); };

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} is missing or invalid.`);
  return value as Record<string, unknown>;
}

function number(value: unknown, label: string, maximum = Number.MAX_SAFE_INTEGER): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > maximum) fail(`${label} is not a valid number.`);
  return value as number;
}

function strings(value: unknown, label: string, known?: Set<string>): string[] {
  if (!Array.isArray(value) || value.length > 5000 || value.some(id => typeof id !== 'string' || id.length > 1000 || (known && !known.has(id)))) {
    fail(`${label} contains invalid entries.`);
  }
  return value as string[];
}

function flag(value: unknown, label: string): boolean {
  if (value !== undefined && typeof value !== 'boolean') fail(`${label} is invalid.`);
  return value === true;
}

/** Only what differs from a fresh record is written. */
export function makeSave(state: GameState, records: GameRecord[], savedAt = Date.now()): SaveFile {
  const items: Record<string, SavedItem> = {};
  for (const record of records) {
    const stat = state.stats[record.id];
    if (!stat) continue;
    const fresh = GameEngine.initialStat(record), item: SavedItem = {};
    for (const field of SAVED_FIELDS) {
      if (stat[field] !== fresh[field]) (item as Record<string, unknown>)[field] = stat[field];
    }
    if (state.visibleIds.includes(record.id)) item.seen = true;
    if (state.lockedIds.includes(record.id)) item.locked = true;
    if (Object.keys(item).length) items[record.id] = item;
  }
  return {
    format: SAVE_FORMAT, version: SAVE_VERSION, savedAt,
    activitySeconds: state.activitySeconds, wallRemainder: state.wallRemainder, bank: state.bank.seconds,
    ...state.bank.accelerating ? { accelerating: true } : {},
    items,
    active: state.active ? structuredClone(state.active) : null,
    waiting: structuredClone(state.waiting),
    attuned: [...state.attuned],
    events: [...state.eventIds],
    capHits: [...state.capHits],
    log: structuredClone(state.log),
    ...state.lastStop === undefined ? {} : { lastStop: state.lastStop },
    ...state.fight ? { fight: structuredClone(state.fight) } : {},
    hobby: state.hobby, effects: structuredClone(state.effects), stance: state.stance,
  };
}

/** Undefined for the earlier exchange-count shape, which carried nothing a fight can resume from. */
function readFight(input: unknown, definitions: Map<string, GameRecord>): FightState | undefined {
  const fight = object(input, 'The fight');
  if (fight.you === undefined && fight.exchange !== undefined) return undefined;
  const encounter = definitions.get(fight.id as string)?.encounter;
  if (!encounter) fail('the fight names no fight.');
  const whole = (value: unknown, label: string, maximum?: number) => {
    const amount = number(value, label, maximum);
    if (!Number.isInteger(amount)) fail(`${label} must be a whole number.`);
    return amount;
  };
  const you = object(fight.you, 'Your fight stats');
  if (!Array.isArray(fight.lines) || fight.lines.length > FIGHT_LINES || fight.lines.some(line => typeof line !== 'string' || line.length > 1000)) fail('the fight log is invalid.');
  if (fight.result !== undefined && !FIGHT_RESULTS.includes(fight.result as string)) fail('the fight result is invalid.');
  const state: FightState = {
    id: fight.id as string,
    you: { strike: whole(you.strike, 'Fight strike'), guard: whole(you.guard, 'Fight guard'), speed: number(you.speed, 'Fight speed'),
      hit: number(you.hit, 'Fight hit', 100), dodge: number(you.dodge, 'Fight dodge', DODGE_MAX) },
    life: whole(fight.life, 'Fight life'), foeLife: whole(fight.foeLife, 'Foe life', encounter.foe.life),
    yourGauge: number(fight.yourGauge, 'Your gauge', GAUGE), foeGauge: number(fight.foeGauge, 'Foe gauge', GAUGE),
    seconds: whole(fight.seconds, 'Fight time'), swings: whole(fight.swings, 'Your swings'), landed: whole(fight.landed, 'Your landed swings'),
    foeSwings: whole(fight.foeSwings, 'Foe swings'), foeLanded: whole(fight.foeLanded, 'Foe landed swings'), lines: [...fight.lines as string[]],
  };
  if (state.landed > state.swings || state.foeLanded > state.foeSwings) fail('the fight counts more landed swings than swings.');
  if (fight.result !== undefined) state.result = fight.result as FightState['result'];
  return state;
}

function readObjective(input: unknown, known: Set<string>, definitions: Map<string, GameRecord>, label: string): Objective {
  const objective = object(input, label);
  const target = number(objective.target, `${label} target`);
  if (!known.has(objective.id as string) || !OBJECTIVE_KINDS.includes(objective.kind as string)) fail(`${label} is invalid.`);
  if (objective.kind !== 'resource' && !Number.isInteger(target)) fail(`${label} must be a whole number.`);
  if (objective.kind === 'level' && definitions.get(objective.id as string)?.kind !== 'family') fail(`${label} names no knowledge.`);
  if (objective.kind === 'resource' && definitions.get(objective.id as string)?.kind !== 'resource') fail(`${label} names no store.`);
  return { kind: objective.kind as Objective['kind'], id: objective.id as string, target };
}

function readTask(input: unknown, known: Set<string>, definitions: Map<string, GameRecord>, label: string): ActiveTask {
  const entry = object(input, label);
  const record = definitions.get(entry.id as string);
  if (!record || record.length === undefined || record.length === 0) fail(`${label} is invalid.`);
  const progress = number(entry.progress, `${label} progress`);
  const objective = readObjective(entry.objective, known, definitions, `${label} objective`);
  if (objective.kind === 'repetitions' && objective.id !== entry.id) fail(`${label} aims at another activity.`);
  return { id: entry.id as string, progress, objective };
}

/**
 * Rejects anything that could replace a live game with nonsense. Ids the content no longer has are
 * skipped rather than refused: a delta keyed by stable ids is meant to survive content changing
 * around it, and every derived number is rebuilt from today's content anyway.
 */
export function decodeSave(input: unknown, records: GameRecord[]): DecodedSave {
  const raw = typeof input === 'string' ? JSON.parse(input) as unknown : input;
  const save = object(raw, 'Save');
  if (save.format !== SAVE_FORMAT) fail('this is not a Lowbridge save.');
  if (save.version !== SAVE_VERSION) {
    const version = typeof save.version === 'number' ? save.version : 0;
    fail(version < SAVE_VERSION
      ? `this save is version ${version}. Lowbridge now rebuilds every cap and rate from content, and version ${SAVE_VERSION} is the first format that can be read that way. Export it if you want to keep it, then start a new journey.`
      : `this save is version ${version}, newer than this build understands.`);
  }
  const savedAt = number(save.savedAt, 'Save time', 8.64e15);
  const known = new Set(records.map(record => record.id));
  const definitions = new Map(records.map(record => [record.id, record]));

  const stats: Record<string, Stat> = {};
  for (const record of records) stats[record.id] = GameEngine.initialStat(record);
  const visibleIds: string[] = [];
  const lockedIds: string[] = [];
  const items = object(save.items, 'Save records');
  if (Object.keys(items).length > 5000) fail('this save holds too many records.');
  const kept: Record<string, SavedItem> = {};
  for (const record of records) {
    if (!Object.hasOwn(items, record.id)) continue;
    const item = object(items[record.id], `${record.id}`);
    for (const key of Object.keys(item)) if (!ITEM_KEYS.has(key)) fail(`${record.id} carries an unknown field ${key}.`);
    const stat = stats[record.id]!, saved: SavedItem = {};
    for (const field of ['value', 'exp', 'reps', 'ticks'] as const) {
      if (item[field] === undefined) continue;
      stat[field] = number(item[field], `${record.id}.${field}`);
      saved[field] = stat[field];
    }
    if (!Number.isInteger(stat.reps) || !Number.isInteger(stat.ticks)) fail(`${record.id} counters must be whole numbers.`);
    for (const field of ['started', 'paid'] as const) {
      if (item[field] === undefined) continue;
      stat[field] = flag(item[field], `${record.id}.${field}`);
      saved[field] = stat[field];
    }
    if (stat.paid && typeof record.length !== 'number') fail(`${record.id} cannot hold a paid run.`);
    if (record.kind === 'family' && (!Number.isInteger(stat.value) || stat.exp >= 60 * (stat.value + 1) + 1e-7)) fail(`${record.id} practice progress is invalid.`);
    if (flag(item.seen, `${record.id}.seen`)) { visibleIds.push(record.id); saved.seen = true; }
    if (flag(item.locked, `${record.id}.locked`)) { lockedIds.push(record.id); saved.locked = true; }
    if (Object.keys(saved).length) kept[record.id] = saved;
  }

  const world: WorldState = {
    stats, active: null, waiting: [],
    activitySeconds: number(save.activitySeconds, 'Activity time'),
    visibleIds, lockedIds,
    attuned: strings(save.attuned, 'Attuned techniques', known).filter(id => definitions.get(id)?.attune === true),
    eventIds: strings(save.events, 'Discoveries'),
    capHits: strings(save.capHits, 'Cap notices'),
    log: [],
    wallRemainder: number(save.wallRemainder, 'Partial tick', 1),
    hobby: null, effects: [], stance: null,
  };
  if (save.hobby !== null) {
    const record = typeof save.hobby === 'string' ? definitions.get(save.hobby) : undefined;
    if (!record || record.hobby !== true || record.length !== 'continuous') fail('the hobby is invalid.');
    world.hobby = record.id;
  }
  if (save.stance !== null) {
    const record = typeof save.stance === 'string' ? definitions.get(save.stance) : undefined;
    if (!record || record.stance !== true) fail('the stance is invalid.');
    world.stance = record.id;
  }
  if (!Array.isArray(save.effects) || save.effects.length > 100) fail('the preparations in effect are invalid.');
  for (const item of save.effects as unknown[]) {
    const entry = object(item, 'A preparation in effect');
    const record = typeof entry.id === 'string' ? definitions.get(entry.id) : undefined;
    if (!record || record.kind !== 'preparation' || !record.lasts) fail('a preparation in effect is not a lasting preparation.');
    const remaining = number(entry.remaining, `${record.id} time left`);
    if (remaining <= 0) fail(`${record.id} has no time left.`);
    if (world.effects.some(effect => effect.id === record.id)) fail(`${record.id} is in effect twice.`);
    world.effects.push({ id: record.id, remaining });
  }
  if (world.wallRemainder >= 1) fail('the partial tick is invalid.');
  if (save.lastStop !== undefined) {
    if (typeof save.lastStop !== 'string' || save.lastStop.length > 1000) fail('the stop reason is invalid.');
    world.lastStop = save.lastStop;
  }
  const fight = save.fight === undefined ? undefined : readFight(save.fight, definitions);
  if (fight) world.fight = fight;
  if (!Array.isArray(save.log) || save.log.length > 5000) fail('the journal is invalid.');
  for (const entry of save.log as unknown[]) {
    const line = object(entry, 'Journal entry');
    number(line.id, 'Journal id');
    number(line.activitySeconds, 'Journal time');
    if (typeof line.text !== 'string' || line.text.length > 10000 || !LOG_KINDS.includes(line.kind as string)) fail('a journal entry is invalid.');
    world.log.push({ id: line.id as number, kind: line.kind as LogEntry['kind'], text: line.text, activitySeconds: line.activitySeconds as number });
  }
  if (save.active !== null) world.active = readTask(save.active, known, definitions, 'The running activity');
  if (!Array.isArray(save.waiting) || save.waiting.length > WAITING_MAX) fail('the waiting list is invalid.');
  const queued = new Set<string>(world.active ? [world.active.id] : []);
  for (const item of save.waiting as unknown[]) {
    const entry = readTask(item, known, definitions, 'A waiting entry');
    // Timed progress waits in the record's own stat, never in the entry.
    if (entry.progress !== 0) fail('a waiting entry holds progress.');
    if (queued.has(entry.id)) fail(`the waiting list names ${entry.id} twice.`);
    queued.add(entry.id);
    world.waiting.push(entry);
  }
  const bank = number(save.bank, 'Bank balance');
  const accelerating = flag(save.accelerating, 'Bank acceleration');
  if (accelerating && !world.active) fail('the bank cannot be spent with nothing running.');

  // Building the engine recomputes every derived field, so the checks below see today's caps.
  const engine = new GameEngine(records, { ...world, bank: { seconds: bank, cap: bank, accelerating } });
  const state = engine.state;
  state.bank.seconds = Math.min(bank, state.bank.cap);
  state.bank.accelerating = accelerating && state.active !== null && state.bank.seconds >= 1;
  // Content can shorten a timed record under a save: progress past today's length is held just short of it, so the run finishes instead of being refused.
  for (const record of records) {
    if (typeof record.length !== 'number') continue;
    const stat = engine.stat(record.id), limit = Math.max(0, stat.length - 1);
    if (stat.exp > limit) { stat.exp = limit; (kept[record.id] ??= {}).exp = limit; }
  }
  if (state.active && typeof engine.record(state.active.id).length === 'number') {
    state.active.progress = Math.min(state.active.progress, Math.max(0, engine.stat(state.active.id).length - 1));
  }
  if (state.active) {
    if (typeof engine.record(state.active.id).length === 'number' && !engine.stat(state.active.id).paid) fail('the running activity has not paid its entry.');
    const valid = engine.objectiveAvailability(state.active.id, state.active.objective, state.active.progress);
    if (!valid.ok) fail(valid.reason);
  }
  for (const entry of state.waiting) {
    const valid = engine.objectiveAvailability(entry.id, entry.objective);
    if (!valid.ok) fail(valid.reason);
  }
  if (state.hobby && state.active?.id === state.hobby) fail('the hobby is also the running activity.');
  return {
    save: {
      format: SAVE_FORMAT, version: SAVE_VERSION, savedAt,
      activitySeconds: world.activitySeconds, wallRemainder: world.wallRemainder, bank: state.bank.seconds,
      ...state.bank.accelerating ? { accelerating: true } : {},
      items: kept,
      active: state.active ? structuredClone(state.active) : null,
      waiting: structuredClone(state.waiting),
      attuned: [...state.attuned], events: [...state.eventIds], capHits: [...state.capHits], log: structuredClone(state.log),
      ...world.lastStop === undefined ? {} : { lastStop: world.lastStop },
      ...state.fight ? { fight: structuredClone(state.fight) } : {},
      hobby: state.hobby, effects: structuredClone(state.effects), stance: state.stance,
    },
    state: engine.snapshot(),
  };
}

export class SaveStore {
  private constructor(private db: IDBDatabase) {}

  static async open(): Promise<SaveStore> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('saves');
      request.onerror = () => reject(request.error || new Error('Browser storage is unavailable.'));
      request.onblocked = () => reject(new Error('Another Lowbridge tab is blocking save storage. Close it and reload.'));
      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close();
        resolve(new SaveStore(request.result));
      };
    });
  }

  async load(records: GameRecord[]): Promise<{ decoded: DecodedSave | null; recovered: boolean }> {
    const slots = await new Promise<unknown[]>((resolve, reject) => {
      const transaction = this.db.transaction('saves', 'readonly');
      const store = transaction.objectStore('saves');
      const current = store.get('current');
      const backup = store.get('backup');
      transaction.oncomplete = () => resolve([current.result, backup.result]);
      transaction.onabort = () => reject(transaction.error || new Error('Could not read save storage.'));
    });
    if (slots[0] === undefined && slots[1] === undefined) return { decoded: null, recovered: false };
    let lastError: unknown;
    for (let index = 0; index < slots.length; index++) {
      if (slots[index] === undefined) continue;
      try { return { decoded: decodeSave(slots[index], records), recovered: index === 1 }; }
      catch (error) { lastError = error; }
    }
    throw lastError || new Error('No readable Lowbridge save was found.');
  }

  /** Save and backup update together; resolve only after the transaction commits. */
  async write(save: SaveFile, records: GameRecord[]): Promise<void> {
    const checked = decodeSave(save, records).save;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('saves', 'readwrite');
      const store = transaction.objectStore('saves');
      const previous = store.get('current');
      previous.onsuccess = () => {
        if (previous.result !== undefined) {
          try { store.put(decodeSave(previous.result, records).save, 'backup'); }
          catch { /* Preserve the valid backup if current storage is damaged. */ }
        }
        store.put(checked, 'current');
      };
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error || new Error('The browser could not save progress.'));
    });
  }

  close() { this.db.close(); }
}
