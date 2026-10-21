import village from "./village.json";
import type { GameRecord } from "../../src/types";

/** A small village that uses the whole vocabulary; engine behaviour is pinned against this, never against live content. */
export const villageRecords = village as GameRecord[];

/** One timed chore and the store it fills: the fixture for wall-clock, bank and objective accounting. */
export const hauling = (extra: Partial<GameRecord> = {}): GameRecord[] => [
  { id: "coin", kind: "resource", initial: { value: 0, max: 50 } },
  { id: "haul", kind: "task", length: 30, result: { coin: 3 }, ...extra },
];

/** A regenerating reservoir, a knowledge it pays for, and two interchangeable pursuits to queue. */
export const reservoir = (): GameRecord[] => [
  { id: "qi", kind: "resource", initial: { value: 2, max: 4, rate: 0.5 } },
  { id: "focus", kind: "family", initial: { max: 3 } },
  { id: "vigor", kind: "resource", initial: { value: 10, max: 10 } },
  { id: "practice", kind: "task", length: "continuous", train: "focus", run: { qi: 1 }, effect: { "focus.exp": 1 } },
  { id: "rest", kind: "task", length: "continuous", effect: { vigor: 1 }, fill: ["vigor"], autoStart: true },
  { id: "a", kind: "task", length: 10 }, { id: "b", kind: "task", length: 10 },
];

/**
 * A fight with a knowledge and a held technique feeding Strike and Guard. Both sides swing every second and
 * every swing lands, so the course is fixed unless a test lowers Hit and scripts the rolls.
 */
export const encounter = (): GameRecord[] => [
  { id: "vigor", kind: "resource", initial: { value: 10, max: 10 } },
  { id: "coin", kind: "resource", initial: { value: 0, max: 50 } },
  { id: "life", kind: "resource", initial: { value: 6, max: 6, rate: 0.02 } },
  { id: "strike", kind: "resource", initial: { value: 0, max: 0 } },
  { id: "guard", kind: "resource", initial: { value: 0, max: 0 } },
  { id: "speed", kind: "resource", initial: { value: 0, max: 5 } },
  { id: "hit", kind: "resource", initial: { value: 0, max: 100 } },
  { id: "dodge", kind: "resource", initial: { value: 0, max: 0 } },
  { id: "qi", kind: "resource", initial: { value: 5, max: 5 } },
  { id: "attune_slots", kind: "resource", initial: { max: 1, open: true } },
  { id: "might", kind: "family", initial: { value: 1, max: 5 }, perLevel: { "strike.max": 2, "guard.max": 1 } },
  { id: "brace", name: "Brace", kind: "technique", attune: true, cost: { qi: 1 }, result: { coin: 1 }, held: { "guard.max": 1 } },
  { id: "cleared", kind: "flag" },
  { id: "bandit", name: "Bandit", kind: "site", length: 10, max: 1, cost: { vigor: 4 }, result: { coin: 3 },
    encounter: { foe: { name: "the bandit", life: 4, strike: 3, guard: 1, speed: 5, hit: 100, dodge: 0 }, success: { cleared: 1 }, failureText: "you back off." } },
];
