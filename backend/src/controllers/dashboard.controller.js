import { query } from '../config/database.js';
import { aiService } from '../services/ai.service.js';

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get progress stats (posts watched, streak) - with fallback
    let progress = { posts_watched: 0, streak_count: 0 };
    try {
      const progressResult = await query(
        `SELECT
          COALESCE(SUM(posts_watched), 0) AS posts_watched,
          COALESCE(MAX(streak_count), 0) AS streak_count
         FROM user_progress
         WHERE user_id = $1`,
        [userId]
      );
      if (progressResult.rows[0]) {
        progress = progressResult.rows[0];
      }
    } catch (e) {
      console.warn('[Dashboard] user_progress query failed:', e.message);
    }

    // Count bookmarks - with fallback
    let bookmarks = 0;
    try {
      const bookmarksResult = await query(
        'SELECT COUNT(*) FROM bookmarks WHERE user_id = $1',
        [userId]
      );
      bookmarks = Number(bookmarksResult.rows[0]?.count || 0);
    } catch (e) {
      console.warn('[Dashboard] bookmarks query failed:', e.message);
    }

    // Get roadmaps count and completion stats - with fallback
    let roadmapStats = { roadmaps_count: 0, completed_nodes: 0 };
    try {
      const roadmapResult = await query(
        `SELECT 
          COUNT(DISTINCT ur.id)::int as roadmaps_count,
          COUNT(DISTINCT rp.node_id)::int as completed_nodes
         FROM user_roadmaps ur
         LEFT JOIN roadmap_progress rp ON rp.roadmap_id = ur.id AND rp.completed = true
         WHERE ur.user_id = $1`,
        [userId]
      );
      if (roadmapResult.rows[0]) {
        roadmapStats = roadmapResult.rows[0];
      }
    } catch (e) {
      console.warn('[Dashboard] roadmap_stats query failed:', e.message);
    }

    // Get user's roadmaps with progress for "Active Directives" - with fallback
    let roadmapsProgress = [];
    try {
      const roadmapsResult = await query(
        `SELECT 
          ur.id,
          ur.role as name,
          ur.created_at,
          COUNT(DISTINCT rp.node_id)::int as completed_count,
          (ur.roadmap_data->'stages')::jsonb as stages
         FROM user_roadmaps ur
         LEFT JOIN roadmap_progress rp ON rp.roadmap_id = ur.id AND rp.completed = true
         WHERE ur.user_id = $1
         GROUP BY ur.id
         ORDER BY ur.created_at DESC
         LIMIT 5`,
        [userId]
      );
      
      roadmapsProgress = (roadmapsResult.rows || []).map(roadmap => {
        const stages = roadmap.stages || [];
        const totalNodes = Array.isArray(stages) 
          ? stages.reduce((acc, stage) => acc + (stage?.nodes?.length || 0), 0)
          : 0;
        const progressPercent = totalNodes > 0 
          ? Math.round((roadmap.completed_count / totalNodes) * 100) 
          : 0;
        return {
          id: roadmap.id,
          name: roadmap.name || 'Untitled Roadmap',
          progress: progressPercent,
          created_at: roadmap.created_at
        };
      });
    } catch (e) {
      console.warn('[Dashboard] roadmaps_progress query failed:', e.message);
    }

    // Get AI usage stats - with fallback
    let aiUsage = { tokensUsed: 0, requestsCount: 0, percentageUsed: 0 };
    try {
      aiUsage = aiService.getUsageStats() || aiUsage;
    } catch (e) {
      console.warn('[Dashboard] aiService.getUsageStats() failed:', e.message);
    }

    // Return data with safe defaults
    res.json({
      data: {
        posts_watched: Number(progress.posts_watched) || 0,
        streak_count: Number(progress.streak_count) || 0,
        bookmarks_count: bookmarks || 0,
        roadmaps_count: roadmapStats.roadmaps_count || 0,
        completed_nodes: roadmapStats.completed_nodes || 0,
        
        // AI usage for the day
        ai_tokens_used: aiUsage.tokensUsed || 0,
        ai_requests_today: aiUsage.requestsCount || 0,
        ai_usage_percent: Math.round(aiUsage.percentageUsed || 0),
        
        // Active roadmaps with real progress
        subjects_progress: roadmapsProgress,
        
        // Total learning time (estimate: 5 min per completed node + 2 min per post watched)
        total_time: Math.round(((roadmapStats.completed_nodes || 0) * 5 + Number(progress.posts_watched || 0) * 2) / 60)
      }
    });
  } catch (error) {
    console.error('[Dashboard] Unexpected error:', error);
    next(error);
  }
};



