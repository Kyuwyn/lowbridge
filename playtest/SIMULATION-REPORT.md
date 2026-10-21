# Opening simulation report: 18 October 2026

Generated from the source JSON and the production `GameEngine`, using `scripts/routes.ts`. Every elapsed second is an ordinary one-second engine tick; starting bank is zero, and no route calls acceleration. This is deterministic content evidence, not human pacing or a browser smoke result.

## Outcome

**Current Foundation pacing under ADRs 0021-0025 (20 October, `bun run validate` on the integrated tree): channel-only 28.63 min, hollow-only 28.08 min of activity; target window 25-35 min; 113/113 records reachable across cold-start branches; the browser smoke replays both routes to Foundation at 1718 s and 1685 s.** Everything below is the 18 October run, taken before the sustained earners existed and before methods had to be attuned; it is retained as history only.

Both preserved Python route preferences reach Foundation within 45 minutes. Four independent cold-start histories witness all 41 source records, including competing home arrangements and the source-only future leads. The two additional histories deliberately buy optional furniture and homes before settling; their duration is coverage evidence and is not the opening route pacing target.

| History | Foundation | After-route total | Circulation / Qi Sense / Lore | Records witnessed | Unknown-raiser cap lines |
|---|---:|---:|---|---:|---:|
| channel-only | 38.83 min (2330 s) | 38.83 min | 2 / 4 / 3 | 29 | 3 |
| hollow-only | 40.33 min (2420 s) | 40.33 min | 2 / 5 / 3 | 24 | 2 |
| furnished-hollow | 72.33 min (4340 s) | 72.75 min | 3 / 6 / 4 | 39 | 7 |
| stones-and-storage | 61.58 min (3695 s) | 62.00 min | 3 / 4 / 4 | 37 | 6 |

The optional histories finish with one ferry run, proving the mill closure. Both buy the Lean-to, proving the Hayloft closure. `furnished-hollow` installs the mat, herb rack and strongbox; `stones-and-storage` installs the channel stones, herb rack and strongbox. A single four-span home cannot hold all five spans of arrangements, so these are separate witnesses.

## Difference from the retained Python approximation

The original Python route bodies and numbers remain unchanged. `python3 design/validation/opening-sim.py --real-json` now runs the original checks first, invokes the actual TypeScript route runner, and prints the difference. The original script still produces 31.33 minutes for channel and 30.83 for hollow. It approximates a practice action as a level instead of applying the increasing experience costs from Part C.

| Activity budget | Historical channel | Actual channel | Historical hollow | Actual hollow |
|---|---:|---:|---:|---:|
| Lore practice | 270 s | 360 s | 270 s | 360 s |
| Breath practice | 240 s | 600 s | 300 s | 840 s |
| Circulation practice | 120 s | 120 s | 240 s | 180 s |
| All other activities | 1,250 s | 1,250 s | 1,040 s | 1,040 s |
| Total | 1,880 s | 2,330 s | 1,850 s | 2,420 s |

The channel difference is +90 seconds of Lore and +360 seconds of breath practice: +7.50 minutes. The hollow difference is +90 seconds of Lore, +540 seconds of breath practice and −60 seconds of steady attention: +9.50 minutes. Real levels cost 60 × the next level in experience. The channel arrangement supplies its declared 1.5× practice rate. Each hollow sit supplies 60 experience; it does not grant a level. On the first sit the cap increase happens before that experience is applied.

No content duration was reduced to recover the original estimate. The baseline preference order is retained, including sorting ten herb bundles before buying the slip and choosing its preferred studies before saving for optional purchases.

## Part C.5 session checkpoints

| Event | C.5 hypothesis | Channel witness | Hollow witness |
|---|---:|---:|---:|
| Third sort; slip becomes visible | 1 min | 1.00 min | 1.00 min |
| Slip purchased | 4 min | 4.33 min | 4.33 min |
| Qi Sense 1; gathering and channel become visible | 6 min | 11.33 min | 5.33 min |
| Qi Sense 2; hollow becomes visible | 10 min | 13.33 min | 7.33 min |
| Lore 1; kit and rack become visible | 10 min | 5.33 min | 11.33 min |
| Qi Sense 3 reaches the initial wall | about 10 min | 16.33 min | 10.33 min |
| First route observation completed | 14-27 min route phase | 18.33 min | 18.33 min |
| Circulation opens | 14-27 min route phase | 34.83 min | 35.33 min |
| Mandatory core reaches Circulation 2 | 27-29 min readiness | 36.83 min | 38.33 min |
| Foundation completes and pauses | 29-31 min | 38.83 min | 40.33 min |

