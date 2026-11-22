# Review log: Save and Run Lifecycle

## Review — 2026-11-21 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: L
Specialists: none (lean; one general-purpose reviewer in a fresh context, with spot checks by the coordinating session). CD-GDD-ALIGN passed during authoring, with three advisories carried into the GDD.
Blocking items: 1 (applied before approval) | Recommended: 1 (applied before approval)
Summary: All 8 sections present. Pillar 4 holds: every failed load reaches the Refused screen, which offers New run, Copy save and Load save and writes nothing, so no path loses a forged run silently. Each slice is the non-derived state its owner declares (#3 K2, #4 S12, #6 G10, #7 W12, #10 D9), with derived fields rebuilt by the recompute. Registry values match: WRITE_FAIL_PROMPT 3, IMPORT_MAX_BYTES 1,048,576, SAVE_MAX_BYTES 65,536, and IMPORT_MAX_BYTES stays at or above SAVE_MAX_BYTES.
Merge: merged at cf0eeda, after #10 (a52014d). See `tending-review-log.md` for the conflict resolution.
Amendments reviewed in the same pass (all still approvable; the headers record the designer's approval):
- #1 A6: door and affinity ids join the ids a forged save needs, so no shipped content can make #11 refuse a forged save (D4.2). #1 Open Question 4 is resolved by the designer's decision in D11.2: saves may be wiped until the first public build, refused by name.
- #7 A2: before the commit, a saved resource's `held` and mark reset to their run-start values (D3.8, D4.2). An ingredient held or marked above 0 is still refused.
Prior verdict resolved: First review
Findings:
- [BLOCKING, applied] The tending slice was unspecified. #11 and #10 were written in parallel, and each deferred the slice to the other. D1.3 said "#10's fields (Open Question 1)", and AC-D3-4 and AC-D3-6 were blocked on #10. The fix follows #10's D5 and D9:
  - D1.3 now saves `heaped`, a sparse set of source ids, empty at run start.
  - D3.8 drops a `heaped` id that is no longer tendable, with a notice line, and never refuses a save for one.
  - D3.13 says the gap is one segment, because `heaped` changes only by an accepted `setHeap`.
  - Open Question 1 is resolved, and the interaction, dependency and cross-reference rows are updated.
  - AC-D3-4, AC-D3-6, the write criterion and AC-J4-2 now test the slice. AC-J4-2's new case is the skim saved heaped at 6,000 of 6,250 ms, loaded once it is no longer tendable, which clamps to 4,999 of 5,000.
- [RECOMMENDED, applied] D9.2's dry run started at D3.4, so pasted text that does not parse had no defined outcome at a trust boundary. It is now refused as "This is not a save" and changes nothing. No integrity check runs on pasted text, since the checksum guards storage and only D4 catches hand edits (D9.3). AC-D9-2 gained the case.
- [Discarded] The reviewer said the Fixtures paragraph cites an Open Question 4 that has no row. The row exists: the two-slot write order and fence, owned by the Technical Director (Storage ADR).
- [Discarded] The reviewer asked for a rationale for "a mark above its cap keeps its value" (D3.11). A mark is a high-water mark, not a target, and #3 makes one above the cap legal (`resources-and-caps.md` lines 195 and 514).
Reviewed-Content-Hash: design/gdd/save-and-run-lifecycle.md bedf895c3cd85cd8f1833029b42d61393daa0de9
Reviewed-Content-Hash: design/registry/entities.yaml 4f27c1017cd230d65cc691bd709dbfdccf7a9b9b
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/tending.md 9001b728203c05ee11d68a3fb5d79af1a0541741
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
