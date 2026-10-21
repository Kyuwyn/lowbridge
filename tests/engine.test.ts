import { describe, expect, test } from "bun:test";
import { ATTUNE_SLOTS, EXP_PER_LEVEL, GameEngine, HOME_SPACE } from "../src/engine";
import { evaluateExpression, expressionReferences, parseExpression } from "../src/expression";
import { decodeSave, makeSave } from "../src/persistence";
import { validateGrammar } from "../scripts/validate";
import { DERIVED_FIELDS, TOOLTIP_BLOCKS, type GameRecord, type Objective, type Stat } from "../src/types";
import { encounter, hauling, reservoir, villageRecords } from "./fixtures/worlds";

function run(game: GameEngine, id: string, seconds: number, objective?: Objective) {
  expect(game.start(id, objective).ok).toBe(true);
  return game.advance(seconds);
}

const village = (): GameEngine => new GameEngine(villageRecords);

/** The derived half of a stat, which recompute owns outright. */
const derived = (game: GameEngine) =>
  Object.fromEntries(Object.entries(game.state.stats).map(([id, stat]) =>
    [id, Object.fromEntries(DERIVED_FIELDS.map(field => [field, stat[field]]))]));

/** Reads a knowledge to a chosen level; one second of reading is one point of practice. */
function read(game: GameEngine, level: number) {
  let needed = 0;
  for (let next = game.stat("lore").value + 1; next <= level; next++) needed += EXP_PER_LEVEL * next;
  run(game, "reading", needed, { kind: "level", id: "lore", target: level });
  expect(game.stat("lore").value).toBe(level);
}

describe("restricted shared expression evaluator", () => {
  test("honors arithmetic/boolean precedence and short circuits unavailable references", () => {
    const values: Record<string, number> = { "g.qi": 3, "g.qi.max": 4, "g.lore": 2 };
    const resolve = (path: string) => { if (!(path in values)) throw new Error(path); return values[path]!; };
    expect(evaluateExpression("g.qi < g.qi.max && (g.lore + 2 * 3) == 8", resolve)).toBe(true);
    expect(evaluateExpression("true || g.missing", resolve)).toBe(true);
    expect(expressionReferences("g.qi < g.qi.max && g.qi > 0")).toEqual(["g.qi", "g.qi.max"]);
  });

  test("rejects function calls, assignments, property attacks, nonfinite values and trailing code", () => {
    for (const source of ["g.qi = 9", "alert(1)", "g.__proto__", "g.qi; true", "1e999", "(1 + 2"]) {
      expect(() => parseExpression(source)).toThrow();
    }
    expect(() => evaluateExpression("1 / 0", () => 0)).toThrow();
  });
});

describe("recompute rebuilds every derived field", () => {
  test("the sample village is written in the vocabulary the validator enforces", () => {
    expect(validateGrammar(villageRecords)).toEqual([]);
  });

  test("a second pass changes nothing, and a reloaded life derives exactly what the live one holds", () => {
    const game = village();
    read(game, 2);
    game.stat("coin").value = 10;
    expect(game.start("margin_notes").ok).toBe(true);
    expect(game.start("pouch").ok).toBe(true);
    run(game, "gather", 10);
    const live = derived(game);
    game.recompute();
    expect(derived(game)).toEqual(live);
    const reloaded = decodeSave(makeSave(game.state, villageRecords, 1000), villageRecords);
    expect(derived(new GameEngine(villageRecords, reloaded.state))).toEqual(live);
    expect(reloaded.state).toEqual(game.state);
  });

  test("an X.mod.Y patch raises a knowledge's per-level payout for levels already earned", () => {
    const game = village();
    read(game, 2);
    // Two levels of Lore at the authored 2 coin each, on top of the base purse.
    expect(game.stat("coin").max).toBe(14);
    game.stat("coin").value = 10;
    expect(game.start("margin_notes").ok).toBe(true);
    // The patch lifts the payout itself to 5, and both levels are paid again at the new rate.
    expect(game.stat("coin").max).toBe(20);
    read(game, 3);
    expect(game.stat("coin").max).toBe(25);
  });

  test("a modifier carried by a resource scales with how much of it is held", () => {
    const game = village();
    expect(game.stat("reading").rate).toBe(1);
    expect(game.stat("coin").max).toBe(10);
    game.stat("notes").value = 3;
    game.recompute();
    expect(game.stat("reading").rate).toBeCloseTo(1.3);
    expect(game.stat("coin").max).toBe(13);
    game.stat("notes").value = 0;
    game.recompute();
    expect(game.stat("reading").rate).toBe(1);
    expect(game.stat("coin").max).toBe(10);
  });

  test("taking an arrangement down withdraws its modifier and clamps what it was holding", () => {
    const game = village();
    game.stat("coin").value = 10;
    expect(game.start("herb_rack").ok).toBe(true);
    expect(game.stat("herbs").max).toBe(12);
    expect(game.stat(HOME_SPACE).value).toBe(1);
    game.stat("herbs").value = 11;
    expect(game.remove("herb_rack").ok).toBe(true);
    expect(game.stat("herbs")).toMatchObject({ max: 6, value: 6 });
    expect(game.stat(HOME_SPACE).value).toBe(0);
    expect(game.stat("coin").value).toBe(7);
  });

  test("a threshold already passed keeps paying, and the completion that crosses it is unchanged", () => {
    const game = village();
    for (let count = 0; count < 3; count++) expect(game.start("chore").ok).toBe(true);
    expect(game.stat("coin").value).toBe(9);
    expect(game.stat("chore").yield).toBe(1);
    run(game, "rest", 10);
    expect(game.start("chore").ok).toBe(true);
    expect(game.stat("coin").value).toBe(10);
  });

  test("a knowledge milestone applies once, on reaching its level", () => {
    const game = village();
    read(game, 1);
    expect(game.stat("herbs").discount).toBe(0);
    read(game, 2);
    expect(game.stat("herbs").discount).toBeCloseTo(0.1);
  });
});

