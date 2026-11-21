# UX Spec: Method Marks and Number Breakdowns

> **Status**: Designed 2026-11-21 (pending `/ux-review`)
> **System**: #14 Method marks and number breakdowns (MVP, Wave A); `design/gdd/systems-index.md` row 14
> **Amendments made with this spec** (designer-approved): #1 A10 (R7.2, AC-R7-3; Open Question 5's marking half) and #7 A3 (W1, Edge Cases, Visual/Audio, AC-W7-2, Open Question 7): the commit dialog says "Feeds:" and "Quenches:". #2 A3: Open Question 6 marked resolved (status only)
> **Author**: designer + Claude (`/ux-design method-marks`)
> **Last Updated**: 2026-11-21
> **Journey Phase(s)**: Unknown (no player journey map); every phase from the first screen
> **Platform Target**: Web, desktop browser first, phone width (390 px) a constraint from the MVP; keyboard and mouse, touch
> **Template**: UX Spec

---

Rule numbers ("rule 97") refer to `research/arcanum-reference/12-design-rules.md` (1–38, 70–74),
`research/hundred-days-reference/06-design-rules.md` (39–69) and
`research/magic-research-2-reference/08-design-rules.md` (75–100). "#N" is system N of
`design/gdd/systems-index.md`. Rules this spec fixes are numbered **MK** (marks) and **BD**
(breakdowns) under Layout Specification, so other specs and stories can cite them ("#14 MK5").
**"Mark" here always means a method mark.** #1 F1's *high-water mark* (the most of a resource or
ingredient ever held) is a different thing, and this spec always writes it in full.

**Binding inputs, in order:** systems index paragraph and row 14; the concept's Visual Identity
Anchor (The Circulating Tint, principles 1–3); Modifier pipeline #2 (P8 provenance, the trails);
Methods #7 (W3 verbs, W6 change sets, Visual/Audio and UI Requirements); the other approved GDDs'
hand-offs to #14 (#1 R6.4, R7.2, F7, F8 and "Before the commit"; #3 Visual/Audio; #5 UI
Requirement 3; #6 G7, S1–S6 and UI Requirement 7; #8 Visual/Audio 1; #9 Closed state and
Visual/Audio; #10 D3.3 and Visual/Audio; #11 UI Requirement 5). No art bible exists, so the
Visual Identity Anchor is the binding art direction (Open Questions).

**Designer decisions taken in this spec's session (2026-11-21):**

