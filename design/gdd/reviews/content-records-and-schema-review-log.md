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
