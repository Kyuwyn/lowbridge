# Chapter 2: The Basin Road

27 October 2026. The second chapter after the ridge: from the waystation's four leads to the Second Direction, then first arrival at Reedmarket, the market settlement on the Cloudwell basin's edge. Decided by [ADR 0030](decisions/0030-sphere-techniques.md) (sphere techniques, opposed pairs, derived titles; the ridge retrofit) and [ADR 0031](decisions/0031-basin-road-systems.md) (hobby slot, Focus, stances and foe techniques, lasting preparations). This document is the content spec: every record the chapter adds or changes, in the form the JSON takes. Numbers are provisional by project convention; the validator bands in §C2.7 are the acceptance, and the implementer tunes inside them.

Bound: 30 to 60 minutes of honest play from the waystation to the Second Direction, arrival at Reedmarket within 15 minutes after; no timed record in this chapter over 300 seconds. The measured figures will live in [`playtest/SIMULATION-REPORT.md`](../playtest/SIMULATION-REPORT.md) and nowhere here.

Vocabulary: a **sphere** is body, sword, earth, formation or pill; its **family** Circulation, Blade Intent, Ground Reading, Array Craft or Refining (new); its **material** marrow herbs, whetstone grit, veined ore, inked tokens or pale root (new). A **pair** is two `attune: true` techniques that `lock` each other, both with `warn`, both carrying the sphere's key; a pair yields at most one key per tier. **Route keys** count owned, unlocked records carrying the tag: existing `t_school_<s>`, `t_channel`, `t_hollow`, `t_furnished`; new `t_school_pill`, `t_deep_<s>` (five), `t_leaf`, `t_commission`.

## C2.1 Stat sheet deltas

Chapter one's sheet (design plan C.1) stands. This chapter adds or raises:

