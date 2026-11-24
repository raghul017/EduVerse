import { Router } from "express";
import {
  aiExplain,
  aiFlashcards,
  aiQuiz,
  aiSummary,
  bookmarkPost,
  createPost,
  deletePost,
  getPost,
  likePost,
  listPosts,
  unbookmarkPost,
  unlikePost,
} from "../controllers/post.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { uploadVideo } from "../middleware/upload.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { postValidator } from "../utils/validators.js";

const router = Router();

router.get("/", optionalAuth, listPosts);
router.get("/:id", optionalAuth, getPost);
router.post("/", authenticate, uploadVideo, postValidator, createPost);
router.post("/:id/like", authenticate, likePost);
router.delete("/:id/like", authenticate, unlikePost);
router.post("/:id/bookmark", authenticate, bookmarkPost);
router.delete("/:id/bookmark", authenticate, unbookmarkPost);
router.delete("/:id", authenticate, deletePost);

// AI endpoints - require authentication to prevent API abuse
router.get("/:id/ai-summary", authenticate, aiLimiter, aiSummary);
router.get("/:id/ai-quiz", authenticate, aiLimiter, aiQuiz);
router.post("/:id/ai-explain", authenticate, aiLimiter, aiExplain);
router.get("/:id/ai-flashcards", authenticate, aiLimiter, aiFlashcards);

export default router;
