# 01: Shell and layout

Derived from the live testing build (`unstable 0.12.12.9`) with the T4 save loaded, at 1440×900 and 390×844. Screenshots in `screens/`; DOM class names are from the rendered page (Vue, scoped styles).

## The frame

One fixed-height page, no document scroll. Five regions, each scrolling internally:

```
┌ top-bar ──────────────────────────────────────────────────────────────────────┐
│ Save  Load  Get Save  [Load Save]   Fast-forward        Stable Discord Reddit  vers ⚙ │
├ res-list ──┬ menu.game-mid ───────────────┬ vitals ───────────────┬ log-view ─────────┤
│ Basic   ▼  │ Main Skills Home Adventure … │ Stop All Focus AutoF ≡│ Clear ☑Event ☑Unlock │
│ Gold 1k/6k │ ───────── section content ── │ ☒ Relaxing      G H   │       ☑Loot ☑Combat │
│ Stored…    │ Tasks                        │ ☒ Craft Gem 36% G H   │ Goat Bandit is…      │
│ Knowledge▼ │  ▼ Affluence ▼               │ ☒ Idle                │ Glossary Entry Unl…  │
│ Research   │   [Smith][Arcane Thievery]…  │ Body                  │ …                    │
│ …          │  ▼ Crafting ▼                │  Life     ███ 302/302 │                      │
│ Gems     ▼ │ Upgrades                     │  Barrier  ███  70/70  │                      │
│ …          │  ▼ Body ▼ …                  │  Stamina  ███  76/76  │                      │
│ Materials▼ │ Progression Quests           │  Vigor    ███  71/71  │                      │
│ …          │  ▼ Advancement ▼ …           │ Prismatic Energies    │                      │
│            │                              │  Mana     ▓▓   11/24  │                      │
│            │                              │ Elemental / Primal …  │                      │
├ quickbar.bot-bar ─────────────────────────────────────────────────────────────┤
│ [CS][PN][MM][VW][SS][SM][7][8][9][0]                                            │
└───────────────────────────────────────────────────────────────────────────────┘
```

Measured at 1440 wide: resource ledger ≈ 165 px, section pane ≈ 455 px, running/vitals ≈ 245 px, log ≈ 160 px (CSS px at the 1024-wide capture scale). The quickbar is ~100 px tall and persists across every section.

### Top bar
`Save` / `Load` (file picker, `accept="text/json text/*"`) / `Get Save` (download) / `[Load Save]` (from browser storage) / `Fast-forward` (spends stored time). Right side: link bar (Stable build, Discord, Reddit), version string, settings gear.

Settings (modal, two tabs "Main" / "Extra Stats"): Dark Mode, Compact Mode, Smooth bars, Resource highlights ("Highlight consumed and produces resources when hovering over consumers/producers"), Auto-Save ("Game is saved to Browser storage by default"), `Wipe Wizard`, `Wipe Hall Save`.

### Resource ledger (left)
Collapsible groups with a header row and ▼. Rows are `name  value/max`. Groups observed at T4: **Basic** (Gold, Stored Time), **Knowledge** (Research, Arcana, Scrolls, Codices, Tomes), **Runes** (Rune Stones; elemental runes appear when owned), **Gems** (Gemstones, then one magic gem per school), **Materials** (Herbs, Potion Base, Ichor, Iron, Quicksteel, Leather, Serpent Skin, Cotton, Spider Silk…). Group membership is the `group` field of the resource record (`data-tables.md → Resources`). A ⚙ at the top of the ledger opens show/hide controls; hidden resources are a per-player choice.

Values are shown with thousands separators and no decimals in the ledger (`1,093/6,796`); tooltips show decimals.

### Section menu and pane (centre)
Tabs are lowercase text with `role="tab"`, rendered as underlined links, wrapping to two rows when many are unlocked. Observed order with this save: **main, skills, home, adventure, player, spells, spellcraft, equipment, bestiary, travelogue, potions, glossary, domain**. Tabs appear only when their `sections.json` requirement is met; for example, `skills` needs `apprentice_lessons`, `home` needs `alcove`, `adventure`/`equipment` need the `job_adventuring` upgrade, `spells` needs a spellbook or weaponlore, `bestiary` needs the Bestiary upgrade or Mage Lore 11, `travelogue` needs its upgrade, `potions` needs the Potions skill, `spellcraft` needs the Spellcraft skill, `domain` needs any Domain upgrade (`data-tables.md → Sections`). A fresh game shows exactly: main, skills, home, player, glossary.

