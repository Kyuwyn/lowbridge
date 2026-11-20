# Third-Party Review — Design v2 (`MECHANICS-STUDY.md`, `REVIEW-RESPONSE-2026-10-18.md`, `DESIGN-PLAN-2026-10-18.md`)

**Date:** 18 October 2026
**Staffing assumption:** One solo developer-author handling engine, data authoring, UI, and balance validation.
**Conventions:** **[F]** = verifiable fact from the attached documents (or flagged where unverified without full Arcanum runtime source); **[I]** = interpretation/analysis; **[R]** = concrete recommendation.

---

## Overall Verdicts

### A. `MECHANICS-STUDY.md` — **Strong empirical scan, flawed central premise**
- **[F]** The study scanned 998 core records plus `learning`, `swordplay`, `extraaction`, and `classline/shadow`, timed the 0.12.12.9 opening, and cross-referenced the 0.12.0.0 wiki (`MECHANICS-STUDY.md §Sources and method`).
- **[I]** Its headline claim—that 59 of 60 skills start at cap 0 and cannot be trained until a class or record raises `<skill>.max`—mistakes a **missing JSON property** (`"max"` omitted in `skills.json`) for a **zero cap**. In Arcanum, skills default to a base cap of **5** once unlocked/purchased (explicitly stated in Arcanum's own `hallgloss.json` glossary and proven by the study's own opening trace: `apprentice` raises zero skill caps, yet the player immediately trains `lore` to 4 to qualify for T0 classes).
- **[I]** Because it only scanned one classline module (`shadow.json`), it over-generalizes necromancy's deep, morality-gated, self-re-keying tree to all classlines, while missing how Arcanum's action economy (`stamina`/`mana` rates), `need` vs `require` visibility split, and noncombat Locale stressors actually create moment-to-moment play.

### B. `REVIEW-RESPONSE-2026-10-18.md` — **Right about the ledger symptom, over-corrects on the cure**
- **[F]** The review cites 767 `Qnn` references and 365 "remains open" hedges across 33 documents, and notes that `OPENING-DRAFT.md` has zero numbers with units, zero named NPCs, and zero caps (`REVIEW-RESPONSE §Overall assessment`, `§1`).
- **[I]** Calling the original package an "interview ledger, not a design" is fair and earned by the quoted evidence. However, blaming nearly every weakness on ADR 0013's refusal of a numeric cap formula (`REVIEW-RESPONSE §Overall assessment`, `§1`) is a projection of the study's `max: 0` misreading. The original design's real failure was **refusing to commit to concrete numbers, rates, and state transitions anywhere**, turning every progression beat into bespoke prose scenes. Furthermore, the review attacks several deliberate design choices (narrative pacing, non-locking early tasks, open-entry Golden Cauldron) as accidental omissions simply because they diverge from Arcanum.

### C. `DESIGN-PLAN-2026-10-18.md` — **Testable and concrete, but trades checklist drift for a linear cap-staircase with broken slice math**
- **[F]** The plan compresses the rules to one page (Part A), defines an 8-breakthrough / 6-line skeleton (Part B), specifies a 25–40 minute first slice with exact records (Part C), adopts Arcanum's expression grammar (Part D), and defines automated graph validation (Part E).
- **[I]** Part C is a huge step forward in testability, and Part E's static reachability validator is the single best addition in the package. However, Part A's "every capability starts at cap 0" plus Part C's `1/1` and `2/2` micro-caps turn the opening into a rigid, single-file to-do list with dead minutes, a false 3-of-5 choice set, and an unreachable `channel_return` record. Worse, Part B's class cap table (B.3) fails its own Part B.2 breakthrough gate (`cap ≥ 5` at B4) for half the roster, and keeping ADR 0002's "bank survives retry" rule alongside a 1-hour bank cap creates a degenerate suicide-farming loop.

---

## Responses to the 7 Central Claims & 9 Review Questions

### 1. Is the reading of Arcanum right? (Challenging Claim 1 & Question 1)
- **[F — Unverifiable without `src/items/skill.js`, but contradicted by internal evidence]** Claim 1 asserts that 59 of 60 skills start at cap 0 and are untrainable until a class or record raises `<skill>.max`, and that `chronomancy` (`max: 1`) is the sole exception (`MECHANICS-STUDY.md §1`).
- **[F]** In `MECHANICS-STUDY.md §4`, all five T0 classes require `g.lore >= 4`. Yet before T0, the only class taken is `apprentice` (which raises `research.max: 10` and **zero** skill caps), and jobs require skills (`animals`, `herbalism`, `crafting >= 5`, `scribescroll`) that themselves would be at cap 0 under the reviewer's rule.
- **[I]** Why did `chronomancy` have `"max": 1` in `skills.json`? Because in Arcanum, omitting `"max"` on a skill record defaults `max` to **5** in the Skill class constructor; `chronomancy` has `"max": 1` to *restrict* it below 5, not to make it the only trainable skill! In Arcanum, skills are gated at entry by **`require` / `need` + a `buy` cost** (in research/arcana + furniture "sources" like `plantsource`), give you a 0→5 training runway immediately upon purchase, and only hit a hard cap at 5. Classes and upgrades raise caps *above 5* (to 10, 15, 25, 35) to gate mid/late tiers.
- **[I]** **Where the study over-generalizes:**
  1. **From `shadow.json` to all lines:** Shadow/Necromancy is Arcanum's most self-contained, morality-gated (`evil2`) subsystem. Other lines (e.g., elemental lores, crafting, potions, swordplay) cross-pollinate heavily with generic skills and furniture rather than living in isolated 12-class silos.
  2. **From the 3-minute Waif tutorial to realm pacing:** Reaching `Apprentice` in 3 minutes is unlocking the *UI tabs* (`Home`, `Skills`, `Quests`), not completing a realm. The actual first tier-up (`Neophyte` → `T0 Graduand Magus`) requires 100–225 max research, `lore >= 4`, clearing Leaky Cellar (`pestcontrol`), and 4 of 4 T0 quests—closer to 30–60+ minutes, not 3 minutes.
