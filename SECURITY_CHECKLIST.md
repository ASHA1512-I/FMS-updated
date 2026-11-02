# Farm Manager — Production Security Checklist

Status key: **[code]** enforced in the application; **[ops]** must be done by
whoever deploys/operates the system; **[partial]** some of it is in code, the
rest is operational.

## Secrets & configuration
- [x] **[code]** `SESSION_SECRET` must be ≥ 32 chars; the app refuses to start in
  production if it is unset or left at the development default (`config.ts`).
- [x] **[code]** `.env` is excluded from source control (`.gitignore`).
- [ ] **[ops]** Set `NODE_ENV=production` and provide real secrets via the
  environment or a vault; rotate `SESSION_SECRET` on compromise.
- [ ] **[ops]** Give the MySQL app user least privilege on the single
  application database — no root, no DDL in production.

## Sessions & cookies
- [x] **[code]** Cookie is `httpOnly`, `sameSite: 'lax'`, and `secure` in
  production; `maxAge` is 8h (`app.ts`).
- [x] **[code]** Session is regenerated on login and after password reset
  (`routes-auth.ts`).
- [x] **[code]** Persistent MySQL-backed session store is used in production
  (`express-mysql-session`, table `sessions`); dev/test use the in-memory
  store (`app.ts`). Requires `npm install`.

## Transport & network
- [x] **[code]** `app.set('trust proxy', 1)` in production so secure cookies and
  client IPs work behind a proxy (`app.ts`).
- [x] **[code]** HSTS enabled via helmet (1 year, includeSubDomains).
- [x] **[code]** Server binds to `HOST` (default `127.0.0.1`), so it listens on
  localhost unless explicitly changed (`config.ts`, `server.ts`).
- [ ] **[ops]** Terminate HTTPS at a reverse proxy (nginx/Caddy), redirect
  HTTP→HTTPS, and never expose MySQL publicly.

## HTTP headers & CORS
- [x] **[code]** helmet enabled with a tuned Content-Security-Policy
  (`default-src 'self'`, `object-src 'none'`, `img-src 'self' data:`).
  `'unsafe-inline'` is allowed for scripts/styles because the current UI uses
  inline event handlers; removing it requires refactoring those to
  `addEventListener` and external CSS.
- [x] **[code]** `x-powered-by` disabled (`app.disable`).
- [x] **[code]** CORS restricted to `CORS_ORIGIN`; the app refuses to start in
  production if it is set to `*` (`config.ts`).
- [ ] **[ops]** Set `CORS_ORIGIN` to your exact frontend origin.

## Input validation & injection
- [x] **[code]** All write endpoints validate bodies with zod
  (`routes-auth.ts`, `routes-jobs.ts`, `routes-data.ts`).
- [x] **[code]** All SQL uses parameterized queries via `mysql2`.
- [x] **[code]** `esc()` escapes every user-supplied value rendered to the DOM
  (`script.js`); no inline handlers are injected from data.

## Rate limiting & abuse
- [x] **[code]** Global baseline limiter on `/api` (300 / 15 min) plus a
  stricter limiter on `/api/auth` (20 / 15 min) (`app.ts`).
- [x] **[code]** Password-reset flow is server-side, single-use, in-order, and
  time-boxed to 10 minutes (`routes-auth.ts`).

## Authorization
- [x] **[code]** `requireAuth` protects all data and jobs routes; `allowRoles`
  guards every write endpoint by role (`auth.ts`, `routes-*.ts`).
- [x] **[code]** Object-level access enforced where applicable — e.g. a worker
  only sees/updates jobs assigned to them (`routes-jobs.ts`).

## Dependencies & build
- [x] **[code]** `dist/` is not committed; regenerate via `npm run build`.
- [ ] **[ops]** Run `npm audit` / `npm audit fix`; keep Node and packages
  patched; install with `npm ci` from the committed lockfile.

## Operations & monitoring
- [x] **[code]** Error handler returns generic messages — no stack traces or SQL
  leak to clients (`app.ts`).
- [x] **[code]** Health check endpoint at `/api/health`.
- [ ] **[ops]** Run as a non-root user under a process manager (systemd/pm2);
  centralized logging with auth-failure/5xx alerting; automated database
  backups with tested restore; back up before every migration; uptime
  monitoring.
