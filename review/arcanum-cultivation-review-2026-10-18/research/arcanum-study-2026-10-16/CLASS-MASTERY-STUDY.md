# Arcanum classes and “Master of” — focused source study

Studied 16 October 2026 in response to the user's correction at Q62. Source: [mathiashjelm/arcanum](https://gitlab.com/mathiashjelm/arcanum), commit `a2632d2edf3e07e9168fff81167b11f2792e9197`, the same snapshot as the original scope study. A fresh public-source clone matched that commit. The previous deployment comparison belongs to the original study; this follow-up traces source and manifest-loaded data, without a new full playthrough or deployment comparison.

## Main finding

**Arcanum develops a character through successive class choices whose benefits and expertise accumulate.** “Master of …” labels describe overlapping fields recorded by those choices. Later opportunities inspect that accumulated history alongside skills, achievements, resources, and sometimes particular earlier classes.

Our proposed Body / Intent / Formation structure had moved toward three continuing paths, each with a prepared solution to a shared obstacle. That captures some differentiation, but gives too little space to the source's repeated class decisions, combinations, and changes to the character's broader capabilities. The closer reference is a developing class history with several kinds of expertise.

## The systems that need to be distinguished

| Layer | What the source does |
|---|---|
| Shared tier advancement | Common qualifications and advancement unlockers make the next class stage available. Taking the class advances the ordinary tier and supplies shared rewards. |
| Class choice | An authored identity with requirements, costs, benefits, and tags. Ordinary same-tier alternatives close after choosing, including undiscovered alternatives. |
| Accumulated class history | Acquired classes remain recorded. Their benefits continue, and later requirements can inspect the history. The displayed latest class does not replace the whole build. |
| “Master of …” tags | A class can add several expertise fields. Repeated contributions provide depth, while combinations qualify the character for different opportunities. |
| Mastery skills and education | Separately acquired and trained skills, and separately purchased learning upgrades. These may depend on expertise tags, but are not the tags themselves. |

