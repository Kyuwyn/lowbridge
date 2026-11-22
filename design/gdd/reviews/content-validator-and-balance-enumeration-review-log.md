# Review log: Content Validator and Balance Enumeration

## Review — 2026-11-21 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: XL
Specialists: none (lean). One general-purpose reviewer worked in a fresh context, and the coordinating session spot-checked its findings. CD-GDD-ALIGN passed during authoring, with one note: close Open Question 3 before content lock.
Blocking items: 0 | Recommended: 0 applied (4 raised; see Findings)
Summary: All 8 sections are present. Pillar 4's checks map to concrete validator checks: check 2 to #8 X5 by way of #1 A7, check 3 to B10, and the tending seal to VC6. The reforge guarantee is deferred to #16 (Open Questions 6–7). Registry values match: CASES_MAX, TENDING_K_MAX 10, ROOMS_MAX 1,000,000, B1_MARGIN_STEP 1 and VALIDATE_TIME_CEILING_MS 2,000, and the formula entries agree with the Formulas section. Every file the GDD names exists. The obligations other GDDs place on #12 are answered in its Open Questions table, which covers #9 Open Question 4 (a)–(c), #6 Open Question 2, #8 Open Question 3, #4 Open Question 7 and #10 Open Question 3.
Merge: merged at 93be68c, before #13 (914662f) and #14 (5e5deb8). #12 keeps its amendment numbers: #1 A7, #6 A3, and the status edits #4 A3, #8 A1 and #9 A2. The clashing numbers in #13 and #14 were renumbered, to #4 A4, #8 A2, #9 A3 and #1 A10. Both branches had raised the tracker to 12, and it was set to 14 after all three merges.
Amendments reviewed in the same pass (all still approvable; the headers record the designer's approval):
- #1 A7: R8.4's pillar 4 check 2 reads "some source that produces each input", with gates counted, as #8 X5 runs it.
- #6 A3: G14's cascade adds B9. Open Question 2 is resolved by VC11, a warning when the best makeup does not survive ±1 on one door stat.
- #4 A3, #8 A1, #9 A2: status edits only.
Prior verdict resolved: First review
Findings:
- [Discarded] The reviewer listed three dependency files that do not exist (`progress-and-forge-actions.md`, `method-marks-and-attunements.md` and `ui-shell-and-screen-flow.md`). The GDD names none of them, and every file it does name resolves.
- [Noted, already tracked] Retune the provisional doors that trip VC11 before content lock: Open Question 3. Settle the runtime, Bun or Vite and Vitest: Open Question 5 and ADR 2. Measure VALIDATE_TIME_CEILING_MS: Tuning Knobs and ADR 9.
- [Noted, no action] Every #12-sourced registry entry has `referenced_by: []`, because no other GDD reads them.
- [Noted, not changed] #11 line 741 and #9 line 757 still call #12 undesigned. Both are approved GDDs, and these are stale status lines, not rules.
Reviewed-Content-Hash: design/gdd/content-validator-and-balance-enumeration.md 80b3b589b17f7a6d4cfa831a7312ce5417efe3d6
Reviewed-Content-Hash: design/registry/entities.yaml a0d8da057d81041530df1fc56d5abb380733be1f
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md a7545e16cbc238eddbec2951f412422cb856b126
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md 72a51510ce1a7cc8168c9bce7e7251e74a58a2ee
Reviewed-Content-Hash: design/gdd/resources-and-caps.md b1e3486cfac9e07bd7e79cf9270c04f034157927
Reviewed-Content-Hash: design/gdd/activity-slot-rest-and-away-time.md be02be103b500dd0b090c26f25740cc0b33b4ea6
Reviewed-Content-Hash: design/gdd/combat-resolver.md 981d54a98b2c57051582a41fb52a22c7a07ccbb6
Reviewed-Content-Hash: design/gdd/forge-and-proving.md 53b226a7f0985f0593f67d2a81dff9f7e9b916a8
Reviewed-Content-Hash: design/gdd/methods.md 53752610870612b5786cdca78ff80a699336c5c3
Reviewed-Content-Hash: design/gdd/crafting-route.md 8efc263766f1fdb09342b5e2e81f7a985470eb92
Reviewed-Content-Hash: design/gdd/fight-and-dungeon-routes.md 1037723830a2feed650cb8c94aa22cdc900ac553
Reviewed-Content-Hash: design/gdd/tending.md 68052beb0e20170b1b2e0b7026c91b923f985350
Reviewed-Content-Hash: design/gdd/save-and-run-lifecycle.md a3c682076dbbba3b2a0f0e9868b4e51bb4d0834d
Reviewed-Content-Hash: design/gdd/game-concept.md 580c5c118d42b488a47f66024d379e6885f0aff3
Reviewed-Content-Hash: design/gdd/systems-index.md 262a58a9093dee98bd70f396e064bc19d7f501b4
