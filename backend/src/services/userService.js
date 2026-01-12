import { query } from "../db.js";
import { hashPassword } from "./passwordService.js";
import { config } from "../config.js";
import { mockStore } from "../mock/store.js";

export async function findUserByLogin(login) {
  if (config.mockMode) {
    return (
      mockStore.users.find(
        (user) => user.email === login || user.username === login
      ) || null
    );
  }
  const text = `
    select id, name, email, username, password_hash, status, role
    from users
    where email = $1 or username = $1
    limit 1
  `;
  const result = await query(text, [login]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  if (config.mockMode) {
    return mockStore.users.find((user) => user.id === id) || null;
  }
  const text = `
    select id, name, email, username, password_hash, status, role
    from users
    where id = $1
    limit 1
  `;
  const result = await query(text, [id]);
  return result.rows[0] || null;
}

export async function createPendingUser({ name, email, username, password }) {
  if (config.mockMode) {
    const passwordHash = await hashPassword(password);
    const user = {
      id: mockStore.nextUserId(),
      name,
      email,
      username,
      password_hash: passwordHash,
      status: "pending",
      role: "support",
      created_at: new Date().toISOString()
    };
    mockStore.users.push(user);
    return user;
  }
  const passwordHash = await hashPassword(password);
  const text = `
    insert into users (name, email, username, password_hash, status, role)
    values ($1, $2, $3, $4, 'pending', 'support')
    returning id, name, email, username, status, role
  `;
  const result = await query(text, [name, email, username, passwordHash]);
  return result.rows[0];
}

export async function approveUser({ userId, role, groupIds }) {
  if (config.mockMode) {
    const user = mockStore.users.find((item) => item.id === userId);
    if (user) {
      user.status = "active";
      user.role = role;
    }
    if (groupIds && groupIds.length > 0) {
      for (let i = mockStore.userGroups.length - 1; i >= 0; i -= 1) {
        if (mockStore.userGroups[i].user_id === userId) {
          mockStore.userGroups.splice(i, 1);
        }
      }
      groupIds.forEach((groupId) => {
        mockStore.userGroups.push({ user_id: userId, group_id: groupId });
      });
    }
    return;
  }
  await query(
    `update users set status = 'active', role = $2 where id = $1`,
    [userId, role]
  );

  if (groupIds && groupIds.length > 0) {
    await query(`delete from user_groups where user_id = $1`, [userId]);
    const values = groupIds.map((groupId, index) => `($1, $${index + 2})`).join(", ");
    await query(`insert into user_groups (user_id, group_id) values ${values}`, [
      userId,
      ...groupIds
    ]);
  }
}

export async function listUsers() {
  if (config.mockMode) {
    return mockStore.users;
  }
  const result = await query(
    `select id, name, email, username, status, role, created_at from users order by created_at desc`
  );
  return result.rows;
}
