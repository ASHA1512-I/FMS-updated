import { Router } from 'express';
import { z } from 'zod';
import { pool } from './db';
import { allowRoles, requireAuth } from './auth';

const router = Router();
router.use(requireAuth);
const idSchema = z.coerce.number().int().positive();

const facilityData = [
  { name: 'Milking parlor', status: 'Operational', health: '92%', type: 'Core facility', note: 'No downtime in the last 7 days' },
  { name: 'Barn 2', status: 'Maintenance due', health: '74%', type: 'Housing', note: 'Water trough valve replacement scheduled' },
  { name: 'Feed store', status: 'Stocked', health: '88%', type: 'Storage', note: 'Top-up order due Monday' },
  { name: 'Cooling tank', status: 'Operational', health: '95%', type: 'Equipment', note: 'Temperature under range' },
];
const feedInventory = [
  { item: 'Maize silage', stock: '1,420 kg', status: 'Healthy', expiry: '12 days', reorder: 'Low' },
  { item: 'Concentrate meal', stock: '860 kg', status: 'Healthy', expiry: '23 days', reorder: 'On track' },
  { item: 'Hay bales', stock: '64 bales', status: 'Dry', expiry: '31 days', reorder: 'Low' },
  { item: 'Mineral lick', stock: '18 bags', status: 'Active', expiry: '45 days', reorder: 'On track' },
];
const farmFields = [
  { name: 'North paddock', crop: 'Maize', stage: 'Vegetative', yield: '18.5 t', moisture: '17%' },
  { name: 'West grazing', crop: 'Pasture', stage: 'Regrowth', yield: '11.2 t', moisture: '19%' },
  { name: 'South plot', crop: 'Napier grass', stage: 'Cutting cycle', yield: '9.8 t', moisture: '16%' },
  { name: 'Lower orchard', crop: 'Fruit trees', stage: 'Blooming', yield: '4.3 t', moisture: '14%' },
];
const trainingLog = [
  { title: 'Calf handling', trainer: 'Vet Services', next: 'Thu 9:00', status: 'Required', level: 'High priority' },
  { title: 'Biosecurity briefing', trainer: 'Farm manager', next: 'Fri 14:00', status: 'Scheduled', level: 'Standard' },
  { title: 'Milking hygiene', trainer: 'Operations lead', next: 'Mon 8:00', status: 'Due soon', level: 'Mandatory' },
  { title: 'Equipment safety', trainer: 'Maintenance', next: 'Wed 11:30', status: 'Completed', level: 'Low' },
];
const scaleLogs = [
  { animal: 'UG-0142', weight: '480 kg', date: 'Today', note: 'Stable weight' },
  { animal: 'UG-0143', weight: '410 kg', date: 'Today', note: 'Under watch' },
  { animal: 'UG-0145', weight: '395 kg', date: 'Yesterday', note: 'Good gain' },
  { animal: 'UG-0144', weight: '92 kg', date: 'Yesterday', note: 'Healthy calf' },
];
const analyticsSummary = {
  milkProduction: '2,420 L',
  feedCost: 'UGX 3.6M',
  labourEfficiency: '86%',
  herdHealth: '94%',
  weeklyTrend: [62, 68, 72, 79, 74, 83, 88],
};
const settingsProfile = {
  farmName: 'Mubiru Dairy Farm',
  timezone: 'East Africa Time (UTC+3)',
  alerts: true,
  autoSync: true,
  regionalCost: 'UGX',
  notifications: 'Daily summary',
};

router.get('/dashboard', async (req, res, next) => {
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

router.get('/facility', async (_req, res, next) => {
  try { res.json({ success: true, data: facilityData }); } catch (error) { next(error); }
});
router.get('/feed', async (_req, res, next) => {
  try { res.json({ success: true, data: feedInventory }); } catch (error) { next(error); }
});
router.get('/farm', async (_req, res, next) => {
  try { res.json({ success: true, data: farmFields }); } catch (error) { next(error); }
});
router.get('/train', async (_req, res, next) => {
  try { res.json({ success: true, data: trainingLog }); } catch (error) { next(error); }
});
router.get('/scale', async (_req, res, next) => {
  try { res.json({ success: true, data: scaleLogs }); } catch (error) { next(error); }
});
router.get('/analytics', async (_req, res, next) => {
  try { res.json({ success: true, data: analyticsSummary }); } catch (error) { next(error); }
});
router.get('/analytics/summary', async (_req, res, next) => {
  try { res.json({ success: true, data: analyticsSummary }); } catch (error) { next(error); }
});
router.get('/settings', async (_req, res, next) => {
  try { res.json({ success: true, data: settingsProfile }); } catch (error) { next(error); }
});

router.get('/animals', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, tag, type, breed, status, weight_kg weight, location FROM animals ORDER BY tag');
    res.json({ success: true, data: (rows as Array<Record<string, unknown>>).map(row => ({ ...row, status: String(row.status).replace('_', ' ').replace(/\\b\\w/g, letter => letter.toUpperCase()), weight: row.weight === null ? '—' : `${row.weight} kg` })) });
  } catch (error) { next(error); }
});
router.post('/animals', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = z.object({ tag: z.string().trim().min(1).max(100), type: z.string().trim().min(1).max(100), breed: z.string().trim().max(100).optional(), location: z.string().trim().max(150).optional() }).parse(req.body);
    const [result] = await pool.execute('INSERT INTO animals (tag, type, breed, location, status) VALUES (?, ?, ?, ?, \'healthy\')', [input.tag, input.type, input.breed || null, input.location || null]);
    res.status(201).json({ success: true, data: { id: (result as { insertId: number }).insertId } });
  } catch (error) { next(error); }
});

