# Resources and Caps

> **Status**: Approved 2026-11-20 (lean review; recommended follow-ups in `design/gdd/reviews/resources-and-caps-review-log.md`)
> **Author**: Will + agents
> **Last Updated**: 2026-11-20
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 1 (The forge is the milestone) and 4 (No dead ends, no attention tax); supports 3 (The build is a problem)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-20 — two cosmetic Player Fantasy findings applied; the attention-tax risk of Open Question 3 is carried to #4's CD-GDD-ALIGN as a pillar item
> **Amendments**: A1 2026-11-21 — Open Question 7 marked resolved by Tending (#10, `tending.md` J1(b)): yes, a heaped unit brings at most a third of its resource's base cap (status edit only, no rule change; designer-approved). Touches Open Questions row 7 · A2 2026-11-21 — Open Question 4 marked resolved by the concept rewording made with the Interface shell (#13) spec (status edit only, no rule change; designer-approved). Touches Open Questions row 4

## Summary

The eight stores the player fills and spends: raw materials, refined goods and two key items.
Each starts at 0 under a small cap that fills within a minute, and every bill takes most of a
cap, so there is always something to spend before a store brims (rules 17, 18). Every change to
a held amount passes one settle step: net, clamp, spill, mark. The forge is the only thing that
moves a cap, and it only raises one, to between 120% and 175% of its base, with one named line
per ingredient. So the Foundation is felt as wider stores and never strands a bill (pillars 1
and 4).

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `Content records and schema, Modifier pipeline`

## Overview

Resources and caps is the set of amounts the player holds and the ceiling on each. A
resource is a capped count. The MVP has eight:

- three raw materials, gathered from nothing;
- three refined goods, made from those;
- two key items, whose first making opens new sources.

Every resource starts at 0 under a small cap. The first cap is hit within a minute (rule 17),
and every source's bill takes most of a cap (rule 18). So the 30-second loop is the concept's
"spend a resource before its cap stops the activity that fills it". Ingredients are held too,
at most one of each, and no cap ever limits which ingredients the player holds (concept,
mechanic 1).

This system owns:

- the resource set, each resource's base cap and start (#1 R4 rows `resource.cap` and
  `resource.start`);
