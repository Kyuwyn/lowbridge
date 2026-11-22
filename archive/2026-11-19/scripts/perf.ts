import { chromium } from 'playwright';
import { join } from 'node:path';
import { startServer } from './serve';

/**
 * Measures the running game's main-thread cost in Chromium against ADR 0039's budgets: the late-game
 * save in `playtest/second-direction.json`, left idle, under a CPU throttle that stands in for a
 * mid-range laptop. Nothing runs in that save, so the waiting-list runway probe is not exercised.
 * Reports; it is not a release gate. Exits 1 only when a regression ceiling is broken.
 *
 * Usage: bun run perf [throttle=4] [seconds=70]
 */
const throttle = Number(process.argv[2] ?? 4);
const seconds = Number(process.argv[3] ?? 70);
/** ADR 0039, at 4× throttle. Targets are where the game should be; ceilings are what it must not pass. */
const TARGET_TICK_MS = 50, TARGET_LONGEST_MS = 200, TARGET_BUSY_MS_PER_S = 100;
const CEILING_BUSY_MS_PER_S = 330, CEILING_LONGEST_MS = 1200;

const save = JSON.parse(await Bun.file(join(import.meta.dir, '../playtest/second-direction.json')).text());
const server = await startServer(0);
const browser = await chromium.launch({ headless: true });
let broken = false;
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const long: number[] = (window as unknown as { __long: number[] }).__long = [];
    new PerformanceObserver(list => { for (const entry of list.getEntries()) long.push(Math.round(entry.duration)); })
      .observe({ type: 'longtask', buffered: true });
  });
  await page.goto(server.url.href);
  if (await page.locator('.settings').getAttribute('open') === null) await page.locator('.settings > summary').click();
  await page.locator('[data-ui=file]').setInputFiles({ name: 'perf.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(save)) });
  await page.locator('[data-ui=confirm]').click();
  await page.waitForFunction(() => !document.querySelector<HTMLButtonElement>('[data-ui=export]')?.disabled);
  await page.locator('.settings > summary').click();
  await page.waitForTimeout(3000);
  await page.evaluate(() => { (window as unknown as { __long: number[] }).__long.length = 0; });

  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
  const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(metric => [metric.name, metric.value]));
  const before = await metrics();
  await page.waitForTimeout(seconds * 1000);
  const after = await metrics();
  const long = await page.evaluate(() => [...(window as unknown as { __long: number[] }).__long]);

  const perSecond = (name: string) => (after[name]! - before[name]!) / seconds * 1000;
  const busy = perSecond('TaskDuration'), longest = Math.max(0, ...long);
  console.log(`${seconds} s idle with the second-direction save, CPU throttle ${throttle}×`);
  console.log(`main thread busy ${busy.toFixed(1)} ms/s (script ${perSecond('ScriptDuration').toFixed(1)}, layout ${perSecond('LayoutDuration').toFixed(1)}, style ${perSecond('RecalcStyleDuration').toFixed(1)})`);
  console.log(`long tasks (≥50 ms): ${long.length}; longest ${longest} ms; DOM nodes ${after.Nodes}; JS heap ${(after.JSHeapUsedSize! / 1048576).toFixed(1)} MB`);
  if (throttle === 4) {
    // A tick over TARGET_TICK_MS is a long task, so "no long tasks" is how the tick target is measured.
    console.log(`targets: a tick ≤ ${TARGET_TICK_MS} ms, so no long tasks (${long.length === 0 ? 'met' : `missed: ${long.length}`}); longest ≤ ${TARGET_LONGEST_MS} ms (${longest <= TARGET_LONGEST_MS ? 'met' : 'missed'}); busy ≤ ${TARGET_BUSY_MS_PER_S} ms/s (${busy <= TARGET_BUSY_MS_PER_S ? 'met' : 'missed'})`);
    broken = busy > CEILING_BUSY_MS_PER_S || longest > CEILING_LONGEST_MS;
    console.log(`ceilings: busy ≤ ${CEILING_BUSY_MS_PER_S} ms/s, longest ≤ ${CEILING_LONGEST_MS} ms: ${broken ? 'BROKEN' : 'held'}`);
  } else console.log('budgets are stated at 4× throttle; this run is informational');
} finally {
  await browser.close();
  server.stop(true);
}
if (broken) process.exit(1);
