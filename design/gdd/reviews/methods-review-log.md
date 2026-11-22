# Review log: Methods

## Review — 2026-11-20 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: L
Specialists: none (lean; one general-purpose reviewer in a fresh context, with spot checks by the coordinating session). CD-GDD-ALIGN passed during authoring.
Blocking items: 0 (1 raised, overruled by the designer) | Recommended: 2
Summary: All 8 sections present. Pillar 2 holds: each method's feeds and quenches change what ingredients contribute (`methods.md` W6), and the open verb changes which routes exist (Ember Breath opens three hunts, Still Water opens dungeon floors for the same three ingredients). Pillar 4 holds: the W5 route plan gives each ingredient two sources under each method, a recipe and a fight route. #7 keeps #6 S9's patches unchanged, so B1–B8 and B11–B12 pass as S9 shows, and both best makeups stay at 4 seals (W6, line 295). B9, B10 and H5 wait on #8 and #9's real sources. Formulas Y1–Y4 have no overflow and no division by zero. FEED_MAX 40 and METHOD_PATCH_MAX 8 are registered (`entities.yaml` feed_max, method_patch_max).
Amendments reviewed in the same pass:
- #1 A5: consistent at every place it touches (R1 source target of about 23, R4 `redoCost` in ms, R7.2 redo line, AC-R7-4, Open Questions 10 and 11). Loader steps, field registry and criteria are unaffected.
- #3 Open Question 6 and #6 Open Question 1: the method halves are resolved accurately. The route halves stay with #8 and #9.
- Systems index: the #7 paragraph, the Wave A note and the Methods ↔ routes resolution now say the MVP patch surface is feed, quench and open.
Raised and overruled:
- [BLOCKER raised by reviewer, overruled] Concept vs W3 on re-pricing. The concept says a method "may re-price a route or switch it off" (`game-concept.md` mechanic 2 and MVP item 3), and W3 keeps `inputs`, `outputs` and `duration` closed in the MVP. The coordinating session read "may" as a permission rather than a requirement. #7 records that the designer set re-pricing aside on 2026-11-20 (W3.1, W3.2) and reopens it for the Vertical Slice (Open Question 4). The designer agreed and approved adding an MVP note to the concept's mechanic 2, which is applied in this change. Concept line 345 ("Every method re-prices every source in every realm") is an Alpha balance risk and was left as is.
Prior verdict resolved: First review
Findings:
- [RECOMMENDED] Edge Cases: the case where the baseline combatant loses a hunt is passed on to #9 and #12. Track it there.
- [RECOMMENDED] H5 fails for Still Water on stub timings. Recheck once #8 and #9 supply real sources (Wave A checkpoint).
- [Discarded] The reviewer said FEED_MAX and METHOD_PATCH_MAX had no registry entries; both are in `design/registry/entities.yaml`.
Reviewed-Content-Hash: design/gdd/methods.md c8f35bcff437316d26a16b3f47701924f82e9d78
Reviewed-Content-Hash: design/registry/entities.yaml 966d41bbc62a6f2bc6e67c02468f011582ec2f90
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md f51e2ffb091f585c12e92083257afff280100ac2
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md 4f46616596278495a0f6c4ae3b70018905914d00
Reviewed-Content-Hash: design/gdd/resources-and-caps.md 44a9a8521d86f1df07d0caca392cd82e1c9eade7
Reviewed-Content-Hash: design/gdd/activity-slot-rest-and-away-time.md 2c363d8b5241cfd85c5a95956e6c67feea9d7fc7
Reviewed-Content-Hash: design/gdd/combat-resolver.md 003399e275248376d983bf7e3b88388881bb1072
Reviewed-Content-Hash: design/gdd/forge-and-proving.md efb00f3c3fc327ddbf4ffa72ac81ecd88b7755ea
Reviewed-Content-Hash: design/gdd/game-concept.md e29352a5020553afe841355ed38280e9f3ddec68
Reviewed-Content-Hash: design/gdd/systems-index.md 0ed92f705d7403bb6d52c74a8d968fe3d9e00254
