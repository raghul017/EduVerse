import { query } from '../config/database.js';
import { FollowModel, UserModel } from '../models/queries.js';

export const getProfile = async (req, res, next) => {
  try {
    // Validate UUID format to prevent database errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!req.params.id || !uuidRegex.test(req.params.id)) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await query(
      'SELECT * FROM posts WHERE creator_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    ).then((result) => result.rows);

    let following = false;
    if (req.user) {
      const follow = await query(
        'SELECT 1 FROM follows WHERE follower_id=$1 AND following_id=$2',
        [req.user.id, req.params.id]
      );
      following = follow.rowCount > 0;
    }

    res.json({
      data: {
        ...user,
        posts,
        following
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const { name, bio, interests } = req.body;
    const updated = await query(
      `UPDATE users SET name=$1, bio=$2, interests=$3, updated_at=NOW()
       WHERE id=$4 RETURNING id, name, email, bio, interests`,
      [name, bio, interests, req.params.id]
    ).then((result) => result.rows[0]);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    await FollowModel.toggle({
      followerId: req.user.id,
      followingId: req.params.id,
      follow: true
    });
    res.json({ message: 'Followed' });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    await FollowModel.toggle({
      followerId: req.user.id,
      followingId: req.params.id,
      follow: false
    });
    res.json({ message: 'Unfollowed' });
  } catch (error) {
    next(error);
  }
};