- **[I]** **Arcanum qualities the study missed or under-weighed that the plan needs:**
  1. **Dual-visibility gating (`require` = visible, `need` = actionable):** Mentioned in Part D's schema, but ignored in Part C's design. Arcanum creates anticipation by revealing a record via `require` while blocking execution via `need` (with `needtext` explaining the missing workstation/source).
  2. **Continuous rate vs. drain tension:** In Arcanum, training a skill or running an errand drains `stamina` or `mana`/`elements` per second (`run`), balanced against passive regeneration (`rate`) from homes and furniture. Because the original design dropped stamina/energy (accepted), the plan has **no continuous rate economy**—making `Qi +0.1/min` on the Cottage (Part B.5) almost meaningless.
  3. **Locale stressors (noncombat hazards):** Arcanum's noncombat `locales` use 5 stress bars (`befuddlement`, `unease`, `weariness`, etc.) that act as noncombat HP. For a game where combat is optional and exploration/trials are central, stressor gauges are the exact mechanical tool needed for expeditions and Cloudwell.
  4. **Morality neutrality as an active path:** Arcanum's T2 quest `Alignment Bias` (`q_t2morality`) explicitly supports `balanced1` and `detached1` alongside `good2` and `evil2`.
  5. **Automation as progression (`Goals`, `Hobbies`, `extraaction`):** Arcanum rewards advancement by letting the player queue Goals and background Hobbies—directly relevant to the original design's "configured routines" promise.

### 2. Is the review fair to the original design? (Challenging Claims 2, 5, 6, 7 & Question 2)
- **[F]** The review proves from the text that the original package had 767 `Qnn` references, 365 "remains open" hedges, stale three-path/retraining text in `BRIEF.md` and `GLOSSARY.md`, and zero numeric parameters in `OPENING-DRAFT.md` (`REVIEW-RESPONSE §Overall assessment`, `§1`, `§11`).
- **[I]** **Where the review is fair:**
  - The "interview ledger, not a design" verdict is completely justified. Answering 123 questions without ever writing a stat block or resource table produced a sprawling legal contract of edge-case guarantees ("qualifying earlier work counts", "requires no further mandatory practice tier") with no game loop underneath.
  - Calling out that classes had only prose "benefit directions" and three one-shot beats (teaching → demonstration → one optional application) accurately identifies why the between-breakthrough stretch would feel empty (`REVIEW-RESPONSE §2`, `§3`).
- **[I]** **Where the review is unfair (mistaking deliberate choices for omissions):**
  - **ADR 0013 (`REVIEW-RESPONSE §1`):** ADR 0013's disclaimer ("does not require a numerical knowledge-point currency, resource cap formula, or universal activity count") was pushing back against turning discovery into a generic XP currency (`Insight Points`) or a global formula. It did *not* forbid skills having levels and maxes; the review uses ADR 0013 as a scapegoat.
  - **Tempo (`REVIEW-RESPONSE §7`, Claim 6):** The original design explicitly chose a slower, visit-driven pace ("several weeks", "two or three short visits daily", decisions every 8–12 activity hours in Q122) supported by an offline time bank. Comparing an 8-activity-hour foundation (which can be accelerated via banked time) to 3 real-time minutes of clicking `Clean Stables` conflates active-clicker tutorial pacing with idle-visit campaign pacing.
  - **Locks (`REVIEW-RESPONSE §5`, Claim 5):** The original design deliberately kept the village and earlier opportunities open (`ADR 0006`, `ADR 0012`) so returning to familiar places with new understanding would reveal new uses. Arcanum locks `Clean Stables` because you literally move out of the stable into the Master's house; arbitrarily locking village jobs while the cultivator *still lives in the village* (B1–B2) violates the fiction.
  - **Morality (`REVIEW-RESPONSE §8`, Claim 7):** Dropping morality in a game with 6 already-accepted mastery lines was sound scope control, not a fatal flaw. Adding a 7th axis (`Karma`) in Part A.10 while deferring all its content to B5+ is pure scope bloat.

