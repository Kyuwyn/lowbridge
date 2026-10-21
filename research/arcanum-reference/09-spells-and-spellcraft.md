# 09: Spells and spellcraft

340 spell records (303 buyable; the rest are monster abilities and granted techniques). Schools and counts: `data-tables.md → Spells by school`. Rules: `gloss_combat`, `gloss_scraft`, `gloss_summons`, `gloss_minions_allies`.

## Spell as a record

```json
{"id":"vinewhip","name":"vine whip","level":3,"school":"nature",
 "keywords":{"type":["damage"],"target":["enemy"],"targets":["single"],"delivery":["instant"]},
 "require":"g.naturelore>=5",
 "buy":{"research":50,"scrolls":5,"naturegem":1},
 "cost":{"nature":3},
 "result":{"naturelore.exp":0.3},
 "attack":{"damage":"6.5~10.5","tohit":3,"kind":"nature","potencies":["spelldmg","naturedmg"]},
 "at":{"25":{"attack.damage.max":1.5},"75":{"attack.damage.min":1.5},"300":{"attack.damage.max":2,"attack.damage.min":1,"attack.tohit":2}}}
```

| Field | Role |
|---|---|
| `level` | Spell-list budget cost (sum of memorized levels ≤ player level + mods) and spellcraft component weight. |
| `school` | Mana pool it draws from and the colour of its group header. 15 school groups on screen: Martial, Mana, Water, Air, Fire, Earth, Nature, Spirit, Light, Shadow, Chaos, Astral, Summoning, Animation, Charms. |
| `keywords` | type (damage 133 / summon 65 / buff 63 / debuff 57 / recovery 46), target, targets, delivery; it drives the **Keywords** filter and AI targeting. |
| `require` | Usually a skill level (`g.naturelore>=5`), sometimes a class or event. |
| `buy` | Research + scrolls (+ a magic gem for school spells). |
| `cost` | Per cast: the school's mana (`nature 3`), or `vigor` for Martial (48 spells), or `hp` for blood (11). |
| `result` | Casting trains the school skill (`naturelore.exp 0.3`); spells are a second exp source. |
| `attack` / `dot` / `summon` / `mod` | Effect. `cd` on 198 spells. `caststoppers` (43) stop auto-cast when pointless (e.g. buff already up). `freeaction` (4) does not consume the spell slot of the turn. |
| `at` | Improves with casts (25 / 75 / 300 casts here): spells level up through use. |

## Learn → memorize → cast

1. **Learn** (button in the Spells tab) pays `buy` once; the row then shows **Cast** and **Memorize**.
2. **Memorize** puts it in the current **spell list** (`spelllist_0`; `spellLoadouts` lets the player keep several). The list has a level budget: `gloss_levels` gives +1 max spell-list level per wizard level; the save at level 28 shows `Max Levels: 7 / 10` in the Spellcraft panel for crafted spells and ten memorized spells on the active list. In combat the list is cast **cyclically top to bottom**, one spell per turn, so order is the player's main combat decision ("keep all of your buffing spells at the top").
3. **Cast** fires immediately outside the rotation (also from the **quickbar**, Shift+number to assign). Summons and instant heals are typical quickslot picks; the save's bar: `mk_spirit, poisonnettle, magicmissile, vinewhip, mk_spider, mk_shrooms`.
4. Filters: Find, Level, Show learned / unlearned, Memorized, Keywords, Toggle Schools. A T4 nature wizard sees 18 Nature spells, 16 Martial techniques (from shapeshifting), 11 Earth, 9 Air, 8 Spirit, 6 Charms …

## Summons, minions, companions

- **Summon** spells (`summon: [{id, count}]`, 64): temporary allies for the current adventure; each summon source has `Max` (unlimited for wisps, 1-2 for strong ones) and `Count`. First cast reveals the creature in the Bestiary.
- **Minion** variants (`mk_*_perm`): "Instead of summoning, creates a permanent minion". They persist between adventures, live in a Minions tab, bounded by `minions.max` (homes: Idrasil Sapling 10, Clockwork Home 50) and total minion levels (+1 per 5 wizard levels); revival spells per `kind`.
- **Companions** (slot `companion`, 9 monster records tagged `t_companion`): free, auto-present, chosen in the Player tab; die until the dungeon is re-entered.

## Spellcraft (T3+, Spellcraft skill; T4 quest "Spell Construction")

From `gloss_scraft`:

- Staple spells into one; **level = sum of components**; max level = **Spellcraft Power** (skill level); number of custom spells = `Max Crafted Spells` (`Custom Spells: 0 / 4`).
- Cost per component: `4 × level` magic gems of its school (if it has one) + `1 × level` codices (level ≤ 5) or 5 tomes (level > 5). Hover **Craft** for the total.
- Inherits the **longest cooldown**; duplicate cooldown spells cast once; `Cannot Spellcraft` tag excludes most Martial techniques.
- Strategies the author lists: multi-summon swarms, bundled buffs with matching cooldowns, Life's Bloom paired with a long-cooldown spell, damage + DOT bundles, "shotgun" stacks of no-cooldown damage.
- UI: the Spellcraft tab repeats the catalogue with `+` buttons; a right panel lists components with ↑↓✕, a name field, `Clear all spells`, **Craft**. The save has a work-in-progress list `["obscure1","etherealness1"]`.

Spellcraft is the game's **expressive** system: it converts the player's catalogue into a composition problem with a budget, and it is gated behind a tier so that the catalogue is large when it arrives.

## Potions

63 records in their own tab (groups Recovery / Battle / Utility), brewed as tasks with `use` effects and a cooldown; 🔒 shows unmet recipes. Quickslot-able consumables; the save holds 4 Draughts of Stamina as untaken loot.

## Rules this implies

1. A spell is a record with a **level** (budget), a **school** (pool + colour), **keywords** (filters/AI), and a **use curve**; learning, memorizing and casting are three distinct verbs with three distinct controls.
2. Auto-cast in list order makes the *order* the decision; quickslots are the manual layer. Both are cheap to render.
3. Casting trains the school skill: every system feeds the skill web.
4. Composition (spellcraft) arrives late, with an additive level budget and costs in the schools' own gems, adding depth without new primitives.
