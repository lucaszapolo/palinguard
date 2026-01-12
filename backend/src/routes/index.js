import { Router } from "express";
import authRoutes from "./auth.js";
import usersRoutes from "./users.js";
import groupsRoutes from "./groups.js";
import secretsRoutes from "./secrets.js";
import importsRoutes from "./imports.js";
import exportsRoutes from "./exports.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/groups", groupsRoutes);
router.use("/secrets", secretsRoutes);
router.use("/imports", importsRoutes);
router.use("/exports", exportsRoutes);

export default router;
