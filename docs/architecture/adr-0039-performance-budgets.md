# ADR-0039: Performance budgets for the tick, render and preview

## Status
Proposed

## Date
2026-10-29

## Last Verified
2026-10-29

## Decision Makers
Owner (Kyuwyn); drafted by Claude from measurements taken on 29 October 2026 after the architecture review of that day.

## Summary
No performance budget existed anywhere in the project (TR-fight-005), and measurement now shows the late game is over any reasonable one: on a mid-range laptop stand-in every 1 s tick is a 140–340 ms main-thread task, with occasional tasks of 580–930 ms whose cause is not yet identified. This ADR sets budgets at a stated reference (headless Chromium, 4× CPU throttle, the late-game save idle), separates the targets the game must reach from regression ceilings it meets today, sets a per-call budget for the exact fight projection, names the costs that break the targets, and adds `bun run perf` as the meter. It adds no release gate or mandatory step.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Feature |
| **Knowledge Risk** | MEDIUM — the meter relies on Playwright 1.64.1, Chromium's DevTools Protocol (`Performance.getMetrics`, `Emulation.setCPUThrottlingRate`) and the Long Tasks API, likely newer than agents' training data; check their documentation for these versions before changing `scripts/perf.ts` |
| **References Consulted** | None in-repo. Figures come from `scripts/perf.ts` and an ad-hoc Bun benchmark of engine calls (see Context) |
| **Post-Cutoff APIs Used** | None known |
| **Verification Required** | That 4× throttle tracks a real mid-range laptop; one measurement on such hardware would calibrate it |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0026, ADR-0031, ADR-0035, ADR-0036, ADR-0038 |
| **Enables** | None |
| **Blocks** | None |
| **Ordering Note** | Ships with `scripts/perf.ts` and `bun run perf`. ADR-0036 fixes the 1 s tick and full render this budgets; ADR-0026 and ADR-0031 define the exact fight projection; ADR-0035 the save write; ADR-0038 the interface boundary that the target work stays inside. |

## Context

### Problem Statement
The design leans on per-second work: ADR-0036's ticker settles the engine and re-renders the whole interface every second; ADR-0026 and ADR-0031 replace sampled fight odds with an exact replay of every outcome; ADR-0035 decodes each save twice before writing it; the interface previews the waiting list by advancing a cloned engine up to a day ahead. Each was judged cheap enough when written, but no budget said what "cheap enough" means, and the review found TR-fight-005 uncovered.

### Measurements (29 October 2026)
Machine: AMD Ryzen AI 9 HX PRO 370 (about 5 GHz), headless Chromium from Playwright 1.64.1. Save: `playtest/second-direction.json` (late game: 223 records, 134 visible, about 10,000 DOM nodes), idle 70 s after import.

| Measure | 1× (this machine) | 4× throttle (mid-range stand-in) |
|---|---|---|
| Main-thread busy | 60 ms per second (script 46) | 251–261 ms per second (script 196–206), two runs |
| Long tasks (≥ 50 ms) in 70 s | 21, mostly 50–76 ms; spikes 144, 175 | 83 in each run: every tick 140–340 ms; longest 929 and 582 ms |

Engine calls in Bun on the same machine (medians): `advance(1)` about 0.8 ms; `recompute` 0.1 ms; `tooltip()` over all 134 visible records 36 ms; `fight(spur_pair)` 10.7 ms (other fights under 0.2 ms); `decodeSave` 3 ms; `makeSave` 0.3 ms; `advance(86400)` on a clone (the runway probe) 140 ms. Bun runs JavaScriptCore and Chromium runs V8, so these show relative cost, not browser milliseconds.

So the engine's own tick is about 1 ms. The cost is in what the interface asks for each second:

1. **Every card's tooltip on every render.** `src/ui.ts` builds `engine.tooltip()` for each visible card (the card render) and for each open detail and the breakthrough panel on each 1 s render: about 36 ms at 1× in Bun.
2. **Fight projections, twice per fight card.** The tooltip's `fight` block calls `fight()` (ADR-0026 §5), and each fight card's summary line calls it again for its verdict, so every visible fight card pays the exact replay twice per render. The spur pair's replay costs about 11 ms at 1× in Bun, so it alone is about 22 ms of each tick; the other fights cost under 0.2 ms. Caching `fight()` by its inputs is therefore the cheapest single win.
3. **The runway probe (not in the reference).** While something runs and the waiting list shows, `unattendedSeconds()` clones the engine and advances it up to 86,400 s whenever its key changes; the key includes the activity clock's minute, so it re-runs about once a minute of activity: about 140 ms at 1× in Bun. The reference save has nothing running, so the browser figures above do not include it; with it, a running game would add a task of that size each minute.
4. **Unidentified spikes.** The 580–930 ms tasks at 4× occur with nothing running, so they are not the probe. Their cause (a save write, garbage collection, a larger render) has not been profiled.

