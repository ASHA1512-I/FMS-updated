import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('127.0.0.1'),
  SESSION_SECRET: z.string().min(32).default('development-only-session-secret-change-me'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().default('farm_manager'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
});

const values = schema.parse(process.env);

if (values.NODE_ENV === 'production' && values.SESSION_SECRET === 'development-only-session-secret-change-me') {
  throw new Error('SESSION_SECRET must be configured in production');
}

if (values.NODE_ENV === 'production' && values.CORS_ORIGIN === '*') {
  throw new Error('CORS_ORIGIN must be an explicit origin in production (wildcard is not allowed with credentials)');
}

export const config = {
  nodeEnv: values.NODE_ENV,
  port: values.PORT,
  host: values.HOST,
  sessionSecret: values.SESSION_SECRET,
  corsOrigin: values.CORS_ORIGIN,
  db: { host: values.DB_HOST, port: values.DB_PORT, database: values.DB_NAME, user: values.DB_USER, password: values.DB_PASSWORD },
};