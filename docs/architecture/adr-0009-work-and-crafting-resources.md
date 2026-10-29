ADR 0009: Paid work and crafting resources

Status: Seventh design checkpoint. The campaign role of paid work and the broad crafting resource model accepted; individual jobs, recipes, materials, and balance remain in design. Date: 16 October 2026. Basis: explicit answers Q50-Q51, building on Q42's focused crafting scope.

| Decision | Accepted direction |
|---|---|
| Paid work after the opening | Remain useful throughout. Repeatable paid work provides dependable earnings toward chosen purchases alongside rewards from expeditions. |
| Focused crafting costs | Currency and selected materials. Some preparations require materials with meaningful sources and uses, alongside ordinary currency costs. |
| Existing crafting scope | Make selected equipment and arrangements for exploration, home development, and trials. |

Work and crafting participate in the one-primary-activity structure and consume simulated activity time and lifespan. Goal-based work continues to stop at its chosen objective for the next player decision. The opening village errands remain part of the accepted first arc; later work roles still need design.

Design consequences: work offers a dependable alternative when the player wants to fund a particular purchase. Expedition rewards remain worthwhile alongside it. Selected materials should connect preparation to places, activities, or discoveries with understandable uses. Required preparation must preserve viable noncombat progression for every path, including necessary material sources or alternatives.

These decisions establish resource earning and spending roles. They do not select a separate career progression system, craft professions, a market simulation, passive production, material rarity tiers, or a particular number of currencies. Focused crafting remains the accepted scope.

Still open: individual jobs and how they become available, earnings and work durations, recipes and material sources, quantities, currency names and count, purchase and exchange opportunities, resource storage limits, and exact costs. Numeric balance needs playtesting against the lifespan budget, activity objectives, and the value of home and equipment improvements.

[ADR 0010](adr-0010-sects-and-relationships.md) records the subsequent social scope decisions; the brief tracks the current design frontier. See [ADR 0006](adr-0006-world-and-residence.md) for home and crafting scope, [ADR 0005](adr-0005-campaign-progression.md) for noncombat progression, and the [brief](../../design/BRIEF.md) for the full accepted direction.

## Status

Proposed

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 16 October 2026, as the status line at the top says.

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
| **Depends On** | ADR-0005, ADR-0006 |
| **Enables** | ADR-0029 |
| **Blocks** | None |
| **Ordering Note** | ADR-0022 (27 October amendment) replaces chapter one's sustained paid earners with instant chores and passive rates. ADR-0025 voids the lifespan cost of work. ADR-0029 settles the open recipe and material rows. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Resources, caps and derived-field recompute; Crafting, preparations and draughts in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
