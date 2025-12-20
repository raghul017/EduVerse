import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LayoutDashboard, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-6 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#0a0a0a] border border-[#333] group-hover:border-[#FF6B35] transition-colors rounded-sm flex items-center justify-center">
            <Sparkles size={16} className="text-white group-hover:text-[#FF6B35] transition-colors" />
          </div>
          <span className="font-bold text-[16px] tracking-tight text-white">EduVerse</span>
        </Link>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-mono text-[#888]">
          <Link to="/ai-roadmap" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">ROADMAPS</Link>
          <Link to="/ai-course" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">COURSES</Link>
          <Link to="/videos" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">VIDEOS</Link>
          <Link to="/ai-tutor" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">AI_TUTOR</Link>
          <Link to="/communities" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">COMMUNITY</Link>
        </div>
        
        {/* Right Side - Profile & Auth */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <Link to="/dashboard" className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#ff8555] text-black font-bold text-[12px] font-mono transition-all flex items-center gap-2">
                <LayoutDashboard size={14} /> DASHBOARD
              </Link>
              
              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-sm overflow-hidden border border-[#333] hover:border-[#FF6B35] transition-all"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#111] text-[#FF6B35] font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#0a0a0a] border border-[#2a2a2a] shadow-2xl z-50">
                    <div className="px-5 py-4 border-b border-[#2a2a2a]">
                      <p className="text-sm font-bold text-white truncate font-mono">{user.name}</p>
                      <p className="text-xs text-[#666] truncate mt-1 font-mono">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to={`/profile/${user.id}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-xs font-mono text-[#999] hover:text-white hover:bg-[#111] transition-colors"
                      >
                        <User size={14} /> PROFILE
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut size={14} /> LOG_OUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[13px] font-mono text-[#999] hover:text-white transition-colors">LOG_IN</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#ff8555] text-black font-bold text-[12px] font-mono transition-all">SIGN_UP</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
