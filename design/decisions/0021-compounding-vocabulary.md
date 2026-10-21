ADR 0021: Compounding vocabulary

Status: Accepted record vocabulary: the derived/authoritative split, the four contribution sources and their scales, and `X.mod.Y` patching. Every first-slice magnitude remains provisional balance. Date: 20 October 2026. Basis: the prior-review complaints recorded in the design-intent report §3.1, §3.3 and §3.5, and rules 1, 3, 4, 5, 7, 9 and 16 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md).

**Context.** The heaviest complaint against the original package was that "the design kept Arcanum's shape and lost its machine", and more sharply that there was "nothing to climb between breakthroughs" (§3.1). The reading complaint beneath it was that "every cap is just a boolean quest flag disguised as an integer" (§3.3), and the class complaint reduced a whole class to "teaching → demonstration → one application → stop" (§3.5). Design plan Part A rule 1 and [ADR 0020](0020-knowledge-woven-into-systems.md) answered the first two *inside* one chapter: a family has an entry, a 3-5 level runway on which every level pays, milestones at stated levels, and a wall that only an outside record moves. Nothing yet said what happens to an early family when a later chapter arrives. Without an answer, chapter two can only add new families beside the old ones, which is the flatness the reviewers named.

The reference answers it with one idiom, and page 12 says so in advance: mod patching and resource mods "are the mechanism behind 'specialists feel deep' and 'books matter'. Any adaptation that copies skills and classes without these two idioms will feel flat after the first stage."

- Rule 4: **mod patching (`X.mod.Y`)**, *copy*. "Late content multiplies what early content pays per level"; 229 of 596 upgrades and the whole Education ladder work this way, so content compounds instead of being replaced.
- Rule 5: **resources can carry mods**, *copy*. Held things raise caps and rates while held; inventory is a build.
- Rule 9: **delta save keyed by stable ids; recompute everything derivable**, *copy*.
- Rule 1: **one record vocabulary for everything**, *copy*. The UI renders by field, never by type.
- Rule 3: **expressions in data**, *copy*. Rule 7: **repetition curves (`at` / `every`)**, *copy*. Rule 16: **education rungs** turn investment into larger per-level payouts, *copy*.

**Decision.** Six fields are **derived** and six only: `max`, `rate`, `open`, `length`, `yield`, `discount`. Nothing but `recompute` may write them. Everything else a stat holds (`value`, `exp`, `reps`, `ticks`, `started`, `paid`) is the authoritative record of what the character has done, and it alone is saved. `recompute` rebuilds all six from content plus that history after every mutation and on load (rule 9).

A derived field is the sum of its baseline and every contribution currently being paid. There are four sources, each with its own scale.

| Source | Written on | Scale it pays at |
|---|---|---|
| `mod` | any record | ×1 while the record is owned |
| `mod` | a **resource** record | × the number of units currently held (rule 5) |
| `perLevel` | a family | × the family's current level count |
| `at` / `every` | any record | ×1 per threshold passed, × the number of whole periods completed (rule 7) |

**`X.mod.Y` is the patch.** A modifier path whose *second* segment is `mod`, such as `scrolls.mod.lore.rate` (read "Scrolls ➢ Lore rate"), is not a contribution to `scrolls`. It is a contribution to **what record X itself pays toward Y**, folded into X's own payout table *before* X pays it, and then multiplied by X's own payout scale: a family's levels, a resource's units held, or one if it is simply owned. A patch therefore reaches every level and every unit X already has. A late upgrade raises what early levels gave, retroactively and without a migration. That is the purpose of patching: on a 3-5 level runway the player meets the patch already standing at the wall.

Contributions are additive sums; there is no multiplier form. `open` is true if its baseline is true or any contribution is positive, `length` floors at one second, the rest floor at zero, and `discount` still stops at half the listed amount ([ADR 0020](0020-knowledge-woven-into-systems.md), `MAX_DISCOUNT`). Because occupancy counts (floor spans used, attunement slots filled) are themselves values that other modifiers scale with, `recompute` sweeps to a fixed point rather than once, bounded so that a content cycle fails loudly instead of hanging.

**Two authoring obligations.** Every family level pays at least one listed effect (a cap, a rate, a yield, a discount or an unlocked record), so no level is a boolean in integer clothing (§3.3). Every chapter after the first patches at least one earlier chapter's payout, so an early family keeps growing in value while the player climbs past it (§3.1, §3.5).

**Divergences from *copy* rules, with reasons.**

- Rule 4 is copied in its path syntax and diverged from in its reach: a Lowbridge patch is folded in before the payout and so repays levels already earned, where the reference applies its multipliers to what comes after. Reason: Lowbridge's runways are 3-5 levels against the reference's longer ladders, so a forward-only patch bought at the wall would be a purchase that pays nothing.
- Rule 16 puts a rung every five skill levels. Lowbridge puts rungs at content-named milestone levels instead ([ADR 0020](0020-knowledge-woven-into-systems.md)). Reason: a fixed five-level cadence needs the reference's longer ladders; on a 3-level runway it would be one rung or none.

**Consequences.** The validator gains three checks: every modifier and patch path names a record that exists; every family has at least one per-level effect; every chapter beyond the first patches something earlier. A tooltip shows a derived value together with what contributes to it, which is the same obligation design plan Part A rule 11 already puts on cap raisers. Because only authoritative history is saved, retuning a number or adding a patch takes effect on an existing save with no migration. The save shape itself is v6, described in [ADR 0025](0025-lifespan-and-checkpoints-cut.md).

**Supersessions.** Extends [ADR 0020](0020-knowledge-woven-into-systems.md) with patching; its per-level, milestone and discount rules are unchanged. Amends design plan Part A rule 1 (a runway's payouts are themselves patchable) and Part D's record grammar. Does not reverse [ADR 0013](0013-knowledge-and-practice.md): there is still no generic knowledge currency and no universal activity formula, only contributions on named paths.

Still open: the magnitude of any patch, the chapter at which the first patch should arrive, and whether a patch deserves a log line separate from the cap-raiser line.
