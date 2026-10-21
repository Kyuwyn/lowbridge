# 08: Adventure and combat

Adventures are slot activities with floors instead of seconds. There are three kinds: **dungeons** (34, combat), **locales** (24, noncombat encounters with stress), **clashes** (8, unreturnable boss fights), plus 343 encounters, 357 monsters, 16 invaders. Rules in the author's words: `glossary-verbatim.md → combat, exploration, stats`. Numbers: `data-tables.md → Dungeons / Locales / Clashes / Distance sources`.

## Adventure as a record

```json
{"id":"rithel","level":10,"require":"g.evil2<=0&&g.history>=7&&g.loc_treffil>0",
 "run":{"stamina":0.33},"result":{"arcana":1.5,"research":10,"scrolls":"1~4"},
 "encs":["enc_chest2","enc_gnome","enc_primer2","enc_hettie","enc_delki","brightvista", …12]}
```
```json
{"id":"wolf","level":18,"kind":"beast","hp":16,"dodge":30,
 "attack":{"name":"bite","kind":"pierce","damage":"2~4"},
 "loot":{"leather":{"%":"40%","value":"2~4"}}}
```

- `length` = floors (5 for Training Grounds; 10-40 typical; 100 Below Mt Gorborung; 400 Unstable Spire; 1000 Catacrypts / Peregrination).
- `dist` = required Distance (player stat `dist`, base 5). `run` = per-second drain while inside (stamina 0.2-3.5/s). `spawns`/`boss` pick monsters per floor; `encs` list encounters for locales; `at` curves raise rewards with clears; `once` = first-clear rewards; `result` = every-clear payout.
- Progress persists across leaving and dying unless a *different* adventure is entered (`gloss_adventures`); clashes reset (`unreturnable`).
- `difficulty` is displayed as glyphs: 🦴 ×1-3 for early, 💀 ×1-6 later; "the number of skulls roughly correlate to the Tier" (`gloss_dungeons`). Locales show a numeric `Level`.

### Distance is the gate

