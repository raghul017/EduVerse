import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import api from "../utils/api.js";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import ProfilePosts from "../components/profile/ProfilePosts.jsx";

function MyVideos() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/users/${user.id}`);
        setProfile(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your videos.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) return <p className="text-center text-error">Login required.</p>;
  if (loading)
    return <p className="text-center text-text/60">Loading your channel...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        isOwnProfile={true}
        onFollowToggle={() => {}}
      />
      <ProfilePosts posts={profile?.posts} />
    </div>
  );
}

export default MyVideos;
