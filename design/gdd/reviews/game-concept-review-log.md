# Review log: game-concept.md

## Review — 2026-11-19 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: XL (whole game; producer should verify before sprint planning)
Specialists: game-designer, systems-designer, economy-designer, ux-designer, qa-lead, creative-director (senior)
Blocking items: 6 | Recommended: 5
Summary: Fantasy, pillars and scope hold. The specialists converged on three holes: the forge had no measure and no consumer, methods only re-priced sources, and the concept contradicted itself on method switching, modifier sources and away play. The creative director reduced 17 specialist blockers to six concept-level decisions and sent the rest to the system design documents. The 8-section GDD completeness check does not apply to a concept document; against the concept template every section was present.
Prior verdict resolved: First review
Findings:
- [BLOCKING] Core Mechanics: a Foundation is measured against nothing; no makeup is better than another
- [BLOCKING] Core Mechanics / Pillar 2: methods change sources and prices only, not what an ingredient contributes at the forge
- [BLOCKING] Core Loop / MVP Definition: method switching is stated both ways
- [BLOCKING] Technical Considerations: "only methods patch" beside tending and Foundation modifiers; away accrual beside rest filling the slot
- [BLOCKING] Pillar 4: tending yield is efficiency, which taxes the player who is away
- [BLOCKING] MVP Definition / Open Questions: the hypothesis has no observable signals; open questions are stale against the prototype
- [RECOMMENDED] Anti-Pillars: state that the MVP's fast new game is a test affordance, not a reset loop
- [RECOMMENDED] Flow State Design: make the goal visible from the first screen; text is a supplement
- [RECOMMENDED] Review Record / Next Steps: add the prototype and its review
- [RECOMMENDED] Header: the Magic Research 2 reference (rules 75–100) is not cited
- [RECOMMENDED] Core Identity / Core Loop: session length given as 30–60 and as 30–120 minutes
Disagreements recorded: tending yield (economy-designer blocking; game-designer and systems-designer recommended); onboarding by text or by interface (ux-designer against the prototype report); phone layout in the MVP (ux-designer against the accepted scope review); a post-forge stretch in the MVP (game-designer and economy-designer against the scope review); evidence standard (qa-lead asked for five outside testers); whether "fast new game" contradicts "not a reset loop" (main review yes, creative-director no).
Revision after this review, same day, NOT yet re-reviewed: all six blocking items were edited in the concept on the designer's decisions. Two decisions went against reviewer advice: tending keeps yield, capped (advice: speed only), and the only MVP tester is the designer (advice: at least one outsider). The designer chose both doors and proving fights as the Foundation's measure, which adds content to the MVP.
Reviewed-Content-Hash: design/gdd/game-concept.md 1350bdc596b89135b2e6243afc7a787b02492e2b
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: prototypes/forge-concept/REPORT.md c2ea8ef8ffd94d2806bb499125ef4c2fc0449035

