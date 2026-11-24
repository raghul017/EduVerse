import { Router } from "express";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  aiChatValidator,
  aiCourseValidator,
  aiResourcesValidator,
  aiRoadmapValidator,
  validate,
} from "../utils/validators.js";
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

// AI routes. Login required: these spend Groq quota, and anonymous access let
// anyone exhaust it. Order: who you are -> how often -> what you sent.
const ai = [authenticate, aiLimiter];
router.post("/ai-roadmap", ...ai, aiRoadmapValidator, validate, aiRoadmap);
router.post("/ai-course", ...ai, aiCourseValidator, validate, aiCourse);
router.post("/ai-resources", ...ai, aiResourcesValidator, validate, aiResources);
router.post("/ai-chat", ...ai, aiChatValidator, validate, aiChat);
router.get("/ai-usage/stats", authenticate, getAiUsage);

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

