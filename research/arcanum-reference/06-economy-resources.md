# 06: Economy and resources

106 resource records (`data-tables.md → Resources`), ~45 of them revealed in the owner's T4 save. The economy is **cap-first**: every resource has a `max`, most start tiny, and raising caps is the dominant purchase. Rates matter second.

## Groups (ledger order) and what caps them

| Group | Resources | Base max | Cap raisers (examples) |
|---|---|---|---|
| **Basic** | gold | 5 | Pouch ×3 (+10), Purse ×3, Satchel, Small/Iron/Ornate Chest, Vault, Treasure Room, Stash of Gold (∞), mounts (`gold.max +210` Wyvern), Emporium home |
| | stored time (`offlinetime`) | 3600 s | Chronomancy education (`+1800/level` patch), Hall "time skewer" grants 3600 to new wizards |
| **Knowledge** | research | 10 | per unit held: scrolls +1, codices +5, tomes +25, runestones/each rune +10; furniture (Calligraphy Set +5, Pedestal +10, Writing Desk +5, Academy home +50); skills per level (Herbalism +2, Mage Lore +5, Nature Studies +5) |
| | arcana | 0 | Mage Lore +1/level, Mysticism, Tomes via Arcane Archive (`0.05`/tome), House home +8 |
| | scrolls / codices / tomes | 10 / 10 / 5 | Scroll Rack 15, Bookshelf, Bookcase, Scriptorium 100, Library 200/100/60, Arcane Archive +5 tomes +50 codices |
| **Runes** | rune stones; fire/water/air/earth/nature/light/shadow/mana/chaos/time runes | 10 / 0 | Rune Pouch, Rune Chest, mastery skills (`+0.25 <elem>rune.max`/level via education) |
| **Gems** | gemstones; one magic gem per school (arcane, fire, water, air, earth, nature, light, shadow, spirit, blood, time, void, chaos) | 5 / 2 | Velvet Bag, Gem Box, Vault (35 gems, 10 each magic), Treasure Room (80 / 20), mounts (`gems.max +20` Flying Carpet) |
| **Materials** | herbs, potion base, ichor, iron, quicksteel, leather, serpent skin, cotton, spider silk, aetherhide, fine parts… | 10 / 3 / 5 / 50 | Herb Pouch ×4, Material Chest (∞), Herbalism +2 herbs/level |
| **Manas** (vitals pane, not ledger) | stamina, hp (life), vigor, barrier; mana; water/air/fire/earth; nature/spirit/light/shadow; tempus | 10 / 5 / 10 / 0; 0… | skills per level (`nature.max +1`), homes, upgrades (Arcane Body ×5, Occult Endurance ×7, Earth Soul), level (+1 stamina, +1 vigor, +2 life) |
| **Constructs / Undead / Astral / Conditions** | puppets, machinae, automata; bodies, bones, bone dust, souls; star shards, dreams; debt, instability, void contamination, blaze/scorch/inferno | module-specific | module furniture and upgrades |

A fresh game shows Gold 0/5, Stored Time 0/3600, Research 10/10 (after the first scroll), Scrolls. The first cap is hit in six clicks (`MECHANICS-STUDY §9`).

## Three idioms

### 1. Resources with modifiers: inventory is a build
43 resources carry `mod` (full list in `03-data-model.md`). Books are the canonical case: each tome held gives `research.max +25, research.rate +0.3, arcana.rate +0.001, lore.rate +0.01`. Consequences the player feels:

- The T3/T4 tier bills (5 and 15 tomes) are *costly* because paying them lowers research cap and rate.
- "Sell Tomes / Sell Codices / Sell Scrolls / Sell Herbs / Sell Gems" are separate Affluence tasks (`sellRate: 0.5` in the save); liquidation is explicit and lossy.
- Prosperity has a price: `domain_*` resources add `domain_danger +0.01` each, which spawns siege invaders.
- Debuffs are resources: `voidcontamination` (`stamina.max −0.9%` per unit) and `debt` (max 500; Borrow Money / Lend Gold tasks, Debt upgrade group: More Lenders, Creative Accounting, Enchanted Shackles, Cursed Gold, Burning Records).

