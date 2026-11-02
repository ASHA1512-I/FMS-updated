import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('127.0.0.1'),
  SESSION_SECRET: z.string().min(32).default('development-only-session-secret-change-me'),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().regex(/^[A-Za-z0-9_]+$/).default('farm_manager'),
  DB_USER: z.string().min(1).default('root'),
  DB_PASSWORD: z.string().default(''),
});

const values = schema.parse(process.env);
const unsafeSecrets = new Set(['development-only-session-secret-change-me', 'change-me-in-production', '']);

if (values.NODE_ENV === 'production') {
  if (unsafeSecrets.has(values.SESSION_SECRET) || values.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must be a unique value of at least 32 characters in production');
  if (values.CORS_ORIGIN === '*' || !values.CORS_ORIGIN.startsWith('https://')) throw new Error('CORS_ORIGIN must be a single HTTPS origin in production');
  if (values.DB_USER === 'root') throw new Error('DB_USER must be a least-privilege, non-root database account in production');
  if (!values.DB_PASSWORD) throw new Error('DB_PASSWORD must be configured in production');
}

export const config = {
  nodeEnv: values.NODE_ENV,
  port: values.PORT,
  host: values.HOST,
  sessionSecret: values.SESSION_SECRET,
  corsOrigin: values.CORS_ORIGIN,
  db: { host: values.DB_HOST, port: values.DB_PORT, database: values.DB_NAME, user: values.DB_USER, password: values.DB_PASSWORD },
};
