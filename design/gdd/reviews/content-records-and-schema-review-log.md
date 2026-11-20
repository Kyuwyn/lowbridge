# Review log: Content Records and Schema

## Review — 2026-11-20 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: XL
Specialists: game-designer, systems-designer, lead-programmer, qa-lead, creative-director (senior)
Blocking items: 9 | Recommended: 10
Summary: The vision and the four pillars hold, and the fixes are local. The headline defect, flagged by all specialists, was the patch unit: (record, field) could not address a map key. Other blockers were F7's scope and transitions, pre-commit visibility, the dependence on #2's operations, cross-field ranges, engine-dependent Unicode checks, the fingerprint's canonical form, start above the effective cap, and a fixture that could not run its own ACs. Revisions were applied in the same session to a copy in worktree branch `claude/game-concept-design-review-67e876`. The hashes below are of the reviewed, pre-revision files in the main checkout, so the re-review sees the revised document as CHANGED.
Prior verdict resolved: First review
Findings:
- [BLOCKING] R6 / F8: the patch unit (record, field) cannot address a map key, and a method was limited to one key per map. Fixed: the unit is now (record, field, key).
- [BLOCKING] States / F7: `enabled_C` was undefined for non-sources, there was no Hidden→Withdrawn row, and the Actionable trigger omitted `enabled`. Fixed: F7 is sources-only and the transitions were rewritten.
- [BLOCKING] Edge Cases, "Before the commit": hidden-wins-over-withdrawn hid what a method closes. Fixed: the method-choice view shows both methods' projected sets (designer decision).
- [BLOCKING] R6.1 / R8.3: the F8 no-op check needed #2's operations. Fixed: the MVP ops `set` and `add` are owned here, through an ops table.
- [BLOCKING] R4: cross-field ranges had no grammar. Fixed: R4.7 adds named range checks.
- [BLOCKING] R4.6: the Unicode checks differ by engine. Fixed: the text check now runs in two tiers, build and runtime.
- [BLOCKING] R8.5: the fingerprint's canonical form and hash were underspecified. Fixed: the canonical form is defaults-expanded with order rules, and the hash is synchronous pure code.
- [BLOCKING] F1: `start` could exceed the effective cap. Fixed: the mark starts at min(start, effective cap).
- [BLOCKING] Acceptance Criteria: the fixture could not run AC-F7, AC-F8, AC-R4-7, AC-R5-4 or AC-R8-8, and AC-R8-3 used a fixture id as shipped content. Fixed: the fixture was rebuilt and the ACs rewritten.
- [RECOMMENDED] Acceptance Criteria: the browser runner is unpinned (AC-R8-4), and the integration ACs needed `[blocked]` tags. The tags were applied; the runner is Open Question 8.
- [RECOMMENDED] Acceptance Criteria: AC-S-1, AC-R5-5, AC-R7-1 and the order of AC-R8-7 and AC-R8-8. Fixed.
- [RECOMMENDED] Acceptance Criteria: coverage gaps (reserved ids, alias map, text boundaries, gate edge cases). Partly addressed (AC-R6-5, AC-R6-6, AC-R4-9, AC-S-2).
- [RECOMMENDED] Edge Cases: the "map value 0" line contradicted `contrib`. Fixed: it is scoped to `inputs` and `outputs`.
- [RECOMMENDED] R4 rows: `resource.cap` had `sealInput: TBD`. Fixed: set to `yes` (provisional).
- [RECOMMENDED] R7.1 / F5: ±2⁵³ versus 2⁵³−1, and `-0`. Fixed.
- [RECOMMENDED] R4: the GDD table and the runtime schema could drift. Fixed: R4.8 adds a diff test (AC-R8-2).
- [RECOMMENDED] F1: the ingredient held range of 0–1 had no source. Fixed: #3 clamps ingredients to 1.
- [RECOMMENDED] R5: add a worked authoring example (dungeon chain, method-specific sources). Not done.
- [RECOMMENDED] Game Feel: no performance budget. Partly done: ADR 9 is listed and AC "Load time" has no pass mark yet.
Disagreements: the game-designer wanted R8.4 softened to a warning and the no-digits rule relaxed for name and flavor. The creative director and the designer kept both as they are.
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md b46c2dc2dbe2d64eae6447fa7f7117a8a8e84a48
Reviewed-Content-Hash: design/registry/entities.yaml 3d32d0cdf44199dd2847f1a57134a37c36bd9fff
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/game-concept.md c99353aeb618dbf129efae3f20f56ccd3fc815a7
Reviewed-Content-Hash: design/gdd/systems-index.md ff7f5bf02b95607daed6b75ddef0c2232d3504c8

