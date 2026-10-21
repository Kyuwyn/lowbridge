# 03: Data model

The game is 3,389 JSON records in 32 core files and 50 modules, loaded through one manifest (`data/modules.json`). Every player-facing thing (task, upgrade, skill, class, quest, home, furniture, resource, spell, dungeon, locale, encounter, monster, event, section, stressor, potion, enchant, weapon, armor, material, equip slot, rare, tag) is a record with the **same small vocabulary**. The runtime interprets the vocabulary; content never contains code. Counts and field frequencies below are from the testing build (`unstable 0.12.12.9`).

## Record counts by type

| Type | Records | Type | Records |
|---|---:|---|---:|
| upgrades | 596 | enchants | 48 |
| tasks | 405 | rares (unique items) | 47 |
| monsters | 357 | homes | 45 |
| encounters | 343 | weapons | 41 |
| spells | 340 | dungeons | 34 |
| tags | 243 | materials | 29 |
| furniture | 128 | potencies | 28 |
| resources | 106 | locales | 24 |
| events | 82 | reagents | 21 |
| classes | 80 | sections | 21 |
| armors | 77 | player stats | 19 |
| skills | 69 | properties / equipslots | 18 / 17 |
| potions | 63 | invaders / clashes / states / stressors / zones | 16 / 8 / 7 / 5 / 4 |
| quests | 59 | | |

Five core files are empty arrays in the testing build (`armors`, `weapons`, `materials`, `clashes`, `glossaryentries`): their content moved into modules (`equipment/*`, `hallgloss`, etc.). Modules are `{module, author, data: {<type>: [...]}}` wrappers; the loader merges by type.

## The shared vocabulary

| Field | Meaning | Where it appears (count / type total) |
|---|---|---|
| `id`, `name`, `desc`, `flavor`, `extdesc` | Identity and text. `name` defaults to `id`. `verb` is the running-pane form ("observing nature"). `actname`/`actdesc` relabel the button for classes ("End Apprenticeship"). | all |
| `require` | **Visibility** gate. String expression or id. | tasks 396/405, upgrades 591/596, spells 340/340, classes 80/80, homes 45/45 |
| `need` + `needtext` | **Actionability** gate and its human text. | tasks 168, upgrades 100, skills 26, quests 59/59 |
| `buy` | One-off acquisition price (skills, spells, homes, slot upgrades). | skills 69/69, spells 309, homes 38 |
| `cost` | Price paid per use/completion (tasks) or purchase (upgrades, furniture). | tasks 256, upgrades 520, furniture 128/128 |
| `run` | Per-second drain while running. | tasks 306, skills 69/69, dungeons 32, locales 21 |
| `effect` | Per-second output while running (perpetual tasks, rest). | tasks 60, encounters 341/343 |
| `result` | Payout on completion (resources, exp, titles, flags). Supports ranges `"2~7"`. | tasks 120, spells 248, dungeons 32 |
| `mod` | **Permanent modifier** applied while owned / per level. Keys are dotted paths into other records. | upgrades 565, skills 69/69, classes 76, homes 45/45, furniture 128/128, resources 43 |
| `max` | Ownership cap (purchases) or resource/stat cap. | tasks 258, upgrades 346, furniture 72, resources 104 |
| `length` | Duration in seconds (timed tasks, adventures = floors). | tasks 324, dungeons/locales/clashes all |
| `perpetual` | Runs until `fill` is satisfied. | tasks 40 |
| `fill` | Resource(s) whose cap stops the task. | tasks 59 |
| `at` / `every` | Repetition curves keyed by completion count. | tasks 41, spells 37, dungeons 27 |
| `slot` | Exclusive-choice slot name. | upgrades 35 (mount, bodyplan, leisure, werry), furniture 9 (bed), tasks 6 (rest), monsters 9 (companion), weapons/armors/rares (equip slots) |
| `tags` | Comma list; tags are records too (`tags.json`) and can count (`g.t_shapeshiftclass>=1`). | widespread |
| `group` | UI grouping within a band. | tasks 392, upgrades 579, resources 85 |
| `lock` / `disable` / `enable` | Removes (or restores) other records when this one is acquired. | upgrades 57, quests 9, classes 6, homes 5+5, events 15+9 |
| `warn` / `warnMsg` | Confirm before an irreversible action. | 79 records |
| `once` | First-completion-only rewards (adventures). | dungeons 7, locales 1 |
| `secret` | Hidden until owned. | classes 4 |
| `sortOrder` | Display order. | classes, resources, spells |
| `convert` | Furniture converter `{input: {...}, output: {effect: {...}}}`. | furniture 20 |
| `school`, `keywords`, `level`, `cd`, `attack`, `dot`, `summon`, `caststoppers` | Spell-specific. | spells |
| `dist`, `difficulty`, `spawns`, `boss`, `encs`, `unreturnable` | Adventure-specific. | dungeons, locales, clashes |