### 3. Does Part A's machine produce the Arcanum feeling, or a cap-grind? (Question 3)
- **[I]** **As written in Part A + Part C, it will play as a cap-grind / to-do list with numbers, not Arcanum discovery.**
- **[I]** Why? In Arcanum, unlocking a skill (say, `Herbalism` at cap 5) gives you several levels of continuous training where each level passively modifies your rates (`herbs.max`, `research.max`) and unlocks new tasks at intermediate levels (e.g., level 3 unlocks `Nature Lore`) *before* you hit the cap of 5. In Part A.1 + Part C, caps start at 0 and are raised in tiny increments of `+1` or `+2` (`Circulation 0→1`, `Qi Sense 0→2`, `Lore 0→2`), and Part C.6 specifies: *"families as `level/cap` with 'what raises this' on hover. Every cap hit posts one log line naming the raiser if it is visible."*
- **[I]** When a cap is `1` or `2` and the UI explicitly tells you which button raises it to `2` or `3`, there is no continuous growth curve and no mystery—every cap is just a boolean quest flag disguised as an integer (`0/1` → click raiser → `1/1` → train once → `1/2` → click raiser).

### 4. Walkthrough of Part C, the first slice (Question 4)
Walking `DESIGN-PLAN-2026-10-18.md §Part C` from tick 0 as a skeptical player exposes six concrete mechanical defects:

1. **[F/I] Forced linear opening & dead minutes (Minutes 0–7):**
   - **Min 0–2:** Only `mill_work` exists (30 s, +3 coin). You *must* run it 4 times (120 s) to hit `12/12` coin, buy `coin_pouch` (−12 coin, coin now 0), then run `mill_work` 2 more times (60 s) to afford `jade_slip` (6 coin). That is 3 minutes of watching a single 30-second bar fill 6 times with zero choices.
   - **Min 3–5:** After buying `jade_slip`, you only have `breath_gathering` (60 s, `qi +1, qisense.exp +1`). Assuming 1 exp = 1 level (Part C never defines the exp-to-level curve!), reaching `Qi Sense 2/2` takes 2 minutes, during which nothing else is unlocked (`gather_herbs` needs `Qi Sense >= 1`, `channel_observe` needs `Qi Sense >= 1`, `fernhollow_observe` needs `Qi Sense >= 2`, and `lore` is still `0/2` with **no task that trains Lore**!).
2. **[F] Unreachable record — `shu_reading`, `field_kit`, `herb_rack`, and `fragment_notes` are permanently deadlocked on `Lore`:**
   - Look at `Part C.3`:
     - `jade_slip` sets `lore.max +2` (so Lore is `0/2`).
     - What task grants `lore.exp`? **Only `fragment_notes` ("Copy and study the slip", `lore.exp +1`).**
     - What does `fragment_notes` require? **`shu_reading`.**
     - What does `shu_reading` require? **`lore >= 2, 5 herbs`.**
     - **Deadlock:** You cannot reach `lore >= 1` (needed for `field_kit` and `herb_rack`) or `lore >= 2` (needed for `shu_reading`) because the only task that trains Lore (`fragment_notes`) is gated behind `shu_reading` (`lore >= 2`)!
     - Even if `jade_slip` or `breath_gathering` were meant to give `lore.exp`, the table in `C.3` omits it. Part E.1's reachability script would fail on Part C immediately.
3. **[F] Unreachable / post-Foundation record — `channel_return`:**
   - `channel_return` ("Return to the channel with the arrangement", `C.3 Sites`) requires `channel_arrangement, circulation >= 1` and gives `circulation.max +1; stone +4`.
   - On the Channel route, `channel_arrangement` raises `circulation.max` from `0→1`, and `channel_exercise` trains `circulation` to `1/1`. So `channel_return` only unlocks *after* you have already built `channel_arrangement` (which needed 4 stone, requiring you to run `channel_observe` twice first!) and trained `circulation` to 1—at which point Foundation is already unlocked and ready. Worse, why would you "return to the channel with the arrangement" after setting the stones into your home floor (`channel_arrangement`: "Channel stones set in the floor", space 2), and why does it give `stone +4` when nothing else in the game ever uses Stone again?
4. **[I] Channel vs. Hollow is a false choice if you want Foundation efficiently:**
   - Look at the Foundation 3-of-5 pointers (`C.3 Foundation`):
     1. `Qi Sense level >= 3` (**Impossible on the Channel-only route!** `jade_slip` sets `qisense.max` to 2; the only pre-Foundation raiser to 4 is `sit_fernhollow` on the Hollow route).
     2. `Circulation level >= 1` (Automatically true when the unlocker appears, since the unlocker appears at `Circulation cap >= 1` and you just trained it).
     3. `Any arrangement of space >= 2 installed` (Automatically true on the Channel route since `channel_arrangement` takes 2 space; requires 18 coin + 2 timber on the Hollow route for `practice_mat` + `herb_rack`).
     4. `Both sites' first observation completed` (`channel_observe` + `fernhollow_observe`, 2 min each, both available as soon as `Qi Sense >= 2`).
     5. `100 coin earned lifetime` (Requires ~30 runs of `mill_work` = 15 minutes of hauling sacks).
   - **Result:** On the Hollow route, completing `steady_attention` requires `sit_fernhollow ×3` and `qisense >= 3`, so you automatically satisfy Pointer 1 (`Qi Sense >= 3`) and Pointer 2 (`Circulation >= 1`), and spending 2 minutes on `channel_observe` gives you Pointer 4—3 of 5 done with zero extra coin grinding. On the Channel route, you automatically get Pointer 2 and Pointer 3, and spending 2 minutes on `fernhollow_observe` gives you Pointer 4—again 3 of 5 done! Pointer 5 (`100 coin earned lifetime`) is a 15-minute trap that no rational player will ever use as their 3rd pointer.
