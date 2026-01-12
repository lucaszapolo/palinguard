import { z } from "zod";
import { comparePassword } from "../services/passwordService.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/tokenService.js";
import { findUserById, findUserByLogin } from "../services/userService.js";

const loginSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(6)
});

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  const { login: loginValue, password } = parsed.data;
  const user = await findUserByLogin(loginValue);
  if (!user || user.status !== "active") {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });

  return res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role
    }
  });
}

const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});

export async function refresh(req, res) {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  try {
    const payload = verifyRefreshToken(parsed.data.refreshToken);
    const user = await findUserById(payload.sub);
    if (!user || user.status !== "active") {
      return res.status(401).json({ error: "invalid_refresh" });
    }
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    return res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ error: "invalid_refresh" });
  }
}
