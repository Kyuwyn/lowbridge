# Architecture Traceability Index
Last Updated: 2026-10-29
Engine: none configured (TypeScript 7.0 on Bun 1.4.3, plain DOM, as every ADR records)
Source: `/architecture-review full` of 2026-10-29 (`docs/architecture/architecture-review-2026-10-29.md`); TR-IDs in `docs/architecture/tr-registry.yaml`

No system GDDs exist. Requirements are extracted from the binding design documents (`design/DESIGN-PLAN-2026-10-18.md`, `design/IMPLEMENTATION-PLAN-2026-10-18.md`, `design/CHAPTER-2-BASIN-ROAD.md`) and grouped by the 13 systems in `design/gdd/systems-index.md`.

## Coverage Summary
- Total requirements: 58
- Covered: 44 (76%)
- Partial: 9
- Gaps: 5

## Full Matrix

| Requirement ID | Source | System | Requirement | ADR Coverage | Status |
|---|---|---|---|---|---|
| TR-grammar-001 | Plan Part D | Content grammar | One record vocabulary; the UI renders by field; fields outside the vocabulary fail validation | 0021 (rule 1), 0032 §1, 0034 | ✅ |
| TR-grammar-002 | Plan Part D, Impl plan | Content grammar | A restricted expression language in data, one evaluator shared by runtime and validator | 0021, 0024 assume it; none decides its grammar or safety | ⚠️ |
| TR-grammar-003 | Plan A16 | Content grammar | Route keys `g.t_<tag>` are derived counters; no gate crosses a chapter file; `shared.json` exempt | 0024, 0030 §6 | ✅ |
| TR-grammar-004 | Plan Part D | Content grammar | `g.<id>.attuned` is read-only and allowed only on `attune` records | 0023 amendment | ✅ |
| TR-grammar-005 | Plan Part D | Content grammar | Work kinds pay every member; a cross-chapter kind takes only `mod`, `held`, `at` | 0034 | ✅ |
| TR-grammar-006 | Plan Part D, Impl plan | Content grammar | Content is JSON modules concatenated in a fixed order; reveal order is array order | 0024 names the files; array-order reveal is in no ADR | ⚠️ |
| TR-time-001 | Plan A9 | Time and tempo | Tempo is `length`: instant, timed, continuous | 0022 | ✅ |
| TR-time-002 | Plan A9 | Time and tempo | One slot, a six-deep waiting list, an `autoStart` Rest; runs while away | 0022 | ✅ |
| TR-time-003 | Plan A9 | Time and tempo | A run that cannot pay its next second is refused; an encounter needs its whole reserve | 0022, 0032 §3 | ✅ |
| TR-time-004 | Plan A9 | Time and tempo | A timed bill is paid once; its `lock` applies at payment | 0027 §1 | ✅ |
| TR-time-005 | Impl plan | Time and tempo | Discoveries never stop activity; the stop conditions are enumerated | 0027 §4 | ✅ |
| TR-time-006 | Plan A9, Impl plan | Time and tempo | Bank 1:1, accrues only when nothing runs, never double-credited, acceleration per objective | 0007 as amended by 0025, 0027 | ✅ (see Conflict 4 on the cap) |
| TR-time-007 | Plan Part D, Impl plan | Time and tempo | A 1-second tick, elapsed-time settlement on return and load, `settle()` before every action | 0007 states the accounting; the tick and settle contract are only in the implementation plan | ⚠️ |
| TR-time-008 | Ch2 C2.6 | Time and tempo | A hobby slot at half pace beside the activity slot | 0031 §1 | ✅ |
| TR-res-001 | Plan A14 | Resources and recompute | Six derived fields, never saved, rebuilt after every mutation and on load | 0021 | ✅ |
| TR-res-002 | Plan A14 | Resources and recompute | Four contribution sources with their scales; `X.mod.Y` folded in before the payout | 0021 | ✅ |
| TR-res-003 | Plan Part D | Resources and recompute | A fixed-point recompute, bounded so a content cycle fails loudly | 0021 | ✅ |
| TR-res-004 | Plan A9 | Resources and recompute | Discounts stack and floor at half the listed amount | 0020, 0021 | ✅ |
| TR-res-005 | Ch2 | Resources and recompute | Focus as a second gauge; outings drain Strain and Focus in different proportions | 0031 §2 | ✅ |
| TR-res-006 | ADR 0032 | Resources and recompute | Drains are charged the same way reserves and tooltips read them | 0032 records the slot draining undiscounted while reserves read discounted, and decides nothing | ⚠️ |
| TR-save-001 | Plan Part D | Save and persistence | Saves hold authoritative history only, are versioned, and older versions are refused by name | 0025 §7, 0030 §7, 0031 §7 | ✅ |
| TR-save-002 | Impl plan | Save and persistence | IndexedDB storage (`current` + `backup`) with atomic transactions | — | ❌ GAP |
| TR-save-003 | Impl plan | Save and persistence | Export/import; malformed imports and unknown ids are refused without disturbing the running game | 0025 ("export unchanged"), 0031 §7 (effects only); the id-refusal rules for `attuned`, `active`, `waiting`, `fight` are only in code | ⚠️ |
| TR-save-004 | CLAUDE.md, `src/main.ts` | Save and persistence | One tab per profile (Web Locks) | — | ❌ GAP |
| TR-save-005 | Impl plan | Save and persistence | A fight and its dungeon room are saved mid-fight | 0026 §3, 0032 §4 | ✅ |
| TR-save-006 | Ch2 | Save and persistence | Per-browser UI preferences live in `localStorage`, outside the save | 0033 §5 | ✅ |
| TR-practice-001 | Plan Part F | Practice and knowledge | Practice grows within current understanding; no universal activity formula | 0013, 0034 | ✅ |
| TR-practice-002 | Plan A1 | Practice and knowledge | Every level pays; milestones at stated levels; per-level effects bounded by chapter | 0020 | ✅ |
| TR-practice-003 | Plan E6 | Practice and knowledge | Every later chapter patches an earlier payout, enforced by the validator | 0021 amendment | ✅ |
| TR-tech-001 | Plan A15 | Techniques and attunement | Learn, attune, use; places are a resource; a falling cap truncates the list; releases are logged | 0023 | ✅ |
| TR-tech-002 | Plan Part F | Techniques and attunement | Opposed pairs lock each other with `warn`; places run 3 → 4 → 5 | 0030 §2, §4 | ✅ |
| TR-tech-003 | Ch2 | Techniques and attunement | `held` is paid through one contribution path while attuned or while a preparation is in effect | 0031 §6 | ✅ |
| TR-tech-004 | Plan E8 | Techniques and attunement | Places reached never exceed methods some route holds at once (rule 74) | 0023 amendment, 0030 | ✅ |
| TR-bt-001 | Plan A5 | Breakthroughs | A mandatory core, N-of-M pointers and a bill that pays caps, unlocks and bank cap | 0025 §4, 0030 §4 | ✅ |
| TR-bt-002 | Plan Part F | Breakthroughs | A Direction is sphere-agnostic, never locks, and raises every carried sphere | 0030 §4 | ✅ |
| TR-bt-003 | Plan Part F | Breakthroughs | Titles are derived by ordered events; `title()` counts event `changes` | 0030 §5 | ✅ |
| TR-fight-001 | Plan A17 | Fights | Six stats, swings on Speed clocks, stats captured at the first second | 0026 §1, §3 | ✅ |
| TR-fight-002 | Plan E9 | Fights | Unseeded rolls in play through an injectable source; scripted in tests; seeded in the validator | 0026 §4 | ✅ |
| TR-fight-003 | Plan A17 | Fights | Exact win chance with graded verdicts and a flip hint; foe techniques inside it | 0026 §5, 0031 §4 | ✅ |
| TR-fight-004 | Impl plan | Fights | An undecided fight cannot be stopped or displaced; a finished fight survives automatic starts | 0026 §3, §6 | ✅ |
| TR-fight-005 | Impl plan | Fights | A cost budget for the exact projection, which the tooltip and Fight tab recompute | — (no performance budget exists anywhere) | ❌ GAP |
| TR-sites-001 | Ch2 | Sites and dungeons | A dungeon is a site with `rooms`; its `length` is derived; no new state | 0032 §1 | ✅ |
| TR-sites-002 | Ch2 | Sites and dungeons | Doors with a per-room reserve; a lost room resets alone | 0032 §3, §4 | ✅ |
| TR-sites-003 | Plan A12 | Sites and dungeons | Outings draw a strain budget; an emptied gauge stops with discoveries kept | 0022, 0027 §4, 0031 §2 | ✅ |
| TR-home-001 | Ch2 | Home | Places are exclusive slots; a swap keeps the piece; place pieces pay only while placed | 0033 | ✅ |
| TR-home-002 | Ch2 | Home | Every arrangement names a Home category | 0033 §1 | ✅ |
| TR-home-003 | Impl plan | Home | Taking down or swapping asks, and names a method it would release | 0027 §3, 0033 §2 | ✅ |
| TR-craft-001 | Plan Part D | Crafting | Make, keep, take: recipes are timed and stop at `max` or `fill`; preparations are instant with a `cost` | 0029 | ✅ |
| TR-craft-002 | Ch2 | Crafting | Lasting preparations sit in a saved `effects` list and reset rather than stack | 0031 §5 | ✅ |
| TR-ui-001 | Impl plan | Interface | The UI holds no game rules and calls the same engine surface as the route runner | 0027 says so for warnings only | ⚠️ |
| TR-ui-002 | Systems index risk | Interface | The UI names content ids directly; the validator does not catch a rename | — (mitigated by `bun run smoke`, undecided) | ❌ GAP |
| TR-ui-003 | Plan C.6 | Interface | One tooltip schema with a fixed block order | 0026, 0032 §6, 0034 | ✅ |
| TR-ui-004 | CLAUDE.md, Ch2 C2.6 | Interface | Desktop first, phone secondary; at ≤650 px the centre column is `display: contents` | 0011 sets the platform and leaves responsive behaviour open | ⚠️ |
| TR-ui-005 | Impl plan | Interface | Native keyboard controls and visible missing requirements | — (0011 leaves accessibility open; 0033 adds the quick bar only) | ❌ GAP |
| TR-ui-006 | Plan Part F, Impl plan | Interface | TypeScript on Bun, plain DOM, no runtime dependencies | Every ADR's Engine Compatibility table records the stack; none decides it, and 0011 explicitly selects no framework or rendering technology | ⚠️ |
| TR-pacing-001 | Plan E4 | Pacing and validation | Foundation 480–780 s, preference routes ≤1200 s, Circulation by 600 s, ridge 720–1440 s | 0028 | ✅ |
| TR-pacing-002 | Ch2 C2.7 | Pacing and validation | Second Direction 1800–3600 s, arrival ≤900 s, basin timed records ≤300 s, dungeons ≤600 s | 0030 names the chapter spec as the acceptance; 0032 adds the dungeon ceiling; no ADR amends 0028's ≤180 s rule for basin records | ⚠️ (see Conflict 3) |
| TR-pacing-003 | Plan E1, E9 | Pacing and validation | Routes play the real engine with a fixed seed; every record reachable; every dungeon cleared somewhere | 0026 §4, 0028, 0032 §7 | ✅ |

