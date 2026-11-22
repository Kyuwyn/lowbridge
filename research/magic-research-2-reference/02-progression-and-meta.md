# 02: Progression and meta

Sources: demo source v1.5.5 (`spells/Elements.tsx`, `spells/ElementMultipliers.tsx`, `study/Study.tsx`, `Retire.tsx`, `NewGamePlus.tsx`, `storylines/Storyline.tsx`, `events/autorandom/RandomEventTrigger.tsx`, `helps/HelpLoaderDemo.tsx`); strings v1.8.6; wiki dump 2026-11-19 (storyline, class and element pages); patch notes. Curves below were computed from the source formulas, not measured in play.

MR2 has **one** levelled axis per element and nothing else that levels the player: no character level, no skills, no classes that rank up. Everything else (furniture, items, wizards, familiars, storylines) feeds or gates the twelve element levels, and the reset loop is built on them.

## 1. Elements

Twelve elements. Fire, Earth, Water and Air are available from the start; Poison, Mind, Life, Electric, Death, Holy, Time and Space arrive through storylines, each first **partially unlocked** (usable, but storage ×0.25, channeling ×⅓ and a punishing exp exponent) and later **fully unlocked** by a dedicated storyline: the five "Tome of … Knowledge" storylines, *Mysterious Box* (Time) and *Starry Night* (Space). `[v1.5.5 src; wiki]`

Each element is at once:

- a **level** that gates spells, furniture, transmutation recipes and storyline triggers (`meetsRequirements`: every listed element at or above its level, and unlocked);
- an **essence** resource with its own cap (`04` §1);
- a **school of spells** (8–14 spells each in the wiki; 122 pages in all);
- a **tile colour** on the Synchro board (`06` §7) and a key for spellcraft jewels and familiar evolution.

So a new element is a new resource, a new spell list, a new crafting tier and a new set of storyline hooks at once. That is the game's equivalent of Arcanum rule 8 (a new system arrives whole), achieved per element rather than per tab.

## 2. Levels, exp and ranks

**Exp curve.** Level 2 costs 600 exp; each further level costs the previous increment × an *exponent*, and × 1.15 more from level 80. The exponent is chosen per element per run: **1.38** for primary (and secondary) elements, **1.43** for other unlocked elements, **2.0** for partially unlocked ones. Totals `[computed from v1.5.5 src]`:

| Level | Primary (1.38) | Other (1.43) | Partial (2.0) |
|---|---|---|---|
| 10 | 2.7 × 10⁴ | 3.3 × 10⁴ | 3.1 × 10⁵ |
| 20 | 7.2 × 10⁵ | 1.2 × 10⁶ | 3.2 × 10⁸ |
| 30 | 1.8 × 10⁷ | 4.5 × 10⁷ | 3.2 × 10¹¹ |
| 50 | 1.1 × 10¹⁰ | 5.7 × 10¹⁰ | 3.4 × 10¹⁷ |
| 80 | 1.8 × 10¹⁴ | 2.7 × 10¹⁵ | 3.9 × 10²⁶ |

