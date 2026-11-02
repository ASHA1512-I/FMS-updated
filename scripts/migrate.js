const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');

async function migrate() {
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});
const database = process.env.DB_NAME || 'farm_manager';
await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database.replaceAll('`', '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await connection.changeUser({ database });
await connection.query(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    migration_name VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const migrationDir = path.join(__dirname, '..', 'migrations');
const migrations = (await fs.readdir(migrationDir))
  .filter(name => /^\d+_.+\.sql$/.test(name))
  .sort();

for (const name of migrations) {
  const [appliedRows] = await connection.execute(
    'SELECT migration_name FROM schema_migrations WHERE migration_name = ?',
    [name]
  );
  if (appliedRows.length) continue;

  const sql = await fs.readFile(path.join(migrationDir, name), 'utf8');
  if (name === '001_initial.sql') {
    const tableNames = [...sql.matchAll(/CREATE TABLE\s+`?(\w+)`?/gi)].map(match => match[1]);
    const [existingRows] = await connection.execute(
      'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
      [database]
    );
    const existingTables = new Set(existingRows.map(row => row.TABLE_NAME));
    if (tableNames.length && tableNames.every(tableName => existingTables.has(tableName))) {
      await connection.execute('INSERT INTO schema_migrations (migration_name) VALUES (?)', [name]);
      continue;
    }
  }

  await connection.query(sql);
  await connection.execute('INSERT INTO schema_migrations (migration_name) VALUES (?)', [name]);
}

console.log(`Database ${database} is ready.`);
await connection.end();
}

migrate().catch(error => { console.error(error); process.exitCode = 1; });
