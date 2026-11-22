# Review log: Tending

## Review — 2026-11-21 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: L
Specialists: none (lean; one general-purpose reviewer in a fresh context, with spot checks by the coordinating session). CD-GDD-ALIGN passed during authoring, with one watch-item (D4.5's bounded mid-fill reward).
Blocking items: 0 | Recommended: 2 (both applied before approval)
Summary: All 8 sections present. Both of the concept's constraints hold. `setHeap` is a discrete choice with no repeated, held or timed input. No `sealInput` field is tendable, and the validator checks this under every tending set. Pillar 4 holds: the heap bit survives stops, switches, rest, time away and the forge, and only the player's own accepted `setHeap` changes it (D5). #4 amendment A2's min rule stops a mid-unit heap from paying untended time at the heaped yield (D6.1). Z1 has a floor of 1, Z2 divides by a positive constant, and the validator computes J1(c) and J2 in exact integers (D8). Registry values match: HEAP_YIELD_BP 4,000, HEAP_TIME_BP 12,500, YIELD_CEIL_BP 15,000, RATE_CEIL_BP 12,500, TENDED_SHARE_DIVISOR 3.
Merge: merged at a52014d, before #11 (cf0eeda). The registry and index conflicts were appended blocks, a `referenced_by` union and separate index rows, resolved by keeping both sides. Both branches had raised the tracker to 10; it now reads 11.
Amendments reviewed in the same pass (all still approvable; the headers record the designer's approval):
- #4 A2: S6.3 and F2 rescale kept progress by min(p, ⌊p × D′ / D⌋). A lengthened unit keeps its milliseconds, so progress never grows on a rescale. AC-F2-1 gained the lengthening cases and a 10,000-sequence check. It answers #4 Open Question 4.
- #2 A2, #3 A1 and #9 A1: status-only edits marking #2 Open Question 4, #3 Open Question 7 and #9 Open Question 3 resolved.
Prior verdict resolved: First review
Findings:
- [RECOMMENDED, applied] Wording made stale by the merge. Lines 649 and 782 said #11 was "In design (parallel session)"; they now read Approved. Open Questions said the status edits to #2, #3 and #9 "wait for the designer's approval", while their headers record it; it now names the approved amendments.
- [RECOMMENDED, applied] The seam with #11: #10 D9 left the `heaped` slice to #11 and #11 left its fields to #10. It is closed on #11's side (see `save-and-run-lifecycle-review-log.md`).
- [Kept] The `[Blocked: #11]` tags on AC-D5-1, AC-D5-3, AC-D9-1 and AC-X-1 stay. Line 792 defines them as the system a test waits for, which can be stubbed until it is built; AC-D5-1's tag on the Approved #6 is the same kind.
- [Noted, not changed] #4 S9.5 still names "a tending change (including one #10 makes by itself)" as a segment boundary. #10 D5 makes none, so the clause is unreachable and harmless.
- [Noted, no action] `heap_yield_bp` and `heap_time_bp` have no `referenced_by` entries; no other GDD reads them.
Reviewed-Content-Hash: design/gdd/tending.md 9001b728203c05ee11d68a3fb5d79af1a0541741
Reviewed-Content-Hash: design/registry/entities.yaml 4f27c1017cd230d65cc691bd709dbfdccf7a9b9b
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/save-and-run-lifecycle.md bedf895c3cd85cd8f1833029b42d61393daa0de9
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md fde7ca12cc0760d7f700c340dd4b1396af0f990e
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md b8a2d1152de8dda93f2becf0f469991d28d09d12
Reviewed-Content-Hash: design/gdd/resources-and-caps.md 46bf91b96dc0df8210a131d8c6d4bbdc46b85906
Reviewed-Content-Hash: design/gdd/activity-slot-rest-and-away-time.md 590ea09f8deca34f136a658f2a2c4dba5da5b41a
Reviewed-Content-Hash: design/gdd/forge-and-proving.md 4d4841ed8007bbe7bed85825d8e5d9f5b494717c
Reviewed-Content-Hash: design/gdd/methods.md a0a9f06226b0652d351c0165f6fa3ec20b820288
Reviewed-Content-Hash: design/gdd/crafting-route.md 6717a3ee4c960c4c6818f44481b1e9b4d1f78ad3
Reviewed-Content-Hash: design/gdd/fight-and-dungeon-routes.md 879d5ed0595fe58b475a40114299114b06556ba0
Reviewed-Content-Hash: design/gdd/game-concept.md e29352a5020553afe841355ed38280e9f3ddec68
Reviewed-Content-Hash: design/gdd/systems-index.md c3618af4fc7be679b46a4b94ef251b0fa80e8c69
