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
  aiResources,
  getAiUsage,
  aiChat,
} from "../controllers/path.controller.js";

const router = Router();

router.get("/", optionalAuth, listPaths);
router.get("/:id", optionalAuth, getPath);
router.post("/", authenticate, createPath);
router.get("/:id/progress", authenticate, getPathProgress);
router.post("/:id/progress", authenticate, updatePathProgress);
router.post("/ai-roadmap", optionalAuth, aiRoadmap);
router.post("/ai-course", optionalAuth, aiCourse);
router.post("/ai-resources", optionalAuth, aiResources);
router.post("/ai-chat", optionalAuth, aiChat);
router.get("/ai-usage/stats", getAiUsage);

export default router;
