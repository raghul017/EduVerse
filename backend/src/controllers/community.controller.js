import { validationResult } from "express-validator";
import { query } from "../config/database.js";

export const listCommunities = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    let communities;
    if (userId) {
      // Include membership status for authenticated users
      communities = await query(
        `SELECT c.*, 
                COUNT(DISTINCT cm.user_id)::int AS member_count,
                EXISTS(SELECT 1 FROM community_members WHERE community_id = c.id AND user_id = $1) AS joined
         FROM communities c
         LEFT JOIN community_members cm ON cm.community_id = c.id
         GROUP BY c.id
         ORDER BY c.name ASC`,
        [userId]
      ).then((result) => result.rows);
    } else {
      // For unauthenticated users, just get communities with member counts
      communities = await query(
        `SELECT c.*, 
                COUNT(DISTINCT cm.user_id)::int AS member_count,
                false AS joined
         FROM communities c
         LEFT JOIN community_members cm ON cm.community_id = c.id
         GROUP BY c.id
         ORDER BY c.name ASC`
      ).then((result) => result.rows);
    }
    
    res.json({ data: communities });
  } catch (error) {
    next(error);
  }
};

export const getCommunityPosts = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const posts = await query(
      `SELECT cp.*, 
              u.name as user_name,
              (SELECT COUNT(*) FROM community_post_likes WHERE post_id = cp.id AND is_like = true) as upvotes,
              (SELECT COUNT(*) FROM community_post_likes WHERE post_id = cp.id AND is_like = false) as downvotes,
              (SELECT COUNT(*) FROM community_post_comments WHERE post_id = cp.id) as comments_count,
              ${userId ? `(SELECT is_like FROM community_post_likes WHERE post_id = cp.id AND user_id = '${userId}') as user_vote` : 'NULL as user_vote'}
       FROM community_posts cp 
       JOIN users u ON u.id = cp.user_id 
       WHERE cp.community_id = $1 
       ORDER BY cp.created_at DESC`,
      [req.params.id]
    ).then((result) => result.rows);
    res.json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const createCommunityPost = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const userId = req.user.id;
    const { title, description } = req.body;

    // Validate inputs
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Content is required." });
    }

    // Check if user is a member of the community
    const membership = await query(
      "SELECT 1 FROM community_members WHERE community_id=$1 AND user_id=$2",
      [communityId, userId]
    );
    if (membership.rowCount === 0) {
      return res.status(403).json({ message: "Join the community to post." });
    }

    // Create text post in community_posts table
    const inserted = await query(
      `INSERT INTO community_posts (community_id, user_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *, (SELECT name FROM users WHERE id = $2) as user_name`,
      [communityId, userId, title.trim(), description.trim()]
    ).then((result) => result.rows[0]);

    res.status(201).json({
      message: "Post created successfully",
      data: inserted
    });
  } catch (error) {
    console.error("Create community post error:", error);
    res.status(500).json({ 
      message: "Failed to create post",
      error: error.message 
    });
  }
};