## Known Gaps


  ❌ TR-save-002: Impl plan → Save and persistence → IndexedDB with `current` + `backup` and atomic transactions
     Suggested ADR: "/architecture-decision Save storage: IndexedDB, backup slot and atomic writes"
     Domain: Persistence · Engine Risk: LOW (no engine; browser API)
  ❌ TR-save-004: CLAUDE.md → Save and persistence → one tab per profile via Web Locks
     Suggested ADR: fold into the save-storage ADR above ("single writer per profile")
     Domain: Concurrency · Engine Risk: LOW
  ❌ TR-ui-002: Systems index → Interface → UI addresses content by id, unchecked by the validator
     Suggested ADR: "/architecture-decision UI-to-content contract" (or a validator check that every id `src/ui.ts` names exists)
     Domain: Integration · Engine Risk: LOW
  ❌ TR-ui-005: Impl plan → Interface → keyboard controls and accessibility baseline
     Suggested ADR: "/architecture-decision Accessibility baseline" (after `/ux-design` writes `design/accessibility-requirements.md`)
     Domain: UI · Engine Risk: LOW
  ❌ TR-fight-005: Impl plan → Fights → no cost budget for the exact win-chance replay or for `recompute`
     Suggested ADR: "/architecture-decision Performance budgets" (tick, recompute, fight projection)
     Domain: Performance · Engine Risk: LOW

## Superseded Requirements

None. No requirement was superseded in this first run. ADRs 0002, 0004 and 0015 are Superseded, but no requirement traces to them.
