# Fight and Dungeon Routes

> **Status**: Approved 2026-11-21 (lean review; recommended follow-ups in `design/gdd/reviews/fight-and-dungeon-routes-review-log.md`)
> **Author**: designer + Claude (`/design-system`)
> **Last Updated**: 2026-11-21
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 2 (Methods matter), 4 (No dead ends, no attention tax)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-20 (no blocker; its one watch item, whether the descent reads as its own way to gather, is already Open Question 5 for the first MVP playtest)
> **Amendments**: A1 2026-11-21 — Open Question 3 marked resolved by Tending (#10, `tending.md` D1, J3): routes are not tendable, and U3 holds under every tending set (status edit only, no rule change; designer-approved). Touches Open Questions row 3 · A2 2026-11-21 — N1 gains the road-group values for #1 A7's `source.group` ("Hunts", "The Still Deep"); Open Question 8's display half answered by the Interface shell (#13, C13) (requested by #13; approved by the designer). Touches N1, Open Questions row 8

## Summary

Fight and dungeon routes are the second way to get forge ingredients: six hunts and the Still
Deep, a dungeon of three floors, each paying one ingredient for a few minutes and half a cap of
one refined good. Every route fight is fought by the same fixed unforged cultivator and is
guaranteed winnable, so the player reads the result before starting. Routes exist so that the
two methods gather in different shapes (Ember Breath hunts, Still Water descends) and so that
each ingredient has a fightless recipe and a fight route that is cheaper but needs the fight.

> **Quick reference** — Layer: `Feature` · Priority: `MVP` · Key deps: `Content records and schema, Resources and caps, Activity slot, Combat resolver, Forge and proving, Methods`

## Overview

Fight and dungeon routes are the game's fight sources: six **hunts** and one **dungeon**, the
Still Deep, of three floors. Each one is a `source` record that the activity slot (#4) runs like
any other. A unit spends half a cap of one refined good and a few minutes of slot time, fights one
creature on the Combat resolver (#5), and pays one forge ingredient. The fighter is always the
**unforged cultivator**, a fixed `combatant` whose stats are the Foundation's base (#6), so every
route fight is known before it starts. The validator guarantees that the unforged cultivator wins
every route fight that content ships.

The two methods differ here in shape, not in price (`methods.md` W5):

- **Ember Breath hunts.** It has six hunts, one for each ingredient. They have no gates and can be
  run in any order.
- **Still Water delves.** It has three hunts (Echo Jade, Ironbark Heartwood, Ghost Moss) and the
  Still Deep. The floors pay Ember Marrow, Cloud Lotus and Tidewater Pearl, and each opens once the
  floor above has paid out. Still Water's best Foundation needs the pearl, so the player goes all
  the way down.

Both are cheaper than crafting. A fight route costs at most 80% of the slot time its ingredient's
recipe costs (#8), so it is each ingredient's cheapest source under the method that opens it. The
recipe stays the fightless path that pillar 4 guarantees. The bill keeps the gathering and refining
loop in play: a hunt replaces the craft step, never the chain behind it.

**The player's part.** The player picks which route to run and when. Each route shows its bill,
its time, its creature and its exact result before it starts. Nothing else is asked: no stance, no
gear, no retry and no watching. Leaving keeps progress (rule 27). A part-run unit waits, and a
floor that has opened stays open for the rest of the run, the forge included.

**Why it exists.** Pillar 2 needs a method to change which routes work, and the concept's third
mechanic asks for "an auto-resolved fight and a dungeon of chained fights", each a source of forge
ingredients. Without this system each ingredient would have only its recipe, and a method would
change only what ingredients contribute. Under W5 the routes carry most of pillar 2's weight,
alongside the forge's single swap of Cloud Lotus for Tidewater Pearl (`methods.md` W6).

**What it is not.**

- **No risk.** No route fight can be lost in shipped content.
- **No growth through fighting.** Route fights read no Foundation, gear or count (#5 C9, #6 G13.2).
  Routes open through gates and the commit, never through stats.
- **No farming.** An ingredient's store holds one, so a route runs one unit and stops (#4 S5.3).
- **No by-products.** A route pays its ingredient and nothing else.

This GDD owns the route records' values: their bills, durations, creatures, gates and which method
opens each. It also owns the unforged cultivator and five validator checks (U1–U5). The `source`
type and its rows are #1's. When a unit runs and what it costs is #4's. The fight itself is #5's,
and which method opens which route is #7's.

## Player Fantasy

**Framing: direct.** The player chooses these routes and reads them. The promise: **the road is
known.** You choose a route and see what it costs and what it pays, and the road waits while you
walk it.

**The anchor moment** is the third floor of the Still Deep, under Still Water. The row reads
"Crab: wins, keeps 19 of 100 Life · Jade Blank ×4 · 3 min 30 s", and its gate says it opens once
Cloud Lotus has been held. The player's plan needs the pearl at the bottom, so they go down the
whole way: the Marrow floor, then the Lotus floor, then the Crab. Each floor leaves a thinner
margin than the one above, and none of them can be lost. They are walking a known road, not
gambling on it. Once a floor has opened, it stays open.

- **Ember Breath** reads the same three creatures as open-country hunts, each one a single job in
  any order. **Still Water** meets them in their dens, one under the other. The difference is
  visible on the method-choice screen before the commit (rule 73), and each method's routes lead
  to the ingredients its own best Foundation needs (rule 71).
- The three shared hunts are the common ground. Echo Jade, Ironbark Heartwood and Ghost Moss are
  hunted the same way whichever method the player circulates.
- The fighter is the unforged cultivator: the player before the forge, with the Foundation's base
  stats and nothing else. After the forge, the same fights read as the road the player walked to
  get there.

**This serves:**

- **Pillar 4** (*"Debating a reward for watching or one that waits for the player, this pillar
  picks the one that waits"*). A route is a cost you can read. A unit finishes while you are away,
  and a lost or unwatched fight cannot happen.
- **Pillar 2** (*"The method you circulate changes what each ingredient contributes at the forge
  and what other systems pay, never just a rate"*). Hunting against delving is a change in which
  routes exist and how they chain, not a change in rate.
- **Pillar 1** (*"Every realm breakthrough is assembled from chosen ingredients"*). Every route
  pays an ingredient, and the road serves the forge.

**What it must not promise:**

- danger or tension;
- grinding, farming or drops that vary;
- exploration behind fog: every route, floor and result is visible;
- combat mastery or reflexes;
- loot or gear;
- lasting harm. Life is spent inside a fight and never carried between units (#5 C5).

**Tone.** Measured and patient: *road, route, cost, kept, known, waits, descend*. A result names
its decider in the stats' terms, for example "struck first" or "outlasted" (#5 Visual/Audio). A
hunt is "a hunt", a floor is "a floor", and the dungeon is the Still Deep. Nothing says "farm",
"grind" or "loot".

*Specialist: `creative-director` consulted. It gave three framings ("the road is known", "the
unforged cultivator walks out", "two shapes of going") and recommended the first, which was
adopted. Its note to anchor the section on one specific route card was taken. The other two
framings appear above as supporting lines.*

## Detailed Design

### Core Rules

Notation and numbering:

- Rules are N1–N12, formulas X1–X3 and checks U1–U5, so no list collides with another GDD's.
- Ingredient abbreviations follow #6 S9: EJ Echo Jade, IH Ironbark Heartwood, EM Ember Marrow,
  CL Cloud Lotus, GM Ghost Moss, TP Tidewater Pearl. EB is Ember Breath and SW is Still Water.
- "Price" is #6 S8's: the untended slot time to make one unit from a run start.

#### N1. The route set (content, provisional)

Nine `source` records. Names and ids are provisional, and names fit #1's 24 code points.

| id | Name | Pays | Exists under | Bill (`inputs`) | Duration | Fights | Gate (`need`) |
|---|---|---|---|---|---|---|---|
| `hunt_pangolin` | Pangolin Hunt | EJ ×1 | both (authored enabled) | Rendered Oil ×6 | 180,000 ms | `pangolin` | — |
| `hunt_bear` | Bear Hunt | IH ×1 | both (authored enabled) | Seasoned Plank ×5 | 210,000 ms | `heartwood_bear` | — |
| `hunt_fox` | Fox Hunt | GM ×1 | both (authored enabled) | Jade Blank ×4 | 510,000 ms | `ghost_fox` | — |
| `hunt_salamander` | Salamander Hunt | EM ×1 | EB (`enabled: false`, EB opens) | Rendered Oil ×6 | 210,000 ms | `salamander` | — |
| `hunt_heron` | Heron Hunt | CL ×1 | EB (`enabled: false`, EB opens) | Seasoned Plank ×5 | 630,000 ms | `heron` | — |
| `hunt_crab` | Crab Hunt | TP ×1 | EB (`enabled: false`, EB opens) | Jade Blank ×4 | 900,000 ms | `tide_crab` | — |
| `deep_floor_1` | Still Deep I | EM ×1 | SW (`enabled: false`, SW opens) | Rendered Oil ×6 | 210,000 ms | `salamander` | — |
| `deep_floor_2` | Still Deep II | CL ×1 | SW (`enabled: false`, SW opens) | Seasoned Plank ×5 | 210,000 ms | `heron` | `reached(ember_marrow, 1)` |
| `deep_floor_3` | Still Deep III | TP ×1 | SW (`enabled: false`, SW opens) | Jade Blank ×4 | 210,000 ms | `tide_crab` | `reached(cloud_lotus, 1)` |

- Every route has no `reveal`, so all nine are visible from the first screen. A route the
  committed method does not open shows as closed (#14). Visibility is never actionability
  (rule 2).
- The durations are chosen with the table generator (X3), never by hand. A change re-runs U3, U5,
  #6 B9 and #7 H5.
- This is W5's plan exactly. EJ, IH and GM each have one shared hunt. EM, CL and TP each have an
  Ember Breath hunt and a Still Water floor. That makes 9 of the 23 sources in #7 Y3's budget.
- **Road groups** (#1 A7's `source.group`, a display heading; A2 to this GDD). The six hunts carry
  "Hunts", and the three floors "The Still Deep". The Interface shell (#13) draws a group as the
  ladder of UI Requirements 3 when every source in it has `fights` and every source after the first
  has a `need`, and as one closed row when all of them are closed (`design/ux/interface-shell.md`,
  C12).

#### N2. The shape of a fight route

Every fight route has the same shape, and U2 checks it:

1. **One fight.** `fights` holds exactly one creature. #1 allows up to three, which stays open for
   later content (a boss floor at the vertical slice). In the MVP a floor is one fight (#1 R1: "a
   dungeon floor has one"). Life therefore never carries between fights, and every unit starts at
   full Life (#5 C5).
2. **One ingredient out.** `outputs` is exactly one ingredient, amount 1. There is no by-product,
   so #4's T2 never fires on a fight route. This is #9's half of #4 Open Question 6.
3. **One refined bill in.**
   - `inputs` is exactly one spendable resource, in the amount `div_floor(base cap, 2)`: half a
     store.
   - The bill makes a hunt a spend in the 30-second loop (concept, Core Loop), so a hunt replaces
     the craft step but not the gathering and refining behind it.
   - Half a cap stays below #3 V2's 70% floor. A store's largest bill (rule 18) is therefore always
     a recipe's, and a method that closes a route can never leave a store without its big sink.
   - The bill is never an ingredient (#6 B13) and never a key item (#3 V5).
4. **Bills by family** (provisional, pending #8's chain), so that no single store gates every
   route:
   - fuel (Rendered Oil) pays for EJ and EM;
   - timber (Seasoned Plank) pays for IH and CL;
   - stone (Jade Blank) pays for GM and TP.

   An ingredient's hunt and its floor spend the same bill, so the two methods' routes differ in
   shape and time only.
5. **Closed to methods.** No method patches a route's `inputs`, `outputs`, `duration` or `fights`
   (`methods.md` W3). A method only opens a route.

#### N3. The unforged cultivator (the route challenger)

1. The challenger for every route fight is one `combatant` record, `unforged` ("Unforged
   Cultivator"). This is the fixed baseline that #5 C9 asks this GDD to name.
2. Its stats equal #6's `FOUNDATION_BASE`, stat for stat: might 20, guard 10, vigor 100, speed 0.
   U4 checks the equality. It is the cultivator before any affinity: a Foundation with every
   effective value at 0 (#6 S3).
3. It fights every route before the forge and after it (#6 G13.2). Route fights never read the
   Foundation, the method or any carried item.
4. **Why the equality matters later.** Every Foundation stat is its base plus an effective value of
   0 or more (#6 S3). Every Foundation is therefore at least the unforged cultivator in every
   stat, and by #5 C7 it wins every fight the unforged cultivator wins. Realm ladder (#19) can
   switch the route challenger to a Foundation without making any route unwinnable.

#### N4. The creatures (content, provisional)

There is one creature per ingredient. The Ember Breath hunt and the Still Water floor for the same
ingredient fight the same creature: Ember Breath meets it in the open, Still Water in its den.

| id | Name | Guards | might · guard · vigor · speed | Profile | Unforged keeps (of 100 Life) | Score (#5 F7) |
|---|---|---|---|---|---|---|
| `pangolin` | Jade-Echo Pangolin | EJ | 10 · 30 · 50 · 20 | armoured | 60 | 16,000 |
| `heartwood_bear` | Heartwood Bear | IH | 12 · 10 · 110 · 0 | deep Life | 52 | 15,200 |
| `ghost_fox` | Ghost Fox | GM | 20 · 0 · 40 · 80 | fast, fragile | 61 | 16,100 |
| `salamander` | Marrow Salamander | EM | 40 · 0 · 40 · 0 | hard-hitting, fragile | 68 | 16,800 |
| `heron` | Lotus Heron | CL | 15 · 10 · 50 · 60 | quick | 46 | 14,600 |
| `tide_crab` | Tide Crab | TP | 15 · 30 · 60 · 20 | armoured, deep | 19 | 11,900 |

1. The unforged cultivator beats each of them (U1). Each win survives a raise of 3 to any one of
   the creature's stats, so a small retune does not flip a route silently. U1 still guards every
   change.
2. **Deeper is thinner.** The floors keep 68, 46 and 19 of 100 Life, each from a full start
   (N2.1). Since no route can be lost, the margin is the one expressive number a route fight has,
   and depth shows in it.
3. Every speed is at most `SPEED_BASE` (100), so no creature strikes more than twice as often as
   the unforged cultivator. This mirrors #6 B11, which covers proving only. For routes it is a
   content fact, not a check (N12).
4. With one baseline, six creatures, and #6's three door opponents, there are 10 combatants. The
   record total is 57, inside #7 Y3's 54–60 and the concept's 40–60.

#### N5. Hunts

1. A hunt is flat: no gate, no order, and nothing about one hunt depends on another.
2. EJ, IH and GM's hunts are authored enabled and exist under both methods. EM, CL and TP's are
   authored `enabled: false` and opened by Ember Breath (W4).
3. A hunt can run when the method is committed, its bill is held and its ingredient is not held
   (#1 F7, #4 S5). A Start is refused otherwise, with #4's reason: "Needs a method committed",
   "Needs Jade Blank ×4 (2 more)" or "Ghost Moss is already held".

#### N6. The Still Deep (the dungeon)

1. **Three floors, one ladder.** The floors pay EM, then CL, then TP. Each is authored
   `enabled: false` and opened by Still Water only. Under Ember Breath the dungeon does not exist,
   and the commit dialog names its three floors as closed (`methods.md` W7.3, Y1).
2. **Gates.**
   - Floor 1 has no `need`.
   - Floor k ≥ 2 has `need` exactly [`reached(` floor k−1's ingredient `, 1)`]: "once you have
     held what the floor above guards". This is the form #1 names for chaining floors (#1
     Interactions, row 9). #1's generated need text says it.
3. **Leaving keeps progress (rule 27).**
   - `reached` reads a high-water mark (#1 F1), so a floor once open stays open for the run, after
     the forge consumes the ingredient as well.
   - A part-run floor keeps its progress when the player switches away (#4 S6).
   - Rule 27's "bosses reset" has nothing to reset in the MVP, which has no clash.
4. **Crafting can open a floor.** A player who crafts Ember Marrow first has met floor 2's gate,
   because the gate reads "ever held", not "cleared". Floor 1 then refuses its Start ("Ember
   Marrow is already held"), and floor 2 is open.
   - This is intended: no order of play can lock a floor (pillar 4).
   - #6 S8 prices the gate at the ingredient's cheapest source, so the shortcut is priced, not
     free.
   - A key-item floor marker was rejected. Crafting EM first would fill EM, so floor 1 could not
     run and the marker could never be made. The deeper floors would stay locked until the forge,
     which is a trap. A marker would also trip #4's T2 and add three records.
5. **The pearl lies deepest.** TP needs the whole descent, and Still Water's best makeup (EJ · IH ·
   EM · TP) holds TP. A Still Water player therefore gathers Cloud Lotus on the way down (#6 S7
   makes it once).
   - This makes Still Water's best dearer than its cheapest makeup, which is what H5 asks
     (`methods.md` Y4).
   - It leaves Ghost Moss's hunt as Still Water's whole over-gathering price for B9 (X3).

#### N7. A unit of a fight route

The activity slot runs it (#4 S4). This GDD adds nothing to the unit and only restates the order
for routes:

1. The unit accrues its duration. At completion the resolver runs one fight: the unforged
   cultivator against the route's creature (#5 C2).
2. **On a win**, one settle (#3 K3) pays the bill and gives the ingredient. The ingredient's store
   is now full (cap 1, #3 K2.3), so the run stops after one unit and rest fills the slot.
   - The stop reason is `inputs` if the settle left the bill's store short, because #4 S5 tests
     inputs before room. Otherwise it is `full`.
   - Either way the route is now Held (States and Transitions).
3. **On a loss** (impossible in shipped content, U1): nothing is paid or received, the unit's
   progress becomes 0, and the run stops `lost` (#4 S4.2). The bill stays held. A loss costs the
   unit's time only, which confirms #4's answer to #5 Open Question 4 for routes.
4. Every route fight resolves in the frame of its completion, with no playback (#5 Game Feel).

#### N8. The premium over crafting

1. **The rule.** Under each method, wherever an ingredient's fight route is enabled, that route's
   price is at most `PREMIUM_MAX_BP` (8,000, i.e. 80%) of the price of the ingredient's cheapest
   fightless enabled source (X2). U3 checks it.
2. **Its band with #6 B10.** B10 caps the recipe at `max(2p, p + 60 s)` above the fight route's
   price p. So the recipe costs 1.25× to 2× the fight route under each method, and X2 states the
   band per ingredient for #8.
3. **Its consequence.** Every ingredient's cheapest source is its fight route under the method that
   opens it. #6 S7 therefore times every makeup on this GDD's routes and their bills. B9 and H5
   are settled by this GDD's numbers plus the bills' chain (X3), and B10 is settled by #8's recipes.
4. **Why time, not yield.** An ingredient's store holds one, so a larger yield would spill (#3
   K2.3), and a by-product is closed by N2.2. The premium can only be paid in slot time.

#### N9. The first ingredient (rule 17)

Under each method, some ingredient's cheapest enabled source has a price of at most
`FIRST_INGREDIENT_MS` (300,000 ms). That is the concept's "first ingredient in hand within five
minutes", which #3 left to the routes and the Validator. U5 checks it. On the provisional content
it is the Pangolin Hunt under both methods, at 224 s (X3).

#### N10. What the method changes here

Only which routes exist (`methods.md` W3, W4):

| | Ember Breath | Still Water |
|---|---|---|
| Hunts | all six | Pangolin, Bear, Fox |
| Dungeon | closed | the Still Deep, three floors |
| Fight routes enabled | 6 | 6 |
| Routes per ingredient (#7 Y3) | recipe + hunt | recipe + hunt (EJ, IH, GM) or recipe + floor (EM, CL, TP) |

No route's bill, time, creature or gate depends on the method.

#### N11. What the player cannot do

The player cannot:

- choose or change a creature, the challenger, or the challenger's stats;
- equip, stance or prepare anything for a route fight;
- lose a route fight, so there is no retry to take;
- skip a floor's gate, or enter the Still Deep under Ember Breath;
- farm a route, because the ingredient's store holds one and a held ingredient blocks its routes
  until the forge spends it;
- spend an ingredient on a route (#6 B13);
- run two routes at once, or queue one (#4 S1).

#### N12. Checks owned here (run by the Validator)

The Validator (#12) runs these, and each is an error. They add to #1 R8.4, #3 V1–V7, #4 T1–T3,
#6 B1–B13 and #7 H1–H5, and repeat none of them.

| # | Check | Run on | Serves |
|---|---|---|---|
| U1 | **Winnable route.** For every source whose `fights` is not empty, enabled or not, the resolver's chain (#5 C5) with `unforged` as the challenger, starting at #5 F1 Life, is won | `checked` once. No method patches `fights` or `combatant.stats` (W3), so one run covers both frozen sets | #5 Open Question 2, #7 Open Question 2; rules 51 and 74: a route that can never pay is dead content |
| U2 | **Route shape.** Every source with fights has exactly one fight; `outputs` of exactly one ingredient, amount 1; `inputs` of exactly one spendable resource (base cap 2 or more) in the amount `div_floor(base cap, 2)` | `checked` | N2; #9's half of #4 Open Question 6 |
| U3 | **Premium.** Under each method, for each ingredient whose fight route is enabled, X2's test passes against its cheapest fightless enabled source. *[blocked: #8]* until recipes exist; the Wave A checkpoint runs it on stub recipes | each frozen set | N8; concept MVP item 3 |
| U4 | **Unforged identity.** `unforged.stats` equals `FOUNDATION_BASE` in all four stats | `checked` | N3 |
| U5 | **First ingredient** (rule 17). Under each method, the cheapest price of any ingredient's cheapest enabled source is at most `FIRST_INGREDIENT_MS`, untended, with an empty rest bank (#4 S11: a ceiling) | each frozen set | N9 |

- U1 makes #7's assumption W5.5 true by check. `routes(i, m)` and #6 S7 then count only routes
  that pay.
- U1 runs on disabled sources too, because a source closed under one method is open under the
  other (W4).
- U3 and U5 read prices, which depend on #8's refining chain through the bills. They are
  evaluated once #8's sources exist, and the report says "not evaluated" until then (#7 ADR 2).
- **A check that cannot run says so** (it never reads as a pass):
  - U4 fails when no `unforged` record exists. U1 is then reported "not evaluated: no
    challenger", and so is U1 for every case while U4 fails, because N3.4's guarantee needs the
    identity.
  - U3 reports an ingredient "not evaluated" when it has no fightless enabled source under a
    method. That is #1 R8.4 check 2's failure, reported there.
- U3 and U5 read untended prices (#6 S8). Whether a tended route keeps the premium is Tending's
  (#10) to check (Open Questions).
- **Content facts, not checked:**
  - an ingredient's hunt and floor spend the same bill (N2.4);
  - the bill families;
  - creature speeds of at most 100 (N4.3);
  - the +3 robustness of N4.1.
  
  No rule depends on these. A faster or stronger creature can only fail U1, which is checked.

**State, actions and events (TD finding 6):**

- **Non-derived state owned:** none. A route's kept progress and the run are #4's. Held amounts and
  high-water marks are #3's and #1's.
- **Actions accepted:** none. The player starts a route with #4's `start(sourceId)`.
- **Events emitted:** none of its own. A unit's result travels in #4's `unitsCompleted`,
  `fightLost` and `runStopped`, and in #3's `settle` events.

*Specialists consulted:*

- `game-designer` was primary; `systems-designer` and `economy-designer` supported.
- They agreed on several points:
  - an unwinnable route is a validator error;
  - the unforged cultivator equals `FOUNDATION_BASE`;
  - routes pay no by-product;
  - floors gate on `reached` of the floor above's ingredient, not on a key-item marker.
- They split on three points, which the designer decided on 2026-11-20:
  - the bill: a refined bill (`economy-designer`), over a bill plus a Hearth Lamp gate
    (`game-designer`) and time only;
  - the dungeon's shape: single-fight floors (`game-designer`), over a descent that carries Life
    (`systems-designer`);
  - the premium: at most 80% of the recipe, over 90% and a 60–80% band.
- The designer also chose the floor order EM, CL, TP over EM, TP, CL.
- `art-director`, a supporting specialist for combat, was consulted for Visual/Audio instead. No
  route fight has hit feedback to direct. `ai-programmer` does not apply, because nothing chooses
  actions.

### States and Transitions

A route's state is **derived** each time it is read, from the commit (#7), `enabled` (#1 F7), its
gate (#1 F3), the held bill and the held ingredient (#4 S5). Nothing here is saved. States are
listed in the order they are tested.

| State | Holds when | The player sees |
|---|---|---|
| Waiting | No method committed | The route, its bill, time and result, and "Needs a method committed" |
| Closed | The committed method does not enable it | The route, named and marked closed, and "Opens under {method}" (#14) |
| Sealed | Enabled, but its `need` is unmet (floors 2 and 3) | Its gate in need text: "Needs Ember Marrow ×1 (1 more)" (#1 R5.5) |
| Short | Its bill is not held (#4 S5.2) | "Needs {resource} ×n (k more)" |
| Held | Its ingredient is held (#4 S5.3) | "{ingredient} is already held" |
| Ready | It can run (#4 S5) | Its preview and Start |
| Running | It is the slot's occupant | #4's progress and countdown |

| From | Trigger | To | Reversible? |
|---|---|---|---|
| Waiting | The commit (#7 W7) | Closed if the method does not open it; otherwise the first state below Closed that holds | No (MVP) |
| Sealed | The ingredient its gate names is held for the first time, from any source | Held, Short or Ready | No: the gate is monotone (#1 R5.4) |
| Short ↔ Ready | The bill's store rises to or falls below the bill (#3 settle) | Ready or Short | Yes |
| Ready | `start(source)` (#4 S3.1) | Running | — |
| Running | A won unit (N7.2) | Held, shown as Short first if the bill's store is also short, and the slot rests | Yes, through the forge |
| Running | Stop, a switch, or another of #4's stops | Ready, Short or Held, with its progress kept (#4 S6) | — |
| Held | The forge consumes the ingredient (#6 G8) | Ready or Short | — |
| Any | A new run (#11) | Waiting | — |

- **The Still Deep's ladder** under Still Water: floor 1 is unsealed at the commit; floor 2 opens
  when EM is first held, and floor 3 when CL is first held. Once all three are open they stay
  open, so the ladder moves one way only.
- **After the forge**, the four ingredients the forge used are no longer held, so their routes are
  Ready or Short again. A route run then holds an ingredient that this realm's forge cannot use
  (#6 G13.5). It is harmless, and #13 may say so.

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | The `source` and `combatant` types and rows; `reached` (R5); F1 marks; F7 derived state; need text (R5.5) | Values for `source.fights` (its row is #9's) and for nine sources and seven combatants; floors chained by `reached` on floor outputs (Interactions row 9) | #1 owns the types; #9 the values |
| 3 | Resources and caps | `settle` (K3), base caps, room and full (K6) | Bills of half a refined store (N2.3), always below V2's largest-bill floor; acceptance of K1's refined stores for its bills | #3 |
| 4 | Activity slot | Units, the stop rule, kept progress, `lost` and `full` stops (S4–S6) | Nine sources in the generic shape. No loss in shipped content (U1). Fight routes have no by-product, so T2 never fires on them | #4 owns when and what a unit costs |
| 5 | Combat resolver | The chain result (C4, C5); F7's score | The challenger (`unforged`, C9) and each route's creature; answers to Open Questions 2 and 4 (U1, N7.3) | #5 owns the fight |
| 6 | Forge and proving | `FOUNDATION_BASE` (S3); S7 and S8; B9, B10, B13; G13.2 | Routes that are each ingredient's cheapest source, so S7 times this GDD's routes; content that passes B9 and B13 (X3); the fight-route half of B10 and of #6 Open Question 1 | #6 owns B9, B10 and B13 |
| 7 | Methods | The route plan (W5); the opens (W3, W4); H5 | Nine route records within the plan; U1, which makes W5.5 true; H5 passing on real route times (X3); answers to Open Questions 2 and 3 | #7 owns which method opens which route; #9 owns the routes |
| 8 | Crafting route (in design) | Each ingredient's recipe, and the refining chain behind the bills | The premium band per ingredient (X2), and the bill families and their price limits (X3) | #8 authors recipes and the chain; #9 the fight routes |
| 10 | Tending | Tending entries on `outputs` and `duration` | Real route durations to set ceilings against; T1 must hold on tended route durations. A tended route must still pass U3 and B10, which #10 must check | #10 |
| 12 | Validator | — | U1–U5; the X3 table generator's inputs | #12 runs; #9 defines |
| 13 | Interface shell | — | Route rows: bill, time, creature, the exact result (#5 UI 1), the seven states above | #13 owns the display |
| 14 | Method marks | — | Which routes are closed under each method (Closed state) | #14 |
| 19 | Realm ladder (Alpha) | A later realm's challenger | N3.4: any Foundation beats every route the unforged cultivator beats | #19 |

## Formulas

This system adds no new arithmetic to the fight, which is #5's F1–F7, or to the price and the
gathering time, which are #6's S8 and S7. It contributes three things:

- X1, how S8 prices a fight route and a gated floor;
- X2, the premium test with the recipe band it implies;
- X3, the route table that shows the provisional content passing U1, U5, #6 B9 and #7 H5.

Every value is an integer in ms, and every division goes through `div_floor` (#1 F5).
`ceil_div(a, d)` is #3's, −div_floor(−a, d).

### X1. Fight route price

The route_price formula is defined as:

`price(f) = d_f + ceil_div(b_f, out_r) × price(src(r)) + [f is floor k ≥ 2] × price_1(g_{k−1})`

This is #6 S8 applied to N2's shape. There is one input, the bill, and at most one `reached`
atom, the floor gate. Hunts and floor 1 have no gate term.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| d_f | int | 1,000–86,400,000 ms (#1 R4, #4 T1) | data file (N1) | The route's untended duration per unit |
| b_f | int | `div_floor(cap_r, 2)` (U2) | data file (N1) | The bill: units of refined resource r per unit |
| out_r | int | 1–10⁹ | data file (#8) | Units of r made per unit of r's cheapest source |
| price(src(r)) | int | ms, 1 upward | calculated (#6 S8, #8's chain) | The price of one unit of r's cheapest source |
| price_1(g) | int | ms, 1 upward | calculated (#6 S8) | The price of making one of ingredient g once by its cheapest enabled source; g is the ingredient that floor k−1 pays |

**Output Range:** from d_f upward. A floor's price is the sum of its own price and the prices
of the floors above it, as long as each floor stays its ingredient's cheapest source (U3). So the
deepest floor is the dearest, as `methods.md` W5.2 asks. The largest price on the provisional
content is the Crab Hunt's 944 s.
**Example (provisional, with every bill priced at 44 s, which is two refining units at #3 K1's
illustrative 22 s each):**
- Still Deep I: 210 + 44 = 254 s.
- Still Deep II: 210 + 44 + 254 = 508 s.
- Still Deep III: 210 + 44 + 508 = 762 s.
- The Crab Hunt, under Ember Breath: 900 + 44 = 944 s.

### X2. Premium test and the recipe band

The premium formula is defined as:

`premium_ok(i, m) = [ price(f_i,m) × 10000 ≤ PREMIUM_MAX_BP × price(r_i,m) ]`; U3 fails when it is 0

`band(i) = [ ceil_div(max_m price(f_i,m) × 10000, PREMIUM_MAX_BP),  min_m ceiling_m(i) ]`, with
`ceiling_m(i) = max(div_floor(price(f_i,m) × FIGHTLESS_CEILING_BP, 10000), price(f_i,m) + FIGHTLESS_SLACK_MS)` (#6 S8)

- `band(i)` is the price interval that ingredient i's recipe, which is shared by both methods
  (`methods.md` W5), must fall in to pass U3 under every method and B10 under every method.
- Under U3, the fight route is the ingredient's cheapest other source, so it is the p_i of B10.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| f_i,m | source | the ingredient's one fight route under m | data file (N1) | The hunt or floor enabled for i under m |
| r_i,m | source | i's cheapest fightless enabled source under m | data file (#8) | In the MVP, i's recipe |
| PREMIUM_MAX_BP | int | 7,000–9,000 (shipped 8,000) | constant (tuning knob) | The most a fight route may cost, as basis points of the recipe's price |
| FIGHTLESS_CEILING_BP, FIGHTLESS_SLACK_MS | int | 20,000; 60,000 ms | constants (#6 S8) | B10's ceiling |

**Output Range:**
- `premium_ok` is 0 or 1.
- A non-empty band needs `max_m price(f_i,m) × 10000 / PREMIUM_MAX_BP ≤ min_m ceiling_m(i)`. At
  the shipped 8,000 that is 1.25×. For an ingredient with two fight routes, its hunt and its
  floor must then be within about 1.6× of each other in price.
- Every product stays at or below 2⁵³ − 1 while a price is at most 4.5 × 10¹¹ ms, the bound #6 S8
  already sets.

**Example:**
- Cloud Lotus: the Heron Hunt costs 674 s under Ember Breath, and Still Deep II costs 508 s under
  Still Water.
- The low end is ceil_div(674,000 × 10,000, 8,000) ms = 842.5 s.
- The high end is min(max(1,348, 734), max(1,016, 568)) = 1,016 s.
- So #8's Cloud Lotus recipe must cost between 842.5 s and 1,016 s.
- A recipe at 800 s would fail U3 under Ember Breath. One at 1,100 s would fail B10 under Still
  Water.

### X3. The route table (provisional content, generated)

The table below was generated on 2026-11-20 by a throwaway script (not shipped). It reimplements
#5 F1–F7, #6 S7 and S8, and the checks named. Every refined bill is priced at 44 s, as in X1,
until #8's chain exists.

- The table adds S8 route prices. #6 S7 instead sums each store's demand across a makeup and
  rounds once, so its T can be lower when two bills share a refining source.
- The two agree while every bill is a whole number of refining units, which the 44 s assumption
  is.
- The Validator times with S7 itself, never with this table.

**Fights (U1).** The unforged cultivator (20 · 10 · 100 · 0) wins all six creature fights: see N4.

**Prices per method (X1, in s):**

| | EJ | IH | EM | CL | GM | TP |
|---|---|---|---|---|---|---|
| Ember Breath | 224 | 254 | 254 | 674 | 554 | 944 |
| Still Water | 224 | 254 | 254 (floor I) | 508 (floor II) | 554 | 762 (floor III) |

**Gathering times (#6 S7, in s).** A floor's gate pulls in the floors above it, and each is made
once. One unit of Ember Marrow both fills the makeup and meets floor II's `reached(ember_marrow,
1)`, because `reached` reads the high-water mark (#6 S7, A2). Summing the two demands instead
would give Still Water 1,494 / 2,302 s (1.54, 808 s) and the same H5 margin, and both counts
pass at every bill price inside the limits below.

| | Best makeup | T_best | Cheapest makeup | T_min | T_all | B9: T_all / T_best, T_all − T_best | H5: T_best − T_min |
|---|---|---|---|---|---|---|---|
| Ember Breath | EJ · IH · EM · CL | 1,406 | EJ · IH · EM · GM | 1,286 | 2,904 | 2.07, 1,498 ✓ | 120 ✓ |
| Still Water | EJ · IH · EM · TP | 1,240 | EJ · IH · EM · CL and EJ · EM · CL · TP | 986 | 1,794 | 1.45, 554 ✓ | 254 ✓ |

- **B9 passes** under both methods. Each ratio is at least 1.35, each difference at least 360 s,
  and each T_all at most 3,600 s. Still Water's over-gathering price is the Fox Hunt alone, because
  TP's descent makes CL on the way (N6.5).
- **H5 passes** under both methods. This answers `methods.md` Open Question 3 on this GDD's side:
  under U3, S7 times only fight routes, so the margins above stand once #8's recipes exist, if the
  bills stay within the limits below. Still Water fails H5 on #6 S9's stubs, and here it passes by
  254 s, because the pearl's floor carries the two floors above it.
- **U5 passes.** The first ingredient is the Pangolin Hunt, at 224 s under both methods.
- **#6 S9's stub gather column is superseded.** S9's stubs gave EJ, IH and GM different minutes
  under each method. Shared hunts cannot do that (N10). This table replaces the stubs for B9 and
  H5, and S9's seals are untouched.

**Recipe bands for #8 (X2, in s):**

| EJ | IH | EM | CL | GM | TP |
|---|---|---|---|---|---|
| 280–448 | 317.5–508 | 317.5–508 | 842.5–1,016 | 692.5–1,108 | 1,180–1,524 |

Each band is at least 168 s wide, so #8 has room to round.

**On #8's real bills** (`crafting-route.md` L2: Rendered Oil ×6 at 60 s,
Seasoned Plank ×5 and Jade Blank ×4 at 70 s each; checked 2026-11-21 with the X3 generator):

| | EJ | IH | EM | CL | GM | TP |
|---|---|---|---|---|---|---|
| Band (s) | 300–480 | 350–560 | 337.5–540 | 875–1,100 | 725–1,160 | 1,212.5–1,660 |
| #8's recipe (s) | 380 | 410 | 350 | 900 | 800 | 1,300 |

- Every recipe is inside its band, so U3 and #6 B10 pass for all 12 pairs.
- B9 is 2.04 with 1,550 s over (EB) and 1.43 with 580 s over (SW). Summing a gate ingredient's
  two demands would give SW 1.53 with 860 s over; #6 S7 (A2) takes the larger.
- H5 margins are 120 s and 280 s, and U5's first ingredient is the Pangolin Hunt at 240 s.

**Bill sensitivity.**
- U5, B9 and H5 hold, and every band stays non-empty, whenever each refined bill's price is at
  most 120 s and the three families' bill prices differ by at most 80 s. This was checked on a
  10 s grid.
- Failures outside that region:
  - with the oil bill above 120 s, the Pangolin Hunt passes 300 s. U5 then rests on the Bear
    Hunt, which needs the plank bill at 90 s or less;
  - with Jade Blank's bill dear and the others cheap, the Fox Hunt overtakes the Heron Hunt, and
    H5 fails under Ember Breath;
  - with Jade Blank's bill cheap and the others dear, the Fox Hunt no longer covers 1.35 × T_best,
    and B9 fails under Still Water.
- These are the limits #8's refining chain must meet (Open Questions).

*Specialists:*
- `systems-designer` proposed the gate form and the first duration set; this set retunes it, with
  the bill priced in.
- `economy-designer` proposed the premium's measure and the bill families.
- Every number above comes from the generator, not from hand arithmetic. The generator also
  confirmed that no single assignment of bill families survives every corner of 0–120 s
  independently, hence the 80 s spread limit.

## Edge Cases

Each case says who catches it: a **load error** (#1 R8.3), a **validator error** (U1–U5 here, or
another GDD's check, named), a **runtime rule**, or **another GDD**, named.

### Gates and order of play

- **If the player crafts a floor's ingredient before reaching that floor** (for example, Ember
  Marrow from its recipe): the next floor's gate is met, because it reads "ever held" (#1 R5.4).
  The crafted ingredient's own floor refuses its Start with "Ember Marrow is already held" (#4
  S5.3) until the forge spends it. This is a runtime rule, and it is intended (N6.4).
  - That path costs the recipe plus the next floor, which is dearer than the ladder by U3, so it
    is never a cheaper shortcut.
- **If an ingredient is already held**: every route that pays it refuses its Start, and the bill
  is not spent. A held ingredient cannot become held in the middle of a run, because only one
  source runs at a time (#4 S1). Caught by the runtime, #4 S5.3.
- **If the bill is short**: the Start is refused with #1's shortfall text, for example "Needs
  Jade Blank ×4 (2 more)".
  - The bill can fall short only at a segment start: at load, at the forge, or when a cap falls.
    The run then stops `inputs` with its progress kept (#4 S4.4).
  - Inside a segment, only this run's own unit spends the bill.
- **If floors 1 and 2 are done and the pearl is all that is left**: Still Deep III costs only its
  own 254 s, against a recipe of up to 1,524 s. The descent's price is front-loaded, which is
  why U3 and B10 read the cumulative price (X1).

### The forge and after

- **If the forge consumes an ingredient whose floor gate was met**: the floor stays open.
  Gates read high-water marks, and the forge never lowers a mark (#1 F1, #6 G8). This is a
  runtime rule.
- **If a route runs after the forge**: it works. The bill and the challenger are unchanged (#6
  G13.2), and the ingredient it pays cannot be used by this realm's forge (#6 G13.5). Nothing is
  lost but the run's own time, the player chose the run, and #13 may say that the realm is forged.
- **If the forge consumes the ingredient of a running route**: impossible. A running route's
  ingredient is not held, so the forge cannot spend it, and the forge spends no bill.

### Time

- **If away time ends in the middle of a unit**: the progress is kept, and no fight runs until
  the unit completes (#4 S4, S6). A completion inside the gap resolves on the content loaded at
  that time.
- **If the away cap is reached while a route runs**: the unit in progress finishes and the run
  stops `away` at the next unit start. A route runs one unit anyway, so the cap never cuts one
  (#4 S7.2).
- **If held breath is spent on a route**: it runs at 2× (#4 S8). The fight's result is the same,
  and U5 times its ceiling with an empty bank (#4 S11).

### Content changes under a save (owned by #11 and #4)

- **If a creature's stats change**: the next completion fights the new stats. A change that would
  make the unforged cultivator lose fails U1, so it never ships.
- **If a route's duration changes**: the kept progress is clamped to D′ − 1 on load (#4 Edge
  Cases).
- **If a bill rises above what is held**: the run stops `inputs` at the first segment start
  after load, with progress kept.
- **If a gate is retargeted, or a route is removed or disabled**: the slot is set to resting with
  reason `withdrawn` before the gap is advanced (#4 Edge Cases). A removed route's kept progress
  is dropped (#11).
- **If a store is re-capped by #3 or #8**: U2 fails until the bill is re-authored to half the new
  cap. Then U3, U5, B9 and H5 are re-run, because prices move.

### Checks at their boundaries

- **If a fight route costs exactly 80% of its recipe**: U3 passes, because the test is inclusive.
  The Heron Hunt at 674,000 ms passes against a Cloud Lotus recipe of 842,500 ms, and fails
  against one of 842,499 ms.
- **If a fight route's price equals its recipe's**: U3 fails. Under it #6 S7's tie-break by
  source id would decide the timing, so a passing U3 never leaves that tie-break to fire.
- **If the unforged cultivator ties a creature's last strike**: the challenger wins (#5 F5), so
  U1 passes.
- **If a floor is not its ingredient's cheapest source** (its recipe is cheaper):
  - X1's `price_1` becomes the recipe's price, and the deeper floors are re-priced from it;
  - U3 fails at that floor;
  - the report names the first failing floor and marks later failures "follows from" it.
- **If the first ingredient costs exactly 300,000 ms**: U5 passes (inclusive).

### Methods and routes

- **If one method opens a route twice**: load error, two patches on one triple (#1 R6.2).
- **If a method opens an authored-enabled route**: load error, a no-op patch (#1 F8).
- **If both methods open the same route**: validator error, #7 H2.
- **If a method opens a route for the wrong ingredient family** (for example, Still Water opening
  a hunt): only the route plan (W5) says otherwise. It is caught by review and by the acceptance
  criteria on N1's table, not by a check.
- **If a method opened no fight route for an ingredient**: #1 R8.4 check 1 fails, with fewer than
  two sources under that method.

### Tending (owned by #10)

- **If tending shortens a route's duration**: progress is rescaled (#4 S6.3), and #4's T1 holds
  the tended duration at 1,000 ms or more.
- U3 and U5 read untended prices. Whether a tended fight route still pays a premium over a tended
  recipe is #10's to state.

### Degenerate strategies

- **Crafting the gate ingredient to skip a floor**: legal, and dearer than the ladder (U3).
- **Switching away from a route to bank its progress**: it nets nothing, because the progress
  resumes at the same fraction (#4 S6).
- **Farming a route for spare ingredients**: blocked. The store holds one, and the forge consumes
  only its makeup.
- **Hunting only, never crafting**: the intended best play under the premium. The refined bills
  still need the gathering and refining chain, so the economy stays in use (N2.3).

*Specialist: `systems-designer` consulted. It hand-checked N4's six fights and X1–X3. Its two
corrections were applied in Core Rules and Formulas: the stop reason after a won unit (N7.2), and
X3's note that S7 rounds per store. It also found three checks that could pass without having
run, now reported "not evaluated" (N12). Its suggestion of a U6 for content facts (bill families,
creature speed, the +3 margin) was declined: no rule depends on them, and U1 covers the one that
matters.*

## Dependencies

**Upstream (this system depends on them):**

| # | System | Hard or soft | Interface | Status |
|---|---|---|---|---|
| 1 | Content records and schema | Hard | `source` and `combatant` types and rows; `source.fights` (its row is #9's); `reached` gates (R5); F1 marks; F7 derived state; R5.5 need text; R8.4's pillar 4 checks | Approved |
| 3 | Resources and caps | Hard | The refined stores and their base caps (K1), which set the bills; `settle` (K3); room (K6); V1, V2, V5 | Approved |
| 4 | Activity slot, rest and away time | Hard | The unit (S4), the stop rule (S5), kept progress (S6), a loss costing time only (S4.2), T1, the pacing ceilings with an empty bank (S11) | Approved |
| 5 | Combat resolver | Hard | F1–F7 and the chain result (C4, C5); C7 monotonicity (N3.4); C9, which this GDD fills | Approved |
| 6 | Forge and proving | Hard | `FOUNDATION_BASE` (S3, U4); S7 and S8; B9, B10, B13; G13.2 (the baseline after the forge) | Approved |
| 7 | Methods | Hard | The route plan (W5) and the opens (W3, W4); H2, H5 | Approved |
| 8 | Crafting route | Soft for the rules, hard for U3 | Each ingredient's recipe, and the refining chain behind the bills. U3, B10 and the real prices for B9 and H5 are checked on it (X3) | Approved 2026-11-21 |

**Downstream (they depend on this system):**

| # | System | Hard or soft | What it needs from this GDD |
|---|---|---|---|
| 8 | Crafting route | Hard | The recipe bands (X2) and the bill price limits (X3) |
| 10 | Tending | Hard | Real route durations to set its ceilings against, and the premium under tending (Open Questions) |
| 11 | Save and run lifecycle | Soft | Nothing to save. Kept progress and marks are #4's and #1's |
| 12 | Content validator | Hard | U1–U5 and their "not evaluated" cases (N12); the X3 generator's inputs |
| 13 | Interface shell | Hard | Route rows: bill, time, creature and exact result; the seven derived states; the Still Deep's ladder (UI Requirements) |
| 14 | Method marks | Soft | Which routes each method closes (N10) |
| 19 | Realm ladder (Alpha) | Soft | N3.4: any Foundation beats every route the unforged cultivator beats |

**Bidirectional consistency.**

- #4 (Interactions row 9 and Dependencies), #5 (Interactions row 9 and Dependencies), #6
  (Interactions row 8–9 and Dependencies) and #7 (Interactions row 9 and Dependencies) already
  list this system. #1 lists it in Interactions row 9 and in Dependencies.
- #3 names "Crafting route; Fight and dungeon routes" in Interactions row 8–9.
- #8, #10 and #12 are undesigned or in design. Each must list "depends on: Fight and dungeon
  routes" when it is written.
- The systems index row #9 lists Activity slot, Combat resolver, Forge and proving and Methods.
  This GDD adds Content records and schema and Resources and caps, whose rows and stores it
  reads directly.

## Tuning Knobs

These are the values this GDD owns. A change to either knob, or to any route's duration, bill or
creature, re-runs U1–U5, #6 B9 and B10, and #7 H5 with the X3 generator.

| Knob | Shipped | Safe range | Too low | Too high | Interacts with |
|---|---|---|---|---|---|
| `PREMIUM_MAX_BP` (N8, U3) | 8,000 | 7,000–9,000 | Below 7,000 the recipe must cost more than 1.43× its fight route. With B10's 2× above it, the bands for EM and CL get narrow, and TP's two routes must be closer than 1.4× | Above 9,000 a fight route saves under 10% of the slot time, too little to read on the clock, so the opened route stops feeling like a reason to fight (pillar 2) | `FIGHTLESS_CEILING_BP` and `FIGHTLESS_SLACK_MS` (#6 B10) set the other edge of every band (X2) |
| `FIRST_INGREDIENT_MS` (N9, U5) | 300,000 | 180,000–420,000 | Below 3 minutes, the bill's gather and refine chain plus the shortest hunt cannot fit | Above 7 minutes, rule 17's "first ingredient within five" is lost | The shortest route's duration and its bill's chain (#8); #4's held breath does not count (an empty bank, #4 S11) |

**Content values, tuned with the X3 generator, never by hand** (as #6 S9 warns):

- the nine route durations (N1). They move B9, H5, U5 and every recipe band at once;
- the six creatures' stats (N4). Only U1 and the shown Life margin depend on them;
- the bill families and amounts (N2.4). Amounts follow base caps exactly (U2).

**Fixed by design, not tuned:**

- one fight per route, one ingredient out and one bill in (N2, U2);
- the challenger is the unforged cultivator (N3, U4);
- the floor order EM, CL, TP and the floor gates (N6);
- which method opens which route (#7 W5).

**Knobs owned elsewhere that this system feels:**

- `SPEED_BASE` (#5): a creature's strike rate.
- `FOUNDATION_BASE` (#6): the unforged cultivator's stats through U4. A change re-runs U1 on every
  creature.
- `FIGHTLESS_CEILING_BP`, `FIGHTLESS_SLACK_MS` (#6): the top of each recipe band.
- `OVERGATHER_RATIO_BP`, `OVERGATHER_MIN_MS`, `OVERGATHER_MAX_MS` (#6 B9): under Still Water,
  the Fox Hunt alone must cover them (X3).
- `BANK_CAP` (#4): how much held breath can speed the first routes after a slow commit.

## Visual/Audio Requirements

This system draws nothing itself. Its events need the feedback below, stated as requirements on
the Interface shell (#13), Method marks (#14) and the Forge screen (#15). No art bible exists
yet, so the concept's Visual Identity Anchor is the binding direction.

**Events and their feedback:**

| Event | Requirement | Owner |
|---|---|---|
| Route preview (before a Start) | On the row: the verdict word with a neutral glyph; the Life kept as a number with its base ("keeps 19 of 100 Life"); then the decider in stat terms ("outlasted"). The four-stat breakdown opens on tap (rule 97). The verdict carries no hue | #13, #14 |
| A unit won | The row changes state in place, in the frame of the completion. No toast, no popup, no fight playback (#5 Visual/Audio) | #13 |
| A floor opens | The sealed row shows its condition beforehand ("opens once Ember Marrow has been held"). Its glyph changes when it opens and stays changed | #13 |
| An ingredient arrives | The held mark updates in #13's persistent context and in #15's ingredient list, with one log line. This system adds no forge event | #13, #15 |
| A route closed by the method | The row stays, named, with a closed glyph and "Opens under {method}". Under Ember Breath the Still Deep is one closed row, not three | #14 |
| Away completions | One summary line per return, never one line per unit | #13 |

**Depth without animation.** The Still Deep must read as a ladder and the hunts as peers:

- Hunts are peer rows with no numerals and nothing linking them.
- The Still Deep is one block, with a continuous rail on its left edge (the concept's "channel"
  lines) and the numerals I, II and III.
  - A sealed gate is a visible break in the rail, with its own glyph.
  - The depth glyph repeats once, twice or three times, in a neutral shape family distinct from
    the method glyphs.
- Depth never fades: floor III keeps full contrast. Floors are not indented, so the block fits a
  phone's width later (#17).
- Life kept is a number first. A bar of its length is optional.

**Principles that apply** (concept, Visual Identity Anchor):

- Glyph before hue, readable in greyscale.
- No green or red for a win or a loss.
- Only values the method changed carry its tint and glyph (#14). The routes' Life margins and
  prices are content, so they stay unmarked. A closed route carries the closed mark.
- The neutral stone base, with channel lines.

**Distinct shapes for unavailable states.** Closed (by the method), Sealed (a gate), Short (the
bill) and Held (the ingredient) are four different reasons. Each needs its own glyph, because hue
cannot carry the difference (States and Transitions).

**Audio:** none. Audio has no system until the art bible asks for one (systems index).

*Specialist: `art-director` consulted. Its requirements are adopted as written. It flagged four
attention-tax risks, which are ruled out above: dismissable "new" badges, popups when a floor
opens, any timed reveal of a fight, and one log line per away unit.*

> 📌 **Asset Spec** — Visual/Audio requirements are defined. After the art bible is approved, run
> `/asset-spec system:fight-and-dungeon-routes` to produce per-asset visual descriptions from this
> section (the route glyphs, the Still Deep's rail and depth glyph, the four unavailable-state
> glyphs).

## Game Feel

- **Known before chosen.** Every route row shows its exact result before the Start. Nothing a
  route does can surprise the player, and nothing rewards watching it (pillar 4).
- **Instant at completion.** A route's fight resolves in the frame of its unit's completion. Its
  cost is a fixed handful of integer operations (#5 Game Feel), and the row changes state in that
  frame.
- **Weight from time and margin, not from motion.** A hunt feels heavy because of its minutes and
  its bill. A deep floor feels deep because of its thin margin, 19 of 100 Life, and its place at
  the bottom of the ladder. No feel comes from animation.
- **Pace** (provisional content, X3):
  - Routes run 3 to 15 minutes a unit. A forge's four ingredients take 21–24 minutes of untended
    slot time, and all six take 30–48 minutes. That fits the concept's 30–60-minute session with
    one forge.
  - The first ingredient is in hand within 4 minutes of the commit (U5).
  - Between routes, the 30-second loop of gathering and refining (#8) fills the stores the next
    bill needs.
- **The descent is felt at the commit.** On the method-choice screen, Ember Breath shows six
  flat rows and Still Water a ladder of three (rule 73). The difference is visible before any
  play.
- **Budget.** The rules core spends nothing of its own here: a route unit is #4's unit plus one
  #5 call. U1–U5 run at build time, and U1 is six fights.

## UI Requirements

This system has no screen of its own. Its routes appear among the sources in the Interface
shell (#13). Requirements on the screens that show them:

1. **A route row** shows, without a tap:
   - its name;
   - the ingredient it pays;
   - its bill, against what is held;
   - its duration in #13's format;
   - its exact result, from #5's UI requirement 1: the verdict, and the Life kept with its base.

   Its creature, the four stats on each side and the decider open on tap (rule 33's one tooltip
   schema, rule 97's breakdown). There is no hover-only content (MVP item 8).
2. **State before action.** A row in Closed, Sealed, Short or Held shows why, in #1's generated
   words or #4's refusal text (States and Transitions), with that state's own glyph. A Start is
   offered only in Ready.
3. **The Still Deep is one block** under Still Water, with floors I, II and III in order, so
   that the ladder and its gates read at a glance. Under Ember Breath it is one closed row.
4. **Before the commit**, the method-choice view lists each method's routes by name. Ember
   Breath shows three opened hunts; Still Water shows the Still Deep's three floors (`methods.md`
   W7.1). Every row reads "Needs a method committed" (#1 R5.5).
5. **After a won unit**, the row moves to Held (or Short) in place. The ingredient's arrival is
   one log line (Visual/Audio).
6. **Phone width** (a constraint from the MVP, a deliverable at #17): no indentation for depth,
   and the row's always-visible content must fit one 390 px line plus one wrapped line. Wrap; never
   truncate (as #7 Edge Cases asks of names).

> **📌 UX Flag — Fight and dungeon routes**: this system has UI requirements. In Pre-Production,
> the Interface shell's UX spec (`/ux-design`, #13) must cover the route rows, the seven states and
> their glyphs, and the Still Deep's ladder before epics are written. Stories that touch route rows
> cite `design/ux/[screen].md`, not this GDD.

## Cross-References

| This document references | Section there | What it relies on | Status |
|---|---|---|---|
| Game concept | Mechanic 3; MVP item 3; Flow State Design ("first ingredient within five") | Three gathering routes; fight routes pay a premium over crafting; rule 17's density | Approved |
| Systems index | Row #9 and its paragraph | Single fights and one dungeon of three floors; leaving keeps progress. The paragraph's "Methods add and remove these routes" is out of date: methods only open (`methods.md` W3), and this GDD's index update rewrites it | Approved; paragraph updated with this GDD |
| Content records and schema (#1) | R1 ("a dungeon floor has one"); R4 rows `source.*`, `combatant.stats`; R5 gates; F1; F7; R8.4; Interactions row 9 | Source and combatant shape; floors chained by `reached` on floor outputs; monotone gates; need text | Approved |
| Resources and caps (#3) | K1 refined stores; K2.3; K3; V1, V2, V5; Cross-system note on the first ingredient | Bills of half a store; ingredient cap 1; settle; the first ingredient is the routes' target | Approved; K1's refined caps accepted as they are |
| Activity slot (#4) | S1, S4–S7, S11 (T1, T2, pacing ceilings), Edge Cases; Open Questions 5 and 6 | Units, stops, kept progress, a loss as time only; T2; ceilings with an empty bank | Approved; Open Question 5 marked resolved and 6 answered for routes (amendment A1) |
| Combat resolver (#5) | C2, C4, C5, C7, C9, F1–F7; UI Requirements 1; Open Questions 2 and 4 | The fight and its exact result; the baseline this GDD names | Approved; Open Questions 2 and 4 marked resolved (amendment A1) |
| Forge and proving (#6) | S3 `FOUNDATION_BASE`; S7; S8; S9; B9, B10, B11, B13; G13.2, G13.5; Open Question 1 | Prices and gathering time; the over-gathering and fightless checks; the baseline after the forge | Approved; Open Question 1's route half answered and S9's stub column superseded (amendment A1) |
| Methods (#7) | W3, W4, W5, W6, W7.3, Y1, Y3, Y4, H2, H5; Open Questions 2 and 3 | The route plan and opens; route counts; H5's test | Approved; Open Questions 2 and 3 answered (amendment A1) |
| Crafting route (#8) | Recipes and the refining chain | Recipe prices inside X2's bands; bill prices inside X3's limits | Approved 2026-11-21; recipes and bills checked against X2 and X3 |
| Design rules | 2, 17, 18, 27, 49, 51, 70, 71, 73, 74 (`research/arcanum-reference/12-design-rules.md`, `research/hundred-days-reference/06-design-rules.md`) | Visibility ≠ actionability (2); first ingredient density (17); bills against caps (18); floors and kept progress (27); N-of-M lets a build skip the dungeon (49); reachability must be checked (51, U1); flavour on the mechanic (70); identity where the numbers live (71); a closing fork differs inside its stage (73); no slot that content cannot fill (74, U1) | Reference |

**Divergences from *copy* rules, stated:**

- **Rule 27** ("bosses reset") is not used: the MVP has no clash or boss.
- **Rule 27** ("death costs time only") is kept by #4 S4.2. No death can happen in shipped content
  (U1).
- **Rule 18** is met by recipes, not by fight routes. A fight bill is half a store, below V2's 70%
  floor, so that a hunt can pay a premium over the craft while the store's largest bill stays a
  recipe's (N2.3).

## Acceptance Criteria

**Conventions:**

- **S** is the shipped content.
- **Fx** is a test fixture.
- The **stub chain** prices every refined bill at 44 s (X3) until #8's chain exists.
- **Creature X** is {might 40, guard 30, vigor 200, speed 100}. The unforged cultivator loses to
  it with a score of 800, as the X3 generator confirmed.
- Tags:
  - [unit] is the rules core alone;
  - [validator] runs the check, S passes and the named change fails;
  - [integration with #N] crosses a system;
  - [review] is checked by a reader.

### Rules

- **AC-N1-1** [validator, S] **GIVEN** the shipped content, **WHEN** it is loaded, **THEN**:
  - the nine route sources match N1's table in what they pay, their bill, duration, creature and
    gate;
  - only the three shared hunts are authored enabled, and none has `reveal`;
  - every name is at most 24 code points;
  - each ingredient's hunt and floor spend the same bill (oil for EJ and EM, plank for IH and
    CL, jade blank for GM and TP), and every creature's speed is at most 100.

  N12 leaves the last two unchecked, so this snapshot is their guard.
- **AC-N3-1** [unit, Fx] **GIVEN** reads of the Foundation, the method and the held items stubbed
  to throw, **WHEN** a route unit completes before the forge and again after it, **THEN** each
  fight resolves with `unforged` as the challenger and the route's creature as the only opponent,
  and no stub is called.
- **AC-N3-2** [unit, Fx] **GIVEN** Foundations whose effective values are each from 0 to 5,
  **WHEN** each fights the six creatures, **THEN** every fight is won (#5 C7, N3.4).
- **AC-N4-1** [unit, S] **GIVEN** `unforged` and each creature, **WHEN** resolved, **THEN** every
  fight is won, keeping 60, 52, 61, 68, 46 and 19 of 100 Life in N4's order, and each win
  survives a raise of 3 to any one creature stat.
- **AC-N5-1** [integration with #4, S] **GIVEN**, one at a time, no method committed; Still Water
  committed with 2 Jade Blank held; and Ghost Moss held, **WHEN** the Fox Hunt is started,
  **THEN**:
  - it is refused with exactly "Needs a method committed", "Needs Jade Blank ×4 (2 more)" and
    "Ghost Moss is already held";
  - nothing is spent;
  - in the first case, all nine routes are still listed.
- **AC-N6-1** [integration with #1, #6, Fx] **GIVEN** Still Water:
  - **WHEN** Ember Marrow is held from floor I and later spent by the forge, **THEN** floor II
    stays open;
  - **WHEN** Ember Marrow is crafted first, **THEN** floor I refuses "Ember Marrow is already
    held" and floor II is open;
  - **WHEN** a part-run floor is switched away from and back, **THEN** it resumes at the same
    progress.
- **AC-N6-2** [validator, S] **GIVEN** the shipped content, **WHEN** loaded, **THEN** floor I has
  no `need`, floors II and III have exactly `reached(ember_marrow, 1)` and `reached(cloud_lotus,
  1)`, and the three floors are enabled in Still Water's set only.
- **AC-N10-1** [unit, S] **GIVEN** both frozen sets, **WHEN** compared, **THEN** the route sources
  differ only in `enabled`, on six routes: three Ember Breath hunts and three floors.
- **AC-N11-1** [integration with #4] **GIVEN** each of a Sealed floor, a floor under Ember
  Breath, a route whose ingredient is held, and a second route while one runs, **WHEN** started,
  **THEN** the first three are refused with nothing spent, and the last replaces the running
  route with its progress kept (#4 S3.1). No action other than `start` and `stop` touches a route.
- **AC-ST-1** [unit, Fx] **GIVEN** one fixture per state, **WHEN** derived, **THEN** the state is
  tested in the order Waiting, Closed, Sealed, Short, Held, Ready, Running. A floor that is both
  Sealed and Short reads Sealed.
- N2 is covered by AC-U2-1, N7 by AC-I4-1 and AC-I4-2, N8 by AC-X2-1 and AC-U3-1, N9 by AC-U5-1.

### Formulas

- **AC-X1-1** [unit, S, stub chain] **GIVEN** the shipped routes, **WHEN** priced by #6 S8,
  **THEN** the hunts cost 224, 254, 554, 254, 674 and 944 s (Pangolin, Bear, Fox, Salamander,
  Heron, Crab), and floors I, II and III cost 254, 508 and 762 s. **GIVEN** a refining source of
  output 4 and a bill of 6, **THEN** the bill prices two units of that source.
- **AC-X1-2** [validator, Fx] **GIVEN** an Ember Marrow recipe of 100 s, **WHEN** U3 runs under
  Still Water, **THEN** it fails, naming Still Deep I first. Floors II and III are re-priced from
  the recipe, and any of their failures read "follows from" floor I.
- **AC-X2-1** [unit] **GIVEN** the Heron Hunt at 674,000 ms, **WHEN** tested against a Cloud Lotus
  recipe of 842,500 ms, then 842,499 ms, then 674,000 ms, **THEN** pass, fail and fail.
  **GIVEN** the shipped routes, **THEN** the bands are EJ 280–448 s, IH and EM 317.5–508 s, CL
  842.5–1,016 s, GM 692.5–1,108 s and TP 1,180–1,524 s. **GIVEN** an ingredient whose two fight
  routes cost 600 s and 1,000 s, **THEN** its band is reported empty.
- **AC-X3-1** [validator, Fx, stub chain] **GIVEN** bill prices for oil, plank and jade blank,
  **WHEN** U5, B9, H5 and the bands run, **THEN**:
  - 120/120/120 and 120/120/40 pass all;
  - 130/90/60 passes U5 through the Bear Hunt at 300,000 ms;
  - 130/91/60 fails U5 only;
  - 120/120/10 fails Still Water's B9 only (ratio 1.344);
  - 0/0/120 fails Ember Breath's H5 only (margin 0).

### Checks

Each [validator]: S passes, and the named change fails.

- **AC-U1-1** **GIVEN** creature X on the Fox Hunt (enabled), and separately on Still Deep II
  (disabled under Ember Breath), **THEN** U1 fails, naming the source. **GIVEN** #5's last-strike
  tie fixture as a route, **THEN** U1 passes.
- **AC-U1-2** *(not evaluated)* **GIVEN** no `unforged` record, **THEN** U4 fails and U1 reports
  "not evaluated: no challenger" for every source. **GIVEN** `unforged` with might 21, **THEN** U4
  fails and U1 reports "not evaluated", never a pass.
- **AC-U2-1** Each of these fails:
  - two fights;
  - two outputs;
  - an output amount of 2;
  - two inputs;
  - an ingredient as the bill;
  - a key item as the bill;
  - Rendered Oil ×5 or ×7;
  - Jade Blank ×3.
- **AC-U3-1** *(stub recipes, until #8)* **GIVEN** stub recipes EJ 300, IH 400, EM 400, CL 900,
  GM 800 and TP 1,300 s, **THEN** U3 passes under both methods. A Cloud Lotus recipe of 800 s
  fails U3 under Ember Breath. One of 1,100 s passes U3 and fails #6 B10 under Still Water.
- **AC-U3-2** *(not evaluated)* **GIVEN** the shipped routes and no recipes, **THEN** U3 reports
  "not evaluated" for each ingredient, with neither pass nor fail. #1 R8.4 check 2 reports the
  cause.
- **AC-U4-1** **GIVEN** `unforged` with speed 10, and separately `FOUNDATION_BASE` might 22 with
  `unforged` unchanged, **THEN** U4 fails.
- **AC-U5-1** **GIVEN** S on the stub chain, **THEN** U5 passes under both methods on the
  Pangolin Hunt at 224 s, and a full rest bank changes nothing (#4 S11). The boundary is in
  AC-X3-1.

### Integration

- **AC-I4-1** [integration with #3, #4] **GIVEN** Ember Breath committed, oil base cap 12 and the
  Pangolin Hunt running:
  - **WHEN** 180,000 ms pass with 12 oil held, **THEN** one fight resolves at that completion,
    one settle leaves oil 6 and Echo Jade 1, and the run stops `full`;
  - **WHEN** the same happens with 6 oil held, **THEN** oil is 0 and the run stops `inputs`;
  - **WHEN** the same happens across an 8-hour absence, **THEN** the state is identical to a live
    run.
- **AC-I4-2** [integration with #4, Fx] **GIVEN** creature X on the Pangolin Hunt, loaded without
  the Validator, **WHEN** the unit completes, **THEN**:
  - no settle runs, and oil and Echo Jade are unchanged;
  - the progress is 0, the run stops `lost`, and `fightLost` fires once;
  - the route is Ready.
- **AC-I5-1** [integration with #5] **GIVEN** a spy on the resolver, **WHEN** a route unit
  completes, **THEN** it is called once with `unforged`, the route's creature and #5 F1 Life. No
  route code computes F1–F7 itself.
- **AC-I6-1** [integration with #6, S, stub chain] **GIVEN** the Validator's S7, **THEN**:
  - Ember Breath gives T_best 1,406 s, T_min 1,286 s and T_all 2,904 s;
  - Still Water gives 1,240 s, 986 s and 1,794 s;
  - B9 passes at 2.07 with 1,498 s, and at 1.45 with 554 s.

  **GIVEN** a route whose bill is Cloud Lotus, **THEN** B13 fails.
- **AC-I7-1** [integration with #7, S] **GIVEN** the stub chain, **THEN** H5 passes with margins
  of 120 s and 254 s. Once #8's recipes exist, `routes(i, m)` is 2 for all 12 pairs.
- **AC-I13-1** [integration with #13, UI] **GIVEN** each of the seven states, **THEN**:
  - the route row shows the name, the ingredient, the bill against what is held, the duration,
    and the Life kept with its base (the Heron Hunt: "keeps 46 of 100 Life");
  - each unavailable state has a distinct glyph, and a Start appears only in Ready;
  - Still Water shows the Still Deep as one block of three floors, and Ember Breath as one
    closed row;
  - at 390 px the row is one line plus one wrapped line, never truncated.

  **Evidence:** screenshots of all seven states at 390 px and at desktop width, kept with the
  story. They block the UI story.

### Checked by review, not by test

- Tone and flavour: creature names and profiles, "Opens under {method}", the arrival log line,
  and the Player Fantasy's descent.
- Whether the 80% premium reads on the slot clock. Whether "deeper is thinner" reads from the
  margins. Whether the first ingredient feels like five minutes. These are first-playtest
  questions.
- Glyph legibility in greyscale (#14).
- **Not testable as written, by design:**
  - N2.3's "never without its big sink" follows from #3 V2 and U2;
  - N6.3's "nothing to reset" describes an absence.

*Specialist: `qa-lead` drafted these criteria. Its derived fixtures were confirmed with the X3
generator before writing. That moved one fixture: "plank 90" needs a jade price inside the 80 s
spread, or B9 also fails. It flagged three items for the Validator (#12), carried to Open
Questions: the exit status of "not evaluated", the archived attempt's 180 s action cap, and the
unchecked content facts.*

## Open Questions

**Questions from other GDDs, answered or handed on here:**

| Question | Answer | Status |
|---|---|---|
| #5 Open Question 2: is a fight source its challenger cannot win a validator error? | Yes. U1, on `checked`, enabled or not (N12) | Resolved by this GDD |
| #7 Open Question 2: make "the baseline loses a fight of an enabled source" a validator error | Yes, and wider: U1 covers disabled sources too, because each is open under the other method | Resolved by this GDD |
| #5 Open Question 4 (with #4): does a lost unit consume its inputs, or only its time? | Only its time. #4 S4.2 decided it: nothing is paid, the bill stays held, progress is zeroed. N7.3 confirms it for routes. U1 makes it moot in shipped content | Resolved (#4, confirmed here) |
| #4 Open Question 5 (with #6): do route fights read the Foundation after the forge? | No. #6 G13.2 decided it, and N3 names the challenger: the unforged cultivator, before and after the forge | Resolved (#6, confirmed here) |
| #4 Open Question 6 (with #8): an ingredient output with a by-product, error or warning? | #9's half: no fight route has a by-product (U2, an error), so T2 never fires on a route. #9 recommends T2 become an error for recipes too, since S7 and S8 credit no by-product and S5.3 lets one pay only once. #8's X6 makes a recipe with a by-product an error | Resolved (#8's X6) |
| #6 Open Question 1, the route half: do real routes pass B9, B10 and B13? | B13 passes: every bill is a refined resource (U2). B9 passes on X3's table under both methods (2.07 with 1,498 s; 1.45 with 554 s). On #8's real bills and recipes, B9 and B10 pass too (X3, "On #8's real bills") | Resolved with #8 |
| #7 Open Question 3 (with #8): does H5 pass on real times? | Yes on this GDD's routes. Under U3, S7 times only fight routes, and X3 shows margins of 120 s (EB) and 254 s (SW). It stays true for any real chain whose bills cost at most 120 s each and within 80 s of each other. #8's chain (60, 70 and 70 s) gives 120 s and 280 s | Resolved with #8 |

**This GDD's open questions:**

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | Resolved 2026-11-21 by #8 (`crafting-route.md` L2, L6): bills at 60, 70 and 70 s are inside X3's limits, and every recipe is inside its band on those bills (X3, "On #8's real bills"). A later change to either GDD re-runs the X3 generator | Crafting route (#8), with this GDD | Done |
| 2 | Resolved 2026-11-21 by #8's X6: a recipe with a by-product is an error, so T2 never fires on an ingredient source | Crafting route (#8) | Done |
| 3 | Tending changes `outputs` and `duration`. Does a tended fight route keep U3's premium over a tended recipe, and are tended route durations still at least 1,000 ms (T1)? Tending's ceilings should be set against N1's durations. Resolved 2026-11-21 by #10 (`tending.md` D1, J3): routes are not tendable, so their durations and T1 are unchanged; only the three hearth gatherers heap, and the validator runs U3 under every tending set (8 in the MVP), so a tended recipe never closes the route premium | Tending (#10) | Done |
| 4 | Validator: (a) what exit status does "not evaluated" give, so that a blocked U3 neither breaks the build before #8 nor reads as a pass? (b) The archived attempt's validator capped every timed action at 180 s. That rule does not bind this game, and eight of N1's nine routes exceed it, so #12 must not inherit it. (c) Should the unchecked content facts (bill families, creature speed, N4.1's +3 margin) become a check? (d) Resolved 2026-11-21 by #6 A2: S7 takes the larger of a `reached(id, n)` atom's demand and the rest of that id's demand, so a floor's gate ingredient is made once, as X3 counts it. #8's L6.4 and AC-J-1 now use the same count | Validator (#12), with Forge and proving (#6) | #12 GDD |
| 5 | Route fights cannot be lost, so the descent's difference from the hunts is its order, its prices and its thinner margins. Does it read as a different way to gather (rule 73), or as recipes in costume (`game-designer`'s risk)? | Designer | First MVP playtest |
| 6 | The producer's candidate cut order reduces the dungeon to one floor. That would remove the pearl's descent, which carries Still Water's H5 margin (N6.5), and would change W5. If that cut is ever taken, re-run H5 and B9 first | Designer, with Methods (#7) | Only if the cut is taken |
| 7 | A boss floor at the vertical slice could use a chain of fights (#5 C5), which U2 forbids today. Does it reset (rule 27), and how does U1 read it? | Designer | Vertical Slice |
| 8 | After the forge, routes pay ingredients this realm can no longer use (#6 G13.5). Should a forged realm's routes say so, or close? Display half resolved 2026-11-21 by #13 (`design/ux/interface-shell.md`, C13): the road says so in one line, and the routes keep running. Whether they should close is Reforge's | Interface shell (#13); Reforge (#16) | #13 done; #16 for closing |

**ADRs required** (representation this GDD leaves out):

1. The Validator's report format for U1–U5, including "not evaluated" and "follows from". It
   extends #1's ADR 8, #6's ADR 3 and #7's ADR 2.
2. The X3 route-table generator: it is built from the same functions as #6's case-table builder
   (#6 ADR 4) and the Validator's S7, never a second implementation. This script's arithmetic is
   the test oracle only.
