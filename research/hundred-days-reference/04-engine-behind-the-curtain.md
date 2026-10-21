# 04: The engine behind the curtain

What the *Hundred Days* (筑基) fork changed inside Arcanum's engine.

**Sources and versions.** Upstream fork is [`Mostlai/Hundred-days`](https://github.com/Mostlai/Hundred-days) (default branch `master`, HEAD `91ba763`, 2024-10-13, GitHub `license: null`). The readable build used throughout is the English translation fork [`MaxRau/Hundred-days`](https://github.com/MaxRau/Hundred-days) branch `english` (HEAD `9e1e0d3`, 2026-04-25), whose `tools/unminify.py` converts webpack's `eval("…")` module payloads into template literals so `js/hundred_days.js` is 184,635 readable lines instead of 11,227 packed ones. The game reports itself as `P0.3.9c` (`js/hundred_days.js:174730`).

Arcanum is compared at the commit pinned in `research/arcanum-study-2026-10-16/source-metrics.json`, `a2632d2` (`package.json` version `0.12.3.1`, dated 2026-09-19), cloned from `https://gitlab.com/mathiashjelm/arcanum`.

Line numbers below are in `js/hundred_days.js` on branch `english` unless another bundle is named. Logical module paths (`src/…`) are webpack's own module ids, recoverable with `rg -n '"\./src/[^"]+"' js/hundred_days.js`.

---

## 1. Module inventory

