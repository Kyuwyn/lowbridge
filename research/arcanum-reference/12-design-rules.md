# 12: Design rules the reference implies

Synthesis of pages 01-11. Keeps the 13 rules from `../arcanum-mechanics-2026-10-18/MECHANICS-STUDY.md` (marked **[M]**) and adds what the mid-game view, the full data and the live UI showed. Each rule names its evidence page. "Copy" means the shape is worth adopting as-is; "beat" means the reference is weak there and Lowbridge should do better.

## A. Shape of content

1. **One record vocabulary for everything.** `require / need+needtext / buy / cost / run / effect / result / mod / max / length / perpetual / fill / at / slot / tags / lock`. UI renders by field, never by type. (03): *copy*
2. **Visibility ≠ actionability.** `require` reveals; `need` + `needtext` says what is missing in words. **[M11]** (02, 03): *copy*
3. **Expressions in data.** Gates and prices are expressions over state, so escalation (`500+g.x*500`) and history (`g.evil2<=0`, "never studied") are authored, not coded. (03): *copy*
4. **Mod patching (`X.mod.Y`).** Late content multiplies what early content pays per level; 229/596 upgrades and the whole Education ladder work this way. Content compounds instead of being replaced. (03, 05): *copy*
5. **Resources can carry mods.** Books raise research cap/rate while held; prosperity raises danger; contamination debuffs. Inventory is a build; liquidation is explicit and lossy. (06): *copy*
6. **Exclusive-choice slots.** home, bed, mount, body, leisure, companion, rest variant, equip slots: one record per slot, swap to change. (02): *copy*
7. **Repetition curves (`at` / `every`).** Tasks and spells improve at authored counts (5/25/500; 25/75/300) and some sour. **[M9]** (02, 09): *copy*
8. **Sections are records.** A new system arrives as a whole tab gated by one requirement. (01, 03): *copy*
9. **Delta save keyed by stable ids;** recompute everything derivable. (03): *copy*

## B. Progression

10. **Entry → runway → wall.** Skills: cheap entry gated by a home arrangement, 5 levels each paying a passive bonus, then a cap moved only from outside (class, education, site, furniture, tier). **[M1, M2]** (05): *copy*
11. **Classes are keys that count.** Small cap raises plus mod patches; line tags are integers used in later gates; three from one line is optimal; same-tier choice is exclusive; some classes secret. **[M4, M5]** Testing build decouples class *rank* from tier number and makes most classes free. (04): *copy the key/count/exclusive shape; beat the hidden-exclusion discoverability*
12. **Tier-up = N-of-M pointers + a bill in slow shared currencies, and it locks the previous stage's tools while adding caps of its own.** **[M6]** (04): *copy*
13. **One generalist line always open**, priced on an escalating curve, broad and shallow, never holding an exclusive key. **[M7]** (04): *copy*
14. **Four independent ladders** (tier, skills, wizard level, morality), gating each other at a few named points; morality skippable but consequential (whole modules). **[M7-bis]** (04): *copy*
15. **Hidden consequences early** (Study rules out Savant; Treffil before spellbook leads to Red Adept) with the UI offering a hide tool as mitigation. (04, 02): *beat: keep the consequence, surface the warning*
16. **Education rungs** every 5 levels turn investment into larger per-level payouts; top rungs line-gated via cap requirements. (05): *copy*
17. **The first cap is hit in a minute; tutorial class in three; first stage under an hour.** **[M8]** (04): *copy the density*

## C. Economy and space

18. **Caps first, rates second.** Start every resource tiny and capped; bills are sized to most of a full cap even at T4. (06, 11): *copy*
19. **Caps live on kept things** (storage furniture, mounts, homes, held books) and compete for floor space, which the home sets. (06, 07): *copy*
20. **Passive conversion is owned furniture**, space-limited, not another slot activity. (06, 07): *copy*
21. **Home progression is one-way construction** with multi-resource drains; homes bias rates by line. (07): *copy*
22. **Distance is a bought progression axis** (mounts) metering which adventures exist. (08): *copy*

## D. Time and control