## Review — 2026-11-20 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: XL
Specialists: game-designer, systems-designer, qa-lead, lead-programmer, creative-director (senior)
Blocking items: 12 | Recommended: about 25
Summary: Re-review after the first round of revisions. The pillars and the system seams hold, and the fixes are local. The new blockers were a bool-versus-integer patch contradiction, an incomplete state table, a fixture that could not run its ACs, and an unpinned R8.3 order, gate shape, range grammar and fingerprint. All 12 were revised in the same session.
Prior verdict resolved: Yes (the nine earlier blockers held; no regressions found)
Findings:
- [BLOCKING] UI Requirements: said the method-choice view never shows a hidden name; Edge Cases shows names of patch-touched hidden sources. Fixed: UI line aligned.
- [BLOCKING] R6.1: `enabled` is a bool but ops are integers. Fixed (designer): only `set` with 0 or 1; `add` is a load error; operand bounded.
- [BLOCKING] States/F7: Hidden→Actionable missing; "Revealed" ambiguous. Fixed: leaf renamed Waiting, transition added, registry updated.
- [BLOCKING] Fixture: sources had no inputs or outputs. Fixed: added, with a note that reachability has its own fixture in #12.
- [BLOCKING] ACs: AC-R6-4, AC-R4-7, AC-F7, AC-S-2, AC-R1-3, AC-S-1 corrected or rewritten.
- [BLOCKING] R4.6/AC-R4-9: U+FEFF and runtime whitespace unpinned. Fixed (designer): U+FEFF forbidden; fixed space list.
- [BLOCKING] R8.3: no order or reporting rule. Fixed (designer): fixed order, first failure.
- [BLOCKING] R8.3 item 12: self-referential. Fixed: separate output check (steps 3, 4, 6, 9).
- [BLOCKING] R4 Range column: no grammar. Fixed: R4.9 and `check:` tokens on six rows.
- [BLOCKING] Gate data shape: Fixed: pinned in R5.7.
- [BLOCKING] R8.5 fingerprint: defaults, framing, schemaVersion, patch order. Fixed (designer): literal defaults only, JSON framing with schemaVersion, patches sorted.
- [BLOCKING] Missing ACs: added AC-R2-3, AC-R2-4, AC-R4-10, AC-R4-11, AC-R5-6, AC-R8-9, AC-R8-10.
- [RECOMMENDED] Not yet done: pillar 3 optimum enumeration in R8.4; commitText redo price vs the no-digit rule; no-op patch as load error; fightless-chain check for cycles; permanent commit vs pillar 4; sealInput honor system; ingredient inputs above 1; AC-F1 depends on #3/#4/#11; AC numbering order; load-time number; Open Question numbering; reference files missing from this worktree.
- [RECOMMENDED] Done: npm to bun; TypeScript 7.0 wording; registry high_water output and id unit; AC-R4-2 and AC-R6-6 rewritten.
Disagreements: the creative-director rated the R8.3, range-grammar and fingerprint items as recommended and suggested a lean re-review; the lead-programmer rated them blocking. They were kept blocking, and a full re-review is required by this skill.
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43

