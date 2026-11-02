import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from './db';

const router = Router();
const loginSchema = z.object({ username: z.string().trim().min(1).max(100), password: z.string().min(1).max(200) });

// Password-reset flow. State lives in the server session (never the browser),
// is single-use, time-boxed, and each step must be completed in order.
const identifySchema = z.object({ username: z.string().trim().min(1).max(100) });
const answerSchema = z.object({ answer: z.string().trim().min(1).max(200) });
const completeSchema = z.object({ password: z.string().min(6).max(200) });
const RESET_WINDOW_MS = 10 * 60 * 1000;
const normalizeAnswer = (value: string) => value.trim().toLowerCase();

router.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const [rows] = await pool.execute('SELECT id, username, name, role, password FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [input.username.toLowerCase()]);
    const record = (rows as Array<{ id: number; username: string; name: string; role: 'admin' | 'manager' | 'accountant' | 'worker'; password: string }>)[0];
    if (!record || !(await bcrypt.compare(input.password, record.password))) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Username or password is incorrect.' } });
    await new Promise<void>((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
    req.session.user = { id: record.id, username: record.username, name: record.name, role: record.role };
    res.json({ success: true, user: req.session.user });
  } catch (error) { next(error); }
});

router.post('/logout', (req, res, next) => req.session.destroy(error => error ? next(error) : res.json({ success: true })));

// Step 1 — identify the account and return its security question.
router.post('/reset/identify', async (req, res, next) => {
  try {
    const { username } = identifySchema.parse(req.body);
    const [rows] = await pool.execute('SELECT username, security_question FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [username.toLowerCase()]);
    const record = (rows as Array<{ username: string; security_question: string | null }>)[0];
    if (!record || !record.security_question) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No account with a security question was found for that username.' } });
    }
    req.session.reset = { username: record.username, verified: false, createdAt: Date.now() };
    res.json({ success: true, data: { question: record.security_question } });
  } catch (error) { next(error); }
});

// Step 2 — verify the security answer against the stored bcrypt hash.
router.post('/reset/verify', async (req, res, next) => {
  try {
    const { answer } = answerSchema.parse(req.body);
    const state = req.session.reset;
    if (!state || Date.now() - state.createdAt > RESET_WINDOW_MS) {
      return res.status(400).json({ success: false, error: { code: 'RESET_EXPIRED', message: 'Your reset session expired. Please start again.' } });
    }
    const [rows] = await pool.execute('SELECT security_answer FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [state.username]);
    const record = (rows as Array<{ security_answer: string | null }>)[0];
    if (!record || !record.security_answer || !(await bcrypt.compare(normalizeAnswer(answer), record.security_answer))) {
      return res.status(400).json({ success: false, error: { code: 'INCORRECT_ANSWER', message: 'That answer does not match our records.' } });
    }
    req.session.reset = { username: state.username, verified: true, createdAt: Date.now() };
    res.json({ success: true });
  } catch (error) { next(error); }
});

// Step 3 — set the new password (only after a verified, unexpired session).
router.post('/reset/complete', async (req, res, next) => {
  try {
    const { password } = completeSchema.parse(req.body);
    const state = req.session.reset;
    if (!state || !state.verified || Date.now() - state.createdAt > RESET_WINDOW_MS) {
      return res.status(400).json({ success: false, error: { code: 'RESET_NOT_VERIFIED', message: 'Verify your identity before setting a new password.' } });
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute('UPDATE users SET password = ? WHERE username = ? AND is_active = 1', [hash, state.username]);
    if (!(result as { affectedRows: number }).affectedRows) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Account not found.' } });
    }
    const username = state.username;
    // Drop the reset grant and start a clean, logged-out session.
    await new Promise<void>((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
    res.json({ success: true, data: { username } });
  } catch (error) { next(error); }
});

export default router;
