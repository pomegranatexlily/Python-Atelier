'use strict';
// Dependency-free behavioral checks for the phone-first learning ledger.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app/learning-storage.js', 'utf8');

let sequence = 0;
function setup() {
  const values = new Map();
  const localStorage = {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, val) => { values.set(key, String(val)); },
    removeItem: key => { values.delete(key); }
  };
  const ctx = {
    window: {}, localStorage, navigator: {},
    crypto: {randomUUID: () => 'test-' + ++sequence},
    structuredClone, Date, Math, Promise, console
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(source, ctx, {filename:'app/learning-storage.js'});
  assert(ctx.window.AtelierLearningStore, 'The browser learning store must initialize');
  return {api:ctx.window.AtelierLearningStore, localStorage};
}

(async () => {
  const {api:s,localStorage} = setup();
  assert.equal(s.readState().revision, 0);
  assert.equal(s.deriveSeedTotals([]).seedBalance, 0);

  const completion = s.rewardEvent('challenge-a', 'completion');
  const reflection = s.rewardEvent('challenge-a', 'reflection');
  const draft = s.emptyState();
  assert.equal(s.appendEvent(draft, completion), true);
  assert.equal(s.appendEvent(draft, completion), false, 'Repeated completion must not double-pay');
  assert.equal(draft.seedLedger.length, 1);
  assert.throws(() => s.validateState({...draft,seedLedger:[completion,completion]}), /duplicate seed event/i);
  assert.throws(() => s.gardenEvent(0, 'garden-investment:x'), /positive whole number/i);
  assert.throws(() => s.gardenEvent(2, 'not-a-garden-tx'), /transaction ID/i);

  const mutations = [
    s.mutate(state => s.appendEvent(state, completion)),
    s.mutate(state => s.appendEvent(state, reflection)),
    s.mutate(state => s.appendEvent(state, completion))
  ];
  await Promise.all(mutations);
  const earned = s.readState();
  assert.equal(earned.seedLedger.length, 2, 'Concurrent transactions must remain idempotent');
  assert.equal(s.deriveSeedTotals(earned.seedLedger).seedBalance, 7);
  assert.equal(earned.revision, 3, 'Every serialized commit has one version increment');

  await s.mutate(state => s.appendEvent(state, s.gardenEvent(5, 'garden-investment:one')));
  const afterDebit = s.readState();
  assert.equal(s.deriveSeedTotals(afterDebit.seedLedger).seedBalance, 2);
  const previousVersion = afterDebit.revision;
  await assert.rejects(
    s.mutate(state => s.appendEvent(state, s.gardenEvent(99, 'garden-investment:overdraft'))),
    /negative balance/i
  );
  assert.equal(s.readState().revision, previousVersion, 'Rejected overdraft cannot be persisted');
  assert.equal(s.readState().seedLedger.length, 3);

  const backup = s.createBackup();
  assert.equal(s.validateBackup(backup).seedLedger.length, 3);
  await assert.rejects(s.importIntoEmpty(backup), /already exists/i);
  const restored = setup().api;
  const receipt = await restored.importIntoEmpty(backup);
  assert.equal(receipt.result.ledgerEvents, 3);
  assert.equal(restored.deriveSeedTotals(restored.readState().seedLedger).seedBalance, 2);
  await assert.rejects(restored.importIntoEmpty(backup), /already exists/i);
  assert.throws(() => restored.validateBackup({...backup,format:'untrusted'}), /not a python atelier learning backup/i);

  const stored = s.STORAGE_KEY;
  localStorage.setItem(stored, '{invalid json');
  assert.throws(() => s.readState(), /malformed/i, 'Corrupt storage must not be silently erased');
  console.log('Python Atelier learning ledger: duplicate, concurrent, overdraft, restore and corruption regression checks passed.');
})().catch(err => {console.error(err); process.exitCode=1;});