router.get('/time-logs', async (req, res, next) => {
  try {
    const user = req.session.user!;
    const filter = user.role === 'worker' ? ' WHERE t.employee_id = ?' : '';
    const params = user.role === 'worker' ? [user.id] : [];
    const [rows] = await pool.query(`SELECT t.id, u.name, DATE_FORMAT(t.date, '%b %e') date, DATE_FORMAT(t.clock_in_time, '%l:%i %p') \`in\`, COALESCE(DATE_FORMAT(t.clock_out_time, '%l:%i %p'), '—') \`out\`, IFNULL(CONCAT(t.hours_worked, 'h'), 'in progress') hours FROM time_logs t JOIN users u ON u.id = t.employee_id${filter} ORDER BY t.date DESC, t.clock_in_time DESC`, params);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/time-logs/clock', async (req, res, next) => {
  try {
    const userId = req.session.user!.id;
    const [openRows] = await pool.execute('SELECT id FROM time_logs WHERE employee_id = ? AND date = CURRENT_DATE AND clock_out_time IS NULL LIMIT 1', [userId]);
    const open = (openRows as Array<{ id: number }>)[0];
    if (open) {
      await pool.execute("UPDATE time_logs SET clock_out_time = CURRENT_TIMESTAMP, hours_worked = ROUND(TIMESTAMPDIFF(MINUTE, clock_in_time, CURRENT_TIMESTAMP) / 60, 2), status = 'completed' WHERE id = ?", [open.id]);
      return res.json({ success: true, clockedIn: false });
    }
    await pool.execute("INSERT INTO time_logs (employee_id, date, clock_in_time, status) VALUES (?, CURRENT_DATE, CURRENT_TIMESTAMP, 'in_progress')", [userId]);
    res.status(201).json({ success: true, clockedIn: true });
  } catch (error) { next(error); }
});

router.get('/transactions', async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, DATE_FORMAT(transaction_date, '%b %e') date, description desc, CONCAT(UCASE(LEFT(type, 1)), SUBSTRING(type, 2)) type, amount FROM transactions ORDER BY transaction_date DESC, id DESC");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/transactions', allowRoles('admin', 'accountant'), async (req, res, next) => {
  try {
    const input = z.object({ description: z.string().trim().min(1).max(255), type: z.enum(['Income', 'Expense']), amount: z.coerce.number().positive() }).parse(req.body);
    const type = input.type.toLowerCase();
    await pool.execute('INSERT INTO transactions (transaction_date, description, type, amount, recorded_by_id) VALUES (CURRENT_DATE, ?, ?, ?, ?)', [input.description, type, type === 'expense' ? -input.amount : input.amount, req.session.user!.id]);
    res.status(201).json({ success: true });
  } catch (error) { next(error); }
});
router.get('/finance/summary', async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) income, COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END), 0) expenses, COALESCE(SUM(amount), 0) net FROM transactions");
    res.json({ success: true, data: (rows as unknown[])[0] });
  } catch (error) { next(error); }
});

router.get('/staff', async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT u.id, u.name, CASE u.role WHEN 'admin' THEN 'Administrator' WHEN 'manager' THEN 'Farm Manager' WHEN 'accountant' THEN 'Accountant' ELSE 'Farm Worker' END role, COALESCE(s.department, '—') dept, CASE COALESCE(s.employment_status, 'active') WHEN 'active' THEN 'Active' ELSE 'On leave' END status FROM users u LEFT JOIN staff s ON s.user_id = u.id WHERE u.is_active = 1 ORDER BY u.name");
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.get('/users', allowRoles('admin'), async (_req, res, next) => {
  try { const [rows] = await pool.query("SELECT id, username, name, role FROM users WHERE is_active = 1 ORDER BY name"); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.post('/users', allowRoles('admin'), async (req, res, next) => {
  try {
    const input = z.object({ username: z.string().trim().min(1).max(100), name: z.string().trim().min(1).max(150), password: z.string().min(6).max(200), role: z.enum(['admin', 'manager', 'accountant', 'worker']) }).parse(req.body);
    const bcrypt = await import('bcryptjs');
    const [result] = await pool.execute('INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)', [input.username.toLowerCase(), input.name, await bcrypt.hash(input.password, 12), input.role]);
    res.status(201).json({ success: true, data: { id: (result as { insertId: number }).insertId } });
  } catch (error) { next(error); }
});

router.get('/chat/channels', async (_req, res, next) => {
  try { const [rows] = await pool.query('SELECT id, channel_name channelName FROM chat_channels WHERE is_active = 1 ORDER BY id'); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.get('/chat/channels/:id/messages', async (req, res, next) => {
  try {
    const channelId = idSchema.parse(req.params.id);
    const [rows] = await pool.execute("SELECT m.id, m.message_text text, u.name \`from\`, m.user_id userId, DATE_FORMAT(m.created_at, '%l:%i %p') time FROM chat_messages m JOIN users u ON u.id = m.user_id WHERE m.channel_id = ? ORDER BY m.created_at", [channelId]);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});
router.post('/chat/channels/:id/messages', async (req, res, next) => {
  try {
    const channelId = idSchema.parse(req.params.id);
    const input = z.object({ text: z.string().trim().min(1).max(2000) }).parse(req.body);
    await pool.execute('INSERT INTO chat_messages (channel_id, user_id, message_text) VALUES (?, ?, ?)', [channelId, req.session.user!.id, input.text]);
    res.status(201).json({ success: true });
  } catch (error) { next(error); }
});

export default router;