## Review — 2026-11-20 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: XL
Specialists: game-designer, systems-designer, lead-programmer, qa-lead, creative-director (senior)
Blocking items: 14 | Recommended: about 35
Summary: Third full review. All 21 earlier blockers held and no specialist found a regression. The new blockers are three pillar-level design contradictions (a method can remove a no-fight recipe against concept mechanic 2; commitText closure and redo text can drift from the patches; the pre-commit view can leak seals through contrib patches), one formula gap (F1 does not pin when the mark is evaluated), two loader-spec gaps (defaults expanded too late; the R4.9 registry diff test cannot be built), and eight acceptance-criteria or fixture defects. Cross-reference targets and the systems index are missing or stale in this worktree.
Prior verdict resolved: Yes (21 of 21 held)
Findings:
- [BLOCKING] R1 / R6.2 / R8.4 / fixture: `enabled` 0 on a no-fight recipe contradicts concept mechanic 2. Choose one lane: forbid it or amend the concept.
- [BLOCKING] R7.2 / commitText: closure and redo price are authored prose and can drift. Generate the closes list from F8 and the redo line from a numeric field.
- [BLOCKING] UI Requirements / Edge Cases "Before the commit": the view may show contrib patches, so seals can be computed before gathering. Restrict to `enabled` triples and source counts.
- [BLOCKING] F1: the mark's evaluation point is not pinned (order of inputs and outputs; batched against split advance). Update once per unit completion; add an AC on marks.
- [BLOCKING] R8.3 steps 2 and 7 / F8: defaults are filled only for the fingerprint, so `set 1` on an absent `enabled` passes the no-op check. Fill literal defaults after step 2; the output check asserts diff equals changed(m).
- [BLOCKING] R4.9 / AC-R8-2: the registry diff test cannot be built from the prose table. Generate the table from the schema module or embed a fenced JSON block.
- [BLOCKING] AC-R4-7 bullet 2: `{ember: 0}` lacks `frost` and fails.
- [BLOCKING] AC-R8-10: cannot tell step-major from record-major order.
- [BLOCKING] AC header / AC-R8-3: Vitest against `bun test`; pin one test runner and one build runtime.
- [BLOCKING] AC-R4-4, R4-5, R4-9: the text-check tier is not selectable. Add `tier: build | runtime`.
- [BLOCKING] Fixture: `gate_ward` has no stats, "and so on" is not a list, and "meets R8.4" is false (`ash_seed` is patched by no method).
- [BLOCKING] AC-R8-3: ambiguous "first shipped source", and it mutates shipped data.
- [BLOCKING] AC-F1: depends on #2, #3 and #11 and needs a `[blocked]` tag.
- [BLOCKING] "Load error" definition: requires record id and field, but AC-R4-1 and AC-R4-3 are schema errors. Name the row `type.field`.
- [RECOMMENDED] R8.4 / Edge Cases: restate "disables every source" to match pillar 4; warn on patches to a source the same method disables; enumerate pillar 3's "no co-optimal makeup"; warn on an ingredient with 0 contrib on every affinity.
- [RECOMMENDED] R6.1 / R8.3: pin the patch-entry shape, the step that reports an unsafe op result, record ordering, patch ordering, and the step for an unknown op.
- [RECOMMENDED] F5: specify `Math.floor(a/d)+0` with a BigInt-oracle property test (verified on 6M cases).
- [RECOMMENDED] R8.5: ADR 6 first; canonical objects from sorted entries; constrain map keys to the id pattern; reject undefined, sparse and non-plain values; add a registry digest; consider a mechanics-only fingerprint.
- [RECOMMENDED] Loader: `structuredClone` before freezing; plain objects, not Map; output check on patched triples only; provisional load budget (ADR-0039 sets none).
- [RECOMMENDED] Edge Cases: `start ≥ n` under every reachable Foundation; batched outputs can exceed 2^53−1 (add a pair check); F7 is authoritative over the transition table; if ingredients get counts, inputs and outputs become seal inputs.
- [RECOMMENDED] ACs: numbering order, Open Questions order, AC-R2-3 `__proto__`, AC-R5-1 notation, AC-R5-2 boundaries, AC-R8-9 thresholds, golden frozen sets, redundant ACs, and coverage gaps (R4.9 mutation, ghost ids in gates, step pairs, output-check details, text edge characters).
- [RECOMMENDED] entities.yaml: add the cap, contrib, stats, ingredient-count, threshold-count and safe-integer constants.
Disagreements: none among specialists. The game-designer refuted the part of the pre-commit-view worry about naming hidden sources, and kept only the value-patch leak.
Review-environment notes: the worktree's systems-index.md is the old Lowbridge index; docs/engine-reference/web/ and research/magic-research-2-reference/ are absent; the bun and package.json claims come from the old tree.
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md 213d4b817a804238dea084c0fd2c5bddcf4b720a
Reviewed-Content-Hash: design/registry/entities.yaml 1a10339eb8c02b35f6755c356ba48703896e4f95
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/game-concept.md 66c7801aea98a0a89f4e0aff82f86355dfc818f1
Reviewed-Content-Hash: design/gdd/systems-index.md 0e4358860a80d633831b561d1d99121ed059f72b

