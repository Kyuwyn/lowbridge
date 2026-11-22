# 03: Engine and content model

Sources: demo source v1.5.5 (`GameState.tsx`, `generic/DataStore.tsx`, `action/Action.tsx`, `spells/Spell.tsx`, `transformation/Transformation.tsx`, `Flag.tsx`, `events/EventMessageBuilder.tsx`, `timetick/*`, `components/main/GameTickProcessor.tsx`, `SaveData.tsx`); the modding SDK's `modding-decs/` and `docs/concepts.md` (v1.8.x, MIT); counts from `data-census.md` §1. Everything here is how the game is built; nothing in it may be copied into `src/`.

The headline: **MR2's content is code.** Every spell, item, enemy, storyline and piece of furniture is a TypeScript class or a builder call, registered into an in-memory store at load. Arcanum and Hundred Days are the opposite (one JSON vocabulary interpreted by one engine, Arcanum rule 1). MR2 shows what the code route buys and what it costs, written by one developer who shipped 4,646 strings and 127 storylines in about two years.

## 1. State in layers

`GameState` has five top-level fields, and **the reset layer is declared by where a field lives**: `[v1.5.5 src; concepts.md]`

| Layer | Reset by | Holds (examples) |
|---|---|---|
| `temp` | every load and every retirement; never saved | caches (transformation results, flags, element levels, combat stats, resource caps, spell costs) |
| `run` | Retirement | resources, furniture, land bought, run flags, element exp, inventory and equipment, exploration state, temporary effects, primary/secondary element, class, wizard rule progress, rituals, spellcrafts, boosts, current challenge |
| `world` | New Game+ (new world) | world flags (storylines), MPLs, max furniture counts, unlocked elements, quickbars, synchro boards, boon levels, difficulty, endings this world, favourite spells |
| `global` | never | save version and platform, total time, NG+ count and boon points, **saved wizard strategies**, spellcraft loadouts, Bestiary knowledge (which enemies drop what), every item ever obtained, max element level ever, cheat flag |
| `options` | never | UI settings |

Flags show the layering most clearly. `setFlag(x)` writes `run.flags[x]` and also `world.flags["ever_" + x]`, so "has this ever happened in this world" is free for every flag (`hasEverHadFlag`). A storyline sets its `_completed`, `_bonus_active` and `_hint_revealed` flags in both run and world. On retirement, `run.newFlagsOnRetirement` are copied into world flags: this is how "the bonus only applies after you retire" is implemented.

## 2. Records are singletons in DataStores

Each content kind has a `DataStore<T>`: `register(value)` keyed by `value.getId()`, `getById`, `getAll`. The SDK's `MR2Globals` exposes about 25 such stores plus 16 listener registries (`Actions`, `Spells`, `Items`, `Enemies`, `DungeonFloors`, `Storylines`, `GameEvents`, `Buildings`, `Enhancements`, `Rituals`, `Spellcrafts`, `SynchroBonuses`, `Familiars`, `TemporaryEffects`, `Challenges`, `CombatClasses` …). Records are class instances with methods, not data; a mod overrides behaviour by replacing a method on the singleton. Demo counts: 63 temporary-effect classes, 49 equipment recipes, 45 equippable items, 30 enhancements, 27 combat spells, 26 enemies, 14 furniture. `[v1.5.5 src; SDK]`

Identity is a stable string id per record (`"fireball"`, `"manaSpout"`, `"storyline_posterity_completed"`), and saves store ids, so renames do not break saves. Display names are separate and translated.

## 3. Actions, named effects and transformations

**Action.** The base class of anything pressable: `getId`, `getDisplayName`, `getCost → {resources, items}`, `doAction`, `isVisible`, `getDisplayDescription`, `getDisplayEffect`, and `getAreas` (where it appears, `01` §3). Spells, enhancements, boosts and furniture purchases are all Actions. `isEnabled` checks visibility, cooldown, affordability and caps; an Action whose cost exceeds the resource's *cap* shows as unaffordable rather than as waiting (rule 18's "bills sized to caps", enforced).

