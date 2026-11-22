import { records } from './content';
import { GameEngine } from './engine';
import { createUI, type LowbridgeUI } from './ui';
import { decodeSave, makeSave, SaveStore, type SaveFile } from './persistence';
import type { GameState } from './types';

const app = document.querySelector<HTMLElement>('#app')!;

function message(title: string, text: string) {
  app.replaceChildren();
  const section = document.createElement('section');
  section.className = 'startup-message';
  const heading = document.createElement('h1');
  heading.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  section.append(heading, paragraph);
  app.append(section);
  return section;
}

function download(save: SaveFile, state: GameState) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `lowbridge-${(state.stats.foundation?.value ?? 0) > 0 ? 'foundation' : 'village'}-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function boot() {
  let store: SaveStore | null = null;
  let loadedState: GameState | null = null;
  let savedAt: number | null = null;
  let status = 'Saved on this device';
  try { store = await SaveStore.open(); }
  catch (error) { status = `Autosave unavailable. Export to keep this visit. ${String(error)}`; }
  if (store) {
    try {
      const loaded = await store.load(records);
      loadedState = loaded.decoded?.state ?? null;
      savedAt = loaded.decoded?.save.savedAt ?? null;
      if (loaded.recovered) status = 'Recovered the previous save';
    } catch (error) {
      await new Promise<void>(resolve => {
        const section = message('Your saved journey needs attention', String(error));
        const label = document.createElement('label');
        label.textContent = 'Import a Lowbridge save ';
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.json,application/json';
        label.append(input);
        const feedback = document.createElement('p');
        feedback.setAttribute('role', 'status');
        input.addEventListener('change', async () => {
          try {
            const file = input.files?.[0];
            if (!file) return;
            if (file.size > 5_000_000) throw new Error('This save is too large.');
            loadedState = decodeSave(await file.text(), records).state;
            savedAt = Date.now();
            resolve();
          } catch (error) { feedback.textContent = String(error); }
        });
        const fresh = document.createElement('button');
        fresh.textContent = 'Start a new journey';
        fresh.addEventListener('click', () => {
          if (confirm('Replace the unreadable save with a new journey in Lowbridge?')) resolve();
        });
        section.append(label, fresh, feedback);
      });
    }
  }

  let engine = new GameEngine(records, loadedState ?? undefined);
  const returnedAt = Date.now();
  const awaySeconds = Math.max(0, returnedAt - (savedAt ?? returnedAt)) / 1000;
  const lastLogId = engine.state.log.at(-1)?.id ?? 0;
  const before: Record<string, number> = {};
  for (const [id, stat] of Object.entries(engine.state.stats)) { before[id] = stat.value; before[`${id}.reps`] = stat.reps; }
  const settled = engine.advance(awaySeconds);
  let anchor = returnedAt;
  let activityClock = performance.now();
  let lastSaveAt = activityClock;
  let writes = Promise.resolve();
  let ui: LowbridgeUI;

  function settle() {
    const now = performance.now();
    engine.advance(Math.max(0, now - activityClock) / 1000);
    activityClock = now;
    anchor = Date.now();
  }

  function persist() {
    if (!store) { ui?.render(status); return writes; }
    const snapshot = makeSave(engine.state, records, anchor);
    lastSaveAt = performance.now();
    const target = store;
    writes = writes.then(() => target.write(snapshot, records)).then(() => {
      status = 'Saved on this device';
      ui?.render(status);
    }).catch(error => {
      status = `Autosave failed. Export to keep this visit. ${String(error)}`;
      ui?.render(status);
    });
    return writes;
  }

  function replace(next: GameEngine) {
    engine = next;
    anchor = Date.now();
    activityClock = performance.now();
    ui.setEngine(engine);
    ui.render(status);
    return persist();
  }

  settle();
  ui = createUI(engine, {
    beforeChange: settle,
    onChange: () => { void persist(); },
    onExport: () => { settle(); download(makeSave(engine.state, records, anchor), engine.state); ui.render(status); },
    readImport: async (file: File) => {
      if (file.size > 5_000_000) throw new Error('This save is too large.');
      return decodeSave(await file.text(), records).state;
    },
    onImport: async (state: GameState) => {
      await replace(new GameEngine(records, state));
    },
    onNewGame: async () => {
      await replace(new GameEngine(records));
    },
  });
  ui.render(status);
  if (awaySeconds >= 60) {
    ui.showReturn({ awaySeconds, ...settled, before, entries: engine.state.log.filter(entry => entry.id > lastLogId) });
  }
  await persist();

  const ticker = setInterval(() => {
    try {
      const active = engine.state.active;
      settle();
      ui.render(status);
      if ((active && !engine.state.active) || performance.now() - lastSaveAt >= 5000) void persist();
    } catch (error) {
      // A content or engine fault must not freeze the page silently; the last good save stays on disk.
      clearInterval(ticker);
      status = `The simulation stopped: ${error instanceof Error ? error.message : String(error)} Export your save and reload.`;
      ui.render(status);
    }
  }, 1000);
  document.addEventListener('visibilitychange', () => {
    settle(); ui.render(status); void persist();
  });
  window.addEventListener('pagehide', () => { settle(); void persist(); });
}

// A tab owns the journey until it closes. No duplicate ticking or save races.
if (navigator.locks) {
  void navigator.locks.request('lowbridge-active-journey', { ifAvailable: true }, async lock => {
    if (!lock) {
      const section = message('Lowbridge is open in another tab', 'Close that tab, then return here to continue the same journey.');
      const button = document.createElement('button');
      button.textContent = 'Continue here';
      button.addEventListener('click', () => location.reload());
      section.append(button);
      return;
    }
    try { await boot(); await new Promise<void>(() => {}); }
    catch (error) { message('Lowbridge could not open', String(error)); }
  });
} else {
  message('This browser cannot keep the journey safe', 'Lowbridge needs browser storage and Web Locks. Open it in a current desktop browser.');
}
