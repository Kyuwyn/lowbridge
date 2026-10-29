ADR 0028: A ten-minute Foundation, measured on honest play

Status: Accepted by owner decision; the bands are provisional and move with content. Date: 27 October 2026. Basis: the owner's pace decision after the design audits of 27 October 2026, DeepInit issues ISS-002 and ISS-003, [ADR 0022](adr-0022-chore-tempo.md) as amended the same day, and rules 17 and 24 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md).

**Context.** Three bounds were in force at once. Design plan Part E check 4 asked for a sustained-tempo Foundation within 45 minutes with Circulation open by 27; `bun run validate` enforced 720–1200 s with Circulation by 850 s on the direct routes; `scripts/routes.ts` exited above 2700 s; and the README promised "about fifteen active minutes" (ISS-003). The audits then showed that the direct routes reached their figures partly by sitting out Rest while the slot was free, and partly by over-training Circulation, so the 12–20 minute band measured the script rather than the opening.

**Decision.** Foundation takes **about ten minutes of honest play**: a route that keeps the activity slot busy, starts the next pursuit rather than waiting out Rest, trains only what the Foundation panel asks for, and stops when the panel is satisfied. The owner accepted that figure as it falls out of honest play; content is not tuned toward the older bands.

`bun run validate` enforces these bands:

| What | Band | Routes it binds |
|---|---|---|
| Foundation | 480–780 s (8–13 min) | the direct routes, the quickest sensible play |
| Foundation, wandering | at most 1200 s (20 min) | the preference routes, which wander and over-train |
| Circulation opens | by 600 s (10 min) | the direct routes, leaving a Settling sitting's room before the ceiling |
| Any outing, sitting or breakthrough | at most 180 s | every timed record |
| Foundation to the waystation | 720–1440 s (12–24 min) | every ridge route, from the channel and from the hollow |

On 27 October the direct routes measured 9.47 min (channel) and 10.73 min (hollow), with Circulation opening at about 355 s and 443 s, and every ridge route reached the waystation 15.9–20.2 minutes after Foundation (16.2–19.2 on the eight direct routes, after the Earth and Formation lines began tracing the bandit's cache). Those figures live in [`playtest/SIMULATION-REPORT.md`](../../playtest/SIMULATION-REPORT.md) and in `bun run validate`'s output; the bands above are the decision. `scripts/routes.ts` prints its routes and fails only when one cannot reach Foundation; it enforces no band of its own.

**Consequences.** One bound, in one place: the validator. The design plan, the README and PRODUCT.md say "about ten minutes" and point at the report for the measured figure. The route scripts must play honestly as described above, so a faster figure comes from content, not from a script that skips Rest. A sustained earner no longer exists in chapter one to measure ([ADR 0022](adr-0022-chore-tempo.md)), so the "sustained-only" slow edge the plan once asked for is not reported.

**Supersessions.** Supersedes design plan Part E check 4's 45-minute and 27-minute bounds and the bound line that opens Part C, the validator's 720–1200 s and 850 s bands, the ridge window of 900–2700 s, and the README's and PRODUCT.md's fifteen minutes. Does not change [ADR 0019](adr-0019-early-campaign-pacing.md)'s later-stage targets, which stay provisional and unmeasured.

Still open: whether ten minutes survives human play, and whether the ridge, at roughly sixteen to twenty minutes, wants the same honest-play review once later chapters exist.

## Status

Proposed

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 27 October 2026, as the status line at the top says.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Core |
| **Knowledge Risk** | N/A — no engine, so no `docs/engine-reference/` VERSION.md |
| **References Consulted** | None |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0019, ADR-0022 |
| **Enables** | ADR-0032 |
| **Blocks** | None |
| **Ordering Note** | None. ADR-0030 keeps the Foundation and ridge bands; the basin-road bands live in `design/CHAPTER-2-BASIN-ROAD.md`. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Pacing and route validation in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
