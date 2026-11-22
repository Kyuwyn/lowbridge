<!-- PROTOTYPE - NOT FOR PRODUCTION -->
<!-- Question: Is assembling a Foundation from any four of six ingredients, under a chosen method, a build problem the player wants to solve twice? -->
<!-- Date: 2026-11-19 -->

# Concept Prototype Report: The Forge (The Furnace Road)

> **Date**: 2026-11-19
> **Prototype Path**: HTML
> **Concept File**: design/gdd/game-concept.md

---

## Hypothesis

If the player assembles a Foundation from any four of six ingredients under a chosen
method, they will feel they are solving a build problem — evidenced by comparing several
makeups before forging and then starting a second run to try another makeup or the other
method.

---

## Riskiest Assumption Tested

That choosing ingredients is a real decision and not a resource bill with a menu (the
concern raised at gate CD-PILLARS).

It partly proved out. The designer described planning the forge as a "puzzle" that was
"nice" to think through, which is the feeling the assumption needs. The evidence is thin:
one forged run, by the person who designed the concept, on a content set he called too
small to judge.

---

## Approach

One self-contained `prototype.html`. The forge screen is the whole game: six ingredients,
two methods (Ember Breath, Still Water), a forge of any four, five Foundation stats, and
three doors with two tiers each that turn the Foundation into a score from 0 to 6. The
player has 9 days to gather. The numbers were tuned by search so that each method has one
best makeup within the budget, the two differ, and neither is the method's obvious set
(`balance-table.md`).

It was planned, tuned, built and checked in one working session of under an hour.

**Path chosen:** HTML
**Reason for path:** The question is whether a rule set makes an interesting decision. Timing and feel are not being tested, and a single file can be opened and shared with no install.

**Shortcuts taken (intentional):**
- Sources are a timed button with a cost in days; there is no combat and no dungeon.
- No tending, saves, offline time or reforge.
- All values hardcoded; no content validator, no architecture, no phone layout.
- Explanation limited to one paragraph on the method screen and inline labels.

---

## Result

One playtester, the designer, played for 576 seconds across two runs, both under Ember Breath.

**Session log**

| Run | Method | Full makeups compared | Plan changes | Outcome |
|-----|--------|-----------------------|--------------|---------|
| 1 | Ember Breath | 0 | 5 | Stranded: ran out of days before holding four ingredients. Not forged |
| 2 | Ember Breath | 2 | 6 | Forged Ember Marrow, Ironbark Heartwood, Tidewater Pearl, Ghost Moss. 3 of 6 seals, 9 of 9 days, 63 seconds |

Still Water was never played. No run was started after the forge.

**What the designer said**

- On the hypothesis: "Confirmed".
- On the first run: "Lack of real instruction lead to the first attempt failing. Second proceeded once I understood the task".
- Best moment: "Thinking through the 'puzzle' was nice but the prototype was too thin on content to have a 'favorite'".
- Worst moment: "It was just generally thin on explanation of what was going on".
- Surprise: "Not really".
- Verdict: "Proceed". No reason was given.

**Reading the result against the hypothesis's own signals**

- *Compares several makeups before forging.* Weakly met: two full makeups in the forged run, none in the first.
- *Starts a second run to try another makeup or the other method.* Not met. The second run was a retry after the first failed for lack of instruction, and the session ended after one forge.
- The best makeup for Ember Breath scores 4. The designer forged a 3 and did not look for better.

On these signals the result is closer to PARTIALLY CONFIRMED than CONFIRMED. The
designer's own verdict is recorded below as given.

---

## Metrics

