import { query } from "../db.js";
import { config } from "../config.js";

export async function logAudit({ userId, action, secretId = null, meta = {} }) {
  if (config.mockMode) {
    return;
  }
  const text = `
    insert into audit_logs (user_id, action, secret_id, meta)
    values ($1, $2, $3, $4)
  `;
  await query(text, [userId, action, secretId, meta]);
}
