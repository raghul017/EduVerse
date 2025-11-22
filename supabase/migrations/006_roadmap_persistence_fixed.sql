-- Run this in Supabase SQL Editor to create the tables

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS roadmap_progress CASCADE;
DROP TABLE IF EXISTS user_roadmaps CASCADE;

-- Create user_roadmaps table
CREATE TABLE user_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(255) NOT NULL,
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, role)
);

-- Create roadmap_progress table
CREATE TABLE roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES user_roadmaps(id) ON DELETE CASCADE,
  node_id VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, roadmap_id, node_id)
);

-- Create indexes
CREATE INDEX idx_user_roadmaps_user_id ON user_roadmaps(user_id);
CREATE INDEX idx_user_roadmaps_role ON user_roadmaps(role);
CREATE INDEX idx_roadmap_progress_user_id ON roadmap_progress(user_id);
CREATE INDEX idx_roadmap_progress_roadmap_id ON roadmap_progress(roadmap_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_user_roadmaps_updated_at
  BEFORE UPDATE ON user_roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roadmap_progress_updated_at
  BEFORE UPDATE ON roadmap_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
SELECT 'user_roadmaps' as table_name, COUNT(*) as row_count FROM user_roadmaps
UNION ALL
SELECT 'roadmap_progress', COUNT(*) FROM roadmap_progress;