describe("tag counters", () => {
  test("g.t_<tag> counts the owned records carrying the tag, and a lock takes one back", () => {
    const game = village();
    game.stat("qi").value = 4;
    game.stat("coin").value = 10;
    expect(game.start("focus_charm").ok).toBe(true);
    expect(game.attune("ember_form").ok).toBe(true);
    expect(game.attune("ash_form").ok).toBe(true);
    expect(game.tagCount("t_fireform")).toBe(0);
    run(game, "ember_form", 10);
    expect(game.tagCount("t_fireform")).toBe(1);
    expect(game.visible("fire_adept")).toBe(false);
    run(game, "ash_form", 10);
    expect(game.tagCount("t_fireform")).toBe(2);
    expect(game.visible("fire_adept")).toBe(true);
    expect(game.condition("g.t_fireform >= 2")).toBe(true);
    // A tag nothing carries is a typo, not an empty count; the validator says so before the game runs.
    expect(() => game.condition("g.t_nothing >= 1")).toThrow();
  });
});

describe("attunement slots", () => {
  test("a technique cannot run unattuned, the limit is the slot count, and releasing frees it", () => {
    const game = village();
    expect(game.availability("ember_form").reason).toBe("Ember form must be attuned before it can be used.");
    expect(game.attune("ember_form")).toEqual({ ok: true, reason: "Attuned." });
    expect(game.stat(ATTUNE_SLOTS)).toMatchObject({ value: 1, max: 1 });
    expect(game.attune("ash_form")).toEqual({ ok: false, reason: "All 1 attunement slots are taken; release one first." });
    game.stat("coin").value = 10;
    expect(game.start("focus_charm").ok).toBe(true);
    expect(game.stat(ATTUNE_SLOTS).max).toBe(2);
    expect(game.attune("ash_form").ok).toBe(true);
    expect(game.stat(ATTUNE_SLOTS).value).toBe(2);
    expect(game.unattune("ember_form").ok).toBe(true);
    expect(game.state.attuned).toEqual(["ash_form"]);
    expect(game.stat(ATTUNE_SLOTS).value).toBe(1);
    expect(game.availability("ember_form").ok).toBe(false);
    expect(game.attune("pouch")).toEqual({ ok: false, reason: "This needs no attunement." });
  });

  test("releasing the running technique stops it", () => {
    const game = village();
    game.stat("qi").value = 4;
    expect(game.attune("ember_form").ok).toBe(true);
    run(game, "ember_form", 4);
    expect(game.unattune("ember_form").ok).toBe(true);
    expect(game.state.active).toBeNull();
    expect(game.state.lastStop).toBe("Ember form is no longer attuned.");
  });
});

describe("fill", () => {
  test("a run stops when everything it fills is at cap, and the waiting pursuit takes the slot", () => {
    const game = village();
    expect(game.start("breath", { kind: "level", id: "lore", target: 4 }).ok).toBe(true);
    expect(game.queue("gather").ok).toBe(true);
    expect(game.state.active?.id).toBe("breath");
    game.advance(8);
    expect(game.stat("qi").value).toBe(4);
    expect(game.state.active?.id).toBe("gather");
    expect(game.state.waiting).toEqual([]);
    expect(game.state.log.some(entry => entry.text === "Gather the breath: Qi is full.")).toBe(true);
    expect(game.availability("breath").reason).toBe("Qi is already full.");
  });

  test("the idle filler stops at full and does not start again while it would fill nothing", () => {
    const game = village();
    for (let count = 0; count < 3; count++) expect(game.start("chore").ok).toBe(true);
    expect(game.stat("vigor").value).toBe(4);
    expect(game.state.active?.id).toBe("rest");
    game.advance(10);
    expect(game.stat("vigor").value).toBe(10);
    expect(game.state.active).toBeNull();
    expect(game.availability("rest").reason).toBe("Vigor is already full.");
  });
});

describe("lock and enable", () => {
  test("locking hides a record and stops it mid-run; enabling gives it back", () => {
    const game = village();
    expect(game.warnText("move_on")).toBe("The herb beds are half a day behind you after this. This closes Gather herbs and Hayloft for good.");
    expect(game.warnText("pouch")).toBeUndefined();
    run(game, "gather", 4);
    expect(game.state.active?.id).toBe("gather");
    expect(game.homeSlots()).toEqual(["rest"]);
    game.stat("vigor").value = 10;
    expect(game.start("move_on").ok).toBe(true);
    expect(game.state.active).toBeNull();
    expect(game.visible("gather")).toBe(false);
    expect(game.locked("gather")).toBe(true);
    expect(game.availability("gather")).toEqual({ ok: false, reason: "This chapter has closed." });
    expect(game.homeSlots()).toEqual([]);
    expect(game.start("turn_back").ok).toBe(true);
    expect(game.visible("gather")).toBe(true);
    expect(game.availability("gather").ok).toBe(true);
    expect(game.homeSlots()).toEqual(["rest"]);
  });

  test("a warning stops asking once its doors have shut, and asks again if they reopen", () => {
    const game = village();
    const asked = "The herb beds are half a day behind you after this. This closes Gather herbs and Hayloft for good.";
    expect(game.warnText("move_on")).toBe(asked);
    game.stat("vigor").value = 10;
    expect(game.start("move_on").ok).toBe(true);
    expect(game.warnText("move_on")).toBeUndefined();
    expect(game.start("turn_back").ok).toBe(true);
    expect(game.warnText("move_on")).toBe(asked);
  });

  test("attuning is the step that closes the sibling, so that is the step the warning covers", () => {
    const game = village();
    expect(game.warnText("kindling_form"))
      .toBe("Taking up the kindling reading settles the shape for good. This closes Ash form for good.");
    expect(game.attune("kindling_form").ok).toBe(true);
    expect(game.locked("ash_form")).toBe(true);
    expect(game.warnText("kindling_form")).toBeUndefined();
    // Releasing is reversible and the door has already shut, so the spent warning stays silent.
    expect(game.unattune("kindling_form").ok).toBe(true);
    expect(game.warnText("kindling_form")).toBeUndefined();
  });

  test("a locked record leaves the waiting list rather than resuming", () => {
    const game = village();
    expect(game.start("breath", { kind: "level", id: "lore", target: 4 }).ok).toBe(true);
    expect(game.queue("gather").ok).toBe(true);
    expect(game.start("move_on").ok).toBe(true);
    expect(game.state.waiting).toEqual([]);
    expect(game.state.active?.id).toBe("breath");
  });
});

