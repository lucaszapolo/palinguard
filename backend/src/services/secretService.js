import { query } from "../db.js";
import { encryptSecret, decryptSecret } from "./cryptoService.js";
import { config } from "../config.js";
import { mockStore } from "../mock/store.js";

function buildFilters(filters) {
  const clauses = [];
  const values = [];
  let index = 1;

  if (filters.groupId) {
    clauses.push(`group_id = $${index}`);
    values.push(filters.groupId);
    index += 1;
  }
  if (filters.title) {
    clauses.push(`title ilike $${index}`);
    values.push(`%${filters.title}%`);
    index += 1;
  }
  if (filters.username) {
    clauses.push(`username ilike $${index}`);
    values.push(`%${filters.username}%`);
    index += 1;
  }
  if (filters.email) {
    clauses.push(`email ilike $${index}`);
    values.push(`%${filters.email}%`);
    index += 1;
  }

  return {
    where: clauses.length > 0 ? `where ${clauses.join(" and ")}` : "",
    values
  };
}

export async function listSecrets(filters = {}, { limit = 50, offset = 0 } = {}) {
  if (config.mockMode) {
    let results = [...mockStore.secrets];
    if (filters.groupId) {
      results = results.filter((item) => item.group_id === filters.groupId);
    }
    if (filters.title) {
      const value = filters.title.toLowerCase();
      results = results.filter((item) => item.title.toLowerCase().includes(value));
    }
    if (filters.username) {
      const value = filters.username.toLowerCase();
      results = results.filter((item) => item.username.toLowerCase().includes(value));
    }
    if (filters.email) {
      const value = filters.email.toLowerCase();
      results = results.filter((item) => item.email.toLowerCase().includes(value));
    }
    return results.slice(offset, offset + limit);
  }
  const { where, values } = buildFilters(filters);
  const text = `
    select id, title, type, username, email, site, group_id, visibility,
           notes, created_at, updated_at, expires_at, created_by
    from secrets
    ${where}
    order by updated_at desc
    limit ${Number(limit)} offset ${Number(offset)}
  `;
  const result = await query(text, values);
  return result.rows;
}

export async function getSecretById(id) {
  if (config.mockMode) {
    return mockStore.secrets.find((item) => item.id === id) || null;
  }
  const text = `
    select id, title, type, username, email, site, group_id, visibility,
           notes, created_at, updated_at, expires_at, created_by,
           password_iv, password_tag, password_ciphertext
    from secrets
    where id = $1
  `;
  const result = await query(text, [id]);
  return result.rows[0] || null;
}

export async function createSecret(payload) {
  if (config.mockMode) {
    const encrypted = encryptSecret(payload.password);
    const secret = {
      id: mockStore.nextSecretId(),
      title: payload.title,
      type: payload.type,
      username: payload.username,
      email: payload.email,
      site: payload.site,
      group_id: payload.groupId,
      visibility: payload.visibility,
      notes: payload.notes || "",
      expires_at: payload.expiresAt || null,
      password_iv: encrypted.iv,
      password_tag: encrypted.tag,
      password_ciphertext: encrypted.ciphertext,
      created_by: payload.createdBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockStore.secrets.push(secret);
    return { id: secret.id };
  }
  const encrypted = encryptSecret(payload.password);
  const text = `
    insert into secrets
      (title, type, username, email, site, group_id, visibility, notes,
       created_by, expires_at, password_iv, password_tag, password_ciphertext)
    values
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    returning id
  `;
  const result = await query(text, [
    payload.title,
    payload.type,
    payload.username,
    payload.email,
    payload.site,
    payload.groupId,
    payload.visibility,
    payload.notes || null,
    payload.createdBy,
    payload.expiresAt || null,
    encrypted.iv,
    encrypted.tag,
    encrypted.ciphertext
  ]);
  return result.rows[0];
}

export async function updateSecret(id, payload) {
  if (config.mockMode) {
    const secret = mockStore.secrets.find((item) => item.id === id);
    if (!secret) {
      return;
    }
    const encrypted = payload.password ? encryptSecret(payload.password) : null;
    Object.assign(secret, {
      title: payload.title ?? secret.title,
      type: payload.type ?? secret.type,
      username: payload.username ?? secret.username,
      email: payload.email ?? secret.email,
      site: payload.site ?? secret.site,
      group_id: payload.groupId ?? secret.group_id,
      visibility: payload.visibility ?? secret.visibility,
      notes: payload.notes ?? secret.notes,
      expires_at: payload.expiresAt ?? secret.expires_at,
      password_iv: encrypted ? encrypted.iv : secret.password_iv,
      password_tag: encrypted ? encrypted.tag : secret.password_tag,
      password_ciphertext: encrypted ? encrypted.ciphertext : secret.password_ciphertext,
      updated_at: new Date().toISOString()
    });
    return;
  }
  const encrypted = payload.password ? encryptSecret(payload.password) : null;
  const text = `
    update secrets
       set title = $1,
           type = $2,
           username = $3,
           email = $4,
           site = $5,
           group_id = $6,
           visibility = $7,
           notes = $8,
           expires_at = $9,
           password_iv = coalesce($10, password_iv),
           password_tag = coalesce($11, password_tag),
           password_ciphertext = coalesce($12, password_ciphertext),
           updated_at = now()
     where id = $13
  `;
  await query(text, [
    payload.title,
    payload.type,
    payload.username,
    payload.email,
    payload.site,
    payload.groupId,
    payload.visibility,
    payload.notes || null,
    payload.expiresAt || null,
    encrypted ? encrypted.iv : null,
    encrypted ? encrypted.tag : null,
    encrypted ? encrypted.ciphertext : null,
    id
  ]);
}

export async function deleteSecret(id) {
  if (config.mockMode) {
    const index = mockStore.secrets.findIndex((item) => item.id === id);
    if (index >= 0) {
      mockStore.secrets.splice(index, 1);
    }
    return;
  }
  await query(`delete from secrets where id = $1`, [id]);
}

export function revealSecret(secretRow) {
  return decryptSecret({
    iv: secretRow.password_iv,
    tag: secretRow.password_tag,
    ciphertext: secretRow.password_ciphertext
  });
}
