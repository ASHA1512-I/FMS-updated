# Farm Manager

The application now uses a TypeScript/Express API, MySQL persistence, and the existing browser frontend from one origin.

## Local database setup

Requirements: Node.js and either MySQL/MariaDB or Docker Desktop.

With Docker:

```powershell
docker compose up -d mysql
$env:DB_PASSWORD = "fms-local-root-password"
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

Open `http://localhost:3000` and sign in with one of the seeded demo accounts shown in `scripts/seed.js`. Change those passwords before using the system outside local development.

With an existing MySQL server, set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` from `.env.example`, then run:

```powershell
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd start
```

The frontend and API share the same origin. The browser uses session cookies and the following API-backed modules: authentication, dashboard data, Jobs, Animals, Facility, Feed, Farm, Train Track, Scale, Time, Finance, Staff, Analytics, Users, Chat, and Settings.

## Verification

```powershell
npm.cmd run build
npm.cmd test
```