## Review — 2026-11-20 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: XL
Specialists: game-designer, systems-designer, lead-programmer, qa-lead, creative-director (senior)
Blocking items: 9 | Recommended: about 25
Summary: Fourth full review. All 14 third-round blockers held and no rule-level regression was found, except one acceptance criterion (AC-R4-7). The new blockers are mechanical (the R8.3 check order lets a malformed gate crash a cross-record check, the R8.5 canonical form and the registry diff test cannot be built, batched arithmetic can pass 2^53-1, a dozen ACs cannot run) plus two design gaps that the mechanic-2 amendment opened (the Validator does not state the pillar 4 checks, and the pre-commit view leaks `set` operands). The creative-director judged the document converging and asked for one focused pass, then a re-review. Designer decisions taken the same session: restore all three pillar 4 checks including the price ceiling; show deltas only, and "changed" for `set`, on `contrib`; register a provisional `method.redoCost` row and do not bless the permanent lock; use the systems-designer's step order plus a step 0 schema check.
Prior verdict resolved: Yes (14 of 14 held; AC-R4-7 bullet 2 regressed)
Findings:
- [BLOCKING] R8.3 / R4.7 / R5.3: `n ≤ cap` and `all keys of type` run before references resolve and gate shape is checked, so a malformed gate throws a TypeError; three rules have no step; step 6 is a schema check; text rules split across steps 3 and 9.
- [BLOCKING] R8.4 / Edge Cases / R1: pillar 4's checks (two sources, one fightless input chain, price ceiling) are not stated; a method could disable the only fightless recipe.
- [BLOCKING] Edge Cases "Before the commit" / UI Requirements / concept line 122: `set` on `contrib` shows an absolute value before any ingredient is held; concept lines 88 and 122 disagree.
- [BLOCKING] R7.2 / R4: the closes list has no field labels; the redo field has no registry row (OQ 10).
- [BLOCKING] R8.5: JSON.stringify cannot sort keys, integer-like keys reorder, map keys and stat keys are not tied to the id pattern, "UTF-8 bytes" contradicts JSON escaping, the digest form is unpinned.
- [BLOCKING] R4.8 / R4.9 / AC-R8-2: the seed table holds prose and typography a generator cannot reproduce.
- [BLOCKING] F1 / F6 / R8.3 step 8: a batched advance can form k × output past 2^53-1; the declared-pair check has no slot to read.
- [BLOCKING] concept line 402 still says a method never removes a crafting recipe.
- [BLOCKING] Acceptance Criteria: AC-R4-7 bullet 2, AC-R8-3, R8-7, R8-8, R8-9, R8-10, R8-11, R8-12, R4-10 cannot run as written; the test-visible functions are unnamed; "Node" and `bun test` contradict.
- [RECOMMENDED] Stale stack wording (Node and Vite versus Bun); provisional load budget; F7 authority over the transition table; F4 postcondition on the mark; absent patch key in sort; ingredient-keyed `inputs` and `outputs` above 1; entities.yaml constants; clone-before-freeze; textTier option; content budget for removable recipes; over-gathering gate for #6; AC splits and tag normalisation; uncovered range boundaries.
Disagreements: the game-designer would record "no redo this run" as an accepted MVP exception with an expiry at reforge; the creative-director called that a pillar violation behind a date, and the designer took the creative-director's side. The systems-designer and creative-director held that an absent patch key is not a sort hole (a field is scalar or map, never mixed); the main review accepted that. The systems-designer and lead-programmer agreed on the step-order defect and proposed different numberings; the designer chose the systems-designer's.
Review-environment notes: docs/engine-reference/web/ and research/magic-research-2-reference/ are absent in this worktree; the worktree's systems-index.md is the old 13-system index, so it was not updated; downstream GDDs #2–#20 do not exist.
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md 9ba6e4edd67c9549df4a7224958233396f247865
Reviewed-Content-Hash: design/registry/entities.yaml 92cafffa58422351d7908f9f50e01052eb21df9d
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/game-concept.md 34f48770dea7f5fdbfd528d7ceda500baec6168b
Reviewed-Content-Hash: design/gdd/systems-index.md 0e4358860a80d633831b561d1d99121ed059f72b