## Review — 2026-11-19 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: XL (whole game; MVP about M; producer should verify before sprint planning)
Specialists: game-designer, systems-designer, economy-designer, ux-designer, qa-lead, creative-director (senior)
Blocking items: 4 | Recommended: 8
Summary: The revision resolved method switching and pillar 2's intent, but removing the day budget left the build problem without a trade-off: the balance table shows both methods sharing a best makeup. The creative director reduced the new findings to three decisions (where the trade-off lives, the measure's shape, the honesty of the evidence standard) plus cheap edits, including the leftover rest-line contradiction. Everything else goes to named system GDDs, the UX spec and ADRs; the next pass should be a targeted check, not a full panel.
Prior verdict resolved: Partly (blockers 3 resolved; 2 resolved in text, reopened by data; 5 recorded decision; 1, 4, 6 partly)
Findings:
- [BLOCKING] Open Questions / Pillars 3–4: no trade-off replaces the day budget; without it Still Water ties three makeups at 4 seals, one of them Ember Breath's unique best
- [BLOCKING] Core Mechanics 1: "quality" undefined — no rule combining doors and fights, proving inputs unstated (tending could buy quality), retries and slot use unstated; doors point at a realm the MVP lacks
- [BLOCKING] Core Loop: "When the player stops tending, rest fills the slot" contradicts Core Mechanic 4 and Technical
- [BLOCKING] MVP Definition: the evidence standard overstates a designer-only run; signals 1, 2, 4 cannot fail on him and signal 5 is set by the balance table
- [RECOMMENDED] Core Mechanics 2: method lock fires on an incidental event, possibly while away (rule 54); make it an explicit commit
- [RECOMMENDED] Inspiration and References: undeclared divergences from copy rules 24, 25, 91
- [RECOMMENDED] Header: Magic Research 2 rules still uncited (carried from the prior review)
- [RECOMMENDED] Pillar 4: "pillar 2 yields" ambiguous; review history in the pillar; no design test for the attention half
- [RECOMMENDED] Core Mechanics 1: "exactly N distinct of M, 2 ≤ N < M"
- [RECOMMENDED] Pillar 4 / Open Questions: tending a discrete choice, untended at base rate
- [RECOMMENDED] MVP / Technical: doors as named previewed unlocks; "by play" to "by enumeration"; "a stated price"
- [RECOMMENDED] MVP item 3: crafting is the only fightless route; methods re-price but never remove a crafting recipe; fights pay a premium
Disagreements recorded: measure shape (ux-designer and creative-director one axis; game-designer two axes Pareto; qa-lead lexicographic); method-lock severity (ux-designer blocking; others lower); testers (qa-lead three naive as a blocker; others one outsider recommended); simulation bot (qa-lead needed; creative-director with the scope review, none); second fightless source vs fight premium (creative-director premium).
Reviewed-Content-Hash: design/gdd/game-concept.md 35fd66b5eb0131625675e968b494f8e9ffa84b9a
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: prototypes/forge-concept/REPORT.md c2ea8ef8ffd94d2806bb499125ef4c2fc0449035
Reviewed-Content-Hash: prototypes/forge-concept/balance-table.md 7f18e41b35e7703ea3c8f4c8ff15af4bf1865e5f
Reviewed-Content-Hash: research/arcanum-reference/12-design-rules.md b4093a9677c2d5f85c6c793dbc98af655987490d
Reviewed-Content-Hash: research/hundred-days-reference/06-design-rules.md 6de4772054a8f3e1ed6debebd306886fffb086cb
Reviewed-Content-Hash: research/magic-research-2-reference/08-design-rules.md a9d53ce887dac540b0b2d63a40eec549aa8d1d07

## Review — 2026-11-19 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: full
Scope signal: XL (whole game; MVP about M; producer should verify before sprint planning)
Specialists: none (lean)
Blocking items: 2 | Recommended: 6
Summary: All four blockers from the full re-review are closed. Two new blockers: a free preview of any makeup makes the 15-case MVP build problem a lookup, undercutting pillar 3 and the Challenge aesthetic; and the validator's monotonicity claim contradicts the method commit that closes sources. The recommended items concern tending's missing cost, pillar 2 against the never-remove-a-recipe rule, the two-source rule under route removal, wording on caps, the stale balance table and the review record.
Prior verdict resolved: Yes (blockers 1–4 resolved; blocker 1's follow-on reopened as new blocker 1)
Findings:
- [BLOCKING] Core Mechanics 1: preview shows seals of any makeup while sourcing costs time only, so all 15 makeups can be compared for free
- [BLOCKING] Technical Considerations: "no action closes a source" contradicts the explicit method commit that closes sources
- [RECOMMENDED] Core Mechanics 4 / Pillar 4: tending has no stated cost and no away rule (free toggle or attention tax)
- [RECOMMENDED] Pillar 2: "which recipes work" against MVP item 3 (a crafting recipe is never removed)
- [RECOMMENDED] MVP item 3: removing a fight or dungeon route can break the two-source rule unless replaced
- [RECOMMENDED] Core Mechanics 1: "never limits what can be held" / "no finite stock" against capped resources
- [RECOMMENDED] MVP Definition: balance table predates the forge rules (budget column); regenerate
- [RECOMMENDED] Header / Review Record / Next Steps: still say "targeted re-check of four blockers"
Disagreements recorded: none (single reviewer)
Reviewed-Content-Hash: design/gdd/game-concept.md 7c3d26332d378aa580a6ec692f7183c836e079cc
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: prototypes/forge-concept/REPORT.md c2ea8ef8ffd94d2806bb499125ef4c2fc0449035
Reviewed-Content-Hash: prototypes/forge-concept/balance-table.md 7f18e41b35e7703ea3c8f4c8ff15af4bf1865e5f
Reviewed-Content-Hash: research/arcanum-reference/12-design-rules.md b4093a9677c2d5f85c6c793dbc98af655987490d
Reviewed-Content-Hash: research/hundred-days-reference/06-design-rules.md 6de4772054a8f3e1ed6debebd306886fffb086cb
Reviewed-Content-Hash: research/magic-research-2-reference/08-design-rules.md a9d53ce887dac540b0b2d63a40eec549aa8d1d07