`dist` base 5; raised by mounts (slot `mount`: Mule 15 → Flying Carpet 105 (testing) / 300 (wiki) → Wyvern 230 → Fly 525), Travel skill and Chronomancy education (`dist +3%`/level), upgrades (Travel Map, Travel Pack, Tenwick's Travel Map, Leggery, Manual of Legs), homes (Caravan steed distance 50), Animal Handling education. The save has `Distance: 976` with a Flying Carpet. Dungeon ladder by `dist` (testing build):

| dist | Dungeon | diff | floors | | dist | Dungeon | diff | floors |
|---:|---|---|---:|---|---:|---|---|---:|
| 0 | Leaky Cellar | 🦴 | 10 | | 120 | Elemental Rift | 💀 | 30 |
| 1 | Training Grounds | — | 5 | | 150 | Great Bog / Ettinmarch / Fetid Barrows | 💀💀💀 | 24-28 |
| 5 | Treffil Woods Edges | 🦴 | 14 | | 210 | Skittering Caverns | 💀💀 | 30 |
| 10 | Stony Hills | 🦴 | 12 | | 300 | Mount Gorborung | 💀💀 | 36 |
| 20 | Goblin Camp | 🦴🦴🦴 | 28 | | 500 | Seredite Temple | 💀💀💀 | 25 |
| 40 | Orc Camp | 💀 | 22 | | 800 | Below Mt Gorborung | 💀💀💀💀💀💀 | 100 |
| 60 | Under Den | 🦴🦴🦴 | 20 | | 1000 | Elemental Plane | 💀💀💀💀 | 24 |
| 80 | Arag Wastes / Veldran's Storehouse | 💀 / 💀💀 | 20 | | 1200-1500 | Abyssal Depths, Catacrypts, Charred Keep | 💀💀💀💀💀 to 💀💀💀💀💀💀 | 25-1000 |

The player's Distance therefore meters *which content exists*, and mounts (gold + gems) are the main lever, a second axis of unlock independent of skills and tiers. Locales use the same gate (Peregrination `dist 1149`, `need: Wander ×100`).

## The combat turn

From `gloss_combat`, `gloss_extracombat_stat`, `gloss_potencies_stat`, `gloss_resist_stat`, and the live view:

1. Each side acts on a **speed timer** (base turn 3.8 s; `speed` stat +1 per 3 levels; Time Walk +1.5). The yellow bar under each combatant is that timer.
2. On the player's turn: **one weapon attack** (cycling through attack sources: weapon, shapeshift natural weapons like Fearsome Claws / Devouring Maw, mount free-actions) **and one spell** from the memorized list, **top to bottom cyclically**. `chainhit`/`chaincast` ("Extra Attacks" / "Extra Spell Casts") add whole extra actions or a fractional chance.
3. Hit uses `tohit` vs the target's `dodge`; damage `min~max` × **potencies** (multiplicative: `spelldmg × naturedmg`; shown as percentages on the Player tab; Nature Potency 138% in the save), reduced by **resists** (percentage; monsters can be immune, players cannot), **defense**, **barrier** (depleted before life; regenerates 10%/s out of combat per wiki), **thorns/reflect**.
4. DOTs (`dot` on 91 spells) tick with a `kind`; **Status Negation** is a per-status chance to ignore the application.
5. Targeting: with summons present, half of untargeted attacks go to the wizard and half to allies (`gloss_summons`). Companions (slot `companion`, e.g. Wolf Companion: level 20, 170 hp, two slash hits with leech) are free and auto-spawn each fight; summons vanish on leaving; **minions** persist and have `minions.max` and level budgets.
6. Death: no penalty but recovery time; retry keeps floor progress; enemy HP persists if the player fled at full life (wiki).
7. Loot per kill by `%` × luck; floor clear → next floor; last floor → `result`/`once`, titles, `fame`.

Live view (`screens/combat-trainingrounds.webp`): header `⚔Arag Heights [Flee]`, floor bar `2.0/22.0`; Allies column: Wizrobe with a cyan barrier bar `70/70`, red life `302/302`, yellow timer; Wolf Companion `241/241`; Enemies column: Wolf `16/16`; a scrolling combat log ("Abdomen Tear hits Bandit for 11 damage", "Wolf Companion Steals 10.51 Life", "LOOT Gold"). The running pane shows `⚔Arag Heights 9%` and a G/H toggle like any task.

## Locales and stress

Noncombat adventures use **five stressors** as HP (`stressors.json`: befuddlement, unease, weariness, frustration, madness; max 10 each; `reverse: true`, `defeatstat`). Each encounter (`encounters.json`, 343) has `effect` (stress per second), `length` (clear time, 5-25 s), optional `result`/`loot`/`mod`, and `need`/`needtext` for conditional ones. Filling any bar ejects the player to rest until all are empty (Relax has `stress −1/s`, Composure −0.1/s per level, Calming Murmurs / Soothing Breeze spells, Concentration +1 max per level).

Encounters are shared across locales (Dusty Chest, Mystic Waters, Bright Vista, Occult Tapestry appear in several), which is how 24 locales are built from 343 encounters. **Sites of Learning** (📖, e.g. Musty Library, Genezereth, Hall of Ages) contain encounters whose `mod` raises a skill cap once ("Max World Lore: 1 (once)"); the Travelogue marks them Learned ✓. Locales pay **arcana** and books (`rithel: arcana 1.5, research 10, scrolls 1~4`), the resources dungeons do not.

## Clashes

8 records, `unreturnable: true`, 1-3 floors (Temple of Strativax: 3 floors at dist 900), each boss with a unique mechanic (`gloss_clashes`). Rewards on first clear; "encourage active play instead of idling"; the player is expected to quickslot spells and potions.

## Reference tabs the systems generate

- **Bestiary**: every monster met, with Level, Slain count, HP; hover for attacks, resists, loot. Unlocked by Mage Lore 11 or the Bestiary upgrade. Summons appear once cast (`mod: {"sum_lgspider.value": "?1"}`).
- **Travelogue**: per-locale encounter table (Clear Time, Visits, Learned), `??????` rows for undiscovered encounters, "Encounters Without Locale" for clash encounters. Unlocked with Travel 1.
- **Equipment → Loot**: untaken drops with Take / Sell.

## Equipment in one paragraph

17 equip slots (`equipslots.json`), most with `max 0` until upgrades open them (the save has Amulet 0/3, Limbs 1/2, Main hand 0/0 because the Protean's natural weapons occupy `limb`/`guts`/`skin`/`sense`). Items are **templates × materials × enchants**: weapons (41) and armors (77) are templates with `level`, `slot`, `only` (material kinds), base `attack`/`armor`; materials (29) `alter` the numbers and set enchant capacity (1 basic → 3 best); enchants (48) are bought once and applied per item for a smaller cost, limited by the Enchanting skill's power and an `enchantsource` furniture. Rares (47) are unique drops. Crafting tiers are the Crafting education rungs (Arms of Iron / Quicksteel / Adamant / Masterwork). Loot materials come from the dungeons whose completion also pays them (`gloss_equipment_crafting`).

## Rules this implies

1. An adventure is a slot activity with **floors** and a **distance gate**; distance is a separate progression axis bought with money.
2. Keep progress on leaving; make only the boss fights reset. Death costs time only.
3. One automatic attack + one cyclic spell per speed tick is enough for a readable auto-battler; quickslots are the active layer.
4. Noncombat sites need their own HP (five stresses) with their own healers; they pay the knowledge currencies.
5. Build locales from a shared encounter pool; tag the permanent-benefit ones so the reference tab can filter them.
6. Let play generate its own documentation (Bestiary, Travelogue), unlockable, searchable, and part of the reward.
