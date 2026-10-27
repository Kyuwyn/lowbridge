# 01: Shell, layout and the opening

What is on screen in the live build (https://maxrau.github.io/Hundred-days/, `P0.3.9c`, English branch), observed on 2026-10-21 at 1440×900 and 390×844 with a fresh save and with the translator's all-sections-unlocked fixture (`tools/fixtures/save-all-unlocked.json`, branch `english`). Screenshots in `screens/`. Compare `../arcanum-reference/01-shell-and-layout.md`; this page lists only what is the same in one line and spends its words on what differs.

## Same as Arcanum

Three-column frame (resources left, section tabs + content centre, runner/log right), section tabs gated by `require`, running pane with `Stop All` and `Rest`, tooltip-on-hover for every button, Save/Load/Export/Import/Restart in the top-left, a gear per module to hide rows, dark/compact mode. The Vue component tree is Arcanum's (`./src/ui/sections/*.vue`, `./src/ui/panes/running.vue`, `./src/ui/itemsBase.js`): the fork kept the shell and replaced the content.

## What differs (desktop, 1440×900)

| Element | Hundred Days | Arcanum (0.12.12.9) |
|---|---|---|
| Top band | A scrolling **news ticker** (`send[]` in `main.vue`; ~20 tips and jokes: "Compute Power is unlocked by default, but only displays when it exceeds 40", "Alt+F4 has become the opening line of the cultivation textbook") | none |
| Title bar | "Hundred Days - Foundation Establishment", **Start Background Process** (toggles a hidden looping `<audio>` of `music/bgm.mp3`; method `playm` in `main.vue`; the label suggests it exists to stop browsers throttling the tab `[INFERENCE]`), Donate, Developer Blog, Wiki, Changelog, Github, `Ver: P0.3.9c`, gear | Settings, Hall, Discord |
| Section tabs | 21 records in `data/sections.json`, 19 shown in the fixture: Main, Character, Skills, Research, Market, Cultivation, Dwelling, Workforce, Workshop, Adventure, Spells, Equipment, Conquest, Bestiary, Enchanting, Crafting, Elemental, Minions, Achievements (`sect_svehicle` "构造" is `locked: true`; `sect_scraft` spellcraft needs `spellcraft`) | Main, Skills, Home, Equipment, Spells, Enchanting, Adventure, Bestiary, Potions, Minions, Hall… |
| Right column | **Time: D1**, **Life: Yr 60 M0 D0 (0%)**, **Play Time**, then Energy / HP / Stamina bars; log filters Events / Unlock / Loot / Combat | Stress and other bars, same log filters |
| Bottom band | Permanent hint: "Hold {Shift}+{number} while hovering an action to set a shortcut; press the number for quick action" | none |
| Bottom-right | A 3-second **timed reminder** toast ("Remember to export your save as a backup", Confirm) on load | none |
| Notices | Three persistent coloured strips over the log: red "Click Save then Load in the top-left to update the game config", green "New changelog available", green "Module recipes updated, save and reload" (each "Click to close") | none |
| Keyboard | `TAB` opens the **Guide** overlay; `Q` opens a redemption-code box (wiki codes award achievements; settings text); Shift+digit binds a quickbar shortcut; "Menu Hotkeys Require Shift" setting (added by the translator, commit 2026-04-24) | quickbar via number keys |
| Settings | Dark Mode, Compact Mode, Auto Save (to browser cache), Menu Hotkeys Require Shift, QQ group link | many more (see Arcanum 01) |

Resources column on a fresh save: one group, **Currency → Coins 0/10**. No stress bar; the player stats are Energy (`tili` 体力), HP (`hp` 气血 "Vitality"), Stamina (`stamina` 精力). Caps: 10 / 5 / 10 (P0.3.9c `player.json`).

## Section tabs at a glance (fixture, nothing bought)

| Tab (en / zh / id) | What it shows | Screenshot |
|---|---|---|
| Main (主菜单 `sect_main`) | Actions (TAB guide, Sweep Floors), Quests (Rest) | `00-start-1440.webp` |
| Character (玩家 `sect_player`) | Name, Title 平民 (Commoner), Honorific, Milestone Pts, ☯Reincarnation, Level 0/39, EXP 0/50, Good:Evil, Skill Points, Rest slot, Mount, Distance 10, combat stats (phys/spell power & resistance, defense, shield, damage/hit bonus, summon limit 4, crit 150 %, crit rates 5 %, speed, dodge, luck), Weapon Fist, **Divine Machine** slot; right rail of quest groups: Quests, Production Theory, Leveling, Housing, Human Resource Management, Nearby Map, Trade (`missions.json` groups) | `sect-character.webp` |
| Skills (技能, `g.ganwu>0`) | Two groups Knowledge / Celestial Principles, Hide Maxed, Skill Points | `sect-skills.webp` |
| Research (研究 `sect_techo`, `g.xl_lj_konwledege_1>=1`) | Three domains Physics / Social / Engineering, each with a progress dial, Switch / Stop Research, Research Speed; a results pool per domain ("Must have results to start research"); research list with Start and `0/1000`-style point bars | `sect-research.webp` |
| Market (交易, `g.market_un>0`) | Sell Resources, Buy Resources, Buy Weapons, Buy Armor, Buy Reactor | `sect-market.webp` |
| Cultivation (修炼 `sect_xiulian`, `g.heli`) | A grid of 17 **illustrated cards**, one per `xiulian` tag group (Path, Foothold, Celestial Ladder, Hope of Immortality, Art of Observation, Material Structure, Energy Physics, Phase Transition, Sea of Information, Geometry, Multivariate Calculus, Spatial Systems, Cognition, Life Construction, Death, Energy Deconstruction, Elemental Engineering). Each card is 30 rem wide with a 240 px AI-looking landscape and a scrolling list of visible nodes on its right (`./src/ui/sections/xiulian.vue`, `filterbytag`); node names turn red when `max == 2`. When offline energy max > 3000 a **Time Energy** bar with 2×/4×/6× "Flow Speed" buttons appears above the grid (Arcanum's stored time, resurfaced here) | `sect-cultivation.webp` |
| Dwelling (居所 `sect_home`, `g.home_un>=1`) | Filters At Limit / Owned / Not Owned / Requirements Not Met / Advanced, a **search box** by tag, result or name, Space 0/0, furniture table Space · Facility · Owned · Buy/Sell, plus Footprint / Obstacle / Quantity columns (the land-parcel layer) | `sect-dwelling.webp` |
| Workforce (人力 `sect_humanr`, `g.rlgl>=1`) | "Command Capacity 0/3": directives that consume manpower | `sect-workforce.webp` |
| Workshop (模型 `sect_mode`, `g.shengchanlun>=1`) | Industrial Land 1/5, Industrial Power 1/1, Industrial Threads 1/5, Logistics Flow 100/100; product categories (Production Equipment, All Items, Finished Goods, Intermediate Products, Raw Materials, Mineral Resources); "Click product name for details" | `sect-workshop.webp` |
| Adventure (探险 `sect_raid`, `g.small_map>=1`) | Sort by Level, Complete / Dungeons / Explore filters, Show Hidden; cards with Hide · Enter · icon (⚔️ fight, 🌳 explore) and `1/10` clear counters: Distant Mountains, Nearby Forest, Wasteland, Crystal Mine | `sect-adventure.webp` |
| Spells (法术, `g.heli`) | Search, Level, Memorized | `sect-spells.webp` |
| Equipment (装备, `g.market_un>0`) | 15 slots: Left, Right, Head, Hands, Back, Waist, Neck, Trinket, Fingers, Chest, Legs, Feet, **Dimension**, Shield, **Artifact**; "0/3 Occupied" | `sect-equipment.webp` |
| Conquest (征服, `g.shenshi_3>=3`) | "Open Indicator"; rule text: *Attack requires combat rating > target defense. Conquest limit scales dynamically with compute power.* | `sect-conquest.webp` |
| Bestiary / Crafting | Arcanum tabs, kept (`g.bestiary>0||g.lore>=11`; crafting ungated) | |
| Enchanting (铭刻, `g.mwxue>=1`) | Target, enchantment-slot rule, Resume, slot usage | `sect-enchanting.webp` |
| Elemental (元素 `sect_potions`, `g.yaolixue>=1`) | Element rows with levels: Drug Resistance 1/5, Elemental Chaos 1/5, Wild Taint 1/5, Sharp Gold (锐金) 1/1, Great Wood (巨木), Flood Water (洪水), Raging Fire (炎火), Thick Earth (厚土) 1/1; material search "Flood Level 1" | `sect-elemental.webp` |
| Minions (随从, `g.shenshi_4>=999`, i.e. effectively off) | Minion Limit, Command Power table | `sect-minions.webp` |
| Achievements (成就, `g.hp>=1`) | Search, Milestone Points, Milestone Upgrade, a list of 🎇 achievements with progress and **Complete Achievement** buttons: Wiki, Foundation Establishment, First Return, Piggy Bank (300 coins), Turn Of The Century (reach 100 years, `1/37K`), Inspired (300 Enlightenment), Blood Soul (350 HP), Land Development (500 land), Time Travel Guide (rewind 10 years)… | `sect-achievements.webp` |

## The opening, as played (fresh save, 1440×900)

1. **D1, 60 years of lifespan left.** Resources: Coins 0/10. Actions: *Press TAB To Open Guide* (`helper_1`: costs 0.1 Energy, pays 1 coin) and *Sweep Floors* (`clean`: Energy 0.5 + Stamina 0.1 → Coins 0.2, Time 0.5). Quests: *Rest* (`rest`, an effect task: time 0.1, +1 Energy, +1 HP, −1 stress per tick). Log already says: Skill Unlocked 👑Ancient Tianlaan Language, Dungeon Unlocked ⚔Firmament Realm - Elysium, three Guide Quests, Achievements.
2. **TAB** opens the Guide: a modal with side tabs Guide / Lore listing guide quests (`missions.json`): *Quick Start* ("This is a semi-idle game, so you may need to be a bit more hands-on. The way to progress is to click whatever is available. Most skills need to be trained to max level. Pay attention to task and action descriptions — some have irreversible consequences"), objective Vitality 5/1 and Coins 1.6/3, Complete Quest costs 1 coin and pays 2; *About the WIKI*; *Using the Gear Icon* (coins 100). Guide quests pay coins: the tutorial is paid content. `screens/guide-tab.webp`.
3. Eight clicks of Sweep Floors: Energy 10 → 6, Coins 1.6, Time D5 (each click advances half a day). Energy regenerates while idle; Rest is the fill. Tooltip `screens/tip-task-sweep.webp`: name, flavour ("Serving as a servant in a wealthy household…"), Cost (Stamina 0.5, 0.1), Results (Coins 0.2, Time 0.5), verb "Toil…".
4. `Haul Cargo` (`freight`) is `locked: true` until revealed; `Wander` (`youli`) appears at `g.money>25` and is the first source of **Enlightenment** (感悟 `ganwu` 0.05 per click, cap 3), which opens the Skills tab (`g.ganwu>0`). Coherence (合理 `heli`, "the power that conforms to the laws of heaven and earth", a `Bar` with a yellow colour, +0.1 physical resistance per point) is revealed by `g.touch_daoli` and opens Cultivation and Spells (`g.heli`). The route from here is reconstructed from data in `02-cultivation-and-progression.md`.

The readout "Life: Yr 60 M0 D0 (0 %)" is not the character's age: `age` is a **lifespan budget** resource (`val: 21900, max: 21900` days = 60 × 365) shown as years remaining, and the percentage is `time / age.max`, the share of the budget already spent. Every click that carries `time` spends it (Sweep Floors 0.5 day); the achievement "Turn Of The Century: reach 100 years" counts `1/37K` days of `time`. The rule, and what extends the budget, is in 02 §5 and 04 §3.

## Mobile (390×844)

Not responsive: the three columns keep their desktop widths, the title wraps over the buttons, the news ticker and hint band overflow, bars are cut (`screens/mobile-390-main.webp`). Arcanum does not reflow either (A/01 Mobile, rule 37); neither reference is a phone model. The fork never touched the CSS for small screens.

## Visual style

Default light theme, Open Sans, Arcanum's grey boxes; the Cultivation cards are the only art in the game (17 landscape PNGs under `images/xl_bgs/`), the Research tab is a dark panel with teal/orange outlines and three circular progress dials; achievements and some names carry emoji prefixes (🎇, 👑, ⚔, ☀, 🌙, 🐭, 💠). The translator's English is readable but uneven ("Divine Machine", "Open Indicator", "Buy Reactor"); the Chinese original uses pinyin ids and Chinese `name`s throughout.

Voice: `flavor` appears on 304 of 4,520 records (`data-census.md`) and on 1 of 193 cultivation nodes. The vocabulary mixes Daoist alchemy with industrial and science terms. The tone runs in four registers: ticker jokes, the death text, the cat chain, and the translation.

## What this means for Lowbridge

- *copy*: the TAB guide as **paid quests** (`missions.json`): the tutorial is content, costs/pays coins, and lives in the same vocabulary; Lowbridge's discoveries already log without pausing, a guide overlay would be the next step.
- *copy*: **Time / Life / Play Time** as three visible clocks; Lowbridge chapter one is a day counter already, a lifespan counter is the cultivation hook that Arcanum lacks.
- *copy*: the Dwelling **search box** by tag/result/name once furniture passes ~50 records; the fork has 325.
- *copy*: Cultivation as **one illustrated card per domain** with the node list beside it; it reads better than Arcanum's flat upgrade grid for a tree with 17 branches, and a card is one `tags` value, so it costs no new field.
- *avoid*: three permanent coloured notice strips, a 3-s reminder toast, a news ticker and a bottom hint band at once; the useful content is one line each.
- *avoid*: the broken phone layout. Arcanum does not reflow either (Arcanum 01 Mobile, rule 37), so Lowbridge's own responsive rules stand on their own.
- *beat*: "Start Background Process" is a workaround for tab throttling; Lowbridge settles elapsed time on resume (`settle()` in `src/main.ts`) and needs no audio trick.
