import { openingContext, routeKeys, records as sourceRecords } from "../src/content";
import { ATTUNE_SLOTS, DODGE_MAX, FIGHT_STATS, GAUGE, GameEngine, HOME_SPACE, LIFE } from "../src/engine";
import { evaluateCondition, expressionReferences } from "../src/expression";
import { DERIVED_FIELDS, type Changes, type GameRecord } from "../src/types";
import { compactRoute, DIRECT_ROUTES, RIDGE_ROUTES, ROUTES, runCoverageBranches, runDirectRidgeRoute, runDirectRoute, runRidgeCoverage, runRidgeRoute, runRoute, type DirectRoute, type OpeningRoute, type RidgeRoute, type RouteResult } from "./routes";

export interface ValidationReport {
  ok: boolean;
  errors: string[];
  routes: RouteResult[];
  coverageBranches: RouteResult[];
  /** Foundation to the waystation, one First Direction each, plus the bandit-and-cottage branch. */
  ridgeRoutes: RouteResult[];
  recordCount: number;
  reachedCount: number;
  missing: string[];
}

const statFields = new Set(["value", "max", "exp", "rate", "reps", "open", "length", "yield", "discount", "ticks", "started", "paid"]);
const derivedFields = new Set<string>(DERIVED_FIELDS);
const passiveKinds = new Set(["resource", "family", "flag", "lead"]);
const kinds = new Set<string>(["resource", "family", "task", "site", "arrangement", "home", "class", "breakthrough", "teaching", "recipe", "technique", "purchase", "flag", "lead"]);
/** The whole record vocabulary; anything else in the JSON is a typo or a field the engine dropped. */
const recordFields = new Set(["id", "kind", "name", "desc", "flavor", "group", "tags", "require", "need", "needtext", "initial", "max",
  "buy", "cost", "length", "run", "effect", "result", "mod", "perLevel", "onStart", "at", "every", "fill", "lock", "enable", "warn",
  "attune", "space", "train", "strain", "events", "breakthrough", "autoStart", "boost", "slots", "slot", "title", "encounter", "held"]);
/** About fifteen active minutes to Foundation, measured on the quickest sensible play. */
export const FOUNDATION_FLOOR = 720;
export const FOUNDATION_CEILING = 1200;
/** Circulation must be open with room to use it, at the same share of the run the old window held. */
export const CIRCULATION_WINDOW = 850;
/** No outing, sitting or breakthrough may hold the slot longer than this. */
export const TIMED_CEILING = 180;
/** Activity seconds from Foundation to the waystation, on every ridge route. */
export const RIDGE_FLOOR = 900;
export const RIDGE_CEILING = 2700;

/** Fields content used to carry. Naming them beats "unknown field" when an old record is pasted in. */
export const REMOVED_FIELDS = ["disable", "runway", "raisers", "lifespan", "age", "checkpoint", "pauseOnReveal", "pauseOnComplete", "perpetual", "secret"];
const bankPaths = new Set(["bank", "bank.value", "bank.seconds", "bank.max", "bank.cap"]);
/** The engine owns both of these amounts; content may only raise their caps. */
const countedStores = new Set([HOME_SPACE, ATTUNE_SLOTS]);

function expressions(record: GameRecord): string[] {
  const result = [record.require, record.need, record.breakthrough?.core, ...record.breakthrough?.pointers.map(pointer => pointer.when) ?? [], ...record.events?.map(event => event.when) ?? []];
  for (const map of [...modifierMaps(record), ...effectMaps(record)]) for (const value of Object.values(map ?? {})) if (typeof value === "string") result.push(value);
  return result.filter((value): value is string => typeof value === "string");
}

/** The tables recompute reads; only these may carry standing modifiers and `X.mod.Y` patches. */
function modifierMaps(record: GameRecord): (Changes | undefined)[] {
  return [record.mod, record.perLevel, record.held, ...Object.values(record.at ?? {}), ...Object.values(record.every ?? {})];
}

function effectMaps(record: GameRecord): (Changes | undefined)[] {
  return [record.buy, record.cost, record.run, record.effect, record.result, record.onStart, record.strain, record.encounter?.success,
    ...record.events?.map(event => event.changes) ?? []];
}

