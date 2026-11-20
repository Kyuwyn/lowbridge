# Review log: Combat Resolver

## Review — 2026-11-20 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: M
Specialists: none (lean; one general-purpose reviewer in a fresh context)
Blocking items: 0 | Recommended: 6
Summary: All 8 sections present; all 12 combat registry entries match; boundary values (stats 0 and 1,000,000, might + guard = 0, large speed) stay inside 2^53-1. The resolver is pure, deterministic and integer-only, a loss costs time only, and no stat passes through the Modifier pipeline (#2). No pillar-level or design blocker.
Prior verdict resolved: First review
Findings:
- [RECOMMENDED] Acceptance Criteria: AC-C3-3 needs one exact loss-path example (inputs and expected score).
- [RECOMMENDED] Acceptance Criteria: AC-C6-3 (100,000 calls under 100 ms) needs a named reference machine.
- [RECOMMENDED] Formulas: state the caller-supplied starting Life range (1 to 1,000,000) in F9's bounds.
- [RECOMMENDED] Dependencies: #2 should carry an explicit "no interaction with #5" row for bidirectionality.
- [RECOMMENDED] Systems index: add the resolver to row #4's dependencies once #4 is drafted (OQ-6).
- [RECOMMENDED] Open Questions: ADRs for the resolver signature and error shape (OQ-2) and the stepped oracle's role (OQ-5) before the first PR.
Review-environment notes: specialist agents and the CD-GDD-ALIGN gate did not run in the authoring session (auto mode blocked the spawns).
Reviewed-Content-Hash: design/gdd/combat-resolver.md 974fb6fb0113a1788d9afb8b18a5be838868695e
Reviewed-Content-Hash: design/registry/entities.yaml f1b708ca6a0320275933bf69813e03da024b1d4d
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md 335a7426e9312c4b225d31ff3824a2d66ff6f493
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md 7f6d181a6e55a44ec39b5896caaacc55ed724902
Reviewed-Content-Hash: design/gdd/game-concept.md 7e33d755de6bc47e8933a7e5e9c61fbb8d0886c3
Reviewed-Content-Hash: design/gdd/systems-index.md 65db6f5d2ed880f387fa93a376525dac2aef3fbe
