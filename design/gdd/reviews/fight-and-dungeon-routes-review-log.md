# Review log: Fight and Dungeon Routes

## Review — 2026-11-21 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: L
Specialists: none (lean; one general-purpose reviewer in a fresh context, with spot checks by the coordinating session). CD-GDD-ALIGN passed during authoring.
Blocking items: 0 | Recommended: 2 (both applied before approval)
Summary: All 8 sections present. Pillar 2 holds: Ember Breath opens three hunts and Still Water opens the Still Deep's floors for the same three ingredients, so the method changes which routes exist (#7 W5). Pillar 4 holds: U1 makes a fight source the unforged cultivator cannot win a validator error, and a lost unit costs time only (#4 S4.2, N7.3), which settles the "baseline loses a hunt" case handed on from #7's review. route_price and premium_ok stay below 2^53 − 1 while a price is at most 4.5 × 10^11 ms (#6 S8's bound, line 510), and every divisor is a constant of at least 1. Registry values match: the six creature ids, PREMIUM_MAX_BP 8,000, FIRST_INGREDIENT_MS 300,000. On #8's real bills (60, 70 and 70 s), every recipe sits inside its band, so U3 and #6 B10 pass for all 12 pairs; B9 is 2.04 and 1.43, H5 margins 120 s and 280 s, and U5's first ingredient is the Pangolin Hunt at 240 s (X3).
Merge: merged with #8 at 196ead0; see `crafting-route-review-log.md` for the registry resolution.
Amendments reviewed in the same pass (A1 to approved GDDs, all still approvable):
- #4 Open Questions 5 and 6: route fights use the unforged cultivator (#6 G13.2, N3); no fight route has a by-product (U2).
- #5 Open Questions 2 and 4: U1 makes an unwinnable fight source an error; a lost unit costs time only.
- #6 A1: S9's stub minutes are superseded for B9 and #7 H5 by X3, seals untouched; Open Question 1's route half resolved.
- #7 Open Questions 2 and 3: resolved on #9's side, consistent with X3.
Prior verdict resolved: First review
Findings:
- [RECOMMENDED, applied] Wording made stale by the merge: lines 574, 731, 910, 1102–1104 and 1110–1111 said #8 was "on its branch" or "Done (on merge)". They now cite `crafting-route.md` L2 and L6 and read Approved or Done. The coordinating session first discarded lines 1102–1104 by mistake; the reviewer was right, and they are fixed.
- [RECOMMENDED, applied] Open Question 4(d), how #6 S7 counts a floor's gate ingredient: resolved by #6 amendment A2 on the designer's approval. S7 now takes the larger of a `reached(id, n)` atom's demand and the rest of that id's demand, as X3 already counted. X3's text now names the sum reading only as a note (Still Water 1.54 on 44 s bills, 1.53 on #8's); both pass.
- [Discarded] The reviewer's summary said an "A1 draft for per-chain atom pricing was withdrawn"; no such text is in this GDD or #6.
Still open, for #12: Open Question 4 (a)–(c), the exit status of "not evaluated", not inheriting the archived 180 s cap, and whether the unchecked content facts become checks.
Reviewed-Content-Hash: design/gdd/fight-and-dungeon-routes.md face07e942ff660313249e02ab261f7406efb471
Reviewed-Content-Hash: design/registry/entities.yaml 297932141e9bb94fc95475a17bd8d95617c1e612
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/crafting-route.md 6717a3ee4c960c4c6818f44481b1e9b4d1f78ad3
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md f51e2ffb091f585c12e92083257afff280100ac2
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md 4f46616596278495a0f6c4ae3b70018905914d00
Reviewed-Content-Hash: design/gdd/resources-and-caps.md a5dc7cd863ac6ac9a8676ec63f696f72a6a735eb
Reviewed-Content-Hash: design/gdd/activity-slot-rest-and-away-time.md 6c2abeeca4a1e490db6dd2ec93bd07a8a5554305
Reviewed-Content-Hash: design/gdd/combat-resolver.md 981d54a98b2c57051582a41fb52a22c7a07ccbb6
Reviewed-Content-Hash: design/gdd/forge-and-proving.md 4d4841ed8007bbe7bed85825d8e5d9f5b494717c
Reviewed-Content-Hash: design/gdd/methods.md 84168fa650e20080b150a7b3f5b2f17eecb95f27
Reviewed-Content-Hash: design/gdd/game-concept.md e29352a5020553afe841355ed38280e9f3ddec68
Reviewed-Content-Hash: design/gdd/systems-index.md 4f7b3a5929f2165b4e23d50676de79c4ab320222
