# 11: Mid-game snapshot: Wizrobe

The owner's save `Wizrobe (8).json` (`unstable 0.12.12.9`, last update 2026-10-19), loaded into the live testing build and read with the testing-build data. Reduced form in `save-wizrobe-analysis.json`; screenshots in `screens/`. This is what "mid-game" concretely means in the reference.

## Identity

| | |
|---|---|
| Classes (in order) | Apprentice → **Falconer** (job) → **Adept** (T0) → **Warden** (basic, nature) → **Shapechanger** (basic, shapeshift) → **Druid** (advanced, nature) → **Protean** (advanced, shapeshift) |
| Tier | 4 (Supreme Sorcery); T5 unlocker "Magic Immemorial" visible, 1 of 5 T5 quests done (Endless Stamina / Vivification) |
| Wizard level | 28 (exp 1043 / 1257) |
| Titles (15) | Waif, Apprentice, Falconer, Certified (worn), Master of the Cellar, Adept, Warden, Goblin Slayer, Shapechanger, Historian, Mountaineer, Spider Slayer, Druid, Mark of Ages, Protean |
| Morality | virtue 49.7, evil −3, alignment neutral; none of the three morality paths taken |
| Exclusive slots | home Idrasil Sapling · bed Fourposter · mount Flying Carpet · body Bear shape · leisure Nature Camp Rest · companion Wolf |
| Hall | A Hall wizard: event log contains "Timesplit upgrade from time fork technical addition" (Hall "Time Fork" granted Timesplit) |

Two lines, two classes each (`t_natureclass` 2, `t_shapeshiftclass` 2); the wiki's "three from one line" was not followed, and the T5 options reflect it (Kell needs Nature Studies 21 + Master of Nature + Fey).

## Vitals and resources

| Vital | cur/max | Resource | cur/max | Resource | cur/max |
|---|---|---|---|---|---|
| Life | 302 / 302 | Gold | 1,076 / 6,796 | Gemstones | 110 / 148 |
| Barrier | 70 / 70 | Stored time | 8,385 / 16,200 s | Blood gem | 67 / 79 |
| Stamina | 76 / 76.5 | Research | 876 / 5,400 | Earth gem | 30 / 63 |
| Vigor | 71.5 / 71.5 | Arcana | 100 / 100 | Water gem | 21 / 63 |
| Mana | 16 / 24 | Scrolls | 99 / 300 | Light gem | 13 / 63 |
| Nature | 44.5 / 44.5 | Codices | 56 / 210 | Nature gem | 8 / 63 |
| Water / Air / Earth / Fire | 18.8 / 16.4 / 14.3 / 9 | Tomes | 25 / 75 | Fire / Air / Spirit / Arcane / Shadow gem | 5 / 3 / 0 / 1 / 0 |
| Spirit / Light / Shadow | 15.4 / 13.8 / 18.2 | Rune stones | 15 / 15 | Herbs | 175 / 175 |
| Tempus | 8 / 8 | Debt | 0 / 500 | Potion base, Ichor, Iron, Quicksteel, Leather, Serpent Skin, Cotton, Spider Silk | 3/3, 5/5, 9/50, 26/50, 32/50, 30/50, 40/50, 34/50 |

Caps are the story: gold cap 6,796 from base 5 (×1,359); research 5,400 from 10 (×540); arcana 100 from 0. Several are **pinned at cap** (arcana, herbs, rune stones, tempus, nature). The cap, not the rate, is what the player is working against at T4 too.

## Skills (44 owned of 69)

| Skill | L / cap | Skill | L / cap | Skill | L / cap |
|---|---|---|---|---|---|
| Nature Studies | 25 / 26 (training) | Potions | 11 / 11.8 | Mysticism | 6 / 6 |
| Animal Handling | 21 / 18* | Trickery | 11 / 11.6 | Rejuvenation | 6 / 6.2 |
| Mage Lore | 20 / 20.9 | World Lore | 11 / 11 | Runic Lore | 6 / 6 |
| Crafting | 19 / 21 | Summoning | 11 / 11 | Charms | 6 / 6 |
| Anatomy | 18 / 18.2 | Magic Beasts | 10 / 10 | Animation / Debitomancy / Viriditas | 6 / 6 |
| Astronomy | 18 / 18.8 | Divination | 10 / 11 | Spellcraft | 5 / 5 |
| Herbalism | 15 / 15.8 | Lumenology | 10 / 10 | Concentration | 5 / 5.7 |
| Aquamancy | 15 / 15 | Pyromancy | 9 / 9 | Conjuration | 5 / 5 |
| Umbramancy | 14 / 14 | Shopkeeping | 9 / 9 | Weaving / Vivification / Mechanical Magic | 5 / 5 |
| Aeromancy | 14 / 14 | Spirit Communion | 8 / 8.3 | | |
| Geomancy | 13 / 13 | Alchemy / Puppetry / City Navigation / Martial | 8 / 8-9 | | |
| Languages | 12 / 12.6 | Composure / Enchanting / Planes Lore / Chronomancy / Scrying | 7 / 7-7.6 | | |

