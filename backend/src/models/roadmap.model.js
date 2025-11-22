// Model for User Roadmaps and Progress
import { query } from "../config/database.js";

export const RoadmapModel = {
  // Save or update a roadmap for a user
  async saveRoadmap(userId, role, roadmapData) {
    const result = await query(
      `INSERT INTO user_roadmaps (user_id, role, roadmap_data)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, role) 
       DO UPDATE SET roadmap_data = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, role, JSON.stringify(roadmapData)]
    );
    return result.rows[0];
  },

  // Get a roadmap for a user by role
  async getRoadmap(userId, role) {
    const result = await query(
      `SELECT * FROM user_roadmaps 
       WHERE user_id = $1 AND role = $2`,
      [userId, role]
    );
    return result.rows[0];
  },

  // Get all roadmaps for a user
  async getUserRoadmaps(userId) {
    const result = await query(
      `SELECT * FROM user_roadmaps 
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    );
    return result.rows;
  },

  // Delete a roadmap
  async deleteRoadmap(userId, role) {
    await query(
      `DELETE FROM user_roadmaps 
       WHERE user_id = $1 AND role = $2`,
      [userId, role]
    );
  },
};

export const ProgressModel = {
  // Save or update progress for a node
  async saveProgress(userId, roadmapId, nodeId, completed) {
    const result = await query(
      `INSERT INTO roadmap_progress (user_id, roadmap_id, node_id, completed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, roadmap_id, node_id)
       DO UPDATE SET completed = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, roadmapId, nodeId, completed]
    );
    return result.rows[0];
  },

  // Get all progress for a roadmap
  async getRoadmapProgress(userId, roadmapId) {
    const result = await query(
      `SELECT * FROM roadmap_progress
       WHERE user_id = $1 AND roadmap_id = $2`,
      [userId, roadmapId]
    );
    return result.rows;
  },

  // Get progress for a specific node
  async getNodeProgress(userId, roadmapId, nodeId) {
    const result = await query(
      `SELECT * FROM roadmap_progress
       WHERE user_id = $1 AND roadmap_id = $2 AND node_id = $3`,
      [userId, roadmapId, nodeId]
    );
    return result.rows[0];
  },

  // Delete all progress for a roadmap
  async deleteRoadmapProgress(roadmapId) {
    await query(
      `DELETE FROM roadmap_progress 
       WHERE roadmap_id = $1`,
      [roadmapId]
    );
  },
};
