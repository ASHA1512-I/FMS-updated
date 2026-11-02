const test = require('node:test');
const assert = require('node:assert/strict');

const { app } = require('../dist/app');

let server;
let baseUrl;

test.before(async () => {
  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test('health endpoint reports an available API', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', service: 'farm-manager-api' });
});

test('frontend remains available from the API server', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Farm Manager/);
});

test('unauthenticated sessions return a null user', async () => {
  const response = await fetch(`${baseUrl}/api/me`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, user: null });
});

test('login validates the request before accessing the database', async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: '', password: '' }),
  });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('self-service password reset is retired', async () => {
  const response = await fetch(`${baseUrl}/api/auth/reset/identify`, { method: 'POST' });
  assert.equal(response.status, 410);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'RESET_DISABLED');
});