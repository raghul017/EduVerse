import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import ProfilePosts from '../components/profile/ProfilePosts.jsx';
import EditProfile from '../components/profile/EditProfile.jsx';
import api from '../utils/api.js';
import { useAuthStore } from '../store/authStore.js';
import { LayoutDashboard, Compass, BookOpen } from 'lucide-react';

function Profile() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const loadProfile = async () => {
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

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-48" />
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-24" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 text-sm text-red-300 hover:text-white underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onFollowToggle={handleFollowToggle}
      />
      
      {/* Quick Actions for Own Profile */}
      {isOwnProfile && (
        <div className="grid grid-cols-3 gap-3">
          <Link 
            to="/dashboard"
            className="flex items-center justify-center gap-2 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-400 transition-colors"
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link 
            to="/ai-roadmap"
            className="flex items-center justify-center gap-2 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-purple-400 transition-colors"
          >
            <Compass size={18} />
            <span className="text-sm font-medium">Roadmaps</span>
          </Link>
          <Link 
            to="/paths"
            className="flex items-center justify-center gap-2 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-green-400 transition-colors"
          >
            <BookOpen size={18} />
            <span className="text-sm font-medium">Learning Paths</span>
          </Link>
        </div>
      )}
      
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

