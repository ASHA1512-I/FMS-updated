import { NextFunction, Request, Response } from 'express';
import { pool } from './db';

export type Role = 'admin' | 'manager' | 'accountant' | 'worker';
export type CurrentUser = { id: number; username: string; name: string; role: Role };

declare module 'express-session' {
  interface SessionData {
    user?: CurrentUser;
    reset?: { username: string; verified: boolean; createdAt: number };
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } });
  try {
    const [rows] = await pool.execute('SELECT id, username, name, role FROM users WHERE id = ? AND is_active = 1', [req.session.user.id]);
    const user = (rows as CurrentUser[])[0];
    if (!user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User account is unavailable.' } });
    req.session.user = user;
    next();
  } catch (error) { next(error); }
}

export function allowRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission for this action.' } });
    next();
  };
}