Across all 34 files in `js/`, the bundles name **184 distinct `src/` modules** (collapsing Vue's `?vue&type=…` query variants). Arcanum 0.12.3.1 has 201 files under `src/`. 149 paths are shared, 35 are new in the fork, 52 Arcanum paths are absent.

| `src/` directory | Hundred Days | shared with Arcanum | new in fork | Arcanum-only |
|---|---:|---:|---:|---:|
| `ui/` | 78 | 55 | 23 | 25 |
| `items/` | 26 | 18 | 8 | 0 |
| `chars/` | 14 | 14 | 0 | 2 |
| `values/` | 14 | 14 | 0 | 6 |
| `modules/` | 13 | 12 | 1 | 2 |
| `composites/` | 10 | 10 | 0 | 0 |
| (root) | 8 | 8 | 0 | 4 |
| `inventories/` | 6 | 5 | 1 | 2 |
| `debug/` | 5 | 4 | 1 | 0 |
| `util/` | 5 | 4 | 1 | 5 |
| `classes/` | 3 | 3 | 0 | 0 |
| `protos/`, `remote/` | 1, 1 | 1, 1 | 0 | 1, 2 |
| `unused/` | 0 | 0 | 0 | 3 |
| **Total** | **184** | **149** | **35** | **52** |

Within `ui/`, the fork carries 27 `sections/`, 14 `popups/`, 12 `items/`, 9 root, 8 `components/`, 6 `panes/` and 2 `hall/` modules. Arcanum has 19 sections.

**Two corrections to the usual framing.** `src/techTree.js` and `src/genGroup.js` are **not** fork additions: both exist in Arcanum (`/tmp/arcanum-src/src/techTree.js`, 240 lines; `src/genGroup.js`, 213 lines). The fork's copies are 309 and 208 normalised lines. Likewise `debug/` is not new — Arcanum ships `cheats.js`, `cmdline.js`, `debug.js` and `devconsole.vue`, and the fork adds exactly one file to it. The cheat unlock code is still Arcanum's `'bodias'` (`src/debug/cheats.js`).

### New modules, with the system each one implements

| System | Module path | Bundle |
|---|---|---|
| Cultivation record type | `src/items/xiulian.js` | `hundred_days.js:172300`± |
| Research-tree record type | `src/items/techo.js` | `hundred_days.js:172344` |
| Research-slot holder | `src/items/player_res.js` | `hundred_days.js` |
| Factory recipe / recipe-source | `src/items/factrecipe.js`, `src/items/factrecipe_fu.js` | `hundred_days.js` |
| Enemy race table | `src/items/race.js` | `hundred_days.js:156725` (consumer) |
| Heavenly-law skill tree | `src/items/skill_extend.js` | `hundred_days.js` |
| Market record type | `src/items/market.js` | `hundred_days.js` |
| Small-map pathfinding | `src/modules/conquer_map.js` | `conquer-ui.bundle.js:1192` |
| Conquest screen | `src/ui/sections/conquer.vue`, `conquer_map.vue`, `svg_cprogress.vue` | `conquer-ui.bundle.js` |
| Cultivation screen | `src/ui/sections/xiulian.vue` | `xiulian-ui.bundle.js` |
| Research screen | `src/ui/sections/techo.vue` | `techo-ui.bundle.js` |
| Workforce screen | `src/ui/sections/humanr.vue` | `humanr-ui.bundle.js` |
| Production model / factory graph | `src/ui/sections/factmode.vue`, `factory_graph.vue`, `weapon_factory.vue` | `factmode-ui.bundle.js` |
| True soul | `src/ui/popups/real_soul.vue` | `real_soul-ui.bundle.js` |
| Achievements | `src/ui/sections/achievement.vue` | `achievement-ui.bundle.js` |
| Army equipment | `src/ui/sections/adv_weapon.vue` | `adv_weapon-ui.bundle.js` |
| Herbcraft / elements | `src/ui/sections/herb.vue` | `herb-ui.bundle.js` |
| Market screen | `src/ui/sections/market.vue` | `market-ui.bundle.js` |
| Construction vehicles | `src/ui/sections/svehicle.vue`, `src/inventories/userVehicle.js` | `hundred_days.js` |
| `scena` dialogue popup | `src/ui/popups/heart_dialogue.vue` | `hundred_days.js:120139` |
| Offline-time popup | `src/ui/popups/offlinefarm.vue` | `hundred_days.js:120554` |
| Mission list popup | `src/ui/popups/missions.vue` | `hundred_days.js` |
| Backpack popup | `src/ui/popups/backpack.vue` | `hundred_days.js:119628` |
| News ticker | `src/debug/marqueex.vue` | `hundred_days.js:117227` |
| Toast notifications | `src/ui/Notification.vue` | `hundred_days.js:176418` |
| Cat physics toy | `src/ui/popups/matter.min.js` | `hundred_days.js:119982` |
| Spellbook, fullscreen popup, array util | `src/ui/spellbook.vue`, `src/ui/popups/fullscreen_pop.vue`, `src/util/array.js` | `hundred_days.js` |

**Dropped from Arcanum.** The fork has no `ui/sections/converters.vue`, `crafting.vue`, `familiars.vue`, `furniture.vue`, `glossary.vue`, `travelogue.vue`; no `ui/equipment/*`; no `chars/chargroup.js` or `chars/title.js`; no `inventories/home.js` or `spellLoadouts.js`; no `modules/randoms.js`; no `modules/persist/persist-db.js`; no `sw.js`, `timer.js`, `changes.js`, `globalMixin.js`; no `values/coord.js`, `defaults.js`, `mods/curvedmod.js`, `mods/rangedmod.js`, `rvals/atval.js`, `rvals/srcval.js`; no `util/objecty.js`, `varPath.js`, `converter.js`. Some of these are genuine removals (furniture converters — see §4) and some are Arcanum additions made after the fork point. [INFERENCE] The split between the two cannot be settled without bisecting Arcanum's history per file.

**Data.** `data/modules.json` lists **56 core files** plus 21 module files; Arcanum lists 32 core plus 32 modules. 67 JSON files hold about 3,379 array records in 2.17 MB, against Arcanum's 77 files / 1.44 MB (`source-metrics.json`, `groups.data`). 963 KB of the fork's data — 44% — is the single `map.json` record (§4.6).

---

## 2. Game loop and tempo

**Tick.** `const TICK_TIME = 150` ms (`:163585`), with `TICK_LEN = TICK_TIME/1000` (`:163590`) and `EVT_TIME = 1000` (`:163595`). Arcanum is **120 ms** (`src/game.js:30`). Arcanum's own history shows 150 was its original value, reduced to 120 in commit `4482e2b5` "decreased frame time", 2020-04-29. [INFERENCE] The fork's base therefore predates that commit, which would place the fork point in or before April 2020.

The loop is a plain interval: `this.loopId = setInterval(()=>game.update(), TICK_TIME)` (`:118938`), torn down by `pause()` (`:118884`). Autosave is a second interval at `SAVE_TIME = 30` seconds (`:118607`, `:118878`).

**Delta handling is where the fork diverges hardest.** `game.update()` computes `let dt = Math.min((time - this.lastUpdate)/1000, 1)` (`:163876`) and then *discards* anything over one second. Arcanum instead banks the overflow: `if (dt > maxTick) { offlinetime.amount(overflow); dt = maxTick; }` (`src/game.js:383-389`). Consequently the fork has **no `offlinetime` resource, no stored-time bank, no fast-forward button and no turbo mode** — Arcanum's `isInTurboMode`, `speedupFactor`, `coarseTick` and `updateForDelta` (`src/game.js:356-392`) are all absent, as are `doConversions` and `doRepeaters`. Arcanum rule 3 in `research/arcanum-reference/12-design-rules.md` ("never silently apply away time") is not so much broken as not implemented.

**Offline is a separate, purchased system.** Two player stats carry it: `offlinefarm_energy` (`data/player.json:482`, `max: 3000`) and `offlinefarm_speed` (`:490`). On load, `gameLoaded()` (`:166567`) credits `(loadtime - savetime)/1000` seconds of *energy* — but only inside `if (offlinefarm_energy.max > 3000)`, so a fresh character banks nothing. The cap is raised by three cultivation records (`data/xiulian.json:4983`, `:5002` `offlinefarm_energy.max: 600`, `:5019` `3600`, `:5042` `7200`). While energy lasts, `update()` multiplies `dt` by `offlinefarm_speed` (`:163877`) and drains energy by that speed each tick (`:163916`). So the fork's "offline" is a spendable *speed* multiplier rather than Arcanum's simulated catch-up. `player.savetime` / `player.loadtime` are epoch milliseconds persisted on the player (`src/chars/player.js:245`).

**Action slots and rest** are Arcanum's, unchanged in shape. `Runner` (`src/modules/runner.js`) keeps `actives` as an `ArraySet` and `waiting` as an array; `free = Math.floor(max) - actives.size` (`:175340`±); `max` defaults to 1 (`:175296`) and is raised through `mod` paths (`data/hall.json:187` `runner.max: 1`). The waiting list is truncated to `max`, not to a fixed 6. `tryResume()` (`:175701`) fills a spare slot with the rest action whenever `!player.rested()`, and `haltTask()` (`:175619`) only stops rest outright when nothing is waiting. The rest task itself is content: `data/tasks.json:1801`, `slot: "rest"`, `perpetual: true`, `fill: ["tili","hp","stress"]`. "Stop All" in the top bar (`:124228`) fires the `STOP_ALL` event into `Runner.stopAll()` (`:175661`, `:175316`).

**`length` / `perpetual` / `fill`** keep Arcanum's meanings — timed, run-until-filled, and the resources whose caps end a perpetual task. Frequencies in the fork's data: `length` 280 at record level (plus 65 in `tasks`, 30 in `dungeons`, 20 in `enchants`, 15 in `locales` inside module wrappers), `perpetual` 9 + 26, `fill` 44 + 14. `Task.complete` still tests `(!this._length && this.perpetual && this._exp >= 1)` (`src/items/task.js:192`).

**Top-bar chrome.** `showtime(days)` (`:119491`) renders a day count as `Yr y Mm Dd` using 365-day years and 30-day months. The three readouts are `"Time: " + showtime(time)` (`:124518`), `"Life: " + showtime(age) + " (" + round(time/age.max*1000)/10 + "%)"` (`:124523`) and `"Play Time: " + formatTime(playertime)` (`:124535`). [INFERENCE] Play Time is wrong by construction: `update()` calls `playertime.amount(1)` once per tick (`:163883`) while `formatTime` reads the value as seconds, so at 150 ms per tick the counter runs about 6.7× wall clock.

**News ticker.** `src/debug/marqueex.vue` (`:117227`) scrolls a list of 50 `{place: "…"}` strings defined inline at `:118678`, translating the container by 0.5 px every 10 ms.

**Timed reminder.** A `dialog-bar` with title "Remember to export your save as a backup" and content "Timed Reminder" (`:126877`) is re-shown by a 1 Hz countdown that resets to `openTime = 900` (`:117434`) — a nag every 15 minutes.

**Keyboard.** `keyDown` (`:118953`) maps `Digit`/`Numpad` *N* to quickslot *N*; with Shift held and an item under the cursor it *assigns* that item to the slot instead (`:118963`). Panels are bound to `TOGGLE_KEY` constants, one per component: `81` = <kbd>Q</kbd> dev console / wiki-code box (`:117124`; Arcanum uses `192`, backtick, at `src/debug/devconsole.vue:6`), `69` = <kbd>E</kbd> backpack, `113` = <kbd>F2</kbd> fullscreen popup, `8` = <kbd>Backspace</kbd> `scena` dialogue, `9` = <kbd>TAB</kbd> missions guide *and* the offline popup, `90` = <kbd>Z</kbd> factory graph. A `menuHotkeysShift` setting gates every one of them behind Shift (`:119700`, 17 occurrences) — it exists only on `english` (0 occurrences on `master`). The <kbd>Q</kbd> box also carries the redemption-code handler `exchange_code(line, code, code_item)` (`:117128`), which matches typed text against `coderesult` records in `data/resources.json` (e.g. `exchange_code_3` → `{"time": -3650}`, "Time Rewound Ten Years").

---

## 3. Life, age, and 续命

This is the fork's signature system, and the common description of it is wrong.

**The player does not start at age 60.** Two resources drive it, both in `data/resources.json`:

- `time` (`:2879`), name "Time", `val: 1`, `max: 1e29` — the day counter, running **up**.
- `age` (`:3006`), name "Lifespan", `val: 21900`, `max: 21900` — the lifespan budget in days. 21,900 = 60 × 365.

The UI's `Life: Yr 60 M0 D0` is `showtime(age.valueOf())`, i.e. **60 years remaining**, and the `(x%)` beside it is `time / age.max`, the fraction of the budget elapsed. A new character is at day 1 of a 60-year allowance. There is a second, vestigial `age` entry in `data/player.json:55` (`"val": "15~25"`, a `Range`) that nothing reads; `vitals.vue` binds `this.state.getData('age')` (`:119583`), which resolves to the resource.

**Time does not advance with the clock.** No tick code touches `time`. It moves only through the cost and effect channels, and the distribution shows how central that is:

| Channel | Occurrences of a `time` key | Meaning |
|---|---:|---|
| `run` | 316 | per-second drain while an activity runs (`data/dungeons.json:14` `"time": -0.1`) |
| `effect` | 115 | per-second output |
| `xiulianresult` | 79 | days spent on completing a cultivation step (`data/xiulian.json`, `"time": 13`) |
| `result` | 46 | days spent on completing a task/class |
| `lhxy` | 31 | days spent on a synthesis/clearing action |
| `cost` | 11 | days spent on a purchase |
| `coderesult` | 1 | `data/resources.json:2764`, `"time": -3650` |

Signs read oddly because `payCost` subtracts: `run: {time: -0.1}` passes through `game.payCost` → `this.remove(res, -0.1*dt)` and therefore *adds* 0.1 days per second. `xiulianresult: {time: 13}` goes through `applyVars` and adds 13 days outright. Passive ageing exists only as a modifier: `shuaibai` (Decay, `data/resources.json:31`) carries `"time.rate": 0.6`, unlocked by `evt_jihun` once Foundation Establishment ignites a True Soul (`data/events.json:46`); two element records add `time.rate` 0.7 and 0.3 (`data/element.json:26`, `:42`).

**Death is a resource, not a branch.** `data/events.json:30`:

```json
{ "id": "t_death", "name": "Silence", "require": "g.time > g.age", "result": { "death": 1 } }
```

`death` (`data/resources.json:19`) carries `mod: {"stamina.rate": -2000, "tili.rate": -2000, "hp.rate": -2000}`. When the day counter passes the lifespan budget, the event grants one unit of `death`, three vitals drain at 2,000 per second, and the player is permanently incapacitated. There is no death handler anywhere in the engine: `doDeath`, `onDeath` and any reset path are absent from every extracted module. `player.json:70` has a `rein` ("Reincarnation") stat with `mod: {"skill.rate": "2%"}`, but nothing writes it.

**续命 — life extension — raises `age` and `age.max` together.** That pairing is the whole mechanic: `age` is the remaining budget, `age.max` is the denominator of the progress readout, and content that extends life bumps both. Occurrences by channel: `result` 38, `xiulianresult` 32, `mod` 25, `use` 3. Representative records:

| Record | Where | Grant |
|---|---|---|
| `life_1` "Prolonged Breathing (Hope of Immortality)" | `data/xiulian.json` | `{"time": 10, "age": 1825, "age.max": 1825}` — 10 days spent for 5 years gained |
| AP upgrade (7 AP) | `data/ap_upgrade.json:12` | `age.max: 219000` (+600 years) |
| AP upgrade (20 AP) | `data/ap_upgrade.json:26` | `age.max: 657000` (+1,800 years) |
| Spirit Blood Obelisk | `data/furniture.json:2885`, `:2907` | `age: 14600` as a `mod` (+40 years while owned) |
| Consumables | `data/consumables.json:470`, `:492`, `:594` | `age` +30 / +180 / +365 days on `use` |
| Achievements | `data/achievement.json:158`-`:206` | `age.max` +4,000 / 10,000 / 50,000 / 100,000 |

Because `mod` grants are reversible and `result` grants are not, furniture-based extension is a lease and cultivation-based extension is permanent.

---

## 4. The new runtime systems

Every one of these required an engine verb, because Arcanum's content vocabulary has no hook for them. `src/modules/parsing.js:153` (`:174282`) shows the extension points: the cost parser now accepts `cost | buy | acost | counterattack | scost | startcost | lhxy`, the effect parser accepts `effect | result | xiulianresult | ele | damage_element`, and the requirement parser accepts `require | need | equneed | show_require`. Arcanum's equivalents (`src/modules/parsing.js:112-127`) are `cost|buy|sell`, `effect|result|use|acquire|loot`, `require|need`, plus `convert`, `dotcondition`, `restrate`, `summoncondition`. The fork dropped `convert` outright — there are no furniture converters.

**4.1 Cultivation (`xiulian`).** Record class `src/items/xiulian.js` (extends `GData`, `isRecipe: true`, persists `recipe` and `complete`); loaded at `dataLoader.js:513` with type `XIULIAN`. Verb `game.xiulian(it)` (`:164539`): pay `cost`, apply `xiulianresult`, take `loot`, set `complete = 1`, `amount(1)`. All 193 records in `data/xiulian.json` carry both `cost` and `xiulianresult`; the result is where days are spent and lifespan is bought.

**4.2 Research tree (`techo`).** Record class `src/items/techo.js` adds `research_now_point` and `research_need_point` to the save (`:172344`); loaded at `dataLoader.js:449`. Three parallel domains — physics, social, engineering — each with a rate/point pair in `data/player.json:205-245`. `game.doReserach(state.player_res, dt)` (`:163978`, the typo is upstream's) walks the active slots held by `src/items/player_res.js`: if `research_now_point < research_need_point` and the domain's point pool covers one tick of its rate, it pays the project's `run` cost, adds `<domain>_rate` to `research_now_point`, and subtracts the same from `<domain>_point`; on completion it emits a message, calls `amount(1)` and sets the slot back to `'none'`. A second pass, `game.doTecho(state.techo, dt)` (`:163963`), re-applies the `mod` of every completed project each tick. 30 records carry `research_need_point` (`data/techo.json`, e.g. `1000`).

**4.3 Conquest (`conquer`).** Loaded as plain `Resource` records with type `CONQUER` (`dataLoader.js:518`); 22 records in `data/conquer.json`, each with `power`, `acost`, `counterattack`, `buy`, `mod`, `result`. Verb `game.gattack(it, cgl)` (`:164610`): pay `acost`, roll `Math.random()*100 <= cgl*100`; on success `amount(1)` plus `result` and `loot`, on failure pay `counterattack` (which charges morale, organisation, money and *removes a settlement you already hold*). The odds are computed in the view, not the engine. 战斗评级 (Combat Rating) is `f_power` (`data/resources.json:2905`); base attack performance `zdxn()` (`conquer-ui.bundle.js:202`) is

```
f_power*2.5 + f_power * ((shiqi*0.65 + zhuzhidu*0.75) - (yanzhandu/alculation)*yanzhandu) / 100
```

with 士气 `shiqi` morale (max 50), 组织度 `zhuzhidu` organisation (max 40), 厌战度 `yanzhandu` war weariness (max 100) and `alculation` processing power. Success `cgl(it)` (`:205`) is 100% once `zdxn >= power*6`, otherwise `(zdxn/power) - 0.2` when the target outclasses you and `1 - (power/2)/zdxn` when you outclass it. Losing raises `f_stress` (combat pressure), whose `mod` adds `shuaibai.rate 0.1` — military failure accelerates ageing.

**4.4 Workforce (`humanr`).** Loaded with type `HR` at `dataLoader.js:377` and ticked by `doResources(state.humanr, dt)`. A 指令 (directive) is one of 19 records in `data/humanr.json`; `game.gaddzl(it)` (`:164625`) first checks `command_code.val + it.mod.command_code <= command_code.max` (`data/resources.json`, max 3 at start), then pays `startcost` and `amount(1)`. Directives are pure standing modifiers: they consume `space.max`, `human_power.max` and `alculation` permanently in exchange for a resource rate — e.g. `yjjqzl` ("Money Command") costs 200 workforce and 500 processing power for `money.rate: 1.5`.

**4.5 Production model / factory.** Three engine passes. `game.InddoResources(state.factclass, dt)` (`:164100`±) ticks factory stock, scaling every rate by `industry_open / 100` (Logistics Efficiency, `data/player.json:468`, default 100). `game.InddoRecipe(state.factrecipe, dt)` (`:164179`) runs the belts: each recipe has `inp`/`outp` arrays with `base_val` buffers; input is blocked whenever any output buffer exceeds half its capacity (`:164194`), and throughput per leg is `game.ItemFlowrate(id, dock_id, dock_val)` (`:164166`) = **1 for `solid`, 8 for `liquid`, 20 for `gas`**, plus `d_rate * dock_val` contributed by a loading unit (`data/factclass.json` `dock_unit_1`, `"d_rate": 0.5`). `game.writeFdata` (`:164120`±) samples up/download into 15-point ECharts series for the factory graph, but only while `player.openMonitor` is set. `data/factrecipe.json` holds 91 recipes; the thread count a player can run at once is `industry_thread` (`data/player.json:446`, max 5).

**4.6 Small map.** `data/map.json` is a **single record** `map_1` holding two flat arrays of 150,000 tile indices, `floor_layer` and `build_layer` — 963 KB, by itself larger than any other data file in either project. `data/tile.json` has 33 tiles, each with a `walk_speed` (0.2 for deep water through 1 for plains) and a `tindex` list of sprite ids. `src/modules/conquer_map.js` (`conquer-ui.bundle.js:1192`) does the routing: `shortestPath` is a greedy best-first walk over 4-neighbours scoring each candidate `distance/10 ÷ walk_speed` and committing to the best one per step (`findShorest`, `:1211`), with a visited list but no frontier and no cost-so-far — it is not A\*, and it can loop or stall on concave obstacles. `getWalkSpeed(fid, bid)` (`:1221`) multiplies the floor tile's speed by the building tile's. `data/obstacles.json` holds 5 terrain obstacles cleared by `game.cleanobs(it)` (`:164584`), which pays `lhxy`, applies `ele` and decrements the obstacle.

**4.7 True soul (`realsoul`).** Loaded at `dataLoader.js:388`, with a hidden mirror list `realsoul_fu` at `:416`. Two verbs: `game.hechengzh(it)` (`:164560`±) pays `lhxy` and applies `craft_result` to mint the soul's `_fu` companion; `game.zhshengji(it)` (`:164600`) pays `scost` and applies `craft_result` to level it. The per-level bonus the tooltip shows as `up_mod` (template `:123433`) is realised indirectly: the `_fu` record's own `mod` patches the parent — `data/realsoul_fu.json` has `"blood_jihun.scost.blood_soulcore_pice": 0.3` (each level makes the next 0.3 shards dearer) alongside `"blood_jihun.mod.max_rs": 1` and `"blood_jihun.mod.hp.max": 20`. Capacity is `max_rs` / `max_rs_mod` in `data/player.json:150-170`. 19 records carry `scost` and `up_mod`.

**4.8 Achievements.** `data/achievement.json`, loaded at `dataLoader.js` (`:161965`). There is **no engine support at all**: `src/ui/sections/achievement.vue` (`achievement-ui.bundle.js:398`) renders a "Complete Achievement" button whose `disabled` test is `it.val == 1 || targetval(it.target_item) < it.target_val`, and whose click handler is literally `it.amount(1)`. The payout then runs through `GData`'s ordinary `result` path (`src/items/gdata.js:502`). Achievements are therefore player-claimed, never auto-granted, and the reward currency is `ap` (Milestone Points) spent in `data/ap_upgrade.json`.

**4.9 Looping events (`loopcd`).** `game.checkLoopevent(state.events, dt)` (`:163947`): for each event with `loopcd > 0` and `value < max`, accumulate `loopcd_now += dt`, and on reaching `loopcd` reset to zero and re-run `tryUnlock(stat)`. This is the fork's only polling primitive — Arcanum's events fire once. Six of 33 events use it: `evt_loop_frsfw` (`loopcd: 1`, `require: "g.frs<0"`, `mod: {"frs": 2}` — a waste-heat-water auto-reset that fires every second while the resource is negative) and five `evt_yuansutunshi_*_success` elemental-devouring events at `loopcd: 60`.

**4.10 `scena` branches.** `data/scena.json` holds branching dialogue (`branches[].choices[]`, each with `text`, `response_success`, `response_fail`, `next_branch_id`), rendered by `src/ui/popups/heart_dialogue.vue` (<kbd>Backspace</kbd>). Skill checks are a UI-side difficulty ladder, `check_success(po)` (`:120139`): a choice's `check: "<resource>,<value>"` is compared against `getData(item).val`, and the band decides a dice roll — `val*0.8 > need` automatic, `val > need` 90%, `val*1.15 > need` 70%, `val*1.35 > need` 50%, `val*1.5 > need` 25%. Nothing in the engine knows about `scena`.

**4.11 `lhxy`.** Not a system but a fourth cost channel (炼化消耗, refinement cost), parsed at `src/modules/parsing.js:153` and spent by `lianhua` (`:164551`), `hechengzh`, `cleanobs` (`:164584`) and `gcompletemission` (`:164640`±). 62 records use it, mostly in `data/herbal.json`, `data/realsoul.json` and `data/obstacles.json`. Its distinguishing feature is that it pairs with `ele` rather than `result`, which lets elemental synthesis keep its own effect namespace.

---

## 5. Combat

The combat composite is still Arcanum's (`src/composites/combat.js`, shared path), but four things changed inside it.

**The dodge curve was replaced.** The fork's `dodgeRoll(dodge, tohit)` (`:159852`) is a logistic:

```
sig = 1 / (1 + exp(-10 * (dodge - tohit) / max(|tohit|, |dodge|)))
```

returning `sig > Math.random()` as "dodged", with a 50/50 coin flip when both are zero. Arcanum delegates to the defender instead (`src/composites/combat.js:574` → `src/chars/char.js:746-750`), where the chance is `dodge / (100 + dodge + tohit)`. The shapes differ fundamentally: the fork's is symmetric and saturating around parity (equal dodge and accuracy means exactly 50% evasion at any magnitude), Arcanum's is a bounded ratio that never reaches 50% unless dodge exceeds 100 + tohit.

**`tryHit` lost a feature and gained one.** The fork's version (`:159675`) drops Arcanum's retaliate-on-miss (`defender.retaliate(attacker, false)`, `src/composites/combat.js:457`) and Arcanum's `attack.nododge` bypass, and adds `attack.unhit_dot` — a damage-over-time the attacker can apply to *itself* on a miss. The second "抵御" (block) roll against `defender.defense * DEFENSE_RATE` is present but commented out in the fork.

**Monster fields.** `tohit` defaults to `this.level * 1.15` (`src/items/monster.js:93`) and is set explicitly on 288 of the 325 core monsters plus 614 module monsters. `noproc` marks a monster as ineligible for random generation: `GenGroup`'s constructor filters `items.filter(v => !v.unique && !v.noproc)` (`:166173`). Five core monsters and about 600 module monsters carry it — summons, scripted guards and tutorial fodder. [INFERENCE] Arcanum's `src/genGroup.js` is close enough in size (213 vs 208 lines) that `noproc` may be the only difference, but the two were not diffed line by line.

**Monster prefixes (怪物前缀).** `PREFIX_LIST` (`:182621`) is twelve Chinese affixes — 庞大 直冲 强壮 敏捷 坚韧 狡猾 准心 自愈 轻灵 护体 坚甲 好战 — and they are **untranslated on the `english` branch**, which is why the wiki tiddler lists them in Chinese. They are applied in the `Monster` constructor (`:156688`) only when `overlord_symbol >= 1` (`data/resources.json:3223`, "Overlord's Oath") and never to anything whose `kind` includes `summoned`. The count comes from `getPreNum(rank)` (`:156641`): 4 at rank ≥ 4, 3 at ≥ 3, 2 at ≥ 2, else 1, drawn by a Fisher-Yates partial shuffle (`getRandomArrayElements`, `:156630`). Stat effects split across two files:

| Prefix | Effect | Where |
|---|---|---|
| 庞大 "Huge" | `speed ×0.85`, `shape +1`, dealt damage `×1.07` | `:156691`, `:182205` |
| 直冲 "Charging" | deals `×1.07`, **takes** `×1.1` | `:182206`, `:182210` |
| 好战 "Bellicose" | deals `×1.1` | `:182207` |
| 坚韧 "Tenacious" | takes `×0.85` | `:182211` |
| 强壮 "Strong" | `hp.max ×1.3` | `:156692` |
| 敏捷 "Agile" | `speed ×1.13` | `:156693` |
| 狡猾 "Cunning" | `dodge ×1.13` | `:156694` |
| 准心 "Precise" | `tohit ×1.1` | `:156695` |
| 自愈 "Regenerating" | `regen +10` | `:156696` |
| 轻灵 "Nimble" | `dodge ×1.05`, `speed ×1.05` | `:156697` |
| 护体 "Warded" | `shiled_max += hp.max * 0.1` | `:156698` |
| 坚甲 "Armoured" | `defense ×1.08`, `hardiness +0.2` | `:156699` |

**New combat subsystems with no Arcanum counterpart.** Shields (`shiled`/`shiled_max`, upstream's misspelling) appear 201 times in the fork and zero times in Arcanum's `src/`. Criticals likewise: `physical_critical` and `spell_critical` (`data/player.json`, base 5) and `critical_damage` (base 150) are rolled in `src/values/combatVars.js` (`:182230`±) against `attack.bonus_class`; the string `critical` does not occur in Arcanum's `src/` at all. Race scaling is new too: `data/race.json` has 22 entries, and for each `/`-separated token of a monster's `kind` the engine adds `race_mod[field] * min(max_muti, level)` once, then latches `kind_mod = 1` so it cannot double-apply (`:156725`).

**`fight.json`** is five `damage-factor`-tagged resources — `qingjia` light armour, `zhongjia` medium, `heavyjia` heavy, `wuzhuo` corrupt, `bingdong` frozen — ticked by `doResources(state.fight, dt)` in the main loop. They are the *army-scale* damage factors, filled from `data/adv_weapon.json` records through `fill` (44 uses) and raised by `game.touru(it)` (`:164595`), which applies `damage_element` and decrements the stock. This is a second, parallel combat model: `adv_weapon` feeds conquest, not the adventure screen.

**`equip_perk` and rares.** 97 perk records, each with `rank`, `weight`, `perk_slot` (1-3), `perk_for` ("weapon,armor"), a display block `perk_info.info` and a real `mod`. Generation lives in `src/modules/itemgen.js`: `filterPerk(item, perk, rank, slot)` (`:173576`) keeps `v.rank != 0 && v.rank <= rank && v.perk_slot == slot`, then picks by `weight` through a running-total roll (`:173560`±). The rank and quality band come from `estimateItem(erank, elevel, item)` (`:173596`±), which mixes the killed monster's `rank`, the dungeon level, luck, `item.level/29` and `overlord_symbol`; rolled numbers are jittered by `setRandomValue(mod, lo, hi)` into `perk_info_1..3` so each drop shows its own numbers. Fixed perks override the roll: `data/rares.json` has 13 records with `perk1` and 5 with `perk2` (`tianlan_cloak` → `perk1: "tianlan_1"`, `perk2: "tianlan_2"`), and `regular_perk: true` suppresses the random slot string entirely. Every generated item is stamped with its provenance: `data.gettime = 'slain <enemy> at <showtime(time)>'` (`src/modules/itemgen.js:663`) — the drop remembers the in-game day it was won.

---

## 6. Persistence and services

**Save format.** `src/modules/persist/persist.js` over `src/modules/persist/persistLocal.js` (`:174637`-`:174654`): characters go to `window.localStorage` under `'chars/' + pid` (`CHARS_DIR = 'chars/'`, `SAVE_DIR = ''`), the Hall goes to its bare id. The payload is `JSON.stringify(state)` (`src/modules/profile.js:338 saveActive`, `:343`), but each item's `toJSON` diffs against its template (`changes(vars, template)`), so what lands in storage is Arcanum's sparse delta: a real all-sections save is 152,664 bytes against 2.27 MB of content (measured in `03-data-model-and-content.md` §6). Autosave every 30 s (`:118607`). Arcanum's IndexedDB path, `src/modules/persist/persist-db.js`, is **absent from every fork bundle** — the fork is localStorage-only, which is also why the top bar nags about exporting backups every 15 minutes (§2). Migration is by field, not by version: `data/player.json:430` carries `logversion`, `frecipever` and a matching `player_techo_stata` record, and `vitals.vue` compares them to decide whether to show a "recipes changed" notice (`:119570`±).

**Firebase cloud save.** `js/remote.bundle.js` (35 KB) plus `js/vendors~remote.bundle.js` (419 KB), logical module `src/modules/persist/persistRemote.js`. The configuration at `remote.bundle.js:518` is **Arcanum's own project, verbatim**: `apiKey: "AIzaSyDa2Qj2VQvTzhG0MwzxS-IhQy9LYpCgrRM"`, `authDomain: "theory-of-magic-49589.firebaseapp.com"`, `projectId: "theory-of-magic-49589"` — byte-identical to `/tmp/arcanum-src/src/remote/remote.js:17-21`. The fork ships upstream's credentials unchanged, so its cloud-save button points at the original author's Firebase project. The sign-in widget is firebaseui 4.3.0 loaded from `gstatic.com` (`index.html:14`), offering Google, Email, Phone and Anonymous providers (`remote.bundle.js:176-181`).

**AdSense.** Present on `master` only: `index.html:23` loads `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1410792404041007`. The `english` branch removed it; `main` has no `index.html` at all (it is a README-only branch, one file).

**Audio.** `music/bgm.mp3`, 7.03 MB, added in commit `1c45470`. The path is content, not code: `data/gfx_config.json` holds one record `g_c` with `"b_music": "./music/bgm.mp3"`, and the toggle `playm()` (`:121272`) assigns `getData('g_c').b_music` to an `<audio>` element's `src`. There is no audio manager, no volume control and no second track.

**`gfx_config.json`** is the fork's sprite-path indirection table, loaded as the second entry of `modules.json.core`. Its single record carries `ap_ic`, `up_ic`, `f_n_img`, `b_music` and three cat sprites (`maotou`, `maosheng`, `maowei`, head/body/tail) which feed a matter.js ragdoll toy (`src/ui/popups/matter.min.js`, used at `:119982`-`:120003`). Arcanum has no equivalent file; it hard-codes asset paths in components.

---

## 7. Licensing

**Arcanum upstream is MIT.** `/tmp/arcanum-src/LICENSE`: "Copyright 2020 Justin Lacy", with the standard clause — *"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software."* A local copy is already in the repo at `research/arcanum-study-2026-10-16/UPSTREAM-LICENSE`.

**The fork carries no licence and no notice.** Checked on all three branches:

```
git ls-tree -r master  --name-only | rg -i 'licen|copying|notice'   → (empty)
git ls-tree -r main    --name-only | rg -i 'licen|copying|notice'   → (empty)
git ls-tree -r english --name-only | rg -i 'licen|copying|notice'   → (empty)
```

No `LICENSE`, no `COPYING`, no `NOTICE`, and no `CONTRIBUTORS` file (Arcanum ships one). GitHub's API agrees: `repos/Mostlai/Hundred-days` reports `"license": null`.

Nor is the notice inside the bundle. `rg -n 'MIT|License' js/hundred_days.js` returns four hits, all third-party build artefacts: css-loader's header (Tobias Koppers) at `:3022` and `:116255`, Vue 2.6.11 at `:127077`, and snabbdom at `:132864`. Neither "Justin Lacy" nor "Arcanum" appears anywhere in the compiled JavaScript or in any data file.

The sole attribution is `README.md` line 5, three branches identical:

> 筑基是由放置游戏-Arcanum重制而成，目前仍在持续开发。
> *("Hundred Days is a remake of the idle game Arcanum; development is ongoing.")*

**Stated plainly: the fork does not carry the MIT notice that MIT requires.** It is a substantial derivative — 149 of its 184 engine modules are Arcanum's, including the entire `chars/`, `composites/`, `values/` and `classes/` trees unmodified — redistributed without the copyright line or the permission text. A prose credit in a README is not the notice the licence asks for. Because the fork publishes no licence of its own, it also grants downstream users nothing: there is no permission to copy, modify or redistribute *Hundred Days* as such.

---

## For Lowbridge

Lowbridge is a clean implementation, never a fork (`AGENTS.md`, "Maintaining the reference"). This page is **evidence only**. The licence finding above sharpens that rule rather than softening it:

- **Do not copy code or text from either project into `src/`.** Arcanum's MIT terms would be satisfiable with a notice, but the fork's position is worse: it redistributes MIT code without the required notice and offers no licence of its own, so nothing in `Mostlai/Hundred-days` or `MaxRau/Hundred-days` can be lawfully reused regardless of how we would attribute it. Short identifiers (`lhxy`, `loopcd`, `f_power`) and the one-line snippets quoted above are description, not reuse.
- **Mechanics are ideas and remain fair game to learn from.** The useful lessons here are shapes, not source: a lifespan budget expressed as a resource that content spends and extends (§3); a cost channel added by name rather than by special-casing (`lhxy`, §4.11); a polling primitive built from one field and ten lines of loop (`loopcd`, §4.9).
- **Read the fork as a cautionary case on engine sprawl.** Eleven systems were bolted on by adding verbs to `game.js` — `xiulian`, `lianhua`, `hechengzh`, `zhshengji`, `gattack`, `gaddzl`, `cleanobs`, `touru`, `addthread`, `apupgrade`, `gske_add` — each of which duplicates the same `canPay` / `payCost` / `applyVars` / `amount` sequence with a different field name. Arcanum keeps one vocabulary and interprets it; the fork grew eleven. Lowbridge's `AGENTS.md` instruction to "follow the existing record vocabulary before adding fields" is exactly the discipline the fork abandoned, and the symptom is visible in §4: new content types could not reuse the loop, so the loop grew a branch per type (`doTecho`, `doReserach`, `InddoResources`, `InddoRecipe`, `InddoResources_fu`, `writeFdata`, `checkLoopevent`, each iterating a separate list in `update()`).
- **The tempo finding is directly relevant to our `length` work.** The fork clamps `dt` to one second and throws away the remainder (`:163876`), which silently penalises any player whose tab is throttled; Arcanum banks the overflow as a spendable resource. Lowbridge's `settle()` path (`src/main.ts:160-161`) is closer to Arcanum's. Arcanum reference rule 3 (`research/arcanum-reference/12-design-rules.md`) stands; the fork is a worked example of what ignoring it costs.
- **Scope note.** Conquest, factory, workforce, map and true-soul are far outside the current slice (village to Foundation). They are recorded here because the user asked what the fork changed, not as candidates for implementation.

### Verification notes

Module inventory was derived by extracting every `"./src/…"` id from all 34 files in `js/` on branch `english`, stripping Vue loader query strings, and set-differencing against `find src -type f` in Arcanum at `a2632d2`. Module bodies were recovered by splitting the webpack `eval` payloads into one file per module id. Claims tagged `[INFERENCE]` were not measured in the running game: the fork-point date from `TICK_TIME` (§2), the Play Time rate (§2), the Arcanum/`noproc` `GenGroup` delta (§5), and the removed-versus-newer split in the Arcanum-only module list (§1).
