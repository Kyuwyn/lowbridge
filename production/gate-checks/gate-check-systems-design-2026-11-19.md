## Gate Check: Concept → Systems Design

**Date**: 2026-11-19
**Checked by**: gate-check skill
**Settings**: review mode `full`, workflow `full`, qa.level `full`, team.size `studio` (all from `rigor: full`)

The concept checked is the third revision of 2026-11-19, which has not been reviewed. The
latest review on record (lean) covered the second revision.

### Required Artifacts: 3/3 present
- [x] `design/gdd/game-concept.md` — exists, about 34 KB of real content
- [x] Game pillars defined — four, each with a design test, in the concept
- [x] Visual Identity Anchor section — in the concept

Recommended, not blocking:
- [x] Concept prototype with a PROCEED report — `prototypes/forge-concept/REPORT.md` (PROCEED by the designer; CD-PLAYTEST returned CONCERNS, accepted; one internal tester; the second method was not played)

Observed by `artifact-check.sh --phase concept` and not part of this gate's checklist:
`design/art/art-bible.md` and `design/gdd/systems-index.md` are absent. The systems index
is written by `/map-systems`, the first step of the phase being entered.

### Quality Checks: 4/4 passing
- [x] Concept reviewed, verdict not MAJOR REVISION NEEDED — three `/design-review` entries dated 2026-11-19, all NEEDS REVISION (full: 6 blockers; full re-review: 4; lean: 2); the concept was revised after each
- [x] Core loop described — tending, which is part of it, is still undesigned
- [x] Target audience identified
- [x] Visual Identity Anchor has a one-line rule and three supporting principles

## Director Panel Assessment

Panel: 4 of 4 (`workflow: full`).

Creative Director:  CONCERNS
  The pillars are falsifiable, each has a design test, and the one conflict is ranked. Three
  reviews left fantasy and pillars standing; every blocker was at mechanic level. Nothing
  must be resolved before entry.

Technical Director: CONCERNS
  Feasibility is sound: nothing technical should stop systems being mapped. One concern
  (that CLAUDE.md still described the archived build) was checked against the file on disk
  and not confirmed.

Producer:           CONCERNS
  Required artifacts and quality checks are met; nothing blocks starting /map-systems. The
  stall risk is highest in this phase.

Art Director:       CONCERNS
  The Visual Identity Anchor is enough to start from. Four gaps would cause rework if each
  system document improvises.

### Blockers
None.

### Concerns
1. The current concept (third revision) is unreviewed; each earlier revision introduced new blockers. [creative-director, producer]
2. The build problem may still be a delayed lookup: a player can gather all six ingredients and read all 15 results. [creative-director]
3. "No makeup is co-optimal under both methods" has no demonstrated mechanism; the balance table predates the current forge rules. [creative-director, producer]
4. Pillar 2 and the second half of the hook have no play evidence; the second method has never been played. [creative-director]
5. Tending is undesigned and untested, yet it is in the 30-second loop and pillar 4. [creative-director, producer]
6. There is no valid timeline: the tier estimates predate the proving fights, and hours per week are unknown. [producer]
7. Stall risk: a review after every system document at full rigor is the failure the scope review predicted; three reviews in one day each added scope, with no record of what the additions displace. [producer]
8. The pinned Node.js 26 has never run the scaffold (tested once on 22.23.4), and the developer's machine is unprobed. [technical-director]
9. Three open design questions carry save and recompute consequences: whether Foundation stats are fixed at forge time, whether Foundations stack across realms, and the away-time cap. [technical-director]
10. Four visual gaps need one owner each: how a mark shows direction, the accent before the method commit, non-method states, and the forge event. [art-director]

Also noted: the studio's config helper rejects 'Web' as an engine name, so engine-keyed
skills may misroute [technical-director]; `CLAUDE.md` says "two reference wikis" where
there are three, and one inherited sentence mentions `bun run validate`.

### Recommendations
- Run one lean re-check of the concept, then send further findings to the system documents instead of revising the concept a fourth time.
- Regenerate the balance table under the current forge rules before the forge document.
- Re-estimate the timeline straight after the systems index exists.
- Design MVP systems only; cap each document at one review and one revision; give the phase an end date.
- Design the forge before methods and sources; the directors disagree on tending (creative-director: early; producer: last).

### Verdict: CONCERNS
Minor gaps exist that can be addressed during the next phase. The stage advances only if
the user explicitly accepts them.

Chain-of-Verification: 5 questions checked — verdict unchanged. Re-checked against files:
the rulebook on disk, the review log's verdicts and freshness, and where the gate files
place the art bible and the systems index.

### Accepted Risks
The user advanced on CONCERNS. Each concern above is accepted by the user, 2026-11-19:
- 1. The current concept is unreviewed — accepted. The user declined a further re-check ("I don't feel a third review is necessary").
- 2. The build problem may still be a delayed lookup — accepted.
- 3. No demonstrated mechanism keeps the methods' best makeups different — accepted.
- 4. Methods have no play evidence — accepted.
- 5. Tending is undesigned and untested — accepted.
- 6. No valid timeline — accepted.
- 7. Stall risk at full rigor; scope added through reviews — accepted.
- 8. Node.js 26 untested on the developer's machine — accepted.
- 9. Open design questions with save and recompute consequences — accepted.
- 10. Four visual gaps — accepted.

Stage advanced: Concept → Systems Design, 2026-11-19.
