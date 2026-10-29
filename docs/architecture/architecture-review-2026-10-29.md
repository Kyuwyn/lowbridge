## Architecture Review Report
Date: 2026-10-29
Mode: full
Workflow: full
Engine: none configured (`engine.*` absent from `project.yaml`); every ADR records "None — TypeScript 7.0 on Bun 1.4.3, plain DOM"
GDDs Reviewed: 0 (the only file in `design/gdd/` is `systems-index.md`; requirements were drawn from the binding design documents, see Scope)
ADRs Reviewed: 34 (`docs/architecture/adr-0001`–`adr-0034`, at commit 449ba2b): 31 Accepted, 3 Superseded (0002 by 0025, 0004 by 0014, 0015 by 0030)

Reviewed-Content-Hash: docs/architecture/adr-0001-campaign-identity.md 5f7319746d1cb0101233b792c096905f35abd52a
Reviewed-Content-Hash: docs/architecture/adr-0002-lifespan-and-retries.md 85502f176e77987a0c14a36119a49ac099b4ef37
Reviewed-Content-Hash: docs/architecture/adr-0003-opening-anchors.md 17f037d72b3c8d339886fa5922c7250c0f60803b
Reviewed-Content-Hash: docs/architecture/adr-0004-wider-world-and-paths.md 8c146142e5b93fe1ca1e2fb2267e62459ac6d7f6
Reviewed-Content-Hash: docs/architecture/adr-0005-campaign-progression.md e2ac39e12921bf1796a2fb4a101cae0c44df59eb
Reviewed-Content-Hash: docs/architecture/adr-0006-world-and-residence.md 3eecc15ad897e37c648560288c4290e5babe3d6c
Reviewed-Content-Hash: docs/architecture/adr-0007-away-time-and-acceleration.md 72f57936b3a8baaeb80b0129cf4ee6e30813e491
Reviewed-Content-Hash: docs/architecture/adr-0008-optional-combat.md a498bed18f8f86e28a795c569d736a7a896d5804
Reviewed-Content-Hash: docs/architecture/adr-0009-work-and-crafting-resources.md bf77e72c0a48b2d675cc85c897b7947330ecae98
Reviewed-Content-Hash: docs/architecture/adr-0010-sects-and-relationships.md 169f4fa5159d259f8aa429ef683d2b1ffadeec83
Reviewed-Content-Hash: docs/architecture/adr-0011-presentation-and-platform.md af38f690d086705169a5001fba80a00b48042261
Reviewed-Content-Hash: docs/architecture/adr-0012-second-breakthrough-arc.md 43bde32540179387ce40122cfd61e3b77868c8bb
Reviewed-Content-Hash: docs/architecture/adr-0013-knowledge-and-practice.md e5b67ee48da8943bb622f89e02ca525617fbb248
Reviewed-Content-Hash: docs/architecture/adr-0014-early-class-advancements.md af7acb7a0edb4338d88db0fa61db1bc28deca8e2
Reviewed-Content-Hash: docs/architecture/adr-0015-cumulative-class-masteries.md e6038d9cf5223e9af3c763d797f4b062aceaea13
Reviewed-Content-Hash: docs/architecture/adr-0016-third-breakthrough-classes.md 4667fa0d748f4a5ebee5b5d4f32476552612dfc5
Reviewed-Content-Hash: docs/architecture/adr-0017-fourth-breakthrough-choice-breadth.md 2f5c34f84f2fd3c627bd16c003ebb18fc18e5c81
Reviewed-Content-Hash: docs/architecture/adr-0018-first-defining-trial.md bae85795e0352414c13d958cd771556551595497
Reviewed-Content-Hash: docs/architecture/adr-0019-early-campaign-pacing.md 1d5fb42d35408a9d0f98740aa766ec472214c41b
Reviewed-Content-Hash: docs/architecture/adr-0020-knowledge-woven-into-systems.md c949b76ef01f21ebb18496b75ae6ed637b50a45a
Reviewed-Content-Hash: docs/architecture/adr-0021-compounding-vocabulary.md eab8d749ba9e26cce71badfa02881c8e5df8e838
Reviewed-Content-Hash: docs/architecture/adr-0022-chore-tempo.md 0a56fe0c765e5df634ecab89c6be8ddf35f430b1
Reviewed-Content-Hash: docs/architecture/adr-0023-techniques-and-attunement.md ca08b83b02b7af067419b5bd3693427bfa0003e7
Reviewed-Content-Hash: docs/architecture/adr-0024-route-keys.md 61e774164808350aec15d6fc76f4f438a54b108a
Reviewed-Content-Hash: docs/architecture/adr-0025-lifespan-and-checkpoints-cut.md 683f1c469e555d52f1a4ffda0852796caa093cfe
Reviewed-Content-Hash: docs/architecture/adr-0026-combat-exchanges.md 09ab7447fbb7e5ecbc49c8ad103365d7917431d0
Reviewed-Content-Hash: docs/architecture/adr-0027-locks-at-payment-and-stops.md 11b6730b55cae3fef8fb72d2788c02095b76690f
Reviewed-Content-Hash: docs/architecture/adr-0028-ten-minute-foundation.md a656fef645e8855face67d3e27f50314a33f8c7c
Reviewed-Content-Hash: docs/architecture/adr-0029-crafting-workbench-recipes-preparations.md 34743a50bc529ab607a44c5ea55a4641b7911001
Reviewed-Content-Hash: docs/architecture/adr-0030-sphere-techniques.md bebefe10852331b01bf7ff2f794ffeb3491bf740
Reviewed-Content-Hash: docs/architecture/adr-0031-basin-road-systems.md a39b0e37e4b6bd60e4d8afc290eb85f57a8f9439
Reviewed-Content-Hash: docs/architecture/adr-0032-dungeons-rooms-in-one-run.md 616780d8f1de89876c8c88951ee42fac40a99081
Reviewed-Content-Hash: docs/architecture/adr-0033-home-lists-place-swaps-quick-bar.md 846e95d9b006040282c0887a6699a3ebbbe16a60
Reviewed-Content-Hash: docs/architecture/adr-0034-work-kinds-and-condensed-knowledge-cards.md 88dd9639322f5dc6ed77a98eb75cbac9976bcc77
Reviewed-Content-Hash: design/gdd/systems-index.md 0e4358860a80d633831b561d1d99121ed059f72b
Reviewed-Content-Hash: docs/architecture/tr-registry.yaml 105abc1564acf5ca5fd31d3bbdcb5660ca7a49fd
Reviewed-Content-Hash: project.yaml 15b73de577c129033d30f0ed88bb090b1761d98a
Reviewed-Content-Hash: .claude/docs/technical-preferences.md 5460715c69ab1de57bff5b143bca6e41f1d1424d
Reviewed-Content-Hash: .claude/skills/architecture-review/SKILL.md 1a9d28aadbcbd26b5fc6b8ed1c64d73ae82b7b73
Reviewed-Content-Hash: .claude/skills/architecture-review/references/1-load.md 9a65759ebdbb2cb1f9744775bfed18cb25e76347
Reviewed-Content-Hash: .claude/skills/architecture-review/references/2-extract-requirements.md d08ea0b0e9ab9760b0d8bfe0cd9115f0bc40f8e2
Reviewed-Content-Hash: .claude/skills/architecture-review/references/3-traceability.md bb7b6b65c5e5e5b8869fa692413aa831615dede7
Reviewed-Content-Hash: .claude/skills/architecture-review/references/4-conflicts.md 0d30f8173b23248a32523a365b606dd1ce9642ab
Reviewed-Content-Hash: .claude/skills/architecture-review/references/5-engine.md 318ecbc1361d430badaf5dd8ce4cfc6ab0dff0ca
Reviewed-Content-Hash: .claude/skills/architecture-review/references/6-document-coverage.md dcce78482ec2ce60048989b6f9d1f797dd0a9a0e
Reviewed-Content-Hash: .claude/skills/architecture-review/references/7-report.md a007fd66bdac87812dc272e4b14cd231174e979d
Reviewed-Content-Hash: .claude/skills/architecture-review/references/8-write.md bf6d8946fc7b9e19eda7f65503a5c8f593a0d2b1
Reviewed-Content-Hash: .claude/skills/architecture-review/references/9-handoff.md fd5f681f4c3517c6a2e388c6d78075d82dded22e