Type-specific extras exist (monsters: `hp`, `defense`, `dodge`, `speed`, `resist`, `loot`, `kind`; enchants: `only`, `alter`, `adj`; materials: `priceMod`), but the gates, prices, drains, payouts and modifiers above are uniform.

## Expression strings

`require`/`need` are JavaScript-like expressions compiled at load, over `g` (game state):

- Ownership / level: `g.crafting>=7&&g.alchemy>=5`, `g.warden>0&&g.naturelore>=15`
- Caps: `g.research.max>=90`, `g.gold.max>=…`
- Tags as counters: `g.t_shapeshiftclass>=1`, `(g.t_bloodclass+g.tier4)>=2`
- Bare id = truthy ownership: `"apprentice"`, `"spellcraft"`, `"timesource"`
- Alternatives: `g.spellbook.value>0||g.weaponlore>0`
- Negatives/morality: `g.evil2<=0&&g.history>=7&&g.loc_treffil>0`

Costs can be expressions too: `"1+g.sword_lessons codices, 500+g.sword_lessons*500 research"`, `"Math.floor(g.stamina.max) stamina"`, `"g.hp.max * 0.5 hp"`; escalating prices and "pay half your life" are data.

Mod values accept: numbers (`5`), percentages (`"20%"`), mixed (`"0.01+5%"`), and a stepped form `"0.01//300/-10"` read as *0.01 per unit up to 300 with offset −10*; tooltips expand it ("Max Crafting: 0.1 per 10 amount (rounded down) up to 300 (resulting in 3)"). `"?1"` on a summon mod means "set to 1 on first use" (bestiary reveal).

## Mod paths and mod patching

A mod key is a path into another record: `gold.max`, `research.rate`, `naturelore.max`, `space.max`, `minions.max`, `dist`, `player.resist.fire`, `runner.max`, `goals.max`, `offlinetime.max`.

The decisive idiom is **patching another record's own mod**: `X.mod.Y`. 229 of 596 upgrades do this. Examples:

| Upgrade | mod | Effect |
|---|---|---|
| Timely Independence (`chronomancylearn3`) | `chronomancy.max +1, chronomancy.rate +1, chronomancy.mod.tempus.rate +0.006, chronomancy.mod.offlinetime.max +1800, chronomancy.mod.dist +3%` | Every level of Chronomancy now *also* grants 1800 s stored-time cap and 3% distance. |
| Umbramancy: Transcendence | `shadowlore.rate +0.7, shadowlore.mod.shadow.max +0.5, shadowlore.mod.shadowdmg +0.7 …` | Raises what each Umbramancy level pays. |
| Classrooms (Hall) | `study.effect.research +0.15, scrolls.mod.research.rate +0.0005` | Changes a task's per-second output and a resource's per-unit mod for all future wizards. |
| Magic Stables (Hall) | `cleanstables.result.gold +0.5, chores.result.gold +1` | Changes the payout of the first two tasks in the game. |
| Protean (class) | `alchemy.mod.hp.max +0.5, anatomy.mod.stamina.max +0.5` | Existing skills now pay body stats per level. |
| Stoke the Bonfire | `bonfire.mod.fire.max +1` | A furniture piece gets better. |

This is how the **Education** ladder works (`gloss_education`): "Competence → Expertise → Mastery → Supremancy → Transcendence" upgrades (32/25/21/24/10 records) unlock at skill level 3 with max 5, then every 5 levels, and each one raises the *per-level benefit* of its skill. It is also why specialist classes feel deep: they do not add new numbers, they multiply what the player already trains.

## Resources carry mods

43 resource records have `mod`. Holding the resource *is* the bonus:

| Resource | mod per unit held |
|---|---|
| scrolls | `research.rate +0.005, research.max +1` |
| codices | `research.rate +0.07, research.max +5` |
| tomes | `research.max +25, research.rate +0.3, arcana.rate +0.001, lore.rate +0.01` |
| runestones | `research.max +10, runelore.rate 0.02//100/-8` |
| each elemental rune | `research.max +10` |
| timerune / timegem | `tempus.rate +0.05 / +0.01` |
| sindel | `light.rate +0.1, player.resist.shadow +1` |
| domain_* (happiness, education…) | `domain_danger +0.01` |
| voidcontamination | `stress.rate +0.025, stamina.max −0.9%, vigor.max −0.9%` |

Consequences: selling books is a real trade-off (Sell Tomes / Sell Codices exist as Affluence tasks); the Arcane Archive's `Tomes ➢ Max Arcana: 0.05` is a *resource-mod patch* from furniture; prosperity raises siege danger; contamination is a debuff you hold.

