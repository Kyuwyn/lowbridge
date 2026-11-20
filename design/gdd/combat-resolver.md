# Combat Resolver

> **Status**: Designed (pending `/design-review` in a fresh session)
> **Creative Director Review (CD-GDD-ALIGN)**: NOT ASSESSED 2026-11-20 — the gate's agent spawn was blocked in the authoring session (auto mode cannot review an Agent call a hook rewrites); run it with `/design-review`
> **Author**: designer + Claude (`/design-system`)
> **Last Updated**: 2026-11-20
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 3 (The build is a problem), 4 (No dead ends, no attention tax)

## Summary

The combat resolver is one pure, deterministic function that settles a fight between two
combatants described by four stats (`might`, `guard`, `vigor`, `speed`), or a chain of up to
three fights with the player's Life carried through. Route fights use its win or loss, and
proving fights use its 0–20,000 score, which Forge and proving thresholds into door tiers. It
exists so the three doors can test different things without any luck, and so every fight can be
shown exactly before it runs.

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `Content records and schema; used by Activity slot, Forge and proving, Fight and dungeon routes`

## Overview

The combat resolver settles one fight, or a short chain of fights, between combatants described
only by four integer stats: `might`, `guard`, `vigor` and `speed`. It is a pure function: the
same stats always give the same result, on every engine, with no randomness and no access to game
state, the clock, the method or the modifier pipeline. Its callers assemble the stats and act on
the result.