- the held amount of every resource and ingredient, and the one **settle** step every change to
  it passes through: net the change, clamp to the effective cap, discard the overflow, then let
  the high-water marks update (#1 F1);
- the envelope inside which a Foundation raises caps;
- the content checks that keep bills, outputs and caps in step under every method.

It does not own the recipes or what a fight pays (#8, #9), the stop rule, rest or the marks
(#4), the Foundation entries a makeup produces or the affinities (#6), or how a number is drawn
(#13, #14).

Caps are also the forge's payoff. Forging applies the Foundation's cap entries through the
Modifier pipeline (#2), and play continues with wider stores. Each ingredient's share of a cap
is its own line in that cap's breakdown (pillar 1). Caps only rise (designer, 2026-11-20), so
no forge can leave a bill larger than the store that pays it.

The system exists because Arcanum's rule 18 ("caps first, rates second") is what keeps a
one-slot incremental pressing: a small cap fills fast, so there is always something to spend,
and an uncapped store would let one activity run unattended without limit. This GDD states
rules, invariants, formulas and acceptance criteria. The representation of `held` and of the
events goes to ADRs (Open Questions).

## Player Fantasy

**Framing: both.** The player watches the stores fill and spends before they brim. They also
feel caps as the forge's payoff. One promise covers both: **the forge shapes the vessel that
holds the next climb.**

- **Now.** Skimming the ash pits fills the Ash Tallow store in under a minute. The player
  pours it into rendering before it brims, because a full store stops the work that fills it.
  The pressure is on every bar, and it is always the same pressure: spend before it spills.
- **At the forge.** Each ingredient's line widens a named store by a stated measure: "+10 Ironbark
  Heartwood" on the Ironbark Log store, "+8 Ember Marrow" on the Ash Tallow store. Different
  makeups widen different stores, so which stores a makeup widens is part of what the player
  weighs (pillar 3).
- **After.** Back at the same ash pits, the brim sits farther off. The vessel is visibly the
  one they forged.

This serves:

- **Pillar 1**: *"Every realm breakthrough is assembled from chosen ingredients, and every
  ingredient changes caps or affinities."* Caps are where that change is felt after the forge,
  one named line per ingredient.
- **Pillar 4**: *"No dead ends, no attention tax"*, and its design test: *"Debating a reward for
  watching or one that waits for the player, this pillar picks the one that waits."* A full
  store waits. It never spoils or drains. The activity stops,
  rest fills the slot, and only the last unit's spill is lost.

It sits beside its siblings' promises: Content records and schema's "the plan holds" (#1) and
the Modifier pipeline's "every number can tell you why" (#2).

**Tone.** Player-facing text speaks of stores, brims, pouring and widening, never "cap",
"buffer", "overflow" or "resource". The number itself is plain ("Ash Tallow 38 / 40"). A full
store reads "full", and the log calls overflow "spilled".

*Specialist: `creative-director` consulted. It gave three framings ("the vessel holds what you
can spend", "forge the vessel that holds the next climb", "the furnace sets the shape of the
vessel") and recommended the second, which was adopted.*

## Detailed Design

### Core Rules

#### K1. The resource set (content, provisional)

| id | Name | Tier | Base cap | Start | Role |
|---|---|---|---|---|---|
| `ash_tallow` | Ash Tallow | raw | 40 | 0 | The opening store: the first gathering fills it |
| `ironbark_log` | Ironbark Log | raw | 30 | 0 | Timber |
| `rough_jade` | Rough Jade | raw | 20 | 0 | Stone |
| `rendered_oil` | Rendered Oil | refined | 12 | 0 | Fuel and recipe input |
| `seasoned_plank` | Seasoned Plank | refined | 10 | 0 | Frames and beds |
| `jade_blank` | Jade Blank | refined | 8 | 0 | Carving stock |
| `hearth_lamp` | Hearth Lamp | key item | 1 | 0 | Its first making reveals the next sources |
| `tuning_chisel` | Tuning Chisel | key item | 1 | 0 | Its first making opens jade carving |

1. Tier is not a field. A **key item** is a resource whose base cap is 1. Every other resource
   is **spendable**. The checks of K9 tell the two apart only by the cap.
2. Every start is 0. A start above 0 would shorten the first cap hit that V7 measures.
3. Names, caps and roles are provisional until Crafting route (#8) and Fight and dungeon routes
   (#9) approve the sources that use them. Either may rename or re-cap a resource by amending
   this table. An id is permanent once a save could hold it (#1 R2.3).
4. An illustrative chain, whose recipes belong to #8:
   - skim the ash pits: nothing in, 4 Ash Tallow out, 2 s;
   - render tallow: 30 Ash Tallow in, 3 Rendered Oil out, 6 s;
   - light the hearth: 6 Rendered Oil in, the Hearth Lamp out;
   - the Hearth Lamp reveals "render ash-fat": 9 Rendered Oil in, Ember Marrow out.

   The tallow store is full after 20 s, and the first ingredient is in hand after about 2
   minutes.

#### K2. Held

1. For every resource and ingredient, `held[id]` is an integer, and `0 ≤ held[id] ≤ cap(id)`
   at every instant another system can observe.
2. `held` is non-derived state, saved by Save and run lifecycle (#11).
3. An ingredient's cap is `INGREDIENT_HELD_MAX` (1) until Forge and proving (#6) gives
   ingredients counts (#1 Open Question 2). An ingredient `outputs` value above 1 is legal, and
   its excess spills (#1 F1).
4. Each id has its own store. Nothing is shared, so no cap limits which ingredients are held
   (concept, mechanic 1).

#### K3. Settle: the only way `held` changes

`settle(changes, cause)` takes, for one or more ids, an amount `in` and an amount `out`:

1. **A settle is atomic.** Before anything changes, it checks every id in the call:
   - the id names a resource or an ingredient;
   - `in` and `out` are non-negative safe integers;
   - `in ≤ held`, checked on `in` alone, before netting, so an output of the same id cannot
     hide a missing input.

   If any check fails, the caller broke its precondition, and the settle throws with nothing
   changed and no event emitted. Otherwise `raw = held − in + out` for each id (Q2). Nothing is
   ever clamped up to 0.
2. `held' = min(raw, cap)`, and `lost = raw − held'`. An input and an output of the same id net
   before the clamp (#1 F1, "same-id unit").
3. After every id in the call is settled, the high-water marks update once (#1 F1). So F1's
   postcondition, `held ≤ high_water` after any change, holds for every caller.
4. A `lost` above 0 emits `overflow`. The spilled amount is discarded. It is never banked,
   refunded or carried to the next unit.

The callers, and the precondition each guarantees:

| Caller | `in`, `out` | `cause` | Precondition |
|---|---|---|---|
| Activity slot (#4), a unit completing | the source's effective `inputs`, `outputs` | `unit` | `held ≥ inputs` for every input id (#1 F1) |
| Forge and proving (#6), the forge | 1 per chosen ingredient, nothing out | `forge` | each chosen ingredient is held |
| This system, K5 | nothing in, nothing out, against the new cap | `cap` | — |

#### K4. Run start

At the start of a run (a new game, or a fast new game, both #11's), each resource begins at
`held = min(start, cap)` (Q3), and each ingredient at 0. `cap` is the effective cap at that
moment, which is the base cap in the MVP, since no Foundation exists yet. The marks start at
`held` (#1 F1).

#### K5. Effective caps and re-clamping

1. `cap(id)` for a resource is its effective `resource.cap` (#2 M4, Q1). Tending can never
   target it (`modifiableBy` is `foundation` only), so the tending stage is always empty here.
   Before the forge, `cap` equals the base cap.
2. Whenever a recompute (#2 P9) changes any effective cap, every resource is settled with
   nothing in and nothing out against the new cap (cause `cap`). The recompute and this
   re-clamp are one step: no system ever observes a cap below `held`. During play, `capChanged`
   is then emitted for each cap that moved. At run start and on load no previous cap exists,
   so it is not emitted.
3. The forge only raises caps (K7), so in the MVP this clamp removes nothing. A cap can fall
   in only two ways:
   - a reforge (#16) replaces one raise with a smaller one, which is still at or above the
     base;
   - a load finds that a content update lowered a base cap.

   Save (#11) runs the re-clamp on load, before the marks are read.
4. A high-water mark above the current cap is legal and keeps its value (#1 F1). No gate that
   was met becomes unmet.

#### K6. Room and full

`room(id) = cap(id) − held[id]`, and a store is **full** when its room is 0 (Q4). The
Activity slot's stop rule (#4) reads these. Whether a unit may run when only one of its outputs
is full is #4's decision.

#### K7. A Foundation only raises caps

Designer, 2026-11-20. For every makeup under every method, the Foundation entries that Forge
and proving (#6) builds on `resource.cap` must compose to an effective cap E that either equals
the base cap (not raised) or lies inside the **raise envelope** of Q5: at least 120% of the
base cap and at least one more, and at most 175% of it.

- No Foundation entry targets a key item's cap, so its E stays 1.
- An entry on a cap is `add` with an operand of 0 or more, or `scale_bp` with an operand of
  10,000 or more (#2 P2), and never `set`. A saved Foundation keeps its entries when content
  changes (#2 P4.2), so only a relative raise stays a raise if a later update moves the base.
- #2 does not restrict operand signs, so both rules are checked by V4 in the validator, not at
  load.
- Why this envelope: below +20% a makeup's difference is too small to read (pillar 3). Above
  175% the largest bill falls under about 40% of the cap, so rule 18 dissolves after the forge,
  and the first-cap time grows past V7's target.

#### K8. Caps stay seal inputs

`resource.cap` keeps `sealInput: yes` (designer, 2026-11-20). This settles #1 Open Question 1
from this system's side. The consequences:

1. Tending can never target a cap. It could not anyway, because only the Foundation may modify
   one.
2. If Forge and proving (#6) computes any seal from a cap, it reads the cap in force **before
   that forge's own entries**, which is the base cap in the MVP. A seal read from the
   post-forge cap would depend on the makeup's own entries, which is circular. #6 records the
   value in the forge snapshot, so the post-forge raise never moves a recorded seal. This
   settles #2's "Seals and marks" case.
3. Reforge (#16) must state which cap a reforge's seals read.

#### K9. Content checks owned here

The Validator (#12) runs these on the checked content and on each method's frozen set (#1
R8.1), over every source, enabled or not, unless a row says otherwise.

| # | Check | Severity |
|---|---|---|
| V1 | **Bill fits.** Every `inputs` amount of a resource is at most its base cap, and of an ingredient at most 1 | error |
| V2 | **Bill band** (rule 18). Every spendable resource is in some source's `inputs`, and a store with no sink fails. Its largest `inputs` amount, as basis points of its base cap (Q6), is at least `BILL_FLOOR_BP` (7,000). A share above 10,000 is V1's error and is reported there only | error on the checked content, over every source. In each method's set, only enabled sources count, and a store with no enabled sink, or a share below the floor, is a warning |
| V3 | **Output fits.** Every `outputs` amount of a resource is at most its base cap. This also holds after every tending entry list Tending (#10) can produce, so tending can raise a yield up to a store, never past it. Ingredient outputs above 1 stay legal (K2.3) | error |
| V4 | **Raise envelope** (K7). E is in the envelope or equals the base cap, for every makeup under every method. Every Foundation entry on a cap is `add` of 0 or more, or `scale_bp` of 10,000 or more. No entry targets a key item's cap at all, even one that leaves it at 1 | error |
| V5 | **Key items are never spent.** No source lists a key item in `inputs` | error |
| V6 | **Key items are read.** Every key item is named by some `reached` atom; otherwise making it opens nothing | error |
| V7 | **First cap** (rule 17). Under each method, some source with no inputs fills one of its spendable output resources from `start` to the base cap within `FIRST_CAP_MS` (45,000 ms), untended (Q7). The source must be actionable at the commit: #1 F7 gives it `actionable` in that method's frozen set, with the method committed, every mark at its starting `held` (K4) and nothing forged. A key item never counts, because one unit always fills it | error |

- Under K7 the base cap is the smallest cap any reachable state holds. So V1 to V3 need no
  enumeration of Foundations, and #1's "n exceeds the smallest effective cap" and "start
  exceeds the effective cap" cases hold by construction in the MVP.
- V2's warning in a method's set lets Methods (#7) see when a method strands a store's sink,
  without blocking it.
- V7 starts its clock at the commit, because gathering starts only after it (concept,
  mechanic 2). The 15 s left under a minute cover reading and the first tap.
- #1 already checks `start ≤ cap` and `reached` n ≤ the authored cap at load.

#### K10. State, actions and events (TD finding 6)

- **Non-derived state owned:** `held[id]` for every resource and ingredient. Caps are derived:
  the base comes from content, and the Foundation entries from the forge snapshot that Save and
  run lifecycle (#11) stores. A cap is never saved.
- **Actions accepted:** none from the player. The rules core calls three operations: run start
  (K4), `settle` (K3) and the re-clamp after a recompute (K5).
- **Events emitted:**
  - `overflow {id, lost, cause}`: a settle spilled `lost` units. `cause` is `unit` (a unit's
    outputs) or `cap` (a re-clamp, including on load, once per id that spilled). The forge
    adds nothing, so it never spills. Activity slot (#4) may merge the events of one `advance`
    into one line per id.
  - `capChanged {id, from, to}`: a recompute moved an effective cap (the forge, in the MVP).
    It is not emitted at run start or on load. #11's content-changed notice covers the load case.

### States and Transitions

Both state machines below are **derived**: nothing in them is saved except `held` and the
inputs to the effective cap.

**A store**, per resource:

| State | Holds when | Notes |
|---|---|---|
| Empty | `held` = 0 | |
| Filling | 0 < `held` < cap | |
| Full | `held` = cap (room 0) | Read by #4's stop rule. A key item is either Empty or Full |

| Transition | Trigger |
|---|---|
| Empty or Filling → Filling or Full | A settle with more out than in |
| Full or Filling → Filling or Empty | A settle with more in than out |
| Full → Filling | A cap raise (the forge). `held` is unchanged, and room opens |
| Filling or Full → Full | A cap drop to or below `held` (reforge, or load after a content update). The excess spills (K5) |

**The caps of one run:**

| Phase | Holds when | Cap of each resource |
|---|---|---|
| Base | No Foundation forged this run | Its base cap |
| Raised | A Foundation is forged | Its base cap, or a value in the raise envelope (K7) |

| Transition | Trigger | Reversible? |
|---|---|---|
| Base → Raised | The forge (#6) | No. A reforge (#16) replaces the raise and stays in Raised |
| Raised or Base → Base | A new run (#11) | — |

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | The `resource` type; the `resource.cap` and `resource.start` rows; `INGREDIENT_HELD_MAX`; F1's mark update; `div_floor` | Values for the two rows; the answer to Open Question 1 (K8) | #1 owns the type and the rows; this GDD owns their values |
| 2 | Modifier pipeline | The effective `resource.cap` and its trail (M4, P8); the recompute trigger (P9) | — | #2 computes; this GDD clamps `held` (K5) |
| 4 | Activity slot | Unit completions, as settles | `room`, full (K6); `overflow` events | #4 owns the stop rule, rest and the marks |
| 6 | Forge and proving | Ingredient consumption, as a settle; the Foundation entries on `resource.cap` | The raise envelope (K7); the seal rule for caps (K8) | #6 owns the entries; this GDD owns the envelope |
| 7 | Methods | Method patches on `inputs` and `outputs` | V1 to V3 under each method's set | #7 owns the patches |
| 8, 9 | Crafting route; Fight and dungeon routes | Sources that spend and fill the stores | The resource set (K1); V1 to V3, V5 and V7 | Routes own the sources; this GDD owns the set |
| 10 | Tending | Tended `outputs` and `duration` | V3: a tended output never exceeds its store's base cap. Tending never touches a cap | #10 owns its ceilings, inside V3 |
| 11 | Save and run lifecycle | Run start; load | `held` to save; the re-clamp on load (K5) | #11 owns the save |
| 12 | Validator | — | Checks V1 to V7 | #12 runs them; this GDD defines them |
| 13, 14, 15 | Interface shell; Method marks and breakdowns; Forge screen | — | `held`, `cap`, `room`, the events; cap trails through #2 | They own the display |
| 16, 19 | Reforge (VS); Realm ladder (Alpha) | A replaced or stacked Foundation | K5's re-clamp; K7; K8.3 | They state their cap rules |

The first ingredient in hand within five minutes is a pacing target for the routes (#8, #9)
and the Validator (#12), not for this system. K1's chain only shows that the set allows it.

*Specialists: `economy-designer` (primary) proposed the resource set, V2, V5 to V7 and the
raise envelope. `systems-designer` proposed the settle step, the re-clamp, the K8 consequences
and the state, actions and events list. `game-designer` (loops) was not consulted separately,
because of the three-agent parallel cap. The economy designer's brief covered the loop risks,
which are carried to Open Questions.*

## Formulas

This system sets the base caps and starts (K1) and the thresholds of its checks. Every value is
an integer, and every division is `div_floor` (#1 F5). `ceil_div(a, d)` below means
`−div_floor(−a, d)`, the least integer q with q × d ≥ a. The effective value M4 and the trail
are #2's. The mark update F1 is #1's.

### Q1. Effective cap

The effective_cap formula is defined as:

`cap(id) =` the final value of `(id, cap)` in `effective(set_m, F, none)` (#2 M4) for a
resource · `INGREDIENT_HELD_MAX` for an ingredient

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| base | int | 1–10⁹ | data file | The authored `resource.cap` (K1) |
| F | entry list or none | #2 P3 | game state | The forge snapshot's Foundation entries (#6, saved by #11). None before the forge |
| INGREDIENT_HELD_MAX | int | 1 | constant | #1's; until #6 gives ingredients counts |
| cap(id) | int | 1–10⁹ | calculated | The effective cap |

**Output Range:** 1 to 10⁹ (#2 clamps after the Foundation stage). Under K7, a resource's cap
is its base or a value in the raise envelope (Q5).
**Example:** Ash Tallow has a base of 40. The forged Foundation's entry is `add +8` (source
Ember Marrow). The cap is 48, and its trail reads 40, then "+8 Ember Marrow", then 48.

### Q2. Settle

The settle formula is defined as:

`raw = held − in + out` · `held' = min(raw, cap)` · `lost = raw − held'`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| held | int | 0 to cap | game state | Before the settle |
| in | int | 0 to held | calculated | The caller's deduction (K3's precondition); 0 for a re-clamp |
| out | int | 0–10⁹ | calculated | The caller's addition; 0 for a re-clamp |
| cap | int | 1–10⁹ | calculated | Q1, the cap in force after any recompute |
| held' | int | 0 to cap | calculated | Saved |
| lost | int | 0–10⁹ | calculated | Spilled; emitted as `overflow` when above 0 |

**Output Range:** `held'` is 0 to cap. `lost` is 0 to `out` for a unit (because held ≤ cap),
and 0 to `held − cap` for a re-clamp. `raw` stays at or below 2 × 10⁹, a safe integer.
`in > held` throws before netting (K3.1), so `raw` is never negative.
**Example:** The cap is 40, Ash Tallow held is 38, and a skim adds 4. `raw` is 42, `held'` is
40, and `lost` is 2. Rendering then takes 30, so `held'` is 10 and `lost` is 0. After a
reforge drops a cap from 52 to 48 while 50 are held: `held'` is 48 and `lost` is 2.

### Q3. Starting held

The start_held formula is defined as:

`held₀(id) = min(start(id), cap(id))` for a resource · `0` for an ingredient

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| start | int | 0–10⁹, at most the base cap | data file | The authored `resource.start` (default 0) |
| cap | int | 1–10⁹ | calculated | Q1 at run start; the base cap in the MVP |

**Output Range:** 0 to cap. The marks start at `held₀` (#1 F1). The `min` is a guard: #1 already
checks `start ≤ cap` at load, so it bites only if a later realm starts under a smaller cap.
**Example:** start 0, cap 40, so `held₀` is 0.

### Q4. Room

The room formula is defined as:

`room(id) = cap(id) − held(id)` · `full(id) = (room(id) = 0)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| cap | int | 1–10⁹ | calculated | Q1 |
| held | int | 0 to cap | game state | K2 |

**Output Range:** 0 to cap. It is never negative, because of K2.1.
**Example:** cap 40, held 38, so room is 2 and the store is not full.

### Q5. Raise envelope

The raise_envelope formula is defined as:

`lo(b) = max(b + 1, ceil_div(b × RAISE_MIN_BP, 10000))` ·
`hi(b) = div_floor(b × RAISE_MAX_BP, 10000)` ·
`in_envelope(E, b) = (E = b) OR (lo(b) ≤ E ≤ hi(b))` for b ≥ 2; `E = 1` for b = 1 (a key item)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| b | int | 1–10⁹ | data file | The base cap |
| E | int | 1–10⁹ | calculated | Q1's cap after the forge, for one makeup under one method |
| RAISE_MIN_BP | int | 12,000 | constant (tuning knob) | Smallest raise: 120% of base |
| RAISE_MAX_BP | int | 17,500 | constant (tuning knob) | Largest raise: 175% of base |

**Output Range:** true or false.
- `lo` rounds up, so a raise is never under 120%. `hi` rounds down, so a raise is never over
  175%.
- `hi(b) ≥ lo(b)` for every b ≥ 2. For example, b = 2 gives 3 and 3, and b = 3 gives 4 and 5.
- The product `b × 17,500` is at most 1.75 × 10¹³, a safe integer.

**Example:** b = 40 gives lo 48 and hi 70. E of 48 or 70 passes, and E of 45 or 71 fails V4.
E of 40 passes, because that resource was not raised. b = 7 gives lo 9, since 8 would be only
114%.

### Q6. Bill share

The bill_share formula is defined as:

`share_bp(r) = div_floor(B(r) × 10000, b(r))`, where `B(r) = max over sources s of
s.inputs[r]`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| B(r) | int | 1–10⁹ | data file | The largest `inputs` amount of r over every source, enabled or not, in the set being checked. V2 requires at least one such source, so the maximum is never over an empty set |
| b(r) | int | 1–10⁹ | data file | The base cap |
| BILL_FLOOR_BP | int | 7,000 | constant (tuning knob) | V2's floor |

**Output Range:** 1 and up. V2 passes when the value is from `BILL_FLOOR_BP` to 10,000. Above
10,000 means a bill larger than the store, which V1 rejects. The product is at most 10¹³.
**Example:** Ash Tallow: B = 30 and b = 40, so the share is 7,500, which passes. Rendered Oil:
B = 9 and b = 12, also 7,500. A bill of 27 on Ash Tallow gives 6,750, which fails.

### Q7. First cap

The first_cap formula is defined as:

`fill_units(s, r) = ceil_div(b(r) − start(r), out(s, r))` ·
`first_cap_ok(s, r) = start(r) < b(r) AND fill_units(s, r) ≤ div_floor(FIRST_CAP_MS,
duration(s))`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| b, start | int | as K1 | data file | Base cap and start of output resource r, a spendable resource (base cap 2 or more) |
| out(s, r) | int | 1–10⁹ | data file | s's `outputs` amount of r in method m's frozen set, untended |
| duration(s) | int | 1–86,400,000 ms | data file | s's `duration` in m's frozen set, untended |
| FIRST_CAP_MS | int | 45,000 ms | constant (tuning knob) | V7's target |

**Output Range:** true or false. It forms no product of units and duration, so no value leaves
the safe integers. A duration above `FIRST_CAP_MS` fails. A store that starts full is
excluded, because it measures nothing.
**Example:** Skimming the ash pits gives `fill_units = ceil_div(40, 4) = 10`, against
`div_floor(45000, 2000) = 22`. That passes: the store is full after 20 s.

*Specialists: `systems-designer` proposed Q1 to Q4 and `economy-designer` proposed Q5 to Q7,
in the same consultation as Detailed Design.*

## Edge Cases

Each case says **who catches it**: the rules core at runtime, the Validator (#12) at build, or
Save (#11) on load.

### Settling

- **If a settle's `in` exceeds `held` for some id**: the settle throws before anything changes,
  even when an output of the same id would cover it (K3.1, rules core). Activity slot's
  precondition (#4) makes this unreachable from play. A throw means a caller bug, never a
  clamp to 0.
- **If a unit takes and gives the same id**: the two net before the clamp (K3.2). With cap 40,
  held 38, in 30 and out 3, the result is 11, and nothing spills.
- **If a unit's outputs exceed the room**: the store fills to its cap, the rest spills, and
  `overflow` (cause `unit`) is emitted. The unit still counts as complete, and nothing is
  refunded. Whether the next unit runs is #4's stop rule.
- **If one of a unit's several outputs is full**: only that id spills. Whether such a unit may
  run at all is #4's.
- **If an ingredient output is above 1, or the ingredient is already held**: `held` stays 1 and
  the rest spills (K2.3). The spill is emitted like any other.
- **If the forge consumes ingredients**: each chosen ingredient goes from 1 to 0 (cause `forge`),
  and nothing spills. Its mark stays 1, so `reached(ingredient, 1)` stays true (#1 F1).

### Caps

- **If the forge raises a full store**: `held` is unchanged, room opens, the store goes from
  Full to Filling, and `capChanged` is emitted. Nothing is granted.
- **If a recompute changes no cap** (a tending change, for example): the re-clamp changes
  nothing, and no event is emitted.
- **If a cap falls below `held`** (a reforge, or a load after a content update): the re-clamp
  lowers `held` to the cap, and `overflow` (cause `cap`) is emitted once. The mark keeps its
  value, and no met gate becomes unmet (K5.4, #1).
- **If a cap falls below a high-water mark but not below `held`**: nothing changes. A mark above
  the cap is legal.
- **If `start` exceeds the cap at run start**: `held` and the mark start at the cap (Q3). The
  MVP cannot reach this: #1 checks `start ≤ cap` at load, and no Foundation exists at run
  start. A later realm that starts under a different cap could (#19).
- **If a Foundation entry targets a key item's cap**: V4 error, even an `add` of 0 that leaves
  it at 1.
- **If a Foundation entry on a cap is a `set`, a negative `add` or a `scale_bp` below 10,000**:
  V4 error, even when the composed cap happens to land in the envelope (K7).
- **If a base cap is above 571,428,571**: `hi` passes 10⁹, and #2's clamp holds the cap at 10⁹.
  The envelope then ends at 10⁹. **Above 833,333,333**, `lo` passes 10⁹, so no raise is
  possible and any Foundation entry on that cap fails V4. MVP caps are 1–40, so this matters
  only to later realms (#19).
- **If a content update moves a base cap under a saved Foundation**: the saved entries apply to
  the new base (#2's content-update case). They are relative raises (K7), so the cap stays at or
  above the new base. The re-clamp on load handles any drop.

### Content checks

- **If a method switches off the only source that fills the first store**: V7 fails for that
  method. Each method needs its own first cap within the target.
- **If a method's patch pushes a bill above its store's base cap**: V1 error, naming the method,
  the source and the resource. If it pushes the largest bill below the band's floor: V2
  warning.
- **If a spendable resource has no sink**: V2 error. If a key item is spent: V5 error. If no
  gate reads a key item: V6 error.
- **If a tending ceiling would raise an output past its store's base cap**: V3 error on that
  tending entry list.
- **If a source's output store starts full** (`start` equals the base cap): V7 skips that pair
  (Q7), because it measures no fill.

### Saves and runs (owned by #11)

- **If a content update adds a resource the save lacks**: its `held` is `min(start, cap)` and
  its mark equals `held`, as at run start.
- **If the save holds an id the content no longer has**: it is dropped and logged on load.
- **If a saved `held` is not a safe integer or is negative**: the save is refused, naming the
  id. If it is above the cap, the re-clamp on load lowers it, and the spill is logged once.
- **If a fast new game starts**: K4 runs, and the caps return to the Base phase.

*Specialist: `systems-designer` reviewed Core Rules and Formulas for missed cases. Its five
internal-consistency findings were fixed in place: Q5's rounding, K3's check order, K5's
wording on falling caps, V2's empty maximum, and the `overflow` and `capChanged` causes.*

## Dependencies

**Upstream (this system depends on):**

| System | Hard or soft | What it needs | Status |
|---|---|---|---|
| Content records and schema (#1) | Hard | The `resource` type and its `cap` and `start` rows; `INGREDIENT_HELD_MAX`; F1's mark update; `div_floor` | Approved |
| Modifier pipeline and recompute (#2) | Hard | The effective `resource.cap` and its trail (M4, P8); the recompute trigger (P9); the clamp to 1–10⁹ (P6) | Approved |

**Downstream (depend on this system):**

| System | Hard or soft | What it takes | Status |
|---|---|---|---|
| Activity slot, rest and away time (#4) | Hard | `settle` for every unit; `room` and full for the stop rule; `overflow` events | Not started |
| Forge and proving (#6) | Hard | `settle` for consumption; the raise envelope (K7); the seal rule for caps (K8) | Not started |
| Methods (#7) | Soft | V1 to V3 run on its sets; V2's warning reports a stranded sink | Not started |
| Crafting route (#8) | Hard | The resource set (K1); V1 to V3, V5 to V7 | Not started |
| Fight and dungeon routes (#9) | Soft | The resource set for whatever its sources pay; V1 to V3 | Not started |
| Tending (#10) | Soft | V3 bounds its yield ceilings | Not started |
| Save and run lifecycle (#11) | Hard | `held` to save; run start (K4); the re-clamp on load (K5) | Not started |
| Content validator (#12) | Hard | Checks V1 to V7 (K9) | Not started |
| Interface shell (#13), Method marks and breakdowns (#14), Forge screen (#15) | Soft | `held`, `cap`, `room`, the events, cap trails | Not started |
| Reforge (#16, VS), Realm ladder (#19, Alpha) | Hard when designed | K5's re-clamp, K7, K8.3 | Not started |

**Bidirectional check.** #1 (Interactions row 3) and #2 (Interactions row 3) already name this
system. The systems index lists Resources and caps under #4, #6, #8, #11, #13, #16 and #19. It
was missing under #12, which runs V1 to V7, and that row is updated with this GDD. #9 and #10
depend softly and should name this system when their GDDs are written.

## Tuning Knobs

| Knob | Default | Safe range | Too low | Too high | Owner |
|---|---|---|---|---|---|
| Base cap, per spendable resource (K1) | 8–40 | 5–100 in the MVP | Below 5 the +20% raise is a +1 step; stores fill so fast that switching between filling and spending becomes an attention tax | First cap later than `FIRST_CAP_MS` (V7); bills must grow with it (V2), so every unit is long | This GDD, values tuned with #8 |
| Base cap, key item | 1 | 1 only | — | A cap above 1 makes it spendable, and V2 and V5 change meaning | Fixed |
| `start`, per resource | 0 | 0 to cap − 1 | — | Shortens the first fill V7 measures; at the cap V7 skips the store | This GDD |
| `BILL_FLOOR_BP` | 7,000 | 5,000–9,000 | Rule 18 dissolves: stores feel roomy and the 30-second loop slackens | No room for recipes of different sizes on one store | This GDD |
| `RAISE_MIN_BP` | 12,000 | 11,000–15,000 | A makeup's raise is too small to read (pillar 3) | Crowds the envelope against `RAISE_MAX_BP` | This GDD, binding #6 |
| `RAISE_MAX_BP` | 17,500 | 15,000–25,000 | Little room for makeups to differ | After the forge, bills fall below rule 18's "most of a cap" | This GDD, binding #6 |
| `FIRST_CAP_MS` | 45,000 ms | 20,000–60,000 ms | Gathering must be very fast or very large | Breaks rule 17's first cap within a minute | This GDD |

**Interactions between knobs:**

- After the forge, the smallest largest-bill share is `BILL_FLOOR_BP × 10,000 / RAISE_MAX_BP`.
  The defaults give 4,000, about 40%. Raising `RAISE_MAX_BP` or lowering `BILL_FLOOR_BP` weakens
  rule 18 after the forge.
- A base cap, its largest bill (V2) and its first fill (V7) move together. Raise a cap, and the
  largest bill on it must rise to stay in the band, and the gathering source must yield more or
  run faster.
- `INGREDIENT_HELD_MAX` is #1's constant. #6 retires it if ingredients gain counts.

## Visual/Audio Requirements

This system has no assets of its own. It needs only these from the display (#13, #14):

- every store drawn as its held amount against its cap;
- a full store shown by a glyph and the word "full", never by hue alone (the accessibility floor
  in the systems index, system 18);
- a spill shown as a log line, with no animation.

A cap raised by the forge shows its new value and its breakdown lines, each named by its
ingredient. Those lines carry no method mark, because no method ever changes a cap (`resource.cap`
is `modifiableBy: foundation` only). The forge's own visual event belongs to the Forge screen
(#15). No audio: the game has no audio system yet.

## Game Feel

- **The first brim within a minute.** On the K1 set, the first store is full about 20 s after
  the commit (V7 requires 45 s or less). After that, the K1 bills make the player spend about
  every 20–40 s in the opening minutes. That pressure is the 30-second loop's.
- **Numbers move only at a settle.** `held` changes when a unit completes, the forge consumes,
  or a cap is re-clamped, never in between. The display (#13) shows the change in the same
  frame in which the settle lands.
- **The raise is felt as room.** After the forge, a full store stops being full without
  anything being added: the bar's end moves away, and the activity that stopped can run again.

## UI Requirements

- **Persistent stores** (rule 32). Every store the player has met, with held against cap,
  never leaves the screen. Which stores show before they are first named by a revealed source
  is the Interface shell's (#13) decision. Key items show as held or not held.
- **Breakdowns.** Tapping a cap opens its breakdown (#14, #2 P8): the base, then one line per
  Foundation entry named by its source, then the total. No hover-only interaction (MVP required
  item 8).
- **Full and spill.** A full store reads "full" with a glyph (Visual/Audio). The log merges
  spills per `advance`, for example "Spilled 2 Ash Tallow".
- **Forge screen.** Whether it shows each makeup's caps after the forge is an Open Question
  for #6 and #15 (Open Question 5).

> **📌 UX Flag — Resources and caps**: this system has UI requirements. The Interface shell
> (#13) and Forge screen (#15) UX specs (`/ux-design`) must cover the persistent stores, the
> cap breakdown, the full state and the spill line before epics are written. Stories cite
> `design/ux/[screen].md`, not this GDD.

## Cross-References

| This GDD | Refers to | For |
|---|---|---|
| K1, K2 | #1 R1, R2.3, R4 rows `resource.cap` and `resource.start` | The type, the rows, stable ids |
| K2.3, K3.3, K4, K5.4 | #1 F1 | Unit order, the mark update and its postcondition, marks above a cap |
| K5, Q1 | #2 M4, P6, P8, P9 | Effective cap, its clamp, its trail, when it recomputes |
| K5.1, AC-K5-1 | #2 P1.5, P3.2; #1 R4.1 | Tending cannot target a cap |
| K7 | #2 P2, P4.2 and its "content update" edge case | Ops allowed on a cap; a saved Foundation keeps its entries |
| K8 | #1 Open Question 1 and R4 note 1; #2 Open Question 2 and "Seals and marks" | Caps stay seal inputs |
| K9 V3 | #2 P3.4 | The Validator applies every tending entry list |
| K9 V7 | #1 F7, R8.1 | `actionable` at the commit, the frozen sets |
| Edge Cases | #1 Edge Cases on caps, start and `reached` n | The two cases restated as this system's rules |
| Overview, K9 | Arcanum rules 17, 18, 32 (`research/arcanum-reference/12-design-rules.md`) | First cap, bills sized to most of a cap, persistent context |
| Overview, Player Fantasy | Concept mechanics 1 and 5; pillars 1, 3, 4 | Caps never limit held ingredients; the forge's payoff |
| — | Combat resolver (#5) | No interaction: the resolver reads no resource |

## Acceptance Criteria

**Tags:**
- `[unit]` is a pure rules-core test.
- `[validator]` runs the Validator (#12) on a fixture.
- `[integration]` exercises another system's call path.

**Content:** **Fx** means a fixture loaded against a test schema (#1 R8.2). **S** means the
shipped content.

### Rules

- **AC-K2-1** [unit, Fx] **GIVEN** 10,000 seeded random sequences of settles, cap raises and
  re-clamps over three resources and one ingredient, **WHEN** each call returns, **THEN**
  `0 ≤ held ≤ cap` and `held ≤ high_water` for every id. **AND GIVEN** an ingredient held at 0,
  **WHEN** a unit outputs 3 of it, **THEN** held is 1 and `overflow` reports 2.
- **AC-K3-1** [unit] **GIVEN** A held 5 and B held 2, **WHEN** one settle takes 5 of A and 3 of
  B, **THEN** it throws, A is still 5, B is still 2, and no event is emitted. **AND GIVEN** held
  3, **WHEN** a settle takes 4 and gives 3 of the same id, **THEN** it throws. **AND WHEN** a
  settle names an unknown id or a negative `out`, **THEN** it throws with nothing changed.
- **AC-K4-1** [unit, Fx] **GIVEN** start 5 and cap 40, **WHEN** a run starts, **THEN** held is
  5 and the mark is 5. **AND** Q3 with start 50 and cap 40 returns 40. **AND** [S] with the
  shipped content, every resource and ingredient starts at 0.
- **AC-K5-1** [unit] **GIVEN** a tending entry on `resource.cap`, **WHEN** the tending stage
  runs, **THEN** it throws a `ModifierError` (#2 P3.2), and no cap moves.
- **AC-K5-2** [unit, Fx] **GIVEN** held 50 under a cap of 52, **WHEN** a recompute lowers the
  cap to 48, **THEN** held is 48, `overflow {2, cause cap}` and `capChanged {52 → 48}` are
  emitted, the mark stays 50, and a listener on `capChanged` reads held ≤ cap.
- **AC-K6-1** [unit] **GIVEN** cap 40, **THEN** held 38 gives room 2 and not full, and held 40
  gives room 0 and full. **WHEN** the cap is raised to 48 with held 40, **THEN** room is 8.
- **AC-K7-1** [validator, Fx] **GIVEN** a base cap of 40, **THEN** Foundation entries `add +8`,
  `add +30` and `scale_bp 12000` pass V4. `add +5`, `add +31`, `scale_bp 11999` (which gives
  47) and `set 60` fail. `add +10` with `add −2` fails, though it lands on 48. **AND** any entry
  on a key item's cap fails, `add 0` included.
- **AC-K10-1** [unit] **WHEN** the forge consumes ingredients, **THEN** no `overflow` is
  emitted. **WHEN** a run starts, a save loads, or a recompute changes no cap, **THEN** no
  `capChanged` is emitted.
- **AC-K1-1** [validator, S] **GIVEN** the shipped resource set and the sources of #8 and #9,
  **WHEN** the Validator runs, **THEN** V1 to V7 pass under both methods. (Blocked until #8 and
  #9 author their sources.)

### Formulas

Q3 and Q4 are covered by AC-K4-1 and AC-K6-1.

- **AC-Q1-1** [unit, Fx] **GIVEN** a base cap of 40 and Foundation entries `add +8` and
  `add +6`, **THEN** the cap is 54, and its trail lists both steps in source id order. An
  ingredient's cap is 1.
- **AC-Q2-1** [unit] **GIVEN** cap 40 and held 38, **WHEN** a unit adds 4, **THEN** held is 40,
  `lost` is 2 and the mark is 40. **WHEN** it adds 4 again, **THEN** `lost` is 4. **GIVEN** held
  38, **WHEN** a unit takes 30 and gives 3 of the same id, **THEN** held is 11 and `lost` is 0.
- **AC-Q5-1** [unit] **GIVEN** b = 40, **THEN** E of 40, 48 and 70 pass and 45 and 71 fail.
  **GIVEN** b = 7, **THEN** 9 passes and 8 fails. **AND** for every b from 2 to 10,000,
  `hi(b) ≥ lo(b)`, `lo(b) × 10000 ≥ b × 12000` and `hi(b) × 10000 ≤ b × 17500`.
- **AC-Q6-1** [unit] Bills of 30 and 9 on caps of 40 and 12 give 7,500 each. 27 on 40 gives
  6,750, and 28 on 40 gives 7,000.
- **AC-Q7-1** [unit] **GIVEN** a base of 40, start 0 and an output of 4, **THEN** durations of
  2,000 ms and 4,500 ms pass and 4,501 ms fails. A store that starts full is skipped.

### Content checks (each with a failing fixture)

- **AC-V1-1** [validator, Fx] An `inputs` amount of 41 on Ash Tallow (cap 40) is an error,
  and 40 passes. An ingredient input of 2 is an error.
- **AC-V2-1** [validator, Fx] A largest bill of 27 on Ash Tallow is an error, and 28 passes.
  Rough Jade in no source's `inputs` is an error. A method patch that lowers the largest bill
  to 27, or disables its only sink, is a warning in that method's set.
- **AC-V3-1** [validator, Fx] An output of 41 Ash Tallow is an error, and 40 passes. A tending
  entry list that adds 37 to an output of 4 Ash Tallow is an error. An ingredient output of 3
  passes.
- **AC-V5-1** [validator, Fx] The Hearth Lamp in any source's `inputs` is an error.
- **AC-V6-1** [validator, Fx] A Tuning Chisel that no `reached` atom names is an error.
- **AC-V7-1** [validator, Fx] **GIVEN** a method that disables the only no-input source filling
  a spendable store, **THEN** V7 fails for that method only. **AND GIVEN** that the only
  no-input source actionable at the commit outputs a key item, **THEN** V7 fails. V4 is
  covered by AC-K7-1.

### Cross-system

- **AC-X-1** [integration, #4 stub] **GIVEN** Ash Tallow 30/40 and Rendered Oil 11/12, **WHEN**
  a unit of "render tallow" (30 in, 3 out) completes, **THEN** tallow is 0, oil is 12, and the
  only `overflow` is 2 Rendered Oil, cause `unit`.
- **AC-X-2** [integration, Fx] **GIVEN** two chosen ingredients held at 1 and Ash Tallow at 40/40,
  **WHEN** the forge consumes them and applies a Foundation of +8 on Ash Tallow and +10 on
  Ironbark Log (30), **THEN** both ingredients are 0 with their marks still 1, no `overflow` is
  emitted, `capChanged` reports 40 → 48 and 30 → 40, Ash Tallow is still 40, and its room is 8.
- **AC-X-3** [integration, Fx] **GIVEN** a save with a Foundation entry `add +8` on Ash Tallow,
  held 48 and mark 48, **WHEN** it loads against content whose base cap is now 36, **THEN** the
  cap is 44, held is 44, `overflow {4, cause cap}` is emitted once, the mark stays 48, and no
  `capChanged` is emitted. (Blocked until #11 defines load.)

### Checked by review, not by test

- K1.3: the provisional set and its owners. #8 and #9 approve or amend it.
- K8.2: a seal reads the cap from before the forge's own entries. Tested in #6's criteria
  once #6 exists. K8.3 belongs to #16.
- Player Fantasy and the tone of player-facing text.

*Specialist: `qa-lead` proposed these criteria and flagged five ambiguities: V7's
"actionable at the commit", settle atomicity, V2 per method, `add 0` on a key item, and
overflow once per id. All five were fixed in Core Rules before these criteria were written.*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Resolved 2026-11-20: `resource.cap` stays `sealInput: yes`, and a seal reads the cap from before the forge's own entries (K8; #1 Open Question 1, #2 Open Question 2) | Designer | Done; #6 confirms K8.2 in its criteria |
| 2 | Resolved 2026-11-20 by #6 (G2): ingredients have no counts, so `INGREDIENT_HELD_MAX` stays 1 and ingredients need no cap row | Forge and proving (#6) | Done |
| 3 | The K1 chain makes the player switch between filling and spending about ten times in the first two minutes. Does #4's stop rule, or something it queues, keep that from becoming an attention tax (pillar 4)? | Activity slot (#4) | #4 GDD |
| 4 | Away, an activity stops at one store's fill (40 Ash Tallow, or one render), then rest runs. What makes "what the last activity produced while away" worth returning for (concept, retention hooks)? Resolved 2026-11-21 with #4 Open Question 2: the designer reworded the concept's Session-Level hook to "the stores the last run filled, with the breath held for the next", which the Interface shell (#13) shows as the away summary | Activity slot (#4) | Done |
| 5 | Resolved 2026-11-20 by #6 (UI Requirements item 2): yes, for previewable makeups only, under the same rule as the seals; caps follow the Foundation's affinities (G11). The layout stays #15's | Forge and proving (#6), Forge screen (#15) | Done in #6; layout in #15 UX spec |
| 6 | Do #8's recipes fit the provisional set (K1), and does V7 hold under both methods once methods patch durations and outputs? V7 half resolved 2026-11-20 by #7 (W3, W11): no MVP method patches `inputs`, `outputs` or `duration`, and no patch can reach the authored-enabled no-input source, so V7 reads the same values under both methods. #8's half resolved 2026-11-21 by #8 (`crafting-route.md` L1.4, L2): the recipes fit K1 unchanged, with every store's largest bill at 75–100% of its cap | Crafting route (#8), Methods (#7) | Done |
| 7 | V3 lets tending raise a yield up to a full store. Should #10 also keep tended outputs to about a third of a cap, so the last unit of a run spills little (economy designer's suggestion)? Resolved 2026-11-21 by #10 (`tending.md` J1(b), constant `tended_share_divisor` 3): yes. A heaped unit's output is at most ⌊cap / 3⌋ of its resource's base cap, checked by the validator under every frozen set; V3 still bounds every unit by a full store | Tending (#10) | Done |
| 8 | Which cap does a reforge's seal read (K8.3)? | Reforge (#16) | Before the Vertical Slice |

**ADRs required** (representation this GDD leaves out):

1. How `held` is stored in state and the `settle` call's signature, with Save's state slice
   (#11).
2. The payloads of `overflow` and `capChanged`, and how Activity slot (#4) merges them per
   `advance`, with the Interface shell's (#13) event channel.
3. The Validator's report format for V1 to V7, which extends #1's ADR 8.
