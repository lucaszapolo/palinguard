import { z } from "zod";
import { query } from "../db.js";
import { config } from "../config.js";
import { mockStore } from "../mock/store.js";

const groupSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable()
});

export async function list(req, res) {
  if (config.mockMode) {
    return res.json({ data: mockStore.groups });
  }
  const result = await query(`select id, name, description, created_at from groups order by name`);
  return res.json({ data: result.rows });
}

export async function create(req, res) {
  const parsed = groupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }
  if (config.mockMode) {
    const group = {
      id: mockStore.nextGroupId(),
      name: parsed.data.name,
      description: parsed.data.description || "",
      created_at: new Date().toISOString()
    };
    mockStore.groups.push(group);
    return res.status(201).json({ id: group.id });
  }
  const result = await query(
    `insert into groups (name, description) values ($1, $2) returning id`,
    [parsed.data.name, parsed.data.description || null]
  );
  return res.status(201).json({ id: result.rows[0].id });
}

export async function update(req, res) {
  const parsed = groupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }
  if (config.mockMode) {
    const group = mockStore.groups.find((item) => item.id === Number(req.params.id));
    if (group) {
      group.name = parsed.data.name;
      group.description = parsed.data.description || "";
    }
    return res.status(204).send();
  }
  await query(
    `update groups set name = $1, description = $2 where id = $3`,
    [parsed.data.name, parsed.data.description || null, Number(req.params.id)]
  );
  return res.status(204).send();
}

export async function remove(req, res) {
  if (config.mockMode) {
    const index = mockStore.groups.findIndex((item) => item.id === Number(req.params.id));
    if (index >= 0) {
      mockStore.groups.splice(index, 1);
    }
    return res.status(204).send();
  }
  await query(`delete from groups where id = $1`, [Number(req.params.id)]);
  return res.status(204).send();
}