- **Route fights** (#9, run per unit through the activity slot, #4): a source with one to three
  `fights` resolves them in order each unit, with the player's Life carried from fight to fight.
  The unit is won only if every fight is won. A loss costs the unit's time only (rule 27).
- **Proving fights** (#6, at forge time, outside the slot): one fight per door, the Foundation's
  stats under the method against the door's `opponent`. The resolver returns a score from 0 to
  20,000, which #6 compares against the door's two thresholds to get the door's tier.

The player never operates the resolver. They see its results, and because every result is exact
and known in advance, any screen can show what a fight will do before it runs. Without the
resolver, the three doors could not test different things (pillar 3), and a fight could not be
both optional and free of luck (pillar 4, concept mechanic 1 "Proving").

Implementation details (function signature, result type, error type) go to an ADR (Open
Questions); this document fixes behaviour only.

## Player Fantasy

*Framing: direct. The player feels results, never the mechanism. `creative-director` was not
consulted: the Agent spawn was blocked in this session (auto mode could not review a call that a
hook rewrites). Review manually before production.*

**The Foundation proves itself.** A proving fight is not a gamble on the forge. It is the forge
being checked. When a door opens wide, the player can point at why: they chose the ingredient
that kept their guard up, or the one that made them strike first. When a door stays shut, the
same numbers say what was missing, and the next forge plan starts from that. The anchor moment is
the forge's single step: three fights resolve at once, and each door's result reads as a
consequence of the makeup, not of a roll.

**The road is known.** On the routes, a fight is a cost the player can see, not a risk to take.
Before choosing a fight source, the player knows they will win and how much Life they keep, or
that they will lose and how close they came. This serves the planner the concept targets
(Strategy and Completion): fights are planned, never twitched or ground out.

**What it is not:** reflexes, suspense, luck, or a grind for stats. Nothing in a fight rewards
watching it.

## Detailed Design

*Specialists for this section (`game-designer` primary; `systems-designer`, `art-director`
supporting; `ai-programmer` does not apply, since nothing chooses actions) were not consulted:
the Agent spawn was blocked in this session. The model was instead checked by enumeration (see
F8). Review manually before production.*

### Core Rules

#### C1. The stat-name list (closed)

This GDD closes the stat-name list that `combatant.stats` uses (#1 R4, note 4). In registry
order:

| Stat | Meaning in a fight |
|---|---|
| `might` | How hard this side strikes (F2) |
| `guard` | How much of the other side's might it turns aside (F2) |
| `vigor` | Life at the start of a fight (F1) |
| `speed` | How often this side strikes (F3) |

1. Every combatant carries all four stats (a total map, as #1 R4 requires). Each is an integer
   from 0 to 1,000,000 stat points.
2. The same four stats describe the player's side. Whoever assembles the player's side (C9,
   C10) must produce all four, inside the same range.
3. A fifth stat is a change to this GDD and to #1's schema value.

#### C2. Inputs

A call names a **challenger** (the player's side) and an ordered list of one to three
**opponents**. The challenger's Life at the start may be given; if not, it is F1 of its `vigor`.
The resolver reads nothing else. In particular it never reads game state, the method, the
modifier pipeline, the clock or any record other than the stat maps it is passed.

#### C3. The exchange

Each side strikes on its own clock. Side X's k-th strike lands at time k ÷ rate(X) (F3), for
k = 1, 2, 3, … Each strike removes hit(X→Y) Life from the other side (F2). A side whose Life
reaches 0 or below has lost, and the fight ends at that moment.

- **Simultaneous strikes:** when both sides strike at the same instant, the challenger's strike
  lands first. A challenger whose strike ends the fight therefore takes no damage at that
  instant.
- Every strike removes at least 1 Life, so every fight ends.
- The resolver computes the outcome in closed form (F4–F6), never by stepping through strikes.
  A stepped simulation of C3 is the reference oracle in tests (AC-F8).

#### C4. One fight's result

A resolved fight reports:

- `won`: whether the challenger won;
- the challenger's Life at the start and at the end (at least 1 on a win, 0 on a loss);
- the opponent's Life at the start and at the end (0 on a win, at least 1 on a loss);
- how many strikes each side landed;
- `score`, from 0 to 20,000 (F7).

#### C5. Chains

The opponents are fought in list order, and the challenger's Life carries over: each fight after
the first starts with the Life the previous one ended with. Life never recovers inside a chain.
The chain stops at the first loss. The chain is won only if every fight in it is won. The result
lists each fight that was fought, up to and including a loss.

Nothing carries between calls. Each call starts fresh, so a route's next unit starts at full
Life (C2).

#### C6. Determinism and integers

1. Every quantity is an integer. Every division goes through `div_floor` (#1 F5); the one
   ceiling (F4) is written as a `div_floor`.
2. No intermediate value exceeds 2⁵³ − 1 for any inputs in range (F9).
3. The same inputs give the same result on every engine and every call. The resolver does not
   change its inputs.

#### C7. Monotonicity

1. Raising any one challenger stat never lowers the score and never turns a win into a loss.
2. Raising any one opponent stat never raises the score and never turns a loss into a win.
3. Raising the challenger's starting Life (in a chain, the Life carried in) never lowers the
   score.

This is what lets #6 and the forge screen treat "more of a stat" as "at least as good at every
door", and it keeps every trade-off between doors inside the Foundation's makeup, where pillar 3
puts it. The monotonicity is checked by enumeration (AC-C7), not argued alone.

#### C8. Losses cost nothing here

A result carries no penalty. What a loss costs (the unit's time, and its inputs if #4 and #9
say so) is decided by the caller. This GDD requires only that the cost be time, never progress
(rule 27).

#### C9. Route fights before a Foundation exists

In the MVP every route fight happens before the realm's only forge. The challenger for those
fights is a **fixed baseline combatant**, a `combatant` record in content that stands for the
unforged cultivator (designer, 2026-11-20). Fight and dungeon routes (#9) names which record it
is and assembles route-fight inputs. The resolver treats it like any other stat map.

A consequence: before the forge, every route fight's outcome is a content fact under each
method. Growth on the routes comes through gates (crafted items opening the next source), not
through the player's fighting stats. Whether a fight source the baseline cannot win is a
validator error is an open question for #9 and #12.

#### C10. Proving fights

At forge time Forge and proving (#6) resolves one fight per door: the Foundation's stats under
the method as the challenger, and the door's `opponent` as the only opponent. #6 owns that
contract: how the Foundation and the method become four stats, which stats each door's opponent
stresses, and the thresholds. The resolver contributes only F7's score. #6 compares it with
`door.thresholds` to get the door's tier, and sums the tiers into seals.

### States and Transitions

The resolver holds no state. A call is a pure step from inputs to a result; nothing is saved,
and no fight is ever "in progress" between calls.

Inside one chain call:

| From | Condition | To |
|---|---|---|
| Fight i (i < last) | challenger won | Fight i + 1, starting with the Life fight i ended with |
| Fight i (i = last) | challenger won | Chain won |
| Fight i | challenger lost | Chain lost; later opponents are not fought |

States that outlast a call (a unit running, a forge confirmed) belong to the callers: #4, #6
and #9.

### Interactions with Other Systems

| # | System | Gives to the resolver | Takes from the resolver | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | `combatant` records and their `stats` row; `div_floor` | The closed stat-name list (C1) | #1 owns the type and row; this GDD owns the list and the row's values |
| 4 | Activity slot | Runs a unit of a source whose `fights` is not empty | The chain result for that unit | #4 owns when a unit runs and what a lost unit costs |
| 6 | Forge and proving | The challenger (Foundation under the method) and each door's opponent | F7's score per door | #6 owns the proving contract (C10) |
| 9 | Fight and dungeon routes | The baseline combatant (C9) and each source's opponents | The chain result | #9 owns route inputs and what a win pays |
| 12 | Validator and enumeration | Every fight it chooses to enumerate | Results, by calling the same function | #12 owns which fights it checks |
| 13, 15 | Interface shell, forge screen | — | Results for previews, by calling the same function | #13 and #15 own the display |

The resolver has no interaction with the Modifier pipeline (#2). Stats reach it already final.

**Non-derived state owned:** none. **Actions accepted:** none (it is a function the rules core
calls). **Events emitted:** none; a caller that resolves a fight emits its own event (TD finding
6).

## Formulas

*`systems-designer` was not consulted (Agent spawn blocked in this session). Every formula
below was checked against a stepped simulation of C3, and C7 by enumeration, on 1,166,400
cases (F8). Review manually before production.*

Notation: C is the challenger, F the opponent of the current fight. `X.might` is X's `might`
stat, and so on. `ceil_div(a, d)` is shorthand for `div_floor(a + d − 1, d)`, valid for a ≥ 0
and d ≥ 1.

### F1. Starting Life

The life_start formula is defined as:

`life_start(X) = max(1, X.vigor)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| X.vigor | int | 0–1,000,000 | data file (combatant) or caller | Vigor stat |

**Output Range:** 1 to 1,000,000. A `vigor` of 0 still gives 1 Life, so no fight is over
before it starts. In a chain, the challenger's later fights use the carried Life instead (C5).
**Example:** vigor 200 → 200 Life; vigor 0 → 1 Life.

### F2. Hit

The hit formula is defined as:

`hit(X→Y) = 1` if `X.might + Y.guard = 0`, else `max(1, div_floor(X.might², X.might + Y.guard))`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| X.might | int | 0–1,000,000 | data file or caller | The striker's might |
| Y.guard | int | 0–1,000,000 | data file or caller | The struck side's guard |

**Output Range:** 1 to 1,000,000. With no guard a strike removes `might` Life. Guard equal to
might halves it, and guard keeps paying less the more of it there is, without ever reducing a
strike below 1. Raising might never lowers hit, and raising guard never raises it.
**Example:** might 30 against guard 15 → div_floor(900, 45) = 20. Might 25 against guard 10 →
div_floor(625, 35) = 17.

### F3. Strike rate

The rate formula is defined as:

`rate(X) = SPEED_BASE + X.speed`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| SPEED_BASE | int | 1–10,000 (shipped 100) | constant (tuning knob) | Rate at speed 0 |
| X.speed | int | 0–1,000,000 | data file or caller | Speed stat |

**Output Range:** SPEED_BASE to 1,000,000 + SPEED_BASE. Only the ratio of the two rates
matters: speed 100 strikes twice as often as speed 0 when SPEED_BASE is 100.
**Example:** speed 20 → 120; speed 50 → 150.

### F4. Strikes needed

The strikes_needed formula is defined as:

`n(X→Y) = ceil_div(L_Y, hit(X→Y))`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| L_Y | int | 1–1,000,000 | calculated (F1, or carried Life) | Y's Life when the fight starts |
| hit(X→Y) | int | 1–1,000,000 | calculated (F2) | Life removed per strike |

**Output Range:** 1 to 1,000,000.
**Example:** L = 180, hit 20 → 9; L = 200, hit 17 → 12.

### F5. Win test

The won formula is defined as:

`won = n(C→F) × rate(F) ≤ n(F→C) × rate(C)`

C's last needed strike lands at n(C→F) ÷ rate(C) and F's at n(F→C) ÷ rate(F). Cross-multiplying
compares the two times exactly, with no division. Equality means both land at the same instant,
and the challenger's lands first (C3), so equality is a win.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| n(C→F), n(F→C) | int | 1–1,000,000 | calculated (F4) | Strikes each side needs |
| rate(C), rate(F) | int | SPEED_BASE–1,000,000 + SPEED_BASE | calculated (F3) | Strike rates |

**Output Range:** true or false.
**Example:** 9 × 150 = 1,350 ≤ 12 × 120 = 1,440 → won.

### F6. Strikes landed and Life left

The life_left formula is defined as:

- On a win: `s_F = div_floor(n(C→F) × rate(F) − 1, rate(C))`, and
  `life_end(C) = L_C − s_F × hit(F→C)`; the opponent ends at 0.
- On a loss: `s_C = div_floor(n(F→C) × rate(C), rate(F))`, and
  `life_end(F) = L_F − s_C × hit(C→F)`; the challenger ends at 0.

s_F counts F's strikes strictly before C's winning strike (k × rate(C) < n(C→F) × rate(F)).
s_C counts C's strikes up to and including the instant of F's winning strike, since C strikes
first at that instant. C lands n(C→F) strikes on a win, and F lands n(F→C) on a loss.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| L_C, L_F | int | 1–1,000,000 | calculated (F1, or carried Life) | Life at the fight's start |
| s_F, s_C | int | 0–999,999 | calculated | Strikes the losing side landed |
| hit | int | 1–1,000,000 | calculated (F2) | Life per strike |

**Output Range:** on a win, life_end(C) is 1 to L_C; on a loss, life_end(F) is 1 to L_F. The
win test guarantees s_F < n(F→C) and s_C < n(C→F), so the losing side never lands a killing
strike.
**Example:** win with n(C→F) = 9, rate(F) = 150, rate(C) = 120: s_F = div_floor(1,349, 120) = 11;
life_end(C) = 200 − 11 × 17 = 13.

### F7. Score

The score formula is defined as:

- On a win: `score = 10000 + div_floor(life_end(C) × 10000, L_C)`
- On a loss: `score = div_floor((L_F − life_end(F)) × 10000, L_F)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| life_end(C), L_C | int | 1–1,000,000 | calculated (F6, F1) | Challenger's Life at the end and start |
| life_end(F), L_F | int | 1–1,000,000 | calculated (F6, F1) | Opponent's Life at the end and start |

**Output Range:** a loss scores 0–9,999 (the share of the opponent's Life removed, in basis
points; it is below 10,000 because the opponent keeps at least 1 Life). A win scores
10,000–20,000 (10,000 plus the share of the challenger's Life kept). Every win outscores every
loss. A win that only just survives scores close to 10,000, and so does a loss that only just
fails, so #6 and the forge screen can show how close a door was. In a chain, the score of each
fight is reported; the chain itself has no score.
**Example:** the win above → 10000 + div_floor(130,000, 200) = 10,650.

### F8. Worked example and verification

Challenger {might 30, guard 10, vigor 200, speed 20} against opponent {might 25, guard 15,
vigor 180, speed 50}, SPEED_BASE 100:

| Step | Challenger | Opponent |
|---|---|---|
| Life (F1) | 200 | 180 |
| Hit on the other (F2) | div_floor(900, 45) = 20 | div_floor(625, 35) = 17 |
| Rate (F3) | 120 | 150 |
| Strikes needed (F4) | ceil_div(180, 20) = 9 | ceil_div(200, 17) = 12 |
| Win test (F5) | 9 × 150 = 1,350 ≤ 12 × 120 = 1,440 → **won** | |
| Strikes landed (F6) | 9 | div_floor(1,349, 120) = 11 |
| Life left (F6) | 200 − 187 = 13 | 0 |
| Score (F7) | 10,650 | |

Verification (2026-11-20, a throwaway script, not shipped): over every combination of might,
guard and vigor in {0, 1, 3, 7, 20, 60} and speed in {0, 1, 50, 100, 300} for both sides
(1,166,400 fights), F2–F7 matched a strike-by-strike simulation of C3 exactly. No score moved
the wrong way, and no result flipped, when any one challenger or opponent stat was raised by 1
or the challenger's starting Life was lowered by 1 (C7). Every win scored ≥ 10,000 and every
loss ≤ 9,999. AC-F8 and AC-C7 make this a test.

### F9. Integer bounds

The largest intermediate values, with every stat at 1,000,000 and SPEED_BASE at its 10,000
ceiling:

| Product | Bound |
|---|---|
| X.might² (F2) | 10¹² |
| n × rate (F5, F6) | 10⁶ × 1,010,000 ≈ 1.01 × 10¹² |
| s × hit (F6) | < 10⁶ (it is less than the side's Life) |
| Life × 10000 (F7) | 10¹⁰ |

All are far below 2⁵³ − 1 ≈ 9.007 × 10¹⁵, so no product needs `bp_of`'s declared-pair check
(#1 F6), and the resolver declares no product pair.

## Edge Cases

*`systems-designer` was not consulted (Agent spawn blocked in this session). Review manually
before production.*

### Stats at their bounds

- **If a side's `vigor` is 0**: it fights with 1 Life (F1), so one strike ends it.
- **If both `might` and the other side's `guard` are 0**: the strike removes 1 Life (F2), so the
  formula never divides by 0.
- **If `might` is 0 against a positive `guard`**: div_floor gives 0, raised to 1. A side with no
  might still wins a long enough fight against a side that cannot strike faster.
- **If both sides are all zeros**: each has 1 Life, hit 1 and rate SPEED_BASE. Both strike at
  the same instant and the challenger lands first: the challenger wins with all its Life,
  scoring 20,000.
- **If every stat is 1,000,000 on both sides**: hit is 500,000 each way, each needs 2 strikes at
  equal rates, the challenger wins at the tie, and F9's bounds hold.
- **If the challenger takes no strike before winning**: life_end(C) = L_C and the score is
  20,000.

### Ties and the instant of the last strike

- **If both sides' last needed strikes land at the same instant**: the challenger wins (F5's
  `≤`). This is the only tie-break, and it favours the player.
- **If the opponent would strike at the instant of the challenger's winning strike**: that strike
  does not land (F6 counts only strikes strictly before).

### Chains

- **If a chain's first fight is lost**: the result lists that fight only, and the chain is lost.
  Later opponents are not fought.
- **If a chain is won with 1 Life left after fight 1**: fight 2 starts with 1 Life. A large
  Life share kept in fight 1 therefore matters for later fights, and a chain is harder than its
  fights one at a time.
- **If the same opponent appears twice in a chain** (#1 allows `[gate_ward, ward_two,
  gate_ward]`): each appearance is a separate fight at the opponent's full Life.
- **If the caller passes a starting Life**: it must be 1 to 1,000,000. It may exceed the
  challenger's `vigor`. The resolver does not cap it, since a caller with a reason to pass more
  Life owns that reason.

### Invalid calls (caller errors, never content outcomes)

Each throws a `RangeError` naming the argument. None returns a partial result:

- an opponent list that is empty or longer than 3 (a source with no fights does not call the
  resolver; #1 caps `fights` at 3);
- a stat map with a missing key, a key outside C1's list, or a value that is not an integer from
  0 to 1,000,000;
- a starting Life that is not an integer from 1 to 1,000,000.

Content cannot trigger these, because #1's loader already enforces the same ranges on
`combatant.stats`. A Foundation stat outside the range is a bug in #6 or #2 (which clamps after
the Foundation stage, #1 R4.5), and the throw surfaces it.

### Degenerate builds (balance, owned by #6)

- **Speed dominance**: speed 1,000,000 against speed 0 strikes 10,001 times per opposing strike
  at SPEED_BASE 100. Every stat has this reach at the extremes. #6 keeps Foundation stats and
  door opponents within ranges where no single stat decides every door, and #12's balance table
  shows it.
- **One stat for every door**: monotonicity (C7) means more of a stat is never worse. A makeup
  that is best at every door is prevented only by how #6 maps ingredients to stats (pillar 3).
  The resolver cannot prevent it, and does not try.

## Dependencies

| System | Direction | Hard or soft | Interface |
|---|---|---|---|
| Content records and schema (#1) | This depends on it | Hard | `combatant` type, the `combatant.stats` row (whose values this GDD owns), `div_floor` |
| Activity slot (#4) | Depends on this | Hard, for units of sources with fights | Calls the resolver once per unit through the source's `fights`; owns what a lost unit costs |
| Forge and proving (#6) | Depends on this | Hard | Builds the challenger from the Foundation under the method; reads F7's score per door (C10) |
| Fight and dungeon routes (#9) | Depends on this | Hard | Names the baseline combatant (C9) and authors the opponents |
| Content validator (#12) | Depends on this | Soft | Calls the same function for enumeration; never a second implementation |
| Interface shell (#13), Forge screen (#15) | Depend on this | Soft | Call the same function for previews |
| Modifier pipeline (#2) | None | — | Stats reach the resolver already final (systems index, TD finding 3) |

**Bidirectionality to fix in the systems index:** row #4 does not list the Combat resolver among
its dependencies, although the index's rationale for #4 has its activity record carry "an
optional resolver call". Row #9 and row #6 already list it. This GDD records the dependency, and
the #4 GDD should list it too.

## Tuning Knobs

| Knob | Shipped | Safe range | Too low | Too high | Interacts with |
|---|---|---|---|---|---|
| `SPEED_BASE` (F3) | 100 | 10–10,000 | Speed dominates: a few points decide who strikes first and how often | Speed barely matters: a fourth stat that does nothing | The speed ranges #6 maps ingredients to; at 10,000 a speed of 100 adds only 1 % |

Everything else is fixed by design, not tuned:

- the hit formula's shape (F2), the challenger-first tie-break (C3), and the score scale
  (10,000 basis points per band, F7), because #6's thresholds are written against them;
- the chain length cap, which is #1's `fights` limit of 3;
- every stat value, which is content: door opponents and the Foundation mapping belong to #6,
  route opponents and the baseline to #9.

## Visual/Audio Requirements

*`art-director` was not consulted (Agent spawn blocked in this session). Review manually before
production.*

The resolver draws nothing and plays nothing. Its requirements on the systems that present its
results:

- A result is shown as an outcome, not as a playback. Strike-by-strike animation is not part of
  the MVP. A deterministic fight known in advance has nothing to reveal, and a playback the
  player waits through is an attention tax (pillar 4).
- A presented result names its decider in the stats' own terms (for example "struck first",
  "outlasted"), so the result reads as a consequence of the build (Player Fantasy).
- The proving step's visual event, and how a door's tier shows, belong to the forge screen (#15)
  and method marks (#14).
- Audio: none. Audio has no system until the art bible asks for one (systems index).

## Game Feel

- **Instant.** A route unit's fights and the forge's three proving fights resolve in the same
  frame as the step that triggers them. The closed form costs a fixed handful of integer
  operations per fight, whatever the stats.
- **Exact, never "likely".** Every projection a screen shows is the result the fight will have.
  There is no suspense to tune and no hit-and-miss rhythm.
- **Legible.** Four stats, each with one job (C1). A player who reads a result can say which stat
  would change it.
- **Budget.** Resolving 100,000 single fights takes under 100 ms in the build runtime (AC-C6-3).
  That covers #12's enumeration (30 makeup-and-method cases × 3 doors) and any preview with a
  wide margin.

## UI Requirements

The resolver has no screen. It gives every screen an exact preview by being a pure function.
Requirements on the screens that use it:

1. A route fight source shows, before the player chooses it, whether its unit will be won and
   how much Life the player keeps. If it will be lost, it shows how much of the deciding
   opponent's Life the player would remove (#9 and #13 own the layout).
2. Proving results are shown under Forge and proving's preview rule: seals only for makeups
   whose every ingredient is in hand (#6, #15). The resolver does not widen that rule.
3. Every displayed fight number opens a breakdown of the four stats on each side (rule 97,
   #14).

> **📌 UX Flag — Combat resolver**: route-fight preview lines and the proving result display
> are UI that this system feeds. They belong in the UX specs for the interface shell (#13) and
> the forge screen (#15), not in a screen of their own.

## Cross-References

| This document references | Section there | What it relies on | Status |
|---|---|---|---|
| Content records and schema (#1) | R4 registry row `combatant.stats`, note 4 | Total map, values 0–1,000,000, `sealInput: yes`, `modifiableBy: —`; this GDD closes the key list | Approved; amended by this GDD (see below) |
| Content records and schema (#1) | F5 `div_floor` | Every division | Approved |
| Content records and schema (#1) | R4 row `source.fights` | 0–3 opponents per call | Approved |
| Content records and schema (#1) | R4 row `door.thresholds` | Thresholds compared with F7's score; range 0–1,000,000 until #6 narrows it | Approved |
| Game concept | Mechanic 1 "Proving", mechanic 3 | Deterministic, one step at forge time, the same resolver for routes and the dungeon | Approved |
| Systems index | Row #5 rationale, Relationship analysis | Pure function, no pipeline dependency, contract owned by #6 | Approved |
| Forge and proving (#6) | Proving contract | Challenger assembly, door opponents, thresholds | Not yet designed |
| Fight and dungeon routes (#9) | Route inputs | Baseline combatant, opponents | Not yet designed |
| Activity slot (#4) | Activity record | The resolver call per unit | Not yet designed |

**Amendment to #1 (approved by the designer, 2026-11-20).** #1 R4 note 4 and R8.2 now name the
closed list `might`, `guard`, `vigor`, `speed`. The `combatant.stats` row is unchanged: its
values stay 0–1,000,000, `modifiableBy` stays `—`, and `sealInput` stays `yes` for every
combatant. #1's fixtures keep the placeholder keys `stat_a` and `stat_b` by loading against a
test schema, which #1 R8.2 already allows.

## Acceptance Criteria

*`qa-lead` was not consulted (Agent spawn blocked in this session). Review manually before
production.* All criteria are unit tests on the resolver alone unless tagged otherwise. "A" is
the challenger {might 30, guard 10, vigor 200, speed 20} and "B" the opponent {might 25, guard 15,
vigor 180, speed 50} from F8; SPEED_BASE is 100.

### Core rules

- **AC-C1-1** **GIVEN** the shipped schema value, **WHEN** its stat-name list is read, **THEN**
  it is exactly `might`, `guard`, `vigor`, `speed`, in that order.
- **AC-C1-2** [integration with #1] **GIVEN** a `combatant` record whose `stats` has all four
  keys at 0 and, separately, all four at 1,000,000, **WHEN** the shipped content loader loads it,
  **THEN** it loads; **GIVEN** one key missing, a fifth key, or a value of 1,000,001, **THEN**
  load error naming the record and `stats`.
- **AC-C2-1** **GIVEN** A and [B], **WHEN** resolved twice, and once more after building
  unrelated game state, **THEN** the three results are deep-equal, and A's and B's stat maps are
  unchanged.
- **AC-C2-2** [review] **GIVEN** the resolver module, **WHEN** its imports are listed, **THEN**
  it imports nothing but the shared integer helpers and the stat-name list (no state, pipeline,
  clock or content loader).
- **AC-C3-1** **GIVEN** A and [B], **WHEN** resolved, **THEN** the result is: won; challenger
  Life 200 → 13; opponent Life 180 → 0; challenger landed 9 strikes, opponent 11; score 10,650.
- **AC-C3-2** (tie) **GIVEN** challenger and opponent both {might 10, guard 0, vigor 10,
  speed 0}, **WHEN** resolved, **THEN** won, challenger Life 10 → 10, opponent landed 0
  strikes, score 20,000.
- **AC-C3-3** (loss) **GIVEN** B as challenger and [A] as opponent, **WHEN** resolved, **THEN**
  lost, challenger Life 0, opponent Life above 0, score from 0 to 9,999, matching the stepped
  oracle (AC-F8) exactly.
- **AC-C5-1** **GIVEN** A against [B, B], **WHEN** resolved, **THEN** fight 1 equals AC-C3-1,
  fight 2 starts with challenger Life 13 and is lost, and the chain is lost with two fight
  results.
- **AC-C5-2** **GIVEN** a chain whose first fight is lost, **WHEN** resolved, **THEN** the result
  holds exactly one fight and the chain is lost.
- **AC-C5-3** **GIVEN** a challenger that wins each of three fights, **WHEN** resolved, **THEN**
  the chain is won, it holds three results, and each fight's starting Life equals the previous
  fight's ending Life.
- **AC-C6-1** **GIVEN** every stat at 1,000,000 on both sides, and separately the challenger at
  0s against an opponent at 1,000,000s, **WHEN** resolved with SPEED_BASE 10,000, **THEN** every
  intermediate value passes `Number.isSafeInteger` (checked by an instrumented build or by
  recomputing in BigInt) and the result matches a BigInt reimplementation.
- **AC-C6-2** **GIVEN**, one at a time, an empty opponent list, four opponents, a stat map
  missing `speed`, one with an extra key, a stat of −1, 1,000,001 or 2.5, and a starting Life of
  0 or 1,000,001, **WHEN** resolved, **THEN** each throws a `RangeError` and returns nothing.
- **AC-C6-3** [performance] **GIVEN** 100,000 single fights with stats drawn from a fixed list,
  **WHEN** resolved in the build runtime, **THEN** the total is under 100 ms (median of five
  runs).
- **AC-C7** **GIVEN** the enumeration grid of F8 (might, guard, vigor in {0, 1, 3, 7, 20, 60};
  speed in {0, 1, 50, 100, 300}; both sides), **WHEN** each case is resolved again with one
  challenger stat raised by 1, with one opponent stat raised by 1, and with the challenger's
  starting Life lowered by 1 where it is above 1, **THEN** no challenger raise lowers the score
  or turns a win into a loss, no opponent raise raises the score or turns a loss into a win,
  and no Life cut raises the score or turns a loss into a win.
- **AC-C8** **GIVEN** any loss, **WHEN** the result is read, **THEN** it carries only the fields
  of C4 (no cost, penalty or state change).
- **AC-C10** [integration with #6, deferred until #6 is designed] **GIVEN** a door whose
  thresholds are [t1, t2] and a challenger whose score against its opponent is s, **WHEN** #6
  computes the tier, **THEN** the tier depends only on s, t1 and t2, and #6's proving code calls
  this resolver rather than a copy of it.

### Formulas

- **AC-F1** **GIVEN** vigor 0, 1 and 1,000,000, **WHEN** life_start is computed, **THEN** 1, 1
  and 1,000,000.
- **AC-F2** **GIVEN** (might, guard) = (0, 0), (0, 5), (30, 15), (25, 10), (1,000,000, 0),
  (1,000,000, 1,000,000), **WHEN** hit is computed, **THEN** 1, 1, 20, 17, 1,000,000, 500,000.
- **AC-F3** **GIVEN** speed 0 and 50 at SPEED_BASE 100, **WHEN** rate is computed, **THEN** 100
  and 150.
- **AC-F4** **GIVEN** (Life, hit) = (180, 20), (200, 17), (1, 1,000,000), (1,000,000, 1),
  **WHEN** strikes needed is computed, **THEN** 9, 12, 1, 1,000,000.
- **AC-F5** **GIVEN** strikes needed and rates where n(C→F) × rate(F) equals, is one below, and
  is one above n(F→C) × rate(C), **WHEN** the win test runs, **THEN** won, won, lost.
- **AC-F6** **GIVEN** AC-C3-1's fight, **WHEN** F6 is computed, **THEN** s_F = 11 and
  life_end(C) = 13; and over the AC-F8 grid, every win has 1 ≤ life_end(C) ≤ L_C and every loss
  has 1 ≤ life_end(F) ≤ L_F.
- **AC-F7** **GIVEN** the AC-F8 grid, **WHEN** scores are computed, **THEN** every win scores
  10,000–20,000 and every loss 0–9,999; AC-C3-1 scores 10,650 and AC-C3-2 scores 20,000.
- **AC-F8** **GIVEN** the enumeration grid above (1,166,400 fights), **WHEN** each is resolved by
  the closed form and by a stepped simulation of C3 written in the test, **THEN** `won`, both
  Life values, both strike counts and the score match on every case.

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | The proving contract: how the Foundation under the method becomes four stats, which stats each door's opponent stresses so that the three doors test different things, and the threshold values. Should `door.thresholds` narrow from 0–1,000,000 to 0–20,000 (F7's range), by an amendment to #1? | Forge and proving (#6) | #6 GDD |
| 2 | Is a fight source that its challenger cannot win, under some method, a validator error? Before the forge every route outcome is a content fact (C9), so such a source can never pay | Fight and dungeon routes (#9), Validator (#12) | #9 GDD |
| 3 | After the forge (#6's post-forge section), do route fights use the baseline or the Foundation's stats? If the Foundation's, the "one visible locked source" could be a fight the baseline cannot win | Forge and proving (#6), Fight and dungeon routes (#9) | #6 GDD |
| 4 | Does a lost unit consume its inputs, or only its time? Rule 27 says time only; #4 and #9 decide what "time" includes | Activity slot (#4), Fight and dungeon routes (#9) | #4 GDD |
| 5 | Is SPEED_BASE 100 right once #6 sets the Foundation's stat ranges? | Forge and proving (#6) with this GDD | #6 balance table |
| 6 | Row #4 of the systems index should list the Combat resolver among its dependencies (Dependencies, bidirectionality) | Systems index owner (`/map-systems`) | Next systems index update |

**ADRs required** (representation decisions this GDD leaves out):

1. The resolver's signature, result type and error type, and where the stat-name list lives in
   the schema module (with #1's ADR 2).
2. Whether the stepped oracle of AC-F8 is a test helper only (recommended) or ships in a debug
   build.
