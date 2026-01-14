import { ArrowRight, Instagram, Linkedin, Twitter, Route, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";

const MegaMenu = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(".mega-menu-content", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Fixed container with padding/margins to look like a floating card
    <div className="fixed top-[90px] left-0 right-0 z-40 h-[calc(100vh-100px)] px-4 pb-4 pointer-events-none" onClick={onClose}>
        <div className="bg-[#161616] text-white w-full h-full shadow-2xl rounded-[32px] overflow-hidden pointer-events-auto border border-white/5" onClick={e => e.stopPropagation()}>
            <div className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 h-full overflow-y-auto">
            
            {/* Col 1: Products */}
            <div className="md:col-span-3 space-y-8 mega-menu-content">
                <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[#666] mb-6 font-bold">EDUVERSE PRODUCTS</h4>
                <ul className="space-y-4">
                    <li>
                    <Link to="/ai-roadmap" onClick={onClose} className="text-2xl font-medium hover:text-white transition-colors block">AI Roadmap Generator</Link>
                    </li>
                    <li>
                    <div className="flex items-center gap-2">
                        <Link to="/ai-course" onClick={onClose} className="text-2xl font-medium hover:text-white transition-colors block">Course Creator</Link>
                        <span className="bg-accent text-black text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                    </div>
                    </li>
                    <li>
                    <Link to="/ai-tutor" onClick={onClose} className="text-2xl font-medium hover:text-white transition-colors block">AI Tutor</Link>
                    </li>
                    <li>
                    <Link to="/communities" onClick={onClose} className="text-2xl font-medium hover:text-white transition-colors block">Community Groups</Link>
                    </li>
                </ul>
                
                <div className="mt-12 flex items-center gap-2">
                    <span className="text-xl text-[#666]">System Status</span>
                    <span className="text-[9px] bg-[#333] text-green-500 px-2 py-1 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        ONLINE
                    </span>
                </div>
                </div>
            </div>

            {/* Col 2: Explore */}
            <div className="md:col-span-3 space-y-12 mega-menu-content">
                <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[#666] mb-6 font-bold">EXPLORE</h4>
                <ul className="space-y-3 text-[#ccc]">
                    <li><Link to="/dashboard" onClick={onClose} className="text-lg hover:text-white transition-colors">My Dashboard</Link></li>
                    <li><Link to="/profile/me" className="text-lg hover:text-white transition-colors">My Profile</Link></li>
                    <li><Link to="#" className="text-lg hover:text-white transition-colors">Global Leaderboard</Link></li>
                </ul>
                </div>
                
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                    <Linkedin size={16} />
                    </div>
                    <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                    <Instagram size={16} />
                    </div>
                    <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                    <Twitter size={16} />
                    </div>
                </div>
            </div>

            {/* Col 3: Feature Callout */}
            <div className="md:col-span-6 mega-menu-content">
                <div className="bg-[#1a1a1a] rounded-[24px] p-12 text-center h-full flex flex-col items-center justify-center relative overflow-hidden group border border-white/5">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#666] tracking-widest">COMMUNITY</span>
                        <span className="bg-accent text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">MILESTONE</span>
                    </div>
                    
                    <h3 className="text-5xl font-bold mb-8 relative z-10 text-white tracking-tight mt-8">Join 2,400+<br/>Builders!</h3>
                    <Link to="/signup" onClick={onClose} className="bg-white text-black font-bold px-8 py-3 rounded-md hover:scale-105 transition-transform relative z-10 shadow-xl">
                        Start Building
                    </Link>

                    {/* Avatars */}
                    <div className="flex -space-x-4 mt-12 relative z-10">
                        {[1,2,3,4].map(i => (
                        <div key={i} className="w-14 h-14 rounded-full border-2 border-[#1a1a1a] bg-[#333] overflow-hidden grayscale hover:grayscale-0 transition-all">
                            <img src={`https://i.pravatar.cc/150?u=${i+40}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        ))}
                    </div>
                    
                </div>
            </div>

            </div>
        </div>
    </div>
  );
};

export default MegaMenu;