The preference order explains the reversed Lore/Qi Sense timing: the channel route studies Lore first; the hollow route practises breath first. Channel uses thirteen mill runs, the pouch, kit and channel arrangement, with all four supporting pointers. Hollow uses two mill runs and no home purchase, with three supporting pointers. Both pay ten herbs and enter settling with full qi. Their final bank is 0/21,600 seconds; settling creates the new checkpoint.

## Confirmed rule clarifications and edge case

- Opening Part C governs per-level numbers: Qi Sense adds one qi capacity; Circulation removes five seconds from each work task; Lore opens its listed gates. No future Vitality or teaching-rate system was added.
- Full qi is an entry threshold, not an additional qi spend. Ten herbs are paid when settling starts.
- The +50% home rate belongs to the channel exercise. It does not accelerate steady attention.
- A work reward threshold changes subsequent rewards: the tenth mill run pays the old wage; the eleventh pays the raised wage. First-sit cap increases precede its experience reward.
- Foundation adds two to the current Lore cap: five without Shu’s reading, six with it. Both standard routes finish at cap five.
- A cold start with three mill runs, a mat, three sorts, two mill runs, the slip, and three breath-level objectives reaches Qi Sense 3/3 and qi 4/5 at 498 seconds. The original `Qi Sense < cap` need blocked the remaining qi. Breath now remains available while either the family can grow or qi is below capacity. A resource objective fills the last qi without storing experience beyond the family cap.
- Foundation and faint trace are milestone flags, not capped economic resources. Their completion does not emit a misleading cap-raiser warning.
- Faint trace requires Circulation at least 2 and at least one level actually earned through steady attention. Starting and immediately stopping that exercise after channel training does not grant the source reward. Mixed routes can earn both discoveries by practising both sources; no automatic convergence was added.

## Unknown-raiser log, preserved verbatim

These lines name no currently available cap raiser. They are retained as playtest evidence, not counted as automatic failures. Some are a temporary discovery gap; timber and home space also reach the end of this opening’s authored capacity. The report collects log entries as ticks run, so the engine’s bounded on-screen log cannot erase earlier evidence.

### channel-only

- 16.33 min (980 s): Qi has reached 5/5. Further ways to raise this cap have not been discovered.
- 22.33 min (1340 s): Qi Sense has reached 4/4. Further ways to raise this cap have not been discovered.
- 22.33 min (1340 s): Qi has reached 6/6. Further ways to raise this cap have not been discovered.

### hollow-only

- 10.33 min (620 s): Qi has reached 5/5. Further ways to raise this cap have not been discovered.
- 29.33 min (1760 s): Qi has reached 7/7. Further ways to raise this cap have not been discovered.

### furnished-hollow

- 16.83 min (1010 s): Qi has reached 5/5. Further ways to raise this cap have not been discovered.
- 20.83 min (1250 s): Lore has reached 4/4. Further ways to raise this cap have not been discovered.
- 26.03 min (1562 s): Qi Sense has reached 4/4. Further ways to raise this cap have not been discovered.
- 26.33 min (1580 s): Qi has reached 6/6. Further ways to raise this cap have not been discovered.
- 39.33 min (2360 s): Qi Sense has reached 6/6. Further ways to raise this cap have not been discovered.
- 39.33 min (2360 s): Qi has reached 8/8. Further ways to raise this cap have not been discovered.
- 57.58 min (3455 s): Timber has reached 6/6. Further ways to raise this cap have not been discovered.

### stones-and-storage

- 16.33 min (980 s): Qi has reached 5/5. Further ways to raise this cap have not been discovered.
- 20.33 min (1220 s): Lore has reached 4/4. Further ways to raise this cap have not been discovered.
- 26.33 min (1580 s): Qi Sense has reached 4/4. Further ways to raise this cap have not been discovered.
- 26.33 min (1580 s): Qi has reached 6/6. Further ways to raise this cap have not been discovered.
- 39.08 min (2345 s): Timber has reached 6/6. Further ways to raise this cap have not been discovered.
- 58.83 min (3530 s): Home space has reached 4/4. Further ways to raise this cap have not been discovered.

## Full visibility chronology

Each row records when `GameEngine.visible(id)` first became true. Visibility is remembered after a resource is spent. The Foundation unlocker is the `settling` record; visibility does not imply that its core, support pointers or bill are ready. Future leads are visible records only, with no playable class or region implementation.

