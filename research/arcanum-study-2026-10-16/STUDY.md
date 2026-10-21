Arcanum / Theory of Magic: scope study, 16 October 2026

**Arcanum is a substantial, content-heavy single-player RPG built around incremental progression.** Its defining feature is an expanding set of possibilities: ordinary work leads to knowledge and infrastructure; those unlock new activities, identities, places, and eventually additional characters. The interface is mostly text and controls, but the design underneath spans several interacting games: an activity scheduler, a character build system, a home economy, combat, exploration, crafting, and shared progression across a wizard roster.

This study establishes the reference game's scope. It does not choose a theme, implementation approach, feature list, or development schedule for a successor.

**The reference is the linked stable game, version 0.12.3.1.** I inspected its opening loop in the browser and studied repository commit `a2632d2edf3e07e9168fff81167b11f2792e9197`, dated 19 September 2026. The deployed manifest, classes, tasks, Hall, and mechanics glossary were byte-identical to that snapshot. This is a five-file deployment check, not a claim that every deployed asset was compared. [Live game](https://mathiashjelm.gitlab.io/arcanum/), [pinned source](https://gitlab.com/mathiashjelm/arcanum/-/tree/a2632d2edf3e07e9168fff81167b11f2792e9197).

**The core loop changes the character's options.** Choose an activity, spend time and resources, gain resources or experience, acquire knowledge or infrastructure, and meet the conditions for something new. Combat and exploration provide materials, first-clear rewards, and learning opportunities. Homes and equipment change what the character can support. Classes direct future possibilities. The opening demonstrates the pattern immediately: Clean Stables costs stamina and earns gold; gold reaches a cap of five; a Pouch becomes available and increases that capacity. Accumulation alone cannot bypass a hard cap. [Tasks](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tasks.json), [shipped mechanics glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json).

| System | What it contributes to play |
|---|---|
| Tasks and recovery | Work, study, train, produce, rest; competing uses of time and limited action capacity. |
| Resources and maximums | Gold, research, magical resources, reservoirs, skill caps, and other limits that require different solutions. |
| Skills and character advancement | Training, schools of magic, practical knowledge, levels, tier quests, and skill-cap increases. |
| Classes and character history | Exclusive class choices, moral consequences, and prerequisites based on earlier behavior. |
| Homes and furniture | Space, storage, recovery, workstations, magical sources, environmental bonuses and penalties. |
| Spells and spellcraft | Memorized spell cycles, active casting, and later construction of composite spells. |
| Equipment and crafting | Item types, materials, enchantments, consumables, and build tradeoffs. |
| Dungeons | Automatic combat, spell sequencing, enemies, loot, and first-clear rewards. |
| Locales | Primarily noncombat exploration with encounters, five stress types, rest, and permanent learning. |
| Clashes | Focused challenge fights with bespoke mechanics and attempts that reset when leaving. |
| Summons and companions | Additional combat participants constrained by capacity and character choices. |
| Automation | Repeating and waiting tasks, prioritized Goals, idle-filling Hobbies, and additional action slots. |
| Wizard's Hall | Switchable characters and shared prestige upgrades while retaining existing wizard progress. |
| Supporting interface | Progressive section reveals, tooltips, unlock notices, glossary, bestiary, travelogue, saves, and settings. |

The table describes systems present in the source and shipped explanations. It does not establish that every conditional branch is currently reachable. [Mechanics glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json), [interface section definitions](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/sections.json).

**The content is large enough that a complete feature match would be a major undertaking.** The standard manifest names 32 core data files and 32 content modules. A separate loader adds titles. Counting their authored top-level records produces 2,847 main records, 88 Hall records, and nine title templates: **2,944 raw content and support records**. This includes tags, stats, events, explanations, unused categories, hidden entries, and compatibility or placeholder content. It is not a count of 2,944 player-facing features. The bootstrap data occupies approximately 1.26 MB and 58,087 physical lines of JSON. [Manifest](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules.json), [title loader](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/chars/title.js).

| Main-game category | Raw definitions |
|---|---:|
| Tasks | 267 |
| Skills | 72 |
| Spells | 295 |
| Upgrades | 499 |
| Classes, including apprenticeship and jobs | 75 |
| Quests and advancement records | 53 |
| Homes | 47 |
| Furniture | 121 |
| Monsters, summons, and companions | 331 |
| Dungeons / locales / clashes | 33 / 21 / 3 |
| Encounters | 292 |
| Weapon / armor definitions | 30 / 57 |
| Materials / enchantments | 26 / 48 |
| Potions | 63 |

These category counts include the manifest's content modules and keep Hall content separate. Spells include enemy abilities; monster data includes allies; equipment templates can generate further combinations. The 75 main class records include apprenticeship, four jobs, and two explicitly deprecated classes. Seventy records have tier tags across tiers 0-6, of which 68 are not marked deprecated. That is catalog breadth, not a proof of 68 viable paths. Tier-7-related data exists, but the examined conditions do not establish ordinary playable tier-7 progression. The 53 quest records include 38 tier quests and 15 advancement records. Eleven other JSON files are outside the inspected standard bootstrap and are excluded from this census. Full counts and qualifications are preserved in the accompanying `content-census.json`.

**Character identity is mechanically consequential.** Graduation provides a compact example: the ordinary adept pays tuition; the dark adept kills the master and gains corresponding benefits and moral consequences; the red adept depends on an early combat accomplishment; the mystic savant requires never having used Study. Class selection closes alternatives at the same tier, including classes the player may not yet have revealed. This gives choices weight, while also creating a discoverability burden. [Classes](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json), [class explanations](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json).

**Housing is part of a build.** A camp provides outdoor/star conditions while reducing research efficiency. A cave adds space and minion capacity, favors earth and shadow, and penalizes research and light. Furniture spends limited space on workstations, storage, recovery, and magical access. Consequently, a new home can alter which strategies are possible. These are useful examples of theme expressed through decisions and consequences. [Homes](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/homes.json), [furniture](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/furniture.json).

**Progression also grants greater control over the game.** Training, production, recovery, and adventuring initially compete for scarce action capacity. Goals, Hobbies, waiting behavior, and additional slots progressively improve scheduling. Spellcraft introduces a different kind of agency by combining spells within cost and level constraints. These rewards expand what the player can arrange, rather than merely increasing production rates. [Automation and spellcraft glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json), [extra-action content](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/extraaction.json).

**The Hall adds a second scale of progression.** It unlocks at tier 5 and preserves the current wizard while allowing new, switchable characters. Its shipped description specifies three initial character slots, expandable to nine, alongside shared prestige upgrades. This makes alternative builds useful long-term pursuits and adds roster-level persistence and economy to the single-character game. It should be counted as a substantial system in its own right. [Hall content](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/hall.json), [Hall unlock](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/upgrades.json).

**Technically, the project is a browser application with a sizable custom game layer.** The pinned package uses Vue 3.4.30, Vite 5.4.20, and eventemitter3 3.1.2. Most game code is JavaScript, alongside Vue components and a small TypeScript portion. The source measurements are physical lines, including comments and whitespace, with the explicit `src/unused` directory excluded; they are a measure of repository size, not an effort estimate. [Package manifest](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/package.json).

| Source category | Files | Physical lines |
|---|---:|---:|
| JavaScript under source, excluding `src/unused` | 121 | 26,163 |
| Vue components | 74 | 12,683 |
| TypeScript under source | 1 | 347 |
| Main CSS | 1 | 1,357 |
| Combined categories above | 197 | 40,550 |

These source counts do not imply every file is included in the production bundle. The repository also contains legacy paths. All 77 JSON files occupy 65,389 physical lines, but only the bootstrap subset was included in the content census. Build configuration and documentation are outside the 40,550-line total.

The runtime includes a 120 ms simulation tick, rules and modifiers shared across content, task scheduling, combat/exploration, and persistence. IndexedDB handles main local saves, with legacy/localStorage paths also present. Offline elapsed time is banked as stored time and spent through accelerated simulation; it should not be described as arbitrary overnight progress automatically granted to every task. The standard configuration has no active remote-save handler, although legacy remote code exists. These observations describe the inspected source; save recovery and long offline sessions were not exercised in this study. [Game runtime](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js), [persistence](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/persist/persist.js).

Reusable structures exist in content modules, item types, and modifiers. They also carry the original game's assumptions: requirements can compile into JavaScript functions, data expressions refer to runtime objects and IDs, and systems share a central Game coordinator and Vue-reactive state. This is relevant to adaptation cost. It does not establish that either a fork or a rewrite is preferable before we define the new game. [Content loader](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/dataLoader.js), [rule parsing](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/parsing.js).

**The main scope multiplier is the relationship between content.** A class needs access to appropriate skills, resources, spells, tasks, and milestones. A capacity increase must arrive before a later requirement becomes impossible. A location can be both an adventure and a critical source of permanent learning. Housing, equipment, magic, morality, and scheduling multiply the combinations that need to remain understandable and viable. Supporting interfaces must explain enough of those relationships for discovery to feel intentional.

That separates the work into several substantial responsibilities: simulation and saves; an expandable content/rules structure; an interface that reveals and explains progression; authored paths and rewards; and repeated balancing and playtesting across those paths. A small game can retain the characteristic discovery-and-specialization loop. Matching Arcanum's full catalog and late-game systems would bring a much larger authoring and validation commitment. This is a scope judgment, not a calendar estimate: a credible schedule depends on the successor's selected systems, content depth, polish requirements, and reuse approach.

**The source is available for reuse.** Alongside the permission you reported from the owner, the repository contains an MIT license naming Justin Lacy, copyright 2020. Its text permits copying, modification, distribution, and other uses, with the copyright and permission notice retained in copies or substantial portions. The contributor file also records community contributions. The source is therefore useful both as a reference and as material we can evaluate for reuse when the new game's scope is defined. This study does not commit us to either a fork or a fresh implementation. [License](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/LICENSE), [contributors](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/CONTRIBUTORS).

**The design principle worth carrying forward is gradual transformation with consequential specialization.** Mundane beginnings make later capability meaningful; resource and skill limits create reasons to explore; identity and infrastructure change available strategies; and progression introduces new kinds of decisions. This is my interpretation of the reference, rather than an assumption about which particular parts are your favorites. Those are useful foundations for the next conversation about a different theme and scope.

The evidence consists of live opening-loop inspection, source and shipped-glossary study, a manifest-based static census, code measurements, and the five-file deployment comparison. It does not include a complete playthrough, a proof of all class/build reachability, measured completion time, mobile testing, or a production-readiness audit. Scratch design notes and unreferenced files were not counted as shipped features. Research only; no successor implementation was created.

Supporting records are saved alongside this study: `content-census.json`, `source-metrics.json`, and `deployment-check.json`. `count-content.py` reproduces the census against a checkout of the pinned commit, accepting that checkout's path as its first argument. All measurements are scoped to this inspected snapshot.
