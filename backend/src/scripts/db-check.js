import { query, pool } from "../config/database.js";

const createTables = async () => {
  try {
    console.log("Checking database tables...");

    // Create user_roadmaps table
    await query(`
      CREATE TABLE IF NOT EXISTS user_roadmaps (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        role VARCHAR(255) NOT NULL,
        roadmap_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, role)
      );
    `);
    console.log("Verified user_roadmaps table.");

    // Create roadmap_progress table
    await query(`
      CREATE TABLE IF NOT EXISTS roadmap_progress (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        roadmap_id INTEGER REFERENCES user_roadmaps(id) ON DELETE CASCADE,
        node_id VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, roadmap_id, node_id)
      );
    `);
    console.log("Verified roadmap_progress table.");

    console.log("Database check complete.");
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    await pool.end();
  }
};

createTables();
