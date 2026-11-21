# Crafting Route

> **Status**: Approved 2026-11-21 (lean review; recommended follow-ups in `design/gdd/reviews/crafting-route-review-log.md`)
> **Author**: designer + Claude (`/design-system`)
> **Last Updated**: 2026-11-21
> **Amendments**: A1 2026-11-21 — Open Question 3 marked resolved by Content validator (#12, VC12): a key-item make, and any ingredient source that X6 and #9 U2 do not cover, holds no other output (status edit only, no rule change here; designer-approved). Touches Open Questions row 3
> **Last Verified**: 2026-11-21
> **Implements Pillar**: 4 (No dead ends, no attention tax); supports 3 (The build is a problem) and 1 (The forge is the milestone)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-21, re-run on the re-tune to #9's premium (no blocker; advisories applied: Player Fantasy's third lesser-road bullet, kept progress for long makings in L4.5 and Game Feel, choice density added to Open Question 4)

## Summary

Crafting route is the fightless road to all six ingredients, so no build ever needs a fight it
cannot win. It authors fourteen sources, all open under both methods and never patched by one:
three gathering, three refining, two key-item makes (the Hearth Lamp and the Tuning Chisel, which
open the recipes), and one recipe per ingredient. One refining unit pays each of #9's route bills,
each recipe is priced inside #9's premium band (1.25× to 2× its fight route), and it owns checks
X1–X6.

> **Quick reference** — Layer: `Feature` · Priority: `MVP` · Key deps: `Content records and schema (#1), Resources and caps (#3), Activity slot (#4), Forge and proving (#6), Methods (#7)`

## Overview

Crafting route is the fightless road to every ingredient. The player gathers three raw
materials from nothing and refines them at one station, **the hearth**. They make two key items
once each, and craft each of the realm's six ingredients from its one recipe. Every source here
is an ordinary activity record (#4 S2): inputs, outputs and a duration per unit, and never a
fight. So no part of this road can be lost, and every unit pays exactly what it shows.

The system has a data side and a player side.

- **Data.** It owns the base values of the 14 sources that Methods' route plan gives it (#7 W5,
  Y3): three gathering sources, three refining sources, two key-item makes and six ingredient
  recipes, with their gates. It confirms the values of Resources and caps' eight resources (#3
  K1), which were provisional until this GDD. It also owns the checks that keep the fightless road a
  real road and not a nominal one (Core Rules).
- **Player.** It owns three loops. The 30-second loop: fill a store and spend it before it brims
  (rule 18). The short-term loop: make an item that opens the next source (concept, Short-Term).
  And the backward plan: each ingredient's recipe can be read from the commit, with need text
  that names what is missing, so the player can trace the Foundation they want back to the ash
  pits (concept, Key Dynamics).

