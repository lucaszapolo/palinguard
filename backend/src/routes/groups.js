import { Router } from "express";
import { list, create, update, remove } from "../controllers/groupsController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", requireAuth, requireRole("read"), list);
router.post("/", requireAuth, requireRole("admin"), create);
router.put("/:id", requireAuth, requireRole("admin"), update);
router.delete("/:id", requireAuth, requireRole("admin"), remove);

export default router;