describe("tooltips and warnings", () => {
  test("every record kind renders its blocks in the one schema order", () => {
    const game = village();
    game.state.visibleIds = villageRecords.map(record => record.id);
    for (const record of villageRecords) {
      const blocks = game.tooltip(record.id);
      expect(blocks.length).toBeGreaterThan(0);
      const order = blocks.map(block => TOOLTIP_BLOCKS.indexOf(block.kind));
      expect(order).toEqual([...order].sort((a, b) => a - b));
      expect(order.every(index => index >= 0)).toBe(true);
      expect(blocks[0]!.kind).toBe("title");
      expect(blocks[0]!.lines[0]).toBe(record.name!);
    }
  });

  test("a tooltip names the record's cost, payout, modifiers and flavour", () => {
    const game = village();
    const blocks = Object.fromEntries(game.tooltip("chore").map(block => [block.kind, block.lines]));
    expect(blocks.cost).toEqual(["Vigor: 2"]);
    expect(blocks.result).toEqual(["Coin: 3"]);
    expect(blocks.mod).toEqual(["Haul sacks yield: 1 at 3"]);
    expect(blocks.flavor).toEqual(["Wen counts every sack you carry."]);
    expect(game.tooltip("margin_notes").find(block => block.kind === "mod")?.lines).toEqual(["Lore ➢ Max Coin: 3"]);
    expect(game.tooltip("breath").find(block => block.kind === "lock")?.lines).toEqual(["Stops when Qi is full"]);
  });
});

describe("activity and wall-clock accounting", () => {
  test("a discovery is reported without stopping the objective; idle time banks", () => {
    const game = new GameEngine(hauling({ events: [{ id: "noticed", when: "g.haul.reps >= 2", text: "Something new." }] }));
    const result = run(game, "haul", 100, { kind: "repetitions", id: "haul", target: 10 });
    expect(result).toMatchObject({ activitySeconds: 100, bankedSeconds: 0, reason: "Something new." });
    expect(game.stat("haul").reps).toBe(3);
    expect(game.state.active?.id).toBe("haul");
    expect(game.state.lastStop).toBeUndefined();
    game.stop();
    game.advance(100);
    expect(game.state.bank.seconds).toBe(100);
  });

  test("subsecond wall time survives calls and does not create duplicate bank credit", () => {
    const game = new GameEngine(hauling());
    expect(game.start("haul").ok).toBe(true);
    game.advance(0.4);
    expect(game.state.activitySeconds).toBe(0);
    expect(game.state.wallRemainder).toBeCloseTo(0.4);
    game.advance(0.6);
    expect(game.state.activitySeconds).toBe(1);
    expect(game.state.bank.seconds).toBe(0);
    game.advance(29.25);
    expect(game.stat("haul").reps).toBe(1);
    expect(game.state.activitySeconds).toBe(30);
    expect(game.state.bank.seconds).toBeCloseTo(0.25);
    expect(game.state.wallRemainder).toBe(0);
  });

  test("the idle bank saturates; acceleration doubles progress and never carries to the next objective", () => {
    const game = new GameEngine(hauling());
    game.advance(5000);
    expect(game.state.bank.seconds).toBe(3600);
    expect(game.setAccelerating(true).ok).toBe(false);
    expect(game.start("haul", { kind: "repetitions", id: "haul", target: 2 }).ok).toBe(true);
    expect(game.setAccelerating(true).ok).toBe(true);
    expect(game.advance(30)).toMatchObject({ activitySeconds: 30, spentSeconds: 30 });
    expect(game.state.active).toBeNull();
    expect(game.state.bank).toEqual({ seconds: 3570, cap: 3600, accelerating: false });
    expect(game.start("haul").ok).toBe(true);
    game.advance(1);
    expect(game.state.active?.progress).toBe(1);
    expect(game.state.bank.seconds).toBe(3570);
  });

  test("an exhausted bank leaves unfinished work running normally", () => {
    const game = new GameEngine(hauling());
    game.advance(10);
    game.start("haul");
    expect(game.setAccelerating(true).ok).toBe(true);
    expect(game.advance(10)).toMatchObject({ activitySeconds: 10, spentSeconds: 10 });
    expect(game.state.active?.progress).toBe(20);
    expect(game.state.bank).toMatchObject({ seconds: 0, accelerating: false });
    expect(game.setAccelerating(true).ok).toBe(false);
    expect(game.advance(10).activitySeconds).toBe(10);
    expect(game.state.active).toBeNull();
    expect(game.stat("coin").value).toBe(3);
  });

  test("the save validator can reject a completed finite run and accept partial progress", () => {
    const game = new GameEngine(hauling());
    const objective: Objective = { kind: "repetitions", id: "haul", target: 1 };
    expect(game.objectiveAvailability("haul", objective, 29.5).ok).toBe(true);
    expect(game.objectiveAvailability("haul", objective, 30).ok).toBe(false);
    expect(game.objectiveAvailability("haul", objective, -1).ok).toBe(false);
    expect(game.objectiveAvailability("haul", objective, Infinity).ok).toBe(false);
    expect(game.objectiveAvailability("coin", { kind: "resource", id: "coin", target: 3 }).ok).toBe(false);
  });

  test("an unrelated objective is refused before it can spend time or bank", () => {
    const game = village();
    game.advance(100);
    const saved = game.snapshot();
    expect(game.start("reading", { kind: "resource", id: "herbs", target: 3 }).ok).toBe(false);
    expect(game.start("reading", { kind: "level", id: "lore", target: 99 }).ok).toBe(false);
    expect(game.snapshot()).toEqual(saved);
    expect(game.setAccelerating(true).ok).toBe(false);
  });
});

