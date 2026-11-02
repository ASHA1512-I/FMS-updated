const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const route = fs.readFileSync(path.join(root, 'src', 'routes-jobs.ts'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations', '007_job_idempotency.sql'), 'utf8');
const frontend = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

test('job creation requires a UUID request key and reuses the original job', () => {
  assert.match(route, /idempotencyKey: z\.string\(\)\.uuid\(\)/);
  assert.match(route, /INSERT INTO jobs .*idempotency_key/);
  assert.match(route, /ER_DUP_ENTRY/);
  assert.match(route, /SELECT id FROM jobs WHERE created_by_id = \? AND idempotency_key = \? LIMIT 1/);
  assert.match(route, /idempotent: true/);
});

test('database schema makes each creator request key unique', () => {
  assert.match(migration, /ADD COLUMN `idempotency_key` CHAR\(36\) NULL/);
  assert.match(migration, /ADD UNIQUE INDEX `jobs_creator_idempotency` \(`created_by_id`, `idempotency_key`\)/);
});

test('job form blocks double taps and retains its request key for a retry', () => {
  assert.match(frontend, /let jobRequestInFlight = false/);
  assert.match(frontend, /if\(jobRequestInFlight\) return/);
  assert.match(frontend, /id="addJobButton"/);
  assert.match(frontend, /idempotencyKey:jobIdempotencyKey/);
});
