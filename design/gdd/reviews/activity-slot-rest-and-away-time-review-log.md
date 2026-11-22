# Review log: Activity Slot, Rest and Away Time

## Review — 2026-11-20 — Verdict: APPROVED
Review mode: lean · Workflow: full
Scope signal: M
Specialists: none (lean; one general-purpose reviewer in a fresh context, with spot checks by the coordinating session). CD-GDD-ALIGN passed during authoring.
Blocking items: 0 | Recommended: 4 (1 applied before approval)
Summary: All 8 sections present. The registry constants match the text (bank_cap_ms 1,800,000, rest_speed 2, away_cap_ms 86,400,000, unit_floor_ms 1,000, units_max 100,000, dt_max 2^50), and the five formulas are registered. No formula overflows: the largest product is 86,400,000² ≈ 7.46 × 10^15 in F2, and every divisor is at least 1. Pillar 4 holds: rest fills idle time by itself, the bank is spent automatically, switching is free, and nothing has to be held, repeated or timed. It answers #3's Open Question row 3 at the layer #4 owns: the slot itself is no attention tax. How often the provisional chain makes the player switch (about 10 switches in 2 min) goes to Crafting route (#8) with a proposed 30 s median run floor, so K1 is not reopened and #3 needs no amendment.
Prior verdict resolved: First review
Findings:
- [RECOMMENDED, applied] Dependencies, line 759: "#6–#13 are undesigned" was stale once #6 existed; it now says #6 lists this system and #7–#13 are undesigned.
- [RECOMMENDED] Formulas F3, F4 (net > 0) and F5, and their registry expressions: write the named `ceil_div` helper from #1 and #2 instead of ⌈x/y⌉. The meaning is already the same.
- [RECOMMENDED] F1: add one sentence saying why the bank cannot saturate in the middle of a continuous segment (saturation needs a stop event, which ends the segment).
- [RECOMMENDED] Now that #6 is designed: drop the **Blocked on #6** tag from AC-X-2 once #6's consumption rule is confirmed to match S4.4, and close Open Question 5 (do route fights read the Foundation after the forge?) against #6 G13.2.
Reviewed-Content-Hash: design/gdd/activity-slot-rest-and-away-time.md 2c363d8b5241cfd85c5a95956e6c67feea9d7fc7
Reviewed-Content-Hash: design/registry/entities.yaml 9529469814620befb7cb769ac89ed7512db71414
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md a63d8fba9b7142eeb43791f061e2e1533c429b43
Reviewed-Content-Hash: design/gdd/content-records-and-schema.md 50eb7bf075260e4c8f6567b2b0a1aa7564c9ac7e
Reviewed-Content-Hash: design/gdd/modifier-pipeline-and-recompute.md 4f46616596278495a0f6c4ae3b70018905914d00
Reviewed-Content-Hash: design/gdd/resources-and-caps.md 8408f82f6ebf803c45521608461d4339886015ba
Reviewed-Content-Hash: design/gdd/combat-resolver.md 003399e275248376d983bf7e3b88388881bb1072
Reviewed-Content-Hash: design/gdd/forge-and-proving.md 3741f916f75033a13b8b1af49a0a354bd02e32db
Reviewed-Content-Hash: design/gdd/game-concept.md 7e33d755de6bc47e8933a7e5e9c61fbb8d0886c3
Reviewed-Content-Hash: design/gdd/systems-index.md 5101549ca7b98e0f115c54668d29a10c10396e63
