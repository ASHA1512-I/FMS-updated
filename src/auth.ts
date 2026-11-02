import { NextFunction, Request, Response } from 'express';
import { pool } from './db';

export type Role = 'admin' | 'manager' | 'accountant' | 'worker';
export type CurrentUser = { id: number; username: string; name: string; role: Role; sessionVersion: number };

declare module 'express-session' {
  interface SessionData {
    user?: CurrentUser;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } });
  try {
    const [rows] = await pool.execute('SELECT id, username, name, role, session_version sessionVersion FROM users WHERE id = ? AND is_active = 1', [req.session.user.id]);
    const user = (rows as CurrentUser[])[0];
    if (!user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User account is unavailable.' } });
    if (user.sessionVersion !== req.session.user.sessionVersion) {
      return req.session.destroy(error => {
        if (error) return next(error);
        res.clearCookie('connect.sid');
        res.status(401).json({ success: false, error: { code: 'SESSION_REVOKED', message: 'Your session is no longer valid. Please sign in again.' } });
      });
    }
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