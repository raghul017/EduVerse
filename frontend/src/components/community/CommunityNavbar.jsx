import { Link } from "react-router-dom";
import { Search, Bell, ShoppingCart, User, MessageCircle, ArrowLeft } from "lucide-react";

function CommunityNavbar() {
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              t
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-stone-900 text-lg">Online</span>
              <span className="font-medium text-stone-600 text-sm">Communities</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link to="/communities" className="text-orange-500">Activity</Link>
            <Link to="/communities/members" className="hover:text-stone-900">Members</Link>
            <Link to="/communities/groups" className="hover:text-stone-900">Groups</Link>
            <Link to="/communities/forums" className="hover:text-stone-900">Forums</Link>
            <Link to="/communities/blog" className="hover:text-stone-900">Blog</Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-900">
            <span>John</span>
            <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-stone-500">
            <Search size={20} className="hover:text-stone-900 cursor-pointer" />
            <MessageCircle size={20} className="hover:text-stone-900 cursor-pointer" />
            <div className="relative">
              <Bell size={20} className="hover:text-stone-900 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
            </div>
            <div className="relative">
              <ShoppingCart size={20} className="hover:text-stone-900 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CommunityNavbar;
