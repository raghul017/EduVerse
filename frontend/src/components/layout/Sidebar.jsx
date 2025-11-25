import { NavLink, Link } from "react-router-dom";
import { Home, Compass, Upload, LayoutDashboard, LogOut, User, Zap, MessageSquare, Map, Play } from "lucide-react";
import { useAuthStore } from "../../state/store";
import { useCommunityStore } from "../../store/communityStore";
import { useEffect } from "react";

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { communities, fetchCommunities } = useCommunityStore();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const navItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Play, label: "Videos", to: "/videos" },
    { icon: Compass, label: "Explore", to: "/communities" },
    { icon: Map, label: "Roadmap", to: "/ai-roadmap" },
    { icon: Upload, label: "Upload", to: "/upload" },
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0a0a0a] border-r border-white/10 z-50 flex flex-col">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-heading font-bold text-lg text-white">EduVerse</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Main Menu */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Communities */}
        {communities.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Communities</p>
            {communities.slice(0, 3).map((comm) => (
              <Link 
                key={comm.id} 
                to={`/communities/${comm.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-xs font-bold text-blue-400">
                  {comm.name?.[0] || "C"}
                </div>
                <span className="text-sm font-medium truncate">{comm.name}</span>
              </Link>
            ))}
            {communities.length > 3 && (
              <div className="px-3 py-2">
                <Link to="/communities" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                  <MessageSquare size={12} /> View all
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-white/10">
        {user ? (
          <Link 
            to={`/profile/${user.id}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
              }}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </Link>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
          >
            <User size={18} />
            <span>Sign In</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
