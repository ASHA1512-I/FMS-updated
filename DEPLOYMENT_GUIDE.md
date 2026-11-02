# Farm Manager — Deployment Guide

This guide covers running the Farm Manager (FMS) application and the security
steps required before any shared or production use. The backend is a
TypeScript/Express API (`src/`) backed by MySQL, using server-side sessions,
bcrypt password hashing, and zod request validation. The browser frontend
(`Index.html`, `script.js`, `style.css`) is served from the same origin.

---

## 1. Prerequisites

- Node.js 18+ (LTS recommended).
- MySQL 8 / MariaDB, or Docker Desktop (a `docker-compose.yml` is provided for
  a local MySQL instance).
- A terminal (examples use PowerShell on Windows; adapt for bash/zsh).

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

| Variable         | Purpose                                                        |
|------------------|----------------------------------------------------------------|
| `NODE_ENV`       | `development` or `production`.                                 |
| `PORT`           | HTTP port (default `3000`).                                    |
| `HOST`           | Bind address (default `127.0.0.1`; localhost-only).            |
| `SESSION_SECRET` | **Required.** At least 32 random characters. Never reuse or commit. |
| `CORS_ORIGIN`    | Allowed origin for the browser app.                            |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | MySQL connection. |

Generate a strong session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Create and seed the database

With Docker:

```bash
docker compose up -d mysql
npm run db:migrate
npm run db:seed
```

With an existing MySQL server, set the `DB_*` values in `.env`, then:

```bash
npm run db:migrate
npm run db:seed
```

The migration creates the `users` table (including `phone`,
`security_question`, and `security_answer` columns used by password recovery)
and the application tables. The seed loads four demo accounts.

## 5. Run

Development (auto-reload):

```bash
npm run dev
```

Production (build then start):

```bash
npm run build
npm start
```

Open `http://localhost:3000` and sign in with a seeded demo account.

## 6. Verify

```bash
npm run build
npm test
```

---

## Security hardening (do this before shared/production use)

### Credentials

- **Change all seeded demo passwords.** The seed uses well-known defaults
  (`admin123`, `manager123`, `acc123`, `worker123`) only for local
  development. For any shared or staging database, supply your own values via
  environment variables so the defaults are never written:

  ```bash
  SEED_ADMIN_PASSWORD=... SEED_MANAGER_PASSWORD=... \
  SEED_ACCOUNTANT_PASSWORD=... SEED_WORKER_PASSWORD=... npm run db:seed
  ```

  Or change each password from inside the app after first login.
- Passwords and security answers are stored **bcrypt-hashed**. Security
  answers are normalized (trimmed, lowercased) before hashing, so recovery is
  case-insensitive but the plaintext is never stored.
- Remove or disable demo accounts you do not need.

### Secrets & config

- Set a unique, random `SESSION_SECRET` (32+ chars). Never commit `.env`.
- `.gitignore` already excludes `.env`, `node_modules/`, and `dist/`.
- Restrict the MySQL user to the application database with least privilege.

### Transport & network

- The dev server binds to `HOST` (default `127.0.0.1`). For production, run
  behind a reverse proxy (nginx/Caddy) terminating **HTTPS**. The app already
  sets `trust proxy`, enables HSTS, and marks session cookies `secure` /
  `httpOnly` / `sameSite=lax` when `NODE_ENV=production`.
- Set `CORS_ORIGIN` to your real front-end origin; the app refuses to start in
  production if it is `*`.

### Session store

- In production the app uses a persistent MySQL-backed session store
  (`express-mysql-session`, table `sessions`) so sessions survive restarts and
  scale across instances. It is created automatically on first run; just make
  sure dependencies are installed (`npm install`).
- Development and test use the default in-memory store.

### Password recovery

- Recovery is a 3-step, server-driven flow (`/auth/reset/identify`,
  `/auth/reset/verify`, `/auth/reset/complete`). Reset state lives only in the
  server session with a 10-minute window; the answer is compared with bcrypt;
  the session is regenerated after a successful reset. No reset codes or
  secrets are sent to or stored in the browser.
- Rate limiting (`express-rate-limit`) is applied to auth endpoints to slow
  brute-force attempts.

### Operations

- Keep dependencies patched (`npm audit`).
- Run the process as a non-root user; use a process manager (pm2/systemd) for
  restarts and logging.
- Back up the database before running migrations on existing data.
