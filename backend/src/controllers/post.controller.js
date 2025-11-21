import { validationResult } from "express-validator";
import { query } from "../config/database.js";
import { PostModel } from "../models/queries.js";
import { uploadVideoBuffer } from "../services/video.service.js";
import { aiService } from "../services/ai.service.js";
import {
  transcribeVideoBuffer,
  transcribeVideoUrl,
} from "../services/transcript.service.js";

export const listPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = 10;
    const offset = (page - 1) * limit;
    const posts = await PostModel.list({ limit, offset });
    res.json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await query("SELECT * FROM posts WHERE id = $1", [
      req.params.id,
    ]).then((result) => result.rows[0]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ data: post });
  } catch (error) {
    next(error);
  }
};

const normalizeTags = (rawTags) => {
  if (!rawTags) return [];

  if (Array.isArray(rawTags)) {
    return rawTags
      .filter(Boolean)
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof rawTags === "string") {
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(Boolean)
          .map((tag) => String(tag).trim())
          .filter(Boolean);
      }
    } catch {
      // fall through to comma split
    }
    return rawTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const ensureTranscript = async (post) => {
  if (post.transcript && post.transcript.trim().length > 20) {
    return post.transcript;
  }
  if (!post.video_url) return null;
  try {
    const transcript = await transcribeVideoUrl(post.video_url);
    if (transcript) {
      await query("UPDATE posts SET transcript=$1 WHERE id=$2", [
        transcript,
        post.id,
      ]);
      post.transcript = transcript;
      return transcript;
    }
  } catch (error) {
    console.warn("Failed to ensure transcript", error.message);
  }
  return null;
};

export const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Video file required" });
  }
  try {
    const manualThumbnail =
      typeof req.body.thumbnail_url === "string" &&
      req.body.thumbnail_url.trim().length
        ? req.body.thumbnail_url.trim()
        : null;
    const [upload, transcript] = await Promise.all([
      uploadVideoBuffer(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      ),
      transcribeVideoBuffer(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      ),
    ]);
    const post = await PostModel.create({
      creatorId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      videoUrl: upload.url,
      thumbnailUrl: manualThumbnail || upload.thumbnail,
      subject: req.body.subject,
      tags: normalizeTags(req.body.tags),
      duration: upload.duration,
      transcript,
    });
    res.status(201).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    await query(
      `INSERT INTO likes (user_id, post_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user.id, req.params.id]
    );
    res.json({ message: "Liked" });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    await query("DELETE FROM likes WHERE user_id=$1 AND post_id=$2", [
      req.user.id,
      req.params.id,
    ]);
    res.json({ message: "Unliked" });
  } catch (error) {
    next(error);
  }
};

export const bookmarkPost = async (req, res, next) => {
  try {
    await query(
      `INSERT INTO bookmarks (user_id, post_id)
       VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [req.user.id, req.params.id]
    );
    res.json({ message: "Bookmarked" });
  } catch (error) {
    next(error);
  }
};

export const unbookmarkPost = async (req, res, next) => {
  try {
    await query("DELETE FROM bookmarks WHERE user_id=$1 AND post_id=$2", [
      req.user.id,
      req.params.id,
    ]);
    res.json({ message: "Bookmark removed" });
  } catch (error) {
    next(error);
  }
};

const getContentSource = (post) => ({
  text:
    post?.transcript?.trim() || post?.description || "No transcript available.",
  source: post?.transcript?.trim() ? "transcript" : "description",
});

export const aiSummary = async (req, res, next) => {
  try {
    const post = await query("SELECT * FROM posts WHERE id=$1", [
      req.params.id,
    ]).then((result) => result.rows[0]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await ensureTranscript(post);
    const content = getContentSource(post);
    const summary = await aiService.summarize(post.id, content.text);
    res.json({ summary, source: content.source });
  } catch (error) {
    next(error);
  }
};

export const aiQuiz = async (req, res, next) => {
  try {
    const post = await query("SELECT * FROM posts WHERE id=$1", [
      req.params.id,
    ]).then((result) => result.rows[0]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await ensureTranscript(post);
    const content = getContentSource(post);
    const quiz = await aiService.quiz(post.id, content.text);
    // If AI is unavailable or returns bad JSON, quiz will be an empty array.
    res.json({ quiz, source: content.source });
  } catch (error) {
    // Fallback: never crash the route, just return an empty quiz.
    console.warn("aiQuiz failed", error.message);
    res.json({ quiz: [], source: "error" });
  }
};

export const aiFlashcards = async (req, res, next) => {
  try {
    const post = await query("SELECT * FROM posts WHERE id=$1", [
      req.params.id,
    ]).then((result) => result.rows[0]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await ensureTranscript(post);
    const content = getContentSource(post);
    const flashcards = await aiService.flashcards(post.id, content.text);
    res.json({ flashcards, source: content.source });
  } catch (error) {
    console.warn("aiFlashcards failed", error.message);
    res.json({ flashcards: [], source: "error" });
  }
};

export const aiExplain = async (req, res, next) => {
  try {
    const post = await query("SELECT * FROM posts WHERE id=$1", [
      req.params.id,
    ]).then((result) => result.rows[0]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await ensureTranscript(post);
    const content = getContentSource(post);
    const answer = await aiService.explain(req.body.question, content.text);
    res.json({ answer, source: content.source });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await query("SELECT creator_id FROM posts WHERE id=$1", [
      req.params.id,
    ]).then((result) => result.rows[0]);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.creator_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }
    await query("DELETE FROM posts WHERE id=$1", [req.params.id]);
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};
