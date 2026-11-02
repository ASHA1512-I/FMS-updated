const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const route = fs.readFileSync(path.join(root, 'src', 'routes-data.ts'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations', '006_weigh_in_history_index.sql'), 'utf8');

test('weigh-ins lock the animal and preserve the newest current weight', () => {
  assert.match(route, /await connection\.beginTransaction\(\)/);
  assert.match(route, /SELECT id FROM animals WHERE id = \? FOR UPDATE/);
  assert.match(route, /SELECT measured_at FROM weigh_ins WHERE animal_id = \? ORDER BY measured_at DESC, id DESC LIMIT 1 FOR UPDATE/);
  assert.match(route, /INSERT INTO weigh_ins \(animal_id, weight_kg, measured_at, note, recorded_by_id\)/);
  assert.match(route, /currentWeightUpdated = !latest \|\| new Date\(measuredAt\)\.getTime\(\) >= new Date\(latest\.measured_at\)\.getTime\(\)/);
  assert.match(route, /await connection\.commit\(\)/);
  assert.match(route, /await connection\.rollback\(\)/);
});

test('weigh-in lookup has an animal and date index', () => {
  assert.match(migration, /ADD INDEX `weigh_ins_animal_measured_at` \(`animal_id`, `measured_at`\)/);
});
