# Farm Manager (FMS) — System Analysis & Changes

This is a role-based farm management web app. A single-page frontend
(`Index.html` + `script.js` + `style.css`) talks to a backend over `/api`
using session cookies. Four roles (admin, manager, accountant, worker) each
see a filtered set of modules: Dashboard, Jobs, Animals, Facility, Feed, Farm,
Train Track, Scale, Time, People, Finance, Analytics, Chat, Users, Settings.

## Architecture (as shipped)

- **Canonical backend** — TypeScript + Express 5 in `src/` (compiled to
  `dist/`). Uses MySQL (`mysql2`), `express-session` cookies, `helmet`,
  `express-rate-limit`, `zod` validation, and `bcryptjs` password hashing.
  This is what the frontend actually calls and what `package.json` runs.
- **Database** — `migrations/001_initial.sql` (9 tables) + `scripts/seed.js`
  (demo users and chat channels). `docker-compose.yml` provides local MySQL.
- **Frontend** — one HTML shell; `script.js` renders every page client-side
  and hydrates data from the API.

## Changes made in this pass (security fixes)

1. **Favicon 404 fixed** — `Index.html` pointed at `FMS.png`, but the only
   image in the project is `FMS.jpeg`. Updated the link (and MIME type) so the
   icon loads.
2. **Stored-XSS hardening** — `script.js` injected database values
   (chat messages, job titles/assignees, animal records, staff names,
   transaction descriptions, usernames, channel names) straight into
   `innerHTML`. A user could post `<img onerror=...>` in chat and have it run
   for everyone. Added an `esc()` HTML-escaping helper and applied it to every
   user-supplied value rendered into the DOM.
3. **Reset flow no longer clobbered** — `refreshUsers()` overwrote the global
   `USERS` array (the seed that the “Forgot password” screen read for security
   questions) with server rows that have no question/answer fields, silently
   breaking password reset after an admin opened the Users page. The client no
   longer keeps that array at all (see fix 6); the users page uses a separate
   local `directory` variable.
4. **Dead code removed** — an empty `forEach` loop in the login hub graphic and
   an unused `document.createElement('div')` in the reset flow.
5. **Junk file removed** — `test.txt` contained only binary garbage.
6. **Real, server-side password reset** — the “Forgot password” screen used to
   run entirely in the browser against a hardcoded `USERS` array (which held
   plaintext credentials) and only mutated memory, so a reset never reached
   the database. Fixed end to end:
   - `migrations/001_initial.sql` adds `phone`, `security_question`, and
     `security_answer` columns to `users`.
   - `src/auth.ts` extends the session type with reset state.
   - `src/routes-auth.ts` implements a secure 3-step flow
     (`/auth/reset/identify`, `/auth/reset/verify`, `/auth/reset/complete`):
     reset state lives only in the server session with a 10-minute window, the
     security answer is compared with bcrypt, and the session is regenerated
     after a successful reset.
   - `scripts/seed.js` seeds **hashed** security answers (normalized
     lowercase/trim) and supports env-overridable passwords
     (`SEED_<ROLE>_PASSWORD`) with a default-password warning.
   - `script.js` removes the in-memory `USERS` array and the client-side reset
     code; the three reset steps now call the API.
7. **Redundant / insecure servers removed** — the legacy PHP API (`api/`,
   which accepted plaintext-equal passwords and queried columns the schema did
   not create) and the bare static Express server (`app.js`) have been
   deleted, leaving the canonical `src/` TypeScript API as the single entry
   point.
8. **Dashboard now uses live data** — the role-aware dashboard previously
   showed hardcoded figures (e.g. “Total livestock 214”, “Staff on shift 6”).
   `script.js` now hydrates from `/api/dashboard` (healthy animals, animals
   under watch, open jobs, active staff, income, expenses), refreshes on
   navigation, and falls back to locally computed values if the call fails.
9. **Build hygiene** — added `.gitignore` (`node_modules/`, `dist/`, `.env`)
   and removed the committed `dist/` output; it is regenerated via
   `npm run build`.
10. **Deployment guide written** — `DEPLOYMENT_GUIDE.md` now documents setup,
    running, verification, and a security-hardening checklist.

## Open issues worth addressing next (not changed here)

- **Default demo credentials** (`admin/admin123`, etc.) and the dev session
  secret must be changed before any non-local use; bind to localhost and run
  behind HTTPS in production. These are flagged in `DEPLOYMENT_GUIDE.md`.
- **Demo UI figures remain for a few non-core tiles** (e.g. a worker's “Hours
  this week”, “Pending invoices”, feed runway), which are illustrative and not
  yet wired to dedicated endpoints.

## How to run (TypeScript stack)

```bash
docker compose up -d mysql
export DB_PASSWORD=fms-local-root-password
npm install
npm run db:migrate && npm run db:seed
npm run dev      # http://localhost:3000
```
