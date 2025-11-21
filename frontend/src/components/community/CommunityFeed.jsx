import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import PostCard from '../feed/PostCard.jsx';
import Loader from '../common/Loader.jsx';

function CommunityFeed ({ communityId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/communities/${communityId}/posts`);
        setPosts(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load community posts.');
      } finally {
        setLoading(false);
      }
    };
    if (communityId) load();
  }, [communityId]);

  if (loading) return <Loader label="Fetching community feed..." />;
  if (error) return <p className="text-danger text-sm">{error}</p>;
  if (!posts.length) {
    return (
      <p className="text-center text-textSecondary text-sm py-10">
        No posts in this community yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default CommunityFeed;
