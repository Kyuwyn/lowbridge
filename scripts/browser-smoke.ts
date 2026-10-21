import { chromium, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { startServer } from './serve';
import { runRidgeRoute, runRoute, ROUTES, type OpeningRoute } from './routes';
import { records, recordById } from '../src/content';
import { GameEngine } from '../src/engine';
import { decodeSave, makeSave, DATABASE_NAME, SAVE_VERSION, type SaveFile } from '../src/persistence';
import type { GameState } from '../src/types';

const output = join(import.meta.dir, '../playtest');
await mkdir(output, { recursive: true });
const server = await startServer(0);
const browser = await chromium.launch({ headless: true });
const errors: string[] = [];
const reports: Record<string, unknown>[] = [];

async function storedFile(page: Page): Promise<SaveFile> {
  return page.evaluate(async name => {
    const { promise, resolve, reject } = Promise.withResolvers<unknown>();
    const open = indexedDB.open(name, 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction('saves', 'readonly');
      const request = transaction.objectStore('saves').get('current');
      transaction.oncomplete = () => { db.close(); resolve(request.result); };
      transaction.onabort = () => { db.close(); reject(transaction.error); };
    };
    return promise;
  }, DATABASE_NAME) as Promise<SaveFile>;
}

/** The stored delta rebuilt into the state it describes, which is what the assertions are about. */
async function stored(page: Page): Promise<{ version: number; state: GameState }> {
  const file = await storedFile(page);
  return { version: file.version, state: decodeSave(file, records).state };
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

/**
 * Autosave is fired and forgotten, so a bare read can beat the write to disk, and with the clock paused no
 * later tick comes along to save again. Flush as the game itself does on a hidden tab, then read until the
 * save stops changing, so any remaining disagreement comes from the game rather than the harness.
 */
async function settled(page: Page, agrees: (state: GameState) => boolean) {
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  let seen = await stored(page);
  for (let tries = 0; tries < 20 && !agrees(seen.state); tries++) {
    await Bun.sleep(50);
    seen = await stored(page);
  }
  return seen;
}

async function offerSaveFile(page: Page, save: unknown) {
  await openSettings(page);
  await page.locator('[data-ui=file]').setInputFiles({ name: 'smoke-save.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(save)) });
}

/** A loadable file is offered and the replace question appears; an unloadable one is refused before any question. */
async function chooseSaveFile(page: Page, save: unknown) {
  await offerSaveFile(page, save);
  await page.locator('[data-ui=confirmation]').waitFor({ state: 'visible' });
}

async function importSave(page: Page, save: unknown) {
  await chooseSaveFile(page, save);
  await page.locator('[data-ui=confirm]').click();
  await page.waitForFunction(() => !document.querySelector<HTMLButtonElement>('[data-ui=export]')?.disabled);
}

async function closeSettings(page: Page) {
  if (await page.locator('.settings').getAttribute('open') !== null) await page.locator('.settings > summary').click();
}

/** Confirming closes the menu, so anything reaching for a save button has to say what it wants, not toggle. */
async function openSettings(page: Page) {
  if (await page.locator('.settings').getAttribute('open') === null) await page.locator('.settings > summary').click();
  await page.locator('[data-ui=export]').waitFor({ state: 'visible' });
}

/** Techniques are the spellbook; practice and breakthroughs are tasks, with practice mirrored on Character. */
function tabOf(id: string) {
  const record = recordById.get(id)!;
  return record.group === 'Home' ? 'home' : record.kind === 'technique' ? 'techniques' : 'tasks';
}

/** The action's main button; a breakthrough lives in its own panel rather than the grid. */
async function revealAction(page: Page, id: string) {
  await page.locator(`button[data-tab="${tabOf(id)}"]`).click();
  const button = page.locator(id === 'settling' ? '[data-ui=foundation-start]' : `#view-${tabOf(id)} button[data-record-id="${id}"]`);
  await button.waitFor({ state: 'visible' });
  return button;
}

/** An irreversible action asks before it runs; nothing happens until Confirm is pressed. */
async function confirmIfAsked(page: Page) {
  const panel = page.locator('[data-ui=confirmation]');
  if (await panel.isVisible()) await page.locator('[data-ui=confirm]').click();
}

/** A technique has to hold an attunement slot before the engine will start it, and taking it up is where its locks fall. */
async function ensureAttuned(page: Page, id: string) {
  await revealAction(page, id);
  const toggle = page.locator(`button[data-attune-id="${id}"]`);
  if (await toggle.getAttribute('aria-pressed') !== 'true') { await toggle.click(); await confirmIfAsked(page); }
}

async function click(page: Page, id: string, times = 1) {
  if (recordById.get(id)!.attune) await ensureAttuned(page, id);
  const button = await revealAction(page, id);
  for (let count = 0; count < times; count++) { await button.click(); await confirmIfAsked(page); }
}

try {
  for (const name of Object.keys(ROUTES) as OpeningRoute[]) {
    const expected = runRoute(name);
    assert(expected.success, `${name}: simulation did not reach Foundation`);
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    const started = performance.now();
    await page.clock.install({ time: new Date('2026-10-18T23:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-18T23:00:01Z'));
    await page.goto(server.url.toString());
    await page.getByRole('heading', { name: 'Lowbridge', level: 1, exact: true }).waitFor();
    await page.locator('button[data-record-id=mill_work]').waitFor();
    assert(await page.locator('[data-tab=techniques]').isHidden() && await page.locator('[data-tab=home]').isHidden(), 'Techniques or Home shows before the apprenticeship');
    assert(await page.locator('[data-ui=waiting]').count() === 1 && await page.locator('[data-ui=waiting-empty]').isVisible(), 'the activity panel has no empty waiting list');
    await page.locator('[data-tab=tasks]').focus();
    await page.keyboard.press('ArrowRight');
    assert(await page.locator('[data-tab=character]').getAttribute('aria-selected') === 'true', 'keyboard tab navigation did not skip hidden Techniques and Home');
    await page.keyboard.press('End');
    assert(await page.locator('[data-tab=character]').getAttribute('aria-selected') === 'true', 'End did not select the last game tab');
    await page.keyboard.press('Home');
    assert(await page.locator('[data-tab=tasks]').getAttribute('aria-selected') === 'true', 'Home did not return to Tasks');
    assert(await page.locator('button[data-record-id=rest]').isVisible(), 'the opening does not show Rest');
    assert(await page.locator('[data-ui=body] .vigor-meter').isVisible(), 'the body panel does not show Vigor');
    const seenActions = new Set<string>();
    for (const action of expected.actions) {
      const record = recordById.get(action.id)!;
      if (action.attune) {
        if (action.release) { await revealAction(page, action.release); await page.locator(`button[data-attune-id="${action.release}"]`).click(); }
        await ensureAttuned(page, action.id);
        continue;
      }
      if (record.attune) await ensureAttuned(page, action.id);
      const button = await revealAction(page, action.id);
      const modeHost = action.id === 'settling' ? page.locator('[data-ui=foundation]') : button;
      assert(await modeHost.getAttribute('data-action-mode') === (record.length === undefined ? 'instant' : record.length === 'continuous' ? 'continuous' : 'timed'), `${action.id}: action mode does not match its behavior`);
      if (action.id === 'settling') {
        const rewards = await page.locator('[data-ui=foundation-rewards]').innerText();
        for (const benefit of ['Max Circulation: 2', 'Max Lore: 2', 'Max Qi Sense: 2', 'Max Attunement: 1', 'Max Qi: 10', 'Stored time cap: 18000']) {
          assert(rewards.includes(benefit), `Foundation does not disclose ${benefit} before commitment`);
        }
      }
      const firstReward = record.at?.['1'];
      if (!seenActions.has(action.id) && firstReward) {
        await button.hover();
        const mod = page.locator(`[data-record-details="${action.id}"] .tip-mod`);
        await mod.waitFor({ state: 'visible' });
        const text = await mod.innerText();
        for (const path of Object.keys(firstReward)) {
          const [target] = path.split('.');
          assert(text.includes(recordById.get(target)!.name!) && text.includes('at 1'), `${action.id}: first-completion limit reward (${path}) is not disclosed`);
        }
        await page.mouse.move(0, 0);
      }
      const first = seenActions.size === 0;
      seenActions.add(action.id);
      await button.click();
      await confirmIfAsked(page);
      // Home opens with the apprenticeship; Techniques waits for a technique the method can actually hold.
      if (action.id === 'shu_apprentice') {
        const home = page.locator('[data-tab=home]');
        assert(await home.isVisible() && await home.locator('.tab-new').isVisible(), `${name}: home did not appear with a New badge after the apprenticeship`);
        assert(await page.locator('[data-tab=techniques]').isHidden(), `${name}: Techniques appeared before any technique was known`);
        assert((await page.locator('[data-ui=character-stage]').innerText()) === "Shu's apprentice", `${name}: the apprenticeship title is not shown`);
      }
      if (first) {
        assert(await page.locator('button.task-button:visible').count() >= 3, `${name}: the opening shows fewer than three actions after the first chore`);
        if (name === 'channel-only') await page.screenshot({ path: join(output, 'opening-desktop.png'), fullPage: true });
      }
      if (action.objective.kind === 'resource' && record.length !== undefined) {
        await page.locator('[data-ui=objective-kind]').selectOption(`resource:${action.objective.id}`);
        await page.locator('[data-ui=objective-target]').fill(String(action.objective.target));
      }
      if (name === 'channel-only' && action.id === 'channel_exercise' && action.elapsed > 1) {
        await page.clock.runFor(1000);
        await page.screenshot({ path: join(output, 'cultivation-desktop.png'), fullPage: true });
        await page.clock.runFor((action.elapsed - 1) * 1000);
      } else if (action.elapsed) await page.clock.runFor(action.elapsed * 1000);
    }
    await page.locator('[data-ui=completion]').waitFor({ state: 'visible' }).catch(() => {});
    const save = await stored(page);
    assert(save.state.stats.foundation.value === 1, `${name}: browser did not reach Foundation`);
    assert(save.state.activitySeconds === expected.activitySeconds, `${name}: browser/simulation time mismatch ${save.state.activitySeconds} vs ${expected.activitySeconds}`);
    for (const family of ['lore', 'qi_sense', 'circulation']) assert(save.state.stats[family].value === expected.state.stats[family].value, `${name}: ${family} differs`);
    assert(save.state.active === null, `${name}: did not pause at Foundation`);
    assert(save.state.bank.cap === 21600, `${name}: Foundation rewards missing`);
    await Bun.write(join(output, `${name}-foundation.json`), JSON.stringify(save, null, 2));
    await page.locator('[data-tab=tasks]').click();
    for (const group of ['work', 'practice', 'purchases', 'sites']) assert(await page.locator(`[data-group=${group}]`).isVisible(), `${name}: the ${group} group is missing at Foundation`);
    // The spellbook holds the techniques; practice is a task group, mirrored under the knowledge it raises.
    await page.locator('[data-tab=techniques]').click();
    assert(await page.locator('[data-group=techniques]').isVisible(), `${name}: the Techniques group is missing at Foundation`);
    assert(/^Attuned \d+ \/ \d+$/.test(await page.locator('[data-ui=attune-count]').innerText()), `${name}: the spellbook does not count its attunement slots`);
    await page.locator('[data-tab=character]').click();
    const practice = page.locator('.family-explanation:visible .family-practice:visible button[data-record-id=breath_gathering]');
    assert(await practice.count() === 1, `${name}: breath practice is not filed under the knowledge it trains`);
    await page.locator('[data-tab=tasks]').click();
    for (const bar of ['vigor', 'qi']) assert(await page.locator(`[data-ui=body] .${bar}-meter`).isVisible(), `${name}: the body panel does not show ${bar}`);
    await page.screenshot({ path: join(output, `${name}-foundation.png`), fullPage: true });
    await page.reload();
    await page.locator('[data-ui=export]').waitFor({ state: 'attached' });
    const restored = await stored(page);
    assert(restored.state.stats.foundation.value === 1, `${name}: reload lost Foundation`);
    assert(restored.state.activitySeconds === expected.activitySeconds, `${name}: reload duplicated activity`);
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert(!overflow, `${name}: horizontal overflow at ${width}px`);
      const columns = await page.locator('[data-group=work] .task-grid').evaluate(grid => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
      if (width === 390) assert(columns >= 1 && columns <= 2, `${name}: ${columns} action columns at 390px`);
      if (width === 390 && name === 'channel-only') await page.screenshot({ path: join(output, 'foundation-mobile.png'), fullPage: true });
    }
    reports.push({ name, browserWallSeconds: (performance.now() - started) / 1000, activitySeconds: save.state.activitySeconds,
      actionCount: expected.actions.length, levels: expected.levels, unlocks: expected.unlocks, unsourcedCapLog: expected.unsourcedCapLog,
      reload: 'pass', keyboardTabs: 'pass', actionModes: 'pass', responsiveWidths: [1440, 768, 390] });
    await context.close();
    console.log(`Browser ${name}: Foundation in ${save.state.activitySeconds}s ordinary activity; real UI clicks/reload/layout PASS`);
  }

  // An independent fresh context exercises the pause-and-bank lifecycle and real IndexedDB.
  // A shadow engine runs the same clicks and seconds in-process; the browser must agree with it to the second.
  const shadow = new GameEngine(records);
  const sameAsShadow = async (label: string) => {
    // Autosave is periodic; hiding the tab is the game's own flush, as closing a laptop lid would be.
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    let seen = await stored(page);
    let mismatch: (string | number | null)[] | undefined;
    // The flush queues behind any write already in flight, and an idle second moves the bank without moving
    // the clock, so every compared field, the clock included, has to settle before a disagreement counts.
    for (let tries = 0; ; tries++) {
      mismatch = [
        ['active', seen.state.active?.id ?? null, shadow.state.active?.id ?? null],
        ['activitySeconds', seen.state.activitySeconds, shadow.state.activitySeconds],
        ['bank', seen.state.bank.seconds, shadow.state.bank.seconds],
        ['coin', seen.state.stats.coin?.value ?? 0, shadow.state.stats.coin!.value],
        ['vigor', Math.round((seen.state.stats.vigor?.value ?? 0) * 1e6), Math.round(shadow.state.stats.vigor!.value * 1e6)],
      ].find(([, browser, expected]) => browser !== expected);
      if (!mismatch || tries >= 20) break;
      await Bun.sleep(50);
      seen = await stored(page);
    }
    assert(!mismatch, `${label}: browser ${mismatch?.[0]} ${String(mismatch?.[1])} differs from the engine's ${String(mismatch?.[2])}`);
    return seen;
  };
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  let page = await context.newPage();
  page.on('pageerror', error => errors.push(`persistence: ${error.message}`));
  await page.clock.install({ time: new Date('2026-10-18T23:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-18T23:00:01Z'));
  await page.goto(server.url.toString());
  await click(page, 'mill_work', 2);
  shadow.start('mill_work'); shadow.start('mill_work');
  // Rest starts by itself once Vigor is below its cap; no click is needed.
  await page.clock.runFor(10_000);
  shadow.advance(10);
  await sameAsShadow('after ten seconds');
  await page.close();
  page = await context.newPage();
  page.on('pageerror', error => errors.push(`offline return: ${error.message}`));
  await page.clock.install({ time: new Date('2026-10-18T23:01:40Z') });
  await page.clock.pauseAt(new Date('2026-10-18T23:01:41Z'));
  await page.goto(server.url.toString());
  await page.locator('button[data-record-id=mill_work]').waitFor();
  shadow.advance(90);
  await sameAsShadow('return visit');
  const returned = page.locator('[data-ui=return]');
  await returned.waitFor({ state: 'visible' });
  assert((await returned.innerText()).includes('1m 30s') && (await returned.innerText()).includes('entered the bank'), 'return summary did not report the away time and bank credit');
  await page.locator('[data-ui=return-dismiss]').click();

  // Reach a practice worth accelerating, for the two ways acceleration can end: the objective is met with
  // bank to spare, or the bank runs dry first and the activity carries on at ordinary speed.
  await click(page, 'mill_work', 2);
  await click(page, 'sort_herbs', 3);
  await click(page, 'shu_apprentice');
  await click(page, 'jade_slip');
  for (const id of ['mill_work', 'mill_work', 'sort_herbs', 'sort_herbs', 'sort_herbs', 'shu_apprentice', 'jade_slip']) assert(shadow.start(id).ok, `shadow could not ${id}`);
  const notice = page.locator('[data-ui=notice]');
  assert(await notice.isVisible() && (await page.locator('[data-ui=notice-text]').innerText()).length > 0, 'a discovery is not surfaced in the notice banner');
  await page.locator('[data-ui=notice-dismiss]').click();
  assert(await notice.isHidden(), 'the discovery notice cannot be dismissed');
  await click(page, 'fragment_notes');
  assert(shadow.start('fragment_notes').ok, 'shadow could not start the copying');
  // Shift-click queues instead of replacing the running practice; Remove takes it off the list.
  await (await revealAction(page, 'breath_gathering')).click({ modifiers: ['Shift'] });
  const queued = await stored(page);
  assert(queued.state.active?.id === 'fragment_notes' && queued.state.waiting.length === 1 && queued.state.waiting[0]!.id === 'breath_gathering', 'Shift-click did not queue behind the running practice');
  const row = page.locator('[data-ui=waiting] li[data-record-id=breath_gathering]');
  assert(await row.isVisible() && await page.locator('[data-ui=waiting-empty]').isHidden(), 'the waiting entry is not listed in the activity panel');
  assert(await page.locator('#view-tasks button[data-record-id=breath_gathering]').isHidden(), 'the queued action still shows a duplicate grid cell');
  await row.locator('button[data-action=dequeue]').click();
  assert((await stored(page)).state.waiting.length === 0 && await row.isHidden(), 'Remove did not take the entry off the waiting list');
  assert(await page.locator('#view-tasks button[data-record-id=breath_gathering]').isVisible(), 'the grid cell did not return once the pursuit left the waiting list');
  await page.locator('[data-ui=objective-kind]').selectOption('level:lore');
  const target = page.locator('[data-ui=objective-target]');
  await target.fill('5'); await target.focus(); await page.clock.runFor(1000);
  shadow.start('fragment_notes', { kind: 'level', id: 'lore', target: 5 }); shadow.advance(1);
  assert(await target.evaluate(node => node === document.activeElement && (node as HTMLInputElement).value === '5'), 'tick replaced focused objective control');
  const retargeted = await stored(page);
  assert(retargeted.state.active?.objective.kind === 'level' && retargeted.state.active.objective.target === 5, 'objective editor did not retarget the running practice');
  const accelerate = page.locator('[data-action=accelerate]');
  assert((await accelerate.innerText()).includes('Lore level 5'), 'the accelerate toggle does not name the objective');
  await accelerate.click();
  assert(shadow.setAccelerating(true).ok, 'shadow could not accelerate');
  await page.clock.runFor(10_000);
  shadow.advance(10);
  const accelerating = await sameAsShadow('ten accelerated seconds');
  assert(accelerating.state.bank.accelerating && shadow.state.bank.seconds > 0, 'acceleration did not spend one banked second per real second');
  assert(await accelerate.getAttribute('aria-pressed') === 'true' && (await page.locator('[data-ui=active-eta]').innerText()).includes('accelerating'), 'acceleration is not reflected in the controls');
  // Run until the objective is met: acceleration switches itself off and the unspent bank is kept.
  let untilDone = 0;
  while (shadow.state.active && untilDone < 3600) { shadow.advance(1); untilDone++; }
  assert(!shadow.state.active && shadow.state.bank.seconds > 0, 'the fixture objective did not finish with bank to spare');
  await page.clock.runFor(untilDone * 1000);
  const spent = await sameAsShadow('objective met while accelerating');
  assert(!spent.state.bank.accelerating && spent.state.bank.seconds === shadow.state.bank.seconds, 'meeting the objective did not stop acceleration and keep the remaining bank');

  // The other ending: what is left of the bank is now less than the next objective needs, so acceleration
  // runs dry part way through. The premise is checked on the shadow first, so a pacing retune that leaves the
  // bank longer than the objective fails here saying exactly that, instead of further down as a bare mismatch.
  await click(page, 'breath_gathering');
  await page.locator('[data-ui=objective-kind]').selectOption('level:qi_sense');
  await page.locator('[data-ui=objective-target]').fill('5');
  assert(shadow.start('breath_gathering', { kind: 'level', id: 'qi_sense', target: 5 }).ok, 'shadow could not start the breath method');
  await accelerate.click();
  assert(shadow.setAccelerating(true).ok, 'shadow could not accelerate the breath method');
  let untilEmpty = 0;
  while (shadow.state.bank.accelerating && untilEmpty < 3600) { shadow.advance(1); untilEmpty++; }
  // Read through a snapshot: the earlier "objective met" assert narrowed shadow.state.active to null for good.
  assert(shadow.state.bank.seconds === 0 && shadow.snapshot().active?.id === 'breath_gathering',
    'the fixture bank outlasted its objective, so bank depletion is never reached');
  await page.clock.runFor(untilEmpty * 1000);
  const emptied = await sameAsShadow('bank depleted mid-objective');
  assert(!emptied.state.bank.accelerating && emptied.state.bank.seconds === 0 && emptied.state.active?.id === 'breath_gathering',
    'bank depletion did not leave the objective running at ordinary speed');
  const ordinaryFrom = shadow.state.activitySeconds;
  shadow.advance(5);
  await page.clock.runFor(5000);
  const ordinary = await sameAsShadow('five ordinary seconds after the bank emptied');
  assert(ordinary.state.activitySeconds === ordinaryFrom + 5, 'the activity did not return to ordinary speed once the bank was empty');
  await page.locator('[data-ui=stop]').click();
  shadow.stop();
  const idle = await sameAsShadow('stopped before the import checks');

  const second = await context.newPage();
  await second.goto(server.url.toString());
  await second.getByRole('heading', { name: 'Lowbridge is open in another tab' }).waitFor();
  await second.close();

  // Import rejects corruption, then valid import replaces exactly and ignores old export time.
  await offerSaveFile(page, { format: 'not-lowbridge', version: 1 });
  await page.locator('[data-ui=settings-feedback]').waitFor({ state: 'visible' });
  assert(await page.locator('[data-ui=confirmation]').isHidden(), 'an unloadable file still asked to replace the journey');
  assert((await stored(page)).state.activitySeconds === idle.state.activitySeconds, 'bad import changed the saved game');
  const fresh = makeSave(new GameEngine(records).state, records, 1);
  await chooseSaveFile(page, fresh);
  assert((await stored(page)).state.activitySeconds === idle.state.activitySeconds, 'import replaced the journey before confirmation');
  await page.locator('[data-ui=cancel]').click();
  assert((await stored(page)).state.activitySeconds === idle.state.activitySeconds, 'cancelled import replaced the journey');
  await importSave(page, fresh);
  const imported = await stored(page);
  assert(imported.state.activitySeconds === 0 && imported.state.bank.seconds === 0, 'import added offline credit to a snapshot');
  // Asking for confirmation closes the settings menu; export is reached by opening it again.
  await openSettings(page);
  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-ui=export]').click();
  const exported = await downloadEvent;
  await exported.saveAs(join(output, 'fresh-start.json'));
  decodeSave(await Bun.file(join(output, 'fresh-start.json')).text(), records);
  await closeSettings(page);
  await click(page, 'mill_work', 5);
  const corrected = new GameEngine(records);
  for (let count = 0; count < 5; count++) corrected.start('mill_work');
  await page.clock.setSystemTime(new Date('2026-10-17T23:00:00Z'));
  await page.clock.runFor(10_000);
  corrected.advance(10);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  const backwards = await stored(page);
  assert(backwards.state.activitySeconds === corrected.state.activitySeconds && backwards.state.bank.seconds === corrected.state.bank.seconds, 'clock rollback froze activity or autosaving');
  await page.clock.setSystemTime(new Date('2026-10-18T23:00:00Z'));
  await page.clock.runFor(20_000);
  corrected.advance(20);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  const forwards = await stored(page);
  assert(forwards.state.activitySeconds + forwards.state.bank.seconds === 30 && forwards.state.activitySeconds === corrected.state.activitySeconds, 'clock correction counted elapsed time twice');
  reports.push({ name: 'persistence-and-controls', returnVisit: 'pass', bankDepletion: 'pass', objectiveFocus: 'pass', secondTab: 'pass', importConfirmation: 'pass', importExport: 'pass', clockCorrection: 'pass' });

  // A save from the format before derived fields were rebuilt on load is refused, and refusing it changes nothing.
  const current = await stored(page);
  await offerSaveFile(page, { ...fresh, version: SAVE_VERSION - 1 });
  await page.locator('[data-ui=settings-feedback]').waitFor({ state: 'visible' });
  const unchanged = await stored(page);
  assert(unchanged.version === SAVE_VERSION && unchanged.state.activitySeconds === current.state.activitySeconds, 'an outdated save was not refused cleanly');
  await closeSettings(page);

  // Instant chores and purchases must not replace the sustained activity slot.
  const apprenticed = new GameEngine(records);
  for (const id of ['sort_herbs', 'sort_herbs', 'sort_herbs', 'mill_work', 'mill_work', 'shu_apprentice']) assert(apprenticed.start(id).ok, `apprenticed fixture could not ${id}`);
  apprenticed.advance(60);
  for (const id of ['mill_work', 'mill_work', 'jade_slip']) assert(apprenticed.start(id).ok, `apprenticed fixture could not ${id}`);
  apprenticed.stop();
  for (const [id, value] of [['vigor', 10], ['coin', 0]] as const) apprenticed.state.stats[id]!.value = value;
  await importSave(page, makeSave(apprenticed.state, records, 1));
  await closeSettings(page);
  const mat = await revealAction(page, 'practice_mat');
  await page.locator('[data-tab=home]').focus();
  await mat.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  assert(await mat.evaluate(node => node === document.activeElement), 'keyboard focus did not reach a locked action');  assert(await mat.getAttribute('aria-disabled') === 'true' && !await mat.evaluate(node => (node as HTMLButtonElement).disabled), 'a locked action is not focusable with its reason');
  assert(await page.locator('[data-record-details=practice_mat]').isVisible(), 'keyboard focus does not reveal a locked action\'s details');
  assert((await page.locator('[data-record-details=practice_mat] .tip-need').innerText()).includes('Eight coin'), 'locked action does not state its need');
  await mat.evaluate(node => (node as HTMLElement).blur());
  await mat.click({ force: true });
  await page.mouse.move(0, 0);
  assert(!await page.locator('[data-record-details=practice_mat]').isVisible(), 'a mouse click on a locked action leaves its details hanging');
  const work = await revealAction(page, 'mill_work');
  assert(await work.getAttribute('data-action-mode') === 'instant', 'chores are not identified as instant');
  await work.hover();
  assert(await page.locator('[data-record-details=mill_work]').isVisible(), 'hover does not reveal action details');
  assert((await page.locator('[data-record-details=mill_work] .tip-result').innerText()).includes('Coin: 3'), 'chore gains are not disclosed');
  assert((await page.locator('[data-record-details=mill_work] .tip-mod').innerText()).includes('at 20'), 'next repetition threshold is not disclosed');
  // One template: the same labelled blocks render for an action, a store and a knowledge.
  for (const [host, kinds] of [['[data-record-details=mill_work]', ['title', 'type', 'cost', 'result']], ['[data-ui=materials] [data-resource=herbs] .task-tip', ['title', 'type']]] as const) {
    for (const kind of kinds) assert(await page.locator(`${host} .tip-${kind}`).count() === 1, `${host}: the ${kind} tooltip block is missing`);
  }
  await page.mouse.move(0, 0);
  await page.locator('[data-resource=coin]').click();
  assert(await work.evaluate(node => node.classList.contains('is-resource-match')), 'clicking a ledger resource did not highlight its actions');
  await page.keyboard.press('Escape');
  assert(!await work.evaluate(node => node.classList.contains('is-resource-match')), 'Escape did not clear the resource filter');
  // A second shadow, started from the very fixture that was imported, so this phase follows content instead of pinning it.
  const bench = new GameEngine(records, apprenticed.snapshot());
  await work.click(); await work.click(); await work.click();
  for (let count = 0; count < 3; count++) assert(bench.start('mill_work').ok, 'bench could not work the mill');
  const chores = await settled(page, state => state.activitySeconds === bench.state.activitySeconds
    && state.stats.coin!.value === bench.stat('coin').value && state.stats.vigor!.value === bench.stat('vigor').value);
  const choreGap = [
    ['vigor', chores.state.stats.vigor!.value, bench.stat('vigor').value],
    ['coin', chores.state.stats.coin!.value, bench.stat('coin').value],
    ['active', chores.state.active?.id ?? null, bench.snapshot().active?.id ?? null],
    ['activitySeconds', chores.state.activitySeconds, bench.state.activitySeconds],
  ].find(([, seen, expected]) => seen !== expected);
  assert(!choreGap, `instant chores did not pay Vigor for coin at once, or Rest did not start by itself: ${choreGap?.[0]} is ${String(choreGap?.[1])}, not ${String(choreGap?.[2])}`);
  assert(bench.snapshot().active?.id === 'rest', 'the bench fixture did not leave Rest filling the idle slot');
  assert(await page.locator('[data-ui=stop]').isDisabled(), 'Stop is offered for the self-starting Rest');
  await page.clock.runFor(10_000);
  bench.advance(10);
  await click(page, 'practice_mat');
  assert(bench.start('practice_mat').ok, 'bench could not buy the practice mat');
  const purchased = await settled(page, state => state.stats.practice_mat!.value === 1 && state.stats.rest!.ticks === bench.stat('rest').ticks);
  const purchaseGap = [
    ['active', purchased.state.active?.id ?? null, bench.snapshot().active?.id ?? null],
    ['rest ticks', purchased.state.stats.rest!.ticks, bench.stat('rest').ticks],
  ].find(([, seen, expected]) => seen !== expected);
  assert(!purchaseGap, `instant purchase discarded the running activity or its progress: ${purchaseGap?.[0]} is ${String(purchaseGap?.[1])}, not ${String(purchaseGap?.[2])}`);
  assert(purchased.state.stats.coin.value === bench.stat('coin').value && purchased.state.stats.practice_mat.value === 1, 'instant purchase cost or reward was incorrect');
  assert(await page.locator('[data-ui=objective-name]').isVisible(), 'running activity is hidden while viewing Home');
  assert((await page.locator('[data-ui=objective-name]').innerText()) === 'Rest', 'persistent activity slot lost the running task');
  assert((await page.locator('[data-ui=objective-kind] option').allInnerTexts()).includes('Vigor held'), 'Rest offers no Vigor objective');
  // The panel rounds for reading; agreeing with the bench to the second is the point, not the exact wording.
  const eta = bench.timeToObjective();
  const shownEta = await page.locator('[data-ui=active-eta]').innerText();
  const countdown = Number(/(\d+)s left/.exec(shownEta)?.[1]);
  // Under a second the panel says "Finishing" rather than a number; that is the rule, not a missing estimate.
  assert(eta !== undefined && (eta < 1 ? shownEta.includes('Finishing') : Math.abs(countdown - eta) <= 1),
    `the activity panel reads "${shownEta}" against the engine's ${eta}s`);
  await page.screenshot({ path: join(output, 'instant-and-running-desktop.png'), fullPage: true });
  const rest = await revealAction(page, 'rest');
  await rest.click();
  assert((await stored(page)).state.active?.id === 'rest', 'clicking the self-starting Rest stopped it');
  await page.clock.runFor(14_000);
  bench.advance(14);
  const finished = await stored(page);
  assert(finished.state.activitySeconds === bench.state.activitySeconds && Math.abs(finished.state.stats.vigor.value - 10) < 1e-9 && finished.state.active === null, 'Rest did not finish normally after an instant purchase');
  assert(await page.locator('[data-group="done-home"]').isHidden(), 'a Done group shows with nothing done');
  assert(await page.locator('[data-group="done-tasks"] button[data-record-id=shu_apprentice]').count() === 1, 'the apprenticeship is not filed under Done');
  await page.locator('[data-tab=tasks]').click();
  // From here the chores go straight to the button. Reaching for the tab again marks everything on it as
  // seen, which would rub off the New badge this phase exists to check. How many chores it takes to earn
  // the pouch, and how much the next one spills, both come from the bench rather than from pinned numbers.
  const mill = page.locator('button[data-record-id=mill_work]');
  const wage = () => bench.value(recordById.get('mill_work')!.result!.coin!) + bench.stat('mill_work').yield;
  assert(!bench.visible('coin_pouch'), 'the fixture already offers the larger pouch, so nothing becomes new here');
  for (let guard = 0; !bench.visible('coin_pouch') && guard < 80; guard++) {
    if (bench.availability('mill_work').ok) { bench.start('mill_work'); await mill.click(); }
    else { bench.advance(1); await page.clock.runFor(1000); }
  }
  assert(bench.visible('coin_pouch'), 'the mill never earned enough to reveal the larger pouch');
  const pouch = page.locator('button[data-record-id=coin_pouch]');
  await pouch.waitFor();
  assert((await pouch.locator('.task-badge').innerText()) === 'New', 'newly revealed action does not show the New badge');
  // Then earn past what the purse can hold: the chore button has to say what would be thrown away.
  for (let guard = 0; bench.stat('coin').value + wage() <= bench.stat('coin').max && guard < 80; guard++) {
    if (bench.availability('mill_work').ok) { bench.start('mill_work'); await mill.click(); }
    else { bench.advance(1); await page.clock.runFor(1000); }
  }
  // A chore the body cannot pay for shows its reason, not its spill; rest first so the warning is the one under test.
  for (let guard = 0; !bench.availability('mill_work').ok && guard < 120; guard++) { bench.advance(1); await page.clock.runFor(1000); }
  assert(bench.availability('mill_work').ok, 'the mill never became workable again, so no spill warning can show');
  const capped = await settled(page, state => state.stats.coin!.value === bench.stat('coin').value);
  assert(capped.state.stats.coin.value === bench.stat('coin').value, `the purse holds ${capped.state.stats.coin.value}, not the bench's ${bench.stat('coin').value}`);
  const spill = await mill.locator('.task-badge').innerText();
  assert(/^Wastes [\d.]+ Coin$/.test(spill), `a chore paying over a full cap warns "${spill}" rather than naming the waste`);
  await page.locator('button[data-record-id=coin_pouch]').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-group="done-tasks"] button[data-record-id=coin_pouch]').waitFor({ state: 'attached' });
  assert(await page.evaluate(() => document.activeElement?.classList.contains('task-button') === true), 'keyboard focus was lost after a purchase');
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const tab of ['tasks', 'techniques', 'home', 'character']) {
      const button = page.locator(`button[data-tab="${tab}"]`);
      if (await button.isHidden()) continue;
      await button.click();
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${tab}: horizontal overflow at ${width}px`);
    }
  }
  // The spellbook: a technique is dead weight until it holds an attunement slot, and the toggle gives the slot back.
  await page.setViewportSize({ width: 1440, height: 1000 });
  const adept = new GameEngine(records);
  adept.state.stats.coin!.value = 15;
  for (const id of ['sort_herbs', 'sort_herbs', 'sort_herbs', 'coin_pouch']) assert(adept.start(id).ok, `spellbook fixture could not ${id}`);
  adept.state.stats.coin!.value = 11;
  for (const id of ['shu_apprentice', 'jade_slip', 'breath_gathering']) assert(adept.start(id).ok, `spellbook fixture could not ${id}`);
  adept.advance(200);
  adept.stop();
  // Both readings of leaf eight in hand, so taking one up is what closes the other.
  for (const id of ['channel_arrangement', 'sit_fernhollow']) adept.state.stats[id]!.value = 1;
  adept.state.stats.sit_fernhollow!.reps = 1;
  // A granted record is only discovered on the next reconcile, which any action triggers.
  assert(adept.start('sort_herbs').ok, 'spellbook fixture could not settle what it was granted');
  adept.stop();
  for (const id of ['carry_current', 'settle_breath']) assert(adept.visible(id), `spellbook fixture did not reveal ${id}`);
  for (const [id, value] of [['coin', 45], ['timber', 6], ['vigor', 2], ['qi', adept.stat('qi').max]] as const) adept.state.stats[id]!.value = value;
  await importSave(page, makeSave(adept.state, records, 1));
  await closeSettings(page);
  await page.locator('[data-tab=tasks]').focus();
  await page.keyboard.press('ArrowRight');
  assert(await page.locator('[data-tab=techniques]').getAttribute('aria-selected') === 'true', 'the newly opened spellbook is missing from keyboard navigation');
  const breath = page.locator('button[data-record-id=steady_breath]');
  await breath.waitFor({ state: 'visible' });
  const confirmation = page.locator('[data-ui=confirmation]');
  const toggle = page.locator('button[data-attune-id=steady_breath]');
  assert(await toggle.getAttribute('aria-pressed') === 'false', 'a technique starts out attuned');
  assert((await page.locator('[data-ui=attune-count]').innerText()) === 'Attuned 0 / 1', 'the spellbook does not count its empty slots');
  assert(await breath.getAttribute('aria-disabled') === 'true' && (await breath.locator('.task-sub').innerText()).includes('must be attuned'),
    'an unattuned technique is usable, or does not say why not');
  await toggle.click();
  assert(await toggle.getAttribute('aria-pressed') === 'true' && (await page.locator('[data-ui=attune-count]').innerText()) === 'Attuned 1 / 1', 'attuning did not fill the slot');
  assert(await breath.getAttribute('aria-disabled') === null, 'an attuned technique is still refused');
  await breath.click();
  assert((await stored(page)).state.stats.steady_breath.reps === 1, 'an attuned technique did not run');
  await toggle.click();
  assert(await toggle.getAttribute('aria-pressed') === 'false' && (await page.locator('[data-ui=attune-count]').innerText()) === 'Attuned 0 / 1', 'a technique cannot be released');
  assert((await stored(page)).state.attuned.length === 0, 'releasing a technique did not free its slot');

  // Taking up a technique is where its locks fall, so that is where the asking has to happen.
  const rival = page.locator('button[data-record-id=settle_breath]');
  const carry = page.locator('button[data-attune-id=carry_current]');
  assert(await rival.isVisible(), 'the rival reading of leaf eight is not offered before a choice is made');
  await carry.click();
  await confirmation.waitFor({ state: 'visible' });
  assert((await confirmation.innerText()).includes('Settle the breath'), 'attuning does not say which reading it closes');
  await page.locator('[data-ui=cancel]').click();
  assert(await carry.getAttribute('aria-pressed') === 'false' && await rival.isVisible(), 'cancelling an attunement still took it, or still closed its rival');
  await carry.click();
  await page.locator('[data-ui=confirm]').click();
  const chosen = await stored(page);
  assert(chosen.state.attuned.includes('carry_current') && chosen.state.lockedIds.includes('settle_breath'), 'confirming an attunement did not take it and close its rival');
  assert(await rival.isHidden(), 'the closed reading stays in the spellbook');
  await carry.click();

  // A warned action asks first. Cancelling does nothing at all; confirming takes it, and what it closes leaves the grid.
  const beforeWarning = await stored(page);
  const move = await revealAction(page, 'lean_to');
  await move.click();
  await confirmation.waitFor({ state: 'visible' });
  assert((await confirmation.innerText()).includes('closes it for good'), 'the warning does not say what is lost');
  await page.locator('[data-ui=cancel]').click();
  assert(await confirmation.isHidden(), 'cancelling leaves the confirmation open');
  const cancelled = await stored(page);
  assert(cancelled.state.stats.lean_to.value === 0 && cancelled.state.stats.coin.value === beforeWarning.state.stats.coin.value, 'cancelling a warned action still took it');
  assert(await page.locator('button[data-record-id=hayloft]').isVisible(), 'cancelling a warned action closed what it threatened');
  await move.click();
  await page.locator('[data-ui=confirm]').click();
  const moved = await stored(page);
  assert(moved.state.stats.lean_to.value === 1 && moved.state.lockedIds.includes('hayloft'), 'confirming a warned action did not take it');
  assert(await page.locator('button[data-record-id=hayloft]').isHidden(), 'a locked record stays in the grid');

  // A sustained fill task names the store it is filling and leaves the slot the moment that store is full.
  const filling = new GameEngine(records);
  for (let count = 0; count < 5; count++) assert(filling.start('mill_work').ok, 'fill fixture could not work the mill');
  // Spent Vigor pulls Rest into the slot; topping Vigor up behind its back would leave a finished objective saved.
  filling.stop();
  filling.state.stats.vigor!.value = filling.stat('vigor').max;
  filling.state.stats.coin!.value = filling.stat('coin').max - 1;
  await importSave(page, makeSave(filling.state, records, 1));
  await closeSettings(page);
  const shift = await revealAction(page, 'mill_shift');
  await shift.click();
  assert((await page.locator('[data-ui=objective-progress]').innerText()) === 'Until Coin full', 'a fill task does not name the store it runs to');
  await page.clock.runFor(8000);
  const filled = await stored(page);
  assert(filled.state.active === null && filled.state.stats.coin.value === filled.state.stats.coin.max, 'the fill task did not stop at the cap');
  assert((await page.locator('[data-ui=last-stop]').innerText()).includes('objective complete'), 'the activity panel does not say why the fill task left the slot');
  reports.push({ name: 'spellbook-and-warnings', attuneToggle: 'pass', unattunedUnusable: 'pass', warnConfirm: 'pass', warnCancel: 'pass', lockedLeavesGrid: 'pass', fillStopsAtCap: 'pass' });

  // The ridge: the breakthrough panel generalises to a First Direction, Strain shows, and the class and stage follow.
  const ridge = runRidgeRoute('direction-body');
  const ready = runRidgeRoute('direction-body', records, undefined, { maxActions: ridge.actions.findIndex(action => action.id === 'direction_body') });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await importSave(page, makeSave(ready.state, records, 1));
  await closeSettings(page);
  assert(await page.locator('[data-ui=body] [data-resource=strain]').isVisible(), 'the Strain meter is missing after Foundation');
  await page.locator('[data-tab=tasks]').click();
  const direction = page.locator('section.foundation-panel[data-record-id=direction_body]');
  assert(await direction.isVisible() && await page.locator('[data-ui=foundation]').isHidden(), 'the First Direction panel does not replace the Foundation panel');
  assert((await direction.locator('[data-part=count]').innerText()).includes('3 needed'), 'the First Direction panel does not count its supporting signs');
  assert((await direction.locator('[data-part=rewards]').innerText()).includes('Body Disciple'), 'the First Direction panel does not name the standing it grants');
  await direction.locator('[data-part=start]').click();
  // Choosing a direction closes the other three for good, so the panel asks before it begins.
  await confirmIfAsked(page);
  const span = recordById.get('direction_body')!.length;
  assert(typeof span === 'number', 'the First Direction is no longer a timed breakthrough');
  await page.clock.runFor((span + 1) * 1000);
  const directed = await stored(page);
  assert(directed.state.stats.body_disciple!.value === 1 && directed.state.lockedIds.includes('direction_sword'), 'the First Direction did not grant its class or close the others');
  assert((await page.locator('[data-ui=character-stage]').innerText()) === 'Body Disciple · Foundation', 'the class title is not shown');
  assert((await page.locator('[data-ui=completion-title]').innerText()).includes('Body Disciple'), 'the completion banner does not name the direction');
  await page.locator('[data-ui=completion-dismiss]').click();
  assert(await page.locator('[data-ui=completion]').isHidden(), 'the completion banner cannot be dismissed');
  await importSave(page, makeSave(ridge.state, records, 1));
  await closeSettings(page);
  assert((await page.locator('[data-ui=stage]').innerText()) === 'The ridge', 'the stage label does not reach the ridge');
  await page.locator('[data-tab=character]').click();
  assert(await page.locator('[data-ui=leads] li:visible').count() === 3, 'the waystation leads are not listed');
  await page.screenshot({ path: join(output, 'ridge-waystation-desktop.png'), fullPage: true });
  reports.push({ name: 'ridge', directionPanel: 'pass', strainMeter: 'pass', classTitle: 'pass', stageLabel: 'pass', waystationLeads: 'pass' });

  reports.push({ name: 'action-workspace', instantChores: 'pass', autoRest: 'pass', lockedKeyboardDetails: 'pass', hoverDetails: 'pass', purchasePreservesActivity: 'pass',
    objectiveEta: 'pass', persistentActivityAcrossTabs: 'pass', outdatedImportRefused: 'pass', capWasteBadge: 'pass', doneGroupFocus: 'pass', tabWidths: [1440, 768, 390] });
  await context.close();
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`);
  await Bun.write(join(output, 'smoke-results.json'), JSON.stringify({ browser: await browser.version(), reports, errors }, null, 2));
  console.log('Browser persistence, bank, focus, second-tab and import/export PASS');
} finally {
  await browser.close();
  server.stop(true);
}
