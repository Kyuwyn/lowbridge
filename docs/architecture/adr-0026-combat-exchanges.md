ADR 0026: Combat as rolled swings on Speed clocks

Status: Accepted for chapter 1 and the ridge; every number is content and provisional. Date: 21 October 2026, revised the same day: the first version resolved fights as deterministic exchanges and showed them in the Current activity panel; the owner asked for a full pane, a Speed stat and real hit and dodge chances, and chose unseeded rolls over seeded or fractional ones. Amended 27 October 2026 after the design audits: Rest restores Life (§1, §3), the projection is an exact win chance with graded verdicts (§5, owner-approved), a finished fight survives automatic resumption (§6), and §7's Foundation claim is re-measured; amended again the same day: the bandit is optional, since the Earth and Formation lines trace his cache without a fight (§7); see **Amendments** below. Basis: [ADR 0008](adr-0008-optional-combat.md) (prepare, then resolve automatically; a loss costs time and used preparation; nothing required hides behind a fight), Part A rules 10 and 11 of the [design plan](../../design/DESIGN-PLAN-2026-10-18.md), and rules 27, 28, 29, 31, 33, 36 and 38 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md).

**Context.** ADR 0008 chose prepare-then-resolve and left resolution open: "randomness, damage formulas, combat rounds, a health or qi resource model". The only fight in the game, the ridge bandit, compared one `power` expression against a threshold. The player saw a number, not a reason. Later chapters are expected to hold dungeons, extended tasks with several fights in a row, so the model has to stay cheap to project and must not lean so hard on probability that one bad roll decides a long undertaking.

**Decision.** A fight is swung out across a timed run, between the cultivator and one foe.

1. **Six fight stats, all shared `resource` records the engine reads by fixed id.** They appear when Circulation opens, at the end of chapter 1.

   | id | group | baseline | raised by |
   |---|---|---|---|
   | `life` | Resources (Body panel) | 6/6, +0.02/s; Rest adds max/300 per second | Circulation +2 per level; Foundation +4; the first sparring win +1; *Sink the breath under the load* +2 while held |
   | `strike` | Combat | 1 | Circulation +1 per level; Blade Intent +1 per level; Sword Disciple +2; Body Disciple +1; held methods |
   | `guard` | Combat | 0 | Circulation +1 per level; Body Disciple +2; Sword Disciple +1; held methods |
   | `speed` | Combat | 1 | Body Disciple +0.2; Sword Disciple +0.1 |
   | `hit` | Combat | 80 (percent, at most 100) | Circulation +2 per level; Sword Disciple +10 |
   | `dodge` | Combat | 5 (percent, at most 60) | Circulation +1 per level; *Settle the breath* +5 while held; Body Disciple +5 |

   Apart from Life only the `max` means anything; it is the derived sum of everything raising it, so modules raise these through `perLevel` and `mod` like any cap ([ADR 0021](adr-0021-compounding-vocabulary.md)) and no expression crosses a module boundary ([ADR 0024](adr-0024-route-keys.md)). The Combat group never enters the ledger. Life is a fight-only store, not a food or energy meter ([ADR 0003](adr-0003-opening-anchors.md)): only fights draw on it. It returns slowly on its own, busy or idle, and Rest brings it back from empty to full in about five minutes, filling Life as well as Vigor before it ends.

2. **Held methods are the approach.** An `attune: true` technique may carry `held`, a standing-modifier table paid while it holds an attunement place. Chapter 1: *Steady the breath* and *Carry the current* add 1 to Strike, *Settle the breath* adds 1 to Guard and 5 to Dodge. Choosing what to hold before a fight is the preparation ADR 0008 asked for. There are no stances yet.

