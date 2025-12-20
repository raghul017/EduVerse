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
  saveProgress,
  getProgress,
  getUserRoadmaps,
  deleteRoadmap,
} from "../controllers/path.controller.js";

const router = Router();

// AI and usage routes (no params)
router.post("/ai-roadmap", optionalAuth, aiRoadmap);
router.post("/ai-course", optionalAuth, aiCourse);
router.post("/ai-resources", optionalAuth, aiResources);
router.post("/ai-chat", optionalAuth, aiChat);
router.get("/ai-usage/stats", getAiUsage);

// Roadmap persistence routes (specific routes BEFORE parameterized routes)
router.get("/roadmaps/user", authenticate, getUserRoadmaps);
router.get("/my-roadmaps", authenticate, getUserRoadmaps); // Alias for easier frontend access
router.post("/roadmap/progress", authenticate, saveProgress);
router.get("/roadmap/:roadmapId/progress", authenticate, getProgress);
router.delete("/roadmaps/:roadmapId", authenticate, deleteRoadmap);

// Path CRUD routes (parameterized - must come AFTER specific routes)
router.get("/", optionalAuth, listPaths);
router.post("/", authenticate, createPath);
router.get("/:id", optionalAuth, getPath);
router.get("/:id/progress", authenticate, getPathProgress);
router.post("/:id/progress", authenticate, updatePathProgress);

export default router;

