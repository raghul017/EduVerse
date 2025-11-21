import { Router } from "express";
import {
  createCommunity,
  getCommunityPosts,
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
router.post("/:id/join", authenticate, joinCommunity);
router.delete("/:id/leave", authenticate, leaveCommunity);
router.get("/:id/messages", authenticate, listMessages);
router.post("/:id/messages", authenticate, createMessage);
router.delete("/:id/messages/:messageId", authenticate, deleteMessage);

export default router;
