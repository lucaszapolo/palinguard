import { z } from "zod";
import { createPendingUser, approveUser, listUsers } from "../services/userService.js";
import { logAudit } from "../services/auditService.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6)
});

const approveSchema = z.object({
  role: z.enum(["admin", "support", "read"]),
  groupIds: z.array(z.number().int()).optional()
});

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }
  const user = await createPendingUser(parsed.data);
  return res.status(201).json({ user });
}

export async function approve(req, res) {
  const parsed = approveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }
  await approveUser({ userId: Number(req.params.id), ...parsed.data });
  await logAudit({ userId: req.user.id, action: "approve_user", meta: { userId: Number(req.params.id) } });
  return res.status(204).send();
}

export async function list(req, res) {
  const users = await listUsers();
  return res.json({ data: users });
}