### 2. Caps are raised by *holding* and *arranging*, rarely by spending alone
Storage furniture costs floor space (Small Chest 1, Vault 10, Treasure Room 20) so the home's `space.max` is the meta-cap on every other cap. Mounts and homes carry caps too (Wyvern: `gold.max +210, gems.max +21, dist +230`). This is why the Home tab matters in a game about numbers: it is where caps live.

### 3. Conversion is a furniture class, not a task
20 converter furniture records run continuously while owned and shown under Home → **Converters**: Arcane Alembic (`mana 0.05 + gems 0.01 → managem 0.01`), Vital Alembic (`hp 0.2 + gems 0.01 → bloodgem`), Verdant Alembic (nature → naturegem), Elemental Siphon (`element 0.75 → mana 0.5`), Elemental Flux (`mana 2 → element 0.25`), Scriptorium Pyre (`fire + scrolls → kindling`). Converters make the mana/gem economy passive at T4 without an action slot. Gem creation is otherwise a timed task: **Craft Gem** (`crafting ≥ 7 && alchemy ≥ 5`, 10 s base, `run stamina 1 + mana 2`, `→ gems 1`, `fill: gems`) and the **Imbuement** group ("Imbue Gem (Nature)" etc.) turns gemstones into magic gems one school at a time.

## Income tasks (Affluence group, T4 view)

Smith (`stamina 0.4/s`, 11 s, `gold 14.5`), Arcane Thievery (evil), Offer Services, Spin Gold, Hold Seance, Treat Ailments (virtue), Read Palms, Machinae Salvage, Borrow Money / Lend Gold, Prison Labor (greyed), plus the five Sell tasks. Gold rate mods come from jobs (`falconer: gold.rate +0.1`), homes (`innroom: gold.rate −0.25`, Inn `+0.4`), and the Shop/Emporium line. There is no "idle gold per second" by default; rest produces only vitals and a trickle of research/nature. Income is an *activity choice* competing for the same slot as training.

## Money sinks by stage

| Stage | Main sink | Typical magnitude |
|---|---|---|
| Apprentice | Pouch/Purse/Satchel, Scroll, Apprentice (20 gold) | 5-30 gold |
| Neophyte → T0 | Steed (Mule 100), Library Haul, Aided Thoughts (150 research), tuition (200 gold) | 100-300 |
| T1-T2 | Furniture (Arcane Archive 400 gold + 400 research), skills (arcana), tier bill (300 → 1000 gold) | 300-1000 |
| T3-T4 | Mounts (Flying Carpet 300 gold + 300 research + 20 gems + 5 airgem; Wyvern 2000 gold + 5 gems), converters (2500 gold + 100 gems), domain builds, tier bill (2500 → 5000 gold) | 1000-5000 |
| T5+ | Tier bills in tomes/runestones; Hall (15000 gold, 35000 research, 50 gems, 50 tomes per wiki) | 10⁴ |

Prices escalate with the player's own progress in data (`cost: "500+g.sword_lessons*500 research"`, `"5*Math.pow(2,g.occultendure) research"`).

## Loot and selling

Monsters drop gold, gemstones and crafting materials with a base `%` chance scaled by **Luck** (+1% relative per point, `gloss_luck_stat`). Drops land in the Equipment tab's **Loot** list (`drops` in the save) with Take / Sell / Sell All; equipment sells at `sell` value or half cost. Dungeon first-clears (`once`) pay titles, gems, tomes and `fame` (notoriety → Hall prestige).

## Rules this implies

1. Start every resource capped and small; make the first cap raiser the next thing on screen.
2. Put caps on *things the player keeps* (storage, mounts, homes, held books), so wealth and capacity are the same decision.
3. Give some resources a modifier for being held; make liquidation an explicit, lossy action.
4. Model passive conversion as owned furniture (space-limited), not as another slot activity.
5. Price advancement in the slow shared currencies on an escalating curve; price specialisation in the line's own gems.
