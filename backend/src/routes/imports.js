import { Router } from "express";
import { start } from "../controllers/importsController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.post("/", requireAuth, requireRole("admin"), start);

export default router;
