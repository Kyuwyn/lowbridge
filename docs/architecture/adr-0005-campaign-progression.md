ADR 0005: Campaign progression and combat's role

Status: Third design checkpoint. Campaign size, broad breakthrough structure, trial outcomes, and trial setbacks accepted; detailed transformations and trial content remain in design. Date: 16 October 2026. Basis: explicit answers Q30-Q36.

| Decision | Accepted direction |
|---|---|
| Major breakthrough ladder | Eight major breakthroughs as the working target for the first complete campaign, including first foundation and final ascension, with six intermediate transformations. This develops the earlier six-or-more direction and supersedes the five-breakthrough proposal. |
| Breakthrough structure | A mix of prepared milestones and defining trials. Many breakthroughs follow from completed preparation; selected major transitions require choosing and carrying out a suitable approach. The first breakthrough retains its assured-success rule once ready. |
| Trial outcome | Preparation and choices determine the outcome. A suitable approach carried out successfully earns the breakthrough, with no separate random failure roll. |
| Unsuccessful trial with lifespan remaining | The setback is time and repeatable preparation. Retain established advancement and discoveries, and use what the attempt revealed to prepare another approach. |
| First path commitment | After opportunities to try introductory practices and before the second major breakthrough. The first substantial advancement beyond foundation expresses the chosen path. |
| Combat's necessity | Combat is one viable approach among several. It can be useful and rewarding, while major progression always has a viable noncombat route. |

These decisions retain the several-week campaign target, the first-foundation target of roughly the first day, the three-path roster, and the ending in ascension followed by an epilogue. Exact action durations and numeric age budgets have not been selected or validated.

Design consequences: the longer ladder needs distinct changes in capability and worthwhile decisions between breakthroughs. Adding stages must not simply duplicate the same preparation checklist. The chosen path has most of the campaign in which to develop, while the first foundation remains shared.

Noncombat viability must be checked through the full progression dependencies, including necessary knowledge, resources, longevity, and access. Requiring an indispensable reward that can only be earned by fighting would contradict the accepted direction. Each selected path needs a workable noncombat journey; retraining into a different path should not be a hidden requirement for avoiding combat. Optional combat may still have distinctive rewards and encounters.

An unsuccessful trial with lifespan remaining does not restore a checkpoint. If an undertaking exhausts lifespan, the existing exact-state retry rule applies instead. Repeatable preparation does not by itself require a consumable inventory or a separate recovery system. The trial outcome rule does not establish randomness rules for optional combat or other systems.

Subsequent Q69 fixes the third breakthrough as a prepared milestone: a deliberate attempt succeeds after chosen-class preparation and the selected common readiness milestones are complete. [ADR 0016](adr-0016-third-breakthrough-classes.md) records its class and milestone package. Q74 places the first defining trial at breakthrough 4. The player becomes ready for the intended class, then carries out an approach using capabilities available before advancement; success grants the breakthrough and new class. [ADR 0018](adr-0018-first-defining-trial.md) records this timing and its constraints. Exact trial content and placements beyond breakthrough 4 remain open.

The [campaign working design](../../design/CAMPAIGN-DRAFT.md) develops the accepted eight-breakthrough target and mixed structure with proposed stage functions. Q59 subsequently fixes the second breakthrough as a prepared milestone whose new capability is immediately used to cross into the ridge waystation; see [ADR 0012](adr-0012-second-breakthrough-arc.md). Detailed transformations, realm names, later trial placements and interactions, concrete preparation costs, detailed combat resolution and frequency, exact geography, and detailed pacing remain open. [ADR 0006](adr-0006-world-and-residence.md) establishes a few connected regions and one current residence. [ADR 0008](adr-0008-optional-combat.md) records preparation followed by automatic combat and ordinary combat setbacks. The noncombat progression rule applies to trials and ascension.

## Status

Accepted

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
| **Depends On** | ADR-0001, ADR-0003 |
| **Enables** | ADR-0008, ADR-0012, ADR-0016, ADR-0018 |
| **Blocks** | None |
| **Ordering Note** | ADR-0004, which this ADR cites, is superseded and is not a dependency. Later ADRs overtake some rows above: ADR-0025 removes "with lifespan remaining" and the exact-state retry, and makes this ADR's setback rule the only failure rule; ADR-0014 and then ADR-0030 replace the first path commitment and the three-path roster; ADR-0028 replaces "roughly the first day" for Foundation. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Breakthroughs, directions and titles, and Fights in `design/gdd/systems-index.md`; trace its rows to their requirements when those GDDs are written.