The level cap is **80** (the demo's is **30**, one constant), raised by a transformation tag (`MaxElementLevel`) from New Game+ Sheer Power (`§6`). Above 80 the rank names continue as "Eminence +n".

**Exp sources.** Casting a spell grants its element `1.03^(level−1) × manaSpent^0.3` exp (×0.1 to other listed elements, minimum 5); Study grants **2.0 exp/s per researcher** per element; events and books grant lumps. Primary elements earn **×2** exp. All of it passes through `ExpGain` transformations, so items, storylines, classes and NG+ can each multiply it. `[v1.5.5 src]`

**Ranks.** Every ten levels is a named rank: Initiate, Novice (10), Apprentice (20), Adept (30), Magus (40), Expert (50), Archmage (60), Master (70), Eminence (80). Each rank above a spell's own base rank multiplies that spell's magnitude by **1.33353** (so eight ranks is exactly ×10.0), and divides the extra cost of temporary effects by (m+1)/2. A level-6 Fireball is ×1.33 at level 10, ×2.37 at 30, ×10 at 80. This is the "spells become much stronger every 10 levels, without the need to unlock any Storyline" promised in the launch FAQ: old spells stay useful with no new records. `[v1.5.5 src; launch FAQ 2024-05-21]`

**Element ladders.** The wiki's element pages list 13–41 unlock rows per element, all topping out at level 72 (the highest content level). Earth has the most (41), Holy and Space the fewest (13). See `data-census.md` §3.7.

## 3. Study, primary and secondary

- **Study** (unlocked by owning one Essence Catalyst) assigns *researchers* to elements; each researcher yields 2.0 exp/s before multipliers. Researchers come from Researcher Desk furniture and storylines. Four auto-assign strategies (off, spread evenly, highest amount, spread then highest); the game reassigns automatically 30 s after your last manual change. `[v1.5.5 src]`
- **Primary element**: chosen at the start of every run. Its spells cost ×0.5 mana, its exp ×2, its exponent 1.38. Only the primary (and secondary) level counts towards the retirement record (§4). Some storylines and familiar evolutions are primary-only.
- **Secondary element**: a second primary, unlocked by *Dual Flexibility* (Cavern; primary level 45 and a second element ≥ 35 and three levels clear of the next). The wiki's challenge page "Primary" and the community's "primary challenge" guides name runs built on two primaries. `[wiki]`
- The four "How to Fight" storylines pay flat combat stats (+30 HP, +10 attack, +10 defence, −5 % attack delay) for *losing* 20 fights in one run: failure is a currency. `[wiki]`

## 4. Retirement

Retirement unlocks with the *Posterity* storyline, which fires when the primary element first reaches **level 7** in a run. Retiring resets the **run** layer (resources, furniture, inventory, element exp, enhancements, the current class) and keeps the **world** layer (storylines, records) and the **global** layer (`03` §1). `[v1.5.5 src]`

**MPL.** On retirement the primary's level is recorded as that element's **Maximum Primary Level**; it never decreases. Two multipliers follow from all MPLs:

- **Global Study Exp Multiplier** = (1 + (1.11^(maxMPL−1) − 1)/2.5) × ((ΣMPL′ + 20^1.25)^0.8 / 20), where ΣMPL′ sums (MPL − 1) over elements.
- **Global Production Multiplier** = 1 + (studyMult^0.25 − 1)/1.19307. It multiplies channeling, all furniture production, Mana, coins and monstium drops, and familiar exp.

| max MPL | Σ(MPL−1) | Study × | Production × |
|---|---|---|---|
| 10 | 9 | 1.89 | 1.15 |
| 20 | 28 | 5.26 | 1.43 |
| 30 | 57 | 17.5 | 1.88 |
| 50 | 100 | 177 | 3.22 |
| 80 | 200 | 6,154 | 7.59 |

`[computed from v1.5.5 src]`. The maximum dominates; the sum is the secondary term, which is why the Help text and the community both say to **pick a new primary each run** (a player's worked example: Fire 10, then Water 10 raises the sum but not the max; then Air 30 raises both).

**Head start.** Every element with an MPL starts the next run with 400 × (1.27^MPL − 1) exp: MPL 20 starts a primary at level 11, MPL 30 at 19, MPL 50 at 33, MPL 80 at 56 `[computed]`. Re-running is fast by construction; the Retirement screen states the new multipliers and the starting level before you confirm ("If you retire now, your Study element exp gain multiplier will become …x (+…%) … you will begin all subsequent retirements with … exp (meaning it will start on at least Lv…)"). The price and payout of the prestige are on the button.

**When to retire**, in the game's own Help: when progress slows or the next Goal looks impossible; when the multipliers would rise substantially; when a storyline's bonus only applies after retiring; and for the first retirement only, wait until the new study multiplier would exceed 2.5×. Players report 50–100 % multiplier growth per retirement as the comfortable pace (`07` §4).

**Classes** are chosen on each retirement once *Types of Wizards* is done (clear the four Training Towers and the Head Instructor). They last one run. `[wiki Classes page]`

| Class | Unlocked by | Effect |
|---|---|---|
| Battlemage | Types of Wizards | +10 % attack and defence |
| Spellslinger | Types of Wizards | +30 % mana production |
| Builder | Types of Wizards | +12 % land |
| Builder+ | The Blessed Land | −50 % furniture costs |
| Sage | Wizard Leader | +10 % spell power, primary element |
| Breeder | World of Ants | +12 % familiar attack and defence, +60 % familiar exp, cheaper familiar crates |
| Student | Fountain of Wonder | +25 % study exp |
| Cultist | Path of Corruption | +25 % ritual effect |

*Missing Pages* (Zeth) doubles all class effects. One class per run, no line structure and no counting (contrast Arcanum rule 11).

## 5. Storylines

127 storylines (wiki; the launch FAQ also says 127) are the permanent unlocks. Each is completed **once per world**; its bonus then persists through every retirement. Several are mutually exclusive variants with the same title, of which only one can be taken per retirement (the five *Furniture Preservation* options, the three *Somebody's Trash* rewards, *Ancient Power* per element). By area: Training Towers 18, Sewers 16, Vast Desert 16, Cavern 15, Zeth 10, School 25, Plains 8, Aftermath 19. Full table: `data-census.md` §3.1. `[wiki]`

**What they pay.** Almost every system in the game arrives through a storyline: Retirement (*Posterity*), classes (*Types of Wizards*), Perma-Cast, the Compendium, a second primary, a second accessory slot, multi-transmute, Channel Four and Channel All, each late element, rituals, synchro, the endings and the challenges. The rest pay permanent percentages ("−30 % cost scaling of Mana Spouts", "+100 fire/sec", "+5 wizards").

**How they trigger.** Three kinds `[v1.5.5 src; wiki]`:
1. **Listener**: a game-state condition (5 successful explorations of the Hazardous Sector; 15 wizards casting 15 different spells; 20 home extensions).
2. **Random**: a weighted random event while exploring a named area.
3. **Riddle**: an oddly exact condition that no one meets by accident. *Mysterious Box* needs exactly 123 Mind Shards held at primary level 38; *Starry Night* needs exactly 100 Life Prisms and 50,000 Mana while exploring the Vast Desert. These are why the hint system exists.

**Status ladder.** Hidden → Undiscovered → Discoverable → Hint Available → Completed → Bonus Active. **Hints** are themselves a storyline's reward: once *Divining the World* (Mind level 10, Vast Desert) is done, each storyline reveals a hint when your Mind level, the highest in any run since 1.3.2, reaches that storyline's `mindRequirementForHint`. The Stats screen lists storylines filterable by status, and since 1.2.16 shows the current odds of random storyline events. Triggering a random storyline reveals its full name (1.3.2).

**Random events.** One random event every 8–12 minutes × (1 + min(run time, 24 h)/6 h), so the interval stretches to 5× after a day in one run. The code comment says why: it "rewards quickly triggering random events after retirement and prevents low quality random event spam later in the game". Storyline-bearing events get a **pity** multiplier ×40 once 3 h (±15 %) of the run pass without one; each storyline event re-arms pity at 6 h. Random storylines cannot fire until *Posterity* is done. Patch 1.3.2 set the target in words: "leaving a game idle 6–8 hours should always trigger at least one random Storyline if able". `[v1.5.5 src; patch 1.3.2]`

## 6. Worlds (New Game+), challenges, endings

**Endings.** Five, all in the v1.8.6 strings: *To Save a Life*, *Redemption*, *A Terrible Mistake*, *Creator's Last Word*, *Transcend Humanity*. The first (defeat Satell in the Plains of Peace) unlocks challenges and an extra choice after Satell in later runs; others need the post-game. `[strings; wiki]`

**Challenges.** Six constrained runs chosen at retirement: Danger, Pouchless, Primary, Timed, Universal, Unskilled. Each pays a storyline when Satell is defeated under it (e.g. Primary: +100 % study exp). Universal makes all self-buffs and potions ineffective (community). *The Final Challenge* needs three challenges, both Time and Space fully unlocked and *Clean Sewer Dimension*. `[strings; wiki; Steam guide]`

**Worlds.** New Game+ (unlocked by a post-game storyline) resets the **world** layer: storylines, MPLs and synchro boards go; global records, saved wizard strategies and Time Pieces stay. You spend **boon points** across three boons and pick a **difficulty** `[v1.5.5 src]`:

| Choice | Levels | Effect per level |
|---|---|---|
| Sheer Power | 0–10 | +10 element level cap per 2 levels (rounded up below 8), +4 familiar level cap, +1 max item quality, storage ×1.5, production ×1.1 |
| Storyline Oracle | 0–10 | pre-completes a fixed bundle of storylines per level (1: Perma-Cast, Convenience, Building Blocks, the Compendium, How to Fight Expertly, Terrain Advantage, Divining the World; … 7: Mastery of every element; 9: Blessed Land, Divine Combination; 10: all but a few) |
| Blazing Speed | 0–10 | channeling and sale price ×1.8, exp ×1.6, loot ×1.3 |
| World Difficulty | 0–10 (11 after an ending) | enemy HP ×1.6, attack delay ×0.9, accuracy and dodge ×1.1, other stats ×1.3; boon points earned ×1.6 |

Boon level *L* costs fib(3+L) points (5, 8, 13, 21 … 377 for level 10; 979 for all ten); a world pays **16** points × 1.6^difficulty. Higher difficulty is the way to afford higher boons. The developer's own mod *Unleash the Worlds* lifts both caps from 10 to 100 (`07` §3).

## 7. The shape of the whole

`[wiki areas and boss levels; strings; community]`

| Stage | Area | Boss levels | What arrives (storyline area per wiki) |
|---|---|---|---|
| Opening | Home only | — | 13-step ladder (`01` §4) |
| Training | Training Towers (4 towers) | 4–10 | Exploration, Compendium, classes, Retirement |
| Sewers | Entrance, Hazardous Sector, Hideout | 13–20 | Poison, Perma-Cast, Synchro (*Tic-Tac-Toe*), furniture preservation |
| Desert | Pyramid, Burial Chambers | 22–32 | Mind, hints, Convenience, second accessory |
| Cavern | Mouth, Subterranean Sanctuary, Temple of Life, Deep Caverns | 36–47 | Life, Time, familiars, second primary, *Schematics* (combine items) |
| Forest and Zeth | Lost Forest, Zeth Fortress, Dragon Shrine, Chaotic Rift | 47–70 | Death, Space, rituals, Cultist, *Lasting Skill* |
| School | School Grounds, Castle on the Bridge, Road Uphill | ~54–60 | Electric, Transmutation Prayers, Exclusive Lesson |
| Plains | Plains of Peace | 75 | Holy, Blessed Land (land removed), Satell and the first ending |
| Aftermath | Secret Prison, Aberrant Realm, pilgrimages | 70–80 | challenges, 12 Pilgrimages, worlds, the secret boss |

`[INFERENCE: bosses were matched to areas by level and storyline text; the wiki's bestiary pages carry no area field.]`

Boss HP runs from 300 (Rock Golem, level 4) to 150,000,000 (Ascended Headmaster, level 80): six orders of magnitude over 76 levels. The store page promises "over 60 hours … with a clear ending (or perhaps more than one…?)".
