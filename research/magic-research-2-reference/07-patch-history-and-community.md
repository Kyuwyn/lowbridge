# 07: Patch history and community

Sources: Steam news API for app 2864890 (21 posts, 2024-05-10 → 2024-08-08, 378 bullet points, counted 2026-11-19); `mcolotto/magic-research-2-maticolotto-mods` (`df0f333`, 2024-08-20); Steam discussions; gameplay.tips guides by Leximancer, Kaho, Aurora Lucias and others (2024); r/MagicResearch; incrementaldb review 1665; gamebrain.co review aggregate. Community claims are reported, not verified, unless a source file confirms them.

## 1. Cadence

| Date | Version | Kind |
|---|---|---|
| 2024-05-10 | demo 1.1.0 | Quick Channeling; import Magic Research 1 saves for three small bonuses |
| 2024-05-21 | 1.0.x → launch | release; the full game shipped with 1.2 on the beta branch |
| 2024-05-22 | 1.2.7 | two storylines (*Building Blocks*, *Exclusive Lesson*, total 127), experimental alternate Land, multi-transmute, five caching fixes, about ten balance changes (mostly nerfs) |
| 2024-05-24 → 05-31 | 1.2.9, 1.2.12, 1.2.13, 1.2.16 | crash fixes, storyline pity fix, Perma-Cast rebuilt |
| 2024-06-06 | 1.3.2, 1.3.4 | **Classic Mode**, early-game speed-up, attack-delay rework, late-game trims |
| 2024-06-11 → 06-23 | 1.3.7, 1.4.4, 1.5.1 | Compendium navigation, Foresight, familiar rebalance, a DPS-test enemy and storyline |
| 2024-07-07 → 07-18 | 1.5.4 – 1.6.4 | "Channel and Build" buttons, opening skip, UI friction pass |
| 2024-08-03 → 08-08 | 1.8.2 – 1.8.6 | title screen, save slots, experimental modding |

Twenty-one posts in thirteen weeks, then nothing: the developer treated the game as finished with "a clear ending", put the strings up for crowd translation (base file refreshed for 1.8.6 in December 2024) and published mods rather than patches.

## 2. What the patches changed, by theme

Keyword counts over the 378 bullets: 48 mention a storyline, 32 reduce something, 24 increase something, 14 mention caching, 11 crashes, 11 random events, 5 accessibility, 5 translation.

**Friction, not content, was the main work.** Quick Channeling (demo 1.1), recursive "Transmute Materials and Item" that also channels missing essence (1.2.7, 1.2.12), press-and-hold on it (1.3.2), "Channel and Build" on every Home action (1.5.4), auto-combine (1.2.12 → 1.6.3), queueable enhancements (1.6.3), input fields for exact quantities (1.6.3), Perma-Cast rebuilt so wizards no longer need assigning (1.2.16). The 1.6.3 post states the aim: "a lot of UI changes and improvements, with the goal of trying to reduce friction while playing the game."

**Random storylines needed three passes.** 1.2.12 fixed the pity system ("random Storylines … triggering less frequently than intended"); 1.2.16 showed the odds of each random storyline in Stats; 1.3.2 raised early random-storyline chances by about 50 %, made pity repeatable, revealed the names of storylines a random event grants, and set the goal "leaving a game idle 6–8 hours should always trigger at least one random Storyline". 1.4.4 added *Foresight* to show the timer.

**Early game made faster, later runs made shorter.** 1.3.2 raised Monstium drops in the Training Towers and Sewers, raised the Essence Catalyst bonus (15 → 18 %), raised Mana Spout output (0.75 → 1.0/s), cut early spell costs. 1.5.4 cut *Essence Artifact* from 60 explorations to 20 (the wiki still says 60) and made *Types of Wizards* "skip all early game progression up to unlocking Exploration" on later runs: the 13-step opening (`01` §4) is played once.

**Late-game numbers trimmed repeatedly.** 1.2.7 cut Hurricane Whip, Elite Magical Uniform, Earrings of Poison Amplification, Gloves of Spell Strength, Air spellcrafts, Divine Stiletto, Enchant Transmutation, and doubled spellcraft Wizard Power penalties. 1.3.2 changed attack-delay bonuses to a square-root divisor "rather than a linear divisor", cut *Agility of Gods*, *Rush*, *Blinding Speed*, *Monstrous*, Boost Attack, two synchro pairs (Death + Time +50 % → +25 %, Earth + Holy +25 % → +10 %), and made *Shapeshift Eagle* scale logarithmically. 1.5.1 made *Enchant Spell Catalysts* scale logarithmically and gave the Spell Catalyst a Max Mana penalty. The pattern: linear and multiplicative bonuses on attack speed and production compounded faster than intended, and each fix bent one curve towards a log or root.

