import { pool } from './db';

/** Write audit events without ever making a completed business action fail. */
export async function audit(userId: number | null | undefined, action: string, entityType: string, entityId?: number | string | null) {
  try {
    await pool.execute(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
      [userId ?? null, action, entityType, entityId == null ? null : String(entityId)],
    );
  } catch (error) {
    // Audit availability must be monitored separately; avoid leaking SQL details to clients.
    console.error('Audit logging failed', error);
  }
}
