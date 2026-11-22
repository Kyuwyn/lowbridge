# 08: Design rules Magic Research 2 implies

Synthesis of pages 01–07. Numbering continues the shared list: Arcanum 1–38 and 70–74 (`../arcanum-reference/12-design-rules.md`, cited **[A n]**), Hundred Days 39–69 (`../hundred-days-reference/06-design-rules.md`, cited **[HD n]**). "Copy" means adopt the shape; "beat" means MR2 has the right idea and a weak execution; "avoid" means it is a worked example of what not to do. Each rule names its evidence page.

The one-line verdict: MR2 is the strongest of the three references on the **reset loop**, **automation**, **time handling**, **explaining numbers** and **the phone**, and the weakest on **content architecture**. Take its loops and its interface; keep Arcanum's data vocabulary underneath.

## L. The reset loop

75. **Prestige pays on best and on breadth.** Two multipliers come from the highest Maximum Primary Level ever (main term) and the sum of all MPLs (secondary term), so changing your focus each run is rewarded without a rule saying "rotate". Players found it, and the Help says it. (02 §4, 07 §4): *copy*
76. **The re-run is fast by formula; the reset costs only the new part.** Starting exp 400 × (1.27^MPL − 1) puts a returning primary at about two-thirds of its record (MPL 30 → level 19, MPL 50 → 33); from 1.5.4 later runs skip the opening ladder, and a storyline starts them at the second area with full storage. (02 §4, 01 §6): *copy*
77. **Show the prestige payout before the reset.** The Retirement screen states the new multipliers, the percentage change and the level you will start at; Help gives a threshold for the first reset (study ×2.5). This is **[HD 47]** (price on the button) applied to the biggest button in the game. (02 §4, 01 §5): *copy*
78. **Declare each field's reset layer in the state type.** `temp / run / world / global / options`; a flag write also records "ever" in the world layer; storyline completion is written to run and world. MR2's later migrations moved fields between layers, which is the cost of deciding late. For Lowbridge, the layer is a property of every save field and the validator checks it. (03 §1, §8): *copy*
79. **Permanent unlocks are the content; run purchases are the economy.** Storylines persist through every retirement; enhancements, furniture and boosts are re-bought each run. Same-titled variants allow one per retirement, which turns a reset into a choice. Extends **[A 26]**. (02 §5, 04 §6): *copy*
80. **New Game+ as a budget, not a wipe.** Boon points with Fibonacci prices (5, 8, 13 … 377 per level) and a difficulty that multiplies income by 1.6 per level: difficulty is how you buy power. The developer's own mod lifting both caps from 10 to 100 shows the ceiling was felt. (02 §6, 07 §3): *copy if a world-level prestige is ever in scope*

## M. Discovery

81. **Hints are a progression stat.** Each storyline carries a Mind level at which its hint appears, behind a storyline that teaches the hint system; Stats lists every storyline by status (Undiscovered → Discoverable → Hint Available → Completed → Bonus Active). Discovery itself levels up. (02 §5): *copy*
82. **Riddle triggers ship with a hint channel, never without.** "Hold exactly 123 Mind Shards at level 38" cannot be found by play; MR2 can afford such content only because hints exist. **[A 72]** wants restraint made visible; this is the mechanism. (02 §5): *copy the pair*
83. **Randomness that gates permanent content needs pity, shown odds and a stated target.** MR2's interval stretches with run length, pity multiplies storyline weight ×40 after three hours, odds appear in Stats, and the design target is written down ("6–8 hours idle should always trigger one"). It still took three patches. Prefer deterministic triggers for anything permanent; keep chance for flavour. (02 §5, 07 §2): *beat*
84. **Losing is information and currency.** The Bestiary reveals an enemy's stats as you defeat it and adds counter-tips after two boss losses; *How to Fight* pays permanent stats for 20 retreats in a run; death costs only recovery time. Extends **[A 27]** and **[A 36]**. (05 §3, §5): *copy*

## N. Specialisation and scaling

85. **Rank thresholds rescale old content.** Every ten levels above a spell's own rank multiplies it by 1.33353 (×10 after eight ranks), and empowering gives the same spell a second moment at a high level (effect ×6–7, cost ×15–20). A technique stays useful for the whole game with no new record. Complements **[A 16]** education rungs. (02 §2, 06 §2): *copy*
86. **Specialisation is a bundle of multipliers chosen per run.** Primary element: cost ×0.5, exp ×2, a gentler curve (exponent 1.38 vs 1.43), and only it counts for prestige. One choice, four effects, re-chosen every reset. (02 §3): *copy*
87. **Grant part of a thing before the whole.** Partially unlocked elements are usable at storage ×0.25, channeling ×⅓ and a punishing exp curve; a storyline later completes them. The player meets the system before owning it. (02 §1): *copy*
88. **Penalise over a soft cap on a graduated schedule.** Corruption over its cap costs HP at once, exp from +3 and transmutation cost from +5; players treat the cap as a dial, not a wall. (06 §8): *copy*

## O. Automation and time