**Land became optional.** 1.2.7 added "an experimental setting for an alternative implementation for Land"; 1.3.2 renamed it Classic Mode, made the default "Modern Mode", and prompted every existing save to choose. Storage costs and storyline captions were adjusted for both modes. (`04` §4.)

**Cache bugs were the main bug class**: 14 bullets, including "Fix some 'Enchant X' spells not correctly showing up", "Fix several caching errors related to Max Mana and spell costs", "Fix caching bugs related to Corruption cap", "Fix caching bug when evolving a Familiar". See `03` §7.

**Accessibility was maintained throughout**: screen-reader labels (1.2.9, 1.2.12, 1.3.7, 1.5.4), RTL layout fixes (1.5.1), low-contrast mode, colour tweaks for readability (1.5.1).

## 3. The developer's own mods

Published in August 2024 under MIT, after the last patch:

- **MR2 – Rebalanced**: "Rebalances the scaling of effects, especially in late and post-game." Its core replaces `applyTransformations` with a version that takes a *base power* p from Power-type transformations, raises the starting value to 1/p, applies additions and multipliers, then raises the result to p again: a root-compression of the whole stack. It also changes items and spells (about 1,100 lines). The developer's post-release answer to the multiplicative explosion of `04` §8 was to compress the pipeline itself rather than edit hundreds of numbers.
- **Unleash the Worlds**: raises the NG+ difficulty and boon caps from 10 to 100 and removes the need to climb difficulties in order.
- **Fungal Research** adds a thirteenth element (the SDK's example of `preload`); **Transmutable Caliburn** makes an easter-egg sword craftable.

## 4. What players report

- **Retire often and rotate.** Retire when the next boss would take more than a couple of hours of farming; start the next run with a new primary aimed above your best; check the Stats screen's storyline list when stuck (Leximancer). "Optimal" multiplier growth is 50–100 % per retirement, many push 200–250 %; retire whenever a wanted storyline becomes available, since many only apply after retiring; "no real downside to retiring often" (Steam thread on MPL). The MPL arithmetic in that thread matches the source formula (`02` §4).
- **A run has phases**: maximise storage (spellcraft and synchro for caps, buy boosts to cap, disable furniture that costs efficiency), then rituals and crafting, then gear, then combat setup (Leximancer). Land is the first bottleneck; researchers are sold temporarily to free land.
- **Walls are named bosses**: Mindbender (a "0 retirement" guide exists), Sand Dweller, Avian Elephant (high dodge, slow attacks), Lytha (silence, Psychic Slam: "use Guard against it"), Dragonbones, Satell, the Universal Challenge. Guides are per-boss counter lists, which the Bestiary's tips partly provide in-game.
- **Builds stack layers**: one primary-challenge build names class Builder, primaries Holy/Space, a Space jewel on every damage spell, boosts "Earth 30, Mind 20, Life 10, Holy 30", a Holy familiar for tanking, Mana and Necromancy rituals, and a synchro board, reaching 75–90 k Max Mana and Big Bang hits around 1.2 million.
- **Late-game scale**: research at 10.1 billion exp/s in a study build; a level-8 Prismatic Ring about 20× channeling; a level-7 Regal Robe 116× drops; market sales at 60× to nearly 1,000× value.
- **Criticism**: combat is nearly the only activity, fights become automatable early yet stay numerous, and the story "really falls downhill after a while" (incrementaldb, about two weeks to finish). An aggregate of Steam reviews counts 52 positive mentions of the story and 20 negative of grinding (gamebrain.co). Steam reviews are "Very Positive" (573 at the time of the store snapshot in the search results).

## 5. The wiki as evidence

The fandom wiki was created on release day and most of its 663 pages were bulk-written in 2025 (648 last edited that year) from a fixed template: `== maxHP ==`, `== attackDelay ==`, `== CoinsAwardedBase ==` are the game's own field names, so they were taken from the code or a data dump `[INFERENCE]`. It has no game-version label, mixes patch eras (Essence Artifact still at 60 explorations), lists a few storyline triggers as "???", and its hand-written pages are few (25, of which the *Storylines* index and *Items* are substantial). It is a good census of *what exists* and a weak source of *current numbers*; prefer the demo source for anything in the first 4–8 hours and the strings file for wording. Compare Hundred Days rule 63 on stub pages.
