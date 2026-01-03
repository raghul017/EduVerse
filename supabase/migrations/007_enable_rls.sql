-- ============================================================
-- Migration: Enable Row Level Security (RLS) on all tables
-- Created: 2026-01-03
-- Purpose: Enable RLS as a security best practice
-- 
-- Tables based on actual Supabase dashboard:
-- bookmarks, communities, community_members, community_messages,
-- follows, learning_path_posts, learning_paths, likes, posts,
-- roadmap_progress, user_path_progress, user_progress, 
-- user_roadmaps, users
-- ============================================================

-- ============================================================
-- PART 1: Enable RLS on all tables
-- ============================================================

-- Core tables (migration 001)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Learning path tables (migration 003)
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_path_progress ENABLE ROW LEVEL SECURITY;

-- Community messages (migration 005)
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Roadmap tables (migration 006)
ALTER TABLE user_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 2: Create restrictive policies (block SDK access)
-- ============================================================

-- Core tables
CREATE POLICY "Block SDK access" ON users FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON posts FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON likes FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON bookmarks FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON follows FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON communities FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON community_members FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON user_progress FOR ALL USING (false);

-- Learning path tables
CREATE POLICY "Block SDK access" ON learning_paths FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON learning_path_posts FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON user_path_progress FOR ALL USING (false);

-- Community messages
CREATE POLICY "Block SDK access" ON community_messages FOR ALL USING (false);

-- Roadmap tables
CREATE POLICY "Block SDK access" ON user_roadmaps FOR ALL USING (false);
CREATE POLICY "Block SDK access" ON roadmap_progress FOR ALL USING (false);

-- ============================================================
-- VERIFICATION QUERY (run separately to check):
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- ============================================================
