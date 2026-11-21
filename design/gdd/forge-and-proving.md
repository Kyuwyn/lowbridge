# Forge and Proving

> **Status**: Approved 2026-11-20 (lean review; recommended follow-ups in `design/gdd/reviews/forge-and-proving-review-log.md`)
> **Author**: designer + Claude (`/design-system`)
> **Last Updated**: 2026-11-20
> **Last Verified**: 2026-11-20
> **Implements Pillar**: 1 (The forge is the milestone) and 3 (The build is a problem); supports 4 (No dead ends, no attention tax)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-20 (two advisories applied: Player Fantasy promise 2 worded to what B2 guarantees; UI Requirements item 8 on player-facing words)

## Summary

Forge and proving ends a realm. The player forges four of the realm's six ingredients into a
Foundation. Three proving fights on the combat resolver then measure it at 0–6 seals, and the
Foundation's affinities widen the stores. Ingredients clash in opposed pairs, seals show only for
makeups the player holds, and no makeup is best under both methods. Finding the best four is
therefore the game's central problem (pillars 1 and 3), and nothing in it can strand a run
(pillar 4).

> **Quick reference** — Layer: `Feature` · Priority: `MVP` · Key deps: `Content records and schema, Modifier pipeline and recompute, Resources and caps, Combat resolver`

## Overview

Forge and proving is where a realm ends. The player chooses a **makeup**: exactly N distinct
ingredients out of the realm's M (four of six in the MVP, rules 12 and 49). Forging is one
explicit step outside the activity slot. It consumes those four ingredients and fixes the
**Foundation** for good: its affinity totals, its four fighting stats and its cap raises. In the
same step it runs one **proving fight** per door of the next realm, the Foundation against that
door's opponent on the combat resolver (#5). Each fight's score puts its door at a tier (shut 0,
open 1, wide open 2). The tiers add up to the Foundation's measure, **0–6 seals**.

The system has a data side and a player side.

