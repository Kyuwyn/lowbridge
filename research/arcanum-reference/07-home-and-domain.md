# 07: Home and domain

The Home tab is where caps, sources and passive conversion live; Domain (Siege) is the late-game layer where the home becomes territory with enemies. Homes: 45 records (`data-tables.md → Homes`; wiki table with stable-0.12.0.0 numbers in `wiki-notes.md §7`). Furniture: 128 records. Domain/siege: `modules/sieges.json`, `gloss_domain_and_siege`.

## Homes

A home is an exclusive-slot record (`slot: home`) whose `mod` sets `space.max` (furniture capacity) and usually a rate/cap bias, with `tags` that act as **sources** for skills, and `lock`/`disable` on the homes it replaces.

| Home (save path) | require | buy | space | other mods / tags |
|---|---|---|---|---|
| alcove | apprentice | — | 5 | — ; locked by Attic |
| atticbedroom | neophyte | — | 10 | — ; `disabled` in save (outgrown) |
| innroom | tier0 (auto) | — | 12 | `gold.rate −0.25`; disabled by any T0 home |
| camp | tier0, naturelore ≥ 5 | — | 14 | `outdoors, starsource, t_mobilehome`; lore/research rate −0.1 |
| wildcamp | T2, nature line | — | 150 | nature/air/water caps, steed distance |
| home_waterfall | T1, nature 6, water 6 | — | 50 | `watersource`; research/lumen penalties |
| home_idrasil_sprout → sapling → tree | nature 8 + arcana 8; Nourish Sprout; Nourish Sapling | sapling: 15 gems + 25 herbs | 150 → 300 → 400 | `outdoors, starsource`; `minions.max 10`; nature rate 0.25 → 0.5 → 1 |

The save shows 23 home records revealed, 6 owned over time (attic, camp, waterfall, wildcamp, sprout, sapling) and the current one `home_idrasil_sapling` with **Floor Space 128 / 387** (300 from the home + furniture that adds space such as Basement/Cellar/Expanded Cellars upgrades in the Housing group).

Home progressions are **one-way constructions**: "Nourish Sapling" is a 3-minute Construction Task costing 30 gems + 50 herbs and draining `nature 2/s, earth/water/light 1.25/s, naturegem 1/s, lightgem 0.5/s, earth/water runes 0.025/s`, and it `lock`s the Sapling. The same pattern upgrades Waterfall → Cataract, Mouldering Palace → Palace, Crumbling Castle → Castle (Housing upgrade group: Excavate Waterfall, Castle Restoration, Palace Restoration, Establish Caravan, Build Emporium, Found Collective).

Homes express **line identity in numbers**: Cave (earth/shadow up, research/light down), Camp (outdoors/stars, research down), Shop/Inn/Emporium (gold rate/max), Academy (research), Clockwork Home (constructs), Tomb/Necropolis (undead storage), Volcanic Lair (fire). A nature wizard literally lives in a tree.

## Furniture

Each record: `cost` (gold/research/materials), `mod` with `space: N` (space consumed; shown as the first column), `max` ownership count (1, 3, 5, 20, ∞), `require`, optional `need` (another furniture: Elemental Siphon needs Workshop), `tags` (sources), `sell`, `convert`, `slot: bed`.

What furniture does, by role (counts from the T4 Home list of 86 visible items):