**Named effects.** An Action declares `getBaseActionEffects()`: a record of named numbers, each `{value, tags, unit}`. Fireball's are `average: 100 :attack:` (tag `ActionMagnitude`) and `variance: 10`. At use, each effect is run through the transformation system with the action's own tags (its id, `Spell`, its element, `AttackSpell` …) plus the effect's tags. Any item, storyline, class or rank can therefore change *one number of one record* by tag, without the record knowing.

**Transformations** are the single modifier mechanism. `registerTransformation(tagSets, id, displayName, type, fn)` registers a function; `applyTransformations(tags, state, base, params)` runs every registered transformation whose tag set is a subset of the call's tags, in a fixed order: **Addition → Power → Multiplier → Override**. `TransformationTags` has 109 named tags (`Production`, `Cap`, `Cost`, `CostScale`, `ExpGain`, `Study`, `GameSpeed`, `Loot`, `ExplorationBossRequirement`, `WizardAmount`, `AutocastPointsProduction`, `CorruptionCap`, `SynchroGridMax`, `ItemQualityLevelDelta` …), and resources, elements, combat stats and record ids are tags too. The demo registers 202 transformations. `explainTransformationsText` returns the same computation as a readable breakdown, which every tooltip shows (`01` §5). `[v1.5.5 src]`

This is Arcanum's `X.mod.Y` (rule 4) and resource mods (rule 5) generalised into one tagged pipeline with a defined order. It is the most transferable idea in the codebase, and it can be expressed as data (a modifier record with a tag set, a type and an amount) without the code-as-content cost.

## 4. Listeners instead of requirement expressions

