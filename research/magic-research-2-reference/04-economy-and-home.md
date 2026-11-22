# 04: Economy and home

Sources: demo source v1.5.5 (`Resources.tsx`, `buildings/**`, `spells/channeling/**`, `action/actions/ExpandHome.tsx`, `enhancement/**`, `boost/BoostActionBase.tsx`, `items/**`), `data-census.md` §1.4–1.5 and §3.4–3.5, wiki pages *Gold*, *Items* and *Transmutation Materials*, patch notes 1.2.7–1.6.3. Numbers are demo-source base values before transformations unless marked.

## 1. Resources and caps

Sixteen resources: **Mana**, twelve **essences** (one per element), **Coins**, **Monstium**, **Time Pieces**. Base caps: Mana 100, each essence 100, Coins 10,000, Monstium 1,000, Time Pieces 100,000. Every cap is `applyTransformations([resource, Cap], base)`, so furniture, items, storylines, NG+ and partial unlocks (×0.25) all move caps the same way. Each resource's income is the sum of registered *income-over-time producers* (furniture, spells, rituals), shown per second under Resources; a producer with expenses stops when it cannot pay them. `[v1.5.5 src]`

Arcanum's rule 18 (caps first, bills sized to caps) holds strongly: an Action whose cost exceeds the resource's cap is disabled, so "raise the cap" is the visible next step for every expensive spell, and the storyline triggers of the mid-game are often *hold N of something*. Community guides open with "fill every resource to its cap before spending" and "maximize storage" as phase 1 of a run (`07` §4).

## 2. Mana and channeling

- **Gather Mana** (+1 per press, press-and-hold to repeat) is the only free verb.
- **Mana Spouts** (+1.0 Mana/s each; 2 land; 10 Water + 5 Air essence, ×1.25 per copy) are the first income; **Mana Shards** (+100 Mana cap; 2 land) the first cap. **Mana Steamers** (unlocked by an enhancement; 4 land; +6 Mana/s, consuming 3 Fire and 3 Water essence/s; can be switched off) convert essence back into Mana.
- **Channeling** turns Mana into essence. A channel spell costs a fixed **10 % of max Mana** and grants Mana spent × *channeling efficiency* of its essence. *Channel Four* does all four starters at once; *Channel All* (storyline *All the Elements*) does every element. Quick Channeling puts one-tap icons in the spell column (demo 1.1.0, added to cut clicks). `[v1.5.5 src; Steam news 2024-05-10]`
- **Essence Catalysts** multiply channeling efficiency by **1.18 per catalyst, multiplicatively** (`1.18^n`; 10 land; 200 Fire essence ×2.0 per copy). Patch 1.3.2 raised the base from 15 % to 18 % and added story text "to make it clearer that their effects stack with each other and that they are very important for Essence production, despite their hefty cost". `[v1.5.5 src; patch 1.3.2]`

Because channeling costs a share of the cap, every Mana Shard makes every channel bigger with no new verb. That single choice turns cap growth into production growth.

## 3. Essence storage and conversion

**Essence Storages** add +400 to each element's essence cap per copy (5 land; 60 Earth ×1.4). Enhancements multiply that: *Compressed Essence* ×4, *Wide Storage* ×3, *Primary Storage* ×2 for the primary. **Sewage Systems** (6 land, switchable) turn 10 Poison essence/s into +100/s of each of Fire, Earth, Water and Air; *Clean Sewer Dimension* later makes them produce every element but Poison. **Monstium Catalysts**, **Monstruariums** (Monstium cap) and **Safes** / **Treasure Chests** (Coins cap) follow the same pattern. Furniture that consumes can be **turned off**; Help has an entry on it, and the 1.2.12 patch lets players toggle off enhancements "that have adverse effects". `[v1.5.5 src; data-census.md §1.4]`

## 4. Furniture and land

Furniture is bought with a *building spell* (a Spell that costs Mana plus essences and places a copy). Cost per copy is `base × (1 + scale)^owned` per resource: scales run from 1.25 (spouts, shards, steamers) through 1.4 (storages, safes) and 2.0 (catalysts) to 6.0 and 10.0 (Spellcrafting Vat, Familiar Crate). Furniture can be **disposed of**; the *Building Blocks* storyline (dispose of 20) makes disposal refund the cost. *Furniture Preservation* storylines (one per retirement, five options) and *Advanced Furniture Preservation* (five more) let a chosen furniture type survive retirement. `[v1.5.5 src; wiki]`

**Land** is the shared budget (Modern mode). The home starts with **150** land; each furniture has a land size (2 for spouts, 10 for catalysts, 15 for a vat, 25 for a familiar crate). *Expand Home* buys +20 land at a cost that grows by ×1.667 per purchase; enhancements *Land Treaty* and *House Expansion Contract* cheapen it, *Furniture Organization* adds 10 %, the Builder class 12 %. Land competes between production, storage, researchers (Researcher Desks, 4 land) and wizards (Wizard Chambers, 3 land). `[v1.5.5 src]`

**Classic mode** (introduced in 1.2.7 as "alternate Land", renamed in 1.3.2 and offered as a one-time choice to existing saves): furniture uses no land. Instead each furniture has a count up to which it scales gently (`(1 + s × k)^n`), after which it scales at `(1 + s)^(2.1n)`; each land purchase divides the steep part by 0.9925^land. The game offers both modes at the first screen. Late in Modern mode the storyline *Blessed Land* (Expand Home 100+ times and The Big Purchase in a previous run) "removes all Land requirements"; the Builder class then becomes −50 % furniture cost. So the game introduces land as a mid-game puzzle and then dissolves it. The community's complaints show why: guides advise selling researchers temporarily to free land and repeatedly buying and selling furniture to meet storyline counts. `[patch notes 1.2.7, 1.3.2; wiki; gameplay.tips]`

