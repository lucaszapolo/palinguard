import { Router } from "express";
import { generate } from "../controllers/exportsController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.post("/", requireAuth, requireRole("admin"), generate);

export default router;