89. **Automation is a second currency you allocate.** Each wizard yields 1 Wizard Power/s into one ordered rule; the spell's requirement rate-limits it; conditions and a gate rule let players author logic; strategies survive every reset. Extends **[A 24]** with rate-limiting and conditions. (06 §3): *copy*
90. **"Keep this up" is a one-line automation.** Perma-Cast sizes the wizards itself and drains mana smoothly; it replaced per-rule micromanagement ten days after launch (1.2.16). (06 §3, 07 §2): *copy*
91. **Three time bands.** Simulate short gaps exactly (≤ 30 s), warp medium gaps with a progress bar (≤ 10 min), and bank long absences as a capped, spendable speed resource (Time Pieces, 48 h cap, 2× or 5× at a per-second price). Sits between **[A 25]** (bank) and **[HD 43]** (clamp, avoided). (03 §6, 06 §5): *copy*

## P. Economy shape

92. **Price verbs as a share of the cap.** Channeling costs 10 % of max Mana, so every cap raise is also a production raise; the cap becomes the progression. Strengthens **[A 18]**. (04 §2): *copy*
93. **Budget the exponent before writing content.** Catalysts at 1.18ⁿ, the MPL multiplier, quality 1.1^q, NG+, synchro, spellcraft and rituals all multiply; the late game reached 10¹⁰ exp/s and 1,000× sale prices. Patches bent curves to roots and logs one at a time, and the developer finally root-compressed the whole pipeline in a mod. Decide the growth envelope and which layers add rather than multiply. (04 §8, 07 §2–3): *avoid the unbounded stack*
94. **A space budget must stay optional or end.** Land made a mid-game puzzle and a chore (sell researchers for space, rebuy furniture for counts). MR2 answered with a second game mode and a late storyline that removes land entirely. If Lowbridge keeps **[A 19]** floor space, give it an exit. (04 §4): *beat*

## Q. Content architecture

95. **Content as code ships fast and can never be validated.** One developer shipped 127 storylines and 4,646 strings as TypeScript; nothing can check reachability, players reverse-engineered triggers, and manual cache invalidation was the main bug class. Keep the data vocabulary and `bun run validate` (**[A 1]**, **[HD 51]**, **[HD 55]**). (03 §4–5, §7, §11): *avoid*
96. **Named effects plus ordered, tagged modifiers, as data.** Each record names its numbers (`average`, `variance`, `essenceEfficiency`); a modifier targets a tag set; order is add → power → multiply → override. This unifies **[A 4]** mod patching, **[A 5]** resource mods and Hundred Days' cost tables into one mechanism, and needs no code per record. (03 §3): *copy as data*
97. **Every number explains itself.** Every displayed effect carries an underlined breakdown of base and modifiers with their sources, and Help states the formulas (MPL, hit chance, retirement threshold). Extends **[A 33]** and **[HD 62]**. (01 §5, 03 §3): *copy*

## R. Shell

98. **A phone layout is achievable for this genre.** Drawer for resources, bell for events, bottom tab bar, a floating cast button, pinned double screens on wide displays; the same code ships on iOS, Android and Steam, with a screen-reader pass. It answers **[A 37]** and **[HD 67]**. (01 §2): *copy*
99. **One goal line, one event channel.** "Current Goal" always names the next action; every unlock is an event that stays readable; pop-ups can be suppressed per tag and during boss fights. Pairs with **[HD 61]** and **[HD 68]**. (01 §4–5): *copy*
100. **Bosses are puzzles; print the answer in the game.** Scripted move lists with HP phases make walls specific, and the Bestiary's tips name the counter, so the wiki is optional. In data: a boss record with a move list, phase thresholds and a tips text. (05 §3): *copy*

## Licensing (binding on us, not a design rule)

The demo repository has **no licence**: its source map was read for mechanics, and nothing from it may be copied. The strings file is CC BY 4.0, the modding SDK and the developer's mods are MIT, the wiki is CC BY-SA; Lowbridge is still a clean implementation, so none of it goes into `src/`. Stored here: the wiki dump (with attribution, `sources/README.md`) and derived tables of names and numbers. (README)

## What the three references say together

- **Arcanum's vocabulary is the right floor; MR2's loops are the right ceiling.** Arcanum (and Hundred Days, its fork) shows that one record vocabulary scales to 4,520 records and can be validated; MR2 shows what a single developer can build on top of a reset loop, automation and explained numbers, and what it costs to do that in code.
- **Three answers to offline time.** Arcanum banks it and lets you spend it (**[A 25]**); Hundred Days clamps it and loses it (**[HD 43]**); MR2 simulates short gaps, warps medium ones and banks long ones as Time Pieces (rule 91). Rule 91 is the most complete.
- **Three answers to prestige.** Arcanum's Hall patches the opening without reset (**[A 26]**); Hundred Days pays milestone points without reset (**[HD 42]**); MR2 makes the reset the spine, with a visible payout and a fast re-run (rules 75–80). If Lowbridge resets anything, MR2 is the model; if it does not, Arcanum's and Hundred Days' no-reset prestige remains available.
- **Three answers to automation.** Arcanum: rare slots plus priority flags (**[A 24]**). Hundred Days: Arcanum's, unchanged. MR2: an allocated second currency with authored rules and a "keep it up" list (rules 89–90).
- **Only MR2 runs on a phone** (rule 98), and only MR2 shows every total with its breakdown (rule 97). Both are interface work Lowbridge can adopt regardless of engine.
- **Only MR2 reaches far enough to show multiplicative compounding** (rule 93). Arcanum's reference stops at a T4 save and Hundred Days' at its first realm, so their silence on late-game scaling is not evidence that their stacks are safe.
