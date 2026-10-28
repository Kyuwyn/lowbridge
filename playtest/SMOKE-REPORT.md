# Lowbridge first playable: 18 October 2026

This records the original first-playable baseline. The subsequent [UI and action revision](UI-REVISION-2026-10-18.md) contains the current interface checks and test totals; browser screenshots and `smoke-results.json` are refreshed by the latest smoke run.

The first slice runs from the Lowbridge hayloft through Foundation. The local preview is [http://127.0.0.1:4173](http://127.0.0.1:4173). Restart with `bun run dev` from the project root if the preview is no longer running.

## What runs

The production browser bundle uses the same 41 JSON records, restricted expression evaluator and one-second TypeScript engine as the validator. It includes the two opening investigations, capped resources, practice runways and level benefits, home space and purchases, repetition curves, one chosen activity/objective, meaningful discovery stops, age/lifespan, unused-time bank and objective acceleration, Foundation checkpoint/retry, IndexedDB saves with backup, and JSON import/export. The interface uses native DOM controls in resource/activity/journal panels.

Foundation is the stopping point. Cottage, Old Ridge and the four teachings are visible future leads. No playable classes, waystation or later line modules were added.

## Browser measurements

Chromium **156.0.8078.4**, Playwright **1.64.1**. Both routes were driven through production UI controls in isolated browser contexts, with the browser clock advancing every normal timer tick. No injected game-state shortcuts or production debug controls were used for the route playthroughs.

| Route | Ordinary activity to Foundation | Historical Python approximation | Difference | Actual test execution wall time | UI actions |
|---|---:|---:|---:|---:|---:|
| Channel | **38m 50s** | 31m 20s | +7m 30s | 13.28s | 40 |
| Hollow | **40m 20s** | 30m 50s | +9m 30s | 12.48s | 28 |
| Basin (27 October, `basin` report) | a Second Direction fixture from the pill route (`second-direction.json`): the stage label, the Pill Refiner title, the Focus meter, the hobby line with Stop, a settling draught in effect, the Commissions group; then the terrace walked under the fake clock to Reedmarket, the scene moving with it | — | — | — | `basin-techniques-desktop.png`, `basin-reedmarket-desktop.png`, `basin-reedmarket-mobile.png` |

The short test wall times come from Playwright's virtual clock. They are not ordinary-speed play durations. Both routes start with an empty bank, spend no bank, finish with Circulation 2 and Lore 3, receive lifespan 85 and a six-hour bank capacity, and pause at Foundation. Qi Sense finishes at 4 on channel and 5 on hollow. The browser result matches the engine simulation exactly.

The deviation from C.5 is real: channel's Circulation opens at 34m50s and hollow's at 35m20s, later than the proposed 14-27-minute route phase. The historical Python model treated several practice actions as a whole level and overstated hollow-sit experience. Exact `60 × next level` costs account for the measured difference; no durations were tuned to conceal it. The route preference ordering also makes channel study Lore before practising breath, shifting its first Qi Sense event to 11m20s. See [the detailed comparison and complete unlock order](SIMULATION-REPORT.md).

There were **three channel** and **two hollow** cap lines with no discovered raiser:

- Channel, 16m20s: Qi 5/5; 22m20s: Qi Sense 4/4 and Qi 6/6.
- Hollow, 10m20s: Qi 5/5; 29m20s: Qi 7/7.

Each said “Further ways to raise this cap have not been discovered.” Their exact full lines are preserved in the simulation report. They remain playtest observations rather than being hidden by a silent fallback.

## Verification

- `bun run typecheck`: pass.
- `bun test`: **36 passed, 0 failed**, 266 assertions.
- `bun run validate`: **41/41 records** reached across four real cold-start histories. Includes optional mat, rack, Lean-to and strongbox; requires separate furniture histories because all arrangements do not fit one opening home. Their 72.33/61.58-minute completion times test optional-content coverage, not the two-route ≤45-minute target.
- Original Python opening validator: pass; `--real-json` also reports the measured difference without replacing the baseline.
- B4 design validator: all **15 histories** pass. This is design-lattice evidence, not an implemented B4 campaign.
- `bun run build` and `bun run smoke`: pass. No browser page errors.
- Browser checks: both complete routes; Foundation reload; a tab closed with partial work then reopened after 90 seconds away; objective stop and unused time banked exactly once; exhausted bank leaves unfinished work running; focused objective input survives ticks; malformed import preserves the game; valid import does not claim export age; downloaded export loads; a second tab cannot concurrently run the save; backward/forward system-clock correction neither freezes activity nor duplicates time.
- Layout at **1440, 768 and 390 pixels**: no horizontal overflow. Desktop and mobile screenshots are in this folder; the desktop opening was visually inspected.
- Frozen review package: **49 original files checked, no content changes**.

## Corrections and clarifications made

All content-rule changes are also recorded in design v2 §0.

1. **Mat/refill softlock fixed.** At the initial Qi Sense wall the mat could leave qi at 4/5. Breath practice can now fill qi while knowledge is capped, without accumulating surplus family experience.
2. **Route reward requires actual practice.** Faint trace needs Circulation ≥2 and a level earned through steady attention; starting then abandoning the exercise cannot earn it through the other route.
3. **Lore capacity corrected in prose.** Foundation adds +2: cap 5 normally, 6 after Shu's reading. The reward was not changed.
4. **Ambiguous table semantics made explicit.** Part C governs opening bonuses; full qi is a threshold while ten herbs are spent at Settling's start; the channel's 50% rate applies to its exercise; repetition upgrades affect subsequent runs. Later B.1 systems remain deferred.
5. **Recovery fixes.** Invalid/zero-duration imported activities are rejected, a fractional tick cannot be replayed by checkpoint retries, and the open-visit clock uses monotonic time. Elapsed time while the tab is closed uses the saved wall-clock timestamp.

No combat, morality, extra task slot, currency, or new progression system was introduced. The runtime has no third-party dependencies; TypeScript and Playwright are development tools.

## Playtest kit and next decisions

- [One-page playtest sheet](PLAYTEST-SHEET.md)
- [Fresh start, empty bank](fresh-start.json)
- [Channel Foundation save](channel-only-foundation.json)
- [Hollow Foundation save](hollow-only-foundation.json)
- [Machine-readable browser results](smoke-results.json)
- [Desktop opening](opening-desktop.png), [channel Foundation](channel-only-foundation.png), [hollow Foundation](hollow-only-foundation.png), [390px layout](foundation-mobile.png)

The next decision should follow a human playthrough: whether the measured 39-40-minute opening feels right or needs shortening. The next two questions are whether the two routes feel meaningfully distinct and whether the unknown-raiser lines provide enough context. The sheet preserves all five ranked Part E questions.

Limits: this was scripted Chromium validation, not a human pacing assessment or cross-browser certification. Open-tab system-suspend timing depends on the browser/OS monotonic clock; closing and reopening the tab uses the tested away-time path. No pacing changes or further campaign implementation were inferred from script timing alone.
