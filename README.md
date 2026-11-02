# Farm Manager System

Farm Manager is a TypeScript/Express and MySQL application for farm operations, finance, staff time, jobs, livestock, feed, facilities, plots, training, weigh-ins and internal chat. The browser UI and API are served from one origin with secure, HTTP-only sessions.

## What is persistent

The following use MySQL, not browser-only demo data: users, jobs, animals, time logs, financial transactions, staff, chat, facilities, feed inventory, farm fields, training sessions, weigh-ins and farm settings. Sensitive changes are written to `audit_logs`.

## Local setup

**Requirements:** Node 22+, MySQL 8+/MariaDB, or Docker Compose.

1. Copy `.env.example` to `.env` and set unique local values.
2. Start MySQL. For Compose, set `FMS_MYSQL_PASSWORD`, `FMS_MYSQL_ROOT_PASSWORD` and `FMS_SESSION_SECRET` in your shell or `.env`, then run `docker compose up -d mysql`.
3. Run the database migration: `npm run db:migrate`.
4. Set all four `SEED_*_PASSWORD` values to unique 12+ character development passwords, then run `npm run db:seed`.
5. Run `npm run dev`, then open `http://localhost:3000`.

The seed command refuses to run in production and never supplies built-in passwords.

## Production deployment

- Put the service behind an HTTPS reverse proxy and set a single `https://` `CORS_ORIGIN`.
- Set `NODE_ENV=production`, a unique 32+ character `SESSION_SECRET`, a non-root database user and a non-empty database password. The app rejects unsafe production settings at startup.
- Run `npm ci && npm run build`, then `npm start`; use the included `Dockerfile` for an immutable Node 22 production image.
- Run `npm run db:migrate` once per release before starting new application instances. Back up the database first.
- Do **not** use `docker-compose.yml` as a public production deployment. It is a local-development helper and does not publish MySQL to the host.
- Create least-privilege database credentials. The app account needs only the permissions required for this application's schema, not global administrative access.

## Backup and restore

Back up before every migration and retain encrypted, access-controlled copies:

```sh
mysqldump --single-transaction --routines --databases farm_manager > fms-backup.sql
mysql < fms-backup.sql
```

Test restores periodically on a separate database. To roll back an application release, redeploy the previous app image only after confirming the database migration is backward-compatible or restoring the matching tested backup.

## Verification

```sh
npm ci
npm run build
npm test
```

GitHub Actions runs the same install, build and test checks on pushes and pull requests.

## Security notes

- Passwords and reset answers are bcrypt-hashed; credentials are never returned by the API.
- Login/reset endpoints are rate limited and sessions are regenerated after sign-in and password reset.
- Role checks protect sensitive read and write routes. Workers can view and complete only their assigned jobs and can see only their own time logs.
- The UI HTML-escapes data rendered from server records. Parameterized SQL and request validation are used for writes.
- Review `audit_logs` during investigations. Do not log passwords, reset answers or session tokens.