describe("instant actions alongside sustained work", () => {
  test("an instant purchase preserves a paid run, its objective and its partial wall tick", () => {
    const game = village();
    game.stat("coin").value = 10;
    run(game, "gather", 4.25);
    const active = structuredClone(game.state.active);
    expect(game.start("pouch").ok).toBe(true);
    expect(game.state.active).toEqual(active);
    expect(game.stat("coin").value).toBe(5);
    expect(game.stat("coin").max).toBe(20);
    expect(game.state.wallRemainder).toBeCloseTo(0.25);
    expect(game.state.bank.seconds).toBe(0);
    expect(game.advance(5.75).activitySeconds).toBe(6);
    expect(game.stat("gather").reps).toBe(1);
    expect(game.stat("herbs").value).toBe(2);
    // The trip spent a Vigor, so the idle filler takes the freed slot.
    expect(game.state.active?.id).toBe("rest");
  });

  test("an arrangement bought mid-practice improves it without restarting it", () => {
    const game = village();
    game.stat("coin").value = 10;
    run(game, "breath", 4.5, { kind: "level", id: "lore", target: 4 });
    expect(game.start("pallet").ok).toBe(true);
    expect(game.state.active).toMatchObject({ id: "breath", progress: 4 });
    expect(game.stat("rest").rate).toBe(1.5);
    expect(game.state.wallRemainder).toBeCloseTo(0.5);
  });

  test("an unavailable instant action leaves the entire running state untouched", () => {
    const game = village();
    run(game, "reading", 4.25);
    const before = game.snapshot();
    expect(game.start("pouch").ok).toBe(false);
    expect(game.snapshot()).toEqual(before);
  });

  test("replacing a paid run keeps its bill and progress; resuming pays nothing", () => {
    const fixture: GameRecord[] = [
      { id: "coin", kind: "resource", initial: { value: 10, max: 20 } },
      { id: "first", kind: "task", length: 10, cost: { coin: 2 } },
      { id: "second", kind: "task", length: 20, cost: { coin: 3 } },
    ];
    const game = new GameEngine(fixture);
    run(game, "first", 4.25);
    expect(game.start("second").ok).toBe(true);
    expect(game.state.active).toEqual({ id: "second", progress: 0, objective: { kind: "repetitions", id: "second", target: 1 } });
    expect(game.stat("first")).toMatchObject({ reps: 0, exp: 4, paid: true });
    expect(game.stat("coin").value).toBe(5);
    expect(game.state.bank.seconds).toBeCloseTo(0.25);
    game.advance(20);
    expect(game.stat("second")).toMatchObject({ reps: 1, paid: false, exp: 0 });
    game.stat("coin").value = 0;
    expect(game.availability("first").ok).toBe(true);
    expect(game.start("first").ok).toBe(true);
    expect(game.state.active?.progress).toBe(4);
    expect(game.advance(6).activitySeconds).toBe(6);
    expect(game.availability("first").reason).toBe("coin: 2 needed.");
  });

  test("per-run costs charge once, and goal updates do not repeat the initial bill", () => {
    const fixture: GameRecord[] = [
      { id: "coin", kind: "resource", initial: { value: 10, max: 20 } },
      { id: "craft", kind: "task", length: 2, cost: { coin: 1 } },
    ];
    const game = new GameEngine(fixture);
    game.start("craft");
    expect(game.stat("coin").value).toBe(9);
    game.start("craft", { kind: "repetitions", id: "craft", target: 3 });
    expect(game.stat("coin").value).toBe(9);
    game.advance(6);
    expect(game.stat("craft").reps).toBe(3);
    expect(game.stat("coin").value).toBe(7);
  });

  test("an instant reward satisfying the chosen objective stops without manufacturing a work completion", () => {
    const fixture: GameRecord[] = [
      { id: "herbs", kind: "resource", initial: { max: 12 } },
      { id: "work", kind: "task", length: 10, result: { herbs: 1 } },
      { id: "supplies", kind: "purchase", result: { herbs: 3 } },
    ];
    const game = new GameEngine(fixture);
    run(game, "work", 4.25, { kind: "resource", id: "herbs", target: 3 });
    expect(game.start("supplies").ok).toBe(true);
    expect(game.state.active).toBeNull();
    expect(game.stat("herbs").value).toBe(3);
    expect(game.stat("work").reps).toBe(0);
    expect(game.state.log.at(-1)?.text).toContain("objective complete");
  });

  test("an instant expense can invalidate a continuous requirement without losing earned experience", () => {
    const fixture: GameRecord[] = [
      { id: "qi", kind: "resource", initial: { value: 3, max: 3 } },
      { id: "focus", kind: "family", initial: { max: 3 } },
      { id: "practice", kind: "task", length: "continuous", train: "focus", need: "g.qi >= 1", needtext: "A little qi is needed.", effect: { "focus.exp": 1 } },
      { id: "purchase", kind: "purchase", buy: { qi: 3 } },
    ];
    const game = new GameEngine(fixture);
    run(game, "practice", 4.25);
    expect(game.start("purchase").ok).toBe(true);
    expect(game.state.active).toBeNull();
    expect(game.stat("focus").exp).toBe(4);
    expect(game.state.log.at(-1)?.text).toBe("practice is waiting: A little qi is needed.");
    expect(game.state.waiting.map(entry => entry.id)).toEqual(["practice"]);
  });
});

