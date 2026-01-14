import { Router } from "express";
import {
  createCommunity,
  getCommunityPosts,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  togglePostLike,
  getPostComments,
  createPostComment,
  joinCommunity,
  leaveCommunity,
  listCommunities,
  listMessages,
  createMessage,
  deleteMessage,
} from "../controllers/community.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { communityValidator } from "../utils/validators.js";

const router = Router();

router.get("/", optionalAuth, listCommunities);
router.post("/", authenticate, communityValidator, createCommunity);
router.get("/:id/posts", optionalAuth, getCommunityPosts);
router.post("/:id/posts", authenticate, createCommunityPost);
router.put("/posts/:postId", authenticate, updateCommunityPost);
router.delete("/posts/:postId", authenticate, deleteCommunityPost);
router.post("/posts/:postId/like", authenticate, togglePostLike);
router.get("/posts/:postId/comments", optionalAuth, getPostComments);
router.post("/posts/:postId/comments", authenticate, createPostComment);
router.post("/:id/join", authenticate, joinCommunity);
router.delete("/:id/leave", authenticate, leaveCommunity);
router.get("/:id/messages", authenticate, listMessages);
router.post("/:id/messages", authenticate, createMessage);
router.delete("/:id/messages/:messageId", authenticate, deleteMessage);

export default router;
