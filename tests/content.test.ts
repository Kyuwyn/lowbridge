import { describe, expect, test } from "bun:test";
import { records } from "../src/content";
import { GameEngine } from "../src/engine";
import { FOUNDATION_CEILING, FOUNDATION_FLOOR, REMOVED_FIELDS, RIDGE_CEILING, RIDGE_FLOOR, TIMED_CEILING, validateContent, validateGrammar, validateMandatoryCores } from "../scripts/validate";
import { RIDGE_ROUTES, runRidgeCoverage, runRidgeRoute, runRoute, type RidgeRoute } from "../scripts/routes";
import type { GameRecord } from "../src/types";
import { encounter, villageRecords } from "./fixtures/worlds";

/** Full validation plays every opening, coverage and ridge route through the real engine. */
const VALIDATION_MS = 60_000;

function changed(id: string, change: (record: GameRecord) => void): GameRecord[] {
  const copy = structuredClone(records);
  change(copy.find(record => record.id === id)!);
  return copy;
}

/** Grammar rules are pinned against the sample village, so they stay true while real content moves. */
function spoiled(id: string, change: (record: GameRecord) => void, world: GameRecord[] = villageRecords): string[] {
  const copy = structuredClone(world);
  change(copy.find(record => record.id === id)!);
  return validateGrammar(copy);
}

const complains = (errors: string[], fragment: string) => errors.some(error => error.includes(fragment));

describe("the record vocabulary", () => {
  test("a field the engine does not read is an error, not a silent no-op", () => {
    for (const field of REMOVED_FIELDS) {
      const errors = spoiled("pouch", record => { (record as unknown as Record<string, unknown>)[field] = 3; });
      expect([field, complains(errors, `"${field}" is no longer part of the vocabulary`)]).toEqual([field, true]);
    }
    expect(complains(spoiled("pouch", record => { (record as unknown as Record<string, unknown>).discount = 0.1; }), 'unknown field "discount"')).toBe(true);
    expect(complains(spoiled("lore", record => { record.initial = { ...record.initial, level: 2 } as never; }), 'unknown initial field "level"')).toBe(true);
  });

  test("every modifier path must resolve, including a patch into another record's payout", () => {
    expect(complains(spoiled("pouch", record => { record.mod = { "purse.max": 1 }; }), "unknown record path purse.max")).toBe(true);
    expect(complains(spoiled("margin_notes", record => { record.mod = { "lore.mod.purse.max": 1 }; }), "patches toward unknown record purse")).toBe(true);
    expect(complains(spoiled("margin_notes", record => { record.mod = { "lore.mod.coin.value": 1 }; }), "must patch a derived field")).toBe(true);
    expect(complains(spoiled("chore", record => { record.result = { "lore.mod.coin.max": 1 }; }), "only mod, perLevel, at and every may do")).toBe(true);
    expect(complains(spoiled("chore", record => { record.result = { "coin.max": 1 }; }), "recompute rebuilds it")).toBe(true);
    expect(complains(spoiled("lore", record => { record.mod = { "coin.max": 1 }; }), "a knowledge pays per level")).toBe(true);
  });

  test("knowledge experience is never spent and never lost", () => {
    expect(complains(spoiled("chore", record => { record.cost = { ...record.cost, "lore.exp": 5 }; }), "experience is never a cost")).toBe(true);
    expect(complains(spoiled("chore", record => { record.result = { "lore.exp": -5 }; }), "never unlevels")).toBe(true);
  });

  test("lock and enable must name records that exist", () => {
    expect(complains(spoiled("move_on", record => { record.lock = ["the_old_road"]; }), "lock names missing record the_old_road")).toBe(true);
    expect(complains(spoiled("turn_back", record => { record.enable = ["turn_back"]; }), "enable names itself")).toBe(true);
  });

  test("tags are strings, counted by their own name, and may not collide with a record id", () => {
    expect(complains(spoiled("ember_form", record => { record.tags = [2 as never]; }), "tags must be a list of non-empty strings")).toBe(true);
    // A tag is read verbatim, so a name nothing carries is indistinguishable from a mistyped id, and both are errors.
    expect(complains(spoiled("fire_adept", record => { record.require = "g.t_waterform >= 1"; }), "unknown record path g.t_waterform")).toBe(true);
    expect(complains(spoiled("ember_form", record => { record.tags = ["pouch"]; }), "g.pouch would be ambiguous")).toBe(true);
    expect(complains(spoiled("fire_adept", record => { record.require = "g.t_fireform.max >= 1"; }), "a tag counter takes no field")).toBe(true);
  });

  test("fill names stores on a sustained activity", () => {
    expect(complains(spoiled("breath", record => { record.fill = ["lore"]; }), "fill names lore, which is not a store")).toBe(true);
    expect(complains(spoiled("chore", record => { record.fill = ["coin"]; }), "only a sustained activity can stop when something is full")).toBe(true);
  });

  test("an attuned technique must be a technique that costs something to use", () => {
    expect(complains(spoiled("ember_form", record => { delete record.cost; }), "must have a cost to use")).toBe(true);
    expect(complains(spoiled("pouch", record => { record.attune = true; }), "only a technique takes an attunement slot")).toBe(true);
  });

  test("a fight names a whole foe with speed, hit and dodge, needs the fight stats, and only an attuned technique holds modifiers", () => {
    expect(validateGrammar(encounter())).toEqual([]);
    expect(complains(spoiled("bandit", record => { delete (record.encounter as Partial<NonNullable<GameRecord["encounter"]>>).foe; }, encounter()), "an encounter needs a named foe")).toBe(true);
    expect(complains(spoiled("bandit", record => { record.encounter!.foe.speed = 0; }, encounter()), "a foe needs speed above 0")).toBe(true);
    expect(complains(spoiled("bandit", record => { record.encounter!.foe.dodge = 75; }, encounter()), "dodge within 0-60")).toBe(true);
    expect(complains(validateGrammar(encounter().filter(record => record.id !== "dodge")), "a fight needs the resource records")).toBe(true);
    expect(complains(spoiled("bandit", record => { record.held = { "strike.max": 1 }; }, encounter()), "held modifiers belong only to a technique that is attuned")).toBe(true);
  });

  test("the sample village and the live content are both written in that vocabulary", () => {
    expect(validateGrammar(villageRecords)).toEqual([]);
    expect(validateGrammar(records)).toEqual([]);
  });
});

