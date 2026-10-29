ADR 0027: Locks at payment, confirmations that name what closes, and stops

Status: Accepted. Date: 27 October 2026. Basis: the design audits of 27 October 2026 (failure-loop, fairness-frustration and Zeigarnik reports), DeepInit issue ISS-001, [ADR 0007](adr-0007-away-time-and-acceleration.md), [ADR 0022](adr-0022-chore-tempo.md), [ADR 0023](adr-0023-techniques-and-attunement.md), and rules 2, 15, 38 and 74 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md).

**Context.** Three rules the build follows had no decision behind them. A timed record's `lock` (a First Direction closing its rivals, hauling closing the mill) applied only when the run completed, so a player could pay for two rival directions, start both, and lose one bill without warning when the other finished. The confirmation before a closing step was generated text that sometimes repeated the content's own warning, and disappeared or stayed on rules nobody had written down. And the design plan, ADR 0007 and the README still said a discovery can pause an activity, while the engine never pauses for one and the validator rejects `pause` on events (ISS-001).

**Decision.**

1. **A lock applies when its bill is paid.** An instant record pays and completes in the same click, so nothing changes for it. A timed record applies its `lock` on its first paid start, not on completion: from that moment the rivals it closes are gone. Every waiting-list entry the lock removes is logged by name, with "What it cost is not returned." when that entry had been paid, and any attuned method a lock releases is logged too. A technique's lock still applies when it is attuned (ADR 0023), which is its commitment.

2. **The confirmation names what closes, and only while something still would.** Any record whose `lock` names a record that is not yet closed asks first, even when the record it closes has not been seen. When the content carries `warn`, that text is the whole warning, so a `warn` must name what it closes; otherwise the engine writes "This closes …". Once nothing it locks remains open, the record no longer asks, and its tooltip's "Closes …" line goes with it. A commitment's dialog also says what the step brings: the stats a method holds while attuned and the route keys it carries. Such a record never wears a **Next** mark, so the interface does not point the player at a door that closes others.

3. **Taking a furnishing down asks too.** The take-down confirmation says the cost is not returned and names any attuned method that the lost places would release ("Taking down the Practice mat leaves room for one method; Carry the current would be released."). Commitments use the calm confirm style; take-down, import and a new journey use the danger style with verbs on the buttons ("Take down", "Replace", "Begin again").

4. **Discoveries never stop an activity.** A discovery, an event or a newly visible record is logged and marked **New**; it never pauses the slot, at the desk or away. An activity stops at its objective, when what it fills is full, when it can no longer pay its drain, when a lock or a lost place removes it, or when the player stops it. A stopped slot takes the next startable entry on the waiting list, then Rest, and only time with nothing to run goes to the bank. The validator rejects `pause` on events, and the removed `pauseOnReveal` and `pauseOnComplete` fields are named when found.

**Consequences.** A timed rival can no longer be paid for and silently lost. Content authors must write `warn` text that names the closed records. The engine exposes `warnText` and `removeWarning` for the interface, which holds no rule of its own. Away time is the slot, then the waiting list, then the bank, with no discovery boundary between them.

**Supersessions.** Amends [ADR 0007](adr-0007-away-time-and-acceleration.md): its rows "Unused away time after a stop", "Delivery" and "Spending instruction" stop at an objective or another stop listed in point 4, never at a discovery, and an expedition does not pause when a discovery appears. Amends the [implementation plan](../../design/IMPLEMENTATION-PLAN-2026-10-18.md)'s away-time sentence the same way. Keeps ADR 0023's lock on attunement and rule 38's *beat* (consequences stated before commitment).

Still open: whether a later chapter wants a real decision pause, authored as a stop the player is told about rather than a discovery.

**Amendment, 28 October 2026 ([ADR 0033](adr-0033-home-lists-place-swaps-quick-bar.md)).** Point 3 now covers floor pieces only: a piece that fills a place is swapped, never taken down, and the piece it replaces is kept. A swap asks first, in the same words, only when the piece stepping aside holds an attunement place that a method needs.

## Status

Proposed

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 27 October 2026, amended 28 October 2026, as the status line at the top says.

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
| **Depends On** | ADR-0007, ADR-0022, ADR-0023 |
| **Enables** | ADR-0032, ADR-0033 |
| **Blocks** | None |
| **Ordering Note** | ADR-0033 narrows point 3: the take-down confirmation covers floor pieces only, and a piece that fills a place is swapped and kept. Points 1, 2 and 4 stand. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Time, tempo and the activity slot; Interface in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
