import { z } from "zod";
import {
  listSecrets,
  getSecretById,
  createSecret,
  updateSecret,
  deleteSecret,
  revealSecret
} from "../services/secretService.js";
import { logAudit } from "../services/auditService.js";

const baseSchema = z.object({
  title: z.string().min(2),
  type: z.string().min(2),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  site: z.string().min(2),
  groupId: z.number().int(),
  visibility: z.string().min(2),
  notes: z.string().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable()
});

export async function list(req, res) {
  const filters = {
    groupId: req.query.groupId ? Number(req.query.groupId) : undefined,
    title: req.query.title,
    username: req.query.username,
    email: req.query.email
  };
  const paging = {
    limit: req.query.limit ? Number(req.query.limit) : 50,
    offset: req.query.offset ? Number(req.query.offset) : 0
  };

  const secrets = await listSecrets(filters, paging);
  return res.json({ data: secrets });
}

export async function create(req, res) {
  const parsed = baseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  const result = await createSecret({
    ...parsed.data,
    createdBy: req.user.id
  });
  await logAudit({ userId: req.user.id, action: "create", secretId: result.id });
  return res.status(201).json({ id: result.id });
}

export async function update(req, res) {
  const schema = baseSchema.partial();
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  await updateSecret(Number(req.params.id), parsed.data);
  await logAudit({ userId: req.user.id, action: "edit", secretId: Number(req.params.id) });
  return res.status(204).send();
}

export async function remove(req, res) {
  await deleteSecret(Number(req.params.id));
  await logAudit({ userId: req.user.id, action: "delete", secretId: Number(req.params.id) });
  return res.status(204).send();
}

export async function reveal(req, res) {
  const secret = await getSecretById(Number(req.params.id));
  if (!secret) {
    return res.status(404).json({ error: "not_found" });
  }
  const password = revealSecret(secret);
  await logAudit({ userId: req.user.id, action: "reveal", secretId: secret.id });
  return res.json({ password });
}
