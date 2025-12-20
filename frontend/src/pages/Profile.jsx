import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import ProfilePosts from '../components/profile/ProfilePosts.jsx';
import EditProfile from '../components/profile/EditProfile.jsx';
import api from '../utils/api.js';
import { useAuthStore } from '../store/authStore.js';
import { LayoutDashboard, Route, BookOpen, Loader2 } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 p-6 text-center">
            <p className="text-red-400 text-[14px]">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 text-[13px] text-[#FF6B35] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
            <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            [ {isOwnProfile ? 'YOUR PROFILE' : 'USER PROFILE'} ]
          </div>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader
            profile={profile}
            isOwnProfile={isOwnProfile}
            onFollowToggle={handleFollowToggle}
          />
        </div>
        
        {/* Quick Actions for Own Profile */}
        {isOwnProfile && (
          <div className="mb-8">
            <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ QUICK_ACTIONS</h2>
            <div className="grid grid-cols-3 gap-4">
              <Link 
                to="/dashboard"
                className="flex items-center gap-3 p-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] transition-all"
              >
                <LayoutDashboard size={20} className="text-[#FF6B35]" />
                <span className="text-[14px] font-semibold text-white">Dashboard</span>
              </Link>
              <Link 
                to="/ai-roadmap"
                className="flex items-center gap-3 p-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] transition-all"
              >
                <Route size={20} className="text-[#FF6B35]" />
                <span className="text-[14px] font-semibold text-white">Roadmaps</span>
              </Link>
              <Link 
                to="/ai-course"
                className="flex items-center gap-3 p-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] transition-all"
              >
                <BookOpen size={20} className="text-[#FF6B35]" />
                <span className="text-[14px] font-semibold text-white">Courses</span>
              </Link>
            </div>
          </div>
        )}
        
        {isOwnProfile && (
          <div className="mb-8">
            <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ EDIT_PROFILE</h2>
            <EditProfile
              profile={profile}
              onUpdated={(nextProfile) => setProfile(nextProfile)}
            />
          </div>
        )}
        
        <div>
          <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ YOUR_POSTS</h2>
          <ProfilePosts posts={profile?.posts} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
