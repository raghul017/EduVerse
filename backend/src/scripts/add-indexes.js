import { query } from "../config/database.js";

async function addIndexes() {
  console.log("Adding database indexes for performance optimization...");

  try {
    // Index for user_roadmaps: (user_id, role)
    // Used in: getRoadmap, saveRoadmap (ON CONFLICT), deleteRoadmap
    await query(`
      CREATE INDEX IF NOT EXISTS idx_user_roadmaps_user_role 
      ON user_roadmaps (user_id, role);
    `);
    console.log("✅ Added index: idx_user_roadmaps_user_role");

    // Index for user_roadmaps: (user_id)
    // Used in: getUserRoadmaps
    await query(`
      CREATE INDEX IF NOT EXISTS idx_user_roadmaps_user 
      ON user_roadmaps (user_id);
    `);
    console.log("✅ Added index: idx_user_roadmaps_user");

    // Index for roadmap_progress: (user_id, roadmap_id, node_id)
    // Used in: saveProgress (ON CONFLICT), getNodeProgress
    await query(`
      CREATE INDEX IF NOT EXISTS idx_roadmap_progress_composite 
      ON roadmap_progress (user_id, roadmap_id, node_id);
    `);
    console.log("✅ Added index: idx_roadmap_progress_composite");

    // Index for roadmap_progress: (user_id, roadmap_id)
    // Used in: getRoadmapProgress
    await query(`
      CREATE INDEX IF NOT EXISTS idx_roadmap_progress_roadmap 
      ON roadmap_progress (user_id, roadmap_id);
    `);
    console.log("✅ Added index: idx_roadmap_progress_roadmap");

    console.log("🎉 All indexes added successfully!");
  } catch (error) {
    console.error("❌ Error adding indexes:", error.message);
  } finally {
    process.exit();
  }
}

addIndexes();
