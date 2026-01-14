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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={32} className="text-[#A1FF62] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-24 px-6 relative overflow-hidden">
        <div className="bg-noise"></div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <div className="glass-panel-deep p-8 rounded-3xl text-center border border-red-500/30">
            <p className="text-red-400 font-mono mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="ev-button ev-button--secondary text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-[#A1FF62] selection:text-black">
      {/* Noise Texture Background */}
      <div className="bg-noise"></div>

      {/* Main Content */}
      <div className="relative z-10 py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          
          {/* Header Tag */}
          <div className="mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-3 text-xs md:text-sm text-[#A1FF62] tracking-[0.2em] font-mono border border-[#A1FF62]/20 px-4 py-1.5 rounded-full bg-[#A1FF62]/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#A1FF62] rounded-full animate-pulse"></span>
              {isOwnProfile ? 'COMMAND CENTER' : 'USER PROFILE'}
            </div>
          </div>

          {/* Profile Header Component */}
          <div className="mb-16 animate-slide-up">
            <div className="glass-panel-deep rounded-[2rem] p-1 shadow-2xl">
              <div className="bg-black/40 rounded-[1.8rem] p-6 md:p-10 border border-white/5 backdrop-blur-xl">
                <ProfileHeader
                  profile={profile}
                  isOwnProfile={isOwnProfile}
                  onFollowToggle={handleFollowToggle}
                />
              </div>
            </div>
          </div>
          
          {/* Quick Actions (Only for Owner) */}
          {isOwnProfile && (
            <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4 mb-6">
                <LayoutDashboard size={18} className="text-[#A1FF62]" />
                <h2 className="text-xl font-heading font-medium tracking-tight">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link 
                  to="/dashboard"
                  className="bento-card group flex flex-col justify-between p-6 h-[180px] hover:border-[#A1FF62]/50"
                >
                  <div className="w-10 h-10 rounded-full bg-[#A1FF62]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <LayoutDashboard size={20} className="text-[#A1FF62]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold mb-1 group-hover:text-[#A1FF62] transition-colors">Dashboard</h3>
                    <p className="text-sm text-white/40 font-medium">Manage your learning</p>
                  </div>
                </Link>

                <Link 
                  to="/ai-roadmap"
                  className="bento-card group flex flex-col justify-between p-6 h-[180px] hover:border-[#A1FF62]/50"
                >
                  <div className="w-10 h-10 rounded-full bg-[#A1FF62]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Route size={20} className="text-[#A1FF62]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold mb-1 group-hover:text-[#A1FF62] transition-colors">Roadmaps</h3>
                    <p className="text-sm text-white/40 font-medium">View your paths</p>
                  </div>
                </Link>

                <Link 
                  to="/ai-course"
                  className="bento-card group flex flex-col justify-between p-6 h-[180px] hover:border-[#A1FF62]/50"
                >
                  <div className="w-10 h-10 rounded-full bg-[#A1FF62]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <BookOpen size={20} className="text-[#A1FF62]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold mb-1 group-hover:text-[#A1FF62] transition-colors">Courses</h3>
                    <p className="text-sm text-white/40 font-medium">Continue learning</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
          
          {/* Edit Profile Section */}
          {isOwnProfile && (
            <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
               <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#A1FF62]"></div>
                <h2 className="text-xl font-heading font-medium tracking-tight">Edit Profile</h2>
              </div>
              <div className="glass-panel-subtle rounded-3xl p-8 border border-white/5">
                <EditProfile
                  profile={profile}
                  onUpdated={(nextProfile) => setProfile(nextProfile)}
                />
              </div>
            </div>
          )}
          
          {/* Posts Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
             <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
              <h2 className="text-xl font-heading font-medium tracking-tight">Recent Activity</h2>
            </div>
            
            <div className="glass-panel-subtle rounded-3xl p-1 min-h-[200px]">
               {/* Pass transparent bg to posts component if possible, otherwise it might have its own bg */}
              <div className="bg-black/20 rounded-[1.3rem] p-6">
                <ProfilePosts posts={profile?.posts} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
