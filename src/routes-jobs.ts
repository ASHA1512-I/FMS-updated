import { Router } from 'express';
import { z } from 'zod';
import { pool } from './db';
import { allowRoles, requireAuth } from './auth';

const router = Router();
const createJob = z.object({ title: z.string().trim().min(1).max(255), description: z.string().trim().max(2000).optional(), assigneeId: z.number().int().positive().nullable().optional(), assignee: z.string().trim().max(150).optional(), dueDate: z.string().date().nullable().optional(), priority: z.enum(['low', 'medium', 'high']) });

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const user = req.session.user!;
    const filter = user.role === 'worker' ? ' WHERE j.assignee_id = ?' : '';
    const params = user.role === 'worker' ? [user.id] : [];
    const [rows] = await pool.query(`SELECT j.id, j.title, j.description, j.assignee_id assigneeId, u.name assignee, j.due_date dueDate, j.status, j.priority, j.created_at createdAt FROM jobs j LEFT JOIN users u ON u.id = j.assignee_id${filter} ORDER BY j.created_at DESC`, params);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
});

router.post('/', allowRoles('admin', 'manager'), async (req, res, next) => {
  try {
    const input = createJob.parse(req.body);
    let assigneeId = input.assigneeId ?? null;
    if (!assigneeId && input.assignee) {
      const [users] = await pool.execute('SELECT id FROM users WHERE name = ? AND is_active = 1 LIMIT 1', [input.assignee]);
      assigneeId = (users as Array<{ id: number }>)[0]?.id ?? null;
    }
    const [result] = await pool.execute('INSERT INTO jobs (title, description, assignee_id, due_date, status, priority, created_by_id) VALUES (?, ?, ?, ?, \'open\', ?, ?)', [input.title, input.description ?? null, assigneeId, input.dueDate ?? null, input.priority, req.session.user!.id]);
    res.status(201).json({ success: true, data: { id: (result as { insertId: number }).insertId } });
  } catch (error) { next(error); }
});

router.patch('/:id', allowRoles('admin', 'manager', 'worker'), async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    if (req.body.status !== 'done') return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Only completing a job is supported.' } });
    const user = req.session.user!;
    const condition = user.role === 'worker' ? ' AND assignee_id = ?' : '';
    const params = user.role === 'worker' ? [id, user.id] : [id];
    const [result] = await pool.execute(`UPDATE jobs SET status = 'done', completed_at = CURRENT_TIMESTAMP WHERE id = ?${condition}`, params);
    if (!(result as { affectedRows: number }).affectedRows) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Job not found.' } });
    res.json({ success: true });
  } catch (error) { next(error); }
});

export default router;