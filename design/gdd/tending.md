# Tending

> **Status**: Approved 2026-11-21 (lean review; findings in `design/gdd/reviews/tending-review-log.md`)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-21 — one watch-item, not a blocker: D4.5's bounded mid-fill reward (≤ 3.75 s per fill) is a soft tension with pillar 4's "picks the one that waits", guarded by the stated cut rule (Open Question 2)
> **Amends**: #4 Activity slot A2 2026-11-21 (S6.3, F2 min rule; Open Question 4 answered), designer-approved; status-only amendments marking Open Questions resolved: #2 A2 (row 4), #3 A1 (row 7), #9 A1 (row 3), designer-approved
> **Amendments**: A1 2026-11-21 — Open Questions 1 (the concept reworded by the designer) and 5 (the Interface shell #13 keeps the toggle on the row only) marked resolved (status edit only, no rule change; designer-approved). Touches Open Questions rows 1 and 5
> **Author**: designer + agents
> **Last Updated**: 2026-11-21
> **Last Verified**: 2026-11-21
> **Implements Pillar**: 4 (No dead ends, no attention tax), within its limit; supports 3 (The build is a problem)

## Summary

Tending lets the player **heap** any of the three gatherers. A heaped unit takes a quarter longer
and brings in about half again as much. That fills a low store faster, but overshoots and spills
on a top-up, so the room left in the store, never a clock, says when heaping pays. The choice is
held per gatherer until the player changes it, survives stops, time away and the forge, can never
reach a seal, and is worth seconds per fill by design. It is first in the MVP cut order.

> **Quick reference** — Layer: `Feature` · Priority: `MVP` (first in the cut order) · Key deps: `Content records and schema, Modifier pipeline, Activity slot, Resources and caps, Crafting route`

## Overview

Tending is one choice the player can make about how a gatherer runs, besides whether it runs.
Each of the three **gatherers** (skim the ash pits, fell ironbark, quarry the jade seam: the
sources with no inputs) can be set to **heap**. A heaped unit takes a quarter longer and brings
in about half again as much: 7 Ash Tallow in 6.25 s instead of 5 in 5 s. So a heaped gatherer
fills an empty store faster, but its coarser units overshoot a small top-up and spill the
excess. That spill is what tending gives up, and it decides when heaping pays. Heaping wins when
a store is low and loses when it is nearly full. The answer moves with the store, never with the
clock.

The choice is a toggle on the gatherer, held per source until the player changes it. A stop, a
switch to another source, time away and the forge leave it as it is. Tending never changes it by
itself, so it never lapses because the player leaves, and it never asks to be watched (pillar 4).
With no gatherer heaped, every value is its untended value.

Underneath, tending is the third stage of the Modifier pipeline (#2 P5). The set of heaped
sources becomes a tending entry list, one `add` per gatherer output and one `scale_bp` per
gatherer duration, built from content values and two constants. The pipeline applies and clamps
it after the method and Foundation stages. Tending can reach only `source.outputs` and
`source.duration`. No seal input is open to it (#1 R4.1), so **a makeup's seals are identical
tended or untended**, by construction, and the Validator (#12) confirms it by enumeration. The only
non-derived state tending owns is the set of heaped source ids, which Save (#11) stores.

**What it does not do.** Refiners, key items, recipes and fight routes are not tendable:

- Recipes, key items and routes output 1 into a store that holds 1, so a yield change could only
  spill. A speed change there would be free, and a free speed-up would be a click with one right
  answer.
- Heaping a refiner would shrink a recipe's refined bill while a route's one-unit bill could not
  shrink, which squeezes the route premium (#9 U3).

Tending's stakes are therefore seconds per store fill, deliberately. It is **first in the MVP cut
order**: no pillar asks for it, and pillar 4 only limits it (systems index, CD-SYSTEMS). If the
Wave A checkpoint shows the 30-second loop holds without it, it moves to the Vertical Slice
whole.

**Stated readings of the concept** (proposed concept rewording in Open Questions):

- *"Chooses whether to tend whatever is running"* reads as "whatever gatherer is running". Only a
  gatherer's unit size is a trade.
- *"Raises speed and yield, each up to a stated ceiling"* reads speed as output per minute. A
  heaped unit is longer, but a heaped gatherer brings in up to 25% more per minute (the speed
  ceiling), and up to 50% more per unit, never more than a third of its store (the yield ceiling,
  answering #3 Open Question 7).

Representation goes to ADRs (Open Questions): the `heaped` slice's encoding and the tending
entry list's construction site. This GDD fixes behaviour only.

## Player Fantasy

**Framing: direct.** The player operates tending: one toggle on a gatherer. One promise: **the
store tells you when to heap.** The right choice is written in a number already on screen,
the room left in the store, never in a clock.

- **Low store.** A long make has just drained the Ash Tallow to 4 of 40. The player heaps the
  ash pits. Six heaps of 7 fill it in 37.5 s, where eight skims of 5 would take 40 s.
- **Top-up.** A render has taken 30 of 40. Skimming refills it in six units, exactly to the
  brim, in 30 s. Five heaps of 7 would take 31.25 s and spill 5 over the top. The player leaves
  it skimming, or does not care: the difference is seconds, and either way the store ends full.
- **Coming back.** The fell and the quarry are still heaped from yesterday, exactly as left.
  Nothing lapsed while the player was away, and nothing asks to be re-armed.

This serves:

- **Pillar 4**, *"No dead ends, no attention tax"*, and its design test: *"Debating a reward for
  watching or one that waits for the player, this pillar picks the one that waits."* The choice
  waits on the gatherer until the player changes it. There is no timer, no streak, no window to
  catch, and a toggle the player never touches costs them seconds per store, never a stall.
- **Pillar 4's tending clause**, *"Tending is optional and discrete, and buys speed and yield,
  each up to a stated ceiling, never a higher quality ceiling."* Heaping buys output per minute
  and output per unit, each capped (Formulas), and no seal can see it.
- **The concept's open question**, *"Is tending fun as an input, or only a speed button?"*.
  This design answers with the smallest real choice the closed surface allows. If playtests call
  it a speed button anyway, the cut order applies: it moves to the Vertical Slice, and nothing
  else changes (Open Questions).

It sits beside its siblings' promises: "the plan holds" (#1), "every number can tell you why"
(#2), and "when the work pauses, breath fills the slot" (#4). Rest hands the player a quiet gift.
Tending hands them a quiet choice.

**Tone.**

- The player-facing verb is **heap**, paired with each gatherer's own verb: *skim*, *fell*,
  *quarry*. "Tend" and "tending" are the system's names and appear in breakdowns as the stage
  label (#14). The player heaps a source; they do not "tend" it.
- Words kept out of player-facing text: *boost*, *overclock*, *optimise*, *efficient*, *buff*,
  *tweak*, *min-max*, *automation*. They suggest a click rhythm or a chore, which pillar 4
  forbids.
- A spill from a heaped unit is named by #3's overflow line, like any spill ("Ash Tallow spilled
  5"). Tending adds no message of its own.

*Specialist: `creative-director` consulted. It gave three framings ("the store tells you when to
heap", "coarse when you're low, fine when you're close", "a heap trades spill for seconds") and
recommended the first, which was adopted. Its anchoring moment used a 30-unit Ash Tallow store
and claimed pillar 3; both were corrected here (K1's cap is 40; seals are blind to tending, so
heaping is not part of the build problem).*

## Detailed Design

### Core Rules

Notation and numbering:

- Rules are D1–D9, formulas Z1–Z4 and checks J1–J3, so no list collides with another GDD's.
- `set_m` is the committed method's frozen content set (#1 R8.1). "Untended" values are values in
  `set_m`. The tending stage has not touched them.
- A store's **room** is `cap − held` against its effective cap (#3 K6, Q4). After the forge it
  can reach about 1.75× the base cap. J1(b) and J2 read the **base cap**, the smaller of the two,
  so they are the stricter tests. A heaped unit within a third of the base cap is within a third
  of every raised cap. Tending never touches a cap.

#### D1. Tendable sources (derived, never listed)

1. A source s is **tendable** under the committed method m when all of these hold in `set_m`:
   1. s is enabled;
   2. its `inputs` and `fights` are both empty;
   3. its `outputs` hold exactly one key, and that key is a resource whose base cap is at least 2
      (a spendable store, #3 K1.1).
2. The set is derived from content and is constant for the run, because the frozen set is. No
   list of tendable ids exists anywhere (rule 58's closed lists cover fields, not this).
3. Why each condition:
   - A source with inputs is a refiner, a key item, a recipe or a route (Overview).
   - A fight is outside tending's surface, and no MVP fight source has empty `inputs` anyway
     (#9 U2).
   - An output of cap 1 can only spill. #2 warns on a tending entry that changes nothing.
   - One output gives the trade one store to be judged against (J2).
   - The shape admits gatherers that cannot heap within the ceilings, for example an output of 1
     (Z1 doubles it) or a store under three heaped units. **J1 rejects them as errors on
     purpose.** Every gatherer must heap cleanly, and none is quietly left untended.
4. **In the MVP the tendable set is** `skim_ash_pits`, `fell_ironbark` and `quarry_jade` (#8 L2),
   the same under both methods. No method patches a source's `outputs` or `duration`, or reaches
   a no-input source (#7 W3, #3 V7). A fightless no-input source that later content adds joins
   the set by itself, and J1–J3 then cover it.

#### D2. The choice

1. For every tendable source, the player holds one bit: **heaped** or not. Every source starts
   unheaped.
2. **Action: `setHeap(sourceId, on)`.** It is accepted only when all of these hold:
   - the method is committed (#7);
   - the source is revealed;
   - the source is tendable (D1).

   Otherwise it is refused with the first failing reason, in this order:
   1. not committed: "Needs a method committed" (#1 R5.5);
   2. not revealed: refused with no text, because no screen shows an unrevealed source to act
      on;
   3. not tendable: "Only a gatherer can be heaped".

   A refused action changes nothing and is not an input (#4 S3.3). An id that names no source
   at all is a caller error. It throws with the state unchanged, as `advance` does for a bad
   *dt* (#4 S9.2).
3. An accepted `setHeap` is an **input** (#4 S3.3), so it resets the time since the last input. A
   `setHeap` to the bit's current value changes nothing and still counts as an input, the same
   as starting the source that is already running (#4 S3.1).
4. **It is one discrete action.** Nothing about tending is timed, held, repeated or windowed. No
   value depends on when the action was taken, how often, or whether the player is present.
5. A gatherer need not be running to be heaped. The bit takes effect whenever that source runs,
   so a player can set it before the Start, or never.

#### D3. The heap: the tending entry list

1. The tending entry list `T` (#2 P5) is built from the heaped set and content values only. For
   each heaped source s, in source id order:
   - on its one output key r:
     `{target: s, field: outputs, key: r, op: add, operand: heap_add(out), source: s}`, where
     `heap_add(out) = max(1, div_floor(out × HEAP_YIELD_BP, 10000))` (Z1). The floor of 1 keeps
     the entry from being a no-op on small outputs: Quarry's 2 would otherwise get 0;
   - on its duration: `{target: s, field: duration, op: scale_bp, operand: HEAP_TIME_BP, source: s}`
     (Z2).
2. The operand `heap_add(out)` reads `out` from `checked`, the content before any method patch
   (#1 R8.1), never from the method stage's output. So it is fixed before every stage runs and
   reads no effective value or other stage's output, and there is no modifier of a modifier
   (#2 P1.4). The `scale_bp` op applies to the duration the stage receives, as every op does
   (#2 P2). No method patches a gatherer's `outputs` or `duration` (#7 W3), so in the MVP the
   checked and method-stage values are the same.
3. **The entry's `source` is the heaped source's own id.** No tending record type exists, and
   #2 P3.1's "a tending choice" is this id: it exists, and breakdowns can print it. Each value
   gets exactly one tending entry (#2 P3.3).
4. With nothing heaped, `T` is none and the stage is the identity (#2 P5.2).
5. **The MVP heap** (HEAP_YIELD_BP 4,000, HEAP_TIME_BP 12,500):

   | Source | Untended | Heaped | Output per minute |
   |---|---|---|---|
   | Skim the Ash Pits | Ash Tallow 5 per 5,000 ms | 7 per 6,250 ms | 60 → 67.2 (+12%) |
   | Fell Ironbark | Ironbark Log 3 per 5,000 ms | 4 per 6,250 ms | 36 → 38.4 (+6.7%) |
   | Quarry the Jade Seam | Rough Jade 2 per 5,000 ms | 3 per 6,250 ms | 24 → 28.8 (+20%) |

6. The pipeline clamps after the stage (#2 P6). Within J1's ceilings no clamp ever changes a
   heaped value, so no heaped trail ends in a clamp step.

#### D4. What heaping gives up: grain

1. A heaped unit is longer and coarser. Filling a room R takes `fill(R) = ceil_div(R, out) × d`
   (Z3). Heaped, it takes the same with the heaped values.
   - Heaping wins on large rooms, where fewer units are needed.
   - It loses on small top-ups, and on rooms the untended yield divides exactly, where the
     larger last unit overshoots.
2. **The overshoot spills.** The run still stops when the store is full (#4 S5.3). The last
   heaped unit's excess is lost through #3's settle (K3.4) and named by its `overflow` line. A
   spill costs no time and no other store. It is the visible sign that this fill was cheaper
   unheaped.
3. **It is a trade at every gatherer.** J2 requires every tendable source to have a room of at
   least one heaped unit where heaping loses, and a room where it wins. Neither "always heap" nor
   "never heap" is best at every store level.
4. On the shipped content, over every room from 1 to the base cap:

   | Source | Heaping wins | Loses | Ties | Refill after the smallest bill (#8 L5.3) |
   |---|---|---|---|---|
   | Skim | 25 of 40 rooms | 11 | 4 | 30 room: 30,000 → 31,250 ms, spills 5 (loses) |
   | Fell | 16 of 30 | 9 | 5 | 24 room: 40,000 → 37,500 ms, spills 0 (wins) |
   | Quarry | 16 of 20 | 3 | 1 | 16 room: 40,000 → 37,500 ms, spills 2 (wins) |

5. **Mixing within one fill.** A player who is present can heap part of a fill and skim the
   rest. On skim room 22, one heap and three skims make exactly 22 in 21.25 s, against 25 s
   either way fixed. #4 A2 caps the per-ms rate of any rhythm of flips, not the grain of a
   single fill. So a mixed fill can beat the best fixed bit, by at most 3.75 s per fill (skim
   and fell) and 2.5 s (quarry). That holds even up to the post-forge caps (checked over every
   room up to 1.75× the base cap).
   - **This is a reward for presence, accepted and bounded.** It is under one heaped unit per
     fill, it needs a flip during a particular unit, and missing it costs nothing against the
     fixed bit.
   - A playtest that finds players chasing it is a reason to cut tending, not to tune it (Open
     Questions).
6. The stakes are a few seconds per refill (Overview).
   - The best gain is 8.75 s, quarrying 15 room: 5 heaps in 31.25 s against 8 units in 40 s.
   - The worst loss is 3.75 s, skimming a 15 top-up: 3 heaps in 18.75 s against 3 skims in 15 s.

#### D5. Persistence (answers #2 Open Question 4 and #4 Open Question 4)

1. The heaped set changes only by an accepted `setHeap`, and it is emptied at run start (#11).
2. **Everything else leaves it as it is:**
   - a stop, for any reason;
   - a switch to another source;
   - rest;
   - time away;
   - the forge;
   - a save and load;
   - every recompute.

   Tending never changes the set by itself.
3. So the only tending changes that end an `advance` segment (#4 S9.5, #2 P9.4) are the player's
   own accepted `setHeap` actions that flip a bit. A stop never causes one. #4 needs no split
   for tending beyond the player's own input.
4. Tending never lapses because the player leaves (concept, mechanic 4), and never needs
   re-arming.

#### D6. Tending and time

1. **Rescale.** A `setHeap` that flips the bit of a source with kept progress changes that
   source's effective duration, so #4 S6.3 rescales its progress with
   `min(p, ⌊p × D′ / D⌋)` (F2, as amended by #4 A2).
   - **Heaping** lengthens the unit, and the progress keeps its milliseconds.
   - **Unheaping** shortens it, and the progress keeps its fraction, rounded down.
   - So progress never grows. Time earned at one yield can never be paid out at another, and no
     pattern of flips beats the better regime's own rate (#4 S6.3).
   - On the skim, running untended to 80% and then heaping would otherwise pay 7 per 5,250 ms,
     +33%, past J1's 25% speed ceiling and a reward for clicking.
   - No other source's progress moves.
2. **A running source keeps running.** Heaping it keeps the unit's milliseconds, so 80% of an
   untended unit becomes 64% of a heaped one. Unheaping keeps the fraction, rounded down. A
   `setHeap` never starts, stops or replaces a run, and never completes a unit by itself.
3. **Held breath multiplies** (#4 S8.5). A heaped skim unit at rested speed takes ⌈6,250 / 2⌉ =
   3,125 real ms.
4. **T1 holds with room to spare.** Heaping only lengthens durations, so every heaped unit is
   longer than its untended unit and above `UNIT_FLOOR_MS`. The Validator still checks every `T`
   (#4 T1), because a later HEAP_TIME_BP below 10,000 would shorten them.

#### D7. What tending cannot touch

1. Tending targets only the `outputs` and `duration` of tendable sources. It never touches:
   - `inputs`, `enabled` or `fights`;
   - any cap, `contrib`, stat, door or realm field.
2. **Seal invariance holds by construction.** No `sealInput` row lists tending (#1 R4.1), so no
   tending entry on a seal input can be legal (#2 P3.2, P10). The Validator confirms it by
   enumeration (J3, #2 AC-P10-1).
3. **Tending creates nothing.** It adds no store, output key, source or record. No source runs
   out, so no finite stock exists for yield to enlarge (concept, Risks). Every heaped unit fits
   in a third of its store (J1).
4. **Optional means the bands hold without it.** The pacing checks read untended values, so
   every band holds for a player who never heaps:
   - the first cap (#3 V7);
   - the run floor and the first ingredient (#8 X1, X2);
   - the first ingredient on routes (#9 U5).

   A heaped run shorter than 30 s is the player's choice, and #8 L8 already allows it.

#### D8. Checks owned here (run by the Validator)

The Validator (#12) runs these on each method's frozen set. They add to #1 R8.4, #3 V1–V7,
#4 T1–T3, #6 B1–B13, #7 H1–H5, #8 X1–X6 and #9 U1–U5, and repeat none of them.

| # | Check | Severity | Serves |
|---|---|---|---|
| J1 | **Ceilings** (Z4). For every tendable source with untended `out`, `d` and heaped `out_t`, `d_t` on store r: (a) yield, `out_t × 10000 ≤ YIELD_CEIL_BP × out`; (b) a third of the store, `out_t ≤ div_floor(cap_r, 3)`; (c) speed, `out_t × d × 10000 ≤ RATE_CEIL_BP × out × d_t`; (d) the duration row, `d_t ≤ 86,400,000` (#1 R4) | error | The concept's stated ceilings; #3 Open Question 7; implies #3 V3; keeps D3.6's "no clamp" true |
| J2 | **A trade, not a button** (Z3). For every tendable source, over rooms up to the base cap: some R with `out_t ≤ R` has a heaped fill time above the untended one, and some R has one below. The loss must be at a room of at least one heaped unit, because R = 1 loses whenever `d_t > d`, and a test met there could never fail | error | Pillar 4 (no one-right-answer click); "tending gives something up" |
| J3 | **Tended prices.** #6 B9 and B10, #7 H5, #8 X3 and #9 U3 hold under every **tending set**, meaning each subset of the tendable sources heaped (8 in the MVP). B9, H5 and X3 report "not evaluated" for a method whose #6 B1 fails, as those checks already do | error | #9 Open Question 3; pillar 4's price ceiling and the route premium hold for a player who heaps; pillar 3's over-gathering and price-leak tests are not bent by tending |

- The checks that other GDDs already state "after every tending entry list" run over the same
  tending sets:
  - #2 P10, AC-E-1 and AC-E-2 (seal invariance, no wasted entry, no `ModifierError`);
  - #3 V3;
  - #4 T1.
- *ponytail:* enumeration is 2^k for k tendable sources: 8 sets now, 1,024 at k = 10. Above
  that, per-source decomposition is needed (Open Questions).
- **Integer safety.** J1(c) and J2's fill times are Validator-only products. At the registry
  bounds they reach about 10²¹ (J1(c): 10⁹ × 8.64 × 10⁷ × 10⁴) and 10¹⁷ (J2: 10⁹ × 8.64 × 10⁷),
  past 2⁵³. So the Validator computes them in exact integers (BigInt), and no runtime path
  forms them. They are not #1 R8.2 product pairs, because no rule reads them during play.
- *ponytail:* J2 loops over rooms 1..cap_r, which is at most 40 in the MVP. A cap above 10⁶
  needs a closed form (Open Questions). The win half has a witness, R = out × out_t, which wins
  exactly when the speed ratio is above 1, when that R fits the cap. The loss half has none yet.
- **On the shipped content:**
  - J1 passes:
    - Skim 7 ≤ 13 at a speed of 1.12.
    - Fell 4 ≤ 10 at 1.067.
    - Quarry 3 ≤ 6 at 1.20, with its yield of 1.5× exactly at the ceiling.
  - J2 passes (D4.4).
  - J3's U3 and B10 pass under all 8 sets. The tightest U3 margin is still the untended Ember
    Marrow under Ember Breath, 10 s, which #9 accepts.
  - Heaping the skim raises the price of a render's tallow from 30,000 to 31,250 ms, and heaping
    the fell or the quarry lowers its plank or blank by 2,500 ms. The largest move under any
    tending set is the Tidewater Pearl's recipe, 12.5 s cheaper with the fell and the quarry
    heaped (1,300,000 → 1,287,500 ms).
  - B9, H5 and X3 under tending were not computed here. *[estimate]* A best four takes about 28
    runs, so tending moves T by well under a minute. Their margins are 6 minutes and more (B9,
    X3) and 100–340 s (X4, H5). J3 makes them binding.

#### D9. State, actions and events (TD finding 6)

- **Non-derived state owned:** `heaped`, a set of source ids, sparse, with an absent id meaning
  unheaped. Save (#11) stores it. It is empty at run start, and stays empty before the commit,
  because D2 refuses `setHeap` until then.
- **Derived, never saved:**
  - the tendable set (D1) and the entry list `T` (D3);
  - every tended effective value and trail (#2);
  - every fill-time comparison.
- **On load:** an id in `heaped` that does not name a tendable source of the committed frozen set
  (content changed, or a source departed) is dropped and logged before the pipeline runs. #11
  owns the log line. So #2 P3 never sees it, and a save is never refused for it.
- **Action accepted:** `setHeap(sourceId, on)`.
- **Event emitted:** `heapChanged {source, on}`, on an accepted action that flips a bit. Its
  payload goes to #3 and #4's events ADR.

### States and Transitions

**Per tendable source.** The bit is non-derived state, saved by #11.

| State | Holds when | Effective values |
|---|---|---|
| Unheaped | The id is absent from `heaped` | Untended |
| Heaped | The id is in `heaped` | `outputs` raised by `heap_add`, `duration` scaled by HEAP_TIME_BP |

| From | Trigger | To |
|---|---|---|
| Unheaped | Accepted `setHeap(s, true)` | Heaped. Recompute, a segment boundary, s's kept progress rescaled |
| Heaped | Accepted `setHeap(s, false)` | Unheaped. The same |
| Either | Accepted `setHeap` to the current value | Unchanged. An input, with no recompute |
| Either | A stop, a switch, rest, time away, the forge, a load, a recompute | Unchanged (D5) |
| Any | Run start (#11) | Unheaped, for every source |
| Any | A refused `setHeap` | Unchanged. Not an input |

**Before the commit** there is no tendable set, because there is no `set_m`. Every `setHeap` is
refused, and `heaped` is empty.

**The pipeline's states** are #2's: a change of `T` moves between Committed and Committed,
tended, or between Forged and Forged, tended. The forge never changes `T` (#2 Edge Cases).

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | Rows open to tending (`source.outputs`, `source.duration`); R4.1; the `source` type; F7 (revealed) | A consumer of `rowsFor('tending')`; no new field, type or row | #1 owns rows and legality |
| 2 | Modifier pipeline | The tending stage, legality (P3), the clamp (P6), trails (P8) | The entry list `T` (D3); the answer to Open Question 4 (D5) | #2 owns the stage; this GDD owns `T` and the ceilings |
| 3 | Resources and caps | Base caps; settle and `overflow` for a heaped unit's spill | J1(b), which answers Open Question 7 and implies V3 for every `T` | #3 owns settle; this GDD owns the yield ceiling |
| 4 | Activity slot | Units, the stop rule, kept progress, held breath | `setHeap` as an input and a segment boundary; rescale on a flip only (S6.3); T1 holds under every `T`; the answer to Open Question 4 (D5) | #4 |
| 6 | Forge and proving | S7 and S8 prices, B9, B10 | J3: B9 and B10 under every tending set. The forge never changes `heaped` | #6 owns the checks; this GDD runs them under tending |
| 7 | Methods | The frozen set; W3's closed surface, which keeps gatherers unpatched | J3: H5 under every tending set | #7 |
| 8 | Crafting route | The three gatherers and their stores (L2); X1–X3 | Heaped gatherers; J3: X3 under every tending set; X1 still reads untended values (D7.4) | #8 owns the sources; this GDD owns their tended values |
| 9 | Fight and dungeon routes | Route prices (X1), U3 | J3: U3 under every tending set, answering Open Question 3. Routes are not tendable (D1) | #9 |
| 11 | Save and run lifecycle | Run start, load | The `heaped` slice (D9): saved, empty at run start, invalid ids dropped on load | #11 composes the slices |
| 12 | Validator | Enumeration | J1–J3, and the tending sets for #2 P10, #3 V3 and #4 T1 | #12 runs them; this GDD owns their meaning |
| 13 | Interface shell | — | The heap toggle per gatherer row, the heaped values and `heapChanged` | #13 UX spec |
| 14 | Method marks and breakdowns | — | The tending step's label "Heaped", with the source's name as cause | #14 renders; #2 owns trail truth |

*Specialist: `game-designer` consulted (primary). It proposed the heap, the per-source bit that
survives stops, J2's "no stance wins every room" test and the use of `add` over `scale_bp` for
small outputs. The designer chose the heap on 2026-11-21 over the same heap with refiners and a
fuel-burning "stoke". `systems-designer` and `economy-designer` were not consulted: auto mode
refused both Agent calls twice, because a hook rewrites their input. The main session checked J1,
J2 and J3's U3 and B10 itself with a script over every room and every tending set.*

## Formulas

Every number is an integer. Divisions go through #1's `div_floor` and `ceil_div`. Time is in
activity ms (#4). The only runtime formulas are Z1 and Z2, which build the entry list. Z3 and Z4
are the Validator's.

### Z1. Heaped yield

The heap_add formula is defined as:

`heap_add(out) = max(1, div_floor(out × HEAP_YIELD_BP, 10000))`, and `out_t = out + heap_add(out)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| out | int | 1–10⁹ (#1 R4 `source.outputs`) | data file (`checked`, D3.2) | The gatherer's untended output per unit, on its one store |
| HEAP_YIELD_BP | int | 2,000–5,000 (shipped 4,000) | constant (tuning knob) | The added yield per heaped unit, in basis points of `out`, before the floor of 1 |
| heap_add | int | 1 to 5 × 10⁸ | calculated | The `add` operand of the outputs entry (D3.1) |
| out_t | int | out + 1 upward; J1 holds it to ≤ 1.5 × out and ≤ ⌊cap / 3⌋ | calculated | The heaped output per unit |

**Output Range:** `heap_add` is at least 1, so `out_t` is never `out`, and #2's no-op warning
never fires on the outputs entry (#2 AC-E-1). At every knob value a gatherer with `out` 1 gets
`out_t` 2, a doubling that J1(a) rejects. The product `out × HEAP_YIELD_BP` is at most 5 × 10¹², a safe
integer.

**Example:** skim 5: max(1, div_floor(20,000, 10,000)) = 2, so 7. Fell 3: max(1, 1) = 1, so 4.
Quarry 2: max(1, 0) = 1, so 3.

### Z2. Heaped duration

The heap_duration formula is defined as:

`d_t = bp_of(d, HEAP_TIME_BP) = div_floor(d × HEAP_TIME_BP, 10000)`

This is #2's `scale_bp` (M1). The tending stage computes it, not this GDD.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| d | int | 1,000–86,400,000 ms (#4 T1, #1 R4) | data file (`set_m`) | The gatherer's untended duration per unit |
| HEAP_TIME_BP | int | 12,000–15,000 (shipped 12,500) | constant (tuning knob) | How much longer a heaped unit is, in basis points. Below 12,000, J1(c) fails on the quarry at the shipped yield. Below 10,010, a 1,000 ms unit is not lengthened at all, and J2 fails |
| d_t | int | above d; at most 86,400,000 by J1(d) | calculated | The heaped duration per unit |

**Output Range:** With HEAP_TIME_BP above 10,000, `d_t ≥ d`, and `d_t > d` once `d ≥ ⌈10,000 /
(HEAP_TIME_BP − 10,000)⌉`. That is 4 ms at the shipped value, and every unit is at least 1,000 ms,
so `d_t > d` always. `d × HEAP_TIME_BP` is at most
8.64 × 10¹², inside #2's declared pair (`source.duration`, 100,000).

**Example:** 5,000 × 12,500 / 10,000 = 6,250 ms for each of the three gatherers.

### Z3. Fill time (J2, and the trade the player reads)

The fill_time formula is defined as:

`fill(R, o, D) = ceil_div(R, o) × D`, and `heap_wins(R) = [fill(R, out_t, d_t) < fill(R, out, d)]`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| R | int | 1 to cap_r | calculated (#3 Q4 room) | Room left in the gatherer's store |
| o, D | int | as `out`/`d` or `out_t`/`d_t` | Z1, Z2, data file | Output and duration per unit of the regime being timed |
| cap_r | int | 2–10⁹ (#3 K1 base cap) | data file | The store's base cap |
| fill | int | D to 8.64 × 10¹⁶ activity ms | calculated | Activity ms to fill room R at one regime, counting whole units |
| heap_wins | bool | 0 or 1 | calculated | 1 when heaping fills R in strictly less time |

**Output Range:**

- `fill` runs from D to `ceil_div(cap, o) × D` activity ms. It counts the units to fill the room,
  including the last one's spill, which costs no time.
- At the registry bounds the product reaches about 8.64 × 10¹⁶, so the Validator computes it in
  BigInt (D8).
- Held breath halves both regimes alike (#4 S8.5), so the comparison holds at rested speed, to
  within one ms of rounding per unit.

**Example:** skim at R 36: 8 × 5,000 = 40,000 against 6 × 6,250 = 37,500, so heaping wins. At R
30: 30,000 against 31,250, so heaping loses. Quarry at R 15: 40,000 against 31,250, the largest
gain (8.75 s).

### Z4. Ceilings (J1)

The heap_ceilings formula is defined as:

`J1 = yield_ok ∧ share_ok ∧ rate_ok ∧ row_ok`, where

- `yield_ok = [out_t × 10000 ≤ YIELD_CEIL_BP × out]`
- `share_ok = [out_t ≤ div_floor(cap_r, 3)]`
- `rate_ok = [out_t × d × 10000 ≤ RATE_CEIL_BP × out × d_t]`
- `row_ok = [d_t ≤ DURATION_CEILING]` (86,400,000 ms, #1 R4)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| YIELD_CEIL_BP | int | 12,500–20,000 (shipped 15,000) | constant (tuning knob) | The yield ceiling: a heaped unit brings at most this share of an untended one |
| RATE_CEIL_BP | int | 10,500–15,000 (shipped 12,500) | constant (tuning knob) | The speed ceiling: a heaped gatherer brings at most this share of its untended output per minute |
| 3 | int | — | constant (#3 Open Question 7) | A heaped unit is at most a third of its store, so a last unit spills at most a third |
| DURATION_CEILING | int | 86,400,000 ms | constant (#1, registry `duration_ceiling`) | The `source.duration` row's maximum |
| out, out_t, d, d_t, cap_r | int | as Z1–Z3 | data file, calculated | — |
| yield_ok, share_ok, rate_ok, row_ok | bool | 0 or 1 | calculated | The four ceilings, J1(a)–(d) |
| J1 | bool | 0 or 1 | calculated | 1 when all four hold. The check fails on 0, naming the failing part |

**Output Range:** each part is 0 or 1. `rate_ok`'s products reach about 10²¹ at the registry
bounds, so the Validator computes them in BigInt (D8). **At the shipped constants `rate_ok` follows
from `yield_ok`.** The speed ratio is (out_t / out) / 1.25 ≤ 1.5 / 1.25 = 1.2 < 1.25. So
RATE_CEIL_BP binds only if HEAP_TIME_BP falls below 12,000 (Tuning Knobs).

**Example:**

| Source | yield (out_t × 10⁴ vs 15,000 × out) | share (out_t vs ⌊cap/3⌋) | speed ratio | row |
|---|---|---|---|---|
| Skim | 70,000 ≤ 75,000 | 7 ≤ 13 | 1.120 | 6,250 |
| Fell | 40,000 ≤ 45,000 | 4 ≤ 10 | 1.067 | 6,250 |
| Quarry | 30,000 ≤ 30,000 (at the ceiling) | 3 ≤ 6 | 1.200 | 6,250 |

*Specialist: `systems-designer` reviewed Formulas and Edge Cases together (its earlier consult
for Detailed Design was refused by auto mode). Its six findings were adopted:*

- *mixed fills beat the best fixed bit by up to 3.75 s (D4.5);*
- *J2's loss half was trivially met at R = 1;*
- *room is read against the effective cap;*
- *HEAP_TIME_BP's floor;*
- *D6.2's wording;*
- *the variable tables.*

*`economy-designer` was not consulted: auto mode refused it twice, because a hook rewrites Agent
input. The main session's scripts checked every room up to 1.75× each base cap and every tending
set.*

## Edge Cases

Each case says who catches it: a **runtime rule** (this GDD or the one named), a **validator
error** or **warning** (#12), or **owned by #N**.

### Choosing

- **If `setHeap` is sent before the commit**: refused, "Needs a method committed". It is not an
  input, and `heaped` stays empty (D2).
- **If `setHeap` names a refiner, a key item, a recipe or a route**: refused, "Only a gatherer can
  be heaped". The slot and the clock are unchanged.
- **If `setHeap` names a gatherer the committed method disables**: it is not tendable (D1.1.1),
  so it is refused the same way. No MVP method disables a gatherer (#3 V7, #7 W3).
- **If `setHeap` names an id that is no source**: a caller error. It throws with the state
  unchanged (D2.2).
- **If a running gatherer is heaped**: the run continues. Its unit lengthens to 6,250 ms and
  keeps its milliseconds (D6.1, #4 A2). Nothing completes, starts or stops because of the toggle.
- **If an idle gatherer with kept progress is heaped or unheaped**: only its kept entry is
  rescaled, as for any duration change while the slot rests (#4 Edge Cases).
- **If an idle gatherer with no kept progress is heaped**: the bit flips and the pipeline
  recomputes. Nothing else moves.
- **If `setHeap` sets the bit it already has**: an input with no recompute (D2.3).
- **If the player flips a gatherer every unit**: each flip is an input and can lose progress on
  an unheap, never gain any. No rhythm of flips beats the better regime's **per-ms rate**
  (#4 A2; AC-D6-2). Within one fill, a well-placed flip can still save up to 3.75 s over the best
  fixed bit (D4.5).

### Running, away and stops

- **If a heaped unit overshoots the store**: the excess spills through #3's settle and is named
  by its `overflow` line. The run stops `full` as usual (#4 S5.3). Nothing is refunded or carried.
- **If the store is already full**: heaping changes nothing about fullness. A Start is refused,
  "Ash Tallow is full" (#4 S3.1).
- **If the player leaves with a gatherer heaped**: it runs heaped while away, exactly as it would
  live (#4 S9). The store fills, the run stops, rest banks held breath, and the bit stays.
- **If a heaped run reaches the away cap**: it stops `away` like any run (#4 S7). The bit stays.
- **If held breath is being spent**: a heaped unit takes ⌈6,250 / 2⌉ = 3,125 real ms (#4 S8.5).
  Heaping and held breath never stack beyond their product.
- **If a heaped gatherer stops for any reason and is started again later**: it is still heaped
  (D5).

### Forge, run start, content and saves

- **If the forge happens with gatherers heaped**: the bits are unchanged and `T` is unchanged. The
  pipeline moves from Committed, tended to Forged, tended (#2 Edge Cases).
- **If a fast new game starts a new run**: `heaped` is empty (owned by #11, D9).
- **If a save holds a heaped id that is no longer tendable** (content gave the source inputs,
  removed it, or a method now disables it): the id is dropped and logged on load, before the
  pipeline runs (D9). Owned by #11. The source runs untended, and its saved progress is clamped
  under #4's load rule, because the old duration is unknown.
- **If a content update changes HEAP_YIELD_BP, HEAP_TIME_BP or a gatherer's values under a
  save**: `T` is rebuilt from the new content on load, and saved progress is clamped as above
  (#4). Nothing tending-derived is in the save, so nothing goes stale.
- **If a later method patched a gatherer's `outputs`** (closed today by #7 W3 and H1): the
  heaped output would be the patched value plus `heap_add` of the checked value (D3.2). J1 then
  judges it against the patched value per frozen set.

### Content and checks

- **If HEAP_TIME_BP is 10,000 or less**: a heaped unit is never longer, so heaping never loses a
  room. J2 fails, as an error.
- **If a gatherer outputs 1, or its store holds fewer than three heaped units**: J1(a) or J1(b)
  fails, as an error. It is not quietly made untendable (D1.3).
- **If a tending set breaks a price check** (U3, B10, B9, H5 or X3): J3 fails as an error, naming
  the tending set, the method and the ingredient.
- **If content has no tendable source**: J1 and J2 report "not evaluated: no tendable source",
  never "passed". J3 runs over the one empty tending set, which is the untended checks
  themselves.
- **If a tending entry would leave a value unchanged** (#2 AC-E-1): impossible for the outputs
  entry, because `heap_add` is at least 1 (Z1). The duration entry is impossible too while
  HEAP_TIME_BP stays in its safe range (Z2). Below 10,010 the Validator warns, and J2 fails.

### Degenerate strategies

- **Always heap**: loses on 11, 9 and 3 rooms of the three stores, ties on 4, 5 and 1, and wins
  on the rest (D4.4). The worst loss is 3.75 s on a skim top-up. It is not dominant (J2), and it
  is close to harmless.
- **Mix within a fill** (heap the first units, skim the last): up to 3.75 s per fill over the
  best fixed bit, for a player who is present at the right unit. It is accepted and bounded
  (D4.5).
- **Never heap**: every pacing band holds (D7.4). The cost is seconds per fill.
- **Heap the fell and the quarry, never the skim**: on the common refills after a bill this is
  the best fixed policy, +2.5 s each, with the skim's 30-room refill exact unheaped. A player who
  finds it gains seconds, never minutes.
- **Flip at each unit**: no gain (#4 A2).
- **Heap to fill a store, then leave**: identical to doing it live (#4 S9.4).

*Specialist: `systems-designer` consulted (see Formulas). It added the mixed-fill case, the
corrected "always heap" counts and the duration-entry no-op condition.*

## Dependencies

**Upstream** (this system depends on them):

| # | System | Nature | What this GDD needs | Status |
|---|---|---|---|---|
| 1 | Content records and schema | Hard | The `source` type; `source.outputs` and `source.duration` open to tending, and no `sealInput` row open to it (R4, R4.1); `checked` (R8.1) for the operand; F7 revealed; R5.5 need text | Approved |
| 2 | Modifier pipeline and recompute | Hard | The tending stage (P5), `add` and `scale_bp` (P2), legality (P3), the clamp (P6), trails (P8), recompute on a change of `T` (P9), seal invariance (P10) | Approved |
| 4 | Activity slot, rest and away time | Hard | Inputs (S3.3), the stop rule (S5), kept progress and the rescale as amended by A2 (S6.3, F2), held breath (S8.5), segments (S9.5), T1 | Approved; amended A2 by this GDD |
| 3 | Resources and caps | Hard | Base caps for J1(b) and J2; settle and `overflow` for a heaped unit's spill (K3); room (K6) | Approved |
| 8 | Crafting route | Hard | The three gatherers and their stores, the only tendable sources in the MVP (L2); X3 for J3 | Approved |
| 6 | Forge and proving | Soft | B9 and B10, run under tending by J3. Tending works without them, but J3 would have less to check | Approved |
| 9 | Fight and dungeon routes | Soft | U3, run under tending by J3 (its Open Question 3) | Approved |

**Downstream** (they depend on this system):

| # | System | Nature | What they get | Status |
|---|---|---|---|---|
| 11 | Save and run lifecycle | Hard | The `heaped` slice: saved, empty at run start, invalid ids dropped on load (D9) | Approved 2026-11-21 (`save-and-run-lifecycle.md` D1.3, D3.8, D3.13) |
| 12 | Content validator and balance enumeration | Hard | J1–J3, and the tending sets for #2 P10, #3 V3 and #4 T1 (D8) | Not started |
| 13 | Interface shell and goal line | Hard | A heap toggle per gatherer, its refusals, the heaped values and `heapChanged` (UI Requirements) | Not started |
| 14 | Method marks and breakdowns | Soft | The tending step's "Heaped" label with the source as cause (D3.3) | Not started |

- **Methods (#7) is not a dependency.** W3 keeps gatherers unpatched today, but D3.2 reads the
  operand from `checked` and J1 judges each frozen set. So a later method that patched a gatherer
  would still get a legal heap (Edge Cases).
- **Combat resolver (#5): none.** Routes are not tendable, and no combatant row is open to
  tending.
- **Bidirectional check:** #1 (Interactions row 10), #2 (Dependencies row 10), #3 (Interactions
  row 10, Dependencies), #4 (Interactions row 10, Dependencies), #6 (AC-G6-2's tending stub), #8
  (Interactions row 10, Dependencies) and #9 (Interactions row 10, Dependencies, Open Question 3)
  already name Tending. Their status cells say "Not started" or "Not designed", and the
  coordinating session updates them at merge. The systems index's row 10 gains Resources and caps
  and Crafting route in Depends On (Phase 5).

## Tuning Knobs

| Knob | Value | Safe range | Affects | Too low | Too high |
|---|---|---|---|---|---|
| `HEAP_YIELD_BP` | 4,000 | 1,000–5,000 | How much a heaped unit adds (Z1) | At 1,000–2,000 every gatherer gets +1 per unit (the floor), and the skim's trade thins (6 per 6.25 s) | Above 5,000, J1(a) fails on the skim (5 → 8 is 1.6×) |
| `HEAP_TIME_BP` | 12,500 | 12,000–15,000 | How much longer a heaped unit is (Z2); what heaping gives up | Below 12,000, J1(c) fails on the quarry (1.5× yield over 1.2× time is 1.25×). Below 10,010, the duration entry is a no-op and J2 fails | At 15,000 the skim is slower per minute than skimming (0.93×), and heaping wins only on a few rooms by rounding. J2 still passes, but the toggle becomes a trap |
| `YIELD_CEIL_BP` | 15,000 | 12,500–20,000 | The yield ceiling the concept states (J1(a)) | Below 15,000 the quarry's 2 → 3 fails, and no 2-output gatherer can heap at all (the floor of +1 is +50%) | Above 20,000 an output of 1 could heap to 2. That doubling is what J1(a) exists to stop |
| `RATE_CEIL_BP` | 12,500 | 10,500–15,000 | The speed ceiling the concept states (J1(c)) | Below 12,000 the quarry fails at the shipped heap | Above 15,000 it stops bounding anything a real heap reaches |
| Third of a store | 3 | 2–6 pass the shipped heap; held at 3 | J1(b); how much a last heaped unit can spill (answers #3 Open Question 7) | 2 allows half-store units, so a last unit can spill half a store | 7 fails the skim (7 > ⌊40 / 7⌋ = 5). It is not a knob to turn without #3, since it is #3's spill question |

**Interactions:**

- **`HEAP_YIELD_BP` and `HEAP_TIME_BP` set the trade together.** The heaped speed ratio is
  `(out_t / out) / (HEAP_TIME_BP / 10,000)`. Raising the yield or lowering the time makes heaping
  win more rooms. The reverse makes it a trap. J2 fails at either extreme.
- **`RATE_CEIL_BP` is inert at the shipped values.** It binds only when `HEAP_TIME_BP` drops below
  12,000 (Z4). It stays a knob because the concept requires a stated speed ceiling.
- **`YIELD_CEIL_BP` and the floor of +1 in Z1** together decide which small outputs may heap. At
  15,000 the smallest heapable output is 2.
- **Owned elsewhere and not duplicated here:**
  - every gatherer's `outputs` and `duration` (#8 L2), and the base caps (#3 K1);
  - `UNIT_FLOOR_MS` (#4), `BANK_CAP` and `REST_SPEED` (#4). Held breath multiplies with the heap
    (#4 S8.5).
  - J3's thresholds: `PREMIUM_MAX_BP` (#9), `FIGHTLESS_CEILING_BP`, `FIGHTLESS_SLACK_MS` and the B9
    constants (#6).
- **Every knob change re-runs J1–J3.** J3's tightest margin is #9's own untended 10 s on Ember
  Marrow, so a heap change that moves oil's price by more than 10 s reaches it. The skim heap
  moves it by 1.25 s per render.

## Visual/Audio Requirements

This system draws nothing itself. Its events need the feedback below, stated as requirements on
the Interface shell (#13) and Method marks and breakdowns (#14). No art bible exists yet, so the
concept's Visual Identity Anchor ("The Circulating Tint") is the binding direction.

| Event | Requirement | Owner |
|---|---|---|
| A gatherer is heaped or unheaped | The toggle flips in place, in the frame of the input. Its state is a glyph plus a word (the gatherer's verb, or "Heaped"). There is no timer, fade or "changed" badge. The state stays on the row while the gatherer is idle and while the player is away, so "still heaped from yesterday" is visible | #13 |
| A heaped unit completes | No new effect. The feedback is the slower rhythm, the row's "7 per 6.25 s" and the larger number in the log line. It uses the same type size and weight as an untended line | #13 |
| A heaped unit spills | Only #3's `overflow` line, neutral: no red, no warning glyph, no tending message. Spills while away fold into the one return summary line | #13 |
| A heaped value in a breakdown | One neutral **heap glyph**, whose shape differs from the method glyphs and from every other state glyph (closed, sealed, short, held). The stage label is "Heaped", with the source's name as cause (D3.3) | #14 |

**Principles that apply** (concept, Visual Identity Anchor):

- **One owner per accent.** Heap state, spill and gain use no hue, least of all the method's
  accent. Heaping is the player's choice, not the method's.
- **Mark the changed value.** A value that is both method-changed and heaped shows both marks,
  each on its own. No MVP value is both (#7 W3).
- **Glyph before hue.** Every state above reads in greyscale.
- **No steering.** No "heap now" highlight, and no better-choice marker on the toggle. The room
  left in the store, already on screen, is the whole cue (Player Fantasy).

**Audio:** none.

*Specialist: `art-director` consulted. Its requirements are adopted as written.*

## Game Feel

- **Instant.** An accepted `setHeap` changes the row in the frame of the input. The rules core
  settles time first (#4 S3.4), recomputes (#2 P9, within the 2 ms provisional budget), and the
  shell repaints. Nothing animates between the two states.
- **Honest progress.** Heaping a running unit keeps its milliseconds, so its bar shortens: 80% of
  a skim becomes 64% of a heap (D6.2). The bar jumps to the true fraction and does not ease
  toward it. The player sees that the unit got bigger, not that anything was lost.
- **No rhythm.** Nothing about tending rewards input speed, frequency or timing. A flip is one tap
  with no hold, no confirmation and no cooldown. The only gain from timing is D4.5's bounded
  mixed fill.
- **Feel targets for playtest** (AC-PX-1): the toggle should read as "how this gatherer works",
  not as a button to press. If testers flip it every run, or watch the bar to flip it, the target
  has failed.

## UI Requirements

1. **Where.** Each gatherer's row carries its heap toggle, whether the gatherer is running, idle
   or never started (D2.5). Rows of other sources carry no toggle at all, so the "Only a gatherer
   can be heaped" refusal is reachable only through the rules interface and its tests.
2. **Before the commit**, gatherer rows show the toggle disabled, with #1's need text ("Needs a
   method committed").
3. **What the row shows.** The untended and heaped yields side by side ("5 per 5 s · heaped 7 per
   6.25 s"), and the store's room, as #3 already shows it. It shows no recommendation and no
   computed fill time for the current room (Visual/Audio, "No steering").
4. **Breakdowns.** Tapping a heaped output or duration opens #14's breakdown: base, the "Heaped"
   step and the result (D3.3, #2 P8).
5. **Accessibility.**
   - The toggle is a native toggle control, reachable by keyboard and labelled by its source
     name and state.
   - On a phone it is a tap target of at least 44 × 44 CSS px.
   - Its state never depends on colour.
6. **Phone layout.** The toggle sits on the row itself, never in an overflow menu, so the choice
   stays visible at the width the shell supports.

> **📌 UX Flag — Tending**: This system has UI requirements. In Phase 4 (Pre-Production), run
> `/ux-design` for the Interface shell (#13) to place the heap toggle and its row layout
> **before** writing epics. Stories that touch the toggle should cite `design/ux/[screen].md`,
> not this GDD.

*`ux-designer` was not consulted: auto mode refused the Agent call twice, because a hook rewrites
its input. These requirements follow the art director's and the Player Fantasy's no-steering rule,
and should be reviewed in the #13 UX spec.*

## Cross-References

| This GDD | Other GDD | What is used | Status |
|---|---|---|---|
| D1, D7.1, D7.2 | #1 R4, R4.1, R8.1, F7, R5.5 | Rows open to tending; no `sealInput` row open to it; `checked`; revealed; need text | Approved |
| D3, D7.2 | #2 P1.4, P2, P3, P5, P6, P8, P9, P10 | The tending stage, `add` and `scale_bp`, legality, clamp, trails, recompute, seal invariance | Approved |
| D3.2 | #2 P1.4 | The operand reads `checked`, never another stage's output | Approved |
| D2.3, D5.3, D6 | #4 S3.1, S3.3, S5.3, S8.5, S9.5, T1 | Inputs, the stop rule, held breath, segments, the unit floor | Approved |
| D6.1, AC-D6-2 | #4 S6.3, F2 (amendment A2, from this GDD) | `p′ = min(p, ⌊p × D′/D⌋)` | Amended 2026-11-21 |
| D5 | #2 Open Question 4, #4 Open Question 4 | The choice survives a stop | Answered here |
| J1(b) | #3 V3, Open Question 7 | A heaped unit is at most a third of its base cap | Answered here |
| D4.2 | #3 K3.4, K6, K1 | Spill through settle; room; base caps | Approved |
| D1.4, D4.4 | #8 L2, L5.3 | The three gatherers and the smallest bills | Approved |
| J3 | #6 B9, B10; #7 H5; #8 X3; #9 U3 | Run under every tending set | Approved |
| J3, AC-J3-2 | #9 Open Question 3 | A tended route keeps the premium | Answered here |
| D7.4 | #3 V7; #8 X1, X2; #9 U5 | Pacing checks read untended values | Approved |
| D9 | #11 | The `heaped` slice | Approved 2026-11-21 |
| D8 | #12 | Runs J1–J3 and the tending sets | Not started |
| UI Requirements, Visual/Audio | #13, #14; concept Visual Identity Anchor | The toggle, the breakdown step, no hue | Not started |
| Overview | Concept, mechanic 4 and Core Loop; systems index #10 and the cut order | Stated readings; first in the cut order | Approved |

## Acceptance Criteria

Tags: [unit] a rules-core test; [validator] a check run by #12; [integration] across systems in
the build; [playtest] judged by a person. "Fx" marks a check with a failing fixture: a
one-change copy of shipped content that must fail that check and no other. "Blocked" names the
system the test waits for, and the test may run on a stub until then.

The concept's two tending constraints are acceptance criteria here, as the systems index's risk
table requires:

- **gives something up**: AC-J2-1, AC-D4-1;
- **never lapses because the player leaves**: AC-D5-1, AC-D5-2.

### Rules

- **AC-D1-1** [unit] **GIVEN** the shipped content under each method, **WHEN** the tendable set
  is derived, **THEN** it is exactly {`fell_ironbark`, `quarry_jade`, `skim_ash_pits`}, and the
  same under both methods.
- **AC-D1-2** [unit] **GIVEN**, one at a time, a test source with an input, one with a fight, one
  with two outputs, one whose output is an ingredient, one whose output store has cap 1, and one
  that the method disables, **WHEN** the set is derived, **THEN** none is tendable.
- **AC-D2-1** [unit] **GIVEN** a run before the commit with the time since the last input at
  5,000 ms, **WHEN** `setHeap(skim_ash_pits, true)` is sent, **THEN** it is refused with "Needs a
  method committed", `heaped` stays empty, and the time since the last input is still 5,000 ms.
  **GIVEN** the same run, **WHEN** `setHeap(render_tallow, true)` is sent, **THEN** the reason is
  still "Needs a method committed" (refusal order, D2.2).
- **AC-D2-6** [unit] **GIVEN** a committed run and a test gatherer whose `reveal` gate is unmet,
  **WHEN** `setHeap` names it, **THEN** it is refused with no reason text, the state is unchanged,
  and it is not an input.
- **AC-D2-7** [unit] **GIVEN** a committed run, **WHEN** `setHeap(fell_ironbark, true)` and then
  `setHeap(fell_ironbark, false)` are sent, **THEN** exactly two `heapChanged` events are
  emitted, `{fell_ironbark, true}` then `{fell_ironbark, false}`.
- **AC-D2-2** [unit] **GIVEN** a committed run, **WHEN** `setHeap` names `render_tallow`,
  `kindle_lamp`, `render_ash_fat` or `hunt_pangolin`, **THEN** each is refused with "Only a
  gatherer can be heaped", and the state is unchanged.
- **AC-D2-3** [unit] **GIVEN** a committed run, **WHEN** `setHeap` names an id that is no source,
  **THEN** it throws, and the state is deeply equal to before.
- **AC-D2-4** [unit] **GIVEN** a committed run with the skim heaped, **WHEN**
  `setHeap(skim_ash_pits, true)` is sent again, **THEN** it is accepted as an input (the time
  since the last input becomes 0), `effective` is not called, and no `heapChanged` is emitted.
- **AC-D2-5** [unit] **GIVEN** a committed run resting with an empty rest bank, with no source
  ever started, **WHEN** the fell is heaped and then started, **THEN** its first unit completes
  after 6,250 activity ms (6,250 real ms) and pays Ironbark Log 4.
- **AC-D3-1** [unit] **GIVEN** all three gatherers heaped, **WHEN** `T` is built, **THEN** it holds
  exactly six entries, in source id order:
  - for each gatherer, an `add` on its output key with operand 2 (skim) or 1 (fell, quarry);
  - for each gatherer, a `scale_bp 12500` on its duration;
  - every entry's `source` is the gatherer's own id;
  - `effective` applies it with no `ModifierError`.
- **AC-D3-2** [unit] **GIVEN** the skim heaped, **WHEN** `effective` runs, **THEN** the skim's
  trails are exactly:
  - outputs: base 5, then a tending `add 2` step with result 7;
  - duration: base 5,000, then a tending `scale_bp 12500` step with result 6,250;
  - neither ends in a clamp step.
- **AC-D3-3** [unit] **GIVEN** a test double in which the method stage changes the skim's output
  to 10, **WHEN** `T` is built, **THEN** the operand is 2 (`heap_add` of checked 5), not 4
  (`heap_add` of 10), and the effective output is 12: the operand reads `checked`.
- **AC-D3-4** [unit] **GIVEN** a committed run with nothing heaped, **WHEN** `T` is built,
  **THEN** it is none, and `effective(set_m, F, T)` deeply equals `effective(set_m, F, none)`.
- **AC-D4-1** [unit] **GIVEN** the skim heaped at Ash Tallow 10 of 40, **WHEN** `advance` runs
  until the run stops, **THEN**:
  - it stops `full` after 5 units and 31,250 activity ms;
  - one `overflow` of 5 Ash Tallow is emitted;
  - unheaped, the same start stops after 6 units, 30,000 ms, with no overflow.
- **AC-D5-1** [integration] **GIVEN** the fell heaped and running, **WHEN**, one at a time, the run
  stops on `full`, the player starts the skim, the slot rests, `advance` runs 24 h of away time,
  the forge happens, and the game is saved and loaded, **THEN** after each, `heaped` still holds
  `fell_ironbark`. *[Blocked: #6 for the forge, #11 for the save; stubs until then]*
- **AC-D5-2** [unit] **GIVEN** a committed run with the quarry heaped, **WHEN** `advance` runs over
  any split of 10,000 random dt sequences without player input, **THEN** the heap bit never
  changes and no segment ends for tending.
- **AC-D5-4** [unit] **GIVEN** the skim heaped and started at Ash Tallow 0 with an empty bank,
  **WHEN** one `advance` of 3,600,000 ms is applied as time away, **THEN** the store is 40, the
  run stopped `full` after 6 units and 37,500 activity ms, 2 Ash Tallow spilled, and the bank holds
  1,800,000 ms. The same state reached through 60 live `advance` calls of 60,000 ms is equal.
- **AC-D5-3** [integration] **GIVEN** a run with gatherers heaped, **WHEN** a fast new game starts
  a run, **THEN** `heaped` is empty. *[Blocked: #11]*
- **AC-D6-1** [unit] **GIVEN** the skim running unheaped with progress 4,000 of 5,000, **WHEN**
  it is heaped, **THEN** its progress is 4,000 of 6,250, and the unit completes 2,250 activity ms
  later paying 7. **GIVEN** the skim heaped with progress 5,000 of 6,250, **WHEN** it is unheaped,
  **THEN** its progress is 4,000 of 5,000. **GIVEN** heaped progress 5,001, **WHEN** unheaped,
  **THEN** it is 4,000 (rounded down from 4,000.8).
- **AC-D6-2** [unit, property] **GIVEN** the skim feeding a test store of cap 10⁶, and any
  sequence of up to 50 flips of its bit at random activity times (10,000 seeded cases), **WHEN**
  `advance` runs T activity ms from progress 0, **THEN** the total Ash Tallow its units paid out,
  times 6,250, is at most 7 × T. That is the heaped regime's rate, the better of the two, so no
  flip pattern beats it (#4 A2). The same property with #4's pre-A2 rescale finds a case paying 7
  per 5,001 ms (the regression the amendment closes).
- **AC-D6-3** [unit] **GIVEN** the skim heaped, progress 0, held breath of 10,000 ms and
  `REST_SPEED` 2, **WHEN** the run advances, **THEN** the unit completes after 3,125 real ms, and
  the bank holds 6,875 ms.
- **AC-D7-1** [unit, property] **GIVEN** any tending set and any legal frozen set, **WHEN**
  `effective` runs, **THEN** no trail on any of these has a tending step: a `sealInput` row,
  `source.inputs`, `source.enabled`, `source.fights`, `resource.cap`, `ingredient.contrib`,
  `combatant.stats`, or any door or realm field.
- **AC-D7-2** [validator] **GIVEN** the shipped content, **WHEN** the Validator runs, **THEN** #3
  V7, #8 X1 and X2 and #9 U5 give the same results whatever the tending state. They read untended
  values, and the report shows no tending set for them.
- **AC-D9-1** [integration] **GIVEN** a save whose `heaped` holds `skim_ash_pits` and a test id that
  is no longer tendable, **WHEN** it is loaded, **THEN** the load succeeds, the test id is dropped
  with one log line, the skim is still heaped, and the effective set equals a fresh compute with
  {`skim_ash_pits`}. *[Blocked: #11]*

### Formulas

- **AC-Z1-1** [unit] `heap_add` gives 2 for 5, 1 for 3, 1 for 2, 1 for 1, and 400,000,000 for
  10⁹, at HEAP_YIELD_BP 4,000.
- **AC-Z2-1** [unit] 5,000 at 12,500 gives 6,250, and 1,000 gives 1,250. At 10,005, 1,000 gives
  1,000, the no-op case the safe range excludes.
- **AC-Z3-1** [unit] For the skim, `heap_wins` is 1 at R 36 (37,500 against 40,000), 0 at R 30
  (31,250 against 30,000), and 0 at R 25 (25,000 each, a tie). Over R 1..cap, heaping wins, loses
  and ties on:
  - skim: 25, 11 and 4 rooms;
  - fell: 16, 9 and 5;
  - quarry: 16, 3 and 1.

  `fill(10⁹, 1, 86,400,000)` is exactly 86,400,000,000,000,000 in BigInt.
- **AC-Z4-1** [unit] The shipped skim, fell and quarry pass all four parts of J1. The quarry's
  yield part is at equality (30,000 = 30,000).
- **AC-Z4-2** [unit] Each part fails on its own direct inputs:
  - (a) out 1, out_t 2;
  - (b) out_t 7, cap 20;
  - (c) out 2, out_t 3, d 5,000, d_t 5,500;
  - (d) d_t 87,500,000.

### Checks (each [validator, Fx]: shipped content passes; the named change fails the named check. Any other check it also trips is listed)

- **AC-J1-1**
  - The quarry's output set to 1 fails J1 on parts (a) and (c) for `quarry_jade` (2 and 1.6 ×).
    It also trips J2 for the quarry, because heaping 1 into 2 wins at every room of two or more.
  - HEAP_TIME_BP set to 11,500 fails J1(c) on the quarry alone (1.5 / 1.15 = 1.30 ×). J2
    passes.
  - For both, U3 and B10 pass under all 8 tending sets. B9, H5 and X3 were not computed.
  - Part (b) cannot be isolated on shipped content, because every store's bill already needs a
    cap above three heaped units. Part (d) breaks the pacing bands with it. AC-Z4-2 covers both
    as unit tests.
- **AC-J2-1** Two fixtures, each a change to two knobs or one:
  - **Loss half** (two changes): HEAP_TIME_BP 10,001 with RATE_CEIL_BP 15,000 leaves every heaped
    duration equal to the untended one, so no room of at least one heaped unit loses.
  - **Win half** (one change): HEAP_TIME_BP 20,000 makes every room lose or tie.

  Both fail J2, and each report names the source and the half that failed. Computed for both: J1
  passes, and U3 and B10 pass under all 8 tending sets. B9, H5 and X3 are not computed here.
- **AC-J2-2** Content with no tendable source reports J1 and J2 "not evaluated: no tendable
  source", never "passed".
- **AC-J3-1** Under all 8 tending sets of the shipped content, for every ingredient and both
  methods, U3 and B10 pass, and B9, H5 and X3 each pass or report "not evaluated" as their own
  GDDs require. The report lists the 8 sets. The tightest U3 margin is 10,000 ms: Ember Marrow
  under Ember Breath, untended.
- **AC-J3-2** The Fox Hunt's duration set to 567,000 ms (from 510,000) passes U3 untended: 637,000
  ≤ 0.8 × 800,000. J3 fails for Ghost Moss under both methods, under exactly the tending sets
  {fell}, {skim, fell} and {fell, quarry}: heaping the fell cuts the recipe to 792,500 ms, and
  0.8 × 792,500 = 634,000 < 637,000. It passes under the other five sets, including all three
  heaped (634,500 ≤ 635,000). The report names each failing set.
- **AC-J3-3** For a method whose #6 B1 fails, J3 reports B9, H5 and X3 "not evaluated" under every
  tending set, never "passed".
- **AC-E-1** [validator] Over all 8 tending sets, #2 P10 holds (seals tended equal seals
  untended), #2 AC-E-1 warns on none, #2 AC-E-2 throws none, #3 V3 holds, and #4 T1 holds.
  *[Blocked: #6, #12]*

### Cross-system

- **AC-X-1** [integration] Closes #2 AC-P9-3 for tending: **GIVEN** a save holding a committed
  method, an `F` and `heaped` = {fell, quarry}, **WHEN** it is loaded, **THEN** the effective set
  and trails deeply equal those before saving. *[Blocked: #11]*
- **AC-X-2** [integration] Closes #4 AC-T1-1's tending half: every tending set's durations are at
  least 1,000 ms. *[Blocked: #12]*
- **AC-PERF-1** [integration] **GIVEN** MVP content in the build runtime, **WHEN** `setHeap` flips
  a bit 1,000 times, **THEN** the median time per flip, including the recompute, is within #2's
  recompute budget (2 ms, provisional until the performance ADR).

### Checked by review or playtest

- **AC-PX-1** [playtest] **The player experience this system must deliver:** *"I heap a gatherer
  when its store is low and leave it skimming for a top-up; I never needed to be there for it."*
  At the Wave A checkpoint, or the first MVP playtest, at least one tester who heaps describes it
  in words that mean this. If testers call it a speed button, or chase mid-fill flips, tending
  moves to the Vertical Slice under the cut order (Open Questions).
- **AC-PX-2** [review] No player-facing tending string uses a word on the Player Fantasy's banned
  list.

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **Concept wording.** Should mechanic 4 and the Core Loop read "chooses whether to heap whatever gatherer is running", with speed read as output per minute (Overview, stated readings)? Resolved 2026-11-21: yes, the designer applied both readings to the concept's mechanic 4 and Core Loop | Designer (concept owner) | Done |
| 2 | **Is heaping fun as an input, or only a speed button**, and do players chase mid-fill flips (D4.5)? If either reading is the playtest's, tending moves to the Vertical Slice whole (cut order; AC-PX-1) | Designer, playtest | Wave A checkpoint / first MVP playtest |
| 3 | J3's B9, H5 and X3 under tending are estimated (D8), not computed. Do they hold with their margins of minutes? | Validator (#12) | #12 implementation |
| 4 | Enumeration is 2^k tending sets, and J2 loops over rooms. Later realms with more than about 10 gatherers, or caps above 10⁶, need per-source decomposition and a closed form for J2's loss half | Validator (#12), Realm ladder (#19) | Alpha |
| 5 | Should the running-activity panel repeat the heap toggle of the gatherer it runs, or only the row (UI Requirements 1)? Resolved 2026-11-21 by #13 (`design/ux/interface-shell.md`, C5): only the row. The running line shows "Heaped" as a word and carries no toggle, so each gatherer has one control | Interface shell (#13) | Done |

**Answered here** (other GDDs' questions): #2 Open Question 4 and #4 Open Question 4 (D5: the
choice survives a stop), #3 Open Question 7 (J1(b): a third of a store), and #9 Open Question 3
(J3: a tended route keeps the premium). #4's row is marked resolved under its amendment A2.
#2's, #3's and #9's rows are marked resolved by status-only amendments the designer approved (#2
A2, #3 A1, #9 A1).

**ADRs required** (representation this GDD leaves out):

1. The `heaped` slice's encoding and how Save (#11) composes it, with #4's ADR 1.
2. Where `T` is built (the rules core) and its caching with the recompute, with #2's ADR 3.
3. `heapChanged`'s payload, with #3's ADR 2 and #4's ADR 4 (the events ADR).
4. The Validator's report format for J1–J3, including "not evaluated" and the tending set named in
   a J3 failure. It extends #1's ADR 8.