| # | Question | Decision |
|---|---|---|
| D1 | How a mark shows the direction of a change (art-director gap 1) | **Notched glyph**: the method glyph plus one of a small set of verb notches shared by every method (MK3) |
| D2 | How a removed route is shown (art-director gap 2) | **Hollow other glyph**: a neutral closed glyph, then "Opens under", the opening method's glyph drawn hollow in ink, and its name, at full contrast (MK5) |
| D3 | How the player reaches a breakdown | **Inside the record**: tapping a record opens #13's container, where every number shows its breakdown under its own line, and composed numbers drill down (BD2, BD6) |
| D4 | What the method glyphs are made of | **Single-stroke emblems**: one continuous stroke with soft joins; Ember Breath a rising curl, Still Water a level ring (MK2) |
| D5 | Whether the commit dialog names the verb in words (#7 Open Question 7) | **Words**: "Feeds:" and "Quenches:" replace "Changes:" on contribution lines, by amendment A10 to #1 R7.2 and A3 to #7 (approved by the designer) |

## Purpose & Player Need

This spec defines two display rules that every screen uses: the **method mark** and the **number
breakdown**. It has no screen of its own. Marks are drawn in place on whatever screen shows a
marked value or a route, and breakdowns are drawn inside Interface shell #13's one tooltip
container. #13 owns that container (how it opens, closes and scrolls, and its focus); this spec
owns what a mark and a breakdown show.

**The player need.** The player arrives at a marked value or a breakdown wanting to know *what
the method did to this number, and why the number is what it is.*

- **Marks** make pillar 2 ("the method you circulate changes what each ingredient contributes at
  the forge and what other systems pay, never just a rate") visible without a rule being read.
  The concept's visual rule is *"What the method touches, the method marks."* A glance tells the
  player which numbers the circulating method changed, which way, and which routes it opened or
  closed. That is the run's identity in the shape of the world (Methods #7, Player Fantasy
  promise 5; rule 71, identity lives where the numbers live).
- **Breakdowns** make every rule-derived number explain itself (rule 97, *copy*). The player can
  then reason about the forge (pillar 3) instead of guessing: a clash that halves Cinder is a
  line, not a mystery. They can also check pillar 4's promise for themselves: a seal input's
  breakdown never holds a "Heaped" line (#2 P10).

**What goes wrong without it.**

- **Without marks**, the second method looks like the same game with different numbers. Methods
  #7 records that the two methods' best makeups share three ingredients and swap one (W6, Open
  Question 1). The routes and the marks carry the rest of pillar 2. If the player cannot see
  which values moved, the fast new game under the other method reads as a replay, and the MVP's
  "comes back for the other method" signal has nothing to show.
- **Without breakdowns**, the forge is trial and error. The forge prototype's tester forged a
  3 when a 4 existed and did not look for it (CD-PLAYTEST concern 2). The headroom signal that
  answers that is #15's, but a tester who knows a better Foundation exists still needs to see
  *why* one makeup scores better. The breakdown is that "why".

**Evidence (thorough density; no user research exists yet).**

- *Magic Research 2* underlines every displayed effect, and the value's tooltip is the full
  transformation breakdown: base, each addition, each multiplier, with sources named
  (`magic-research-2-reference/01-shell-and-opening.md` §5, v1.5.5 src). It is the only one of
  the three references that does this (MR2 rules, "What the three references say together").
- *Arcanum* renders one ordered tooltip schema for every record, with a "Modifications" block,
  but only on hover (`arcanum-reference/02-interaction-semantics.md`, "Tooltip schema"). Rule 33
  tells us to *copy the schema and beat hover-only*. This spec puts breakdowns inside that one
  schema and opens them by tap (D3).
- *Hundred Days* shows what happens when a mechanic the engine implies is never stated: players
  misread an accrual as a rare drop (rule 62). Breakdowns are this game's way of stating it.

**Alternatives set aside** (density: thorough):

- *Per-number tap targets* (MR2's underlined values). They would cost one tap less on desktop,
  but dense rows such as "5 per 5 s · heaped 7 per 6.25 s" cannot give each number a 44 × 44 px
  target at phone width (rule 67; #13's phone constraint). Declined in D3.
- *Verb words on every marked value* ("45 fed"). Most explicit, but 5–9 extra characters on
  every marked value at 390 px and in translation. Declined in D1. The words appear in
  breakdowns, in the commit dialog and in every mark's accessible name instead.
- *A closed route greyed out.* Methods #7 set aside "The grain of the path" (a closed route
  greyed with its sentence) because it reads mostly as regret. Fight and dungeon routes #9 adds
  that depth never fades. Declined in D2 for full contrast.
- *Marks on derived numbers* (a total, stat, score, seal or cap that a marked value feeds). That
  contradicts #3 ("cap lines carry no method mark, because no method ever changes a cap"), #2
  P8.2.3 (the marked set is exactly `changed(m)`) and #7 AC-W6-2. Not offered (MK1).

**Rules cited, and stated divergences.**

| Rule | Tag | How this spec applies it |
|---|---|---|
| 2, visibility ≠ actionability | *copy* | A closed route stays visible and named; it is not actionable (MK5) |
| 32, persistent context | *copy* | The circulating method's name, glyph and tint never leave the screen (MK9; #13 places them) |
| 33, one tooltip schema | *copy the schema; beat hover-only* | Breakdowns are blocks inside the one schema, opened by tap or click, never by hover (BD2) |
| 54, irreversible choices say what they close | *beat* | The commit dialog names each verb in words and marks each line (D5, W7) |
| 62, state the mechanic the engine implies | *copy* | Clashes, limits and the body base are named lines, not silent arithmetic (BD4, BD5) |
| 67, 98, phone layout | *avoid* / *copy* | 390 px is a constraint from the MVP: no per-number targets, and lines wrap (D3; Layout Zones) |
| 71, identity lives where the numbers live | *copy* | The method's identity is drawn on exactly the numbers and routes it changes (MK1) |
| 97, every number explains itself | ***copy*, with one stated divergence** | MR2 attaches the breakdown to an underlined value. This spec attaches it to the record's container, where every number shows its breakdown under its own line (D3). **Reason:** at phone width adjacent numbers cannot each have a 44 × 44 px target. The breakdown content (base and every modifier by named source) is MR2's, unchanged. The scope is read as every rule-derived number (BD1) |

---

## Player Context on Arrival

Marks arrive unasked: they are always on screen wherever a marked value is shown. Breakdowns
arrive by choice, when the player taps a record. Journey phases are inferred from the concept's
core loop, because no player journey map exists (Open Questions).

| When | What the player was just doing | State of mind | What #14 must deliver |
|---|---|---|---|
| First screen, before the commit | Reading the goal line and the three lines of instruction (#13, #15) | Curious, deliberating, unhurried. Choosing costs nothing and the slot banks rest (#7 W10) | In the method-choice view, each method's change set wears that method's **hollow** marks: "+10" with a raise notch, "quenched" with a quench notch, "Opens:" with an open notch. No absolute contribution appears (#1, #7 AC-W7-1) |
| The commit dialog | Pressing "Begin circulating [method]" | Weighing the run's first irreversible act (#7 Game Feel) | Each opens, feeds and quenches line carries its notched mark. Each "Closes:" line carries the closed mark (D5, MK5) |
| The commit lands | Confirming | Arrival: "the world answers" (#7 Game Feel) | In the commit frame the circulating glyph turns solid, every changed value gains its solid mark, and the other method's routes become closed rows (Transitions & Animations) |
| Gathering (the 30-second loop) | Spending before a cap stops the activity (#3) | Glancing, peripheral attention. Held against cap is the thing being watched | Marks stay quiet. They never displace, shrink or recolour the number, which stays in ink (MK2). Route rows show open and closed marks at a glance |
| At the forge (#15) | Gathering the last ingredient of a plan, or comparing held makeups | Analytical, comparing (MVP signal: three makeups previewed before the first forge) | Breakdowns are used most here: the clash, the stats, the door scores. Drill-down from a seal to the contribution a method fed (BD5, BD6) |
| After the forge | Confirming the forge | Rewarded. "Then room" (#6 Game Feel) | A raised cap's breakdown shows each ingredient's share as its own line, unmarked (#3; BD3) |
| A new run under the other method | Starting a fast new game (#11) | Comparing two ways of being a cultivator | The swap test: the marked set is now the other method's, the routes that were closed are open, and the last-run line names the earlier method with its hollow glyph (#11 UI Requirement 5) |

---

## Navigation Position

This spec is a layer, not a destination:

- **Marks** live in place on every screen that shows a marked value or a route: #13's persistent
  context and route rows, and #15's forge screen and method-choice view. They are never a
  destination and never a tap target.
- **Breakdowns** live at: any screen → a record (row, store, ingredient, door, stat block) → #13's
  container → the number's breakdown block → (for a composed number) a part's breakdown → back.

A breakdown is reachable wherever a rule-derived number is shown, in every state. Some numbers
exist only in some states: a cap has Foundation lines only after the forge, and a gatherer has a
"Heaped" line only while it is heaped. There is no menu entry and no second path.

---

## Entry & Exit Points

| Entry source | Trigger | Player carries this context |
|---|---|---|
| Any record on any screen (#13, #15) | Tap, click, or Enter/Space on the focused record. The container is #13's | The record and the numbers it shows. Each number's trail (#2 P8) or its owner's result (BD5) |
| A part line in a composed breakdown | Activating a line that ends in "›" | The parent number, for the back line |
| The commit (#7 W7.5) | `committed {method}` event | Marks turn solid; closed rows appear; the persistent glyph turns solid (#13 places it) |
| The forge (#6) | `forged` and `capChanged` events | Cap breakdowns gain Foundation lines. Foundation stats read the snapshot (#6 G10) |
| A heap change (#10) | An accepted `setHeap`, then recompute (#2 P9.3) | Heap lines appear or leave in that gatherer's output and duration breakdowns |
| A new run (#11) | Fast new game confirmed | Back to Choosing. Every solid mark and closed row is removed |
| A save loaded (#11) | Load, or Load save | Marks and breakdowns are rebuilt from the recompute. Nothing is read from the save (#2 Edge Cases) |

| Exit destination | Trigger | Notes |
|---|---|---|
| The parent breakdown | The back line | Focus returns to the part line that was opened (BD6) |
| The screen behind the container | Esc, the close control, or #13's dismiss rule | Clears the drill stack. Focus returns to the record that opened it (#13) |
| Another record's container | Opening another record (#13) | Clears the drill stack |

No exit is one-way, and no exit changes game state: marks and breakdowns are read-only. The
commit, which turns marks solid, is #7's action in #15's dialog, not an exit of this spec.

---

## Layout Specification

### Mark rules (MK)

**MK1. The marked set is exactly what the method changed.**

1. After the commit, a value carries the circulating method's mark **if and only if** its trail
   holds a method step. By #2 P8.2.3 that is exactly the triples of `changed(m)` (#1 F8, R6.4).
   In the MVP that is five values per method (#7 W6, AC-W6-1):
   - Ember Breath: Ember Marrow's Cinder (feed +10), Ironbark Heartwood's Jade (quench), and
     the Salamander, Heron and Crab Hunts (open);
   - Still Water: Echo Jade's Bark (feed +20), Tidewater Pearl's Bark (feed +30), and Still
     Deep I, II and III (open).
2. A contribution value is marked wherever it is shown: on #15's ingredient list, in the
   ingredient's container, and as a part line inside a composed breakdown (BD5). An opened route
   is marked on its name, wherever its row is shown (#13's routes, #15's per-ingredient route
   list).
3. **Nothing else carries a method mark.** Derived numbers never do, even when a marked value
   feeds them: affinity totals, affinities after a clash, Foundation stats, door scores and
   tiers, seals, the best seal count, caps, Foundation lines, room, gathering times, and every
   fight number. Their breakdowns show the mark on the part, one level down. This keeps #3
   ("those lines carry no method mark, because no method ever changes a cap"), #8 ("the hearth
   road is unmarked") and #9 ("the routes' Life margins and prices are content, so they stay
   unmarked") true, and it makes the swap test exact: swap methods, and exactly the marked
   elements change their marks (concept principle 2).

**MK2. Anatomy of a mark.**

- **The number stays in ink**, at full text contrast, never recoloured, resized or moved by its
  mark. The tint goes on the glyph and on a channel underline, so the value reads exactly like
  an unmarked one (tinted numerals at body size fail contrast on a light stone base).
- **The mark** follows the number at its inline-end, after a thin space. A number with a unit
  ("6.25 s") puts the mark after the unit. An open mark follows the route's name. The mark is
  the method glyph (MK2 glyph sheet) with one verb notch (MK3) attached at its inline-end
  baseline corner.
- **The channel underline** is a 2 px stroke in the tint, 2 px below the baseline, under the
  number's sign and digits only (not its unit). It appears only on solid marks on numbers. Open
  marks on route names and hollow marks carry none. It is the concept's channel line tying the
  glyph to its value. Because breakdowns are reached by the record, not the number (D3), no
  number is a link, so the underline is never mistaken for one.

**Glyph sheet** (provisional drawing until an art bible exists; the silhouette rules bind):

| Glyph | Form | Silhouette class | Where |
|---|---|---|---|
| **Ember Breath** | One continuous stroke that rises from the lower inline-start corner, swells, and ends in a pointed tip at the top curling back toward inline-start: a flame tongue fanned by breath. Open at the top, asymmetric, mass low and point high | **rising** | Marks, persistent identity, the method-choice view, dialog, last-run line |
| **Still Water** | A closed circle 0.7 em across, crossed by one horizontal stroke at 55 % of its height that runs 0.1 em past it on each side. Closed, symmetric about the vertical, mass level | **level** | As above |
| *Reserved for later methods* (the full vision caps at six) | Each a single stroke | **falling**, **coiling**, **branching**, **rippling** | Two methods never share a class |
| Closed (neutral) | Two uprights joined by a bar across the gap: a barred gate, 1 em | — | MK5 |
| Heap (neutral, #10's request) | A low mound: an arc over a short baseline | — | Breakdown lines (BD4); #13's heap toggle should use the same shape |
| Limit (neutral) | A vertical stop bar with a short lead into it, like ⊣ | — | Breakdown lines (BD4) |

- Every glyph is one inline SVG symbol drawn from a single path (no font character), in a 1 em
  box at the surrounding text size. The stroke weight is 0.18 em with round ends and soft joins
  (concept: "continuous lines and channels ... with soft joins").
- Minimum box: **14 CSS px** inline with a number, and **16 CSS px** wherever a hollow form is
  drawn (MK4).
- Neutral glyphs are drawn in ink and never take the tint. Their silhouettes must stay distinct
  from both method classes and from #13's and #9's state glyphs (sealed, short, held, full,
  depth, verdict). #13's glyph sheet checks this against this table.
- **Glyphs other specs draw**, under the same constraint: the four affinity glyphs (Cinder, Jade,
  Bark, Gale; #6 Visual/Audio) and the door-tier glyphs (shut, open, wide open; #5 and #6 put
  them on #14 and #15 together). Both are #15's to draw, in ink and never tinted. A door tier
  must not use a gate shape. The open notch and the closed glyph are gates, and "open" names
  both a method's verb and a door's tier, so a shared shape would make a score read as a
  method's act (Open Questions 12).

**MK3. Verb notches show the direction.** A notch is a 0.45 em mark at the glyph's inline-end
baseline corner, in the same colour and form (solid or hollow) as its glyph. The notches are
shared by every method, so a new method adds one glyph and no notch.

| Notch | Shape | Verb (#7 W3) | Trail step it marks |
|---|---|---|---|
| **raise** | A chevron pointing up | feed | A method `add` with a positive operand, and in general any method step whose result is above the previous value |
| **quench** | A chevron pointing down onto a short floor bar | quench | A method `set` to 0 on a contribution |
| **open** | Two short uprights with a gap between them: an open gate | open | A method `set` of `enabled` to 1 |
| *lower* (reserved) | A chevron pointing down, with no floor bar | — | Any method step whose result is below the previous value but above 0. No MVP verb produces it. It exists so that re-pricing (#7 Open Question 4) has a mark ready |

- **Direction is the value's, never the player's.** Raise means the number went up, whatever the
  number is. A raised duration would be slower. No notch, glyph or line means "better" or
  "worse", and no hue carries direction: no green, no red (concept colour philosophy: hue means
  method and nothing else; #9: "No green or red for a win or a loss").
- The notch answers #2 Open Question 6 ("should breakdowns show a direction for method `set`
  steps") with yes: a quench shows its notch and its signed change (BD3).

**MK4. Solid and hollow.**

- **Solid**: the glyph filled in the circulating method's tint. Only the method `committed`
  names is ever solid, and only after the commit.
- **Hollow**: the glyph's stroke traced as a 1.5 px outline with an empty interior, in ink. It is
  used for every reference to a method that is not circulating now: both methods before the
  commit (the method-choice view and the commit dialog), the other method after the commit
  (closed marks, MK5), and the last-run line's method (#11 UI Requirement 5), which describes a
  past run even when it is the same method.
- Before the commit, whether a hollow glyph takes a colour is the Forge screen's (#15 owns the
  accent before the commit; systems index paragraph 15). This spec requires only that the
  hollow form is drawn, so the view reads in greyscale.
- In greyscale, solid versus hollow tells the circulating method apart from any other glyph on
  screen.

**MK5. The closed mark (a route the circulating method does not open).**

- It reads: the neutral **closed glyph**, then "Opens under", the opening method's **hollow**
  glyph, then that method's name. The row text is #9's ("The row stays, named, with a closed
  glyph and 'Opens under {method}'"). This rule adds the hollow glyph.
- The row keeps **full contrast and full height**: it is never greyed, dimmed, faded,
  collapsed or moved to the end. It offers no Start (#9 States and Transitions).
- Under Ember Breath the Still Deep is **one** closed row (#9). Under Still Water each of the
  three Ember Breath hunts is its own closed row, because each is its own source.
- The same closed mark leads every "Closes:" line of the commit dialog and the method-choice
  view, with the hollow glyph of the method that opens that route. On "Closes: {method}" it is
  that method's own glyph.
- The opening method is the one method whose change set opens the source (#7 W4.3: each opened
  source belongs to exactly one method).
- A route hidden by its `reveal` stays hidden. Hidden wins over withdrawn (#1 F7), except in the
  method-choice view (#1 Edge Cases, "Before the commit"). In the MVP every route has no
  `reveal` (#9), so all nine routes are visible from the first screen.

**MK6. One accent.** After the commit the only hue on screen is the circulating method's tint
(concept principle 1). It is used on solid glyphs, notches, channel underlines and #13's
persistent identity, and on nothing else. A hollow glyph never takes a tint after the commit.
Heap state, spill, full stores, verdicts, tiers and seals use no hue (#3, #6, #9, #10).

**MK7. An ingredient not in hand.** Its base contribution is never shown (#1 Edge Cases,
"Before the commit"; #6 G7.3). So a marked contribution of an unheld ingredient shows only the
method's delta, with the mark on the delta: "+10" with a raise mark, or the word "quenched" with
a quench mark. This holds before the commit (nothing is held) and after it, until the
ingredient's high-water mark (#1 F1) first reaches 1. A `set` to anything but 0 shows "changed"
and the glyph with **no notch** while the base is hidden (#1 AC-U-1), because a raise or lower
notch would reveal which side of the base the new value lies on. No MVP method has one (#7 H1).

**MK8. Two marks on one value.** A value with both a method step and a heap step shows the
method mark on the number and the heap line in its breakdown, each on its own (#10 Visual/Audio).
No MVP value has both (#7 W3 keeps methods off outputs and durations).

**MK9. Persistent identity.** After the commit #13's persistent context shows the method's name,
its solid glyph and its tint (#7 UI Requirement 3; rule 32). Before the commit it shows no
circulating method. #13 owns the placement.

**MK10. The mark table.** Each method's glyph, silhouette class and tint tokens live in one
interface table keyed by method id. They are not content fields (#7 W2). A build-time test fails
when a content method has no entry, when two entries share a silhouette class, or when an entry
names a method content lacks.

### Breakdown rules (BD)

**BD1. Scope: every rule-derived number has a breakdown.** A rule-derived number is either:

- a **pipeline value**, one leaf of the effective set with a trail (#2 P8): contributions,
  bills, outputs, durations, caps. Its breakdown is a **trail breakdown** (BD3).
- a **composed number**, computed by an owning system's pure function from other numbers: totals,
  affinities after a clash, stats, scores, tiers, seals, projections, room. Its breakdown is a
  **composed breakdown** (BD5).

**State numbers** are counted, not derived: what is held, a unit's progress, the rest bank, and
amounts in the log. No modifier can act on them and they have no base, so they have no
breakdown. Their container shows the rule-derived number that bounds them, with its breakdown:
the cap beside held, the duration beside progress. This reads the index's "every number opens a
breakdown of base and modifiers" as every number that *has* a base and modifiers. It is
recorded here as an interpretation, for `/ux-review` to check.

**BD2. Reach: inside the record (D3).**

- Tapping, clicking, or pressing Enter or Space on a record opens #13's container. The container
  shows the record's fields in rule 33's one schema. Each rule-derived number in it carries its
  breakdown block directly under its own line, already expanded.
- A pipeline value with **no steps** (a base-only number, which is most bills, durations and
  outputs) shows the bare number and no lines. A number with no lines beneath it is as written,
  and nothing changes it.
- A composed number always shows its parts, because a total with nothing under it would not
  explain itself.
- Neither marks nor numbers are separate tap targets. Hovering shows nothing that a tap does not
  (MVP required item 8).

**BD3. Trail lines.** A trail breakdown lists, in this order and never re-sorted:

1. **Base**, the trail's `base`;
2. one line per step, in trail order (#2 P8.1: method, then Foundation, then its limit, then
   tending, then its limit; several `add` entries of one stage in source id order). Each line has
   its stage's glyph, its cause (BD4) and its **signed change**, the step's `result` minus the
   previous result (or minus `base`);
3. a rule, then **Total**, the trail's `final`, which equals the number on screen (#2 P8.2.2).

The signed change is the only arithmetic a breakdown does: a subtraction of two integers the
trail already holds. It never calls the ops table, never recomputes, and never rebuilds a line
from content (#2 P8.3). The replay invariant (#2 P8.2.1) makes the column add up from Base to
Total exactly.

**BD4. What each line says** (ledger tone, #2 Player Fantasy):

| Line | Glyph | Cause | Amount |
|---|---|---|---|
| The authored value | none | "Base" | the value |
| Method feed (`add` on `contrib`) | solid mark with the raise notch | "{method} feeds" | "+n" |
| Method quench (`set` 0 on `contrib`) | solid mark with the quench notch | "{method} quenches" | "−n" (BD7 when not held) |
| Any other method step (none in the MVP) | solid mark, raise or lower notch by its sign | "{method} changes" | the signed change |
| Foundation entries | none, grouped under one "Foundation" label line | "{ingredient name}" (#6 G11.3: each entry's source is its ingredient) | "+n" |
| Tending | the heap glyph | "Heaped · {source name}" (#10 D3.3) | "+n", or "+1.25 s" on a duration |
| A limit (a clamp step) | the limit glyph | "Limit (highest allowed)" or "Limit (lowest allowed)" | the signed change |
| The final value | none | "Total" | the value |

- Amounts use #13's number format (grouping, durations such as "3 min 30 s") with tabular
  figures and a true minus sign (U+2212).
- A route has no number for its `enabled` value, so its container shows one line instead of a
  breakdown: "Opened by {method}" with the solid open mark for a route the circulating method
  opened, the closed mark (MK5) for a closed route, and nothing for a route every method has.

**BD5. Composed breakdowns.** A composed breakdown lists its **parts** and its **operation
lines** exactly as the owning function returns them, then "Total". It never computes a part.
Where the owner's result lacks a part this spec needs, that is a requirement on the owner's
result-type ADR (Open Questions), never arithmetic in the interface. A part that has its own
breakdown ends in "›" and drills down (BD6). A marked part carries its mark (MK1.2). A composed
breakdown never shows what the owner withholds. On the forge screen it reads only what
`preview` returns (#6 G7), so a plan that is not previewable has no seal, score, tier or cap
breakdown, and its held part shows totals, affinities after clash and stats only.

| Composed number (words provisional; #15 names them, #6 UI Requirement 8) | Owner | Parts and operation lines, in the owner's order |
|---|---|---|
| An affinity total | #6 S1, `foundationStats` | Each ingredient's contribution (a trail; marked where it is in `changed(m)`) › |
| An affinity after its clash | #6 S2 | The total ›; "Clash with {opposite} {opposite's total}" and the amount taken off, which the owner returns (#6 Visual/Audio: "a clash is never shown only as a lower number"). The words never state the share ("half"), because `CLASH_BP` is a tuning knob |
| A Foundation stat (might, guard, vigor, speed) | #6 S3 | "Body" (`FOUNDATION_BASE`); the affinity after its clash ›; a limit line if `STAT_MAX` cuts it |
| A door's proving score and tier | #6 S4, #5 F7 | The Foundation's four stats (each ›) against the door opponent's four; the decider in stat terms (#5); the two thresholds and the tier word |
| Seals | #6 S5 | Each door's tier ›, then the sum |
| A route's projection (verdict, Life kept) | #5, #9 | The baseline combatant's four stats against the creature's four; the decider; Life kept with its base ("keeps 19 of 100 Life"). The verdict carries no hue (#9) |
| A cap in the forge preview | #6 `foundationEntries` | Laid out as a trail: the base cap, a "Foundation" label, one line per entry by ingredient |
| Room in a store | #3 | The cap ›; what is held |
| The best seal count (the headroom signal) | #6 G7.4 | No parts. One line: "The most seals any Foundation here holds under {method}". It never names a makeup (#6 G7.4) |

Any other derived number that #13 or #15 shows must name its owner function and its parts in
that spec, in this table's form.

**BD6. Drill-down.** Activating a part line replaces the container's content with that part's
breakdown, in the same frame. A **back line**, "‹ {parent label} {parent value}", comes first in
focus order.

- Back returns to the parent and puts focus on the part line that was opened.
- Esc closes the whole stack, and opening another record clears it (#13).
- Depth is unbounded. The MVP's deepest chain is six levels: seals, a door's score, a stat, an
  affinity after its clash, the affinity total, and one ingredient's contribution trail.
- The stack is interface state of #13's container and is never saved.

**BD7. An ingredient not in hand (the hidden base).** A contribution's breakdown for an
ingredient never yet held (its high-water mark, #1 F1, is 0) shows "Base shown once {ingredient} is in hand" instead of the Base line. A feed shows
"+n" and a quench shows "quenched" with no number, since "−n" would reveal the base. There is no
Total line. Before the commit, nothing is held. Each method that changes the value then gets its
own line with its hollow mark ("Ember Breath feeds +10"), and a method that does not change it
gets none. After the commit only the circulating method's line remains.

**BD8. Words kept out.** Breakdowns never say stage, op, clamp, trail, modifier, patch, buff,
bonus or boost (#2, #7 and #10 Tone). The player-facing verbs are feeds, quenches, opens,
heaped and limit.

**BD9. A breakdown shows the truth and nothing else.** It never merges, hides, rounds or
re-orders a step, and it adds no line the trail or the owner did not produce. Two `add` steps
that cancel both stay (#2 Edge Cases). A line that rounded to nothing was never an entry (#6 S6).
So a seal input's breakdown can hold a "Heaped" line only if #2 P10 were broken. The display
test for that is AC-14-07.

### ASCII Wireframe

Host layouts belong to #13 and #15. These frames show only how marks and breakdowns sit inside
them, at the phone width that #13 holds from the MVP (390 px, about 44 characters). Numbers are
the MVP's provisional content (#6 S9, #3, #8, #9, #10).

**Legend:** `[EB↑]` solid Ember Breath glyph with the raise notch, in the tint. `[EB⤓]` the same
with the quench notch, and `[EB⊓]` with the open notch. `(SW)` hollow Still Water glyph in ink,
and `(EB↑)` a hollow glyph with a notch. `══` the channel underline. `▥` the closed glyph. `◠`
the heap glyph. `⊣` the limit glyph. `›` a part that drills down. `‹` the back line.

**W1. Marks in place: circulating Ember Breath, Ember Marrow not yet held.**

```
┌──────────────────────────────────────────┐
│ [EB] Ember Breath           #13 context  │
├─ #15 ingredients ────────────────────────┤
│ Ember Marrow · not held                  │
│   Cinder +10[EB↑]                        │
│          ═══                             │
│ Ironbark Heartwood · held                │
│   Cinder 30   Jade 0[EB⤓]   Bark 30      │
│                    ═                     │
│   Gale 0                                 │
│ Cloud Lotus · held                       │
│   Cinder 25   Jade 10   Bark 0   Gale 45 │
├─ #13 routes ─────────────────────────────┤
│ Salamander Hunt [EB⊓]                    │
│   pays Ember Marrow                      │
│ Bear Hunt                                │
│   pays Ironbark Heartwood                │
│ ▥ Still Deep                             │
│   Opens under (SW) Still Water           │
└──────────────────────────────────────────┘
```

**W2. A trail breakdown in #13's container: Ember Marrow, held.**

```
┌ #13 container ───────────────────────────┐
│ Ember Marrow                       held  │
│ Cinder                       35 [EB↑]    │
│                              ══          │
│    Base                            25    │
│    [EB↑] Ember Breath feeds       +10    │
│    ──────────────────────────────────    │
│    Total                           35    │
│ Jade                                5    │
│ Bark                                0    │
│ Gale                                5    │
└──────────────────────────────────────────┘
```

**W3. A cap after the forge** (Echo Jade, Ironbark Heartwood, Ember Marrow and Cloud Lotus under
Ember Breath, #6 S6 example). No line carries a method mark (MK1.3).

```
┌ #13 container ───────────────────────────┐
│ Ash Tallow                  held 52 / 60 │
│ Cap                                 60   │
│    Base                             40   │
│    Foundation                            │
│      Cloud Lotus                    +3   │
│      Echo Jade                      +7   │
│      Ember Marrow                   +5   │
│      Ironbark Heartwood             +5   │
│    ──────────────────────────────────    │
│    Total                            60   │
└──────────────────────────────────────────┘
```

**W4. A composed breakdown and its drill-down** (the same four ingredients, held, on #15's plan;
#6 S1–S3). Each frame replaces the one before it in the same container.

```
┌ Might ───────────────────────────────────┐
│ Might                              135   │
│    Body                             20   │
│    Cinder after clash          115   ›   │
│    ──────────────────────────────────    │
│    Total                           135   │
└──────────────────────────────────────────┘
              │ activate "Cinder after clash"
              ▼
┌──────────────────────────────────────────┐
│ ‹ Might 135                              │
│ Cinder after clash                 115   │
│    Cinder total                130   ›   │
│    Clash with Bark 30              −15   │
│    ──────────────────────────────────    │
│    Total                           115   │
└──────────────────────────────────────────┘
              │ activate "Cinder total"
              ▼
┌──────────────────────────────────────────┐
│ ‹ Cinder after clash 115                 │
│ Cinder total                       130   │
│    Cloud Lotus                  25   ›   │
│    Echo Jade                    40   ›   │
│    Ember Marrow           35 [EB↑]   ›   │
│    Ironbark Heartwood           30   ›   │
│    ──────────────────────────────────    │
│    Total                           130   │
└──────────────────────────────────────────┘
              │ activate "Ember Marrow" → W2's Cinder block
```

**W5. A heaped gatherer** (#10, HEAP_YIELD_BP 4,000, HEAP_TIME_BP 12,500; #8 row
`skim_ash_pits`).

```
┌ #13 container ───────────────────────────┐
│ Skim the Ash Pits                heaped  │
│ Ash Tallow per unit                  7   │
│    Base                              5   │
│    ◠ Heaped · Skim the Ash Pits     +2   │
│    ──────────────────────────────────    │
│    Total                             7   │
│ Time per unit                   6.25 s   │
│    Base                            5 s   │
│    ◠ Heaped · Skim the Ash Pits +1.25 s  │
│    ──────────────────────────────────    │
│    Total                        6.25 s   │
└──────────────────────────────────────────┘
```

**W6. The method-choice view before the commit**, one method's column. The layout is #15's.
Hollow marks only (MK4), and no absolute contribution (MK7).

```
│ (EB) Ember Breath                        │
│   Ember Marrow: Cinder +10 (EB↑)         │
│   Ironbark Heartwood: Jade               │
│     quenched (EB⤓)                       │
│   Opens: Salamander Hunt (EB⊓)           │
│   Opens: Heron Hunt (EB⊓)                │
│   Opens: Crab Hunt (EB⊓)                 │
│   ▥ Closes: Still Deep I (SW)            │
│   ▥ Closes: Still Deep II (SW)           │
│   ▥ Closes: Still Deep III (SW)          │
```

**W7. The commit dialog's generated lines, Ember Breath** (layout #15's; lines from #1 R7.2 as
amended by A10, in triple order, then #7's gives-up lines and the redo line).

```
│ (EB) Begin circulating Ember Breath      │
│ {commitText}                             │
│ (EB↑) Feeds: Ember Marrow: Cinder        │
│ (EB⊓) Opens: Crab Hunt                   │
│ (EB⊓) Opens: Heron Hunt                  │
│ (EB⊓) Opens: Salamander Hunt             │
│ (EB⤓) Quenches: Ironbark Heartwood: Jade │
│ ▥ (SW) Closes: Still Water               │
│ ▥ (SW) Closes: Still Deep I              │
│ ▥ (SW) Closes: Still Deep II             │
│ ▥ (SW) Closes: Still Deep III            │
│ Redo: only by starting a new run         │
│              [ Cancel ]  [ Begin ]       │
```

### Layout Zones

The spec has no screen zones of its own. Its components lay out like this inside their hosts:

| Zone | Host | Arrangement |
|---|---|---|
| **Inline mark** | Any number or route name | `number · thin space · glyph+notch`, at the number's inline-end. The channel underline sits under the number's sign and digits. The mark never wraps away from its number: number, unit and mark form one no-break unit |
| **Breakdown block** | #13's container, directly under the number's line | Indented 1.25 em. Three columns: a glyph column (1.25 em, empty when a line has no glyph); a cause column (`1fr`, which wraps and never truncates); an amount column (auto, at least 7 ch, right-aligned, tabular figures, never wraps). A hairline rule precedes "Total". Lines are at least 1.4 em tall |
| **Part line** | Inside a composed block | The whole line is the target: cause, amount, mark, then "›" at the inline-end. At least 44 px tall on touch |
| **Back line** | The first row of the container's content when depth > 0 | Full width, at least 44 px tall: "‹ {parent label} {parent value}" |
| **Closed row** | #13's and #15's route lists | The closed glyph at the row's inline-start, where an open row has none; the name; then on the same line, or wrapped beneath at phone width, "Opens under" with the hollow glyph and the method's name |

At 390 px the container is about 358 px wide inside #13's 16 px gutters. A cause of two 24-code-
point names ("Heaped · Skim the Ash Pits") wraps onto a second line, and the amount column keeps
its width. Nothing scrolls sideways.

### Component Inventory

| # | Component | Type | Shows | Interactive | Pattern |
|---|---|---|---|---|---|
| C1 | Method glyph | Inline SVG symbol | A method's identity, solid or hollow (MK2, MK4) | No | **New:** Method glyph |
| C2 | Verb notch | Part of C1 | raise, quench, open, lower (reserved) (MK3) | No | **New** |
| C3 | Method mark | C1 + C2 + tint + channel underline | A marked value (MK1, MK2) | No; its host record is | **New:** Method mark |
| C4 | Closed mark | Closed glyph + "Opens under" + hollow C1 + name | A route the circulating method does not open; "Closes:" lines (MK5) | No | **New:** Closed mark |
| C5 | Neutral stage glyphs | Inline SVG | Heap and limit (BD4) | No | **New**; the heap shape is shared with #13's toggle |
| C6 | Trail breakdown | Ledger block | Base, steps, Total (BD3, BD4) | No | **New:** Number breakdown |
| C7 | Composed breakdown | Ledger block | Parts, operation lines, Total (BD5) | Parts only | **New:** Number breakdown (composed) |
| C8 | Part line | Full-width button | A part's name, value, mark and "›" | Yes: drill down | **New:** Drill-down line |
| C9 | Back line | Full-width button | "‹ {parent label} {value}" | Yes: up one level | **New:** Drill-down line |
| C10 | Hidden-base line | Text line | "Base shown once {ingredient} is in hand" (BD7) | No | — |
| C11 | Route method line | Text line | "Opened by {method}" with the open mark, or the closed mark (BD4) | No | — |
| C12 | Persistent identity | Solid C1 + tint + name | The circulating method (MK9) | Per #13 | #13 places it |

No interaction pattern library exists yet (`design/ux/interaction-patterns.md`). Every pattern
marked **New** is flagged for it (Open Questions).

### Information Hierarchy

**On a marked value**, in order of importance:

1. **The number**, in ink and unchanged. The mark never competes with it.
2. **The glyph**: which method.
3. **The notch**: which verb, and so which direction.
4. **The tint**: the method at a glance in colour. It repeats what the glyph says and is never
   alone.

**In a breakdown block:**

1. The number's final value, on the number's own line, as the record shows it.
2. Where it starts: Base, or the hidden-base line.
3. Each change in order, as cause and signed amount. The glyph names the kind of change: a
   method, the Foundation group, a heap, a limit.
4. Total, which matches line 1.
5. *Discoverable with one more activation:* a part's own breakdown (BD6).

**On a closed row:**

1. The route's name, at full contrast.
2. The closed glyph: it cannot run under this method.
3. "Opens under" and the other method's hollow glyph: where it would run.
4. *In its container:* the route's facts, as for any route (bill, time, what it pays, its
   projection), all readable (#7 UI Requirement 4, "the other method stays readable").

---

## States & Variants

**Run states** (from #7 States and Transitions and #2 States and Transitions):

| State / Variant | Trigger | What marks show | What breakdowns show |
|---|---|---|---|
| **Choosing** (default on a new run) | `committed` is none | No value in the world is marked, because nothing a method changes is in force (#7 promise 1). The method-choice view and the commit dialog show each method's change set with **hollow** marks (MK4). Routes show "Needs a method committed", #1 R5.5's generated need text, with no closed mark (#9 Waiting) | Pipeline values show `checked`, the authored base, with no steps (#2: no effective set is in play). Contribution breakdowns follow BD7, with one hollow line per method that changes the value |
| **Circulating m** | `commit(m)` (#7 W7.5) | Solid marks on exactly `changed(m)` (MK1). Closed rows for every route only another method opens (MK5). Persistent identity solid (MK9) | Trails hold method steps (#2) |
| **Circulating m, heaped** | An accepted `setHeap` (#10) | Unchanged. Heaping is the player's choice, not the method's (#10), so it adds no mark | A heap line on the heaped gatherer's output and duration (W5) |
| **Forged** | `forge` (#6 G8) | Unchanged. Foundation lines are unmarked (MK1.3) | Caps gain a "Foundation" group (W3). Stats, scores and seals read the forge snapshot (#6 G10, G13) |
| **Forged, heaped** | Both | As Forged | Foundation group, then its limit, then the heap line, then its limit (BD3) |

**Per-value variants:**

| Variant | Trigger | What changes |
|---|---|---|
| Ingredient not held | Its high-water mark is 0 (#1 F1) | The mark sits on the delta or on "quenched". The breakdown uses BD7. No base or Total |
| Ingredient held | Its high-water mark first reaches 1 (#1 F1) | The full contribution, its mark, and the full trail (W2). It never goes back to hidden: BD7 reads the high-water mark, not current `held`, so the forge consuming the ingredient (#6 G9) does not hide a base the player has already seen. *[Interpretation of #1's "never shown before the ingredient is in hand"; #6 to confirm at review (Open Questions).]* |
| Base-only value | A trail with no steps | The bare number, with no lines and no mark (BD2) |
| A limit reached | A clamp step in the trail (#2 P6) | A limit line with its glyph and signed change. Example: a duration clamped up to 1 ms reads "Limit (lowest allowed) +n" |
| Two adds that cancel | Steps +20 and −20 (#2 Edge Cases) | Both lines stay. Total equals Base |
| A long trail | Up to 35 steps (#2 M5) | The container scrolls vertically (#13). The MVP's longest trail is 5 lines (a cap: 4 Foundation entries and a limit) |
| A composed number with no parts | The best seal count (BD5) | One sentence line, no Total |

**Empty, loading and error states:**

| State | Trigger | What the player sees |
|---|---|---|
| **Empty: no rule-derived number** | A record whose container shows only text (a key item before it is made, a log entry) | No breakdown block. Nothing says "no breakdown" |
| **Empty: no changes** | Every pipeline value of a record is base-only (most of the hearth road, #8) | Bare numbers only. The hearth road stays unmarked (#8 Visual/Audio 1) |
| **Loading** | None. Trails and owner results are in memory once content loads and recompute runs (#2 P9; #1 R8.1: no network, no loading state) | Nothing to show. A breakdown never shows a spinner or "computing" |
| **Error: a number with no trail or owner parts** | A developer bug: a rule-derived number rendered outside the pipeline or an owner function | Developer-only. A build-time test fails (AC-14-16). If one reaches a build, the number shows bare, with no invented lines and no "?" placeholder, and a console error names the record and field |
| **Error: a method with no mark entry** | Content gains a method that the mark table (MK10) lacks | Developer-only. The build-time test fails, and no build ships |
| **Error: a trail that does not replay** | Impossible by #2 AC-P8-1 | The breakdown prints the trail as is and never "corrects" it (BD9). #2's property test is the guard |

**Display variants** (environment, not game state):

| Variant | Trigger | What changes |
|---|---|---|
| Greyscale, or colour vision differences | Any | No information is lost: glyph silhouette, notch, solid versus hollow, and the underline's presence carry everything (concept principle 3). After the commit only one hue is on screen (MK6), so a colour-vision difference cannot confuse two methods |
| Forced colours (Windows High Contrast) | `forced-colors: active` | Glyphs, notches and underlines draw in `CanvasText`. The tint is dropped, and the glyph carries the identity |
| Reduced motion | `prefers-reduced-motion: reduce` | No underline draw-in at the commit. The marks appear complete (Transitions & Animations) |
| Phone width (≤ 650 px, about 390 px) | #13's layout | The closed row's "Opens under" wraps beneath the name. Breakdown causes wrap. Part and back lines are at least 44 px tall |
| A content update (#11 load notice) | A new content fingerprint | Nothing special. Marks and breakdowns read the new content's recompute. A saved Foundation's lines apply on the new base (#2 Edge Cases) |

---

## Interaction Map

Mapping interactions for **keyboard and mouse, and touch** (`.claude/docs/technical-preferences.md`
Input Methods). Gamepad support is **None**, so there is no gamepad mapping. That file's
"Primary Input: mouse with hover tooltips" and "Touch: Partial (ⓘ pins tooltips)" come from the
archived attempt and conflict with MVP required item 8. This spec follows the MVP: nothing is
hover-only, and the container opens by tap or click (Open Questions).

Marks, glyphs, notches, closed marks and non-part breakdown lines are **not interactive**. The
only targets this spec adds are part lines and back lines. Opening and closing the container are
#13's, and are listed here only for the path through.

| Component | Action | Mouse | Touch | Keyboard | Immediate feedback | Outcome |
|---|---|---|---|---|---|---|
| A record (#13, #15 host) | Open its container | Click | Tap | Enter or Space on the focused record | #13's | The container shows the record's fields, and each rule-derived number shows its breakdown block (BD2) |
| C3 mark, C4 closed mark, C1 glyph | — | Hover does nothing; click goes to the host record | Tap goes to the host record | Not focusable | — | Its meaning is read in the host's container and in its accessible name (Accessibility) |
| C8 part line | Drill down | Click | Tap | Enter or Space; Tab and Shift+Tab move between part lines | #13's pressed state on the line. The content swaps in the same frame | That part's breakdown, with a back line first. Focus moves to the back line (BD6) |
| C9 back line | Up one level | Click | Tap | Enter or Space | The content swaps in the same frame | The parent breakdown. Focus returns to the part line that was opened |
| Container (#13) | Close | #13's close control or dismiss rule | #13's | Esc, at any depth | #13's | Closes and clears the stack. Focus returns to the record that opened it |
| A breakdown longer than the container | Scroll | Wheel | Vertical swipe | Arrow keys and Page Up/Down while focus is in the container | — | #13's scroll. No horizontal scroll at any width |

- **Right-click** is not handled: the browser's own menu appears, and nothing in this spec
  defines a context menu.
- **Long-press** is not used.
- **Hover** has no effect anywhere in this spec. It may show the browser's default pointer only.
  Part and back lines may show #13's hover style as a pointer affordance, but never content that
  a tap would not show.

**Navigation to other specs:** opening and closing go to #13's container
(`design/ux/interface-shell.md` C16, aligned with this spec at commit 1eca986). The forge screen's hosts are #15's (not yet written). There are no other
targets.

---

## Data Requirements

Marks and breakdowns are **read-only**. They hold no game state, write nothing, and fire no
action (rule: the interface holds no game rules, systems index Presentation Layer). Everything
below is read. The drill stack is #13's interface state and is never saved.

| Data | Source system | Read / Write | Notes |
|---|---|---|---|
| Each pipeline value's trail: `base`, ordered steps `{stage, source, op, operand, result}`, `final` | Modifier pipeline #2 P8 | Read | The only source of trail breakdowns (BD3). Never recomputed (#2 P8.3). How #14 addresses a trail is #2's ADR 2 |
| Effective values | #2 P9 `effective` | Read | `final` is the value shown (#2 P8.2.2) |
| Both methods' frozen-set trails before the commit | #2 P8.4 | Read | Hollow marks and BD7's per-method lines in the method-choice view |
| `committed`, a method id or none | Methods #7 W12 | Read | Solid versus hollow (MK4); which routes are closed (MK5) |
| `committed {method}` event | #7 W7.5 step 7 | Read (subscribe) | Marks turn solid in that frame (Transitions & Animations) |
| Route state (Closed, Waiting, …) | Fight and dungeon routes #9 States; #1 F7 (`withdrawn`) | Read | Closed rows (MK5). #9 owns the row's words |
| The method that opens a closed source | #7 W4.3, from `changed(m)` (#1 F8) | Read | "Opens under {method}" (MK5) |
| Commit dialog lines, each with its kind (feed, quench, open, change, close) | #1 R7.2 `closesLines` (as amended by A10), #7 W1 `givesUpLines` | Read | The notch per line (W7). **Requires** the result type to carry each line's kind, so the interface never parses the line text (#7 ADR 1; Open Questions) |
| Record names | #1 R7.2 `name` | Read | Every cause label (BD4) and the method names |
| Each ingredient's high-water mark | Content records and schema #1 F1 (kept by #3, #4) | Read | The hidden base (MK7, BD7): 0 hides the base, 1 shows it |
| Totals, affinities after a clash, **the clash amount taken**, the four stats, the body base | Forge and proving #6 `foundationStats` (S1–S3) | Read | Composed breakdowns (BD5). **Requires** the result to carry the clash amount taken and each stat's limit cut, if any, because `max(0, …)` makes it impossible to derive from the shown numbers (#6 ADR on result types; Open Questions) |
| Door scores, tiers, thresholds, seals; `bestSeals` | #6 `seals`, S4, S5, G7.4; Combat resolver #5 F7 | Read | BD5 rows. #5 returns the decider in stat terms (#5 Visual/Audio) |
| Route projections: verdict, Life kept and its base, decider, both sides' stats | #5, #9 | Read | BD5 row |
| Foundation entries `F` (the forge snapshot) | #6 G10, G11; Save and run lifecycle #11 | Read | Cap breakdowns (W3). Preview caps from `foundationEntries` (BD5) |
| The heap choice `T` | Tending #10 | Read | Heap lines (W5) |
| Room in a store | #3 | Read | BD5 row |
| The mark table: glyph path, silhouette class and tint tokens per method id | **This spec** (MK10), an interface constant | Read | Not content (#7 W2). Checked by AC-14-15 |
| Words: "Base", "Total", "Foundation", "{method} feeds", "{method} quenches", "{method} changes", "Opened by {method}", "Opens under {method}", "Heaped · {source}", "Limit (highest allowed)", "Limit (lowest allowed)", "Base shown once {ingredient} is in hand", "Clash with {opposite} {total}", "Body" | **This spec**, keyed interface strings | Read | Localization. "Opens under {method}" is #9's text, reused |
| Number format (grouping, signs, durations) | Interface shell #13 | Read | BD4 |

**Architecture flags.** None of this needs the interface to own state. Three needs go to ADRs
that the owning GDDs already list:

1. #2's ADR 2 (the trail representation and how #14 addresses one);
2. #7's ADR 1 (W1 result types: each dialog line carries its kind);
3. #6's result-type ADR (`foundationStats` carries the clash amount and stat limit cuts).

---

## Events Fired

| Player action | Event fired | Payload / data |
|---|---|---|
| Open a record's container | None from this spec. #13's container is interface state | — |
| Activate a part line (drill down) | None. Interface state only | — |
| Activate the back line | None | — |
| Close the container | None (#13) | — |

No action in this spec changes persistent state, the save, progress or the economy. There is no
analytics system in the MVP, so nothing is sent.

**Events this spec consumes** (all emitted by the rules core; #13 subscribes and redraws):

| Event | Emitted by | Effect here |
|---|---|---|
| `committed {method}` | #7 W7.5 | Marks turn solid; closed rows appear; the underline draw-in plays (Transitions & Animations) |
| `forged`, `capChanged` | #6, #3 | Cap breakdowns gain Foundation lines; Foundation stats read the snapshot |
| A tending change (an accepted `setHeap`, then recompute) | #10, #2 P9.3 | Heap lines appear or leave |
| A new run | #11 | Every mark and closed row is removed (Choosing) |
| A save loaded | #11 | Everything is rebuilt from the recompute |

---

## Transitions & Animations

- **Breakdown enter and exit.** Breakdown blocks have no animation of their own. They appear and
  leave with #13's container, which owns its open and close transition.
- **Drill down and back.** The content swaps in one frame with no slide and no fade, so the
  reading position stays put at phone width. Focus moves as BD6 says.
- **The commit** (the one in-screen state change this spec animates; #7 Visual/Audio, "the tint
  moves through the interface when the commit lands"):
  1. **In the commit frame** (#7 Game Feel, "instant"; AC-W7-4), all at once:
     - the circulating glyph turns from hollow to solid in its tint;
     - every value in `changed(m)` gains its solid mark;
     - every route only the other method opens becomes a closed row.
     Every value, glyph and row is in its final state in that frame.
  2. **Decoration after it:** each channel underline draws from inline-start to inline-end over
     **240 ms**, ease-out. Underlines start in reading order, 20 ms apart, and the whole sweep
     ends within **400 ms** of the commit.
     - The sweep never blocks input or delays a value.
     - Opening a container during it shows final content.
     - Under `prefers-reduced-motion: reduce` there is no draw-in, and the underlines appear
       complete in the commit frame.
  3. **Seams:** #13's persistent identity and shell tint change, and #15's dialog close, run on
     the same `committed` event. They must not wait for this sweep.
- **A new run.** Every mark and closed row is removed in the new run's first frame, with no
  animation. The world is simply unmarked again.
- **The forge.** Cap and stat breakdowns change in the frame of `forged` and `capChanged`. The
  forge's visual event is #15's.
- **A heap change.** Heap lines change in the frame of the accepted `setHeap`. Nothing animates
  between the two states (#10 Game Feel).
- **Safety.** No flashing and no motion longer than 400 ms. No animation repeats. Nothing in this
  spec can trigger photosensitivity.

---

## Input Method Completeness Checklist

Platform target: keyboard and mouse, and touch. **Gamepad is dropped**: gamepad support is None
(`.claude/docs/technical-preferences.md`). An item is ticked only where the Interaction Map
already specifies it; the rest go to Open Questions. The only targets this spec adds are part
lines and back lines (C8, C9). The container around them is #13's.

**Keyboard**
- [x] All interactive elements are reachable with Tab alone: part and back lines are buttons in
  the container's tab order (Interaction Map).
- [x] Tab order follows reading order: the back line first, then part lines in block order (BD6).
- [x] Every mouse action can be done by keyboard: Enter or Space activates, and Esc closes.
- [x] Focus is visible at all times: #13's 2 px focus ring, which is never removed
  (`design/ux/interface-shell.md` Accessibility, commit 1eca986). This spec adds no style of its
  own.
- [x] Focus stays inside the container while it is open, as a narrow bottom sheet, and goes back
  to the opening record on close (#13 C16, Interaction Map).
- [x] Esc closes the container at any depth and does not quit anything (Interaction Map).

**Mouse**
- [x] Hover states are defined for every interactive element: none show content. Part and back
  lines may take #13's pointer style.
- [x] Click targets are at least 44 px tall and full width (Layout Zones).
- [x] Right-click is the browser default; no context menu is defined.
- [x] Scroll wheel: #13's vertical scroll in the container. There is never horizontal scroll.

**Touch**
- [x] Every touch target is at least 44 × 44 px: part and back lines are full width and at least
  44 px tall.
- [x] Swipe gestures do not conflict with the system: only #13's vertical scroll is used, and no
  custom swipe.
- [ ] Every action works with one hand in portrait. #13 places the container as a bottom sheet on
  narrow widths, but the back line sits at the sheet's top. Whether that is in thumb reach on a
  tall sheet is left to #17 (Open Questions 6).
- [x] Long-press is not used.

---

## Accessibility

No accessibility tier is committed yet (`design/accessibility-requirements.md` does not exist;
concept Open Question; #18 decides at the vertical slice). This spec meets the MVP floor in
systems index paragraph 18 (no hover-only interaction, no repeated or held input, glyph before
hue). It **assumes WCAG 2.2 AA as the baseline** until a tier is chosen (Open Questions 3).

**Colour independence (concept principle 3).** Every distinction this spec draws reads in
greyscale:
- which method: the glyph's silhouette class (MK2);
- circulating or not: solid against hollow (MK4);
- which verb: the notch (MK3);
- which value is marked: the glyph's presence and the channel underline;
- closed: the closed glyph;
- what kind of change: each breakdown line's glyph and words (BD4).

Hue adds the method's identity and is never alone. AC-14-04 tests it.

**Contrast.**
- Numbers and breakdown text stay in ink (MK2). Provisional ink on stone is 12.8:1 (light) and
  13.0:1 (dark), above 4.5:1.
- Glyphs, notches and underlines are non-text graphics and need at least 3:1 (WCAG 1.4.11). The
  provisional tint tokens below meet it on the provisional stone bases. #13 owns the base palette
  and the art bible owns the final values, and both must keep these minimums:

  | Token | Light (on #E9E5DE) | Dark (on #1E1C1A) |
  |---|---|---|
  | `--mark-ember-breath` | #B04A1C, 4.35:1 | #E0814F, 6.0:1 |
  | `--mark-still-water` | #2C6A8A, 4.73:1 | #6FA9C8, 6.62:1 |
  | `--ink` (numbers, neutral glyphs, hollow forms) | #24211E, 12.8:1 | #E6E1D8, 13.0:1 |

**Screen readers.**
- Glyph SVGs are `aria-hidden`. Every mark carries visually hidden words, so a marked number
  reads as one phrase:
  - "Cinder 35, Ember Breath feeds";
  - "Jade 0, Ember Breath quenches";
  - "Salamander Hunt, opened by Ember Breath".
- The same words apply before the commit, inside the method-choice view's own heading for each
  method.
- A closed row reads "Still Deep, closed, opens under Still Water".
- A breakdown block is a list labelled by its number's line. Each line reads as cause then
  amount, with the sign in words: "Base, 25"; "Ember Breath feeds, plus 10"; "Total, 35". Spoken
  signs never rely on how a reader voices U+2212.
- A part line is a button named "{cause}, {amount}, show breakdown". The back line is a button
  named "Back to {parent label}, {value}".
- On a drill, focus moves to the back line, which announces the new level. No live region is
  used, so nothing interrupts.
- The commit's arrival is announced by #13 and #15, not by this spec.

**Size and reflow.**
- Breakdown text is at least 14 CSS px. Glyph boxes are at least 14 px inline and 16 px where
  hollow (MK2).
- At 320 CSS px wide and at 200 % text zoom, nothing truncates or scrolls sideways (WCAG 1.4.10).
  Causes wrap, the amount column keeps its width, and a number never separates from its mark.

**Motion.** The only animation is the commit's underline draw-in, at most 400 ms. It is removed
under `prefers-reduced-motion: reduce` (Transitions & Animations).

**Forced colours.** Glyphs, notches and underlines draw in `CanvasText`, and the glyph carries
the identity once the tint is gone (States & Variants).

**Cognitive load.**
- One breakdown form everywhere: Base, changes, Total.
- One set of verbs (feeds, quenches, opens), one word for a clamp ("Limit") and one for a heap
  ("Heaped").
- The back line always names where it returns to.
- No timing. A trail breakdown changes only on the commit, the forge or a heap change (#2 P9.3,
  P9.4). #13 repaints an open card live, so a state number beside it (held, room) may move while
  it is being read, but its lines never reorder.

---

## Localization Considerations

- **Strings are keyed whole.** Each word in Data Requirements is one keyed template with its
  placeholders ("{method} feeds", "Opens under {method}", "Base shown once {ingredient} is in
  hand"), never built by concatenation, so word order can change per language. Translator note
  for "feeds" and "quenches": a method adds to, or takes away entirely, what an ingredient puts
  into an affinity (#7 W3).
- **Names come from content**: at most 24 code points, with no digits in any text field (#1 R4,
  R7.2), so every number on screen comes from a field and can carry a mark and a breakdown.
- **Numbers, signs and durations** use #13's locale-aware formatter ("6.25 s" may become
  "6,25 s"). The amount column uses tabular figures.
- **Direction and mirroring.** Layout uses logical properties (inline-start and inline-end), so
  in a right-to-left language the mark sits at the number's inline-end and the "›" and "‹"
  chevrons mirror. Method glyphs and notches **never mirror**: a glyph is an identity, and a
  notch's direction is up or down, not sideways.
- **Glyphs and notches are language-neutral.** Their meaning in words lives in the accessible
  names, which are keyed strings.

**40 % expansion check** (English to German or French). Rows marked **HIGH PRIORITY** must wrap
cleanly, never truncate:

| Element | English length | At +40 % | Behaviour |
|---|---|---|---|
| **HIGH PRIORITY** "Opens under {method}" on a closed row | about 24 characters | about 34 | Wraps beneath the route name at phone width (Layout Zones) |
| **HIGH PRIORITY** commit dialog line "Quenches: {ingredient}: {affinity}" | at most 60 code points (#7 Edge Cases, as amended by A3) | up to about 84 | Wraps; never truncates and never writes "and N more" (#7 Edge Cases) |
| **HIGH PRIORITY** "Base shown once {ingredient} is in hand" | up to 48 | up to about 67 | Wraps in the cause column |
| Breakdown causes ("Heaped · {source}", "Clash with {opposite} {total}") | up to about 36 | up to about 50 | Wrap in the cause column. Amounts never wrap |
| "{method} feeds" / "{method} quenches" | up to 33 | up to about 46 | Wrap in the cause column |
| Mark, notch, glyph | — | — | No text; unaffected |

---

## Acceptance Criteria

Tags: **[auto]** a unit or integration test on the rules core and the rendered DOM; **[manual]**
a human tester with the build. Tests use the MVP's provisional content (#6 S9, #8, #9, #10) or
#1's fixture where named. Each criterion can be checked without reading another document.

**Core purpose: the marked set**
- [ ] **AC-14-01** [auto] Under Ember Breath, with every ingredient held, exactly five elements
  carry a solid Ember Breath mark on every screen that shows them: Ember Marrow's Cinder (raise
  notch), Ironbark Heartwood's Jade (quench notch), and the Salamander, Heron and Crab Hunt rows
  (open notch). No other number or row carries a method mark: no total, stat, door score, tier,
  seal, cap, Foundation line, bill, output, duration or fight number.
- [ ] **AC-14-02** [auto] The same holds under Still Water, with exactly Echo Jade's Bark and
  Tidewater Pearl's Bark (raise) and the Still Deep I, II and III rows (open).
- [ ] **AC-14-03** [manual] **Swap test.** Two runs with the same ingredients held, one per
  method, are captured on the same screens. The elements whose marks differ between the two are
  exactly the union of the two methods' change sets plus the closed rows. Every other element
  that differs only in value is a derived number (total, affinity after clash, stat, score,
  tier, seal, cap) and carries no mark in either.
- [ ] **AC-14-04** [manual] **Greyscale identification.** A tester who has seen the glyph sheet
  for one minute is shown ten luminance-only screenshots: five per method, in shuffled order,
  with the method's name covered, taken from #13's main screen and #15's forge screen after the
  commit. The tester names the circulating method in all ten, and names the verb (feed, quench or
  open) of every marked value in at least nine.
- [ ] **AC-14-05** [auto] No mark, notch, line or row in this spec uses a hue other than the
  circulating method's tint after the commit. No green or red is used for direction, and a hollow
  glyph is never tinted after the commit.

**The closed route**
- [ ] **AC-14-06** [auto] Under Ember Breath, the Still Deep is one row with the closed glyph and
  "Opens under", Still Water's hollow glyph and "Still Water". It has the same text contrast and
  height as an open row and offers no Start. Under Still Water there are three closed rows, for
  the Salamander, Heron and Crab Hunts, each with Ember Breath's hollow glyph.

**Breakdown truth**
- [ ] **AC-14-07** [auto] With all three gatherers heaped, no breakdown of a contribution, affinity
  total, affinity after clash, stat, door score, tier or seal holds a "Heaped" line. "Skim the
  Ash Pits" reads: output Base 5, "Heaped · Skim the Ash Pits" +2, Total 7; time Base 5 s,
  "Heaped · Skim the Ash Pits" +1.25 s, Total 6.25 s, each heap line with the heap glyph.
- [ ] **AC-14-08** [auto, property] For 10,000 seeded random legal trails (#2's generator), the
  rendered breakdown has Base equal to the trail's `base`, one line per step in trail order, and
  Total equal to `final` and to the number shown. The signed amounts sum from Base to Total.
- [ ] **AC-14-09** [auto] After forging Echo Jade, Ironbark Heartwood, Ember Marrow and Cloud
  Lotus under Ember Breath, Ash Tallow's cap breakdown reads, in order: Base 40; "Foundation"; Cloud
  Lotus +3; Echo Jade +7; Ember Marrow +5; Ironbark Heartwood +5; Total 60. No line carries a
  method mark.
- [ ] **AC-14-10** [auto] **Hidden base.** Under Ember Breath with Ember Marrow never held, Ember
  Marrow shows "Cinder +10" with a raise mark, and its breakdown shows "Base shown once Ember
  Marrow is in hand" and "Ember Breath feeds +10" with no Total. Neither its base (25) nor its
  contribution (35) appears in its row, its container or any composed breakdown. Before the
  commit, the method-choice view shows Ironbark Heartwood's Jade as
  "quenched" with no number, and Ember Breath's feed as "+10". **AND** after Ember Marrow is
  first held and then consumed by the forge, its base stays shown.
- [ ] **AC-14-11** [auto] Ember Breath's commit dialog shows these lines, in this order, each with
  the hollow mark named: "Feeds: Ember Marrow: Cinder" (raise); "Opens: Crab Hunt", "Opens: Heron
  Hunt", "Opens: Salamander Hunt" (open); "Quenches: Ironbark Heartwood: Jade" (quench); then
  "Closes: Still Water", "Closes: Still Deep I", "Closes: Still Deep II" and "Closes: Still Deep
  III", each with the closed glyph and Still Water's hollow glyph; then "Redo: only by starting a
  new run".

**Navigation**
- [ ] **AC-14-12** [manual] On the forge screen, with Echo Jade, Ironbark Heartwood, Ember Marrow
  and Cloud Lotus held under Ember Breath:
  - open the plan's Might 135, then drill into "Cinder after clash 115", then "Cinder total
    130", then "Ember Marrow 35". That shows Base 25, "Ember Breath feeds +10" and Total 35;
  - three back activations return to Might 135, and each time focus is on the line that was
    opened;
  - Esc at any depth closes the container, and focus returns to the record that opened it.

**Empty and error states**
- [ ] **AC-14-13** [auto] A base-only number (the Pangolin Hunt's bill, Rendered Oil ×6) shows no
  breakdown lines and no mark. A record whose container shows no rule-derived number shows no
  breakdown block and no placeholder text.
- [ ] **AC-14-14** [auto] On the commit, all marks, the solid glyph and the closed rows are in
  their final state in the commit frame (AC-W7-4's frame). The underline draw-in ends within
  400 ms. Under `prefers-reduced-motion: reduce` there is no draw-in. After a new run, no mark
  and no closed row remains in its first frame.
- [ ] **AC-14-15** [auto] The build fails when a content method has no entry in the mark table,
  when two entries share a silhouette class, or when an entry names a method content lacks
  (MK10).
- [ ] **AC-14-16** [auto] The build fails when any rule-derived number in the rendered interface
  has neither a trail nor owner parts. With such a number injected, the screen shows it bare and
  logs one console error naming the record and field.

**Performance** (provisional until the performance ADR; measured with `bun run perf` once a
browser harness exists)
- [ ] **AC-14-17** [auto] Opening a container with every breakdown of the MVP's largest record,
  or one drill step, completes its script and layout within 16 ms median on the reference
  machine. The commit frame's repaint of every mark completes within 16 ms, excluding the
  underline draw-in.

**Accessibility**
- [ ] **AC-14-18** [manual, screen reader] Under Ember Breath:
  - Ember Marrow's Cinder reads "Cinder 35, Ember Breath feeds";
  - the closed Still Deep reads "Still Deep, closed, opens under Still Water";
  - the breakdown in AC-14-12 reads "Base, 25", "Ember Breath feeds, plus 10", "Total, 35";
  - each part line is announced as a button ending "show breakdown".
- [ ] **AC-14-19** [manual] Keyboard alone reaches and activates every part and back line in
  reading order. At 390 px every part and back line is at least 44 px tall and full width.
- [ ] **AC-14-20** [manual] At 390 px and at 200 % text zoom, no breakdown line, closed row or
  dialog line is truncated or scrolls sideways, and no mark wraps away from its number.
- [ ] **AC-14-21** [auto] Glyphs, notches and underlines measure at least 3:1 against the stone
  base, and numbers and breakdown text at least 4.5:1, in every theme #13 ships.
- [ ] **AC-14-22** [manual] Under forced colours, every glyph, notch and underline is visible and
  AC-14-04's verb-naming part still passes.

---

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **No player journey map.** Author `design/player-journey.md` from `.claude/docs/templates/player-journey.md` to check the arrival contexts inferred under Player Context on Arrival | Designer | Before `/ux-review` of #13–#15 |
| 2 | **No art bible.** The glyph drawings, the final tint values and the stone base are provisional. The art bible must keep MK2's silhouette classes, solid and hollow forms, MK3's notches and the contrast minimums under Accessibility | Art bible (`/art-bible`), art-director | Before the vertical slice's visual pass |
| 3 | **No accessibility tier.** This spec assumes WCAG 2.2 AA. Run `/gate-check` to see whether the missing `design/accessibility-requirements.md` blocks a gate | Accessibility and settings (#18), designer | #18, vertical slice |
| 4 | **Stale input preferences.** `.claude/docs/technical-preferences.md` says "mouse with hover tooltips" and "ⓘ pins tooltips". Both are from the archived attempt and conflict with MVP required item 8 (nothing hover-only, tap-opened container) | Designer, with #13 | Next `/setup-engine` or settings edit |
| 5 | **#13's container must host the drill stack** (BD6). *Resolved 2026-11-21 by #13 (`design/ux/interface-shell.md`, commit 1eca986 on `claude/ux-interface-shell-b57ec9`):* records open the container and numbers never do; the back line comes first and takes focus; Back restores focus to the line that was opened; Esc closes the stack; lines are at least 44 px; no horizontal scroll at 390 or 320 px. #13 also drills into a record named in a card | Interface shell (#13) | Done, once both branches merge |
| 6 | **One-handed reach on a phone.** #13 uses a bottom sheet on narrow widths. Whether the back line at a tall sheet's top is in thumb reach is still open | Phone layout (#17) | Vertical slice |
| 7 | **The glyph sheet across specs.** *Resolved 2026-11-21 by #13 (commit 1eca986):* its state glyphs must differ in silhouette from every MK2 glyph, the method chip uses MK2's solid glyph, and the heap toggle uses MK2's heap shape. #9's depth glyph and #15's tier and affinity glyphs keep the same constraint (Open Questions 12) | #13 | Done, once both branches merge |
| 8 | **Line kinds in the dialog's result type.** `closesLines` and `givesUpLines` must return each line's kind (feed, quench, open, change, close) with its text, so the notch is never chosen by parsing words | Methods (#7) ADR 1, with #1 | Before epics |
| 9 | **The clash amount and stat limit cuts in `foundationStats`.** Its result must carry each affinity's clash taken and any `STAT_MAX` cut, because `max(0, …)` makes them impossible to derive from the shown numbers (BD5) | Forge and proving (#6), result-type ADR | Before epics |
| 10 | **Addressing a trail.** How the interface gets the trail of a shown value | Modifier pipeline (#2) ADR 2 | Before epics |
| 11 | **The hidden base after consumption.** BD7 reads the ingredient's high-water mark (#1 F1), so a base stays shown after the forge consumes the ingredient. #6 to confirm that this matches "never shown before the ingredient is in hand" | Forge and proving (#6), Content records (#1) | `/ux-review` of this spec |
| 12 | **What #15 still owes.** The accent before the commit: whether hollow glyphs in the method-choice view and the dialog take a colour. The view's and the dialog's layout. The words for composed numbers (BD5). The affinity and door-tier glyphs, in ink, distinct from MK2's glyphs and never gate-shaped (MK2) | Forge screen (#15) | #15 UX spec |
| 13 | **The commit moment split.** #14 animates marks and underlines; #13 changes the shell's tint and persistent identity; #15 closes the dialog. All run on `committed`, and none waits for another. *#13's half resolved 2026-11-21 (commit 1eca986): its sweep ends within 400 ms on the same event.* #15's half is open | #15 | #15 UX spec |
| 14 | **BD1's reading of "every number".** State numbers (held, progress, the rest bank, log amounts) have no breakdown, because they have no base and no modifiers | `/ux-review` | `/ux-review` of this spec |
| 15 | **No interaction pattern library.** New patterns to add when it is authored: Method glyph, Method mark, Closed mark, Number breakdown (trail and composed), Drill-down line | UX (`/ux-design patterns`) | Before #15's spec, if possible |
| 16 | **Later methods and re-pricing.** The *lower* notch is reserved for re-pricing (#7 Open Question 4). A third method takes an unused silhouette class (falling, coiling, branching, rippling), up to the concept's cap of six | Designer, Reforge (#16) | Vertical slice |
| 17 | **Phone layout.** Marks and breakdowns already meet 390 px. #17 re-checks them in the drawer and bottom-tab layout | Phone layout (#17) | Vertical slice |

### Cross-reference check (`/ux-design` phase 5, 2026-11-21)

| Check | Result |
|---|---|
| GDD requirement coverage | **All covered.** Every hand-off to #14 found by grepping `design/gdd/*.md` for `#14`, "Method marks" and "breakdown" maps to a rule here: #1 R6.4, R7.2, F7, F8, "Before the commit", AC-U-1 and the UX flag (MK1, MK5, MK7, BD7, D5); #2 P8, P8.2.3, P8.3, P8.4, Visual/Audio, UI Requirements and Open Question 6 (BD3, BD4, MK3); #3's cap breakdown and unmarked cap lines (W3, MK1.3); #5 UI Requirement 3 and tier display (BD5, MK2); #6 G7, the clash, tiers and UI Requirement 7 (BD5, MK2); #7 Visual/Audio, UI Requirements 3, 4 and 6, the UX flag and Open Questions 4 and 7 (MK1–MK9, D5); #8 Visual/Audio 1 (MK1.3); #9's Closed state, Still Deep row and glyph distinctness (MK5, MK2); #10 D3.3 and Visual/Audio (BD4, MK8, W5); #11 UI Requirement 5 (MK4); systems index paragraph 14 (all four requirements). Closed during the check: R5.5's citation, AC-U-1's non-zero `set` (MK7), #6 G7's preview bound (BD5), and the tier and affinity glyph seam (MK2) |
| New patterns for the library | Method glyph, Method mark, Closed mark, Number breakdown (trail and composed), Drill-down line. No library exists, so they are flagged as a gap (Open Questions 15) |
| Navigation mismatches | **#13: none.** Checked against `design/ux/interface-shell.md` at commit 1eca986 (another branch). Records open the container, numbers never do, the drill stack and back line match BD6, and Esc and close return focus to the record. **#15: not assessed**, because its spec is not written. The open seams are Open Questions 12 and 13 |
| Accessibility gaps | No tier is committed. This spec assumes WCAG 2.2 AA (Open Questions 3). One checklist item, one-handed reach, waits on #17 (Open Questions 6) |
| Missing empty states | None. Marks (Choosing), breakdowns (base-only, no numbers), closed rows (Choosing), the drill stack (depth 0) and composed numbers with no parts each have a defined empty form (States & Variants) |