A thin sub-bar under the tabs holds a ★ (favourites/pins) and a ⚙ (per-section hide controls; this is how "hide Study to avoid locking Mystic Savant" is done).

Each section's internal layout:

| Section | Layout |
|---|---|
| **Main** | Three stacked bands: **Tasks**, **Upgrades**, **Progression Quests**. Each band is a list of collapsible groups (▼ header ▼) and each group is an auto-fit grid of fixed-width buttons. Task groups at T4: Affluence, Crafting, Domain, Imbuement, Knowledge, Materials, Other, Research, Rest. Upgrade groups: Affluence, Bargain, Body, Companions, Crafting, Debt, Domain, Education, Housing, Knowledge, Magic, Martial, Materials, Minions, Mount, Other, Plane, Research, Special, Spellcasting, Storage, Sublimation. Quest groups: Advancement (the tier unlocker), Tier (its quests), Morality Options. |
| **Skills** | Find box, "Hide Maxed" checkbox, `Arcana: 100.2/100.2`. Two-column grid of skill cards: name, `Level 14/14.0`, **Train/Stop** button, exp bar, `Exp: 248 / 254`. Sorted alphabetically. |
| **Home** | Header `Home: Idrasil Sapling` (button opens the home list). Sub-tabs **Furniture** / **Converters**. Filters Maxed/Owned/Unowned/Blocked, Find, `Floor Space: 128 / 387`. Table: floor-space cost, name, `owned/max`, Buy (or "Max"), Sell. Sortable by space or name. |
| **Adventure** | Header shows Mount, Companion, `Distance: 976`. Filters Complete/Dungeon/Clash/Locale, Sort by Level, Find. Two-column list: name, **Enter**, type glyph (⚔ dungeon, 🌳 locale, 📖 site of learning, ⭐ clash/special), progress bar `cleared/total floors`, and an ✕ to hide the entry. Below the list: the encounter/combat log for the current adventure (also where siege "X is attacking" lines appear). |
| **Player** | Name (editable ✎), Title (dropdown), exclusive-slot pickers (Body shape, Leisure, Mount, Companion), Personal (Level/Experience, Virtue/Evil, Notoriety), Combat (Defense, Dodge, Thorns, Hit Bonus, Speed, Luck), Global Potencies, Potencies, Status Negation, Resists; right column lists **Classes**, **Tiers**, and the full owned **Upgrades** list with counts. |
| **Spells** | Find, Level filter, Show learned/unlearned, Memorized filter, Keywords, Toggle Schools. Groups per school (Martial, Mana, Water, Air, Fire, Earth, Nature, Spirit, Light, Shadow, Chaos, Astral, Summoning, Animation, Charms), each row `name [Learn]` or `name [Cast][Memorize]`. Group header colour = school colour. |
| **Spellcraft** | Same catalogue with `+` to add a component; right panel: `Custom Spells: 0 / 4`, name field, **Craft**, `Max Levels: 7 / 10`, component list with ↑↓✕. |
| **Equipment** | Slot list with `>` expanders (Head, Back, Waist, Amulet (0/3), Trinket, Limbs (1/2), Senses, Skin, Guts, Main hand (0/0)…), equipped items with ✕. Right: `Crafting: Select slot`, `Inventory - 6 / 11 Used`, item cards with Equip/Enchant/Sell; **Loot** list with Take/Sell/Sell All. |
| **Bestiary** | Sub-tabs Monsters / Invaders. Table Creature, Level, Slain, Hp; "Only Summons" filter; ⚔️ marks training targets. |
| **Travelogue** | Per-locale encounter tables: Encounters, Clear Time, Visits, Learned ✓; "Sites of Learning" filter; undiscovered rows shown as `??????`. |
| **Potions** | Catalogue grouped Recovery / Battle / Utility, 🔒 for unmet, **Brew** when available. |
| **Glossary** | Groups (Player, Skills, Equipment, Combat, Exploration, Progression, Journal, Tasks, Stats, Spells, Siege) of entries with 🛠️ (mechanic) or 📚 (lore) glyphs. Entries unlock as the related system is reached (log: "Glossary Entry Unlocked"). |
| **Domain** | Siege Overview: zones laid out as a path (Domain → Walls → Outside Territory), each with Battlements/Crossing/Guard Post/Approach cells; `Time to next spawn`, `Danger Level`. Below: Infrastructure (domain furniture) and Zones. |

