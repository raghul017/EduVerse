import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import ProfilePosts from '../components/profile/ProfilePosts.jsx';
import EditProfile from '../components/profile/EditProfile.jsx';
import api from '../utils/api.js';
import { useAuthStore } from '../store/authStore.js';

function Profile () {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfile(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (profile.following) {
        await api.delete(`/users/${id}/follow`);
      } else {
        await api.post(`/users/${id}/follow`);
      }
      setProfile((prev) => ({
        ...prev,
        following: !prev.following,
        followers_count: prev.followers_count + (prev.following ? -1 : 1)
      }));
    } catch {
      // NOOP
    }
  };

  if (loading) {
    return <p className="text-center text-text/60">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-error">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onFollowToggle={handleFollowToggle}
      />
      {isOwnProfile && (
        <EditProfile
          profile={profile}
          onUpdated={(nextProfile) => setProfile(nextProfile)}
        />
      )}
      <ProfilePosts posts={profile?.posts} />
    </div>
  );
}

export default Profile;