### channel-only

| Active time | Newly visible record IDs |
|---|---|
| 0.00 min (0 s) | `coin`, `herbs`, `home_space`, `mill_work`, `sort_herbs`, `hayloft`, `practice_mat`, `lean_to` |
| 1.00 min (60 s) | `jade_slip` |
| 4.33 min (260 s) | `qi`, `lore`, `qi_sense`, `circulation`, `breath_gathering`, `fragment_notes` |
| 5.33 min (320 s) | `field_kit`, `herb_rack` |
| 7.33 min (440 s) | `shu_reading` |
| 11.33 min (680 s) | `gather_herbs`, `channel_observe` |
| 13.33 min (800 s) | `fernhollow_observe` |
| 18.33 min (1100 s) | `stone`, `clear_channel` |
| 24.33 min (1460 s) | `sit_fernhollow` |
| 27.83 min (1670 s) | `coin_pouch` |
| 29.83 min (1790 s) | `timber`, `cut_timber` |
| 34.83 min (2090 s) | `channel_arrangement`, `channel_exercise`, `settling` |
| 38.83 min (2330 s) | `foundation`, `ferry_hauling`, `cottage`, `ridge_trail_observe`, `body_teaching`, `sword_teaching`, `earth_teaching`, `formation_teaching` |

### hollow-only

| Active time | Newly visible record IDs |
|---|---|
| 0.00 min (0 s) | `coin`, `herbs`, `home_space`, `mill_work`, `sort_herbs`, `hayloft`, `practice_mat`, `lean_to` |
| 1.00 min (60 s) | `jade_slip` |
| 4.33 min (260 s) | `qi`, `lore`, `qi_sense`, `circulation`, `breath_gathering`, `fragment_notes` |
| 5.33 min (320 s) | `gather_herbs`, `channel_observe` |
| 7.33 min (440 s) | `fernhollow_observe` |
| 11.33 min (680 s) | `field_kit`, `herb_rack` |
| 13.33 min (800 s) | `shu_reading` |
| 18.33 min (1100 s) | `sit_fernhollow` |
| 35.33 min (2120 s) | `steady_attention`, `settling` |
| 38.33 min (2300 s) | `faint_trace` |
| 40.33 min (2420 s) | `foundation`, `ferry_hauling`, `cottage`, `ridge_trail_observe`, `body_teaching`, `sword_teaching`, `earth_teaching`, `formation_teaching` |

### furnished-hollow

| Active time | Newly visible record IDs |
|---|---|
| 0.00 min (0 s) | `coin`, `herbs`, `home_space`, `mill_work`, `sort_herbs`, `hayloft`, `practice_mat`, `lean_to` |
| 2.50 min (150 s) | `jade_slip` |
| 5.83 min (350 s) | `qi`, `lore`, `qi_sense`, `circulation`, `breath_gathering`, `fragment_notes` |
| 6.83 min (410 s) | `field_kit`, `herb_rack` |
| 8.83 min (530 s) | `shu_reading` |
| 12.63 min (758 s) | `gather_herbs`, `channel_observe` |
| 14.23 min (854 s) | `fernhollow_observe` |
| 22.83 min (1370 s) | `stone`, `clear_channel` |
| 28.33 min (1700 s) | `sit_fernhollow` |
| 45.33 min (2720 s) | `steady_attention`, `settling` |
| 48.33 min (2900 s) | `faint_trace` |
| 54.33 min (3260 s) | `coin_pouch` |
| 55.33 min (3320 s) | `timber`, `cut_timber` |
| 62.58 min (3755 s) | `channel_arrangement` |
| 65.83 min (3950 s) | `strongbox` |
| 72.33 min (4340 s) | `foundation`, `ferry_hauling`, `cottage`, `ridge_trail_observe`, `body_teaching`, `sword_teaching`, `earth_teaching`, `formation_teaching` |

### stones-and-storage

