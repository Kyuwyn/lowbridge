# 05: Community wiki notes (HD-WIKI)

What the *Hundred days* / 百日筑基 community wiki contains, in English. The wiki is a single-file TiddlyWiki at <https://2096358571.de5.net/HD-WIKI/>, title "Hundred days Wiki", subtitle 真实修真模拟 ("realistic cultivation simulation"), written and maintained by the game's author, **Pldada**. It is almost entirely Chinese.

Two things make it worth reading rather than skipping in favour of the game data:

1. **2,338 of its 2,698 pages are machine-generated from the game's own JSON**, one page per record, each carrying *reverse* links the data does not store (who requires me, who pays me, who caps me). It is a worked example of the artefact `scripts/validate.ts` could emit for Lowbridge.
2. **The ~360 hand-written pages contain pacing and structure knowledge that is nowhere in the data**: the six-stage shape of the Foundation Establishment (筑基) run, the cost in real numbers of the exclusive class picks, which side branches pay off, and which ones waste a save.

| Source | Version / date | Used for |
|---|---|---|
| Live store `https://2096358571.de5.net/HD-WIKI/` | TiddlyWiki 5.2.2, fetched 2026-10-21 | Plugin list, theme, config tiddlers, `$:/Import` log |
| `/tmp/hd-wiki-tiddlers.json` (2,698 tiddlers) | same fetch | Everything in §1-§4; this is the store minus its 91 system tiddlers |
| `/tmp/hd-wiki-handwritten.json` (360 tiddlers) | same fetch | The hand-edited subset (§3) |
| Game source `master` | commit `91ba763`, 2024-10-13 (`data/` last touched 2024-08-03) | Verifying every wiki claim against the shipped records |
| Game source `english` | commit `9e1e0d3` | Live English `name` fields used throughout |
| `docs/translation/GLOSSARY.md` (`english` branch) | — | Term policy (Er Gen cultivation-novel conventions) |

**Term convention in this page.** Every game term is given as `English (中文)` on first mention in each section. English names are the live ones from the `english` branch, resolved by looking the Chinese `name` up in `master:data/*.json` to get the `id`, then reading the same `id` on `english`. Where the English branch has not translated something (the monster prefixes), that is stated.

---

## 1. Structure of the wiki

### 1.1 Platform and chrome

TiddlyWiki 5.2.2, Chinese (zh-CN) UI, saved to GitHub (`$:/GitHub/Repo` = `Mostlai/HD-WIKI`, branch `master`, file `index.html`) — the same GitHub account that hosts the game mirror. Theme `$:/themes/linonetwo/itonnote`, palette `$:/palettes/Notion`. `$:/tags/RawMarkup` injects the Google AdSense loader and the AMP `amp-ad` custom element, which is why ad markup appears inline in the landing page and the tips page.

The store carries 33 plugin tiddlers: the core, 2 Chinese language packs, 19 plugins and 11 themes. The ones that matter for reading the wiki:

| Plugin | Version | Why it matters |
|---|---|---|
| `$:/plugins/kookma/shiraz-callout` | 0.7.0 | Provides `<<callout-details>>`, the collapsible admonition that carries **every** section of **every** generated record page |
| `$:/plugins/Gk0Wk/echarts` | 0.2.4 | Renders the 路线图 sidebar graph via its `TheBrain.js` addon |
| `$:/plugins/Gk0Wk/echarts-gl`, `-graph-modularity`, `-liquidfill`, `-stat` | 2.0.8 / 2.1.0 / 3.1.0 / 1.2.0 | Echarts extensions; only the graph one is used in content |
| `$:/plugins/linonetwo/pinyin-fuzzy-search` | 0.1.2 | Makes the sidebar search usable for 2,698 Chinese titles |
| `$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced` + 5 `tiddlywiki/codemirror-*` | 0.1.4 / 5.2.7 | Authoring only |
| `$:/plugins/wikilabs/info-tagmap`, `info-session`, `multicol-dropdown`; `felixhayashi/hotzone`; `Gk0Wk/focused-tiddler` | — | Navigation furniture |

Two notes. `$:/plugins/kookma/shiraz` (the parent plugin) is explicitly **disabled** (`$:/config/Plugins/Disabled/...` = `yes`) while its callout child stays on. And `$:/plugins/oflg/fishing` — a spaced-repetition plugin — is referenced in page text but **is not installed**; its 14 Chinese manual tiddlers survive as orphans (see §3), evidence the wiki was started from someone else's TiddlyWiki template in late 2021 before the game content arrived.

### 1.2 Entry point: 欢迎 (Welcome)

`$:/DefaultTiddlers` is `欢迎`, so this is the landing page. It is an ad block, a short instruction block, the 21 category links, and a "still under construction" note. Full translation in §2.1.

### 1.3 Category index pages

25 index pages exist; each is a one-line `<$list filter="[tag[X]sort[title]]"/>`, i.e. a live listing of every tiddler carrying one tag. 21 are linked from 欢迎 in this order; 4 more (`动作类` Actions, `坐骑类` Mounts, `尊号类` Honorifics, `防具类` Armour) exist but are orphaned — nothing links to them.

| Index page | Lists tag | English | Entries |
|---|---|---|---|
| 资源类 | 资源 | Resource | 302 |
| 任务/动作类 | 任务/动作 | Task / Action | 255 |
| 升级类 | 升级 | Upgrade | 310 |
| 技能类 | 技能 | Skill | 91 |
| 修炼类 | 修炼 | Cultivation | 274 |
| 阶位类 | 阶位 | Rank | 28 |
| 法术类 | 法术 | Spell | 54 |
| 家具类 | 家具 | Furniture | 344 |
| 副本类 | 副本 | Dungeon | 50 |
| 真魂类 | 真魂 | True Soul | 37 |
| 居所类 | 居所 | Dwelling | 14 |
| 征服类 | 征服 | Conquest | 24 |
| 铭刻类 | 铭刻 | Enchanting | 10 |
| 指令类 | 人力指令 | Workforce command | 18 |
| 材料类 | 材料 | Material | 24 |
| 道具类 | 道具 | Item | 25 |
| 地块类 | 地块障碍 | Tile obstacle | 5 |
| 工业资源类 | 工业资源 | Industrial resource | 50 |
| 工厂类 | 工厂 | Factory | 23 |
| 生产模式类 | 模式 | Production mode | 89 |
| 研究类 | 物理域 / 社会域 / 工程域 | Physical / Social / Engineering domain | 30 across three sub-lists |

The four orphans list 2, 0, 3 and 18 entries respectively — 坐骑类 (Mounts) is permanently empty because no tiddler carries the 坐骑 tag.

