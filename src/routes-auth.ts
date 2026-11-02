import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from './db';
import { audit } from './audit';

const router = Router();
const loginSchema = z.object({ username: z.string().trim().min(1).max(100), password: z.string().min(1).max(200) });
const identifySchema = z.object({ username: z.string().trim().min(1).max(100) });
const answerSchema = z.object({ answer: z.string().trim().min(1).max(200) });
const completeSchema = z.object({ password: z.string().min(12).max(200) });
const RESET_WINDOW_MS = 10 * 60 * 1000;
const normalizeAnswer = (value: string) => value.trim().toLowerCase();

router.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const [rows] = await pool.execute('SELECT id, username, name, role, password FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [input.username.toLowerCase()]);
    const record = (rows as Array<{ id: number; username: string; name: string; role: 'admin' | 'manager' | 'accountant' | 'worker'; password: string }>)[0];
    if (!record || !(await bcrypt.compare(input.password, record.password))) {
      await audit(record?.id, 'login_failed', 'user', record?.id);
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Username or password is incorrect.' } });
    }
    await new Promise<void>((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
    req.session.user = { id: record.id, username: record.username, name: record.name, role: record.role };
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

// This flow is deliberately generic until identity is proven, to reduce account discovery.
router.post('/reset/identify', async (req, res, next) => {
  try {
    const { username } = identifySchema.parse(req.body);
    const [rows] = await pool.execute('SELECT id, username, security_question FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [username.toLowerCase()]);
    const record = (rows as Array<{ id: number; username: string; security_question: string | null }>)[0];
    if (!record || !record.security_question) {
      await audit(record?.id, 'password_reset_identify_failed', 'user', record?.id);
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No reset option is available for that account.' } });
    }
    req.session.reset = { username: record.username, verified: false, createdAt: Date.now() };
    await audit(record.id, 'password_reset_identify', 'user', record.id);
    res.json({ success: true, data: { question: record.security_question } });
  } catch (error) { next(error); }
});

router.post('/reset/verify', async (req, res, next) => {
  try {
    const { answer } = answerSchema.parse(req.body);
    const state = req.session.reset;
    if (!state || Date.now() - state.createdAt > RESET_WINDOW_MS) return res.status(400).json({ success: false, error: { code: 'RESET_EXPIRED', message: 'Your reset session expired. Please start again.' } });
    const [rows] = await pool.execute('SELECT id, security_answer FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [state.username]);
    const record = (rows as Array<{ id: number; security_answer: string | null }>)[0];
    if (!record || !record.security_answer || !(await bcrypt.compare(normalizeAnswer(answer), record.security_answer))) {
      await audit(record?.id, 'password_reset_verify_failed', 'user', record?.id);
      return res.status(400).json({ success: false, error: { code: 'INCORRECT_ANSWER', message: 'That answer does not match our records.' } });
    }
    req.session.reset = { username: state.username, verified: true, createdAt: Date.now() };
    await audit(record.id, 'password_reset_verified', 'user', record.id);
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.post('/reset/complete', async (req, res, next) => {
  try {
    const { password } = completeSchema.parse(req.body);
    const state = req.session.reset;
    if (!state || !state.verified || Date.now() - state.createdAt > RESET_WINDOW_MS) return res.status(400).json({ success: false, error: { code: 'RESET_NOT_VERIFIED', message: 'Verify your identity before setting a new password.' } });
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute('UPDATE users SET password = ? WHERE username = ? AND is_active = 1', [hash, state.username]);
    if (!(result as { affectedRows: number }).affectedRows) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Account not found.' } });
    const [users] = await pool.execute('SELECT id FROM users WHERE username = ?', [state.username]);
    const userId = (users as Array<{ id: number }>)[0]?.id;
    await new Promise<void>((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
    await audit(userId, 'password_reset_completed', 'user', userId);
    res.json({ success: true, data: { username: state.username } });
  } catch (error) { next(error); }
});

export default router;
