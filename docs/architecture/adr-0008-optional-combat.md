ADR 0008: Optional combat control and ordinary setbacks

Status: Sixth design checkpoint. Broad combat control and ordinary setback accepted; detailed mechanics and encounters remain in design. Date: 16 October 2026. Basis: explicit answers Q48-Q49, alongside Q32's noncombat progression rule.

| Decision | Accepted direction |
|---|---|
| Player control | Prepare, then resolve automatically. Choose equipment, techniques, and an approach; the encounter proceeds without directing every exchange. |
| Ordinary unsuccessful combat with lifespan remaining | Lose time and used preparation. Keep established advancement and discoveries, and adjust preparation before trying again. |
| Progression role | Combat remains one useful and rewarding approach among several. Every major progression requirement has a viable noncombat route for each chosen path. |

Combat fits the existing one-primary-activity structure. Its ordinary unsuccessful attempts do not trigger a checkpoint restore. If an undertaking exhausts lifespan, the usual retry restores character and world state from the relevant checkpoint while retaining the current time bank.

Design consequences: equipment, techniques, and the chosen approach need understandable effects on encounters. The result should provide enough information to assess preparation for another attempt. Ordinary defeat costs remain time and preparation actually used; no additional lasting injury or equipment-damage penalty is selected by this decision. Which preparations can be consumed remains a content decision.

Automatic resolution does not by itself decide randomness, damage formulas, combat rounds, a health or qi resource model, retreat controls, or automatic repeat encounters. These require later design as needed. The first arc retains its emphasis on investigation and practical obstacles. Optional fights cannot hide a required resource, technique, lifespan reward, or access condition behind mandatory combat.

Still open: detailed resolution, encounter frequency and variety, equipment and technique choices, available approaches, visibility of threats and outcomes, retreat behavior, rewards, and exact time and preparation costs. The later-trial rule forbidding a separate random breakthrough-failure roll remains distinct from unresolved combat-resolution details.

[ADR 0009](adr-0009-work-and-crafting-resources.md) records the subsequent economic scope decisions. The [brief](../../design/BRIEF.md) tracks the current design frontier. See [ADR 0005](adr-0005-campaign-progression.md) for combat's role in the campaign, [ADR 0002](adr-0002-lifespan-and-retries.md) for lifespan and retries, and [ADR 0007](adr-0007-away-time-and-acceleration.md) for the time bank.

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
| **Depends On** | ADR-0005, ADR-0006, ADR-0007 |
| **Enables** | ADR-0012, ADR-0014, ADR-0016, ADR-0017, ADR-0018, ADR-0025, ADR-0026 |
| **Blocks** | None |
| **Ordering Note** | ADR-0026 settles the resolution left open here (swings on Speed clocks, an exact win chance, Life). ADR-0025 removes "with lifespan remaining" and the checkpoint restore and makes this setback rule the only failure rule. ADR-0031 adds foe techniques. Cited but not listed as dependencies (superseded, or written later): ADR-0002. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Fights in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
