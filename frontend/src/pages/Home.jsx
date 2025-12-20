import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Github, Users, MessageCircle, ChevronDown, Play, Star, Sparkles, BookOpen, Route, Brain, Target, ArrowRight, Rocket, GitFork, Twitter, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/authStore";

import GlitchText from "../components/ui/GlitchText";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [topic, setTopic] = useState("");
  const [skillLevel, setSkillLevel] = useState("Standard");
  const [format, setFormat] = useState("Roadmap");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile menu when clicking outside
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    navigate(`/roadmap?role=${encodeURIComponent(topic.trim())}&detail=${skillLevel.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-white font-sans antialiased scroll-smooth selection:bg-[#FF6B35] selection:text-white">
      {/* ===== NAVIGATION - Restored Links & Profile ===== */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto px-6 h-[70px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#0a0a0a] border border-[#333] group-hover:border-[#FF6B35] transition-colors rounded-sm flex items-center justify-center">
                <Sparkles size={16} className="text-white group-hover:text-[#FF6B35] transition-colors" />
              </div>
              <span className="font-bold text-[16px] tracking-tight">EduVerse</span>
          </Link>
          
          {/* Nav Links - Restored Original */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-mono text-[#888]">
            <Link to="/ai-roadmap" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">ROADMAPS</Link>
            <Link to="/ai-course" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">COURSES</Link>
            <Link to="/videos" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">VIDEOS</Link>
            <Link to="/ai-tutor" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">AI_TUTOR</Link>
            <Link to="/communities" className="hover:text-white transition-colors hover:underline decoration-[#FF6B35] decoration-2 underline-offset-4">COMMUNITY</Link>
          </div>
          
          {/* Right Side - Profile & Auth */}
          <div className="flex items-center gap-5">
            {user ? (
              <>
                <Link to="/dashboard" className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#ff8555] text-black font-bold text-[12px] font-mono transition-all flex items-center gap-2">
                  <LayoutDashboard size={14} /> DASHBOARD
                </Link>
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-9 h-9 rounded-sm overflow-hidden border border-[#333] hover:border-[#FF6B35] transition-all"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#111] text-[#FF6B35] font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#0a0a0a] border border-[#2a2a2a] shadow-2xl z-50">
                      <div className="px-5 py-4 border-b border-[#2a2a2a]">
                        <p className="text-sm font-bold text-white truncate font-mono">{user.name}</p>
                        <p className="text-xs text-[#666] truncate mt-1 font-mono">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to={`/profile/${user.id}`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-xs font-mono text-[#999] hover:text-white hover:bg-[#111] transition-colors"
                        >
                          <User size={14} /> PROFILE
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut size={14} /> LOG_OUT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[13px] font-mono text-[#999] hover:text-white transition-colors">LOG_IN</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#ff8555] text-black font-bold text-[12px] font-mono transition-all">SIGN_UP</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-12 pb-20 px-6 relative">
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          
          {/* Top Tag */}
          <div className="flex justify-center mb-6 opacity-0 animate-fade-in" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
             <div className="inline-flex items-center gap-3 text-[10px] text-[#FF6B35] font-mono tracking-[0.2em] uppercase">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full"></span>
                [ API_FOR_LEARNING ]
             </div>
          </div>
          
          {/* Headline - Compact & Large */}
          <h1 className="text-[64px] md:text-[100px] font-bold tracking-[-0.04em] leading-[0.85] text-white mb-6 opacity-0 animate-fade-in" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
            ENABLE AI TO <br />
            <div className="flex items-center justify-center gap-6 my-1">
               {/* Word Cycling Glitch Text - Solid Orange */}
               <GlitchText 
                 words={["ACCELERATE", "AUTOMATE", "OPTIMIZE"]} 
                 interval={3000}
                 className="text-[#FF6B35] relative z-10"
               />
               
               {/* Vertical Bar */}
               <div className="w-2.5 h-20 bg-[#FF6B35] hidden md:block"></div>
            </div>
            YOUR LEARNING
          </h1>
          
          {/* Subtitle */}
          <p className="text-[#888] text-[16px] max-w-[540px] mx-auto mb-10 leading-[1.6] font-mono opacity-0 animate-fade-in" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
            The <span className="text-white font-bold">ECOSYSTEM</span> built around the world's most intelligent learning roadmap and course generation platform.
          </p>

          {/* Terminal Box - Exact 'Browser Use' Replica */}
          <div className="w-full max-w-[900px] mx-auto bg-[#050505] border border-[#222] relative group opacity-0 animate-fade-in shadow-2xl" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
            {/* Corners - White crop marks */}
            <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-[#444]"></div>
            <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-[#444]"></div>
            <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-[#444]"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-[#444]"></div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a]">
               <div className="text-[10px] text-[#555] font-mono tracking-widest uppercase">user@eduverse:~/new_task</div>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#222] border border-[#333]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#222] border border-[#333]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#222] border border-[#333]"></div>
               </div>
            </div>
            
            {/* Input Area */}
            <div className="p-8">
               <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleGenerate()}
                  placeholder="Describe the skill you want to master..."
                  rows={2}
                  className="w-full bg-transparent text-[#ddd] text-[22px] placeholder:text-[#444] focus:outline-none resize-none font-mono mb-16 leading-relaxed"
               />
               
               {/* Bottom Controls - Dark Boxes */}
               <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-t border-[#1a1a1a] pt-6">
                  <div className="flex gap-6 w-full md:w-auto">
                     {/* Control 1 */}
                     <div className="flex-1 md:flex-none">
                        <label className="block text-[9px] text-[#333] font-mono uppercase tracking-widest mb-2 text-left px-1">SKILL_LEVEL</label>
                        <div className="relative bg-[#0d0d0d] border border-[#222] px-4 py-2.5 w-full md:w-36 flex items-center justify-between hover:border-[#333] transition-colors cursor-pointer group/select">
                           <select 
                              value={skillLevel} 
                              onChange={(e) => setSkillLevel(e.target.value)} 
                              className="appearance-none bg-transparent text-[#999] text-[11px] font-mono w-full focus:outline-none cursor-pointer group-hover/select:text-white transition-colors"
                           >
                              <option value="Beginner">Beginner</option>
                              <option value="Standard">Standard</option>
                              <option value="Advanced">Advanced</option>
                           </select>
                           <ChevronDown size={12} className="text-[#333]" />
                        </div>
                     </div>
                     {/* Control 2 */}
                     <div className="flex-1 md:flex-none">
                        <label className="block text-[9px] text-[#333] font-mono uppercase tracking-widest mb-2 text-left px-1">MODE</label>
                        <div className="relative bg-[#0d0d0d] border border-[#222] px-4 py-2.5 w-full md:w-36 flex items-center justify-between hover:border-[#333] transition-colors cursor-pointer group/select">
                           <select 
                              value={format} 
                              onChange={(e) => setFormat(e.target.value)} 
                              className="appearance-none bg-transparent text-[#999] text-[11px] font-mono w-full focus:outline-none cursor-pointer group-hover/select:text-white transition-colors"
                           >
                              <option value="Roadmap">Roadmap</option>
                              <option value="Course">Course</option>
                           </select>
                           <ChevronDown size={12} className="text-[#333]" />
                        </div>
                     </div>
                  </div>
                  
                  {/* Action Button - Orange */}
                  <button 
                     onClick={handleGenerate}
                     disabled={!topic.trim()}
                     className="bg-[#FF6B35] hover:bg-[#ff8555] active:translate-y-0.5 text-black font-extrabold text-[11px] px-8 py-3.5 font-mono tracking-wider flex items-center gap-2 transition-all w-full md:w-auto justify-center uppercase"
                  >
                     <Play size={10} fill="currentColor" /> RUN FOR FREE
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ECOSYSTEM GRID - 'Stealth Browser Infrastructure' Style ===== */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-12">
             <div className="text-[11px] text-[#FF6B35] font-mono tracking-[0.2em] mb-4">infrastructure</div>
             <h2 className="text-[40px] font-bold text-white mb-4 leading-tight">Stealth Learning Infrastructure</h2>
             <p className="text-[#666] text-[15px] font-mono max-w-[600px]">
               Built on top of advanced AI agents. V 2.0.4 [STABLE]
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                icon: Route, 
                name: "AI_ROADMAPS", 
                id: "MOD_01", 
                title: "Personalized Learning Paths",
                desc: "High-level goal decomposition into actionable steps. Monitors progress and adapts in real-time."
              },
              { 
                icon: BookOpen, 
                name: "SMART_COURSES", 
                id: "MOD_02", 
                title: "AI-Structured Courseware",
                desc: "Automatic generation of syllabus, resources, and quizzes tailored to your skill gaps."
              },
              { 
                icon: Target, 
                name: "AI_TUTOR", 
                id: "MOD_03", 
                title: "Context-Aware Assistance", 
                desc: "Real-time help that understands your exact problem context without need for extensive prompting."
              },
              { 
                icon: Users, 
                name: "COMMUNITY", 
                id: "MOD_04", 
                title: "Collaborative Network",
                desc: "Connect with peers on the same path. Share resources and compete on global leaderboards."
              },
            ].map((f, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-[#222] p-8 hover:border-[#333] transition-all group relative overflow-hidden">
                {/* Background Grid inside card */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[12px] text-[#FF6B35] font-mono">{f.name}</span>
                       <f.icon size={20} className="text-[#666] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-[24px] font-bold text-white mb-3">{f.title}</h3>
                    <p className="text-[#888] text-[14px] leading-relaxed mb-8">{f.desc}</p>
                  </div>
                  
                  <div className="pt-6 border-t border-[#1a1a1a] flex items-center justify-between">
                     <span className="text-[10px] text-[#444] font-mono tracking-widest">{f.id}</span>
                     <div className="text-[10px] text-[#444] font-mono">STATUS: ACTIVE</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLATFORM DEMO - Code window with colored dots ===== */}
      <section className="py-24 px-6 fade-in" style={{ opacity: 0, transform: "translateY(20px)", transition: "all 0.6s" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Code Box - macOS dots on LEFT (colored) */}
            <div className="bg-[#0f0f0f] border border-[#1f1f1f] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27ca40]"></div>
                </div>
                <code className="text-[11px] text-[#555] font-mono">/EDUVERSE.JS</code>
              </div>
              <pre className="p-6 text-[13px] font-mono leading-[2] overflow-x-auto">
<span className="text-[#c678dd]">const</span> <span className="text-[#61afef]">roadmap</span> = <span className="text-[#c678dd]">await</span> eduverse.<span className="text-[#e5c07b]">generate</span>({`{`}
  topic: <span className="text-[#98c379]">"Full Stack Dev"</span>,
  level: <span className="text-[#98c379]">"beginner"</span>,
  duration: <span className="text-[#98c379]">"3 months"</span>
{`}`});

<span className="text-[#5c6370]">// That's your entire</span>
<span className="text-[#5c6370]">// learning infrastructure.</span>
              </pre>
            </div>

            {/* Description */}
            <div>
              <div className="text-[#FF6B35] text-[11px] tracking-[0.15em] mb-4 font-mono">[ ROADMAP ENGINE ]</div>
              <h2 className="text-[38px] font-bold mb-6 leading-tight">EduVerse Platform</h2>
              <p className="text-[#666] text-[15px] leading-[1.8] mb-8">
                Build personalized learning paths with our AI-powered roadmap generator. Get structured courses, curated resources, and real-time AI tutoring support.
              </p>
              <Link to="/ai-roadmap" className="text-[#FF6B35] font-semibold text-[13px] flex items-center gap-2 hover:gap-3 transition-all tracking-wide">
                TRY IT FREE <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-24 px-6 fade-in" style={{ opacity: 0, transform: "translateY(20px)", transition: "all 0.6s" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "SYS: UPDATE_SERVICE", title: "ALWAYS_UP_TO_DATE", desc: "Latest models and learning paths applied automatically." },
              { label: "NET: AUTO_SCALE", title: "INFINITE_SCALE", desc: "Run 1 task or 10,000. Zero provisioning required." },
              { label: "MNG: FULL_SERVICE", title: "MANAGED_EVERYTHING", desc: "Sessions, files, cookies, downloads, proxies - all handled." },
              { label: "SDK: TYPE_SAFE", title: "TYPE_SAFE_SDKS", desc: "Native Python & TypeScript support with full autocomplete." },
              { label: "OPS: NO_OPS", title: "ZERO_MAINTENANCE", desc: "No Docker, Kubernetes, or browser management required." },
              { label: "AUTH: SINGLE_KEY", title: "ONE_API_KEY", desc: "Access the entire cloud ecosystem with a single key." },
            ].map((f, i) => (
              <div key={i} className="relative bg-[#0f0f0f] border border-[#1f1f1f] p-7 transition-all duration-300 hover:border-[#333]">
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-[#FF6B35]"></div>
                <div className="absolute top-4 right-4 text-[9px] text-[#FF6B35] tracking-[0.1em] font-mono">{f.label}</div>
                <h3 className="font-bold text-[16px] tracking-wide mb-3 mt-2 pl-3">{f.title}</h3>
                <p className="text-[13px] text-[#555] leading-relaxed pl-3">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 px-6 fade-in" style={{ opacity: 0, transform: "translateY(20px)", transition: "all 0.6s" }}>
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="text-[#FF6B35] text-[11px] tracking-[0.15em] mb-4 font-mono">[ START LEARNING ]</div>
          <h2 className="text-[40px] font-bold mb-6">Custom Learning Path for Your Goals</h2>
          <p className="text-[#555] text-[15px] max-w-[480px] mx-auto mb-12">
            Whether you're learning to code, preparing for interviews, or mastering a new technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ai-roadmap" className="px-10 py-4 bg-[#FF6B35] hover:bg-[#ff7a4a] text-black font-bold text-[13px] flex items-center justify-center gap-2 transition-all tracking-wide">
              <Rocket size={16} /> START FOR FREE
            </Link>
            <Link to="/communities" className="px-10 py-4 border border-[#333] hover:border-[#555] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-all tracking-wide">
              <Users size={16} /> JOIN COMMUNITY
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CHANGELOG ===== */}
      <section className="py-24 px-6 fade-in" style={{ opacity: 0, transform: "translateY(20px)", transition: "all 0.6s" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <span className="text-[14px] font-mono text-[#FF6B35]">&gt;_ LATEST_CHANGELOG</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { date: "2025.12.16", title: "OUR FIRST OPEN-SOURCE LLM", desc: "30B params, 3B active. 200 tasks per $1." },
              { date: "2025.12.04", title: "SKILLS - API FOR ANYTHING", desc: "Describe what you need in plain text." },
              { date: "2025.11.21", title: "MCP SERVER, GEMINI 3", desc: "We ship fast. Enjoy the best model ever." },
              { date: "2025.11.13", title: "TEMPLATES LIBRARY", desc: "Ready-to-use automation workflows." },
            ].map((log, i) => (
              <div key={i} className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 transition-all hover:border-[#333]">
                <span className="text-[10px] text-[#444] tracking-wide font-mono">[{log.date}]</span>
                <h3 className="font-bold text-[13px] mt-2 mb-2 tracking-wide">{log.title}</h3>
                <p className="text-[12px] text-[#444] leading-relaxed">{log.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-right mt-6">
            <a href="#" className="text-[#FF6B35] text-[12px] font-mono hover:underline">&gt;_VIEW_ALL_LOGS</a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#1a1a1a] py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">DOCUMENTATION</h4>
              <div className="space-y-2 text-[12px]">
                <a href="#" className="block text-[#666] hover:text-white transition-colors">HOME</a>
                <a href="#" className="block text-[#666] hover:text-white transition-colors">DOCS</a>
                <a href="#" className="block text-[#666] hover:text-white transition-colors">GITHUB</a>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">CAREERS</h4>
              <div className="space-y-2 text-[12px]">
                <a href="#" className="block text-[#666] hover:text-white transition-colors">PRESS</a>
                <a href="#" className="block text-[#666] hover:text-white transition-colors">MARKETPLACE</a>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">TERMS OF SERVICE</h4>
              <div className="space-y-2 text-[12px]">
                <a href="#" className="block text-[#666] hover:text-white transition-colors">PRIVACY</a>
                <a href="#" className="block text-[#666] hover:text-white transition-colors">CHANGELOG</a>
                <a href="#" className="block text-[#666] hover:text-white transition-colors">CONTACT US</a>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] text-[#444] tracking-[0.15em] mb-4">SOCIAL</h4>
              <div className="space-y-2 text-[12px]">
                <a href="#" className="block text-[#666] hover:text-white transition-colors">TWITTER</a>
                <a href="#" className="block text-[#666] hover:text-white transition-colors">LINKEDIN</a>
                <a href="#" className="block text-[#666] hover:text-white transition-colors">DISCORD</a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a1a1a]">
            <p className="text-[11px] text-[#444]">© 2024 EDUVERSE. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-2 text-[11px] text-[#444] mt-4 md:mt-0">
              <span className="w-2 h-2 rounded-full bg-[#27ca40]"></span>
              BUILT BY RAGHUL A R
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
