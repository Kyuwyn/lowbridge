# Review log: Crafting Route

## Review — 2026-11-21 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: L
Specialists: none (lean; one general-purpose reviewer in a fresh context, with spot checks by the coordinating session). CD-GDD-ALIGN passed during authoring (re-run on the re-tune to #9's premium).
Blocking items: 0 | Recommended: 2 (both applied before approval)
Summary: All 8 sections present. Pillar 4 holds: fourteen hearth sources give every ingredient a road with no fight under both methods (X5; the best four take 27.3 or 31.3 minutes, all six 55.5). Pillar 2 is carried by #9's routes, and the hearth stays method-neutral as #7 W3 requires (#7 H1, AC-C-2). Formulas E1–E3 do not overflow (E3's f × 10,000 is at most 1.3 × 10^10) and every division goes through ceil_div with a guarded divisor. Registry values match: RUN_FLOOR_MS 30,000, PREMIUM_MAX_BP 8,000 and FIRST_INGREDIENT_MS 300,000 (the last two owned by #9). Joint with #9: every recipe sits inside #9's band, so U3 and #6 B10 pass for all 12 pairs, and B9 and #7 H5 pass under both methods (L6.4).
Merge: merged with #9 at 196ead0. The registry conflicts were `referenced_by` lists and two appended blocks, resolved by keeping both sides; 120 entries, validate clean. `referenced_by` now records #8's use of #9's route_price, premium_max_bp and first_ingredient_ms.
Amendments reviewed in the same pass (notes on approved GDDs, all still approvable):
- #3 Open Question 6: #8's half resolved (recipes fit K1; L2).
- #4 Open Question 1 (the 30 s run floor, X1) and Open Question 6 (recipe half of the by-product rule, X6): consistent with this GDD.
- #6 Open Question 1, crafting half, and #7 Open Question 3, crafting half: consistent with L6. #6's note now reads B9 ratios 2.04 and 1.43 after A2.
Prior verdict resolved: First review
Findings:
- [RECOMMENDED, applied] Dependencies, line 852: "Designed, on its own branch" for #9 was stale after the merge; it now reads Approved.
- [RECOMMENDED, applied; raised with #9's Open Question 4(d)] #6 S7 added a floor's `reached(id, n)` demand to the makeup's demand for the same ingredient, so a gate ingredient was made twice. `reached` reads the high-water mark (#1 R5), so one unit meets both. On the designer's approval, #6 amendment A2 makes S7 take the larger of the two demands and adds a case to AC-S7-1. L6.4 now gives Still Water T(best) 1,350,000 and T(all six) 1,930,000: B9 ratio 1.43, +580,000; H5 unchanged at +280,000. The sum reading (1.53, +860,000) is kept as a note; both pass. Edge Cases now say fighting saves 2.5–8.8 minutes over the hearth alone, and AC-J-1 is re-pinned to 2.04 and 1.43.
- [Discarded] The reviewer's summary described #4 Open Questions 1 and 6 as about iron ore and a jade merchant; they are the run floor and the by-product rule's recipe half.
Reviewed-Content-Hash: design/gdd/crafting-route.md 6717a3ee4c960c4c6818f44481b1e9b4d1f78ad3
Reviewed-Content-Hash: design/registry/entities.yaml 297932141e9bb94fc95475a17bd8d95617c1e612
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/fight-and-dungeon-routes.md face07e942ff660313249e02ab261f7406efb471
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md f51e2ffb091f585c12e92083257afff280100ac2
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md 4f46616596278495a0f6c4ae3b70018905914d00
Reviewed-Content-Hash: design/gdd/resources-and-caps.md a5dc7cd863ac6ac9a8676ec63f696f72a6a735eb
Reviewed-Content-Hash: design/gdd/activity-slot-rest-and-away-time.md 6c2abeeca4a1e490db6dd2ec93bd07a8a5554305
Reviewed-Content-Hash: design/gdd/combat-resolver.md 981d54a98b2c57051582a41fb52a22c7a07ccbb6
Reviewed-Content-Hash: design/gdd/forge-and-proving.md 4d4841ed8007bbe7bed85825d8e5d9f5b494717c
Reviewed-Content-Hash: design/gdd/methods.md 84168fa650e20080b150a7b3f5b2f17eecb95f27
Reviewed-Content-Hash: design/gdd/game-concept.md e29352a5020553afe841355ed38280e9f3ddec68
Reviewed-Content-Hash: design/gdd/systems-index.md 4f7b3a5929f2165b4e23d50676de79c4ab320222
