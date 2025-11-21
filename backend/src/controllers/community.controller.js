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
    const posts = await query(
      "SELECT * FROM posts WHERE subject = (SELECT subject FROM communities WHERE id=$1)",
      [req.params.id]
    ).then((result) => result.rows);
    res.json({ data: posts });
  } catch (error) {
    next(error);
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