- **Data.** It owns the meaning of the `ingredient`, `affinity`, `door` and `realm` records
  (#1 R1). It also owns the pure functions the rest of the game calls (G1), among them
  `foundationStats`, `seals`, `preview` and `bestSeals`. It owns the proving contract the resolver serves, and
  the Foundation entry list the modifier pipeline applies to caps (#2 P4, #3 K7). Everything it
  computes reads content and the makeup only, so the same makeup under the same method always
  gives the same Foundation and the same seals.
- **Player.** It owns the rules that make the choice a problem (pillar 3). The forge screen shows
  what each held ingredient contributes under the method. It shows a makeup's seals only once
  every ingredient in that makeup is in hand. Holding more ingredients than a plan needs costs
  slot time that no forge repays. And no makeup is best under both methods. The trade-off comes
  from how ingredients interact inside the Foundation, never from a scarce budget (concept,
  mechanic 1).

The player is active here, but the decision is one decision made over a whole session: what to
gather next, and which four to forge. The forge itself takes no time and asks nothing more. The
proving fights resolve at once and need no input, because every fight is exact and known before
it runs (#5).

**Why it exists.** Pillar 1 says every realm breakthrough is assembled from chosen ingredients,
and every ingredient changes caps or affinities. Pillar 3 says the best Foundation for a method
is not obvious, and a better one is discoverable. Without this system the game would be an
incremental whose routes pay into a bill.

**What it is not.**

- It has no bill and no lock. This diverges from rule 12, as the concept states.
- It has no randomness, no budget and no clock. The prototype's 9-day budget stranded a run,
  which pillar 4 forbids, and its replacement is a cost that cannot strand (Core Rules).
- It is not a seal formula read off the stats. The doors are proving fights, so each door can
  test a different shape of Foundation through the same resolver.

Alternatives set aside:

- **A breakthrough paid as a resource bill** (Arcanum, rule 12). Pillar 1's design test rejects
  it.
- **A scarce day budget** (the forge prototype). It made sourcing matter, but it stranded a run
  (CD-PLAYTEST concern 4).
- **Seals read directly from stat thresholds** (the prototype's door rule). It is cheaper, but
  every door then tests a sum, and the doors cannot reward different shapes of Foundation the way
  a fight's might, guard, vigor and speed do.

This GDD states rules, invariants, formulas and acceptance criteria. The forge snapshot's
encoding, the function signatures and the result types go to ADRs (Open Questions).

## Player Fantasy

**Framing: both.** The player composes the makeup directly. The Foundation's stats and the
proving fights are machinery underneath, felt as results.

**The harmony problem.** Four ingredients and a method are a composition. Under circulation
they either sit in accord or fight each other, and finding the four that sing together is a
puzzle the player reaches for. The emotion is the itch of a near-right answer: a better
Foundation can be seen from where the player stands, and the next ingredient to gather is the
step toward it. The forge prototype's tester called planning a "puzzle" that was "nice" to think
through, and that is the feeling this system must keep. Pillar 3 asks for the same thing: *"The
best Foundation for a method is not obvious, and a better one is discoverable."*

**Anchor moment.** The player holds three ingredients of a plan and is about to gather the
fourth. The forge screen shows what the three contribute under the method, and that the one they
meant to fetch next would clash with the second. The plan changes quietly, before any seal is
shown.

**Tone.** The words are temper, clash, accord, grain and circulation, together with the furnace,
the ingredient, the door and the seal. Never stat, total or score.

**Where it sits.** The approved fantasies cover the moments around this one:

- #1, "The plan holds": the rules stay still while the player reasons.
- #3: the stores widen after the forge.
- #5, "The Foundation proves itself": the verdict after the forge is honest, not a roll.

This fantasy lives before and during the forge, in the composing hand. It does not touch the
routes, which are #5's "The road is known".

**What the fantasy obliges this system to guarantee** (carried into Core Rules and Acceptance
Criteria):

1. Under each method, the best makeup comes from how ingredients interact, never from a plain
   sum. The greedy pick is not the best (balance table).
2. At least one ingredient's role swaps between the methods: it is in one method's best makeup
   and left out of the other's. B2 implies it, since two different makeups of four each leave
   out an ingredient the other holds.
3. Before a makeup is complete, the forge screen can show how the held ingredients interact (each
   one's contribution under the method and the clashes among them). It never shows a seal for a
   makeup with an ingredient not in hand.
4. A better Foundation is discoverable. The player can see that headroom exists without being
   told which makeup holds it. This system supplies the number, and the forge screen (#15) owns
   the signal (CD-PLAYTEST concern 2).
5. The two methods share no best makeup.

Two framings were set aside:

- **"The signed breakthrough"** (authorship, the Foundation as a made object). It lives after
  the forge, where #5's fantasy already stands.
- **"A different cultivator under a different method"** (identity across runs). It is the best
  successor once reforge (#16) exists, and promise 2 keeps its seed.

*Specialist: `creative-director` consulted (three framings; recommended "The harmony problem",
adopted).*

## Detailed Design

### Core Rules

Notation:

- A **makeup** is a set of ingredient ids.
- `set_m` is method m's frozen content set (#1 R8.1). Every number this system reads comes from
  it, so "under the method" always means "read from `set_m`".
- Formulas S1–S8 are in Formulas. Checks B1–B13 are in G14.
- **Orders.** "Id order" is UTF-16 code-unit order, as in #1 R8.3. "Stat order" is `might`,
  `guard`, `vigor`, `speed` (#5 C1).

#### G1. The forge API

The systems index asks for this section first. Every rule below is one of these functions or uses
them. Each function is **pure**: it reads only its arguments and `set_m`, never game state, the
clock, caps or tending, and equal arguments give equal results. The forge screen, the validator
and the forge itself call the same functions, and none has a second implementation (TD finding 1).

| Function | Returns | Rule, formula |
|---|---|---|
| `foundationStats(set, m)` | each affinity's total and effective value, and the four stats `might`, `guard`, `vigor`, `speed`, for a makeup or any part of one | G5; S1–S3 |
| `foundationEntries(makeup, m)` | the Foundation entry list `F` that #2's Foundation stage applies | G11; S6 |
| `doorTier(score, thresholds)` | 0 shut, 1 open, 2 wide open | G6; S4 |
| `seals(makeup, m)` | each door's score and tier, and their total, 0–6 | G6; S5 |
| `previewable(makeup, held)` | true when every ingredient of the makeup is held | G7 |
| `preview(plan, held, m)` | everything the forge screen may show for a plan: the held part's `foundationStats`; for each unheld ingredient its name and the method's patch deltas only; and `seals` only when the plan is a previewable makeup | G7 |
| `bestSeals(m)` | the most seals any makeup of the realm earns under m | G7; S5 |

- `foundationStats` takes 1 to N distinct ids of `realm.ingredients`, so the forge screen can
  show the held part of a plan (G7.3). `preview` takes 0 to N such ids. Every other function
  takes a makeup: exactly N such ids.
- A wrong argument (the wrong size, an id twice, or an id not in `realm.ingredients`) throws a
  `RangeError`. Callers never pass one, and content cannot cause one. A caller holding ids from
  an older content version drops the unknown ones first (Edge Cases).
- `held` is #3's held map (K2). `previewable` reads nothing else from state.
- Signatures and result types go to an ADR.

#### G2. The records this system owns

These are the meanings behind #1's `ingredient`, `affinity`, `door` and `realm` rows (#1 R1, R4).

| Type | MVP count | Fields this system reads |
|---|---|---|
| `ingredient` | 6 | `contrib`: one value per affinity, in stat points, changed only by the method stage |
| `affinity` | 4 (G3) | `name`; `widens`, the stores it widens (G11; amendment A4 to #1) |
| `door` | 3 | `opponent`, a combatant; `thresholds`, [open, wide], each 10,000–20,000 (A4) |
| `realm` | 1 | `ingredients` (M = 6), `makeupSize` (N = 4), `doors` (proving and display order) |

**Ingredients have no counts** (closes #1 Open Question 2 and #3 Open Question 2). `held` is 0
or 1 and `INGREDIENT_HELD_MAX` stays 1. A makeup is a set of distinct ingredients, and nothing
else reads an amount, so a count would add a cap row and three checks for nothing.

#### G3. Affinities are the four fighting stats

1. The realm has exactly one affinity record for each name in #5's stat-name list, and that
   record's id is the name. A `contrib` key is therefore a stat, and no mapping table exists. The
   names are provisional, owned here and free to change:

   | id (stat) | Name | Element | Widens (G11, provisional) |
   |---|---|---|---|
   | `might` | Cinder | fire | `ash_tallow`, `rendered_oil` (fuel) |
   | `guard` | Jade | stone | `rough_jade`, `jade_blank` (stone) |
   | `vigor` | Bark | wood | `ironbark_log`, `seasoned_plank` (timber) |
   | `speed` | Gale | wind | — |

2. **Two opposed pairs** (designer, 2026-11-20). Cinder opposes Bark (might against vigor: fire
   burns wood), and Jade opposes Gale (guard against speed: heavy against light). An affinity
   loses half of its opposite's total (S2, `CLASH_BP` 5,000). Affinities in different pairs never
   clash.
3. The pairs are a rule of this GDD over stat names, not data. Changing them is a change to this
   GDD.

Why a clash: it is the interaction that makes the forge a problem (pillar 3; the concept's
"affinity clashes"). Totals stop adding up, so the question becomes which four belong together,
not which four are largest. A method can break a clash, or deepen one, with an ordinary
`contrib` patch: `set` one side to 0, or `add` to it. That is how the two methods make two
different problems (pillar 2).

Set aside:

- **Diminishing returns past a knee.** It is easy to read, but a greedy pick by marginal value
  solves it.
- **A weight table from affinities to stats.** It is richer, but a door can no longer be read as
  "needs Jade".
- **Pair records**, as in the prototype's Kindling and Opposed. They are not in the schema, and in
  the prototype they were content written as code.

#### G4. The makeup and the plan

1. A makeup is exactly `realm.makeupSize` distinct ids from `realm.ingredients`: 4 of 6 in the
   MVP, so 15 makeups. Order never matters.
2. On the forge screen the player builds a **plan**: a makeup that may include ingredients not
   yet held. A plan is for reasoning. The rules read it only through `previewable` and the forge
   (G8). It is not rules state; the forge screen (#15) may keep it.

#### G5. The Foundation

`foundationStats(makeup, m)` builds the Foundation in three steps:

1. Each affinity's **total** is the sum of the makeup's `contrib` values for it in `set_m` (S1).
2. Each affinity's **effective value** is its total less half its opposite's total, never below 0
   (S2).
3. Each stat is its base (`FOUNDATION_BASE`) plus its affinity's effective value, at most
   1,000,000 (S3).

It reads `contrib` after the method stage only. No Foundation or tending entry can reach
`contrib`, because its registry row lists only `method` (#1 R4). The proving input is therefore
exactly "the Foundation and the method" (concept, mechanic 1).

#### G6. Proving and seals

1. Proving makes one resolver call per door, in `realm.doors` order. The challenger is the
   Foundation's four stats, with its Life from #5 F1. The only opponent is `door.opponent`. This
   is the whole proving contract that #5 C10 leaves to this GDD.
2. A door's **tier** is `doorTier(score, thresholds)`: 0 below the first threshold, 1 from the
   first, and 2 from the second (S4). Thresholds lie in 10,000–20,000, so a door never opens on a
   lost fight (A4, answering #5 Open Question 1). The MVP's doors use [10,000, 15,000]:
   - **open**: the Foundation won;
   - **wide open**: it won keeping at least half its Life.
3. **Seals** are the sum of the tiers, 0–6 with three doors (S5).
4. Proving reads no cap, held amount, tending choice, carried item or other game state. No seal
   reads a cap, so #3 K8.2 holds trivially. `resource.cap` keeps its `sealInput` tag only as
   #3's conservative choice.
5. Each door's opponent has a different profile. The provisional doors are the Furnace Gate
   (armoured and slow), the Deep Well (deep Life) and the Listening Hall (fast and fragile).
   Which Foundations beat which door is read from the balance table (Formulas), never assumed.
   B6 checks that no makeup is at least as good at every door as every other makeup, so the
   doors cannot all be won by one shape.

#### G7. The preview rule

1. `previewable(makeup, held)` is true when every ingredient in the makeup has `held` 1.
2. The forge screen shows a makeup's door scores, tiers and seals only when it is previewable.
   This is the concept's Preview rule. The method-choice view's deltas (#1 Edge Cases, "Before
   the commit") are outside it. The forge screen shows only what `preview` returns, so the rule
   is a property of a pure function and is tested in the rules core.
3. Before a plan is previewable, the forge screen may show:
   - each held ingredient's `contrib` under the method;
   - for the held part of a plan, `foundationStats` of that part: its totals, its effective
     values and the clashes among them (Player Fantasy, promise 3).

   For an ingredient not in hand, it shows only the name and the method's patch deltas. A base
   contribution is never shown before the ingredient is held (#1).
4. `bestSeals(m)` is a fact about the realm, not any makeup's seals. The forge screen may show it
   as the headroom signal (#15, CD-PLAYTEST concern 2) without breaking the rule.

#### G8. The forge

1. **Forge** is one explicit player action on a plan. It is legal only when a method is
   committed, the realm is not yet forged, and the plan is previewable. Otherwise it is refused
   with the reason in words, for example "Needs Ember Marrow in hand".
2. The confirmation names the four ingredients it consumes and shows the same seals the preview
   showed. It also says that the MVP offers no reforge, only a fast new game (rule 54).
3. On confirm, time is settled first (#4: every action settles before it touches the rules), and
   1 is checked again. If it no longer holds, the forge is refused with the reason and nothing
   changes. Otherwise one atomic step runs:
   1. compute the Foundation, the proving results, the entry list (G5, G6, G11) and the new
      effective set (#2 P9). Nothing has changed yet, so a `ModifierError` here leaves the run
      as it was. The forge then rethrows the error to its caller, which reports it as a bug
      (#13's error report), and emits nothing;
   2. consume the four with one `settle`, 1 in per chosen ingredient and cause `forge` (#3 K3).
      The other held ingredients stay;
   3. store the forge snapshot (G10) and mark the realm forged, so `forged(realm)` is true
      (#1 R5);
   4. install the effective set computed in step 1. The caps widen, and #3 re-clamps and emits
      `capChanged` (K5);
   5. emit `forged`.
4. The forge takes no slot time and runs outside the activity slot. Whatever is running keeps
   running. The forge changes an input, so #4 ends its `advance` segment at the forge (#2 P9.4).
5. Proving needs no input, and a shut door costs nothing. It is a tier of 0, never a penalty
   (rule 27).

#### G9. Consumption and the over-gathering price

The pressure that replaces the prototype's day budget is **priced slot time** (designer,
2026-11-20, answering CD-SYSTEMS):

1. Seals show only for makeups in hand (G7), so comparing makeups means holding them.
2. The forge consumes exactly the four it uses. Any other ingredient gathered for this forge is
   slot time the forge does not repay.
3. Base contributions stay hidden until an ingredient is held, and totals clash (G3). The method
   view's deltas therefore guide the order of gathering but cannot rank makeups. This answers #1
   Open Question 9: the price still holds with deltas shown, and B3 checks it (the plain-sum pick
   is never the best).
4. The price is stated, not assumed. B9 checks it per method: gathering all six takes at least
   1.35 × the time of the best makeup's four, at least 6 minutes more, and at most 60 minutes in
   all (S7). 1.35 sits below the equal-cost point of 6 ÷ 4 = 1.5, so the best makeup may hold a
   dear ingredient. The 6 minutes is a fifth of the 30-minute session floor, and the 60 minutes
   keeps over-gathering a cost, never a wall.
5. It cannot strand a run:
   - after the commit nothing closes;
   - held ingredients are spent only by the forge, because no source lists an ingredient as an
     input (B13, designer 2026-11-20);
   - every ingredient keeps two sources under every method, one fightless within the price
     ceiling (#1 R8.4, G12).

#### G10. The forge snapshot

1. The forge writes one snapshot per realm. It holds:
   - the realm, the method and the makeup (ids in id order);
   - each affinity's total and effective value, and the four stats;
   - each door's score and tier, and the seals;
   - the entry list `F`.
2. It is never rebuilt from content (#2 P4.2). Every later display of the Foundation, its doors and
   its seals reads the snapshot, so a content update never changes a recorded seal. **Foundation
   stats are fixed at forge time**: the designer's provisional answer of 2026-11-19, kept here.
3. Save and run lifecycle (#11) stores it, as non-derived state. It holds no `contrib`, threshold
   or cap, because those come from content.
4. **Stacking.** The snapshot is keyed by realm, so a save can hold one per realm without a format
   change. The MVP has one realm. How a later realm's Foundation composes with an earlier one, for
   caps and for the challenger, is Realm ladder's (#19). Stacked raises would break #3 Q5's
   envelope, so #19 must amend K7 first.

#### G11. Cap raises: the Foundation entries

1. Each affinity lists the stores it widens (`affinity.widens`, A4; G3's table).
2. A store's **widening** is the sum of the effective values of the affinities that list it.
   - If the widening is 0, the store keeps its base cap and gets no entry.
   - Otherwise its cap E rises from #3's lo(b) to hi(b) as the widening rises to `WIDEN_FULL`
     (S6).
3. **One line per ingredient** (designer, 2026-11-20, keeping #3's promise of "one named line
   per ingredient"). The raise E − b is split among the makeup's ingredients by how much each
   puts into the store's affinities (its positive `contrib` on them), by cumulative rounding in
   id order, so the lines add up to E − b exactly (S6). Each line is an `add` entry whose
   `source` is its ingredient (answering #2 Open Question 3). A line that rounds to 0 is
   omitted. #2 P3.3 allows up to 16 `add` entries per value, and a makeup has at most 11.
4. E is therefore always the base cap or inside #3's envelope (K7), by construction. S6 applies
   only to stores with a base cap of 2 or more. An affinity that lists a key item fails B12.
5. Caps follow the Foundation's shape and the method, clashes included. A Cinder-led Foundation
   widens the fuel stores. A Gale-led one widens little, which is part of its price.

#### G12. The fightless price ceiling (pillar 4)

This answers #1 Open Question 12, the ceiling for R8.4 check 3.

- **The check.** Under each method, for every ingredient, the price of its cheapest fightless
  enabled source is at most `max(2 × p, p + 60,000 ms)`. Here p is the price of the ingredient's
  cheapest other enabled source (S8).
- **Price.** A source's price is the untended slot time to make one unit of the ingredient from a
  run start, along its cheapest input chain, counting every unit of every source in the chain
  (S7).
- **Why the cheapest other source.** The ceiling binds against the cheapest other source, not the
  fight the fightless source stands beside. A method may disable or slow that fight, and either
  would loosen the ceiling without anyone noticing. The 60 s slack stops ratio noise on short
  sources.

#### G13. After the forge

The MVP has no second realm, so this is what the forge leaves the player with (CD-SYSTEMS):

1. The stores widen at once, and play continues in the realm under the raised caps. Every source
   keeps working.
2. Route fights keep the baseline combatant (#5 C9) in the MVP (designer, 2026-11-20). The
   Foundation's stats serve proving only. In the full game a realm's route fights use the
   previous realm's Foundation (#19). This answers #5 Open Question 3.
3. The Foundation stays on show: its four affinities, its stats and each door's tier, read from
   the snapshot (#13).
4. Each door's `flavor` names what lies beyond it, and is shown once the realm is forged. This is
   the "locked source" the concept promises past the forge. In the MVP it is text. A real source
   behind a door needs a door-tier atom (#19, #1 Open Question 7).
5. The ingredients not used stay in hand. They belong to this realm, so no other realm's forge
   can use them, and a reforge (#16) consumes afresh. Over-gathering therefore never pre-pays a
   later forge.
6. The fast new game (#11) is how the player tries the other method.

#### G14. Checks owned here (run by the Validator)

The Validator (#12) runs these over the 30 cases (15 makeups × 2 methods), on each method's
frozen set. Each is an error.

- When B1 fails for either method, B2 is not evaluated for both methods, and B3 and B4 are not
  evaluated for the failing method. The report names each check that was not evaluated, because
  they need one best makeup.
- Each check reads the **case table**: each makeup's effective values, door tiers and seals under
  each method, built by G1's functions. A test may pass a case table directly.

| # | Check | Serves |
|---|---|---|
| B1 | Under each method, exactly one makeup earns the most seals: the method's **best makeup** | Pillar 3: a better answer is discoverable |
| B2 | Each method's best makeup earns fewer seals under the other method than `bestSeals` of the other method. So no makeup is best under both methods, and at least one ingredient leads under one method and is left out under the other | Pillar 3; Player Fantasy, promises 2 and 5 |
| B3 | Under each method, the best makeup is not the **plain-sum pick**: the four ingredients with the largest sums of their `contrib` values in `set_m`, ties broken by id | Promise 1; #1 Open Question 9 |
| B4 | **Theme fit.** Under each method, the method patches the `contrib` value of the best makeup's leading affinity (its largest effective value, ties broken in stat order) on at least one ingredient of that makeup, and the best makeup holds at least two ingredients the method patches | CD-PLAYTEST concern 3 |
| B5 | **No slot-filler.** For every ingredient, under some method, there is a makeup holding it in which counting its `contrib` as 0 on every affinity changes some door's tier. This is #1 R8.4's "every ingredient changes at least one seal", defined. A swap test would pass an all-zero ingredient, because its replacement changes the tiers | Pillar 1 |
| B6 | **No dominant makeup.** Under each method, no makeup has a tier at least as high as every other makeup's at every door. This also rules out 6 seals. With one door it cannot hold, so every realm needs at least two | Pillar 3: the doors test different shapes |
| B7 | Under each method, every door opens for some makeup, and every door opens wide for some makeup under some method | Every door is live |
| B8 | **Widening is a choice.** Under each method, every store some affinity widens keeps its base cap under at least one makeup | Pillar 1: caps differ by makeup |
| B9 | **Over-gathering price** (S7), per method: T_all ≥ 1.35 × T_best, T_all − T_best ≥ 360,000 ms, and T_all ≤ 3,600,000 ms. *[blocked: #8, #9]* until real sources exist; the Wave A checkpoint runs it on stub sources | G9 |
| B10 | **Fightless ceiling** (S8, G12). This is #1 R8.4 check 3, which is no longer blocked | Pillar 4 |
| B11 | **Speed.** Every Foundation (all 30 cases) and every door opponent has `speed` ≤ `SPEED_BASE` (100), so one side strikes at most twice as often | #5 "Degenerate builds" |
| B12 | **Affinity set.** Exactly one affinity per stat name, each with its stat name as id (G3). No affinity's `widens` names a key item (a store whose base cap is 1), which S6 would silently skip. In every case, each widened store's S6 product D × C is at most 2⁵³ − 1 | G3; #3 K7; S6 |
| B13 | **Ingredients are spent only by the forge.** No source lists an ingredient in its `inputs`, in the checked content or in either frozen set | G9.5; designer 2026-11-20 |

### States and Transitions

**The realm's forge.** It is derived from the commit and the snapshot. Only the snapshot is saved.

| State | Holds when | The forge screen |
|---|---|---|
| Planning only | No method is committed | Plans can be built. Nothing is held, so nothing is previewable. The method-choice view shows deltas |
| Open | A method is committed and the realm has no snapshot | Previewable plans show seals, and a previewable plan can be forged |
| Forged | The realm has a snapshot | Shows the Foundation and its doors from the snapshot. No forge; reforge is #16's |

| Transition | Trigger | Reversible? |
|---|---|---|
| Planning only → Open | The commit (#7) | Not in the MVP |
| Open → Forged | The forge (G8) | Not in the MVP. Reforge (#16) replaces the snapshot and never drops the realm |
| Any → Planning only | A fast new game (#11) | — |

**A plan.** It is derived, and never saved by the rules.

| State | Holds when |
|---|---|
| Incomplete | Fewer than N ingredients chosen |
| Planned | N chosen, at least one not held |
| Previewable | N chosen, all held |
| Forgeable | Previewable, and the realm is Open |

- A plan moves between these as the player chooses ingredients, and as `held` changes.
- `held` of an ingredient falls only through the forge (B13), so before the forge a previewable
  plan stays previewable.

### Interactions with Other Systems

| # | System | Gives this system | Gets from this system | Interface owner |
|---|---|---|---|---|
| 1 | Content records and schema | The four record types and their rows; `set_m`; `forged` as a gate atom | Values and meanings for its rows; amendment A4 (`affinity.widens`; `door.thresholds` 10,000–20,000); answers to #1 Open Questions 2, 9 and 12 | #1 owns types and rows; this GDD owns their values and meanings |
| 2 | Modifier pipeline | Effective values and trails; the Foundation stage | The entry list `F`, once per forge (P4); `source` = the ingredient (Open Question 3) | #2 applies; this GDD builds `F` |
| 3 | Resources and caps | `held` (K2); `settle` (K3); the envelope lo and hi (Q5) | Consumption as one settle, cause `forge`; entries that obey K7; confirmation of K8.2 (no seal reads a cap) | #3 owns the envelope; this GDD the entries |
| 4 | Activity slot | Segment boundaries | The forge as an input change that ends a segment (P9.4) | #4 |
| 5 | Combat resolver | F7's score per proving fight | The challenger (the Foundation's stats) and one opponent per door; answers to #5 Open Questions 1, 3 and 5 | This GDD owns the proving contract (C10) |
| 7 | Methods | `contrib` patches through `set_m`; the commit | The per-method contribution table's shape and the checks B1–B4 it must pass | #7 fills the table; this GDD owns its checks |
| 8, 9 | Crafting route; Fight and dungeon routes | The sources that make ingredients | The over-gathering price and the fightless ceiling (B9, B10); no ingredient as an input (B13); the baseline stays the route challenger (G13) | Routes own sources; this GDD owns B9, B10 and B13 |
| 11 | Save and run lifecycle | — | The forge snapshot, one per forged realm (G10) | #11 stores it |
| 12 | Validator | — | B1–B13 over the 30 cases; the functions of G1 to call | #12 runs; this GDD defines |
| 13, 14, 15 | Interface shell; Method marks; Forge screen | — | G1's functions; the `forged` event; the preview rule (G7); `bestSeals` for the headroom signal | They own display |
| 16 | Reforge (VS) | A replaced snapshot | G10's snapshot; G13.5 (reforge consumes afresh); which cap a reforge's seals read (none, today) | #16 |
| 19 | Realm ladder (Alpha) | More realms | G10.4 (stacking); G13.2 (the next realm's challenger) | #19 |

**Non-derived state owned:** the forge snapshot, one per forged realm (G10).
**Actions accepted:** `forge(makeup)` (G8).
**Events emitted:** `forged {realm, method, makeup, seals, doors: [{door, score, tier}]}` (G8).
The consumption and the cap changes emit #3's events (`capChanged`), not new ones.

*Specialists consulted: `game-designer` (primary), `systems-designer` and `economy-designer`
(supporting). They split on two points, and the designer decided both on 2026-11-20. The clash
pairs are Cinder–Bark and Jade–Gale (game-designer), not might–guard and vigor–speed. Cap raises
are affinity-shaped (main session), not per-ingredient shares (systems-designer). The designer
also chose priced slot time as the pressure, and the baseline for post-forge route fights.
Feasibility was checked by enumeration: a throwaway search found content meeting B1–B7 for both
clash pairings.*

## Formulas

Every value is an integer, and every division is `div_floor` (#1 F5). `x⁺` means `max(0, x)`.
The resolver's formulas are #5's (F1–F7); `lo(b)` and `hi(b)` are #3's Q5. The examples use the
provisional content of S9, under Ember Breath, for the makeup Echo Jade, Ironbark Heartwood, Ember
Marrow and Cloud Lotus (Ember Breath's best makeup).

### S1. Affinity total

The affinity_total formula is defined as:

`T_a = Σ over i in the makeup of contrib_m[i][a]`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| contrib_m[i][a] | int | −1,000,000–1,000,000 (#1 R4) | data file, after the method stage (`set_m`) | Ingredient i's contribution to affinity a under method m |
| makeup | set of ids | `realm.makeupSize` ids, 2–11 (#1 R4) | player | The chosen ingredients |

**Output Range:** ±11,000,000 at the schema's limits; 0–200 in the MVP content.
**Example:** Cinder (`might`): 40 + 30 + 35 + 25 = 130. Ember Breath adds 10 to Ember Marrow's
base 25. Jade 55, Bark 30, Gale 65.

### S2. Effective affinity (the clash)

The effective_affinity formula is defined as:

`e_a = max(0, T_a⁺ − div_floor(T_opp(a)⁺ × CLASH_BP, 10000))`, where opp pairs `might` with
`vigor` and `guard` with `speed` (G3)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| T_a, T_opp(a) | int | S1 | calculated | The affinity's total and its opposite's |
| CLASH_BP | int | 0–10,000 (shipped 5,000) | constant (tuning knob) | Share of the opposite's total an affinity loses |

**Output Range:** 0 to T_a⁺. Both sides of a pair read the raw totals, so the order of the two
subtractions never matters. A negative total counts as 0 for both sides. The largest product,
11,000,000 × 10,000 = 1.1 × 10¹¹, is a safe integer.
**Example:** Cinder 130 − div_floor(30 × 5000, 10000) = 115. Bark max(0, 30 − 65) = 0. Jade
55 − 32 = 23. Gale 65 − 27 = 38.

### S3. Foundation stat

The foundation_stat formula is defined as:

`stat_a = min(STAT_MAX, FOUNDATION_BASE_a + e_a)`, where each stat a is its affinity (G3)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| e_a | int | S2 | calculated | Effective affinity |
| FOUNDATION_BASE_a | int | 0–1,000,000 each; shipped might 20, guard 10, vigor 100, speed 0 | constant (tuning knob) | The cultivator's own body, before any ingredient |
| STAT_MAX | int | 1,000,000 | constant (#5 C1) | The resolver's stat ceiling |

**Output Range:** FOUNDATION_BASE_a to 1,000,000. B11 holds `speed` at or below 100.
**Example:** might 20 + 115 = 135, guard 10 + 23 = 33, vigor 100 + 0 = 100, speed 0 + 38 = 38.

### S4. Door tier

The door_tier formula is defined as:

`tier = [score ≥ t1] + [score ≥ t2]`, where [x] is 1 when x holds, else 0

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| score | int | 0–20,000 | calculated (#5 F7) | The proving fight's score |
| t1, t2 | int | 10,000–20,000, t1 < t2 (A4) | data file (`door.thresholds`) | Open and wide-open thresholds; MVP [10,000, 15,000] |

**Output Range:** 0, 1 or 2. Since t1 ≥ 10,000, every loss scores below t1 (#5 F7), so a lost
fight is always tier 0.
**Example:** the Furnace Gate scores 14,000, so 1 (open). The Listening Hall scores 15,700, so 2
(wide open).

### S5. Seals and the best seal count

The seals formula is defined as:

`seals(makeup, m) = Σ over doors d of tier_d`, and `bestSeals(m) = max over makeups of seals`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| tier_d | int | 0–2 | calculated (S4) | Each door's tier, from one resolver call (G6) |
| doors | list | 1–6 (#1 R4), but B6 rejects 1; 3 in the MVP | data file (`realm.doors`) | The realm's doors |

**Output Range:** 0 to 2 × doors, so 0–6 in the MVP. B6 makes 6 unreachable under every method.
`bestSeals` is 4 for both methods in S9's content.
**Example:** Gate 1, Well 1, Hall 2, so seals 4. No other makeup earns 4 under Ember Breath, so
`bestSeals(ember)` is 4.

### S6. Cap raise (the Foundation entries)

The cap_raise formula is defined as:

`w(r) = Σ over affinities a with r in a.widens of e_a`;
`E(r) = b` if w(r) = 0, else `lo(b) + div_floor((hi(b) − lo(b)) × min(w(r), WIDEN_FULL), WIDEN_FULL)`;
then the raise D = E(r) − b is split into one line per ingredient:
`c_i = Σ over affinities a with r in a.widens of contrib_m[i][a]⁺`, C = Σ c_i, and, with the
makeup's ingredients in id order and P_i the running sum of c up to and including i,
`line_i = div_floor(D × P_i, C) − div_floor(D × P_(i−1), C)`;
each line above 0 is the entry `{target: r, field: cap, op: add, operand: line_i, source: i}`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| e_a | int | S2 | calculated | Effective affinity |
| b | int | 2–10⁹ | data file (`resource.cap`, base) | The store's base cap. A key item (b = 1) is never listed (B12) |
| lo(b), hi(b) | int | #3 Q5 | calculated | The raise envelope's bounds (120% and 175%, rounded inward) |
| WIDEN_FULL | int | 1–1,000,000 (shipped 200) | constant (tuning knob) | The widening at which a store reaches hi(b) |
| contrib_m[i][a] | int | S1 | data file, after the method stage | What ingredient i puts into affinity a |

**Output Range:**
- E(r) is b, or lo(b) to hi(b) inclusive, so V4 holds by construction.
- The lines telescope, so they sum to D exactly. Each is 0 or more, as K7 requires.
- When w(r) > 0, some ingredient has a positive `contrib` on a listed affinity, so C > 0.
- (hi − lo) × WIDEN_FULL is at most 7.5 × 10⁸ × 10⁶, below 2⁵³ − 1. D × P_i is at most D × C.
  With one affinity widening r, C ≤ 1.1 × 10⁷ and the product stays below 2⁵³ − 1, but the
  schema lets all four affinities widen one store, so C can reach 4.4 × 10⁷ and the product
  3.3 × 10¹⁶. B12 therefore requires D × C ≤ 2⁵³ − 1 for every store in all 30 cases.
- At most N lines per store, within #2 P3.3's 16.

**Example:** Ash Tallow, b 40, w = Cinder 115: lo 48, hi 70, so E = 48 + div_floor(22 × 115,
200) = 60, and D = 20. The Cinder each ingredient puts in, in id order: Cloud Lotus 25, Echo Jade
40, Ember Marrow 35, Ironbark Heartwood 30, so C = 130. The lines are div_floor(20 × 25, 130) =
3, then 10 − 3 = 7, then 15 − 10 = 5, then 20 − 15 = 5. The breakdown reads 40, "+3 Cloud
Lotus", "+7 Echo Jade", "+5 Ember Marrow", "+5 Ironbark Heartwood", 60. Jade Blank, b 8, w =
Jade 23: E = 10, D = 2, and its lines are "+1 Echo Jade" and "+1 Ember Marrow". Cloud Lotus's
line rounds to 0 and is omitted. Ironbark Log: Bark is 0, so it keeps 30 and gets no entry.

### S7. Gathering time

The gather_time formula is defined as:

`T(X, m) = Σ over sources s used by X's chains of ceil_div(D_s(X), out_s) × d_s`

- Each id is made by its cheapest enabled source, by S8 price, with ties broken by source id.
- D_s(X) is the total amount of s's output id that the chains of every ingredient in X demand,
  counting each `reached(id, n)` atom of a used source's `reveal` and `need` once. An ingredient
  demands 1. Shared inputs and key items are therefore made once.
- A by-product is never credited.
- `ceil_div(a, d)` is #3's, −div_floor(−a, d).

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| X | set of ingredient ids | 1–M | calculated | The ingredients to hold |
| d_s | int | 1–86,400,000 ms (#1 R4) | data file, after the method stage | Untended duration per unit |
| out_s | int | 1–10⁹ | data file, after the method stage | Units of the demanded id per unit of s |
| D_s(X) | int | ≥ 1 | calculated | Demand on s |

**Output Range:** 0 ms upward. B9 compares T_all = T(all M, m) with T_best = T(best makeup, m).
A fight source counts only if its challenger (the baseline in the MVP) wins its fights, since a
lost unit pays nothing (#5 C8).
**Example (stub times, S9):** under Ember Breath, all six take 46 minutes and the best four 28,
so 46 ≥ 1.35 × 28 = 37.8, the difference is 18 ≥ 6, and 46 ≤ 60. B9 passes.

### S8. Source price and the fightless ceiling

The source_price formula is defined as:

`price(s) = d_s + Σ over inputs r of s of ceil_div(in_s[r], out_r) × price(src(r)) + Σ over reached(id, n) atoms of s of price_n(id)`;
`ceiling(i) = max(div_floor(p_i × FIGHTLESS_CEILING_BP, 10000), p_i + FIGHTLESS_SLACK_MS)`;
B10 passes when price(f_i) ≤ ceiling(i)

- `src(r)` is r's cheapest enabled source, and out_r is its output of r per unit.
- `price_n(id)` is the price of making n of id once.
- f_i is ingredient i's cheapest fightless enabled source.
- p_i is the price of i's cheapest other enabled source.
- No sharing credit: each input is priced on its own. A path that would use a source twice is
  not a chain.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| d_s, in_s[r], out_r | int | #1 R4 rows | data file, after the method stage | Duration, input amount, output amount |
| FIGHTLESS_CEILING_BP | int | 10,000–30,000 (shipped 20,000) | constant (tuning knob) | Ceiling as a multiple of the other source's price |
| FIGHTLESS_SLACK_MS | int | 0–300,000 (shipped 60,000) | constant (tuning knob) | Absolute slack for short sources |

**Output Range:** price from 1 ms upward. The product p_i × 20,000 is exact while p_i ≤ 4.5 ×
10¹¹ ms. A price above that (over 14 years of slot time) is itself a validator error.
**Example (illustrative chain from #3 K1):** suppose "render ash-fat" (9 Rendered Oil in, Ember
Marrow out) takes 10 s, behind the Hearth Lamp (6 Rendered Oil, 5 s).
- Rendered Oil comes from "render tallow" (30 Ash Tallow in, 3 out, 6 s), which costs
  6 + ceil_div(30, 4) × 2 = 22 s per unit.
- The oil for the recipe costs 3 × 22 = 66 s, and the lamp's `reached` atom adds 5 + 2 × 22 =
  49 s.
- price = 10 + 66 + 49 = 125 s.
- Against a fight source of p = 90 s, the ceiling is max(180, 150) = 180 s, so the check passes.

### S9. The balance table (regenerated, provisional content)

This replaces the forge prototype's table, which predates the forge rules. It was generated
on 2026-11-20 by a throwaway script that implements S1–S5 and #5 F1–F7. That script searched
provisional content until B1–B8, B11 and B12 all held. The two methods are the prototype's
placeholders (Ember Breath, Still Water) until Methods (#7) replaces them. Names are provisional.
The gather times are **stubs**, one cheapest-source time per ingredient, until #8 and #9 author
real sources. B9 and B10 are therefore demonstrated here, not passed.

**Content (base `contrib`, as Cinder / Jade / Bark / Gale):**

| Ingredient | Abbr. | Base | Ember Breath patch | Still Water patch | Stub minutes (EB / SW) |
|---|---|---|---|---|---|
| Echo Jade | EJ | 40 / 40 / 0 / 15 | — | Bark `add` 20 | 7 / 6 |
| Ironbark Heartwood | IH | 30 / 20 / 30 / 0 | Jade `set` 0 | — | 8 / 7 |
| Ember Marrow | EM | 25 / 5 / 0 / 5 | Cinder `add` 10 | — | 4 / 6 |
| Cloud Lotus | CL | 25 / 10 / 0 / 45 | — | — | 9 / 10 |
| Ghost Moss | GM | 0 / 10 / 60 / 30 | — | — | 10 / 9 |
| Tidewater Pearl | TP | 15 / 15 / 50 / 0 | — | Bark `add` 30 | 8 / 7 |

| Door | Opponent (might, guard, vigor, speed) | Thresholds |
|---|---|---|
| Furnace Gate | 51, 80, 191, 20 | 10,000, 15,000 |
| Deep Well | 48, 25, 250, 30 | 10,000, 15,000 |
| Listening Hall | 65, 0, 121, 100 | 10,000, 15,000 |

`FOUNDATION_BASE` 20 / 10 / 100 / 0, `CLASH_BP` 5,000, `SPEED_BASE` 100, `WIDEN_FULL` 200.

**Ember Breath** (tiers as Gate / Well / Hall):

| Seals | Makeup | Tiers | Effective Cinder · Jade · Bark · Gale | Gather, stub min |
|---|---|---|---|---|
| **4** | **EJ, IH, EM, CL** | 1 / 1 / 2 | 115 · 23 · 0 · 38 | 28 |
| 3 | EJ, IH, EM, GM | 1 / 1 / 1 | 60 · 30 · 38 · 23 | 29 |
| 3 | EJ, IH, EM, TP | 1 / 1 / 1 | 80 · 50 · 20 · 0 | 27 |
| 3 | EJ, IH, CL, GM | 1 / 1 / 1 | 50 · 15 · 43 · 60 | 34 |
| 3 | EJ, IH, CL, TP | 1 / 1 / 1 | 70 · 35 · 25 · 28 | 32 |
| 3 | EJ, EM, CL, GM | 1 / 1 / 1 | 70 · 18 · 10 · 63 | 30 |
| 3 | EJ, EM, CL, TP | 1 / 2 / 0 | 90 · 38 · 0 · 30 | 28 |
| 2 | IH, EM, CL, TP | 0 / 1 / 1 | 65 · 5 · 28 · 35 | 29 |
| 1 | EJ, EM, GM, TP | 0 / 1 / 0 | 35 · 45 · 65 · 15 | 29 |
| 1 | EJ, CL, GM, TP | 0 / 0 / 1 | 25 · 30 · 70 · 53 | 34 |
| 1 | IH, EM, CL, GM | 0 / 0 / 1 | 45 · 0 · 45 · 68 | 31 |
| 0 | EJ, IH, GM, TP | 0 / 0 / 0 | 15 · 43 · 98 · 13 | 33 |
| 0 | IH, EM, GM, TP | 0 / 0 / 0 | 10 · 13 · 100 · 20 | 30 |
| 0 | IH, CL, GM, TP | 0 / 0 / 0 | 0 · 0 · 105 · 58 | 35 |
| 0 | EM, CL, GM, TP | 0 / 0 / 0 | 20 · 0 · 73 · 60 | 31 |

**Still Water:**

| Seals | Makeup | Tiers | Effective Cinder · Jade · Bark · Gale | Gather, stub min |
|---|---|---|---|---|
| **4** | **EJ, IH, EM, TP** | 1 / 1 / 2 | 45 · 70 · 75 · 0 | 26 |
| 3 | EJ, IH, EM, CL | 2 / 1 / 0 | 95 · 43 · 0 · 28 | 29 |
| 3 | EJ, IH, CL, GM | 1 / 1 / 1 | 40 · 35 · 63 · 50 | 32 |
| 3 | EJ, IH, CL, TP | 1 / 1 / 1 | 45 · 55 · 75 · 18 | 30 |
| 3 | EJ, EM, CL, GM | 1 / 1 / 1 | 50 · 18 · 35 · 63 | 31 |
| 3 | EJ, EM, CL, TP | 1 / 1 / 1 | 55 · 38 · 48 · 30 | 29 |
| 1 | EJ, IH, EM, GM | 0 / 1 / 0 | 40 · 50 · 63 · 13 | 28 |
| 1 | IH, EM, CL, TP | 0 / 1 / 0 | 40 · 25 · 63 · 25 | 30 |
| 0 | EJ, IH, GM, TP | 0 / 0 / 0 | 0 · 63 · 148 · 3 | 29 |
| 0 | EJ, EM, GM, TP | 0 / 0 / 0 | 0 · 45 · 120 · 15 | 28 |
| 0 | EJ, CL, GM, TP | 0 / 0 / 0 | 0 · 30 · 120 · 53 | 32 |
| 0 | IH, EM, CL, GM | 0 / 0 / 0 | 35 · 5 · 50 · 58 | 32 |
| 0 | IH, EM, GM, TP | 0 / 0 / 0 | 0 · 33 · 135 · 10 | 29 |
| 0 | IH, CL, GM, TP | 0 / 0 / 0 | 0 · 18 · 135 · 48 | 33 |
| 0 | EM, CL, GM, TP | 0 / 0 / 0 | 0 · 0 · 108 · 60 | 32 |

**What the table shows:**

- **B1, B2.** Each method has one best makeup with 4 seals. Each scores 3 under the other method.
  Cloud Lotus leads under Ember Breath and is left out under Still Water; Tidewater Pearl is the
  reverse.
- **B3: the interaction that separates them.** The plain-sum pick fails badly under both
  methods. Under Ember Breath the largest sums are Ghost Moss 100, Echo Jade 95, Cloud Lotus 80
  and Tidewater Pearl 80. That pick earns 1 seal, because its Bark totals clash with its Cinder.
  Under Still Water it is Echo Jade 115, Tidewater Pearl 110 and Ghost Moss 100, with Cloud
  Lotus and Ironbark Heartwood tied at 80. Either way the pick earns 0: its Bark (120 or 148)
  smothers Cinder to 0, and a Foundation with no bite wins no door. Ember Marrow has the smallest sum under both methods and sits in both best makeups. It
  is the spark each Foundation needs.
- **B4: theme fit.** Ember Breath's best leads with Cinder (115), fed by its own patch on Ember
  Marrow, and its second affinity is Gale. Still Water's best leads with Bark (75) and Jade (70),
  fed by its patches on Echo Jade and Tidewater Pearl. Each best is what its method's theme
  suggests, yet neither is the obvious pick.
- **B6, B7.** No makeup is best at every door. Every door opens under each method, and each
  opens wide for some makeup: the Gate under Still Water, the Well under Ember Breath, the Hall
  under both.
- **B8, caps.** Ember Breath's best widens the fuel stores to 60 and 18 and the stone stores to
  25 and 10, and leaves the timber stores at base. Still Water's best widens all six, to 52, 16,
  27, 11, 42 and 13. The largest widening over all 30 cases is 148, about 0.74 × `WIDEN_FULL`,
  so no makeup reaches the 175% corner (economy-designer's target).
- **B9 (stubs).** All six take 46 and 45 minutes, and the best four 28 and 26: ratios of 1.64
  and 1.73, and differences of 18 and 19 minutes. The five cheapest ingredients include the best
  makeup under both methods, so a five-ingredient hedge finds it. The real check runs once #8
  and #9 exist.
- **Sensitivity.** Rounding the doors' stats to tidy numbers (for example Gate vigor 191 to
  190) ties two Still Water makeups at 4 and fails B1. Tune with the table generator, never by
  hand.

*Specialists: `systems-designer` proposed S1–S5's shape, the bases and the integer bounds, and
`economy-designer` proposed S7, S8 and the `WIDEN_FULL` target. Both were consulted in the
Section C round. Neither could run code, so every number here comes from the generator script,
and S2–S6's worked examples were checked against it.*

## Edge Cases

Each case says who catches it: a **load error** (#1 R8.3), a **validator error** (a B-check or
#3's V-checks), a **runtime rule** of this GDD, or **another GDD**, named.

### Totals, clashes and stats

- **If an affinity's total is negative**: it counts as 0 for its own effective value and for its
  opposite's clash (S2). A negative `contrib` can therefore only remove from its own affinity,
  never strengthen the opposite. Runtime rule.
- **If two opposed totals are equal and positive** (T): both effective values are
  T − div_floor(T × CLASH_BP, 10000), which is T − div_floor(T, 2) at 5,000. At `CLASH_BP` 10,000
  both are 0. Runtime rule. No order of operations exists, because both sides read raw totals.
- **If every effective value is 0**: the stats equal `FOUNDATION_BASE`, and `F` is empty, which
  #2 applies as the identity (P4.3). The forge is still legal. Makeups that tie on stats tie on
  seals, which B1 catches if they tie for best.
- **If a total reaches the schema limit** (11,000,000 with 11 ingredients at 1,000,000): the stat
  pins at 1,000,000 (S3), and the widening pins at `WIDEN_FULL` (S6). Every product stays exact
  (S2, S6). No error.
- **If `FOUNDATION_BASE` is set to 1,000,000 for a stat**: that stat no longer depends on the
  makeup, and B5 or B1 fails. A speed base above 100 fails B11 in every case. A vigor base of 0
  gives Life 1 (#5 F1), which is legal.

### Doors and seals

- **If a threshold is exactly 10,000**: "open" means "won", since every win scores at least
  10,000 and every loss at most 9,999 (#5 F7). Runtime rule.
- **If a threshold is 20,000**: only a fight in which the opponent never strikes reaches it.
  That is legal but rarely reachable, and B7 fails if no makeup opens that door wide under any
  method.
- **If a score equals a threshold**: the door reaches that tier, since S4 compares with ≥.
- **If a threshold is outside 10,000–20,000, or they are not strictly ascending**: load error
  (A4; #1 R4.7).
- **If a realm has one door**: B6 cannot hold, because the best makeup at the only door
  dominates. Validator error, so every realm has at least two doors.
- **If several makeups tie for `bestSeals`**: `bestSeals` is still defined, and the forge screen
  may show it. B1 fails, and B2–B4 are reported as not evaluated for that method.

### Caps

- **If a store's base cap is 2 or 3**: lo = hi = 3 for b = 2, so any widening adds 1. For b = 3
  the cap reaches hi (5) only at `WIDEN_FULL`. Runtime rule, inside K7 either way.
- **If an affinity lists a key item**: S6 would give E = 1 and no entry, so #3's V4 never sees
  it. B12 fails instead.
- **If a split line rounds to 0**: it is omitted, and the remaining lines still sum to E − b
  (S6).
- **If content later changes a base cap that a saved Foundation raised**: the saved `add` lines
  stay, so the cap is b′ + (E − b). That is still a raise, but it may leave the envelope. Owned by
  #11, which re-clamps on load (#3 K5). It must drop lines on a store that has become a key item,
  because V4 forbids an entry there (#3 Edge Cases, "Saves and runs").

### The forge

- **If the player confirms a forge from a dialog that has gone stale** (an ingredient no longer
  held, the realm already forged): time is settled and the legality check runs again (G8.3). The
  forge is refused with the reason, and nothing changes. Runtime rule.
- **If the forge is triggered twice** (a double tap): the second finds the realm Forged and is
  refused. Two tabs cannot both run, because #11 holds one tab per profile.
- **If an activity is running at the forge, live or while the player is away**: the forge needs
  a player action, so it never happens during an away `advance`. Live, it ends the current
  segment (#4, #2 P9.4). The running unit keeps going under the new caps. No running unit can
  need a forged ingredient, because no source lists one (B13).
- **If a step of the forge would throw** (a `ModifierError` from an illegal entry): it throws in
  G8.3 step 1, before anything has changed. The forge rethrows it to its caller, and nothing is
  emitted. This is a bug the validator's enumeration exists to prevent (#2 P3.4).
- **If the player forges a makeup that is not the best**: legal. The seals are what they are,
  and in the MVP the only redo is a fast new game (G8.2).

### Before the commit

- **If the player builds a plan before committing**: legal. Nothing is held, so nothing is
  previewable. The method-choice view shows deltas only (#1 Edge Cases, "Before the commit").
  The forge is refused with "Needs a method committed".

### Saves and content versions (owned by #11)

- **If a saved snapshot names a realm, method or door that content no longer has**: #11 maps it
  through the alias map (#1 R2.3) or refuses the save by name. Doors join realms, methods and
  ingredients in the alias map. A retired door's recorded tier keeps its saved name until mapped.
- **If a saved snapshot's method differs from the save's committed method**: impossible in the
  MVP, since the commit comes before the forge and is fixed for the run. #11 refuses such a save
  as corrupt.
- **If a plan the forge screen kept holds an id that content no longer has**: the screen drops
  the id before calling G1. The functions throw on unknown ids, and the rules never save a plan
  (G4.2).
- **If the player starts a fast new game**: `held` returns to 0 (#3 K4), and the snapshot and
  `forged` are cleared, so the realm is in Planning only. What else carries over is #11's.

### Degenerate content (validator)

- **If M = N + 1** (for example 5 ingredients for a makeup of 4): there are M makeups per method.
  B9 then requires the one ingredient left out of the best makeup to cost at least 0.35 ×
  T_best and at least 6 minutes. The checks run unchanged.
- **If an ingredient's `contrib` is 0 on every affinity under both methods**: B5 fails, since
  counting it as 0 changes nothing. Pillar 1's "no slot-filler".
- **If a door's opponent beats every makeup under one method**: B7 fails for that method.

*Specialist: `systems-designer` consulted (19 cases; three gaps closed in Core Rules: partial
plans in G1, B12's key-item check and B13, designer-approved; a stale-confirm re-check and a
compute-first forge in G8).*

## Dependencies

**Upstream (this system depends on them):**

| # | System | Hard or soft | Interface | Status |
|---|---|---|---|---|
| 1 | Content records and schema | Hard | The `ingredient`, `affinity`, `door`, `realm` types and rows; `set_m` (R8.1); the `forged` atom (R5); `div_floor` (F5). Amendment A4 adds `affinity.widens` and narrows `door.thresholds` | Approved; A4 pending in this change |
| 2 | Modifier pipeline | Hard | `set_m`'s effective `contrib` (method stage); the Foundation stage that applies `F` (P4); `effective` for the forge's compute-first step (P9) | Approved |
| 3 | Resources and caps | Hard | `held` (K2); `settle` for consumption (K3); lo and hi (Q5); the re-clamp and `capChanged` (K5) | Approved |
| 5 | Combat resolver | Hard | One fight per door, F7's score (C10) | Approved |
| 4 | Activity slot | Soft | Time is settled before the forge, and the forge ends an `advance` segment (P9.4) | Approved |

**Downstream (they depend on this system):**

| # | System | Hard or soft | What it needs from this GDD |
|---|---|---|---|
| 7 | Methods | Hard | The per-method `contrib` table's shape (S9); B1–B4 its patches must pass |
| 8 | Crafting route | Hard | B9, B10 and B13 on its sources; the ingredient ids it makes |
| 9 | Fight and dungeon routes | Hard | B9 and B10; the baseline stays the route challenger after the forge (G13.2) |
| 11 | Save and run lifecycle | Hard | The forge snapshot (G10); doors in the alias map; the fast new game's reset of the snapshot |
| 12 | Validator | Hard | B1–B13; G1's functions, called rather than reimplemented |
| 13 | Interface shell | Hard | The `forged` event; the Foundation and doors from the snapshot (G13.3) |
| 15 | Forge screen | Hard | G1's functions, the preview rule (G7), `bestSeals` for the headroom signal, the forge action and its confirmation (G8) |
| 14 | Method marks and breakdowns | Soft | Cap trails whose lines name ingredients (G11.3) |
| 16 | Reforge (VS) | Hard | G10's snapshot, replaced, never dropped; G13.5, reforge consumes afresh |
| 19 | Realm ladder (Alpha) | Hard | G10.4 (stacking) and G13.2 (the next realm's challenger) |

**Bidirectional consistency.** #1 (Interactions row 6, Dependencies), #2 (Dependencies), #3
(Dependencies) and #5 (Dependencies) each already list this system. Each downstream GDD must list
"depends on: Forge and proving" when it is written. The systems index row #6 gains "Content
records and schema" in Depends On, because the rows this GDD owns are #1's.

## Tuning Knobs

These are the values this GDD owns. Every change re-runs B1–B13 over the 30 cases, because the
table is sensitive (S9, "Sensitivity").

| Knob | Shipped | Safe range | Too low | Too high | Interacts with |
|---|---|---|---|---|---|
| `CLASH_BP` (S2) | 5,000 | 2,500–7,500 | Clashes barely bite; the plain-sum pick creeps toward best (B3) | Any opposed ingredient ruins a makeup; only pure builds survive, and the puzzle narrows to two archetypes | Every `contrib` value; B3, B5 |
| `FOUNDATION_BASE` (S3) | might 20, guard 10, vigor 100, speed 0 | might and guard 0–50, vigor 50–200, speed 0–20 | A Foundation with no bite or no Life loses every door, whatever its makeup | The body outweighs the ingredients, and B5 fails | Door opponents' stats; #5 F1 (Life from vigor) |
| `WIDEN_FULL` (S6) | 200 | 1.2–1.5 × the largest widening over the 30 cases | Every widened store sits at 175%, so bills fall to about 40% of a cap (#3 K7's corner) | Raises cluster at 120%, and makeups stop differing in caps | `contrib`; #3's `RAISE_MIN_BP`, `RAISE_MAX_BP` |
| `OVERGATHER_RATIO_BP` (B9) | 13,500 | 12,500–15,000 | Over-gathering is cheap, and "gather all six" dominates (pillar 3) | Above 15,000 (6 ÷ 4) the best makeup can no longer hold a dear ingredient | Source durations (#8, #9, #7) |
| `OVERGATHER_MIN_MS` (B9) | 360,000 (6 min) | 180,000–600,000 | A short session's price rounds to nothing | Forces long chains into every realm | The 30–60 minute session |
| `OVERGATHER_MAX_MS` (B9) | 3,600,000 (60 min) | 2,700,000–5,400,000 | Leaves too little room for the price | Over-gathering becomes a wall, past the session | The session length (concept) |
| `FIGHTLESS_CEILING_BP` (S8) | 20,000 | 15,000–25,000 | Fightless sources must match fights closely; methods can hardly re-price crafting | The pillar 4 guarantee turns nominal; a fightless-only plan takes too long. Do not exceed 25,000: at 2×, a 25-minute plan already takes 50 | #7's re-pricing |
| `FIGHTLESS_SLACK_MS` (S8) | 60,000 | 0–120,000 | Ratio noise on 20 s sources fails B10 | Short sources escape the ceiling | Source durations |

Fixed by design, not tuned here:

- **The opposed pairs** (G3) and the rule that affinities are the four stats. Changing them is a
  change to this GDD.
- **The tier rule** (S4): two thresholds, compared with ≥.
- **N = 4 of M = 6**, the MVP content (concept, MVP Definition).

Content values, tuned with the table generator (S9) rather than as knobs:

- every `contrib` value and method patch, with Methods (#7);
- the door opponents and thresholds (10,000–20,000);
- each affinity's `widens`.

Knobs owned elsewhere that this system feels:

- `SPEED_BASE` (#5): B11 holds every Foundation's and door's speed at or below it.
- `RAISE_MIN_BP` and `RAISE_MAX_BP` (#3): they set S6's lo and hi.
- `MAX_ADDS_PER_VALUE` (#2, 16): S6's lines stay within it while N ≤ 16.

## Visual/Audio Requirements

This system has no assets of its own. It needs only these from the display (#13, #14, #15):

- **Affinities by name and glyph.** Cinder, Jade, Bark and Gale each have a glyph. Each also
  names its stat (might, guard, vigor, speed), so the cultivation words never hide the rule.
- **The clash as a visible loss.** Where an opposed pair meets, the display shows the amount
  taken off, for example "Cinder 130 − 15 = 115; Bark 30 − 65 = 0". A clash is never shown only
  as a lower number.
- **Tiers by word and glyph.** A door reads "shut", "open" or "wide open", never by hue alone
  (the accessibility floor in the systems index, system 18).
- **The forge as one moment.** The four ingredients leave the hand, the three doors show their
  tiers together, and the stores widen. All of it is read from `forged` and `capChanged`. There
  is no fight playback: the proving results are known in advance (#5 Visual/Audio).
- No audio: the game has no audio system yet.

## Game Feel

- **Instant.** The forge's three proving fights and its consumption land in the same frame as
  the confirm (#5 Game Feel). A preview updates on each pick within AC-P-1's budget.
- **The reveal is in the gathering.** A plan's seals appear when its last ingredient comes into
  hand, not at the forge. The forge only commits a result the player has already seen.
- **The clash bites as you build.** Adding an opposed ingredient to the held part lowers an
  effective value on screen (G7.3). The player feels harmony before they can see a seal.
- **One weighty step.** The forge is the realm's only irreversible action after the commit. Its
  weight comes from the confirmation, which names the four ingredients and says that the MVP
  has no reforge (G8.2), not from a delay or a hold-to-confirm.
- **Then room.** After the forge the full stores stop being full, and stopped work can run again
  (#3 Game Feel).

## UI Requirements

The forge screen (#15) owns the layout. This system requires:

1. **A plan of four.** The player chooses four of the realm's ingredients. Each shows held or
   not held. A plan that cannot be forged says why in words (G8.1).
2. **Only what `preview` returns** (G7). For the held part of a plan, the screen shows its
   totals, effective values and clashes. For a previewable plan, it shows each door's score and
   tier, the seals, and each widened store's new cap from `foundationEntries`. It shows no cap
   for a plan that is not previewable, because a cap would reveal hidden base contributions.
   This answers #3 Open Question 5: the caps feed the choice, under the same rule as the seals.
3. **Comparing in hand.** The screen may list every previewable makeup with its seals, so the
   player can compare the makeups they hold (G9.1).
4. **The headroom signal.** `bestSeals(m)` is shown as a fact about the realm, for example "The
   best Foundation here holds 4 seals". It never names the makeup (G7.4; Player Fantasy, promise
   4). Its form is #15's.
5. **The confirmation** (G8.2) names the four ingredients and the seals, and says that the MVP
   offers no reforge, only a fast new game.
6. **After the forge.** The screen shows the Foundation from the snapshot, each door's tier and
   its `flavor` (G13.3, G13.4).
7. **Breakdowns.** Every stat, score and cap opens its breakdown on tap (#14, #2 P8). No
   interaction is hover-only (MVP required item 8).
8. **Words.** Player-facing text follows the Player Fantasy's tone. This GDD's "total",
   "effective value" and "score" are designer terms, not copy; #15's spec names them.

> **📌 UX Flag — Forge and proving**: this system has UI requirements. The Forge screen (#15)
> UX spec (`/ux-design`) must cover the plan of four, the preview tiers, the headroom signal,
> the confirmation and the forged view, and the Interface shell (#13) spec must cover the
> Foundation's persistent display, before epics are written. Stories cite `design/ux/[screen].md`,
> not this GDD.

## Cross-References

| This GDD | Refers to | For |
|---|---|---|
| G2, G3, A4 | #1 R4 rows `ingredient.contrib`, `affinity`, `door.opponent`, `door.thresholds`, `realm.ingredients`, `realm.doors`, `realm.makeupSize`; R4.7 | The records this system gives meaning to |
| G1, G7 | #1 R8.1 (`set_m`, frozen sets), Edge Cases "Before the commit" | Pure inputs; the method view's deltas lie outside the preview rule |
| G8.3, G10 | #1 R5 (`forged` atom) | The realm counts as forged once the snapshot exists |
| S1–S8 | #1 F5 (`div_floor`) | Every division |
| G5, G11 | #2 P2, P3.2, P3.3, P4, P8, P9 | The method stage, no tending on `contrib`, ≤16 adds, the Foundation stage, trails, compute-first |
| G8.3, G9 | #3 K2, K3, K5 | `held` 0/1, one settle with cause `forge`, re-clamp and `capChanged` |
| G11, S6 | #3 K7, Q5 | The raise envelope lo(b) to hi(b) |
| G6, AC-G6-2 | #3 K8.2 | No seal reads a cap |
| G6, S4 | #5 C1, C7, C10, F1–F7 | The four stats, monotone scores, the proving contract, the score's range and win floor |
| B11 | #5 `SPEED_BASE` | Speed held at or below the base |
| G13.2 | #5 C9 | The baseline combatant for route fights |
| G8.4 | #4 (in design) | Settle before the action; the forge ends an `advance` segment |
| Player Fantasy, G7, G9 | Concept mechanics 1 and 2, the Preview rule, MVP Definition; pillars 1, 3, 4 | Proving, harmony, seals only in hand, the session length |
| G8.2, G13.6 | Hundred Days rule 54 (`research/hundred-days-reference/06-design-rules.md`) | A fast new game instead of a reforge |
| G8.5 | Arcanum rule 27 (`research/arcanum-reference/12-design-rules.md`) | A shut door is a tier of 0, never a penalty |
| UI Requirements | Arcanum rule 32; MVP required item 8 | Persistent context; no hover-only interaction |

**Amendments this GDD makes to approved GDDs** (each recorded in the target's Amendments header):

- **A4 to #1 Content records and schema.** Adds the R4 row `affinity.widens`, a list of
  resource ids (`refs resource`, `modifiableBy: —`, `sealInput: no`). Narrows `door.thresholds`
  to 10,000–20,000 per value, strictly ascending. Marks #1 Open Questions 2, 9 and 12 resolved
  here.
- **Notes only, no rule change:** #2 Open Question 3 (`source` is the ingredient), #3 Open
  Questions 2 and 5 (no counts; caps previewed with seals), and #5 Open Questions 1, 3 and 5
  (thresholds 10,000–20,000; the baseline after the forge; `SPEED_BASE` 100 kept with B11) are
  marked resolved by this GDD.

## Acceptance Criteria

**Tags:**

- `[unit]` is a pure rules-core test.
- `[validator]` runs the Validator (#12) on a fixture.
- `[integration]` exercises another system's call path, with that system stubbed where it is
  not built yet.

**Content:** **Fx** means a fixture loaded against a test schema (#1 R8.2). **S** means the
shipped content, which in the MVP's first build is S9's provisional content. EB is Ember Breath,
SW is Still Water. Abbreviations follow S9: EJ, IH, EM, CL, GM, TP.

### Rules

- **AC-G1-1** [unit, Fx] **GIVEN** a deep-frozen `set_m` and `held`, with the clock, any random
  source and all game state stubbed to throw if read, **WHEN** each G1 function runs 1,000 times
  on equal arguments, **THEN** every result deep-equals the first and no input changes.
- **AC-G1-2** [unit] **WHEN** `seals`, `foundationEntries` or `previewable` get 3 ids, 5 ids, an
  id twice, or an id not in `realm.ingredients`, **THEN** each throws a `RangeError`. **AND
  WHEN** `foundationStats` gets 0 ids, 5 ids, an id twice or an unknown id, **THEN** it throws.
  **AND** `foundationStats([EJ], EB)` and `preview([], held, EB)` return.
- **AC-G2-1** [validator, S] **THEN** the realm has 6 ingredients, `makeupSize` 4 (15
  makeups), and doors Furnace Gate, Deep Well and Listening Hall in that order. **AND** no
  ingredient record carries a count field, and an ingredient's cap is 1 (#3 K2.3).
- **AC-G3-1** [unit, Fx] (S2) **GIVEN** totals might 130 and vigor 30, **THEN** the effective
  values are 115 and 0. **AND** guard 100 against speed 100 gives 50 and 50. **AND** might 100
  with guard 100 gives 100 and 100, because they are not opposed. **AND** a might total of −40
  against vigor 30 gives 0 and 30.
- **AC-G4-1** [unit] **GIVEN** a plan of 3 chosen ingredients, **THEN** `preview` returns no
  seals, and the forge is refused. **AND** the rules core holds no plan state: a forge action
  carries its makeup.
- **AC-G5-1** [unit, S] (S1, S3) **GIVEN** EB and the makeup EJ, IH, EM, CL, **THEN** the totals
  are 130 / 55 / 30 / 65 (might, guard, vigor, speed) and the stats 135 / 33 / 100 / 38. **AND**
  a tending entry on `contrib` throws a `ModifierError` (#2 P3.2), so no stage but the method's
  reaches it.
- **AC-G6-1** [integration, #5 resolver] **WHEN** `seals([EJ, IH, EM, CL], EB)` runs, **THEN**
  the resolver is called three times, in the order Gate, Well, Hall, each with challenger
  135 / 33 / 100 / 38 at Life 100 and that door's opponent alone. The scores are 14,000, 14,400
  and 15,700, the tiers 1 / 1 / 2, and the seals 4.
- **AC-G6-2** [unit, Fx] (seal invariance; #3 K8.2) **GIVEN** a tending stub that raises every
  tendable value by 50% and a cap reader that throws if called, **WHEN** `foundationStats` and
  `seals` run for all 30 cases, **THEN** every result equals the untended result, and the cap
  reader is never called.
- **AC-A4-1** [validator, Fx] **GIVEN** door thresholds [9,999, 15,000], [10,000, 20,001],
  [15,000, 15,000] or [15,000, 10,000], **THEN** loading fails, naming the door and
  `thresholds`. **AND** [10,000, 20,000] loads. **AND** an affinity whose `widens` names a
  non-resource fails to load (#1 R4.7, `refs resource`).
- **AC-G7-1** [unit] **GIVEN** held {EJ, IH, EM}, **THEN** `previewable([EJ, IH, EM, CL])` is
  false. **AND** over all 64 held subsets and 15 makeups, it is true exactly when the makeup is
  a subset of held.
- **AC-G7-2** [unit, S] **GIVEN** held {EJ, IH, EM}, EB and the plan EJ, IH, EM, CL, **WHEN**
  `preview` runs, **THEN** it returns the held part's totals 105 / 45 / 30 / 20 and effective
  values 90 / 35 / 0 / 0, and for CL its name and EB's patch deltas only (none). It returns no
  score, tier, seal, or CL base value (25 / 10 / 0 / 45). **AND** over all 64 × 15 held and plan
  pairs, `preview` returns seals exactly when the plan is a previewable makeup.
- **AC-G7-3** [unit, S] **THEN** `bestSeals(EB)` and `bestSeals(SW)` are 4, and calling them
  reads no `held`.
- **AC-G8-1** [integration, #4 stub] **WHEN** the forge is tried with no method committed, with
  CL not held, or on a forged realm, **THEN** it is refused with "Needs a method committed",
  "Needs Cloud Lotus in hand" or "Already forged". Nothing changes, and no event is emitted.
  **AND GIVEN** a stub settle that removes CL when called, **WHEN** a forge of EJ, IH, EM, CL is
  confirmed, **THEN** the settle runs before the legality check, and the forge is refused.
  **AND** a second confirm straight after a successful forge is refused.
- **AC-G8-2** [integration] **GIVEN** a `foundationEntries` stub that yields an illegal entry,
  **WHEN** the forge is confirmed, **THEN** the `ModifierError` reaches the caller, all six
  ingredients are still held, no snapshot exists, `forged(realm)` is false, no cap moved, and no
  event was emitted.
- **AC-G8-3** [integration] (G9, G10.1) **GIVEN** all six held under EB, **WHEN** EJ, IH, EM, CL
  is forged, **THEN**:
  - those four are held 0 with their marks still 1, and GM and TP stay at 1;
  - there was exactly one settle, with cause `forge` and no `overflow`;
  - the snapshot holds the realm, EB, the makeup in id order, the totals, the effective values,
    the stats, each door's score and tier, seals 4 and `F`, and no `contrib`, threshold or cap;
  - `capChanged` reports Ash Tallow 40 → 60 and Jade Blank 8 → 10, and nothing for Ironbark Log;
  - `forged` is emitted once, with EB, the makeup in id order, seals 4, and the doors in
    `realm.doors` order: Gate 14,000 / 1, Well 14,400 / 1, Hall 15,700 / 2.
- **AC-G8-4** [integration, #4 stub] **GIVEN** a unit running, **WHEN** the player forges,
  **THEN** the forge adds 0 ms of slot time, the running unit continues, and exactly one
  `advance` segment boundary falls at the forge.
- **AC-G10-1** [integration, Fx] **GIVEN** a forged save, **WHEN** content changes the Gate's
  opponent vigor from 191 to 250 and the save loads, **THEN** the Foundation display reads seals
  4 and tiers 1 / 1 / 2 from the snapshot, without calling the resolver, while a fresh `seals`
  of the same makeup returns the new value.
- **AC-G11-1** [unit, S] (S6) **GIVEN** EB and EJ, IH, EM, CL, **THEN** `foundationEntries`
  gives Ash Tallow the lines CL +3, EJ +7, EM +5 and IH +5 (cap 60), and Jade Blank EJ +1 and EM
  +1 (cap 10). It gives Ironbark Log and Seasoned Plank none. Every line is `add` on `cap`, with
  the ingredient as `source`. **AND** over 10,000 seeded random cases (bases 2–10⁶, widenings
  0–10⁶, 1–11 contributors), the lines sum to E − b, none is negative, and E is b or within
  lo(b)–hi(b).
- **AC-G12-1** [unit, Fx] (S8) **GIVEN** a fightless source of price 125 s and another source of
  p = 90 s, **THEN** the ceiling is 180 s: a fightless price of 180,000 ms passes and 180,001 ms
  fails. **AND** p = 30 s gives a ceiling of 90 s, the slack winning.
- **AC-G13-1** [integration, #9 stub] **GIVEN** a forged realm, **WHEN** a route fight runs,
  **THEN** its challenger is the baseline combatant, not the Foundation. **AND** a door's
  `flavor` is returned for display only once the realm is forged.
- **AC-G13-2** [integration] *[blocked: #11]* **WHEN** a fast new game starts after a forge,
  **THEN** the snapshot and `forged` are cleared, every ingredient is held 0, and the realm is in
  Planning only.
- **AC-S7-1** [unit, Fx] **GIVEN** EB's stub times, **THEN** T(all six) is 46 minutes and
  T(EJ, IH, EM, CL) is 28. **AND GIVEN** two ingredients that each need 3 Rendered Oil from one
  source (3 out, 6 s), **THEN** that source runs 2 units (12 s), not 1 per ingredient, because
  shared inputs are made once.
- **AC-S9-1** [validator, S] **WHEN** the table generator runs on the shipped content, **THEN**
  it reproduces S9's two tables row for row, or this GDD is updated in the same change.

### Checks (each [validator, Fx]: S9's content passes; the named change fails)

- **AC-B1-1** Gate vigor 191 → 190 ties two SW makeups at 4. B1 fails for SW, and the report
  lists B2 (both methods) and B3, B4 (SW) as "not evaluated", not as passed.
- **AC-B2-1** SW's patches replaced by EB's: B2 fails.
- **AC-B3-1** A case table in which the plain-sum pick (ties in id order) is the single best: B3
  fails. With S, EB's plain-sum pick GM, EJ, CL, TP earns 1, and SW's earns 0.
- **AC-B4-1** EB's patches reduced to IH's Jade `set` 0: B4 fails, because the best makeup's
  leading Cinder is unpatched.
- **AC-B5-1** GM's `contrib` set to 0 on every affinity under both methods: B5 fails for GM.
- **AC-B6-1** A case table in which one makeup ties or beats every other at every door, or a
  realm with one door: B6 fails.
- **AC-B7-1** The Gate's opponent at 1,000,000 / 1,000,000 / 1,000,000 / 100: B7 fails, naming
  the Gate.
- **AC-B8-1** Every affinity lists Rendered Oil, so every makeup widens it: B8 fails.
- **AC-B9-1** *[blocked: #8, #9; runs on stubs at the Wave A checkpoint]* EB's stubs (46 against
  28) pass. GM at 1 minute fails the ratio (37 < 37.8). Best four at 2, 3, 2 and 3 minutes, with
  GM 3 and TP 2, fails the 6-minute gap. GM at 25 minutes fails the 60-minute ceiling.
- **AC-B10-1** *[blocked: #8, #9]* AC-G12-1 under each method, with p the cheapest other enabled
  source, not the fight the fightless source stands beside.
- **AC-B11-1** Every speed at 100 passes. A speed base of 101, or one door opponent at speed 101,
  fails.
- **AC-B12-1** A missing affinity, a duplicate, one whose id is not a stat name, and one whose
  `widens` lists the Hearth Lamp (base cap 1): each fails B12.
- **AC-B12-2** A case table in which a store of base cap 10⁹ is raised to 1.75 × 10⁹
  (D = 7.5 × 10⁸): C = 1.2 × 10⁷ passes B12 (D × C = 9.0 × 10¹⁵), and C = 2.2 × 10⁷ fails it
  (1.65 × 10¹⁶).
- **AC-B13-1** A source with GM in its `inputs`, in content or through a method patch: B13 fails.

### Performance

- **AC-P-1** [unit, S] On the build runtime, `bestSeals(m)` takes at most 5 ms (median of 100
  runs), and a full B1–B13 pass over the 30 cases (B9 and B10 on stubs) takes at most
  1,000 ms. Both are provisional until #1's ADR 9 sets the budgets.

### Checked by review, not by test

- The forge confirmation's wording, including the "no reforge in the MVP" line (G8.2).
- The headroom signal's form on the forge screen (#15).
- Theme fit as a player reads it: a tester who has read neither this GDD nor the table is asked
  which makeup they expected to be best under each method, and whether the real one felt clever
  or backwards (CD-PLAYTEST concern 3). B4 is only its proxy.
- The tone of the forge's player-facing text (Player Fantasy).

*Specialist: `qa-lead` proposed these criteria and checked S9's numbers by script. It flagged
six problems, all fixed in Core Rules before these were written: B5 passed an all-zero
ingredient; G7 had no testable function (`preview` added); checks now read a case table; B2's
scope when B1 fails; the tie orders; and the forge's error path and event order.*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | S9's content is provisional. Do Methods' real patches and the routes' real durations still pass B1–B13, and does each method's best makeup stay at 4 seals? | Methods (#7), Crafting route (#8), Fight and dungeon routes (#9) | #7 GDD; checked again at #8 and #9 |
| 2 | S9's table is sensitive: the Gate's vigor at 190 instead of 191 breaks B1 under Still Water. Should B1 also require a margin, for example that the best makeup stays unique when any one door stat moves by 1? | Forge and proving (#6), Validator (#12) | #12 GDD |
| 3 | Does the theme fit as players read it? B4 is a proxy; the playtest named in "Checked by review" is the real test (CD-PLAYTEST concern 3) | Designer | First playtest of the Wave A build |
| 4 | What form does the headroom signal take, and does it help the player find better makeups without naming them (CD-PLAYTEST concern 2)? | Forge screen (#15) | #15 UX spec |
| 5 | A door's beyond is text in the MVP (G13.4). A real source behind a door needs a door-tier gate atom | Realm ladder (#19), #1 Open Question 7 | Before Alpha |
| 6 | How does a later realm's Foundation stack with an earlier one, for caps and for the challenger? #3 K7's envelope must be amended first (G10.4) | Realm ladder (#19) | #19 GDD |

**ADRs required** (representation this GDD leaves out):

1. The forge snapshot's encoding and its save slice, with Save and run lifecycle (#11) and the
   entry list's format (#2).
2. The G1 functions' signatures and result types, including `preview`'s partial result, and the
   `forged` event's channel, with the Interface shell (#13).
3. The Validator's report format for B1–B13, including "not evaluated" for skipped checks. It
   extends #1's ADR 8 and #3's report format.
4. The case-table builder: how the 30 cases are built once from G1's functions and shared by the
   Validator and the S9 table generator (G14, AC-S9-1).
