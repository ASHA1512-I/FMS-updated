import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from './db';
import { allowRoles, requireAuth } from './auth';
import { audit } from './audit';

const router = Router();
router.use(requireAuth);
const idSchema = z.coerce.number().int().positive();
const roleSchema = z.enum(['admin', 'manager', 'accountant', 'worker']);
const adminResetPasswordSchema = z.object({ password: z.string().min(12).max(200) });
const clockActionSchema = z.object({ action: z.enum(['clock_in', 'clock_out']) });
const statusLabel = (value: unknown) => String(value).replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());

const facilitySchema = z.object({ name: z.string().trim().min(1).max(150), type: z.string().trim().min(1).max(100), status: z.string().trim().min(1).max(50).default('operational'), healthPercent: z.coerce.number().min(0).max(100).default(100), note: z.string().trim().max(1000).optional() });
const feedSchema = z.object({ item: z.string().trim().min(1).max(150), quantity: z.coerce.number().nonnegative(), unit: z.string().trim().min(1).max(20).default('kg'), status: z.string().trim().min(1).max(50).default('healthy'), expiresOn: z.string().date().nullable().optional(), reorderLevel: z.coerce.number().nonnegative().default(0) });
const fieldSchema = z.object({ name: z.string().trim().min(1).max(150), crop: z.string().trim().min(1).max(100), stage: z.string().trim().min(1).max(100), expectedYield: z.coerce.number().nonnegative().optional(), yieldUnit: z.string().trim().min(1).max(20).default('t'), moisturePercent: z.coerce.number().min(0).max(100).nullable().optional() });
const trainingSchema = z.object({ title: z.string().trim().min(1).max(255), facilitator: z.string().trim().min(1).max(150), sessionAt: z.string().datetime().nullable().optional(), status: z.string().trim().min(1).max(50).default('scheduled'), priority: z.string().trim().min(1).max(50).default('standard') });
const weighInSchema = z.object({ animalId: idSchema, weightKg: z.coerce.number().positive().max(10000), measuredAt: z.string().datetime().optional(), note: z.string().trim().max(1000).optional() });
const settingsSchema = z.object({ farmName: z.string().trim().min(1).max(150), timezone: z.string().trim().min(1).max(100), alerts: z.boolean(), autoSync: z.boolean(), regionalCost: z.string().trim().length(3), notifications: z.string().trim().min(1).max(50) });

