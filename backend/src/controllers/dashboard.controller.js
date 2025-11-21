import { query } from '../config/database.js';

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await query(
      `SELECT
        COALESCE(SUM(posts_watched),0) AS posts_watched,
        MAX(streak_count) AS streak_count
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    ).then((result) => result.rows[0]);

    const bookmarks = await query('SELECT COUNT(*) FROM bookmarks WHERE user_id=$1', [
      userId
    ]).then((result) => Number(result.rows[0].count));

    const subjects = await query(
      `SELECT subject, COUNT(*)::int as count
       FROM posts
       WHERE creator_id = $1
       GROUP BY subject`,
      [userId]
    ).then((result) => result.rows);

    res.json({
      data: {
        posts_watched: Number(stats.posts_watched),
        streak_count: Number(stats.streak_count) || 0,
        bookmarks_count: bookmarks,
        subjects_count: subjects.length,
        subjects_progress: subjects.map((subject) => ({
          name: subject.subject,
          progress: Math.min(100, subject.count * 10)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