## Records that change other records' availability

- `lock` (permanent): T5 unlocker locks "Tier 5 Quest"; Nourish Sapling locks the Idrasil Sapling home; Attic locks Alcove; `hut`, `camp`, `wagon`, `cottage`, `house` all `disable: innroom`.
- `disable` (reversible in principle): quests Virtuous disable "Detached, Amoral"; apprentice disables Clean Stables.
- Classes at the same tier lock each other by rule (`gloss_classes`), not by data.
- Events (82) are silent records with `require` → `result`/`mod`/`lock`: "The Commoner's Limit" (clear Treffil Woods Edges without Bind Spellbook) enables Red Adept; `evt_hall` converts fame into hallPoints.

## Sections are records

`sections.json` (21): each tab is `{id, name, require, parent?}`. Sub-tabs use `parent` (Home → Furniture/Converters; Equipment → Loot/Crafting/Enchanting; Settings → Main/Extra Stats). Adding a system means adding a section record and the content that references it.

## Save format

The save (`Wizrobe (8).json`, 81 KB, 1,985 item entries) is **a sparse delta keyed by id**, not a copy of the data:

```json
{
 "version": "unstable 0.12.12.9", "pid": "...", "lastUpdate": 1792443984193, "name": "Wizrobe",
 "NEXT_ID": 1273, "sellRate": 0.5, "currentSpellLoadout": "spelllist_0",
 "bars":   {"bars":[{"slots":["mk_spirit","poisonnettle","magicmissile","vinewhip","mk_spider","mk_shrooms",null,null,null,null]}],"index":0,"max":1},
 "slots":  {"rest":"rest","bed":"fourposter","mount":"flyingcarpet","home":"home_idrasil_sapling","bodyplan":"bearshape","leisure":"naturecamprest","companion":"wolfcomp"},
 "combat": {"enemies":[],"allies":[ {…live companion with hp, dots, timer…} ]},
 "drops":  {"items":[…loot not yet taken…]},
 "siege":  {"spawnTime":60,"timeRemaining":27.0},
 "explore": {},
 "items": {
   "<id>": {"locked":false},                         // revealed, nothing else changed
   "naturelore": {"ex":499.43,"rate":1,"owned":true,"val":25,"locked":false},   // skill: val = level
   "gold": {"value":1075.6},  "research": {"value":875.5,"max":30},             // resources: value (+ saved max delta)
   "arcana": {"value":99.8,"rate":0.0001},
   "druid": {"val":1,"locked":false},                                             // owned class
   "atticbedroom": {"disabled":true,"owned":true,"locked":false},               // home outgrown
   "Elemental Rift": {"level":1,"ex":30,"rate":1,"val":4,"locked":false},     // dungeon: val = clears, ex = floors
   "player": {"name":"Wizrobe","titles":[…15…],"title":"Certified","classes":["apprentice","falconer","adept","warden","shapechanger","druid","protean"],"alignment":"neutral","resist":{…},"weapons":{…}},
   "level": {"val":28}, "exp": {"val":1043.6}, "hp": {"val":302.1}, "virtue": {"val":49.7}, "evilamt": {"val":-3},
   "runner": {"max":1,"waiting":["spiritanatomy"],"actives":["rest","naturelore","craftgem"]},
   "inv": {"items":[…equipment instances with template, material, enchants, alters…]},
   "goals": {"items":[],"max":0}, "hobbies": {"items":[],"max":0}, "scraftlist": {"items":["obscure1","etherealness1"]}
 }
}
```

Field meanings per type: `locked:false` = revealed; `val` = level (skills), count owned (upgrades/furniture/classes), clears (adventures); `value` = current amount (resources); `ex` = experience (skills) or floors cleared (adventures); `owned`; `disabled`; `max` only when it differs from the computed value (`savedMax`). Of 1,985 entries, 1,331 are bare `{"locked": false}`, so the save is mostly a visibility bitmap. Everything derivable (caps, rates, mods) is recomputed on load from data + owned records; `runner.max: 1` in the save while three slots run confirms that.

Equipment instances are the exception: they are materialized (`"id": "traininghammer2_1", "template": "traininghammer2", "material": "mat_martial_wood", "alters": [...], "enchants": {"v":0,"max":1}`) because material and enchant choices are per-instance.

## What to carry forward

- One vocabulary for every type; the UI renders by field, not by type. Tooltip, button state and running-pane row all fall out of the same ten fields.
- Expressions in data give authored escalation and history-dependence (`g.sword_lessons*500`, `g.evil2<=0`) without engine changes.
- `X.mod.Y` patching is the compounding engine: late content multiplies early content instead of replacing it.
- Resources with mods make inventory a build decision.
- A delta save keyed by stable ids survives content changes and stays small; recompute everything derivable.