The index pages are the only hand-written navigation in the wiki. The game's own section names (`data/sections.json`) map onto them loosely: Cultivation (修炼), Skills (技能), Dwelling (居所), Conquest (征服), Enchanting (铭刻), Research (研究), Workshop (模型) all have an index; Market (交易), Adventure (探险), Equipment (装备), Workforce (人力), Character (玩家) and Achievements (成就) have tags on record pages but no index page.

### 1.4 Sidebar: 路线图 (Roadmap)

One tiddler carries `$:/tags/SideBar`, so the wiki has exactly one custom sidebar tab. Its whole body is:

```
<$echarts $tiddler="$:/plugins/Gk0Wk/echarts/addons/TheBrain.js" levels="1" graphTitle="路线图"/>
```

That renders an Echarts "TheBrain"-style force graph of the **currently open tiddler and its one-hop neighbours** — i.e. a live dependency map built from the wiki's own links. Because the generated pages link both forwards (requirements, costs) and backwards (prerequisite-of, obtainable-from), one hop around any record shows its full local gating neighbourhood. Created 2022-07-17, last touched 2023-04-13.

### 1.5 The generated record pages

**2,338 generated vs 360 hand-written** (2,698 total non-system tiddlers; the live store has 2,789 including 91 system tiddlers).

Every generated page carries the identical timestamp `14441111000000000` (a sentinel, not a date) and creator `Pldada`. The `$:/Import` tiddler still holds the log of the last bulk import: **2,220 titles, all of them generated pages**. So the generator runs offline and the output is dropped in as a TiddlyWiki import.

**Template (current generation, 2,256 pages).** Reading the source of a representative page, the parts in order:

1. **Description as a blockquote.** `>` followed by the record's `desc` from the game data. 1,917 pages have one; records with no `desc` start with a bare `>`. Resources flagged hidden in-game get a red-span warning instead: *"Note. This entry is marked as a hidden resource in the game. If this item's tag is Resource, it is very likely the product of its corresponding cultivation — search this entry's name in the box on the right to find that cultivation."*
2. **解锁需求 (Unlock requirement)**, one `<<callout-details type:tip>>` per clause. Inside: the requirement rendered as wiki links (`[[阅读]] >=3与[[基础制造学]] >=3与[[天文学]] >=2`) **and, in a fenced code block, the raw engine expression**:
   ```
   解锁需求(JSON):g.reading>=3与g.crafting_1>=3与g.astronomy>=2

   为什么会有此条？因为可以通过此来手动查询未显示的条目
   ```
   ("Why is this here? Because you can use it to manually look up entries that are not displayed.") Note the generator substitutes the Chinese conjunction 与 for `&&` in the "JSON" line too, so it is a rendering of the expression rather than the literal source string. 1,550 pages carry one requirement clause and 155 carry two (1,860 callouts in all); 633 pages carry none.
3. **A horizontal rule**, then **此条目具有以下TAG(标签)** ("this entry has the following tags") listing the record's `tags` as links, followed by an embedded `<$list filter="[tag[X]sort[title]]"/>` for siblings. 844 pages embed such a list; 148 generated pages have no tags at all.
4. **Nine further callouts.** Four restate the record's own forward fields (`cost`, `mod`, `result`, `effect`) and five are genuine reverses. The five reverse ones are emitted unconditionally on all 2,256 current-template pages, blank or not; the four forward ones appear only when the field exists. Counts are of callouts with content:

| Callout title (zh) | English | Callout type | Emitted | With content |
|---|---|---|---|---|
| 该条目属于以下条目的前置解锁 | This entry is a prerequisite of | `question` | 2,256 | 852 |
| 此条目的MAX（上限）在以下条目中被影响 | This entry's max is affected by | `example` | 2,256 | 232 |
| 此条目的rate（速率）在以下条目中被正面影响，即rate>0 | This entry's rate is raised by (rate > 0) | `tip` | 2,256 | 107 |
| 此条目的rate（速率）在以下条目中被负面影响,即rate<0 | This entry's rate is lowered by (rate < 0) | `error` | 2,256 | 43 |
| 此条目可以在以下条目中被获取 | This entry can be obtained from | `todo` | 2,256 | 292 |
| 该条目具有以下花费 | This entry costs (`cost`) | `note`, `status:open` | 1,224 | 1,224 |
| 该条目具有以下修正 | This entry's modifiers (`mod`) | `note`, `status:open` | 952 | 952 |
| 该条目具有以下结果 | This entry results in (`result`) | `note`, `status:open` | 621 | 621 |
| 该条目具有以下影响 | This entry's ongoing effects (`effect`) | `note`, `status:open` | 98 | 98 |

   The four forward callouts carry `status:open` and start expanded; the five reverse ones start collapsed, so a record page opens showing what it costs and leaves "who needs me" one click away. Values print as `[[名字]]:数值` lines, including `.max` / `.rate` suffixes verbatim (`[[混乱度]].max:5`, `[[天文学]].rate:0.3`). The generator is evidently Python: nested dicts leak through as reprs, e.g. `prismatic:{'skipLocked': True, 'value': 3}` on 百代长梦.

**An older template generation survives on 82 pages** (`2023002`, `奥法驱动`, `合理外放(导向)`, …). It uses bare `<fieldset>` blocks instead of callouts, has a single combined "rate is affected by" section rather than the positive/negative split, and has no "can be obtained from" section at all. These are the generator's first output, never regenerated.

**Coverage.** 2,043 of the 2,338 generated titles match a record `name` in `master:data/*.json` exactly. The 295 that do not are mostly disambiguated titles the generator invented (`出售白白鼠-市场购买` "Sell White Mouse – market purchase", `冰冻深层【冰冻核心】`) plus records renamed or removed since 2024. Against the game's ~4,817 unique record ids the wiki covers roughly half: everything that existed when the generator last ran, and none of the later modules.

### 1.6 Tag frequency

321 distinct tags; 197 tiddlers carry none.