There is no `require`/`need` field. Things happen because a listener notices the state: `addGameStateListener` (56 in the demo; runs on every change, the developer's docs say to avoid it where a narrower hook exists), `registerTimeTickListener` (23), `addEnemyDeathListener` (18), `LevelUpListeners`, `SetFlagListeners`, retirement and post-retirement listeners (7 and 20), spell-cast, equipment-change, building-amount, enhancement-purchase listeners, and more. Visibility is a method (`isVisible(state)`) and the "why not yet" text is hand-written per record, or the event tells you after the fact.

Consequence: there is no static reachability check, and no list of what a record needs. The Help and storyline hints carry that load for the player; the developer carries it in his head. The wiki authors had to reconstruct trigger conditions by hand and still list some as "???" (`02` §5).

## 5. The event DSL

Storylines, quests and random events are built with a fluent builder (64 `buildEvent` calls in the demo, 29 storylines registered):

`buildEvent(id, title, [tags]) → .setStorylineIds(…) → .message(text) → .option(label, {transform, isEnabled}, gotoTag) → .option("Maybe later") → .end() → .message(…).tag("end").end() → .build()`

Options are code closures (`removeFromInventory(paper, 20)`, `storyline.complete(state)`); `isEnabled` is a closure; triggering is a separate listener; the storyline's effect is yet another `registerTransformation`. One storyline, *Location Encyclopedia*, spans an event with two pages, a trigger listener, an enemy-death listener, a tally helper and a transformation (−35 % explorations per tallied retirement): about 190 lines of TypeScript for one permanent bonus. Event pages render the same Markdown dialect as tooltips and support "try again" branches and history. `[v1.5.5 src]`

## 6. Time

`[v1.5.5 src: GameTickProcessor.tsx, TimeTick.tsx, TimePieces.tsx]`

The frame loop runs at the target FPS and measures real time since the last processed tick. What happens depends on the gap:

| Gap | Handling |
|---|---|
| ≤ 30 s | **Live**: process in ticks of at least 0.1 game-seconds, at most 10 ticks per frame. |
| 30 s – 600 s | **Warp**: queue the gap, then simulate it in 0.25-second ticks behind a progress bar (finer when game speed > 1, capped at ÷5), yielding a frame every 100 ticks. |
| > 600 s (or > 10 s if the player opted in) | **Bank**: do not simulate. Grant **Time Pieces** = seconds away (capped at 48 h, transformable by `OfflineTimePieceGain`) and show an "Offline Progress" event. |

Time Pieces are then spent from the left menu to run the game at **2×** (3 Time Pieces per extra second) or **5×** (4 per extra second); they persist across worlds. Game speed is a transformation (`GameSpeed`), so *Time Contraction* and similar spells stack with it. Each time-tick listener receives `(state, elapsed, isWarp)`; some behave differently in warp. Compare Arcanum rule 25 (offline bank spent deliberately) and Hundred Days rule 43 (a clamp that throws time away): MR2 simulates short gaps exactly and banks long ones as a spendable resource, which keeps the simulation honest and offline catch-up cheap.

## 7. Caching

The backend recomputes heavily and the UI renders "dozens of times a second" (`concepts.md`), so values are cached at three lifetimes: per tick (`applyTransformationsCached`, `cacheByTickCount`), per retirement (`applyTransformationsPermaCached`), and indefinitely until cleared (`cacheIndefinitely`). Invalidation is manual: code that changes a cached input must clear the right cache. The developer's own modding guide calls this "likely the hardest part of developing MR2 mods". The patch notes agree: 1.2.7 alone lists six caching fixes ("Fix some 'Enchant X' spells not correctly showing up", "Fix some stats' cache not being cleared correctly … when buffs or debuffs are set, expire, change or are cleared"), and caching fixes appear in 1.2.12, 1.3.2 (four) and 1.3.7. `[patch notes]`

## 8. Saves

The whole `GameState` minus `temp` is JSON-stringified into one storage key (`MR2.GameState`); export is gzip then base64. Compatibility is a hand-written `makeCompatible` function plus a `SaveDataCompatibilityTransforms` registry that moves fields between layers as the design changed (autocast strategies moved from `run` to `global`; favourite spells from `run` to `world`; max element levels from `world` to `global`). Patch 1.3.7 began embedding error information in saves exported from the crash screen; 1.6.3 added loading a backup save after an error; 1.8.2 added multiple save slots. A save made with cheats is flagged (`global.hasCheated`). Contrast Arcanum rule 9 (delta save, everything derivable recomputed): MR2 saves everything, and survives design changes only through migrations. `[v1.5.5 src; patch notes]`

## 9. Strings and translation

Every user-visible string goes through `t()` with the English text as the key, `{{param}}` placeholders, `:icon:` tokens and the `^shown^<tooltip>` syntax. The base file is published for crowd translation: 4,646 strings, 93,786 words at v1.8.6, about 44 % of which already appear in the v1.5.5 demo (the demo covers the first 4–8 hours). The developer could not afford professional translation ("more than 4000+ strings, estimating 70K+ words"); the effort moved to Localizor. `[strings; launch FAQ; data-census.md §2]`

## 10. Modding

Patch 1.8.2 added "experimental modding support" for the Steam build: a mod is a JS bundle with `preload(MR2)` (before the game loads; used to add an element or a resource so that "every element" effects include it) and `load(MR2)` (after). The `MR2Globals` object exposes the stores, listener registries, transformation functions, overridable core functions (including `applyTransformations` itself) and cache-clearing helpers. Because records are singletons, a mod changes content by replacing methods. The developer's mods use exactly this: *MR2 – Rebalanced* replaces `applyTransformations` to compress late-game scaling (`07` §3); *Fungal Research* adds a thirteenth element. `[SDK; mods]`

## 11. What content-as-code bought and cost

Bought:
- Any record can do anything: enemies with scripted move lists (`05` §3), storylines with branching pages and riddle triggers, furniture with custom formulas.
- Named effects plus tagged transformations made cross-cutting bonuses cheap, and tooltips explain every number.
- Modding came almost free once the stores were exposed.

Cost:
- No data validator is possible; reachability, "can this be done", and "what does this need" live only in code paths. The wiki's 127 storyline pages had to be reverse-engineered by players.
- Manual cache invalidation became the main bug class of the first twelve weeks (§7).
- Every balance change is a code change and a new build; the 1.2–1.3 patch notes carry dozens of single-number edits (`07` §2).
- Content cannot be generated, diffed or censused except by parsing source, which is how `tools/census.py` had to be written.

For Lowbridge the split is clear: keep Arcanum's data vocabulary and `bun run validate` (rules 1, 51, 55), and adopt MR2's **named effects + ordered tagged modifiers + explainable totals** as data (rules 96–97).
