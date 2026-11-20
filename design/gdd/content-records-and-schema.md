# Content Records and Schema

> **Status**: In Revision (re-review 2026-11-20 returned NEEDS REVISION with 12 blockers; all addressed the same day, a full re-review is pending)
> **Author**: Will + agents
> **Last Updated**: 2026-11-19
> **Last Verified**: 2026-11-19
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
| `affinity` | 3–4 | A named Foundation stat axis. Text only; it gives stats a name for tooltips, marks and breakdowns | — |
| `method` | 2 | A cultivation method: its commit text and its patches to other records | `commitText`, `patches` |
| `source` | ~20 | One activity the slot can run, per unit: crafting recipes, single fights, dungeon floors, and rest if system 4 authors rest this way | `inputs`, `outputs`, `duration`, `fights`, `enabled` |
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
   gate or reference can never be ambiguous. Rule 53's record-or-tag trap cannot arise, because
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
   - **Two tiers, because engines ship different Unicode versions.** The *build* check runs in
     Node on every build and applies everything below, including the Unicode property checks
     (digits, `White_Space`, NFC). The *runtime* check, in the shipped bundle, applies only
     properties that do not change between Unicode versions: well-formed UTF-16 (no lone
     surrogates), no line break, no U+FEFF, no leading or trailing character from the fixed space
     list (U+0009, U+0020, U+00A0, U+1680, U+2000–U+200A, U+202F, U+205F, U+3000), length, and no
     ASCII digit. A
     character one engine classifies as a digit and another does not is therefore a build
     decision, never a player-visible difference.
   - Lengths are counted in code points (`[...s].length`).
   - "Trimmed" means no leading or trailing character with the Unicode `White_Space` property
     (which includes U+00A0). `String.prototype.trim` is not used, because it also strips U+FEFF,
     which is not `White_Space`.
   - No text field contains a line break of any kind (LF, CR, NEL, U+2028, U+2029), and none
     contains U+FEFF anywhere (it is not `White_Space`, so it needs its own rule).
   - "Digit" means any character in Unicode categories Nd, Nl or No. That catches `3`, `３`,
     `٣`, `²`, `½` and `Ⅻ`.
   - Numbers written as words pass the check. In a proper name that is intended: xianxia naming
     depends on it ("Nine-Turn Furnace", "Seven Stars Method"). Review flags only a *quantity
     claim* written in words ("holds three bowls", "doubles your yield"), because such a claim
     would bypass the field it should come from.
7. **Cross-field ranges use a closed set of range forms.** A row's range is one of: a number
   interval; a length limit; a ref type list; or one of these **named checks**, each implemented
   once in the schema module and listed in AC-R8-2: `≤ field` (`resource.start` ≤ `resource.cap`),
   `2..M−1` (`realm.makeupSize`, M = `realm.ingredients` length), `n ≤ cap` (a `reached` atom
   against its resource's authored cap), `all keys of type` (`ingredient.contrib` has exactly one
   key per affinity), `distinct` and `strictly ascending`. A new form is a change to this GDD.
8. **The schema table has one source.** The runtime schema value (R8.2) is the table. The rows
   below are a copy for reading, and a test (AC-R8-2) parses them and diffs them against the
   schema module, so the two cannot drift. A "field with no row" means a field on a record that
   no row names (AC-R4-3); the closed owner list is the set of GDD names in the Owner column.
9. **Range cell grammar.** The diff test (AC-R8-2) compares only the machine tokens of a Range
   cell: a number interval `a–b`, a length limit, a list of ref types, and `check: <name>` for a
   named check of R4.7. Words in parentheses or after a colon other than `check:` are prose and
   are ignored. `n ≤ cap` is an atom rule (R5.3), not a row, and is tested by AC-R5-2.

