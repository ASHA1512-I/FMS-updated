import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from './db';
import { audit } from './audit';

const router = Router();
const loginSchema = z.object({ username: z.string().trim().min(1).max(100), password: z.string().min(1).max(200) });

router.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const [rows] = await pool.execute('SELECT id, username, name, role, password, session_version sessionVersion FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [input.username.toLowerCase()]);
    const record = (rows as Array<{ id: number; username: string; name: string; role: 'admin' | 'manager' | 'accountant' | 'worker'; password: string; sessionVersion: number }>)[0];
    if (!record || !(await bcrypt.compare(input.password, record.password))) {
      await audit(record?.id, 'login_failed', 'user', record?.id);
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Username or password is incorrect.' } });
    }
    await new Promise<void>((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
    req.session.user = { id: record.id, username: record.username, name: record.name, role: record.role, sessionVersion: record.sessionVersion };
    await pool.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [record.id]);
    await audit(record.id, 'login', 'user', record.id);
    res.json({ success: true, user: req.session.user });
  } catch (error) { next(error); }
});

router.post('/logout', (req, res, next) => {
  const userId = req.session.user?.id;
  req.session.destroy(async error => {
    if (error) return next(error);
    await audit(userId, 'logout', 'user', userId);
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Security questions are not reliable proof of identity. Password resets are
// performed by an authenticated administrator through the protected users API.
router.all('/reset/:action', (_req, res) => res.status(410).json({
  success: false,
  error: { code: 'RESET_DISABLED', message: 'Self-service password reset is unavailable. Contact your farm administrator.' },
}));

export default router;
