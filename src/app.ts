import express from 'express';
import path from 'node:path';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { config } from './config';
import authRoutes from './routes-auth';
import jobsRoutes from './routes-jobs';
import dataRoutes from './routes-data';

export const app = express();
const root = path.resolve(__dirname, '..');

// Behind a TLS-terminating reverse proxy in production, trust the first proxy
// hop so secure cookies and the real client IP (for rate limiting) work.
app.disable('x-powered-by');
if (config.nodeEnv === 'production') app.set('trust proxy', 1);

// Security headers. CSP restricts sources to this origin; 'unsafe-inline' is
// required because the current UI uses inline event handlers and styles.
// Removing it later means refactoring those to addEventListener / CSS files.
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));

// Baseline limiter across the whole API; auth routes get a stricter one below.
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

// Persistent session store in production so sessions survive restarts and
// scale across instances. Development/test use the default in-memory store.
let sessionStore: session.Store | undefined;
if (config.nodeEnv === 'production') {
  let MySQLStoreFactory: (s: typeof session) => new (opts: Record<string, unknown>) => session.Store;
  try {
    MySQLStoreFactory = require('express-mysql-session');
  } catch {
    throw new Error('A persistent session store is required in production. Run: npm install express-mysql-session');
  }
  const MySQLStore = MySQLStoreFactory(session);
  sessionStore = new MySQLStore({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    createDatabaseTable: true,
    schema: { tableName: 'sessions' },
  });
}

app.use(session({
  store: sessionStore,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: config.nodeEnv === 'production', maxAge: 8 * 60 * 60 * 1000 },
}));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }), authRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'farm-manager-api' }));
app.get('/api/me', (req, res) => res.json({ success: true, user: req.session.user ?? null }));
app.use('/api/jobs', jobsRoutes);
app.use('/api', dataRoutes);
app.use(express.static(root));
app.use((_req, res) => res.sendFile(path.join(root, 'Index.html')));

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.issues[0]?.message ?? 'Invalid request.' } });
  console.error(error);
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' } });
});
