const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const route = fs.readFileSync(path.join(root, 'src', 'routes-data.ts'), 'utf8');
const client = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations', '005_transaction_idempotency.sql'), 'utf8');

test('finance creation requires a UUID idempotency key and reuses the original record', () => {
  assert.match(route, /const transactionSchema = z\.object\([\s\S]*idempotencyKey: z\.string\(\)\.uuid\(\)/);
  assert.match(route, /await connection\.beginTransaction\(\)/);
  assert.match(route, /INSERT INTO transactions \(transaction_date, description, type, amount, recorded_by_id, idempotency_key\)/);
  assert.match(route, /ER_DUP_ENTRY/);
  assert.match(route, /SELECT id FROM transactions WHERE recorded_by_id = \? AND idempotency_key = \? LIMIT 1/);
  assert.match(route, /idempotent: true/);
});

test('database schema makes each staff request key unique', () => {
  assert.match(migration, /ADD COLUMN `idempotency_key` CHAR\(36\) NULL/);
  assert.match(migration, /ADD UNIQUE INDEX `transactions_recording_idempotency` \(`recorded_by_id`, `idempotency_key`\)/);
});

test('finance form blocks double taps and retains its key for a retry', () => {
  assert.match(client, /let transactionRequestInFlight = false/);
  assert.match(client, /function createTransactionIdempotencyKey\(\)/);
  assert.match(client, /if\(transactionRequestInFlight\) return/);
  assert.match(client, /idempotencyKey:transactionIdempotencyKey/);
  assert.match(client, /transactionRequestInFlight = true/);
  assert.match(client, /finally\{ transactionRequestInFlight = false; setTransactionRequestBusy\(false\); \}/);
});