---

### Scope and how this run differs from the template

| Template input | State | What this run did |
|---|---|---|
| `docs/architecture/adr-*.md` | 34 files, each with `## Status`, `## GDD Requirements Addressed`, `## Engine Compatibility`, `## ADR Dependencies` | Read in full; statuses from `## Status` |
| `design/gdd/*.md` (GDDs) | Only `systems-index.md` | The systems index's 13 systems as the system list; technical requirements extracted from `design/DESIGN-PLAN-2026-10-18.md` Parts A, D, E, F, `design/IMPLEMENTATION-PLAN-2026-10-18.md`, `design/CHAPTER-2-BASIN-ROAD.md` C2.6–C2.7 and the index's risk table |
| ADR `## GDD Requirements Addressed` | Every ADR says "No system GDD exists yet" and names its systems | Coverage judged from each ADR's decision text against the extracted requirements |
| `docs/architecture/tr-registry.yaml` | Absent | TR-IDs assigned fresh (first run) |
| `docs/architecture/architecture.md` | Absent | Phase 6 NOT ASSESSED |
| `docs/engine-reference/` | Absent | Phase 5 NOT ASSESSED |
| `docs/consistency-failures.md` | Absent | No known conflict-prone areas to surface |

Freshness check: `RECEIPT: NONE` (first review). The review began on commit 01bc60c, where the ADRs still sat in `design/decisions/` without template sections; the branch was fast-forwarded to 449ba2b (the retrofit) and every finding below was re-checked there.

