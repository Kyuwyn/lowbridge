# 02: Interaction semantics

What a click does, what occupies a slot, how the game tells the player what it needs. Derived from the testing-build data (field names in code font), the in-game glossary, and tooltips captured with the T4 save (`tooltips.json`, `screens/tip-*.webp`). The earlier source-level note (`../arcanum-mechanics-2026-10-18/UI-ACTION-STUDY.md`) verified the code paths; this page describes the player-facing result.

## Three kinds of action

| Kind | Data signature | Slot? | Example | Player reads |
|---|---|---|---|---|
| **Instant** | no `length`, no `perpetual`; `cost` + `result` | No | Gather Herbs (`cost stamina 3 → herbs 5, herbalism exp 7`), Pouch, Sell Scrolls | Pays and pays out on click. Hold **Enter** to repeat at 20/s (`gloss_tasks`). |
| **Timed** | `length` (seconds) + `run` (per-second drain) + `result`/`mod` on completion | Yes | Smith (`length` → 11 s shown, `run stamina 0.4/s`, `result gold 14.5`), Craft Gem (3 s, `run stamina 1, mana 2`), Nourish Sapling (3 min) | Progress % in the running pane; repeats until stopped or unsustainable unless `max`. |
| **Perpetual** | `perpetual: true` + `effect` (per-second output) + `fill` | Yes | Relax (`effect stamina 0.8/s, hp 1/s, stress −1/s`), Study (`effect research 0.55/s`), skill training | No percentage; runs until its `fill` targets are full. |

Counts in the testing build: 324 tasks with `length`, 40 `perpetual`, 53 instant. Upgrades are purchases (`cost`/`buy`, instant) unless they carry `length`, in which case they appear in the Upgrades band but run like a task ("Construction Task", e.g. Nourish Sapling). **Group placement does not reveal timing**; only the tooltip's "Completion time" and "Progress Cost" lines do.

### fill: "stop when full"
`fill: "gems"` or `fill: ["stamina","hp","prismatic","stress"]`. A running task whose fill targets are all at cap stops itself and leaves the slot; a `(Full)` suffix appears on the effect line (`Stamina: 1.37/s (Full)`). Relax starts automatically when a slot is free and something it fills is below cap. This is the mechanism behind "rest fills the idle slot" and behind Study leaving the slot when research is capped.

### Repetition curves: at / every
`at: {"5": {"result.gold": 1}, "25": {"result.gold": 1}, "500": {"result.virtue": -0.3}}` (Do Chores): at the 5th and 25th completion gold rises by 1; at the 500th virtue starts to drop. `every: {"100": {"effect.research": "0.05:100"}}` (Study): +0.05 research/s per 100 runs, capped. 41 tasks, 37 spells and 27 dungeons carry such curves. Tooltip surfaces them as "Next Improvement: 0%".

## Slots

### Action slots (`runner.max`)
Start 1. Raised +1 each by: **Aided Thoughts** (Neophyte, 150 research + 2 arcana, early), **Timesplit** (Chronomancy 5, T3+), **Time Spiral** (T5, needs `runner.max ≥ 3` already), **Automata Agents** (Automata Sculpting 10). Hall upgrades can pre-grant Timesplit to new wizards. Levels, classes and homes do *not* add slots. The Relax slot is a normal action slot; a T4 player typically runs rest + one skill + one production task.

### Exclusive-choice slots (`slot` field)
One record may occupy each named slot; choosing another swaps. In the save: `rest: rest`, `bed: fourposter`, `mount: flyingcarpet`, `home: home_idrasil_sapling`, `bodyplan: bearshape`, `leisure: naturecamprest`, `companion: wolfcomp`. Furniture beds, mount upgrades, rest-task variants, body shapes, leisure activities and companions all compete inside their slot. The Player tab shows the pickers (Body shape, Leisure, Mount, Companion); the Home tab header is the home picker. Equipment slots (`equipslots.json`: mainhand, offhand, head, hands, back, waist, neck, trinket, fingers, chest, shins, feet, limb, sense, skin, guts, brain) are the same idea with per-slot `max` that upgrades raise (Amulet 0/3, Limbs 1/2 in the save).

## Priority: Waiting, Goals, Hobbies, Focus

From `gloss_waiting`, `gloss_priority`, `gloss_focus`:

- **Waiting**: a slot-task pushed out (unsustainable or displaced) goes to the Waiting list and retakes a slot when one frees. Capacity = slots + 5; older entries fall off. Visible in the `≡` Activities popup. The save has `runner.waiting: ["spiritanatomy"]`.
- **Goal (G)**: re-asserts itself whenever *any* action completes, taking that slot or an empty one. Capacity from upgrades: Dedicated Goal (Mage Lore 6), Maniacal Goals (T1).
- **Hobby (H)**: fills an *empty* slot only; yields to waiting tasks and goals. Capacity: Idle Hobbies (Mage Lore 7), Expanded Interests (T2), Never-idle (T5).
- A task is a Goal or a Hobby, never both. Buttons G/H sit beside each running row and in the Activities popup.
- **Focus** spends mana to add skill experience to the *topmost* running skill (~+40% if always on). **Auto Focus** toggles it permanently.
- **Stop All** clears every slot.

