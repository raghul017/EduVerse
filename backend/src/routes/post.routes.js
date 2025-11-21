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
router.get("/:id/ai-summary", aiSummary);
router.get("/:id/ai-quiz", aiQuiz);
router.post("/:id/ai-explain", aiExplain);
router.get("/:id/ai-flashcards", aiFlashcards);

export default router;
