# Methods

> **Status**: Approved 2026-11-20 (lean review; recommended follow-ups in `design/gdd/reviews/methods-review-log.md`)
> **Author**: designer + Claude (`/design-system`)
> **Last Updated**: 2026-11-20
> **Amendments**: A1 2026-11-20 — Open Question 2 marked resolved (U1, an error on every fight source) and Open Question 3's route half resolved (H5 passes on #9's routes, within X3's bill limits) (from Fight and dungeon routes #9; approved by the designer). Touches Open Questions rows 2 and 3
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 2 (Methods matter); supports 3 (The build is a problem) and 4 (No dead ends, no attention tax)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-20 (no blocker; three advisories, each already an Open Question: keep the Wave A two-method play, Open Question 1; H5 under real route times, 3; the dialog's review-only checks depend on #14 and #15, 7)

## Summary

Methods is the cultivation method a run circulates: Ember Breath or Still Water, chosen freely
until the player commits with "Begin circulating [method]". A method feeds or quenches what
ingredients contribute at the forge, which gives each method a different best Foundation, and it
opens its own routes: Ember Breath hunts, and only Still Water has the dungeon. The commit says in
generated words what it opens, changes and closes, and that a new run is the only redo. This is
how pillar 2's "methods matter" reaches both the forge and the road to it.

> **Quick reference** — Layer: `Feature` · Priority: `MVP` · Key deps: `Content records and schema, Modifier pipeline and recompute, Forge and proving`

## Overview

Methods is the cultivation method a run circulates. The MVP has two, **Ember Breath** and
**Still Water**, and both are visible side by side from the first screen. A method changes two
things, and only these two:

- **What each ingredient contributes at the forge.** A method *feeds* an affinity on an
  ingredient (adds to its `contrib`) or *quenches* it (sets it to 0). The same six ingredients
  then make a different forge problem, with a different best makeup (pillar 3; #6 B1–B4).
- **Which routes work.** A method *opens* sources that exist only under it. Ember Breath opens
  three hunts, single fights that pay an ingredient. Still Water opens the dungeon, three
  chained floors. Recipes, the gathering and refining chain and three more hunts work under
  both.

The player chooses freely until an explicit commit, **"Begin circulating [method]"**. The commit
names what it opens, what it changes and what it closes: the other method and every route only
that method opens (rule 54). Gathering starts only after the commit (concept, mechanic 2), so
the choice never closes on its own or while the player is away. In the MVP the commit holds for
the run. The only way to choose again is a new run (#11's fast new game), and the commit dialog
says so.

The system has a data side and a player side.

- **Data.** It owns the `method` record's values (#1 R1, R4 rows `commitText`, `patches`,
  `redoCost`, and `source.enabled`'s meaning). It closes the patch surface to two fields and
  three verbs: feed, quench and open. It also owns the committed method, the run's one piece of
  method state. The method stage itself is #1's `applyMethod`, run at load (#2 P1.2), so
  committing selects a frozen set and computes nothing new.
- **Player.** It owns the choice and the commit as moments. It also owns the identity of each
  method: where its numbers live (rule 71) and what kind of cultivator it makes.

**Why it exists.** Pillar 2 says the method changes what each ingredient contributes at the
forge and what other systems pay, never just a rate. Its design test picks the method that
changes which routes work over one that adds 10% qi. The unique hook calls the method the
second half of the game: it makes forging twice worthwhile. Without this system there is one
forge problem per realm, and the fast new game would replay it unchanged.

**What it is not.**

- **No rates.** No method changes a duration, a bill or a yield in the MVP (designer,
  2026-11-20). Routes already change what each system pays. A duration patch would print only
  "Changes: X: Time" in the commit dialog (#1 R7.2), and it could break B9, B10 or V7 on its own.
- **No closing by patch.** A method never switches a source off. A source that one method lacks
  is a source the other method opens, so there is one way to write it.
- **No stats.** A method never touches a fight. Route fights use the baseline combatant (#5 C9),
  and proving reads the method only through `contrib` (#6 G5).
- **No post-commit switch.** That belongs to Reforge (#16) at the vertical slice. `redoCost`
  gets its unit here so #16 can price it.

Alternatives set aside:

- **A method as a bundle of multipliers** (Magic Research 2, rule 86). It is one choice with
  many effects, but rates are what pillar 2's design test rejects.
- **Re-pricing as a third lever**, with `scale_bp` on recipe durations at ±25% (economy-designer).
  It was declined for the MVP and can return once breakdowns show a direction (#2 Open Question 6).
- **A Still Water that waits instead of delves**, opening fightless alternate recipes beside a
  shared dungeon (game-designer). It keeps the dungeon in every run, but it differs from Ember
  Breath only in the price of a second source. Hunts against a gated chain differ in shape
  (rule 73).

This GDD states rules, invariants and acceptance criteria. The commit action's signature, the
event channel and the dialog's layout go to ADRs and UX specs (Open Questions).

## Player Fantasy

**Framing: both.** The player meets the method directly: they choose it, commit to it and see
its marks. They also feel it indirectly: the forge and the routes behave differently under it.

**Circulation shapes the cultivator.** A method is a line drawn through the self. Before the
commit the player holds two ways of being a cultivator side by side and weighs them. At the
commit they choose one, knowing exactly what it closes, and the world answers. The emotion is
deliberate self-shaping: the choice is the player's, and its consequences are visible
everywhere at once. The concept promises this: *"the method you practise makes you a visibly
different kind of cultivator"*, and *"a method is not a number that goes up; it is the reason
your character can do what another cannot."*

**Anchor moment.** The player opens "Begin circulating Still Water". The dialog says, in
generated lines, what Still Water opens and changes, and that it closes Ember Breath and its
three hunts. The player confirms. The interface takes Still Water's tint, and the dungeon joins
the routes the player can work toward. Echo Jade and Tidewater Pearl wear the mark where Still
Water feeds their Bark.

**Tone.** The words are circulate, commit, open, close, feed, quench, breath and water,
together with the method's own name. Never buff, patch, modifier or bonus. A method's
`commitText` is its voice: one or two lines of what circulating it feels like, never a claim
about numbers (#1 R7.2).

**The two methods** (names kept from the prototype; creative-director, 2026-11-20):

- **Ember Breath.** Breath fans the ember. It feeds Cinder and quenches the stone that would
  smother Gale, and it goes out to hunt. It is the outward cultivator: quick fire and wind,
  answers taken by fighting.
- **Still Water.** Still water runs deep. It feeds Bark, and it goes down into the dungeon. It
  is the inward cultivator: wood and stone, answers found by descending.

The two favour opposite sides of both clash pairs (Cinder and Gale against Bark and Jade, #6
G3), so each method's leading affinities are the other's opposites.

**Where it sits.** The approved fantasies cover the moments around this one:

- #1, "The plan holds": the rules stay still while the player reasons.
- #6, "The harmony problem": composing four ingredients under the method.
- #5, "The Foundation proves itself", after the forge.

This fantasy owns the commit and the run's shape that follows from it. It does not own the
composing hand, which is #6's.

**What the fantasy obliges this system to guarantee** (carried into Core Rules and Acceptance
Criteria):

1. Nothing the method changes is in force before the commit, and the commit is the only action
   that closes anything: the other method and the routes only it opens (rule 54; pillar 4).
2. The commit dialog's opens, changes and closes are generated from content, so the words
   cannot disagree with what the commit does (#1 R7.2).
3. Every value a method changes carries its mark, and no unmarked value differs between the
   methods (the visual rule *"What the method touches, the method marks"*; #1 F8, #2 P8.2).
4. Before the commit, the side-by-side view shows feeds as deltas and quenches as "quenched",
   never an absolute contribution (#1 Edge Cases, "Before the commit").
5. Each method opens at least one route to an ingredient that the other method closes, so
   pillar 2 shows in the shape of the world, not only in a number.

Two framings were set aside:

- **"The grain of the path"** (a closed route greyed with its sentence). It reads mostly as
  regret.
- **"A different cultivator across runs."** #6 set it aside until reforge (#16) exists, and
  using it here would make the commit feel small.

*Specialist: `creative-director` consulted (three framings; recommended "Circulation shapes the
cultivator", adopted).*

## Detailed Design

### Core Rules

Notation:

- `set_m` is method m's frozen content set (#1 R8.1). `checked` is the content before any patch.
- `changed(m)` is m's change set, one (record, field, key) triple per patch (#1 F8).
- Ingredient abbreviations follow #6 S9: EJ Echo Jade, IH Ironbark Heartwood, EM Ember Marrow,
  CL Cloud Lotus, GM Ghost Moss, TP Tidewater Pearl. EB is Ember Breath, SW is Still Water.
- Formulas Y1–Y3 are in Formulas. Checks H1–H5 are in W11.

#### W1. The method API

Every function here is **pure**: it reads only its arguments and content, never game state, and
equal arguments give equal results. The method-choice view, the commit dialog, the Validator and
the commit itself call the same functions (TD finding 1).

| Function | Returns | Rule, formula |
|---|---|---|
| `closesLines(m, checked)` | #1's: one line per triple of `changed(m)`, "Opens: {source}" or "Changes: {label}" | #1 R7.2 |
| `givesUpLines(m, checked)` | what committing to m closes: each other method, then each source only another method opens | W7.3; Y1 |
| `redoLine(m)` | the redo line, from `m.redoCost` | W9; Y2 |
| `commitDialog(m, checked)` | m's name, `commitText`, then the three lists above in that order | W7.3 |
| `routes(i, m)` | the enabled sources in `set_m` that output ingredient i, in id order | W5; Y3 |

- A method id that content does not have throws a `RangeError`. Callers never pass one.
- `checked` is the right content for every line here. Names, gates and `enabled` as authored are
  the same in every set, because no method patches a name, and a method only opens.
- Signatures and result types go to an ADR.

#### W2. The method record

A method is one `method` record (#1 R1). This GDD owns the values of its fields:

| Field | MVP rule |
|---|---|
| `name` | "Ember Breath", "Still Water" (provisional; kept from the prototype) |
| `commitText` | The method's voice: one or two lines of what circulating it feels like. No digits (a load error, #1 R4.6). No claim about numbers, routes or redo (#1 R7.2), which review checks, since no rule can read a claim |
| `patches` | Feeds, quenches and opens only (W3), at most `METHOD_PATCH_MAX` triples (H4) |
| `redoCost` | Absent on both methods (W9) |
| `desc`, `flavor` | Optional. Flavour comments on the mechanic (rule 70) |

The method's glyph and tint are Method marks' (#14), not fields.

#### W3. The patch surface (closed)

A method patch is one of three **verbs**, and nothing else:

| Verb | Field (`key`) | Op and operand | What it does | Before the commit, shown as |
|---|---|---|---|---|
| **feed** | `ingredient.contrib` (an affinity) | `add`, operand 1–`FEED_MAX` (40) | Raises what an ingredient puts into an affinity | the delta, "+n", on that ingredient and affinity |
| **quench** | `ingredient.contrib` (an affinity) | `set`, operand 0 | Takes an affinity out of an ingredient | "quenched", with no number |
| **open** | `source.enabled` | `set`, operand 1 | Makes a source exist under this method | "Opens: {source}" |

1. **Closed fields.** `source.inputs`, `source.outputs` and `source.duration` still list `method` in
   #1 R4, which is the schema's widest surface. This GDD keeps them closed in the MVP (designer,
   2026-11-20), and H1 fails any patch on them. So a source's bill, yield and time are the same
   under both methods. #3's V1–V3 and #4's T1 then read the same values in every set.
2. **Why these three.** A feed shows its size before the commit and a quench shows only that it
   happened, exactly the two forms the concept's method-choice view allows (concept, Flow State
   Design). A partial lowering (`add` with a negative operand) would be a third way to write
   "less", and the view would have to show it as a delta. Re-pricing (`scale_bp` on `duration`)
   was declined for the MVP (Overview).
3. **A quench on an affinity already at 0** is a no-op patch and a load error (#1 F8). A feed on
   an affinity at 0 is legal: it moves the ingredient onto that affinity (#1 R6.2).
4. **Why a feed is bounded.** The largest base contribution in S9 is 60. A feed of at most 40
   bends an ingredient toward the method and leaves its base the larger part of what it is, so an
   ingredient keeps one identity under both methods (pillar 1). Without a bound only the schema's
   1,000,000 limits a feed (#1 R6.3), and B1–B6 may or may not catch an ingredient made best by
   its method alone (`systems-designer`).
5. Reopening a closed field, or adding a verb, is a change to this GDD and to H1.

#### W4. One way to write a route

1. A source that exists under every method is authored enabled (the default), and no method
   patches it. An open on an authored-enabled source changes nothing, so it is a no-op patch and
   a load error (#1 F8).
2. A source that exists under some methods but not all is authored `enabled: false`, and each
   method that has it **opens** it.
3. So no method ever switches a source off, and **each opened source belongs to exactly one
   method**. What committing to m closes is exactly what the other methods open (W7.3). H2 fails
   a source opened by more than one method: with two methods it should be authored enabled, and
   with a third the gives-up list would name a route the committed method also opens. #1 already
   fails a source no method opens ("disabled in both frozen sets").
4. Under m, the enabled sources are the authored-enabled ones plus the ones m opens. Every
   method's set therefore holds every shared route, so a shared bill or sink never disappears
   under one method (#3 V2).

This narrows #1 R1, which allows a method to "remove" a route by setting `enabled: false`. Both
spellings give the same frozen sets. One spelling keeps the commit dialog's closes list a plain
reading of the other method's opens.

#### W5. The route plan

Each method opens a different family of fight routes for the same three ingredients (designer,
2026-11-20: "hunts vs delves"). Source names are placeholders. Crafting route (#8) and Fight and
dungeon routes (#9) author the records, their inputs, durations and opponents, within this plan.

| Ingredient | Under both methods | Ember Breath opens | Still Water opens |
|---|---|---|---|
| Echo Jade (EJ) | its recipe; a hunt | — | — |
| Ironbark Heartwood (IH) | its recipe; a hunt | — | — |
| Ghost Moss (GM) | its recipe; a hunt | — | — |
| Ember Marrow (EM) | its recipe | a hunt | a dungeon floor |
| Cloud Lotus (CL) | its recipe | a hunt | a dungeon floor |
| Tidewater Pearl (TP) | its recipe | a hunt | a dungeon floor |

1. **Pillar 4 holds by the plan's shape.** Under each method every ingredient has its recipe,
   which needs no fight, and one fight route, so `routes(i, m)` has two sources. #1 R8.4's checks
   1 and 2 hold. Check 3, the price ceiling (#6 B10), binds #8's recipe times against #9's
   hunts and floors.
2. **The dungeon is Still Water's.** Its three floors chain through gates (#9), so the deepest
   floor is the dearest of the three: #6 S8 prices it with the floors before it. Under Ember Breath the dungeon does not exist.
   The commit dialog names its floors as closed, and the method-choice view shows them by name.
3. **Ember Breath hunts.** It has six hunts and no dungeon. Still Water has three hunts and the
   dungeon.
4. **Why this trio.** EM and CL are in Ember Breath's best makeup, and EM and TP in Still Water's
   (#6 S9). Each method's routes therefore reach two of its own best four, so the routes a method
   opens are the ones its best Foundation needs (rule 71).
5. **No ingredient is a source input**, and route fights read the baseline combatant (#6 B13,
   #5 C9). The plan assumes every hunt and floor is one the baseline wins. A route it loses pays
   nothing (#5 C8), so it would satisfy `routes(i, m)` in name only, #6 S7 would skip it, and an
   unwinnable first floor would leave the deeper floors unreachable under Still Water. No check
   enforces this yet: #5 left it to #9 and #12, and this GDD asks them for a validator error
   (Open Questions). One check on `checked` covers both methods, because no method patches a
   fight or the baseline.

The source budget this implies (answering #1 Open Question 11) is in Y3.

#### W6. The two methods

The contribution patches are #6 S9's, kept unchanged (designer, 2026-11-20). They pass B1–B8,
B11 and B12 (#6 S9), and a throwaway generator that reimplements #6 S1–S5 and #5 F1–F7
reproduces S9 exactly.

| | Ember Breath | Still Water |
|---|---|---|
| Theme | Breath fans the ember: fire and wind, the outward cultivator | Still water runs deep: wood and stone, the inward cultivator |
| Feeds | EM Cinder +10 | EJ Bark +20; TP Bark +30 |
| Quenches | IH Jade | — |
| Opens | the hunts for EM, CL and TP | the dungeon's three floors, which pay EM, CL and TP |
| Triples | 5 | 5 |
| Best makeup (#6 S9) | EJ · IH · EM · CL, 4 seals, led by Cinder 115 and Gale 38 | EJ · IH · EM · TP, 4 seals, led by Bark 75 and Jade 70 |
| The other's best under it | 3 seals | 3 seals |

What the generator showed (2026-11-20, `systems-designer` and `game-designer` concurring):

- **The bests cannot move without new base content.** Over every theme-coherent set of two to
  four feeds and quenches (Ember Breath feeding Cinder or Gale or quenching Jade or Bark, Still
  Water the reverse), with #6's base content and doors fixed, 190 of 191 passing Ember Breath sets
  and all 21 Still Water sets give the same two bests. They share three ingredients and swap one
  (CL for TP).
- **Richer sets add little.** The best of them keeps its best makeup unique under 118 and 101 of
  120 one-stat door changes of up to ±5, against S9's 115 and 95. That is a tuning gain, not a
  pillar fix, and it would amend #6.
- So **routes carry pillar 2's weight** beside the one-ingredient swap. Whether the swap feels
  like a different problem is the Wave A checkpoint's question (Open Questions).

#### W7. The commit

1. **Choosing.** Until the commit, both methods show side by side with their change sets: feeds
   as deltas, quenches as "quenched", opens by name (#1 Edge Cases, "Before the commit"). Picking
   one to look at is a free, view-only choice. It is interface state, never saved, and not an
   input (#4 S3.3).
2. **"Begin circulating [method]"** opens the commit dialog for that method. Confirming it is
   the action `commit(m)`. Cancelling changes nothing.
3. **The dialog** shows `commitDialog(m, checked)`, all generated except `commitText` (rule 54):
   1. "Begin circulating {name}", with the method's glyph (#14);
   2. `commitText`;
   3. what m opens and changes, from `closesLines`;
   4. what it closes, from `givesUpLines`: "Closes: {other method}", then one "Closes: {source}"
      line for each source only another method opens;
   5. the redo line (W9).

   It has no delay and no hold-to-confirm. The weight comes from the words (#6 Game Feel; rules 15
   and 38, *beat*: the consequence is kept and the warning is surfaced, per record).
4. **Legality.** `commit(m)` is legal only while no method is committed. Otherwise it is refused
   with "Already circulating {name}", naming the committed method, not the one tried. A refused
   commit is not an input, does not restart the away clock and emits no `committed` event. Its
   settle (5.2) has already brought time to the present, and that settle emits whatever #4 and
   #3 emit for the time it covers, exactly as any other action's settle would (#4 S9).
5. **On confirm**, in one atomic step:
   1. m is checked to be a method of content. An unknown id is a caller bug: it throws a
      `RangeError` before anything else, with no settle and no event (W1);
   2. time is settled (#4 S3.4). Before the commit the slot only rests, so this banks rest;
   3. legality (4) is checked;
   4. `committed` becomes m;
   5. the effective set becomes `effective(set_m, none, none)` (#2 P9). No cap changes, because
      no method patches a cap;
   6. the commit counts as an input, so the away clock restarts (#4 S3.3, S7);
   7. emit `committed {method}`.

   Steps 4 to 7 run with no event and no observer call between them, so no reader sees
   `committed` set while the effective set is still the Choosing one. Observers learn of the
   commit once, from the event in step 7. A throw in steps 1 to 3 leaves `committed` none and
   emits no `committed` event. The commit ends an `advance` segment (#2 P9.4), and the slot keeps
   resting until the player starts a source.
6. **Effects that follow from the atoms, not from this system.** `committed()` is true for the
   rest of the run (#1 R5.3). Every revealed source moves to its final state in one step (#1 F7).
   Need text loses its "Needs a method committed" line (#1 R5.5). The forge becomes Open (#6). The
   rest bank already filled before the commit stays (#4 S8).
7. **The commit takes no slot time** and runs outside the slot.
8. **After the commit the method is fixed for the run** in the MVP. No action reverses it. A new
   run (#11's fast new game) sets `committed` back to none, together with everything else #11
   resets.

#### W8. A stale or repeated commit

- Content never changes at runtime after it is frozen (#1 States and Transitions), so a dialog
  cannot go stale against content within a session. A content update arrives only with a reload,
  which closes the dialog. The game-designer's proposal to carry a hash of the dialog's text in
  the action is therefore unnecessary and was not adopted.
- A double tap, or a confirm on a second copy of the dialog, finds a method committed and is
  refused (W7.4). Two tabs cannot both act, because #11 holds one tab per profile.
- The commit needs a player action, so it never happens during an away `advance`.

#### W9. `redoCost` and the redo line

This answers #1 Open Question 10.

1. **Unit and meaning.** `redoCost` is milliseconds of untended slot time (#1 R7.1: time is whole
   milliseconds). It is the price of leaving this method after committing to it. Reforge and
   post-commit method switch (#16) decides how that time is paid, for example as an activity in
   the slot under the usual rest and away rules, and what else a switch costs.
2. **The MVP sets it on no method.** Nothing in the MVP can charge it, and a value no rule reads
   would be a promise the game does not keep. H1 fails a method that carries it, until #16 lifts
   that and rules on what a `redoCost` of 0 means.
3. **The redo line** (Y2):
   - absent: "Redo: only by starting a new run" (amendment A5 to #1, replacing "Redo: not
     offered", which would be false beside the new-run action; #6 G8.2 already names the new
     run);
   - present: "Redo: {time} to change method", with {time} the interface's duration format of
     the field (#13).
4. **Pillar 4.** The MVP's redo is real but expensive: a new run, which costs the run's gathering.
   The concept accepts this for the MVP (mechanic 2: "the price of switching later is designed
   together with reforge"). #16 clears the rest of the debt that #1's Edge Cases record.

#### W10. Before the commit

The player can:

- read both methods side by side, with every feed, quench and open (W7.1);
- build plans on the forge screen, which is in Planning only (#6 States and Transitions);
- read every source's need text, led by "Needs a method committed" (#1 R5.5).

The player cannot start a source or forge (#1 F7, #4 S3.5, #6 G8.1). The slot rests and banks
time meanwhile (#4 S8), so deliberating costs nothing (pillar 4, attention).

#### W11. Checks owned here (run by the Validator)

The Validator (#12) runs these on `checked` and on each method's frozen set. Each is an error.
They add to #1 R8.4 (every method patches a `contrib` value and an `enabled` value, and the three
pillar 4 source checks), #3 V1–V7, #4 T1–T3 and #6 B1–B13, and repeat none of them.

| # | Check | Serves |
|---|---|---|
| H1 | **Surface.** Every patch of every method is a feed, a quench or an open (W3). A patch on `inputs`, `outputs` or `duration`, a `set` on `contrib` to anything but 0, an `add` on `contrib` outside 1–`FEED_MAX`, or a `set` on `enabled` to 0 fails. In the MVP a method that carries `redoCost` also fails (W9.2) | W3, W9 |
| H2 | **One spelling.** No source is opened by more than one method | W4 |
| H3 | **Route identity.** Every method opens at least one source whose `outputs` hold an ingredient | Pillar 2's design test; Player Fantasy, promise 5 |
| H4 | **Legibility.** No method has more than `METHOD_PATCH_MAX` (8) triples | W7.3 |
| H5 | **No price leak.** Under each method, the best makeup (#6 B1) takes longer to gather than the cheapest makeup by #6 S7: T(best, m) > min over makeups X of T(X, m). *[blocked: #8, #9]* until real sources exist; the Wave A checkpoint runs it on stub sources | Pillar 3 |

- **H5's reason.** If the best makeup were also the cheapest to gather, gathering cheapest-first
  would find it with no reasoning, and #6 G9's price would never bite. On S9's stub times Still
  Water fails it: EJ, EM, IH and TP are both its four cheapest and its best (`economy-designer`).
  The route plan helps the real content pass, because Still Water reaches EM and TP through the
  dungeon's chained floors.
- H5 is not evaluated for a method whose B1 fails, and the report says so (#6 G14).
- V7 needs no check here. The source that passes it has no inputs and is authored enabled, so no
  feed, quench or open can reach it, and V7 reads the same values under both methods. #3's per-set
  V7 run stays as the net (answering #3 Open Question 6).

#### W12. State, actions and events (TD finding 6)

- **Non-derived state owned:** `committed`, a method id or none. Save and run lifecycle (#11)
  saves it. The method being viewed before the commit is interface state and is never saved.
- **Actions accepted:** `commit(method)` (W7).
- **Events emitted:** `committed {method}`.

*Specialists consulted: `game-designer` (primary), `systems-designer` and `economy-designer`
(supporting), with `creative-director` on the method identities. They split on two points, which
the designer decided on 2026-11-20: the route plan (hunts vs delves, from `creative-director` and
`systems-designer`, over `game-designer`'s hunts vs waits) and re-pricing (none, from
`game-designer`, over the `economy-designer` and `systems-designer` bands). All four recommended
keeping S9's patches. `economy-designer` and `game-designer` each proposed H5 independently.*

### States and Transitions

**The run's method.** It is read from `committed`, the only saved value.

| State | Holds when | What the player sees |
|---|---|---|
| Choosing | `committed` is none | Both methods side by side with their change sets. Every source waits with "Needs a method committed". The forge is in Planning only. The slot rests |
| Circulating m | `committed` is m | m's frozen set is in force and its marks show. The other method stays readable and is shown as closed (#14). The forge is Open until forged |

| Transition | Trigger | Reversible? |
|---|---|---|
| Choosing → Circulating m | `commit(m)` (W7.5) | Not in the MVP |
| Circulating m → Circulating m′ | — | Not in the MVP; a post-commit switch is #16's, priced by `redoCost` (W9) |
| Any → Choosing | A new run (#11's fast new game) | — |

**The commit dialog** is interface state, never saved:

| State | Holds when |
|---|---|
| Closed | No dialog is open |
| Open for m | The player pressed "Begin circulating m" while Choosing |

- Open for m → Closed on Cancel, with no change.
- Open for m → Closed on Confirm, through `commit(m)`. The dialog closes whether the commit was
  accepted or refused, and a refusal shows its reason.

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | The `method` type and its rows; `applyMethod`, `changed` (F8), `closesLines` (R7.2); the `committed()` atom (R5.3); F7 | The values of `method` records; the narrowed surface (W3) and one spelling (W4); `redoCost`'s unit; amendment A5; answers to #1 Open Questions 10 and 11 | #1 owns types, rows and legality; this GDD owns which patches exist |
| 2 | Modifier pipeline | The method stage and its trails (P1.2, P8); `effective` (P9) | The commit as a recompute input and a segment boundary (P9.3, P9.4) | #2 applies; this GDD selects `set_m` |
| 3 | Resources and caps | V1–V7 run per set | Closed `inputs` and `outputs`, so V1–V3 read the same values in every set; V7 unreachable by any patch (answers #3 Open Question 6) | #3 owns the checks |
| 4 | Activity slot | Settle before an action (S3.4); rest before the commit (S3.5, S8) | The commit as an input (S3.3) and a segment boundary; closed `duration`, so T1 reads the same values in every set | #4 |
| 5 | Combat resolver | — (route fights read the baseline, C9) | Nothing. No method reads or writes a stat | #5 |
| 6 | Forge and proving | B1–B13 and S9's table; `bestSeals`; the forge's need for a commit (G8.1) | The real contribution patches, S9's kept unchanged (W6); the commit that opens the forge; answer to #6 Open Question 1 | #6 owns the checks; this GDD owns the patches |
| 8 | Crafting route | The recipes and the gathering and refining chain | The route plan (W5): every recipe is shared and never patched; the price ceiling binds recipes against #9's routes | #8 authors; this GDD owns which routes each method opens |
| 9 | Fight and dungeon routes | The hunts and the dungeon's floors | The route plan (W5): three shared hunts, three Ember Breath hunts, a Still Water dungeon whose floors pay EM, CL and TP | #9 authors; this GDD owns the plan |
| 11 | Save and run lifecycle | The fast new game | `committed` to save, and to reset to none on a new run | #11 |
| 12 | Validator | — | H1–H5; W1's functions, called rather than reimplemented | #12 runs; this GDD defines |
| 13 | Interface shell | — | The `committed` event; the method's name always on screen (rule 32); the redo line's duration format | #13 |
| 14 | Method marks and breakdowns | — | `changed(m)` for each method: exactly the marked values; the three verbs, so a mark can show feed, quench or open | #14 owns the display |
| 15 | Forge screen | — | The method-choice view's content (W7.1) and the commit dialog (W7.3) | #15 owns the layout |
| 16 | Reforge and post-commit switch (VS) | — | `redoCost`'s unit and meaning (W9); the Circulating states | #16 |

## Formulas

This system sets no balance curve. What a feed or a quench does to a value is #2's M1 (`add`,
`set`), and what the value does at the forge is #6's S1–S6. The formulas here are the commit
dialog's two generated lists, the route count with the source budget it implies, and H5's test.
Every number is an integer. Lists are ordered by id in UTF-16 code units (#1 R8.3).

### Y1. Gives up

The gives_up formula is defined as:

`givesUp(m) = for each method o ≠ m in id order: [o, then opened(o) in id order]`, where
`opened(o) = { s : (s, enabled) ∈ changed(o) }`, and each entry prints as "Closes: {name}"

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| m | method id | the content's methods | player | The method being committed |
| o | method id | every other method | data file | A method the commit closes |
| opened(o) | set of source ids | 1–`METHOD_PATCH_MAX` (H3, H4) | calculated from `changed(o)` (#1 F8) | The sources o opens. Under W3 every `enabled` patch sets 1, so each triple on `enabled` is an open |

**Output Range:** with M methods, (M − 1) × (1 + |opened(o)|) lines. In the MVP that is 1 + 3 = 4
lines for either commit. By W4 and H2 no source is opened by two methods, so no source can
appear in both `opened(m)` and `opened(o)`, and no set difference is needed. A third method that
shares an open would fail H2 until Y1 subtracts `opened(m)`. The list never holds a
number or a direction word (#1 R7.2).
**Example:** committing Ember Breath gives "Closes: Still Water", then one "Closes:" line for each
of the dungeon's three floors, in id order. Committing Still Water gives "Closes: Ember Breath"
and its three hunts.

### Y2. Redo line

The redo_line formula is defined as:

`redoLine(m) = "Redo: only by starting a new run"` if `m.redoCost` is absent, else
`"Redo: " + duration(m.redoCost) + " to change method"`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| m.redoCost | int | 0–1,000,000,000 ms (#1 R4), absent in the MVP | data file | Slot time to leave this method after committing (W9) |
| duration(·) | text | — | Interface shell (#13) | The shell's duration format, the only number the line holds |

**Output Range:** one line. Its number always comes from the field, so no text carries a price
(#1 R7.2). 1,000,000,000 ms is about 11.6 days of slot time. A value of 0 would print a free
switch. Both are #16's to rule on, since the MVP stores no value.
**Example:** both MVP methods: "Redo: only by starting a new run". A later method with
`redoCost` 1,800,000 would read "Redo: 30 min to change method", in #13's format.

### Y3. Routes per ingredient and the source budget

The route_count formula is defined as:

`routes(i, m) = |{ s in set_m : s.enabled and i ∈ keys(s.outputs) }|`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| i | ingredient id | the realm's six | data file | An ingredient |
| m | method id | the content's methods | data file | A method's frozen set |
| s.enabled | bool | — | data file, after the method stage | Authored `true`, or opened by m (W4) |
| s.outputs | ref→int map | #1 R4 | data file | What the source makes |

**Output Range:** 0 upward. #1 R8.4 check 1 needs 2 or more for every (i, m). Under the route plan
(W5) it is exactly 2 for all 12 pairs: a recipe and one fight route.

**The source budget** (answering #1 Open Question 11; `economy-designer` and `systems-designer`
agree):

| Role | Count | Under Ember Breath | Under Still Water | Authored by |
|---|---|---|---|---|
| Raw gathering | 3 | 3 | 3 | #8 |
| Refining | 3 | 3 | 3 | #8 |
| Key items (Hearth Lamp, Tuning Chisel) | 2 | 2 | 2 | #8 |
| Ingredient recipes | 6 | 6 | 6 | #8 |
| Shared hunts (EJ, IH, GM) | 3 | 3 | 3 | #9 |
| Ember Breath hunts (EM, CL, TP) | 3 | 3 | — | #9 |
| Still Water floors (EM, CL, TP) | 3 | — | 3 | #9 |
| **Sources** | **23** | **20** | **20** | 14 by #8, 9 by #9 |

- #1 R1's target of about 20 sources becomes about 23 (amendment A5). Every switched-off recipe a
  later method needs adds one more fightless source (#1 R1). This plan switches none off.
- Records: 8 resources, 6 ingredients, 4 affinities, 2 methods, 23 sources, 7–13 combatants (the
  baseline, three door opponents, and three to nine route opponents, which fights may share),
  3 doors and 1 realm. That is 54–60, inside the concept's 40–60 with no room for a third
  method's routes. A third method is vertical-slice scope.

**Example:** `routes(TP, SW)` counts Tidewater Pearl's recipe and the floor that pays it, so 2.
`routes(TP, EB)` counts the recipe and Ember Breath's hunt, so 2. The floor is disabled in
`set_EB`.

### Y4. Price leak (H5)

The price_leak formula is defined as:

`leak(m) = [ T(best_m, m) ≤ min over makeups X of T(X, m) ]`, and H5 fails when `leak(m)` is 1

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| T(X, m) | int | ms, 0 upward | calculated (#6 S7) | Untended slot time to gather makeup X under m, sharing inputs |
| best_m | makeup | one of 15 | calculated (#6 B1) | m's unique best makeup |

**Output Range:** 0 or 1. Not evaluated when B1 fails for m.
**Example (S9's stub minutes):** under Ember Breath the cheapest makeup is EJ · IH · EM · TP at
27 minutes, and the best takes 28, so H5 passes. Under Still Water the best, EJ · IH · EM · TP, is
also the cheapest at 26, so H5 fails on the stubs. #8 and #9's real times must make at least one
of Still Water's best four dearer, which its dungeon floors for EM and TP naturally do.

*Specialists: `systems-designer` proposed Y1 and the dialog order; `economy-designer` proposed
the source budget and H5's test (with `game-designer`), both in the Section C round. Y4's
example was checked against S9's printed stub minutes.*

## Edge Cases

Each case says who catches it: a **load error** (#1 R8.3), a **validator error** (H1–H5 here, or
another GDD's check, named), a **runtime rule** of this GDD, or **another GDD**, named.

### Method content

- **If a method opens nothing**: validator error, H3 and #1 R8.4 ("at least one `enabled`
  patch"). `givesUpLines` for the other method then returns only "Closes: {method}".
- **If a method opens a source with no outputs**: with no inputs either it does nothing, which
  is #1's validator error. With inputs it is a legal sink. It prints a "Closes:" line for the
  other method and counts nothing toward H3, so H3 fails only if it is the method's only open.
- **If one method feeds a value the other quenches**: legal. Each method patches its own frozen
  set.
- **If one method feeds and quenches the same (ingredient, affinity)**: load error, two patches on
  one triple (#1 R6.2).
- **If a quench targets an affinity already at 0**: load error, a no-op patch (#1 F8).
- **If a feed exceeds `FEED_MAX`, or a patch touches `inputs`, `outputs` or `duration`**:
  validator error, H1. The load accepts it, because #1 R4 leaves those rows open to `method`.
- **If both methods' frozen sets are identical**: validator error (#1 Edge Cases, "Method
  patches").
- **If a third method is added and shares an open with another**: validator error, H2. Y1 must
  then subtract `opened(m)` before H2 can be relaxed.
- **If a method's change set exceeds `METHOD_PATCH_MAX`**: validator error, H4.

### Routes

- **If the baseline loses a hunt or a floor**: the route pays nothing (#5 C8). `routes(i, m)` still
  counts it, so #1 R8.4 check 1 passes in name only, #6 S7 skips it (moving T and H5), and a lost
  first floor makes the deeper floors unreachable under Still Water. No check catches this yet.
  It is #9's and #12's (#5 C9; Open Questions).
- **If an ingredient's recipe is priced above the ceiling of its only fight route**: validator
  error, #6 B10, under the method whose fight route is the cheapest other source.
- **If two makeups tie for cheapest and one is the best**: H5 fails, because Y4 compares with ≤.
  Ties among makeups that are not the best do not matter.
- **If B1 fails for a method**: H5 is not evaluated for it, and the report says so (#6 G14).

### The commit

- **If `commit` is called with an unknown method id**: runtime rule. It throws a `RangeError`
  before the settle, so nothing changes and nothing is emitted (W7.5).
- **If the player confirms after a method is already committed** (a double tap, or a second copy
  of the dialog): refused with "Already circulating {name}" (W7.4). The settle has already run,
  which is harmless because `advance` composes. Two tabs cannot both act (#11's one-tab lock).
- **If a plan is open on the forge screen at the commit**: the plan is interface state (#6 G4)
  and survives. Nothing is consumed. Its unheld ingredients' shown deltas narrow from both
  methods to the committed one (#6 G7.3). #15 owns the display.
- **If a unit or a fight is running at the commit**: impossible. Before the commit no source is
  actionable (#1 F7), every Start is refused (#4 S3.5), and the slot only rests.
- **If the dialog is left open while the player is away, or in a background tab**: the commit
  never runs inside `advance` (W8). Confirming settles first. The bank is capped (#4 S8), and a
  backwards clock adds no time (#4 S9).
- **If the commit dialog's opens or closes list is empty**: the interface omits that block. The
  redo line is always present (Y2).
- **If a name is long**: names are at most 24 code points (#1 R4), so the longest line,
  "Changes: {ingredient}: {affinity}", is under 60. The interface wraps lines and never
  truncates them or writes "and N more" (#15, and #17 at 390 px).

### Saves (owned by #11)

- **If a saved `committed` names a retired method with an alias**: #11 maps it through the alias
  map (#1 R2.3) and shows its content-changed notice.
- **If a method id is retired without an alias**: validator error (#1 Edge Cases, "Saves across
  content versions").
- **If a saved `committed` names an id content does not have** (a hand-edited save): #11 refuses
  the save by name and offers a new run. It must never reset `committed` to none, because the
  held ingredients and marks would then load into Choosing and a different method could be
  committed on top of them.
- **If a save holds no committed method but some held amount, mark above start, kept progress or
  forge snapshot**: #11 refuses it as corrupt. Gathering cannot happen before the commit.
- **If a saved forge snapshot's method differs from `committed`**: #11 refuses it as corrupt
  (#6 Edge Cases).
- **If the player starts a new run**: #11 sets `committed` to none in the same write as
  everything else it resets. A commit dialog confirmed afterwards finds Choosing and is legal.

### Degenerate strategies

- **If the player commits without reading the dialog**: legal. The dialog has no delay, and the
  new run is the stated redo (W9).
- **If the player plays one method only**: legal. The other method's routes stay closed and named,
  which is the retention hook "what the other method changes" (concept).
- **If the player plans every makeup on paper before the commit**: the side-by-side view shows
  deltas and "quenched" only, never a base contribution (#1 Edge Cases, "Before the commit"), and
  #6 G9.3 shows the plain-sum pick is never the best (B3). So the plan still needs gathering.

*Specialist: `systems-designer` consulted. Its five gaps were fixed in Core Rules: H2 reads
"more than one method", feeds are bounded by `FEED_MAX`, the unknown-id order is fixed, the
refused commit is stated exactly, and the baseline-winnable assumption is named and handed
to #9 and #12.*

## Dependencies

**Upstream (this system depends on them):**

| # | System | Hard or soft | Interface | Status |
|---|---|---|---|---|
| 1 | Content records and schema | Hard | The `method` type and rows; `applyMethod` and the frozen sets (R6, R8.1); `changed` (F8); `closesLines` (R7.2); the `committed()` atom (R5.3); F7. Amendment A5 changes the redo line, `redoCost`'s unit and R1's source target | Approved; A5 pending in this change |
| 2 | Modifier pipeline | Hard | The method stage (P1.2) and its trails (P8); `effective` and the recompute at the commit (P9) | Approved |
| 6 | Forge and proving | Hard | B1–B13 and S9's table, which this GDD's patches must pass; the forge's need for a commit (G8.1) | Approved |
| 3 | Resources and caps | Soft | V1–V7 per frozen set; closed `inputs` and `outputs` keep V1–V3 the same in every set | Approved |
| 4 | Activity slot | Soft | Settle before the commit (S3.4); the commit as an input (S3.3); rest before the commit (S8) | Approved |
| 5 | Combat resolver | Soft | Route fights read the baseline (C9), so no method touches a fight | Approved |

**Downstream (they depend on this system):**

| # | System | Hard or soft | What it needs from this GDD |
|---|---|---|---|
| 8 | Crafting route | Hard | The route plan (W5): six shared recipes and the shared chain, none patched |
| 9 | Fight and dungeon routes | Hard | The route plan (W5): three shared hunts, three Ember Breath hunts, Still Water's three-floor dungeon for EM, CL and TP; the winnable-baseline check it is asked for |
| 11 | Save and run lifecycle | Hard | `committed` as non-derived state (W12); its reset to none on a new run; the save-refusal cases (Edge Cases) |
| 12 | Validator | Hard | H1–H5; W1's functions |
| 13 | Interface shell | Hard | The `committed` event; the method always on screen; the redo line's duration format (Y2) |
| 14 | Method marks and breakdowns | Hard | `changed(m)` per method and the three verbs (W3) |
| 15 | Forge screen | Hard | The method-choice view and the commit dialog (W7) |
| 16 | Reforge and post-commit switch (VS) | Hard | `redoCost`'s unit and meaning (W9); the Circulating states |

**Bidirectional consistency.** #1 (Interactions row 7), #2 (Interactions row 7), #3 (Interactions
row 7, Dependencies), #4 (Interactions row 7, Dependencies) and #6 (Interactions row 7,
Dependencies) already list this system. #5 does not, and needs no row, since nothing passes
between them. Each downstream GDD must list "depends on: Methods" when it is written. The systems
index row #7 gains "Content records and schema" in Depends On, because the `method` rows and the
helpers this GDD calls are #1's.

## Tuning Knobs

These are the values this GDD owns. A change to either knob or to any patch re-runs H1–H5
and #6's B1–B13, because the balance table is sensitive (#6 S9, "Sensitivity").

| Knob | Shipped | Safe range | Too low | Too high | Interacts with |
|---|---|---|---|---|---|
| `FEED_MAX` (W3, H1) | 40 | 30–60 | Below 30, Still Water's Tidewater Pearl feed (+30) fails H1, and the methods can barely bend the forge (B2 and B4 get hard to pass) | Above 60, the largest base contribution in S9, a feed can outweigh any ingredient's base, so the method rather than the ingredient decides what an ingredient is (pillar 1) | #6's base `contrib` values; B1–B6 |
| `METHOD_PATCH_MAX` (H4) | 8 | 5–12 | Below 5, a method cannot hold the plan's two feeds or quenches and three opens | Above 12, the commit dialog runs past a phone screen (up to 12 lines of its own, 13 of gives-up and the redo line), and rule 54's message drowns | The route plan (W5); #15's dialog layout and #17's 390 px |

Fixed by design, not tuned here:

- **The three verbs** (W3) and the closed fields. Reopening one is a change to this GDD.
- **One spelling** (W4). A method opens; it never closes.
- **The commit holds for the run** in the MVP (W7.8). Changing that is #16's.

Content values, tuned with #6's table generator rather than as knobs:

- each method's feeds and quenches (W6), with Forge and proving (#6);
- which ingredients each method's routes reach (W5), with #8 and #9.

Knobs owned elsewhere that this system feels:

- `FIGHTLESS_CEILING_BP` and `FIGHTLESS_SLACK_MS` (#6 S8) bind #8's recipe times against the
  hunts and floors the route plan adds.
- `OVERGATHER_RATIO_BP`, `OVERGATHER_MIN_MS` and `OVERGATHER_MAX_MS` (#6 B9) are checked per
  method, so each method's route set must keep them.
- `BANK_CAP` (#4) sets how much rest before the commit comes back at double speed after it.

## Visual/Audio Requirements

This system has no assets of its own. It needs these from Method marks (#14), the Interface
shell (#13) and the Forge screen (#15):

- **Each method's tint and glyph.** The tint is the interface's only accent (Visual Identity
  Anchor, principle 1). The glyph carries the meaning, so a screen reads in greyscale (principle
  3).
- **A mark per verb.** A fed value, a quenched value and an opened route each wear the method's
  mark, and a mark shows which verb it is. Exactly the values in `changed(m)` are marked
  (principle 2; AC-W6-2). How a mark shows direction is #14's open art question.
- **A closed route as a visible absence.** A route the other method opens is shown by name as
  closed, never just left out (#14's second art question; #1 F7's withdrawn state).
- **The commit as one moment.** The tint moves through the interface when the commit lands, read
  from the `committed` event (the concept's Sensation aesthetic: "the method's tint moving through
  the interface").
- No audio: the game has no audio system yet.

## Game Feel

- **Choosing is free.** Looking at a method costs nothing and commits nothing, and the slot banks
  rest meanwhile (W10). The player is never hurried toward the commit.
- **One weighty step.** The commit is the run's first irreversible act. Its weight comes from the
  dialog's words, which name what closes and how to redo it, not from a delay or a
  hold-to-confirm (W7.3; #6 Game Feel for the forge, the run's second).
- **Instant.** The commit lands in the frame of the confirm: the tint, the marks and the routes
  change together (AC-W7-4).
- **The world answers.** After the commit the routes the method opens join the list, the other
  method's routes read as closed, and the marked values change. The player sees the method in the
  shape of the world before any forge (Player Fantasy, promise 5).

## UI Requirements

The Forge screen (#15) owns the method-choice view and the commit dialog. Method marks (#14) own
the marks. The Interface shell (#13) owns persistent context. This system requires:

1. **Both methods, side by side, from the first screen** (concept, Flow State Design). For each:
   its name and glyph, its feeds as deltas on the ingredient and affinity, its quenches as
   "quenched", the routes it opens by name, and the routes it closes. No absolute contribution
   appears anywhere in the view (#1 Edge Cases, "Before the commit"; AC-W7-1).
2. **"Begin circulating [method]"** for each method, opening the commit dialog of W7.3. Cancel is
   always available. A refused commit shows its reason.
3. **The method always on screen** after the commit: its name, glyph and tint (rule 32; #13).
4. **The other method stays readable**, marked as closed, so "what the other method changes"
   stays a visible hook (concept, Retention Hooks).
5. **Routes named per ingredient.** Wherever an ingredient's sources are listed, the screen names
   the route family that supplies it under the method (recipe, hunt or dungeon floor). Route
   fights resolve without play (#5 C9), so this is where the route identity is felt
   (`game-designer`).
6. **Every changed value marked**, with its breakdown on tap: the method step shows its verb
   (#2 P8, #14; rule 97). No interaction is hover-only (MVP required item 8).
7. **Words.** Player-facing text follows the Player Fantasy's tone. "Patch", "triple", "change
   set" and "frozen set" are designer terms, not copy.

> **📌 UX Flag — Methods**: this system has UI requirements. The Forge screen (#15) UX spec
> (`/ux-design`) must cover the method-choice view and the commit dialog, and the Method marks
> (#14) spec must cover the three verbs' marks and the closed route, before epics are written.
> Stories cite `design/ux/[screen].md`, not this GDD.

## Cross-References

| This GDD | Refers to | For |
|---|---|---|
| W2, W3 | #1 R1, R4 rows `method.commitText`, `method.patches`, `method.redoCost`, `source.enabled`, `ingredient.contrib`; R4.6 | The record this system fills and the rows it narrows |
| W3, W4 | #1 R6.2, R6.3, F8 | Patch legality; no-op patches as load errors |
| W1, W7.3 | #1 R7.2 (`closesLines`, the redo line), R8.1 | The generated dialog lines |
| W7.6, W10 | #1 R5.3, R5.5, F7 | `committed()`, need text before the commit, record states after it |
| W7.5 | #2 P1.2, P9 | The method stage at load; `effective` and the segment boundary |
| W6 | #2 P8.2 | Marks equal the change set |
| W3.1, W11 | #3 V1–V3, V7 (K9) | Method-invariant bills and yields; V7 out of every patch's reach |
| W7.5, W10 | #4 S3, S7, S8 | Settle first; the commit as an input; rest before the commit |
| W5.5 | #5 C8, C9 | Route fights read the baseline; a lost unit pays nothing |
| W6, W11 | #6 G8.1, G14 (B1–B13), S7, S9 | The forge needs a commit; the checks the patches pass; gathering time; the balance table |
| W8 | #1 States and Transitions | Content is frozen at runtime, so the dialog cannot go stale |
| Player Fantasy, W5 | Concept: Core Fantasy, mechanic 2, pillars 2–4, Visual Identity Anchor, MVP Definition item 3 | The method's promise, the commit, the guarantees, the marks, the routes |
| W7.3 | Hundred Days rule 54 (`research/hundred-days-reference/06-design-rules.md`) | Irreversible choices say what they close |
| W7.3 | Arcanum rules 15 and 38 (`research/arcanum-reference/12-design-rules.md`), *beat* | Keep the consequence, surface the warning per record |
| W2, W7 | Arcanum rule 6 | One exclusive choice per slot: one method per run |
| W5.4, Player Fantasy | Arcanum rule 71 | Identity lives where the numbers live |
| Overview | Arcanum rule 4 (narrowed, as the concept states) | Late content patches early content through a closed surface |
| Overview | Arcanum rule 73 | The fork differs inside the stage that offers it |
| Overview | Magic Research 2 rule 86 (`research/magic-research-2-reference/08-design-rules.md`) | A method as a bundle of multipliers, set aside |
| UI Requirements | Arcanum rule 32; Magic Research 2 rule 97 | Persistent context; every number explains itself |

**Answers this GDD gives to other GDDs' open questions:**

- **#1 Open Question 10** (`redoCost`): milliseconds of slot time, the price of leaving a method;
  absent in the MVP; the redo line names the new run (W9; amendment A5).
- **#1 Open Question 11** (source count): about 23 sources, 20 under each method (Y3; A5 moves
  R1's target).
- **#3 Open Question 6** (V7 under both methods): yes by construction. No patch can reach the V7
  source, and bills and yields are closed to methods (W3.1, W11).
- **#6 Open Question 1** (the real patches): S9's patches are the real ones, so B1–B8, B11 and
  B12 pass as S9 shows, and each best stays at 4 seals (W6). B9, B10 and H5 wait on #8 and #9's
  real sources.

**Amendment this GDD makes to an approved GDD** (recorded in the target's Amendments header):

- **A5 to #1 Content records and schema** (designer-approved, 2026-11-20):
  - `method.redoCost`'s unit becomes ms (R4 row and note 8);
  - R7.2's redo line reads "Redo: only by starting a new run" when `redoCost` is absent, and
    R7.2 also lists the dialog's gives-up lines from `givesUpLines` (this GDD's W1, Y1). The
    Edge Cases' redo case, Cross-References and AC-R7-4 are updated to match;
  - R1's source target becomes about 23;
  - Open Questions 10 and 11 are resolved here.
- **Notes only, no rule change:** #3 Open Question 6 and #6 Open Question 1 are marked resolved by
  this GDD. The systems index's #7 paragraph ("re-prices crafting") is corrected to the MVP's
  surface.

## Acceptance Criteria

**Tags:**

- `[unit]` is a pure rules-core test.
- `[validator]` runs the Validator (#12) on a fixture.
- `[integration]` exercises another system's call path, with that system stubbed where it is
  not built yet.

**Content:** **Fx** means a fixture loaded against a test schema (#1 R8.2). **S** means the
shipped content. Its methods are W6's, and its other values are #6 S9's until #8 and #9 author
the sources. Sources are named by role ("Ember Breath's EM hunt") until those GDDs give them ids.
A criterion that needs real source records is marked *[blocked: #8, #9]*. Abbreviations
follow #6 S9.

### Rules

- **AC-W1-1** [unit, Fx] **GIVEN** a deep-frozen `checked`, with the clock, any random source and
  all game state stubbed to throw if read, **WHEN** each W1 function runs 1,000 times on equal
  arguments, **THEN** every result deep-equals the first and no input changes. **AND** each
  function given a method id content does not have throws a `RangeError`.
- **AC-W2-1** [validator, S] **THEN** content has exactly two methods, named "Ember Breath" and
  "Still Water". Each has a `commitText` that loads (no digit), and neither has `redoCost`.
- **AC-W3-1** [validator, Fx] **GIVEN** a method with a feed of 1, a feed of 40, a quench and an
  open, **THEN** it loads and passes H1. **AND** a quench on an affinity already at 0 is a load
  error (no-op patch), while a feed on an affinity at 0 loads.
- **AC-W4-1** [unit, Fx] **GIVEN** a source authored `enabled: false` that method A opens and a
  source authored enabled, **THEN** the first is enabled in `set_A` only and the second in both
  sets. **AND** an open on the authored-enabled source is a load error (no-op patch).
- **AC-W5-1** [validator, S] *[blocked: #8, #9]* **THEN** under both methods EJ, IH and GM each
  have their recipe and one hunt enabled. **AND** EM, CL and TP each have their recipe and a hunt
  under Ember Breath, and their recipe and a dungeon floor under Still Water. **AND** no dungeon
  floor is enabled in Ember Breath's set.
- **AC-W6-1** [validator, S] **THEN** Ember Breath's change set is exactly: EM Cinder `add` 10,
  IH Jade `set` 0, and three opens. Still Water's is exactly: EJ Bark `add` 20, TP Bark `add`
  30, and three opens. **AND** `bestSeals` is 4 under each method. The bests are EJ · IH · EM · CL
  and EJ · IH · EM · TP, and each scores 3 under the other method (#6 AC-S9-1 regenerates the
  tables).
- **AC-W6-2** [unit, S] (Player Fantasy, promise 3) **THEN** every value whose triple is in
  neither method's change set is equal in `set_EB` and `set_SW`. Every value whose triple is in
  exactly one change set differs from `checked` in that method's set only.
- **AC-W7-1** [unit, S and Fx] (the method-choice view) **WHEN** the view's content is built for
  both methods, **THEN** Ember Breath shows "+10" on EM Cinder, "quenched" on IH Jade and three
  "Opens:" lines. Still Water shows "+20" on EJ Bark, "+30" on TP Bark and three "Opens:" lines.
  **AND GIVEN** an Fx ingredient with a base `contrib` of 77 and a feed of 10, **THEN** neither
  "77" nor "87" appears anywhere in the view. **AND** choosing which method to view changes no
  saved state and is not an input.
- **AC-W7-2** [unit, S] (the dialog) **WHEN** `commitDialog(EB, checked)` is built, **THEN** it
  reads, in order: "Begin circulating Ember Breath"; Ember Breath's `commitText`; "Opens:" for
  each of its three hunts, and "Changes: Ember Marrow: Cinder" and "Changes: Ironbark Heartwood:
  Jade", in triple order (#1 R7.2); "Closes: Still Water"; one "Closes:" line for each of the
  three floors in id order; "Redo: only by starting a new run". **AND** Still Water's dialog
  mirrors it, with "Closes: Ember Breath" and the three Ember Breath hunts. **AND** no line holds
  a digit except through a field. **AND** Cancel changes nothing.
- **AC-W7-3** [integration] (legality) **GIVEN** Ember Breath committed, **WHEN** a commit of
  Still Water or of Ember Breath is confirmed, **THEN** it is refused with "Already circulating
  Ember Breath", `committed` is unchanged, no `committed` event is emitted, and the away clock is
  not restarted.
- **AC-W7-4** [integration, #2 and #4 stubs] (the atomic order) **WHEN** a commit of Still Water
  is confirmed, **THEN** spies record, in order: the id check, one settle, the legality check,
  `committed` set to Still Water, one call of `effective(set_SW, none, none)`, the away clock
  restarted, and `committed {Still Water}` emitted once. No observer runs between the write and
  the event. **AND** an unknown id throws a `RangeError` with no settle and no event. **AND GIVEN**
  a settle stub that throws, **THEN** `committed` stays none and no `committed` event is emitted.
- **AC-W7-5** [integration, Fx] (#1 F7 after the commit) **GIVEN** revealed sources that are
  shared, opened by the committed method, opened by the other, and one whose reveal is unmet,
  **WHEN** the commit lands, **THEN** each moves to its final state in one step: the first two by
  their `need`, the third withdrawn, the fourth hidden. **AND** need text no longer leads with
  "Needs a method committed". **AND** the forge is Open, the rest bank is not reduced, and the
  commit adds 0 ms of slot time.
- **AC-W7-6** [integration, #6 AC-G8-1] **GIVEN** no method committed, **WHEN** the player tries to
  forge or to start any source, **THEN** both are refused with "Needs a method committed", and
  nothing changes or is emitted.
- **AC-W8-1** [integration] **GIVEN** the commit dialog open and the player away for 8 hours,
  **WHEN** the game settles that time, **THEN** `committed` is still none and no `committed` event
  is emitted. **AND** a confirm after the settle commits normally.
- **AC-W9-1** [unit] (Y2) **THEN** the redo line of both shipped methods is "Redo: only by
  starting a new run". **AND GIVEN** an Fx method with `redoCost` 1,800,000 and a test duration
  format, **THEN** the line is "Redo: 30 min to change method".
- **AC-W10-1** [integration, #4 and #6 stubs] **GIVEN** Choosing, **THEN** every Start is refused,
  forge-screen plans are accepted, and rest banks time.
- **AC-W12-1** [integration] *[blocked: #11]* **WHEN** a run is saved, **THEN** the save holds
  `committed` and not the method being viewed. **AND** exactly one `committed` event is emitted
  per accepted commit. **AND** only a new run sets `committed` back to none.

### Formulas

- **AC-Y1-1** [unit, Fx] **GIVEN** two methods whose ids and names sort in different orders, and
  sources whose ids and names do too, **WHEN** `givesUpLines` runs, **THEN** it lists the other
  method first, then its opens in source-id order (UTF-16), with (M − 1) × (1 + |opened|) lines.
  On S that is 4 lines for each commit.
- **AC-Y3-1** [unit, Fx] **THEN** `routes(TP, SW)` is 2 (the recipe and the floor) and
  `routes(TP, EB)` is 2 (the recipe and the hunt), and the floor is disabled in `set_EB`. **AND**
  [validator, S] *[blocked: #8, #9]* every one of the 12 (ingredient, method) pairs gives 2, with
  23 sources in all and 20 enabled under each method.
- **AC-Y4-1** [validator, Fx] (H5 on #6 S9's stub minutes) **THEN** Ember Breath passes (best 28
  minutes, cheapest makeup 27), and Still Water fails (its best, EJ · IH · EM · TP, is also the
  cheapest at 26). **AND GIVEN** B1 failing for a method, **THEN** H5 is reported as not
  evaluated for it, never as passed.

### Checks (each [validator, Fx]: S passes; the named change fails)

- **AC-H1-1** Each of these fails H1, named: a patch on `duration`, on `inputs`, on `outputs`; a
  `set` on `contrib` to 5; an `add` on `contrib` of 0, 41 or −5; a `set` on `enabled` to 0; a
  method carrying `redoCost`.
- **AC-H2-1** Still Water also opens Ember Breath's EM hunt: H2 fails, naming the source.
- **AC-H3-1** A method with no opens, or one whose only open has no ingredient in its outputs:
  H3 fails.
- **AC-H4-1** A method with 9 triples fails H4. One with 8 passes.
- **AC-V7-1** [validator, Fx and S] (#3 Open Question 6) The source that passes V7 cannot be
  reached by any patch: an open on it is a load error (no-op), and a `duration` or `outputs`
  patch on it fails H1. **AND** under S, V7 reads the same source values in both frozen sets.

### Performance

- **AC-P-1** [unit, S] Each W1 function takes at most 5 ms (median of 100 runs), and H1–H4 over
  the shipped content take at most 100 ms in all. Both are provisional until #1's ADR 9 sets the
  budgets.

### Checked by review, not by test

- The commit dialog's wording, and that `commitText` reads as voice and claims no number, route or
  redo (W2).
- That the dialog has no delay and no hold-to-confirm, and wraps rather than truncates at 390 px
  (#15, #17).
- Whether the one-ingredient swap between the two bests feels like a different problem, as a
  player reads it: a tester who has played both methods is asked (W6; Open Questions).

*Specialist: `qa-lead` drafted these criteria and flagged eight rules that were not testable as
written. Five were fixed in Core Rules: a refused commit emits no `committed` event, there is one
observation point after the commit, an open on an enabled source is a load error, `redoCost`
fails H1 in the MVP, and `commitText`'s claim rule is review-only. The other three are open:
the winnable-baseline check (#9, #12), H5's real pass (#8, #9), and the meaning of a `redoCost`
of 0 (#16).*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | The two bests share three ingredients and swap one (CL for TP), and the routes carry the rest of pillar 2 (W6). Does the second method feel like a different problem in play? If not, the reserve is a feed of IH Gale +30 under Ember Breath, the only theme-coherent set the generator found whose bests share two (`creative-director`), which would amend #6 S9 | Designer | Wave A checkpoint: both methods played in one session |
| 2 | Resolved 2026-11-20 by #9 (`fight-and-dungeon-routes.md` U1, N12): yes, an error, and wider than asked. U1 covers disabled sources too, because each is open under the other method, so `routes(i, m)` and #6 S7 count only routes that pay | Fight and dungeon routes (#9), Validator (#12) | Done |
| 3 | H5 fails Still Water on S9's stub times. Do #8's and #9's real times make at least one of Still Water's best four dearer than the cheapest makeup? #9's half resolved 2026-11-20 (`fight-and-dungeon-routes.md` X3): on #9's routes H5 passes by 120 s under Ember Breath and 254 s under Still Water, and stays passing while each refined bill costs at most 120 s and the three bills are within 80 s of each other. #8 confirms its chain is inside those limits | Crafting route (#8), Fight and dungeon routes (#9) | #8 GDD |
| 4 | Should a method re-price sources once breakdowns can show a direction (the declined third lever, W3.2)? | Designer, with Method marks (#14) | Vertical Slice |
| 5 | How is `redoCost` paid, what does 0 mean, and how does a switch keep `committed()` monotone (#1 Open Question 6)? | Reforge (#16) | Before the Vertical Slice |
| 6 | A third method: does Y1 subtract shared opens, does `METHOD_PATCH_MAX` still fit the dialog, and where do its routes fit a record budget already at 54–60? | Designer, Reforge (#16) | Vertical Slice |
| 7 | Should the dialog's "Changes:" lines carry a direction word (#1 R7.2's recommended addition; #2 Open Question 6)? | Method marks (#14), Forge screen (#15) | #14 and #15 UX specs |

*Open Question 3, crafting half: resolved 2026-11-21 by Crafting route (#8), `crafting-route.md` L6.4. On #9's routes with #8's real bills (60, 70 and 70 s), H5 passes by 120,000 ms under Ember Breath and 280,000 under Still Water. X4 holds for the hearth alone.*

**ADRs required** (representation this GDD leaves out):

1. The W1 functions' signatures and result types, the `commit` action, and the `committed`
   event's channel, with the Interface shell (#13) and #6's ADR 2.
2. The Validator's report format for H1–H5, including "not evaluated" for H5. It extends #1's
   ADR 8 and #6's ADR 3.
3. `committed`'s save slice, with Save and run lifecycle (#11).
