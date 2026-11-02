const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const route = fs.readFileSync(path.join(root, 'src', 'routes-data.ts'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations', '004_one_open_time_log_per_employee.sql'), 'utf8');

test('clock endpoint uses explicit idempotent actions under a user-row transaction lock', () => {
  assert.match(route, /clockActionSchema = z\.object\(\{ action: z\.enum\(\['clock_in', 'clock_out'\]\) \}\)/);
  assert.match(route, /await connection\.beginTransaction\(\)/);
  assert.match(route, /FROM users WHERE id = \? AND is_active = 1 FOR UPDATE/);
  assert.match(route, /FROM time_logs WHERE employee_id = \? AND clock_out_time IS NULL[\s\S]*FOR UPDATE/);
  assert.match(route, /alreadyClockedIn: true/);
  assert.match(route, /alreadyClockedOut: true/);
});

test('database schema permits at most one open shift per employee', () => {
  assert.match(migration, /open_employee_id/);
  assert.match(migration, /GENERATED ALWAYS AS/);
  assert.match(migration, /ADD UNIQUE INDEX `time_logs_one_open_shift` \(`open_employee_id`\)/);
});
