const test = require('node:test');
const assert = require('node:assert/strict');

const { app } = require('../dist/app');
const { pool } = require('../dist/db');

let server;
let baseUrl;

test.before(async () => {
  server = await new Promise(resolve => {
    const instance = app.listen(0, () => resolve(instance));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await pool.end();
});

test('migrated seeded database accepts the isolated manager account', async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'manager', password: process.env.SEED_MANAGER_PASSWORD }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    user: { id: 2, username: 'manager', name: 'Peter Okello', role: 'manager', sessionVersion: 1 },
  });
});