| Metric | Value |
|--------|-------|
| Path used | HTML |
| Iterations to playable | N/A |
| Prototype duration | Under 1 hour, one session |
| Playtesters | 1 internal (the designer) / 0 external |
| Feel assessment | Planning the forge read as a puzzle worth thinking through. The first run, about eight minutes, was lost to not understanding the task, and ended in a state with no way forward |
| Hypothesis verdict | CONFIRMED (designer's call). By the hypothesis's measurable signals: PARTIALLY CONFIRMED |

---

## Recommendation: PROCEED

The designer's verdict is PROCEED, and it is his decision. The evidence for it is that
planning a Foundation felt like a puzzle, which is the core of pillars 1 and 3. The
evidence is limited: one internal tester, one forged run, a content set too thin to
produce a favourite moment, and no test at all of the second half of the hook, because
the other method was never played. PROCEED here means the forge is worth designing
properly. It does not mean "methods matter" or "players come back for a second
Foundation" has been shown.

---

## Creative Director Review

**Gate CD-PLAYTEST, 2026-11-19: CONCERNS.** The designer chose "Accept with noted
concerns" the same day, so the recommendation stays PROCEED.

The director's reasoning: the evidence supports half the fantasy, weakly. Planning the
forge read as a puzzle, which pillars 1 and 3 need, so the fantasy is not absent. It
rests on one forged run by the concept's author, with no surprise and no favourite
moment, so it is not shown to be landing. The director judged the report's reading of
PARTIALLY CONFIRMED to be the accurate one.

| # | Concern | What would resolve it |
|---|---------|-----------------------|
| 1 | Pillar 2 and the second half of the hook have no evidence; Still Water was never played | Play both methods in one session and record whether the second forge felt like a different problem |
| 2 | Pillar 3's "a better one is discoverable" was not observed; a 3 was forged when a 4 existed | Re-test with a visible sign of headroom and watch whether the tester forges again |
| 3 | Each method's best makeup resembles the other method's theme, which may read as methods being backwards | Ask a tester which makeup they expected to be best, and whether the real answer felt clever or wrong |
| 4 | The day budget stranded a run, breaking pillar 4 | Replace the budget with a pressure that cannot strand, before the forge GDD |
| 5 | Onboarding took about eight of under ten minutes and contaminated the measurement | Three lines of instruction on the first screen |
| 6 | No outside tester | One person who has not read the concept |

The director suggested a short second prototype pass on concerns 1, 2, 4 and 5 before
`/map-systems` commits a methods system. The designer declined that for now. The concerns
are carried forward as open questions for the forge and methods design documents.

Unanswered at the time of writing: why the designer chose PROCEED (no reason was given).

---

## If Proceeding

- **Core tuning values discovered:** None that should be carried into a GDD. The 9-day budget, door thresholds and ingredient values were tuned for a table, not from play.
- **Assumptions confirmed:** A forge plan with a live preview of the resulting Foundation reads as a puzzle (pillars 1 and 3), on one tester's word.
- **Assumptions disproved:** That inline labels are enough to teach the forge. A new player lost a whole run before understanding the task.
- **Emergent mechanics:** None observed.
- **A rule the prototype broke:** the day budget let a run strand with no way forward. That is a dead end, which pillar 4 forbids. The real game needs a different pressure than a budget that can run out, or a floor that always lets four ingredients be held.

> Note: The HTML path was used. Feel is not what this prototype tested, so no engine
> prototype is needed for the forge. Tending, which is a feel question, is still untested.

**Still unproven, to carry into design as open questions**

1. Does a second method make the player want to forge again? (Pillar 2. Not played.)
2. Is there a pull to find a better makeup after a first forge? (Pillar 3. Not observed.)
3. Is tending fun as an input? (Not in this prototype.)
4. Does it work for someone who is not the designer? (No external tester.)

**Next steps:**
1. `/design-review design/gdd/game-concept.md`
2. `/gate-check`
3. `/map-systems`
4. `/design-system forge` (the onboarding and no-dead-end findings belong in its Edge Cases and Tuning Knobs sections)

---

## If Pivoting

Not applicable; the recommendation is PROCEED.

---

## If Killing

Not applicable; the recommendation is PROCEED.

---

## Lessons Learned

- **What assumptions were broken by actually building this?**
  That the forge explains itself. It needs a first-run explanation of the goal: hold four, forge once, the doors are the score.
  That a scarce budget is a safe way to make sourcing matter. It created a fail state the concept's pillars rule out.

- **What surprised us that didn't show up in the brainstorm?**
  Nothing surprised the designer. From the build side: tuning for a non-obvious best makeup made each method's best look like the other method's theme, which may read as methods being backwards. The designer never saw the second method, so this is untested.

- **What would we test differently next time?**
  Put three lines of instruction on the first screen and make stranding impossible, so the session measures the forge and not the onboarding.
  Ask the tester to play both methods before the debrief, or give the build to someone who has not seen the concept.
  Use a larger content set, so a "favourite" Foundation is possible.

---

> *Prototype code location: `prototypes/forge-concept/`*
> *This code is throwaway. Never refactor into production.*
