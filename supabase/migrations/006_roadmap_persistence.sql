-- Migration: Add user_roadmaps and roadmap_progress tables
-- Description: Store generated roadmaps and user progress for persistence

-- Table: user_roadmaps
-- Stores AI-generated roadmaps for each user
CREATE TABLE IF NOT EXISTS user_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(255) NOT NULL,
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one roadmap per user per role
  UNIQUE(user_id, role)
);

-- Table: roadmap_progress
-- Tracks user progress on roadmap nodes
CREATE TABLE IF NOT EXISTS roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES user_roadmaps(id) ON DELETE CASCADE,
  node_id VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one progress entry per user per node
  UNIQUE(user_id, roadmap_id, node_id)
);

-- Indexes for better query performance
CREATE INDEX idx_user_roadmaps_user_id ON user_roadmaps(user_id);
CREATE INDEX idx_user_roadmaps_role ON user_roadmaps(role);
CREATE INDEX idx_roadmap_progress_user_id ON roadmap_progress(user_id);
CREATE INDEX idx_roadmap_progress_roadmap_id ON roadmap_progress(roadmap_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_user_roadmaps_updated_at
  BEFORE UPDATE ON user_roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roadmap_progress_updated_at
  BEFORE UPDATE ON roadmap_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE user_roadmaps IS 'Stores AI-generated learning roadmaps for users';
COMMENT ON TABLE roadmap_progress IS 'Tracks user completion progress for roadmap nodes';
COMMENT ON COLUMN user_roadmaps.roadmap_data IS 'JSON structure containing the complete roadmap data';
COMMENT ON COLUMN roadmap_progress.node_id IS 'Identifier for the specific node in the roadmap';