| Active time | Newly visible record IDs |
|---|---|
| 0.00 min (0 s) | `coin`, `herbs`, `home_space`, `mill_work`, `sort_herbs`, `hayloft`, `practice_mat`, `lean_to` |
| 1.00 min (60 s) | `jade_slip` |
| 4.33 min (260 s) | `qi`, `lore`, `qi_sense`, `circulation`, `breath_gathering`, `fragment_notes` |
| 5.33 min (320 s) | `field_kit`, `herb_rack` |
| 7.33 min (440 s) | `shu_reading` |
| 11.33 min (680 s) | `gather_herbs`, `channel_observe` |
| 13.33 min (800 s) | `fernhollow_observe` |
| 22.33 min (1340 s) | `stone`, `clear_channel` |
| 28.33 min (1700 s) | `sit_fernhollow` |
| 34.08 min (2045 s) | `coin_pouch` |
| 36.08 min (2165 s) | `timber`, `cut_timber` |
| 44.08 min (2645 s) | `channel_arrangement` |
| 50.08 min (3005 s) | `strongbox` |
| 53.08 min (3185 s) | `channel_exercise`, `settling` |
| 61.58 min (3695 s) | `foundation`, `ferry_hauling`, `cottage`, `ridge_trail_observe`, `body_teaching`, `sword_teaching`, `earth_teaching`, `formation_teaching` |

## Per-record cold-start witnesses

A family witness requires its entry to be open; an action witness requires an earned completion/level; a lead witness requires visibility and its declared need. Existing Hayloft and visible resources count from their real initial state. The synthetic states used to challenge mandatory-core gates are never counted as reachability evidence.

| Record | Witness histories |
|---|---|
| `coin` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `herbs` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `timber` | channel-only, furnished-hollow, stones-and-storage |
| `stone` | channel-only, furnished-hollow, stones-and-storage |
| `qi` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `lore` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `qi_sense` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `circulation` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `home_space` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `foundation` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `faint_trace` | hollow-only, furnished-hollow |
| `mill_work` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `sort_herbs` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `gather_herbs` | furnished-hollow, stones-and-storage |
| `cut_timber` | furnished-hollow, stones-and-storage |
| `ferry_hauling` | furnished-hollow, stones-and-storage |
| `coin_pouch` | channel-only, furnished-hollow, stones-and-storage |
| `jade_slip` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `field_kit` | channel-only, furnished-hollow, stones-and-storage |
| `shu_reading` | furnished-hollow, stones-and-storage |
| `breath_gathering` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `fragment_notes` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `channel_exercise` | channel-only, stones-and-storage |
| `steady_attention` | hollow-only, furnished-hollow |
| `settling` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `channel_observe` | channel-only, furnished-hollow, stones-and-storage |
| `clear_channel` | channel-only, furnished-hollow, stones-and-storage |
| `fernhollow_observe` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `sit_fernhollow` | hollow-only, furnished-hollow |
| `hayloft` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `practice_mat` | furnished-hollow |
| `herb_rack` | furnished-hollow, stones-and-storage |
| `channel_arrangement` | channel-only, stones-and-storage |
| `lean_to` | furnished-hollow, stones-and-storage |
| `strongbox` | furnished-hollow, stones-and-storage |
| `cottage` | furnished-hollow, stones-and-storage |
| `ridge_trail_observe` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `body_teaching` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `sword_teaching` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `earth_teaching` | channel-only, hollow-only, furnished-hollow, stones-and-storage |
| `formation_teaching` | channel-only, hollow-only, furnished-hollow, stones-and-storage |

## Validation and limits

Executed: `bun scripts/validate.ts`; `bun test tests/content.test.ts` (9 tests); `python3 design/validation/opening-sim.py --real-json`; `python3 design/validation/b4-gates.py` (15 histories); and TypeScript checking. Content mutations prove rejection of an unknown gate path, a self-keyed optional purchase, an actual dependency cycle, an unreachable optional home record, a removed/weakened mandatory core, and an over-budget route. The mat test exercises real cold-start purchases, practice, the capped family and a qi refill objective. A mixed-route test branches before Foundation, earns the channel's two Circulation levels, completes three hollow sits, proves that first-start alone gives no faint trace, then earns a steady-attention level and receives it.

The no-self-key static check is intentionally bounded to this opening. It rejects an action’s own positive count as its first-use gate; the actual data’s own-repetition condition (`sit_fernhollow.reps < 3`) remains valid. A future externally set marker on the same action could need more precise dependency analysis. There are no class records in the opening, so this check does not claim implementation-level verification of the future class lattice; the retained B4 Python validator is still a separate design model.

Reachability is supported by explicit executable histories, not an exhaustive enumeration of every player ordering. The four branches cover every current record and both mutually competing furniture choices. Timing is ordinary simulated activity; it is not browser execution time or representative player decision time. Browser, persistence and UI evidence belongs in the separate smoke report. The 60-90 hour B1-B4 and Cloudwell age targets remain outside this village-to-Foundation implementation.
