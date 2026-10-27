ADR 0029: Crafting: the workbench, recipes and preparations

Status: Accepted three-verb model, the `preparation` kind, the workbench as the source arrangement and the Craft tab; every bill, length and bonus remains provisional balance. Date: 27 October 2026. Basis: [ADR 0009](0009-work-and-crafting-resources.md) (focused crafting of selected equipment and arrangements, costing currency and selected materials, consuming activity time), [ADR 0006](0006-world-and-residence.md) (reusable equipment travels with the character), [ADR 0021](0021-compounding-vocabulary.md) (resources carry mods), design plan Part A rules 8, 9, 11 and 14, and rules 1, 5, 7, 8, 10, 19 and 31 of [`research/arcanum-reference/12-design-rules.md`](../../research/arcanum-reference/12-design-rules.md). Hundred Days offers no crafting evidence: [`research/hundred-days-reference/06-design-rules.md`](../../research/hundred-days-reference/06-design-rules.md) carries no item or recipe rule, so this decision rests on Arcanum alone.

**Context.** ADR 0009 accepted crafting as the thing ridge materials are for, and then the ridge chapter shipped with `recipe` in the vocabulary and nothing authored under it. Marrow herbs, whetstone grit, veined ore and inked tokens were spent on the First Direction bill or traded for ten coin, and nothing a player made ever stayed with them. Three reference rules name what was missing.

- Rule 5: **resources can carry mods**, *copy*. A held book raises a cap while held; inventory is a build.
- Rule 7: **repetition curves**, *copy*. A thing made for the fifth time is made faster.
- Rule 31: **learn / memorize / cast are three verbs**, *copy*. Lowbridge already separates a method's verbs ([ADR 0023](0023-techniques-and-attunement.md)); crafting needed the same separation between making a thing, keeping it, and using it up.

**Decision.** Crafting has three verbs, carried by three kinds of record.

| Verb | What carries it | What it costs |
|---|---|---|
| **Make** | A `recipe`: timed, so it holds the activity slot while it runs (Part A rule 9); its `need` begins with the workbench; a bill in materials and coin; it stops at a `max` of one (kit) or when the store it `fill`s is full (doses) | materials, coin and activity time |
| **Keep** | A `resource` in the group *Preparations*: a kit piece is a 1/1 store carrying a `mod` that stands while it is held (rule 5, Part A rule 14); a dose store holds up to three | nothing; it is listed in the ledger under Preparations |
| **Take** | A `preparation`: instant, so it never touches the slot (Part A rule 9); it spends one dose and pays a body store on the click | one dose |

**The workbench is the source.** Rule 10's entry is gated by a home arrangement, and rule 19 puts kept things in competition for floor; the bench is an arrangement of one span that the Lean-to no longer has once the stones, the strongbox and a line's furniture are in, so it is a reason to buy the cottage the coffer already promises. It arrives after Foundation, raises the timber cap by two, and gates every recipe through `need`, so the Craft tab appears as a whole section behind one requirement (rule 8) and each recipe says in words what it still wants (Part A rule 11).

**What the bench makes in this slice.** One piece per line, bought with the line's own material at a bill equal to one trade, so making a piece is the trade's rival use: a walking staff (timber; Strain draws a fifth less), a honed edge (whetstone grit; Strike +2), weighted stakes (veined ore; Guard +1, Strain cap +2) and a warding strip (inked tokens; Dodge +10). Two doses: a herb poultice (herbs; five Vigor on the instant) and a marrow tonic (marrow herbs; four Life and two Strain). Dose recipes carry an `at` threshold at the fifth make (rule 7). Fights read Strike, Guard and Dodge at entry ([ADR 0026](0026-combat-exchanges.md)), so kit is what a player brings to the bandit; Life is read live, so the tonic is what they drink between attempts.

**Grammar.** `recipe` leaves the one-shot kinds: a recipe must carry a `length` in seconds, and must stop either at a `max` or by `fill`. A `preparation` must have no `length` and must have a `cost`. The validator refuses anything else, and its coverage route (`ridge-workbench`) makes every piece and takes every dose from a cold start.

**Divergence from a *copy* rule, with reason.** Rule 6 gives equipment exclusive slots: one record per hand, swap to change. Kit here has no slots. Reason: in this slice a history reaches at most the pieces its teachings allow, and no two of them want the same body part, so a slot would be a rule with nothing to decide. When a second piece for the same hand exists, the mechanism to reach for is the one the opening already uses for the channel's and the hollow's readings: `lock` plus `warn` ([ADR 0023](0023-techniques-and-attunement.md)), not a slot system.

**Consequences.** The interface gains a Craft tab, shown once the first recipe is visible, with the bench's recipes and the preparations taken from them, and a Preparations section in the ledger that shows what is kept and what each piece does. A made kit piece moves to the Craft tab's Done group; a dose recipe stays until its store is full and says so. Saves do not change: new kinds are not serialized, kit and doses are ordinary stores, and the save version stays six. The ridge pacing windows are unchanged because the bench comes after the waystation on every measured route.

**Supersessions.** Settles the open part of [ADR 0009](0009-work-and-crafting-resources.md): recipes exist, materials have a kept use, and a recipe is timed work at a bench rather than a purchase. Adds `preparation` to the kinds in design plan Part D. Does not change [ADR 0022](0022-chore-tempo.md): chores stay instant; a recipe is timed because the bench is a place you stand at, not a click.

Still open: a Craft knowledge or family that the fifth make could train; Alchemy's Refining line and Essence for B3 and later; whether made pieces can be sold; whether a lost fight should spend a kit piece; and the balance of every bonus, in particular whether Strike +2 trivialises the ridge bandit at Circulation 3 to 5.
