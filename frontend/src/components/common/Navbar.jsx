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
    <header className="h-[70px] flex items-center justify-between px-8 sticky top-0 z-40 bg-[#fbf7f1]/95 backdrop-blur-lg border-b border-stone-200">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-stone-900 font-heading font-bold text-xl tracking-tight">
        EDUVERSE
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/ai-roadmap"
          className={`text-sm font-medium transition-colors ${
            location.pathname === "/ai-roadmap" ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Roadmaps
        </Link>
        <Link
          to="/videos"
          className={`text-sm font-medium transition-colors ${
            location.pathname === "/videos" ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Videos
        </Link>
        
        {/* Community Dropdown - Improved Styling */}
        <div className="relative" ref={communityRef}>
          <button
            onClick={() => setIsCommunityOpen(!isCommunityOpen)}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              location.pathname.includes("/communities") ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Communities <ChevronDown size={14} className={`transition-transform ${isCommunityOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isCommunityOpen && (
            <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {communityLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsCommunityOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <link.icon size={18} className="text-stone-500" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/ai-tutor"
          className={`text-sm font-medium transition-colors ${
            location.pathname === "/ai-tutor" ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
          }`}
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
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-stone-100 transition-all duration-200 border border-transparent hover:border-stone-200 hover:shadow-sm"
            >
              <span className="text-sm font-medium text-stone-700 hidden sm:block">
                {user.name}
              </span>
              <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden ring-2 ring-stone-300 ring-offset-2">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-800 text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-4 border-b border-stone-100 bg-stone-50">
                  <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                  <p className="text-xs text-stone-500 truncate mt-0.5">{user.email}</p>
                </div>
                <div className="py-2">
                  <Link
                    to={`/profile/${user._id}`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <User size={18} className="text-stone-500" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Settings size={18} className="text-stone-500" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </div>
                <div className="border-t border-stone-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
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
            <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-[#fbf7f1] rounded-full text-sm font-medium hover:bg-stone-800 transition-all hover:shadow-lg"
            >
              <Sparkles size={16} />
              <span>Get Started</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