describe("Part E validation over real opening content", () => {
  test("every opening route reaches Foundation inside the pacing window, and branches witness every record", () => {
    const report = validateContent();
    expect(report.errors).toEqual([]);
    expect(report.ok).toBe(true);
    expect(report.missing).toEqual([]);
    expect(report.reachedCount).toBe(report.recordCount);
    // Furniture competes for the same floor: the witnesses genuinely use separate histories.
    const furnished = report.coverageBranches.find(route => route.name === "furnished-hollow")!;
    const stones = report.coverageBranches.find(route => route.name === "stones-and-storage")!;
    expect(furnished.completed).toContain("practice_mat");
    expect(furnished.completed).not.toContain("channel_arrangement");
    expect(stones.completed).toContain("channel_arrangement");
    expect(stones.completed).not.toContain("practice_mat");
    expect(furnished.state.lockedIds).toContain("hayloft");
    expect(stones.state.lockedIds).toContain("mill_work");
    for (const name of ["channel-direct", "hollow-direct"]) {
      const route = report.routes.find(candidate => candidate.name === name)!;
      expect(route.foundationSeconds!).toBeGreaterThanOrEqual(FOUNDATION_FLOOR);
      expect(route.foundationSeconds!).toBeLessThanOrEqual(FOUNDATION_CEILING);
    }
    for (const route of report.ridgeRoutes.filter(candidate => candidate.name.endsWith("-direct"))) {
      expect(route.goalSeconds! - route.startSeconds).toBeGreaterThanOrEqual(RIDGE_FLOOR);
      expect(route.goalSeconds! - route.startSeconds).toBeLessThanOrEqual(RIDGE_CEILING);
    }
  }, VALIDATION_MS);

  test("an optional purchase gated behind itself fails the no-self-key rule", () => {
    const errors = validateGrammar(changed("strongbox", record => { record.require = "g.strongbox > 0"; }));
    expect(errors.some(error => error.includes("strongbox") && error.includes("self-key"))).toBe(true);
  });

  test("a valid-looking dependency cycle is rejected by actual cold-start play", () => {
    const report = validateContent(changed("jade_slip", record => { record.need = "g.coin >= 6 && g.field_kit > 0"; }));
    expect(report.ok).toBe(false);
    expect(report.errors.some(error => error.includes("Foundation unreachable"))).toBe(true);
    expect(report.missing).toContain("jade_slip");
  }, VALIDATION_MS);

  test("an unreachable optional home record cannot hide behind successful Foundation routes", () => {
    const report = validateContent(changed("strongbox", record => { record.need = "g.coin >= 1000"; }));
    expect(report.routes.every(route => route.success)).toBe(true);
    expect(report.ok).toBe(false);
    expect(report.missing).toContain("strongbox");
  }, VALIDATION_MS);

  test("weakening the mandatory core is caught with every supporting pointer satisfied", () => {
    const errors = validateMandatoryCores(changed("settling", record => { record.breakthrough!.core = "g.circulation >= 0"; }));
    expect(errors).toContain("settling: mandatory core is skippable with circulation at zero");
  });

  test("a missing core and an unknown reference are not silently treated as false", () => {
    const coreErrors = validateMandatoryCores(changed("settling", record => { record.breakthrough!.core = "true"; }));
    expect(coreErrors.some(error => error.includes("names no family"))).toBe(true);
    const referenceErrors = validateGrammar(changed("field_kit", record => { record.require = "g.lroe >= 1"; }));
    expect(referenceErrors.some(error => error.includes("unknown record path g.lroe"))).toBe(true);
  });

  test("each First Direction reaches the ridge waystation with its class, closing the other three", () => {
    const start = runRoute("channel-only").state;
    expect(start.stats.strain).toMatchObject({ open: true, value: 10 });
    const titles: Record<RidgeRoute, string> = { "direction-body": "Body Disciple", "direction-sword": "Sword Disciple", "direction-earth": "Earth Listener", "direction-formation": "Formation Student" };
    for (const name of Object.keys(RIDGE_ROUTES) as RidgeRoute[]) {
      const route = runRidgeRoute(name, records, start);
      expect(route.success).toBe(true);
      const engine = new GameEngine(records, route.state);
      expect(engine.title()).toBe(titles[name]);
      const others = Object.values(RIDGE_ROUTES).map(line => line.direction).filter(id => id !== RIDGE_ROUTES[name].direction);
      for (const id of others) expect(engine.state.lockedIds).toContain(id);
      expect(engine.state.bank.cap).toBe(86400);
      for (const lead of ["route_records", "unusual_chime", "damaged_spur"]) expect(engine.visible(lead)).toBe(true);
      expect(engine.stat("waystation_work").reps).toBeGreaterThan(0);
      expect(engine.availability("ferry_hauling").reason).toBe("This chapter has closed.");
    }
  });

  test("a ridge material can be dug by hand once its site has been worked, beside whatever is running", () => {
    const start = runRoute("channel-only").state;
    expect(new GameEngine(records, start).visible("dig_marrow_herbs")).toBe(false);
    const game = new GameEngine(records, runRidgeRoute("direction-body", records, start).state);
    for (const id of ["vigor", "strain"]) game.stat(id).value = game.stat(id).max;
    game.stat("marrow_herbs").value = 0;
    expect(game.start("survey_marker").ok).toBe(true);
    expect(game.start("dig_marrow_herbs").ok).toBe(true);
    expect(game.stat("marrow_herbs").value).toBe(1);
    expect(game.stat("vigor").value).toBeLessThan(game.stat("vigor").max);
    expect(game.state.active?.id).toBe("survey_marker");
  });

  test("the bandit can be lost and later won on one life, and losing never blocks the ridge", () => {
    const bandit = records.find(record => record.id === "ridge_bandit")!;
    const [branch] = runRidgeCoverage(records);
    expect(branch!.success).toBe(true);
    expect(branch!.log.some(entry => entry.kind === "story" && entry.text.startsWith(`${bandit.name}: the man on the path falls`))).toBe(true);
    // The same fight, met before the ridge has paid for itself, is lost and costs the preparation.
    const weak = new GameEngine(records, structuredClone(branch!.state));
    Object.assign(weak.stat("ridge_bandit"), { value: 0, reps: 0, paid: false, exp: 0 });
    weak.stat("circulation").value = 0;
    weak.stat("blade_intent").value = 0;
    for (const id of ["sword_disciple", "body_disciple"]) weak.stat(id).value = 0;
    weak.recompute();
    expect(weak.fight("ridge_bandit")).toMatchObject({ you: { strike: 3, guard: 0 }, yourDamage: 0, winSeconds: Infinity, likely: false });
    // The branch spent its herbs on the direction; lay in the road's bill first.
    for (const [id, amount] of Object.entries(bandit.cost ?? {})) weak.stat(id).value = Number(amount);
    expect(weak.start("ridge_bandit").ok).toBe(true);
    weak.random = () => 0;
    const herbs = weak.stat("herbs").value;
    while (weak.state.active?.id === "ridge_bandit") weak.advance(1);
    expect(weak.state.lastStop).toContain("your Life runs out");
    expect(weak.state.fight).toMatchObject({ result: "life", landed: weak.state.fight!.swings, foeLife: 10 });
    expect(weak.state.lastStop).toContain(bandit.encounter!.failureText);
    expect(weak.stat("life").value).toBe(0);
    expect(weak.stat("ridge_bandit")).toMatchObject({ value: 0, reps: 0, paid: false });
    expect(weak.stat("herbs").value).toBe(herbs);
    // Losing spends the preparation but closes nothing: restock, and the same fight is there to be met again.
    expect(weak.locked("ridge_bandit")).toBe(false);
    for (const [id, amount] of Object.entries(bandit.cost ?? {})) weak.stat(id).value = Number(amount);
    for (const [id, amount] of Object.entries(weak.reserveNeeded(bandit))) weak.stat(id).value = amount;
    weak.stat("life").value = weak.stat("life").max;
    expect(weak.availability("ridge_bandit").ok).toBe(true);
    // The early fight starts only with enough Strain to finish, so it is never left paused halfway.
    expect(branch!.log.some(entry => entry.kind === "pause" && entry.text.includes(bandit.name!) && entry.text.includes("waiting"))).toBe(false);
    expect(branch!.completed).toEqual(expect.arrayContaining(["ridge_cache", "coffer", "cottage", "reading_desk"]));
    expect(new GameEngine(records, branch!.state).homeSlots()).toEqual(["rest", "practice", "study"]);
  });

  test("the sparring bout is lost with the bare method and won with a second one held", () => {
    const game = new GameEngine(records, runRoute("channel-only").state);
    for (const id of ["settling", "circulation", "labour"]) game.stat(id).value = 0;
    game.recompute();
    game.unattune("carry_current");
    expect(game.fight("sparring_bout")).toMatchObject({ you: { strike: 2, guard: 0, speed: 1, hit: 80, dodge: 5 }, life: 6, yourDamage: 1, foeDamage: 2, likely: false });
    expect(game.fight("sparring_bout").winSeconds).toBeCloseTo(31.25, 6);
    expect(game.attune("carry_current").ok).toBe(true);
    expect(game.fight("sparring_bout")).toMatchObject({ you: { strike: 3 }, yourDamage: 2, likely: true });
    expect(game.fight("sparring_bout").winSeconds).toBeCloseTo(15.625, 6);
    // Every swing lands: both swing at five seconds, you first, and your second blow fells Tam at ten.
    game.random = () => 0;
    expect(game.start("sparring_bout").ok).toBe(true);
    game.advance(10);
    expect(game.state.active?.id).not.toBe("sparring_bout");
    expect(game.state.fight).toMatchObject({ id: "sparring_bout", result: "won", seconds: 10, swings: 2, foeSwings: 1 });
    expect(game.stat("sparring_bout").reps).toBe(1);
    expect(game.stat("life").max).toBe(7);
    expect(game.stat("life").value).toBeCloseTo(4.1, 9);
    expect(game.stat("labour").exp).toBeGreaterThanOrEqual(6);

    game.stat("life").value = 1;
    game.unattune("carry_current");
    expect(game.start("sparring_bout").ok).toBe(true);
    game.advance(5);
    expect(game.stat("sparring_bout").reps).toBe(1);
    expect(game.stat("life").value).toBe(0);
    expect(game.state.lastStop).toContain("come back when the breath runs deeper");
    expect(game.availability("sparring_bout").reason).toMatch(/^Life: you are in no state to fight; ready in ~\d+ (s|min)\.$/);
  });

  test("pacing is measured in the engine, so a slow legal site fails the route budget", () => {
    const slower = changed("clear_channel", record => { record.length = 3000; });
    expect(validateGrammar(slower)).toEqual([]);
    const route = runRoute("channel-only", { records: slower });
    expect(route.success).toBe(true);
    expect(route.foundationSeconds!).toBeGreaterThan(FOUNDATION_CEILING);
    const report = validateContent(slower);
    expect(report.errors.some(error => error.includes(`over ${FOUNDATION_CEILING / 60} min`))).toBe(true);
    expect(report.errors.some(error => error.startsWith("channel-direct: Circulation opens"))).toBe(true);
  }, VALIDATION_MS);

  test("no timed record holds the slot past the ceiling, on the ridge as in the opening", () => {
    const report = validateContent(changed("cross_body", record => { record.length = 1800; }));
    expect(report.errors).toContain(`cross_body: timed action runs 1800s, over the ${TIMED_CEILING} s ceiling`);
  }, VALIDATION_MS);
});