| # | Tag | English | Total | Generated | Hand |
|---|---|---|---|---|---|
| 1 | 家具 | Furniture | 344 | 320 | 24 |
| 2 | 升级 | Upgrade | 310 | 251 | 59 |
| 3 | 资源 | Resource | 302 | 300 | 2 |
| 4 | 修炼 | Cultivation | 274 | 233 | 41 |
| 5 | 任务/动作 | Task / Action | 255 | 255 | 0 |
| 6 | 技能 | Skill | 91 | 89 | 2 |
| 7 | 模式 | Production mode | 89 | 89 | 0 |
| 8 | 市场 | Market | 75 | 75 | 0 |
| 9 | 成就 | Achievement | 73 | 73 | 0 |
| 10 | 玩家信息 | Player info | 59 | 59 | 0 |
| 11 | 武器 | Weapon | 56 | 50 | 6 |
| 12 | 法术 | Spell | 54 | 0 | 54 |
| 13 | 副本 | Dungeon | 50 | 50 | 0 |
| 14 | 工业资源 | Industrial resource | 50 | 50 | 0 |
| 15 | 装备 | Equipment | 50 | 50 | 0 |
| 16 | 购买护甲 | Buy armour (market) | 44 | 44 | 0 |
| 17 | 固体 | Solid | 42 | 42 | 0 |
| 18 | 生产 | Production | 40 | 40 | 0 |
| 19 | 战斗类副本 | Combat dungeon | 37 | 37 | 0 |
| 20 | 真魂 | True Soul | 37 | 19 | 18 |
| 21 | 生命构造 | Life Construction | 31 | 31 | 0 |
| 22 | 阶位 | Rank | 28 | 19 | 9 |
| 23 | 道具 | Item | 25 | 25 | 0 |
| 24 | 材料 | Material | 24 | 24 | 0 |
| 25 | 征服 | Conquest | 24 | 22 | 2 |
| 26 | 任务 | Task | 24 | 1 | 23 |
| 27 | 工厂 | Factory | 23 | 21 | 2 |
| 28 | 元素工程 | Elemental Engineering | 19 | 19 | 0 |
| 29 | 能量解构 | Energy Deconstruction | 19 | 19 | 0 |
| 30 | 人力指令 | Workforce command | 18 | 18 | 0 |

The split is informative. `法术` (Spell) and `任务` (Task) are **purely hand-written** — the generator never emitted spells or the author's own task notes. `任务/动作`, `市场`, `成就`, `玩家信息` are **purely generated**. The hand-written pages cluster in `升级` (59), `法术` (54), `修炼` (41) and `家具` (24): the author hand-stubbed the things he was actively designing, and generated the rest later.

### 1.7 Dates

Hand edits run **2022-01 → 2024-10**, excluding nine 2021-11/12 edits that belong to the orphaned fishing-plugin manual.