**Why it exists.** Pillar 4 promises every ingredient two sources under every method, one with
no fight anywhere in its input chain and within a stated price ceiling of the other (#1 R8.4,
#6 G12). This system is that fightless source for all six ingredients. Without it, a route fight
the baseline cannot win would strand a plan. The concept's core loop would also lose its first
two verbs, "gather, refine".

**What it is not.**

- **Not method-patched.** No method changes a recipe's bill, yield or time (#7 W3). A method
  never opens or closes a source here either: all 14 are authored enabled and shared by both
  methods (#7 W4, W5). So every number on this road is the same under both methods. The systems
  index's earlier line "a method may re-price a recipe" no longer holds for the MVP.
- **Not a fight route.** No source here has `fights`. Fights, hunts and the dungeon are Fight and
  dungeon routes' (#9), designed in parallel. Where a check needs both roads (#6 B9, B10; #7 H5;
  #9 U3), this GDD states its half and names #9 for the rest.
- **Not a station record.** The hearth is implicit in its recipes (#1 R1). It has no level, no
  upgrade and no second copy.
- **Not random.** Every unit pays its stated outputs. Nothing here rolls.

Alternatives set aside:

- **A recipe per method**, with different bills or times under each. #7 declined re-pricing for
  the MVP (W3.2), so one recipe per ingredient serves both methods.
- **Two recipes for some ingredients.** They add fightless sources the route plan does not need,
  and the record budget is already at 54–60 of the concept's 40–60 (#7 Y3).
- **A station ladder** (furnace tiers that speed recipes). It is a new system before the existing
  ones interlock (anti-pillar "a sprawl of systems").

This GDD states rules, invariants, formulas and acceptance criteria. Record files and source ids
in code are representation, decided by ADR (Open Questions).

## Player Fantasy

**Framing: both.** The player works this road directly, choosing each gathering, rendering and
making in the 30-second loop. They also feel it indirectly, as the certainty that no ingredient
is ever out of reach for want of a fight. One promise covers both: **the hearth turns what you
gathered into what the forge asks for.**

- **The first minutes.** The player skims the ash pits, renders the tallow into oil, fells
  ironbark and quarries jade. Kindling the Hearth Lamp opens the first recipes, and the Tuning
  Chisel opens the jade ones. The hearth has opened its own road before any fight has been fought.
- **The plan.** Every recipe can be read from the commit. Wake the Echo Jade, for instance,
  needs four Jade Blanks and the Tuning Chisel. The player traces the Foundation they want back
  through the hearth to the ash pits, and the need text names each missing link.
- **The making.** A recipe is one unit with a long pull: from a minute to a quarter-hour at the
  hearth, the dearer the ingredient the longer, then the ingredient is in hand. It never misses or rolls, so the hearth pays exactly what it shows.

This serves:

- **Pillar 4**: *"Every ingredient keeps at least two sources under every method, one of them
  needing no fight anywhere in its input chain."* For all six ingredients, under both methods,
  that source is the hearth.
- **Pillar 1**: *"Every realm breakthrough is assembled from chosen ingredients."* Each
  ingredient has a making of its own, so gathering one reads as choosing it.
- **Pillar 3**, through the hearth's prices. A fight-free run still pays for every ingredient it
  holds beyond the four it forges (Core Rules), so the hearth is a road with the forge's own
  costs, not a way around them.

It sits beside its siblings' promises: "the plan holds" (#1), "every number can tell you why"
(#2), "the forge shapes the vessel that holds the next climb" (#3) and "when the work pauses,
breath fills the slot" (#4).

**The risk: the lesser road.** A fightless route can read as the easy one, or the safety net.
Three things keep it a craft:

- the words are a craftsman's, never a fallback's;
- the key items are visible beats the hearth earns for itself;
- the hearth feeds both roads. Its lines pay every route's bill (L2), and its recipes are the one
  road the player can read whole from the commit. A recipe costs 1.25× to 2× its fight route
  (#9's premium, U3, and #6's ceiling, B10), so choosing between it and a hunt is a matter of tempo
  and taste, not of strength.

**Tone.** Player-facing text uses *hearth, skim, render, season, carve, kindle* (the lamp),
*tune* (the chisel), *wake* and *set*. It never uses "craft", "workshop", "bench", "station",
"tier", "cap", "overflow" or "buffer". *Forge* is kept for the realm's forge and *breath* for
rest (#4).

- Need text names the missing link in record names, as #1 R5.5 generates it: "Needs Hearth
  Lamp", "Needs Rendered Oil ×9 (5 more)".
- A stop names the brim in #3's words: "Ash Tallow is full".
- A key item's making is logged as the hearth opening the next road. "The lamp's light shows
  what the hearth can make" is `flavor`, not generated text, so it states no number (rule 70; #1 R4.6).

*Specialist: `creative-director` consulted. It gave three framings ("the hearth turns what you
gathered into what the forge asks for", "every ingredient has a road through the hearth", "the
hearth keeps its word") and recommended the first. The designer adopted it on 2026-11-20. The
second leans on the guarantee and reads as a safety net. The third names no road.*

## Detailed Design

### Core Rules

Notation:

- Ingredient abbreviations follow #6 S9: EJ Echo Jade, IH Ironbark Heartwood, EM Ember Marrow,
  CL Cloud Lotus, GM Ghost Moss, TP Tidewater Pearl. EB is Ember Breath, SW is Still Water.
- `set_m` is method m's frozen content set (#1 R8.1).
- The **hearth road** under m is the largest set of enabled sources in `set_m` in which every
  source has empty `fights`, and every id it draws on has a producer in the set. That covers each
  id of its `inputs` and of its `reached` atoms, in `reveal` and in `need`. Ids held from the
  start need no producer. It is derived from content, never listed. So a fightless source that
  another GDD authors joins it, and the checks of L8 cover it too.
  - This is #1 R8.4 check 2's "no fight anywhere in its input chain", with one addition: gates
    count. A recipe whose `need` names a key item that only a fight makes is not on the road,
    because the item cannot be had without the fight (X5).
- T(X, m) is #6 S7's gathering time and price(s) is #6 S8's price, used unchanged (L7).
  T_fl(X, m) is S7 run on the hearth road alone (E1).
- Times are milliseconds of untended slot time, at single speed with an empty rest bank
  (#4 S11), unless a rule says otherwise.

#### L1. What this GDD authors

1. **Fourteen sources** (#7 Y3):
   - three **gathering** sources, with no inputs;
   - three **refining** sources, each turning one raw store into one refined store;
   - two **key-item makes**, the Hearth Lamp and the Tuning Chisel;
   - six **recipes**, one per ingredient.
2. **All fourteen are authored enabled, have no `fights`, and no method patches them.** This is
   Methods' route plan (#7 W4, W5) and closed surface (W3). So every value in L2 is the same in
   `set_EB` and `set_SW`, and every check of L8 gives one answer for both methods.
3. **The station is the hearth.** It is implicit in its recipes (#1 R1). It has no record, no
   state and no level.
4. **The resource set is #3's K1, unchanged** in ids, names, caps and starts (answering #3 Open
   Question 6). L2 fits it, with every store's largest bill at 75–100% of its cap (V2).

#### L2. The sources (content)

Durations are in ms per unit. The **price** column is #6 S8: the untended time to make one unit
from a run start.

| id | Name | Role | Inputs | Outputs | Duration | `need` | Price |
|---|---|---|---|---|---|---|---|
| `skim_ash_pits` | Skim the Ash Pits | gathering | — | Ash Tallow 5 | 5,000 | — | 5,000 |
| `render_tallow` | Render Tallow | refining | Ash Tallow 30 | Rendered Oil 6 | 30,000 | — | 60,000 |
| `kindle_lamp` | Kindle the Hearth Lamp | key item | Rendered Oil 3 | Hearth Lamp 1 | 30,000 | — | 90,000 |
| `fell_ironbark` | Fell Ironbark | gathering | — | Ironbark Log 3 | 5,000 | — | 5,000 |
| `season_planks` | Season Planks | refining | Ironbark Log 24 | Seasoned Plank 5 | 30,000 | — | 70,000 |
| `tune_chisel` | Tune the Chisel | key item | Seasoned Plank 3, Rendered Oil 4 | Tuning Chisel 1 | 30,000 | Hearth Lamp | 250,000 |
| `quarry_jade` | Quarry the Jade Seam | gathering | — | Rough Jade 2 | 5,000 | — | 5,000 |
| `carve_blanks` | Carve Jade Blanks | refining | Rough Jade 16 | Jade Blank 4 | 30,000 | — | 70,000 |
| `render_ash_fat` | Render Ash-Fat | recipe | Rendered Oil 9 | Ember Marrow 1 | 140,000 | Hearth Lamp | 350,000 |
| `cure_heartwood` | Cure the Heartwood | recipe | Seasoned Plank 8, Rendered Oil 4 | Ironbark Heartwood 1 | 120,000 | Hearth Lamp | 410,000 |
| `open_cloud_lotus` | Open a Cloud Lotus | recipe | Rendered Oil 12, Seasoned Plank 6 | Cloud Lotus 1 | 550,000 | Hearth Lamp | 900,000 |
| `grow_ghost_moss` | Grow Ghost Moss | recipe | Seasoned Plank 8, Ironbark Log 24 | Ghost Moss 1 | 530,000 | Hearth Lamp | 800,000 |
| `wake_echo_jade` | Wake the Echo Jade | recipe | Jade Blank 4 | Echo Jade 1 | 60,000 | Tuning Chisel | 380,000 |
| `set_tidewater_pearl` | Set a Tidewater Pearl | recipe | Jade Blank 6, Seasoned Plank 6 | Tidewater Pearl 1 | 770,000 | Tuning Chisel | 1,300,000 |

- A `need` entry "Hearth Lamp" is the atom `reached(hearth_lamp, 1)`, and "Tuning Chisel" is
  `reached(tuning_chisel, 1)`. No source here has a `reveal` gate.
- Ids and names are provisional until a save could hold them (#1 R2.3). Names are unique across
  all records (#1 R2.2): no source shares a name with a resource or an ingredient.
- `desc` and `flavor` are written with the content, under rule 70 and the Player Fantasy tone.
- **Largest bill per store** (V2, #3 Q6): Ash Tallow 30 of 40 (7,500 bp), Ironbark Log 24 of 30
  (8,000), Rough Jade 16 of 20 (8,000), Rendered Oil 12 of 12 (10,000), Seasoned Plank 8 of 10
  (8,000), Jade Blank 6 of 8 (7,500). Every output fits its store (V3).
- **Rendered Oil is the hub.** Five of the eight makes draw on it, and the Cloud Lotus takes a
  full store of 12. This is the store the 30-second loop presses hardest.
- **One refining unit pays a route's bill.** #9's hunts and floors each spend half a store:
  Rendered Oil 6, Seasoned Plank 5 or Jade Blank 4 (#9 N2.3). Each is exactly one unit of its
  refining source, so the three bills cost 60,000, 70,000 and 70,000 ms (L6.2).

#### L3. The ladder: what each key item opens

1. **At the commit**, seven sources are actionable: the three gathering and three refining
   sources, and Kindle the Hearth Lamp. The first screen therefore has three live lines (fuel,
   timber, stone) and one goal on it, the lamp.
2. **The Hearth Lamp's first making opens** the chisel make and the four lamp recipes: Render
   Ash-Fat, Cure the Heartwood, Open a Cloud Lotus and Grow Ghost Moss.
3. **The Tuning Chisel's first making opens** the two stone recipes, Wake the Echo Jade and Set a
   Tidewater Pearl.
4. So the concept's short-term loop, "craft an item that opens the next source", fires twice on
   the hearth road before any fight: the lamp at 100 s (a skim, a render, the kindling), then the
   chisel.
5. **Every gate here is a `need`, never a `reveal`.** All fourteen sources are revealed from the
   run start. Before the commit they wait with "Needs a method committed" (#1 R5.5, F7). After
   it, each waits with its own generated need text until its key item is made. The whole road can
   therefore be read before and after the commit, which the backward plan needs (concept, Key
   Dynamics). This is rule 2, reveal before enable, applied to every source. Discovery lives
   elsewhere: base contributions stay hidden until an ingredient is held (#6 G7), and fights are
   #9's to reveal.
6. **Key items are made once and never spent** (V5). The lamp is read by five gates and the
   chisel by two (V6). A key item is a store of cap 1, so its make runs one unit and then its
   store is full (#4 S5.3). The gate reads the high-water mark (#1 R5.3), so it can never close
   again.
7. **Only sources made once carry a gate.** The gathering and refining lines run many units per
   chain, so they are open from the commit. The lamp and the chisel gate only the chisel make and
   the six recipes, each of which runs one unit. So #6 S8 charges each key item once per price, as
   S7 does (L7), and #9's bills, which draw on the lines, carry no gate (L6.2).

#### L4. Recipes

1. **One recipe per ingredient.** It outputs exactly 1 of that ingredient and **nothing else**.
   No recipe has a by-product, so #4's T2 can never fire on this road. X6 makes this an error,
   which answers the recipe half of #4 Open Question 6.
2. **A recipe runs one unit.** An ingredient's store holds 1 (#3 K2.3). Once the ingredient is
   held, its store is full, and #4 S5.3 refuses the next unit. So the hearth never over-makes an
   ingredient, and making one again after the forge consumes it is an ordinary Start.
3. **No recipe spends an ingredient** (#6 B13). Every input is a refined or raw store.
4. **What each recipe draws on** follows the ingredient's character. This is an authoring
   guideline, not a check:

   | Ingredient | Leans (#6 S9 base) | Draws on |
   |---|---|---|
   | Ember Marrow | Cinder | fuel only: the cheapest, the spark both best makeups hold |
   | Ironbark Heartwood | Cinder and Bark | timber and fuel |
   | Cloud Lotus | Gale and Cinder | a full oil store and timber; Gale has no store, so its price is time |
   | Ghost Moss | Bark | timber only, with raw logs as well as planks |
   | Echo Jade | Cinder and Jade | stone, behind the chisel |
   | Tidewater Pearl | Bark | stone and timber, the dearest, at 770 s |

5. **A making is one long pull.** On L2's content it is 60 s for the Echo Jade, about two minutes
   for Ember Marrow and the Heartwood, and 9–13 minutes for the Cloud Lotus, the Ghost Moss and
   the Tidewater Pearl. The long pulls are where a recipe pays #9's premium (L6.3). A recipe costs
   1.25× to 2× its fight route, and its bills cannot carry that alone, because one refining unit
   pays a route's whole bill (L2). A long making runs while the player is away, like any unit,
   and keeps its progress when the player switches to something else, so it can be split across
   other work (#4 S6). A recipe never misses and never rolls (concept: no randomness gates content).

#### L5. Pacing: the first minutes and the run floor

1. **First store.** Skim the Ash Pits fills Ash Tallow from 0 to 40 in 8 units, 40 s after the
   commit. This passes #3 V7 (45,000 ms) under both methods.
2. **First ingredient.** Ember Marrow is in hand 290,000 ms (4.8 minutes) after the commit on the
   hearth road alone: 12 skims, 2 renders, the lamp and the recipe (E1). This is rule 17's
   "first ingredient within five minutes", and X2 holds it there. The margin is 10 s. Ember
   Marrow's recipe must also cost at least 337,500 ms to keep #9's premium (L6.3), so its duration
   can only sit between 127,500 and 150,000 ms. On the mixed road #9's Pangolin Hunt gives the first
   ingredient sooner, at 240,000 ms (#9 U5).
3. **The run floor (answering #4 Open Question 1).** Every uninterrupted run on the hearth road
   lasts at least `RUN_FLOOR_MS` (30,000 ms) at single speed:
   - every refining, key-item and recipe unit is at least 30 s long (refining and key-item units
     run 30 s, recipes 60–770 s);
   - every gathering source refills the smallest bill drawn from its store in at least 30 s.
     After a render (30 of 40 taken), the skim refills in 6 units, 30 s. After a season or a
     carve, the grove and the seam refill in 40 s.
   - Each gathering yield divides its smallest bill (5 into 30, 3 into 24, 2 into 16). So a
     refill after a bill drawn from a full store ends exactly at the brim and spills nothing,
     and the stop it ends on is "full", never "spilled".

   The floor binds runs that refill a bill drawn from a full store, which is what a player who
   lets each run end by itself makes. A player who stops a run early, or starts from a part-full
   store, can make a shorter one. That is their choice, not a forced click.

   X1 checks this (E2). Take a **fill-then-spend player**: one who starts the producer of the
   first input their goal lacks and lets every run end by itself. That player reaches the first
   ingredient in 6 runs, at 300,000 ms. E1's 290,000 is the bound, and the 10 s between them is
   the first store filled to the brim before the first render. They reach either method's best
   four in 28 runs, with a median run of 30 s and none under 30 s. Between the long makings that is
   one choice every 30 s, the concept's 30-second loop. No choice is ever forced, because a late switch costs nothing: the rest bank returns the
   waiting time doubled (#4 S8.6).
4. **Why a floor, not a target.** Below 30 s, the loop becomes the ping-pong #3 and #4 flagged:
   about ten switches in two minutes, each with one obvious answer (#4 Open Question 1). Above
   it, later units are free to run longer, and the recipes do (L4.5).

#### L6. Prices, and this GDD's half of the shared checks

The recipe prices of L2 are the fightless sources' f_i in #6 S8 and G12. The hearth road alone
gives these gathering times (E1), the same under both methods, since no method touches it:

| | Ember Breath | Still Water |
|---|---|---|
| Best makeup (#6 B1) | EJ · IH · EM · CL | EJ · IH · EM · TP |
| T_fl(best) | 1,640,000 (27.3 min) | 1,880,000 (31.3 min) |
| T_fl(all six) | 3,330,000 (55.5 min) | 3,330,000 (55.5 min) |
| Cheapest makeup | EJ · EM · GM · IH, 1,540,000 (25.7 min) | the same |
| Over-gathering (B9's tests) | ratio 2.03, +1,690,000 | ratio 1.77, +1,450,000 |
| Price leak (H5's test) | best is 2nd of 15, +100,000 over the cheapest | best is 3rd of 15, +340,000 |

1. **B10 (#6): this GDD's half.** B10 passes for ingredient i when f_i ≤ max(2 × p_i, p_i +
   60,000), where p_i is the price of i's cheapest other enabled source. Under the route plan
   that is its one fight route (#7 W5). Every f_i here is above 120,000 ms, so B10 passes exactly
   when **p_i ≥ ⌈f_i / 2⌉** (E3), the **fight floor**. #9's routes are priced on L2's bills
   (#9 X1), and every one clears its floor:

   | Ingredient | f_i (recipe) | Fight floor | #9's route p_i, EB / SW | #9's band (X2) |
   |---|---|---|---|---|
   | Ember Marrow | 350,000 | 175,000 | 270,000 / 270,000 | 337,500–540,000 |
   | Echo Jade | 380,000 | 190,000 | 240,000 (shared) | 300,000–480,000 |
   | Ironbark Heartwood | 410,000 | 205,000 | 280,000 (shared) | 350,000–560,000 |
   | Ghost Moss | 800,000 | 400,000 | 580,000 (shared) | 725,000–1,160,000 |
   | Cloud Lotus | 900,000 | 450,000 | 700,000 / 550,000 | 875,000–1,100,000 |
   | Tidewater Pearl | 1,300,000 | 650,000 | 970,000 / 830,000 | 1,212,500–1,660,000 |

   The floor binds every route that is i's cheapest other source under some method. For EM, CL
   and TP that is the Ember Breath hunt and the Still Water floor, each under its own method. For
   a dungeon floor, p_i is its whole S8 price, gates on the floors before it included.
2. **#9's bill limits.** #9 holds B9, H5 and every band while each route bill costs at most
   120,000 ms and the three bills differ by at most 80,000 (#9 Open Question 1). L2's bills cost
   60,000 (Rendered Oil ×6), 70,000 (Seasoned Plank ×5) and 70,000 (Jade Blank ×4): one refining
   unit each, with no gate in the chain (L3.7).
3. **The premium (#9's U3).** The concept says fight routes "pay a premium over crafting" (MVP
   Definition, item 3). #9 sets it: under each method a fight route costs at most 80% of its
   recipe (`PREMIUM_MAX_BP` 8,000; #9 N8). With B10, each recipe must cost 1.25× to 2× its fight
   route, which is #9's band (#9 X2). Every recipe in L2 sits inside the band on these bills. It
   also sits inside the bands #9 published on its provisional 44 s bills. The tightest margins are
   Ember Marrow's, 12,500 over its low end, and the Cloud Lotus's, 25,000. So no fight route is
   dominated by its recipe: under each method the fight route is every ingredient's cheapest
   source, and the hearth is the road that costs more time and never a fight.
4. **B9 (#6) and H5 (#7) are joint, and pass on #9's routes.** Under U3, S7 makes every ingredient
   by its fight route, so the binding T is #9's routes plus L2's bills and lines. On #9's
   provisional N1:

   | | Ember Breath | Still Water |
   |---|---|---|
   | T(best) | 1,490,000 (24.8 min) | 1,350,000 (22.5 min) |
   | T(all six) | 3,040,000 (50.7 min) | 1,930,000 (32.2 min) |
   | B9 | ratio 2.04, +1,550,000: passes | ratio 1.43, +580,000: passes |
   | H5 | best is 2nd of 15, +120,000 over EJ · EM · GM · IH: passes | best is 4th of 15, +280,000 over CL · EJ · EM · IH: passes |

   #6 S7 (A2) makes a floor's gate ingredient once: one unit fills the makeup and meets the next
   floor's `reached` atom, which reads the high-water mark. Summing the two demands instead would
   give Still Water T(best) 1,620,000 and T(all six) 2,480,000: B9 ratio 1.53, +860,000, and H5
   the same +280,000, so both pass either way. Ember Breath and the hearth road are the same under
   both counts. #12 re-runs both checks whenever either GDD's numbers change.
   The hearth road's own versions (X3, X4) hold for a run that never fights.
5. **B13 (#6)** passes: no source here has an ingredient in `inputs`.

#### L7. Price: #6 S8 used unchanged

1. **S8's atom term.** S8 adds `price_n(id)` for each `reached(id, n)` atom of a source. Through
   `price(src(r))`, that term is charged again for every unit of every source in a chain that
   draws on the gated source. A key item is made once and its atom never goes false (#1 R5.4), so
   a gate on a source that runs many units would be over-charged. S7 counts each atom once.
2. **This road never meets that case.** Only the chisel make and the six recipes carry gates, and
   each runs one unit (L3.7, L4.2). The lines that run many units are open from the commit. So
   every price in L2 is the same under S8 as written and under a once-per-chain reading, and S7
   and S8 agree on every gate's cost. A dungeon floor's gate on the floor before it (#9 N1) is
   also charged once, as #9's X1 intends.
3. **The shape set aside.** The ladder first chosen on 2026-11-20 had the lamp gate the timber and
   stone lines. S8 then charged the lamp once per plank: the Echo Jade recipe priced at about 115
   minutes, and an amendment to S8 (A1, drafted) was needed to price each atom once per chain.
   Even with it, #9's plank bill would have cost 160,000 ms and its blank bill 320,000 ms, past
   #9's limits (L6.2). On 2026-11-21 the designer opened the lines and dropped A1.
4. **Left open.** If later content gates a source that runs many units, S8 must first be amended
   to price each atom once per chain (Open Questions).

#### L8. Checks owned here (run by the Validator)

The Validator (#12) runs these on each method's frozen set, over the hearth road as derived in
Notation. They add to #1 R8.4, #3 V1–V7, #4 T1–T3, #6 B1–B13, #7 H1–H5 and #9 U1–U5, and repeat
none of them.

| # | Check | Severity | Serves |
|---|---|---|---|
| X1 | **Run floor** (E2). Every hearth-road source with inputs has an untended duration of at least `RUN_FLOOR_MS` (30,000). For every hearth-road source with no inputs, and every store it fills that has a **sink**, refilling that store's smallest net draw takes at least `RUN_FLOOR_MS`. A sink is a hearth-road source whose net draw on the store (`inputs` less `outputs`) is above 0 | error | L5.3; #4 Open Question 1; pillar 4 (attention) |
| X2 | **First ingredient** (E1). Under each method, some ingredient has T_fl({i}, m) ≤ `FIRST_INGREDIENT_MS` (300,000) | error | L5.2; rule 17 |
| X3 | **Fightless over-gathering.** #6 B9's three tests on T_fl, in integers: T_fl(all) × 10,000 ≥ `OVERGATHER_RATIO_BP` × T_fl(best), T_fl(all) − T_fl(best) ≥ `OVERGATHER_MIN_MS`, and T_fl(all) ≤ `OVERGATHER_MAX_MS` | error | Pillar 3 for a run that never fights; pillar 4 (a fight-free run fits the session) |
| X4 | **Fightless price leak.** #7 H5's test on T_fl: T_fl(best_m) > min over makeups X of T_fl(X, m) | warning | Pillar 3; the joint H5 stays binding |
| X5 | **Every ingredient is on the hearth road.** Under each method, every ingredient of the realm has a producer on the hearth road (Notation). This is #1 R8.4 check 2 with gates counted | error | Pillar 4; closes the gap in which a fight-made key item gates a "fightless" recipe |
| X6 | **No by-product on a recipe.** A hearth-road source whose `outputs` hold an ingredient holds nothing else | error | L4.1; the recipe half of #4 Open Question 6; #6 S7 and S8 credit no by-product |

- X3 and X4 need the method's one best makeup. They are not evaluated for a method whose #6 B1
  fails, and the report says so (#6 G14).
- X1 reads untended durations on purpose. Tending is a chosen trade, faster for something given
  up (concept, mechanic 4). A tended run shorter than 30 s is the player's choice, and #4's T1
  still holds every tended unit at 1,000 ms or more.
- X4 is a warning because its margins are 100,000 and 340,000 ms (L6), and one recipe retuned by
  two minutes can cross it. The joint H5 (#7) is the error a player meets. X3 is an error: it is the only
  over-gathering price a fight-free run feels, and its 60-minute ceiling keeps that run inside the
  session (concept, MVP Definition).
- X1 and X2 bind only the hearth road. #9 may adopt the run floor for fights. This GDD does not
  impose it.
- X6 and #9's U2 together make an ingredient source with a by-product an error everywhere in the
  MVP. #4's T2 stays a warning for every other source.
- If the hearth road cannot make some ingredient under a method, X5 fails and T_fl is undefined
  for any set holding it. X2 is still evaluated, over the ingredients the road can make, and is
  "not evaluated" only when it can make none. X3 and X4 need all six, so they report "not
  evaluated" for that method, never "passed".
  An undefined T is never treated as infinite, because ∞ would pass X4's ">".

#### L9. State, actions and events (TD finding 6)

- **Non-derived state owned:** none. Held amounts and marks are #3's and #4's. The slot is #4's.
- **Actions accepted:** none. Start and Stop are #4's (S3).
- **Events emitted:** none. A making completes as #4's `unitsCompleted`, and a source opening is a
  change of #1 F7's derived state, which the Interface shell (#13) shows and logs.

*Specialists consulted: `economy-designer` (primary) proposed the fourteen sources, the pacing
scale and the fightless checks. `game-designer` (loops) proposed the ladder, `need`-only gates and
the run floor as a floor. They split on structure: open lines with no amendment
(`economy-designer`), or the ladder with the S8 amendment (`game-designer`). The designer chose
the ladder on 2026-11-20. On 2026-11-21, when #9's premium (U3) and bill limits landed, the
designer moved to the open lines, since a gated line priced #9's bills past its limits (L7.3).
The designer also chose to own X1–X4 (X5 was added on `systems-designer`'s review, X6 on #9's
recommendation) and the S9-scale pacing, since re-tuned to #9's bands. Every number in L2, L5 and
L6 comes from the main session's calculator. It implements #6 S7 and S8, #3 V1–V7, #4 T1–T2,
#6 B13, #9's route price (X1), U3 and U5, and a fill-then-spend run simulator.*

### States and Transitions

Nothing here is saved. Every state below is derived from the commit and the high-water marks
(#1 F1, F7).

**The road**, per run:

| Phase | Holds when | Actionable on the hearth road |
|---|---|---|
| Choosing | No method committed | None. All fourteen wait with "Needs a method committed" |
| Unlit | Committed; the Hearth Lamp mark is 0 | The three gathering and three refining sources, and Kindle the Hearth Lamp |
| Lit | The Hearth Lamp mark is 1; the Tuning Chisel mark is 0 | Also Tune the Chisel and the four lamp recipes |
| Tuned | Both marks are 1 | All fourteen |

| Transition | Trigger | Reversible? |
|---|---|---|
| Choosing → Unlit | The commit (#7 W7) | Not in the MVP |
| Unlit → Lit | A Kindle the Hearth Lamp unit completes | No: the mark never falls (#1 F1) |
| Lit → Tuned | A Tune the Chisel unit completes | No |
| Any → Choosing | A new run (#11's fast new game) | — |

- "Actionable" here is #1 F7's gate state. Whether a source can start at an instant also needs
  its inputs and room (#4 S5), which is the slot's business.
- The forge (#6) consumes ingredients only, never a key item, so it changes no phase. After the
  forge every recipe still works, and its ingredient can be made again for nothing but time
  (#6 G13.1).

**A recipe**, per ingredient, derived:

| State | Holds when |
|---|---|
| Waiting | Its key item is not yet made, or no method is committed |
| Ready | Actionable, the ingredient not held, the inputs not all held |
| Makeable | Actionable, the ingredient not held, every input held (#4 S5 holds) |
| Held | The ingredient is held. The recipe cannot run, because its output store is full (L4.2) |

Held → Ready or Makeable when the forge consumes the ingredient. Waiting is permanent only before
the commit.

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | The `source` type and rows; `need` gates and generated need text (R5); F7; R8.4's three pillar 4 checks | Fourteen source records in R1's vocabulary, with no new field or type | #1 owns types; this GDD owns these records' values |
| 3 | Resources and caps | K1's eight resources; `settle` per unit; V1–V7 | Bills and outputs that fit K1 unchanged; the answer to Open Question 6 | #3 owns the set and checks |
| 4 | Activity slot | The generic activity record (S2); the stop rule (S5); rest and held breath (S8); T1–T3 | Units of 30 s (refining, key items) and 60–770 s (recipes); refills of 30 s or more (L5); no by-product on any ingredient source (X6); answers to Open Question 1 and, for recipes, Open Question 6 | #4 owns the slot |
| 6 | Forge and proving | S7, S8, G12; B9, B10 and B13 to pass | Real fightless sources and their prices f_i (L6); the fight floor; S8 used unchanged (L7); the crafting half of Open Question 1 | #6 owns the checks and S8 |
| 7 | Methods | The route plan (W5): one shared recipe per ingredient, never patched (W3, W4); H5 | Recipes and the shared chain; H5's crafting half and X4; the route half of Open Question 3 | #7 owns the plan |
| 9 | Fight and dungeon routes (parallel) | Hunts and floors: each ingredient's other source, p_i; the premium U3 and its bands (X2); the bill limits | Bills one refining unit pays (L2); recipes inside the bands and the fight floor (L6); X6, the recipe half of the by-product rule | #9 authors fights; #12 runs the joint checks |
| 10 | Tending | Tended `duration` and `outputs` on these sources | Real sources to set ceilings against; X1 reads untended durations, and T1 (#4) covers tended ones | #10 owns its ceilings |
| 11 | Save and run lifecycle | Run start; the fast new game | Nothing saved here (L9) | #11 |
| 12 | Validator | — | X1–X6; the hearth road's derivation | #12 runs; this GDD defines |
| 13, 15 | Interface shell; Forge screen | — | Fourteen named sources with need text; the ladder's two beats to log; recipe names for the forge screen's "where it comes from" | They own display |

## Formulas

This system's balance values are content: L2's bills, yields and durations. The formulas here
are the tests its checks run (E1–E3). Prices are #6 S8's, used unchanged (L7). What a unit does to a store is
#3's settle (Q2). How the slot runs units is #4's (S4, S5). Every number is an integer.
`ceil_div(a, b)` is #3's, −div_floor(−a, b), and `div_floor` is #1 F5's. Every product is
checked against 2⁵³ − 1 before it is formed. A time or price above 4.5 × 10¹¹ ms (#6 S8's bound)
is itself a validator error, naming the source.

### E1. Hearth-road gathering time

The hearth_gather_time formula is defined as:

`T_fl(X, m) = Σ over hearth-road sources s used by X of ceil_div(D(o_s), out_s[o_s]) × d_s`, where
`D(id) = [id ∈ X] + Σ over used consumers c of id of ceil_div(D(o_c), out_c[o_c]) × in_c[id] + n*(id)`

- Each id is made by `src_fl(id)`, its cheapest producer on the hearth road by #6 S8. o_s is the
  id s is used for.
- n*(id) is the largest n of any `reached(id, n)` atom on a used source, counted once per id
  (#6 S7).
- Demand is totalled before it is divided: sources are visited consumers first, in a topological
  order of the inputs-and-atoms graph. So ceil_div runs once per source, on its whole demand, as
  #6 S7 requires ("shared inputs and key items are made once").
- This is #6 S7 restricted to the hearth road. With the road defined as in Notation, T_fl is the
  time a run that never fights spends gathering X.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| X | set of ingredient ids | 1–M (6) | calculated | The ingredients to hold |
| m | method id | the content's methods | data file | Whose frozen set is read |
| d_s | int | 1,000–86,400,000 ms (#4 T1; #1 R4) | data file | Untended duration per unit |
| out_s[id], in_c[id] | int | 1–10⁹ | data file | Units per unit of the source |
| D(id) | int | 0 upward | calculated | Total demand on id |
| n*(id) | int | 0, or 1–cap | data file (gates) | The largest `reached` threshold on id among used sources; 0 if none |

**Output Range:** 0 to 4.5 × 10¹¹ ms. It is **undefined** when some ingredient of X has no
hearth-road producer (X5). Undefined is reported as "not evaluated", never as 0 or as infinity.
On L2's content it runs from 290,000 (Ember Marrow alone) to 3,330,000 (all six).
**Example:** X = {Ember Marrow}. Render Ash-Fat needs 9 oil and the lamp, and the lamp needs 3
oil, so the oil demand is 12. That is 2 renders, 60,000 ms. The renders need 60 tallow, which is
12 skims, 60,000 ms. The lamp is 30,000 and the recipe 140,000. In all, T_fl = 290,000 ms.

### E2. Run floor (X1)

The run_floor formula is defined as:

`floor_ok(s) = d_s ≥ RUN_FLOOR_MS` if s has inputs, otherwise, for every output store r of s that
has a sink, `ceil_div(B(r), out_s[r]) ≥ ceil_div(RUN_FLOOR_MS, d_s)`, where
`B(r) = min over hearth-road sinks c of r of (in_c[r] − out_c[r])`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| d_s | int | 1,000–86,400,000 ms | data file | Untended duration per unit |
| out_s[r] | int | 1–10⁹ | data file | s's yield of r per unit |
| B(r) | int | 1 to r's base cap (#3 V1) | calculated | The smallest net draw on r by any hearth-road source that draws on it |
| RUN_FLOOR_MS | int | 30,000 ms (tuning knob) | constant | The shortest uninterrupted run the road allows |

**Output Range:** true or false. It forms no product, so no value leaves the safe integers.
`ceil_div(B, out) ≥ ceil_div(F, d)` is exactly "ceil_div(B, out) × d ≥ F" for positive integers.
A store with no sink is skipped and named in the report, and #3 V2 errors on it separately.
**Example:** Skim the Ash Pits: B(Ash Tallow) = 30 (Render Tallow), and ceil_div(30, 5) = 6 ≥
ceil_div(30,000, 5,000) = 6, so it passes with a 30 s refill. At a 4,000 ms skim, 6 < 8, so it
fails: the refill takes 24 s.

### E3. Fight floor (B10's half for #9)

The fight_floor formula is defined as:

`p_min(f) = max(1, min(ceil_div(f × 10,000, FIGHTLESS_CEILING_BP), f − FIGHTLESS_SLACK_MS))`, and
#6 B10 passes for ingredient i exactly when p_i ≥ p_min(f_i)

- It is #6 S8's ceiling turned around. f ≤ div_floor(p × BP, 10,000) holds exactly when
  f × 10,000 ≤ p × BP, so the first term is the least p that passes the ratio test. The second
  term is the least p that passes the slack test, and B10 needs either.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| f | int | 1–4.5 × 10¹¹ ms | calculated (#6 S8) | The ingredient's cheapest fightless price |
| p | int | 1–4.5 × 10¹¹ ms | calculated (#6 S8 and #9 X1, on #9's sources) | The ingredient's cheapest other enabled source |
| FIGHTLESS_CEILING_BP | int | 10,000–30,000 (shipped 20,000) | constant (#6) | Ceiling ratio |
| FIGHTLESS_SLACK_MS | int | 0–300,000 (shipped 60,000) | constant (#6) | Absolute slack |

**Output Range:** 1 to f. f × 10,000 stays below 2⁵³ − 1 while f ≤ 9 × 10¹¹. With the shipped
constants and every f above 120,000 ms, it reduces to ceil_div(f, 2): the ratio term is always
the smaller.
**Example:** Echo Jade, f = 380,000: min(ceil_div(3.8 × 10⁹, 20,000), 320,000) = min(190,000,
320,000) = 190,000. An Echo Jade hunt priced under 190,000 ms (3 min 10 s) fails B10 under every
method that has it. #9's Pangolin Hunt costs 240,000 on L2's bills, so it passes.

*Specialist: `systems-designer` proposed E1–E3's shapes and the integer form of E3 and X3, and
re-derived the first L2's prices and L6's times by hand. It also drafted the once-per-chain price
rule of amendment A1, dropped with the ladder's gated lines (L7.3). Every example here was re-run
on the main session's calculator after the 2026-11-21 re-tune.*

## Edge Cases

Each case says who catches it: the **rules core** at runtime (#4's slot, #3's settle), the
**Validator** (#12) at build, naming the check, or **another GDD**, named.

### Play

- **If the player starts a lamp-gated source before the lamp is made**: refused with #1's
  generated need text, "Needs Hearth Lamp" (rules core, #4 S3.1). Nothing changes. The source
  was visible from the run start, so the refusal is never a surprise.
- **If the player starts a recipe with some inputs short**: refused with the shortfall, for
  example "Needs Seasoned Plank ×8 (3 more)" (#4 S3.1). Inputs come before room in S5's order,
  so a short input is named first.
- **If the player starts a recipe whose ingredient is already held**: refused, because the
  ingredient's store (cap 1) is full (#4 S5.3). The refusal must read "Echo Jade is in hand", not
  "is full" (UI Requirements). No second unit can run, so an ingredient is never over-made.
- **If Rendered Oil is full (12) and Ash Tallow is short**: Start on Render Tallow is refused
  with "Needs Ash Tallow ×30 (…)", inputs first (#4 S5). It is never a dead end: a full oil store
  covers every oil bill (V1), so the player spends it first.
- **If Rendered Oil holds 7–11 when a render completes**: the render runs, because the store
  has room, and its excess spills (1–5 oil). This is #3's "only the last unit's spill is lost",
  logged as "spilled" (#3 K3.4). The player avoids it by spending oil first.
- **If Seasoned Plank holds 6–9 and the player seasons again**: 1–4 planks spill, and Jade
  Blanks likewise when a carve meets 5–7 blanks. Each season or carve is a run of its own,
  because one unit takes 24 of the 30 logs or 16 of the 20 jade. So this spill comes
  only from a choice, never from a run left alone (L5.3).
- **If the player forges and then makes an ingredient again**: the marks stay, so no gate
  closes (#1 F1). The four recipes whose ingredients were consumed are Ready again, and the two
  spares stay Held (#6 G13.5). Making Ember Marrow again from empty stores takes 260,000 ms (12
  skims, 2 renders, the recipe), because the lamp is already made. After the forge the stores are
  wider (#3 K7), so the fills run longer between choices.
- **If the player makes the lamp but never the chisel**: Echo Jade and Tidewater Pearl wait on
  the hearth road. Each still has its fight route (#7 W5), so nothing is stranded. Every method's
  best holds Echo Jade, so a hearth-only run that skips the chisel can forge only CL · EM · GM ·
  IH (34.3 minutes), which is no method's best and costs seals.
- **If the player carves blanks before the chisel exists**: legal. Jade Blanks fill to 8 and the
  run stops on "full". The blanks wait and never spoil (#3). They also pay #9's stone routes,
  which need no chisel (#9 N1).
- **If the player is away for hours**: a hearth run stops at its first full store or short
  input, as #4 S5 rules. Then rest banks breath. No hearth source has an input that refills by
  itself, so away time on this road yields one store's fill at most (#4 Open Question 2).
- **If a route fight could be lost** (#9): #9's U1 makes that a validator error, so shipped
  content has none. Were one shipped, the route would pay nothing (#5 C8), and the ingredient's
  recipe would still be on the hearth road within the ceiling. This is the case the road exists
  for (#7 W5.5).

### Content (validator)

- **If a fight route is priced under its fight floor** (E3; for example an Ember Marrow hunt at
  170,000 against a floor of 175,000): #6 B10 error, naming the ingredient and the method.
- **If a recipe costs less than 1.25× its fight route** (p_i × 10,000 > 8,000 × f_i; for example
  Render Ash-Fat cut to 120,000 ms, a price of 330,000 against the hunt's 270,000): #9's U3 error
  under that method, naming the ingredient (L6.3). Below the band the route's premium is gone, and
  once the recipe is cheaper than the route, S7 never chooses the route.
- **If an ingredient's hearth-road producer depends on a fight-made item** (a `need` on a key
  item only a hunt makes, or an input only a floor pays): X5 error under that method. X3 and X4
  report "not evaluated" for it, and X2 runs over the ingredients the road can make. #1 R8.4
  check 2 alone would pass this, because it follows inputs and not gates.
- **If a hearth-road source lies on a cycle of inputs or gates**: it has no finite price (#6 S8:
  a path that would use a source twice is not a chain), and `src` never chooses it. If it is an ingredient's only road producer, X5 fails.
- **If a gathering store has no sink on the hearth road**: X1 skips that store and names it in
  its report. #3 V2 errors on a store with no sink at all.
- **If a gathering yield does not divide the smallest bill drawn from its store** (for example
  4 tallow per 4 s against a bill of 30): legal, and X1 still checks the refill time. Every
  refill then ends with a spill of the remainder, which is what L5.3's authoring rule avoids. No
  check enforces that rule. It is a review item (Acceptance Criteria).
- **If a refining or recipe unit is under 30 s** (for example a 20 s kindling): X1 error, naming
  the source.
- **If the cheapest fightless ingredient takes longer than 5 minutes** (for example the lamp's bill
  raised to 4 oil, which needs a third render): X2 error under every method.
- **If a fightless run's six cost under 1.35 × its best four, or under 6 minutes more**: X3
  error, with the method named.
- **If the best makeup is the cheapest on the hearth road**: X4 warning, and the joint H5 (#7)
  still decides.
- **If a recipe gains a by-product** (for example Wake the Echo Jade also paying Rough Jade 2): X6
  error, naming the source. #4's T2 also warns.
- **If B1 fails for a method** (#6): X3 and X4 are "not evaluated" for it (#6 G14), and the
  report says so.
- **If a method's patch reaches a hearth-road source**: a patch on `inputs`, `outputs` or
  `duration` is #7 H1's error. An `open` on an authored-enabled source is a no-op, a load error
  (#7 W4, #1 F8). A `set` of `enabled` to 0 fails H1. So the road is the same under both methods
  by construction.
- **If another GDD adds a second fightless producer for an ingredient**: it joins the hearth road
  (Notation). E1 and #6 S8 use the cheaper, and X1–X6 cover it.
- **If tending would cut a hearth unit under 30 s**: X1 still passes, because it reads untended
  durations (L8). #4's T1 holds every tended unit at 1,000 ms or more, and the ceilings are
  Tending's (#10).
- **If a content update raises a bill above its store's base cap**: #3 V1 error. If it lowers the
  largest bill below 70% of the cap: #3 V2 error.

### Saves and content versions (owned by #11)

- **If a content update changes a recipe's bill or duration**: nothing here is saved (L9). Kept
  progress on that source is clamped on load by #4's rule (#4 Edge Cases).
- **If a source id here is renamed**: a retirement plus a new id in #11's alias map (#1 R2.3).
  Ids are free to change until a save could hold them.

### Degenerate strategies

- **If the player gathers all six on the hearth road before forging**: it costs 3,330,000 ms,
  against 1,640,000 or 1,880,000 for the method's best four. That is 77–103% more and at least 24
  minutes more, the over-gathering price (X3; #6 G9).
- **If the player gathers cheapest-first**: the cheapest hearth makeup, EJ · EM · GM · IH (25.7
  minutes), is no method's best. The best lies 1.7 or 5.7 minutes further, with the Cloud Lotus or
  the Tidewater Pearl in place of the Ghost Moss, so finding it takes reasoning, not just
  gathering order (X4; #7 H5).
- **If the player never fights**: every ingredient is on the hearth road under both methods
  (X5). The best four take 27.3 or 31.3 minutes and all six take 55.5, inside the session
  (concept).
- **If the player takes every route a method opens**: each ingredient comes cheaper by its route
  (U3). The best four take 24.8 or 22.5 minutes (L6.4), so fighting saves 2.5–8.8 minutes over
  the hearth alone. That is the premium, paid in time.

*Specialist: `systems-designer` consulted in the same pass as Formulas. Its cases on gates
through fight-made items (X5), cycles, a store with no sink, tended durations, refill spill and
the order of refusals were adopted here.*

## Dependencies

**Upstream (this system depends on them):**

| # | System | Hard or soft | Interface | Status |
|---|---|---|---|---|
| 1 | Content records and schema | Hard | The `source` type and its rows; `need` gates, `reached` atoms and generated need text (R5); F7's derived states; R8.4's pillar 4 checks, which X5 strengthens | Approved |
| 3 | Resources and caps | Hard | K1's eight resources, kept unchanged (L1.4); `settle` per unit (K3); V1–V3 and V5–V7 on these sources | Approved |
| 4 | Activity slot | Hard | The activity record (S2); the stop rule that ends every run here (S5); rest and held breath (S8); T1–T3; F5's single-speed timing for the bands (S11) | Approved |
| 6 | Forge and proving | Hard | S7 (gathering time) and S8 (price), used unchanged (L7); B9, B10 and B13 on these sources; the best makeups X3 and X4 read (B1) | Approved |
| 7 | Methods | Hard | The route plan (W5): one shared recipe per ingredient and the shared chain, never patched (W3, W4); H5, whose hearth half is X4 | Approved |

The Modifier pipeline (#2) carries these sources' effective values: the method stage leaves them
untouched, and tending's stage is #10's. Nothing passes between #2 and this GDD directly, so
neither lists the other.

**Downstream (they depend on this system):**

| # | System | Hard or soft | What it needs from this GDD |
|---|---|---|---|
| 9 | Fight and dungeon routes (parallel) | Hard | The refined bills' prices, 60,000, 70,000 and 70,000 ms (L2, L6.2); the recipe prices f_i inside its bands (L6.1, L6.3); the fight floor (E3); the joint B9 and H5 runs (L6.4); X6, the recipe half of the by-product rule |
| 10 | Tending | Hard | Fourteen real sources with untended durations of 5–770 s to set ceilings against; X1 reads untended values, so tending's speed ceiling is free of it, and T1 binds tended durations |
| 12 | Validator | Hard | X1–X6, the hearth road's derivation (Notation), E1–E3 |
| 13 | Interface shell | Hard | Fourteen named sources with generated need text; the two ladder beats (lamp, chisel) to log; the "in hand" refusal wording |
| 11 | Save and run lifecycle | Soft | Nothing saved here (L9); the fast new game returns the road to Choosing |
| 15 | Forge screen | Soft | Each ingredient's recipe by name, for "where it comes from" on a plan's unheld ingredients |

**Bidirectional consistency.** #1 (Interactions row 8, Dependencies), #3 (Interactions rows 8–9,
Dependencies), #4 (Dependencies), #6 (Interactions rows 8–9, Dependencies) and #7 (Interactions
row 8, Dependencies) already list this system. Each downstream GDD must list "depends on:
Crafting route" when it is written. #9, designed in parallel, lists this system for its bills and
recipe bands, and this GDD's recipes are tuned to #9's premium (L6.3), a constraint on content
rather than a runtime dependency. The systems index row #8's Depends On gains "Content records
and schema", because the `source` rows and gates this GDD fills are #1's.

## Tuning Knobs

These are the values this GDD owns. A change to either constant, or to any value in L2, re-runs
X1–X6, #3 V1–V7, #4 T1–T2, #6 B9, B10 and B13, #7 H5 and #9 U3 and U5 under both methods. The calculator that
produced L2 is the tool for that, never hand arithmetic.

| Knob | Shipped | Safe range | Too low | Too high | Interacts with |
|---|---|---|---|---|---|
| `RUN_FLOOR_MS` (X1, E2) | 30,000 | 20,000–30,000 on L2's content | Below 20 s, the opening becomes the ping-pong #3 and #4 flagged: a switch every few seconds, each with one obvious answer | Above 30,000 ms, every 30 s refining and key-item unit fails X1. Lengthening them raises every bill's price, so #9's bill limits and U3's bands move too. The tallow store caps the floor at 33,750 in any case: its refill after a render (30 of 40) is ¾ of its first fill, and V7 holds the first fill to 45 s | `FIRST_CAP_MS` and K1's tallow store (#3); `BILL_FLOOR_BP`; #9's bill limits |
| `FIRST_INGREDIENT_MS` (X2; shared with #9's U5) | 300,000 | 290,000–360,000 | Below 290,000 the shipped Ember Marrow fails X2, and its recipe cannot get shorter without leaving #9's band (L5.2) | Rule 17's density goes: the first ingredient drifts past five minutes, and the goal line sits empty | The lamp's bill and Render Ash-Fat's (L2); `PREMIUM_MAX_BP` (#9) |

**Content values, tuned with the calculator rather than as knobs.** These are the levers, and
what each moves:

| Lever (L2) | Shipped | What it moves | Margin today |
|---|---|---|---|
| Season Planks and Carve Jade Blanks yields | 5 and 4 per unit | Each pays one route bill in one unit (L6.2), and most of every timber and stone ingredient's price | #9's bill limits: 70,000 against 120,000 |
| Recipe durations | 60,000–770,000 | Each recipe's place in #9's band, X3's 60-minute ceiling, and X2 for Ember Marrow | U3: Ember Marrow 12,500 over its band's low end, Cloud Lotus 25,000; X3: 55.5 minutes against 60 |
| Open a Cloud Lotus's bill | 12 oil, 6 planks | Ember Breath's best four and Still Water's left-out pair, so it moves both methods' X3 and X4 | X4 under Ember Breath: +100,000 over the cheapest |
| Set a Tidewater Pearl's duration and bill | 770,000; 6 blanks, 6 planks | Still Water's best four, its X4 margin and #7 H5's crafting half; X3's ceiling, as the dearest recipe | X4 under Still Water: +340,000; X3: 270,000 under 60 minutes |
| Kindle the Hearth Lamp's bill | 3 oil | X2 and every lamp-gated price | X2: 290,000 against 300,000 |
| Gathering yields and durations | 5 per 5 s; 3 per 5 s; 2 per 5 s | V7, X1's refills, and spill on refills (L5.3) | V7: 40 s against 45 s; X1: 30 s against 30 s for the skim |

- **The skim sits exactly on the run floor.** Its refill is 30,000 ms. A faster skim fails X1, and a
  slower one (6 s) pushes the first fill to 48 s and fails V7. Change the tallow store's bill or
  yield together, never the skim's duration alone.
- **The thinnest margins are X2's and U3's on Ember Marrow** (10 s and 12.5 s). Its duration can
  move only within 127,500–150,000 ms (L5.2). X4's 100 s under Ember Breath is why X4 is a
  warning (L8).
- **Fight prices are #9's**, bounded below by E3's floor and above by U3's 80% of the recipe
  (L6.3).

**Knobs owned elsewhere that this road feels:**

- `BILL_FLOOR_BP` (#3, 7,000): every store's largest bill here is at 75–100% (L2).
- `FIRST_CAP_MS` (#3, 45,000): the skim fills in 40 s.
- `UNIT_FLOOR_MS` (#4, 1,000): every unit here is at least 5,000 ms.
- `OVERGATHER_RATIO_BP`, `OVERGATHER_MIN_MS`, `OVERGATHER_MAX_MS` (#6): X3 reads them unchanged.
- `FIGHTLESS_CEILING_BP`, `FIGHTLESS_SLACK_MS` (#6): E3's floor reads them unchanged.
- `PREMIUM_MAX_BP` (#9, 8,000): the low end of every recipe's band (L6.3).

*Specialist: not delegated. These knobs are derived from Section D's variable tables, and
`systems-designer`'s Formulas and Edge Cases pass already covered their interactions. The V7 bound
on `RUN_FLOOR_MS` was found by the main session.*

## Visual/Audio Requirements

The pipeline is type, colour, layout and simple glyphs, with no illustration (concept, Visual
Identity Anchor).

1. **The hearth road is unmarked.** The visual rule is "what the method touches, the method marks",
   and no method touches a value here (L1.2). So no number on this road ever carries a method's
   tint or glyph, under either method. This is #14's rule applied, not an exception to it: a
   tinted hearth value would be a false mark.
2. **The two ladder beats are log events.** The lamp's first making and the chisel's each get one
   log line, carrying the key item's `flavor` and naming what it opened (#13's channel, rule 99).
   They have no animation and no sound in the MVP, since audio has no system yet (systems index).
3. **Stores read in #3's words.** A store at its brim reads "full", and a spill reads "spilled"
   (#3 Tone). Neither gets a colour of its own, because hue means method and nothing else.

`art-director` was not consulted. Visual/Audio is optional for an Economy system, and this one
only applies rules that #13 and #14 own.

> 📌 **Asset Spec**: these requirements are defined. After the art bible is approved, run
> `/asset-spec system:crafting-route`. It will find no illustrated assets, only log and tooltip
> text.

## Game Feel

- **Rhythm.** Between makings, about one choice every 30 s at single speed (L5.3): a fill of
  30–40 s, then a 30 s render, season or carve. The 30-second loop is felt as "the store is full,
  pour it", never as a timer to beat.
- **Weight.** A recipe is the longest unit the player starts at the hearth: 60 s for the Echo
  Jade, about two minutes for Ember Marrow and the Heartwood, 9–13 minutes for the other three.
  The dearer the ingredient, the longer the pull, so the making of an ingredient feels like work
  at the hearth, not a click. The long makings are a natural moment to step away, and the slot
  keeps working (#4). In a hearth-only best four, the recipes take 53% (Ember Breath) to 58%
  (Still Water) of the run, so the run has fewer choices than a mixed one. A making keeps its
  progress through a switch (#4 S6), so the player can break one off and return.
- **No timing reward.** A run that stops while the player is away waits for them, and the rest bank
  returns the wait doubled (#4 S8.6). No hearth action pays more for being taken quickly (pillar
  4's attention test).
- **Responsiveness.** Start and Stop are #4's actions, settled before they apply (#4 S3.4). This
  road adds no latency budget of its own.

## UI Requirements

1. **Every source shows its whole bill.** Each hearth source shows its inputs, outputs and
   duration, and its need text while it waits (#1 R5.5), in the one tooltip schema, opened by
   tap (rule 33; #13). Nothing is hover-only.
2. **The whole road is readable from the run start**, before and after the commit (L3.5). The
   shell groups the fourteen by line (fuel, timber, stone, recipes) or by phase. #13 owns which.
3. **A held ingredient's recipe says "in hand".** When an ingredient is held, its recipe's state
   and any refusal read "{ingredient} is in hand", never "{ingredient} is full". An ingredient's
   store of 1 is a rule fact, not something the player should read as a store (#4 S3.1's refusal
   text; #13).
4. **From the forge screen to the hearth.** For each unheld ingredient of a plan, the forge
   screen names its recipe, its fight route if the method has one, and their gathering times
   (#15). This is how the backward plan reaches the road.
5. **The ladder beats are logged** as in Visual/Audio item 2, through the one event channel
   (#13).
6. **Phone width.** Names are at most 24 code points (#1 R4), and a source's bill has at most
   two inputs, so every source's line fits 390 px (#17).

> 📌 **UX Flag — Crafting route**: this system has UI requirements. In Pre-Production, run
> `/ux-design` for the Interface shell (#13) and the Forge screen (#15) before writing epics, and
> carry items 1–6 into them. Stories that touch the hearth's display cite `design/ux/[screen].md`,
> not this GDD.

## Cross-References

| This document references | GDD | Section | What it uses |
|---|---|---|---|
| The `source` type, gates and need text | Content records and schema (#1) | R1, R4, R5, F7, R8.4 | Records in R1's vocabulary; `need` atoms; R8.4 check 2, which X5 strengthens |
| The resource set and its checks | Resources and caps (#3) | K1, K3, K9 (V1–V7), Q6, Q7 | Caps kept; bills and fills checked |
| The slot, the stop rule, rest | Activity slot (#4) | S2, S3, S5, S8, S11, T1–T3, Open Questions 1 and 6 | Units, refusals, the bank; the run floor's question |
| Gathering time, price, ceiling, checks | Forge and proving (#6) | S7, S8, G9, G12, G13, G14, B9, B10, B13, S9 | E1; prices; the fight floor; the best makeups |
| The route plan, surface and price leak | Methods (#7) | W3, W4, W5, Y3, H1, H5, Open Question 3 | Fourteen shared, unpatched sources; X4 |
| A lost route fight pays nothing | Combat resolver (#5) | C8 | Why the hearth road is the floor |
| Fights, hunts, floors and the premium | Fight and dungeon routes (#9; Approved) | N1, N2, N8, N9, X1, X2, U1–U5, Open Questions 1, 2 and 4 | Route prices on L2's bills; the bands; the bill limits; the joint B9 and H5 |

## Acceptance Criteria

Tags follow #6 and #7: **[unit]**, **[integration]**, **[validator]**, **[review]**. **S** is the
shipped content (L2 with #3 K1). **Fx** is a fixture built from S with the named change. **P** is
L5.3's fill-then-spend player.

### Rules

- **AC-L1-1** [validator, S] **GIVEN** S, **WHEN** it is loaded, **THEN** there are exactly 14
  fightless sources (3 gathering, 3 refining, 2 key-item makes, 6 recipes), all authored enabled,
  none with `fights`, each with identical `inputs`, `outputs` and `duration` in `set_EB` and
  `set_SW`. The 8 resources match #3 K1 (caps 40, 30, 20, 12, 10, 8, 1, 1; starts 0), and no record
  has a station type.
- **AC-L2-1** [validator, S] **GIVEN** S, **THEN** each source's inputs, outputs, duration and
  `need` equal L2's table, and #6 S8 gives exactly its Price column, both methods alike.
- **AC-L3-1** [integration] **GIVEN** a new run, **THEN** all 14 are revealed, none carries
  `reveal`, and each reads "Needs a method committed". **WHEN** a method is committed, **THEN**
  exactly the three gathering sources, the three refining sources and Kindle the Hearth Lamp are
  actionable. **WHEN** a Kindle unit completes, **THEN** 5 more become actionable: Tune the Chisel
  and the four lamp recipes. **WHEN** a Tune the Chisel unit completes, **THEN** the last 2 do. **WHEN** the forge then consumes four ingredients, **THEN** no
  source returns to waiting.
- **AC-L4-1** [validator, S] **GIVEN** S, **THEN** each recipe's `outputs` is one ingredient,
  amount 1, with no other key. No source's `inputs` holds an ingredient. No gathering or
  refining source carries a gate (L3.7).
- **AC-L4-2** [integration] **GIVEN** Echo Jade held, **WHEN** Start(Wake the Echo Jade), **THEN**
  it is refused, the slot is unchanged, and the refusal reads "Echo Jade is in hand".
- **AC-L5-1** [integration] **GIVEN** P from a fresh commit with an empty bank, **THEN** Ash
  Tallow is 40 at 40,000 ms, the Hearth Lamp is held at 100,000, and Ember Marrow at 300,000
  after 6 runs. **WHEN** P goes on to Ember Breath's best four, **THEN** it holds them at 1,670,000
  after 28 runs, with no run under 30,000 ms. No gathering run ends on "spilled"; P's refining
  runs spill at most 3 units at a time (#3 K3.4).
- **AC-L6-1** [validator, S] **THEN** T_fl is 1,640,000 for Ember Breath's best four, 1,880,000
  for Still Water's, 3,330,000 for all six, and 1,540,000 for EJ · EM · GM · IH, the cheapest.
- **AC-L7-1** [unit, S and Fx] **GIVEN** S, **THEN** #6 S8 as written and a once-per-chain count
  of atoms give the same price for all 14 sources (L7.2). **GIVEN** a fixture that adds `need`
  Hearth Lamp to Season Planks, **THEN** S8 as written prices Cure the Heartwood at 590,000 and the
  once-per-chain count at 410,000, the case L7.4 leaves open.
- **AC-L9-1** [integration] **GIVEN** P running to the first ingredient, **THEN** every event
  emitted is #3's or #4's, and none is this GDD's. *[blocked: #11]* A save and load in each phase
  re-derives the same phase.

### Formulas

- **AC-E1-1** [unit, S] T_fl({i}) is 290,000 (EM), 380,000 (EJ), 410,000 (IH), 800,000 (GM),
  900,000 (CL) and 1,230,000 (TP). T_fl({EM, IH}) is 610,000, less than the 700,000 sum, because
  the lamp and shared oil are made once. A set holding an ingredient with no hearth-road producer
  returns "undefined", never 0 or infinity.
- **AC-E2-1** [unit, Fx] The skim at 5,000 ms passes (6 ≥ 6). At 4,000 ms it fails (6 < 8). A
  refining unit at 29,999 ms fails, and at 30,000 ms it passes.
- **AC-E3-1** [unit, S] p_min is 175,000, 190,000, 205,000, 400,000, 450,000 and 650,000 for f =
  350,000, 380,000, 410,000, 800,000, 900,000 and 1,300,000. For each, a stub fight priced at
  p_min passes #6 B10 and one at p_min − 1 fails it.

### Checks (each [validator, Fx]: S passes; the named change fails that check and no other)

- **AC-X1-1** Skim → 4,000 ms fails X1, naming `skim_ash_pits`. Kindle → 20,000 ms fails, naming
  `kindle_lamp`. Skim → 6,000 ms passes X1 and fails #3 V7 (48 s). `RUN_FLOOR_MS` → 30,001 fails
  X1 on S.
- **AC-X2-1** Render Ash-Fat → 151,000 ms fails X2 under both methods (Ember Marrow at 301,000,
  and no other ingredient under 300,000). At 150,000 it passes at exactly 300,000.
- **AC-X3-1** Set a Tidewater Pearl → 1,041,000 ms fails X3 under both methods (T_fl(all) at
  3,601,000, over `OVERGATHER_MAX_MS`). At 1,040,000 it passes at exactly 3,600,000. A case table with (best, all) = (2,000,000, 2,700,000) passes and 2,699,999 fails the ratio.
  (1,000,000, 1,360,000) passes and 1,359,999 fails the 6-minute gap.
- **AC-X4-1** (a warning: the build passes) Grow Ghost Moss → 630,000 ms warns under Ember Breath:
  EJ · EM · GM · IH ties its best at 1,640,000, and a tie warns. At 629,000 it passes.
- **AC-X5-1** Tune the Chisel gains a fight: X5 fails under both methods, naming Echo Jade and
  Tidewater Pearl, and X3 and X4 read "not evaluated" while X2 still passes. Render Tallow gains
  `need` Hearth Lamp, a cycle: X5 fails for every ingredient.
- **AC-X6-1** Wake the Echo Jade also outputs Rough Jade 2: X6 fails under both methods, naming
  `wake_echo_jade`, and #4's T2 warns.
- **AC-X-2** #6's AC-B1-1 change (Gate vigor 191 → 190) makes X3 and X4 read "not evaluated" for
  Still Water, never "passed".

### Cross-system

- **AC-C-1** [validator, S] #3 V1–V7, #4 T1 and T2, and #6 B13 pass under both methods, and T2
  raises no warning. #6's own S7, S8 and G12 criteria pass unchanged.
- **AC-C-2** [validator, S] No method patch reaches a hearth source (#7 H1). An `open` on one is a
  load error (#7 W4, #1 F8).
- **AC-J-1** [validator, S with #9's N1] #6 B9 and #7 H5 pass under both methods with L6.4's
  values: B9 ratios 2.04 (+1,550,000) and 1.43 (+580,000), with #6 S7 counting a floor's gate
  ingredient once (A2); H5 margins 120,000 and 280,000. *Re-pin when #9's routes are final.*
- **AC-J-2** [validator, S with #9's N1] For all 12 pairs, each fight route is priced at or above
  its E3 floor and each recipe sits inside #9's band, so #6 B10, #9 U3 and #9 U5 pass. The three
  route bills cost 60,000, 70,000 and 70,000 ms, inside #9's limits (L6.2).

### Performance

- **AC-P-1** [unit, S] On the build runtime, #6 S8 for all 14 sources plus one T_fl takes at
  most 5 ms, and X1–X6 under both methods at most 100 ms (median of 100 runs). Provisional until #1's
  ADR 9 sets the budgets.

### Checked by review, not by test

- Player-facing text follows the Tone rules: no "craft", "station", "tier", "cap" or "overflow",
  and no number in `desc` or `flavor` (rule 70).
- New gathering content keeps a yield that divides its smallest bill (L5.3).
- L4.4's "draws on" table still describes each recipe.
- A new gate on a gathering or refining source comes with an amendment to #6 S8 first (L7.4).
- A tester who has read neither this GDD nor the balance table is asked which road felt like the
  fallback. The hearth should read as a road of its own (Player Fantasy, the lesser-road risk).

*Specialist: `qa-lead` proposed these criteria and re-derived every number with an independent
script. It flagged six problems, all fixed before this was written: P was undefined (now L5.3);
X2's scope when X5 fails; L4.5's range read as a rule; the knob's safe range against S; the
premium check could not run on S9's stubs (now AC-J-2, on #9's routes); and the "in hand" wording needed a home (UI
Requirements 3). On 2026-11-21 the content was re-tuned to #9's bands. The main session
recomputed every number and fixture above on its calculator; `qa-lead`'s script was not re-run.*

## Open Questions

**Questions from other GDDs, answered or handed on here:**

| Question | Answer | Status |
|---|---|---|
| #3 Open Question 6: do the recipes fit K1? | Yes, unchanged. Every store's largest bill is at 75–100% of its cap (L1.4, L2) | Resolved |
| #4 Open Question 1: how often must the player switch? | Every uninterrupted hearth run lasts at least 30 s (X1). A best four takes 28 runs, with a median of 30 s (L5.3) | Resolved |
| #4 Open Question 6 (with #9): is an ingredient output with a by-product an error? | Yes, for recipes: X6 (L4.1). #9's U2 covers the routes. #4's T2 stays a warning for every other source, so #4 is not amended | Resolved |
| #6 Open Question 1, the crafting half: do real sources pass B9, B10 and B13? | B13 passes (L6.5). B10 passes for all 12 pairs on #9's routes (L6.1). B9 passes jointly (L6.4). The best fours' seals do not depend on routes | Resolved on #9's provisional routes |
| #7 Open Question 3 (with #9): does H5 pass on real times? | Yes: margins of 120,000 (EB) and 280,000 (SW) on #9's routes with L2's bills (L6.4). X4 holds for the hearth alone | Resolved on #9's provisional routes |
| #9 Open Question 1: are the recipes inside the bands, and the bills inside the limits? | Yes. Every recipe is inside its band on #9's 44 s bills and on L2's real ones, and the bills cost 60,000, 70,000 and 70,000 (L6.1–L6.3) | Resolved |
| #9 Open Question 2: should T2 become an error for every source? | For ingredient outputs, yes: X6 here and U2 in #9. T2 itself stays a warning | Resolved |

**This GDD's open questions:**

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Do #6 B9 and #7 H5 still pass on #9's final routes? They pass on its provisional N1, priced on L2's bills (L6.4; AC-J-1) | Fight and dungeon routes (#9), Validator (#12) | #9's approval |
| 2 | If later content gates a source that runs many units, #6 S8 over-charges the gate (L7.1). Amend S8 to price each atom once per chain first; the draft A1 rule is the starting point (L7.3) | Forge and proving (#6), Validator (#12) | Before any such content (Vertical Slice) |
| 3 | `qa-lead` suggests X6 cover every cap-1 output, so key-item makes too. No key item here has a by-product; is the wider rule worth a check? Resolved 2026-11-21 by #12 (`content-validator-and-balance-enumeration.md` VC12, designer's choice): yes, as #12's own error check. X6 is unchanged, and VC12 prints "covered by X6" on the hearth road | Validator (#12), with Activity slot (#4) | Done |
| 4 | Recipes are slower than routes by design (1.25–2×), and three run 9–13 minutes; in a hearth-only best four they are 53–58% of the run. Does the hearth still read as a road of its own, do the long makings read as weight, not waiting, and is the choice density enough (Player Fantasy, the lesser-road risk; L4.5; Game Feel)? If not, the levers are the Tone and the ladder beats, since the prices are bound by #9's premium | Designer | Wave A checkpoint: a hearth-only run and a mixed run in one session |
| 5 | Does the shell group the fourteen sources by line (fuel, timber, stone, recipes) or by phase (before the lamp, after it, after the chisel)? | Interface shell (#13) | #13 UX spec |

**ADRs required** (representation this GDD leaves out):

1. The report format for X1–X6, including "not evaluated" for X3 and X4 when X5 fails. It extends
   #1's ADR 8 and #6's ADR 3.
