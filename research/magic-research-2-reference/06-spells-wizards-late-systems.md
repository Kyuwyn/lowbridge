# 06: Spells, wizards and late systems

Sources: demo source v1.5.5 (`spells/**`, `autocast/**`, `timetick/TimePieces.tsx`, `spellcraft/**`, `synchro/**`, `rituals/**`); `data-census.md` §1.3 (42 demo spells) and §3.2 (122 wiki spell pages), §3.6 (rituals); wiki; patch notes; community guides.

## 1. Spell anatomy

A spell is an Action with: an element; **level requirements** (one or more elements, e.g. Channel Four needs all four starters at 1); a base **mana cost**; a **cooldown** (0 for instant utility spells); a **Wizard Power** requirement for automation; an **autocast category** (Transmutation, Channeling, General buff, Combat buff, Attack, Healing, Other); named effects (`03` §3); and optionally an **empowering** level. Spells unlock simply by reaching the level; there is no learn or memorise step (contrast Arcanum rule 31's three verbs). The level-up event lists what became available. `[v1.5.5 src]`

Examples from the demo source (`data-census.md` §1.3):

| Spell | Element / level | Mana | Cooldown | Wizard Power | Empowering |
|---|---|---|---|---|---|
| Fireball | Fire 6 | 380 | 6 s | 20 | Fire 43: effect ×7, mana ×20 |
| Air Blast | Air 7 | 80 | 0.5 s | 6 (10 before 1.3.2) | Air 43: effect ×6, mana ×15 |
| Haste | Air 8 | 700 | — | — | Air 52 |
| Stoneskin | Earth 4 | 400 | — | — | Earth 54 |
| Enchant Market Stalls | Air 3 | 150 | — | — | — |

The wiki lists 122 spells: Earth 14, Mind 13, Air 12, Fire 11, Water 11, Electric 11, Time 11, Poison 10, Life 9, Space 8, Death 6, Holy 6. Categories include attacks, combat buffs (Strength, Haste, Stoneskin, Blur, Shapeshift Eagle), general buffs that enchant furniture for a duration ("Enchant Essence Catalysts", "Enchant Safes: +50 Max Gold granted by Safes for 70 sec"), healing, transmutation and channeling. Many general buffs exist to be kept up permanently, which is what wizards are for.

## 2. What makes a spell stronger

In order of when they arrive `[v1.5.5 src]`:

1. **Primary element**: mana cost ×0.5.
2. **Rank**: ×1.33353 per ten levels above the spell's base rank (×10 after eight ranks; `02` §2).
3. **Empowering**: at a high second level (about 43–54 for early spells) the spell flips to an empowered form, typically effect ×6–7 for mana ×15–20. It turns on automatically when reached and can be toggled off. Patch 1.3.2 cut Imbue Flames' empowerment from ×8 to ×6.
4. **Spell power** bonuses from items, class (Sage +10 % primary), synchro and spellcraft.
5. **Spellcraft** (§6).

The design keeps a level-6 spell relevant at level 70 without a new record, and gives each spell two "moments": unlock and empower.

## 3. Wizards and autocast

Hiring starts with *A Strange Visitor* at 500 Coins (`01` §4). Wizards come from **Wizard Chambers** (3 land; +1 wizard each), storylines (*The Student Contest* +5) and NG+. `[v1.5.5 src; wiki]`

**Wizard Power.** Each wizard produces **1 Wizard Power per second** (transformable: *Wizarding Ritual* +50 %) into the rule it is assigned to. A rule fires its spell when its accumulated power reaches the spell's Wizard Power requirement *and* its conditions hold; the cast still costs mana. So a rule with *n* wizards on a spell needing *P* casts at most every P/n seconds. Spellcrafts raise *P* (doubled in 1.2.7); *Shard Diligence* cuts shard transmutation to −90 % Wizard Power.

**Rules and strategies.** A strategy is an ordered list of rules: spell, wizards assigned, enabled, conditions, extras (e.g. transmute quantity, up to 999 after *Exclusive Lesson*). Conditions: *Always*, *Resource less than / more than* (absolute or as a ratio of cap), *Smartly*, *Temporary effect present*, *Temporary effect low on time*. A special *check-only* rule evaluates its conditions and, if they fail, **stops the rules below it**, which gives players gates ("only cast these when Mana > 80 %"). Strategies are saved in the **global** layer, so they survive retirements and worlds; loading one carries over accumulated progress where the same spell appears, and disables rules for spells not yet learned (1.2.16). The Wizards screen estimates mana and exp per second per rule and per strategy. `[v1.5.5 src; patch 1.2.16]`

**Perma-Cast.** Unlocked by the *Perma-Cast* storyline (have 15 wizards casting 15 different spells; Sewers). A spell on the Perma-Cast list is kept up continuously by however many free wizards it needs: wizards = ⌈(P / delay) / power per wizard⌉, and mana is drained per second rather than in lumps ("constant drain instead of having your mana pool bouncing all over the place", wiki). Patch 1.2.16 rebuilt it: all free wizards count as Perma-Cast wizards, spells can be switched off individually, and the strategy remembers it. Priority Perma-Cast spells (Wizard Focus, Enchant Mana Spouts, Enchant Mana Steamers) are processed first (1.5.7). `[wiki; patch notes]`

Wizards answer the same need as Arcanum's slots and Goal/Hobby flags (rule 24): automation as a resource you spend and allocate, not a toggle. They add two things Arcanum lacks: **rate-limiting by a second currency** (Wizard Power), and **condition logic** players can author.

## 4. Researchers

The same allocation idea, for exp: researchers are assigned per element in the Study screen (2.0 exp/s each before multipliers; `02` §3), with four auto-assign strategies and a 30-second grace after a manual change. Wizards cast, researchers study; both are bought with furniture that competes for land.

## 5. Time Pieces and game speed

`[v1.5.5 src; Help "Time Pieces"]` Offline gaps over ten minutes become Time Pieces (`03` §6). From the left menu the player sets **Normal, 2× or 5×** speed; 2× costs 3 Time Pieces per extra real second, 5× costs 4 (both transformable), and speed falls back to normal when they run out. Time Pieces can also be spent through an event action ("Use Time Pieces (Event)", 1.5.6; `[INFERENCE: it advances the random-event timer]`), and they carry across worlds (1.4.4). Time-element spells stack with them: *Time Contraction*, *Time Dilation*, *Time Warp (Study)* (Time 43, 12,000 Mana, 20 s cooldown: a lump of study exp; a community study build reports 1.09 trillion exp per cast), *Time Warp (Event)*, *Reset Time*, *Foresight* (Mind 14, 1.4.4: shows the countdown to the next random event).

## 6. Spellcraft

`[v1.5.5 src; wiki; gameplay.tips "Ultimate Guide to Spellcrafting"]` Spellcrafting attaches an elemental modifier to a spell. Each modification consumes **1,000 Prisms or 1,000 Jewels** of one element (transformable) and occupies a **Spellcrafting Vat** (15 land; ×6 cost per vat). A spell holds at most **two** spellcrafts, and they must differ (a Prism and a Jewel craft of the same element count as different). A spellcraft can be used on only one spell unless its element is primary. Each element's craft changes up to five multipliers: power, mana cost, cooldown, buff duration and Wizard Power; Jewel versions are stronger than Prism versions (Fire: cooldown penalty +15 % Prism / +35 % Jewel after 1.3.2; Air: −12 % / −20 %). Spellcrafted spells show an asterisk. *Hypervault of Spellcrafting* (six active spellcrafts, Plains) makes reconfiguration free and adds saved configurations.

## 7. Synchro

`[v1.5.5 src; wiki Tic-Tac-Toe; gameplay.tips]` Unlocked by *Tic-Tac-Toe* (Sewers): a **3 × 3 board** on which you place element tiles, at most **2 per element** (raised by `SynchroGridMax` effects). Every pair of orthogonally adjacent tiles of elements (a, b) triggers that pair's bonus once per adjacency; same-element pairs count once. Pairs are records (`SynchroBonus` per element pair; 22 in the demo), some negative. Effects reveal once you have ever unlocked their requirement (1.6.3). Eight named boards are saved per world. Community layouts are optimisation puzzles ("three Minds, three Times and three Electrics, each in a straight line parallel to the others; Electric and Mind cannot touch"). The board is a cheap source of build variety: 66 two-element pairs plus 12 same-element pairs, nine cells and one rule.

## 8. Rituals and corruption

`[v1.5.5 src; wiki 12 ritual pages; Steam guides]` Unlocked by *Ritualist's Secret* (defeat the Ritualist, Zeth) and requiring Death to be unlocked. Each ritual has a Death level requirement and a **corruption** cost; active rituals sum their corruption against a **corruption cap** (base 1, raised by effects). Rituals pay large bonuses: *Necromancy Ritual* (Death 1, corruption 6) +100 % familiar attack and +500 % familiar HP regeneration while recovering; *Wizarding Ritual* (Death 36, corruption 4) +50 % Wizard Power; others for mana, transmutation, study, anti-crit, anti-curse, traversal.

Exceeding the cap is allowed and penalised on a **graduated** schedule: any excess multiplies Max HP by 0.9 per point over; from 3 over, element exp × 0.7^(excess/3); from 5 over, transmutation cost × 2^(excess/5). The Rituals menu is badged when corruption exceeds the safe limit (1.6.3). Players treat it as a dial: "exceeding the corruption cap is acceptable" (Leximancer guide). *Path of Corruption* (have 20 corruption) unlocks the Cultist class (+25 % ritual effects).

## 9. How the late systems compose

Synchro, spellcraft, rituals, boosts, item quality, familiars and pouch loadouts arrive one by one between the Sewers and the School, and each is a separate multiplier layer on the same tagged pipeline. A community build for one boss names a class, two primaries, a spellcraft per spell, a boost allocation (Earth 30, Mind 20, Life 10, Holy 30), a familiar, two rituals and a synchro board. Build depth comes from stacking independent layers, each small, rather than from deep trees within one system. The cost is the multiplicative explosion discussed in `04` §8 and `07` §3.