### Running pane and vitals (right-centre)
Top controls: `Stop All`, `Focus`, `Auto Focus`, `≡` (Activities popup: waiting tasks, assign Goals/Hobbies). Then one row per action slot: `☒ name  pct%  [G] [H]`: ✕ stops it; **G**/**H** toggle Goal/Hobby priority; an unused slot reads `Idle`. The Relax slot has no percentage (perpetual). Below: stat bars grouped **Body** (Life, Barrier, Stamina, Vigor), **Prismatic Energies** (Mana), **Elemental** (Water, Air, Fire, Earth), **Primal** (Nature, Spirit, Light, Shadow), **Fundamental** (Tempus). The groups are the `manas` tags on resources. Bars are coloured per resource (`color` field / school) and show `cur/max` inside the bar.

### Log (right)
Filter checkboxes Event / Unlock / Loot / Combat and `Clear`. Entries are two-line cards (bold title, detail): "Glossary Entry Unlocked: Machinae", "Hall Upgrade Unlocked: Treffilwoods Survey", "Wolf Slain — By Abdomen Tear", "LOOT — Gold", "Bandit Brute is attacking (x3)" (repeats collapse to a count). Newest at top.

### Quickbar (bottom)
Ten slots keyed 1-0. Filled slots show a two-letter abbreviation, a school-colour fill (`quickslot.fill.nature`), and an ✕. Footer hint on a fresh game: "Roll-over Item and hold {Shift} + {Number} to assign quickslot. Press {Number} again to use quickslot item." Quickslotted spells cast instantly, outside the memorized rotation (`gloss_combat`: "Memorize anything where you care about an effect with a duration, quickslot anything that has an instant effect").

### Tooltip popup
A single `.item-popup` anchored near the cursor renders the detail for whatever is hovered: task, upgrade, skill, furniture, dungeon, resource, running slot. There is no click-to-pin; touch has no equivalent. Schema in `02-interaction-semantics.md`.

## Visual language

- Dark theme by default (setting), near-black panels, light grey text, Open Sans.
- **Task buttons**: filled amber = runnable; grey outline = visible but not currently affordable/allowed; dashed outline = currently running; a ✅ suffix marks a task set as a Goal/Hobby or otherwise flagged. `gloss_tasks`: "Tasks with a defined length take up an action slot and are coloured yellow."
- **Spell/section group headers** are tinted by school (brown Martial, indigo Mana, blue Water, green Nature…).
- **Dungeon difficulty** is glyph-based in the tooltip: 1-3 🦴 early, 1-6 💀 later (`gloss_dungeons`).
- **Maxed** purchases stay in their list showing `Max` (Home) or the count in parentheses (Player → Upgrades, e.g. `Holy Candle (14)`); they do not move to a "done" group.

## Mobile (390×844)

The layout does **not** reflow. The four columns keep their flex proportions: resource ledger 21 px wide, section pane 209 px, vitals 32 px, log 128 px; page `scrollWidth` 845 vs viewport 390. Section tabs wrap to seven rows; task buttons become a single column. The top bar overflows and overlaps the quickbar labels. The quickbar stays full width. Arcanum is effectively desktop-only; this is a known gap, not a model.

## What the frame communicates

1. **Persistent context everywhere.** Resources, running actions, vitals, and the log never leave the screen; only the centre changes. The player never has to find the originating button to understand what is happening.
2. **Density over prose.** Buttons carry a name only; everything else is in the tooltip. A T4 Main tab shows ~45 tasks, ~80 upgrades and 8 quests without scrolling the groups closed.
3. **Reveal by sections.** Thirteen tabs at T4 versus five at start; each is gated by a data record, so new systems arrive as whole screens.
4. **Reference tabs are first-class.** Bestiary, Travelogue, Glossary and the Player upgrade list are in-game documentation generated from play; the glossary unlocks entry-by-entry as systems appear.