23. **One slot + auto-filling rest + `fill`** removes idle micromanagement without automation purchases. (02, 10): *copy*
24. **Slots are rare named milestones** (4 in the whole game); **priority flags (Goal/Hobby) + bounded waiting list** are the automation, unlocked separately. **[M13]** (10): *copy*
25. **The offline bank is a capped resource**, spent deliberately (fast-forward) and grown by a skill and by prestige; time magic has its own mana and debuff. **[M10]** (10): *copy*
26. **Prestige patches the opening** (`chores.result.gold +1`) and never resets. (10): *copy if a prestige layer is ever in scope*

## E. Adventure

27. **Adventures are slot activities with floors;** leaving keeps progress; death costs time only; bosses reset. (08): *copy*
28. **Auto-battler turn = one attack + one spell in list order per speed tick;** quickslots are the active layer; summons split aggro. (08, 09): *copy*
29. **Noncombat sites use five stresses as HP** with their own healers and pay the knowledge currencies. **[M12]** (08): *copy*
30. **Locales are built from a shared encounter pool;** permanent-benefit encounters are tagged and filterable. (08): *copy*
31. **Spell = level budget + school + keywords + use curve;** learn / memorize / cast are three verbs; composition (spellcraft) arrives late with an additive budget. (09): *copy*

## F. Interface

32. **Persistent context:** ledger, running pane, vitals, log and quickbar never leave the screen; only the centre changes. (01): *copy*
33. **Density + one tooltip schema.** Name-only buttons in auto-fit grids; a single ordered detail schema (type → rate → desc → time → need → cost → run → effects → mods → results → locks → flavor) for every record. (01, 02): *copy the schema; beat hover-only (keyboard/touch pin)*
34. **Classify by timing, not group:** instant / timed / perpetual read differently (click pays; % in slot; no % and `(Full)`). (02): *copy*
35. **Owned stays visible as "Max"/count**; nothing moves to a done pile. (01): *judgement call; Lowbridge's Done group is a legitimate alternative*
36. **Play generates documentation:** Bestiary, Travelogue, Glossary unlock entry-by-entry. (01, 08): *copy at the scale that fits*
37. **Desktop-only layout;** mobile squeezes four columns into 390 px. (01): *beat*
38. **Irreversible actions confirm via `warn`;** same-tier class exclusion does not warn. (02, 04): *beat*

## G. Layer alignment (added 2026-10-27 from a layered craft critique of both references)

Numbered after Hundred Days' 39–69 so both sets stay citable as one list.

70. **Flavour comments on the mechanic.** The prose is microtext. Of 1,719 id'd records in the testing-build data, 73 % carry `desc` and 17 % carry `flavor`, with a median length of 47 characters across both `[0.12.12.9 data]`. It works because it is *about* the economy: the Neophyte bill's fee joke, `evt_helper`, tier-ups that lock the apprentice chores. (01, 04, data): *copy*
71. **Identity lives where the numbers live.** Homes carry a line's rates, so where you live is part of your build (07). Class names promise a specialist, yet the glossary says to buy every skill, and 30 of 44 skills are capped at T4 (11). *copy home-as-identity; beat names without payoff*
72. **Restraint is the rarest reward and the most hidden.** Mystic Savant (never Study) and Red Adept (no spellbook before Treffil) reward not-doing, and both are lost to ordinary play. Hundred Days rules 41 and 54 have the same shape. (04): *beat: make the restraint a named, visible act*
73. **A closing fork must differ inside the stage that offers it.** Hundred Days' three scholars each pay +1 to +2 Enlightenment rate, and its wiki admits the choice is about unbuilt future content (HD 05 §4.7). *avoid*
74. **Never grant a slot or cap that no reachable content can fill.** Generalises rule 46. *avoid*

## What the mid-game adds to the earlier conclusions

- The earlier studies read Arcanum from source and the first ten minutes. The T4 save shows the *same* rules still binding four hours of play later: caps pinned, bills sized to caps, broad sweep of content, three line skills carrying depth, automation optional. The design is self-similar across tiers rather than front-loaded.
- Mod patching and resource mods were invisible in the opening and are the mechanism behind "specialists feel deep" and "books matter". Any adaptation that copies skills and classes without these two idioms will feel flat after the first stage.
- Testing-build changes (free classes, rank decoupled from tier, more modules, siege) all extend the vocabulary without adding fields, evidence that the vocabulary is sufficient.