/** Grammar and dependency checks use the very same parser as live actions. */
export function validateGrammar(records: GameRecord[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const events = new Set<string>();
  const tags = new Set<string>();
  const byId = new Map<string, GameRecord>();
  for (const record of records) {
    if (ids.has(record.id)) errors.push(`Duplicate record ${record.id}`);
    ids.add(record.id);
    byId.set(record.id, record);
    for (const tag of Array.isArray(record.tags) ? record.tags : []) if (typeof tag === "string") tags.add(tag);
  }

  /** A path read by an expression: any stat field, plus the tag counters. */
  const checkReference = (path: string, record: GameRecord) => {
    if (bankPaths.has(path.replace(/^g\./, ""))) return;
    const [id, field = "value", extra] = path.replace(/^g\./, "").split(".");
    if (!id) { errors.push(`${record.id}: empty reference ${path}`); return; }
    if (!ids.has(id)) {
      if (!tags.has(id)) errors.push(`${record.id}: unknown record path ${path}`);
      else if (extra || field !== "value") errors.push(`${record.id}: a tag counter takes no field (${path})`);
      return;
    }
    if (extra || !statFields.has(field)) errors.push(`${record.id}: unsupported field in ${path}`);
  };

  /** A path written by a change map. `modifier` tables may set derived fields and patch other records. */
  const checkChange = (path: string, record: GameRecord, modifier: boolean) => {
    const parts = path.replace(/^g\./, "").split(".");
    const [id, field = "value"] = parts;
    if (parts.length > 2) {
      if (field !== "mod") { errors.push(`${record.id}: unsupported field in ${path}`); return; }
      if (!modifier) { errors.push(`${record.id}: ${path} patches another record's payout, which only mod, perLevel, at and every may do`); return; }
      if (!ids.has(id!)) { errors.push(`${record.id}: unknown record path ${path}`); return; }
      const inner = parts.slice(2).join(".");
      if (inner.split(".").length > 2) { errors.push(`${record.id}: ${path} patches a patch, which is not supported`); return; }
      const [target, targetField = "value"] = inner.split(".");
      if (!bankPaths.has(inner) && !ids.has(target!)) errors.push(`${record.id}: ${path} patches toward unknown record ${target}`);
      else if (!bankPaths.has(inner) && !derivedFields.has(targetField)) errors.push(`${record.id}: ${path} must patch a derived field, not ${targetField}`);
      return;
    }
    if (bankPaths.has(path.replace(/^g\./, ""))) {
      if ((field === "max" || field === "cap") !== modifier) {
        errors.push(`${record.id}: ${path} ${modifier ? "is spending, not a modifier" : "is a standing modifier; put it in mod, perLevel, at or every"}`);
      }
      return;
    }
    if (!id || !ids.has(id)) { errors.push(`${record.id}: unknown record path ${path}`); return; }
    if (!statFields.has(field)) { errors.push(`${record.id}: unsupported field in ${path}`); return; }
    if (field === "paid") { errors.push(`${record.id}: ${path} is the engine's bookkeeping, not content's`); return; }
    if (derivedFields.has(field) && !modifier) {
      errors.push(`${record.id}: ${path} is a standing modifier; recompute rebuilds it, so put it in mod, perLevel, at or every`);
    }
    if (!derivedFields.has(field) && modifier && field !== "value" && field !== "exp" && field !== "reps" && field !== "ticks" && field !== "started") {
      errors.push(`${record.id}: unsupported field in ${path}`);
    }
    if (countedStores.has(id) && field === "value") errors.push(`${record.id}: ${id} counts itself; raise ${id}.max instead`);
  };

  for (const record of records) {
    if (!/^[a-z][a-z0-9_]*$/.test(record.id)) errors.push(`Invalid record id ${record.id}`);
    if (tags.has(record.id)) errors.push(`${record.id}: a tag of this name already exists, so g.${record.id} would be ambiguous`);
    if (!kinds.has(record.kind)) errors.push(`${record.id}: unknown kind ${record.kind}`);
    for (const field of Object.keys(record)) {
      if (recordFields.has(field)) continue;
      errors.push(REMOVED_FIELDS.includes(field) ? `${record.id}: "${field}" is no longer part of the vocabulary` : `${record.id}: unknown field "${field}"`);
    }
    for (const key of Object.keys(record.initial ?? {})) if (!statFields.has(key)) errors.push(`${record.id}: unknown initial field "${key}"`);
    for (const expression of expressions(record)) {
      try { for (const path of expressionReferences(expression)) checkReference(path, record); }
      catch (error) { errors.push(`${record.id}: invalid expression ${JSON.stringify(expression)}: ${String(error)}`); }
    }
    const bills = new Set([record.buy, record.cost, record.run, record.strain].filter(Boolean));
    for (const [maps, modifier] of [[modifierMaps(record), true], [effectMaps(record), false]] as const) {
      for (const changes of maps) for (const [path, value] of Object.entries(changes ?? {})) {
        checkChange(path, record, modifier);
        if (typeof value === "number" && !Number.isFinite(value)) errors.push(`${record.id}: non-finite change at ${path}`);
        if (!path.endsWith(".exp")) continue;
        if (bills.has(changes)) errors.push(`${record.id}: ${path} would spend knowledge; experience is never a cost`);
        else if (typeof value === "number" && value < 0) errors.push(`${record.id}: ${path} is negative; a knowledge never unlevels`);
      }
    }
    for (const initial of Object.values(record.initial ?? {})) if (typeof initial === "number" && !Number.isFinite(initial)) errors.push(`${record.id}: non-finite initial state`);
    if (record.tags !== undefined && (!Array.isArray(record.tags) || record.tags.some(tag => typeof tag !== "string" || !tag))) {
      errors.push(`${record.id}: tags must be a list of non-empty strings`);
    }
    for (const [field, targets] of [["lock", record.lock], ["enable", record.enable]] as const) {
      if (targets === undefined) continue;
      if (!Array.isArray(targets)) { errors.push(`${record.id}: ${field} must be a list of record ids`); continue; }
      for (const target of targets) {
        if (!ids.has(target)) errors.push(`${record.id}: ${field} names missing record ${target}`);
        else if (target === record.id) errors.push(`${record.id}: ${field} names itself`);
      }
    }
    for (const target of record.fill === undefined ? [] : typeof record.fill === "string" ? [record.fill] : record.fill) {
      if (byId.get(target)?.kind !== "resource") errors.push(`${record.id}: fill names ${target}, which is not a store`);
    }
    if (record.fill !== undefined && record.length === undefined) errors.push(`${record.id}: only a sustained activity can stop when something is full`);
    if (record.attune !== undefined) {
      if (record.kind !== "technique") errors.push(`${record.id}: only a technique takes an attunement slot`);
      if (record.attune && !Object.keys(record.cost ?? {}).length) errors.push(`${record.id}: an attuned technique must have a cost to use`);
      if (record.attune && !ids.has(ATTUNE_SLOTS)) errors.push(`${record.id}: attunement needs an "${ATTUNE_SLOTS}" record to count the slots`);
    }
    if (record.kind === "family" && record.mod) errors.push(`${record.id}: a knowledge pays per level, so use perLevel; "X.mod.Y" patches that table`);
    if (record.kind !== "family" && record.perLevel) errors.push(`${record.id}: only a knowledge has levels to pay for; use mod`);
    if (record.warn !== undefined && (typeof record.warn !== "string" || !record.warn)) errors.push(`${record.id}: warn must be the confirmation text`);
    if (record.train && !ids.has(record.train)) errors.push(`${record.id}: missing referenced record ${record.train}`);
    for (const event of record.events ?? []) {
      if (events.has(event.id)) errors.push(`Duplicate narrative event ${event.id}`);
      events.add(event.id);
      if ("pause" in event) errors.push(`${record.id}: event ${event.id} uses the removed "pause"; discoveries never stop activity`);
    }
    if (record.slot && record.space) errors.push(`${record.id}: an arrangement takes a home place or floor spans, not both`);
    if (record.slot && !records.some(home => home.kind === "home" && home.slots?.includes(record.slot!))) errors.push(`${record.id}: no home offers a ${record.slot} place`);
    if (record.boost && records.find(flag => flag.id === record.boost!.flag)?.kind !== "flag") errors.push(`${record.id}: boost flag ${record.boost.flag} is not a flag record`);
    if (record.boost && typeof record.length !== "number") errors.push(`${record.id}: only timed records can be boosted`);
    if (record.title && record.kind !== "class") errors.push(`${record.id}: only class records carry a title`);
    if (record.encounter && typeof record.length !== "number") errors.push(`${record.id}: only timed records can hold an encounter`);
    if (record.encounter) {
      const foe = record.encounter.foe;
      if (!foe || typeof foe.name !== "string" || !foe.name || ![foe.life, foe.strike, foe.guard].every(n => Number.isInteger(n) && n >= 0) || foe.life < 1) {
        errors.push(`${record.id}: an encounter needs a named foe with whole, non-negative life, strike and guard, and life at least 1`);
      }
      if (foe && !(foe.speed > 0 && foe.speed <= GAUGE && foe.hit >= 0 && foe.hit <= 100 && foe.dodge >= 0 && foe.dodge <= DODGE_MAX)) {
        errors.push(`${record.id}: a foe needs speed above 0 and at most ${GAUGE}, hit within 0-100 and dodge within 0-${DODGE_MAX}`);
      }
      if (!record.encounter.failureText) errors.push(`${record.id}: an encounter needs failure text`);
      if ([LIFE, ...FIGHT_STATS].some(id => byId.get(id)?.kind !== "resource")) errors.push(`a fight needs the resource records ${[LIFE, ...FIGHT_STATS].join(", ")}`);
    }
    if (record.held !== undefined && !(record.kind === "technique" && record.attune)) errors.push(`${record.id}: held modifiers belong only to a technique that is attuned`);
    if (typeof record.length === "number" && (record.length <= 0 || record.length > 7200)) errors.push(`${record.id}: ordinary task duration must be within 1-7200 seconds`);
    if (record.kind === "breakthrough" && !record.breakthrough) errors.push(`${record.id}: breakthrough has no mandatory core metadata`);
    if (record.breakthrough && (record.breakthrough.required < 0 || record.breakthrough.required > record.breakthrough.pointers.length)) errors.push(`${record.id}: invalid supporting pointer count`);
    if (passiveKinds.has(record.kind)) continue;
    // A count/level of one's own record cannot be the key needed for its first start.
    for (const gate of [record.require, record.need]) {
      if (!gate) continue;
      try {
        const own = expressionReferences(gate).some(path => path === `g.${record.id}` || path.startsWith(`g.${record.id}.`));
        if (own && !evaluateCondition(gate, path => {
          const [id, field] = path.replace(/^g\./, "").split(".");
          if (id === record.id) return field === "max" ? 1000001 : 0;
          return field === "max" ? 1000001 : 1000000;
        })) errors.push(`${record.id}: self-key prevents its first use (${gate})`);
      } catch { /* The parser error above contains the useful detail. */ }
    }
  }
  return [...new Set(errors)];
}

/** Adversarial gate states only: these are never counted as reachability evidence. */
export function validateMandatoryCores(records: GameRecord[]): string[] {
  const errors: string[] = [];
  const families = new Set(records.filter(record => record.kind === "family").map(record => record.id));
  for (const record of records.filter(record => record.kind === "breakthrough")) {
    if (!record.breakthrough) { errors.push(`${record.id}: missing mandatory core`); continue; }
    const coreFamilies = [...new Set(expressionReferences(record.breakthrough.core).map(path => path.replace(/^g\./, "").split(".")[0]!).filter(id => families.has(id)))];
    if (coreFamilies.length === 0) { errors.push(`${record.id}: mandatory core names no family`); continue; }
    for (const coreFamily of coreFamilies) {
      const engine = new GameEngine(records);
      for (const candidate of records) Object.assign(engine.stat(candidate.id), { value: 100, max: 100, exp: 0, reps: 100, open: true, started: true });
      Object.assign(engine.stat(record.id), { value: 0, reps: 0, max: 1, started: false });
      engine.stat(coreFamily).value = 0;
      engine.state.lockedIds = [];
      engine.state.visibleIds = records.map(candidate => candidate.id);
      if (engine.availability(record.id).ok) errors.push(`${record.id}: mandatory core is skippable with ${coreFamily} at zero`);
    }
  }
  return errors;
}

/** The shell's words for content: every route key a record carries has a name, and the Now panel marks only real records. */
export function validateContext(records: GameRecord[]): string[] {
  const errors: string[] = [];
  const ids = new Set(records.map(record => record.id)), carried = new Set(records.flatMap(record => record.tags ?? []));
  for (const tag of carried) if (!routeKeys[tag]) errors.push(`route key ${tag} has no name in routeKeys`);
  for (const tag of Object.keys(routeKeys)) if (!carried.has(tag)) errors.push(`routeKeys names ${tag}, which no record carries`);
  for (const beat of openingContext.beats) for (const id of beat.focus) if (!ids.has(id)) errors.push(`beat ${beat.id}: focus names unknown record ${id}`);
  return errors;
}

export function validateContent(records: GameRecord[] = sourceRecords): ValidationReport {
  const errors = validateGrammar(records);
  if (errors.length) return { ok: false, errors, routes: [], coverageBranches: [], ridgeRoutes: [], recordCount: records.length, reachedCount: 0, missing: records.map(record => record.id) };
  errors.push(...validateMandatoryCores(records), ...validateContext(records));
  for (const record of records) {
    if (typeof record.length === "number" && record.length > TIMED_CEILING) {
      errors.push(`${record.id}: timed action runs ${record.length}s, over the ${TIMED_CEILING} s ceiling`);
    }
  }
  // The ceiling binds on every opening route. The preference routes wander and spend Qi on Vigor, so the
  // floor and the Circulation window bind on the direct routes, the quickest sensible play.
  const direct = new Set<string>(Object.keys(DIRECT_ROUTES));
  const routes = [
    ...(Object.keys(ROUTES) as OpeningRoute[]).map(name => runRoute(name, { records })),
    ...(Object.keys(DIRECT_ROUTES) as DirectRoute[]).map(name => runDirectRoute(name, { records })),
  ];
  for (const route of routes) {
    if (!route.success) errors.push(`${route.name}: Foundation unreachable (${route.reason})`);
    else if (route.foundationSeconds! > FOUNDATION_CEILING) errors.push(`${route.name}: Foundation takes ${(route.foundationSeconds! / 60).toFixed(2)} min, over ${FOUNDATION_CEILING / 60} min`);
    else if (direct.has(route.name) && route.foundationSeconds! < FOUNDATION_FLOOR) errors.push(`${route.name}: Foundation takes ${(route.foundationSeconds! / 60).toFixed(2)} min, under the ${FOUNDATION_FLOOR / 60}-minute target`);
    if (route.state.bank.seconds > 0) errors.push(`${route.name}: route accrued bank; pacing requires only ordinary activity`);
    const opened = route.unlocks.find(unlock => unlock.id === "channel_exercise" || unlock.id === "steady_attention");
    if (!opened) errors.push(`${route.name}: Circulation never opens`);
    else if (direct.has(route.name) && opened.at > CIRCULATION_WINDOW) errors.push(`${route.name}: Circulation opens at ${(opened.at / 60).toFixed(2)} min, after the ${(CIRCULATION_WINDOW / 60).toFixed(0)}-minute window`);
    const firstCap = route.capLog[0];
    if (!firstCap || firstCap.activitySeconds > 120) errors.push(`${route.name}: the first cap line arrives at ${((firstCap?.activitySeconds ?? route.activitySeconds) / 60).toFixed(2)} min, after 2 minutes`);
    else if (!firstCap.text.includes("A higher cap is possible through")) errors.push(`${route.name}: the first cap line names nothing that raises it (${firstCap.text})`);
    for (const line of route.unsourcedCapLog) errors.push(`${route.name}: cap line naming nothing that raises it: ${line.text}`);
  }
  const coverageBranches = runCoverageBranches(records);
  const ridgeStart = routes.find(route => route.name === "channel-only")?.state;
  const directStart = routes.find(route => route.name === "channel-direct")?.state;
  const ridgeRoutes = [
    ...!ridgeStart ? [] : [...(Object.keys(RIDGE_ROUTES) as RidgeRoute[]).map(name => runRidgeRoute(name, records, ridgeStart)), ...runRidgeCoverage(records, ridgeStart)],
    ...!directStart ? [] : (Object.keys(RIDGE_ROUTES) as RidgeRoute[]).map(name => runDirectRidgeRoute(name, records, directStart)),
  ];
  for (const route of ridgeRoutes) {
    if (!route.success) { errors.push(`${route.name}: the ridge waystation is unreachable (${route.reason})`); continue; }
    const elapsed = route.goalSeconds! - route.startSeconds;
    if (elapsed < RIDGE_FLOOR || elapsed > RIDGE_CEILING) errors.push(`${route.name}: the waystation takes ${(elapsed / 60).toFixed(2)} min after Foundation, outside ${RIDGE_FLOOR / 60}-${RIDGE_CEILING / 60} min`);
  }
  // The simulation is the single measured figure, so it must name records content still has.
  for (const route of [...routes, ...coverageBranches, ...ridgeRoutes]) {
    if (route.unknownIds.length) errors.push(`${route.name}: the route names records content no longer has: ${route.unknownIds.join(", ")}`);
  }
  const reached = new Set([...routes, ...coverageBranches, ...ridgeRoutes].flatMap(route => route.reached));
  const missing = records.filter(record => !reached.has(record.id)).map(record => record.id);
  if (missing.length) errors.push(`No cold-start reachability witness for: ${missing.join(", ")}`);
  // Replayable witnesses must actually satisfy each lead's need; mere early visibility is insufficient.
  for (const route of coverageBranches) if (!route.success) errors.push(`${route.name}: coverage branch failed (${route.reason})`);
  return { ok: errors.length === 0, errors, routes, coverageBranches, ridgeRoutes, recordCount: records.length, reachedCount: reached.size, missing };
}

if (import.meta.main) {
  const report = validateContent();
  if (process.argv.includes("--json")) console.log(JSON.stringify({ ...report, routes: report.routes.map(compactRoute), coverageBranches: report.coverageBranches.map(compactRoute), ridgeRoutes: report.ridgeRoutes.map(compactRoute) }, null, 2));
  else {
    for (const route of [...report.routes, ...report.coverageBranches]) console.log(`${route.name}: ${route.success ? "Foundation" : "BLOCKED"} at ${((route.foundationSeconds ?? route.activitySeconds) / 60).toFixed(2)} min; ${route.reached.length} records witnessed; ${route.unsourcedCapLog.length} cap lines without a source`);
    for (const route of report.ridgeRoutes) console.log(`${route.name}: ${route.success ? "waystation" : "BLOCKED"} ${(((route.goalSeconds ?? route.activitySeconds) - route.startSeconds) / 60).toFixed(2)} min after Foundation; ${route.reached.length} records witnessed; ${route.unsourcedCapLog.length} cap lines without a source`);
    // The measured figure the whole simulation exists to produce.
    const timing = (name: string) => {
      const route = report.routes.find(candidate => candidate.name === name);
      return `${name} ${route?.foundationSeconds == null ? "BLOCKED" : `${(route.foundationSeconds / 60).toFixed(2)} min`}`;
    };
    console.log(`Foundation timing: ${timing("channel-only")}, ${timing("hollow-only")} (target ${FOUNDATION_FLOOR / 60}-${FOUNDATION_CEILING / 60} min).`);
    console.log(`Reachability: ${report.reachedCount}/${report.recordCount} records across distinct cold-start branches.`);
    for (const error of report.errors) console.error(`FAIL ${error}`);
    console.log(report.ok ? "OK: actual JSON and engine validation passed" : "FAILED");
  }
  if (!report.ok) process.exitCode = 1;
}