| Role | Examples | Mechanism |
|---|---|---|
| **Storage / caps** | Small Chest (1 space, gold), Iron Chest ×5, Ornate Chest ×5, Vault ×5, Treasure Room ∞ (20 space), Scroll Rack ×5, Bookshelf ×5, Bookcase ×20, Rune Chest ×5, Material Chest ∞, Stash of Gold ∞, Gem Box | `<res>.max +N` |
| **Research / rates** | Writing Desk, Calligraphy Set, Pedestal, Personal Study, Arcane Archive ×3 (`tomes.max +5, codices.max +50, codices.rate +0.01, Tomes ➢ Max Arcana 0.05`), Library (75 space), Lexyrinth (40) | `research.max/rate`, resource-mod patches |
| **Sources** (skill `need`) | Potted Milkweed / Garden (plantsource), Water Basin (watersource), Bonfire/Campfire/Fireplace/Cleansing Fire (firesource), Brass Candelabra / Holy Candle (lightsource), Somber/Unholy Candle, Dark Shrine (shadowsource), Telescope/Orrery (starsource), Clepsydra (timesource), Spinning Wheel (weavesource), Crafting Table / Workshop (workspace), Enchanting Table (enchantsource), Binding Circle (summonsource), Armory / Training Dummy (armssource) | tag presence |
| **Production** | Scroll Loom ×3, Codex Loom ×3, Tome Loom ×3, Runic Printing Press, Dwarven Runecrafter ×4, Skeletal Runecarver ×5, Herb/Gem/Scroll Monger ×2, Gold Pile, Puppet-Making Workshop | `<res>.rate` or converters |
| **Converters** | Arcane/Verdant/Vital Alembic ×5 each, Elemental Siphon/Flux ×2, Scriptorium Pyre | `convert {input, output}` (see `06`) |
| **Body / rest** | Cot, Wooden Bed, Fourposter, Luxury Bedroom (slot `bed`: rest effect), Medical Facility, Fountain, Pond, Sand Garden | rest effect mods, stress |
| **Minions / summons** | Rusty Cage ×3, Menagerie, Stables (mount `need`), Vivarium, Gargoyle/Grotesque ×4 (shadow), Reliquary | `minions.max`, companion/mount gates |
| **Domain** | Guard Post, Archers' Tower (Domain → Infrastructure) | zone obstacles |

Space costs range 1-100 (Ziggurat 100, Library 75, Banquet Hall 50, Workshop 50). The list is sortable by Floor Space or Furnishing and filterable Maxed/Owned/Unowned/Blocked; owned items show **Max** when at count cap and can always be **Sold** (sale returns the `sell` value, typically half; furniture `sell` is explicit on 12 records).

Furniture requirement strings are the usual language: `require: g.tier4>0&&g.mana.max>=30` (Elemental Siphon), `need: workshop`. Many are only *visible* once a skill level is reached, so the Home list grows alongside the Skills tab.

## Domain and siege (T3+ module)

Any **Domain** upgrade (Upgrade group "Domain": Village, Farms, Stone Wall, Strange Fruits, Scribes' Hall, Artisans' Quarter, Alchemists' Workshops, Raise Storm, Fire Trenches) unlocks the **Domain** tab and `domain_*` resources (`domain_happiness` max 100 in data, 200 in save). From `gloss_domain_and_siege`:

- Domain upgrades are "powerful sources of resources, but bring their own troubles": each domain resource adds `domain_danger +0.01`.
- When danger > 0, **invaders** (16 records: Bandit, Bandit Brute, Bandit Lord, Goat Bandit…) spawn on a timer (`siege: {spawnTime 60, timeRemaining 27}` in the save; "Time to next spawn: 25 s", "Danger Level: 4" on screen). Invaders may be up to 3 levels below or 1 above the danger level.
- They must cross **zones** (4 records; default only "Approach"; walls/guard posts add more): Outside Territory → Approach (Travel obstacle) → Guard Post (Battle) → Walls → Crossing the Walls (Travel) → Battlements (Battle) → Domain (Loot). Each zone has an **obstacle** (distance or guards) that invaders overcome at per-invader `rates`, and **conditions** that raise their attrition (`resilience`). Reaching the Domain applies `onRaid` (damages domain resources).
- Defence is bought as furniture (Guard Post, Archers' Tower) and upgrades; "Rain Arcane Fire" is a Domain task. Invaders have their own Bestiary sub-tab.

It is a tower-defence minigame rendered as a table of zones, fed by the same record vocabulary (`require`, `rates`, `onRaid`), with the log showing "Bandit Brute is attacking (x3)". It exists so that late-game prosperity has a maintenance cost, the only system in the game that *pushes back*.

## Rules this implies

1. Make the home an exclusive slot with a capacity number that bounds all other caps; make furniture the only way to spend that capacity.
2. Put skill **prerequisites on arrangements** (source tags) so the home screen is a progression screen.
3. Make home upgrades one-way constructions with multi-resource drains: a visible milestone project per stage.
4. Let homes bias rates by line so the choice of where to live is a build choice.
5. Late prosperity should create a maintenance loop (siege) rather than only bigger numbers.
