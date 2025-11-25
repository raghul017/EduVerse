import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, ChevronDown, LogOut, User, Settings, Users, MessageSquare, Hash } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  
  const profileRef = useRef(null);
  const communityRef = useRef(null);
  
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (communityRef.current && !communityRef.current.contains(event.target)) {
        setIsCommunityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const communityLinks = [
    { name: "Feed", path: "/communities?tab=feed", icon: MessageSquare },
    { name: "Groups", path: "/communities?tab=groups", icon: Hash },
    { name: "Members", path: "/communities?tab=members", icon: Users },
  ];

  return (
    <header className="h-[70px] flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/10">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-white">
        EDUVERSE
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/ai-roadmap"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Roadmaps
        </Link>
        <Link
          to="/videos"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Videos
        </Link>
        
        {/* Community Dropdown - Improved Styling */}
        <div className="relative" ref={communityRef}>
          <button
            onClick={() => setIsCommunityOpen(!isCommunityOpen)}
            className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Communities <ChevronDown size={14} className={`transition-transform ${isCommunityOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isCommunityOpen && (
            <div className="absolute top-full left-0 mt-3 w-56 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {communityLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsCommunityOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <link.icon size={18} className="text-slate-300" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/ai-tutor"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          AI Tutor
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all duration-200"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-4 border-b border-white/20 bg-white/5">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-300 truncate mt-0.5">{user.email}</p>
                </div>
                <div className="py-2">
                  <Link
                    to={`/profile/${user._id}`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    <User size={18} className="text-slate-300" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    <Settings size={18} className="text-slate-300" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </div>
                <div className="border-t border-white/20 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="group relative inline-flex cursor-pointer transition-all duration-300 hover:scale-105 text-sm font-semibold text-white tracking-tight rounded-full px-5 py-2.5 items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Sparkles size={16} className="mr-2" />
              <span className="relative z-10">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
