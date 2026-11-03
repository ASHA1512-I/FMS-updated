const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

try {
  process.loadEnvFile('.env');
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const roles = ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'WORKER'];

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed demo accounts in production. Create named accounts through an approved administrative process.');
  }
  const missing = roles.filter(role => !process.env[`SEED_${role}_PASSWORD`]);
  if (missing.length) throw new Error(`Missing required seed passwords: ${missing.map(role => `SEED_${role}_PASSWORD`).join(', ')}`);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), database: process.env.DB_NAME || 'farm_manager', user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
  });
  const users = [
    { username: 'admin', name: 'Grace Nakato', password: process.env.SEED_ADMIN_PASSWORD, role: 'admin', department: 'Management' },
    { username: 'manager', name: 'Peter Okello', password: process.env.SEED_MANAGER_PASSWORD, role: 'manager', department: 'Operations' },
    { username: 'accountant', name: 'Sarah Namuli', password: process.env.SEED_ACCOUNTANT_PASSWORD, role: 'accountant', department: 'Finance' },
    { username: 'worker', name: 'James Otieno', password: process.env.SEED_WORKER_PASSWORD, role: 'worker', department: 'Livestock' },
  ];
  for (const { username, name, password, role, department } of users) {
    if (password.length < 12) throw new Error(`SEED_${username.toUpperCase()}_PASSWORD must be at least 12 characters long`);
    const passwordHash = await bcrypt.hash(password, 12);
    await connection.execute(
      `INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role)`,
      [username, name, passwordHash, role],
    );
    const [rows] = await connection.execute('SELECT id FROM users WHERE username = ?', [username]);
    await connection.execute('INSERT INTO staff (user_id, department) VALUES (?, ?) ON DUPLICATE KEY UPDATE department = VALUES(department)', [rows[0].id, department]);
  }
  for (const name of ['General', 'Livestock team', 'Maintenance', 'Management']) await connection.execute('INSERT IGNORE INTO chat_channels (channel_name) VALUES (?)', [name]);
  await connection.execute("INSERT IGNORE INTO farm_settings (id, farm_name, timezone, alerts, auto_sync, currency, notifications) VALUES (1, 'Farm Manager', 'Africa/Kampala', TRUE, FALSE, 'UGX', 'Daily summary')");
  console.log('Development users, chat channels, and settings seeded.');
  await connection.end();
}
seed().catch(error => { console.error(error.message || error); process.exitCode = 1; });
