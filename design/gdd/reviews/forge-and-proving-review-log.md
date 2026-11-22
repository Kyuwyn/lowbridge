# Review log: Forge and Proving

## Review — 2026-11-20 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: L
Specialists: none (lean; one general-purpose reviewer in a fresh context, with spot checks by the coordinating session). CD-GDD-ALIGN passed during authoring.
Blocking items: 0 | Recommended: 1 (applied before approval)
Summary: All 8 sections present, and every division goes through div_floor or ceil_div. Registry values match: clash_bp 5,000, fightless_ceiling_bp 20,000 and fightless_slack_ms 60,000 (G12's "max(2 × p, p + 60,000 ms)"), door thresholds 10,000–20,000 (#5's combat_score_win_floor and combat_score_max), and SPEED_BASE 100 (B11). S6 cap raises stay within #3's lo(b) and hi(b) (raise_min_bp 12,000, raise_max_bp 17,500). The pillars hold: the forge stays the milestone, B10 keeps a fightless source for every ingredient within the price ceiling (G12), and B6 rules out a dominant makeup.
Amendments reviewed in the same pass (changes to approved GDDs, all still approvable):
- #1 A4: adds the `affinity.widens` row (note 10), sets the affinity count to 4, and narrows `door.thresholds` to "exactly 2 entries; strictly ascending; each 10,000–20,000" (#1 line 351). It agrees with #6 S4 and G6 and breaks no loader step. #1's own fixtures keep `[10, 20]` by loading against a test schema (R8.2), and #6's AC-A4-1 tests the shipped bounds.
- #2 Open Question 1: closed by #6 (G5, G6, S3, S9). No rule in #2 changes.
- #3 Open Question 1: `resource.cap` keeps `sealInput: yes`. No seal reads a cap (G6.4), so K8.2 holds trivially.
- #5 Open Questions 1, 3 and 5: thresholds are 10,000–20,000 (A4, S4), the baseline stays the challenger in route fights (G13.2), and SPEED_BASE 100 stays (B11).
Prior verdict resolved: First review
Findings:
- [RECOMMENDED, applied] S6 Output Range: the claim that D × P_i stays below 2^53 − 1 held only if one affinity widens a store. The schema lets all four affinities widen one store, so C can reach 4.4 × 10^7 and the product 3.3 × 10^16. The note is corrected, B12 now requires D × C ≤ 2^53 − 1 for every widened store in all 30 cases, and AC-B12-2 tests the boundary (9.0 × 10^15 passes, 1.65 × 10^16 fails). Shipped content (caps ≤ 40) is far inside the bound. The coordinating session checked the reviewer's arithmetic against #1 R4: `ingredient.contrib` ±1,000,000, `realm.makeupSize` up to 11, `affinity.widens` distinct only within one affinity.
- [Applied with it] Dependencies, row #4: status updated from "In design (parallel session)" to Approved.
Reviewed-Content-Hash: design/gdd/forge-and-proving.md 3741f916f75033a13b8b1af49a0a354bd02e32db
Reviewed-Content-Hash: design/registry/entities.yaml 9529469814620befb7cb769ac89ed7512db71414
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md 50eb7bf075260e4c8f6567b2b0a1aa7564c9ac7e
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md 4f46616596278495a0f6c4ae3b70018905914d00
Reviewed-Content-Hash: design/gdd/resources-and-caps.md 8408f82f6ebf803c45521608461d4339886015ba
Reviewed-Content-Hash: design/gdd/combat-resolver.md 003399e275248376d983bf7e3b88388881bb1072
Reviewed-Content-Hash: design/gdd/activity-slot-rest-and-away-time.md 2c363d8b5241cfd85c5a95956e6c67feea9d7fc7
Reviewed-Content-Hash: design/gdd/game-concept.md 7e33d755de6bc47e8933a7e5e9c61fbb8d0886c3
Reviewed-Content-Hash: design/gdd/systems-index.md 5101549ca7b98e0f115c54668d29a10c10396e63