| Month | Hand edits | What happened |
|---|---|---|
| 2021-11 / 2021-12 | 9 | Fishing-plugin manual tiddlers (template leftovers, not this wiki's content) |
| 2022-01 | 106 | Wiki opens: index pages, spells, cultivation, armour, weapons |
| 2022-02 | 118 | The officialdom (官场) branch, almost all stubbed on 2022-02-03 |
| 2022-03 | 4 | — |
| 2022-04 | 70 | The stray-cat chain (2022-04-12), the Great Marsh chain, True Soul fragments |
| 2022-05 | 23 | Production modes, Marsh-herb materials |
| 2022-11 | 1 | One production mode |
| 2023-02 / 03 / 04 / 05 | 27 | Armour-class stubs, dungeon index, monster prefixes, FAQ, roadmap tweaks |
| 2024-10 | 2 | 欢迎 and 筑基小贴士 — the last two edits to the wiki |

Creators: Pldada 343, `oflg` 4 (fishing plugin), 13 with no creator field. The wiki effectively stopped in 2023 apart from the 2024 tips-page contribution.

---

## 2. Full translations

### 2.1 欢迎 (Welcome)

> *Modified 2024-10-14. Two `<amp-ad>` AdSense blocks removed; everything else is complete.*

**This is the Wiki page for Hundred days**

**In game, press `Q` and type the Wiki-code into the box that pops up at the top, then press Enter, to get the achievement**

**Type what you want to know into the search box on the right, or explore on your own**

**QQ chat group: 281738137**

**Game address: https://mostlai.github.io/HD-TEST**

**Afdian (patronage): https://afdian.com/a/pldada**

**Guides / tips: [筑基小贴士 Foundation Tips] ← click to enter**

**FAQ: [FAQ] ← click to enter**

[Resources (资源类)] · [Tasks / Actions (任务/动作类)] · [Upgrades (升级类)] · [Skills (技能类)] · [Cultivation (修炼类)] · [Ranks (阶位类)] · [Spells (法术类)] · [Furniture (家具类)] · [Dungeons (副本类)] · [True Souls (真魂类)] · [Dwellings (居所类)] · [Conquest (征服类)] · [Enchanting (铭刻类)] · [Workforce commands (指令类)] · [Materials (材料类)] · [Items (道具类)] · [Tiles (地块类)] · [Industrial resources (工业资源类)] · [Factories (工厂类)] · [Production modes (生产模式类)] · [Research (研究类)]

*(in green)* The material is still incomplete. Still under construction.

The `Q`-key instruction is real: the game's command handler registers `exchange_code(line, 'Wiki-code', 'exchange_code_wiki')`, which sets the hidden resource `xiulian_wiki` and trips achievement `ach_wiki` ("Open the WIKI"), worth 0.1 Milestone Points (里程点 / `ap`).

### 2.2 筑基小贴士 (Foundation Establishment Tips)

> *Created 2024-10-06, modified 2024-10-14; tagged 攻略 (guide). This is the single most useful page on the wiki. One `<amp-ad>` block removed. All 24 blocks are translated below in source order: 4 of header, then 20 tips.*

**Thanks to @DG from the QQ group for the contribution!**

---

**[H1]** Common questions and advice. Foundation Establishment (筑基) URL: https://static.oschina.net/trytry/HD-TEST/

**[H2]** ★ A detailed introduction to Foundation Establishment (筑基) — not a walkthrough: https://www.bilibili.com/read/readlist/rl849685

**[H3]** *(pull-quote)* Tip: click once on something that needs continuous clicking, then hold down the Enter key — that clicks it about 20 times a second.

---

**[1]** Short on tiles (地块 / tile) or stuck at a material cap: look it up in the Wiki.

**[2]** Guicang Secret Art (归藏秘术) will not unlock: you need Physiology (生理学) at level ≥ 5, ≥ 10 Life Spirit Stone (生灵石), and the Great Force Copper Warrior (大力铜人) honorific equipped — that is all.

**[3]** For most skills, taking them to level 10 is basically enough.

**[4]** Origin Scholar (本源学者) — unlocked by building 20 Obelisks (方尖碑) and committing no murder. Five Elements Scholar (五环学者) — unlocked by obtaining Spring-Source Spirit Wood (源泉灵木), Pure White Gold-Stone (纯白金石), Yang Breath Blazing Stone (阳息烈石), Unblemished Jade Marrow (无垢玉髓) and Virtue-Bearing Thick Earth (载德厚土), and committing no murder. Sunset Scholar (落日学者) — unlocked by taking Voidlight Secret Arts (无光秘术学) to level 2.
Which of the three is better? Origin Scholar has the biggest bonuses (and that's it — the author hasn't built the rest yet). Five Elements Scholar later gets the exclusive weapon Wondrous Secret Blade (奇术秘刃) (forged from 5 gold-tier items) and the exclusive skill Celestial River Five Tribulations (天江尘五劫), top damage over a thousand (in the next version; the author hasn't made it yet). Sunset Scholar has more content later (the author's recommendation) (no specifics, because I didn't take Sunset Scholar).
Pick whichever you think is the best value.

**[5]** The Workforce (人力) screen shows command capacity (指令容量) occupied even though no command is running: some buildings consume command capacity in order to be built.

**[6]** Meet the Stranger (陌生人) 50 times in the Tianlaan Capital (天澜国国都) and you can enter Officialdom (官场). Finishing that side branch gets you the graduation weapon Stardust Parasite (星尘寄生), attack 46-68. Export your save before you start.

**[7]** Exploring certain dungeons enough times unlocks the matching market purchase (for example: 10 explorations of the Frozen Cave (结冻地穴) unlocks buying Frozen Core (冰冻核心)).

**[8]** Giant Spirit Mountain (巨灵山), Deep Forest (森林深处), Lauze Great Lake (劳泽大湖), Volcano Edge (火山边缘), Basin Center (盆地中心), Village of the Unseen (未见之村), Storm Cliff (风暴崖), Attuned Spirit (调谐之灵), Soul-Scorching Spirit (灼魂之灵), Endless Snow Plains [Netherworld] (穷究雪原[黄泉]) and Ancient Chronicle Ordered Position (古本纪有序位) can all yield gold-tier equipment — very strong.

**[9]** The Blood Craving (渴望血) skill is not recommended, because this skill is mostly used to soak damage — just summon the Guardian Tortoise (守御龟) instead.

**[10]** On the Conquest (征服) screen, Workforce (人力) determines the success chance and Processing Power (计算力) determines the conquest cap.

**[11]** Why is it still 6/7 after I've occupied several times? It may actually be six-point-something and not yet seven, so you can't occupy.

**[12]** Why can't I enter the Distant Mountains (远山) adventure? Not enough Range (距离). Build the Workbench (工作台), learn Basic Manufacturing (基础制造学), then Horsemanship (驯马术); find the Old Horse (老马) in the upgrades area and upgrade it; finally equip the Old Horse on the Character (玩家) screen.

**[13]** Once you have learned "Climbing Techniques" (攀登技巧), "Extreme Cold Adaptation" (极寒环境适应) and "Clear Thinking" (清醒思维) you will unlock the frozen dungeon; clearing it unlocks obtaining Frozen Core (冰冻核心).

**[14]** Why can't I occupy even though all the conditions are satisfied? Attacking first requires Combat Rating (战斗评级) greater than the target's defence.

**[15]** Seeker (求索者) or Commander (长官), which is better? Taking Seeker later unlocks Humanities Apprentice (人文学徒) and Sea of Knowledge (漫海求识).
Taking Sea of Knowledge gets you 2,930 Processing Power (计算力) and 10 command capacity (指令上限) in total.
Humanities Apprentice gets you 1,430 Processing Power and 1,000 Workforce (人力) in total.
Taking Commander later unlocks Tower Light (塔光) and Judgment Light (裁光).
Taking Judgment Light gets you 1,650 Workforce, 15 command capacity and 5 True Soul capacity (真魂上限) in total.
Taking Tower Light gets you 2,650 Workforce.
Officialdom also lets you choose once, though: Crown Prince (太子) adds 100 Processing Power and 500 Court Influence (朝廷影响力); General (将军) adds 300 Workforce and 500 Court Influence.

**[16]** Biomass (生物质) — and Five Ring Points (五环点) likewise — can be obtained automatically on the Workshop (模型) screen, via Biomass Aggregation (生物聚合) (respectively Five Ring Aggregation (五环聚合)) inside Mysterious Feminine Liquid (玄牝液).

**[17]** Foundation Establishment (筑基) has six major stages (I think): the Core stage unlocked by Frozen Core (冰冻核心); the Netherworld (黄泉) stage unlocked by the Toward-Death Altar (向死法坛); the Five Phases (五行) stage unlocked by Reconnaissance Theory (侦察学说); the Element stage unlocked by Life Analysis (生命分析, in Life Construction 生命构造); the Industry stage unlocked by Environmental Deconstruction (环境解构); and the True Soul stage unlocked by True Soul (真魂, in Path 路径) — that one eats an enormous amount of time.

**[18]** Want to take Climbing Techniques (攀登技巧) but short on Overmind (超识)? Take Advanced Knowledge (进阶知识), then go and finish Collective Political Studies (群体政治学) in Skills and you'll get Overmind.

**[19]** Some enchants can only be applied to specific gear. For example armour can only take Small Servo (小型伺服) and Reinforced Armor (加固装甲); weapons can only take Modified Accuracy (改装命中) and Modified Damage (改装伤害); the various orbs (宝珠) can only be enchanted onto a belt. If you want every orb bonus at once, enchant them onto Five Wheels [AL-Waist] (五轮[AL-腰部]) — it fits all of them exactly.

**[20]** When your Lifespan (寿命) reaches 500 years you unlock the stray-cat event chain (流浪猫猫事件链). Whatever you do, do not send the cat away (送离): choose Adopt (收养) and you later unlock a pile of buildings giving you many bonuses — Electrical Energy (电能) rate, Dwelling (居所) floor area, Coins (钱币) rate — and you get the extremely strong skill "Cat Power Dominator Fist" (猫力霸拳), attack 450-550.
*(Feels like playing an idle game inside an idle game.)*

### 2.3 FAQ

> *Modified 2023-04-13. Complete.*

| Q | A |
|---|---|
| Neuro-Material (神经材料) stuck at cap 5? | Spirit-Inverse Spatial Storage (灵反空间存储) |
| Divine Sense (神识) stuck at cap 8? | Dream Catcher (捕梦仪) |
| Coherence (合理) stuck at 39.5 | Build the furniture Spirit Gathering Instrument (聚灵仪) |
| How do I become an official? | Tianlaan Capital (天澜国国都) (Adventure 探险) — extremely low chance of getting the ticket |
| How do I get Active Crystal (活性结晶)? | Active Synthesis (活性合成) |
| How do I get Frozen Core (冰冻核心)? | Frozen Deep Layer (冰冻深层) (Adventure) |
| How do I get Pure Corrupt Spirit Body (纯浊灵体)? | Small Battlefield (小型战场) (Adventure) |
| When I'm stuck, what furniture can I build to unlock new things? | Cryogenic Biology Lab (低温生物实验室), Small Broadcasting Station (小型广播站), Netherworld Stable-Flow Well (黄泉稳流井) |

All eight check out against `master`: `lfkjcc` has `sj_met.max: 10`; `dream_ctc` has `shenshi.max: 1`; `small_jlz` has `heli.max: 2`; `huoxi_hc` results in `life_crystal: 1.2`; `cold_4` is literally named 冰冻深层[冰冻核心]; `missions_3`/`dirty_lingti` come from `zhanchang`; and the three named furniture pieces each open a branch (`cold_bio_lab` → Active Crystal, `small_gbz` → `dist: 100` which gates Reconnaissance Theory, `huangquan_well` → the Netherworld line).

The "extremely low chance" answer is a misreading of the data worth flagging: the Stranger encounter `enc_guodu_1` grants `off_hide_1: 0.02` deterministically, so the Officialdom Entry Scroll (官场入门卷) accrues at a fixed 2% per meeting. It is not a low-probability roll, it is exactly 50 meetings — which is what the later tips page [6] says.

### 2.4 怪物前缀 (Monster prefixes)

> *Created and modified 2023-03-24. The page is a verbatim paste of the `PREFIX_LIST` doc-comment from the game's bundle; the "Effect in code" column below is the actual implementation, which matches.*

The English build has **not** translated these: `const PREFIX_LIST = ['庞大','直冲','强壮','敏捷','坚韧','狡猾','准心','自愈','轻灵','护体','坚甲','好战']` is identical on both branches, so the glosses below are this page's, not the game's.

| Prefix (zh) | English gloss | Wiki text | Effect in code |
|---|---|---|---|
| 庞大 | Huge | Speed −15%, damage +7%, size +1 | `speed *= 0.85`, `shape += 1`, dealt `dmg *= 1.07` |
| 直冲 | Charging | Damage taken +10%, damage dealt +7% | taken `dmg *= 1.1`, dealt `dmg *= 1.07` |
| 坚韧 | Tenacious | Reduces damage taken by 15% | taken `dmg *= 0.85` |
| 强壮 | Strong | Health +30% | `hp.max *= 1.3` |
| 敏捷 | Agile | Speed +13% | `speed *= 1.13` |
| 狡猾 | Cunning | Dodge +13% | `dodge *= 1.13` |
| 准心 | Sharpshooter | Accuracy +10% | `tohit *= 1.1` |
| 自愈 | Self-Healing | Regeneration +10 | `regen += 10` |
| 轻灵 | Nimble | Dodge +5%, speed +5% | `dodge *= 1.05`, `speed *= 1.05` |
| 护体 | Warded | Shield + 10% of max health | `shiled_max += hp.max * 0.1` |
| 坚甲 | Hard-Armoured | Defence +8%, Armor Strength (甲强 / `hardiness`) +20% | `defense *= 1.08`, `hardiness += 0.2` (a flat +0.2, not a percentage) |
| 好战 | Bellicose | Damage +10% | dealt `dmg *= 1.1` |

Prefixes are rolled per monster from `getPreNum(rank)`, so higher-rank monsters carry more of them, and they stack multiplicatively.

---

## 3. The other hand-written pages

296 of the 360 hand-written tiddlers are **record stubs in one fixed shape**: a title, one tag, and a short body reading `解锁需求:[[X]]` ("Unlock requirement: X") or `掉落:[[X]]` ("Drops from: X") or, for production modes, `消耗 A 和 B 并生产 C` ("Consumes A and B and produces C"). The median hand-written body is 17 characters; 288 of the 360 pages are 12-40 characters long and only 19 exceed 100. These stubs are the author's own scratch notes from while he was building each system, which is why they cluster by date so tightly — and why the generator later superseded most of them. 78% of them still match a live record name (exactly, or allowing for the category suffix the game later added, e.g. 甲乙归真 → `甲乙归真(生命构造)`).

Grouped, mutually exclusive, summing to 360:

| Group (zh / en) | n | Dominant tag | Dates | Gist |
|---|---|---|---|---|
| **官场 Officialdom branch** | 61 | 升级 / 阶位 / 任务 | 2022-02-03/04 | The whole side branch stubbed in two days: 9 ranks from Regional Inspector (巡检使) to Chief Justice [Secondary 3rd Grade] (大理寺卿[从三品]), each with its Court Influence (朝廷影响力) threshold; the Work / Tribute / Bribery upgrade triplets per rank; the Ivory / Crystal / Divine tablets (象牙笏, 零结笏, 神传笏) that raise command capacity; the noble titles (连城伯, 枫亭侯, 监天侯) and their fiefs (枫亭, 歌台); and the four officialdom dwellings |
| **法术 Spells** | 52 | 法术 | 2022-01 → 2022-05 | One stub per spell, requirement only. The generator never covered spells, so these 52 are the wiki's *only* spell pages. Includes the five-element Foundation set (炎炎诀[筑基], 真水避火法[筑基], 厚土抑木诀[筑基], 锐金之意[筑基], 万木归心决[筑基]), three First Return (初归) forms, and five class-exclusive 落日 / 破道 tier-ends, each gated on 终论神识学 ≥ 2 plus the matching class |
| **猫 Cat event chain** | 39 | 升级 / 家具 / 事件链 | 2022-04-12 | The whole stray-cat chain in one sitting: 流浪猫猫 (Stray Cat, gated on Lifespan reaching 500 years), 收养 (Adopt) / 送离 (Send Away), 摸猫 (Pet the Cat), eight Rapid Petting (快速摸猫) and eight Cat Power Expansion tiers, the cat nests and motivators, and 十万猫之力 (Force of 100,000 Cats) with its three spells. Note the wiki titles these 喵力扩展 ("meow-power") where the data says 猫力扩展 |
| **修炼 Cultivation (misc.)** | 31 | 修炼 | 2022-01 → 2022-04 | Loose cultivation stubs outside the life-extension line: the five 归藏秘术 body techniques that all require the Great Force Copper Warrior honorific, the four 真实 ("True") forms gated on owning a True Soul, the three 异步 (async) techniques, the 混沌 (chaos) set |
| **Index pages** | 25 | — | 2022-01 → 2023-05 | §1.3 |
| **装备 Gear** | 24 | 防具 (18) / 武器 (6) | 2022-01 → 2022-04 | The five-piece 无月 (Moonless) [AL] set, the 凝火 / 紫电 [AL] set, the 热力生物工程 (Thermal Bio-engineering) mechanical set, six weapons |
| **真魂 True-soul fragments** | 18 | 真魂 | 2022-04 → 2023-03 | One stub per shard. Two generations: the 2022 batch are drops from the 寻求X ("Seek X") dungeon-unlock tasks (智识碎片 Wisdom Shard ← 寻求智慧 Seek Wisdom, 贪婪碎片 ← 寻求黄金, 燃烧碎片 ← 寻求火焰 …); the 2023 batch come from the soul-fractal researches instead (五位魂分形 Five-Phase Soul Fractal → 厚土/真水/真火/锐金/源泉碎片; 忆风魂分形 Memory-Wind Soul Fractal → 记忆/速度碎片) |
| **Fishing-plugin manual** | 14 | `?` | 2021-11 → 2022-01 | Orphaned Chinese docs for `oflg/fishing`, a spaced-repetition plugin that is no longer installed. Includes a 450 KB base64 JPEG of Ma Yuan's *Fishing Alone on a Cold River* (寒江独钓图·宋代·马远). Not game content |
| **家具 Furniture** | 13 | 家具 | 2022-01 → 2022-05 | The five 高温熔炉 (high-temperature furnace) variants, the 白白鼠 (White Mouse) breeding line, the Marsh-wood containers |
| **任务 Tasks** | 12 | 任务 | 2022-01 → 2022-05 | Misc. one-shot tasks: 钛板制造, 电缆培训, 高温运算, 护甲训练, 芥子合并, 零部件改装 … |
| **续命 Life-extension cultivation** | 12 | 续命 | 2022-01 → 2022-05 | The lifespan line. 神识命理 (Divine Sense Vitality) notes `[[寿命]]+3650`; 悠久呼吸II (Prolonged Breathing II) notes `[[寿命]]+2825`; 风灵 requires finishing Foundation Zero-Weight (筑基零重) before age 30, 路远 between 60 and 90. The only hand-written pages that record a *payout* rather than just a requirement |
| **Frame & guides** | 11 | — | 2022-01 → 2024-10 | 欢迎, WIKI (an older copy of the welcome text), FAQ, 筑基小贴士, 怪物前缀, 路线图, Pldada ("author, developer"), 构造体, 空间, 问题, 行胜于言 (a quotation the author kept from `tiddlywiki-xp`) |
| **Empty stubs** | 10 | — | 2022-01 → 2023-02 | Zero-byte tiddlers created to make red links go away: 朝廷影响力 (Court Influence), 官场入门卷 (Officialdom Entry Scroll), 邪恶 (Evil), the three armour classes 轻甲 / 中甲 / 重甲 (Light / Medium / Heavy Armor), the two damage types 冷结 (Cryo) and 污浊 (Corrupt), and the four furniture source tags `astro` / `research_space` / `ultraviolet_rays` / `work_space` |
| **生产模式 Production modes** | 9 | 生产模式 | 2022-04 → 2022-11 | The only stubs that record full recipes: e.g. 奢侈品生产 "Consumes 2 Daily Goods (日用品) and 1 Advanced Goods (高级货物) and produces 1.5 Luxury Goods (奢侈品); unlock: Assembly Mechanism (组装机制) ≥ 8" |
| **药剂/药材 Potions & herbs** | 9 | 一级药剂 / 药剂 / 药材 | 2022-01 → 2022-05 | Tier-1 pills gated on Pharmacology (药理学) levels, plus the two Great Marsh herbs with their full elemental composition (金石木 Aureolith Wood: Elemental Chaos 0.1, Giant Wood 1.5, Flood 1.5, Thick Earth 1.2, Sharp Gold 1.2) |
| **升级 Upgrades (misc.)** | 6 | 升级 | 2022-02 → 2022-05 | 磁刷扩展1, 护甲容量, 狡诈轨迹, 空光兽, 阵厦, 序阵厦 |
| **事件链 Great Marsh chain** | 1 | 事件链 | 2022-04 | 陷于大沼 (Mired in the Great Marsh): "unlock requirement: equip any True Soul (真魂)" |
| **Everything else** | 13 | 工厂 / 征服 / 居所 / 指令 | 2021-11 → 2022-05 | Two conquest targets (小城镇 Small Town, the only page that records a defence value — "defence 30, infiltration lowers defence by 1" — and 联军指挥部 Allied HQ), two factories, two Marsh dwellings, two Workforce commands, 探索 (Exploration), 毁谤 (Slander, "requires Evil > 10"), 远沼边缘 (Distant Marsh Edge), and two fishing-plugin widget tables |

---

## 4. What the wiki knows that the data does not

The game ships ~4,817 unique records, most of them carrying a `require` expression. What it does not ship is a *reading* of them. Everything below is in the wiki and nowhere in `data/*.json`; the verification notes are mine, against `master`.

### 4.1 The six major stages

The data has no notion of a "stage". Tips [17] names six, each keyed to the single record that opens it:

| # | Stage (zh / en) | Opened by | Record |
|---|---|---|---|
| 1 | 核心 Core | Frozen Core (冰冻核心) | `cold_core` (resource) |
| 2 | 黄泉 Netherworld | Toward-Death Altar (向死法坛) | `death_fatan` (furniture; `require: g.xiulian_death_1>=1`) |
| 3 | 五行 Five Phases | Reconnaissance Theory (侦察学说) | `zcx` (upgrade; `require: g.small_broadcast>=1`, grants `dist: 10`) |
| 4 | 元素 Element | Life Analysis (生命分析), in Life Construction (生命构造) | `xiulian_smfx` |
| 5 | 工业 Industry | Environmental Deconstruction (环境解构) | `huanjjg` (task; results in the four survey-site resources) |
| 6 | 真魂 True Soul | True Soul (真魂), in Path (路径) | `lj_zhenhun_1`, "eats an enormous amount of time" |

This is the single most load-bearing thing on the wiki. Nothing in the data distinguishes these six records from the other 4,811; their significance is purely that each one is the hinge the subsequent content hangs off. The author's own hedge — 应该是 "I think" — is worth preserving: even he reads his stage structure off the content rather than declaring it.

### 4.2 The 500-year cat event

Tips [20], confirmed by `blackcat_extend.json`: `evt_blackcat_1` (Stray Cat) requires `g.time >= 182500`, i.e. 182,500 days = exactly 500 in-game years. The choice is irreversible and asymmetric:

- **Send Away (送离)**: `space.max +20`, `money +2000`, `age +3650` (ten years). A one-off payment.
- **Adopt (收养)**: `space.max +10` and the whole chain — Pet the Cat (摸猫) as a clicker producing Cat Power (猫力), 8 Rapid Petting and 8 Cat Power Expansion upgrades, 11 furniture pieces (nests raising Cat Power rate, motivators converting it to Electrical Energy at `elect.rate +4` to `+9`, Fortune Cat (招财之猫) at `money.rate +1`, Cat Domain (猫之领) granting `extra_space`), then Force of 100,000 Cats (十万猫之力) at 100,000 Cat Power, which unlocks three spells and, with Return to Mystery (归玄), Cat Power Dominator Fist (猫力霸拳) at 450-550 damage — exactly the number the wiki quotes — plus a boss dungeon, "500 Years of Battle: Destiny of the Dominator".

Send Away is a trap that pays 2,000 coins to delete a whole content module. Only the wiki says so. Both branches do carry `warn: true`, but that flag selects one global string — `WARN_MSG = "This action is irreversible. Continue? (Recommended: export save backup first)"` — shared by all 112 warned records in the game, so the confirmation never names what is being given up. That global string is also where the wiki's recurring "export your save first" advice comes from.

### 4.3 The officialdom side branch

The branch is a separate module (`officialdom.json` + `officialdom_ex.json`, 151 records) with its own currency, Court Influence (朝廷影响力 / `off_influence`). Entry is through the Stranger encounter in the Tianlaan Capital: `enc_guodu_1` gives `off_hide_1: 0.02` per meeting, so **50 meetings** buys exactly one Officialdom Entry Scroll — the wiki's number is arithmetic, not folklore. The branch then runs 9 ranks: Regional Inspector is free once you are in, and the eight above it gate on rising Court Influence (80 → 150 → 250 → 550 → 900 → 1,500 → 2,600 → 4,000). At each rank you choose how to earn: Official Duties (公务工作), Submit Tribute (上贡礼品), or Corruption and Bribery (贪污受贿), each with its own upgrade triplet. At 34,900 influence `off_ex_start` ("One Afternoon") opens the extension, where the one-shot Crown Prince (太子) / General (将军) choice sits, ending in Stardust Parasite (星尘寄生): a level-38 gold weapon with 3 enchant slots and damage `46~68` — again exactly the wiki's figure.

The wiki's "export your save before you start" is the only warning anywhere that this branch is a long, exclusive commitment.

### 4.4 Conquest rules

Tips [10], [11] and [14] describe three separate rules the UI shows only as numbers:

- **Workforce → success chance, Processing Power → cap.** Combat effectiveness is `zdxn = f_power*2.5 + f_power*(shiqi*0.65 + zhuzhidu*0.75 − (yanzhandu/alculation)*yanzhandu)/100`, over Combat Rating (战斗评级 / `f_power`), Morale (士气), Organization (组织度) and War Weariness (厌战度). Processing Power (计算力 / `alculation`) appears only in the denominator of the war-weariness penalty, so more of it raises the ceiling on how much you can hold; Workforce is what the attack costs (`acost.human_power`, 40 for a Small Town up to 4,000 for a survey station), hence the player-facing reading. Success chance is then `100%` if `zdxn ≥ 6 × power`, else `((zdxn/power) − 0.2) × 100` when outgunned, else `(1 − (power/2)/zdxn) × 100`.
- **Combat Rating > target defence is a hard gate.** The attack button is disabled when `f_power < it.power`. The wiki's phrasing — "attacking first requires Combat Rating greater than the target's defence" — is the rule; nothing in the UI says it, you just get a dead button.
- **The fractional cap.** Occupation is capped by `it.val >= Math.floor(it.max)`, and the progress bar renders `Math.floor(val) / Math.floor(max)`. A cap raised to a fractional value by mods therefore stalls one short of the number the player expects. The wiki's "it may actually be six-point-something" is the right diagnosis of a floor-vs-display mismatch. *[INFERENCE: the specific 6/7 reading depends on the mods in that player's run; the floor behaviour is what the code shows.]*

### 4.5 Dungeon-count unlocks for market purchases

Tips [7]. In the shipped data exactly **two** market entries are gated on a clear count: `market_buy_cold_core` (Buy Frozen Core) on `g.cold_3 >= 10`, the Frozen Cave, which is the wiki's example verbatim; and `market_buy_qiyiyeti` (Buy Strange Liquid) on `g.qiyi_1 >= 10`. No other record anywhere in the data gates on more than one clear of a dungeon or locale.

The related idiom is different and more common: a locale yields a counter resource per run and the counter gates the next step. Distant Marsh Edge (远沼边缘) says so in its own `desc`: "each completed adventure gives 1 Distant Marsh survey data; 10 survey data unlocks the next step". The wiki flattens both into one player-facing rule — "explore enough times and the market opens" — which is the right level of abstraction for a player and the wrong one for an implementer.

### 4.6 The Enter-key autoclick

Tips [H3]: click a repeat-click button once, then hold Enter, and the browser's key-repeat fires the focused button at roughly 20 clicks/second. This is browser default behaviour on a focused `<button>`, not a game feature — there is no autoclick code and no cooldown on the clicker actions, so the game's manual-clicking content (Pet the Cat at `blackcat_power: 1` per click, up to 100,000) is effectively balanced around a trick that only the wiki documents. *[INFERENCE: the ~20/s figure is the contributor's measurement; it depends on the OS key-repeat rate.]*

### 4.7 Exclusive class picks, with numbers

Tips [4] and [15] are the only place the cost of an exclusive choice is stated as a total. Both check out exactly against `classes.json`, because the wiki's figures are the *cumulative* chain, not the final class:

| Chain | Classes and their results | Wiki total | Verified |
|---|---|---|---|
| Seeker → Professor → Sea of Knowledge | `qsz` +30 Processing Power; `jiaoshou` +400; `manhaiqiushi` +2,500 PP and +10 command cap | 2,930 PP, 10 command | ✅ 30+400+2,500 |
| Seeker → Professor → Humanities Apprentice | `qsz` +30; `jiaoshou` +400; `renwenxuetu` +1,000 PP and +1,000 Workforce | 1,430 PP, 1,000 Workforce | ✅ 30+400+1,000 |
| Commander → Guide → Judgment Light | `zhangguan` +50 Workforce; `yindaozhe` +600; `caikuang` +1,000 Workforce, +15 command cap, +5 True Soul cap | 1,650 Workforce, 15 command, 5 True Soul | ✅ 50+600+1,000 |
| Commander → Guide → Tower Light | `zhangguan` +50; `yindaozhe` +600; `taguang` +2,000 Workforce | 2,650 Workforce | ✅ 50+600+2,000 |
| Officialdom extension (once) | `off_ex_prince_1` Crown Prince: +100 PP, +500 Court Influence · `off_ex_general_1` General: +300 Workforce, +500 Court Influence; each `disable`s the other, both `warn` | as stated | ✅ |

Seeker and Commander are mutually exclusive (`disable` on each other) at the very first fork, and that single early click decides whether the run is compute-shaped or workforce-shaped for the rest of its length. The Scholar fork (Origin / Five Elements / Sunset) is three-way exclusive and additionally locks out `murder_pl`, `huibang`, `xueyuantouqie`, `nolight_mishu` and `nolight_core` for the first two — which is what "and commit no murder" means. In the shipped data all three Scholars pay nearly the same (`ganwu.rate` 1-2, `zero_crystal.rate` 0.05-0.1), so the wiki is right that the choice is about unbuilt future content, and right to say so out loud.

---

## 5. External links

Every outbound link in the whole wiki, with where it appears:

| Link | Where | What it is |
|---|---|---|
| https://mostlai.github.io/HD-TEST | 欢迎 | Primary game mirror (GitHub Pages, same `mostlai` account that hosts the wiki repo) |
| https://static.oschina.net/trytry/HD-TEST/ | 筑基小贴士 | Second mirror on OSChina, for players in mainland China |
| https://www.bilibili.com/read/readlist/rl849685 | 筑基小贴士 | Bilibili reading list: the author's own detailed introduction to the game, explicitly "not a walkthrough". The longest prose explanation of the game that exists |
| QQ group 281738137 | 欢迎, and in the game's own 快速上手 ("Quick Start") task description, which the generator reproduced | The community. The Quick Start text invites players to "join QQ group 281738137 and confront the author face to face" |
| https://afdian.com/a/pldada | 欢迎 | Afdian (爱发电), Chinese Patreon equivalent — the author's patronage page |
| Google AdSense `ca-pub-1410792404041007` | `$:/tags/RawMarkup`, plus `<amp-ad>` slots `1617286345` and `6674070279` inline in 欢迎 and 筑基小贴士 | Ads, inlined into page source rather than injected by the theme, which is why they survive in the tiddler dump |
| https://tw-cpl.netlify.app/ | 安装 (fishing manual) | Chinese TiddlyWiki community plugin library — the source of the echarts and pinyin-search plugins |
| https://github.com/oflg/fishing/issues, img.shields.io, supermemo.org ×2, supermemo.guru ×2, bramchen.github.io, docs.ankiweb.net | fishing-manual orphans | Not this wiki's content |

---

## Lowbridge: copy / beat / avoid

Tagged in the style of `../arcanum-reference/12-design-rules.md`. "Copy" means adopt the shape; "beat" means the artefact is weak here and Lowbridge should do better; "avoid" means do not do this at all.

1. **Generate a per-record page with reverse links from the content JSON.** *copy.* The generated pages are the wiki's real value, and every edge they publish is one `scripts/validate.ts` already walks: it reads `require`/`need` for gates, `modifierMaps` (`mod`, `perLevel`, `held`, `at`, `every`) for standing modifiers, and `effectMaps` (`buy`, `cost`, `run`, `effect`, `result`, `onStart`, `strain`) for spending. Inverting those maps gives *prerequisite-of*, *costs*, *results*, *mods*, *effects*, *max-affected-by*, *rate-affected-by (+/−)* and *obtainable-from* for free — the same nine sections HD-WIKI emits, from a validator Lowbridge already runs on every change. A `bun run validate --emit-wiki` that writes one Markdown file per record would be a few dozen lines on top of what exists.
2. **Publish the raw gate expression next to the rendered one.** *copy.* HD-WIKI prints `解锁需求(JSON):g.reading>=3...` under the human-readable requirement and explains why: it lets a reader search for records the UI has not revealed. For Lowbridge this is the content-author's debugging view and the reader's escape hatch in one field, at zero cost.
3. **Split *rate raised by* from *rate lowered by*.** *copy.* The older HD-WIKI template had one combined "rate is affected by" section; the current one splits positive and negative into different callout types (`tip` vs `error`). With 107 positive and 43 negative sources across the wiki, the split is what makes the drains legible. Lowbridge's `X.mod.Y` patching has exactly the same shape.
4. **Keep the reverse sections even when empty.** *copy.* All 2,256 current-template pages emit all five reverse-link sections, and most are blank — only 232 records have anything raising their max, only 43 have anything lowering their rate. A consistent skeleton makes "nothing feeds this" a readable statement rather than an absence, and it keeps the pages diffable across content changes. (HD-WIKI does the opposite for the four *forward* sections, which it omits when the field is absent; that asymmetry is the right call, since a record's own fields are visible in the data anyway.)
5. **Say the stage structure out loud, in the content.** *copy.* The six-stage reading (§4.1) is the most valuable sentence on the wiki and it exists only because one player wrote it down. Lowbridge already has named chapters in `src/data/*.json` and pacing gates in `scripts/validate.ts`; it should assert them in the data (a `chapter` or `stage` field, or at minimum a validator-enforced list of stage-opening ids) so the structure is checkable rather than folklore.
6. **Name what an irreversible choice closes, in the confirmation.** *beat.* The cat chain (§4.2) and the Seeker/Commander fork (§4.7) each delete a content branch permanently. The game does flag them — 112 records carry `warn: true` — but the flag selects one global string that says only "This action is irreversible. Continue?", so the player learns what they gave up from the wiki or not at all. Lowbridge's vocabulary has `warn` and `needtext`; the warning should carry per-record text naming the branch it closes.
7. **Reverse-link graph as a navigation surface.** *copy, at small scale.* The 路线图 sidebar is one line of Echarts over the wiki's own links and gives a one-hop dependency map of whatever you are reading. Lowbridge's 109 records would fit a whole-graph view; `scripts/routes.ts` already computes reachability by playing the engine, so the node set and edge set are in hand.
8. **Do not hand-stub records as documentation.** *avoid.* 296 of the 360 hand-written pages are 17-character-median stubs recording one requirement, written while the author was building each system, and 22% of them no longer match any live record. They were obsolete the moment the generator ran. Design notes belong in `design/`; record facts belong to the generator.
9. **Do not leave the generator's first output unregenerated.** *avoid.* 82 pages still use the pre-callout `<fieldset>` template with no *obtainable-from* section. A generated artefact that is only partly regenerated is worse than one that is not generated at all, because readers cannot tell which pages are stale. If Lowbridge emits a wiki, the emit must be all-or-nothing and gated in CI like `bun run validate`.
10. **Do not inline monetisation or third-party chrome into content.** *avoid.* The ad markup sits inside the landing page and the tips page, so it travels in every export, every dump and every translation of them — §2.1 and §2.2 above both had to strip it by hand. Chrome belongs in the template; keep content free of anything that is not content.
11. **Document the mechanics the engine implies but never states.** *copy.* Conquest's "Combat Rating must exceed defence" (a disabled button), the floor-vs-display cap mismatch, the 2%-per-encounter accrual the FAQ misread as a rare drop, and the Enter-key autoclick the clicker content is implicitly balanced around (§4.4, §4.6) are all invisible in the UI and absent from the data. Lowbridge's equivalents — the fixed-at-start fight snapshot, the one-slot-plus-six-waiting runner, `recompute`'s fixed point — should be stated in the player-facing tooltip or the reference, not left to be reverse-engineered.