## Visibility and actionability are separate

| State | Data | Player sees |
|---|---|---|
| Hidden | `require` false | Nothing. Unlock logs "Unlocked: X" when it flips. |
| Visible, blocked | `require` true, `need` false | Button present, greyed; tooltip shows a **Need** block using `needtext` (plain words: "Plantsource", "Stables", "Perform the Wander task 100 times", "Be able to clear the distance"). |
| Visible, unaffordable | `need` true, `cost`/`buy` unmet | Button greyed; tooltip shows cost with the player's shortfall implicit (resource highlights setting colours them). |
| Runnable | all met | Filled amber. |
| Running | in a slot | Dashed outline; row in the running pane. |
| Owned / Maxed | `val ≥ max` | Stays in place: "Max" (Home), "1/1" (tooltip title line), count in Player → Upgrades. Furniture can still be sold. |
| Disabled / Locked | another record's `lock`/`disable` hit it | Removed (homes grey out as `disabled` in the save: alcove, atticbedroom, innroom). |
| Player-hidden | ⚙ hide on the section | Removed from view by choice (the documented way to avoid misclicking Study). |

`require` strings are expressions over game state (`g.crafting>=7&&g.alchemy>=5`), or bare ids (`"apprentice"`, `"spellcraft"`) meaning "owned/unlocked". `need` is the same language but checked for *actionability*; `needtext` is the human text. Classes add a `secret` flag (hidden until bought, e.g. Red Adept).

## Tooltip schema

Every hovered thing renders the same ordered blocks; a block is omitted when empty. Observed labels, in order:

1. **Title** `Name` then the count/max or current value line (`0/ 1`, `625`, `max: 3`, `1⭐`).
2. **Type/tags line**: `Craftwork`, `Construction Task`, `Steed`, `School Of Magic, Skill`, `Book Furniture`, `Dungeon`, `Site Of Learning, Locale`, `Outdoors, Starsource`; `Slot: Mount`.
3. **Rate line** for skills (`7.2/s` = exp per second at current rates) and `Level: 26`; for tasks `Completion rate: 134%` and `Next Improvement: 0%`; for adventures `Level: 💀💀💀💀💀💀` or `Level: 25`, `Distance: 800`.
4. **Description** (`desc`), then `extdesc` lines ("Necessary for your next class advancement.", "This will permanently lock the idrasil sapling and replace it with a better home.").
5. **Completion time** `00:00:11` (from `length` ÷ rate).
6. **Need**: one line per `needtext` entry.
7. **Cost** (one-off, `cost`/`buy`) and **Purchase Cost** for slot items; **Progress Cost** for per-second `run`; **Sell** for furniture.
8. **Effects** (per-second `effect`, with `(Full)` markers).
9. **Modifications** (`mod`, pretty-printed: `Max Crafting: 0.1 per 10 amount (rounded down) up to 300 (resulting in 3)`, `Tempus Rate: 0.0103 & 3%`, `Tomes ➢ Max Arcana: 0.05`).
10. **On First Completion** (`once`) then **Results** (`result`): titles, resources, ranged loot `2 ~ 7`, `Loot: Complete to discover`.
11. **Locks** / **Disables** (what buying this removes: "Idrasil Sapling", "Tier 5 Quest", "Detached, Amoral").
12. **Flavor** in italics last ("Or at least you hope it's well trained.").

Warnings (`warn: true` on 79 records) prompt a confirm before irreversible actions; the message is the `warnMsg` or a generic "this action is not reversible". Permanent-transformation tasks (Fey, Phylactery, Unshaped, Ghost Rite) all carry `warn` and `lock: t_permanent_transformation`.

## Combat and adventure controls

- **Enter** on an adventure row starts it in a slot (`⚔Arag Heights 9%` in the running pane). The section switches to the adventure view: name, **Flee**, floor bar `2.0/22.0`, Allies column (player: barrier bar + life bar + yellow attack-timer bar; companion/summons), Enemies column, scrolling combat log.
- Spells cast automatically from the memorized list in order; quickslot keys cast on demand. Potions are quickslot-able consumables.
- Leaving keeps progress unless another adventure is entered (clashes excepted). Death costs recovery time only (`gloss_combat`).

## Save/load surface

Four buttons in the top bar; a file input accepting JSON; `[Load Save]` restores from browser storage; auto-save is a setting; the Hall adds a separate "Hall Save". Import replaces the running wizard without confirmation beyond the file dialog.

## Observed consequences for an adaptation

- Classification by *timing* (instant / timed / perpetual) is the primary distinction the player feels; group names are flavour.
- A `fill` rule plus an auto-starting rest task removes most idle micromanagement without any automation purchase.
- `need` + `needtext` is the whole "tell me what I'm missing" system; it is data, not UI code.
- One tooltip schema for every record type is what makes a 2,000-record game legible. Hover-only is its accessibility weakness.
- Goals/Hobbies/Waiting is a *priority* model layered on a tiny slot count, not a queue; it is unlocked progressively and is itself a reward.
