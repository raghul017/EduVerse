import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, X, Linkedin, Github, Twitter, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (showMenu) {
      // First expand width, then expand height
      setIsExpanding(true);
    } else {
      setIsExpanding(false);
    }
  }, [showMenu]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Navbar with Expansion Animation */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        showMenu ? 'w-[98%] max-w-[1400px]' : 'w-[95%] max-w-[720px]'
      }`}>
        <div className={`bg-[#1a1a1a] rounded-2xl px-6 shadow-2xl border border-white/10 transition-all duration-500 ${
          showMenu ? 'py-8' : 'py-3.5'
        }`}>
          
          {/* Top Bar - Always Visible */}
          <div className="grid grid-cols-3 items-center gap-4">
            
            {/* Left: Menu Button */}
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 text-white hover:text-[#A1FF62] transition-colors justify-self-start"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
              <span className="text-sm font-medium hidden sm:inline">Menu</span>
            </button>

            {/* Center: EDUVERSE Logo */}
            <Link to="/" className="justify-self-center">
              <span className="text-white font-black text-lg md:text-xl tracking-tight">
                EDUVERSE
              </span>
            </Link>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-2 justify-self-end">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Picture */}
                  <Link 
                    to={`/profile/${user.id}`}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#694EFF] to-[#A1FF62] flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform"
                  >
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </Link>
                  
                  {/* Logout Icon Button */}
                  <button 
                    onClick={handleLogout}
                    className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#FF6B6B] text-white flex items-center justify-center transition-all"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white text-sm rounded-full transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    className="px-5 py-2 bg-[#A1FF62] hover:bg-[#b8ff8a] text-black font-bold text-sm rounded-full transition-all"
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MENU CONTENT - Expands Down After Width Expansion */}
          <div 
            className={`overflow-hidden transition-all duration-700 ease-out ${
              showMenu ? 'max-h-[500px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'
            }`}
            style={{ 
              transitionDelay: showMenu ? '300ms' : '0ms' // Delay content expansion until width expands
            }}
          >
            {/* Menu Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
              
              {/* Column 1: AI FEATURES */}
              <div className="space-y-3">
                <span className="text-[10px] text-[#666] uppercase tracking-[0.2em] block mb-4">AI Features</span>
                <Link 
                  to="/ai-roadmap" 
                  onClick={() => setShowMenu(false)}
                  className="block text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                >
                  AI Roadmaps
                </Link>
                <Link 
                  to="/ai-course" 
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                >
                  Smart Courses
                  <span className="px-1.5 py-0.5 bg-[#694EFF] text-white text-[8px] rounded uppercase font-bold">Hot</span>
                </Link>
                <Link 
                  to="/ai-tutor" 
                  onClick={() => setShowMenu(false)}
                  className="block text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                >
                  AI Tutor Chat
                </Link>
                <Link 
                  to="/videos" 
                  onClick={() => setShowMenu(false)}
                  className="block text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                >
                  Video Whisper
                </Link>
              </div>

              {/* Column 2: EXPLORE */}
              <div className="space-y-3">
                <span className="text-[10px] text-[#666] uppercase tracking-[0.2em] block mb-4">Explore</span>
                <Link 
                  to="/communities" 
                  onClick={() => setShowMenu(false)}
                  className="block text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                >
                  Communities
                </Link>
                <Link 
                  to="/paths" 
                  onClick={() => setShowMenu(false)}
                  className="block text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                >
                  Learning Paths
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setShowMenu(false)}
                  className="block text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                >
                  Dashboard
                </Link>
                {user && (
                  <Link 
                    to={`/profile/${user.id}`}
                    onClick={() => setShowMenu(false)}
                    className="block text-white text-lg font-bold hover:text-[#A1FF62] transition-colors"
                  >
                    Profile
                  </Link>
                )}
              </div>

              {/* Column 3: FEATURED */}
              <div>
                <span className="text-[10px] text-[#694EFF] uppercase tracking-[0.2em] block mb-4">
                  Featured • Milestone
                </span>
                <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6">
                  <h3 className="text-white text-2xl md:text-3xl font-black leading-tight mb-4">
                    We hit 1700<br/>Members!
                  </h3>
                  <Link 
                    to="/signup"
                    onClick={() => setShowMenu(false)}
                    className="inline-block px-5 py-2.5 bg-white text-black font-bold text-xs rounded-full hover:bg-[#A1FF62] transition-colors"
                  >
                    Join them
                  </Link>
                  
                  {/* Avatar Stack */}
                  <div className="flex -space-x-2 mt-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#694EFF] to-[#A1FF62] border-2 border-[#0f0f0f]"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFE66D] to-[#FF6B6B] border-2 border-[#0f0f0f]"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#556270] border-2 border-[#0f0f0f]"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A1FF62] to-[#694EFF] border-2 border-[#0f0f0f]"></div>
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-[#0f0f0f] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">+1.7K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Social Icons */}
            <div className="flex justify-center gap-3 mt-8 pt-6 border-t border-white/5">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Linkedin size={16} className="text-white/60" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Github size={16} className="text-white/60" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Twitter size={16} className="text-white/60" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Semi-transparent backdrop when menu is open */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-500"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default Navbar;
