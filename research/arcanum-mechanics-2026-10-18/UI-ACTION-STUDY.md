# Arcanum UI and action semantics: 18 October 2026

This bounded source check follows the owner's rejection of Lowbridge's first card-based interface. It establishes what Arcanum distinguishes, and what can inform the existing village-to-Foundation slice. It does not authorize additional combat, classes, regions, automation slots, or resource systems.

## Source and version boundary

All upstream links below pin commit `a2632d2edf3e07e9168fff81167b11f2792e9197`, recorded as **stable 0.12.3.1** in [snapshot.json](../arcanum-study-2026-10-16/snapshot.json). The retained October 18 scratch source contains data plus only three item files. The older graph's `/tmp/arcanum-study-2026-10-16` checkout was missing; its coverage metadata reported `freshness: missing`. Graph results supplied file locations only. The relevant source was then read directly from public GitLab raw URLs using Scrapling, with temporary copies under `/tmp/arcanum-ui-evidence/`.

The reference screenshot is from the later **unstable 0.12.12.9** build; the earlier wiki research describes 0.12.0.0. These are different versions. This note verifies pinned-source behavior, not an exact reconstruction of the screenshot's release or theme. It does **not** assign meanings to screenshot colors. The earlier mechanics study's assertion that all three versions have identical structure is broader than this bounded UI check establishes.

## Verified distinctions

### 1. Instant acquisition does not occupy the activity slot

`Game.tryBuy` pays the purchase cost and marks ownership. It does not invoke the runner. `Game.tryItem` first separates an unowned purchase; a runnable item then goes through `setTask`, while a non-runnable item pays its immediate cost and applies its amount. The decisive runnable fields are `perpetual > 0` or `length > 0`, not the record's display group. See [`src/game.js:671–733`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js#L671-733).

**Opening consequence:** buying the pouch, kit, mat, or another immediate acquisition should not replace an unrelated active work/practice objective. It should visibly read as an immediate transaction. Intentional discovery pauses remain a separate Lowbridge rule. This is a behavioral correction as well as a visual distinction.

### 2. Timed work and ongoing practice expose different progress

The runner applies `run` costs and `effect` outputs over elapsed time. A task accumulates experience/progress at its rate and completes when its length is reached; skills extend that task machinery and update their level length. See [`src/modules/runner.js:636–660`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/runner.js#L636-660), [`src/items/task.js:217–262`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/task.js#L217-262), and [`src/items/skill.js:28–89`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/skill.js#L28-89).

The skill component shows acquisition while unowned, then a distinct Train/Stop control, level/cap, and experience bar when owned. See [`src/ui/items/skill.vue:39–60`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/items/skill.vue#L39-60).

**Opening consequence:** distinguish immediate transactions, finite timed actions, and continuing practice. Show current-cycle progress for work/sites and level experience for practice, with the chosen stopping objective explicit. Do not present an instant purchase as another activity with an objective editor.

### 3. Compact tasks, upgrades, and progression form separate groups

The task section places indefinitely repeatable records (`repeat` without a `max`) under Tasks. Limited tasks appear alongside upgrades; progression quests and classes have their own sections. Thus **“Upgrade” does not prove “instant.”** See [`src/ui/sections/tasks.vue:53–55,94–137`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/sections/tasks.vue#L53-137).

The shared action button assigns separate `running`, `runnable`, `disabled`, and `locked` classes from actual state. It shows the action name and opens detail on hover. The task group lays buttons out in an auto-fitting fixed-width grid. See [`src/ui/panes/upgrades.vue:29–40,64–77`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/upgrades.vue#L29-77) and [`src/ui/panes/taskGroup.vue:31–65`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/taskGroup.vue#L31-65).

**Opening consequence:** the rejected `createCard` presentation gave work, sites, purchases, and arrangements the same large article structure. Small verb changes did not create a sufficiently different visual hierarchy. Group concise actions by purpose and behavior; retain prose and detailed facts behind a reachable inspection affordance. Classification should follow actual timing, with text and structure as well as styling.

### 4. The currently running activity is persistent information

The running pane lists active actions, completion percent, skill level/cap, and individual stop controls. Unused capacity has explicit Idle entries. Goal and Hobby controls appear conditionally when the runner permits them. See [`src/ui/panes/running.vue:106–145`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/running.vue#L106-145).

**Opening consequence:** retain one clearly visible activity slot across tabs: name, progress, objective, stop, and bank acceleration state. The user should not need to find the original card to understand what is running. Additional slots, Goals, and Hobbies are not merely decorative omissions: the source has progression upgrades that increase `runner.max`, including a tier-5-gated example in [`data/modules/extraaction.json:4–20`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/extraaction.json#L4-20). Lowbridge's queue/hobby milestones remain beyond this slice.

### 5. Dense resources and navigation leave the action area usable

The main layout places resource groups beside a central section menu and a vitals pane. Section entries are filtered by unlock state. Resource rows pair names with quantities/caps; their groups can collapse. See [`src/ui/main.vue:438–449,502–558`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/main.vue#L438-558), [`src/ui/panes/itemGroup.vue:22–62`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/itemGroup.vue#L22-62), and [`src/ui/panes/resources.vue:43–89`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/resources.vue#L43-89).

**Opening consequence:** the existing resources, family runways, home capacity, primary activity, and discoveries need a compact persistent hierarchy. Separate views should organize actual available content. The endgame screenshot's many resource families and tabs are evidence of later systems, not a reason to add empty combat/spell/class panels to this opening.

### 6. Details distinguish entry requirements, payment, upkeep, and payoff

The item detail component separately renders remaining completion time, `need`/`needtext`, purchase cost, use cost, per-second progress cost, ongoing effects, permanent modifications, first-completion outcomes, and results. See [`src/ui/items/gdata.vue:338–362`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/items/gdata.vue#L338-362) and [`src/ui/items/gdata.vue:420–476`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/items/gdata.vue#L420-476).

**Opening consequence:** concise actions still need inspectable, source-derived costs, duration/rate, cap or income changes, and unmet gates. A prose description alone is not a substitute for these distinctions. Lowbridge should make inspection available to keyboard and touch users too; that is an accessibility requirement for the adaptation, not a claim about upstream hover accessibility.

### 7. Hidden, blocked, owned, and active are different states

The task list filters locked/maxed/disabled entries through its visibility helpers, while affordability and `need` can leave a visible button unusable. Classes have an additional visibility exception. `GData.canUse` delegates runnable items to `canRun`, which checks start costs, upkeep, fills, and exclusions. See [`src/ui/itemsBase.js:20–25`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/itemsBase.js#L20-25), [`src/ui/sections/tasks.vue:43–55`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/sections/tasks.vue#L43-55), and [`src/items/gdata.js:306–372`](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/gdata.js#L306-372).

**Opening consequence:** keep Lowbridge's accepted remembered visibility and explicit missing requirements. Distinguish unavailable, acquired/completed, currently running, and not-yet-discovered states. Do not infer a universal upstream visibility rule or color legend from one endgame screenshot.

## Correction boundary

The immediate gaps are interaction semantics, action density, persistent activity context, distinct acquisition/practice controls, and inspectable mechanical detail. Existing JSON already supplies most of this information. The opening does not need fake late-game features to address those gaps. The code and UI were being corrected concurrently with this note; these findings describe the rejected presentation and the verified reference principles, not a claim that every listed gap remains after the correction.
