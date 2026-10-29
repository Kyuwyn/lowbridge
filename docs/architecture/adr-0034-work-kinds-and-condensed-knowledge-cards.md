ADR 0034: Work kinds and condensed knowledge cards

Status: Accepted. Date: 28 October 2026. Basis: the owner's review of the Character tab (Lore's card ran to seven Modifies lines and Circulation's to eleven, one per action named); [ADR 0020](adr-0020-knowledge-woven-into-systems.md) (what a knowledge may give per level), [ADR 0021](adr-0021-compounding-vocabulary.md) (the derived fields and `X.mod.Y`), [ADR 0013](adr-0013-knowledge-and-practice.md) (no universal activity formula); rules 1, 4 and 33 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md) and the vocabulary in [`03-data-model.md`](../../research/arcanum-reference/03-data-model.md).

**Context.** A knowledge's `perLevel` names each action it improves by id, and the tooltip printed one Modifies line per path. ADR 0020 asks every knowledge to reach every system of its subject, so each chapter added a line per new target to an earlier knowledge's card: Lore listed the slip, the inscription, the layout and four porter's notes separately, all at the same 5%. Lines for targets the player had finished, or had not yet found, sat beside the live ones. On the action's side, "Completion rate: 125%" did not say where the 25% came from.

**Decision.**

1. **A `work` record kind and a `work` field.** A work kind is an ordinary record carrying only `id`, `kind`, `name` and `desc`; it has no gate, cost, payout or history of its own. An action lists the kinds it counts as in `work: string[]`. Only actions may carry the field.
2. **Modifiers reach a kind through its members.** A modifier may write only a kind's `rate`, `yield` or `discount` (`WORK_FIELDS`), directly or through an `X.mod.Y` patch, and `recompute` pays the kind's total to every member after patches are folded in. Anything else on a kind (`max`, `length`, a value, a spend, a patch owned by the kind) is a validation error, as is a kind with no members or one no modifier names. Kinds may span chapters.
3. **Knowledge cards group per-level lines by effect**, in this order: Max, Return (a store's rate), Combat (a Combat-group cap), Speed, Yield, Cost, Experience. Several targets paying the same amount share it ("Max +2 per level: Vigor, Marrow herbs, Life"); otherwise each target keeps its own amount ("Speed per level: Copy and compare the slip +10%, Reading work +5%"). A patched amount still names its source.
4. **Lines on finished or closed targets are dropped, and undiscovered targets collapse into one count line** ("And 2 more effects on things not yet found"). A target is finished when it is locked, or is a one-time purchase, outing, standing, teaching, recipe or breakthrough at its limit (`GameEngine.finished`, which the Done groups now use too). A kind is finished when every member is; it is shown while any member is seen and unfinished. Milestones (`at`) follow the same rule.
5. **Actions name their sources.** "Completion rate: 125% (from Lore 5)" and "−25% cost (from Lore 5)" list what pays into the action, through its kinds included, by name only: an `X.mod.Y` patch into a knowledge's payout raises the amount but is not itemised, so a printed share could understate. The type block reads "Counts as Reading work".

Four kinds replace today's repeated targets with identical numbers: Reading work (the inscription and the fixed layout, Lore +5% speed per level), Porter's notes (the four ridge teachings, Lore −5% cost per level), Qi watching (the channel, Fernhollow and the dusk sitting, Qi Sense +5% speed per level) and Draught-making (the settling and marrow draughts, Refining +10% speed per level). Single targets and targets with their own amount stay direct: the slip's +10%, the First Direction, the crossings, Settling, the stonework sites, the survey marker and every milestone.

**Rules.**

- Rule 1 (*copy*), one record vocabulary: a kind is a record like any other, read by the same paths. The UI renders it nowhere as an action (`notActions`) and the route runner treats it as passive.
- Rule 4 (*copy*): `X.mod.Y` reaches a kind's rate, yield and discount like any other target's, and the kind passes the patched amount on.
- Rule 33 (*copy the schema*): the tooltip schema and block order are unchanged; only the contents of the Modifies block on a knowledge are condensed, and the rate and type blocks gain their source and kind lines.

**Relation to ADR 0013.** This is not a universal activity formula. Nothing derives membership from an action's group, kind or name, and no knowledge reaches a kind unless content says so; each knowledge names its kinds and its amount, and each action names its kinds.

**Amendment to ADR 0020.** ADR 0020 allows per-level speed, output and discounts only on the knowledge's own chapter's actions, which that chapter's content bounds. A kind whose members all sit in one chapter is such a target and may take per-level effects. A kind with members in more than one chapter is open-ended in the same way as a resource, so it takes only effects that stop growing: `mod`, `held` and `at`. `perLevel`, `every` and a patch into a knowledge's payout are refused on it by `validateWorkKinds` in `scripts/validate.ts`. Today's four kinds each sit in one chapter (`reading`'s members are both ridge sites).

**Consequences.** No save change: work kinds have no history worth saving, derived fields are never saved, and a new id loads fresh. `bun run validate` timings are identical to the figures before the change; reachability counts the four kinds (223/223). Adding a target to a kind is now one `work` entry on the action, with no new line on the knowledge's card.

Still open: whether later chapters' knowledges should be migrated to kinds as they are written, and whether the Character tab should offer the full per-target list on demand.

## Status

Proposed

## Date

2026-10-29. This records the retrofit that added the template sections; the decision itself dates from 28 October 2026, as the status line at the top says.

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
| **Depends On** | ADR-0013, ADR-0020, ADR-0021 |
| **Enables** | None |
| **Blocks** | None |
| **Ordering Note** | None. It amends ADR-0020 for kinds whose members span more than one chapter. It adds the `work` record kind, so it is not UI-only. |

## GDD Requirements Addressed

No system GDD exists yet. This ADR governs Practice and knowledge; Content grammar and expressions; Interface in `design/gdd/systems-index.md`; trace its rules to their requirements when those GDDs are written.