describe("waiting list, idle income and home places", () => {
  test("idle seconds earn passive rates up to the cap", () => {
    const game = new GameEngine(reservoir());
    expect(game.advance(10)).toMatchObject({ activitySeconds: 0, bankedSeconds: 10 });
    expect(game.stat("qi").value).toBe(4);
    expect(game.state.log.some(entry => entry.kind === "cap" && entry.text.startsWith("qi has reached 4/4"))).toBe(true);
  });

  test("a drained practice waits until its reservoir refills, then resumes without a click", () => {
    const game = new GameEngine(reservoir());
    game.stat("qi").value = 1;
    expect(game.start("practice", { kind: "level", id: "focus", target: 1 }).ok).toBe(true);
    // Two sustained seconds, a blocked third, then idle regeneration.
    expect(game.advance(3)).toMatchObject({ activitySeconds: 2, bankedSeconds: 1 });
    expect(game.state.log.some(entry => entry.kind === "pause" && entry.text === "practice is waiting: qi cannot sustain this activity.")).toBe(true);
    // One payable second is not enough: it would only stop again.
    game.advance(6);
    expect(game.state.active).toBeNull();
    expect(game.stat("qi").value).toBeCloseTo(3.5, 9);
    game.advance(1);
    expect(game.state.active?.id).toBe("practice");
    expect(game.state.waiting).toEqual([]);
  });

  test("a long idle wait resumes on the same second as stepping second by second, and stays fast", () => {
    const content = (rate = 0.003): GameRecord[] => [
      { id: "qi", kind: "resource", initial: { value: 0, max: 4, rate } },
      { id: "vigor", kind: "resource", initial: { value: 10, max: 10 } },
      { id: "gate", kind: "task", length: 5, need: "g.qi >= 3" },
    ];
    const stepped = new GameEngine(content()), jumped = new GameEngine(content());
    for (const game of [stepped, jumped]) expect(game.queue("gate").reason).toBe("Waiting.");
    for (let second = 0; second < 1100; second++) stepped.advance(1);
    jumped.advance(1100);
    expect(jumped.stat("gate").value).toBe(1);
    expect(jumped.state.activitySeconds).toBe(stepped.state.activitySeconds);
    expect(jumped.stat("qi").value).toBeCloseTo(stepped.stat("qi").value, 9);
    expect(jumped.state.bank.seconds).toBe(stepped.state.bank.seconds);
    // Still short of the gate after a week, so the wait never resolves.
    const slow = new GameEngine(content(0.000004));
    slow.queue("gate");
    const began = performance.now();
    slow.advance(7 * 86400);
    expect(performance.now() - began).toBeLessThan(200);
    expect(slow.state.waiting.map(entry => entry.id)).toEqual(["gate"]);
  });

  test("starting another pursuit parks the interrupted one first in line with its paid progress", () => {
    const game = new GameEngine(reservoir());
    expect(game.queue("b").ok).toBe(true);
    expect(game.state.active?.id).toBe("b");
    expect(game.queue("a").ok).toBe(true);
    game.advance(4);
    expect(game.start("practice").ok).toBe(true);
    expect(game.state.waiting.map(entry => entry.id)).toEqual(["b", "a"]);
    expect(game.stat("b").exp).toBe(4);
    game.stop();
    game.advance(0);
    expect(game.state.active).toMatchObject({ id: "b", progress: 4 });
    expect(game.state.waiting.map(entry => entry.id)).toEqual(["a"]);
  });

  test("the waiting list refuses duplicates and a seventh entry", () => {
    const records: GameRecord[] = Array.from({ length: 8 }, (_, index) => ({ id: `t${index}`, kind: "task", length: 5 }));
    const game = new GameEngine(records);
    expect(game.start("t0").ok).toBe(true);
    expect(game.queue("t0")).toEqual({ ok: false, reason: "Already running." });
    for (let index = 1; index <= 6; index++) expect(game.queue(`t${index}`).ok).toBe(true);
    expect(game.queue("t1")).toEqual({ ok: false, reason: "Already waiting." });
    expect(game.queue("t7")).toEqual({ ok: false, reason: "The waiting list is full (6)." });
    expect(game.dequeue(0).ok).toBe(true);
    expect(game.state.waiting[0]?.id).toBe("t2");
  });

  test("the idle filler yields to a waiting pursuit the second it can resume", () => {
    const game = new GameEngine(reservoir());
    game.stat("qi").value = 0;
    game.stat("vigor").value = 0;
    game.advance(0);
    expect(game.state.active?.id).toBe("rest");
    expect(game.queue("practice").ok).toBe(true);
    expect(game.state.active?.id).toBe("rest");
    game.advance(8);
    expect(game.state.active?.id).toBe("rest");
    game.advance(1);
    expect(game.state.active?.id).toBe("practice");
  });

  test("a strained outing parks with its progress and resumes once Strain covers the rest of the run", () => {
    const game = new GameEngine([
      { id: "strain", kind: "resource", initial: { value: 1, max: 10, rate: 0.02 } },
      { id: "vigor", kind: "resource", initial: { value: 10, max: 10 } },
      { id: "outing", kind: "site", length: 300, max: 1, strain: { strain: 0.03 }, result: { vigor: 0 } },
    ]);
    expect(game.start("outing").ok).toBe(true);
    game.advance(120);
    expect(game.state.active).toBeNull();
    expect(game.state.waiting.map(entry => entry.id)).toEqual(["outing"]);
    const done = game.stat("outing").exp;
    expect(done).toBeGreaterThan(90);
    // Net drain 0.01/s: the remaining run needs ceil(0.01 × remaining) whole Strain before it resumes.
    const needed = Math.ceil(0.01 * (300 - done));
    let waited = 0;
    while (!game.state.active && waited < 1000) { game.advance(1); waited++; }
    expect(game.stat("strain").value).toBeGreaterThanOrEqual(needed - 1e-9);
    expect(game.state.active?.progress).toBe(done);
    game.advance(400);
    expect(game.stat("outing").value).toBe(1);
    expect(game.state.log.filter(entry => entry.kind === "pause")).toHaveLength(1);
  });

  test("a home place holds one arrangement; the other waits until it is taken down", () => {
    const game = village();
    game.stat("coin").value = 10;
    expect(game.availability("pallet").ok).toBe(true);
    expect(game.start("pallet").ok).toBe(true);
    expect(game.availability("cot").reason).toBe("The rest place holds Straw pallet; take it down on Home first.");
    expect(game.remove("pallet").ok).toBe(true);
    expect(game.start("cot").ok).toBe(true);
    expect(game.slotHolder("rest")?.id).toBe("cot");
    expect(game.stat("rest").rate).toBe(2);
  });

  test("floor space is counted from what is installed, and a bill over capacity names what raises it", () => {
    const game = village();
    game.stat("coin").value = 10;
    expect(game.start("herb_rack").ok).toBe(true);
    expect(game.stat(HOME_SPACE)).toMatchObject({ value: 1, max: 2 });
    expect(game.availability("lean_to").reason).toBe("Coin: 8 needed.");
    game.stat("coin").value = 8;
    expect(game.start("lean_to").ok).toBe(true);
    expect(game.stat(HOME_SPACE).max).toBe(4);
    expect(game.homeSlots()).toEqual(["rest", "study"]);
    expect(game.stat("herb_rack").value).toBe(1);
  });
});

