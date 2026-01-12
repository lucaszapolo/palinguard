import { verifyAccessToken } from "../services/tokenService.js";
import { findUserById } from "../services/userService.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.sub);
    if (!user || user.status !== "active") {
      return res.status(401).json({ error: "invalid_user" });
    }
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username
    };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "invalid_token" });
  }
}
