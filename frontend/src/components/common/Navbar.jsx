import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, User, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef(null);

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
    <header className="h-[60px] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-[#1a1a1a]">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#0a0a0a] border border-[#333] rounded flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="font-semibold text-[15px] text-white">EduVerse</span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/ai-roadmap"
          className={`text-[13px] transition-colors ${
            location.pathname === '/ai-roadmap' ? 'text-white' : 'text-[#999] hover:text-white'
          }`}
        >
          ROADMAPS
        </Link>
        <Link
          to="/ai-course"
          className={`text-[13px] transition-colors ${
            location.pathname === '/ai-course' ? 'text-white' : 'text-[#999] hover:text-white'
          }`}
        >
          COURSES
        </Link>
        <Link
          to="/videos"
          className={`text-[13px] transition-colors ${
            location.pathname === '/videos' ? 'text-white' : 'text-[#999] hover:text-white'
          }`}
        >
          VIDEOS
        </Link>
        <Link
          to="/ai-tutor"
          className={`text-[13px] transition-colors ${
            location.pathname === '/ai-tutor' ? 'text-white' : 'text-[#999] hover:text-white'
          }`}
        >
          AI TUTOR
        </Link>
        <Link
          to="/communities"
          className={`text-[13px] transition-colors ${
            location.pathname === '/communities' ? 'text-white' : 'text-[#999] hover:text-white'
          }`}
        >
          COMMUNITY
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {user ? (
          <>
            {/* Dashboard Button */}
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-[#FF6B35] hover:bg-[#ff7a4a] text-black font-semibold text-[13px] transition-all flex items-center gap-2"
            >
              <LayoutDashboard size={14} /> DASHBOARD
            </Link>
            
            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#333] hover:border-[#FF6B35] transition-all"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#FF6B35] text-black font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#111] border border-[#2a2a2a] shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-[#2a2a2a]">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-[#666] truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to={`/profile/${user.id}`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#999] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#999] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                  </div>
                  <div className="border-t border-[#2a2a2a] py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[13px] text-[#999] hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-[#FF6B35] hover:bg-[#ff7a4a] text-black font-semibold text-[13px] transition-all"
            >
              SIGN UP
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
