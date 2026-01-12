import { Router } from "express";
import { list, create, update, remove, reveal } from "../controllers/secretsController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", requireAuth, requireRole("read"), list);
router.post("/", requireAuth, requireRole("support"), create);
router.put("/:id", requireAuth, requireRole("support"), update);
router.delete("/:id", requireAuth, requireRole("admin"), remove);
router.post("/:id/reveal", requireAuth, requireRole("read"), reveal);

export default router;
