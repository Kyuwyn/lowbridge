# 05: Exploration, combat, familiars

Sources: demo source v1.5.5 (`exploration/**`, `items/Equipment.tsx`, `items/equipment/PouchItem.tsx`, `familiars/**`, `Quickbar.tsx`, `helps/HelpLoaderDemo.tsx`); wiki bestiary (134 pages) via `data-census.md` §1.6 and §3.3; patch notes; community guides.

Exploration is where the run's Monstium, coins, loot, storylines and walls come from. The launch FAQ calls MR2 an "auto-battler RPG", and an incrementaldb reviewer summarised it as "you fight monsters, … mechanics help you fight better, and you win by defeating the final boss".

## 1. Dungeons, floors and the boss counter

A **dungeon** (Training Towers, Sewers, Vast Desert, Cavern, …; `02` §7) holds **floors**. Exploring a floor is a timed loop: every **5 s** (base; *Efficient Exploration* −25 %, *Compass* −30 %) an exploration resolves into one weighted outcome: an enemy encounter, an event, a chest, a storyline roll. Each successful exploration counts towards the floor's **boss**, which can be fought after **50** successes (base). *Location Encyclopedia* cuts that requirement by ×0.65 for every retirement in which the floor's boss became reachable, down to 1 ("about 6–7 kills per zone clear" in a speed-run guide). Floors can auto-advance to the next and auto-attempt the boss; both stop after a boss loss. The Exploration screen has a Strategy tab with Exploration Config options (reordered for visibility in 1.6.3). `[v1.5.5 src; wiki; gameplay.tips]`

Floors carry a recommended MPL range (`getMinimum/MaximumMPLRecommendation`), shown to the player. The developer used it to steer the retirement loop: a floor tells you how much prestige it expects.

## 2. Combat

**Stats** (player base values): Max HP 60, Attack 5, Defence 0, Attack Delay 2.0 s, HP regen 0.33 % of max per second, Dodge 100, Accuracy 100, Crit 0. Every stat is `applyTransformations([Player, stat], base)`. Enemies have the same stats plus level, coin and Monstium awards, loot tables and a backdrop colour. `[v1.5.5 src]`

**Turn structure.** Real-time with progress bars: each combatant's action fills over its attack delay and then acts. The player auto-attacks; spells are cast by hand, from the quickbar (hotkeys, several quickbars saved per world) or by wizards (`06` §3). Up to 30 attacks are processed per tick when time is fast. `[v1.5.5 src]`

**Damage.** With attack A and defence D, if A × 1.15 > D the damage is A − D/2; otherwise a smooth curve takes over that approaches 1 as defence grows (minimum 1). Defence halves damage early and walls it late.

**Hit chance.** r = min(accuracy / dodge, 1); P(hit) = −1.33333 r² + 3 r − 0.66667. In words: equal accuracy and dodge always hit; ⅔ of the dodge gives about 74 %; half gives 50 %; a quarter gives 0. Help has a *Dodge and Accuracy* entry.

**Crits** roll from crit points, deal ×1.5, and can be resisted by a separate crit-resistance roll.

**Status effects.** 63 temporary-effect classes in the demo alone (Wet, Chilled, Stunned, Poisoned, Airborne, barriers …), each with duration and magnitude transformable, some undispellable (1.3.2). Poison stacks per hit, so attack speed extends it; Help gained a poison-stacking entry in 1.2.12.

## 3. Enemies are scripted

Every enemy is a class with `getNextAction(state)`, so bosses have move lists and phases. The Head Instructor (level 10, 1,800 HP, 3 Paper guaranteed) charges a 1.7×-delay 1.8×-power strike, alternates elemental attacks that apply Wet and Chilled for 15 s, heals 2–2.5 % of max HP at 30 % chance when below 90 %, and changes pattern below 50 % HP. The wiki records later bosses that cancel rituals, erect spell or physical barriers depending on your weapon, silence, summon golems, absorb familiars or steal coins. Of the 26 demo enemies, 25 override `getNextAction`. `[v1.5.5 src; wiki Tips fields]`

The curve, from the wiki (`data-census.md` §3.3): 134 enemies, 54 bosses; boss HP 300 at level 4 (Rock Golem), 8,000 at 20 (Man-Eating Plant), 50,000 at 47, 999,000 at 67–70, 10–40 million at 75 (Satell and its forms), 150 million at 80 (Ascended Headmaster). Attack delay drops from ~2.5 s to 0.95 s.