describe("encounters, boosts and discounts", () => {
  test("a fight is swung out second by second: a loss empties Life and spends the preparation, a win completes it", () => {
    const lost = new GameEngine(encounter());
    expect(lost.fight("bandit")).toMatchObject({ you: { strike: 2, guard: 1, speed: 5, hit: 100, dodge: 0 }, yourChance: 1, foeChance: 1,
      yourDamage: 1, foeDamage: 2, winSeconds: 4, loseSeconds: 3, limit: 10, likely: false });
    expect(lost.start("bandit").ok).toBe(true);
    lost.advance(3);
    expect(lost.state.active).toBeNull();
    expect(lost.state.waiting).toEqual([]);
    expect(lost.stat("bandit")).toMatchObject({ value: 0, reps: 0, paid: false, exp: 0 });
    expect(lost.stat("vigor").value).toBe(6);
    expect(lost.stat("life").value).toBe(0);
    expect(lost.state.lastStop).toBe("Bandit (lost after 0:03: your life runs out; you landed 3 of 3 swings, the bandit 3 of 3): you back off.");
    expect(lost.availability("bandit")).toEqual({ ok: false, reason: "life: you are in no state to fight." });
    lost.stat("life").value = 6;
    expect(lost.availability("bandit").ok).toBe(true);

    const won = new GameEngine(encounter());
    won.stat("might").value = 2;
    won.recompute();
    expect(won.fight("bandit")).toMatchObject({ yourDamage: 3, foeDamage: 1, winSeconds: 2, likely: true });
    won.start("bandit");
    won.advance(2);
    expect(won.state.active).toBeNull();
    expect(won.stat("bandit").value).toBe(1);
    expect(won.stat("cleared").value).toBe(1);
    expect(won.stat("coin").value).toBe(3);
    // One blow in the first second, then a second of Life returning before your next swing ends it.
    expect(won.stat("life").value).toBeCloseTo(5.02, 9);
    expect(won.state.log.some(entry => entry.kind === "story" && entry.text
      === "Bandit: the bandit falls after 0:02; you landed 2 of 2 swings, the bandit 1 of 1. life 6 → 5.")).toBe(true);
  });

  test("swings come as often as Speed fills the gauge, and each must beat Hit and the other's Dodge", () => {
    const records = encounter().map(record => record.id === "speed" ? { ...record, initial: { max: 2.5 } }
      : record.id === "guard" ? { ...record, initial: { max: 3 } } : record);
    const slow = new GameEngine(records);
    slow.start("bandit");
    slow.advance(4);
    // Speed 2.5 swings every two seconds against the bandit's every second, and a guard of 3 turns his strike of 3.
    expect(slow.state.fight).toMatchObject({ swings: 2, landed: 2, foeSwings: 4, foeLanded: 4, foeLife: 2 });
    expect(slow.state.fight!.lines).toContain("0:01 The bandit's strike lands, but your guard turns it.");

    const shaky = encounter().map(record => record.id === "hit" ? { ...record, initial: { max: 50 } }
      : record.id === "bandit" ? { ...record, encounter: { ...record.encounter!, foe: { ...record.encounter!.foe, hit: 50 } } } : record);
    const game = new GameEngine(shaky), rolls = [0.7, 0.2, 0.1, 0.9];
    game.random = () => rolls.shift()!;
    expect(game.fight("bandit")).toMatchObject({ yourChance: 0.5, foeChance: 0.5, winSeconds: 8, loseSeconds: 6 });
    game.start("bandit");
    game.advance(2);
    expect(game.state.fight!.lines).toEqual([
      "0:01 The bandit slips your strike.", "0:01 The bandit strikes you for 2 (life 4).",
      "0:02 You strike the bandit for 1 (3/4).", "0:02 You slip the bandit's strike.",
    ]);
    expect(game.state.fight).toMatchObject({ swings: 2, landed: 1, foeSwings: 2, foeLanded: 1 });
  });

  test("a fight neither side can win is outlasted when the run's length runs out", () => {
    const game = new GameEngine(encounter().map(record => record.id === "guard" ? { ...record, initial: { max: 5 } } : record));
    game.stat("might").value = 0;
    game.recompute();
    expect(game.fight("bandit")).toMatchObject({ winSeconds: Infinity, loseSeconds: Infinity, likely: false });
    expect(game.tooltip("bandit").find(block => block.kind === "fight")?.lines).toContain("Likely outlasted: neither side falls inside the time limit.");
    game.start("bandit");
    game.advance(10);
    expect(game.state.fight?.result).toBe("outlasted");
    expect(game.state.lastStop).toMatch(/^Bandit \(lost after 0:10: the bandit outlasts you;/);
  });

  test("a fight is fought on what it was entered with, and cannot be left halfway", () => {
    const game = new GameEngine([...encounter(), { id: "walk", name: "Walk", kind: "task", length: 10 }]);
    game.state.visibleIds.push("walk");
    expect(game.start("bandit").ok).toBe(true);
    game.advance(1);
    expect(game.state.fight).toMatchObject({ foeLife: 3, life: 6, seconds: 1,
      lines: ["0:01 You strike the bandit for 1 (3/4).", "0:01 The bandit strikes you for 2 (life 4)."] });
    expect(game.stat("life").value).toBe(4);
    expect(game.state.log.at(-1)).toMatchObject({ kind: "fight", text: "Bandit: The bandit strikes you for 2 (life 4)." });
    expect(game.fighting()).toBe(true);
    expect(game.stop()).toEqual({ ok: false, reason: "A fight cannot be left halfway." });
    expect(game.start("walk")).toEqual({ ok: false, reason: "A fight cannot be left halfway." });
    // Strike raised mid-fight changes the next fight, not this one.
    game.stat("might").value = 3;
    game.recompute();
    expect(game.fight("bandit").you.strike).toBe(2);
    expect(game.tooltip("bandit").find(block => block.kind === "fight")?.lines.some(line => line.endsWith("(as you entered)"))).toBe(true);
    game.advance(2);
    expect(game.state.fight).toMatchObject({ result: "life", foeLife: 1 });
    expect(game.state.fight!.lines).toHaveLength(6);
    expect(game.state.log.filter(entry => entry.kind === "fight")).toHaveLength(6);
    // The finished fight's report stays until the player starts something else.
    game.advance(3);
    expect(game.state.fight?.result).toBe("life");
    expect(game.start("walk").ok).toBe(true);
    expect(game.state.fight).toBeUndefined();
  });

  test("a fight in progress survives a save and resumes where it stood; an earlier-shaped fight is dropped", () => {
    const records = encounter(), game = new GameEngine(records);
    game.start("bandit");
    game.advance(1);
    const save = JSON.parse(JSON.stringify(makeSave(game.snapshot(), records)));
    const loaded = new GameEngine(records, decodeSave(save, records).state);
    expect(loaded.state.fight).toEqual(game.state.fight);
    loaded.advance(2);
    expect(loaded.state.fight?.result).toBe("life");
    expect(loaded.state.lastStop).toContain("lost after 0:03");
    const earlier = { ...save, fight: { id: "bandit", strike: 2, guard: 1, life: 6, exchange: 1, done: false } };
    expect(decodeSave(earlier, records).state.fight).toBeUndefined();
    expect(() => decodeSave({ ...save, fight: { ...save.fight, landed: 9 } }, records)).toThrow(/more landed swings/);
  });

  test("a held method is part of the fight while it is attuned", () => {
    const game = new GameEngine(encounter());
    expect(game.attune("brace").ok).toBe(true);
    expect(game.fight("bandit")).toMatchObject({ held: [{ id: "brace", adds: { guard: 1 } }], you: { guard: 2 }, winSeconds: 4, loseSeconds: 6, likely: true });
    const fight = game.tooltip("bandit").find(block => block.kind === "fight");
    expect(fight?.label).toBe("Fight");
    expect(fight?.lines).toContain("Held methods: Brace guard +1");
    expect(fight?.lines).toContain("On average you fell the bandit in ~4 s; the bandit fells you in ~6 s.");
    expect(fight?.lines).toContain("Likely win.");
    game.unattune("brace");
    expect(game.fight("bandit")).toMatchObject({ held: [], you: { guard: 1 }, likely: false });
  });

  test("an encounter starts only with the reserve to finish it", () => {
    const game = new GameEngine([
      { id: "strain", kind: "resource", initial: { value: 4, max: 10, rate: 0.02, open: true } },
      { id: "life", kind: "resource", initial: { value: 3, max: 3 } },
      { id: "strike", kind: "resource", initial: { max: 5 } },
      { id: "guard", kind: "resource", initial: { max: 5 } },
      { id: "speed", kind: "resource", initial: { max: 1 } },
      { id: "hit", kind: "resource", initial: { max: 100 } },
      { id: "dodge", kind: "resource", initial: { max: 0 } },
      { id: "cleared", kind: "flag" },
      { id: "bandit", name: "Bandit", kind: "site", length: 60, max: 1, strain: { strain: 0.1 },
        encounter: { foe: { name: "a straw man", life: 1, strike: 0, guard: 0, speed: 1, hit: 0, dodge: 0 }, success: { cleared: 1 }, failureText: "lost." } },
    ]);
    expect(game.availability("bandit").reason).toBe("strain: 5 needed to see it through.");
    game.stat("strain").value = 5;
    expect(game.start("bandit").ok).toBe(true);
    game.advance(60);
    expect(game.stat("cleared").value).toBe(1);
    expect(game.state.log.some(entry => entry.kind === "pause")).toBe(false);
  });

  test("a carried boost speeds one timed run and is spent by its completion", () => {
    const game = village();
    game.stat("carried").value = 1;
    expect(game.start("walk", { kind: "repetitions", id: "walk", target: 2 }).ok).toBe(true);
    expect(game.timeToObjective()).toBe(50);
    game.advance(20);
    expect(game.stat("walk").reps).toBe(1);
    expect(game.stat("carried").value).toBe(0);
    expect(game.state.log.some(entry => entry.text === "The carried current spent itself on Walk the ridge.")).toBe(true);
    game.advance(29);
    expect(game.stat("walk").reps).toBe(1);
    game.advance(1);
    expect(game.stat("walk").reps).toBe(2);
  });

  test("a resource discount reaches every cost of it, stacks with an action's own, and never passes half", () => {
    const fixture: GameRecord[] = [
      { id: "coin", kind: "resource", initial: { value: 100, max: 100 } },
      { id: "breath", kind: "resource", initial: { value: 10, max: 10, rate: 0.01 } },
      { id: "stall", kind: "task", cost: { coin: 10 } },
      { id: "climb", kind: "site", length: 10, buy: { coin: 10 }, strain: { breath: 0.2 } },
    ];
    const game = new GameEngine(fixture);
    const record = (id: string) => game.records.find(candidate => candidate.id === id)!;
    game.stat("coin").discount = 0.1;
    expect(game.payment(record("stall")).coin).toBeCloseTo(9);
    game.stat("climb").discount = 0.2;
    expect(game.payment(record("climb")).coin).toBeCloseTo(10 * 0.9 * 0.8);
    expect(game.drain(record("climb")).breath).toBeCloseTo(0.2 * 0.8);
    game.stat("coin").discount = 0.9;
    expect(game.payment(record("climb")).coin).toBeCloseTo(5);
  });

  test("a cap line marks a store filling up, not one that opens or stays full", () => {
    const game = new GameEngine([
      { id: "coin", name: "Coin", kind: "resource", initial: { value: 0, max: 3 } },
      { id: "pouch", name: "A larger pouch", kind: "purchase", max: 1, mod: { "coin.max": 3 } },
      { id: "strain", name: "Strain", kind: "resource", initial: { value: 10, max: 10, rate: 0.02, open: false } },
      { id: "opener", kind: "purchase", max: 1, mod: { "strain.open": 1 } },
      { id: "earn", kind: "task", result: { coin: 3 } },
    ]);
    game.start("earn");
    expect(game.state.log.filter(entry => entry.kind === "cap").map(entry => entry.text)).toEqual(["Coin has reached 3/3. A higher cap is possible through a larger pouch."]);
    game.start("earn");
    game.start("opener");
    expect(game.stat("strain").open).toBe(true);
    game.advance(30);
    expect(game.state.log.filter(entry => entry.kind === "cap")).toHaveLength(1);
  });
});

describe("knowledge trainers and cap sources", () => {
  test("trainers are visible, unfinished records that give the family experience", () => {
    const game = new GameEngine([
      { id: "sense", kind: "family", initial: { value: 1, max: 3 } },
      { id: "glade", kind: "site", length: 10, max: 1, require: "g.sense >= 1", result: { "sense.exp": 5 } },
      { id: "cave", kind: "site", length: 10, require: "g.sense >= 3", result: { "sense.exp": 5 } },
      { id: "drill", kind: "task", length: "continuous", train: "sense" },
    ]);
    expect(game.familyTrainers("sense").map(record => record.id)).toEqual(["glade", "drill"]);
    run(game, "glade", 10);
    expect(game.stat("glade").reps).toBe(1);
    expect(game.familyTrainers("sense").map(record => record.id)).toEqual(["drill"]);
  });

  test("the sources of a cap are the stock, knowledge and purchases that still raise it", () => {
    const game = village();
    // Notes count: holding one is itself a point of purse. The pouch drops out once it is bought.
    expect(game.capSources("coin").map(record => record.id)).toEqual(["notes", "lore", "pouch"]);
    game.stat("coin").value = 10;
    expect(game.start("pouch").ok).toBe(true);
    expect(game.capSources("coin").map(record => record.id)).toEqual(["notes", "lore"]);
  });
});

describe("state isolation", () => {
  test("snapshots and constructor restores do not alias mutable running state", () => {
    const game = village();
    const saved = game.snapshot();
    const restored = new GameEngine(villageRecords, saved);
    run(restored, "reading", 60);
    expect(game.stat("lore").value).toBe(0);
    expect((saved.stats.lore as Stat).value).toBe(0);
    expect(restored.stat("lore").value).toBe(1);
    expect(JSON.parse(JSON.stringify(restored.snapshot()))).toEqual(restored.snapshot());
  });
});
