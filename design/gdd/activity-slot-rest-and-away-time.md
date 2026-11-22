# Activity Slot, Rest and Away Time

> **Status**: Approved 2026-11-20 (lean review; recommended follow-ups in `design/gdd/reviews/activity-slot-rest-and-away-time-review-log.md`)
> **Author**: designer + agents
> **Last Updated**: 2026-11-21
> **Amendments**: A1 2026-11-20 — Open Question 5 marked resolved (route fights use the unforged cultivator, #6 G13.2, #9 N3) and Open Question 6's route half resolved (no fight route has a by-product, #9 U2) (from Fight and dungeon routes #9; approved by the designer). Touches Open Questions rows 5 and 6. A2 2026-11-21 — S6.3 and F2 use min(*p*, ⌊*p* × *D′* / *D*⌋): a lengthened unit keeps its milliseconds, not its fraction, so heaping a gatherer mid-unit cannot pay untended time at the heaped yield. Open Question 4 is answered: the choice survives a stop (from Tending #10, `tending.md` D5, D6; designer-approved). Touches S6.3, F2, F3's "why no unit is shorter", Edge Cases "Progress and durations", AC-F2-1 and Open Questions row 4 · A3 2026-11-21 — Open Question 7 marked resolved by Content validator (#12, VR9.1–VR9.2). No MVP check is a pacing floor timed from the commit, because the price checks read activity time, so rest before the commit keeps banking (status edit only, no rule change; designer-approved). Touches Open Questions row 7 · A4 2026-11-21 — Open Question 2 marked resolved: the concept's Session-Level hook is reworded, and the Interface shell (#13) shows it as the away summary (status edit only, no rule change; designer-approved). Touches Open Questions row 2 · A5 2026-11-22 — S9.5's segment boundary drops "including one #10 makes by itself", since #10 D5 changes tending only on the player's `setHeap`; **Blocked** now names the system a criterion waits for, as #10 uses it, because every GDD it named is designed (status edit only, no rule change; designer-approved). Touches S9.5, the Acceptance Criteria preamble
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 4 (No dead ends, no attention tax); supports 3 (The build is a problem)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-20. #3's carried pillar-4 item (the switch count of the opening chain) is answered: S8 removes the latency cost of a switch, and Open Question 1 hands the switch frequency to Crafting route (#8). Non-blocking: track whether #8's recipe shape keeps switch frequency within pillar 4, and use the Player Fantasy's "coming back" scene in Open Question 2's rewording

## Summary

This system is the game's one activity slot and the way time passes in it. The player starts
one activity at a time. It runs unit by unit, paying its inputs for its outputs, until one of
four things happens:

- an input is short;
- a store it raises is full;
- its fight is lost;
- a day of activity has passed since the player's last input.

Then rest fills the slot. Rest holds up to 30 minutes of breath, which the next activity spends
at double speed. One deterministic `advance(state, dt)` runs live play and away time alike.
Leaving the game or reacting late never loses progress, and watching is never rewarded
(pillar 4).

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `Content records and schema, Modifier pipeline, Resources and caps, Combat resolver`

## Overview

The activity slot is the game's one clock. At every instant exactly one thing fills it: an
**activity** (a `source` record the player started) or **rest**. An activity runs in **units**.
Each unit takes the source's effective duration. When it completes, the source's fights are
resolved on the Combat resolver (#5), if it has any. Then its inputs are exchanged for its
outputs through Resources and caps' one settle step (#3). The activity runs unit after unit
until it cannot continue:

- an input is short;
- a store it raises is full;
- its fight is lost;
- it has run a day of activity time since the player's last input.

Then rest fills the slot by itself (rule 23).

Rest is not a record and adds nothing to any store. It holds the time it fills, up to 30
minutes, and the next activity spends that held time automatically at twice the speed. Each
activity also keeps its part-finished unit when it stops or the player switches away. So an
absent player or a late tap never loses the slot's time. Rest defers time and never creates
it (pillar 4).

Live play and away time run on one deterministic function, `advance(state, dt)`. The rules core
calls it on every tick while the game is open, and once on load for the gap since the last save.
Splitting `dt` anywhere gives the identical state. This system defines one generic activity
shape and one generic stop rule. The shape is inputs, outputs and duration per unit, plus the
source's optional fights. Routes (#8, #9) author records in that shape, so this Core system
never learns what a route is (systems index, TD finding 4).

The player does two things here: start a revealed, actionable source, or stop the running one.
They never queue, schedule, hold or repeat an input. Without this system no store would fill
and no ingredient would arrive, and away time would mean nothing.

**Stated divergences** (the first two are already stated in the concept):

- **Rule 24.** One slot for the whole game, with no priority flags and no waiting list.
- **Rule 91.** No time bands.
- **Rule 25 (revisited, as the concept allows):** "a banked speed resource may be revisited in
  the tending/time design document". The held time is a capped bank, as rule 25 has it. It is
  spent automatically, never by a button, because a deliberate spend is a click with one right
  answer.

Representation goes to ADRs (Open Questions): the state slice's encoding, the clock source and
the away cap's final value.

## Player Fantasy

**Framing: indirect.** The player never meets the slot's machinery. What they feel is that the
road waits for them. One promise: **when the work pauses, breath fills the slot.**

- **Coming back.** The player returns after an hour. Rendering ran until the Ash Tallow ran
  short, and the log says so in one line. Since then the slot has rested, and its held breath
  sits at the half-hour mark. They start skimming, and it runs at twice the speed until the
  held breath is spent. Nothing spoiled, nothing was lost, and nothing asked for them while
  they were gone.
- **Live.** A store brims while the player is reading a tooltip. The seconds the slot rested
  come back, doubled, in the next activity. A late tap costs nothing, so the bar never has to
  be watched.
- **Switching.** A half-rendered unit stays half-rendered when the player turns to skimming,
  and picks up where it was.

This serves:

- **Pillar 4**: *"No dead ends, no attention tax"*, and its design test: *"Debating a reward for
  watching or one that waits for the player, this pillar picks the one that waits."* Rest is the
  reward that waits. Time the player was not there is held. It is neither spent for them nor
  lost.
- **The concept's Submission aesthetic (7)**: *"Idle progress and rest filling the slot; never
  the main draw."* The doubled breath is a quiet payoff that the interface never shouts about.
- **The target player**, who is turned away by "mandatory clicking". Rest starts on its own, and
  no click is rewarded for its timing.

It sits beside its siblings' promises: "the plan holds" (#1), "every number can tell you why"
(#2) and "the forge shapes the vessel that holds the next climb" (#3).

**Tone.**

- Player-facing text says *resting* for rest and *held breath* for the bank. It never says
  "bank", "buffer", "idle" or "offline". Nothing else in the game uses the word "breath", so it
  stays unambiguous.
- A stop is named by its cause, in #3's words: "Ash Tallow is full", "Needs Ash Tallow ×30 (12
  more)", "Lost to [opponent]", "The day's work is done".

*Specialist: `creative-director` consulted. It gave three framings ("the breath between work",
"the road names every pause", "the furnace rests itself") and recommended the first, which was
adopted. One of its reasons cited vocabulary from the archived attempt, which does not bind
this game. The framing stands on its other reasons.*

## Detailed Design

### Core Rules

Rules are numbered S1–S12. "Activity ms" is the clock units run on. "Real ms" is wall-clock
time, which S8 converts into activity ms.

#### S1. One slot

1. The slot holds exactly one **occupant**: a `source`, in which case the slot is *running*, or
   rest, in which case it is *resting*. There is no second slot, no queue and no automation
   (anti-pillars; rule 24 diverged).
2. **Rest is not a record.** It is the slot's empty occupant. It reads no content, writes no
   store, and fills the rest bank (S8). This answers #1 Open Question 3. Rest is not a
   `source`, so #1's "does nothing" validator error never meets it and needs no exemption.
3. At run start (#11) the slot rests, the bank is 0, no progress is kept, and the time since the
   last input is 0.

#### S2. The activity record

An activity is a `source` record. For each unit, the slot reads four values from the committed
method's effective set (#2 P9). All four are constant within a segment (#2 P9.4).

- `inputs`: the ids and amounts paid when the unit completes.
- `outputs`: the ids and amounts received when the unit completes.
- `duration`: the unit's length in activity ms.
- `fights`: 0–3 opponents fought at completion. #9 owns the row and #5 resolves the fights.

The slot never reads a source's id for meaning. Crafting recipes, single fights and dungeon
floors are all the same shape.

#### S3. Player actions and inputs

1. **Start(s).**
   - Accepted only if s can run at that instant (S5). Condition 4 is read as met, because the
     Start is itself an input and resets the time since the last input to 0. Without this, a
     run stopped by the away cap could never be restarted by its own Start.
   - Otherwise it is refused and the slot is unchanged. The refusal names one reason: the first
     S5 condition that fails, in S5's order. For an unmet gate that is #1's generated need text
     (R5.5). For the others it is #1's shortfall form ("Needs Ash Tallow ×30 (12 more)", "Ash
     Tallow is full").
   - An accepted start replaces the occupant. A source it replaces keeps its progress (S6).
   - Starting the source that is already running changes nothing, but still counts as an input.
2. **Stop().** The running source stops with reason `player`, rest fills the slot, and the
   source keeps its progress.
3. **Inputs.**
   - Every *accepted* player action, in any system, is an **input**: Start, Stop, a tending
     choice (#10), the method commit (#7), the forge (#6). Each input resets the time since the
     last input to 0 (S7).
   - A refused action is not an input. Neither are opening the game, loading, or viewing a
     screen.
4. **Order.** Before any action is applied, the rules core brings the state to the present with
   `advance` (S9). An action always acts on the present state.
5. Before the commit no source is actionable (#1 F7), so every Start is refused and the slot
   rests. Gathering starts only after the commit (concept, mechanic 2).

#### S4. A unit

1. **Progress.** A running source accrues progress *p* in activity ms. When *p* reaches its
   effective duration *D*, the unit **completes**: *p* falls by *D*, and the next unit begins if
   S5 still holds. Time left over in the same `advance` flows into that next unit.
   - S5 is checked at the instant of each completion, even one that falls exactly at the end of
     *dt*. A run that has stopped is therefore already resting when the call returns.
2. **At completion**, in this order:
   1. If `fights` is not empty, the slot calls the resolver (#5) once for the unit, with the
      source's whole opponent list. The challenger is the one Fight and dungeon routes (#9)
      assembles. The chain is fought in list order and stops at its first loss (#5 C5). The
      unit is won only if every fight is won.
   2. **On a loss:**
      - nothing is paid or received, and no mark moves;
      - the source's progress becomes 0, because the unit's time is the loss's whole cost
        (rule 27; this answers #5 Open Question 4);
      - the run stops with reason `lost`, and rest fills the slot.

      A fight is deterministic and its inputs are constant within a segment, so repeating it
      would lose again. The slot therefore never repeats a loss by itself. The player may start
      the source again.
   3. **On a win, or when there are no fights:** one `settle` of the source's effective
      `inputs` and `outputs`, cause `unit` (#3 K3). The settle deducts, adds, clamps and updates
      the marks in #1 F1's order.
3. **One settle per unit, never one for a batch.** Settle checks `in ≤ held` before netting
   (#3 K3.1). A batch of k units would test k × inputs against `held` and fail where the units
   one at a time pass. One settle per unit also keeps #1 F1's per-unit marks without any
   k × outputs product.
4. **Precondition (#1 F1).** A unit completes only while `held ≥ inputs` for every input id.
   - Within a segment, `held` changes only through this slot's own units, so the S5 check at
     each unit start is exact.
   - S5 runs again at every segment start. A change between segments (the forge consuming an
     input ingredient, a cap falling) therefore stops the run before any completion could break
     the precondition.

#### S5. The stop rule

A source s **can run** when all four conditions hold, read in this order:

1. **Offered.** s is actionable in the committed set: revealed, `need` met, `enabled` (#1 F7).
2. **Inputs.** `held[id] ≥ inputs[id]` for every input id.
3. **Room.** No output id with a positive **net** is full (#3 K6). Net(id) = `outputs[id] −
   inputs[id]`, where an absent key counts as 0. An output whose net is 0 or less never raises
   its store and so cannot spill. A full one therefore does not stop the unit.
4. **Away cap.** The time since the last input is below `AWAY_CAP` (S7).

**When it is checked.** All four conditions at every unit start. Conditions 1–3 also at every
segment start, so a unit in progress is never cut by the away cap.

**On failure.** When the check fails, the run stops. The stop reason is the first failing
condition: `withdrawn`, `inputs`, `full` or `away`. The two other reasons are `lost` (S4.2) and
`player` (S3.2). Rest fills the slot.

**Why "any output full".** The concept's rule is "its output is at cap", and #3's fantasy says
"only the last unit's spill is lost". Both hold only if the run stops at the first full store.
Stopping when *every* output is full would spill on each unit after the first store filled.
The cost: once an ingredient (held 0 or 1) is held, it blocks any by-product sharing its source.
T2 warns about such sources (S11).

#### S6. Kept progress

1. **Each source keeps its own progress.** A source keeps *p* when it stops for any reason or
   the player switches away, and resumes from it when it runs again. Progress is lost in only
   two ways: a lost fight zeroes it (S4.2), and a completed unit consumes *D* of it.
2. **Normal form.** After every `advance`, 0 ≤ *p* < *D* for every source. A source with *p* = 0
   is simply absent from the kept map, and #11 saves only the non-zero entries.
3. **When a duration changes.** If a source's effective duration changes from *D* to *D′* in a
   recompute during play, its progress becomes min(*p*, ⌊*p* × *D′* / *D*⌋) (F2). A shortened
   unit keeps its fraction, rounded down. A lengthened unit keeps its milliseconds, so kept
   progress never grows on a rescale (amendment A2). This applies to every source with kept
   progress, running or not.
   - During play only tending changes a duration (#2 P1.5).
     - Method patches to `duration` are applied at load, and the commit that selects them comes
       before any progress exists (S3.5).
     - The Foundation stage touches caps only.
   - On load the old *D* is unknown, so saved progress is clamped instead (Edge Cases).
   - The fraction of the unit already done is kept, rounded down, so *p′* < *D′*. The change
     itself never completes a unit.
   - Without this, time spent under one duration would be paid out in units of another: tending
     could be switched on to cash in untended progress.
   - **Why a lengthened unit keeps milliseconds, not its fraction** (A2). Tending changes a
     gatherer's yield with its duration (`tending.md` D3). Keeping the fraction on a lengthening
     would let a player run a unit untended to 80%, heap it, and collect the heaped yield for a
     quarter of a heaped unit's time: 7 Ash Tallow per 5,250 ms, against 7 per 6,250 heaped or 5
     per 5,000 untended. Under the min rule, every unit completed in a duration regime has used
     that regime's full *D* of real progress. So no toggling pattern earns more than the best
     regime's own rate.

#### S7. The away cap

1. **The counter.** The slot counts **time since the last input**, *t*, in activity ms. Every
   input resets it to 0 (S3.3). Resting does not advance it.
2. **The cap.** A unit may start only while *t* < `AWAY_CAP`. A unit that has started always
   finishes, so a run may pass the cap by less than one unit.
   - This lets a unit outlast the away cap, which #1's Tuning Knobs asked #4 to allow before
     the duration ceiling could rise above the cap.
3. **The value.** `AWAY_CAP` is provisionally 86,400,000 ms (24 h). The concept leaves the final
   value to architecture (concept Open Questions; systems index rationale 4).
4. **Measured in activity ms, not real ms**, for two reasons:
   - it composes exactly under the doubled speed of S8, because unit boundaries fall on whole
     activity ms;
   - the number of units a run can complete is then bounded by `AWAY_CAP` alone (S10).
5. **What it is for.** It bounds how long one choice runs unattended.
   - In the MVP every activity stops on S5's input or room condition within about a minute
     (#3 K1), so the cap is a safety bound that only later realms with larger caps will meet.
   - Rest after the cap holds breath like any rest (S8).

#### S8. Rest and held breath

1. **Banking.** While the slot rests, each real ms adds 1 ms to the **rest bank** *b*, up to
   `BANK_CAP` (1,800,000 ms, 30 min).
2. **Spending.** While a source runs and *b* > 0:
   - each real ms advances the run by 2 activity ms and takes 1 ms from the bank;
   - once *b* reaches 0, the run advances 1 activity ms per real ms.

   `REST_SPEED` is exactly 2. With an integer ratio, every quantity stays whole ms, and the
   composition law holds with no remainder in state (F1).
3. **Conservation.** Rest defers time and never creates it. From run start, total activity ms
   never exceeds total real ms (F1). Being away or switching late can therefore at best tie
   with playing straight through, never beat it. No idling strategy dominates.
4. **Automatic.** The bank is spent automatically, never by a button. A deliberate spend would
   be a click with one right answer, which is the attention tax pillar 4 forbids (rule 25
   revisited, Overview).
5. **Not a modifier, not a resource.**
   - The bank is not a `resource` record and has no store. It is not a seal input, and no
     modifier stage touches it (#2).
   - Effective durations, inputs and outputs stay exactly as #2 gives them. Only the conversion
     from real time to activity time changes.
   - Tending (#10) and held breath multiply: a tended unit at rested speed takes ⌈*D*tended / 2⌉
     real ms. #10 sets its ceilings knowing this.
6. **The same rule live and away.**
   - A player who reacts late to a stop gets the seconds the slot rested back at double speed,
     so no stop ever has to be watched for. This answers the latency half of #3 Open Question 3.
     How often the player must switch stays the content tuning of Crafting route (#8)
     (Open Questions).
   - Rest before the commit also banks, so a slow commit can be followed by up to half an hour
     at double speed. Pacing bands timed from the commit are therefore measured twice (F5,
     S11): ceilings with an empty bank and floors with a full one.

#### S9. `advance(state, dt)`

1. **The only way time passes.** `advance` is the only way time passes, live or away. It is a
   pure function: it reads the state, the effective set (#2) and *dt*, and returns the new
   state and its events.
2. **dt.**
   - *dt* is a non-negative integer of real ms. The rules core's time entry measures it from one
     wall clock: *dt* = max(0, now − `lastSeen`), then `lastSeen` := now. The clock source is an
     ADR.
   - `advance` rejects a *dt* that is negative, fractional or not a safe integer as a caller
     error. It throws with the state unchanged and never rounds.
   - A clock that went backwards gives *dt* = 0 and re-anchors, so the game never freezes
     waiting for the old time.
   - A clock that jumps forward gains at most what `AWAY_CAP` and `BANK_CAP` allow.
   - A *dt* above `DT_MAX` (2⁵⁰ ms) is treated as `DT_MAX`, so 2 × *dt* stays a safe integer.
     This is exact: the state stops changing once *dt* passes `AWAY_CAP` + the longest unit +
     `BANK_CAP` (about 49 h), and `DT_MAX` is far beyond that.
   - `lastSeen` belongs to Save (#11) and is not part of the state `advance` reads.
3. **Who calls it.**
   - Live, the shell (#13) calls `advance` on its own cadence: frames or timers, plus every
     visibility change and page show, before painting. The cadence is presentation only,
     because any split gives the same state (S9.4). A throttled background tab just delivers a
     larger *dt*.
   - Away, Save (#11) calls it once on load with the gap.
4. **Composition law.** For every state *s* and all *a*, *b* ≥ 0:
   `advance(advance(s, a), b) = advance(s, a + b)`, compared on state. Events are compared as
   merged counts. The law holds because:
   - every counter is an integer kept in state;
   - the bank converts at exactly 2 (S8);
   - the stop rule reads only state;
   - the away cap is measured in activity ms (S7).
5. **Segments.** One `advance` covers one segment. A segment ends at any player action, and at
   any event that changes an input of #2's recompute: a tending change (only the player's own
   `setHeap`, #10 D5), the forge, or the commit. The pipeline then recomputes, S6.3 rescales progress,
   and the next segment begins (#2 P9.4). `advance` never sees an effective value change inside
   one call.
6. **`advance(s, 0)` normalises.** It runs S5's segment-start check and completes nothing.

#### S10. Units per `advance`

1. **One run per advance.** Between two inputs the slot holds at most one run, because a stop
   leads to rest and only an input starts a source. So one `advance` completes at most the
   units one run can complete.
2. **The bound.** A run completes at most 1 + ⌈(`AWAY_CAP` − 1) / `UNIT_FLOOR_MS`⌉ units (F3).
   - `UNIT_FLOOR_MS` (1,000 ms) is the shortest effective duration content may have. T1
     checks it (S11).
   - With the provisional values the bound is 86,401 units.
   - The bound counts activity ms, so held breath does not change it.
3. **Declared product pairs (#1 R8.2):**
   - (`source.outputs`, `UNITS_MAX`) and (`source.inputs`, `UNITS_MAX`), with `UNITS_MAX` =
     100,000 ≥ the bound: largest product 10¹⁴.
   - (`source.duration`, `source.duration`), for S6.3's rescale: largest product 7.46 × 10¹⁵.
   - Every product stays at or below 2⁵³ − 1.
4. **No product is formed today.** Settle runs once per unit (S4.3), so no k × outputs product
   is ever formed. The pairs guard any later closed-form batch, which must be proved equal to
   the per-unit loop.

#### S11. Content checks owned here

The Validator (#12) runs these on the checked content and on each method's frozen set.

| # | Check | Severity |
|---|---|---|
| T1 | **Unit floor.** Every source's effective `duration` is at least `UNIT_FLOOR_MS`, untended and after every tending entry list Tending (#10) can produce | error |
| T2 | **Lone ingredient output.** A source with an ingredient output has no other output with a positive net, because once the ingredient is held, S5.3 stops the source before its by-product can fill | warning |
| T3 | **Run bound.** F3's bound is at most `UNITS_MAX` (a check on constants, run once per schema) | error |

Resources and caps (#3) numbers its checks V1–V7. These are T1–T3 so that the two lists never
collide.

**Pacing bands** that the Validator times from the commit (#3 V7 and later route bands) read
real time through F5:

- a ceiling with an empty bank, *eta*(*A*, 0) = *A*;
- a floor with a full one, *eta*(*A*, `BANK_CAP`).

Rest before the commit can fill the bank, but by conservation (F1) no band timed from run start
can be beaten.

#### S12. State, actions and events (TD finding 6)

- **Non-derived state owned:**
  - the occupant (rest, or a source id);
  - the last stop's reason;
  - kept progress (a sparse map from source id to activity ms);
  - the time since the last input (activity ms);
  - the rest bank (ms);
  - the high-water marks. #1's Interactions row 4 gives them to #4. #3's settle is their only
    writer during play (#1 F1).

  `lastSeen` is Save's (#11).
- **Derived, never saved:** effective `duration`, `inputs`, `outputs` and `enabled` (#2); room
  and full (#3); whether each source can run (S5); the time to the next completion or stop.
- **Actions accepted:** `start(sourceId)`, `stop()`.
- **Events emitted** (payloads go to an ADR, with #3's):
  - `runStarted {source}`;
  - `unitsCompleted {source, count}`, merged per `advance`;
  - `fightLost {source}`;
  - `runStopped {source, reason}`, where reason is one of `withdrawn`, `inputs`, `full`,
    `away`, `lost`, `player`;
  - #3's `overflow` events, merged per `advance` into one per id (#3 K10).

  Events are not state: the composition test compares state and summed event counts.

### States and Transitions

**The slot.** Its two states are saved: the occupant is non-derived state.

| State | Holds when | Notes |
|---|---|---|
| Resting | The occupant is rest | The bank fills, up to `BANK_CAP`. Every source's progress is kept |
| Running(s) | The occupant is source s | s accrues progress at 1 or 2 activity ms per real ms (S8). Kept progress of other sources is unchanged |

| From | Trigger | To |
|---|---|---|
| Resting | An accepted Start(s) | Running(s), resuming s's kept progress |
| Running(s) | An accepted Start(s′), s′ ≠ s | Running(s′). s keeps its progress |
| Running(s) | Stop(): reason `player` | Resting |
| Running(s) | S5 fails at a unit or segment start: reason `withdrawn`, `inputs`, `full` or `away` | Resting. s keeps its progress |
| Running(s) | A unit's fight is lost: reason `lost` | Resting. s's progress is 0 |
| Any | A refused Start | Unchanged; not an input |
| Any | Run start (#11) | Resting, with an empty bank, no kept progress and *t* = 0 |

**Held breath**, derived from the occupant and *b*:

| State | Holds when |
|---|---|
| Empty | *b* = 0 |
| Holding | Resting and 0 < *b* < `BANK_CAP` |
| Full | Resting and *b* = `BANK_CAP`. Further rest adds nothing |
| Spending | Running and *b* > 0: the run moves at 2 activity ms per real ms |

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | The `source` type and its rows (`inputs`, `outputs`, `duration` are #4's; `fights` #9's; `enabled` #7's); F1's unit order and precondition; F7 (actionable); R8.2 product pairs; need text (R5.5) | The stop rule; the answer to Open Question 3 (rest is not a record); the product pairs of S10.3; ownership of the marks as state; permission for a unit to outlast the away cap (S7.2) | #1 owns the type and the rows; this GDD owns their values and the stop rule |
| 2 | Modifier pipeline | Effective `inputs`, `outputs`, `duration`, `enabled`, constant per segment (P9.4) | Segment boundaries (S9.5) | #4 |
| 3 | Resources and caps | `settle` (K3), `room` and full (K6), `overflow` | One settle per unit, cause `unit`, under the precondition `held ≥ inputs` (S4.4); `overflow` merged per `advance`; answers to Open Questions 3 and 4 (S8.6, this GDD's Open Questions) | #3 owns settle; #4 owns when it is called |
| 5 | Combat resolver | The chain result | One call per completed unit of a source with `fights`; a loss costs the unit's time only (S4.2) | #4 owns when a fight runs and what a loss costs; #5 owns the result |
| 6 | Forge and proving | The forge, as an input and a segment boundary; consumption of held ingredients | A running source whose input the forge consumed stops at the next segment start, with its progress kept (S4.4) | #6 |
| 7 | Methods | The commit, as an input and a segment boundary | Nothing runs before the commit (S3.5) | #7 |
| 9 | Fight and dungeon routes | The challenger for route fights (#5 C9); floor chaining through `reached` | Per-unit fights; a floor whose output is a key item stops after one unit (S5.3) | #9 owns the challenger and chaining |
| 10 | Tending | Tending entries on `source.outputs` and `source.duration`; tending changes as segment boundaries | Progress rescaling (S6.3); T1 on tended durations; held breath multiplies tended speed (S8.5); a stop never touches the tending choice. Whether the choice survives a stop is #10's (#2 Open Question 4) | #10 |
| 11 | Save and run lifecycle | `lastSeen`; the gap on load; run start | The state slice (S12); `advance` on load (S9.3); dropping kept progress for departed ids | #11 composes the slices |
| 12 | Validator | — | T1–T3; pacing ceilings measured with an empty bank and floors with a full one (F5) | #12 runs them; #4 owns their meaning |
| 13 | Interface shell | — | The occupant, progress, stop reason and held breath to display; the events of S12 | #13 |

*Specialists consulted for this section: `systems-designer` (primary), `game-designer` and
`gameplay-programmer` (supporting). They agreed on the stop rule, kept progress, one settle per
unit, the cost of a loss, and a time-based unit bound. They split on rest:
`systems-designer` would leave rest idle and save the bank for a later lever, while
`game-designer` recommended the bank. The designer chose the bank (30 min, 2×) on 2026-11-20.
`gameplay-programmer` confirmed that a ratio of exactly 2 composes in whole ms and that a
ratio of 1.5 would need a remainder carried in state.*

## Formulas

All values are integers, and every division goes through `div_floor` (#1 F5). A ceiling
⌈x / y⌉ is written `div_floor(x + y − 1, y)` for positive *y*. Formulas owned elsewhere and
used here: `settle` (#3 Q2), `room` (#3 Q4), `high_water` (#1 F1), the resolver's chain result
(#5).

### F1. Time budget and held breath

The rest_bank formula is defined as:

`budget = running ? dt + min(dt, b) : 0` ·
`used = min(budget, A_stop)` ·
`b′ = min(BANK_CAP, b + dt − used)` ·
`t′ = t + used`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| dt | int | 0–`DT_MAX` (2⁵⁰) real ms | caller (S9.2) | Real time this call covers |
| b | int | 0–`BANK_CAP` ms | game state | Held breath before the call |
| running | bool | — | game state | Whether a source fills the slot when the call starts |
| budget | int | 0–2 × dt activity ms | calculated | The most activity time this call can give the run |
| A_stop | int or ∞ | 0–budget, or ∞ | calculated | Activity ms from the call's start until the run stops (S5 fails or a fight is lost); ∞ if it does not stop within the budget |
| used | int | 0–budget | calculated | Activity ms the run actually received |
| t | int | 0 to `AWAY_CAP` − 1 + the longest unit | game state | Time since the last input, in activity ms (S7) |
| BANK_CAP | int | 1,800,000 ms | constant (tuning knob) | The most breath rest can hold |

**Output Range:**

- **b′** is 0 to `BANK_CAP`.
- **Reading.** Within one call the run comes first and rest second, never the reverse. While
  *b* > 0 the run takes 1 bank ms per real ms at 2 activity ms per real ms. Once it stops, the
  rest of the call's real time refills the bank. F1 gives that result without locating the
  real-time instant of the stop, which can fall mid-ms at double speed.
- **Conservation.** From run start, where *b* = 0, Σ used + *b* ≤ Σ dt always. So activity time
  never exceeds real time (S8.3). Breath lost to the cap is the only slack.
- **Composition.** F1 composes: a call that ends running leaves *b* − min(dt, *b*), and
  min(*a*, *b*₀) + min(*b*, *b*₀ − min(*a*, *b*₀)) = min(*a* + *b*, *b*₀). A run that stops
  in the second of two calls gives the same *b′* as one call, because both equal
  min(`BANK_CAP`, *b*₀ + *a* + *b* − used).

**Example:**

- **A stop inside the call.** *b* = 600,000, *dt* = 1,000, and the run stops after 500
  activity ms. Then budget = 2,000, used = 500, and *b′* = min(1,800,000, 600,500) = 600,500.
  Read physically: 250 real ms running at double speed spent 250 ms of breath, then 750 real
  ms resting added 750 ms.
- **The bank runs dry.** *b* = 300, *dt* = 1,000, and the run does not stop. Then budget = 1,300,
  used = 1,300, and *b′* = 0.

### F2. Progress rescale

The progress_rescale formula is defined as:

`p′ = min(p, div_floor(p × D′, D))` (amendment A2; it was `div_floor(p × D′, D)`)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| p | int | 0 to D − 1 activity ms | game state | Kept progress before the change |
| D | int | `UNIT_FLOOR_MS`–86,400,000 ms | effective set (#2) | The duration before the recompute |
| D′ | int | `UNIT_FLOOR_MS`–86,400,000 ms | effective set (#2) | The duration after the recompute |

**Output Range:**

- 0 ≤ *p′* < *D′*, *p′* ≤ *p*, and *p′* × *D* ≤ *p* × *D′*. A rescale never gains time, and
  kept progress never grows.
  - A shortening (*D′* < *D*) keeps the fraction, rounded down.
  - A lengthening (*D′* > *D*) keeps *p*, which is below *D* < *D′*, so the normal form holds.
- A round trip *D* → *D′* → *D* never gains. It keeps *p* to within rounding only when the
  lengthening comes first. Shortening first loses the fraction the lengthening does not restore:
  less than *p* × |*D* − *D′*| / max(*D*, *D′*) + 1 ms, and so less than one unit.
- **Why min** (A2): once a unit's yield can change with its duration, a fraction kept on a
  lengthening would pay time earned at one yield at another (S6.3). Under the min rule, no
  pattern of changes beats the better duration's own rate.
- The product is at most 86,400,000² ≈ 7.46 × 10¹⁵ ≤ 2⁵³ − 1. That is the declared pair
  (`source.duration`, `source.duration`) of S10.3.
- It runs only on a recompute during play, never on load (S6.3).

**Example:** A 6,000 ms render is 4,000 ms in, and tending shortens it to 4,500 ms:
*p′* = min(4,000, div_floor(18,000,000,000, 6,000)) = 3,000, two-thirds of the way through either
way. Untending it lengthens the unit back to 6,000 ms and keeps the 3,000 ms (half way), because
min(3,000, div_floor(3,000 × 6,000, 4,500)) = min(3,000, 4,000) = 3,000. The round trip costs 1,000
ms. A heaped skim (`tending.md` D3) is the lengthening case: 5,000 → 6,250 keeps *p* 4,999 at
4,999.

### F3. Run bound

The run_unit_bound formula is defined as:

`units_max = 1 + ⌈(AWAY_CAP − 1) / UNIT_FLOOR_MS⌉`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| AWAY_CAP | int | 86,400,000 ms (provisional; architecture pins it) | constant (tuning knob) | Activity time a run may start units within after the last input (S7) |
| UNIT_FLOOR_MS | int | 1,000 ms | constant (tuning knob) | The shortest effective duration content may have (T1) |

**Output Range:** 86,401 units with the provisional values, at most `UNITS_MAX` (100,000) by T3.

- **The worst case.** A run starts at *t* = 0 with kept progress *D* − 1, so its first unit
  completes after 1 ms. Every later unit takes at least `UNIT_FLOOR_MS`, and a new unit may
  start only while *t* < `AWAY_CAP`.
- **Why no unit is shorter.** A rescale keeps at most the fraction of the unit done (F2, A2),
  so no unit after the first can take less than the floor.
- **Why the ceiling.** ⌊`AWAY_CAP` / `UNIT_FLOOR_MS`⌋ + 1 undercounts by one when the floor
  does not divide the cap. A check with `AWAY_CAP` = 98 and a floor of 3 runs 34 units, while
  that form gives 33.

**Example:** 1 + ⌈86,399,999 / 1,000⌉ = 1 + 86,400 = 86,401.

### F4. Units to a stop

The units_to_stop formula is defined as:

`U = min over ids of u(id)`, where for each id of `inputs` ∪ `outputs`, with
`net = out − in` (absent keys count 0):

- `u = 0` if `held < in`;
- otherwise `u = div_floor(held − in, −net) + 1` if `net < 0`;
- otherwise `u = ⌈room / net⌉` (0 when `room` is 0) if `net > 0` and the id is an output;
- otherwise `u = ∞`.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| held | int | 0 to cap | game state (#3) | Held amount of the id |
| in, out | int | 0–10⁹ | effective set (#2) | The source's `inputs` and `outputs` amount for the id |
| room | int | 0 to cap | #3 Q4 | cap − held |
| U | int or ∞ | 0 to ∞ | calculated | Units the run completes before S5's input or room condition stops it, assuming every fight is won and no segment boundary intervenes |

**Output Range:**

- *U* = 0 means the source cannot start.
- *U* = ∞ only when no id moves toward a stop. Then the away cap (F3) ends the run.
- F4 is a read-only projection, for display and for the Validator's route timing. The rules
  never use it to skip units: the run still completes them one settle at a time (S4.3).

**Example:**

- **Render tallow** (30 Ash Tallow in, 3 Rendered Oil out), with tallow 40/40 and oil 0/12.
  Tallow's net is −30, so *u* = div_floor(10, 30) + 1 = 1. Oil's net is +3, so
  *u* = ⌈12 / 3⌉ = 4. *U* = 1.
- **Same id.** A source takes 4 and gives 3 of one id, with held 5. Net is −1, so
  *u* = div_floor(1, 1) + 1 = 2: the store goes 5 → 4 → 3, then stops at 3 < 4.

### F5. Real time to pass activity time

The eta formula is defined as:

`eta(r, b) = r ≤ 2b ? ⌈r / 2⌉ : r − b`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| r | int | 0–10¹³ activity ms | calculated | Activity time to pass: (*D* − *p*) for the current unit, or (*D* − *p*) + (*U* − 1) × *D* to the stop F4 predicts |
| b | int | 0–`BANK_CAP` ms | game state | Held breath |

**Output Range:**

- 0 to *r* real ms, continuous at *r* = 2*b*.
- (*U* − 1) × *D* ≤ 86,401 × 86,400,000 ≈ 7.5 × 10¹², a safe integer.
- **Uses:**
  - the shell's countdowns, for the unit and for the run's stop;
  - the Validator's pacing bands timed from the commit, read with *b* = 0 for a ceiling and
    *b* = `BANK_CAP` for a floor (S11).

**Example:** A 6,000 ms unit is 1,500 in, *U* = 4, and *b* = 10,000. Then
*r* = 4,500 + 18,000 = 22,500. Since 2*b* = 20,000 < *r*, *eta* = 22,500 − 10,000 = 12,500 real
ms: 10,000 real ms at double speed cover 20,000 activity ms, and the last 2,500 run at single
speed.

*Specialists: `systems-designer` reviewed F1–F5 and proposed F4. `gameplay-programmer`
confirmed that F1 composes only with an integer speed ratio. A throwaway simulation (20,000
random splits with the bank, away cap and kept progress) found no composition failure, and
reached F3's bound exactly.*

## Edge Cases

Each case says who catches it: the rules core at runtime, the Validator (#12) at build, or
Save (#11) on load.

### Time and the clock

- **If dt = 0**: only S5's segment-start check runs. Nothing accrues. Repeating the call
  changes nothing.
- **If the clock goes backwards**: *dt* is 0, and `lastSeen` re-anchors to the new time (S9.2).
  Nothing is undone, and the game does not freeze until the old time returns.
- **If the clock jumps forward** (a changed system clock): the gap is treated as real time. It
  gains at most one run up to the away cap and a full bank, the same as an honest absence of
  that length. No guard is added: there is one player, and no leaderboard.
- **If dt exceeds `DT_MAX`**: it is clamped to `DT_MAX` (S9.2). The state is the same as for
  any *dt* beyond about 49 h.
- **If a unit completes exactly at the end of dt**: it counts in this call. S5 runs at that
  instant, so a run that stops there is already resting when the call returns (S4.1).
- **If the bank is full while resting**: it stays at `BANK_CAP`, and the rest of that real time
  is lost. This is the only time the slot loses (F1).

### Starting and stopping

- **If the away cap is reached exactly at a unit boundary** (*t* = `AWAY_CAP`): no unit starts
  (strict <), and the run stops with reason `away`. At *t* = `AWAY_CAP` − 1 one more unit
  starts and finishes, overshooting by less than one unit (S7.2).
- **If the player starts a source after an `away` stop**: the Start is an input, so it is
  checked with *t* = 0 and accepted if S5's other conditions hold (S3.1).
- **If a stop and a Start land in the same ms**: `advance` runs first (S3.4), and the Start
  checks S5 against the present. So a Start of the source that just stopped `full` is refused
  with "… is full".
- **If the player starts a source that cannot run**: it is refused with the named reason, the
  slot is unchanged, and the refusal is not an input (S3.1, S3.3).
- **If Stop() arrives while resting**: it is refused, because nothing runs, and it is not an
  input.
- **If every output's net is 0 or less and an input's net is negative** (a pure sink, or a
  converter that only pays): the run ignores full stores and ends when the input runs short.
  #1's validator already rejects a source whose outputs equal its inputs, so some id always
  moves.
- **If an ingredient output is already held**: its store is full, so the source cannot start
  (S5.3). The refusal reads "[ingredient] is already held". Only Forge and proving (#6) frees
  the store.
- **If a source outputs a key item** (cap 1, never spent, #3 V5): it runs one unit, then stops
  `full` for the rest of the run, and every later Start is refused. That is the intended shape
  for one-time crafts and dungeon floor markers (#9).
- **If a cap rises while a run is stopped `full`** (the forge, #3 K5): the run does not resume
  by itself, because only an input starts a source (S10.1). The forge is itself an input, so
  the player is present to choose.

### Fights

- **If a fight unit is lost**: nothing is paid or received. The source's progress becomes 0,
  the run stops `lost`, and rest fills the slot (S4.2). The inputs stay held.
- **If a fight's outcome would change between segments** (for example, if route fights read the
  Foundation after the forge, #5 Open Question 3): each completion uses the challenger of its
  own segment. Within a segment every unit has the same outcome, so a loss never alternates
  with a win inside one call.

### Progress and durations

- **If a duration changes while the source runs**: its progress is rescaled (F2), and the unit
  continues from the same fraction.
- **If a duration changes while the slot rests**: every kept entry is rescaled (F2). The bank
  and *t* are untouched.
- **If tending is switched on and off repeatedly**: each switch rescales and can lose progress,
  never gain any (F2, A2). A lengthening keeps the milliseconds, and a shortening keeps the
  fraction. Untended progress cannot be cashed in at a tended speed or a tended yield, and no
  rhythm of switches beats leaving the choice alone.
- **If a source is switched away from and back**: its kept progress resumes. Two sources
  alternated keep two partial units, and nothing is gained or lost.

### Forge, commit and content

- **If the forge consumes an input ingredient of the running source mid-unit**: the next
  segment's S5 check stops the run with reason `inputs`, and its progress is kept (S4.4).
- **If the player rests before the commit**: the bank fills, so the first half hour after the
  commit can run at double speed (S8.6). Bands timed from the commit measure their floors with
  a full bank (S11). No band timed from run start can be beaten (F1).
- **If a save loads and the saved occupant is unknown or no longer offered** (a content update
  removed it, disabled it or raised its `need`; Save #11):
  - the slot is set to resting with reason `withdrawn` *before* the gap is advanced, so the gap
    fills the bank;
  - #11 shows its content-changed notice, triggered by the fingerprint mismatch (#1).
- **If a save holds kept progress for an unknown source**: Save (#11) drops the entry on load,
  as #1 and #3 drop departed ids.
- **If saved progress is not below the new duration** (a content update shortened the unit,
  and the old duration is not saved): it becomes *D′* − 1, so the unit completes on its next
  millisecond. Rescaling needs the old *D* and runs only during play (S6.3).
- **If a build lowers `BANK_CAP` or `AWAY_CAP` under a save**: a saved bank above `BANK_CAP`
  is clamped to it on load. A saved *t* above `AWAY_CAP` simply stops the run at its next unit
  start.
- **If a content update leaves a source's tended duration below `UNIT_FLOOR_MS`**: T1 fails the
  build, so no shipped content reaches the rules core with a shorter unit.

### Degenerate strategies

- **Idling to bank breath, then bursting.** Conservation (F1) makes this at best a tie with
  playing straight through. It is never a dominant line.
- **Leaving the game open without input.** The run stops at the away cap, and rest banks up to
  `BANK_CAP`. Watching earns nothing that leaving does not.
- **Starting a fight source known to lose.** It costs one unit of time and nothing else. The
  resolver's projection shows the loss before the Start (#5).

*Specialist: `systems-designer` proposed these cases from the rule space. All were adopted. Two
of them corrected the Core Rules: the away cap on Start (S3.1), and the forge as a duration
trigger (S6.3).*

## Dependencies

**Upstream (this system depends on):**

| System | Nature | What this system needs |
|---|---|---|
| Content records and schema (#1) | Hard | The `source` type and rows; F1's unit order and precondition; F7 actionable; R5.5 need text; R8.2 declared product pairs; `div_floor` |
| Modifier pipeline and recompute (#2) | Hard | Effective `inputs`, `outputs`, `duration`, `enabled`, constant per segment (P9.4); recompute events as segment boundaries |
| Resources and caps (#3) | Hard | `settle` (K3), `room` and full (K6), `overflow` (K10) |
| Combat resolver (#5) | Hard, for sources with `fights` | The chain result per unit (C5); the challenger comes from #9 (C9) |

**Downstream (depend on this system):**

| System | Nature | What it needs from this system |
|---|---|---|
| Forge and proving (#6) | Soft | The forge is an input and a segment boundary. A run whose input it consumes stops cleanly (S4.4) |
| Methods (#7) | Soft | The commit is an input. Nothing runs before it (S3.5) |
| Crafting route (#8) | Hard | The activity shape (S2) and the stop rule (S5). Run lengths are its tuning (Open Question 1) |
| Fight and dungeon routes (#9) | Hard | Per-unit fights; a loss costs time only (S4.2); key-item floor outputs stop after one unit |
| Tending (#10) | Hard | Segment boundaries, progress rescaling (S6.3), T1 on tended durations, held breath multiplying tended speed (S8.5) |
| Save and run lifecycle (#11) | Hard | The state slice (S12); `advance` for the gap on load; the load rules of Edge Cases |
| Content validator (#12) | Hard | T1–T3; pacing measured with an empty bank for ceilings and a full one for floors (F5) |
| Interface shell (#13) | Hard | The occupant, progress, countdowns (F5), held breath and stop reasons; the S12 events |

**Bidirectionality.**

- **#1, #2 and #3** each name Activity slot (#4) in their Dependencies.
- **#5** names #4, and its Open Question 6 asks the systems index to list the Combat resolver
  in row #4's Depends On. This GDD's systems-index update does that.
- **#6** lists this system in its Dependencies. **#7–#13 are undesigned.** Each must list
  "depends on: Activity slot, rest and away time" in its own Dependencies.

## Tuning Knobs

| Knob | Value | Safe range | Affects | Too low | Too high |
|---|---|---|---|---|---|
| `BANK_CAP` | 1,800,000 ms (30 min) | 600,000–3,600,000 | How much rested or away time comes back as double speed | A long absence returns little. Switching latency (seconds) still comes back in full | A full bank covers most of a 30–60 min MVP session. Pacing floors timed from the commit shrink by up to `BANK_CAP` (F5) |
| `REST_SPEED` | 2 | 2; any other integer edits F1 | How fast held breath is spent | — | 3 or more raises the switch rate during a burst. A non-integer ratio needs a remainder in state to compose (S8.2) |
| `AWAY_CAP` | 86,400,000 ms (24 h), provisional | 28,800,000–86,400,000 | How long one choice runs unattended (S7) | Slow later-realm runs stop overnight; rest still banks | F3's bound grows. Above 99,999,001 ms with the 1,000 ms floor, T3 fails |
| `UNIT_FLOOR_MS` | 1,000 ms | 865–2,000 | The shortest unit; F3's bound | Below 865 ms with the 24 h cap, T3 fails (F3 gives 100,001 at 864) | At 2,000 ms #3 K1's skim is already at the floor, and tending's speed ceiling (#10) has no room |
| `UNITS_MAX` | 100,000 | F3's bound to 9,007,199 | The declared product pairs; the most settles one `advance` may run | Below F3's bound, T3 fails | Above 9,007,199, (`source.outputs` 10⁹ × `UNITS_MAX`) passes 2⁵³ − 1 |
| `DT_MAX` | 2⁵⁰ ms | from `AWAY_CAP` + 86,400,000 + `BANK_CAP` up to 2⁵² | Integer safety of 2 × *dt* | Below the saturation point, the clamp would change results | Above 2⁵², 2 × *dt* is no longer a safe integer |

**Interactions:**

- **`AWAY_CAP`, `UNIT_FLOOR_MS` and `UNITS_MAX`** are tied by T3, so one cannot move without
  checking the other two.
- **`BANK_CAP` with Tending's ceilings (#10).** A tended unit at rested speed takes ⌈*D*tended /
  2⌉ real ms, so #10 sets its speed ceiling against the product.
- **`BANK_CAP` with pacing floors.** The floors that #12 times from the commit read F5 with a
  full bank.
- **Owned elsewhere and not duplicated here:** the duration ceiling (#1, 86,400,000 ms; S7.2
  lets a unit outlast the away cap), `FIRST_CAP_MS` (#3 V7), and every source's `inputs`,
  `outputs` and `duration` values. Those belong to the route GDDs (#8, #9), under the row
  ownership of #1 R4.

## Visual/Audio Requirements

Visual/Audio is optional for a Core system. This system adds no art and no audio (the game has
no audio system yet). Its visuals are presentation owned by the Interface shell (#13), and they
follow the concept's Visual Identity Anchor: type, colour, layout and simple glyphs.

- **Rest** has one glyph, shown in the slot when it rests. Nothing else uses it.
- **The doubled speed** is shown by a "×2" mark on the running line, and never by colour alone
  (glyph before hue, systems index #18).
- **No effect plays on a stop.** The stop reason is text, in the same frame as the stop.

## Game Feel

- **Bars move every frame, numbers only at a settle.** The progress bar reads *p* / *D* from
  state on every paint. Stores change only when a unit completes (#3 Game Feel). At double speed
  the bar visibly moves twice as fast.
- **A late tap costs nothing.** The seconds between a stop and the next Start come back at
  double speed (S8.6). The interface never needs urgency cues, flashing or a sound on a stop.
- **Switching is free.** A switch never asks for confirmation, because nothing is lost (S6).
- **The return.** On load, the gap is advanced before the first paint (S9.3). The first screen
  already shows the stores the run filled, the stop reason and the held breath.
- **Performance target (provisional, pinned by an ADR):**
  - an `advance` of the largest run (F3's 86,401 units) finishes within 100 ms on the build
    machine;
  - a live tick within 1 ms.

  `gameplay-programmer` measured 10⁶ settles at about 0.1–0.2 s in Bun, so the target holds with
  about 10× headroom.

## UI Requirements

- **Persistent running line** (rule 32). It never leaves the screen and shows:
  - the occupant: the activity's name, or *Resting* with the rest glyph;
  - the current unit's progress bar and its countdown, plus the countdown to the run's stop
    (F4, F5);
  - the held breath, in minutes and seconds, with "×2" while it is being spent.
- **Every revealed source** shows whether it can run now. If it cannot, it shows the S5 reason
  in #1's shortfall form, before the player taps. Start is one tap. Stop is one tap on the
  running line. No action is held, repeated or timed (pillar 4).
- **Kept progress** shows as a partial bar on that source in its list.
- **Log lines:**
  - one line per stop: "[activity] stopped: [reason]";
  - one merged line per `advance` for units and spills (#3 UI Requirements);
  - on load, the same lines cover the whole gap, followed by the held breath.
- **Before the commit** every source shows "Needs a method committed" first (#1 R5.5), and the
  running line shows *Resting*.
- **Tooltips open by tap** (rule 33). The running line's tooltip breaks the countdown into
  real time at double speed and real time at single speed (F5).

> **📌 UX Flag — Activity slot, rest and away time**: this system has UI requirements. The
> Interface shell (#13) UX spec (`/ux-design`) must cover the running line, held breath, stop
> reasons, kept-progress bars and the return summary before epics are written. Stories cite
> `design/ux/[screen].md`, not this GDD.

## Cross-References

| This document references | Target | Element | Status |
|---|---|---|---|
| Content records and schema (#1) | `design/gdd/content-records-and-schema.md` | R4 rows `source.inputs`, `outputs`, `duration`; F1 unit order and precondition; F5 `div_floor`; F7; R5.5 need text; R8.2 product pairs; Open Question 3; Tuning Knobs duration ceiling | Approved |
| Modifier pipeline (#2) | `design/gdd/modifier-pipeline-and-recompute.md` | P1.5 rows per stage; P9.3–P9.4 recompute and segments; Open Question 4 | Approved |
| Resources and caps (#3) | `design/gdd/resources-and-caps.md` | K3 settle; K6 room and full; K10 events; Player Fantasy ("only the last unit's spill is lost"); V5, V7; Open Questions 3 and 4 | Approved |
| Combat resolver (#5) | `design/gdd/combat-resolver.md` | C5 chains; C8; C9 baseline challenger; Open Questions 3, 4 and 6 | Approved |
| Game concept | `design/gdd/game-concept.md` | Core Mechanics 4; Pillar 4 and its attention test; Stated divergences (rules 24, 25, 91); Retention Hooks; MDA Submission | Approved |
| Systems index | `design/gdd/systems-index.md` | Rationale 4; TD findings 4, 6 and 8 | Approved |
| Arcanum reference | `research/arcanum-reference/10-automation-and-time.md`, `12-design-rules.md` | Rules 23 (copied), 24 (diverged), 25 (revisited); `fill` and Relax | Reference |

## Acceptance Criteria

**Tags:**
- `[unit]` is a pure rules-core test.
- `[validator]` runs the Validator (#12) on a fixture.
- `[integration]` exercises another system's call path.

**Content:** **Fx** is a fixture loaded against a test schema (#1 R8.2); it may inject small
constants. **S** is the shipped content. **Blocked** names the system a criterion waits for; it runs
against a stub until that system is built.

**Sources used below** (#3 K1):

- *skim*: nothing in, 4 Ash Tallow out, 2,000 ms;
- *render*: 30 Ash Tallow in, 3 Rendered Oil out, 6,000 ms;
- caps: Ash Tallow 40, Rendered Oil 12.

### Rules

- **AC-S1-1** [unit]
  - **GIVEN** a new run, **THEN** the slot rests, *b* is 0, no progress is kept, and *t* is 0.
  - **WHEN** Start(skim) and then Start(render) are accepted, **THEN** render is the only
    occupant, and skim keeps its progress.
- **AC-S2-1** [unit, Fx] **GIVEN** two sources that differ only in id, **WHEN** each runs the
  same `advance` sequence, **THEN** stores, progress and events are identical.
- **AC-S3-1** [unit]
  - **GIVEN** Ash Tallow 29, **WHEN** Start(render), **THEN** it is refused with "Needs Ash
    Tallow ×30 (1 more)", and the state and *t* are unchanged.
  - **AND** an accepted Start of the running source sets *t* to 0.
  - **AND** Stop() while resting is refused, with *t* unchanged.
  - **AND** Stop() while running gives rest, reason `player`, with progress kept.
  - **AND GIVEN** skim running at Ash Tallow 36/40, **WHEN** a Start of skim arrives 2,000 ms
    later, **THEN** it is refused with "Ash Tallow is full".
- **AC-S4-1** [unit]
  - **GIVEN** skim, Ash Tallow 0 and *b* 0, **WHEN** advance(7,000), **THEN** Ash Tallow is 12,
    *p* is 1,000, and one `unitsCompleted {skim, 3}` is emitted.
  - **WHEN** advance(20,000) follows, **THEN** Ash Tallow is 40, the slot is already resting
    when the call returns, and `runStopped {skim, full}` is emitted.
- **AC-S4-2** [unit, Fx] With a stub resolver and two opponents:
  - a win gives one resolver call, with the list in order, then one settle;
  - a loss gives no settle and no change to any store or mark. *p* becomes 0, `fightLost` and
    `runStopped {lost}` are emitted, and advance(60,000) afterwards makes no further call.
- **AC-S4-3** [unit, Fx] **One settle per unit.**
  - **GIVEN** a source that takes 4 and gives 3 of one id, with held 5, **WHEN** it runs,
    **THEN** two settles occur, each {in 4, out 3, cause `unit`}. Held ends at 3, with stop
    reason `inputs`.
  - A single batch settle of in 8 would throw (#3 K3.1).
  - Over 10,000 seeded random sources, no settle throws.
- **AC-S5-1** [unit] Each stop reason:
  - a source disabled by a content fixture stops `withdrawn`;
  - render at Ash Tallow 29 stops `inputs`;
  - skim at Ash Tallow 40 stops `full`;
  - any source at *t* = `AWAY_CAP` stops `away`;
  - **GIVEN** Ash Tallow 10/40 and Rendered Oil 12/12, render stops `inputs`, the first failing
    condition.
- **AC-S5-2** [unit, Fx]
  - A source taking 4 and giving 3 of one id, held at 40/40, runs (net −1, so no full stop).
  - A source with two positive outputs stops when the first store fills.
  - A key-item output runs one unit, then stops `full`.
  - A unit at *p* 500 with *t* = `AWAY_CAP` + 10 finishes, then stops `away`.
- **AC-S6-1** [unit]
  - **GIVEN** skim at *p* 1,500, **WHEN** Start(render), advance(3,000), Start(skim), **THEN**
    skim's progress is 1,500 and render's is 3,000.
  - **AND** with a #2 stub that changes render's *D* from 6,000 to 4,500, its *p* 4,000 becomes
    3,000.
- **AC-S7-1** [unit, Fx] With `AWAY_CAP` 98, a floor of 3 and a 3 ms source:
  - at *t* 97 one more unit starts and finishes;
  - at *t* 98 none starts, the stop is `away`, and a later Start is accepted;
  - resting leaves *t* unchanged;
  - with *b* 100, advance(50) from *t* 0 uses 99 activity ms and leaves *b* at 51.
- **AC-S8-1** [unit]
  - Resting 2,000,000 ms gives *b* 1,800,000 and changes no store.
  - **GIVEN** *b* 10,000 and skim at *p* 0, **WHEN** advance(2,000), **THEN** 2 units complete
    and *b* is 8,000.
- **AC-S8-2** [unit] **Conservation.**
  - Over 10,000 seeded random action sequences, Σ used + *b* ≤ Σ *dt* after every call, from run
    start.
  - Resting 10,000 then running 10,000 gives the same activity time as running 20,000.
- **AC-S9-1** [unit, Fx + S] **Composition law.**
  - **GIVEN** 20,000 seeded cases, run with injected constants (`AWAY_CAP` 98, `BANK_CAP` 60,
    durations 3–20) and again with the shipped constants:
    - random sources: skim, render, a same-id source, a fight stub;
    - random held amounts, kept progress, *b* and *t*;
    - random *a*, *b* ≥ 0, plus three-way splits;
    - splits mid-unit and on odd ms at double speed, a stop in the second call, a full bank,
      and *t* crossing `AWAY_CAP`.
  - **THEN** advance(advance(*s*, *a*), *b*) deep-equals advance(*s*, *a* + *b*), and events
    match as merged counts.
  - **AND** 0 ≤ *p* < *D* and 0 ≤ *b* ≤ `BANK_CAP` hold after every call.
  - A mutant with a speed of 1.5 must fail this test.
- **AC-S9-2** [unit]
  - `advance` never mutates its input state.
  - advance(*s*, 0), twice, on a run whose input fell short, gives rest with reason `inputs`,
    progress kept, no unit completed, and identical results both times.
- **AC-S9-3** [unit] **Clock.**
  - With `lastSeen` 100,000 and now 95,000, *dt* is 0 and `lastSeen` becomes 95,000. Then at
    now 96,000, *dt* is 1,000.
  - *dt* = 2⁵⁰ + 1, 2⁵⁰ and 175,000,000 give identical states on a run that ends at the away
    cap.
  - advance(−1) and advance(1.5) throw, with the state unchanged.
  - An action 3,000 ms into a window splits it into advance(3,000), the action, and then an
    advance for the rest.
- **AC-S10-1** [unit, Fx] **Performance.**
  - **GIVEN** a source giving 1 per 1,000 ms (cap 10⁶) at *p* 999 and *t* 0, **WHEN**
    advance(10⁸), **THEN** 86,401 units complete in 86,401 settles, and the stop is `away`.
  - The median of 5 runs is at most 100 ms on the build machine.
  - A further advance(10⁹) starts nothing.
- **AC-S12-1** [unit]
  - A serialised state holds only the occupant, stop reason, kept map (no zero entries), *t*,
    *b* and the marks.
  - No action other than start and stop is accepted.
  - A unit that spills two ids emits one `overflow` for each.

### Formulas

- **AC-F1-1** [unit]
  - **GIVEN** *b* 600,000, *dt* 1,000 and skim at *p* 1,500 with Ash Tallow 36/40, **THEN** used
    is 500 and *b′* is 600,500.
  - With *b* 300, *dt* 1,000 and no stop, used is 1,300 and *b′* is 0.
- **AC-F2-1** [unit]
  - 6,000 → 4,500 maps *p* 4,000 to 3,000, and the reverse keeps it at 3,000 (A2).
  - 5,000 → 6,250 keeps *p* 4,999 at 4,999 (A2: a lengthening keeps milliseconds).
  - Over 10,000 random sequences of changes on one source, the progress after the sequence is
    never above the progress before it (A2).
  - *D′* 1,000 from *D* 6,000 maps *p* 5,999 to 999.
  - Over 10,000 random triples up to 86,400,000, checked BigInt-exact: *p′* × *D* ≤ *p* × *D′*
    and *p′* < *D′*.
- **AC-F3-1** [unit] (86,400,000; 1,000) gives 86,401, and (98; 3) gives 34. Both match a
  brute-force run.
- **AC-F4-1** [unit]
  - Render at Ash Tallow 40, Rendered Oil 0 gives *U* 1. At Ash Tallow 29 it gives 0.
  - A source taking 4 and giving 3 of one id, at held 5, gives 2.
  - A fixture with every net 0 gives ∞.
  - Over 10,000 seeded sources, *U* equals the units a real run completes.
- **AC-F5-1** [unit]
  - *D* 6,000, *p* 1,500, *U* 4 and *b* 10,000 give 12,500.
  - Over 10,000 random (*r*, *b*), *eta* is the smallest *dt* with *dt* + min(*dt*, *b*) ≥ *r*.

### Content checks (each with a failing fixture)

- **AC-T1-1** [validator, Fx]
  - A duration of 999 is an error, and 1,000 passes.
  - A tending entry list that takes 1,500 to 900 is an error. Real tending lists are
    **Blocked** on #10.
- **AC-T2-1** [validator, Fx] Outputs {an ingredient 1, Ash Tallow 4} warn. The ingredient
  alone passes, and so does the ingredient with an output whose net is 0 or less.
- **AC-T3-1** [validator]
  - `AWAY_CAP` 99,999,002, `UNIT_FLOOR_MS` 864 and `UNITS_MAX` 86,400 each fail.
  - 99,999,001 and 865 pass.
  - `UNITS_MAX` 9,007,200 fails the declared product pairs (#1 R8.3 step 8).
- **AC-S11-1** [validator, Fx, **Blocked** on #12] A skim route to a full store takes 20,000
  activity ms. A ceiling of 45,000 passes (*eta* 20,000). A floor of 15,000 fails, because at a
  full bank *eta* is 10,000.

### Load and cross-system

- **AC-L-1** [integration, Fx, **Blocked** on #11]
  - A saved occupant that content removed, with *b* 900,000 and a gap of 600,000, loads to rest
    with reason `withdrawn`, *b* 1,500,000, and no unit completed.
  - Saved *p* 5,000 with a new *D′* of 3,000 loads as 2,999, and advance(1) completes a unit.
  - Saved *p* 1,000 under a changed *D* is not rescaled.
- **AC-X-1** [integration, #3] **GIVEN** Ash Tallow 30/40 and Rendered Oil 11/12, **WHEN**
  render completes, **THEN** the only `overflow` is {Rendered Oil, 2, cause `unit`}, and the
  stop is `inputs`.
- **AC-X-2** [integration, Fx, **Blocked** on #6] A forge that consumes an input ingredient of
  the running source stops the run `inputs` at the next segment, with its progress kept.
- **AC-X-3** [integration, #5, **Blocked** on #9] With the real resolver, a lost unit zeroes
  progress and stops `lost`, and a repeated Start loses again. The tending cases are
  **Blocked** on #10.

### Checked by review, not by test

- Player Fantasy, the tone words and the log wording.
- The stated divergences (rules 24, 25, 91).
- The provisional constants, which ADRs pin.
- The UI Requirements, through screenshots with the Interface shell (#13).
- Pillar 4's attention tax, which is a playtest question (Open Question 1).
- S1.1's "no queue, no automation" is a negative. AC-S12-1's closed action set is its only
  test.
- `away` cannot occur in the MVP's shipped content, where every run ends on its inputs or room
  within minutes. It is tested on fixtures only.

*Specialist: `qa-lead` proposed these criteria and checked their arithmetic with throwaway
scripts. It flagged three ambiguities, fixed in Core Rules before writing: the refusal names
the first failing condition (S3.1); `advance` rejects a negative or fractional *dt* (S9.2);
there is one resolver call per unit, and the chain stops at its first loss (S4.2).*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **The click half of #3 Open Question 3.** Held breath makes a late switch free (S8.6), but the K1 chain still asks for about ten switches with an obvious answer in the first two minutes. Should Crafting route (#8) size opening units so that the median uninterrupted run is at least 30 s at single speed? K1's 6 s render fails that test. A one-entry "then" choice was considered and declined (designer, 2026-11-20). Revisit it only if a playtest shows ping-pong. Resolved 2026-11-21 by #8 (`crafting-route.md` L5.3, X1): yes. Every uninterrupted hearth run lasts at least 30 s, and a best four takes 28 runs with a median of 30 s | Crafting route (#8), with Resources and caps (#3) | Done; MVP playtest |
| 2 | **#3 Open Question 4.** Away progress is one store's fill by design, so no slot rule makes "what the last activity produced while away" (concept, Session-Level and Retention Hooks) a draw. Proposed rewording: "the stores the last run filled, and the breath held for the next". Resolved 2026-11-21: the designer applied it to the concept's Session-Level paragraph ("the stores the last run filled, with the breath held for the next"), and the Interface shell (#13) shows it as the away summary (`design/ux/interface-shell.md`, Events Fired) | Designer (concept owner) | Done |
| 3 | What is `AWAY_CAP`'s final value? 24 h is provisional (S7.3) | Technical Director | Architecture (ADR) |
| 4 | Resolved 2026-11-21 by #10 (`tending.md` D5; A2): yes. The heap bit is held per source and survives stops, switches, time away and the forge. Only the player's own accepted `setHeap` changes it, so a stop never splits a segment for tending | Tending (#10) | Done |
| 5 | Resolved 2026-11-20 by #6 (G13.2) and #9 (N3): no. Every route fight, before and after the forge, uses #9's unforged cultivator, a fixed `combatant` equal to `FOUNDATION_BASE`, so no segment's challenger differs | Forge and proving (#6), Fight and dungeon routes (#9) | Done |
| 6 | Should a source with an ingredient output and a by-product be an error rather than T2's warning? #9's half resolved 2026-11-20 (`fight-and-dungeon-routes.md` N2.2, U2): no fight route has a by-product, an error under U2, so T2 never fires on a route. #9 recommends T2 become an error for recipes too | Crafting route (#8), Fight and dungeon routes (#9) | #8 GDD |
| 7 | Rest before the commit fills the bank (S8.6). Should the bank start at the commit instead? Decided for now: no. It is simpler, and conservation holds from run start. Revisit if #12's pacing floors bind. Resolved 2026-11-21 by #12 (`content-validator-and-balance-enumeration.md` VR9.1–VR9.2): #6 B9, #7 H5 and #8 X3–X4 are prices in activity time, and no MVP check is a floor timed from the commit, so nothing binds and the bank keeps filling before the commit | Designer, with Validator (#12) | Done |
| 8 | A rest speed other than 2 needs a remainder in state (S8.2). Change it only if a playtest finds bursts too fast | Designer | MVP playtest |

*Open Question 6, recipe half: resolved 2026-11-21 by Crafting route (#8), `crafting-route.md` X6. A hearth recipe with a by-product is an error. With #9's U2 on the routes, that covers every ingredient source in the MVP. T2 stays a warning for every other source, so this GDD's rules are unchanged.*

**ADRs required** (representation this GDD leaves out, per TD finding 8):

1. The state slice's encoding (occupant, stop reason, kept progress, *t*, *b*, marks) and how
   Save (#11) composes it.
2. The time entry: the clock source for `now`, where `lastSeen` lives, the visibility and
   page-show hooks, and the rejection of a bad *dt* (S9.2).
3. `AWAY_CAP`'s final value (Open Question 3).
4. Event payloads and their per-`advance` merging, with #3's ADR 2 and the Interface shell's
   (#13) event channel.
5. The performance budget for `advance` on load and per live tick (Game Feel), with #1's ADR 9.
6. Later realms only: a closed-form batch for runs with no inputs, proved equal to the per-unit
   loop (S10.4).
