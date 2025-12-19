import { validationResult } from "express-validator";
import { query } from "../config/database.js";
import { PostModel } from "../models/queries.js";
import { uploadVideoBuffer, uploadVideoFile } from "../services/video.service.js";
import { aiService } from "../services/ai.service.js";
import {
  transcribeVideoBuffer,
  transcribeVideoUrl,
} from "../services/transcript.service.js";
import fs from "fs";

export const listPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = 10;
    const offset = (page - 1) * limit;
    const userId = req.user?.id || null;
    const posts = await PostModel.list({ limit, offset, userId });
    res.json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const postId = req.params.id;
    let post;
    
    // Increment views_count (fire and forget, don't wait)
    query(
      'UPDATE posts SET views_count = views_count + 1 WHERE id = $1',
      [postId]
    ).catch(err => console.warn('[Post] Failed to increment views:', err.message));
    
    if (userId) {
      post = await query(
        `SELECT posts.*,
         users.name as creator_name,
         (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as likes_count,
         (SELECT COUNT(*) FROM bookmarks WHERE post_id = posts.id) as bookmarks_count,
         (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = $2) > 0 as liked,
         (SELECT COUNT(*) FROM bookmarks WHERE post_id = posts.id AND user_id = $2) > 0 as bookmarked
         FROM posts
         LEFT JOIN users ON users.id = posts.creator_id
         WHERE posts.id = $1`,
        [postId, userId]
      ).then((result) => result.rows[0]);
    } else {
      post = await query(
        `SELECT posts.*,
         users.name as creator_name,
         (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as likes_count,
         (SELECT COUNT(*) FROM bookmarks WHERE post_id = posts.id) as bookmarks_count,
         false as liked,
         false as bookmarked
         FROM posts
         LEFT JOIN users ON users.id = posts.creator_id
         WHERE posts.id = $1`,
        [postId]
      ).then((result) => result.rows[0]);
    }
    
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
  
  console.log('[Post Controller] Starting video upload:', {
    fileName: req.file.originalname,
    fileSize: req.file.size,
    mimetype: req.file.mimetype,
    title: req.body.title
  });
  
  try {
    const manualThumbnail =
      typeof req.body.thumbnail_url === "string" &&
      req.body.thumbnail_url.trim().length
        ? req.body.thumbnail_url.trim()
        : null;
    
    console.log('[Post Controller] Uploading to Cloudinary...');
    
    // Use file path (disk storage) or buffer (memory storage) depending on what's available
    let upload;
    const filePath = req.file.path; // From disk storage
    const buffer = req.file.buffer; // From memory storage (legacy)
    
    if (filePath) {
      // Disk storage - preferred method (avoids memory issues)
      upload = await uploadVideoFile(filePath, req.file.originalname);
    } else if (buffer) {
      // Memory storage (legacy fallback)
      upload = await uploadVideoBuffer(buffer, req.file.originalname, req.file.mimetype);
    } else {
      return res.status(400).json({ message: 'Video file data not found' });
    }
    
    console.log('[Post Controller] Cloudinary upload successful:', upload.url);
    
    // Try to get transcript from the uploaded URL (since we cleaned up local file)
    let transcript = null;
    try {
      transcript = await Promise.race([
        transcribeVideoUrl(upload.url),
        new Promise((resolve) => setTimeout(() => resolve(null), 15000)) // 15s timeout
      ]);
      if (transcript) {
        console.log('[Post Controller] Transcript generated during upload');
      }
    } catch (err) {
      console.warn('[Post Controller] Transcript generation failed:', err.message);
    }
    
    console.log('[Post Controller] Creating post in database...');
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
    console.log('[Post Controller] Post created successfully:', post.id);
    
    // Update transcript in background after post is created if we didn't get it
    if (!transcript && post?.id) {
      transcribeVideoUrl(upload.url).then(t => {
        if (t && post.id) {
          console.log('[Post Controller] Transcript generated, updating post');
          query("UPDATE posts SET transcript=$1 WHERE id=$2", [t, post.id]).catch(err => 
            console.warn('[Post Controller] Failed to update transcript:', err.message)
          );
        }
      }).catch(err => 
        console.warn('[Post Controller] Transcript generation failed:', err.message)
      );
    }
    
    res.status(201).json({ data: post });
  } catch (error) {
    console.error('[Post Controller] Upload error:', error.message, error.stack);
    
    // Clean up temp file on error if disk storage was used
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        // Ignore cleanup errors
      }
    }
    
    // Provide more specific error messages
    if (error.message.includes('Cloudinary')) {
      return res.status(500).json({ message: 'Video upload service is unavailable. Please check server configuration.' });
    }
    if (error.message.includes('timeout')) {
      return res.status(408).json({ message: 'Upload timed out. Please try a smaller video or check your connection.' });
    }
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
    const { question } = req.body;
    
    // Validate question
    if (!question || typeof question !== 'string' || question.trim().length < 2) {
      return res.status(400).json({ message: "Question is required (min 2 characters)" });
    }
    
    if (question.length > 500) {
      return res.status(400).json({ message: "Question is too long (max 500 characters)" });
    }
    
    const post = await query("SELECT * FROM posts WHERE id=$1", [
      req.params.id,
    ]).then((result) => result.rows[0]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await ensureTranscript(post);
    const content = getContentSource(post);
    
    // Sanitize user input before sending to AI
    const sanitizedQuestion = question.trim().substring(0, 500);
    const answer = await aiService.explain(sanitizedQuestion, content.text);
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
