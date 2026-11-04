# Local test database on Windows

Use this route when MySQL is not already running on `127.0.0.1:3306`. It creates an isolated Docker MySQL 8.4 database and publishes it only to this computer, so the normal development server can use it. It does not use production data or deploy anything.

## One-time preparation

1. Install and open Docker Desktop for Windows, using its default WSL 2 setup.
2. In PowerShell at the project root, copy the template:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Edit only `.env`. Set unique local values for `SESSION_SECRET`, `FMS_SESSION_SECRET`, `FMS_MYSQL_ROOT_PASSWORD`, and the four `SEED_*_PASSWORD` values. Use a 12+ character value for each seed password.
4. Set `FMS_MYSQL_PASSWORD` and `DB_PASSWORD` to the **same** unique local value. Keep `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_NAME=farm_manager`, and `DB_USER=fms_app`.

Never paste or commit this file. It is already ignored by Git.

## Start, migrate, seed, run

```powershell
docker compose up -d mysql
docker compose ps
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

Wait until the `mysql` service is healthy before the migration. Then open `http://localhost:3000`. Sign in with the seeded username (`admin`, `manager`, `accountant`, or `worker`) and the matching password you chose.

## Safe reset

To stop the local database: `docker compose down`. To discard only this local test database and start fresh later: `docker compose down -v`. This removes the `fms_mysql_data` Docker volume; it does not affect any remote or production database.

## If port 3306 is already occupied

Do not stop an unknown database service. Change the local override mapping to `127.0.0.1:3307:3306` and set `DB_PORT=3307` in `.env`, then rerun the commands.