## Review — 2026-11-20 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: XL
Specialists: game-designer, systems-designer, lead-programmer, qa-lead, creative-director (senior)
Blocking items: 10 | Recommended: about 30
Summary: Fifth full review. All 9 fourth-round blockers held; no regression in them. The new blockers are structural loader and grammar gaps (no loader contract or error shape; the R4.7 range grammar and the seed table cannot be generated; gate bounds, bool patch legality and unverified reads in steps 1 and 5 have no step) plus five acceptance-criteria or fixture defects. The creative-director judged the surface settling but the frame still shifting, and asked for four deliverables, then a full re-review.
Prior verdict resolved: Yes (9 of 9 held)
Findings:
- [BLOCKING] R8.1 / Test API: no loader contract (input shape, options, thrown vs returned, frozen/registry types, sharing); the error shape cannot carry method, target, targetField, key or cause that eight ACs assert; AC-R8-13 needs an applyMethod seam.
- [BLOCKING] R4.7 / R4.8 / R8.3: range forms used by rows (`values`, `each`, `—`) are not in the closed set; forms have no assigned step; seed order, print order and registry order differ; notes have no storage; owner list is circular.
- [BLOCKING] R5.2 / R8.3: an empty gate passes steps 3-4; `reached` n ≥ 1 for a resource has no step.
- [BLOCKING] R6.1 / R6.2 / R8.3 step 7: bool patch legality has no step; `op` is a name but R6.1 says integer; the no-op check covers only MVP ops.
- [BLOCKING] R8.1 / R8.3 steps 1 and 5: reads of unverified values (non-string id, `in` lookup of "constructor", non-string patch target) and the copier's `__proto__` assignment break "never a TypeError".
- [BLOCKING] AC-R8-15: removing entry 0 renumbers the entries; the duplicate is then entry 1.
- [BLOCKING] AC-R4-10: seed_a..seed_l makes 15 ingredients, not 12; the no-affinity case fails at step 5.
- [BLOCKING] AC-R4-12: cannot run against the fixture (out-of-range contrib after patch, threshold, cap, missing door records).
- [BLOCKING] Fixture: all caps are 10 and realm M is always 3, so `n ≤ cap`, `start ≤ cap` and `2..M−1` cannot be discriminated.
- [BLOCKING] AC-R7-3: not a measurable pass/fail; needs exact lines and order.
- [RECOMMENDED] Pre-commit needText leads with "Needs a method committed" (G2; the senior review rated it recommended, the main review considers it close to blocking); closes-list direction words; add/set disclosure parity; pillar 2 vs 4 source budget and the "~20" target; provisional price ceiling; fightless-chain terminal.
- [RECOMMENDED] Transition-table triggers for a `committed()` reveal; F1 precondition and payment time; ingredient `inputs` = 1; effective cap below authored cap; name the F5 algorithm; fingerprint sort and registry digest; tending vs ingredient-keyed outputs (promote when #6 lands).
- [RECOMMENDED] Exact needText and closes templates; closesLines helper; helper signatures; U+000B and U+000C; product-pair shape; output check cost; cold-first-call load AC.
- [RECOMMENDED] AC splits, tier naming, AC-R5-1 notation, AC-S-1 walker, AC-R8-6 oracle, AC-R3-2, and about 20 coverage gaps listed by the qa-lead.
Disagreements: F5 — the systems-designer called `Math.floor(a/d)` wrong near 2^53; the lead-programmer's 2M-case BigInt sweep found no failure and the creative-director sided with the lead-programmer on the maths, while all agreed to name one exact algorithm. G1 (blind permanent commit, "Redo: begin a new run") — the game-designer rated it blocking; the creative-director downgraded it as re-litigation of the round-4 decision (no redo this run is pillar-4 debt for #7 and #16). G2 — rated recommended by the creative-director.
Review-environment notes: the worktree's systems-index.md is still the old 13-system index and was not updated; downstream GDDs #2-#20 do not exist.
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md 3ba821ab111d9860c1f2e4b7de17811a138c813b
Reviewed-Content-Hash: design/registry/entities.yaml 4024e7593a9d895d87715b69bf0f2b42645e0ea9
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/game-concept.md 7e33d755de6bc47e8933a7e5e9c61fbb8d0886c3
Reviewed-Content-Hash: design/gdd/systems-index.md 0e4358860a80d633831b561d1d99121ed059f72b

## Review — 2026-11-20 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: XL
Specialists: none (lean)
Blocking items: 0 | Recommended: about 30 (carried from the fifth review)
Summary: Lean re-review of the fifth-round revision, run by the same session that wrote it, so it is weaker than an independent check. The 10 fifth-round blockers held, and the new text contradicts no pillar. Four mechanical inconsistencies in the new text were fixed in the same pass. The owner chose this exit criterion: stop the review loop when no pillar-level or design blocker remains, and carry mechanical gaps into implementation (ADR 2 and 3, the schema module, and the fixture as its first test).
Prior verdict resolved: Yes (10 of 10)
Findings:
- [FIXED IN PASS] R6.1: shape errors were all placed at step 7, though step 3 now checks the patch target; the target now fails at step 3.
- [FIXED IN PASS] R6.1: the unsafe-result sentence still said "where the no-op check first computes it"; reworded.
- [FIXED IN PASS] R4.7 / AC-R4-10: whether a wrong-type contrib key fails at step 5 or step 6 was ambiguous; `all keys of type` now checks types at step 5 and completeness at step 6.
- [FIXED IN PASS] R8.1: the "applyMethod changed its input" error had no record or field to name; both are now absent for that cause.
- [RECOMMENDED] Carried from the fifth review: closes-list direction words; add/set disclosure parity; source budget for pillar 2 vs 4; provisional price ceiling; fightless-chain terminal; tending vs ingredient-keyed outputs (promote when #6 lands); registry digest in the fingerprint; realm.ingredients display order; cold-first-call load AC; multi-bullet AC splits.
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md db578eb745d4ea391f50afb9aadf93c1db81992e
Reviewed-Content-Hash: design/registry/entities.yaml 4024e7593a9d895d87715b69bf0f2b42645e0ea9
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/game-concept.md 7e33d755de6bc47e8933a7e5e9c61fbb8d0886c3
Reviewed-Content-Hash: design/gdd/systems-index.md 0e4358860a80d633831b561d1d99121ed059f72b
