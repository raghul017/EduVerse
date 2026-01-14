import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, Heart, Sparkles, Route, BookOpen, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden z-10" style={{ backgroundColor: '#F4F4F4' }}>
      
      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-12">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-16">
          
          {/* Brand & Description */}
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Sparkles size={24} className="text-[#A1FF62]" />
              <span className="text-2xl font-black text-[#201D1D]">EduVerse</span>
            </Link>
            <p className="text-[#666] leading-relaxed mb-8">
              AI-powered learning platform that creates personalized roadmaps, adaptive tutoring, and smart quizzes to accelerate your learning journey.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="https://github.com/raghul017" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center hover:border-[#A1FF62] hover:bg-[#A1FF62] hover:text-black transition-all group"
              >
                <Github size={18} className="text-[#666] group-hover:text-black" />
              </a>
              <a 
                href="https://www.linkedin.com/in/raghul-ar05/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center hover:border-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all group"
              >
                <Linkedin size={18} className="text-[#666] group-hover:text-white" />
              </a>
              <a 
                href="https://x.com/RaghulAR7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all group"
              >
                <Twitter size={18} className="text-[#666] group-hover:text-white" />
              </a>
              <a 
                href="mailto:arraghul6@gmail.com"
                className="w-11 h-11 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center hover:border-[#EA4335] hover:bg-[#EA4335] hover:text-white transition-all group"
              >
                <Mail size={18} className="text-[#666] group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-16 md:gap-24">
            
            {/* Features */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-[#201D1D] uppercase tracking-wider mb-2">Features</h4>
              <Link to="/ai-roadmap" className="text-[#666] hover:text-[#A1FF62] transition-colors flex items-center gap-2 text-sm">
                <Route size={14} />
                AI Roadmaps
              </Link>
              <Link to="/ai-tutor" className="text-[#666] hover:text-[#A1FF62] transition-colors flex items-center gap-2 text-sm">
                <MessageCircle size={14} />
                AI Tutor
              </Link>
              <Link to="/ai-course" className="text-[#666] hover:text-[#A1FF62] transition-colors flex items-center gap-2 text-sm">
                <BookOpen size={14} />
                Courses
              </Link>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-[#201D1D] uppercase tracking-wider mb-2">Account</h4>
              <Link to="/dashboard" className="text-[#666] hover:text-[#A1FF62] transition-colors text-sm">Dashboard</Link>
              <Link to="/profile" className="text-[#666] hover:text-[#A1FF62] transition-colors text-sm">Profile</Link>
              <Link to="/login" className="text-[#666] hover:text-[#A1FF62] transition-colors text-sm">Login</Link>
              <Link to="/signup" className="text-[#666] hover:text-[#A1FF62] transition-colors text-sm">Sign Up</Link>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e5e5e5] mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#999]">
            © {currentYear} EduVerse. Built with <Heart size={12} className="inline text-red-500 mx-1" /> by{" "}
            <a 
              href="https://github.com/raghul017" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#201D1D] font-medium hover:text-[#A1FF62] transition-colors"
            >
              Raghul A R
            </a>
          </p>
          
          <div className="flex items-center gap-6 text-sm text-[#999]">
            <span>Made in India 🇮🇳</span>
          </div>
        </div>
      </div>

      {/* Massive Background Text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none z-0 flex justify-center overflow-hidden opacity-[0.04]">
        <h1 className="text-[28vw] font-black leading-[0.8] tracking-tighter text-[#201D1D] whitespace-nowrap">
          EDUVERSE
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