5. **[I] Locking `mill_work` and `Hayloft` at Foundation is a trap, not a transformation:**
   - Foundation locks `mill_work` (`C.3 Foundation`). The next job, `ferry_hauling`, requires `Lean-to` (`40 coin + 6 timber`).
   - Foundation's text says: *"Locks `mill_work` and Hayloft (if still occupied, the Lean-to is granted at no cost with a line of text)."*
   - **Wait:** If the player spends 40 coin + 6 timber (3 minutes of `cut_timber` + 20 coin for `field_kit` + 40 coin = 60 coin of work) to buy `Lean-to` before Foundation, they wasted 60 coin and 6 timber because Foundation hands out `Lean-to` **for free** if you stay in the Hayloft! That is a brutal anti-incentive against home development in the opening slice.
6. **[I] Absurd numbers in Part C:**
   - **Coin cap 12:** 4 sacks at the mill (`3 coin` per 30 s) fills your pockets, and a `coin_pouch` costs all 12 coin (`C.1`, `C.3`). Why can a mortal villager not hold 13 copper coins without buying a 12-coin pouch?
   - **`mill_work` `at` curve (`120: length +10 s ("your back")`)**: To hit 120 reps of a 30-second task that gets **permanently locked at Foundation**, a player would have to run `mill_work` for **60 continuous minutes** before completing a 25-minute opening slice! That `at: 120` entry is completely unreachable in normal play.
   - **10-minute `settling` task:** In a 25–40 minute active slice where tasks take 30–180 seconds, ending with a single 10-minute non-interactive timer (`settling`) means the final 25–33% of the active session is watching one bar crawl with nothing else to click.
   - **Age scale (`0.25 fictional years per activity hour`):** Under this scale, 40 minutes of active opening play = 0.167 years (~2 months), which is fine—but across the 76-hour paper budget to B4 (`PACING-PAPER-BUDGET.md`), 76 hours × 0.25 = **19 years**, whereas if Part C's incremental tempo shrinks B1–B4 to ~6–10 active+banked hours, 0.25 years/hour yields only **1.5–2.5 fictional years** to Cloudwell (violating the accepted 10–20 fictional years target in Q117 / ADR 0019).

### 5. Classes as keys in Part B.3 (Challenging Claim 3, Claim 4 & Question 5)
- **[F/I] Critical math bug in Part B.2 + B.3: Four of the eight B4 classes cannot pass B4's own gate!**
  - Look at `Part B.2` (Breakthrough 4, Cloudwell): `N of M (pointers)` requires **"ADR 0018's three conditions unchanged + intended-class family cap ≥ 5"**.
  - Now trace the maximum family cap reachable before B4 for each history using `Part B.3` + `Part B.4` (where each module tier has 1 practice task raising cap +1, 1 home arrangement raising cap +1, and 1 site raising cap +1, or check the class cap raises directly):
  - Even with module cap-raisers, look at **Golden Cauldron** (`B.3`): requires `Alchemy >= 1` (so you took `Pill Refiner` at B3, which opened `Refining 0→2` and Alchemy tier 1) and its intended-class family is `Refining`. Before B4, a `Pill Refiner` only has Alchemy tier 1 (`Refining` base 2 from class). If B4 requires `intended-class family cap >= 5`, a newcomer to a hybrid family or a B3-started family (`Refining` for `Golden Cauldron` / `Spirit Alchemist`, or `Projection` for `Sword Disciple` → `Spirit Blade` → `Spirit Warden` where `Sword Disciple` gave `Projection 0→1` and `Spirit Blade` gave `Projection +2` = 3, with **no Spirit module tier unlocked** by either class!) cannot reach cap 5 unless the module raisers are explicitly mapped!
  - Look closer at `Part B.3`'s "Also" column:
    - `Sword Disciple` unlocks **Sword module tier 1**.
    - `Formation Student` unlocks **Formation module tier 1**.
    - `Spirit Blade` unlocks **Sword tier 2**.
    - **Neither unlocks the Spirit module (`Projection`)!** In fact, **no class at B2 or B3 unlocks Spirit module tier 1 or tier 2 in `Part B.3`!** `Projection` is raised by `Sword Disciple` (`0→1`), `Formation Student` (`0→1`), and `Spirit Blade` (`+2`), and then `Spirit Warden` at B4 requires `Spirit >= 2`. Where does the Spirit module live before B4? Nowhere in `B.3`!
- **[I] Are the B4 classes meaningfully different, or still labels?**
  - In `Part B.3`, `Jade Body` is literally `Circulation +3; Body tier 3`. `Sword Heart` is `Blade Intent +3, Projection +1; Sword tier 3`. Because `Part B.4` defines every line module from an **identical rubber-stamp template** (3–4 practice tasks, 2 home arrangements, 1 resource, 2 recipes, 2 sites, 1 teaching record), `Jade Body` and `Sword Heart` are **isomorphic number-ladders with different nouns**. In the original design (`ADR 0017`), `Stone Ward` created a durable site boundary and `Spirit Warden` created a reactive trigger ward; in `Part B.3/B.4`, both are reduced to `+3/+1` cap bumps into identical module templates.
