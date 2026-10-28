import { describe, expect, test } from 'bun:test';
import { GameEngine } from '../src/engine';
import { decodeSave, makeSave, SAVE_FORMAT, SAVE_VERSION, type SaveFile } from '../src/persistence';
import type { GameRecord, Stat } from '../src/types';
import { villageRecords } from './fixtures/worlds';
import outdated from './fixtures/v5-save.json';

const records = villageRecords;
const save = (game: GameEngine, savedAt = 1000) => makeSave(game.state, records, savedAt);
const reload = (file: unknown) => decodeSave(file, records);

/** A life with a knowledge, a purchase, a technique attuned, a locked chapter and a running trip. */
function lived(): GameEngine {
  const game = new GameEngine(records);
  game.start('reading', { kind: 'level', id: 'lore', target: 2 });
  game.advance(180);
  game.stat('coin').value = 10;
  expect(game.start('pouch').ok).toBe(true);
  game.stat('coin').value = 10;
  expect(game.start('focus_charm').ok).toBe(true);
  expect(game.attune('ember_form').ok).toBe(true);
  game.stat('qi').value = 4;
  expect(game.start('gather').ok).toBe(true);
  game.advance(4.25);
  return game;
}

describe('version 7 delta saves', () => {
  test('a roundtrip restores the same life, deriving every cap and rate again on the way in', () => {
    const game = lived();
    const decoded = reload(JSON.stringify(save(game)));
    expect(decoded.state).toEqual(game.state);
    expect(decoded.save.version).toBe(SAVE_VERSION);
    const loaded = new GameEngine(records, decoded.state);
    expect(loaded.stat('coin').max).toBe(24);
    expect(loaded.stat('attune_slots')).toMatchObject({ value: 1, max: 2 });
    expect(loaded.state.active).toMatchObject({ id: 'gather', progress: 4 });
    loaded.advance(6);
    expect(loaded.stat('gather').reps).toBe(1);
  });

  test('only what the character did is written: no caps, rates or untouched records', () => {
    const game = lived();
    const file = save(game);
    const fields = new Set(Object.values(file.items).flatMap(item => Object.keys(item)));
    for (const derived of ['max', 'rate', 'open', 'length', 'yield', 'discount']) expect([...fields]).not.toContain(derived);
    // The pouch only ever changed the purse, so the file remembers that it was bought and nothing else.
    expect(file.items.pouch).toEqual({ value: 1, reps: 1, started: true, seen: true });
    // Most of the file is a visibility bitmap; a record still behind its gate is absent entirely.
    expect(file.items.ash_form).toEqual({ seen: true });
    expect(Object.hasOwn(file.items, 'turn_back')).toBe(false);
    expect(file.attuned).toEqual(['ember_form']);
    expect(file.bank).toBe(game.state.bank.seconds);
  });

  test('a locked chapter and the waiting list survive the roundtrip', () => {
    const game = new GameEngine(records);
    expect(game.start('breath', { kind: 'level', id: 'lore', target: 4 }).ok).toBe(true);
    expect(game.queue('walk').ok).toBe(true);
    expect(game.start('move_on').ok).toBe(true);
    const file = save(game);
    expect(file.items.hayloft).toMatchObject({ locked: true });
    const loaded = new GameEngine(records, reload(file).state);
    expect(loaded.locked('gather')).toBe(true);
    expect(loaded.visible('gather')).toBe(false);
    expect(loaded.homeSlots()).toEqual([]);
    expect(loaded.state.waiting.map(entry => entry.id)).toEqual(['walk']);
  });

  test('content can grow and shrink under a save: new records start fresh, departed ids are skipped', () => {
    const game = lived();
    const file = JSON.parse(JSON.stringify(save(game))) as SaveFile;
    file.items.a_record_that_left = { value: 3, seen: true };
    const grown: GameRecord[] = [...records, { id: 'late_charm', kind: 'purchase', name: 'Late charm', mod: { 'coin.max': 5 } }];
    const loaded = new GameEngine(grown, decodeSave(file, grown).state);
    expect(loaded.stat('late_charm')).toMatchObject({ value: 0, max: 1 });
    expect(loaded.visible('late_charm')).toBe(true);
    expect(loaded.stat('coin').max).toBe(24);
    expect(Object.hasOwn(decodeSave(file, grown).save.items, 'a_record_that_left')).toBe(false);
  });

  test('a trip running past a length content has since shortened is held just short of it, not refused', () => {
    const shorter = records.map(record => record.id === 'gather' ? { ...record, length: 2 } : record);
    const decoded = decodeSave(save(lived()), shorter);
    expect(decoded.state.active).toMatchObject({ id: 'gather', progress: 1 });
    const loaded = new GameEngine(shorter, decoded.state);
    loaded.advance(1);
    expect(loaded.stat('gather').reps).toBe(1);
  });

  test('stopped progress past a shortened length is held just short of it, so resuming finishes the run once', () => {
    const game = lived();
    expect(game.stop().ok).toBe(true);
    const shorter = records.map(record => record.id === 'gather' ? { ...record, length: 2 } : record);
    const decoded = decodeSave(save(game), shorter);
    expect(decoded.state.stats.gather).toMatchObject({ exp: 1, paid: true });
    expect(decoded.save.items.gather).toMatchObject({ exp: 1 });
    const loaded = new GameEngine(shorter, decoded.state);
    expect(loaded.start('gather', { kind: 'repetitions', id: 'gather', target: 3 }).ok).toBe(true);
    loaded.advance(1);
    expect(loaded.stat('gather').reps).toBe(1);
  });

  test('a modifier added to content after the save is owed to the levels already earned', () => {
    const game = new GameEngine(records);
    game.start('reading', { kind: 'level', id: 'lore', target: 3 });
    game.advance(360);
    expect(game.stat('lore').value).toBe(3);
    const file = save(game);
    const generous = records.map(record => record.id === 'lore' ? { ...record, perLevel: { 'coin.max': 4 } } : record);
    expect(new GameEngine(generous, decodeSave(file, generous).state).stat('coin').max).toBe(22);
  });

  test('a save from a format before this one is refused by name', () => {
    expect(outdated.version).toBe(5);
    expect(() => reload(outdated)).toThrow(/version 5/);
    expect(() => reload(outdated)).toThrow(/start a new journey/);
    const six = { ...save(new GameEngine(records)), version: 6 } as Record<string, unknown>;
    delete six.hobby; delete six.effects;
    expect(() => reload(six)).toThrow(/version 6/);
    expect(() => reload({ ...save(new GameEngine(records)), version: SAVE_VERSION + 1 })).toThrow(/newer than this build/);
  });

  test('the hobby and the preparations in effect round-trip, and nonsense in them is refused', () => {
    const world: GameRecord[] = [...records,
      { id: 'hobby_slots', kind: 'resource', initial: { max: 1, open: true } },
      { id: 'drill', kind: 'task', length: 'continuous', hobby: true, train: 'lore', effect: { 'lore.exp': 1 } },
      { id: 'draught', kind: 'preparation', cost: { herbs: 1 }, lasts: 40, held: { 'coin.max': 5 } },
    ];
    const game = new GameEngine(world);
    game.stat('herbs').value = 2;
    expect(game.start('draught').ok).toBe(true);
    expect(game.startHobby('drill').ok).toBe(true);
    expect(game.start('reading').ok).toBe(true);
    game.advance(10);
    const file = makeSave(game.state, world, 1000);
    expect(file).toMatchObject({ version: 7, hobby: 'drill', effects: [{ id: 'draught', remaining: 30 }] });
    const decoded = decodeSave(JSON.stringify(file), world);
    expect(decoded.state).toEqual(game.state);
    expect((decoded.state.stats.coin as Stat).max).toBe(game.stat('coin').max);
    const copy = () => JSON.parse(JSON.stringify(file)) as Record<string, unknown>;
    const bad = (mutate: (save: Record<string, unknown>) => void, message: RegExp) => {
      const broken = copy();
      mutate(broken);
      expect(() => decodeSave(broken, world)).toThrow(message);
    };
    bad(save => { save.effects = [{ id: 'reading', remaining: 5 }]; }, /not a lasting preparation/);
    bad(save => { save.effects = [{ id: 'draught', remaining: 0 }]; }, /no time left/);
    bad(save => { save.effects = [{ id: 'draught', remaining: 5 }, { id: 'draught', remaining: 6 }]; }, /in effect twice/);
    bad(save => { save.hobby = 'reading'; }, /hobby is invalid/);
    bad(save => { save.hobby = 'drill'; save.active = { id: 'drill', progress: 0, objective: { kind: 'level', id: 'lore', target: 3 } }; }, /also the running activity/);
  });

  test('corrupt files are refused before anything is replaced', () => {
    const game = lived();
    const before = game.snapshot();
    const copy = () => JSON.parse(JSON.stringify(save(game))) as Record<string, unknown>;
    const items = (change: (value: Record<string, Record<string, unknown>>) => void) => {
      const file = copy();
      change(file.items as Record<string, Record<string, unknown>>);
      return file;
    };
    const broken: unknown[] = [
      '{broken', { version: SAVE_VERSION }, { ...copy(), format: 'not-lowbridge' },
      { ...copy(), savedAt: -1 }, { ...copy(), bank: -1 }, { ...copy(), activitySeconds: 'soon' },
      { ...copy(), wallRemainder: 1 }, { ...copy(), items: [] }, { ...copy(), log: [{ id: 1, kind: 'rumour', text: 'x', activitySeconds: 0 }] },
      items(value => { value.coin!.colour = 'green'; }),
      items(value => { value.lore!.value = 1.5; }),
      items(value => { value.lore!.exp = 9999; }),
      items(value => { value.gather!.reps = 0.5; }),
      items(value => { value.chore = { paid: true }; }),
      { ...copy(), active: { id: 'chore', progress: 2, objective: { kind: 'repetitions', id: 'chore', target: 1 } } },
      { ...copy(), active: { id: 'gather', progress: -1, objective: { kind: 'repetitions', id: 'gather', target: 1 } } },
      { ...copy(), active: { id: 'gather', progress: 2, objective: { kind: 'level', id: 'coin', target: 1 } } },
      { ...copy(), active: { id: 'gather', progress: 2, objective: { kind: 'repetitions', id: 'walk', target: 1 } } },
      { ...copy(), waiting: [{ id: 'walk', progress: 5, objective: { kind: 'repetitions', id: 'walk', target: 1 } }] },
      { ...copy(), waiting: [0, 1].map(() => ({ id: 'walk', progress: 0, objective: { kind: 'repetitions', id: 'walk', target: 1 } })) },
      { ...copy(), waiting: ['walk', 'reading', 'breath', 'rest', 'ember_form', 'ash_form', 'chore'].map(id => ({ id, progress: 0, objective: { kind: 'repetitions', id, target: 1 } })) },
    ];
    for (const value of broken) expect(() => reload(value)).toThrow();
    expect(game.state).toEqual(before);
  });

  test('a running trip that never paid its entry is refused', () => {
    const game = lived();
    const file = JSON.parse(JSON.stringify(save(game))) as SaveFile;
    delete file.items.gather!.paid;
    expect(() => reload(file)).toThrow(/has not paid its entry/);
  });

  test('acceleration survives a reload only while something is running to spend it on', () => {
    const game = lived();
    game.state.bank.seconds = 100;
    expect(game.setAccelerating(true).ok).toBe(true);
    const file = save(game);
    expect(file.accelerating).toBe(true);
    expect(reload(file).state.bank).toMatchObject({ seconds: 100, accelerating: true });
    expect(() => reload({ ...file, active: null })).toThrow(/nothing running/);
    expect(reload({ ...file, bank: 0 }).state.bank.accelerating).toBe(false);
  });

  test('a balance larger than the derived bank is clamped, not refused', () => {
    const game = new GameEngine(records);
    const file = { ...save(game), bank: 99_999 };
    expect(reload(file).state.bank).toEqual({ seconds: 3600, cap: 3600, accelerating: false });
  });

  test('export is a snapshot, so continuing the game cannot change the file being written', () => {
    const game = new GameEngine(records);
    const exported = save(game);
    game.advance(100);
    expect(exported.bank).toBe(0);
    expect(game.state.bank.seconds).toBe(100);
    expect(exported.format).toBe(SAVE_FORMAT);
  });

  test('a fresh life writes almost nothing, and reloading it is the same fresh life', () => {
    const game = new GameEngine(records);
    const file = save(game);
    expect(Object.keys(file.items).every(id => Object.keys(file.items[id]!).join() === 'seen')).toBe(true);
    const decoded = reload(file);
    expect(decoded.state).toEqual(game.state);
    expect((decoded.state.stats.lore as Stat).max).toBe(4);
  });
});
