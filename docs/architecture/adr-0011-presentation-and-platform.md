ADR 0011: Text-led presentation and desktop-first browser release

Status: Ninth design checkpoint. Presentation emphasis and first release platform accepted. Date: 16 October 2026. Basis: explicit answers Q54-Q55.

| Decision | Accepted direction |
|---|---|
| What carries the experience on screen | Text and activity panels. Descriptions, discoveries, choices, and progression take center stage, supported by atmospheric art. |
| First release platform | Browser, desktop first. Prioritize the experience on larger screens, with phone support as a secondary target. |

The interface needs to make the current activity, its objective, available leads, and the consequences of discoveries understandable. These are design consequences of the accepted activity and investigation rules; the panel layout and exact information hierarchy remain to be designed.

Browser is the product target. This decision does not select a framework, rendering technology, source reuse strategy, hosting service, or installation model. Desktop priority does not settle the exact extent of phone support or authorize unreadable controls on smaller screens.

Still open: visual direction, typography, panel layout, illustrations and asset budget, responsive behavior, accessibility details, and implementation approach.

The [campaign outline](../../design/CAMPAIGN-OUTLINE.md) consolidates the accepted scope and distinguishes it from proposed stage functions and development sequencing. The [brief](../../design/BRIEF.md) retains the fuller summary and decision references.

## Status

Accepted

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 16 October 2026, as the status line at the top says.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | UI |
| **Layer** | Presentation |
| **Knowledge Risk** | N/A — no engine, so no `docs/engine-reference/` VERSION.md |
| **References Consulted** | None |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0001 |
| **Enables** | None |
| **Blocks** | None |
| **Ordering Note** | None. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Interface in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
