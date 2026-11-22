## Cross-ADR Review Report (partial)

Date: 2026-11-22 (second version, same day; it replaces the first, which contained errors listed under Corrections)
Mode: full / guided
Reviewed: `master` at 137737d. This is the attempt that the restart branch (`restart-2026-11-19`) archives under `archive/2026-11-19/`. On `master`, `design/gdd/` holds only `systems-index.md`, so the review covered the ADRs. The restart's GDDs are not on `master` and have their own cross-GDD review of the same date; this report says nothing about them.
Not read: see Coverage. This run did **not** read all 39 ADRs in full.
Baseline: `docs/architecture/architecture-review-2026-10-29.md` (verdict FAIL, three cross-ADR conflicts left as housekeeping).

### Coverage

`/review-all-gdds` stops below two system GDDs. At the owner's request it was pointed at the ADR corpus instead. The two `game-designer` sub-agents the skill prescribes could not start: a context-mode hook rewrites the Agent input after auto mode reviews it, so both calls were refused twice. The work ran in the main session and was narrower than the skill intends.

| Input | What was done |
|---|---|
| All 39 ADRs | Pattern scans only: status and supersession lines, lifespan and retry wording, "four directions", pacing figures, sects, post-Reedmarket terms, removed record ids |
| ADR-0007, 0020, 0028 | Read in full |
| ADR-0026 | Lines 1–70 and its Ordering Note |
| Ordering Notes of ADR-0001, 0003, 0005, 0008–0010, 0012–0014, 0017, 0018 | Read |
| ADR-0035 to 0039 | Headers only (all Accepted, 2026-10-29) |
| `design/game-brief.md`, `design/gdd/systems-index.md` | Read in full |
| `design/CHAPTER-2-BASIN-ROAD.md` | C2.7 only |
| `design/DESIGN-PLAN-2026-10-18.md` | Bank and tempo lines only (rules 9 and 13, B.6, C.1 bank row) |
| `architecture-review-2026-10-29.md` | Headings, Conflicts 1–3, verdict |
| `BRIEF.md`, `CAMPAIGN-OUTLINE.md`, `CULTIVATION-CLASS-MAP.md`, `PACING-DRAFT.md`, `IMPLEMENTATION-PLAN-2026-10-18.md`, `tr-registry.yaml` | Not read |

### Corrections to the first version

The first version scanned ADR bodies for stale wording without reading every Ordering Note, which is where this project records what a later ADR overtakes. Checked against the notes, these claims were wrong and are withdrawn:

- **B1** said ADR-0020 had no note pointing at ADR-0028. It has one (`adr-0020-knowledge-woven-into-systems.md:62`). Only the reverse pointer was missing.
- **W2** (ADR-0026 status does not name ADR-0031 and 0032). Its Ordering Note (`adr-0026-combat-exchanges.md:93`) names both, which is how every partly amended ADR here is marked. The quote attributed to ADR-0031 was ADR-0032's.
- **W4** (ADR-0010 Sects not deferred). Its Ordering Note (`adr-0010-sects-and-relationships.md:47`) says sects are outside the current slice and nothing implements them.
- **W5** (ADR-0012 and 0014 still assert four directions). Both Ordering Notes point at ADR-0030, the same treatment that cleared the lifespan wording elsewhere. The example cited from ADR-0007 line 27 did not exist.
- **W7** (pillar text behind ADR-0030). ADR-0001's Ordering Note (`adr-0001-campaign-identity.md:62`) already sends readers to ADR-0030 and keeps the pillars. The claim that held methods are freely reversible ignored the exclusive technique pairs.
- The quote "cultivation-first; combat optional" is not in the brief. Line 29 reads "Optional fights decided by Speed clocks, with an exact win-chance verdict."
- "ADRs Reviewed: 39 of 39" overstated the coverage above.

---

### Consistency Issues

#### Blocking

None open. Three conflicts carried over from the 29 October review were amended on 22 November with the owner's approval. In each case the code and `bun run validate` already followed the later rule, so only ADR text changed.

| # | Conflict | Evidence | Amendment |
|---|---|---|---|
| C1 | ADR-0028 capped every timed record at 180 s; the basin allows 300 s | `scripts/validate.ts:56-57,457`; chapter spec C2.7; ADR-0030 line 3 makes that spec the acceptance | ADR-0028: the band row now binds village and ridge records, a dated amendment paragraph records the 300 s basin ceiling, and the Ordering Note says so |
| C2 | ADR-0007's Storage limit row says "A generous fixed cap allowing a few days of stored time without needing upgrades" (`:12`); later sources raise the cap by progression | ADR-0025 §5 (`:21`); ADR-0030 §4 (`:25`); design plan B.6 (`:174`) and C.1 (`:212`); shipped `bank.max` grants of 5 h, 18 h and 48 h at the three breakthroughs | ADR-0007's Ordering Note now marks the row overtaken: 1 h, then 6 h, 24 h and 72 h |
| C3 | ADR-0028's Supersessions did not name ADR-0020's 35-45-minute and 90-240-minute windows | `adr-0020-knowledge-woven-into-systems.md:31,62` | Same ADR-0028 amendment names them. ADR-0020 needed no edit |