**Rows (provisional until each owner's GDD approves them)**

| `type.field` | Kind | Unit | Range | Req. | `modifiableBy` | `sealInput` | Owner |
|---|---|---|---|---|---|---|---|
| `*.id` | text | — | R2 pattern | yes | — | no | this GDD |
| `*.type` | enum | — | R1 types | yes | — | no | this GDD |
| `*.name` | text | — | 1–24 chars, trimmed, no digits | yes | — | no | this GDD |
| `*.desc` | text | — | 1–80 chars when present, trimmed, one line, no digits | no (none) | — | no | this GDD |
| `*.flavor` | text | — | 1–140 chars when present, trimmed, no digits | no (none) | — | no | this GDD |
| `source.reveal` | gate | — | R5 atoms | no (revealed from the start) | — | no | this GDD |
| `source.need` | gate | — | R5 atoms | no (no need) | — | no | this GDD |
| `resource.cap` | int | units | 1–10⁹ | yes | foundation | yes (provisional: #3 and #6 may lower it to `no`) | Resources and caps (#3) |
| `resource.start` | int | units | 0–cap; check: ≤ field | no (0) | — | no | Resources and caps (#3) |
| `ingredient.contrib` | ref→int map | stat points | **total map**; check: all keys of type affinity: exactly one key for every affinity in content (no other key type until #6 defines one); values −10⁶–10⁶, 0 allowed | yes | method | yes | Forge and proving (#6) |
| `method.commitText` | text | — | 1–200 chars, trimmed, no digits | yes | — | no | Methods (#7) |
| `method.patches` | patch-list | — | R6 | no (empty) | — | no | Methods (#7); operations by Modifier pipeline (#2) |
| `source.inputs` | ref→int map | units per unit | keys: resource, ingredient; values 1–10⁹ (an absent key means none) | no (empty) | method | no | Activity slot (#4) |
| `source.outputs` | ref→int map | units per unit | keys: resource, ingredient; values 1–10⁹ (an absent key means none) | no (empty) | method, tending | no | Activity slot (#4) |
| `source.duration` | int | ms per unit | 1–86,400,000 | yes | method, tending | no | Activity slot (#4) |
| `source.fights` | ref-list | — | combatant; 0–3 entries | no (empty = fightless) | — | no | Fight and dungeon routes (#9) |
| `source.enabled` | bool | — | — | no (true) | method | no | Methods (#7) |
| `combatant.stats` | name→int map | stat points | keys: the stat-name list closed by #5 (placeholder names in tests until then); values 0–10⁶ | yes | — | yes | Combat resolver (#5) |
| `door.opponent` | ref | — | combatant | yes | — | yes | Forge and proving (#6) |
| `door.thresholds` | int-list | set by #6 (the proving result's scale) | exactly 2; check: strictly ascending (open, wide open); each 0–10⁶ until #6 narrows it | yes | — | yes | Forge and proving (#6) |
| `realm.ingredients` | ref-list | — | ingredient; 3–12 entries; check: distinct (their count is the realm's M) | yes | — | yes | Forge and proving (#6) |
| `realm.makeupSize` | int | ingredients | check: 2..M−1 | yes | — | yes | Forge and proving (#6) |
| `realm.doors` | ref-list | — | door; 1–6 entries; check: distinct | yes | — | yes | Forge and proving (#6) |

`combatant.stats` is tagged `sealInput` for every combatant, even though only proving opponents
feed seals. A row covers a whole type, so the conservative tag keeps tending away from all of
them.

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
5. **Need text is generated, never authored.** The interface builds it from the unmet atoms
   and the names of the records they name, for example "Needs Ash-root ×3 (3 more)". The other atoms read
   "Needs a method committed" for `committed()` and "Needs the [realm name] forged" for
   `forged(realm)`. There is no authored override, because an override can drift from the
   gate it describes.
6. Gates read game state only (high-water marks, the commit, forged realms). They never read a
   content number, so no modifier can change whether a gate is met.
7. **Data shape.** A gate is an array of atom objects, and no other keys are allowed:
   `{"atom": "reached", "id": <resource or ingredient id>, "n": <int>}`,
   `{"atom": "committed"}` (no `id`, no `n`) and `{"atom": "forged", "id": <realm id>}`. A
   missing, extra or wrongly typed key is a load error (R8.3 step 5). ADR 10 may choose the file
   encoding but not this shape.

#### R6. Method patches and `applyMethod`

1. A method's `patches` is a list of entries `{target, field, key?, op, operand}`.
   - `target` is a record id, and `field` is one of its fields.
   - `key` is **required on a map field** (`source.inputs`, `source.outputs`,
     `ingredient.contrib`) and **forbidden on every other field**. It names the map key whose
     value changes. The unit a patch addresses is therefore the triple (record, field, key),
     with the key absent for scalar fields.
   - `op` and `operand` are integers within ±(2⁵³−1). On a bool field (`source.enabled`) only
     `set` is legal, with operand 1 (true) or 0 (false); `add` there is a load error. The result
     of an op is checked against the safe-integer range before the row's own range.
   - The loader takes an **ops table** of pure functions
     `(current, operand) → int`, so no check here waits on system 2. The MVP set, owned here, is
     `set` (result = operand) and `add` (result = current + operand). The Modifier pipeline (#2)
     may add operations (for example basis-point scaling through `bp_of`, F6) and owns the order
     in which stages apply; it may not change what `set` and `add` mean.
2. A patch is legal only if all of these hold:
   - the target exists;
   - its type carries the field;
   - the field's registry row includes `method`;
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
   - Integer arithmetic is exact and identical across browser engines and Node. The `advance`
     composition test and the seal-invariance test both need exact equality.
2. **Text is plain strings**, with no markup or templates, and is keyed by record id so it can
   be translated later.
   - `name` is required.
   - `desc` and `flavor` are optional and comment on the mechanic (rule 70).
   - `commitText` is required on every method. It names what the commit closes and how to
     redo it (rule 54).
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
2. **The schema is a runtime value.** The record types, field lists, registry and gate atoms
   exist as data the code can read. The checks take the schema as an input, so tests can pass a
   modified schema; the shipped one is the default. Checks read that value. TypeScript types are derived from
   it or checked against it, never the reverse, because TypeScript 7.0 has no programmatic
   compiler API (`docs/engine-reference/web/breaking-changes.md`).
3. **Structural checks run on every load**, in the shipped game as well as in tests and the
   build. They need no game state. They run in this fixed order, and **loading stops at the
   first failure**, which names the record and field. Within one step, records are visited in id
   order (UTF-16 code-unit order) and fields in registry order, so the same bad content always
   gives the same error:
   1. the type is known; ids have the right format, are not reserved, and are unique;
   2. there are no unknown fields, and required fields are present;
   3. values have the right kind and are in range; the cross-field named checks (R4.7) run after
      the single-field ranges;
   4. references resolve to the right types;
   5. gates have the pinned shape and use only the listed atoms (R5.7);
   6. the registry rules (R4) hold;
   7. patches are legal (R6.2), and none leaves its target unchanged (F8, with the MVP ops of
      R6.1);
   8. every declared basis-point pair stays inside exact integer range (F6);
   9. text is within its limits (R4.6, R7.2).

   **Output check.** After step 9, `applyMethod` runs once per method, in method-id order. Each
   output is checked by steps 3, 4, 6 and 9 only (kinds, ranges, references, registry rules,
   text). Step 7 is not repeated, because the patches have already been applied. A failure is
   reported once, as the method, record and field, with the cause "after patch". It stops
   loading, so later methods are not checked.

   `bun run build` fails if any check fails.
4. **The Validator (system 12) owns** the checks that need game state or enumeration:
   - every `reveal` is false at the start (rule 52);
   - the pillar 4 source checks under each method;
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
     - defaults are expanded first, but only for rows whose Req. column states a literal
       default: `start` 0, `enabled` true, and `inputs`, `outputs`, `patches` and `fights`
       empty. Rows whose default is "none" (`desc`, `flavor`, `reveal`, `need`) stay absent. Two
       spellings of one value then cannot hash differently (R7.2's reason);
     - records are sorted by id, and object keys by UTF-16 code unit order;
     - **order-significant lists keep their authored order**: gate atoms (they drive need
       text), `door.thresholds`, `source.fights` and `realm.doors`. **Sets are sorted**:
       `realm.ingredients` by id, and `method.patches` by (target, field, key), all in UTF-16
       code unit order (patches are unique per triple, so their order carries no meaning);
     - the hash input is `JSON.stringify([schemaVersion, [[id, record], …]])` with records in id
       order and keys sorted. `schemaVersion` is an integer constant in the schema module, raised
       whenever a rule or an op changes meaning. Numbers are plain decimal safe integers (R7.1);
     - text is as authored (NFC, R4.6), and the hash input is its UTF-8 bytes.
   - The hash is computed **synchronously by a pure-code function** (no Web Crypto, which is
     async, and no `node:crypto`, which is not in the bundle). The algorithm is an ADR (ADR 6).
   - File order and record order therefore never change it.
   - The frozen sets are derived deterministically from that content, so they need no
     fingerprint of their own.
   - It must be identical in Node and in the production bundle. The save records the fingerprint
   it was written against (system 11).

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
| Hidden → Waiting | The last unmet `reveal` atom becomes true, and either no method is committed, or `enabled` is true and `need` is unmet | No (monotone) |
| Hidden → Actionable | After a commit, the last unmet `reveal` atom becomes true, `enabled` is true in the committed set and `need` is already met | No (monotone) |
| Waiting → Actionable | A method is committed, `enabled` is true in the committed set, and the last unmet `need` atom becomes true (or the commit lands with `need` already met) | No (monotone) |
| Waiting → Withdrawn | The commit, when `enabled` is false in the committed set | Not in the MVP. The post-commit method switch (Vertical Slice, system 16) must re-derive it, and must keep `committed()` monotone or amend R5 |
| Hidden → Withdrawn | After a commit, the last unmet `reveal` atom becomes true while `enabled` is false in the committed set | No (monotone) |

### Interactions with Other Systems

This system owns the vocabulary. Every other system reads frozen content and registers its
fields in R4. None of them may add a field, type or gate atom without amending this GDD.

| # | System | Reads from this system | Gives back / registers | Interface owner |
|---|---|---|---|---|
| 2 | Modifier pipeline | Registry rows (`modifiableBy`, `sealInput`); `applyMethod` output | Patch operations, stage order, rounding points, provenance for breakdowns | Pipeline owns operations; this GDD owns target legality |
| 3 | Resources and caps | `resource` records | Rows for `resource.cap` and `resource.start`; names the caps and the affinity records | Shared: this GDD owns the type, #3 owns the values |
| 4 | Activity slot | `source` records (`inputs`, `outputs`, `duration`, `enabled`) | Their rows; the high-water marks that `reached` reads; whether rest is a source | #4 owns the stop rule and the marks |
| 5 | Combat resolver | `combatant` records | The closed list of stat names in `combatant.stats` | #5 |
| 6 | Forge and proving | `ingredient`, `affinity`, `door`, `realm` records | Their rows; the `forged` state that `forged` reads; the seal function | #6 |
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

`high_water[id] = max(high_water_prev[id], held[id])`, evaluated after every change to
`held[id]`, for every resource and ingredient.

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
- **If a patch disables every source of an id that some `reached` atom, or the forge, needs**:
  validator error under that method (R8.4, reachability under each method's frozen set; pillar
  4's two-source rule).
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

  This serves "plan a forge backwards" (pillar 3). Rule 52 ("reveal false at start") is about
  in-run reveal and is unaffected. Forge screen #15 and Method marks #14 own the layout.
- **If the player tries to start any source before committing**: runtime rule. Nothing is
  actionable (F7), so there is nothing to start.

### Saves across content versions (owned by #11)

- **If a saved id was retired and has an alias**: #11 maps it to the alias target.
- **If a saved id was retired and has no alias**: #11 drops it and logs that it did.
- **If an ingredient, realm or method id is retired without an alias**: validator error. Those
  ids make up a forged Foundation, the thing the player can point at (pillar 1), so dropping one
  would silently change it.
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
| `commitText` length | 200 chars | 120–300 | Naming what the commit closes *and* how to redo it (rule 54) | The commit dialog on a phone |
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
   be noticeable. The budget is fixed by the performance work at architecture, not here.
2. **The method's fingerprint.** Exactly the values a method changes carry its mark, and nothing
   else moves (F8). This system guarantees the "exactly"; Method marks (#14) owns the feel of
   seeing it.

## UI Requirements

This system has no screen, but it fixes rules every screen must follow:

- **Render by field, not by type** (rule 33). A tooltip shows the same ordered fields for every
  record type that has them.
- **Need text is generated** from unmet atoms (R5.5, F4) in the gate's authored order. Every
  `reached` line shows the target and the shortfall. It is never authored or overridden.
- **Text limits** (R4 rows, Tuning Knobs) are set so names fit phone-width buttons. Phone width
  is a constraint from the MVP (rule 67).
- **Numbers come only from fields.** No text field contains a digit (R7.2), so every number on
  screen can carry a mark and a breakdown (rule 97).
- **The method-choice view** may show change sets and per-ingredient source counts. It shows the
  *name*, never the text, of a hidden source that a method's patches touch, and no other hidden
  record (Edge Cases, "Before the commit").
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
| Combat resolver (#5) | `combatant.stats` | Closed stat names | Not yet designed |
| Forge and proving (#6) | R4 rows `ingredient.*`, `door.*`, `realm.*`; R5.3 ingredient counts | Seal function; `forged` state; affinity-only `contrib` keys | Not yet designed |
| Methods (#7) | R6; `method.*`, `source.enabled` | Committed state; which patches exist | Not yet designed |
| Save and run lifecycle (#11) | R2.3, R8.5, Edge Cases on saves | Alias map, retired-id list, fingerprint handling | Not yet designed |
| Content validator (#12) | R8.4; every "validator error" edge case | State and enumeration checks | Not yet designed |
| Method marks (#14), Forge screen (#15), Interface shell (#13) | UI Requirements; F8 | Marking exactly the change set; generated need text | Not yet designed |
| `research/arcanum-reference/03-data-model.md`, `12-design-rules.md` | Overview, R1–R7 | Rules 1, 2, 3, 4, 9, 33, 52, 54, 58, 67, 70, 74, 97 | Reference |
| `research/hundred-days-reference/03-data-model-and-content.md` §4, §7 | Overview, R2, R5 | Rules 51, 53, 57; 191 dangling gates; 97 % simple expressions | Reference (P0.3.9c) |
| `research/magic-research-2-reference/03-engine-and-content-model.md` §3, §11 | Overview | Rule 95 (content as code can't be validated); rule 96 narrowed | Reference (v1.5.5 src) |
| `docs/engine-reference/web/breaking-changes.md` | R8.2 | TypeScript 7 has no programmatic compiler API | Pinned 2026-11-19 |

## Acceptance Criteria

**Test kinds:**
- **[unit]**: Vitest in Node, with no DOM.
- **[integration]**: the loader together with another system.
- **[build]**: `bun run build` and the production bundle.

**Base fixture** (tests pass a modified schema where a case needs one, R8.2):
- **Names:** every record has a `name`: "Raw ore", "Charcoal", "Ash-root", "Iron seed", "Jade
  seed", "Ash seed", "Ember", "Frost", "Smelt ore", "Deep vein", "First realm", and so on.
- **Resources:** `raw_ore`, `charcoal`, `ash_root`; cap 10, start 0.
- **Ingredients:** `iron_seed`, `jade_seed`, `ash_seed`. Each has `contrib` over both affinities:
  `iron_seed` `{ember: 5, frost: 0}`, `jade_seed` `{ember: 0, frost: 4}`, `ash_seed`
  `{ember: 3, frost: 3}`.
- **Affinities:** `ember` and `frost`.
- **Methods:** `ember_breath` and `still_water`. Patch entries use the R6.1 shape with ops `set`
  and `add`.
  - `ember_breath` has three patches: `iron_seed.contrib` key `ember` (`add` 2),
    `smelt_ore.duration` (`set` 800) and `deep_vein.enabled` (`set` 1).
  - `still_water` has four patches: `iron_seed.contrib` key `ember` (`set` 0),
    `jade_seed.contrib` key `frost` (`add` 1), `smelt_ore.duration` (`set` 1200) and
    `smelt_ore.enabled` (`set` 0).
- **Sources:**
  - `smelt_ore`, with reveal `[reached(raw_ore, 1)]`, need `[reached(charcoal, 2)]`, inputs
    `{raw_ore: 2}`, outputs `{ash_root: 1}` and duration 1000;
  - `deep_vein`, authored `enabled: false`, with reveal `[reached(ash_root, 1)]`, inputs
    `{charcoal: 1}`, outputs `{raw_ore: 1}` and duration 1000.
- The fixture is built for loader, patch and state tests. Its sources do not form a reachable
  economy, so the reachability checks of R8.4 have their own fixture in #12. AC-R8-8 asserts
  only the R8.4 method-patch check.
- Both methods patch at least one `contrib` value and one `enabled` value, so the fixture meets
  R8.4. A test that needs a method failing R8.4 builds it from this fixture by deleting the
  relevant patch entries.
- **Combatant:** `gate_ward`, with placeholder stat names.
- **Door:** `east_door`, with opponent `gate_ward` and thresholds `[10, 20]`.
- **Realm:** `first_realm`, with the three ingredients, makeupSize 2 and doors `[east_door]`.

**"Load error"** means loading stops, no content is returned, and the error names the record id
and field.

### R1 Record types
- **AC-R1-1** [unit] **GIVEN** the fixture plus `{id: "forge_room", type: "station"}`, **WHEN**
  it is loaded, **THEN** a load error names `forge_room`, `type`.
- **AC-R1-2** [unit] **GIVEN** `iron_seed` with an extra field `weight: 2`, or `east_door` with
  a `reveal`, **WHEN** it is loaded, **THEN** a load error names that record and field.
- **AC-R1-3** [unit] **GIVEN** `smelt_ore` without `enabled`, **WHEN** it is loaded, **THEN**
  its checked `enabled` is true and its fingerprint equals that of the same content with an
  explicit `enabled: true`. **GIVEN** `smelt_ore` without `duration`, **THEN** load error.

### R2 Identity
- **AC-R2-1** [unit] **GIVEN**, one at a time, a record id of `con`, `com9`, `constructor`,
  `none`, `source`, `reached`, `Ore`, `9ore`, `ore-1`, or 33 characters, **WHEN** it is loaded,
  **THEN** load error. A 32-character id loads.
- **AC-R2-2** [unit] **GIVEN** a resource `ember` beside the affinity `ember`, **WHEN** loaded,
  **THEN** a load error names the duplicate id.
- **AC-R2-3** [unit] **GIVEN** the schema module's reserved-id list, **WHEN** a test loads one
  record per entry (parameterised: the Windows device names, `constructor`, `prototype`,
  `__proto__`, `none`, `true`, `false`, `null`, every R1 type name, `reached`, `committed`,
  `forged`), **THEN** each is a load error naming the id. The test fails if the list lacks any
  R2.1 category.
- **AC-R2-4** [integration] **[blocked: #11]** **GIVEN** an alias map with a chain, a cycle, a
  target that is missing or of another type, or a source that is a live id, **WHEN** loaded,
  **THEN** load error.

### R3 References
- **AC-R3-1** [unit] **GIVEN** `smelt_ore.inputs` keyed `ghost_ore`, or `east_door.opponent:
  raw_ore` (the wrong type), **WHEN** loaded, **THEN** a load error names the record and field.
- **AC-R3-2** [unit] **GIVEN** the fixture's records shuffled and split across two inputs,
  **WHEN** loaded, **THEN** it loads with the same fingerprint as the original order.
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
- **AC-R4-3** [unit] **GIVEN** a test schema with a field that has no row, or a row with no
  owner, **WHEN** loaded, **THEN** load error.
- **AC-R4-4** [unit]
  - **GIVEN** a `name` of 24 code points in NFC, **WHEN** loaded, **THEN** it loads. At 25 code
    points, load error.
  - **GIVEN** a `desc` that contains `3`, `３`, `٣`, `²` or `½`, is empty, is `" x"`, ends in
    U+00A0, or holds LF or U+2028, **THEN** load error.
  - "three bowls" loads.
- **AC-R4-5** [unit] **GIVEN** a `name` authored in NFD (`e` + U+0301), **WHEN** loaded,
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
  - **GIVEN** `iron_seed.contrib` of `{ember: 0}`, **THEN** it loads.
  - **GIVEN** a `still_water` patch setting `iron_seed.contrib.ember` from 5 to 0, **THEN** it
    loads, and F8's change set contains the triple `(iron_seed, contrib, ember)`.
- **AC-R4-8** [unit] **GIVEN** a `name` of "Nine-Turn Furnace", **WHEN** loaded, **THEN** it
  loads. "9-Turn Furnace" is a load error.
- **AC-R4-10** [unit] **GIVEN**, one at a time, each of these, **WHEN** loaded, **THEN** load
  error (and the valid neighbour loads):
  - `realm.doors` `[east_door, east_door]`; thresholds `[20, 10]`;
  - `iron_seed.contrib` with an extra key `charcoal`, or no affinity records at all;
  - `start` 10 loads and 11 fails; `makeupSize` 2 loads, 1 and 3 fail with three ingredients;
    12 ingredients load and 13 fail;
  - `desc` of 80 code points loads and 81 fails; `flavor` 140 and 141; `commitText` 200 and 201.
- **AC-R4-11** [unit] **GIVEN** a `source.enabled` patch with `add`, or a `set` operand of 2,
  **WHEN** loaded, **THEN** load error naming the method, record and field.

### R5 Gates
- **AC-R5-1** [unit] **GIVEN**, one at a time, a gate `[]`, `[committed(ember_breath)]`,
  `[lacks(raw_ore)]`, `[reached(raw_ore, 1), reached(raw_ore, 3)]` or `[committed(),
  committed()]`, **WHEN** loaded, **THEN** load error.
- **AC-R5-2** [unit] **GIVEN** `reached(raw_ore, 11)` or `reached(iron_seed, 2)`, **WHEN**
  loaded, **THEN** load error. `reached(iron_seed, 1)` loads.
- **AC-R5-3** [unit] **GIVEN** `smelt_ore` revealed at a `raw_ore` mark of 1, **WHEN** held
  `raw_ore` falls to 0, **THEN** it stays revealed.
- **AC-R5-4** [unit] **GIVEN** a need of `[reached(charcoal, 2), forged(first_realm)]`, a
  charcoal mark of 1 and 0 held, **WHEN** need text is built, **THEN** it has exactly two lines
  in this order: "Needs Charcoal ×2 (2 more)", then "Needs the [first_realm's name] forged".
- **AC-R5-5** [unit] **GIVEN** the fixture, **WHEN** each method's frozen set is built, **THEN**
  every source's `reveal` and `need` in that set deep-equals the raw content's (a patch can't
  touch a gate, so gates never read content numbers).
- **AC-R5-6** [unit]
  - **GIVEN** a need of `[committed()]` and no commit, **WHEN** need text is built, **THEN** it
    is exactly one line, "Needs a method committed".
  - **GIVEN** a gate atom `{"atom":"committed","id":"x"}`, or `{"atom":"reached","id":"raw_ore"}`
    with no `n`, or an unknown extra key, **WHEN** loaded, **THEN** load error (R5.7).

### R6 Method patches
- **AC-R6-1** [unit] **GIVEN**, one at a time, a patch on `raw_ore.cap`, on `smelt_ore.fights`,
  on a missing record `ghost`, two patches on `smelt_ore.duration` in one method, two patches on
  `iron_seed.contrib` key `ember` in one method, a `key` on `smelt_ore.duration`, a missing `key`
  on `iron_seed.contrib`, or a `key` the map lacks, **WHEN** loaded, **THEN** a load error names
  the method, record and field.
- **AC-R6-5** [unit] **GIVEN** one method with patches on `iron_seed.contrib` keys `ember` and
  `frost`, **WHEN** loaded, **THEN** it loads and `changed` holds both triples.
- **AC-R6-6** [unit] **GIVEN** `smelt_ore.duration` (1000), **WHEN** `set` 800 and `add` 200 are
  applied, **THEN** they give 800 and 1200. Each of these is a load error: an unknown `op`; a
  `set` of 1000 (no change); an operand of 2⁵³; `add` on `smelt_ore.enabled`; `set` 1 on an
  `enabled` that is already true.
- **AC-R6-2** [unit] **GIVEN** checked content, **WHEN** `applyMethod` runs twice with
  `ember_breath`, **THEN** the two outputs are deep-equal, and the input deep-equals a copy
  taken before the call.
- **AC-R6-3** [unit] **GIVEN** a patch whose result sets `smelt_ore.duration` to 0, **WHEN**
  loaded, **THEN** a load error names the method, `smelt_ore` and `duration` (not a clamp).
- **AC-R6-4** [unit] **GIVEN** a patch whose `key` is `charcoal` on `smelt_ore.outputs` (a key
  the map lacks), or an `add` of −2 to `smelt_ore.inputs` key `raw_ore` (result 0, outside the
  row's range), **WHEN** loaded, **THEN** load error naming the method, record and field.

### R7 Values and text
- **AC-R7-1** [unit] **GIVEN** `smelt_ore.duration` as `1.5`, `"1000"`, `"10%"`, `NaN`,
  `Infinity` or `-0`, **WHEN** loaded, **THEN** load error. **GIVEN** a test schema with a field
  ranged ±(2⁵³−1), **THEN** 2⁵³−1 loads and 2⁵³ is a load error.
- **AC-R7-2** [unit] **GIVEN** `still_water` without `commitText`, or with a digit in it,
  **WHEN** loaded, **THEN** load error.

### R8 Loading and checks
- **AC-R8-1** [unit] **GIVEN** Node with no `window` or `document`, **WHEN** the fixture is
  passed as plain objects, **THEN** it loads.
- **AC-R8-2** [unit] **GIVEN** the schema module, **WHEN** it is read as data, **THEN** it lists
  exactly the eight R1 types, their fields, the registry rows, the three atoms, the R4.7 named
  checks and the R6.1 ops (`set`, `add`). **WHEN** the registry table in this GDD is parsed,
  **THEN** it equals the schema module's rows (R4.8).
- **AC-R8-3** [build] **GIVEN** the shipped content and a test file `shipped-content.test`
  that loads it, **WHEN** the duration of the first shipped `source` is set to 0, **THEN**
  `bun run build` and `bun test` each exit non-zero and name that record and `duration`. With
  the value restored, both exit 0.
- **AC-R8-4** [build] **[blocked: browser runner not chosen, see Open Questions]** **GIVEN** the
  shipped content, **WHEN** it is loaded in Node and in the production bundle in Chromium and
  Firefox, **THEN** the fingerprints are identical and the canonical-JSON serialisations of the
  frozen sets (keys sorted, R8.5) are byte-equal. In Node the build-tier Unicode check (R4.6) has
  run; the browsers run only the runtime tier.
- **AC-R4-9** [unit] **GIVEN** the runtime tier of the text check, **WHEN** a `name` has a lone
  surrogate, a leading U+FEFF, a `3`, or a trailing space, **THEN** load error. **GIVEN** a
  character the build tier classifies as a digit but the runtime tier doesn't (a non-ASCII
  digit), **THEN** the build check fails it, so it never ships.
- **AC-R8-5** [unit] **GIVEN** the fixture, **WHEN** `smelt_ore.duration` changes from 1000 to
  1001, **THEN** the fingerprint changes.
- **AC-R8-6** [unit] **GIVEN** `raw_ore.start` 1, **WHEN** loaded, **THEN** there is no load
  error, and the loader returns `{frozen: {[methodId]: set}, registry, fingerprint}` with one
  frozen set per method.
- **AC-R8-7** [integration] **[blocked: #11, #13]** **GIVEN** a production build whose bundled
  content holds a load error and an existing save in storage, **WHEN** the game starts, **THEN**
  no `advance` call is made, one element with `role="alert"` contains the record id and field,
  and the stored save bytes are unchanged.
- **AC-R8-8** [integration] **[blocked: #12]** **GIVEN** the fixture with each method's `contrib`
  and `enabled` patches deleted so only `smelt_ore.duration` is patched, **WHEN** the Validator
  runs, **THEN** it fails naming both methods, and passes for a method once that method also
  patches one `contrib` value and one `enabled` value (R8.4).
- **AC-R8-9** [unit] **GIVEN** the fixture, **WHEN** it is changed as follows, **THEN** the
  fingerprint:
  - is **unchanged** by spelling `smelt_ore.enabled` explicitly as true, by listing
    `realm.ingredients` in another order, and by reordering `still_water`'s `patches`;
  - **changes** on reordering `door.thresholds` entries (with the values kept ascending by
    changing them), `realm.doors`, a source's `fights`, or the atoms of a gate;
  - **changes** when `schemaVersion` is raised by 1.
  A pinned golden fingerprint for the fixture is added when ADR 6 fixes the algorithm.
- **AC-R8-10** [unit] **GIVEN** two loads of content in which an early record has an unknown
  field and a later record has a bad reference, **WHEN** loaded, **THEN** the error is the early
  record's field, and it is the same on every run (R8.3 order).

### States and Transitions
- **AC-S-1** [unit] **GIVEN** a frozen set, **WHEN** strict-mode code assigns
  `smelt_ore.duration = 5`, `smelt_ore.outputs.ash_root = 5` or pushes onto a gate list,
  **THEN** each throws `TypeError` and the value is unchanged. The freeze is deep.
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
- **AC-F1** [unit]
  - **GIVEN** a mark of 4 and 4 held, **WHEN** 3 are gathered and then 6 spent, **THEN** the
    mark is 7 after each step.
  - **GIVEN** `raw_ore.start` 2, **WHEN** a run starts, **THEN** its mark is 2 and every
    ingredient's mark is 0.
  - **GIVEN** `raw_ore.start` 8 and a Foundation that lowers the effective cap to 5, **WHEN** a
    run starts, **THEN** the mark is 5 and `reached(raw_ore, 6)` is false.
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
  - a divisor of 0 or −1 throws.
- **AC-F6** [unit]
  - **GIVEN** `bp_of`, **WHEN** called, **THEN** `(250,1250)=31` and `(−250,1250)=−32`.
  - **GIVEN** a test schema declaring a pair with |x| ≤ 10⁹ and |b| ≤ 9,007,199, **WHEN**
    loaded, **THEN** it loads. With |b| up to 9,007,200, load error.
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

### Checked by review, not by test
- That `commitText` names what the commit closes and how to redo it (rule 54), and that no
  text makes a quantity claim in words. Numerals as words inside proper names are allowed.
  Checked by `/design-review` and content review.
- Load time: the median time to load and check the shipped content is at most N ms in Node and
  at most M ms in the production bundle on the reference device, with N and M taken from the
  performance budget ADR, which does not exist yet (ADR 9 below). Until N and M exist, this has
  no pass mark.
- Integration criteria marked `[blocked: #n]` run when that system's GDD and code exist.
  Unowned until then: the edge cases under "Saves across content versions" (#11), the
  validator rules in Edge Cases (#12), and "no leak of hidden text before the commit" (#14, #15).
- The basis-point pair check (F6) passes vacuously until the Modifier pipeline (#2) declares
  pairs. AC-F6 uses a test pair until then.

*Specialist: `qa-lead` consulted. It found 17 gaps; each was resolved in R1–R8, F1–F8 or Edge
Cases before these criteria were written, or is listed under "Checked by review, not by test".*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Is `resource.cap` a seal input? If yes, seals depend on the previous Foundation, which reforge must handle | Resources and caps (#3) with Forge and proving (#6) | Before the #6 GDD is approved |
| 2 | Do ingredients have counts (needing a cap row and `reached(ingredient, n > 1)`) or are they held 0/1? | Forge and proving (#6) | #6 GDD |
| 3 | Is rest a `source` record, and if so how is it exempt from "does nothing"? | Activity slot (#4) | #4 GDD |
| 4 | May pre-release saves be wiped? Until decided, renames are free and the alias map is empty | Designer | Before the save format ADR |
| 5 | Decided 2026-11-20: the method-choice view shows both methods' projected added/removed sources by name, ignoring `reveal` for sources the change sets touch (Edge Cases, "Before the commit"). Open: its layout and how it marks removed routes | Forge screen (#15), Method marks (#14) | Their UX specs |
| 8 | Which browser runner (for Chromium and Firefox) runs AC-R8-4? The package tool is `bun` (project rules), and this GDD's commands now say so | Technical Director | Architecture |
| 6 | How does a post-commit method switch keep `committed()` monotone? | Reforge (#16) | Before the Vertical Slice |
| 7 | Does the realm ladder need a door-tier atom? | Realm ladder (#19) | Alpha |

**ADRs required** (representation decisions this GDD leaves out, per TD finding 8):

1. Content file format and file layout (JSON or another plain-data format).
2. How the runtime schema value is written, and how TypeScript types are derived from it or
   checked against it (no compiler API in TypeScript 7).
3. The shared loader for Node and the Vite bundle, and how content is bundled.
4. How a patch entry `{target, field, key?, op, operand}` is serialised, and the ops table (the
   MVP `set` and `add` here; more from #2).
5. The integer helpers (`div_floor`, `bp_of`) and the unit encoding per field.
6. The content fingerprint algorithm.
7. The alias map and retired-id list format (with #11).
8. The format of load and validator error reports (record id, field, rule).
9. The performance budget for load and check (Game Feel, AC "Load time").
10. The file encoding of gates (the shape is pinned in R5.7), and the two-tier text check (R4.6).