export const updateCommunityPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { title, content } = req.body;

    // Check if post belongs to user
    const post = await query(
      "SELECT * FROM community_posts WHERE id = $1",
      [postId]
    ).then(r => r.rows[0]);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.user_id !== userId) {
      return res.status(403).json({ message: "You can only edit your own posts." });
    }

    const updated = await query(
      `UPDATE community_posts 
       SET title = $1, content = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [title.trim(), content.trim(), postId]
    ).then(r => r.rows[0]);

    res.json({ message: "Post updated", data: updated });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deleteCommunityPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post belongs to user
    const post = await query(
      "SELECT user_id FROM community_posts WHERE id = $1",
      [postId]
    ).then(r => r.rows[0]);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own posts." });
    }

    await query("DELETE FROM community_posts WHERE id = $1", [postId]);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const togglePostLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { isLike } = req.body; // true = like, false = dislike

    // Check if already reacted
    const existing = await query(
      "SELECT * FROM community_post_likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    ).then(r => r.rows[0]);

    if (existing) {
      if (existing.is_like === isLike) {
        // Remove reaction (toggle off)
        await query(
          "DELETE FROM community_post_likes WHERE post_id = $1 AND user_id = $2",
          [postId, userId]
        );
        res.json({ message: "Reaction removed", action: "removed" });
      } else {
        // Switch reaction
        await query(
          "UPDATE community_post_likes SET is_like = $1 WHERE post_id = $2 AND user_id = $3",
          [isLike, postId, userId]
        );
        res.json({ message: "Reaction updated", action: "updated", isLike });
      }
    } else {
      // Add new reaction
      await query(
        "INSERT INTO community_post_likes (post_id, user_id, is_like) VALUES ($1, $2, $3)",
        [postId, userId, isLike]
      );
      res.json({ message: "Reaction added", action: "added", isLike });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Failed to toggle reaction" });
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await query(
      `SELECT c.*, u.name as user_name 
       FROM community_post_comments c 
       JOIN users u ON u.id = c.user_id 
       WHERE c.post_id = $1 
       ORDER BY c.created_at ASC`,
      [postId]
    ).then(r => r.rows);
    res.json({ data: comments });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Failed to load comments" });
  }
};

export const createPostComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    const inserted = await query(
      `INSERT INTO community_post_comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *, (SELECT name FROM users WHERE id = $2) as user_name`,
      [postId, userId, content.trim()]
    ).then(r => r.rows[0]);

    res.status(201).json({ message: "Comment added", data: inserted });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const joinCommunity = async (req, res, next) => {
  try {
    await query(
      `INSERT INTO community_members (community_id, user_id)
       VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [req.params.id, req.user.id]
    );
    res.json({ message: "Joined community" });
  } catch (error) {
    next(error);
  }
};

export const leaveCommunity = async (req, res, next) => {
  try {
    await query(
      "DELETE FROM community_members WHERE community_id=$1 AND user_id=$2",
      [req.params.id, req.user.id]
    );
    res.json({ message: "Left community" });
  } catch (error) {
    next(error);
  }
};

export const createCommunity = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  const { name, subject, description } = req.body;

  try {
    const result = await query(
      `INSERT INTO communities (name, subject, description)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [name.trim(), subject.trim(), description.trim()]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Subject already exists" });
    }
    next(error);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const messages = await query(
      `SELECT m.id,
              m.content,
              m.created_at,
              u.id as user_id,
              u.name as user_name
       FROM community_messages m
       JOIN users u ON u.id = m.user_id
       WHERE m.community_id = $1
       ORDER BY m.created_at ASC
       LIMIT 100`,
      [communityId]
    ).then((result) => result.rows);

    res.json({ data: messages });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message cannot be empty." });
    }

    // Optional: ensure user is a member before chatting
    const membership = await query(
      "SELECT 1 FROM community_members WHERE community_id=$1 AND user_id=$2",
      [communityId, userId]
    );
    if (membership.rowCount === 0) {
      return res.status(403).json({ message: "Join the community to chat." });
    }

    const inserted = await query(
      `INSERT INTO community_messages (community_id, user_id, content)
       VALUES ($1,$2,$3)
       RETURNING id, content, created_at`,
      [communityId, userId, content.trim()]
    ).then((result) => result.rows[0]);

    res.status(201).json({
      data: {
        ...inserted,
        user_id: userId,
        user_name: req.user.name || "You",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id: communityId, messageId } = req.params;
    const userId = req.user.id;

    if (!messageId || !communityId) {
      return res.status(400).json({ message: "Message ID and community ID are required." });
    }

    // Check if message exists and belongs to the user
    const message = await query(
      `SELECT id, user_id FROM community_messages 
       WHERE id = $1 AND community_id = $2`,
      [messageId, communityId]
    ).then((result) => result.rows[0]);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    // Compare user_id as string to handle UUID comparison
    if (String(message.user_id) !== String(userId)) {
      return res.status(403).json({ message: "You can only delete your own messages." });
    }

    const result = await query(
      "DELETE FROM community_messages WHERE id = $1 AND community_id = $2",
      [messageId, communityId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Delete message error:", error);
    next(error);
  }
};
