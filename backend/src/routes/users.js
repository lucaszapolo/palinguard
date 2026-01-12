import { Router } from "express";
import { register, approve, list } from "../controllers/usersController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.post("/register", register);
router.get("/", requireAuth, requireRole("admin"), list);
router.post("/:id/approve", requireAuth, requireRole("admin"), approve);

export default router;