### Constraints
- Plain DOM, full re-render each tick (ADR-0036); a framework is not on the table.
- The exact win chance (ADR-0026 §5) stays exact; budgets may change when it is computed, not what it computes.
- A meter, not a gate: the global engineering rules forbid adding a release gate without stated justification, and the deploy is not gated on anything yet (ADR-0036).

### Requirements
- TR-fight-005: a cost budget for the exact projection, which the tooltip and Fight tab recompute, and (by extension) for the tick and `recompute`.

## Decision

### 1. The reference
Budgets are stated for: headless Chromium via Playwright, **4× CPU throttle**, a 1440×1000 viewport, `playtest/second-direction.json` imported and left idle. The throttle stands in for a mid-range laptop; figures at 1× are informational. When a later chapter ships a later save, the reference moves to it in the same change.

The reference has nothing running and an empty waiting list, so it measures idle rendering and does **not** exercise the runway probe or a running activity. A second scenario, with an activity running and the waiting list shown, is a follow-up; until it exists, the probe is budgeted only through the per-task target below.

### 2. Targets (where the game must get to)

| Budget | Target at 4× | Today |
|---|---|---|
| A tick (settle and render) while idle | ≤ 50 ms; measured as "no long tasks", since a tick over 50 ms is one | 140–340 ms: **missed** |
| Longest single task during play | ≤ 200 ms | 582–929 ms: **missed** |
| Main-thread busy while idle | ≤ 100 ms per second | 251–261: **missed** |
| One exact fight projection, `fight()` | ≤ 5 ms at 1× in Bun, for any foe in content | 10.7 ms (the spur pair): **missed**; every other fight under 0.2 ms |
| A player action, click to rendered result | ≤ 100 ms | not yet measured |
| Boot to first render, including settling an absence up to the bank cap | ≤ 1 s | not yet measured |

The projection gets its own budget because its cost depends on content, not on the interface: it replays every outcome over the fight's length, so a foe with more Life or a longer limit costs more (ADR-0026 §5 promised a model "cheap to project"). It is measured in Bun because it is pure engine work.

### 3. Regression ceilings (what must not get worse while the targets are worked toward)

| Ceiling at 4× | Value | Today |
|---|---|---|
| Main-thread busy while idle | ≤ 330 ms per second | 251–261: held |
| Longest single task | ≤ 1200 ms | 582–929: held |

`bun run perf` prints both and exits 1 when a ceiling is broken. Once a target is met, its ceiling moves to the target in the same change.

### 4. Where the work goes
The engine's own tick is not the problem and has no separate budget beyond the tick's. Meeting the targets means the interface asking for less each second, inside ADR-0038's boundary (the engine computes, the interface asks):

- Compute a fight's projection when its inputs change (held methods, stats, Life to the whole point, the foe), not on every render; the engine may cache it by those inputs. This is the cheapest single win: it removes the double call per fight card and most of the spur pair's cost.
- Build a card's tooltip when it is shown (an open detail, a hover), not for every card on every tick.
- Run the runway probe off the tick's critical path (on idle, or less often), or answer it without simulating a day.
- Profile the unidentified 580–930 ms spikes before choosing a fix for them.

These are directions, not designs; each lands as its own change and is measured with `bun run perf`.

### 5. The meter
`scripts/perf.ts` (`bun run perf [throttle] [seconds]`, default 4× and 70 s) builds the game, imports the reference save, waits, then reads Chromium's `Performance.getMetrics` (task, script, layout and style time) and every long task from a `PerformanceObserver` over the window. It reports targets and ceilings; it is not part of `bun test`, `validate`, `smoke` or the deploy.

### Key Interfaces
- `bun run perf [throttle=4] [seconds=70]`; exit 1 on a broken ceiling.
- Constants in `scripts/perf.ts`: `TARGET_TICK_MS = 50`, `TARGET_LONGEST_MS = 200`, `TARGET_BUSY_MS_PER_S = 100`, `CEILING_BUSY_MS_PER_S = 330`, `CEILING_LONGEST_MS = 1200`.