router.get('/dashboard', allowRoles('admin', 'manager', 'accountant'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT
      (SELECT COUNT(*) FROM animals WHERE status = 'healthy') healthyAnimals,
      (SELECT COUNT(*) FROM animals WHERE status = 'under_watch') animalsUnderWatch,
      (SELECT COUNT(*) FROM jobs WHERE status = 'open') openJobs,
      (SELECT COUNT(*) FROM users WHERE is_active = 1) activeStaff,
      (SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) FROM transactions) income,
      (SELECT COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END), 0) FROM transactions) expenses`);
    res.json({ success: true, data: (rows as unknown[])[0] });
  } catch (error) { next(error); }
});

router.get('/facility', allowRoles('admin', 'manager'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, name, status, CONCAT(health_percent, '%') health, type, note FROM facilities ORDER BY name");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/facility', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = facilitySchema.parse(req.body);
    const [result] = await pool.execute('INSERT INTO facilities (name, type, status, health_percent, note) VALUES (?, ?, ?, ?, ?)', [input.name, input.type, input.status, input.healthPercent, input.note ?? null]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'facility', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.get('/feed', allowRoles('admin', 'manager'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, item, CONCAT(FORMAT(quantity, 2), ' ', unit) stock, status, CASE WHEN expires_on IS NULL THEN '—' ELSE DATE_FORMAT(expires_on, '%b %e, %Y') END expiry, CASE WHEN quantity <= reorder_level THEN 'Reorder' ELSE 'On track' END reorder FROM feed_inventory ORDER BY item");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/feed', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = feedSchema.parse(req.body);
    const [result] = await pool.execute('INSERT INTO feed_inventory (item, quantity, unit, status, expires_on, reorder_level) VALUES (?, ?, ?, ?, ?, ?)', [input.item, input.quantity, input.unit, input.status, input.expiresOn ?? null, input.reorderLevel]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'feed_inventory', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.get('/farm', async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, name, crop, stage, CASE WHEN expected_yield IS NULL THEN '—' ELSE CONCAT(expected_yield, ' ', yield_unit) END yield, CASE WHEN moisture_percent IS NULL THEN '—' ELSE CONCAT(moisture_percent, '%') END moisture FROM farm_fields ORDER BY name");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/farm', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = fieldSchema.parse(req.body);
    const [result] = await pool.execute('INSERT INTO farm_fields (name, crop, stage, expected_yield, yield_unit, moisture_percent) VALUES (?, ?, ?, ?, ?, ?)', [input.name, input.crop, input.stage, input.expectedYield ?? null, input.yieldUnit, input.moisturePercent ?? null]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'farm_field', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.get('/train', allowRoles('admin', 'manager'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, title, facilitator trainer, CASE WHEN session_at IS NULL THEN '—' ELSE DATE_FORMAT(session_at, '%b %e %l:%i %p') END next, status, priority level FROM training_sessions ORDER BY session_at IS NULL, session_at");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/train', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = trainingSchema.parse(req.body);
    const [result] = await pool.execute('INSERT INTO training_sessions (title, facilitator, session_at, status, priority) VALUES (?, ?, ?, ?, ?)', [input.title, input.facilitator, input.sessionAt ?? null, input.status, input.priority]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'training_session', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.get('/scale', allowRoles('admin', 'accountant'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT w.id, a.tag animal, CONCAT(w.weight_kg, ' kg') weight, DATE_FORMAT(w.measured_at, '%b %e') date, COALESCE(w.note, '—') note FROM weigh_ins w JOIN animals a ON a.id = w.animal_id ORDER BY w.measured_at DESC");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/scale', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = weighInSchema.parse(req.body);
    const [result] = await pool.execute('INSERT INTO weigh_ins (animal_id, weight_kg, measured_at, note, recorded_by_id) VALUES (?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?)', [input.animalId, input.weightKg, input.measuredAt ?? null, input.note ?? null, req.session.user!.id]);
    await pool.execute('UPDATE animals SET weight_kg = ? WHERE id = ?', [input.weightKg, input.animalId]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'weigh_in', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.get('/analytics', allowRoles('admin', 'manager', 'accountant'), async (_req, res, next) => {
  try {
    const [summaryRows] = await pool.query(`SELECT
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense' AND transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) feedCost,
      (SELECT COUNT(*) FROM animals WHERE status = 'healthy') healthy,
      (SELECT COUNT(*) FROM animals) total,
      (SELECT COUNT(*) FROM time_logs WHERE status = 'completed' AND date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) completedShifts`);
    const summary = (summaryRows as Array<{ feedCost: number; healthy: number; total: number; completedShifts: number }>)[0];
    const [trendRows] = await pool.query("SELECT DAYOFWEEK(transaction_date) dayNumber, COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) value FROM transactions WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY) GROUP BY DAYOFWEEK(transaction_date)");
    const points = new Array(7).fill(0);
    for (const row of trendRows as Array<{ dayNumber: number; value: number }>) points[(row.dayNumber + 5) % 7] = Number(row.value);
    res.json({ success: true, data: { milkProduction: '—', feedCost: `UGX ${Math.abs(Number(summary.feedCost)).toLocaleString()}`, labourEfficiency: `${Number(summary.completedShifts)} shifts`, herdHealth: summary.total ? `${Math.round((Number(summary.healthy) / Number(summary.total)) * 100)}%` : '—', weeklyTrend: points } });
  } catch (error) { next(error); }
});
router.get('/analytics/summary', allowRoles('admin', 'manager', 'accountant'), async (_req, res, next) => {
  try {
    const [summaryRows] = await pool.query(`SELECT
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense' AND transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) feedCost,
      (SELECT COUNT(*) FROM animals WHERE status = 'healthy') healthy,
      (SELECT COUNT(*) FROM animals) total,
      (SELECT COUNT(*) FROM time_logs WHERE status = 'completed' AND date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) completedShifts`);
    const summary = (summaryRows as Array<{ feedCost: number; healthy: number; total: number; completedShifts: number }>)[0];
    const [trendRows] = await pool.query("SELECT DAYOFWEEK(transaction_date) dayNumber, COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) value FROM transactions WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY) GROUP BY DAYOFWEEK(transaction_date)");
    const points = new Array(7).fill(0);
    for (const row of trendRows as Array<{ dayNumber: number; value: number }>) points[(row.dayNumber + 5) % 7] = Number(row.value);
    res.json({ success: true, data: { milkProduction: '—', feedCost: `UGX ${Math.abs(Number(summary.feedCost)).toLocaleString()}`, labourEfficiency: `${Number(summary.completedShifts)} shifts`, herdHealth: summary.total ? `${Math.round((Number(summary.healthy) / Number(summary.total)) * 100)}%` : '—', weeklyTrend: points } });
  } catch (error) { next(error); }
});

router.get('/settings', allowRoles('admin'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT farm_name farmName, timezone, alerts, auto_sync autoSync, currency regionalCost, notifications FROM farm_settings WHERE id = 1');
    const setting = (rows as unknown[])[0] ?? { farmName: 'Farm Manager', timezone: 'Africa/Kampala', alerts: true, autoSync: false, regionalCost: 'UGX', notifications: 'Daily summary' };
    res.json({ success: true, data: setting });
  } catch (error) { next(error); }
});
router.put('/settings', allowRoles('admin'), async (req, res, next) => {
  try {
    const input = settingsSchema.parse(req.body);
    await pool.execute('INSERT INTO farm_settings (id, farm_name, timezone, alerts, auto_sync, currency, notifications) VALUES (1, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE farm_name = VALUES(farm_name), timezone = VALUES(timezone), alerts = VALUES(alerts), auto_sync = VALUES(auto_sync), currency = VALUES(currency), notifications = VALUES(notifications)', [input.farmName, input.timezone, input.alerts, input.autoSync, input.regionalCost.toUpperCase(), input.notifications]);
    await audit(req.session.user!.id, 'update', 'farm_settings', 1);
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.get('/animals', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, tag, type, breed, status, weight_kg weight, location FROM animals ORDER BY tag');
    res.json({ success: true, data: (rows as Array<Record<string, unknown>>).map(row => ({ ...row, status: statusLabel(row.status), weight: row.weight === null ? '—' : `${row.weight} kg` })) });
  } catch (error) { next(error); }
});
router.post('/animals', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = z.object({ tag: z.string().trim().min(1).max(100), type: z.string().trim().min(1).max(100), breed: z.string().trim().max(100).optional(), location: z.string().trim().max(150).optional() }).parse(req.body);
    const [result] = await pool.execute("INSERT INTO animals (tag, type, breed, location, status) VALUES (?, ?, ?, ?, 'healthy')", [input.tag, input.type, input.breed || null, input.location || null]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'animal', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.get('/time-logs', async (req, res, next) => {
  try {
    const user = req.session.user!;
    const filter = user.role === 'worker' ? ' WHERE t.employee_id = ?' : '';
    const params = user.role === 'worker' ? [user.id] : [];
    const [rows] = await pool.query(`SELECT t.id, u.name, DATE_FORMAT(t.date, '%b %e') date, DATE_FORMAT(t.clock_in_time, '%l:%i %p') \`in\`, COALESCE(DATE_FORMAT(t.clock_out_time, '%l:%i %p'), '—') \`out\`, IFNULL(CONCAT(t.hours_worked, 'h'), 'in progress') hours FROM time_logs t JOIN users u ON u.id = t.employee_id${filter} ORDER BY t.date DESC, t.clock_in_time DESC`, params);
    const [openRows] = await pool.execute('SELECT clock_in_time FROM time_logs WHERE employee_id = ? AND clock_out_time IS NULL ORDER BY clock_in_time DESC LIMIT 1', [user.id]);
    const open = (openRows as Array<{ clock_in_time: Date | string }>)[0];
    res.json({ success: true, data: rows, clockedIn: Boolean(open), clockedInAt: open?.clock_in_time ?? null });
  } catch (error) { next(error); }
});
router.post('/time-logs/clock', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.session.user!.id;
    const { action } = clockActionSchema.parse(req.body);

    // The employee row exists even before a first shift. Locking it serialises
    // requests for one employee, including the otherwise-unlocked no-shift case.
    await connection.beginTransaction();
    const [employeeRows] = await connection.execute('SELECT id FROM users WHERE id = ? AND is_active = 1 FOR UPDATE', [userId]);
    if (!(employeeRows as Array<{ id: number }>)[0]) {
      await connection.rollback();
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User account is unavailable.' } });
    }

    const [openRows] = await connection.execute('SELECT id FROM time_logs WHERE employee_id = ? AND clock_out_time IS NULL ORDER BY clock_in_time DESC LIMIT 1 FOR UPDATE', [userId]);
    const open = (openRows as Array<{ id: number }>)[0];

    if (action === 'clock_in') {
      if (open) {
        await connection.commit();
        return res.json({ success: true, clockedIn: true, alreadyClockedIn: true });
      }
      const [result] = await connection.execute("INSERT INTO time_logs (employee_id, date, clock_in_time, status) VALUES (?, CURRENT_DATE, CURRENT_TIMESTAMP, 'in_progress')", [userId]);
      const id = (result as { insertId: number }).insertId;
      await connection.commit();
      await audit(userId, 'clock_in', 'time_log', id);
      return res.status(201).json({ success: true, clockedIn: true });
    }

    if (!open) {
      await connection.commit();
      return res.json({ success: true, clockedIn: false, alreadyClockedOut: true });
    }

    await connection.execute("UPDATE time_logs SET clock_out_time = CURRENT_TIMESTAMP, hours_worked = ROUND(TIMESTAMPDIFF(MINUTE, clock_in_time, CURRENT_TIMESTAMP) / 60, 2), status = 'completed' WHERE id = ? AND employee_id = ? AND clock_out_time IS NULL", [open.id, userId]);
    await connection.commit();
    await audit(userId, 'clock_out', 'time_log', open.id);
    return res.json({ success: true, clockedIn: false });
  } catch (error) {
    try { await connection.rollback(); } catch { /* no transaction to roll back */ }
    next(error);
  } finally { connection.release(); }
});