- **[I] Is `Mountain Vessel`'s "shallow entry to a second line" interesting or a trap?**
  - **It is a trap unless hybrid B4 classes require both caps.** At B3, `Iron Marrow` gives `Circulation +3` (Body tier 2), while `Mountain Vessel` gives `Circulation +1, Ground Reading +1` (Body tier 2 **and** Earth tier 1). If you started `Earth Listener` (Earth 1, `Ground Reading 0→2`) and take `Mountain Vessel` at B3, you get `Circulation 1→2` (since Foundation already gave `Circulation +1`!) and `Ground Reading 2→3`, unlocking Body tier 2 and Earth tier 1 (which you *already* unlocked as `Earth Listener`!). Compare that to `Earth Listener → Earth Array`, which unlocks **Earth tier 2** and Formation tier 1. Thus, for an `Earth Listener`, taking `Mountain Vessel` leaves them stuck at **Earth tier 1** all the way through B3!
- **[I] Is the Scholar line (`Sutra Reader` / `Wandering Scholar`) priced right, or dominant/dead?**
  - Look at `Sutra Reader` (`B.3`): **Tags: `none`**. Raises `Lore +3, Qi Sense +1, +1 to every family already > 0`.
  - Because `Sutra Reader` adds **zero mastery tags (`none`)**, a player who takes `Sutra Reader` at B3 enters B4 with **only 1 mastery tag total** (from their B2 starter class, or 2 if they took `Sword Disciple` / `Formation Student` which give +1 Sword/Formation and +1 Spirit).
  - Now check `Part B.3` B4 requirements:
    - `Jade Body` needs `Body >= 2` (Locked!)
    - `Sword Heart` needs `Sword >= 2` (Locked!)
    - `Mountain Heart` needs `Body >= 1 AND Earth >= 1` (Locked!)
    - `Stone Ward` needs `Earth >= 1 AND Formation >= 1` (Locked!)
    - `Spirit Warden` needs `Spirit >= 2` (Locked!)
    - `Spirit Alchemist` needs `Spirit >= 1 AND Alchemy >= 1` (Locked!)
    - `Golden Cauldron` needs `Alchemy >= 1` (Locked!)
  - **[F/I] Fatal violation of ADR 0017:** Any player who takes `Sutra Reader` at B3 has **ZERO specialist classes eligible at B4**! Their *only* legal class at B4 is `Wandering Scholar`! That violates `ADR 0017`'s core rule ("at least two meaningful, attainable class options at breakthrough 4 for every valid two-class history") and turns `Sutra Reader` into a permanent build-brick that locks you out of all seven cultivation classes at Cloudwell.

### 6. Coherence of bank + aging + locks + retries (Question 6)
- **[F]** The plan keeps `ADR 0002` / `ADR 0007`: (a) pausing/idling accrues bank and does not age; (b) spending bank accelerates tasks 1:1 at normal age cost; (c) **bank balance is not checkpoint state and survives retries** (`Part B.6`); (d) bank cap starts at 1 h (6 h at B1, 24 h at B2, 72 h at B3).
- **[I]** **The Degenerate Strategy ("Bank-Full Suicide Scouting"):**
  - Suppose you reach a checkpoint (say, B3, bank cap 72 h) with 0 bank.
  - Under the rules, if you explore blindly, test different class preparations, or fail Cloudwell approaches, you spend activity hours (and age), learning how the region works while real wall-clock time passes.
  - Better yet: start a long throwaway task or intentionally exhaust your remaining lifespan while leaving the game idle between steps to fill your 72-hour bank cap. Then **intentionally die of old age**.
  - When you retry from the B3 checkpoint, your character age and world state rewind to exact B3—**but you keep the 72 hours of banked time** (`ADR 0002` / `Part B.6`). You can now instantly blast through the optimal 35-hour B3→B4 route in **zero real seconds** using the bank farmed during your failed life!
  - Conversely, if you *spend* 72 hours of banked time on an attempt and die to a bad Cloudwell choice or age miscalculation, `ADR 0007` says *"spent banked time stays spent"*. Dying after spending your bank punishes you by wiping both your run progress AND your real-world days of stored bank, incentivizing you to sit paused for 3 real days before retrying.

### 7. Scope and the "12–20 records per module per tier" claim (Question 7)
- **[F]** `Part B.4` proposes 6 line modules × (12–20 records at tier 1, growing by tier) across 7 tiers, plus shared modules (Lore, Qi Sense, Home, Work, Karma).
- **[I]** Let's do the math the reviewer skipped: 6 lines × ~15 records/tier × 6 class tiers (B2–B7) = **540 line records**, plus ~150 shared/breakthrough/trial records = **~700 interconnected records** with custom prose, `require`/`need` expressions, `at` curves, and lifespan/resource balance across dozens of hybrid class combinations.
- **[I]** For a solo author, 700 records is not "cheap" when the game also requires narrative xianxia grounding (investigations, practitioners, defining trials like Cloudwell). In Arcanum, 2,847 records were accumulated over years by multiple contributors (`dfirestorm`, etc.) on top of Justin Lacy's base, and most of Arcanum's records are generic RPG tropes ("Fireball", "Iron Chest") that require zero bespoke investigation prose.
- **[R]** **What to cut & smallest version of Part B that tests Part A:**
  1. **Cut Karma/Morality completely** (saves an axis and a shadow-equivalent module).
  2. **Scope implementation to B1–B4 only** (3 class tiers, not 7; leave B5–B8 as high-level outline).
  3. **Merge Spirit (`Projection`) from a standalone 6th module into a shared bridge layer** (owned jointly by Sword, Formation, and Alchemy hybrids), or build **only 2 complete line modules** (e.g., `Body` and `Formation`, plus their hybrid `Earth`) for the post-Foundation vertical slice before authoring all 6.