## 5. Coins and Market Stalls

Coins come from selling items and from combat drops (each enemy has a base coin award; the boss Goblin Chief steals thousands instead). **Market Stalls** (3 land) sell items you have marked for sale, one sale per stall every **30 s** base; selling by hand pays base price. Price bonuses: item quality ×1.5 per level, *Glittering Stalls* +100 %, *Charming Stalls* +150 %, *Merchant's Mask* +100 %, spell *Richness* +50 % (+150 % empowered), the random event *Sale Rush* (2× speed, +50 % gold for five minutes), NG+ Blazing Speed ×1.8 per level. Coins pay for wizards, researchers, stalls and storyline gates (`01` §4: 500, 1,000, 1,500 coins open wizards, stalls and researchers). Late-game market sales reach 60× to nearly 1,000× base value (community). `[v1.5.5 src; wiki Gold; gameplay.tips]`

## 6. Monstium, enhancements and boosts

**Monstium** drops from enemies (`MonstiumAwardedBase` per enemy; ×1.4 with *Monstium Collection*) and from Monstium Catalysts. It pays for two things:

- **Enhancements**: one-off purchases for the current run, priced in Monstium plus Paper (30 in the demo, from 200 Monstium + 1 Paper to 25,000 + 30). They add pouch slots, Max HP, exploration speed, study multipliers (*Understanding of Magic* ×2, *Deeper Understanding* +60 %), storage multipliers, and unlock furniture types (Mana Steamers, Safes, Sewage System, Monstium Catalysts). "Enhancements will last for the rest of the run, but they do not persist through Retirement" (Help). Since 1.6.3, after *Convenience*, purchases can be queued; there is an auto-purchase option. Community advice starts every run with "max out all enhancements".
- **Boosts**: repeatable per-element purchases, unlocked permanently by *The Fancy Paperweight* (defeat the boss of The Sphinx, Vast Desert; hint at Mind 30) and active from the next retirement. Cost: **100 Monstium × 1.2^(boosts bought in total)** and **1,000 essence × 1.4^(boosts of that element)**. Each pays a small stat (1.3.2: Boost Attack +0.75 %, Boost Attack Delay −0.5 %). The joint Monstium term makes every element's boosts dearer, so boosts are spread by choice, not bought out. Boosts can be cleared ("reset the boost lamp") and re-bought, and auto-purchased. `[v1.5.5 src; patch 1.3.2]`

Paper is the bridge: it is transmuted (Earth, level 1; 300 Mana + 2,000 Earth essence) and also drops from the Head Instructor. *Monstium Paper* and *Books* are its higher tiers for stronger enhancements. Combat therefore feeds the home economy (Monstium) and the home economy feeds combat (Paper, gear).

## 7. Transmutation and item quality

**Transmutation** spells turn Mana, essences and materials into items. Each recipe has element-level requirements per element (the wiki's element pages list which items unlock at which level). Materials ladder from shards (500 essence, level 2) and prisms (50,000 essence, level 24) through ores, ingots (copper → silver → gold → mythril → vampiric) and cloths, to jewels and divine crystals. Equipment recipes consume earlier equipment and materials (the wiki's *Items* page lists what each material is used in). 198 equipment and 45 material pages in the wiki. Wizards can transmute automatically (`06` §3), up to 999 at a time after *Exclusive Lesson*. Patch 1.2.7 made "Transmute Materials" recursive (it transmutes the materials' materials), and 1.2.12 made it channel missing essence too. `[v1.5.5 src; wiki; patch notes]`

**Item quality** (+1, +2, …) multiplies an item's effects by **1.1^q** (attack-delay bonuses excepted) and its sale price by **1.5^q**. Two routes:

1. **Combine** copies (the *Schematics* storyline, Cavern: "combine 3 of the same … into a stronger version"); auto-combine options followed in 1.2.7–1.6.3.
2. **Roll** on transmute (after *Transmutation Prayer (Quality)*): starting at +0, each step continues with probability 1 − 0.9 × 0.97^(L × 0.8^q), where L is how far your element levels exceed the recipe's on average (plus `ItemQualityLevelDelta` bonuses, e.g. a Synchro layout). Over-levelling therefore turns into quality. Max quality starts at **15** and rises by 1 per Sheer Power level. The Transmute screen shows the odds of each quality since 1.3.7. `[v1.5.5 src; strings; patch 1.3.7]`

Potions are **not consumed**: pouch items have uses per combat that refresh each fight (`05` §4), inventory is unlimited, and item creation can be automated (launch FAQ). The inventory is a build, not a stockpile.

## 8. How the economy feels at scale

Every production line is a product of multipliers: catalysts `1.18^n`, the MPL production multiplier, class, NG+, items ×1.1^q, storylines, rituals, synchro, spellcraft. Community reports from the late game: research at 10.1 billion exp/s, a level-8 Prismatic Ring giving about 20× channeling, a level-7 Regal Robe giving 116× drops. The developer's response, after release, was a mod that root-compresses the transformation pipeline for late and post-game (`07` §3). Lowbridge should budget the exponent before content, not after (rule 93).
