# Review log: Interaction Pattern Library

## Review — 2026-11-22 — Verdict: APPROVED
Review mode: lean · Checklist: 3C (Interaction Pattern Library)
Accessibility tier: Comprehensive, against WCAG 2.2 AA (`design/accessibility-requirements.md`)
Specialists: none (lean). One general-purpose reviewer worked in a fresh context under `/ux-review patterns`, and the coordinating session checked its claims against the file.
Blocking items: 0 | Advisory: 1 (discarded; the stale sentence it pointed at is fixed)
Summary: The catalogue index matches IP1–IP23. Each unused standard control is listed with its reason. Every pattern states its behaviour, input, feedback, states, accessibility, and when to use it and when not to. The Animation and Sound Standards are present. No pattern contradicts #13, #14, a GDD's UI Requirements or the accessibility requirements, and every **[AA assumed]** value stands under the committed tier.
Prior verdict resolved: First review
Findings:
- [Discarded] The reviewer said the edits the library lists for #13 and #14 were not yet applied, so an implementer reading those specs would build against stale lines. They were applied at merge in 359de97. The overview sentence it pointed at (lines 33–34) still called the edits pending; it now says they landed and that each entry and its source line agree.
- [Resolved] Open Questions 4. The reviewer confirmed the library's reading: once a menu item opens a dialog, the menu has closed, so #13 C17's "the control that opened it" is the menu button. The row is marked resolved.
- [Noted, already tracked] Open Questions 2, 3 and 5 stay open: Start's accessible name, a named-record line's name and the kept-progress bar's text value. The accessibility requirements do not settle them. They belong to that document and the writer, before #13's UI stories.
- [Noted] The reviewer's verdict, "SHIP WITH ADVISORIES", is not one of the skill's verdicts. With no blocking item and every dimension assessed, the verdict is APPROVED.
Reviewed-Content-Hash: design/ux/interaction-patterns.md 8a6cd58e1d85dcd3c9dd7e0980feef733b4721d4
Reviewed-Content-Hash: design/accessibility-requirements.md a8256cbf1e4429b1983a21541a6724c58d68e083
Reviewed-Content-Hash: design/ux/interface-shell.md 74595efeadccbc5370c02e3397baefd2454286ed
Reviewed-Content-Hash: design/ux/method-marks.md 9072fb2910acb4c9b96c690431db46c6121a520f
Reviewed-Content-Hash: .claude/skills/ux-review/SKILL.md 4891f47f8bd3bf091ee8e48144e0ee31a03fc315
Reviewed-Content-Hash: design/gdd/systems-index.md a13f2b18f3a25a6c59355f324230a0dfc3e5fe11
Reviewed-Content-Hash: design/gdd/game-concept.md 580c5c118d42b488a47f66024d379e6885f0aff3