The shipped glossary explains the class/tier relationship and exclusion rule. Runtime acquisition calls `GClass.changed`, applies ordinary results and modifiers, then appends the class through `Player.setClass`. Saves retain the class IDs. Tier locks prevent further acquisition without removing the acquired classes or their modifiers. [Class glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/hallgloss.json#L372-429), [class acquisition](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/gclass.js#L22-29), [class history](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/chars/player.js#L252-258), [tier events](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/events.json#L85-175).

## How an advancement is earned

The player prepares across the wider game, qualifies for candidate classes, and spends an advancement opportunity on one of them. Requirements can include trained skills, resource capacity, purchases, exploration, morality, prior classes, or expertise tags. A particular class also has its own cost and benefits.

For example, the tier-1 and tier-2 advancement unlockers require at least four tagged tier quests plus resource costs. Their quest pools involve several systems, including exploration, equipment, housing, production, and learned skills. This is broader than completing one method-specific field exercise. Unlocking a candidate and being able to acquire it are separate runtime checks. [Advancement requirements](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/quests.json#L231-347), [unlock checks](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js#L978-987), [acquisition checks](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/gdata.js#L357-379).

Class rewards can change resource capacity and production, skill limits, training effects, combat properties, or specialized content access. Magician, for instance, improves research capacity, mana production, and several skill limits. Alchemist develops crafting, potion, and alchemy capacity as well as potion-essence production. These benefits affect the continuing build rather than only one expedition. [Magician](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L213-235), [Alchemist](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L368-389).

## What “Master of” actually records

The core tag file defines 28 labels of this form. They span elements, weapons, knowledge, crafting, healing, summons, and other fields. A tagged class can contribute to more than one: Alchemist carries Blood, Potions, and Crafting; Witch carries Shadow, Demonology, and Potions. The runtime tag value is the sum of its member records' values, so a condition can test presence, repeated depth, or a sum across fields. The standard-manifest scan found these expertise memberships on class records. [Tag definitions](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tags.json#L363-482), [numeric tag aggregation](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/composites/tagset.js#L98-104).

### Example 1: the same later class, different accumulated expertise

| Earlier choice | Later choice | Resulting contributions from these two choices |
|---|---|---|
| Hydromancer | Stormcaller | Water 2, Air 1 |
| Wind Mage | Stormcaller | Air 2, Water 1 |

Stormcaller accepts either earlier Water or Air expertise and contributes both. It also raises both lore limits. The latest identity can therefore be the same while the history underneath differs. These counts describe the two stated choices, with other advancement requirements still applicable. [Water, Air, and Stormcaller definitions](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L467-518).

### Example 2: several histories can qualify for an advanced class

Rune Fencer accepts either two Sword contributions or the specific Duelist class. Battle Mage at tier 2 and Spell Blade at tier 3 supply two Sword contributions. Duelist itself can be entered through earlier Sword expertise, Red Adept, or Chaos expertise. Other stage requirements and costs still apply. The resulting structure contains converging routes and cross-training opportunities. [Battle Mage](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L303-314), [Spell Blade](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/swordplay.json#L189-201), [Duelist and Rune Fencer](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/duelist.json#L83-117).

### Example 3: depth and combinations unlock more content

Shade Mastery requires two Necromancy contributions as well as a positive Necromancy skill. Summon Demon checks a combined Demonology-plus-Summoning total of at least three, alongside substantial skill requirements. A class contributing to both fields counts toward both terms: this is not necessarily a requirement to take three classes. Other content uses expertise for home development or reward scaling; Temple Renovations checks Light history, while Grand Quest grants additional rewards per Light or Shadow contribution. [Shade Mastery](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/classline/shadow.json#L354-375), [Summon Demon](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/classline/shadow.json#L1056), [Temple Renovations](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/priest.json#L29-49), [Grand Quest](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/questing.json#L27-28).

These are qualifications within a broader progression graph, not proof that every theoretical class combination can be completed. Some classes require a particular predecessor, while others accept a tag, skills, or an alternative condition. For example, Archlock requires Warlock; the ordinary Mage sequence does not universally require the immediately preceding named Mage class.

## Separate meanings of mastery

Fire Mastery is a trainable skill with purchase/run costs and level benefits; it requires Fire expertise, Fire Lore, and an appropriate tier. “Pyromancy: Mastery” is an educational upgrade with its own knowledge and prior-upgrade requirements. “Magical Mastery” also names tier 3. None of those should be conflated with the accumulated Fire class tag. [Fire Mastery skill](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/skills.json#L566-585), [education upgrade](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/learning.json#L558-573).

## Recommended adaptation — proposal for our game

Keep the shared climb toward immortality, but design advancement identities and accumulated expertise before more bespoke path solutions.

1. **Realm progress** supplies the common transformation, lifespan extension, and broader opportunities. The eight-breakthrough target can remain a working scope; which stages also contain a class choice needs mapping.
2. **A cultivation identity chosen at an advancement** adds a lasting package of capabilities, limits, opportunities, and one or more expertise tags. Candidates emerge from the character's preparation and discoveries. Competing choices at a stage give commitment its cost.
3. **Accumulated expertise** supports later depth, hybrid qualifications, and specialist content. A later identity can build on several different histories. Changing direction at a later advancement need not erase earlier learning.
4. **Techniques and studies** remain separately learned and practised. Some require the relevant expertise; knowledge limits continue to matter. Classes, teachings, and discoveries can each contribute to the means of deeper development.

An illustrative xianxia example would be a Body contribution followed by a Body-and-Earth identity, versus an Earth contribution followed by that same identity. The resulting histories would be Body 2 / Earth 1 and Earth 2 / Body 1. Names, available fields, counts, and effects are deliberately unselected; this demonstrates the structural possibility.

Body, Intent, and Formation can remain useful ideas, but should not constrain the design to three exclusive lifelong tracks before the class/expertise model is settled. More concrete identities could express physical cultivation, weapon disciplines, elements, formations, spiritual practices, or alchemy in overlapping ways. This is a recommendation to reconsider the roster, not approval of an expanded content catalog.

The ridge waystation can still introduce teachings and give a new capability an immediate use. Its investigation should contribute to qualifications and reveal possibilities within the larger build system. The proposed three-method package is not approved, and should be revisited after the class model. The accepted outward lead toward another connected region remains intact.

The earlier retraining rule also needs reconsideration: rebuilding one replacement specialization models a different kind of choice from adding another class to a permanent history. We should decide what, if anything, can revise an earlier advancement once the new structure is concrete. The source study does not establish an ordinary respec system.

## Scope and verification limits

The standard manifest contains 75 main class records, including apprenticeship, jobs, and deprecated records. There are 70 raw tier-tagged records across tiers 0–6, of which 68 are not explicitly named deprecated. These are catalog counts, not 68 proved reachable builds. A single character chooses a subset over successive stages; the catalog's breadth is not a required scope for our game.

This study used graph discovery, runtime traces, direct source reads, and manifest-aware JSON extraction. Restoring the clone changed filesystem metadata relative to the graph; material claims were checked in source. Dynamic call edges are incomplete, so a missing graph caller was not treated as absence. No ordinary respec was found in the bounded runtime/data investigation, but that is not an exhaustive gameplay proof. Unlisted modules, old title-combination support, and placeholder Hall content were not promoted into ordinary shipped class behavior.

Selected records, source paths, line references, and hashes are retained in [class-mastery-evidence.json](class-mastery-evidence.json). The broader [original study](STUDY.md) retains its scope qualifications. Selected upstream data is covered by the preserved [upstream MIT license](UPSTREAM-LICENSE).