**Bosses teach.** The Bestiary (unlocked by the *Compendium* storyline) shows stats, loot and encounter rates as you defeat an enemy more times ("up to 50"); once you lose to a boss more than twice, its entry adds tips written in your hired wizard's voice, naming the counter ("use Guard against Psychic Slam", "Primary Protection will not help here"). The Bestiary also links items to the enemies that drop them (1.3.7). Losing is information, and failure counters pay storylines too (`02` §3, *How to Fight*). `[v1.5.5 src; wiki; patch 1.3.7]`

## 4. Equipment and the pouch

Four slots: **Hand**, **Body**, **Accessory** (1; 2 after *Variety Collector*), **Pouch** (4 base; +1 each from *Enlarged*, *Professional* and *Giant Pouch*). Items carry flat and percentage stats, mana regen and cap, attack-delay ratios (scaled by a square-root divisor since 1.3.2 so they cannot reach zero), element spell-power bonuses and special effects; quality multiplies most of them (`04` §7). Equipment loadouts can be saved and swapped; swapping takes the highest-quality copy. `[v1.5.5 src; patch notes]`

**Pouch items are not consumed.** A potion has a number of uses per combat (base 1; *Health Potion Effectivity* +1) that refills at each new fight, with configurable auto-use thresholds (1.5.6 added detailed conditions for healing items). Community guides farm low-level enemies with cheap mana potions "since potions refresh on entering combat". Arcanum's consumables become a loadout. `[launch FAQ; v1.5.5 src; gameplay.tips]`

## 5. Losing

When HP reaches 0 the player "runs away … to recover from injuries caused by" the named attack: status becomes *Reviving*, HP regenerates (*First Aid* +60 % out of combat), and exploration resumes; an option waits for full HP first. Nothing is lost but time. Deaths are counted per floor and globally, and those counters feed storylines. Since 1.3.2, *Last Burst* ends the fight rather than killing the player. Compare Arcanum rule 27 ("death costs time only"): identical. `[v1.5.5 src]`

## 6. Familiars

*Wizard's Best Friend* (Life level 14, Cavern) unlocks **Familiar Crates** (25 land; 10,000 Coins + 10,000 Life essence, ×10 per crate). A familiar is a combatant with base stats, a per-level stat multiplier, a move list and its own exp (requirement multiplier 0.015 relative to its level curve; level cap **90**, +4 per Sheer Power level). `[v1.5.5 src; wiki]`

- **In combat**: one familiar fights beside you. In the **front row** it takes every enemy hit; swap it to the **back row** and you take them. Defensive familiars (bunny, scarab, rock golem) tank; fish and dryad deal damage. Familiars heal while "recovering" during combat; *Necromancy Ritual* multiplies that by 6.
- **Exploring alone**: familiars can be sent to any floor you have unlocked, where each encounter resolves instantly with success probability 0.5^(enemy level − familiar level) when under-levelled, paying loot and Monstium. Auto-explore sends them to the hardest floor they can handle.
- **Evolution**: a slime is the base familiar; each primary element has a transmuted item that evolves it into an element-specific familiar, and three standard ones are open to all. The *Breeder* class and *A Familiar's Proper Care* storyline, the Familiar Catalyst furniture and familiar-targeting spells (*Familiar Haste*, *Familiar Strength* …) form a small sub-economy.

`[v1.5.5 src; gameplay.tips; wiki]`

## 7. Reading the combat design

- **Two loops share one screen.** Exploration is idle (timed explorations, auto-advance, familiars on other floors); boss fights are active (quickbar timing, Guard on the telegraphed slam, pouch thresholds). The game uses event pop-up suppression during boss fights to protect the active part.
- **Walls are bosses, and bosses are puzzles with a printed answer.** The Bestiary tips, the wiki's Tips fields and the community guides are mostly per-boss counters. The design relies on retirement for raw power and on a specific counter for each wall.
- **Combat is the source of the run currencies** (Monstium for enhancements and boosts, coins, materials), so a stalled fight stalls the home. That coupling is what makes "retire when the next boss needs more than a couple of hours of farming" the community's rule of thumb.