ADRs 0001–0019 are design-interview decisions (campaign shape, story, progression intent) and carry few technical requirements. ADRs 0020–0034 are the architectural decisions the build implements.

---

### Traceability Summary
Total requirements: 58
✅ Covered: 44
⚠️ Partial: 9
❌ Gaps: 5
❓ Not assessed: 0 (every covering ADR is `Accepted`; no requirement rests on a Superseded or Proposed ADR)

Out of scope and not counted: the breakthrough-4 defining trial and B4 roster (ADRs 0017, 0018). They still describe the superseded class model, and ADR 0030 defers their rewrite to the chapter that designs them.

### Traceability Matrix

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

### Coverage Gaps (no ADR exists)

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

### Cross-ADR Conflicts

Known conflict-prone areas: none recorded (`docs/consistency-failures.md` does not exist).

The retrofit of 29 October settled two of the five conflicts the first pass found: ADR 0002 and 0015 now read `Superseded`, and ADRs 0016, 0023, 0024 and 0026 carry Ordering Notes naming what ADR 0030 changed in them. Three remain. Their common cause is that a later ADR's supersession list leaves out an earlier ADR it contradicts, so the earlier body still reads as current.

## Conflict 1: ADR-0020 vs ADR-0028 and ADR-0025/0030
Type: State (validator bands, save versions)
ADR-0020 claims (`docs/architecture/adr-0020-knowledge-woven-into-systems.md:31`): the measured routes "must remain inside the opening's 35-45-minute Foundation window and the ridge's 90-240-minute waystation window, which `bun run validate` enforces", and "Saves from versions 3 and 4 are credited".
ADR-0028 claims: Foundation 480–780 s and the ridge 720–1440 s are the one bound. ADR-0025/0030 claim every save before v7 is refused.
Impact: ADR 0028's supersession list does not name ADR 0020, so 0020 reads as current. An author tuning knowledge effects from 0020 would aim at windows three to four times too long and expect a v3 save to load.
Resolution options:
  1. Amend ADR 0020 to point at 0028 for the bands and at 0025/0030 for saves, and name 0020 in 0028's Supersessions (recommended).
  2. Strike the two sentences from 0020.

## Conflict 2: ADR-0028 vs `design/CHAPTER-2-BASIN-ROAD.md` C2.7
Type: Performance (pacing budget)
ADR-0028 claims (`docs/architecture/adr-0028-ten-minute-foundation.md:16`): "Any outing, sitting or breakthrough: at most 180 s — every timed record."
The chapter spec and `BASIN_TIMED_CEILING = 300` (`scripts/validate.ts:57`) allow basin timed records up to 300 s.
Impact: The validator enforces the spec, so the build is consistent, but no ADR records the relaxation. ADR 0030 makes the chapter spec's bands "the acceptance" without naming 0028.
Resolution options:
  1. Amend ADR 0028: 180 s for village and ridge, 300 s for the basin, per the chapter spec (recommended).
  2. Bring basin records back under 180 s.

## Conflict 3: ADR-0007 vs ADR-0025, ADR-0030 and the design plan
Type: Pattern (bank cap)
ADR-0007 claims (`docs/architecture/adr-0007-away-time-and-acceleration.md:12`): "A generous fixed cap allowing a few days of stored time without needing upgrades."
ADR-0025 §5 says "a generous cap raised by progression"; ADR-0030 §4 has each Direction grant bank cap; design plan Part F says "1 h at start, raised by progression".
Impact: Two models of the same cap in Accepted ADRs, and ADR 0025 calls the bank "unchanged" while describing the other one.
Resolution options:
  1. Amend ADR 0007's Storage limit row to "starts at 1 h; raised by breakthroughs", and mark its retry row void per 0025 (recommended).

Lesser drift, not counted as conflicts:
- ADR 0026 §1's "raised by" table still names Body and Sword Disciple. Its Ordering Note says ADR 0030 made these held figures; the table was not rewritten.
- ADR 0016 is `Accepted` although ADR 0030 supersedes its roster and gates. Its Ordering Note says so, and its prepared-milestone rule stands.
- ADR 0022 says Rest ends when Vigor and Life are full, but Rest also fills Focus (`src/data/opening.json:41`, per ADR 0031 §2).
- ADR 0003, 0007 and 0019 still describe pausing at a discovery, which ADR 0027 §4 replaced. ADR 0027 amends 0007 only.

