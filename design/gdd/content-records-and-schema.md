# Content Records and Schema

> **Status**: Approved 2026-11-20 (lean re-review after the fifth full review; no pillar-level or design blocker. Recommended follow-ups are in the review log and move to implementation: ADR 2/3, the schema module and its tests)
> **Author**: Will + agents
> **Last Updated**: 2026-11-21
> **Amendments**: A1 2026-11-20 — ops-table entries gain `operandRange`, checked at R8.3 step 7 (requested by Modifier pipeline #2 for `scale_bp`; approved by the designer). Touches R6.1, R8.3 step 7, AC-R8-2a, AC-R6-10, ADR 4 · A2 2026-11-20 — the stat-name list is closed as `might`, `guard`, `vigor`, `speed` (requested by Combat resolver #5; approved by the designer). Touches R4 note 4, R8.2, Cross-References · A3 2026-11-20 — `resource.cap` keeps `sealInput: yes` (Open Question 1 settled by Resources and caps #3, K8), and the affinity records are named by Forge and proving (#6), not #3 (designer-approved). Touches R4 note 1, Interactions rows 3 and 6, Open Questions row 1 · A4 2026-11-20 — adds the R4 row `affinity.widens` (note 10), sets the affinity count to 4, and narrows `door.thresholds` to 10,000–20,000 each (requested by Forge and proving #6; approved by the designer). Touches R1 table, R4 rows and notes 6 and 10, Interactions row 6, Cross-References, Open Questions rows 2, 9 and 12 · A5 2026-11-20 — `method.redoCost` is milliseconds of slot time (note 8); with `redoCost` absent the redo line reads "Redo: only by starting a new run"; the commit dialog also carries Methods' gives-up lines; R1's source target becomes ~23 (requested by Methods #7; approved by the designer). Touches R1 table, R4 row `method.redoCost` and note 8, R7.2, Edge Cases "Method patches", Cross-References, AC-R7-4, Open Questions rows 10 and 11 · A6 2026-11-21 — a door or affinity id retired without an alias is a validator error, as an ingredient, realm or method already was; Open Question 4 resolved (saves may be wiped until the first public build) (requested by Save and run lifecycle #11; approved by the designer). Touches Edge Cases "Saves across content versions", Cross-References, Open Questions row 4 · A7 2026-11-21 — R8.4's pillar 4 check 2 reads "some source that produces each input", with gates counted, as Crafting route #8 runs it in X5. Read literally, "every source that produces one of its inputs" would have demanded that all producers be fightless (requested by Content validator #12, VR2.4; approved by the designer). Touches R8.4 check 2
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 3 (The build is a problem) and 4 (No dead ends, no attention tax); supports 1 (The forge is the milestone) and 2 (Methods matter)
> **Creative Director Review (CD-GDD-ALIGN)**: REVISED 2026-11-19. Six findings applied: `contrib` is a total map; each method must patch a contribution and a route; no ingredient only fills a slot; protected ids need an alias; the fantasy anchor no longer fixes the preview model; numerals as words in proper names are allowed

## Summary

The one vocabulary every piece of content is written in. It has eight closed record types, a
single field registry, and gates built only from atoms that never go false. That registry says,
for every field, which of method, Foundation and tending may change it, and whether a seal is
computed from it. Players never see it, but it is what lets "the plan holds": need text is
always true and reachable, a method changes exactly the values it marks, and tending can never
touch a seal (pillars 3 and 4). Loading is headless and checks every record against the schema,
so content that breaks the vocabulary fails the build instead of dying silently, as 191 of
Hundred Days' records did.

> **Quick reference** — Layer: `Foundation` · Priority: `MVP` · Key deps: `None` (every system depends on it)

## Overview

Content records and schema is the single vocabulary in which every piece of content in The
Furnace Road is written. This includes resources, ingredients, the two methods, sources and the
activities behind them, crafting recipes, combatants, doors, and the short text that comments on
each. It has three parts:

1. **A closed set of record types**, each with a closed list of fields. A field that is not in
   the list is an error, never ignored (rules 1, 58).
2. **A field registry.** For every numeric field, it says which of the three modifier sources
   (method, Foundation, tending) may change it, and whether any seal is computed from it.
3. **A small closed set of gate forms.** These decide when a record is revealed and when it can
   be acted on, and they keep the two decisions apart (rule 2).

Content is plain data. It loads headless from the command line with no renderer, and contains no
code and no free expressions.

The player never sees the schema. They see what it makes possible:

- Every button that can't be pressed says in words what is missing.
- No source, recipe or door is gated on something that does not exist.
- A method changes exactly the numbers it declares, so the interface can mark exactly those
  numbers.
- Tending cannot reach a seal, because no seal input is open to it.

This system exists because pillar 4's guarantees, "every ingredient keeps two sources under
every method, one with no fight in its input chain" and "a makeup's seals are identical tended
or untended", are validator checks. A validator can only prove what the schema makes closed
enough to enumerate. Hundred Days shows the alternative: a vocabulary with no gate attached, and
191 of 4,520 records gated on ids that nothing defines (rule 51).

Two alternatives were considered and set aside:

- **Content as code** (Magic Research 2) ships fast, but nothing can check reachability
  (rule 95).
- **Arcanum's open expression strings and general `X.mod.Y` patching** (rules 3, 4) are
  narrowed for the MVP. Hundred Days used the simplest subset for 97% of 2,674 expressions
  (rule 57), and every operator offered is a maintenance and validation cost whether content
  uses it or not. The concept states this divergence and its reason (TD-FEASIBILITY; a first
  game on a short timeline).

This GDD states rules, invariants and acceptance criteria. The file format, TypeScript types and
serialization are decided by ADR (see Open Questions, "ADRs required").

## Player Fantasy

**Framing: indirect.** The player never sees a record, a gate or a field. They feel one thing
from this system: **the plan holds.**

The anchor moment is the concept's first key dynamic, "Players plan a forge backwards". The
player picks the Foundation they want and traces each ingredient to a source under their method.
They gather it and forge, and at proving every seal is the same number it was wherever the
game showed it. What the preview reveals, and when, is Forge and proving's (#6) to decide; this
system only promises that a seal is one number wherever it is shown.
That is only satisfying if the rules hold still while the player reasons about them. A greyed
button must say truthfully what is missing, and what it names must exist and be reachable. The
numbers a method changes must be exactly the numbers that wear its tint. A seal must be one number wherever it
is shown, tended or untended.

This system is what makes those promises keepable. It serves:

- **Pillar 3**: *"The best Foundation for a method is not obvious, and a better one is
  discoverable."* A discovery is only worth making if the rules it rests on hold still.
- **Pillar 4**: *"a makeup's seals are identical tended or untended."*

It also answers the forge prototype's tester, who lost a whole run to not understanding the
task.

Two narrower framings are folded into this one:

- **"Every locked door names its key"**: truthful, reachable need text (pillar 4).
- **"The method's fingerprint"**: exactly the changed values carry the method's mark (pillar 2;
  the visual rule *"What the method touches, the method marks"*). That moment belongs to Method
  marks (system 14), and its Game Feel is noted below.

**Tone.** Player-facing text that this system's records carry is calm and exact, like a
teacher's ledger. It uses cultivation nouns (furnace, ingredient, door, seal) and never system
words (record, gate, field). Need text reads like "Needs Ash-root ×3", not like a condition. Desc
and flavour lines are short and comment on the mechanic (rule 70).

**What the fantasy obliges this system to guarantee** (carried into Core Rules and Acceptance
Criteria):

1. Need text is generated from the gate itself, so the words and the condition cannot disagree.
2. Every id a gate or reference names exists (rule 51).
3. The set of values a method changes can be listed from content alone.
4. No seal input is open to tending.
5. Ids are stable, so a forged Foundation the player can point at survives a content update
   (rule 9).