3. **An encounter names a foe; the run's length is its time limit.** `encounter: { foe: { name, life, strike, guard, speed, hit, dodge }, success, failureText }` on a timed record. Every fight second:

   ```
   each side's readiness += its Speed
   whenever a readiness reaches 5 it swings and drops by 5; the fuller acts first, and you before the foe when level
   a swing lands with chance  hit/100 × (1 − other's dodge/100)
   a landed swing takes       max(0, strike − other's guard)  from the other's Life
   ```

   Speed 1 swings every five seconds. Strike, Guard, Speed, Hit, Dodge and whole Life are recorded on the fight's first second, so changes made mid-fight belong to the next fight; Life itself falls as blows land and keeps regenerating at its own rate up to its cap. The fight ends when the foe's Life reaches 0 (won) or yours drops below 1 (lost, and the store empties), and the run then ends at once. A run that reaches its length with both standing is lost: the foe outlasts you. A win applies `success` and the run completes as usual; a loss costs the Life taken and the run's entry bill, completes nothing, and stops the slot. Rest is the way back from a loss: it restores Life as well as Vigor. A fight cannot start with less than 1 Life, and the refusal says how long until it can ("ready in ~50 s", counting Rest's Life while Rest runs). Once begun it cannot be stopped or displaced by another sustained activity; instant actions still work. A fight in progress, with its log, is part of the save.

4. **Rolls are unseeded.** Every swing calls the engine's `random` source, `Math.random` in play. Tests replace it with scripted rolls; route validation gives each route a fixed-seed generator, so `bun run validate` timings repeat. Reloading a save can therefore re-roll a fight; a loss is cheap under ADR 0008, and a seed can be added later without changing anything else.

5. **Projection is an exact win chance with a graded verdict.** The tooltip's `fight` block, after the time limit, opens with the verdict, then one line naming the cheapest change that would raise it, then both sides' numbers, what each held method adds, each side's chance to land and what a landed swing takes, and the average time for each to fell the other: `ceil(life / damage) / chance × 5 / speed`. The win chance is exact, not sampled: the engine replays the swing rules of §3 second by second over every outcome (readiness order, Life regenerating to its cap, the run's length and speed as the time limit) from the Life you hold and a fresh foe. The verdict grades it:

   | verdict | when | reads |
   |---|---|---|
   | certain | win chance ≥ 95% | "Certain win", or "Near-certain win · about 97%" |
   | likely | 75% to 95% | "Likely win · about 84%" |
   | close | 50% to 75% | "Close · about 61%" |
   | loss | below 50% | "Likely loss · about 31%", or "Cannot win inside the time limit" at nothing |
   | hopeless | your Strike does not pass their Guard | "Cannot win: Strike 4 does not pass Guard 5" |

   The flip hint tries, in order, resting to full Life ("Rested to full Life: about 98%"), holding a visible method in a free attunement place ("Holding Carry the current as well: about 85%"), and one more Strike with what raises it; it names the first that moves the verdict up a band and is absent at *certain*. The fight card and the Fight tab show the same verdict text. Since rolls are unseeded (§4), a likely win can still be lost, and the percentage says by how much.

6. **The Fight tab.** A Fight tab in the centre column appears while a fight is under way or just finished, and opens by itself when a fight begins. It shows both sides with Life and readiness bars, their stats, each side's chance to land (or, once finished, how many swings each landed), the verdict, and the blow-by-blow with fight times. The finished fight stays until the player chooses to start something else; the waiting list resuming or Rest filling the empty slot does not clear it, nor the reason the run stopped. Every swing is also a "Fight" journal entry, and a closing line gives the time, both sides' landed swings, and Life before and after, or the reason it was lost.