### ADR Dependency Order

`bash .claude/scripts/adr-dep-graph.sh`: ADRS 34, 113 edges, no `CYCLE`, no `BLOCKED_BY_CYCLE`, no `NO_DEPS_SECTION`, no `UNFILLED_DEPS`. No edge points to a Superseded or Proposed ADR. 0002, 0004 and 0015 are depended on by nothing, and the Ordering Notes list them as "cited but not listed".

Recommended order (`ORDER:`, as emitted):
0001, 0002, 0003, 0011, 0004, 0005, 0006, 0007, 0009, 0010, 0008, 0022, 0012, 0013, 0014, 0020, 0023, 0015, 0016, 0021, 0024, 0027, 0017, 0026, 0034, 0018, 0029, 0019, 0025, 0028, 0030, 0031, 0032, 0033

### GDD Revision Flags

Phase 5b runs only on HIGH RISK engine findings, and with no engine there are none. The binding design documents do, however, contradict accepted ADRs. They are listed here, not written into the systems index, because no system row points at these documents:

| Document | Assumption | Reality (from ADR) | Action |
|---|---|---|---|
| `design/DESIGN-PLAN-2026-10-18.md` Part D | "Saves are **v6** … Saves before v6 are not loadable" | v7; v6 refused (ADR 0030 §7, 0031 §7, `src/persistence.ts:5`) | Revise |
| `design/DESIGN-PLAN-2026-10-18.md` Part A rules 2, 6 | A class adds mastery tags, raises its line +3 and closes same-tier rivals | Superseded by ADR 0030 (Part F records it, the rule text is unchanged) | Revise or strike |
| `design/IMPLEMENTATION-PLAN-2026-10-18.md` | Scope "four exclusive First Directions and their classes"; save **v6** | ADR 0030 (one Direction, titles), v7; no mention of crafting, hobby, Focus or dungeons (ADRs 0029, 0031, 0032) | Revise |

### Engine Compatibility Issues

Engine validation: NOT ASSESSED — no engine configured (`engine.name` unset in `project.yaml`). No `docs/engine-reference/` exists, so there is no deprecated-API list to check against, and the specialist consultation was skipped.

What could be checked:
- ADRs with an Engine Compatibility section: 34 / 34.
- Version consistency: all 34 record the same "None — TypeScript 7.0 on Bun 1.4.3, plain DOM", which matches `package.json` (`typescript` 7.0.2) and `bun --version` (1.4.3).
- Post-Cutoff APIs Used: none claimed by any ADR.
- Not sourceable: IndexedDB and Web Locks, the two browser APIs the save rests on. No ADR names them (see TR-save-002, -004).

### Architecture Document Coverage

Architecture document coverage: NOT ASSESSED — no `docs/architecture/architecture.md`. The nearest equivalents are the CLAUDE.md DeepInit block (which CLAUDE.md itself calls stale since chapter two) and `.ai/docs/components/*.md`; this review did not grade them.

---

### Verdict: FAIL

Two Core-layer requirements have no ADR: how saves are stored (TR-save-002) and how a profile is kept to one writer (TR-save-004). Save and persistence sits in the systems index's Core layer and is one of its four high-risk systems. The code does implement both (`src/persistence.ts`, `src/main.ts:160`); what is missing is the decision record, so a change to either has nothing to be checked against.

Also recorded, each of which alone would keep the verdict from PASS:
- Engine validation: NOT ASSESSED (no engine configured).
- Architecture document coverage: NOT ASSESSED (no `architecture.md`).
- Three cross-ADR conflicts. Each is stale text in an earlier ADR, not two live rules; the validator and code follow the later ADR.

### Blocking Issues (must resolve before PASS)
1. Write an ADR for save storage and single-writer access (TR-save-002, TR-save-004).

### Required ADRs
1. Save storage and single-writer access: IndexedDB `current` + `backup`, atomic writes, Web Locks, import refusal rules (TR-save-002, -003, -004). Core.
2. Platform stack: TypeScript on Bun, plain DOM, no runtime dependencies, the 1 s tick and the `settle()` contract (TR-ui-006, TR-time-007). Foundation.
3. Expression language: the restricted grammar, its one shared evaluator, and why it does not use `eval` (TR-grammar-002). Foundation.
4. UI-to-content contract: which content ids the UI may name, and a check for them (TR-ui-001, TR-ui-002). Presentation.
5. Performance budgets: tick, recompute and the fight projection (TR-fight-005). Polish.
6. Accessibility baseline, after `/ux-design` (TR-ui-005, TR-ui-004). Presentation.

Housekeeping, not new ADRs: amend 0020, 0028 and 0007 per Conflicts 1–3, and the 0026 §1 table.
