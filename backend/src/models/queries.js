import { query } from '../config/database.js';

export const UserModel = {
  findByEmail: (email) =>
    query('SELECT * FROM users WHERE email = $1', [email]).then((res) => res.rows[0]),
  create: ({ name, email, passwordHash, bio, interests }) =>
    query(
      `INSERT INTO users (name, email, password_hash, bio, interests)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, bio, interests`,
      [name, email, passwordHash, bio, interests]
    ).then((res) => res.rows[0]),
  findById: (id) =>
    query(
      `SELECT users.*, 
        (SELECT COUNT(*) FROM follows WHERE following_id = users.id) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = users.id) as following_count
       FROM users WHERE id = $1`,
      [id]
    ).then((res) => res.rows[0])
};

export const PostModel = {
  create: ({
    creatorId,
    title,
    description,
    videoUrl,
    thumbnailUrl,
    subject,
    tags,
    duration,
    transcript
  }) =>
    query(
      `INSERT INTO posts (creator_id, title, description, video_url, thumbnail_url, subject, tags, duration, transcript)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [creatorId, title, description, videoUrl, thumbnailUrl, subject, tags, duration, transcript]
    ).then((res) => res.rows[0]),
  list: ({ limit = 10, offset = 0 }) =>
    query(
      `SELECT posts.*, users.name as creator_name
       FROM posts
       JOIN users ON users.id = posts.creator_id
       ORDER BY posts.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    ).then((res) => res.rows)
};

export const FollowModel = {
  toggle: ({ followerId, followingId, follow }) => {
    if (follow) {
      return query(
        `INSERT INTO follows (follower_id, following_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [followerId, followingId]
      );
    }
    return query('DELETE FROM follows WHERE follower_id=$1 AND following_id=$2', [
      followerId,
      followingId
    ]);
  }
};