### 8. Recommendations on the 3 Open Decisions in Part F (Question 8)

1. **Tempo: Incremental vs. Narrative (`Part F.1`)**
   - **[R] Choose a Hybrid "Session-Scale Incremental" Tempo (Foundation in ~25–35 min active on Day 1; B2–B4 across 3–5 real days via 15–20 min visits + bank).**
   - **Deciding reason:** Pure Arcanum opening tempo (3 minutes to first class) destroys the mortal-to-cultivator discovery premise, while the original 8-activity-hour opening (`PACING-PAPER-BUDGET.md`) leaves a new player staring at a 2-hour bar on their first session with an empty bank. Make the **opening through Foundation** play at active incremental tempo (~30 minutes, with 60–180 s tasks, not a 10-minute `settling` wall), and let **post-Foundation (B2–B4)** ramp task durations into the multi-hour idle/bank cadence as the bank cap grows from 1 h → 6 h → 24 h.

2. **Fallback Class: Scholar Line vs. Broad/Expensive Golden Cauldron (`Part F.2`)**
   - **[R] Drop the separate Scholar line (`Sutra Reader` / `Wandering Scholar`); keep `Pill Refiner` (B3) and `Golden Cauldron` (B4) as the open-entry fallback, priced in escalating Lore + Herbs/Coin, and split Alchemy into `Basic Refining` (shared) vs. `Spirit/Pill Alchemy` (specialist).**
   - **Deciding reason:** As proven in Question 5 above, `Sutra Reader` (`tags: none`) bricks the B4 class lattice by leaving the player with zero eligible specialist classes at B4. Meanwhile, xianxia has a natural reason why every cultivator dabbles in pill/cauldron refining (longevity and qi-replenishing draughts) or scripture study. By keeping `Golden Cauldron` open-entry (preserving `ADR 0017` / `Q72`) but charging a steep `Lore >= 8` + coin/herb bill and giving newcomers `Alchemy +1` (tier 1 recipes + broad cap +1s) while `Pill Refiner → Golden Cauldron` reaches `Alchemy 2` (deep specialist recipes), you get every mechanical benefit of Arcanum's Mage line **without** inventing two new classes that break the mastery tag graph.

3. **Engine: Reuse Arcanum's MIT Parser/Loader vs. Rewrite (`Part F.3`)**
   - **[R] Write a clean, typed ~800–1,000 LOC TypeScript engine implementing the Part D JSON grammar; reference Arcanum's `parsing.js`, do not fork its runtime.**
   - **Deciding reason:** As `STUDY.md` documented, Arcanum's `dataLoader.js` and `game.js` are tightly coupled to a 40,550-line Vue 3 / JavaScript codebase built around stamina/mana ticks, dungeon combat, equipment slots, and the Hall. Extracting `parsing.js` alone saves ~150 lines of expression compilation while dragging in untyped legacy conventions. A clean TypeScript runner that evaluates Part D's declarative JSON records, shares one AST evaluator between the browser runtime and the Part E static validator, and natively models **objective stops + lifespan aging + exact-state checkpoint snapshots** will be faster to build and far safer to debug.

### 9. What the First Playable Slice Should Actually Test, in Rank Order (Question 9)

The plan's `Part E.5` ranks "what just opened?" first and leaves the project's unique mechanics (lifespan, objective stops, bank) last or untested. Correct rank order:

1. **Continuous training + external cap-break loop (`0→5` runway, not `0→1` micro-gates):** Does training a capability within a 3–5 level runway (where each level palpably speeds up work or unlocks a lead) and then hitting a hard knowledge limit that requires a field discovery feel like *cultivation*?
2. **Route divergence with lasting build asymmetry (Channel vs. Hollow):** Does choosing the practical/infrastructure route (`Mill Channel` → home arrangement) versus the perception/technique route (`Fernhollow` → field technique) create a felt difference in how you reach Foundation, or do players just click everything in sight?
3. **Objective-based stopping + empty-bank vs. banked session handoff:** When a task runs for 2–5 minutes and stops at a player-chosen objective (`earn 20 coin`, `reach Qi Sense 3`), does the pause-and-bank loop work cleanly across a simulated return visit?
4. **Irreversible transition at Breakthrough 1 (Foundation):** Does paying a real material/qi bill and locking out mortal drudgery (`mill_work`)—while unlocking cultivator contacts and a higher-tier livelihood—feel like crossing a realm threshold?
5. **Static data validation (`Part E.1–E.4`):** Does the automated graph walker verify 100% record reachability and pacing bounds from the cold-start JSON before a human playtester ever loads the page?

---

## Prioritised Findings (Adversarial Audit of All Three Documents)