router.get('/transactions', allowRoles('admin', 'accountant'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, DATE_FORMAT(transaction_date, '%b %e') date, description desc, CONCAT(UCASE(LEFT(type, 1)), SUBSTRING(type, 2)) type, amount FROM transactions ORDER BY transaction_date DESC, id DESC");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/transactions', allowRoles('admin', 'accountant'), async (req, res, next) => {
  try {
    const input = z.object({ description: z.string().trim().min(1).max(255), type: z.enum(['Income', 'Expense']), amount: z.coerce.number().positive() }).parse(req.body);
    const type = input.type.toLowerCase();
    const [result] = await pool.execute('INSERT INTO transactions (transaction_date, description, type, amount, recorded_by_id) VALUES (CURRENT_DATE, ?, ?, ?, ?)', [input.description, type, type === 'expense' ? -input.amount : input.amount, req.session.user!.id]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'transaction', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});
router.get('/finance/summary', allowRoles('admin', 'accountant'), async (_req, res, next) => {
  try { const [rows] = await pool.query("SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) income, COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END), 0) expenses, COALESCE(SUM(amount), 0) net FROM transactions"); res.json({ success: true, data: (rows as unknown[])[0] }); } catch (error) { next(error); }
});

router.get('/staff', allowRoles('admin', 'manager'), async (_req, res, next) => {
  try { const [rows] = await pool.query("SELECT u.id, u.name, CASE u.role WHEN 'admin' THEN 'Administrator' WHEN 'manager' THEN 'Farm Manager' WHEN 'accountant' THEN 'Accountant' ELSE 'Farm Worker' END role, COALESCE(s.department, '—') dept, CASE COALESCE(s.employment_status, 'active') WHEN 'active' THEN 'Active' ELSE 'On leave' END status FROM users u LEFT JOIN staff s ON s.user_id = u.id WHERE u.is_active = 1 ORDER BY u.name"); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.get('/users', allowRoles('admin'), async (_req, res, next) => {
  try { const [rows] = await pool.query('SELECT id, username, name, role FROM users WHERE is_active = 1 ORDER BY name'); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.post('/users', allowRoles('admin'), async (req, res, next) => {
  try {
    const input = z.object({ username: z.string().trim().min(3).max(100).regex(/^[a-zA-Z0-9_.-]+$/), name: z.string().trim().min(1).max(150), password: z.string().min(12).max(200), role: roleSchema }).parse(req.body);
    const [result] = await pool.execute('INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)', [input.username.toLowerCase(), input.name, await bcrypt.hash(input.password, 12), input.role]);
    const id = (result as { insertId: number }).insertId;
    await audit(req.session.user!.id, 'create', 'user', id);
    res.status(201).json({ success: true, data: { id } });
  } catch (error) { next(error); }
});
router.post('/users/:id/reset-password', allowRoles('admin'), async (req, res, next) => {
  try {
    const userId = idSchema.parse(req.params.id);
    const { password } = adminResetPasswordSchema.parse(req.body);
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute('UPDATE users SET password = ?, session_version = session_version + 1 WHERE id = ? AND is_active = 1', [hash, userId]);
    if (!(result as { affectedRows: number }).affectedRows) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User account not found.' } });
    await audit(req.session.user!.id, 'admin_password_reset', 'user', userId);
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.get('/chat/channels', async (_req, res, next) => {
  try { const [rows] = await pool.query('SELECT id, channel_name channelName FROM chat_channels WHERE is_active = 1 ORDER BY id'); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.get('/chat/channels/:id/messages', async (req, res, next) => {
  try { const channelId = idSchema.parse(req.params.id); const [rows] = await pool.execute("SELECT m.id, m.message_text text, u.name \`from\`, m.user_id userId, DATE_FORMAT(m.created_at, '%l:%i %p') time FROM chat_messages m JOIN users u ON u.id = m.user_id WHERE m.channel_id = ? ORDER BY m.created_at", [channelId]); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.post('/chat/channels/:id/messages', async (req, res, next) => {
  try { const channelId = idSchema.parse(req.params.id); const input = z.object({ text: z.string().trim().min(1).max(2000) }).parse(req.body); const [result] = await pool.execute('INSERT INTO chat_messages (channel_id, user_id, message_text) VALUES (?, ?, ?)', [channelId, req.session.user!.id, input.text]); await audit(req.session.user!.id, 'create', 'chat_message', (result as { insertId: number }).insertId); res.status(201).json({ success: true }); } catch (error) { next(error); }
});

export default router;
