import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, Rocket, BookOpen, Users, MessageSquare } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1a1a1a] py-16 px-6 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FF6B35] flex items-center justify-center">
                <Rocket size={16} className="text-black" />
              </div>
              <span className="text-white font-bold text-[16px] tracking-wide">EDUVERSE</span>
            </div>
            <p className="text-[13px] text-[#555] leading-relaxed mb-4">
              AI-powered learning platform that generates personalized roadmaps, courses, and provides intelligent tutoring.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/raghul017/EduVerse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#111] border border-[#222] flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35]/10 transition-all group"
              >
                <Github size={16} className="text-[#666] group-hover:text-[#FF6B35]" />
              </a>
              <a 
                href="https://www.linkedin.com/in/raghul-ar05/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#111] border border-[#222] flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35]/10 transition-all group"
              >
                <Linkedin size={16} className="text-[#666] group-hover:text-[#FF6B35]" />
              </a>
              <a 
                href="https://x.com/RaghulAR7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#111] border border-[#222] flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35]/10 transition-all group"
              >
                <Twitter size={16} className="text-[#666] group-hover:text-[#FF6B35]" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-[11px] text-[#FF6B35] tracking-[0.15em] mb-4 font-mono">PLATFORM</h4>
            <div className="space-y-3 text-[12px]">
              <Link to="/" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <Rocket size={12} /> Home
              </Link>
              <Link to="/ai-roadmap" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <BookOpen size={12} /> AI Roadmap
              </Link>
              <Link to="/ai-course" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <BookOpen size={12} /> AI Course
              </Link>
              <Link to="/ai-tutor" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <MessageSquare size={12} /> AI Tutor
              </Link>
            </div>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-[11px] text-[#FF6B35] tracking-[0.15em] mb-4 font-mono">COMMUNITY</h4>
            <div className="space-y-3 text-[12px]">
              <Link to="/communities" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <Users size={12} /> Communities
              </Link>
              <Link to="/feed" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <BookOpen size={12} /> Learning Feed
              </Link>
              <Link to="/videos" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <BookOpen size={12} /> Videos
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                <Rocket size={12} /> Dashboard
              </Link>
            </div>
          </div>

          {/* Developer Links */}
          <div>
            <h4 className="text-[11px] text-[#FF6B35] tracking-[0.15em] mb-4 font-mono">DEVELOPER</h4>
            <div className="space-y-3 text-[12px]">
              <a 
                href="https://github.com/raghul017/EduVerse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#666] hover:text-white transition-colors"
              >
                <Github size={12} /> Source Code
              </a>
              <a 
                href="https://github.com/raghul017/EduVerse#readme" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#666] hover:text-white transition-colors"
              >
                <BookOpen size={12} /> Documentation
              </a>
              <a 
                href="https://github.com/raghul017/EduVerse/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#666] hover:text-white transition-colors"
              >
                <MessageSquare size={12} /> Report Issue
              </a>
              <a 
                href="mailto:raghular017@gmail.com" 
                className="flex items-center gap-2 text-[#666] hover:text-white transition-colors"
              >
                <Mail size={12} /> Contact
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack Banner */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] text-[#444] font-mono tracking-widest">
            <span>REACT 18</span>
            <span className="text-[#333]">•</span>
            <span>NODE.JS</span>
            <span className="text-[#333]">•</span>
            <span>POSTGRESQL</span>
            <span className="text-[#333]">•</span>
            <span>GROQ AI</span>
            <span className="text-[#333]">•</span>
            <span>TAILWIND CSS</span>
            <span className="text-[#333]">•</span>
            <span>SUPABASE</span>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-[#1a1a1a]">
          <p className="text-[11px] text-[#444] font-mono">
            © {currentYear} EDUVERSE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-[11px] text-[#444] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#27ca40] animate-pulse"></span>
              SYSTEM OPERATIONAL
            </div>
            <div className="h-4 w-[1px] bg-[#222]"></div>
            <a 
              href="https://www.linkedin.com/in/raghul-ar05/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] text-[#666] hover:text-[#FF6B35] transition-colors font-mono"
            >
              BUILT BY RAGHUL A R
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