#### Warnings

None.

#### Minor, open

- **N1. ADR-0014 never says it supersedes ADR-0004.** ADR-0004 says "Superseded by ADR-0014" (`adr-0004-wider-world-and-paths.md:29`). ADR-0014 lists ADR-0004 only among ADRs "cited but not listed as dependencies (superseded, or written later)" (`:48`). One sentence in ADR-0014 closes it.
- **N2. ADR-0026 §1's "raised by" table still names Body Disciple and Sword Disciple** (`adr-0026-combat-exchanges.md:14-18`). The Ordering Note covers it (ADR-0030 turns class figures into held figures), so no rule is in doubt. The 29 October review listed it as lesser drift.
- **N3. `docs/architecture/requirements-traceability.md` rows TR-time-006 (`:29`) and TR-pacing-002 (`:74`) still describe C1 and C2 as open.** That file belongs to the architecture review and was left for its next run. ADR-0007 and ADR-0028 changed, so that review's content hashes for them are stale.

#### Checked and clean

- Lifespan, retry and checkpoint wording in ADR-0003, 0005, 0007, 0008, 0009, 0013, 0017 and 0018: each Ordering Note voids it by naming ADR-0025.
- Full supersessions agree in both directions: 0002 by 0025, 0015 by 0030, 0016's rosters by 0030.
- The current bands (480–780 s, 720–1440 s) appear only in ADR-0028 and ADR-0031.
- `mill_shift` and `rack_tending` appear only in ADR-0022, as history, followed by the 27 October amendment that removed them (`:25,46`).

#### Since 29 October

ADRs 0035 to 0039 exist and are Accepted: save storage, platform and time model, expression language, interface contract, performance budgets. These are items 1 to 5 of that review's Required ADRs. Item 6, the accessibility baseline, is still absent. Their content was not compared against earlier ADRs in this run.

---

### Game Design Issues

#### Blocking

None found in what was read.

#### Warnings

**W6. No stated limit on how many systems a basin-road session asks the player to manage at once.** By the brief and CLAUDE.md, a chapter-two session holds the activity slot, a waiting list of 6, attunement places with exclusive pairs, Strain, and four things chapter two adds: Focus, lasting draughts, two dungeons and the hobby place. Home furnishings and crafting sit beside them. The design plan treats the hobby slot as "a zero-attention filler" (rule 13, `design/DESIGN-PLAN-2026-10-18.md:65`), and a search of the ADRs, the design plan and the chapter spec found no other statement about attention. The count comes from documents, not from play. It matters because the brief promises "every choice readable from the interface alone" (`design/game-brief.md:12`). The natural owner is the UX spec.

#### Info

- One loop leads: practice and attunement feed the breakthrough bill (`design/game-brief.md:15-18`). Fights are optional (`:29`).
- The validator bounds fast routes from below as well as above: Foundation 480 s, ridge 720 s, Second Direction 1800 s (ADR-0028, C2.7). The floors step by ×1.5, then ×2.5.
- Held-method bonuses are limited by attunement places, 3 then 4 then 5 (`adr-0030-sphere-techniques.md:25`; `adr-0026-combat-exchanges.md:22`).
- The 27 October cache amendment lets the Earth and Formation lines reach the bandit's cache without a fight they cannot win (`adr-0026-combat-exchanges.md:62`), closing a reward only two lines could reach.

---

### Verdict: CONCERNS

One design warning (W6) and three minor items (N1 to N3) remain; nothing blocks. This is a partial review, and the list below is as much a part of the verdict as the findings.

### NOT ASSESSED

- **Rule contradictions among ADR bodies (2b), beyond the scanned terms.** 35 ADRs were scanned, not read. ADRs 0035 to 0039 were not compared with earlier ADRs at all.
- **Formula compatibility (2e) and tuning-value ownership (2d) beyond the pacing bands and the bank cap.**
- **Economic loop analysis (3d).** No source and sink map was built for Vigor, Life, Focus, Strain, coin, herbs or the knowledge resources.
- **Difficulty curve (3e) beyond the validator bands.** Practice costs, bills and fight numbers were not compared.
- **Pillar alignment and player fantasy (3f, 3g).** Run only against ADR-0001 line 9 and the brief. `BRIEF.md`, `CAMPAIGN-OUTLINE.md` and the class map were not read, and no document states anti-pillars beyond the brief's out-of-scope list.
- **Cross-system scenarios (Phase 4).** None was walked step by step. The only scenario covered is C1, a basin record longer than 180 s.
- **Accessibility.** No baseline ADR exists.
- **Independent second pass.** The sub-agents did not run, so nothing here was cross-checked by a separate reader.

### What would lift the verdict

The restart archives these ADRs, so the items below matter only if this attempt is revived.

1. A full read of all 39 ADRs against the checklist, with the economy and scenario passes run from `src/data/`. This is the bulk of what is NOT ASSESSED.
2. N1 and N2: two small ADR edits.
3. A decision on W6 when the UX spec is written.
4. The accessibility baseline ADR.