*Specialist: `creative-director` consulted (three candidate framings; recommended "The plan
holds", adopted).*

## Detailed Design

### Core Rules

#### R1. Record types (closed list)

The MVP has exactly eight record types. A record whose `type` is not one of these is a load
error. Adding a type is a change to this GDD.

| Type | MVP count | What it is | Type-specific fields (rows in R4) |
|---|---|---|---|
| `resource` | ~8 | A capped amount the player holds: raw materials, refined goods, crafted key items | `cap`, `start` |
| `ingredient` | 6 | A forge ingredient. Holding one makes it available to a makeup | `contrib` |
| `affinity` | 4 | A named Foundation stat axis, one per fighting stat (#6 G3). It names the stat for tooltips, marks and breakdowns, and lists the stores it widens | `widens` |
| `method` | 2 | A cultivation method: its commit text, its redo price and its patches to other records | `commitText`, `redoCost`, `patches` |
| `source` | ~23 | One activity the slot can run, per unit: crafting recipes, single fights, dungeon floors, and rest if system 4 authors rest this way | `inputs`, `outputs`, `duration`, `fights`, `enabled` |
| `combatant` | ~7 | A fixed opponent for route fights and proving fights | `stats` |
| `door` | 3 | One door of the next realm: its proving opponent and tier thresholds | `opponent`, `thresholds` |
| `realm` | 1 | One realm's forge: which ingredients are offered, how many make a Foundation, which doors test it | `ingredients`, `makeupSize`, `doors` |

The counts are content targets for the MVP, not checks. The loader enforces only each
record's own structure (for example `realm.makeupSize` against its ingredient list).

Every type also has the shared fields `id`, `type`, `name`, `desc` and `flavor`. Sources also
carry the gate fields `reveal` and `need`.

**Left out on purpose**, and why:

- **A station type.** There is one station, so it is implicit in its recipes.
- **Separate recipe and dungeon types.** A recipe is a source with no fights, a single-fight
  source has one, and a dungeon floor has one. The dungeon is its floors, chained by gates.
- **Tags, flag records, events, `lock`/`disable`, and value ranges or percentage strings.**
  These would undo rules 51–53 and 57, and none is needed for the MVP.

A method "adds" a route by setting `enabled: true` on a source authored disabled, and "removes"
one by setting `enabled: false`. It never creates or deletes a record, and never re-points a
reference.

A method may switch off any source, a crafting recipe included (concept mechanic 2, amended
2026-11-20). The only limit on switching routes off is pillar 4's guarantee, which the
Validator checks under each method (R8.4): two sources per ingredient, one with no fight in
its input chain, within the price ceiling. Switching a recipe off therefore needs another
fightless source for that ingredient, authored disabled and enabled by the other method or left
enabled in both. The counts above are targets: if the removable recipes need more second
sources than the target allows, the target moves (Open Question 11).

#### R2. Identity

1. **Format.** Every `id` matches `^[a-z][a-z0-9_]{0,31}$`. Lowercase ASCII is safe as a
   filename on case-insensitive file systems and in a later mobile wrapper.
   **Reserved ids** are a load error even though they match the pattern:
   - Windows device names: `con`, `prn`, `aux`, `nul`, `com1`–`com9`, `lpt1`–`lpt9`;
   - words the rules or the language already use: `constructor`, `prototype`, `none`, `true`,
     `false`, `null`;
   - every R1 type name;
   - every R5 atom name.
2. **Uniqueness.** Ids are unique across *all* types, not per type. One namespace means a
   gate or reference can never be ambiguous. **`name` is also unique across all records**
   (compared as authored, in NFC), because need text and the closes list (R7.2) print records
   by name and two records with one name would read as one. A duplicate is a load error at
   step 9, reported on the later record in id order, field `name`. Rule 53's record-or-tag trap cannot arise, because
   the MVP has no tags. If tags arrive later, they get a syntax that is invalid wherever an id
   is expected.
3. **Stability.** `name` may change freely. An `id` is permanent once any save could hold it
   (rule 9). A rename is a retirement plus a new id, recorded in an alias map that Save and run
   lifecycle (system 11) owns. A retired id is never reused. Until the designer decides whether
   pre-release saves may be wiped (concept, Open Questions), renames are free.

#### R3. References

1. Every reference field names the record types it may point to (in its R4 row). A reference
   to a missing id, or to an id of the wrong type, is a load error naming the record and field
   (rule 51).
2. Loading reads every record before resolving any reference, so file and record order never
   matter.
3. Cycles in the source graph (A's output is B's input and the reverse) are not a schema error.
   Whether every ingredient is reachable is the Validator's check (system 12).

#### R4. The field registry

The registry is **one table, kept in this GDD**, with one row per (record type, field). Each
owning GDD adds its rows here and cites them; it never defines a field only on its own page.
`/consistency-check` compares this table with the owning GDDs. A field with no row is a load
error, and so is a row with no owner.

| Column | Meaning |
|---|---|
| `type.field` | Record type and field name |
| Kind | `int`, `int-list`, `bool`, `text`, `ref`, `ref-list`, `ref→int map` (keys are record ids), `name→int map` (keys come from a closed name list another GDD owns), `gate`, `patch-list`, `enum` |
| Unit | The unit of an `int`, or of the values in a map (for example `ms`, `units`, `basis points`, `stat points`) |
| Range | Inclusive min–max for numbers (inside ±(2⁵³−1), the safe integers; `-0` is rejected); a length limit for text and lists; allowed target types for refs |
| Req. | Required, or optional with the default stated here. Defaults come only from this table, never from loader code |
| `modifiableBy` | A subset of {method, foundation, tending}; `—` means none. Ids, refs, text and gates are never modifiable |
| `sealInput` | `yes` if any seal is computed from this field, directly or through any formula (see R4.3) |
| Owner | The GDD that owns the field's meaning and values |

**Registry rules**

1. `sealInput: yes` ⇒ `tending ∉ modifiableBy`. A row breaking this is a load error. This is
   how pillar 4's "a makeup's seals are identical tended or untended" becomes a schema fact.
2. A field name has one meaning and one unit in every type that carries it. For example,
   `duration` is always milliseconds per unit.
3. **Transitive tagging.** `sealInput` is tagged on every field that feeds a seal, whether
   directly or through any formula. The owning GDD tags its own fields. The Validator's
   enumeration (seals tended equal seals untended, over all cases) catches a field that was
   missed. Formulas are not declared as data, because that would need a formula language,
   which breaks the plain-data rule.
4. A method patch is legal only on a row whose `modifiableBy` includes `method`. The
   Foundation and tending stages are likewise limited to rows that include them (R6).
5. **Ranges bind effective values, not only authored ones.** A value produced by any modifier
   stage must stay inside its row's range.
   - The method stage runs at load, so an out-of-range result there is a load error (R6.3).
   - The Foundation and tending stages run on game state. The Modifier pipeline (#2) clamps
     after each of them, and says so in its own GDD.
6. **Text is checked as authored, and must already be in normal form.**
   - Text must be authored in Unicode NFC, and text that is not is a load error. The loader
     never rewrites text, so the fingerprint is the fingerprint of what was authored.
   - **Two tiers, because engines ship different Unicode versions.** The *build* check runs on
     every build, in the one runtime that ADR 3 pins (Bun at present, so its ICU version decides
     what counts as a digit or `White_Space`), and applies everything below, including the Unicode property checks
     (digits, `White_Space`, NFC). The *runtime* check, in the shipped bundle, applies only
     properties that do not change between Unicode versions: well-formed UTF-16 (no lone
     surrogates), no control character, line or paragraph separator, or U+FEFF, no leading or trailing character from the fixed space
     list (U+0009, U+0020, U+00A0, U+1680, U+2000–U+200A, U+202F, U+205F, U+3000), length, and no
     ASCII digit. A
     character one engine classifies as a digit and another does not is therefore a build
     decision, never a player-visible difference.
   - Lengths are counted in code points (`[...s].length`).
   - "Trimmed" means no leading or trailing character with the Unicode `White_Space` property
     (which includes U+00A0). `String.prototype.trim` is not used, because it also strips U+FEFF,
     which is not `White_Space`.
   - No text field contains a control character (Unicode category Cc: U+0000–U+001F and
     U+007F–U+009F, which covers LF, CR, NEL, tab, VT and FF; the category never changes between
     Unicode versions), a line or paragraph separator (U+2028, U+2029), or U+FEFF anywhere (it is
     not `White_Space`, so it needs its own rule).
   - "Digit" means any character in Unicode categories Nd, Nl or No. That catches `3`, `３`,
     `٣`, `²`, `½` and `Ⅻ`.
   - Numbers written as words pass the check. In a proper name that is intended: xianxia naming
     depends on it ("Nine-Turn Furnace", "Seven Stars Method"). Review flags only a *quantity
     claim* written in words ("holds three bowls", "doubles your yield"), because such a claim
     would bypass the field it should come from.
7. **A Range cell is a `;`-separated list of forms from one closed table** (fifth review:
   every form a row uses is in it, and each form carries the R8.3 step at which it runs). A cell
   with no check holds `—`. Each form is stored as structured data in the schema module, with
   its step. A form that does not fit its row's kind (for example a bare interval on a map) is a
   step 0 failure.

   | Form (as printed) | Applies to | Checks | Step |
   |---|---|---|---|
   | `a–b` | `int` | the value is in the interval | 3 |
   | `values a–b` | map kinds | every value is in the interval | 3 |
   | `each a–b` | `int-list` | every entry is in the interval | 3 |
   | `a–b entries`, `exactly n entries` | lists | the length | 3 |
   | `a–b chars` | `text` | length in code points (the text content rules are R4.6) | 9 |
   | `keys of the stat-name list` | `name→int map` | every key is in the schema's stat-name list | 3 |
   | `refs T[, T]` | `ref`, `ref-list` | each entry names a record of an allowed type | 5 |
   | `keys of type T[, T]` | `ref→int map` | each key names a record of an allowed type | 5 |
   | `rule Rn` | any | the whole check belongs to the cited rule, which names its own steps: R1 and R2.1 at step 1; R5 at steps 3, 4 and 6; R6 at step 7 | as the rule |
   | `≤ <field>` | `int` | `resource.start` ≤ its `cap` | 6 |
   | `2..M−1` | `int` | `realm.makeupSize` against M, the length of `realm.ingredients` | 6 |
   | `all keys of type T` | `ref→int map` | at step 5, each key names a record of type T (as `keys of type T`); at step 6, `ingredient.contrib` has exactly one key per affinity, and at least one affinity exists whenever an ingredient does | 5, 6 |
   | `distinct` | lists | no entry twice | 6 |
   | `strictly ascending` | `int-list` | each entry above the one before | 6 |

   - A bare `a–b` on a map kind is not a form: a map row states `values a–b`, and its keys by a
     `keys …` form.
   - `n ≤ cap` (a `reached` atom against its resource's authored cap) is an atom rule (R5.3, step
     6), not a row.
   - Each named check is implemented once in the schema module and listed in AC-R8-2a.
   - A new form is a change to this GDD.
8. **The schema module is the only source of the table.** The runtime schema value (R8.2) holds
   the rows as one ordered array `rows[]`, each with structured fields: kind, unit, range (a
   list of R4.7 forms, each with its step), default, `modifiableBy`, `sealInput`, owner, and
   `notes: {unit?, range?, sealInput?}` (an integer per cell that carries a marker). Nothing
   parses this GDD. A generator writes the table between the markers `<!-- registry:begin -->`
   and `<!-- registry:end -->` (a marker is a line that holds only the comment) from the schema
   module, and a test (AC-R8-2b) checks that regenerating it reproduces the committed text
   exactly, so the two cannot drift. Until the schema module exists, the table below is the
   hand-written seed it is built from; the generator arrives with the module (ADR 2).
   - **One order.** The order of `rows[]` is the registry order. It is the print order and the
     order in which a step visits fields (R8.3, AC-R8-10): the shared `*` rows first, then rows
     by type in R1 order, and within a type in the order the seed table shows.
   - **Owners.** The schema module holds a fixed `owners` list (the GDD names that appear in the
     Owner column). A "field with no row" means a field on a record that no row names
     (AC-R4-3), and a row whose owner is not in `owners` is a step 0 failure. The list is a
     constant, so the check is not circular.
   - **Notes.** A note marker sits at the end of one cell, stored as that cell's integer in
     `notes`. Step 0 checks that every marker has a note under the table and every note is
     referenced by a marker.
   - **One renderer grammar** prints every cell from its structured field, with these fixed
     pieces: the header line and its separator line exactly as the table below shows them, and
     one blank line after the begin marker and one before the end marker; `type.field` in
     backticks; integers in plain decimal with comma grouping and U+2212 for a minus sign; an
     interval as `a–b`; the Range forms of R4.7 as the "Form (as printed)" column shows, joined
     by `; `; a Req. cell as `yes`, `no` or `no, default <literal>` (an empty list `[]`, an
     empty map `{}`, a number, or `true`); `modifiableBy` as the subset in the order method,
     foundation, tending, joined by `, `, or `—` for none; `sealInput` as `yes` or `no`; a null
     Unit or Range as `—`; a note marker as ` [n]` at the end of its cell; Unit as the label
     string the schema stores.
   - The first run of the generator rewrites this seed table into that grammar, and the diff
     test guards it from then on. It is run once, and its output committed, as part of ADR 2's
     delivery. The notes under the table are hand-written and sit outside the markers.
9. **Rows hold structured values; prose goes in a note.** A cell holds what the schema module
   stores. Any explanation a reader needs (for example why `combatant.stats` is tagged
   `sealInput` for every combatant) goes in a note under the table, because the generator
   cannot render prose. `n ≤ cap` is an atom rule (R5.3), not a row, and is tested by AC-R5-2.

**Rows (provisional until each owner's GDD approves them)**

<!-- registry:begin -->

| `type.field` | Kind | Unit | Range | Req. | `modifiableBy` | `sealInput` | Owner |
|---|---|---|---|---|---|---|---|
| `*.id` | text | — | rule R2.1 | yes | — | no | this GDD |
| `*.type` | enum | — | rule R1 | yes | — | no | this GDD |
| `*.name` | text | — | 1–24 chars | yes | — | no | this GDD |
| `*.desc` | text | — | 1–80 chars | no | — | no | this GDD |
| `*.flavor` | text | — | 1–140 chars | no | — | no | this GDD |
| `resource.cap` | int | units | 1–1,000,000,000 | yes | foundation | yes [1] | Resources and caps (#3) |
| `resource.start` | int | units | 0–1,000,000,000; ≤ cap | no, default 0 | — | no | Resources and caps (#3) |
| `ingredient.contrib` | ref→int map | stat points | values −1,000,000–1,000,000; all keys of type affinity [2] | yes | method | yes | Forge and proving (#6) |
| `affinity.widens` | ref-list | — | refs resource; 0–16 entries; distinct [10] | no, default [] | — | no | Forge and proving (#6) |
| `method.commitText` | text | — | 1–200 chars | yes | — | no | Methods (#7) |
| `method.patches` | patch-list | — | rule R6 [7] | no, default [] | — | no | Methods (#7) |
| `method.redoCost` | int | ms [8] | 0–1,000,000,000 | no | — | no | Methods (#7) |
| `source.reveal` | gate | — | rule R5 | no | — | no | this GDD |
| `source.need` | gate | — | rule R5 | no | — | no | this GDD |
| `source.inputs` | ref→int map | units per unit | keys of type resource, ingredient; values 1–1,000,000,000 [3] | no, default {} | method | no | Activity slot (#4) |
| `source.outputs` | ref→int map | units per unit | keys of type resource, ingredient; values 1–1,000,000,000 [3] | no, default {} | method, tending | no | Activity slot (#4) |
| `source.duration` | int | ms per unit | 1–86,400,000 | yes | method, tending | no | Activity slot (#4) |
| `source.fights` | ref-list | — | refs combatant; 0–3 entries | no, default [] | — | no | Fight and dungeon routes (#9) |
| `source.enabled` | bool | — | — | no, default true | method | no | Methods (#7) |
| `combatant.stats` | name→int map | stat points | keys of the stat-name list; values 0–1,000,000 [4] | yes | — | yes [5] | Combat resolver (#5) |
| `door.opponent` | ref | — | refs combatant | yes | — | yes | Forge and proving (#6) |
| `door.thresholds` | int-list | proving points [6] | exactly 2 entries; strictly ascending; each 10,000–20,000 | yes | — | yes | Forge and proving (#6) |
| `realm.ingredients` | ref-list | — | refs ingredient; 3–12 entries; distinct [9] | yes | — | yes | Forge and proving (#6) |
| `realm.makeupSize` | int | ingredients | 2..M−1 | yes | — | yes | Forge and proving (#6) |
| `realm.doors` | ref-list | — | refs door; 1–6 entries; distinct | yes | — | yes | Forge and proving (#6) |

<!-- registry:end -->

Notes (hand-written, outside the generated block; `[n]` in a cell is a note marker that the
schema row stores as the integer n):

1. `resource.cap` is tagged `sealInput: yes` provisionally. The conservative tag keeps tending
   away from it. #3 and #6 may lower it to `no` before the row leaves "provisional".
   **Amended 2026-11-20 (A3), designer-approved:** kept `yes` by Resources and caps (#3, K8).
   A seal that reads a cap reads the cap in force before that forge's own entries (the base cap
   in the MVP). The row itself is unchanged.
2. `contrib` is a total map: exactly one key per affinity in content, and at least one affinity
   exists whenever an ingredient does. No other key type until #6 defines one. 0 is allowed.
3. An absent key means none. A value of 0 is not allowed, so a patch cannot "remove" an entry in
   two different ways.
4. The keys are ids from the stat-name list that #5 closes. Until then the schema module holds a
   placeholder constant (`stat_a`, `stat_b`). Keys follow the id pattern, so `__proto__` and
   integer-like keys fail at R8.3 step 3.
   **Amended 2026-11-20 by Combat resolver (#5), designer-approved:** the list is closed as
   `might`, `guard`, `vigor`, `speed`, in that order (`design/gdd/combat-resolver.md` C1). The
   row itself is unchanged. This GDD's fixtures and acceptance criteria keep `stat_a` and
   `stat_b` by loading against a test schema (R8.2).
5. Tagged `sealInput` for every combatant, even though only proving opponents feed seals. A row
   covers a whole type, so the conservative tag keeps tending away from all of them.
6. The proving result's scale is set by #6. Each threshold is 0–1,000,000 until #6 narrows it.
   **Amended 2026-11-20 by Forge and proving (#6, A4), designer-approved:** each threshold is
   10,000–20,000, the combat resolver's win floor to its maximum score (#5 F7), so a lost fight
   is always tier 0 (`design/gdd/forge-and-proving.md` G6, S4). This GDD's fixtures and
   acceptance criteria keep their threshold values (`[10, 20]`, the AC-R4 bounds row) by loading
   against a test schema (R8.2).
7. The patch operations are owned by the Modifier pipeline (#2) beyond `set` and `add`. This GDD
   owns legality.
8. The numeric field the commit dialog's redo line reads (R7.2). Absent means the method offers
   no redo. Its unit and meaning belong to Methods (#7) and Reforge (#16).
   **Amended 2026-11-20 by Methods (#7, A5), designer-approved:** the unit is milliseconds of
   untended slot time, the price of leaving the method after committing to it. Reforge (#16)
   decides how it is paid. No MVP method carries it (`design/gdd/methods.md` W9).
9. The entry count of `realm.ingredients` is the realm's M.
10. **Added 2026-11-20 by Forge and proving (#6, A4), designer-approved.** The stores an
    affinity's effective value widens after the forge (`design/gdd/forge-and-proving.md` G11,
    S6). Not a seal input, because no seal reads a cap (#3 K8.2). #6's B12 rejects a key item
    (base cap 1) in the list.

#### R5. Gates

1. **Two gates, kept apart (rule 2).**
   - `reveal` decides whether the player can see a record at all.
   - `need` decides whether a revealed record can be acted on, and the interface explains in
     words what is missing.
   - An absent `reveal` means revealed from the start. An absent `need` means nothing is
     needed.
   - Only `source` records carry gates in the MVP.
2. **Form.** A gate is an AND-list of one or more atoms. There is no OR and no negation
   (rule 57). An empty list is not a gate: the field is omitted instead.
3. **Atoms (closed list).**

   | Atom | True when | Never goes false because |
   |---|---|---|
   | `reached(id, n)` | The most of resource or ingredient `id` the player has ever held is at least `n`. For a resource, 1 ≤ n ≤ its authored cap. For an ingredient, n = 1: an ingredient is held or not until Forge and proving (#6) gives it a count | It reads a high-water mark, not the current amount |
   | `committed()` | The player has committed to a method | The method is fixed for the run once committed (MVP) |
   | `forged(realmId)` | That realm's Foundation has been forged | A forge is never undone; reforge replaces, never drops (pillar 4) |

   There is deliberately no `committed(methodId)` atom. A gate naming one method would be a
   second way to make a route method-specific, outside `patches`, and Method marks (#14)
   could not see it (F8). Routes become method-specific only through `enabled` patches.
   Within one gate, the same atom or the same id may not appear twice (a load error).
4. **Monotone by construction.** Every atom, once true, stays true for the rest of the run, so
   every gate does too. That gives three guarantees:
   - The concept's claim that obtainability never shrinks after the commit holds by schema,
     and the Validator only confirms it.
   - A record revealed once stays revealed, with nothing saved but the atoms' inputs.
   - "Can I afford it now" is never a gate. It is the activity's inputs and stop rule
     (system 4).
5. **Need text is generated, never authored.** The rules core builds it (the pure function
   `needText`, R8.1) and the interface only displays it, from the unmet atoms
   and the names of the records they name, for example "Needs Ash-root ×3 (3 more)". The other atoms read
   "Needs a method committed" for `committed()` and "Needs the [realm name] forged" for
   `forged(realm)`. There is no authored override, because an override can drift from the
   gate it describes.
   - **Before the commit, the text leads with the commit.** While no method is committed,
     `needText` for any source puts the line "Needs a method committed" first, whether or not
     the source's own gate holds `committed()`, because F7 keeps every source waiting until the
     commit and a source whose own `need` is already met would otherwise show no reason (fifth
     review). A `committed()` atom of the gate then prints no second line. After the commit the
     line is gone, and only the unmet atoms of the gate print, in authored order.
6. Gates read game state only (high-water marks, the commit, forged realms). They never read a
   content number, so no modifier can change whether a gate is met.
7. **Data shape.** A gate is an array of atom objects, and no other keys are allowed:
   `{"atom": "reached", "id": <resource or ingredient id>, "n": <int>}`,
   `{"atom": "committed"}` (no `id`, no `n`) and `{"atom": "forged", "id": <realm id>}`. A
   missing, extra or wrongly typed key is a load error (R8.3 step 4). ADR 10 may choose the file
   encoding but not this shape.
   - **Bounds.** A gate array has at least one entry (R5.2; checked at step 3, so `[]` is a load
     error there and never reaches step 4). In a `reached` atom, `n` is a safe integer of at
     least 1 (step 4), so a threshold of 0 or less, which would be true from the start and give
     F4 a shortfall of 0 or less, is a load error. The upper bounds (`n ≤ cap`, and `n = 1` for
     an ingredient) are step 6, because they need the target record.

#### R6. Method patches and `applyMethod`

1. A method's `patches` is a list of entries `{target, field, key?, op, operand}`.
   - `target` is a record id, and `field` is one of its fields.
   - `key` is **required on a map field** (`source.inputs`, `source.outputs`,
     `ingredient.contrib`) and **forbidden on every other field**. It names the map key whose
     value changes. The unit a patch addresses is therefore the triple (record, field, key),
     with the key absent for scalar fields.
   - `op` is a string naming an entry of the ops table (below), and `operand` is an integer
     within ±(2⁵³−1). On a bool field (`source.enabled`) only `set` is legal, with operand 1
     (true) or 0 (false); `add`, or any other operand, there is a load error at step 7
     (legality, R6.2). The ops layer reads a bool as 0 or 1 and writes the result back as a
     bool.
   - An entry has exactly the keys `target`, `field`, `op`, `operand` and, on a map field only,
     `key`. A missing or non-string `target` is a load error at step 3 of R8.3 (step 5 reads it);
     any other missing, extra or wrongly typed key, an unknown `op`, or a non-integer or unsafe
     `operand` is a load error at step 7.
   - An op result that is not a safe integer is a load error naming the method, record and field.
     It is reported at step 7, where the result is first computed, before the row's own
     range.
   - The loader takes an **ops table** keyed by op name, each entry `{fn, noOpCheck,
     operandRange}` where `fn` is a pure function `(current, operand) → int`, so no check here
     waits on system 2. `operandRange` is an inclusive integer interval inside ±(2⁵³−1) that a
     method patch's operand must lie in; for `set` and `add` it is the whole safe range, so
     their meaning is unchanged (**amendment A1**, 2026-11-20, requested by the Modifier
     pipeline #2 for `scale_bp`'s 0–100,000 and approved by the designer). The MVP
     set, owned here, is `set` (result = operand) and `add` (result = current + operand), both
     with `noOpCheck: true`. The no-op check of step 7 and F8 runs for every op whose entry says
     `noOpCheck: true`; an op that #2 adds with `false` is exempt, and its own GDD says why. The
     Modifier pipeline (#2) may add operations (for example basis-point scaling through `bp_of`,
     F6) and owns the order in which stages apply; it may not change what `set` and `add` mean.
2. A patch is legal only if all of these hold:
   - the target exists;
   - its type carries the field;
   - the field's registry row includes `method`;
   - for a bool field, the op is `set` and the operand is 0 or 1;
   - for a map field, the key already exists in the target's map;
   - no other entry in the same method addresses the same (record, field, key).

   Patches can never touch `id`, `type`, text, gates, references or `fights`. On a map field
   (`source.inputs`, `source.outputs`, `ingredient.contrib`), a patch changes the value of a key
   that already exists. Because `contrib` is a total map with 0 allowed, a method can still move
   an ingredient onto an affinity or off it ("under Still Water, ash-root's fire is quenched")
   by setting that key's value to or from 0. It never adds or removes a key, because keys are references. To give an
   ingredient a new source under one method, author that source disabled and enable it.
3. `applyMethod(content, method)` is pure. It reads only content and the method, never game
   state, and returns content in the same schema. Its output must pass every schema check in R8
   again. A patch whose result falls outside its row's range is therefore a **load error**,
   because authored content is caught at load. Clamping (R4.5) applies only to the Foundation
   and tending stages, which run on game state. A patch that would leave a reference pointing at a disabled source is fine, since
   `enabled` is a state of the record, not its absence. The Validator still checks that every
   ingredient keeps its sources.
4. **The set of values a method changes is listable.** For every (record, field, key), output
   differs from input exactly where that method has a patch entry. A method can therefore patch
   several keys of one map (for example two affinities of one ingredient), each as its own
   entry. Method marks (system 14) come from this set, and mark one value per triple.

#### R7. Values and text

1. **Numbers are finite integers.**
   - A content number passes `Number.isSafeInteger` and is not `-0` (`Object.is`), so it lies in
     ±(2⁵³−1). `NaN`, `Infinity` and `-0` are load errors.
   - No decimals, strings, ranges, percentages, expressions or randomness appear in content.
   - Each field's unit and range come from its registry row.
   - A percentage is written in basis points (1 = 0.01 %).
   - Time is whole milliseconds.
   - Every division anywhere in the rules names its rounding, which is floor unless it says
     otherwise. The Modifier pipeline owns where those divisions happen.
   - Integer arithmetic is exact and identical across browser engines and the build runtime. The `advance`
     composition test and the seal-invariance test both need exact equality.
2. **Text is plain strings**, with no markup or templates, and is keyed by record id so it can
   be translated later.
   - `name` is required.
   - `desc` and `flavor` are optional and comment on the mechanic (rule 70).
   - `commitText` is required on every method. It is words only: it carries the method's voice
     and makes no claim about what the commit closes or what a redo costs, because prose can
     drift from the patches (the reason R5.5 bans authored need text). The commit dialog builds
     two lines itself (rule 54):
     - the **closes list**, generated from the method's change set (F8) by the pure helper
       `closesLines(method, content)` (R8.1). It has one line per triple, in (target, field, key)
       order (UTF-16 code units, the order of R8.5's patch sort), with these templates:
       `enabled` set to 0 gives "Closes: {target name}"; `enabled` set to 1 gives
       "Opens: {target name}"; every other triple gives "Changes: {label}". A changed value's
       label is built from names: the target's `name`, then the map key's `name` for a map field
       ("Iron seed: Ember") or the field's label from the schema module's label table for a
       scalar field ("Smelt ore: Time").
       The label table has one entry in the MVP, `source.duration` "Time" (the only scalar value
       field a method may patch besides `enabled`, which is listed as a source opened or
       closed); its entries are text under R4.6 and a new one is a change to this GDD. The list
       shows each value as changed, with no number and no direction word (the number is the
       interface's, from the field, rule 97; a direction word is a recommended addition, not
       part of this GDD yet);
     - the **redo line**, generated from `method.redoCost` (Methods #7, Reforge #16). When the
       field is absent the line reads "Redo: only by starting a new run" (amended 2026-11-20,
       A5: the MVP's one redo is the fast new game, #11). When it is present the line states
       the price from that field, in Methods' template (`design/gdd/methods.md` Y2).
     - **Amended 2026-11-20 (A5):** between the closes list and the redo line the dialog also
       shows Methods' gives-up lines (`givesUpLines`, `design/gdd/methods.md` W1, Y1): "Closes:
       {other method}", then one "Closes: {source}" line for each source only another method
       opens.

     The price is therefore always a field, never authored text.
   - **No text field contains a digit**: not `name`, `desc`, `flavor` or `commitText`. Every
     number the player sees comes from a field, so marks and breakdowns stay true (rule 97).
   - Present text is never empty, never only whitespace, and has no leading or trailing
     spaces. An empty field and an absent field must not be two spellings of one thing, or
     they would give different fingerprints.

#### R8. Loading and the checks this system owns

1. **One loader, no I/O.**
   - The rules core exposes one content loader that takes already-parsed plain data.
   - The browser build and the command line (validator, tests) only hand it data, and neither
     transforms anything.
   - Content has no environment branches and no dev-only records.
   - Content is bundled with the game, so it is available before the first screen with no
     network request.
   - **Contract** (fifth review; ADR 2 and 3 may rename things but not change the shape).
     `load(raw, opts?)` returns `{checked, frozen, registry, fingerprint}`. On the first failure
     it **throws** a `LoadError` and returns nothing.
     - `raw` is an array of plain record objects. The file layout (ADR 1, 3) is flattened to
       this array before the call.
     - `opts` is `{schema?, tier?, ops?, applyMethod?}`. `schema` defaults to the shipped schema
       (R8.2). `tier` is `'build'` or `'runtime'` and defaults to `'runtime'` (R4.6). `ops`
       defaults to the MVP ops table (R6.1). `applyMethod` defaults to the real function and is
       the one seam a test uses to inject a double (AC-R8-13).
     - `checked` is the validated, default-filled content before any patch, an object indexed by
       record id. `frozen` is an object indexed by method id, each value one content set indexed by
       record id. `registry` is `{rows, rowsFor(modifier)}`: `rows` is the schema's `rows[]`, and
       `rowsFor('method' | 'foundation' | 'tending')` returns the rows whose `modifiableBy`
       holds it. `fingerprint` is the lowercase hexadecimal string of R8.5.
     - **A `LoadError` carries** `{step, record, field, cause}` and, where they apply, `method`,
       `entry` and `key`. `step` is 0–9, or `'output'` for the output check. For an ordinary
       error, `record` is the record id and `field` its field. For a step 0 error the error
       carries `row` (`type.field`) and no `record`. For a patch error (step 7 and the output
       check), `method` is the method id, `entry` the index of the patch entry (absent in the
       output check), and `record`, `field` and `key` name the patch's **target** and, on a map
       field, its map key. `cause` is a short fixed phrase ("unknown field", "after patch").
   - **The copier.** The loader first copies `raw` with a small hand-written function over plain
     data, so the caller's object, which may be a bundled module shared across tests, is never
     frozen or changed. The copier accepts only plain objects (prototype `Object.prototype` or
     none), dense arrays, strings, numbers, booleans and `null`. It rejects `undefined`, sparse
     arrays, class instances, `Map`, `Set`, accessors, symbol keys and cycles. It writes every key
     with `Object.defineProperty`, so an own key named `__proto__` (which `JSON.parse` produces)
     stays an own key and fails at step 3, instead of replacing the prototype and vanishing. A
     copier failure is a step 1 error whose `record` is the record's `id` when that is a string,
     or `#<index>` otherwise, and whose `field` is the path to the value.
   - **Freezing.** `checked` is deep-frozen when step 9 has passed, before any `applyMethod` runs.
     `applyMethod` returns new objects for the records it changes and shares the rest, so a
     mutation of its input throws a `TypeError`, which the loader reports as a patch error with
     the cause "applyMethod changed its input" (with `record` and `field` absent, since a
     `TypeError` does not say which value it guarded). Each method's output set is deep-frozen after
     its output check passes. Records a method does not patch are shared between `checked` and
     the frozen sets.
   - **Pure rule helpers.** Rules that read game state are pure functions of one plain state
     argument `state = {marks, held, committed, forged}`: `marks` and `held` map record ids to
     integers, `committed` is a method id or `null` (none), and `forged` is an array of realm
     ids. The helpers are `atomMet(atom, state)`, `gateMet(gate, state)` (an absent gate is met),
     `shortfall(atom, state)`, `recordState(record, state, content)`,
     `needText(record, state, content)` and `closesLines(method, content)` (F2–F4, F7, R5.5,
     R7.2). `needText` and `closesLines` return an array of strings. `content` is the frozen set
     of the committed method, or `checked` when `state.committed` is `null`; the helpers read
     `enabled` and names from it. Systems #4, #7 and #11 own where the state lives; the helpers
     need none of them, so their acceptance criteria are unit tests here.
2. **The schema is a runtime value.** The record types, field lists, `rows[]` (R4.8), the
   `owners` list, the gate atoms, the default ops table, the reserved-id list, the label table
   and the stat-name list exist as data the code can read. The checks take the schema as an
   input, so tests can pass a modified schema; the shipped one is the default. Checks read that
   value. The stat-name list is `might`, `guard`, `vigor`, `speed` (closed by #5; amended
   2026-11-20, see R4 note 4); tests may pass a schema with the placeholder `stat_a` and
   `stat_b`. The schema also holds a list of **declared product pairs**, each `{value, factor}` where
   each side is `{row: "type.field"}` (that row's largest absolute range bound) or
   `{const: n}` (a positive safe integer). #2 declares basis-point pairs, and #4 declares the
   pair (largest output, most units one `advance` may complete, F1). The list is empty until
   they do, and AC-F6 uses a test schema. TypeScript types are derived from it or checked
   against it, never the reverse, because TypeScript 7.0 has no programmatic compiler API
   (`docs/engine-reference/web/breaking-changes.md`).
3. **Structural checks run on every load**, in the shipped game as well as in tests and the
   build. They need no game state. Step 0 runs once per schema. Steps 1–9 then run in this fixed
   order, and **loading stops at the first failure**, which names the record and field (a step 0
   failure names the row as `type.field`). Within one step, records are visited in id order
   (UTF-16 code-unit order) and fields in registry order (R4.8), so the same bad content always
   gives the same error. **A step reads only what the steps before it have verified**, so a
   malformed value always gets a named load error and never a thrown TypeError.
   0. the schema itself: `sealInput: yes` ⇒ `tending ∉ modifiableBy` (R4.1); every field has a
      row; every row's owner is in `owners` (R4.8); every Range is a list of R4.7 forms that fit
      the row's kind; every note marker has a note and every note is referenced; every declared
      product pair (step 8) is well-formed. A test that passes a modified schema (R8.2) fails
      here, not on content;
   1. the copier (R8.1), then each record is a plain object whose `id` and `type` are strings,
      checked in array order (an error names the id, or `#<index>`); from here on records are
      visited in id order. The type is one of the schema's own type keys (an own-key lookup, so
      `constructor` is not a type); ids have the right format, are not reserved, and are unique;
   2. there are no unknown fields, and required fields are present; then every literal default
      of the R4 Req. column is filled into the record. Steps 3–9, `applyMethod` and the
      fingerprint all read the filled record, so an absent `enabled` is `true` everywhere and is
      never `undefined`;
   3. single-field kinds and the R4.7 forms marked step 3. A gate must be an array of plain
      objects with at least one entry; `patches` an array of plain objects, each with a string
      `target`; a map a plain object whose keys match the id pattern (so `__proto__` and
      integer-like keys fail here). A text field is only checked to be a string: its length and
      content rules run at step 9. No lookup of another record runs here;
   4. gate shape: each atom has exactly the keys and types of R5.7, and `n` of a `reached` atom
      is a safe integer of at least 1. No id is looked up yet;
   5. references (the R4.7 forms marked step 5): every ref field, map key, gate id (`reached`: a
      resource or ingredient; `forged`: a realm) and patch `target` names a record of an allowed
      type, looked up in a table built from the ids of step 1. Only a patch entry's `target` is
      read here (a string, since step 3); its other keys are not verified until step 7;
   6. cross-record forms and gate rules: `≤ <field>`, `2..M−1`, `all keys of type`,
      `distinct` and `strictly ascending` (R4.7); `n ≤ cap`, `n = 1` for an ingredient, and no
      atom or id twice in one gate (R5.3);
   7. patches, for each method in id order and each entry in authored order: the entry's shape
      (R6.1); then its legality (R6.2: the field exists on the target's type, its row includes
      `method`, a bool field takes `set` with 0 or 1, `key` is present exactly on map fields and
      names an existing key, and no earlier entry has the same triple, so a duplicate is
      reported on the later entry); then the operand lies in its op's `operandRange` (R6.1,
      amendment A1); then the op result is a safe integer; then, for an op whose
      table entry says `noOpCheck: true`, the result differs from the input (F8, R6.1);
   8. every declared product pair stays inside exact integer range (F1, F6);
   9. text is within its limits and passes R4.6 and R7.2: length, trimming, digits, control
      characters, line and paragraph separators, U+FEFF and NFC (build tier); and every `name` is
      unique (R2.2).

   **Output check.** After step 9, `checked` is deep-frozen and `applyMethod` runs once per
   method, in method-id order. For each output the loader walks every leaf value by
   (record, field, key) and compares it with `checked`; a record, field or key that is missing
   or extra counts as a difference. The set of differing triples must equal `changed(m)`
   exactly (F8), so no other value moved. Each record the output changes is also checked by
   steps 3 and 6 (kinds, ranges, cross-record forms). Records the method does not change are
   shared with `checked` and are not rechecked, and steps 4, 5, 7 and 9 are not repeated,
   because patches touch no gate, reference or text. A failure is reported once, as a patch
   error (`method`, `record`, `field`, `key`) with the cause "after patch". It stops loading, so
   later methods are not checked.

   `bun run build` fails if any check fails.
4. **The Validator (system 12) owns** the checks that need game state or enumeration:
   - every `reveal` is false at the start (rule 52);
   - **the pillar 4 source checks, run under each method's frozen set** (designer decision,
     2026-11-20, fourth review). Each is a validator error:
     1. every ingredient has at least two enabled sources that output it;
     2. at least one of them has no fight anywhere in its input chain: the source's own
        `fights` is empty, and each of its inputs, and each id its `reveal` and `need` atoms
        name, has **some** producer whose chain is fightless in the same sense, recursively,
        down to inputs that are held from the start. A chain that loops back on itself counts as
        having a fight only if some source on it has one. *(Amended 2026-11-21, A7: "some"
        producer, with gates counted. This is Crafting route #8's hearth road, and the
        Validator runs this check as #8 X5, #12 VR2.4.)*
     3. that fightless source stays within the price ceiling of the ingredient's other sources.
        #6's forge design document sets the ceiling and what it measures, and the Validator
        applies it. Until #6 states it, check 3 is `[blocked: #6]`;
   - reachability under each method's frozen set (rule 51);
   - no cap or slot that no content can fill (rule 74);
   - every ingredient changes at least one seal under at least one method, so no ingredient
     only fills a slot (pillar 1);
   - every method patches at least one `ingredient.contrib` value and at least one
     `source.enabled` value. A method that only changes rates is the "+10% qi" case pillar 2's
     design test rejects;
   - seals tended equal seals untended;
   - the balance table.
5. **Content fingerprint.**
   - The loader computes the fingerprint from the checked content in **canonical form**:
     - defaults are already filled (R8.3 step 2), but only for rows whose Req. column states a
       literal default: `start` 0, `enabled` true, and `inputs`, `outputs`, `patches` and `fights`
       empty. Rows with no default (`desc`, `flavor`, `reveal`, `need`, `redoCost`) stay absent,
       and **absent means omitted from the canonical text, never `undefined` or `null`**. Two
       spellings of one value then cannot hash differently (R7.2's reason);
     - records are ordered by id, and every object's keys by UTF-16 code-unit order. Every map
       key matches the id pattern (R8.3 step 3), so no key is integer-like and none is
       `__proto__`;
     - **order-significant lists keep their authored order**: gate atoms (they drive need
       text), `door.thresholds`, `source.fights` and `realm.doors`. **Sets are sorted**:
       `realm.ingredients` by id, and `method.patches` by (target, field, key), all in UTF-16
       code-unit order. Patches are unique per triple, and a field is either scalar or map, so
       within one (target, field) the key is always present or always absent and an absent key
       never has to be compared;
     - **the canonical text is written by a small serializer in the schema module, not by
       `JSON.stringify` on the content objects**, because `JSON.stringify` cannot order keys
       and the engine reorders integer-like ones. The serializer emits an array
       `[schemaVersion, [[id, record], …]]` in which every object is written as an array of
       `[key, value]` pairs in the key order above, numbers as plain decimal safe integers
       (R7.1, no `-0`), booleans as `true` or `false`, and every string through
       `JSON.stringify(string)` alone (text is well-formed UTF-16, R4.6, so that output is the
       same in every engine). `schemaVersion` is an integer constant in the schema module,
       raised whenever a rule or an op changes meaning;
     - text is as authored (NFC, R4.6). **The hash input is the UTF-8 encoding of that canonical
       text**, so the bytes of the quotes and escapes are part of it.
   - The hash is computed **synchronously by a pure-code function** (no Web Crypto, which is
     async, and no `node:crypto`, which is not in the bundle). The algorithm and the digest
     width are an ADR (ADR 6). The fingerprint is the digest written as lowercase hexadecimal
     of that fixed width, so a golden value is a plain string.
   - File order and record order therefore never change it.
   - The frozen sets are derived deterministically from that content, so they need no
     fingerprint of their own.
   - It must be identical in the build runtime and in the production bundle. The save records
     the fingerprint it was written against (system 11).

### States and Transitions

**Content lifecycle.** This happens once per load. Content never changes at runtime after it
is frozen.

| State | Entered when | Leaves to | On failure |
|---|---|---|---|
| Raw | The loader receives parsed plain data | Checked | — |
| Checked | Every structural check in R8.3 passes on the raw records | Patched | Loading stops; the error names record and field |
| Patched | `applyMethod` has run once for each method, and each output has passed the R8.3 output check | Frozen | Loading stops; the error names the method, record and field |
| Frozen | One immutable, id-indexed content set per method, plus the fingerprint | — (terminal for this load) | — |

Before the commit, the method-choice view reads both frozen sets side by side, and nothing is
actionable. Gathering starts only after the commit (concept, mechanic 2). After the commit, the
rules read only the committed method's frozen set.

**Per-record runtime state.** This applies to `source` records only, the one type that carries
`reveal`, `need` and `enabled` (R5.1). Other types have no derived state. All four states are
**derived** each time they are read and **none is saved**. The save holds only the atoms' inputs: high-water marks per resource and
ingredient, the committed method, and forged realms.

| State | Holds when | Notes |
|---|---|---|
| Hidden | `reveal` exists and is not met | Never shown |
| Waiting | `reveal` is absent or met, and the record is neither Actionable nor Withdrawn (no method committed yet, or `need` unmet) | Shown but not usable. "Revealed" means any of Waiting, Actionable or Withdrawn: once revealed, always revealed, because atoms are monotone (R5.4) |
| Actionable | Revealed, `need` absent or met, `enabled` true in the committed set, and a method committed | Whether it can *run* right now (inputs in hand, output under cap) is system 4's stop rule, not a state here |
| Withdrawn | Revealed, a method committed, and `enabled` false in the committed set | A route the method removed, or one it never added. Hidden wins over withdrawn (F7). How it is shown is system 14's |

| Transition | Trigger | Reversible? |
|---|---|---|
| Hidden → Waiting | The last unmet `reveal` atom becomes true (when that atom is `committed()`, the commit is the trigger), and F7 then gives waiting: either no method is committed, or one is committed, `enabled` is true and `need` is unmet | No (monotone) |
| Hidden → Actionable | A method is committed, the last unmet `reveal` atom becomes true (or the commit itself, when that atom is `committed()`), `enabled` is true in the committed set and `need` is already met | No (monotone) |
| Waiting → Actionable | A method is committed, `enabled` is true in the committed set, and the last unmet `need` atom becomes true (or the commit lands with `need` already met) | No (monotone) |
| Waiting → Withdrawn | The commit, when `enabled` is false in the committed set | Not in the MVP. The post-commit method switch (Vertical Slice, system 16) must re-derive it, and must keep `committed()` monotone or amend R5 |
| Hidden → Withdrawn | A method is committed, the last unmet `reveal` atom becomes true (or the commit itself, when that atom is `committed()`) while `enabled` is false in the committed set | No (monotone) |

Actionable and Withdrawn are terminal within one content version. A source whose `reveal` is `committed()` goes from Hidden to its final state at the commit in one step (F7).

### Interactions with Other Systems

This system owns the vocabulary. Every other system reads frozen content and registers its
fields in R4. None of them may add a field, type or gate atom without amending this GDD.

| # | System | Reads from this system | Gives back / registers | Interface owner |
|---|---|---|---|---|
| 2 | Modifier pipeline | Registry rows (`modifiableBy`, `sealInput`); `applyMethod` output | Patch operations, stage order, rounding points, provenance for breakdowns | Pipeline owns operations; this GDD owns target legality |
| 3 | Resources and caps | `resource` records | Rows for `resource.cap` and `resource.start`; names the resources and their caps (A3: the affinity records are #6's) | Shared: this GDD owns the type, #3 owns the values |
| 4 | Activity slot | `source` records (`inputs`, `outputs`, `duration`, `enabled`) | Their rows; the high-water marks that `reached` reads; whether rest is a source | #4 owns the stop rule and the marks |
| 5 | Combat resolver | `combatant` records | The closed list of stat names in `combatant.stats` | #5 |
| 6 | Forge and proving | `ingredient`, `affinity`, `door`, `realm` records | Their rows; the `forged` state that `forged` reads; the seal function; names the affinity records (A3); `affinity.widens` and thresholds 10,000–20,000 (A4) | #6 |
| 7 | Methods | `method` records; R6 legality | `commitText`, `patches` and `enabled` rows; the committed state that `committed` reads | #7 owns which patches exist; this GDD owns legality |
| 8 | Crafting route | `source` records with no fights | Content only, with no new fields | This GDD |
| 9 | Fight and dungeon routes | `source` records with fights | The `source.fights` row; how floors chain, using `reached` on floor outputs | #9 |
| 10 | Tending | Registry rows open to `tending` | Targets only on rows that already allow tending and are not `sealInput` | This GDD enforces the rule (R4.1) |
| 11 | Save and run lifecycle | Ids, the fingerprint | The alias map; storage of atom inputs | #11 |
| 12 | Validator | Frozen sets, registry, gates | The state and enumeration checks of R8.4 | #12; structural checks stay here |
| 13 | Interface shell | `name`, `desc`, `flavor`, gate atoms | Generated need text; rendering by field, not by type (rule 33) | #13 renders; this GDD fixes the text rules |
| 14 | Method marks and breakdowns | The listable patched set (R6.4) | — | #14 |
| 15 | Forge screen | `realm`, `ingredient`, `door` records | — | #15 |
| 16 | Reforge (VS) | `forged`, `committed` | Must keep atoms monotone or amend R5 | #16 |
| 17, 18 | Phone layout, accessibility (VS) | Text limits | — | — |
| 19 | Realm ladder (Alpha) | `realm` records | More realms; `door`-tier atoms if doors gate the next realm | #19 amends R5 |
| 20 | In-game codex (FV) | The whole record graph | — | #20 |

*Specialists consulted for this section: `systems-designer` (primary), `gameplay-programmer`
and `engine-programmer` (supporting). They split on three points, and the designer decided each:
the registry is one table here, not per-GDD tables; gates are monotone AND-only atoms; time is
integer milliseconds.*

## Formulas

This system sets **no balance numbers**. It defines three things: what gates read, two shared
integer helpers that every other GDD uses, and the derived record state. All values are
integers (R7.1).

### F1. High-water mark

The high_water formula is defined as:

`high_water[id] = max(high_water_prev[id], held[id])`, evaluated once per unit completion (never
inside a unit, and never only at the end of an advance), for every resource and ingredient.

**Evaluation point (pinned).** When a unit of a source completes, the order is: deduct the
source's `inputs`, add its `outputs`, clamp `held` to the effective cap, then update every mark
once from the resulting `held`.
- `advance(dt)` updates marks at every unit boundary it crosses. So `advance(a+b)` and
  `advance(a)` followed by `advance(b)` give identical marks, not only identical held amounts.
- A change to `held` that is not a unit completion (forge consumption in #6, a new run in #11)
  updates the marks once, after the change. **Postcondition:** after any change to `held`,
  `held[id] ≤ high_water[id]` for every id. F4's shortfall of at least 1 depends on it, so a
  grant that raised `held` without updating the mark would break it (AC-F1).
- Activity slot (#4) owns the stop rule and must follow this order. **Precondition (#4's):** a
  unit completes only while `held ≥ inputs` for every input id, so `held` never goes below 0
  inside a unit; inputs are paid at completion, in the order above.
- **No unsafe product.** An `advance` that completes k units must not form `k × outputs`
  (or `k × inputs`) before the clamp. It either applies the units one at a time, or uses a
  closed form that clamps first and is proved equal to the one-at-a-time result. Either way the
  pair (largest `outputs` value 10⁹, most units one `advance` may complete) is a declared
  product pair (R8.2) that step 8 of R8.3 checks against 2⁵³ − 1. At a duration of 1 ms the
  product passes 2⁵³ − 1 after about 9×10⁶ units (about 2.5 hours), so #4 must cap the units
  per `advance`, and the cap is part of that pair.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| high_water_prev[id] | int | 0–10⁹ | game state | The saved mark. At the start of a run it equals min(`start[id]`, effective cap) (0 for ingredients). Effective cap is #3's, after the Foundation stage |
| held[id] | int | 0–effective cap for a resource; 0–1 for an ingredient | game state | The amount after the change, already clamped by Resources and caps (#3). #3 owns the ingredient clamp to 1 (an ingredient `outputs` value above 1 is legal and clamps), until #6 gives ingredients a count (Open Question 2) |
| high_water[id] | int | 0–10⁹ | calculated | The new mark; saved by #11 |

**Output Range:** 0 up to the highest cap the record had this run. It never decreases within
a run; only a new run (#11) resets it.
**Example:** The mark is 4 and the player holds 4. They gather 3, so they hold 7 and the mark
becomes max(4, 7) = 7. They spend 6, so they hold 1 and the mark stays max(7, 1) = 7.
**Same-id unit:** held 5, cap 10, a unit with input 4 and output 3 of the same id. The unit
leaves held at 5 − 4 + 3 = 4 and the mark at max(5, 4) = 5. The mark never reads the
intermediate 1 or 8, so engine order inside a unit cannot change it.

### F2. Atom evaluation

The atom_met formula is defined as:

`atom_met(a) =` `high_water[id] ≥ n` for `reached(id, n)` · `committed_method ≠ none` for
`committed()` · `realm ∈ forged_realms` for `forged(realm)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| a | atom | R5.3 list | data file | The atom being evaluated |
| n | int | 1 to the authored cap of a resource; exactly 1 for an ingredient | data file | The atom's threshold |
| high_water[id] | int | 0–10⁹ | game state | From F1 |
| committed_method | method id or none | — | game state | Set by Methods (#7) at the commit |
| forged_realms | set of realm ids | 0–1 members in the MVP | game state | Set by Forge and proving (#6) |

**Output Range:** true or false. Within a run it only ever changes from false to true (R5.4).
**Example:** The mark for `ash_root` is 2, so `reached(ash_root, 3)` is false. When the mark
reaches 3, it becomes true and stays true.

### F3. Gate evaluation

The gate_met formula is defined as:

`gate_met(g) = true` if g is absent; otherwise `AND over a ∈ g of atom_met(a)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| g | atom list | 1 or more atoms, or absent | data file | A record's `reveal` or `need` |
| atom_met(a) | bool | — | calculated | From F2 |

**Output Range:** true or false, and monotone. An empty list never occurs, because R5.2 makes
it a load error.
**Example:** The need is `[committed(), reached(ash_root, 3)]`. The player has committed and
the mark is 2, so the result is true AND false = false.

### F4. Need shortfall

The shortfall formula is defined as:

`shortfall(id, n) = n − held[id]`, for each unmet `reached(id, n)` atom

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| n | int | 1 to cap | data file | The atom's threshold |
| held[id] | int | 0 to n−1 | game state | The amount held now |

**Output Range:** 1 to n.
- An atom is unmet only while held ≤ mark < n, which is why the range never reaches 0.
- The formula uses `held`, not the mark, because the atom is met only by holding n at once.
  A mark of 2 does not mean "1 more".
- Met atoms produce no line. `committed` and `forged` lines carry no number. Lines appear in
  the gate's authored order.
- Need text shows the target and the shortfall (designer, 2026-11-19).

**Example:** n = 3, the mark is 2 and the player holds 0. The text reads "Needs Ash-root ×3
(3 more)". Using the mark would wrongly say 1.

### F5. Floor division (shared helper)

The div_floor formula is defined as:

`div_floor(a, d) =` the largest integer q with q × d ≤ a

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| a | int | ±(2⁵³ − 1) | calculated | Dividend |
| d | int | 1 to 2⁵³ − 1 | constant or data file | Divisor. A divisor of 0 or less is an error, never a silent 0 |

**Output Range:** exact, rounding toward −∞ (designer, 2026-11-19).
- Every division in any GDD uses `div_floor` unless that GDD names another rounding (R7.1).
- True floor makes negative `contrib` values behave like positive ones: shifting the dividend
  by one whole divisor shifts the result by exactly 1. Rounding toward zero would make the band
  around 0 twice as wide.
- **Reference algorithm.** `div_floor(a, d)` throws a `RangeError` unless `a` and `d` pass
  `Number.isSafeInteger` and `d ≥ 1`. Then `r = a % d; q = (a − r) / d; if (r < 0) q −= 1;
  return q + 0`. `a − r` is exact because `r` has the sign of `a` and `|r| < d`, so `|a − r| ≤ |a|`;
  the division is exact because `a − r` is a multiple of `d`; and `+ 0` turns `-0` into `+0`.
  Another implementation (for example `Math.floor(a / d) + 0`, which a 2M-case BigInt sweep and
  the boundary pairs did not fault in the fifth review) is allowed only if it matches this one
  on every AC-F5 case and on a BigInt property test.
- Any implementation must be exact for every safe integer. Tests cover large and negative
  dividends as regression checks. The real overflow risk is in products (F6), not here.
- The result is never `-0`: an implementation normalises a zero quotient to `+0`, so deep
  equality and the fingerprint cannot tell two zeros apart.

**Example:** div_floor(7, 2) = 3; div_floor(−7, 2) = −4.

### F6. Basis points (shared helper)

The bp_of formula is defined as:

`bp_of(x, b) = div_floor(x × b, 10000)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| x | int | its registry range | data file or game state | The base value |
| b | int | its registry range | data file | Basis points; 10000 = 100 % |

**Output Range:** exact while |x × b| ≤ 2⁵³ − 1. A structural check enforces this (R8.3):
- The Modifier pipeline (#2) declares every (value field, basis-point field) pair it combines.
- For each pair, the registry ranges must keep max|x| × max|b| inside that bound. For example,
  |x| ≤ 10⁹ allows |b| ≤ 9,007,199.

**Example:** bp_of(250, 1250) = div_floor(312500, 10000) = 31; bp_of(−250, 1250) = −32.

### F7. Derived record state

The record_state formula applies to `source` records only (R5.1) and is defined as follows; the
first condition that holds wins:

`record_state(r) =` **hidden** if NOT gate_met(r.reveal) · **waiting** if committed_method =
none · **withdrawn** if enabled_C(r) = false · **actionable** if gate_met(r.need) · otherwise
**waiting**

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| r.reveal, r.need | gate | F3 | data file | The source's gates |
| committed_method | method id or none | — | game state | From F2 |
| enabled_C(r) | bool | — | calculated | `enabled` in the committed method's frozen set |

**Output Range:** one of four labels (hidden, waiting, withdrawn, actionable), never saved. Before
the commit, the only possible states are hidden and waiting.
- **Hidden wins over withdrawn** (designer, 2026-11-19). A route the method removed stays
  invisible until its `reveal` is met, so nothing leaks early and rule 52's "reveal false at
  start" stays meaningful.
- **F7 is authoritative and the transition table is derived from it.** Where the two seem to
  differ, F7 decides. The commit and a `reveal` that is `committed()` take effect at the same
  instant: F7 is read after the commit, so a source revealed by the commit is derived in one
  step from its final state, never through an intermediate one.

**Example:**
- `smelt_ore` has reveal `reached(raw_ore, 1)` and need `reached(charcoal, 2)`, and it is
  enabled under the committed method.
- With marks raw_ore 1 and charcoal 1, it is waiting.
- When the charcoal mark reaches 2, it becomes actionable.

### F8. Method change set

The changed formula is defined as:

`changed(m) = { (p.target, p.field, p.key) : p ∈ m.patches }` (`key` absent for scalar
fields), where `applyMethod(c, m)[r][f][k] ≠ c[r][f][k]` exactly when `(r, f, k) ∈ changed(m)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| m.patches | patch list | R6 | data file | The method's entries |
| c | content | R1–R4 | data file | Checked content |

**Output Range:** 0 to |m.patches| triples, because R6.2 forbids duplicates. A structural check
enforces the "exactly" (R8.3): a patch whose result equals its input is a load error, so the
set of marked values is never larger than the set of changed values. The check uses only the
MVP ops (`set`, `add`, R6.1), whose result the content alone decides. A later operation that #2
adds must say, in its own GDD, whether this check applies to it.
**Example:** A method with three patches yields three (record, field, key) triples: two on
`iron_seed.contrib` (keys `ember` and `frost`) and one on `smelt_ore.enabled`. Method marks (#14)
mark exactly those three values.

### Formulas owned by other systems

- Seals, the proving result and the threshold comparison: Forge and proving (#6).
- Patch operations, stage order, where `div_floor` is called, and provenance: Modifier
  pipeline (#2).
- The effective cap and clamping of `held`: Resources and caps (#3), modified through #2.
- Progress, outputs per unit and the stop rule: Activity slot (#4).
- Combat: Combat resolver (#5).
- Tending's speed and yield effects: Tending (#10).
- The fingerprint hash: an ADR; the fingerprint is stored by #11.
- Reachability and the enumerations: Validator (#12).
- Number formatting for display: Interface shell (#13).

*Specialist: `systems-designer` consulted; its three recommendations were adopted (shortfall
text, floor toward −∞, hidden wins over withdrawn).*

## Edge Cases

Each case says **who catches it**:

- **load error**: a structural check (R8.3) stops loading;
- **validator error** or **validator warning**: the Validator (#12) fails or warns in tests and
  the build;
- **runtime rule**: the rules core handles it in play;
- **owned by #N**: another system decides, and this GDD records the expectation.

### Ids and text

- **If an id matches the pattern but is reserved** (`con`, `nul`, `com1`, `constructor`,
  `none`, `true`, a type name, an atom name): load error (R2.1). Windows device names break the
  "safe as a filename" promise, and `constructor` or `none` collide with object keys or with
  F2's "no method" value.
- **If two records share an id, even across types**: load error (R2.2).
- **If two records share a `name`, even across types**: load error at step 9, reported on the later
  record in id order (R2.2). The closes list and need text print records by name.
- **If `desc` or `flavor` is empty, only whitespace, or has spaces at either end**: load error
  (R7.2). An absent field is the only way to say "none".
- **If any text field holds a digit, in any script** (`3`, `３`, `٣`, `²`): load error (R4.6,
  R7.2). Numbers written as words pass. In a proper name ("Nine-Turn Furnace") that is
  intended; a quantity claim in words is a review finding.
- **If a `name` is exactly 24 code points (authored text is already NFC, R4.6)**: it passes. At 25 it is a
  load error, whatever its byte length.

### Gates and values

- **If a gate names the same atom or id twice**: load error (R5.3). Need text would otherwise
  print two lines for one item.
- **If a gate is `[]`, or a `reached` atom has `n` of 0 or less**: load error (R5.7 bounds, step 3 and
  step 4). The atom would be true from the start and F4's shortfall would be 0 or less.
- **If `reached(id, n)` names an ingredient with n > 1**: load error (R5.3), until Forge and
  proving (#6) gives ingredients a count.
- **If `n` exceeds the resource's authored cap**: load error (R5.3).
- **If `n` exceeds the smallest effective cap any reachable Foundation or method can give
  that resource**: validator error. F4's shortfall could never close, which is a dead end
  (pillar 4). The effective cap is #3's.
- **If `resource.start ≥ n` for some `reached(id, n)`**: the atom is true from the start,
  because F1 starts the mark at `start`.
  - In a `reveal` it is a validator error (rule 52: a reveal must narrow).
  - In a `need` it is a validator warning (a vacuous atom).
- **If `need` contains `committed()`**: validator warning. F7 already requires a commit before
  anything is actionable, so the atom is redundant.
- **If every atom of a source's `need` is implied by its `reveal`**: validator warning. The
  need line could never show.
- **If the effective cap drops below the held amount or the high-water mark** (after a reforge,
  for example): #3 clamps `held`; the mark keeps its value (F1 allows marks above the current
  cap). No gate that was met becomes unmet.
- **If a method patch's result is outside its row's range** (`duration` set to 0, for
  example): load error naming the method, record and field (R6.3).
- **If a patch tries to add or remove a key in a map field**: load error (R6.2).
- **If a patch on `source.enabled` uses `add`, or a `set` operand other than 0 or 1**: load error at
  step 7 (R6.2 legality).
- **If the Foundation or tending stage pushes a value outside its row's range** (`duration`
  below 1, an output above 10⁹): runtime rule. The Modifier pipeline clamps after that stage
  (R4.5). The
  Validator's enumeration flags any case where the clamp actually fires, as a warning.
- **If `source.inputs` or `source.outputs` holds a value of 0**: load error (R4 rows). An absent
  key is the only way to say "none", so a patch cannot "remove" an output in two different ways.
  `ingredient.contrib` is the exception: it is a total map, and 0 is how it says "nothing".
- **If a patch carries a `key` on a scalar field, omits it on a map field, or names a key the
  map lacks**: load error (R6.1, R6.2).
- **If `start` exceeds the effective cap** (a Foundation lowered the cap): the mark and `held`
  both start at min(`start`, effective cap), so `reached(id, n)` never starts true for an `n` the
  player cannot hold (F1).
- **If `contrib` has a key that is not an affinity**: load error, until #6 defines another key.
- **If `contrib` omits an affinity that exists in content, or ingredients exist but no affinity
  does**: load error. `contrib` is a total map, so "contributes nothing to fire" is written as 0,
  never as an absent key.
- **If `realm.ingredients` or `realm.doors` lists an id twice, or `door.thresholds` has two
  equal values**: load error (R4 rows: distinct, strictly ascending).
- **If `realm.makeupSize` is not between 2 and M−1**: load error (concept: 2 ≤ N < M).
- **If a divisor is 0 or negative anywhere in the rules**: runtime error, never a silent 0
  (F5). Each GDD that divides must keep its divisor's range at 1 or more.

### Method patches

- **If a patch targets a field whose row does not allow `method`** (for example `resource.cap`,
  or `start`): load error (R6.2). A method cannot push a cap below a start amount.
- **If a patch leaves its target unchanged**: load error (F8). This keeps the marked set equal
  to the changed set.
- **If a method has no patches, or both methods' frozen sets are identical**: validator error.
  The method would not change anything (pillar 2).
- **If a method patches only rates** (durations, inputs, outputs) with no `contrib` patch and
  no `enabled` patch: validator error (R8.4, pillar 2's "+10% qi" design test).
- **If a patch leaves an ingredient with fewer than two enabled sources, or with none whose
  input chain is fightless, or one outside the price ceiling**: validator error under that
  method (R8.4, the three pillar 4 checks). Disabling a crafting recipe is legal only while all
  three still hold for every ingredient it produced.
- **If a patch disables every source of an id that some `reached` atom, or the forge, needs**:
  validator error under that method (R8.4, reachability under each method's frozen set).
- **If a patch targets a source the same method also disables**: validator warning. The patch
  changes a value no one can use.
- **If no method offers a redo (`method.redoCost` absent on every method, the MVP)**: the commit
  is permanent for the run. This is pillar 4 debt that Methods (#7) and Reforge (#16) must
  clear, not an exception this GDD accepts. The commit dialog says so in the redo line (R7.2).
  **Amended 2026-11-20 (A5):** Methods (#7, W9) names the fast new game as the MVP's redo, so
  the line reads "Redo: only by starting a new run". #16 clears the rest of the debt.
- **If a source is disabled in both frozen sets**: validator error. The content could never be
  used (rule 74).
- **If a source has no inputs and no outputs, or its outputs equal its inputs**: validator
  error. The activity does nothing. The one exception is rest, if Activity slot (#4) authors
  rest as a source and declares how it is marked.
- **`resource.cap` is tagged `sealInput: yes` for now**: the conservative tag keeps tending away
  from it. If a seal depends on a cap, a seal depends on the previous Foundation, a loop reforge
  (#16) would hit. #3 and #6 must settle this, and may lower the tag to `no`, before the row
  leaves "provisional".

### Before the commit

- **If the player is in the method-choice view and a route exists only under one method (or is
  removed by one) but is still hidden** (designer decision, 2026-11-20):
  - The view shows **both methods' projected sets side by side**, ignoring `reveal`. For each
    method it lists the sources that method adds (`enabled` set to 1) and removes (`enabled` set
    to 0), by name, with each ingredient's source count. This overrides "hidden wins over
    withdrawn" (F7) in this view only, because planning backwards needs to know what a commit
    closes.
  - Hidden-by-`reveal` stays in force everywhere else. The view shows no source that the
    methods' change sets do not touch, so the rest of the unrevealed content is not leaked.
  - It never shows text (`desc`, `flavor`) of a hidden record, only its name.
  - **Value patches are shown too, without absolute values** (designer decision, 2026-11-20,
    third review; narrowed in the fourth). The view lists each patched value of the change set,
    `ingredient.contrib` included, so a player can reason about seals before gathering.
    - For `ingredient.contrib`, an `add` patch shows its delta on the affected (ingredient,
      affinity) pair, and a `set` patch shows "changed" with no number. A base contribution is
      therefore never shown before the ingredient is in hand, which keeps the concept's
      "values appear only once an ingredient is in hand" true (concept line ~122, amended to
      match).
    - Other patched fields (`duration`, `inputs`, `outputs`, `enabled`) show what the patch
      says, as the layout owners decide.
    - The concept's Preview rule (mechanic 1) limits only the forge screen's seal display.
      Forge and proving (#6) re-checks the over-gathering price with this view assumed (Open
      Question 9), and that balance table is a gate of #6's approval.

  This serves "plan a forge backwards" (pillar 3). Rule 52 ("reveal false at start") is about
  in-run reveal and is unaffected. Forge screen #15 and Method marks #14 own the layout.
- **If the player tries to start any source before committing**: runtime rule. Nothing is
  actionable (F7), so there is nothing to start.

### Saves across content versions (owned by #11)

- **If a saved id was retired and has an alias**: #11 maps it to the alias target.
- **If a saved id was retired and has no alias**: #11 drops it and logs that it did.
- **If an ingredient, realm, method, door or affinity id is retired without an alias**: validator
  error. Those ids make up a forged Foundation and its snapshot (#6 G10), the thing the player can
  point at (pillar 1), so dropping one would silently change it. *(Amended 2026-11-21, A6: door
  and affinity added, so no shipped content can make #11 refuse a forged save, #11 D4.2.)*
- **If the alias map has a chain, a cycle, a target that is missing or of a different type,
  or an alias source that is a live id**: load error.
- **If a retired id is reused**: validator error, checked against a retired-id list kept in
  the repository.
- **If a content update raises a `reveal` threshold above a saved high-water mark, or adds an
  atom**: the record re-derives as hidden. Monotonicity is promised within one content version,
  not across versions. The Validator compares against the last shipped content and warns on
  any raised threshold or added atom, so this is never accidental (designer-accepted
  recommendation, 2026-11-19).
- **If a content update disables a route while it is running, or raises its `need`**: #4 stops
  the slot (rest fills it), and #11 shows a notice that the content changed. Its trigger is a
  fingerprint mismatch.
- **If the saved fingerprint differs from the loaded one and nothing else applies**: the save
  loads. The fingerprint is information, not a lock.

*Specialist: `systems-designer` consulted. Its rule changes were applied to R2.1, R4, R5.3,
R7.2, R8.4 and F1, and both recommendations were adopted.*

## Dependencies

**Upstream: none.** This is the only Foundation-layer system. It reads no other system's
output. Three design inputs constrain it, and they are inputs, not runtime dependencies:

- the concept's Technical Considerations (TD-FEASIBILITY mitigations);
- the systems index's Technical Director Note (findings 2, 5, 6, 8);
- the pinned stack (`docs/engine-reference/web/`).

**Downstream: every system.** All dependencies on this system are **hard**: none of these
systems can load, run or be validated without the vocabulary.

| # | Dependent | Nature | Data interface |
|---|---|---|---|
| 2 | Modifier pipeline | Hard | Registry rows; `applyMethod` contract (R6) |
| 3 | Resources and caps | Hard | `resource` type; registers `cap`, `start` |
| 4 | Activity slot, rest and away time | Hard | `source` type; registers `inputs`, `outputs`, `duration`; provides high-water marks for `reached` |
| 5 | Combat resolver | Hard | `combatant` type; closes the stat-name list |
| 6 | Forge and proving | Hard | `ingredient`, `affinity`, `door`, `realm` types; provides `forged` |
| 7 | Methods | Hard | `method` type; R6 legality; provides `committed` |
| 8 | Crafting route | Hard | `source` records with no fights |
| 9 | Fight and dungeon routes | Hard | `source.fights`; floor chaining via `reached` |
| 10 | Tending | Hard | Registry rows open to tending; R4.1 |
| 11 | Save and run lifecycle | Hard | Stable ids (R2), alias map, fingerprint (R8.5), atom inputs |
| 12 | Content validator | Hard | The runtime schema value; frozen sets; the R8.3/R8.4 split |
| 13 | Interface shell | Hard | Text fields and limits; generated need text (R5.5) |
| 14 | Method marks and breakdowns | Hard | The listable patched set (R6.4) |
| 15 | Forge screen | Hard | `realm`, `ingredient`, `door` records |
| 16 | Reforge (VS) | Hard | `forged`, `committed` atoms; must preserve monotonicity or amend R5 |
| 17 | Phone layout (VS) | Soft | Text length limits |
| 18 | Accessibility (VS) | Soft | Text fields keyed by id |
| 19 | Realm ladder (Alpha) | Hard | `realm` type; may add a door-tier atom by amending R5 |
| 20 | In-game codex (FV) | Hard | The record graph and text |

**Bidirectional consistency.** No dependent GDD exists yet. Each one must list "depends on:
Content records and schema" in its own Dependencies section, and must add its fields as rows in
R4. `/consistency-check` checks both.

## Tuning Knobs

This system has **no gameplay tuning knobs**. Every gameplay number (caps, durations, yields,
contributions, thresholds) is owned by the GDD named in that field's registry row and tuned
there. What it does have are **schema limits**. They are constants of the vocabulary, changed
only by amending this GDD, and every change re-runs the structural checks over all content.

| Limit | Value | Safe range | Too low breaks | Too high breaks |
|---|---|---|---|---|
| Id length | 1–32 chars | 16–64 | Readable ids for 5–6 realms of content | Save size; log readability |
| `name` length | 24 chars | 16–32 | Cultivation names ("Ironbark Heartwood" is 18) | Phone-width buttons (rule 67) |
| `desc` length | 80 chars, one line | 60–120 | Rule 70's mechanic comment | Tooltip density on a phone; Arcanum's median desc is about 47 chars |
| `flavor` length | 140 chars | 80–200 | Room for a xianxia image | Tooltip height |
| `commitText` length | 200 chars | 120–300 | The method's voice in a sentence or two (the closes list and redo line are generated, R7.2) | The commit dialog on a phone |
| Fights per source | 0–3 | 0–3 | — | A single source longer than the MVP dungeon; raise only with #9 |
| Doors per realm | 1–6 | 1–6 | — | The 0–6 seal measure (#6) |
| Integer magnitude | ±(2⁵³−1) | per-row ranges inside it | — | Exact integer arithmetic in JavaScript |
| Duration ceiling | 86,400,000 ms (24 h) | up to the away-time cap (#4) | — | One unit outlasting the away cap |

These limits interact in two places. Raising `doors per realm` changes the seal range, which
#6 owns. Raising the `duration` ceiling past the away-time cap would let a single unit outlast
an away period, which #4 must allow first.

## Visual/Audio Requirements

None of its own. This system draws nothing and plays nothing. It supplies the data that visual
systems rely on:

- **Method marks (#14):** the listable change set (F8, R6.4), which says exactly which values
  carry the method's tint and glyph;
- **the forge screen (#15) and the shell (#13):** names, descriptions and flavour.

The forge's visual event and the direction-of-change mark are art-director gaps owned by #15 and
#14 (systems index). Audio has no system yet.

## Game Feel

Indirect, like the fantasy. This system sets two feel targets that other systems deliver:

1. **Instant content.** Content is bundled and checked before the first screen, with no network
   request and no loading state of its own (R8.1). At MVP size, loading and checking should not
   be noticeable. ADR-0039 lists Load Time as "target set, not yet measured", so this GDD sets a
   **provisional ceiling of 20 ms** for loading and checking the shipped content in the build
   runtime (AC-LOAD-1), measured by `bun run perf`. ADR 9 may replace it once measured.
2. **The method's fingerprint.** Exactly the values a method changes carry its mark, and nothing
   else moves (F8). This system guarantees the "exactly"; Method marks (#14) owns the feel of
   seeing it.

## UI Requirements

This system has no screen, but it fixes rules every screen must follow:

- **Render by field, not by type** (rule 33). A tooltip shows the same ordered fields for every
  record type that has them.
- **Need text is generated** from unmet atoms (R5.5, F4) in the gate's authored order. Every
  `reached` line shows the target and the shortfall. It is never authored or overridden. Before
  the commit, every waiting source leads with "Needs a method committed" (R5.5).
- **Text limits** (R4 rows, Tuning Knobs) are set so names fit phone-width buttons. Phone width
  is a constraint from the MVP (rule 67).
- **Numbers come only from fields.** No text field contains a digit (R7.2), so every number on
  screen can carry a mark and a breakdown (rule 97).
- **The method-choice view** may show change sets and per-ingredient source counts. It shows the
  *name*, never the text, of a hidden source that a method's patches touch, and no other hidden
  record (Edge Cases, "Before the commit"). Change sets include `ingredient.contrib` patches
  (designer decision, 2026-11-20, third review), shown as an `add` delta or as "changed" for a
  `set`, never as an absolute value (fourth review). The forge screen's seal preview (concept
  mechanic 1) still shows seals only when every ingredient is in hand.
- **Load errors are for developers only.** A content error stops the build and tests, so a
  player should never see one.
  - If a shipped build still hits one (a corrupted bundle, for example), the game shows a
    single plain error screen that names the record and field.
  - It starts no play, and it **does not write the save**, so the player's save is never
    overwritten by a broken load.

> **📌 UX Flag — Content records and schema**: this system's rules apply to every screen. When
> `/ux-design` writes the specs for Interface shell (#13), Method marks (#14) and Forge screen
> (#15), each should cite R5.5, R7.2 and the render-by-field rule.

## Cross-References

| This document references | Where | What it relies on | Status |
|---|---|---|---|
| `design/gdd/game-concept.md` | Core Mechanics; Technical Considerations; Stated divergences (rules 3, 4, 96) | Plain data, closed gate forms, three modifier sources, the validator split, the narrowed rules | Concept, third revision |
| `design/gdd/systems-index.md` | Per-system rationale #1; Technical Director Note findings 2, 5, 6, 8; Foundation fixed at forge time | Field registry, record types owned here, state/actions/events section, GDD/ADR split | Approved 2026-11-19 |
| Modifier pipeline (#2) | R4.5, R6.1, F5, F6, F8 | Operations, stage order, clamping, rounding points, basis-point pairs | Not yet designed |
| Resources and caps (#3) | R4 rows `resource.*`; Edge Cases on caps | Cap and start values; clamping `held`; whether `cap` is a seal input | Not yet designed |
| Activity slot (#4) | R4 rows `source.*`; F1; rest as a source | Stop rule; high-water marks; durations in ms | Not yet designed |
| Combat resolver (#5) | `combatant.stats` | Closed stat names | Designed 2026-11-20; list closed in R4 note 4 |
| Forge and proving (#6) | R4 rows `ingredient.*`, `affinity.*`, `door.*`, `realm.*`; R5.3 ingredient counts | Seal function; `forged` state; affinity-only `contrib` keys | Designed 2026-11-20; amended this GDD (A4) |
| Methods (#7) | R6; `method.*`, `source.enabled` | Committed state; which patches exist; the closed surface (feed, quench, open) | Designed 2026-11-20; amended this GDD (A5) |
| Save and run lifecycle (#11) | R2.3, R8.5, Edge Cases on saves | Alias map, retired-id list, fingerprint handling | Designed 2026-11-21 (`save-and-run-lifecycle.md` D3, D5, D11); amended this GDD (A6) |
| Content validator (#12) | R8.4; every "validator error" edge case | State and enumeration checks | Not yet designed |
| Method marks (#14), Forge screen (#15), Interface shell (#13) | UI Requirements; F8 | Marking exactly the change set; generated need text | Not yet designed |
| `research/arcanum-reference/03-data-model.md`, `12-design-rules.md` | Overview, R1–R7 | Rules 1, 2, 3, 4, 9, 33, 52, 54, 58, 67, 70, 74, 97 | Reference |
| `research/hundred-days-reference/03-data-model-and-content.md` §4, §7 | Overview, R2, R5 | Rules 51, 53, 57; 191 dangling gates; 97 % simple expressions | Reference (P0.3.9c) |
| `research/magic-research-2-reference/03-engine-and-content-model.md` §3, §11 | Overview | Rule 95 (content as code can't be validated); rule 96 narrowed | Reference (v1.5.5 src) |
| `docs/engine-reference/web/breaking-changes.md` | R8.2 | TypeScript 7 has no programmatic compiler API | Pinned 2026-11-19 |

## Acceptance Criteria

**Test kinds:**
- **[unit]**: `bun test`, no DOM. The text check's authoritative build tier (R4.6) runs in
  `bun run build` under the one runtime that ADR 3 pins. Unit tests select a tier with the loader
  option `tier: 'build' | 'runtime'` (default `runtime`, R8.1) and name the tier in each case
  that depends on it.
- **[integration]**: the loader together with another system.
- **[build]**: `bun run build` and the production bundle.

**Case rows.** An AC that lists cases "one at a time" is a parameterised test: each case is its
own test with its own name and its own pass or fail. A listed case is never a bullet of one
combined assertion.

**Base fixture** (tests pass a modified schema where a case needs one, R8.2):
- **Names:** every record has a unique `name` (R2.2): `raw_ore` "Raw ore", `charcoal`
  "Charcoal", `ash_root` "Ash-root", `iron_seed` "Iron seed", `jade_seed` "Jade seed", `ash_seed`
  "Ash seed", `ember` "Ember", `frost` "Frost", `smelt_ore` "Smelt ore", `deep_vein` "Deep vein",
  `gate_ward` "Gate ward", `ward_two` "Ward two", `east_door` "East door", `west_door` "West
  door", `first_realm` "First realm", `fight_cave` "Fight cave", `ember_breath` "Ember breath",
  `still_water` "Still water".
- **Commit text:** `ember_breath` "Breathe in the forge's heat."; `still_water` "Draw the still
  water in."
- **Resources:** `raw_ore` and `ash_root`, cap 10; `charcoal`, **cap 6** (a different cap, so a
  bound that is hard-coded to one value fails a case). No resource authors `start`; AC-R8-6
  sets `raw_ore.start` 1.
- **Ingredients:** `iron_seed`, `jade_seed`, `ash_seed`. Each has `contrib` over both affinities:
  `iron_seed` `{ember: 5, frost: 0}`, `jade_seed` `{ember: 0, frost: 4}`, `ash_seed`
  `{ember: 3, frost: 3}`.
- **Affinities:** `ember` and `frost`.
- **Methods:** `ember_breath` and `still_water`. Patch entries use the R6.1 shape (`op` is the
  string `set` or `add`).
  - `ember_breath` has three patches: `iron_seed.contrib` key `ember` (`add` 2),
    `smelt_ore.duration` (`set` 800) and `deep_vein.enabled` (`set` 1).
  - `still_water` has four patches: `iron_seed.contrib` key `ember` (`set` 0),
    `jade_seed.contrib` key `frost` (`add` 1), `smelt_ore.duration` (`set` 1200) and
    `smelt_ore.enabled` (`set` 0).
- **Sources:**
  - `smelt_ore`, with reveal `[reached(raw_ore, 1)]`, need `[reached(charcoal, 2)]`, inputs
    `{raw_ore: 2}`, outputs `{ash_root: 1}` and duration 1000;
  - `deep_vein`, authored `enabled: false`, with reveal `[reached(ash_root, 1)]`, inputs
    `{charcoal: 1}`, outputs `{raw_ore: 1}` and duration 1000;
  - `fight_cave`, with a two-atom reveal `[reached(raw_ore, 1), reached(charcoal, 1)]`, inputs
    `{charcoal: 1}`, outputs `{raw_ore: 1}`, duration 1000 and fights `[gate_ward, ward_two]`.
- **Defaults the fixture leaves absent** (so the loader fills them): `enabled` on `smelt_ore` and
  `fight_cave`; `fights` on `smelt_ore` and `deep_vein`; `start` on every resource. `patches`,
  `inputs` and `outputs` are always authored.
- The fixture is built for loader, patch and state tests. Its sources do not form a reachable
  economy, so the reachability checks of R8.4 have their own fixture in #12. AC-R8-8 asserts
  only the R8.4 method-patch check.
- Both methods patch at least one `contrib` value and one `enabled` value, so the fixture meets
  the method-patch bullet of R8.4. It does not meet the bullet that every ingredient changes a
  seal under some method (no method patches `ash_seed`), and no AC here tests that bullet. A test
  that needs a method failing the method-patch bullet builds it from this fixture by deleting the
  relevant patch entries.
- **Combatants:** `gate_ward`, with stats `{stat_a: 3, stat_b: 4}`, and `ward_two`, with
  `{stat_a: 5, stat_b: 2}` (the schema module's placeholder stat names until #5 closes the
  list).
- **Doors:** `east_door`, with opponent `gate_ward` and thresholds `[10, 20]`; `west_door`, with
  opponent `ward_two` and thresholds `[10, 20]`.
- **Realm:** `first_realm`, with the three ingredients, makeupSize 2 and doors
  `[east_door, west_door]`.
- **Extra records** (added only where an AC names them; each is a valid record of its type):
  - `seed_a` … `seed_l`: twelve extra ingredients, each with `contrib {ember: 0, frost: 0}`,
    named in order "Seed alpha", "Seed beta", "Seed gamma", "Seed delta", "Seed epsilon", "Seed
    zeta", "Seed eta", "Seed theta", "Seed iota", "Seed kappa", "Seed lambda", "Seed mu"
    (no digits, all unique);
  - `north_door`, `south_door`, `upper_door`, `lower_door`, `outer_door`: five extra doors, each
    with opponent `gate_ward`, thresholds `[10, 20]` and names "North door", "South door",
    "Upper door", "Lower door", "Outer door". With `east_door` and `west_door`, the first four
    make six doors and all five make seven;
  - `bare`, a source with only `id`, `type`, `name` "Bare" and `duration` 1000, and `bare_way`, a
    method with only `id`, `type`, `name` "Bare way" and `commitText` "Wait." (every defaulted
    field absent).
- **Test API** (the names ADR 3 and ADR 2 may rename, but the shape holds; R8.1 is the contract):
  - `load(raw, {schema?, tier?, ops?, applyMethod?})` returns `{checked, frozen, registry,
    fingerprint}` and throws a `LoadError` (R8.1). `raw` is the array of records.
  - `applyMethod(checked, method)` and `changed(method)` are the pure functions of R6 and F8.
  - `atomMet`, `gateMet`, `shortfall`, `recordState`, `needText` and `closesLines` have the
    signatures of R8.1 and take a plain `state` (`{marks, held, committed, forged}`) and, where
    named, `content`, so the unit ACs below need no other system.
  - `registry.rowsFor(modifier)` returns the rows open to that modifier.

**"Load error"** means `load` throws a `LoadError`, no content is returned, and the error names
what R8.1 says it names. For an ordinary error that is the record id and field. For a schema error
(a row, not a record: AC-R4-1, AC-R4-3) it is the row as `type.field` with `step: 0`. For a patch
error it is the method, and the patch's target record, field and (on a map field) key. A case that
names a step asserts the `step` field too.

### R1 Record types
- **AC-R1-1** [unit] **GIVEN** the fixture plus `{id: "forge_room", type: "station"}`, **WHEN**
  it is loaded, **THEN** a load error names `forge_room`, `type`.
- **AC-R1-2** [unit] **GIVEN** `iron_seed` with an extra field `weight: 2`, or `east_door` with
  a `reveal`, **WHEN** it is loaded, **THEN** a load error names that record and field.
- **AC-R1-3** [unit] **GIVEN** `smelt_ore` without `enabled`, **WHEN** it is loaded, **THEN**
  its checked `enabled` is true and its fingerprint equals that of the same content with an
  explicit `enabled: true`. **GIVEN** `smelt_ore` without `duration`, **THEN** load error.

- **AC-R1-4** [unit] **GIVEN**, one at a time, the fixture with a required field removed
  (`iron_seed.name`, `iron_seed.contrib`, `smelt_ore.duration`, `gate_ward.stats`,
  `east_door.opponent`, `east_door.thresholds`, `first_realm.makeupSize`,
  `still_water.commitText`, `raw_ore.cap`), **WHEN** loaded, **THEN** load error at step 2 naming
  that record and field. **GIVEN**, one at a time, `bare` with `enabled: true`, `inputs: {}`,
  `outputs: {}` or `fights: []` written out, `bare_way` with `patches: []`, or `charcoal` with
  `start: 0`, **THEN** the fingerprint equals that of the same content with the field absent.
### R2 Identity
- **AC-R2-1** [unit] **GIVEN**, one at a time, a record id of `con`, `com9`, `constructor`,
  `none`, `source`, `reached`, `Ore`, `9ore`, `ore-1`, or 33 characters, **WHEN** it is loaded,
  **THEN** load error. A 32-character id loads.
- **AC-R2-2** [unit] **GIVEN** a resource `ember` beside the affinity `ember`, **WHEN** loaded,
  **THEN** a load error names the duplicate id.
- **AC-R2-3** [unit] **GIVEN** the schema module's reserved-id list, **WHEN** a test loads one
  record per entry (parameterised: the Windows device names, `constructor`, `prototype`,
  `none`, `true`, `false`, `null`, every R1 type name, `reached`, `committed`, `forged`),
  **THEN** each is a load error naming the id. The test fails if the list lacks any R2.1
  category. A separate case loads `__proto__`, which fails the format check (step 1), not the
  reserved list.
- **AC-R2-4** [integration] **[blocked: #11]** **GIVEN** an alias map with a chain, a cycle, a
  target that is missing or of another type, or a source that is a live id, **WHEN** loaded,
  **THEN** load error.

- **AC-R2-5** [unit] **GIVEN** `ash_root` renamed "Ash seed" (the name of `ash_seed`), **WHEN**
  loaded, **THEN** a load error at step 9 names `ash_seed` (the later record in id order) and
  `name`. The same rename of a resource to a name already used by a method fails the same way.
### R3 References
- **AC-R3-1** [unit] **GIVEN** `smelt_ore.inputs` keyed `ghost_ore`, or `east_door.opponent:
  raw_ore` (the wrong type), **WHEN** loaded, **THEN** a load error names the record and field.
- **AC-R3-2** [unit] **GIVEN** the fixture's records in reverse order, and in one fixed
  permutation where `east_door` precedes `gate_ward` and `first_realm` precedes every
  ingredient, **WHEN** loaded, **THEN** each loads with the same fingerprint as the original
  order.
- **AC-R3-3** [unit] **GIVEN** sources `a_to_b` (raw_ore → charcoal) and `b_to_a` (the
  reverse), **WHEN** loaded, **THEN** there is no load error.

### R4 Field registry
- **AC-R4-1** [unit]
  - **GIVEN** the shipped registry, **WHEN** it is read, **THEN** no `sealInput: yes` row lists
    `tending`.
  - **GIVEN** a test registry that opens `combatant.stats` to tending, **WHEN** it is loaded,
    **THEN** a load error names that row.
- **AC-R4-2** [unit] **GIVEN** the shipped registry, **WHEN** `registry.rowsFor('tending')` is
  called, **THEN** it returns exactly `source.outputs` and `source.duration`, and none has `sealInput: yes`.
  Tending (#10) consumes this call; its own ACs live in its GDD.
- **AC-R4-3** [unit] **GIVEN**, one at a time, a test schema with: a field that has no row; a row
  with no owner, or an owner not in `owners`; a Range cell that is not an R4.7 form; a bare
  interval on a map kind; a form that does not fit its row's kind; a note marker with no note; a
  note nothing references; a declared product pair with a side that is neither `{row}` nor
  `{const}`, **WHEN** loaded, **THEN** load error with `step: 0`, naming the row as `type.field`
  (or the field, for a field with no row).
- **AC-R4-4** [unit]
  - **GIVEN**, at either tier, a `name` of 24 code points in NFC, **WHEN** loaded, **THEN** it
    loads. At 25 code points, load error. A `name` of 24 astral characters (48 UTF-16 units)
    loads; 25 fail.
  - **GIVEN**, at tier `build`, a `desc` that contains `3`, `３`, `٣`, `²` or `½`, is empty, is
    `" x"`, ends in U+00A0, or holds LF or U+2028, **THEN** load error (step 9).
  - "three bowls" loads.
- **AC-R4-5** [unit] **GIVEN**, at tier `build`, a `name` authored in NFD (`e` + U+0301), **WHEN** loaded,
  **THEN** load error. The same name in NFC loads.
- **AC-R4-6** [unit] **GIVEN**, one at a time, any of the following, **WHEN** loaded, **THEN**
  load error:
  - `duration` 0 or 86,400,001;
  - an `outputs` value of 0;
  - `start` 11;
  - thresholds `[20, 20]`;
  - a duplicate in `realm.ingredients`;
  - makeupSize 1 or 3.

  Durations 1 and 86,400,000 load.

- **AC-R4-7** [unit]
  - **GIVEN** `iron_seed.contrib` without the `ember` key, **WHEN** loaded, **THEN** load error.
  - **GIVEN** `iron_seed.contrib` of `{ember: 1, frost: 0}`, **THEN** it loads. (It is not
    `{ember: 0, frost: 0}`: `still_water` sets `ember` to 0, which would then change nothing, a
    load error under F8.)
  - **GIVEN** a `still_water` patch setting `iron_seed.contrib.ember` from 5 to 0, **THEN** it
    loads, and F8's change set contains the triple `(iron_seed, contrib, ember)`.
- **AC-R4-8** [unit] **GIVEN**, at tier `build`, a `name` of "Nine-Turn Furnace", **WHEN**
  loaded, **THEN** it loads. "9-Turn Furnace" is a load error.
- **AC-R4-9** [unit] **GIVEN** tier `runtime`, **WHEN** a `name` has a lone surrogate, a leading
  U+FEFF, a `3`, or a trailing space, **THEN** load error; a `name` holding `٣` (Arabic-Indic
  three) or `²` loads. **GIVEN** tier `build`, those same `٣` and `²` names are a load error, so a
  character the build tier classes as a digit never ships.
- **AC-R4-10** [unit] **GIVEN**, one case per line, each of these, **WHEN** loaded, **THEN** load
  error at the step shown (and the valid neighbour loads):
  - `first_realm.doors` `[east_door, east_door]` (step 6); `east_door.thresholds` `[20, 10]`
    (step 6);
  - `iron_seed.contrib` with an extra key `charcoal`, a resource (step 5, `all keys of type
    affinity`); with an extra key `ghost` that names no record (step 5);
  - no affinity records, with every ingredient's `contrib` set to `{}` (step 6, naming
    `ash_seed`, the first ingredient in id order, and `contrib`);
  - `makeupSize` with three ingredients: 2 loads; 1 and 3 fail (step 6). With five ingredients
    (the three plus `seed_a` and `seed_b`, each also a record): 2 and 4 load, 5 fails (step 6);
  - `first_realm.ingredients` of the three plus `seed_a` … `seed_i` (12 entries, each a record):
    loads. Plus `seed_j` (13 entries): fails at step 3 with `makeupSize` staying 2;
  - `desc` of 80 code points loads and 81 fails; `flavor` 140 and 141; `commitText` 200 and 201
    (step 9).
- **AC-R4-11** [unit] **GIVEN**, one at a time, a `source.enabled` patch with `add`, or with a
  `set` operand of 2 or −1, **WHEN** loaded, **THEN** load error at step 7 naming the method,
  record and field.
- **AC-R4-12** [unit] **GIVEN** the shipped schema, **WHEN**, for each line of this table, the
  named field is set to each listed value on the fixture (with the companion edit, if any),
  **THEN** the "loads" values load and the "fails" values are a load error naming that record
  and field. Each line is one case.

  | Row | Record and field | Loads | Fails | Companion edit |
  |---|---|---|---|---|
  | `resource.cap` | `raw_ore.cap` | 1; 1,000,000,000 | 0; 1,000,000,001 | none |
  | `resource.start` | `charcoal.start` | 0; 6 | −1; 7 | none |
  | `resource.start`, upper end | `charcoal.start` | 1,000,000,000 | 1,000,000,001 | `charcoal.cap` 1,000,000,000 |
  | `ingredient.contrib` | `jade_seed.contrib.ember` | −1,000,000; 1,000,000 | −1,000,001; 1,000,001 | none |
  | `source.inputs` | `deep_vein.inputs.charcoal` | 1; 1,000,000,000 | 0; 1,000,000,001 | none |
  | `source.outputs` | `deep_vein.outputs.raw_ore` | 1; 1,000,000,000 | 0; 1,000,000,001 | none |
  | `source.duration` | `deep_vein.duration` | 1; 86,400,000 | 0; 86,400,001 | none |
  | `source.fights` | `fight_cave.fights` | `[]`; three entries `[gate_ward, ward_two, gate_ward]` | four entries | none |
  | `combatant.stats` | `gate_ward.stats.stat_a` | 0; 1,000,000 | −1; 1,000,001 | none |
  | `door.thresholds` | `east_door.thresholds` | `[0, 1]`; `[999999, 1000000]` | `[−1, 1]`; `[999999, 1000001]`; `[10]`; `[10, 20, 30]` | none |
  | `realm.doors` | `first_realm.doors` | `[east_door]`; six doors (the first four extra doors) | `[]`; seven doors (all five) | the extra door records |

  The text limits and the realm's ingredient count are covered by AC-R4-4 and AC-R4-10.
- **AC-R4-13** [unit] **GIVEN** a method with `redoCost` absent, 0 or 1,000,000,000, **WHEN**
  loaded, **THEN** it loads. At −1 or 1,000,000,001, or a non-integer, load error. A patch on
  `redoCost` is a load error (its row has no `method`).

- **AC-R4-14** [unit] **GIVEN**, at tier `build`, one at a time, a `desc` holding CR, NEL
  (U+0085), VT (U+000B), FF (U+000C), tab, U+2029 or an embedded U+FEFF; a `desc` that begins or
  ends with each character of the fixed space list; or `Ⅻ` (category Nl), **WHEN** loaded,
  **THEN** load error (step 9). **GIVEN** tier `runtime`, `Ⅻ` and a `name` in NFD (`e` + U+0301)
  load, and the other cases above are still load errors.
- **AC-R4-15** [unit] **GIVEN**, one at a time, `gate_ward.stats` with a key outside the stat-name
  list (`stat_c`), with `stat_b` missing, or with `stat_a` set to `"3"`, **WHEN** loaded, **THEN**
  load error naming `gate_ward` and `stats` (steps 3 and 2).
### R5 Gates
- **AC-R5-1** [unit] **GIVEN**, one at a time, a `smelt_ore.need` of the following, **WHEN**
  loaded, **THEN** load error at the step shown:
  - `[]` (step 3);
  - `[{"atom":"committed","id":"ember_breath"}]`, `[{"atom":"lacks","id":"raw_ore"}]`,
    `[{"atom":"reached","id":"raw_ore","n":0}]` or `n: −1` (step 4);
  - `[{"atom":"reached","id":"ember","n":1}]` (an affinity) or `[{"atom":"forged","id":"raw_ore"}]`
    (a resource) (step 5);
  - `reached(raw_ore, 1)` and `reached(raw_ore, 3)` in one gate, or two `{"atom":"committed"}`
    atoms (step 6).
- **AC-R5-2** [unit] **GIVEN** an added `smelt_ore.reveal` atom of `reached(raw_ore, 11)`,
  `reached(charcoal, 7)` or `reached(iron_seed, 2)`, **WHEN** loaded, **THEN** load error at
  step 6. `reached(raw_ore, 10)`, `reached(raw_ore, 7)`, `reached(charcoal, 6)` and
  `reached(iron_seed, 1)` load. (Charcoal's cap is 6 and raw ore's 10, so a bound hard-coded to
  one value fails a case.)
- **AC-R5-3** [unit] **GIVEN** `smelt_ore` revealed at a `raw_ore` mark of 1, **WHEN** held
  `raw_ore` falls to 0, **THEN** it stays revealed.
- **AC-R5-4** [unit] **GIVEN** a need of `[reached(charcoal, 2), forged(first_realm)]`,
  `ember_breath` committed, a charcoal mark of 1 and 0 held, **WHEN** need text is built, **THEN** it has exactly two lines
  in this order: "Needs Charcoal ×2 (2 more)", then "Needs the First realm forged".
- **AC-R5-5** [unit] **GIVEN** the fixture, **WHEN** each method's frozen set is built, **THEN**
  every source's `reveal` and `need` in that set deep-equals the raw content's (a patch can't
  touch a gate, so gates never read content numbers).
- **AC-R5-6** [unit]
  - **GIVEN** a need of `[committed()]` and no commit, **WHEN** need text is built, **THEN** it
    is exactly one line, "Needs a method committed".
  - **GIVEN** a gate atom `{"atom":"committed","id":"x"}`, or `{"atom":"reached","id":"raw_ore"}`
    with no `n`, or an unknown extra key, **WHEN** loaded, **THEN** load error (R5.7).

- **AC-R5-7** [unit] **GIVEN** `smelt_ore` (need `[reached(charcoal, 2)]`):
  - no commit and a charcoal mark of 2 (the need is met), **WHEN** `needText` is built, **THEN**
    it is exactly one line, "Needs a method committed";
  - no commit, a charcoal mark of 1 and 0 held, **THEN** two lines in this order: "Needs a method
    committed", "Needs Charcoal ×2 (2 more)";
  - `still_water` committed and the same marks, **THEN** one line, "Needs Charcoal ×2 (2 more)".
- **AC-R5-8** [unit]
  - **GIVEN** `forged(first_realm)`, **WHEN** `state.forged` is `[]`, **THEN** `atomMet` is false;
    with `['first_realm']` it is true.
  - **GIVEN** a `smelt_ore.reveal` of `[committed()]` and `need` of `[reached(charcoal, 2)]`,
    a charcoal mark of 0 and no commit, **THEN** `recordState` is hidden. **WHEN**
    `ember_breath` is committed, **THEN** it is waiting in one step; **WHEN** `still_water` is
    committed instead, **THEN** it is withdrawn in one step (F7).
### R6 Method patches
- **AC-R6-1** [unit] **GIVEN**, one at a time, a patch on `raw_ore.cap`, on `smelt_ore.fights`,
  on a missing record `ghost`, two patches on `smelt_ore.duration` in one method, two patches on
  `iron_seed.contrib` key `ember` in one method, a `key` on `smelt_ore.duration`, a missing `key`
  on `iron_seed.contrib`, or a `key` the map lacks (`earth`), **WHEN** loaded, **THEN** a load error names
  the method, record and field.
- **AC-R6-2** [unit] **GIVEN** checked content, **WHEN** `applyMethod` runs twice with
  `ember_breath`, **THEN** the two outputs are deep-equal, and the input deep-equals a copy
  taken before the call.
- **AC-R6-3** [unit] **GIVEN** a patch whose result sets `smelt_ore.duration` to 0, **WHEN**
  loaded, **THEN** a load error names the method, `smelt_ore` and `duration` (not a clamp).
- **AC-R6-4** [unit] **GIVEN** a patch whose `key` is `charcoal` on `smelt_ore.outputs` (a key
  the map lacks), or an `add` of −2 to `smelt_ore.inputs` key `raw_ore` (result 0, outside the
  row's range), **WHEN** loaded, **THEN** load error naming the method, record and field.
- **AC-R6-5** [unit] **GIVEN** one method with `add 1` patches on `iron_seed.contrib` keys `ember` and
  `frost`, **WHEN** loaded, **THEN** it loads and `changed` holds both triples.
- **AC-R6-6** [unit] **GIVEN** `smelt_ore.duration` (1000), **WHEN** `set` 800 and `add` 200 are
  applied, **THEN** they give 800 and 1200. Each of these is a load error: an unknown `op`; a
  `set` of 1000 (no change); an operand of 2⁵³; `add` on `smelt_ore.enabled`; `set` 1 on an
  `enabled` that is already true.
- **AC-R6-7** [unit] **GIVEN** `still_water` setting `smelt_ore.enabled` to 0 (`smelt_ore` has no
  fights), **WHEN** loaded, **THEN** it loads: the loader does not judge pillar 4's two-source
  rule, the Validator does (concept mechanic 2, amended 2026-11-20).

- **AC-R6-8** [unit] **GIVEN**, one at a time, a patch on `smelt_ore.id`, `smelt_ore.type`,
  `smelt_ore.name`, `smelt_ore.reveal` or `smelt_ore.need`, **WHEN** loaded, **THEN** load error
  naming the method, record and field. A patch whose operand is a safe integer but whose result
  is not (`add` 2⁵³−1 to `smelt_ore.duration`) is a load error naming the same three, before
  the row's range is checked.

- **AC-R6-9** [unit] **GIVEN**, one at a time, a patch entry on `ember_breath` that lacks
  `target` (step 3); lacks `op`, `operand` or `field`, has an extra key `note`, has an `op` that
  is a number, has an operand of `1.5`, `"1"` or `NaN`, or names a field its target's type does
  not carry (`iron_seed.duration`) (step 7), **WHEN** loaded, **THEN** load error at the step
  shown naming the method. **GIVEN** a method whose `patches` is `[]`, **THEN** it loads and its
  frozen set deep-equals `checked` (the Validator, not the loader, rejects it).

- **AC-R6-10** [unit] (amendment A1) **GIVEN** a test ops table with an op whose
  `operandRange` is 0–100, **WHEN** a patch uses it with operand 101 or −1, **THEN** load error
  at step 7 naming the method, record and field, before the op result is computed; operand 100
  loads (if the result differs from the input).
### R7 Values and text
- **AC-R7-1** [unit] **GIVEN** `smelt_ore.duration` as `1.5`, `"1000"`, `"10%"`, `NaN`,
  `Infinity` or `-0`, **WHEN** loaded, **THEN** load error. **GIVEN** a test schema with a field
  ranged ±(2⁵³−1), **THEN** 2⁵³−1 loads and 2⁵³ is a load error.
- **AC-R7-2** [unit] **GIVEN**, at tier `build`, `still_water` without `commitText`, or with a digit in it,
  **WHEN** loaded, **THEN** load error.
- **AC-R7-3** [unit] **GIVEN** each method of the fixture, **WHEN** `closesLines(method, checked)`
  is called, **THEN** it returns exactly these lines in this order. `ember_breath`: "Opens: Deep
  vein", "Changes: Iron seed: Ember", "Changes: Smelt ore: Time". `still_water`: "Changes: Iron
  seed: Ember", "Changes: Jade seed: Frost", "Changes: Smelt ore: Time", "Closes: Smelt ore".
- **AC-R7-4** [integration] **[blocked: #7, #13]** **GIVEN** each method, **WHEN** the commit
  dialog is built, **THEN** it shows the lines of AC-R7-3 and, when the method has no
  `redoCost`, the line "Redo: only by starting a new run" (A5), never text from `commitText`.
  When `redoCost` is present the line states the price from that field, in #7's template (Y2).
- **AC-U-1** [integration] **[blocked: #14, #15]** **GIVEN** the method-choice view, **WHEN** a
  method's change set holds an `add` 2 and a `set` 4 on `ingredient.contrib`, **THEN** the view
  shows the delta for the `add`, shows "changed" with no number for the `set`, and no
  absolute `contrib` value appears anywhere in it.

### R8 Loading and checks
- **AC-R8-1** [unit] **GIVEN** the pinned build runtime with `typeof window` and `typeof
  document` both `'undefined'`, **WHEN** the fixture is passed as plain objects, **THEN** it
  loads.
- **AC-R8-2a** [unit] **[blocked: ADR 2]** **GIVEN** the schema module, read as data, **THEN** it
  lists exactly: the eight R1 types and their fields; the registry rows; the three atoms; the R4.7
  form table with each form's step, including the named checks (`≤ <field>`, `2..M−1`,
  `all keys of type`, `distinct`, `strictly ascending`) and the `n ≤ cap` atom rule; the ordered
  `rows[]` with per-cell notes; the `owners` list; the R6.1 ops table (`set` and `add`, each
  `{fn, noOpCheck: true, operandRange}` with the whole safe range, plus the ops #2 adds); the
  reserved-id list
  with all four R2.1 categories; the label table (R7.2); the placeholder stat names; and the
  declared product-pair list (empty until #2 and #4 declare pairs).
- **AC-R8-2b** [unit] **[blocked: ADR 2]** **GIVEN** the schema module and its generator,
  **WHEN** the registry table is regenerated, **THEN** the text between the `registry:begin` and
  `registry:end` markers in this GDD is reproduced exactly (R4.8). **WHEN** one range, one
  `modifiableBy` entry and one note marker in the module are changed, **THEN** the diff test
  fails for each.
- **AC-R8-3** [build] **[blocked: ADR 1, ADR 3, shipped content]** **GIVEN** a temp copy of the
  shipped content in which the source with the lowest id (UTF-16 order) has `duration: 0`,
  **WHEN** `bun run build` and `bun test shipped-content.test.ts` are each run with the
  content-directory parameter (ADR 3) pointing at that copy, **THEN** each exits non-zero and
  its stderr names that id and `duration`. With the parameter pointing at the original content,
  both exit 0.
- **AC-R8-4** [build] **[blocked: OQ 8]** **GIVEN** the shipped content, **WHEN** it is loaded in
  the pinned build runtime and in the production bundle in Chromium and Firefox, **THEN** the
  fingerprints are identical and the canonical texts of the frozen sets, written by the R8.5
  serializer, are byte-equal. In the build runtime the build-tier Unicode check (R4.6) has run;
  the browsers run only the runtime tier.
- **AC-R8-5** [unit] **GIVEN** the fixture, **WHEN** `smelt_ore.duration` changes from 1000 to
  1001, **THEN** the fingerprint changes.
- **AC-R8-6** [unit] **GIVEN** the fixture with `raw_ore.start` 1, **WHEN** loaded, **THEN**
  there is no load error, and the loader returns `{checked, frozen, registry, fingerprint}` with
  one frozen set per method. `checked` deep-equals the input plus exactly these defaults: `enabled: true` on `smelt_ore` and
  `fight_cave`, `fights: []` on `smelt_ore` and `deep_vein`, and `start: 0` on `charcoal` and
  `ash_root` (`raw_ore.start` stays 1). The caller's input deep-equals a copy taken before the
  call and is not frozen (R8.1).
- **AC-R8-7** [integration] **[blocked: #11, #13, OQ 8]** **GIVEN** a production bundle that the
  test harness builds directly with the bundler from content holding a load error (the build
  script's own check would refuse it) and an existing save in storage, **WHEN** the game starts,
  **THEN** no `advance` call is made, one element with `role="alert"` contains the record id and
  field, and the stored save bytes are unchanged.
- **AC-R8-8** [integration] **[blocked: #12, ADR 8]** **GIVEN** the fixture with each method's
  `contrib` and `enabled` patches deleted so only `smelt_ore.duration` is patched, **WHEN** the
  Validator's R8.4 method-patch check runs, **THEN** it reports both methods. For a method that
  also patches one `contrib` value and one `enabled` value, it reports nothing for that method.
  The rest of the Validator's checks need #12's own fixture.
- **AC-R8-9** [unit] **GIVEN** the fixture (two doors, a two-fight source and a two-atom gate
  are in it for this), **WHEN** it is changed as follows, **THEN** the fingerprint:
  - is **unchanged** by spelling `smelt_ore.enabled` explicitly as true, by listing
    `realm.ingredients` in another order, and by reordering `still_water`'s `patches`;
  - **changes** on reordering `realm.doors`, `fight_cave.fights`, or the atoms of
    `fight_cave.reveal` (`door.thresholds` is strictly ascending, so its order is fixed by its
    values);
  - **changes** when `schemaVersion` is raised by 1.
  A pinned golden fingerprint for the fixture is added when ADR 6 fixes the algorithm.
- **AC-R8-10** [unit] **GIVEN** content in which an earlier record `a_rec` has a bad reference
  (step 5) and a later record `b_rec` has an unknown field (step 2), **WHEN** loaded, **THEN**
  the error is `b_rec`'s unknown field (step-major order), and it is the same on every run.
  **GIVEN** records `a_b` and `ab`, both with a bad reference, **THEN** the error names `a_b`
  (UTF-16 order: `_` sorts before `b`). **GIVEN** `smelt_ore` with `inputs {ghost: 1}` and
  `outputs {ghost_two: 1}`, **THEN** the error names `inputs` (registry order puts `inputs`
  before `outputs`).
- **AC-R8-11** [unit] **GIVEN** `ember_breath` with an added patch `smelt_ore.enabled` `set 1`
  and `smelt_ore` with `enabled` absent, **WHEN** loaded, **THEN** load error naming
  `ember_breath`, `smelt_ore` and `enabled` (the filled default is already true, so the patch
  changes nothing; R8.3 step 2 then step 7).
- **AC-R8-12** [unit] **GIVEN** each method of the fixture, **WHEN** `applyMethod` runs, **THEN**
  the diff between input and output equals `changed(m)` exactly.
- **AC-R8-13** [unit] **GIVEN** a double passed as `opts.applyMethod` that returns the real
  output but, for `ember_breath`, also changes `smelt_ore.inputs.raw_ore` from 2 to 3, **WHEN**
  loaded, **THEN** load error with `step: 'output'`, method `ember_breath`, record `smelt_ore`,
  field `inputs`, key `raw_ore` and the cause "after patch". A double that mutates its input
  instead gives a patch error with the cause "applyMethod changed its input".
- **AC-R8-14** [unit] **GIVEN**, one at a time, `smelt_ore.reveal` of `"x"`, `[null]`,
  `[{"atom":"reached","id":"raw_ore","n":"3"}]` and `[{"atom":"reached","id":"ghost","n":3}]`,
  **WHEN** loaded, **THEN** each is a load error naming `smelt_ore` and `reveal`, and no other
  exception is thrown. The first two fail at step 3, the third at step 4, the fourth at step 5.
- **AC-R8-15** [unit] **GIVEN** a method whose patch list is: entry 0 `smelt_ore.duration` with
  `key: "x"` (a key on a scalar field), entries 1 and 2 both `smelt_ore.duration` `set 900`,
  **WHEN** loaded, **THEN** the error has `entry` 0. With entry 0 removed (so the duplicates are
  now entries 0 and 1), it has `entry` 1, because a duplicate is reported on the later entry.
- **AC-R8-16** [unit] **GIVEN** a test schema whose `sealInput: yes` row lists `tending`, and
  content that also has an unknown field (step 2), **WHEN** loaded, **THEN** the error names the
  schema row as `type.field` with step 0, not the content error.
- **AC-R8-17** [integration] **[blocked: #12, #6]** **GIVEN**, in #12's own reachable fixture, a
  method that disables an ingredient's only fightless source while two fight sources remain, one
  that leaves the ingredient with one enabled source, and one that leaves a fightless source
  outside the price ceiling, **WHEN** the Validator runs, **THEN** each is a validator error
  naming the method and the ingredient (R8.4 checks 1, 2 and 3). A method that disables a recipe
  while another fightless source stays within the ceiling passes.
- **AC-R8-18** [unit] **GIVEN**, one at a time, a `raw` holding `null`, `"x"`, `[]`, a record
  whose `id` is `["a"]` or `5`, a record whose `type` is `"constructor"` or `5`, or (step 3) a
  patch entry whose `target` is `5` or `["smelt_ore"]`, **WHEN** loaded, **THEN** the error is a
  `LoadError` at the step shown (step 1 for the first five groups) and no other exception is
  thrown; where no string `id` exists the error's `record` is `#<index>`.
- **AC-R8-19** [unit] **GIVEN**, one at a time, a field value of `undefined`, a sparse array in a
  gate, a `Map`, a class instance, an object with an accessor, an object with a symbol key, or a
  cycle, **WHEN** loaded, **THEN** a step 1 `LoadError`. **GIVEN** a record built with
  `JSON.parse('{"__proto__": 1}')` as a top-level field, **THEN** step 2 (unknown field); as
  the keys of `smelt_ore.inputs`, **THEN** step 3. After each failure the caller's input
  deep-equals a copy taken before the call and is not frozen.
- **AC-R8-20** [unit] **GIVEN**, one at a time, `smelt_ore.inputs` `5`; `fight_cave.fights`
  `"x"`; `still_water.patches` `{}`; `east_door.thresholds` `"a"`; `smelt_ore.duration` `{}`;
  `smelt_ore.enabled` `"yes"`; `smelt_ore.name` `5`; `iron_seed.contrib` `[]`; `first_realm.doors`
  `5`, **WHEN** loaded, **THEN** a `LoadError` at step 3 naming the record and field, and no other
  exception.
- **AC-R8-21** [unit] **GIVEN** `ember_breath` with `key: "x"` on `smelt_ore.duration` and
  `still_water` with `smelt_ore.duration` `set 0`, **WHEN** loaded, **THEN** the error names
  `ember_breath` (method-id order). With `ember_breath`'s patch repaired, it names
  `still_water`.
- **AC-R8-22** [unit] **GIVEN** the fixture with the keys of `smelt_ore.inputs` and of one `contrib`
  map written in the other order, **THEN** the fingerprint is unchanged. **GIVEN** a load,
  **THEN**, for every record a method does not patch, `frozen[m][id] === checked[id]` (identity).
- **AC-LOAD-1** [build] **[blocked: shipped content, ADR 9]** **GIVEN** the shipped content,
  **WHEN** `bun run perf` loads and checks it 50 times in the build runtime, **THEN** the median
  is at most 20 ms (provisional, Game Feel; ADR 9 may replace it once measured).

### States and Transitions
- **AC-S-1** [unit] **GIVEN** a load, **WHEN** a walker visits every object and array reachable
  from `checked` and from every frozen set, **THEN** `Object.isFrozen` is true for each. **WHEN**
  strict-mode code assigns `smelt_ore.duration = 5` or `smelt_ore.outputs.ash_root = 5`, or pushes
  onto a gate list, **THEN** each throws `TypeError` and the value is unchanged.
- **AC-S-2** [unit]
  - **GIVEN** `still_water` committed, **WHEN** `deep_vein` (disabled in its set) has its reveal
    unmet, **THEN** it is hidden; **WHEN** the reveal becomes met after the commit, **THEN** it is
    withdrawn (Hidden → Withdrawn).
  - **GIVEN** `ember_breath` committed (`deep_vein` is enabled in its set, with no `need`),
    **WHEN** the reveal becomes met after the commit, **THEN** it is actionable (Hidden →
    Actionable).
  - **GIVEN** `still_water` committed and `smelt_ore` with reveal and need both met, **THEN** it
    is withdrawn, not actionable.
  - **GIVEN** no commit and `need` met, **THEN** it is waiting.

### Formulas
- **AC-F1** [unit] **[blocked: #2, #3, #4, #11]** (needs the Foundation, the run start and the
  unit order of #4)
  - **GIVEN** a mark of 4 and 4 held, **WHEN** 3 are gathered and then 6 spent, **THEN** the
    mark is 7 after each step.
  - **GIVEN** `raw_ore.start` 2, **WHEN** a run starts, **THEN** its mark is 2 and every
    ingredient's mark is 0.
  - **GIVEN** `raw_ore.start` 8 and a Foundation that lowers the effective cap to 5, **WHEN** a
    run starts, **THEN** the mark is 5 and `reached(raw_ore, 6)` is false.
  - **GIVEN** held 5, cap 10 and a unit with input 4 and output 3 of the same id, **WHEN** it
    completes, **THEN** held is 4 and the mark stays 5. **WHEN** a unit of 1000 ms is run as one
    batched `advance(2000)` and as `advance(1500)` then `advance(500)`, **THEN** every mark (not
    only every held amount) is equal.
  - **GIVEN** any change to `held` (a unit, a forge consumption, a grant), **THEN**
    `held[id] ≤ high_water[id]` for every id afterwards (the F1 postcondition).
- **AC-F2** [unit]
  - **GIVEN** an `ash_root` mark of 2, **WHEN** `reached(ash_root, 3)` is evaluated, **THEN**
    it is false. At a mark of 3 it is true.
  - `committed()` is false before any commit, and true after committing `still_water`.
- **AC-F3** [unit]
  - **GIVEN** an absent gate, **WHEN** it is evaluated, **THEN** true.
  - **GIVEN** `[committed(), reached(ash_root, 3)]`, a commit made and a mark of 2, **THEN**
    false.
- **AC-F4** [unit] **GIVEN** `reached(ash_root, 3)` and a mark of 2:
  - **WHEN** 0 are held, **THEN** the shortfall is 3 (not 1).
  - With 1 held, the shortfall is 2.
  - At a mark of 3, there is no line.
- **AC-F5** [unit] **GIVEN** `div_floor`, **WHEN** called, **THEN**:
  - `(7,2)=3`, `(−7,2)=−4` and `(−8,2)=−4`;
  - `(2⁵³−1,2)=4503599627370495` and `(−(2⁵³−1),2)=−4503599627370496`;
  - `(2⁵³−1, 2⁵³−1) = 1` and `(0, 5)` is `+0` (`Object.is`), as is `(−0, 5)`;
  - `(−(2⁵³−1), 2⁵³−1) = −1`;
  - a divisor of 0 or −1, a non-integer or unsafe dividend (`1.5`, 2⁵³) or a divisor of 2⁵³
    throws a `RangeError`;
  - a property test of at least 1,000,000 random pairs plus the boundary pairs (±(2⁵³−1), 1, 2,
    2⁵³−1 against each other) matches a BigInt oracle.
- **AC-F6** [unit]
  - **GIVEN** `bp_of`, **WHEN** called, **THEN** `(250,1250)=31` and `(−250,1250)=−32`.
  - **GIVEN** a test schema declaring a pair with |x| ≤ 10⁹ and |b| ≤ 9,007,199, **WHEN**
    loaded, **THEN** it loads. With |b| up to 9,007,200, load error.
  - **GIVEN** a test schema declaring the F1 pair (largest `outputs` value 10⁹, most units per
    `advance`), **WHEN** loaded, **THEN** 9,007,199 units load and 9,007,200 is a load error
    (R8.3 step 8; the error has `step: 8`).
- **AC-F7** [unit]
  - **GIVEN** the fixture with `ember_breath` committed, **WHEN** the `raw_ore` mark is 0,
    **THEN** `smelt_ore` is hidden.
  - With marks raw_ore 1 and charcoal 1, it is waiting.
  - With a charcoal mark of 2, it is actionable.
  - With no method committed and marks raw_ore 1 and charcoal 2, it is waiting.
  - **GIVEN** `still_water` committed (`smelt_ore` is disabled in its set) and a `raw_ore` mark
    of 1, **THEN** `smelt_ore` is withdrawn, whatever the charcoal mark.
  - **GIVEN** `still_water` committed (`deep_vein` stays disabled) and an `ash_root` mark of 0,
    **THEN** `deep_vein` is hidden. At a mark of 1, it is withdrawn.
- **AC-F8** [unit]
  - **GIVEN** `ember_breath` with three patches, **WHEN** `changed` is computed, **THEN** it
    returns those three triples, and every other field of the output deep-equals the input.
  - **GIVEN** a patch whose result equals its input, **WHEN** loaded, **THEN** load error.

### Edge cases owned by other systems
- **AC-E-1** [integration] **[blocked: #11]** **GIVEN** a save holding a retired id with an alias,
  one with no alias, and a saved fingerprint that differs from the loaded one, **WHEN** it is
  loaded, **THEN** #11 maps the first, drops the second and logs that it did, and loads the save
  regardless of the fingerprint (Edge Cases, "Saves across content versions").
- **AC-E-2** [integration] **[blocked: #12]** **GIVEN** #12's own fixture, **WHEN** the Validator
  runs each validator rule of Edge Cases once (a `reached` atom above the smallest effective cap;
  `start ≥ n` in a `reveal`, an error, and in a `need`, a warning; `committed()` in a `need`; a
  source disabled in both sets; a source with no inputs and outputs; a method with no patches or
  with identical frozen sets; a patch on a source the same method disables; a `reveal` true at the
  start), **THEN** each reports its listed severity, naming the method and record.
- **AC-E-3** [integration] **[blocked: #2, #3]** **GIVEN** a Foundation or tending stage that
  pushes a value outside its row's range, **WHEN** the pipeline runs, **THEN** it clamps to the
  range (R4.5) and the Validator reports the clamp as a warning.

### Checked by review, not by test
- That `commitText` makes no claim about what the commit closes or what a redo costs (R7.2),
  and that no text makes a quantity claim in words. Numerals as words inside proper names are allowed.
  Checked by `/design-review` and content review.
- Load time: see AC-LOAD-1 above, a [build] criterion with a provisional ceiling.
- Integration criteria marked `[blocked: #n]` run when that system's GDD and code exist.
  Unowned until then: the edge cases under "Saves across content versions" (#11), the
  validator rules in Edge Cases (#12), and "no leak of hidden text before the commit" (#14, #15).
- The basis-point pair check (F6) passes vacuously until the Modifier pipeline (#2) declares
  pairs. AC-F6 uses a test pair until then.

*Specialist: `qa-lead` consulted in every review round. Round one found 17 gaps, each resolved in
R1–R8, F1–F8 or Edge Cases or listed under "Checked by review, not by test". The later rounds'
findings are in `design/gdd/reviews/content-records-and-schema-review-log.md`; the fourth round's
AC rewrites were applied. The fifth round's blockers (loader contract and error shape, R4.7 forms
and steps, gate bounds, bool patch legality, unverified reads, and the fixture and AC defects) were
applied the same day; multi-case ACs are now parameterised case rows (see "Case rows"), and the
splits of multi-bullet ACs (R1-2, R1-3, R4-4, R4-9, R5-6, F1) are still recommended.*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Resolved 2026-11-20 (A3): `resource.cap` stays a seal input. A seal reads the cap from before that forge's own entries, and Reforge (#16) states which cap a reforge's seals read (Resources and caps #3, K8) | Resources and caps (#3) with Forge and proving (#6) | Done; #6 confirms K8.2 |
| 2 | Resolved 2026-11-20 by #6 (G2): ingredients are held 0/1, with no counts, so `INGREDIENT_HELD_MAX` stays 1 | Forge and proving (#6) | Done |
| 3 | Is rest a `source` record, and if so how is it exempt from "does nothing"? | Activity slot (#4) | #4 GDD |
| 4 | Resolved 2026-11-21 by the designer in #11 (D11.2): saves may be wiped until the first public build. Until then a record of another format is refused by name with a new run offered, renames stay free and the alias map stays empty; from the first public build on, ids freeze and format changes migrate | Designer | Done |
| 5 | Decided 2026-11-20: the method-choice view shows both methods' projected added/removed sources by name, ignoring `reveal` for sources the change sets touch (Edge Cases, "Before the commit"). Open: its layout and how it marks removed routes | Forge screen (#15), Method marks (#14) | Their UX specs |
| 6 | How does a post-commit method switch keep `committed()` monotone? | Reforge (#16) | Before the Vertical Slice |
| 7 | Does the realm ladder need a door-tier atom? | Realm ladder (#19) | Alpha |
| 8 | Which browser runner (for Chromium and Firefox) runs AC-R8-4? The package tool is `bun` and `package.json` lists playwright (project rules) | Technical Director | Architecture |
| 9 | Resolved 2026-11-20 by #6 (G9.3, B3, S9): the price holds with deltas shown, because base contributions stay hidden until held and totals clash; B3 checks that the plain-sum pick is never the best | Forge and proving (#6) | Done |
| 10 | Resolved 2026-11-20 by #7 (W9, A5): `redoCost` is milliseconds of slot time, the price of leaving a method; no MVP method carries it, and the redo line names the new run, the MVP's one redo. #16 decides how a switch is paid | Methods (#7), Reforge (#16) | Done |
| 11 | Resolved 2026-11-20 by #7 (Y3, A5): about 23 sources, 20 under each method; no MVP method switches a recipe off. R1's target is now ~23 | Methods (#7), Crafting route (#8), Fight and dungeon routes (#9) | Done |
| 12 | Resolved 2026-11-20 by #6 (G12, S8): a fightless source's price is at most max(2 × p, p + 60 s), where p is the price of the ingredient's cheapest other enabled source, in untended slot time | Forge and proving (#6) | Done |

**ADRs required** (representation decisions this GDD leaves out, per TD finding 8):

1. Content file format and file layout (JSON or another plain-data format).
2. How the runtime schema value is written, and how TypeScript types are derived from it or
   checked against it (no compiler API in TypeScript 7). It also covers the generator that
   writes the registry table in this GDD.
3. The shared loader for the build runtime and the production bundle, how content is bundled,
   and the content-directory parameter that `bun run build` and the shipped-content test both
   read (AC-R8-3). It pins the one runtime and version that runs the build-tier text check
   (`bun`, per `package.json`), and records its ICU and Unicode version.
4. How a patch entry `{target, field, key?, op, operand}` is serialised (`op` is a name), and the
   ops table (each entry `{fn, noOpCheck, operandRange}`, amendment A1; the MVP `set` and `add`
   here; `scale_bp` from #2).
5. The integer helpers (`div_floor`, `bp_of`) and the unit encoding per field.
6. The content fingerprint algorithm and its digest width (the canonical text and the hex
   rendering are pinned in R8.5).
7. The alias map and retired-id list format (with #11).
8. The format of load and validator error reports (record id, field, rule).
9. The performance budget for load and check (Game Feel, AC "Load time").
10. The file encoding of gates (the shape is pinned in R5.7), and the two-tier text check (R4.6).