\*Animal Handling shows 21/18.0, a cap that *fell* after it was reached (a mod source removed), left at its earned level. Nature Studies at 25/26 is the only skill above 21; 30 of 44 are **at cap**. The player buys everything (`gloss_skills`: "no advantage in delaying or skipping any of them") and trains broadly; the line skills (Nature Studies, Animal Handling, Anatomy) carry the depth. Fractional caps (18.2, 20.9, 12.6) come from cross-feeders (Weaving → Crafting +0.1/level, etc.).

Education rungs owned: Nature Studies to **Supremancy**; Animals, Anatomy, Astronomy, Aquamancy, Mage Lore to Mastery; most others Competence/Expertise (Player tab list).

## Content touched

| System | Count |
|---|---|
| Upgrades purchased | 218 (of 279 visible), incl. 14× Holy Candle, 17× Somber Candle, 13× Wax Candle, 12× Unseen Scribe, 12× Ghost Compiler, 7× Occult Endurance, 7× Crystal Mind, 5× Arcane Body, 4× Library Haul, 4× Herb Pouch, 3× Pouch/Purse |
| Tasks ever completed | 127 distinct; most-run: Focus 74,240 (per-tick), Relax 11,746, Pace 5,174, Surrender Flesh 4,959, Offer Services 3,337, Craft Gem 603, Gardening 485, Sell Gem 414, Scribe Scroll 248 |
| Dungeons cleared | 17 (Elemental Rift ×4; everything through Seredite Temple; Below Mt Gorborung, Elemental Plane, Great Bog, Unstable Spire visible, 0 floors) |
| Locales cleared | 13 (Musty Library ×4, Explore Treffil Wood ×4, Genezereth ×2, Rithel, Hall of Ages…); Peregrination (1000 floors) visible, needs Wander ×100 |
| Clashes | 1 (Treffil Woods Survey) |
| Monsters met / encounters met | 112 / 113 |
| Spells learned | 18 (Nature 8, Earth 3, Air 2, Spirit 3, Charms 2, Mana 1, Shadow 1); 10 memorized; 6 quickslotted |
| Furniture | 26 pieces of 21 kinds; Floor Space 128 / 387 |
| Homes lived in | Attic → Camp → Waterfall → Wild Camp → Idrasil Sprout → Idrasil Sapling |
| Sections unlocked | 13 of 21 (Minions not yet; Domain yes) |
| Domain | Guard Post + Archers' Tower; danger level 4; bandit invaders spawning every 60 s |
| Inventory | 6 / 11 used: Wooden Training Hammer, Iron Spear, Dried Fungus Spore (trinket, `nature.rate` mod), Fresh En Gar, Water Vine Sash, Claws; natural weapons Fearsome Claws / Devouring Maw / Spines / Echolocation equipped in shapeshift slots |

## Running state at save time

Three slots: Relaxing (perpetual), Observing Nature (skill 25→26, 70%), Craft Gem (timed, `fill: gems`). Waiting: Spirit Anatomy. Goals/Hobbies capacity never purchased. Stored time 8,385 s banked (2.3 h) under a 16,200 s cap.

## What the snapshot says about shape

1. **Breadth is the default, depth is the choice.** 44/69 skills, 218 upgrades, 17 dungeons, 13 locales by T4; the catalogue is meant to be swept. Only three skills are above 20, and those are the line skills.
2. **Caps stay binding at mid-game.** Five resources pinned at cap; the T4 tier bill (250 scrolls, 65 codices, 15 tomes, 5000 gold, 25 gems) was paid against caps of 300 / 210 / 75 / 6,796 / 148, i.e. the bill is sized to **most of a full cap**, not to income.
3. **Repetition counts are large.** Thousands of Relax/Pace/Surrender Flesh completions; hundreds of Craft Gem. Timed tasks with `fill` run unattended for hours. The `at` curves (improvement at 25/75/300 casts; chores at 5/25/500) are tuned to those magnitudes.
4. **The home is the build's progress bar.** Six homes, each a construction or a line requirement; Floor Space 128/387 means a third of the capacity is in use and the rest is headroom for the next tier's storage.
5. **Automation arrived late and partially.** Three slots but no Goals/Hobbies at T4; the priority tools are optional comforts, the slots are the real power.
6. **Combat is a sideline for this build.** 18 spells, a companion that does most of the damage (Wolf: two 10-15 slash hits with leech), natural weapons from shapeshifting; dungeons are cleared once for first-clear rewards, then only Elemental Rift (gems) is repeated.
7. **Morality is skippable.** A T4 with virtue 50 and no path chosen; the morality ladder is a parallel option, and the T2 "Alignment Bias" quest was one of the two skipped.