| Quantity | Entry | Cap | Raised by | Gates |
|---|---|---|---|---|
| Focus (`focus`, shared) | the waystation (8/8, +0.02/s) | 8 | *Walk where it slid* +2 while held; *Listen for water* +3 while held; the Second Direction +2; Rest refills it (+0.1/s, full in about eighty seconds) | basin outings drain it beside Strain; the settling draught discounts both by a quarter |
| Hobby (`hobby_slots`, shared) | the Second Direction | 0 → 1 | the Second Direction +1 | a `hobby: true` record may run at half pace beside the slot |
| Attunement | — | 3 → 4 → 5 | the First Direction +1; the Second Direction +1 | the Second Direction's core wants three methods held |
| Pale root (`pale_root`, shared) | Refining opens | 10 | Refining +2 per level; *Stock Han's still-room* +4 | draughts, the clear pill, the specimen trade |
| Refining (family, shared) | Shu's three leaves | 5, +3 at the Second Direction if deepened | the pale-root bank's first dig +1; the Second Direction +3 while `t_deep_pill` | the pill pair, the draughts, the still-room commission |
| Circulation / Blade Intent / Ground Reading / Array Craft | — | ridge 5 → First Direction 8 → the sheets +2 → 10 → Second Direction 13 | the sphere teaching +2; the sphere site's first run +1; the Second Direction +3 per deepened sphere | the deep pairs' `require`; the commissions at 6 |
| Strain | — | +2 (spur reopened), +2 (Second Direction), +2 while *Temper the fire* held | `spur_reopened`, the Second Direction, the pill pair | — |
| Qi | — | +4 (chime explained) | `chime_explained`; the relay keeper's leaf patches Qi Sense +1 cap per level | the Second Direction wants it full |
| Composure | — | +1 (chime explained) | `chime_explained` | the relay test wants 3 |
| Lore | — | +1 (Shu's three leaves), +2 (Second Direction) | the leaves, the Second Direction | the sphere teachings want 5; the study pointer wants 6 |
| Home space | — | +2 (ridge room), +1 while *Open a layout* or *Anchor the array* held | the ridge room, the formation halves | the clay vessel wants a span |
| Bank | — | 6 h → 24 h (First Direction) → 72 h (Second Direction) | the Directions | acceleration |
| Doses (`settling_draught`, `marrow_draught`, `clear_pill`, Preparations) | Refining opens | 3 each | the recipes `fill` them | the preparations |
| Specimen case (`specimen_case`, Preparations) | the case recipe | 1 | — | delivery to Han |

Combat stats: the class figures of ADR 0026 §1 are now held figures (ADR 0030 §3). The ridge halves carry Life +2 and Guard +2 (*Sink the load*), Speed +0.2, Dodge +5 and Strike +1 (*Rise under the load*), Strike +2 and Hit +10 (*Cut by intent*), Guard +1, Speed +0.1 and Dodge +5 (*Let the blade wait*); the deep halves and the stances are in §C2.3.

## C2.2 Places and people

- **The waystation** stays the chapter's home base. **Keeper Han** keeps the ledger room: his commissions, his leaf, the specimen case, the ridge room he lets beside the cottage.
- **Old Tam** at the ferry is the blade practitioner (ADR 0016 Q86): his second lesson is the sword teaching.
- **Granny Shu** is the refiner: her three leaves of the slip are the pill teaching and open Refining.
- **The slide** below the route records: the rise above it shows the terrace bypass; the terrace is a day's carry to Reedmarket.
- **The chime relay**: a relay stone higher up the ridge that rings once at dusk; sitting it out, then testing it, explains the returning chime.
- **The spur**: the damaged survey spur ends at a slide; clearing it reopens the spur, uncovers the shelter's leaf and the pale-root bank, and is where two men wait.
- **The terrace** and **Reedmarket**: the chapter's finale, reached after the Second Direction; the three leaves the ledger could not place are in the basin beyond it.

## C2.3 Records

Array order in the JSON is reveal order. Groups: existing `Sites`, `Purchases`, `Techniques`, `Home`, `Craft`, `Work`, `Trade`, `Practice`, `Fights`, `Milestones`, `Families`; new `Commissions`.

### Seam and file moves (ADR 0024, ADR 0030 §6)

A basin gate may name only basin ids, shared ids or `t_` keys. The basin needs `waystation`, the four leads (`route_records`, `unusual_chime`, `damaged_spur`, `slip_leaves`), `first_direction`, `workbench`, `reading_desk`, `cottage` and `coffer`. **These records move unchanged from `ridge.json` to `shared.json`**; `ridge.json` keeps everything else. (The alternative, a shared `basin_open` flag set by an event on `waystation` with every basin gate reading it, is not taken; do not do both.)

`src/content.ts` registers `basin` third (`[...shared, ...opening, ...ridge, ...basin]`), adds the new keys to `routeKeys` with their player-facing names (`t_school_pill` "Pill school"; `t_deep_body` "Body, deepened", `t_deep_sword` "Sword, deepened", `t_deep_earth` "Earth, deepened", `t_deep_formation` "Formation, deepened", `t_deep_pill` "Pill, deepened"; `t_leaf` "A leaf of the slip"; `t_commission` "A commission done"), and adds scenes `second_direction` (`when: "g.second_direction > 0"`, place "The basin road", bound "The Second Direction to Reedmarket") and `reedmarket` (`when: "g.reedmarket > 0"`, place "Reedmarket", bound "Reedmarket"), with beats for the leads (`g.waystation > 0 && g.second_direction < 1`, next names `route_records` and `unusual_chime`), the Second Direction panel satisfied, and arrival ("The three leaves the ledger could not place are somewhere in the basin").

### 3a. Ridge retrofit (`ridge.json`, `shared.json`, `opening.json`)

**Removed**: `direction_body`, `direction_sword`, `direction_earth`, `direction_formation` and the four class records `body_disciple`, `sword_disciple`, `earth_listener`, `formation_student` as shipped. The families' `perLevel` entries `direction_<s>.rate: 0.02` become `first_direction.rate: 0.02`.

**One breakthrough** (group Practice, as the removed directions):

| id | require | breakthrough | bill | length | result / mod | events |
|---|---|---|---|---|---|---|
| `first_direction` "Take a First Direction" | `g.ridge_outskirts > 0` | core: `g.circulation >= 4 && g.body_drills.reps > 0 \|\| g.blade_intent >= 4 && g.blade_drills.reps > 0 \|\| g.ground_reading >= 4 && g.ground_drills.reps > 0 \|\| g.array_craft >= 4 && g.array_drills.reps > 0`, coreLabel "A sphere carried to four, its drills begun"; pointers (`required: 3`): "Lore 4" `g.lore >= 4`; "A furnished home: a cot, a herb plot or a strongbox" `g.t_furnished >= 1`; "A method of that school held and used" `g.t_school_body >= 2 \|\| g.t_school_sword >= 1 \|\| g.t_school_earth >= 1 \|\| g.t_school_formation >= 1`; "Two hundred coin earned in wages" `g.coin_earned >= 200` | `buy: { herbs: 20, coin: 60 }`; `need: g.marrow_herbs >= 12 \|\| g.whetstone_grit >= 12 \|\| g.veined_ore >= 12 \|\| g.inked_tokens >= 12`, needtext "Twelve of that sphere's material in hand" (a threshold, not spent) | 180 | `mod: { "bank.max": 64800, "attune_slots.max": 1, "circulation.max": "3 * (g.circulation >= 4)", "blade_intent.max": "3 * (g.blade_intent >= 4)", "ground_reading.max": "3 * (g.ground_reading >= 4)", "array_craft.max": "3 * (g.array_craft >= 4)" }`; `max: 1` | title events in this order, each `when` also requiring `g.first_title < 1 && g.first_direction > 0`, each `changes` setting `first_title: 1` and its title: body `g.circulation >= 4 && g.t_school_body >= 2` → `body_disciple`; sword `g.blade_intent >= 4 && g.t_school_sword >= 1` → `sword_disciple`; earth `g.ground_reading >= 4 && g.t_school_earth >= 1` → `earth_listener`; formation `g.array_craft >= 4 && g.t_school_formation >= 1` → `formation_student`. Event text names the title in the ridge's voice. |

The cap mods are expressions so the Direction raises every sphere the player carries to four, now or later. If an expression mod trips the fixed-point recompute (≤ 8 passes) because a cap raise changes its own condition, the fallback is per-sphere flag events on the breakthrough (`changes: { "body_four": 1 }`) with constant mods on those flags.

**Flags and titles** in `ridge.json`: `first_title` (flag, `initial.max 1`, no `require`); four title records `kind: class`, group Purchases, `require: g.<id> > 0`, `max: 1`, with `title` and only these mods, descriptions rewritten to say what the title patches:

| id | title | mod kept |
|---|---|---|
| `body_disciple` | Body Disciple | `{ "labour.mod.vigor.max": 1 }` |
| `sword_disciple` | Sword Disciple | `{ "cut_timber.yield": 1 }` |
| `earth_listener` | Earth Listener | `{ "stonework.mod.strain.max": 1 }` |
| `formation_student` | Formation Student | `{ "straw_pallet.mod.rest.rate": 0.25, "cot.mod.rest.rate": 0.25, "practice_mat.mod.breath_gathering.rate": 0.25, "garden_plot.mod.herbs.rate": 0.01 }` |

**Ridge pairs.** The four existing methods' `held` change and four opposites are added. All: `kind technique`, group Techniques, `attune: true`, `cost { qi: 3 }`, `at { "5": { "<id>.discount": 0.15 } }`, `require` = the sphere's teaching `> 0`, `lock: [<sibling>]`, `warn` naming the sibling ("Holding this closes *X* for good.").

| sphere | existing half: new `held` | new half | need | result | held | tags |
|---|---|---|---|---|---|---|
| body | `sink_the_load`: `life.max 2, guard.max 2` | `rise_with_load` "Rise under the load" | `g.vigor < g.vigor.max` | `vigor: 4` | `speed.max 0.2, dodge.max 5, strike.max 1` | `t_school_body` |
| sword | `cut_by_intent`: `strike.max 2, hit.max 10` | `let_the_blade_wait` "Let the blade wait" | `g.whetstone_grit < g.whetstone_grit.max` | `whetstone_grit: 1, composure.exp: 10` | `guard.max 1, speed.max 0.1, dodge.max 5` | `t_school_sword` |
| earth | `read_the_grain`: `pry_veined_ore.yield 1, strain.max 2` | `walk_the_slide` "Walk where it slid" | `g.stone < g.stone.max` | `stone: 2` | `strain.discount 0.25, focus.max 2` | `t_school_earth` |
| formation | `fix_the_layout`: `rest.rate 0.25, breath_gathering.rate 0.25` | `open_the_layout` "Open a layout" | `g.inked_tokens < g.inked_tokens.max` | `inked_tokens: 1, composure.exp: 10` | `qi.rate 0.01, home_space.max 1` | `t_school_formation` |

**Crossings**: `cross_<s>.require` → `g.first_direction > 0 && (g.<half1>.attuned || g.<half2>.attuned)`; descriptions say the held method is what carries you. `ridge_outskirts`'s scene text and the `src/content.ts` beats that say "four ways… choose a First Direction" become "four teachings; any sphere carried to four takes the First Direction".

**Shared stores** (`shared.json`):

| id | kind / group | require | initial / mod | notes |
|---|---|---|---|---|
| `focus` "Focus" | resource / Resources | `g.waystation > 0` | `{ value: 8, max: 8, rate: 0.02, open: false }` | desc "How long attention holds on bad ground; outings draw it down and Rest brings it back"; the `waystation` flag gains `mod: { "focus.open": 1 }`; Rest (`opening.json`) adds `focus` to its `fill` list and `effect: { focus: 0.1 }` |
| `hobby_slots` "Hobby" | resource | `g.hobby_slots.max >= 1` | `{ max: 0, open: true }` | value maintained by the engine |
| `pale_root` | resource / Resources | `g.refining > 0` | cap 10 | — |
| `settling_draught`, `marrow_draught`, `clear_pill` | resource / Preparations | `g.refining > 0` | `{ value: 0, max: 3 }` | dose stores |
| `specimen_case` | resource / Preparations | `g.craft_specimen_case > 0` | max 1 | kit |
| `refining` "Refining" | family / Families | `g.refining.open > 0` | `max 5`; `perLevel: { "pale_root.max": 2, "craft_settling_draught.rate": 0.1, "craft_marrow_draught.rate": 0.1 }`; `at { "2": { "pale_root_bank.yield": 1 } }` | beside the other families |

**Hobby marks**: `hobby: true` on `fragment_notes`, `breath_gathering` (opening), `body_drills`, `blade_drills`, `ground_drills`, `array_drills` (ridge) and `refining_drills` (basin). Not Rest, not `steady_attention`, not `channel_exercise`.

### 3b. `basin.json`

**Spine: route records → slide → Reedmarket.**

| id | kind/group | require | need / needtext | cost | length | strain | result / mod |
|---|---|---|---|---|---|---|---|
| `landslide_rise` "Climb the rise above the slide" | site/Sites | `g.route_records > 0` | — | — | 150 | `{ strain: 0.03, focus: 0.03 }` | `composure.exp 40, ground_reading.exp 30`; flag `bypass_known: 1`; `max 1` |
| `terrace_bypass` "Trace the terrace to Reedmarket" | site/Sites | `g.bypass_known > 0` | `g.second_direction > 0` "The Second Direction first; the terrace is a day's carry." | `{ herbs: 4 }` | 240 | `{ strain: 0.04, focus: 0.04 }` | `reedmarket: 1`, `coin: 20`; `max 1`; `boost: { flag: "current_carried", multiplier: 1.5 }` |
| `reedmarket` "Reedmarket" | flag/Milestones | `g.reedmarket > 0` | — | — | — | — | `initial.max 1`; desc names the three leaves still missing and the basin as the next stage |
| `reedmarket_work` "Carry for the market porters" | task/Work | `g.reedmarket > 0` | — | `{ vigor: 3 }` | — | — | `coin 10, coin_earned 10, labour.exp 4`; `lock: [waystation_work]` with warn |

Flags in `basin.json` (kind `flag`, group `Milestones`, `initial.max 1`, `require: g.<id> > 0`): `bypass_known`, `chime_timed`, `chime_explained`, `spur_reopened`, `reedmarket`, `second_title`. Only `chime_explained` and `spur_reopened` carry `mod`.

**Chime milestone.**

| id | kind/group | require | need / needtext | cost | length | strain | result |
|---|---|---|---|---|---|---|---|
| `chime_watch` "Sit out the dusk chime" | site/Sites | `g.unusual_chime > 0` | `g.qi_sense >= 4` | — | 120 | `{ focus: 0.04 }` | `qi_sense.exp 60, composure.exp 30`; flag `chime_timed: 1`; `max 1` |
| `relay_test` "Test the old relay stone" | site/Sites | `g.chime_timed > 0` | `g.composure >= 3 && (g.inked_tokens >= 2 \|\| g.veined_ore >= 2)` "Composure 3, and two tokens or two pieces of ore to mark the relay." | `{ inked_tokens: "2 * (g.inked_tokens >= 2)", veined_ore: "2 * (g.inked_tokens < 2)" }` | 150 | `{ strain: 0.02, focus: 0.05 }` | flag `chime_explained: 1`; `max 1` |
| `chime_explained` | flag/Milestones | `g.chime_explained > 0` | | | | | `mod: { "qi.max": 4, "composure.max": 1 }` |

**Spur milestone and the pill material.**

| id | kind/group | require | need / needtext | cost | length | strain | result |
|---|---|---|---|---|---|---|---|
| `spur_clearing` "Clear the slide on the spur" | site/Sites | `g.damaged_spur > 0` | `g.walking_staff > 0 \|\| g.weighted_stakes > 0` "A staff or shod stakes, from the bench." | `{ vigor: 4 }` | 180 | `{ strain: 0.05, focus: 0.02 }` | flag `spur_reopened: 1`, `stone: 4`; `max 1` |
| `spur_reopened` | flag/Milestones | `g.spur_reopened > 0` | | | | | `mod: { "strain.max": 2 }` |
| `pale_root_bank` "Dig the pale-root bank" | site/Sites | `g.spur_reopened > 0 && g.refining.open > 0` | — | — | 90 | `{ strain: 0.03 }` | `pale_root 3`; `at { "1": { "refining.max": 1 } }` |
| `dig_pale_root` "Dig pale root by hand" | task/Work | `g.pale_root_bank > 0` | — | `{ vigor: 3 }` | — | — | `pale_root 1` |
| `trade_pale_root` "Trade pale root" | task/Trade | `g.reedmarket > 0` | — | `{ pale_root: 3 }` | — | — | `coin 12` |

The `chime_leaf` and `spur_leaf` flags are not set by `relay_test` or `spur_clearing`; the leaf teachings below are claimed by click so they are owned and tagged.

**Slip leaves** (six of the nine; `kind: teaching`, group Purchases, `tags: ["t_leaf"]`, `max 1`). `t_leaf` is read by `keeper_leaf.need` and by a Second Direction pointer.

| id | require | need / needtext | buy | mod (patches chapter one, rule 14) |
|---|---|---|---|---|
| `shu_three_leaves` "Shu's three leaves" (also the pill teaching) | `g.slip_leaves > 0` | `g.lore >= 5` "Lore 5: the three leaves are in the old hand." | `{ herbs: 12, coin: 30 }` | `"refining.open": 1, "breath_gathering.rate": 0.25, "lore.max": 1` |
| `chime_leaf` "The relay keeper's leaf" | `g.chime_explained > 0` | — | `{}` (free; claimed by click) | `"qi_sense.mod.qi.max": 1` |
| `spur_leaf` "The shelter's leaf" | `g.spur_reopened > 0` | — | `{}` | `"composure.mod.strain.max": 1` |
| `keeper_leaf` "Keeper Han's leaf" | `g.waystation > 0` | `g.t_leaf >= 3` "Three leaves in hand; Han trades his for the set." | `{ coin: 40 }` | `"circulation.mod.life.max": 1` |

**Sphere teachings** (teaching, Purchases, `max 1`). Each raises its family cap +2 (ridge 5 → First Direction 8 → 10) and reveals the sphere's pair, site, recipe and commission.

| id | require | need / needtext | buy | mod |
|---|---|---|---|---|
| `conditioning_sheets` "The conditioning sheets" (body) | `g.waystation > 0 && g.circulation >= 5` | `g.lore >= 5` "Lore 5, to read the sheets." | `{ herbs: 6 }` | `circulation.max 2` |
| `tam_lessons` "Old Tam's second lesson" (sword) | `g.waystation > 0 && g.blade_intent >= 5` | `g.lore >= 5 && g.coin >= 20` "Lore 5, and twenty coin for Tam's time." | `{ coin: 20 }` | `blade_intent.max 2` |
| `current_accounts` "The ground-current accounts" (earth) | `g.waystation > 0 && g.ground_reading >= 5` | `g.lore >= 5` "Lore 5, to read the accounts." | `{ herbs: 6 }` | `ground_reading.max 2` |
| `overlay_plan` "The survey overlay" (formation) | `g.waystation > 0 && g.array_craft >= 5` | `g.lore >= 5` "Lore 5, to read the overlay." | `{ herbs: 6 }` | `array_craft.max 2` |
| (pill) `shu_three_leaves` above opens `refining` | | | | |

**Pill sphere entry**: `refining` (family, in `shared.json`, above); `clay_vessel` (arrangement, Home, `require: g.refining.open > 0`, `buy { coin: 20, timber: 2, herbs: 4 }`, `space 1`, `mod { "refining_drills.rate": 0.25 }`, `max 1`); `refining_drills` (task, Practice, `length: "continuous"`, `hobby: true`, `require: g.refining.open > 0`, `need: g.clay_vessel > 0 && g.refining < g.refining.max`, `effect { "refining.exp": 3, "herbs": -0.02 }`, `train: refining`). The entry records read `g.refining.open` (the family opened by Shu's leaves), since `g.refining` is the level and the drills are what raise it; the deep pill pair reads `g.refining > 0`, a level earned.

**Deep pairs** (technique, Techniques, `attune: true`, `cost { qi: 5 }`, `at { "5": { "<id>.discount": 0.15 } }`, `lock` sibling, `warn`, `tags: ["t_school_<s>", "t_deep_<s>"]`; `require` = the sphere's teaching `> 0` (pill: `g.refining > 0`)).

| sphere | id | need | result | held |
|---|---|---|---|---|
| body | `temper_the_marrow` "Temper the marrow" | `g.strain < g.strain.max` | `strain 4, life 2` | `life.max 4, guard.max 2` |
| body | `carry_without_rest` "Carry without rest" | `g.vigor < g.vigor.max` | `vigor 8` | `vigor.rate 0.05, speed.max 0.3` |
| sword | `sever_the_knot` "Sever the knot" | `g.whetstone_grit < g.whetstone_grit.max` | `whetstone_grit 3` | `strike.max 3` |
| sword | `send_the_intent` "Send the intent ahead" | `g.whetstone_grit < g.whetstone_grit.max` | `whetstone_grit 2, composure.exp 20` | `hit.max 10, dodge.max 5` |
| earth | `root_to_the_vein` "Root to the vein" | `g.veined_ore < g.veined_ore.max` | `veined_ore 3` | `guard.max 2, strain.discount 0.25` |
| earth | `listen_for_water` "Listen for water" | `g.focus < g.focus.max` | `focus 4` | `focus.max 3, qi_sense.rate 0.05` |
| formation | `anchor_the_array` "Anchor the array" | `g.inked_tokens < g.inked_tokens.max` | `inked_tokens 3` | `home_space.max 1, craft_warding_strip.rate 0.25, craft_specimen_case.rate 0.25` |
| formation | `ward_the_threshold` "Ward the threshold" | `g.focus < g.focus.max` | `focus 3` | `dodge.max 10, rest.rate 0.25` |
| pill | `draw_the_essence` "Draw the essence" | `g.pale_root < g.pale_root.max` | `pale_root 2` | `craft_settling_draught.rate 0.5, craft_marrow_draught.rate 0.5, craft_clear_pill.rate 0.5` |
| pill | `temper_the_fire` "Temper the fire" | `g.herbs < g.herbs.max` | `herbs 4` | `strain.max 2, life.max 2` |

**Sphere sites** (site, Sites, no `max`, `boost: { flag: "current_carried", multiplier: 1.5 }` like the ridge sites, `at { "1": { "<family>.max": 1 } }`):

| id | require | length | strain | result |
|---|---|---|---|---|
| `scree_climb` "Climb the scree under load" (body) | `g.conditioning_sheets > 0` | 240 | `{ strain: 0.05, focus: 0.02 }` | `marrow_herbs 3, circulation.exp 40` |
| `rope_gallery` "Cut the fouled gallery lines" (sword) | `g.tam_lessons > 0` | 240 | `{ strain: 0.03, focus: 0.04 }` | `whetstone_grit 3, blade_intent.exp 40` |
| `undercut_bank` "Read the undercut bank" (earth) | `g.current_accounts > 0` | 240 | `{ strain: 0.03, focus: 0.04 }` | `veined_ore 3, ground_reading.exp 40` |
| `relay_stones` "Walk the relay stones" (formation) | `g.overlay_plan > 0` | 240 | `{ strain: 0.02, focus: 0.05 }` | `inked_tokens 3, array_craft.exp 40` |
| (pill) `pale_root_bank` above | | | | |

**Commissions** (site, group `Commissions`, `max 1`, length 120, `tags: ["t_commission"]`, result `coin 40, coin_earned 40` plus the sphere line; `require: g.waystation > 0 && <sphere family> >= 6`):

| id | sphere | need | strain | extra result |
|---|---|---|---|---|
| `haul_the_stores` "Haul Han's stores up from the landing" | body (`g.circulation >= 6`) | — | `{ strain: 0.04 }` | `marrow_herbs.max 4` via `mod` |
| `recut_the_lines` "Recut the bridge lines" | sword (`g.blade_intent >= 6`) | `g.honed_edge > 0` | `{ focus: 0.04 }` | `whetstone_grit.max 4` |
| `shore_the_cellar` "Shore the ledger cellar" | earth (`g.ground_reading >= 6`) | `g.weighted_stakes > 0` | `{ strain: 0.04 }` | `veined_ore.max 4` |
| `lay_the_ward_lines` "Lay Han's ward lines" | formation (`g.array_craft >= 6`) | `g.warding_strip > 0` | `{ focus: 0.04 }` | `inked_tokens.max 4` |
| `stock_the_still_room` "Stock Han's still-room" | pill (`g.refining >= 3`) | `g.settling_draught >= 2` | — | `cost { settling_draught: 2 }`; `pale_root.max 4` |

Han's specimen-case commission from ADR 0016 is the kit recipe below, not a sixth commission.

**Craft additions** (recipe / preparation / purchase, Craft; recipes need `g.workbench > 0` in `need`):

| id | kind | require | need | cost | length | result | lasts / held |
|---|---|---|---|---|---|---|---|
| `craft_settling_draught` "Steep a settling draught" | recipe | `g.refining.open > 0` | `g.workbench > 0 && g.clay_vessel > 0 && g.pale_root >= 2 && g.herbs >= 2` | `{ pale_root: 2, herbs: 2 }` | 60 | `settling_draught 1`, `fill: settling_draught` | — |
| `craft_marrow_draught` "Reduce a marrow draught" | recipe | `g.refining >= 2` | `g.workbench > 0 && g.clay_vessel > 0 && g.marrow_herbs >= 2 && g.pale_root >= 1` | `{ marrow_herbs: 2, pale_root: 1 }` | 60 | `marrow_draught 1`, `fill: marrow_draught` | — |
| `craft_clear_pill` "Roll a clear pill" | recipe | `g.refining >= 3` | `g.workbench > 0 && g.clay_vessel > 0 && g.pale_root >= 3 && g.coin >= 5` | `{ pale_root: 3, coin: 5 }` | 90 | `clear_pill 1`, `fill: clear_pill` | — |
| `craft_specimen_case` "Fit Han's specimen case" | recipe | `g.waystation > 0 && g.lore >= 5` | `g.workbench > 0 && g.timber >= 3 && g.inked_tokens >= 1 && g.coin >= 10` | `{ timber: 3, inked_tokens: 1, coin: 10 }` | 90 | `specimen_case 1`; `max 1` | — |
| `deliver_specimen_case` "Deliver the case to Han" | purchase | `g.specimen_case > 0` | — | `{ specimen_case: 1 }` | — | `coin 40, coin_earned 40`; `mod { "craft_clear_pill.length": -30 }` (the reusable recipe improvement) | — |
| `take_settling_draught` "Drink a settling draught" | preparation | `g.refining.open > 0` | `g.settling_draught >= 1` | `{ settling_draught: 1 }` | — | — | `lasts 300`, `held { "strain.discount": 0.25, "focus.discount": 0.25 }` |
| `take_marrow_draught` "Drink a marrow draught" | preparation | `g.refining >= 2` | `g.marrow_draught >= 1` | `{ marrow_draught: 1 }` | — | — | `lasts 300`, `held { "body_drills.rate": 0.5, "scree_climb.rate": 0.25 }` |
| `take_clear_pill` "Take a clear pill" | preparation | `g.refining >= 3` | `g.clear_pill >= 1` | `{ clear_pill: 1 }` | — | `qi 6, focus 4` | — |

**Stances** (technique, group Techniques, `stance: true`, `require: g.waystation > 0`, no cost):

| id | held |
|---|---|
| `rooted_stance` "Rooted stance" | `guard.max 2, speed.max -0.2` |
| `open_stance` "Open stance" | `dodge.max 10, guard.max -1` |
| `pressing_stance` "Pressing stance" | `strike.max 2, dodge.max -5` |

**Fight** (optional, nothing gated behind it): `spur_pair` "Two men at the spur" (Fights, `require: g.damaged_spur > 0`, `cost { vigor: 4, herbs: 3 }`, length 60, `strain { strain: 0.06 }`, `encounter: { foe: { name: "the two at the spur", life: 18, strike: 10, guard: 6, speed: 1.2, hit: 80, dodge: 20, technique: { name: "the rush", every: 3, strike: 16 } }, success: { coin: 30, whetstone_grit: 4 }, failureText }` in the bandit's pattern). Sized against the real states: at the body line's waystation (Strike 9, Guard 8, Life 24) it reads a likely loss at about 41%, and the Rooted stance makes it a likely win at about 77%; at the sword line's waystation (Guard 2) it is lost.

**Home**: `ridge_room` "A room at the waystation" (home, Home, `require: g.waystation > 0`, `buy { coin: 90, timber: 4 }`, `mod { "home_space.max": 2, "ground_reading.rate": 0.1, "lore.rate": -0.1 }`, `slots: ["study"]`, no `lock`, `max 1`, desc "A room at the waystation kept beside the cottage"). Design plan B.5's Ridge Room, without closing the village home.

**The Second Direction** (breakthrough, group Practice as `first_direction`, `require: g.waystation > 0 && g.first_direction > 0`, length 300 (tuned from 240 when the blade-body route came in under the floor), `max 1`):

- core: `g.t_deep_body + g.t_deep_sword + g.t_deep_earth + g.t_deep_formation + g.t_deep_pill >= 2 && g.attune_slots >= 3`, coreLabel "Two spheres deepened, three methods held".
- pointers, `required: 3`: "A reliable method" `g.temper_the_marrow.reps + g.carry_without_rest.reps + g.sever_the_knot.reps + g.send_the_intent.reps + g.root_to_the_vein.reps + g.listen_for_water.reps + g.anchor_the_array.reps + g.ward_the_threshold.reps + g.draw_the_essence.reps + g.temper_the_fire.reps >= 10`; "The returning chime explained" `g.chime_explained > 0`; "A working study" `g.reading_desk > 0 && g.lore >= 6`; "The survey spur reopened" `g.spur_reopened > 0`; "A commission done" `g.t_commission >= 1`; "Four leaves recovered" `g.t_leaf >= 4` (ADR 0016's five plus the leaves; three required).
- bill `buy { herbs: 30, coin: 150 }` (thirty, not forty: the herb cap reaches 38 at most in chapter one, and the ridge room adds ten); `need: g.qi >= g.qi.max`, needtext "A full reservoir" (Foundation's pattern).
- `mod { "bank.max": 172800, "attune_slots.max": 1, "hobby_slots.max": 1, "lore.max": 2, "strain.max": 2, "focus.max": 2, "circulation.max": "3 * (g.t_deep_body > 0)", "blade_intent.max": "3 * (g.t_deep_sword > 0)", "ground_reading.max": "3 * (g.t_deep_earth > 0)", "array_craft.max": "3 * (g.t_deep_formation > 0)", "refining.max": "3 * (g.t_deep_pill > 0)" }`.
- events (ordered; every `when` includes `g.second_direction > 0 && g.second_title < 1`; `changes` sets `second_title: 1` and the title id): hybrids first, then Pill Refiner, then the pure titles.

`X.mod.Y` patches reach only derived fields (`max`, `rate`, `yield`, `discount`), so each title patches what a chapter-one family pays per level:

| order | title id | title | when | patch (`X.mod.Y`) |
|---|---|---|---|---|
| 1 | `mountain_vessel` | Mountain Vessel | `g.t_deep_body >= 1 && g.t_deep_earth >= 1` | `"stonework.mod.circulation.rate": 0.05` |
| 2 | `blade_body` | Blade Body | `g.t_deep_sword >= 1 && g.t_deep_body >= 1` | `"labour.mod.blade_intent.rate": 0.05` |
| 3 | `earth_array_adept` | Earth Array Adept | `g.t_deep_earth >= 1 && g.t_deep_formation >= 1` | `"stonework.mod.inked_tokens.max": 1` |
| 4 | `intent_warden` | Intent Warden | `g.t_deep_sword >= 1 && g.t_deep_formation >= 1` | `"composure.mod.whetstone_grit.max": 1` |
| 5 | `pill_refiner` | Pill Refiner | `g.t_school_pill >= 1` (the pill school key, read here as the First titles read theirs) | `"herbcraft.mod.pale_root.max": 1` |
| 6 | `iron_marrow_adept` | Iron Marrow Adept | `g.t_deep_body >= 1 && g.circulation >= g.array_craft` | `"labour.mod.circulation.rate": 0.05` |
| 7 | `spirit_blade` | Spirit Blade | `g.t_deep_sword >= 1 && g.blade_intent >= g.ground_reading` | `"composure.mod.blade_intent.rate": 0.05` |
| 8 | `deep_listener` | Deep Listener | `g.t_deep_earth >= 1` | `"stonework.mod.stone.max": 1` |
| 9 | `array_keeper` | Array Keeper | `g.t_deep_formation >= 1` | `"composure.mod.array_craft.rate": 0.05` |

Because the core wants two spheres and every pairing of two of body, sword, earth and formation except body-formation and sword-earth is a hybrid, and any pairing with the pill is Pill Refiner, the pure titles fall to those two pairings and are told apart by the sphere trained higher.

Nine title records (`kind: class`, group Purchases, `title`, `require: g.<id> > 0`, `max 1`), each with the one patch above; `second_title` flag in `basin.json`.

## C2.4 The slip's leaves

The ledger lists twelve leaves; three stayed below (the slip the player holds). This chapter recovers six of the other nine: **Shu's three** (the old hand's refining leaves, which open Refining), **the relay keeper's** (found when the chime is explained), **the shelter's** (found when the spur is cleared) and **Keeper Han's** (traded for the set once three are in hand). Each is a `t_leaf` carrier and each patches chapter one: Shu's speed the slip's breath practice and lift Lore's cap; the relay keeper's makes every level of Qi Sense hold a point more qi; the shelter's makes every level of Composure carry a point more Strain; Han's makes every level of Circulation add a point of Life. After the four records `g.t_leaf` reaches 4 (Shu's three count as one record), the Second Direction's sixth pointer. **Three leaves remain for the basin**, named by the Reedmarket flag's description.

## C2.5 Session script

Beats, not a schedule; the measured run belongs to the simulation report.

| # | beat |
|---|---|
| 1 | The waystation. Four leads on the board; Focus appears beside Strain; three stances on the Techniques tab, free to take. Han's ledger room: his leaf wants three others first. |
| 2 | The route records: climb the rise above the slide (Strain and Focus both draw); the terrace to Reedmarket is seen and wants the Second Direction. |
| 3 | The chime: sit out the dusk (Qi Sense 4), then test the relay with tokens or ore (Composure 3). The chime is explained: qi +4, Composure +1, the relay keeper's leaf. |
| 4 | The spur: a staff or shod stakes from the bench, then three minutes clearing the slide. Strain +2, the shelter's leaf, stone; the pale-root bank once Refining is open; two men waiting, optional. |
| 5 | The sphere teachings at Lore 5 and a family at 5: the sheets, Tam's second lesson, the accounts, the overlay; Shu's three leaves open Refining and the clay vessel. Each reveals a deep pair, a site, a commission. |
| 6 | The second commitment inside a sphere: one half of its deep pair into an attunement place, the other closes with a warning. The sphere site raises the cap; the commission at family 6 pays coin and a material cap. |
| 7 | The bench: draughts that last five minutes, the clear pill, Han's specimen case delivered for coin and a faster pill. A fourth place after the First Direction holds a third method. |
| 8 | "Take the Second Direction" shows the core (two spheres deepened, three methods held) and 3 of 6; the bill wants a full reservoir. Four minutes. The title is derived from what is held and named in the banner; a fifth place and the hobby slot open; the bank keeps three days. |
| 9 | A hobby in the second place at half pace; the terrace to Reedmarket (four minutes, herbs); arrival. The market porters' work closes the waystation's; pale root trades; the three remaining leaves are named. |

## C2.6 Interface

ADR 0031's consequences, in the shell's terms (design plan C.6 stands):

- Body panel: Focus after Strain (`bodyIds`).
- Tasks tab: a Commissions group after Sites. Techniques tab: a Stances group with **Take** / **Taken** instead of Attune/Use, excluded from the techniques group; the header's "N of M places" gains "· Stance: X".
- Runner: under the current activity a `data-ui="hobby"` line "Hobby: <name> (half pace)" with **Stop**, hidden while `hobby_slots.max < 1`; continuous cards gain a **Hobby** button when the slot exists, calling `startHobby` after `settle()` like every action. The waiting-list runway probe ignores the hobby.
- Craft tab: an in-effect block ("X · 4:12 left") under Preparations; cards with `lasts` say "lasts 5 min" in the tooltip's `time` block.
- Fight pane: the foe line names the technique ("every third swing: the rush, Strike 12"); the flip hint's stance candidate renders as the engine words it.
- Character: the title from `engine.title()`; the Route keys section lists the new keys from `routeKeys`.
- At ≤ 650 px the hobby line stacks under the activity line; nothing else new.

## C2.7 Validator bands and routes

`bun run validate` is the acceptance:

| band | value | measured from |
|---|---|---|
| `SECOND_FLOOR` … `SECOND_CEILING` | 1800 … 3600 s of activity | the waystation to `second_direction`, on each of nine deep routes |
| `ARRIVAL_WINDOW` | 900 s | `second_direction` to `reedmarket` |
| `BASIN_TIMED_CEILING` | 300 s | every timed basin record; village and ridge keep 180 |
| Foundation, ridge | unchanged (480–780 s; 720–1440 s) | the existing routes |
| places | 5 | the most places any route reaches must be held at once by some route (rule 74) |

Ten deep routes continue from the ridge routes' end state, at least one per title. Every route deepens two spheres, since the core asks for two: the pure titles come from the non-hybrid pairings (body with formation, sword with earth), resolved to the sphere trained higher; the pill routes pair a ridge sphere with the pill. Pure body (body + formation, *Temper the marrow* and *Ward the threshold*, the Rooted stance, the spur fight won once it is likely), pure sword (sword + earth, Pressing), pure earth (earth + sword, Open), pure formation (formation + body, the specimen case), pill (body + pill, *Draw the essence*, the refining drills as the hobby once the place exists, every draught), pill-fire (earth + pill, *Temper the fire*), mountain-vessel (body + earth), blade-body (sword + body, the spur fight lost first at the sword line's stats), earth-array (earth + formation), intent-warden (formation + sword). The second sphere also holds the other half of its ridge pair, so both halves of every ridge pair are witnessed. Every title, both halves of every pair, every commission, every stance, `spur_pair`, `ridge_room`, the draughts in effect and the specimen case must be witnessed. Grammar: `hobby` only with `length: "continuous"` and no `autoStart`; `stance` only on a technique with `held` and without `attune`, `cost`, `length` or `result`; `lasts` only on a preparation, a positive integer, and `held` on a preparation only with `lasts`; a technique whose `lock` names a technique must be locked back by it and carry a `warn` (the opening's channel and hollow readings share no key, so the pair rule asks for the lock alone); `foe.technique.every` an integer ≥ 2, `strike` an integer ≥ 0. The runner cuts timber to a floor of six on these routes, stops gathering herbs above the bill, and keeps wages going while a Vigor-paid method still needs uses.

Tuning order if a band fails: too fast, lengthen the sphere sites to 240 s and the Second Direction to 300 s before touching bills; too slow, cut the commissions to 90 s and the teachings' Lore need to 4 before touching drill rates.

## Save

Version 7: `hobby`, `effects`, `stance` join the state; v6 refused by name (ADR 0031 §7).
