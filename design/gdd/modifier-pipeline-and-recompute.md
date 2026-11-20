# Modifier Pipeline and Recompute

> **Status**: Approved 2026-11-20 (lean review; recommended follow-ups in `design/gdd/reviews/modifier-pipeline-and-recompute-review-log.md`)
> **Creative Director Review (CD-GDD-ALIGN)**: NOT ASSESSED 2026-11-20 — auto mode could not check Agent calls in this session (a hook rewrites their input); run the gate or `/design-review` with agents allowed
> **Author**: Will + agents
> **Last Updated**: 2026-11-20
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 2 (Methods matter) and 4 (No dead ends, no attention tax); supports 1 (The forge is the milestone) and 3 (The build is a problem)

## Summary

The one ordered pass that turns content into the numbers the rules use: the method at load,
then the forged Foundation, then tending, each limited to the fields its registry row allows,
with no modifier reading another. Every number carries a trail of its base and each change by
name, so the player can tap any number and see exactly why it is what it is, and tending can
never move a seal (pillars 2 and 4). It adds one operation (`scale_bp`), clamps after the
Foundation and tending stages, and owns no gameplay values.

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `Content records and schema`

## Overview

The Modifier pipeline turns content into the numbers the rules actually use. Three sources may
change a number, and they apply in one fixed order:

1. the **method**, at load (`applyMethod`, owned by Content records and schema #1);
2. the **Foundation**, from the moment of the forge;
3. **tending**, while the player tends the running activity.

Each source may touch only the fields whose registry row (#1 R4) names it. No source reads
another source's output, so recompute is one ordered pass, never a search for a fixed point.
That pass is a pure function of three inputs: the committed method's frozen content, the forged
Foundation's modifier list, and the tending choice. Every value it produces carries its
**provenance**: the authored base, each change in order with the source that made it, and the
final value. Number breakdowns (#14) read that trail and never recompute (rule 97).

This system owns the patch operations beyond `set` and `add` (one: `scale_bp`), how the
Foundation and tending stages apply, clamping after them, the only division the pipeline makes,
the integer-safety pairs it declares, and the provenance trail. It owns no gameplay numbers:
what a method patches is Methods' (#7), what a Foundation changes is Forge and proving's (#6),
and what tending changes is Tending's (#10).

The player never sees the pipeline. They see its two promises: every number can say exactly why
it is what it is, and tending never moves a seal (pillar 4).

It exists because three systems need modifiers (methods for pillar 2, the Foundation for pillar
1, tending within pillar 4's limit), and the archived attempt's fixed-point recompute (up to
eight passes over everything) is what one ordered, closed pass replaces. This narrows rule 96
to three closed sources in a fixed order. Representation (types, caching, the trail's storage)
goes to ADRs; this GDD states rules, invariants, formulas and acceptance criteria.

## Player Fantasy

**Framing: indirect.** The player never meets a stage or an op. They feel one thing from this
system: **every number can tell you why.**

The anchor moment comes just after the forge. The player taps a resource cap that has grown and
reads its breakdown: the base, then "+20 Iron seed", "+15 Ash-root", then the total. Before the
commit, they tap a source's time under each method and see the method's change named. While
tending, they tap the yield and see the tending line; they tap a seal input and find no tending
line there, ever.

That serves:

- **Pillar 2**: *"The method you circulate changes what each ingredient contributes at the forge
  and what other systems pay."* The method's change is a named line in the number, not a hidden
  multiplier.
- **Pillar 1**: *"every ingredient changes caps or affinities."* After the forge each
  ingredient's share of a cap is its own line.
- **Pillar 4**: *"a makeup's seals are identical tended or untended."* No seal input's
  breakdown can hold a tending line.

It complements Content records and schema's "the plan holds" (#1): #1 promises the rules hold
still; this system promises every number shows its working. The visual rule "what the method
touches, the method marks" is #14's to draw; this system supplies the exact set of values with a
method line.

**Tone.** Breakdown lines read as a ledger: a name and a signed amount, never system words
("stage", "op", "clamp" is shown as "limit").

*`creative-director` not consulted: auto mode could not check Agent calls in this session
because a hook rewrites their input. Review manually before production.*

## Detailed Design

### Core Rules

A **value** is one leaf of content addressed by the triple (record, field, key), with the key
absent for scalar fields (#1 R6.1). Every rule below is about values.

#### P1. Three stages, one order, one pass

1. The stages run in this order, always: **method → Foundation → tending**. A stage that has no
   input is the identity.
2. The method stage is #1's `applyMethod(content, method)`, run at load. Its output is the
   committed method's frozen set (#1 R8.1). This system adds nothing to it except the ops of P2
   and the provenance of P8.
3. The Foundation and tending stages run on game state. Each applies a list of **stage entries**
   (P3) to the frozen set.
4. **No modifier of a modifier.** A stage entry's operand is a constant fixed before the stage
   runs (from content, or from the forge snapshot). It never reads an effective value, another
   entry, or another stage's output. So one pass in stage order is complete, and nothing is
   iterated to a fixed point.
5. A stage may change only values whose registry row lists that stage in `modifiableBy`
   (#1 R4.4). The rows open to each stage today are:
   - method: `ingredient.contrib`, `source.inputs`, `source.outputs`, `source.duration`,
     `source.enabled`;
   - foundation: `resource.cap`;
   - tending: `source.outputs`, `source.duration`.

   This list is read from the registry, never copied into code.

#### P2. The ops table

The loader's ops table (#1 R6.1, entries `{fn, noOpCheck}`) holds three ops. `set` and `add`
are #1's and keep its meaning; `scale_bp` is added here. Every stage uses the same table.

| Op | Result | Operand range | `noOpCheck` | Owner |
|---|---|---|---|---|
| `set` | operand | method: #1 R6.1 (on a bool, 0 or 1); Foundation and tending: \|operand\| ≤ B | true | #1 |
| `add` | current + operand | method: #1 R6.1; Foundation and tending: \|operand\| ≤ B | true | #1 |
| `scale_bp` | `bp_of(current, operand)` (#1 F6) | 0–100,000 (0 to 10×) in every stage | true | this GDD |

- B is the largest absolute bound of the value's registry row (for example 10⁹ for
  `resource.cap`).
- `scale_bp` is legal on `int` rows and on the values of `ref→int` map rows, never on a bool.
  On a method patch its result is decided by content alone, so the no-op check (#1 F8) applies
  to it like `set` and `add`.
- No `min`, `max` or `mul` op exists. Ceilings come from the registry ranges (P6) and from the
  operand bounds the owning GDD sets for its own entries (tending's ceilings are #10's).
- `scale_bp`'s operand range is enforced at load through `operandRange` on its ops entry,
  checked at #1 R8.3 step 7 (**amendment A1** to #1, applied 2026-11-20). At runtime the stage
  checks the same range (P3.2).

#### P3. Stage entries

1. A stage entry has the shape of a patch entry plus its cause:
   `{target, field, key?, op, operand, source}`. `source` is a record id (an ingredient, a
   realm, or a tending choice) that breakdowns print by name.
2. An entry is **legal** only if all of these hold:
   - the target exists in the committed frozen set and its type carries the field;
   - the field's row lists this stage in `modifiableBy`;
   - `key` is present exactly on map fields and names a key that already exists;
   - `op` is in the ops table and the operand is in that op's range for this stage (P2);
   - `source` is a record id that exists.
3. **Per value, per stage:** a stage holds either **one** entry for a value (any op), or **any
   number of `add` entries** for it, each from a different `source`, and nothing else. Integer
   addition commutes exactly, so the result never depends on entry order and no order of
   operations exists inside a stage. At most `MAX_ADDS_PER_VALUE` (16) `add` entries may name
   one value in one stage.
4. An illegal entry list is a bug in the system that produced it, never a value to skip. The
   stage throws a `ModifierError` naming the stage, source, target, field and key, and no
   effective set is returned. The Validator (#12) applies every Foundation and tending entry
   list the content can produce, so shipped content never reaches the throw.

#### P4. The Foundation stage

1. Forge and proving (#6) turns the forged Foundation into its list of Foundation entries
   **once, at forge time**, from the makeup and the committed method's frozen set. Which
   entries, with which operands and which `source`, is #6's rule.
2. That list is the forge snapshot's modifier part. Save and run lifecycle (#11) stores it, and
   it is never rebuilt from live content. This makes "Foundation stats are fixed at forge time"
   (designer, provisional, 2026-11-19) a property of the data rather than of a recompute.
3. Before the forge, the stage has no input and is the identity. The MVP forges once, so the
   stage has at most one list.

#### P5. The tending stage

1. Tending (#10) turns the current tending choice into a list of tending entries, using only
   the choice and content constants. Which entries, which ops and which ceilings are #10's.
2. With no tending choice, the stage is the identity, and every value equals its untended
   value.
3. Tending entries may target only `source.outputs` and `source.duration` today (P1.5). No row
   tagged `sealInput: yes` can list tending (#1 R4.1), so no tending entry can be legal on a
   seal input (P10).

#### P6. Clamping

1. After the Foundation stage, and again after the tending stage, every value the stage touched
   is clamped into its row's numeric interval (an `a–b` form, or `values a–b` for a map row,
   #1 R4.7). Values the stage did not touch are already in range (#1 R8.3) and are left alone.
2. The clamp runs **once per stage, after all of that stage's entries**, never between two
   `add` entries of one value.
3. A clamp never adds or removes a map key and never touches a bool.
4. The method stage is never clamped: an out-of-range patch result is a load error (#1 R6.3).
5. A clamp that changes a value is recorded as a step (P8).

#### P7. Rounding

1. The only division in this system is inside `scale_bp`, through `bp_of` (#1 F6), which
   rounds toward −∞ through `div_floor` (#1 F5). No other step divides.
2. Consequences the owning GDDs must design around:
   - scaling a duration down (operand below 10,000) rounds it down, so it is never slower
     than the exact value;
   - scaling a small value up may not change it: `scale_bp(1, 15000)` is 1;
   - scaling a negative `contrib` rounds away from zero: `scale_bp(−3, 5000)` is −2.

#### P8. Provenance

1. Every value of the effective set has a **trail**: its `base`, an ordered list of `steps`, and
   its `final`.
   - `base` is the value in `checked`, before any method patch (#1 R8.1).
   - A step is `{stage, source, op, operand, result}`.
   - A clamp step is `{stage, source: none, op: "clamp", operand: none, result}`, in the stage
     whose clamp changed the value.
   - Steps are in stage order. Within a stage, a single entry comes first; several `add`
     entries are listed in `source` id order (UTF-16 code units); then the clamp step if any.
   - The method stage contributes one step per triple in `changed(m)` (#1 F8), with the
     method's id as `source`.
2. **Invariants:**
   1. *Replay.* Applying each step's op to the previous result, starting from `base`, gives that
      step's `result`, and the last result (or `base`, when there are no steps) is `final`.
   2. *Truth.* `final` is exactly the value the rules read.
   3. *Method marks.* A value has a method step if and only if its triple is in `changed(m)`. So
      the values #14 marks with the method are exactly the values the method changed.
   4. *No tending on seals.* No trail on a `sealInput` row has a tending step.
3. Breakdowns (#14) read trails only. They never call the ops table, never recompute, and never
   rebuild a line from content.
4. Before the commit, the trails of both methods' frozen sets are available (method stage only),
   for the method-choice view.

#### P9. Recompute

1. `effective(set_m, F, T)` is a pure function of three inputs: the committed method's frozen
   set `set_m`, the Foundation entry list `F` (or none) and the tending entry list `T` (or
   none). It reads nothing else and returns the effective set with every trail.
2. Equal inputs give deeply equal outputs, values and trails alike.
3. It runs again only when an input changes: the commit, the forge, or a change of tending
   choice (including any change #10 makes on its own). Nothing it returns is saved; each
   input's owner saves the input.
4. **Constant within an advance.** Within one `advance(state, dt)` segment (#4) the three inputs
   do not change, so neither do effective values, live or away. Anything that would change an
   input during an advance is an event at which #4 ends the segment; the pipeline recomputes
   before the next segment begins. This keeps `advance(a+b) == advance(advance(a), b)` true.

#### P10. Seal invariance

For every value on a row tagged `sealInput: yes`, `effective(set_m, F, T)` equals
`effective(set_m, F, none)`. It holds by construction: no such row lists tending (#1 R4.1), and
P3.2 makes a tending entry on it illegal. The Validator (#12) confirms it by enumeration (seals
tended equal seals untended over every makeup, method and tending choice).

#### P11. Integer safety

1. The schema's declared product pairs (#1 R8.2) include one pair per row that any stage may
   scale: `{value: {row: R}, factor: {const: 100000}}` for R in `ingredient.contrib`,
   `source.inputs`, `source.outputs`, `source.duration` and `resource.cap`. Step 8 of #1 R8.3
   checks them; the largest product is 10⁹ × 10⁵ = 10¹⁴.
2. Before a clamp, a value is at most B + 16 × B in magnitude (one value, sixteen `add`
   operands each bounded by B), which is 1.7 × 10¹⁰ for the largest row: an exact integer.
3. Every result is a safe integer and never `-0` (#1 R7.1, F5).

### States and Transitions

The pipeline holds no state of its own. Its output is derived from which inputs exist:

| State | Inputs present | Effective set |
|---|---|---|
| Before the commit | none | None in play. The method-choice view reads both frozen sets and their method trails (P8.4) |
| Committed | `set_m` | The frozen set; trails hold method steps only |
| Committed, tended | `set_m`, `T` | Tending stage applied and clamped |
| Forged | `set_m`, `F` | Foundation stage applied and clamped |
| Forged, tended | `set_m`, `F`, `T` | Foundation, then tending, each clamped |

| Transition | Trigger | Reversible? |
|---|---|---|
| Before the commit → Committed | The commit (#7) | Not in the MVP; a post-commit switch is #16's |
| Committed ↔ Committed, tended; Forged ↔ Forged, tended | A tending change (#10) | Yes |
| Committed (tended or not) → Forged (same tending) | The forge (#6) | No; a reforge (#16) replaces `F` |
| Any → Before the commit | A fast new game (#11) | — |

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | Registry rows (`modifiableBy`, `sealInput`, ranges); `checked`; frozen sets; ops-table and product-pair slots | `scale_bp`; the product pairs; amendment A1 | #1 owns legality and `set`/`add`; this GDD owns `scale_bp` and the stages |
| 3 | Resources and caps | — | The effective `resource.cap` | #3 clamps `held` to it |
| 4 | Activity slot | Segment boundaries for `advance` | Effective `inputs`, `outputs`, `duration`, `enabled`, constant within a segment (P9.4) | #4 |
| 6 | Forge and proving | The Foundation entry list, built once at forge | Effective `contrib` from the method stage, to build seals and entries | #6 owns the entries |
| 7 | Methods | Which patches exist and with which ops | The ops table it may use | #7 |
| 10 | Tending | The tending entry list | Legality of its entries; the clamp | #10 owns entries and ceilings |
| 11 | Save and run lifecycle | — | Nothing derived; `F` is saved as the forge snapshot | #11 |
| 12 | Validator | — | `effective` as a pure function to enumerate; P3, P8 and P10 to check | #12 |
| 14 | Method marks and breakdowns | — | Trails (P8) | #14 renders; this GDD owns trail truth |
| 13, 15 | Interface shell, forge screen | — | Effective values (through #14 for breakdowns) | — |

*`systems-designer`, `gameplay-programmer` and `engine-programmer` not consulted: auto mode
could not check Agent calls in this session because a hook rewrites their input. Review manually
before production.*

## Formulas

This system sets **no balance numbers**. It defines how a value moves through the stages. All
values are integers (#1 R7.1); `div_floor` and `bp_of` are #1's F5 and F6.

### M1. Op result

The op_result formula is defined as:

`op_result(op, v, x) =` `x` for `set` · `v + x` for `add` · `bp_of(v, x)` for `scale_bp`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| op | enum | `set`, `add`, `scale_bp` | data file or calculated | The entry's op |
| v | int | the row's range | calculated | The value before this entry |
| x | int | P2's operand range for the op and stage | data file or forge snapshot | The entry's operand |

**Output Range:** a safe integer; inside the row's range only after the stage's clamp (M3).
**Example:** `op_result(scale_bp, 5000, 8000) = div_floor(40,000,000, 10000) = 4000`.

### M2. Stage apply

The stage_apply formula is defined as:

`stage_apply(v, E) = op_result(e.op, v, e.operand)` when E is one entry e ·
`v + Σ e.operand over e ∈ E` when E is one or more `add` entries · `v` when E is empty

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| v | int | the row's range | calculated | The value entering the stage |
| E | entry list | P3.3: one entry, or 1–16 `add` entries with distinct sources | calculated | This stage's entries for this value |

**Output Range:** |result| ≤ 17 × B before the clamp (P11.2).
**Example:** cap 40 with `add +20` (Iron seed) and `add +15` (Ash-root) gives 75, in either
order.

### M3. Clamp

The clamp formula is defined as:

`clamp(v, lo, hi) = min(max(v, lo), hi)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| v | int | M2's output | calculated | The value after a stage's entries |
| lo, hi | int | the row's interval, lo ≤ hi | registry (#1 R4) | The row's `a–b` or `values a–b` bounds |

**Output Range:** lo to hi. Applied only after the Foundation and tending stages (P6).
**Example:** `source.duration` 1 scaled by 5000 gives 0; `clamp(0, 1, 86,400,000) = 1`, and a
clamp step records it.

### M4. Effective value

The effective_value formula is defined as:

`effective(r, f, k) = clamp_T(stage_apply(clamp_F(stage_apply(v_m, F_rfk)), T_rfk))`, where
`clamp_F` and `clamp_T` apply only when that stage touched the value (P6.1)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| v_m | int (bool as 0/1) | the row's range | frozen set (#1) | The value after the method stage |
| F_rfk | entry list | P3.3 | forge snapshot (#6, saved by #11) | Foundation entries for this value; empty before the forge |
| T_rfk | entry list | P3.3 | tending (#10) | Tending entries for this value; empty when not tended |

**Output Range:** the row's range. For a `sealInput` row T_rfk is always empty, so the tended
and untended values are equal (P10).
**Example:** `smelt_ore.duration` is 6000 in `checked`. The method sets it to 5000. Nothing
from the Foundation. Tending scales it by 8000 bp: `bp_of(5000, 8000) = 4000`, in range, so
4000. The trail is base 6000 → method `set 5000` → tending `scale_bp 8000` → 4000.

### M5. Trail replay

The trail_replay formula is defined as:

`replay(base, steps) = fold over steps of (prev → s.op = "clamp" ? s.result : op_result(s.op, prev, s.operand))`,
and for every trail `replay(base, steps) = final`, with each intermediate equal to that step's
`result`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| base | int | the row's range | `checked` (#1) | The authored value |
| steps | step list | 0–35 entries (one method step; per runtime stage up to 16 entries and a clamp step) | calculated | P8.1's ordered steps |

**Output Range:** equals `final`. A clamp step's result is the clamp of the previous result.
**Example:** base 6000, steps [method `set 5000` → 5000, tending `scale_bp 8000` → 4000]:
replay gives 5000 then 4000 = final.

### M6. Scaling product bound

The scale_product_bound formula is defined as:

`max_abs(R) × SCALE_BP_MAX ≤ 2⁵³ − 1` for every row R in P11.1

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| max_abs(R) | int | 1–10⁹ today | registry (#1 R4) | The row's largest absolute bound |
| SCALE_BP_MAX | int | 100,000 | constant (this GDD) | `scale_bp`'s largest operand |

**Output Range:** true for every row today; the largest product is 10⁹ × 10⁵ = 10¹⁴, about
90 times below the limit.
**Example:** `resource.cap`: 1,000,000,000 × 100,000 = 10¹⁴ ≤ 9,007,199,254,740,991.

## Edge Cases

Each case says who catches it: **load error** (#1 R8.3), **validator error** or **warning**
(#12), **runtime rule**, or **owned by #N**.

### Ops and entries

- **If a method patch uses `scale_bp` with an operand outside 0–100,000**: load error at step 7
  (`operandRange`, #1 amendment A1), before the op result is computed.
- **If a method patch uses `scale_bp` and the result equals the input** (for example
  `scale_bp(1, 15000)`): load error (no-op check, #1 F8). The marked set must equal the changed
  set.
- **If `scale_bp` targets a bool (`enabled`)**: load error at step 7 (#1 R6.2 allows only `set`
  on a bool).
- **If a stage holds two entries for one value and either is not `add`, or two `add` entries
  share a source, or more than 16 `add` entries name it**: runtime rule, `ModifierError`; the
  Validator's enumeration makes it a validator error first.
- **If a Foundation or tending entry targets a row that does not list its stage**: runtime
  rule, `ModifierError`; validator error by enumeration. This is the case P10 rests on for
  tending.
- **If a stage entry targets a disabled source**: legal. The value changes and nothing uses it,
  the same as #1's patch case; the Validator warns, since the entry is wasted.
- **If a tending entry leaves a value unchanged for some source** (for example a yield scale on
  an output of 1): validator warning. Tending would be offered and do nothing there. #10 must
  author outputs that its scale can move, or use `add`.

### Clamping and rounding

- **If a Foundation entry lowers `resource.cap` below what the player holds**: the cap clamps to
  its row's range only; holding more than the cap is #3's case (#3 clamps `held`, F1 of #1 keeps
  the mark).
- **If a stage drives a value below its row's minimum** (a duration to 0, an output to 0): the
  clamp raises it to the minimum (1 ms, 1 unit). An output never disappears through a modifier;
  only `enabled` removes a route.
- **If a stage drives a value above its row's maximum**: the clamp lowers it, with a clamp step
  so the breakdown shows the limit.
- **If two `add` entries cancel** (+20 and −20): the value is unchanged, both steps stay in the
  trail, and no clamp step appears. Runtime stages have no no-op check.
- **If a `scale_bp` of 0 is applied**: the value becomes 0 and then the row's minimum
  (`resource.cap` 1, `source.duration` 1).

### Recompute and time

- **If tending changes during away time** (for example #10 drops the choice when the activity
  stops and rest fills the slot): #4 ends the `advance` segment there and the pipeline
  recomputes before the next segment (P9.4). Whether the choice survives a stop is #10's.
- **If the forge happens while tending is on**: the effective set goes from Committed, tended
  to Forged, tended in one recompute; tending is not reset by the forge.
- **If a save is loaded**: nothing derived is read from it. The pipeline recomputes from the
  committed method, the saved `F` and the saved tending choice, and must reproduce the trails
  exactly.
- **If a content update changes a value that a saved `F` modifies** (for example `resource.cap`'s
  base): the new base is used and the saved entries apply on top of it. The Foundation's
  entries stay as forged; the effective value may move. #11 shows the content-changed notice
  (fingerprint mismatch, #1).
- **If a saved `F` names a record, field or key the new content no longer has**: owned by #11.
  The entry is dropped and logged on load, before the pipeline runs, so P3 never sees it.

### Seals and marks

- **If `resource.cap` stays `sealInput: yes`** (#1 Open Question 1): the Foundation stage
  changes a seal input after the forge. That does not break P10, which is about tending, but it
  means a seal read after the forge differs from the one read at the forge. #3 and #6 settle it.
- **If a method patch and a Foundation entry change the same value**: legal only if the row
  lists both stages; no such row exists today. The trail shows both steps, method first.

## Dependencies

**Upstream (hard):**

| # | System | Why | Interface |
|---|---|---|---|
| 1 | Content records and schema | The pipeline targets registry rows and runs on frozen sets | Rows (`modifiableBy`, `sealInput`, ranges), `checked`, frozen sets, the ops-table slot, declared product pairs, F5, F6, F8 |

**Inputs from systems designed later (hard at runtime, designed against this contract):**

| # | System | Provides | Status |
|---|---|---|---|
| 6 | Forge and proving | The Foundation entry list `F` (P4) | Not designed |
| 10 | Tending | The tending entry list `T` (P5) | Not designed |
| 4 | Activity slot | `advance` segment boundaries (P9.4) | Not designed |

These systems depend on this one; they give inputs, not design constraints.

**Downstream:**

| # | Dependent | Nature | Data interface |
|---|---|---|---|
| 3 | Resources and caps | Hard | Effective `resource.cap` |
| 4 | Activity slot | Hard | Effective `inputs`, `outputs`, `duration`, `enabled`, constant per segment |
| 6 | Forge and proving | Hard | Effective `contrib`; the Foundation stage applies its entries |
| 7 | Methods | Hard | The ops table its patches may use |
| 10 | Tending | Hard | The tending stage, legality and clamp |
| 12 | Validator | Hard | `effective` as a pure function; P3, P8, P10 |
| 14 | Method marks and breakdowns | Hard | Trails |
| 11 | Save and run lifecycle | Soft | Saves `F`; never saves derived values |
| 13, 15 | Interface shell, forge screen | Soft | Effective values, through #14 for breakdowns |

**Bidirectional consistency.** #1 lists this system as a dependent and names its operations,
stage order, clamping, rounding points and basis-point pairs (#1 Interactions, Cross-References).
Each downstream GDD above must list "depends on: Modifier pipeline" (the systems index already
does for #3, #4, #6, #7, #10, #12 and #14).

## Tuning Knobs

This system has **no gameplay tuning knobs**. Tending's ceilings are #10's, the Foundation's
effects are #6's, and what methods patch is #7's. It has two limits, changed only by amending
this GDD:

| Limit | Value | Safe range | Too low breaks | Too high breaks |
|---|---|---|---|---|
| `SCALE_BP_MAX` | 100,000 bp (10×) | 20,000–9,007,199 | Tending or methods that need more than the limit (raise with #10) | M6 at 9,007,199 for a 10⁹ row; above that the product pair fails at load |
| `MAX_ADDS_PER_VALUE` | 16 per value per stage | 4–1,000 | A Foundation whose ingredients and realm all touch one cap (MVP: up to 5) | Nothing until (n + 1) × B nears 2⁵³ (n about 9 × 10⁶ for a 10⁹ row); the real cost is breakdown length |

The two interact only through M6 and P11.2: raising either moves the largest intermediate
value, and both stay far inside exact integers at the values above.

## Visual/Audio Requirements

None of its own. How a method step, a Foundation line, a tending line and a limit (clamp) look
is Method marks and number breakdowns' (#14). This system guarantees only that #14 can tell the
four apart from the trail alone (`stage` and `op`).

## Game Feel

The one feel target is that a breakdown is **instant and matches the number on screen**. Both
follow from P8: the breakdown is read, never computed, so it cannot lag or disagree. Recompute
runs only on the commit, the forge and a tending change (P9.3), never on a tick, so it cannot
cause a stall during play. Its time budget is a performance ADR; provisional target: a full
recompute of MVP content in at most 2 ms median in the build runtime.

## UI Requirements

None directly. The interface reads effective values; breakdown layout and wording are #14's
UX spec. Two text rules carry over from Player Fantasy: a breakdown names each step's `source`
by its record `name`, and a clamp step reads as a limit, never as "clamp".

## Cross-References

| This GDD | Refers to | What | Status |
|---|---|---|---|
| P1, P3.2, P5.3 | #1 R4, R4.1, R4.4 | Rows, `modifiableBy`, `sealInput`, the tending/seal rule | Approved |
| P1.2, P8.1 | #1 R6, R8.1, F8 | `applyMethod`, `checked`, frozen sets, `changed(m)` | Approved |
| P2 | #1 R6.1, R8.3 step 7 | The ops table; `set` and `add` keep #1's meaning; `operandRange` | Approved; A1 applied 2026-11-20 |
| P6 | #1 R4.5, R4.7 | Clamp after the Foundation and tending stages; range forms | Approved |
| P7, M1 | #1 F5, F6 | `div_floor`, `bp_of` | Approved |
| P11 | #1 R8.2, R8.3 step 8 | Declared product pairs | Approved |
| P4 | Forge and proving (#6) | The Foundation entry list, built at forge | Not designed |
| P5 | Tending (#10) | The tending entry list and its ceilings | Not designed |
| P9.4 | Activity slot (#4) | `advance` segments; the composition test | Not designed |
| P8.3 | Method marks and breakdowns (#14) | Trails as the only breakdown source | Not designed |
| P4.2, Edge Cases | Save and run lifecycle (#11) | Saving `F`; dropping stale entries on load | Not designed |
| P10 | Validator (#12) | Seal invariance and entry legality by enumeration | Not designed |

## Acceptance Criteria

Tags say how each is checked: [unit] a pure-function test, [integration] the loader or more
than one system, [validator] a #12 check. Tests use synthetic entry lists and a test schema, so
none waits on #6 or #10.

### P1 Stages

- **AC-P1-1** [unit] **GIVEN** a frozen set, an `F` and a `T` that both touch one value,
  **WHEN** `effective` runs, **THEN** the trail lists the method step, then the Foundation
  steps, then the tending steps.
- **AC-P1-2** [unit] **GIVEN** `F` and `T` both empty (none), **WHEN** `effective` runs,
  **THEN** every final equals the frozen set's value.
- **AC-P1-3** [unit] **GIVEN** a Foundation entry whose operand is taken from the forge
  snapshot, **WHEN** a later tending entry changes the same value, **THEN** the Foundation
  step's operand and result are unchanged (no modifier reads another).

### P2 Ops

- **AC-P2-1** [unit] **GIVEN** the ops table, **WHEN** each op runs on (5000, 8000), **THEN**
  `set` gives 8000, `add` gives 13000 and `scale_bp` gives 4000.
- **AC-P2-2** [unit] **GIVEN** `scale_bp` on (−3, 5000), (1, 15000) and (1001, 5000), **WHEN**
  run, **THEN** the results are −2, 1 and 500.
- **AC-P2-3** [integration] **GIVEN** a method patch `scale_bp` with operand 100,001 (and one
  with −1), **WHEN** content loads, **THEN** loading fails at step 7 naming the method, record,
  field and key.
- **AC-P2-4** [integration] **GIVEN** a method patch `scale_bp 15000` on an output of 1,
  **WHEN** content loads, **THEN** loading fails at step 7 as a no-op.
- **AC-P2-5** [integration] **GIVEN** a method patch `scale_bp` on `source.enabled`, **WHEN**
  content loads, **THEN** loading fails at step 7.

### P3 Entries

- **AC-P3-1** [unit] **GIVEN** a Foundation entry on `source.duration` (a row without
  `foundation`), **WHEN** the stage applies, **THEN** it throws `ModifierError` with stage,
  source, target, field and key, and returns no effective set.
- **AC-P3-2** [unit] **GIVEN** a tending entry on `ingredient.contrib`, **WHEN** the stage
  applies, **THEN** it throws `ModifierError`.
- **AC-P3-3** [unit] **GIVEN** one stage holding `set` and `add` for one value, or two `add`
  entries with the same source, or 17 `add` entries for one value, **WHEN** the stage applies,
  **THEN** each throws `ModifierError`.
- **AC-P3-4** [unit] **GIVEN** `add +20` (source A) and `add +15` (source B) on a cap of 40,
  **WHEN** applied in either list order, **THEN** final is 75 and the trail lists A then B.
- **AC-P3-5** [unit] **GIVEN** an entry whose `key` is absent from the target map, or a Foundation
  `add` with |operand| > B, **WHEN** the stage applies, **THEN** it throws `ModifierError`.

### P4, P5 Foundation and tending stages

- **AC-P4-1** [unit] **GIVEN** an `F` built once and a later change to the committed frozen
  set's `contrib` values (a test double), **WHEN** `effective` runs, **THEN** the Foundation
  steps are unchanged, because `F` is data, not recomputed.
- **AC-P5-1** [unit] **GIVEN** a tending entry list, **WHEN** tending is removed (`T` none),
  **THEN** every value equals its value with `T` none computed from scratch.

### P6 Clamping

- **AC-P6-1** [unit] **GIVEN** `source.duration` 1 and a tending `scale_bp 5000`, **WHEN**
  applied, **THEN** final is 1 and the trail ends with a clamp step whose result is 1.
- **AC-P6-2** [unit] **GIVEN** a cap of 999,999,990 with Foundation `add +5` and `add +10`,
  **WHEN** applied, **THEN** final is 1,000,000,000 and exactly one clamp step follows both
  adds.
- **AC-P6-3** [unit] **GIVEN** a stage that touches no value of a record, **WHEN** applied,
  **THEN** that record's trails gain no step, clamp included.

### P8 Provenance

- **AC-P8-1** [unit, property] **GIVEN** random legal frozen sets, `F` and `T` (seeded,
  at least 10,000 cases), **WHEN** `effective` runs, **THEN** for every value `replay(base,
  steps)` equals `final`, and every intermediate equals its step's `result`.
- **AC-P8-2** [integration] **GIVEN** the shipped content and each method, **WHEN** `effective`
  runs with `F` and `T` none, **THEN** the set of triples whose trail holds a method step
  equals `changed(m)` exactly.
- **AC-P8-3** [unit] **GIVEN** any trail, **WHEN** read, **THEN** `final` equals the value in
  the effective set the rules read (one object, not a copy that could drift).

### P9 Recompute

- **AC-P9-1** [unit] **GIVEN** the same three inputs twice, **WHEN** `effective` runs twice,
  **THEN** the outputs are deeply equal, trails included.
- **AC-P9-2** [unit] **GIVEN** `effective` instrumented to count calls, **WHEN** the rules run
  an `advance` over many unit completions with no input change, **THEN** it is called at most
  once for that segment. *[blocked: #4 for the real `advance`; a stub segment runner tests the
  rule now]*
- **AC-P9-3** [integration] **GIVEN** a save holding a committed method, an `F` and a tending
  choice, **WHEN** it is loaded, **THEN** the effective set and trails deeply equal those
  before saving. *[blocked: #11]*

### P10 Seal invariance

- **AC-P10-1** [validator] **GIVEN** every makeup, method and tending choice the content
  allows, **WHEN** the Validator enumerates them, **THEN** every `sealInput` value is equal
  tended and untended, and the seals are equal. *[blocked: #6, #10, #12]*
- **AC-P10-2** [unit] **GIVEN** any legal `T` (property test), **WHEN** `effective` runs,
  **THEN** no trail on a `sealInput` row has a tending step.

### P11 Integer safety

- **AC-P11-1** [integration] **GIVEN** the shipped schema, **WHEN** step 8 runs, **THEN** the
  five declared pairs of P11.1 are present and pass.
- **AC-P11-2** [integration] **GIVEN** a test schema that raises `source.outputs` to 10¹¹,
  **WHEN** step 8 runs, **THEN** it fails naming the pair.
- **AC-P11-3** [unit] **GIVEN** 16 `add` entries of +10⁹ on a value of 10⁹, **WHEN** applied,
  **THEN** the pre-clamp sum is exactly 1.7 × 10¹⁰ and the final is the row's maximum.

### Edge cases and performance

- **AC-E-1** [validator] **GIVEN** a tending entry that leaves some source's value unchanged,
  **WHEN** the Validator runs, **THEN** it warns, naming the source and choice.
  *[blocked: #10, #12]*
- **AC-E-2** [validator] **GIVEN** every `F` and `T` the content can produce, **WHEN** the
  Validator applies them, **THEN** none throws `ModifierError`. *[blocked: #6, #10, #12]*
- **AC-E-3** [integration] Closes #1's AC-E-3: **GIVEN** a Foundation or tending stage that
  pushes a value outside its row's range, **WHEN** the pipeline runs, **THEN** it clamps to
  the range with a clamp step (covered by AC-P6-1 and AC-P6-2).
- **AC-PERF-1** [integration] **GIVEN** MVP content in the build runtime, **WHEN** a full
  recompute with an `F` and a `T` runs 1,000 times, **THEN** the median is at most 2 ms
  (provisional until the performance ADR).

*`qa-lead` not consulted: auto mode could not check Agent calls in this session because a hook
rewrites their input. Review manually before production.*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Resolved 2026-11-20: amendment A1 applied to #1 (ops entries `{fn, noOpCheck, operandRange}`; step 7 checks the operand; `scale_bp` 0–100,000) | Designer | Done |
| 2 | Is `resource.cap` a seal input (#1 Open Question 1)? If yes, the Foundation stage moves a seal input after the forge | #3 with #6 | #6 GDD |
| 3 | Which `source` does a Foundation entry carry: the ingredient, the realm, or both as two entries? | #6 | #6 GDD |
| 4 | Does a tending choice survive the activity stopping (rest filling the slot, live or away)? It decides where #4 splits `advance` | #10 with #4 | #10 GDD |
| 5 | Is 16 `add` entries per value enough for the realm ladder, when several realms' Foundations may stack? | #19 | Alpha |
| 6 | Should breakdowns show a direction for method `set` steps (up or down), as #1 R7.2 recommends? | #14 | #14 UX spec |

**ADRs required** (representation decisions this GDD leaves out):

1. The ops table's encoding and `operandRange` (extends #1's ADR 4).
2. The effective set and trail representation: whether empty trails are materialised, sharing
   with the frozen set, and how #14 addresses a trail.
3. Recompute caching and its performance budget (with #1's ADR 9).
4. The `ModifierError` report format (with #1's ADR 8).
5. The forge snapshot's encoding of `F` (with #6 and #11).
