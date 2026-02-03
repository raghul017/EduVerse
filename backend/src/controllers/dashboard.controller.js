import { query } from '../config/database.js';
import { aiService } from '../services/ai.service.js';

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get progress stats (posts watched, streak)
    const progress = await query(
      `SELECT
        COALESCE(SUM(posts_watched), 0) AS posts_watched,
        COALESCE(MAX(streak_count), 0) AS streak_count
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    ).then((result) => result.rows[0]);

    // Count bookmarks
    const bookmarks = await query(
      'SELECT COUNT(*) FROM bookmarks WHERE user_id = $1',
      [userId]
    ).then((result) => Number(result.rows[0].count));

    // Get roadmaps count and completion stats
    const roadmapStats = await query(
      `SELECT 
        COUNT(DISTINCT ur.id)::int as roadmaps_count,
        COUNT(DISTINCT rp.node_id)::int as completed_nodes
       FROM user_roadmaps ur
       LEFT JOIN roadmap_progress rp ON rp.roadmap_id = ur.id AND rp.completed = true
       WHERE ur.user_id = $1`,
      [userId]
    ).then((result) => result.rows[0]);

    // Get user's roadmaps with progress for "Active Directives"
    const roadmapsWithProgress = await query(
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
    ).then((result) => result.rows);

    // Calculate progress percentage for each roadmap
    const roadmapsProgress = roadmapsWithProgress.map(roadmap => {
      const stages = roadmap.stages || [];
      const totalNodes = stages.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0);
      const progress = totalNodes > 0 ? Math.round((roadmap.completed_count / totalNodes) * 100) : 0;
      return {
        id: roadmap.id,
        name: roadmap.name,
        progress,
        created_at: roadmap.created_at
      };
    });

    // Get AI usage stats
    const aiUsage = aiService.getUsageStats();

    // Get recent activity (last 5 actions)
    const recentActivity = await query(
      `(SELECT 'bookmark' as type, created_at, post_id as target_id 
        FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3)
       UNION ALL
       (SELECT 'roadmap' as type, created_at, id::text as target_id 
        FROM user_roadmaps WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3)
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    ).then((result) => result.rows);

    res.json({
      data: {
        posts_watched: Number(progress.posts_watched),
        streak_count: Number(progress.streak_count),
        bookmarks_count: bookmarks,
        roadmaps_count: roadmapStats.roadmaps_count || 0,
        completed_nodes: roadmapStats.completed_nodes || 0,
        
        // AI usage for the day
        ai_tokens_used: aiUsage.tokensUsed,
        ai_requests_today: aiUsage.requestsCount,
        ai_usage_percent: aiUsage.percentageUsed,
        
        // Active roadmaps with real progress
        subjects_progress: roadmapsProgress,
        
        // Recent activity
        recent_activity: recentActivity,
        
        // Total learning time (estimate: 5 min per completed node + 2 min per post watched)
        total_time: Math.round(((roadmapStats.completed_nodes || 0) * 5 + Number(progress.posts_watched) * 2) / 60)
      }
    });
  } catch (error) {
    next(error);
  }
};


