import { query } from '../config/database.js';

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

    // Get subjects EXPLORED (from posts the user has liked or bookmarked, NOT created)
    const subjectsExplored = await query(
      `SELECT DISTINCT p.subject, COUNT(DISTINCT p.id)::int as count
       FROM posts p
       WHERE p.id IN (
         SELECT post_id FROM likes WHERE user_id = $1
         UNION
         SELECT post_id FROM bookmarks WHERE user_id = $1
       )
       GROUP BY p.subject`,
      [userId]
    ).then((result) => result.rows);

    // Also get subjects user has CREATED content in
    const subjectsCreated = await query(
      `SELECT subject, COUNT(*)::int as count
       FROM posts
       WHERE creator_id = $1
       GROUP BY subject`,
      [userId]
    ).then((result) => result.rows);

    res.json({
      data: {
        posts_watched: Number(progress.posts_watched),
        streak_count: Number(progress.streak_count),
        bookmarks_count: bookmarks,
        subjects_explored_count: subjectsExplored.length,
        subjects_created_count: subjectsCreated.length,
        // Combined subjects for progress display
        subjects_progress: [
          ...subjectsExplored.map((s) => ({
            name: s.subject,
            type: 'explored',
            progress: Math.min(100, s.count * 10)
          })),
          ...subjectsCreated.map((s) => ({
            name: s.subject,
            type: 'created',
            progress: Math.min(100, s.count * 20)
          }))
        ].filter((v, i, a) => a.findIndex(t => t.name === v.name) === i) // Dedupe by name
      }
    });
  } catch (error) {
    next(error);
  }
};

