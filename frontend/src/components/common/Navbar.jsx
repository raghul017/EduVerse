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
    <header className="h-[70px] flex items-center justify-between px-8 sticky top-0 z-40 bg-[#fbf7f1]/80 backdrop-blur-md border-b border-stone-200">
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
        
        {/* Community Dropdown */}
        <div className="relative" ref={communityRef}>
          <button
            onClick={() => setIsCommunityOpen(!isCommunityOpen)}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              location.pathname.includes("/communities") ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Communities <ChevronDown size={14} />
          </button>
          
          {isCommunityOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
              {communityLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsCommunityOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  <link.icon size={16} />
                  {link.name}
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
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
            >
              <span className="text-sm font-medium text-stone-700 hidden sm:block">
                {user.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-800 text-white font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-sm font-bold text-stone-900">{user.name}</p>
                  <p className="text-xs text-stone-500 truncate">{user.email}</p>
                </div>
                <Link
                  to={`/profile/${user._id}`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  <User size={16} />
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  <Settings size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              Log in
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-[#fbf7f1] rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
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
