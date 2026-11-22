# 01: Shell and opening

Sources: the v1.5.5 web demo played in a browser on 2026-11-19 at 1440×900 and 375×812 (fresh save, Fire primary, Modern mode), its source map (`src/components/**`, `src/backend/events/progression/PreTrainingProgression.tsx`, `src/backend/helps/HelpLoaderDemo.tsx`), and the v1.8.6 strings for screens the demo does not reach.

## 1. First screen

A new save opens on a single form, not the game: a paragraph of premise (a rookie wizard looking for the Philosopher's Stone), then two radio groups, **Elements** (Fire, Earth, Water, Air: "please choose a primary element") and **Game Mode** (Classic or Modern, switchable later in Options), then *Start the Game!* The primary element is a real build decision from second zero: spells of that element cost half the mana and its exp counts double (`02` §3). Game mode decides whether furniture consumes land (`04` §4). Since 1.8.2 a title screen with save slots sits in front of this.

## 2. Layout

**Desktop (≥ 1350 px)**, four columns, read from the accessibility tree:

| Column | Contents |
|---|---|
| Left | Title, an icon grid menu (Home, Stats, Options, Help, About at start; one tile per unlocked screen later), a Time Piece speed control once time pieces exist (Normal / 2× / 5×, with the per-second cost), then collapsible *Resources* (amount/cap), *Elements* (`Fire: Lv1`, `Exp 0/600`), later *Combat* and *Buffs*. |
| Centre | The current screen. Home starts with *Actions* (Gather Mana), *Channeling*, and a *Current Goal* box with one imperative line ("Gather more Mana!", "Channel Water and Air Essence!"). |
| Spells | *Cast Spell*: *Quick Channeling* (one icon per element), then *By Element* lists with mana cost, *Expand all*. Buttons are tinted by element. |
| Right | *Events*: pending and *Finished* events, each a timestamped line that expands to the full text. A bottom strip shows Mana. |

Sections can be **pinned** so two screens show at once on wide displays ("Pin Section", 1.2.7), and reordered or hidden from the bottom menu in Options.

**Phone (375 px)** is a different layout, not a squeezed one: one column; a hamburger drawer holds Resources and Elements; a bell top-right opens Events; a bottom tab bar holds the screens; a floating wand button bottom-right opens Cast Spell; a resource strip sits above the tabs. The game ships on iOS and Android with the same code (Expo / React Native Web; the App Store page says "optimized both for phones and tablet devices"). Breakpoints in the source sit at 600, 640, 700, 1000 and 1350 px. Options include left-handed mode, swipe navigation, compact UI, low-contrast mode, zoom, a target frame rate and a screen-reader pass (the developer tested with NVDA; several patches fix screen-reader labels). Compare Arcanum rule 37 and Hundred Days rule 67: neither reference reflows below desktop.

Screens: `screens/home-1440.webp`, `screens/home-375-mobile.webp`.

## 3. Screens

22 screen components exist in the demo source: Home, Study, Inventory, Transmute, Wizards, Exploration, Enhance, Boosts, Synchro, Spellcraft, Rituals, Familiars, Compendium, Retirement, Worlds, Stats, Options, Help, About, Ending, Intro, Debug. Each appears in the menu when its unlock flag is set, which is always the effect of an event (§4), never a requirement expression on a section record (contrast Arcanum rule 8, "sections are records").

Actions are placed by **area** and **subcategory** rather than by type: `ActionArea` is Home, Spell menu, Study, Transmute, Exploration, Enhancement, Boost, Familiars; Home's subcategories are Actions, Channeling, Mana, Storage, Catalysts, Other, Time Pieces. A spell to build furniture shows under Home › Mana and in the Spell menu at once. `[v1.5.5 src]`

## 4. The opening as written

The first hour is a chain of `MAIN_QUEST` events in `PreTrainingProgression.tsx`. Each is a game-state listener that fires once when the previous step's flag is set and a resource threshold is met; the event's text names the new verb and its trigger sets the next flag. `[v1.5.5 src]`

| # | Event | Fires when | Unlocks |
|---|---|---|---|
| 0 | — | start | Gather Mana (+1 per press; "press and hold buttons to auto-press them") |
| 1 | The Power of Magic | 10 Mana | Channeling (Channel Fire/Earth/Water/Air) |
| 2 | Mana Spouts | any Water and any Air essence | Mana Spout furniture (+1 Mana/s) |
| 3 | Mana Capacity | Earth essence ≥ 30 | Mana Shard furniture (Mana cap) |
| 4 | Full of Essence | Mana cap ≥ 200 and any essence ≥ 100 | Essence Storage furniture |
| 5 | Channeling Catalysts | Fire essence ≥ 110 | Essence Catalyst furniture |
| 6 | Must Keep Learning | own one Essence Catalyst | Study (element exp over time) |
| 7 | Transmutation | primary element level 2 | Transmute items from essences |
| 8 | A Strange Visitor | 500 Coins | Wizards (the first "hired" wizard, who works for free) |
| 9 | Start of a Business | 1,000 Coins | Market Stalls |
| 10 | A Helping Hand | 1,500 Coins | Researchers |
| 11 | A Bigger House? | 120 land used (Classic: > 40 furniture) | Buying land |
| 12 | Training | after 11, primary element level ≥ 6 (two variants of the letter, by element) | Exploration (the Training Towers) |

The pattern: one new verb per threshold, each threshold reachable with the verb just granted, and a *Current Goal* line that always names the next action. There is no tutorial modal; the text of each event is the tutorial, and every event stays readable in the Events column. The hired wizard is a recurring character introduced here, and later becomes a boss (`05` §3).

Played on 2026-11-19: ten presses of Gather Mana fired event 1 as a modal with *Close*; Home then showed four Channel buttons, the Cast Spell column filled with Quick Channeling icons and a Fire list, and the goal line changed to "Channel Water and Air Essence!".

## 5. Text, tooltips, Help

- **Every number explains itself.** Displayed effects use a Markdown dialect where `^value^<explanation>` renders an underlined value whose tooltip is the full transformation breakdown (`explainTransformationsText`, `03` §3): base, each addition, each multiplier, with sources named. Icons are inline tokens (`:mana:`, `:attack:`, `:wizardpower:`). `[v1.5.5 src; modding docs]`
- **Help** is a screen of entries in seven categories (Introduction, Screens Overview, Elements Overview, Game Features, Wizards, Exploration, Tips and Tricks). Each entry has its own visibility test, so Help grows as the game does; the demo registers 29 entries and the full string file has the rest. Help states formulas plainly: the Retirement entry explains MPL, both global multipliers and when to retire ("for the first retirement only, … if your new Global Study Exp Multiplier will be above 2.5×"). `[v1.5.5 src; v1.8.6 strings]`
- **Events** are the single notification channel: pop-up modal (suppressible during boss fights and per tag), the bell, and the Events column. Tags: main quest, storyline, level-up (with "empty" and "already reached" variants), inconsequential random event, plus do-not-popup flags. Compare Hundred Days rule 68.
- **Level-up events** list the spells and items the new level made available, so each level is announced with its payoff.

## 6. What the opening teaches

Measured against Arcanum rule 17 (first cap in a minute, tutorial class in three, first stage under an hour): MR2's first cap (Mana 100) is hit in under two minutes of pressing, the 13-step ladder to Exploration takes most of the first hour `[INFERENCE: from thresholds and the demo FAQ's "first 4–8 hours" for the whole demo]`, and the first retirement is gated behind the *Posterity* storyline further on. The density is similar; the difference is that MR2 reveals a whole screen per step rather than a handful of buttons. The ladder is played once: since 1.5.4, completing *Types of Wizards* makes later runs "skip all early game progression up to unlocking Exploration", and *Zoom Through Training* starts later runs at the Sewers with full storages.
