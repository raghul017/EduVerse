import { Router } from "express";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import {
  createPath,
  getPath,
  getPathProgress,
  listPaths,
  updatePathProgress,
  aiRoadmap,
  aiCourse,
} from "../controllers/path.controller.js";

const router = Router();

router.get("/", optionalAuth, listPaths);
router.get("/:id", optionalAuth, getPath);
router.post("/", authenticate, createPath);
router.get("/:id/progress", authenticate, getPathProgress);
router.post("/:id/progress", authenticate, updatePathProgress);
router.post("/ai-roadmap", optionalAuth, aiRoadmap);
router.post("/ai-course", optionalAuth, aiCourse);

export default router;
