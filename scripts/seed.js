const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Demo passwords can be overridden per account via environment variables so a
// shared/staging database is never seeded with the well-known defaults.
// e.g. SEED_ADMIN_PASSWORD=... SEED_MANAGER_PASSWORD=... npm run db:seed
const DEFAULTS = { admin: 'admin123', manager: 'manager123', accountant: 'acc123', worker: 'worker123' };

async function seed() {
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'farm_manager',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});
const normalizeAnswer = value => String(value).trim().toLowerCase();
const users = [
  { username: 'admin', name: 'Grace Nakato', password: process.env.SEED_ADMIN_PASSWORD || DEFAULTS.admin, role: 'admin', department: 'Management', question: "Name of the farm's founder?", answer: 'milc' },
  { username: 'manager', name: 'Peter Okello', password: process.env.SEED_MANAGER_PASSWORD || DEFAULTS.manager, role: 'manager', department: 'Operations', question: 'First crop grown on the farm?', answer: 'maize' },
  { username: 'accountant', name: 'Sarah Namuli', password: process.env.SEED_ACCOUNTANT_PASSWORD || DEFAULTS.accountant, role: 'accountant', department: 'Finance', question: "Farm's nearest town?", answer: 'mukono' },
  { username: 'worker', name: 'James Otieno', password: process.env.SEED_WORKER_PASSWORD || DEFAULTS.worker, role: 'worker', department: 'Livestock', question: 'Name of your first animal?', answer: 'bella' },
];
const usingDefaults = users.filter(u => u.password === DEFAULTS[u.username]).map(u => u.username);
for (const { username, name, password, role, department, question, answer } of users) {
  const passwordHash = await bcrypt.hash(password, 12);
  const answerHash = await bcrypt.hash(normalizeAnswer(answer), 12);
  // On re-seed, keep any password the user may have changed; only refresh profile fields.
  await connection.execute(
    `INSERT INTO users (username, name, password, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), security_question = VALUES(security_question), security_answer = VALUES(security_answer)`,
    [username, name, passwordHash, role, question, answerHash]
  );
  const [rows] = await connection.execute('SELECT id FROM users WHERE username = ?', [username]);
  await connection.execute('INSERT INTO staff (user_id, department) VALUES (?, ?) ON DUPLICATE KEY UPDATE department = VALUES(department)', [rows[0].id, department]);
}
for (const name of ['General', 'Livestock team', 'Maintenance', 'Management']) {
  await connection.execute('INSERT IGNORE INTO chat_channels (channel_name) VALUES (?)', [name]);
}
console.log('Demo users and chat channels seeded.');
if (usingDefaults.length) {
  console.warn(`\nWARNING: these accounts still use built-in demo passwords: ${usingDefaults.join(', ')}.`);
  console.warn('Set SEED_<ROLE>_PASSWORD env vars (or change the passwords in-app) before any shared or production use.\n');
}
await connection.end();
}

seed().catch(error => { console.error(error); process.exitCode = 1; });