7. **Content.** A **Fights** group on Tasks. *Spar with the ferry hand* (chapter 1, repeatable, no cost): Old Tam, life 4, strike 2, guard 1, speed 1, hit 75, dodge 20, one minute; each bout pays Labour experience and the first win deepens Life by one. With the bare *Steady the breath* at Circulation 0 it is a likely loss (about 23%); holding a second method makes it a likely win (about 84% with *Carry the current*, 88% with *Settle the breath*). *Face the man on the porters' path* (ridge): life 10, strike 8, guard 5, speed 1, hit 80, dodge 15, one minute, keeping its Vigor and herb bill and its Strain drain; a win sets `bandit_cleared`, which opens his cache. Passing his Guard takes Strike 6. The measured direct routes reach Foundation at Circulation 2 with Strike 5 (the channel pair) or 4 (the hollow pair), so there he reads "Cannot win", and the flip names Circulation as what raises Strike; a channel player who trains a third Circulation level first can hurt him. On the ridge the Body and Sword lines pass his guard: at full Life on reaching the waystation he is a certain win for the Body line and about 97% (from the channel) or 99.6% (from the hollow) for the Sword line, re-measured after commit 94a21fe, and the direct routes fight him once the projection says they will win (three of the four Body and Sword direct routes do). The Earth and Formation lines add no Strike, so at their crossing he still cannot be won, and they do not need to: *Read the path for his cache* (earth teaching) and *Mark out the path for his cache* (formation teaching) each run 90 s at 0.04 Strain/s from the outskirts, set `cache_found` and teach 20 experience of Ground Reading or Array Craft. The cache asks `g.bandit_cleared > 0 || g.cache_found > 0`, and all four Earth and Formation direct routes trace it without a fight. The fight stays optional: nothing needed to cross is behind it, and its one reward beyond fifteen coin has a second way in.

**Divergences from *copy* rules.**

- **Rule 28 (auto-battler turn per speed tick) is copied for attacks only.** Each side swings once per filled readiness, with random hits. There is no spell slot yet, since spells do not exist; held methods stand in for them as standing modifiers.
- **Rule 27 is kept except for floors.** A fight is a single timed run, not a multi-floor site; leaving and losing keep every discovery and level, and a loss drains Life (which returns) plus the used preparation (ADR 0008, rule 10) rather than only time.
- **Rule 29 (five stresses as HP) and rule 31 (spell budget) are deferred, not rejected.** Strain stays the one site gauge.
- Rule 33's tooltip schema gains one block (`fight`, after `time`); rule 36 (a bestiary) and rule 38 (`warn` on irreversible actions) need nothing here, since a fight closes nothing.

**Amendments, 27 October 2026.** The design audits found the "likely win" label hiding a 36% loss, a Rest that did not bring Life back, a fight report cleared by the slot refilling itself, and §7's Foundation claim contradicted by an over-trained route. The owner approved graded verdicts with an exact win chance (§5). Rest now restores Life (§1, §3), the finished fight survives automatic starts (§6), and §7 is re-measured on the routes `bun run validate` runs today. The fight still needs no `warn`: it closes nothing.

**Amendment, 27 October 2026 (the cache).** The review found the cache reachable only through a fight that the Earth and Formation lines cannot win, so their players were shut out of a reward the Body and Sword lines could take. The two tracing sites in §7 give those lines a non-fight path; the Body and Sword lines still fight for it. §7 was re-checked after the change: the bandit's numbers, the Strike figures at Foundation and the Body and Sword lines are untouched, so the "Cannot win" verdict on the direct routes at Foundation and the near-certain wins after the Body and Sword crossings stand. What changed is that the Earth and Formation direct routes, which used to leave the cache, now trace and search it (`bun run validate`, 122/122 records reachable).

**Still open.** Stances or other per-fight approaches beyond held methods; foe techniques; per-swing effects (healing, damage over time, Qi spent in a fight); critical hits; dungeons of several fights and how Life carries between them; encounter pools; a bestiary; whether a fight's rolls should be seeded at entry.

## Status

Proposed

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 21 October 2026, amended 27 October 2026, as the status line at the top says.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Feature |
| **Knowledge Risk** | N/A — no engine, so no `docs/engine-reference/` VERSION.md |
| **References Consulted** | None |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0003, ADR-0008, ADR-0021, ADR-0022, ADR-0023, ADR-0024 |
| **Enables** | ADR-0029, ADR-0030, ADR-0031, ADR-0032 |
| **Blocks** | None |
| **Ordering Note** | ADR-0030 turns its class figures into held figures. ADR-0031 adds foe techniques and rules stances out of this slice. ADR-0032 lets a fight be one room of a dungeon. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Fights in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