### Finding 1 (Critical): `Part C.3` has a hard prerequisite deadlock on `Lore` and an unreachable/pointless `channel_return`
- **Document & Section:** `DESIGN-PLAN-2026-10-18.md`, `Part C.1` & `Part C.3` (`Purchases`, `Practice`, `Sites`, `Home arrangements`).
- **What is wrong:** `jade_slip` raises `lore.max` from `0→2`, leaving `Lore` level at `0`. `field_kit` and `herb_rack` require `lore >= 1`; `shu_reading` requires `lore >= 2`. Yet the **only** task in `Part C.3` that grants `lore.exp` is `fragment_notes`, which requires `shu_reading` (`lore >= 2`)! Consequently, `Lore` can never rise above 0, locking the entire Channel route, `herb_rack` (and therefore Foundation's 10-herb bill, since base herb cap is 5!), and `shu_reading`. Additionally, `channel_return` requires `channel_arrangement` and `circulation >= 1`, meaning it only unlocks after the Channel route is already finished, and rewards `stone +4` when nothing else uses Stone.
- **Why it matters:** A "fully specified first slice" (`Part C`) that soft-locks at Minute 4 cannot be handed to an implementer.
- **Concrete alternative [R]:** Make `fragment_notes` ("Copy and study the slip", `lore.exp +1`) require only `jade_slip` (not `shu_reading`), so the player can train `Lore` from `0→2` immediately after buying the slip; then `shu_reading` (`require: lore >= 2, 5 herbs`) raises `lore.max` `2→3` and unlocks a deeper study task or B2 teaching records. Move `channel_return` into the Channel route *before* Foundation by having `channel_arrangement` raise `circulation.max 0→1` and `channel_return` be required to reach `circulation >= 2` (or grant a lasting `qi.rate` bonus).

### Finding 2 (Critical): `MECHANICS-STUDY.md` misreads omitted `"max"` in `skills.json` as `cap = 0`, causing `DESIGN-PLAN` to over-cap everything at `0/1` and `0/2`
- **Document & Section:** `MECHANICS-STUDY.md §1`; `REVIEW-RESPONSE-2026-10-18.md §Overall assessment`, `§1`; `DESIGN-PLAN-2026-10-18.md Part A.1`, `Part C.1`.
- **What is wrong:** **[F]** In Arcanum, skills without an explicit `"max"` key in `skills.json` initialize at `max = 5` once unlocked/bought, not `0`. **[I]** Because the reviewer believed skills start at `max: 0` and are raised by `+1`/`+2`, `DESIGN-PLAN` sets starting caps to `1` or `2` (`Circulation 0→1`, `Qi Sense 0→2`, `Coin 0→12`). When a cap is 1 or 2, "training" is just clicking a task once or twice between cap-raisers, turning skill progression into boolean flags.
- **Why it matters:** It destroys the core incremental pleasure of watching a skill level up several times, give incremental passive bonuses per level, and unlock mid-runway options before hitting its knowledge ceiling.
- **Concrete alternative [R]:** Distinguish **Unlocking (`locked` / `require` / `buy`)** from **Cap (`max`)**. Keep families locked (`cap 0` / hidden) until their first key (e.g., `Jade Slip` unlocks `Qi Sense` and `Lore`; `Channel Arrangement` or `Steady Attention` unlocks `Circulation`), but have that first key open a **3-to-5 level runway** (`0→3` or `0→5`), where intermediate levels grant rate bonuses and unlock tasks, and subsequent discoveries/classes raise the cap in meaningful chunks (`+3` or `+5`).

### Finding 3 (High): `Sutra Reader` (`Part B.3`) has `tags: none`, breaking `ADR 0017` by locking the player out of all 7 specialist classes at B4
- **Document & Section:** `DESIGN-PLAN-2026-10-18.md`, `Part B.3` (`Classes as keys`).
- **What is wrong:** **[F]** `Sutra Reader` (B3 scholar) grants `tags: none`. Every non-scholar class at B4 requires at least 2 mastery tags (`Body >= 2`, `Sword >= 2`, `Spirit >= 2`, `Body >= 1 & Earth >= 1`, `Earth >= 1 & Formation >= 1`, `Spirit >= 1 & Alchemy >= 1`) except `Golden Cauldron` (`Alchemy >= 1`, which only `Pill Refiner` at B3 grants). **[I]** Therefore, taking `Sutra Reader` at B3 leaves a player with at most 1 tag in any primary field and 0 in Alchemy, making `Wandering Scholar` their **only** legal B4 option.
- **Why it matters:** Instead of giving every two-class history a second choice at B4 (`ADR 0017`), the Scholar line traps anyone who takes it at B3 into a 1-option railroad at B4.
- **Concrete alternative [R]:** Drop `Sutra Reader` and `Wandering Scholar`. Keep `Golden Cauldron` open-entry at B4 (`ADR 0017` / `Q72`), gated by `Lore >= 8` + an introductory refining task + a high Herb/Coin bill, and split its payoff so `Alchemy 1` (newcomer) gives broad utility preparations (+1 cap to existing families) while `Alchemy 2` (`Pill Refiner → Golden Cauldron`) unlocks deep alchemical transformations.

### Finding 4 (High): `Part B.2` & `Part B.3` fail to unlock the `Spirit` module or reach `cap >= 5` for B4 classes
- **Document & Section:** `DESIGN-PLAN-2026-10-18.md`, `Part B.2` (row 4) and `Part B.3`.
- **What is wrong:** **[F]** `Part B.2` requires `intended-class family cap >= 5` for Breakthrough 4 (Cloudwell). Yet in `Part B.3`, no class at B2 or B3 unlocks `Spirit module tier 1` or `tier 2` (even though `Spirit Warden` at B4 is the Spirit specialist!), `Earth Listener → Mountain Vessel` only unlocks `Earth tier 1` (redundant with `Earth Listener`), and `Pill Refiner` (taken at B3) only gets 1 tier of Alchemy before B4 (`Refining 0→2` from class + at most +2 from tier 1 module = cap 4, failing `cap >= 5`).
- **Why it matters:** Half of the 11 valid A→B histories will be mathematically blocked from attempting Cloudwell under `Part B.2`'s `cap >= 5` rule.
- **Concrete alternative [R]:** Replace the uniform `intended-class family cap >= 5` gate at B4 with **tier-relative cap requirements** (`cap >= 5` for pure 2-tag depth classes like `Jade Body`/`Sword Heart`, and `family A cap >= 3 && family B cap >= 3` for hybrid classes like `Mountain Heart`, `Stone Ward`, `Spirit Alchemist`), and explicitly grant `Spirit tier 1` on `Sword Disciple` / `Formation Student` and `Earth tier 2` on `Earth Listener → Mountain Vessel`.

### Finding 5 (High): Retaining the time bank across retries (`Part B.6`) creates a suicide-farming exploit and a bank-loss punishment
- **Document & Section:** `DESIGN-PLAN-2026-10-18.md`, `Part B.6`; `REVIEW-RESPONSE-2026-10-18.md §9`.
- **What is wrong:** **[F]** `Part B.6` retains `ADR 0002`'s rule that bank balance is *not* checkpoint state: spent bank stays spent on retry, and bank accrued before dying carries into the retry. **[I]** A player who scouts a stretch on normal time (while accruing bank during pauses) and intentionally dies of old age returns to the checkpoint with a full bank and full foreknowledge; conversely, a player who spends their bank on a stretch and then dies loses both their progress and their real-world days of stored time.
- **Why it matters:** It turns lifespan exhaustion from a fair puzzle/budget reset into either a real-time penalty (if you spent bank) or a meta-currency farm (if you hoarded bank).
- **Concrete alternative [R]:** Reverse `Q46`: **snapshot `bank >= checkpoint_bank` on retry** (or better: on a checkpoint retry, refund any bank spent during the failed stretch up to the current bank cap, while keeping any new wall-clock offline time accrued since the checkpoint). That way, retrying a failed life never deletes the real-world away time the player earned.

### Finding 6 (Medium): `Part C.3` Foundation grants `Lean-to` for free if you didn't buy it, punishing home investment
- **Document & Section:** `DESIGN-PLAN-2026-10-18.md`, `Part C.3` (`Foundation` locks and `Home arrangements`).
- **What is wrong:** **[F]** `lean_to` costs `40 coin, 6 timber` before Foundation. Yet `Foundation` states: *"Locks `mill_work` and Hayloft (if still occupied, the Lean-to is granted at no cost with a line of text)."*
- **Why it matters:** Buying `lean_to` before Foundation costs 60 coin of labour (20 for `field_kit` + 40 for `lean_to`) plus 3 minutes of timber cutting, and is not required for any 3-of-5 pointer. Giving it away for free at Foundation punishes any player who engaged with the home-upgrade system.
- **Concrete alternative [R]:** Do **not** lock `Hayloft` or grant `Lean-to` for free at Foundation. Instead, have Foundation unlock `Cottage` (Home tier 2) and require `Lean-to` (Home tier 1) either as a prerequisite for `Cottage` or as one of the genuine B1/B2 pointers, and only lock `mill_work` once `ferry_hauling` (unlocked by `Lean-to` or Foundation) is already active.

### Finding 7 (Medium): `Part C.3` Foundation's 3-of-5 pointer list is degenerate and `settling` is a 10-minute dead wall
- **Document & Section:** `DESIGN-PLAN-2026-10-18.md`, `Part C.3` (`Foundation`) and `Part C.5` (`Session script`).
- **What is wrong:** **[F]** Pointer 2 (`Circulation >= 1`) is tautological once the unlocker is visible; Pointer 1 (`Qi Sense >= 3`) is impossible on the Channel route without doing the Hollow route (`sit_fernhollow`); Pointer 5 (`100 coin earned lifetime`) requires ~15 minutes of sack-hauling; and `settling` is a 10-minute passive timer at the end of a 30-minute active session.
- **Why it matters:** The player has no real choice among the 5 pointers (both routes naturally complete Pointers 2 + 4 + either 1 or 3), and a 10-minute blank timer in an active first session will cause players to close the tab before seeing the post-Foundation world open up.
- **Concrete alternative [R]:** Shrink `settling` to **90–120 seconds** for the active opening slice (reserve 10-minute timers for B2+ when the player has banked time), and make all 5 Foundation pointers genuinely independent and reachable on either route:
  1. `Circulation >= 2` (reconstructed method practised to stability)
  2. `Qi Sense >= 3` (make `channel_observe` also raise `qisense.max +1` so both routes can reach 3)
  3. `Lore >= 2` (slip studied and annotated)
  4. `Home space used >= 2` (arrangements installed)
  5. `Clear Channel OR Steady Attention completed` (at least one route's culmination achieved) — require **4 of 5**.
