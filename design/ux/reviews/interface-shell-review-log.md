# Review log: Interface Shell and Goal Line (#13)

## Review — 2026-11-21 — Verdict: APPROVED
Review mode: lean · Checklist: 3A (UX Spec)
Accessibility tier: Comprehensive, against WCAG 2.2 AA (`design/accessibility-requirements.md`)
Specialists: none (lean). One general-purpose reviewer worked in a fresh context under `/ux-review`, and the coordinating session checked its claims against the file.
Blocking items: 0 | Recommended: 1 (applied before approval)
Summary: Completeness, GDD alignment, accessibility and the pattern library all pass. Every component in the inventory names its pattern in `design/ux/interaction-patterns.md` or its single-use catalogue row. Open Questions 2, 4 and 12 are resolved.
Prior verdict resolved: an earlier lean review, not logged, was NOT ASSESSED on Accessibility and Pattern Library because neither input existed. Both now exist.
Merge: `claude/ux-accessibility-3021f0` (2bdeb77) merged at 8ff2938, and `claude/ux-patterns-c43a92` (c409dd4) at ee23099. Each adds one file, and neither conflicted.
Changes applied before review (approved by the designer at merge):
- S1–S3 and S5–S7 from the accessibility requirements, and 13.1–13.20 from the pattern library.
- S4 is not applied. The two sessions disagreed on the wide card's keyboard behaviour, and the designer chose PD5 (focus trapped, as in the narrow sheet) over AR-M3's close on focus-out. AR-M3 and its matrix and test-plan rows now record PD5.
- S3's design, chosen by the designer. A narrow viewport at least 640 px wide and below 600 px tall folds the pinned zones:
  - one chip row that scrolls sideways;
  - a one-line running line;
  - no pinned log line.

  Rule 32's divergence is stated, and AC-13-38 checks the 180 px budget at 640 × 360.
- Corrections to the applied edits, made by the coordinating session before review:
  - added the missed Short variant row and the two Interaction Map confirm labels;
  - removed an extra column from three screen-reader rows;
  - rewrote the garbled busy-state sentence;
  - retagged the new ACs, which carried an unused `[a11y]` tag, as `[visual]` and `[manual]`;
  - added C11a's IP14 to C11's pattern cell;
  - put quoted labels in double quotes.
Findings:
- [RECOMMENDED, applied] No acceptance criterion tested PD5's focus trap, yet the accessibility test plan cited AC-13-17 for it. AC-13-17 now adds: with the keyboard, Tab and Shift+Tab cycle inside an open card, wide or narrow, and never reach the page behind it.
- [Discarded] The reviewer said S4's note sits in Open Questions near line 1388, and that AC-13-17 already reflected PD5. The note is in the cross-reference check, and AC-13-17 did not test focus until the fix above. The reviewer also counted S1–S6 and 13.1–13.18, but the lists run S1–S7 and 13.1–13.20. The coordinating session checked every row against the diff.
- [Noted, not changed] With a coarse pointer at 640 × 360, the folded zones come close to the 180 px budget: two 44 px rows, two text lines and the 44 px tab bar. AC-13-38 measures it. If it fails, the next fold is #13's to design.
Reviewed-Content-Hash: design/ux/interface-shell.md 74595efeadccbc5370c02e3397baefd2454286ed
Reviewed-Content-Hash: design/accessibility-requirements.md a8256cbf1e4429b1983a21541a6724c58d68e083
Reviewed-Content-Hash: design/ux/interaction-patterns.md 8f7e96e7d26d52085678be0bfc78ceee324843ca
Reviewed-Content-Hash: .claude/skills/ux-review/SKILL.md 4891f47f8bd3bf091ee8e48144e0ee31a03fc315
Reviewed-Content-Hash: design/ux/method-marks.md 9072fb2910acb4c9b96c690431db46c6121a520f
Reviewed-Content-Hash: design/gdd/systems-index.md a13f2b18f3a25a6c59355f324230a0dfc3e5fe11
Reviewed-Content-Hash: design/gdd/game-concept.md 580c5c118d42b488a47f66024d379e6885f0aff3