### Implementation Guidelines
- A change that adds per-tick work to the interface or engine should be measured with `bun run perf`, and must not knowingly break a ceiling.
- New per-render work must be proportional to what is on screen and has changed, not to everything visible.
- The exact fight projection must stay exact; reduce how often it runs, not its precision. A new foe should be checked against the per-call projection budget.
- A ceiling may only move down (toward its target), never up, without amending this ADR.
- Enforcement: advisory. `bun run perf` reports and exits 1 on a broken ceiling, but nothing runs it automatically and no step requires it; per the project's rule on release gates, making it required would need its own justification.

## Alternatives Considered

### Alternative 1: Budgets only, no meter
- **Description**: State the numbers and leave measurement to whoever needs it.
- **Pros**: No new script.
- **Cons**: A budget nobody can re-measure the same way twice is not a budget; these numbers took a throttled browser, a fixed save and a fixed window to get.
- **Rejection Reason**: The meter is about 60 lines and makes the budget reproducible.

### Alternative 2: A required CI gate
- **Description**: Run `bun run perf` in the deploy workflow and block on a ceiling.
- **Pros**: Regressions caught automatically.
- **Cons**: A 70 s throttled browser run on shared CI hardware is noisy, and the deploy gates nothing else yet (ADR-0036); a gate needs its own justification.
- **Rejection Reason**: Not justified yet; revisit when the deploy gains tests and the meter's noise on CI is known.

### Alternative 3: Budgets at 1× on this machine
- **Description**: State budgets against the development machine as it is.
- **Pros**: Simplest; today's figures nearly meet a 50 ms tick.
- **Cons**: A top-end mobile CPU hides what most players will see; the 4× run shows every tick as a long task.
- **Rejection Reason**: The budget must describe the player's experience, not the author's.

## Consequences

### Positive
- The project has numbers to hold changes against, and a meter that reproduces them.
- The three costs that dominate are named, so optimisation starts in the right place.
- The exact win chance stays exact.

### Negative
- The game is over its targets today; this ADR records that rather than fixing it.
- The reference is a throttled emulation, not real hardware.
- Two targets (action latency, boot time) are not yet measured.

## Risks
- **Throttle is not hardware.** 4× CPU throttling slows script but not, for example, memory or GPU in the same proportion. Mitigation: calibrate once on a real mid-range laptop and adjust the throttle.
- **The reference save ages.** A later chapter adds records and screens, so the same budget gets harder. Mitigation: §1 moves the reference with each chapter; the ceilings make the change visible.
- **Noise.** One 70 s run varies; a single spike can break the longest-task ceiling. Mitigation: re-run before acting on a single breach; a later change could report a percentile.
- **The meter breaks with the UI.** It drives the settings import by `data-ui` hooks shared with the smoke test. Mitigation: `bun run smoke` exercises the same path.
- **The reference misses the running game.** With nothing running, the probe and a running activity's tick are unmeasured in the browser. Mitigation: the second scenario follow-up in §1.
- **Fixing the wrong spike.** The largest tasks have no identified cause. Mitigation: profile before fixing (§4).

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| Fights (`design/gdd/systems-index.md`; source implementation plan) | TR-fight-005: a cost budget for the exact projection and recompute | §2: a per-call budget for `fight()` (≤ 5 ms at 1× in Bun) and budgets for the tick, task length and idle busy time; §4: caching the projection as the first step |
| Time, tempo and the activity slot | TR-time-007 (covered by ADR-0036): the 1 s tick | §2 budgets that tick's cost |

No system GDD exists; the requirement IDs are those in `docs/architecture/tr-registry.yaml`.

## Performance Implications
- **CPU**: This ADR is the budget; the game exceeds its targets today.
- **Memory**: 12–19 MB JS heap and about 10,000–11,500 DOM nodes in the reference; no memory budget is set.
- **Load Time**: Target set, not yet measured.
- **Network**: None.

## Migration Plan
Ships `scripts/perf.ts` and the `perf` script in `package.json`. No game code changes; the §4 work follows in separate changes, each measured.

## Validation Criteria
- `bun run perf` at 4× reports the ceilings held (two runs on 29 October 2026: busy 261 and 251 ms/s, longest 929 and 582 ms).
- Each §4 change shows its effect in `bun run perf` and moves the matching ceiling toward its target.
- To add: action latency and boot time measurements in `scripts/perf.ts`; the running-game scenario (§1); a Bun check of `fight()` against the per-call budget for every foe in content.

## Related
- ADR-0026 §5 and ADR-0031 §4 (the exact projection), ADR-0035 (the save write), ADR-0036 (the 1 s tick and full render; the ungated deploy), ADR-0038 (the interface asks, the engine computes).
- `docs/architecture/architecture-review-2026-10-29.md` (Required ADR 5).
