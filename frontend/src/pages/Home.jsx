import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Command, Zap, Users, Asterisk, BookOpen, Route, Target, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Dynamic words for hero text cycling
const HERO_WORDS = ["Coding", "Design", "AI Skills", "DevOps", "ML/AI"];

const Home = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const starRef = useRef(null);
  const marqueeRef = useRef(null);
  const bentoRef = useRef(null);
  const toolkitRef = useRef(null);
  const wordRef = useRef(null);

  // GSAP Animations
  useGSAP(() => {
    // 1. Rotating Star Animation
    if (starRef.current) {
      gsap.to(starRef.current, {
        rotation: 360,
        duration: 6,
        ease: "none",
        repeat: -1
      });
    }

    // 2. Text Replacement Animation (Cycling Words)
    if (wordRef.current) {
      const cycleWords = () => {
        gsap.timeline()
          .to(wordRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
              setCurrentWordIndex(prev => (prev + 1) % HERO_WORDS.length);
            }
          })
          .set(wordRef.current, { y: 20 })
          .to(wordRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          });
      };

      // Initial animation
      gsap.set(wordRef.current, { opacity: 1, y: 0 });
      
      // Cycle every 2.5 seconds
      const interval = setInterval(cycleWords, 2500);
      return () => clearInterval(interval);
    }

    // 2. Marquee Animation
    if (marqueeRef.current) {
      const content = marqueeRef.current.querySelector('.marquee-content');
      if (content) {
        const clone = content.cloneNode(true);
        marqueeRef.current.appendChild(clone);
        
        gsap.to(marqueeRef.current.children, {
          xPercent: -100,
          repeat: -1,
          duration: 50,
          ease: "none"
        });
      }
    }

    // 3. Bento Grid Cards Animation - moved to separate useEffect below

    // 4. Toolkit Cards Animation (Scroll Triggered)
    if (toolkitRef.current) {
      const children = toolkitRef.current.children;
      gsap.set(children, { autoAlpha: 0, y: 100 });

      gsap.to(children, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: toolkitRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }
  }, []);

  // Bento Grid animation removed as per user request
  // Cards will be visible by default via CSS modifications below

  const handleGenerate = () => {
    if (!topic.trim()) return;
    navigate(`/roadmap?role=${encodeURIComponent(topic.trim())}&detail=standard`);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#A1FF62] selection:text-black overflow-x-hidden bg-[#F5F5F5] relative">
      
      {/* THIN VERTICAL LINE (Background) */}
      <div className="fixed left-1/2 top-0 h-full w-[1px] bg-[#000000]/5 -translate-x-1/2 -z-0 pointer-events-none" />

      {/* MARQUEE TAPE */}
      <div className="w-full bg-[#A1FF62] py-2 overflow-hidden mt-[90px] relative z-10 selection:bg-black selection:text-[#A1FF62]">
        <div className="animate-marquee">
          {/* Original Content */}
          <div className="flex items-center shrink-0">
            {Array(10).fill(null).map((_, i) => (
              <span key={`orig-${i}`} className="flex items-center mx-8">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-black">
                  AI ROADMAPS • VIDEO TRANSCRIPTION • REAL-TIME TUTORING • COMMUNITY LEARNING
                </span>
                <span className="text-black ml-8 text-sm">✦</span>
              </span>
            ))}
          </div>
          {/* Duplicate Content for seamless loop */}
          <div className="flex items-center shrink-0">
            {Array(10).fill(null).map((_, i) => (
              <span key={`dup-${i}`} className="flex items-center mx-8">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-black">
                  AI ROADMAPS • VIDEO TRANSCRIPTION • REAL-TIME TUTORING • COMMUNITY LEARNING
                </span>
                <span className="text-black ml-8 text-sm">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-20 pb-10 flex flex-col items-center px-6">
        <div className="max-w-[1200px] mx-auto text-center bg-[#F5F5F5]/80 backdrop-blur-sm p-3 sm:p-4 rounded-3xl">
          
          {/* DISCLAIMER BANNER - TOP */}
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-widest text-[#FF5F56] font-bold bg-[#FF5F56]/10 px-3 py-1.5 rounded-full inline-block border border-[#FF5F56]/20">
              ⚠️ Site is under active development. Some features may not work as expected.
            </p>
          </div>

          {/* Single Line Large Headline with Dynamic Word */}
          <h1 className="leading-none flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-6 sm:mb-8"
            style={{ 
              fontFamily: 'Haffer XH, Arial, sans-serif',
              fontWeight: 400,
              letterSpacing: '-.06em',
              lineHeight: 1,
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              color: '#1a1a1a' 
            }}>
            <span>Master</span>
            <span 
              ref={wordRef}
              className="text-[#A1FF62] bg-[#1a1a1a] px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-xl inline-block min-w-[120px] sm:min-w-[180px] md:min-w-[280px] text-center"
              style={{ 
                fontWeight: 500,
                letterSpacing: '-.02em'
              }}
            >
              {HERO_WORDS[currentWordIndex]}
            </span>
            <span ref={starRef} className="text-[#694EFF] inline-flex items-center justify-center">
              <Asterisk size={48} strokeWidth={2.5} className="md:w-16 md:h-16" />
            </span>
            <span>with AI</span>
          </h1>

          {/* Subtext with pills */}
          <p className="text-[#666] text-sm sm:text-base md:text-xl mb-8 sm:mb-10 flex flex-wrap justify-center gap-2 sm:gap-3 items-center max-w-[900px] mx-auto px-2">
            Ultra-fast roadmaps via
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#1a1a1a] text-white text-xs sm:text-sm rounded-lg font-medium shadow-lg">Groq Llama 3.3</span>
            <span className="hidden sm:inline">•</span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#1a1a1a] text-white text-xs sm:text-sm rounded-lg font-medium shadow-lg">AI Tutor Chat</span>
            <span className="hidden sm:inline">•</span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#1a1a1a] text-white text-xs sm:text-sm rounded-lg font-medium shadow-lg">Video Whisper</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline px-2 sm:px-3 py-1 sm:py-1.5 bg-[#1a1a1a] text-white text-xs sm:text-sm rounded-lg font-medium shadow-lg">Auto Quizzes</span>
            <span className="hidden md:inline">and</span>
            <span className="hidden md:inline px-2 sm:px-3 py-1 sm:py-1.5 bg-[#1a1a1a] text-white text-xs sm:text-sm rounded-lg font-medium shadow-lg">Communities</span>
          </p>

          {/* SEARCH BOX */}
          <div className="bg-[#1a1a1a] rounded-full p-1.5 sm:p-2 pl-4 sm:pl-6 flex items-center max-w-2xl mx-auto shadow-2xl relative z-20">
            <Command size={20} className="text-white/40 mr-2 sm:mr-4 shrink-0 hidden sm:block" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Frontend, Data Science..."
              aria-label="Enter a topic to generate a learning roadmap"
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 p-0 h-10 sm:h-14 text-sm sm:text-lg focus:outline-none"
            />
            <button 
              onClick={handleGenerate}
              aria-label="Generate learning roadmap"
              className="bg-[#A1FF62] hover:bg-[#b8ff8a] text-black font-bold h-9 sm:h-12 px-4 sm:px-8 rounded-full text-sm sm:text-base transition-all flex items-center gap-1 sm:gap-2"
            >
              <span className="hidden sm:inline">Generate</span> <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
          
          {/* Meta info */}
          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center mt-6 sm:mt-8 text-xs sm:text-sm text-[#999] font-medium">
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-[#A1FF62]" /> Groq Ultra-Fast
            </span>
            <span className="hidden sm:inline">Llama 3.3 70B</span>
            <span className="hidden md:inline">Gemini Fallback</span>
          </div>
        </div>

        {/* BENTO GRID GALLERY */}
        <div ref={bentoRef} className="relative w-full max-w-[1200px] mx-auto mt-10 sm:mt-16 px-3 sm:px-4">
          
          {/* Bento Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[200px]">
            
            {/* Card 1 - Roadmaps (2 rows) */}
            <div className="bento-item sm:row-span-2 bg-[#1a1a1a] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(161,255,98,0.15)] group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              <div className="p-6 h-full flex flex-col justify-between relative z-10">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500/50"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-500/30 border border-yellow-500/50"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500/30 border border-green-500/50"></div>
                </div>
                <div className="flex-1 flex items-center justify-center py-6">
                  <div className="w-20 h-20 rounded-2xl bg-[#A1FF62]/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#A1FF62]/20 transition-all duration-300">
                    <Route size={40} className="text-[#A1FF62]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">POWERED BY</span>
                  <p className="text-white font-heading font-bold text-xl leading-none">Llama 3.3 70B</p>
                  <p className="text-white/50 text-xs mt-2">AI Roadmaps in seconds</p>
                </div>
              </div>
            </div>

            {/* Card 2 - AI Courses (Featured - 2 cols, 2 rows) */}
            <div className="bento-item col-span-1 sm:col-span-2 sm:row-span-2 bg-[#000] rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_rgba(161,255,98,0.2)] overflow-hidden border border-[#A1FF62]/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(161,255,98,0.3)] group relative">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
              <div className="p-8 h-full flex flex-col relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                  </div>
                  <div className="text-[10px] text-[#A1FF62] font-mono tracking-widest bg-[#A1FF62]/10 px-3 py-1 rounded-full">ECOSYSTEM</div>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center gap-6 relative">
                  <div className="absolute inset-0 bg-[#A1FF62] blur-[100px] opacity-10"></div>
                  <BookOpen size={80} className="text-[#A1FF62] relative z-10 drop-shadow-[0_0_20px_rgba(161,255,98,0.5)] group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-center">
                    <span className="text-white text-3xl md:text-4xl font-heading font-bold block">AI Courses</span>
                    <span className="text-white/40 text-sm font-medium">Auto-generated learning paths</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider">V2.0 LIVE</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#A1FF62] animate-pulse"></div>
                    <span className="text-[10px] text-[#A1FF62]">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Whisper (2 rows) */}
            <div className="bento-item hidden sm:flex sm:row-span-2 bg-[#E8E4D8] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-black/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group relative flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
              <div className="p-6 h-full flex flex-col justify-between relative z-10">
                <span className="text-[10px] text-[#000]/40 uppercase tracking-[0.2em] font-bold border border-black/10 px-2 py-1 rounded-full self-start">VOICE AI</span>
                <div className="flex-1 flex items-center justify-center py-4">
                  <h3 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tighter leading-[0.9] text-center">WHISPER</h3>
                </div>
                <div>
                  <div className="h-1 w-16 bg-black/10 rounded-full overflow-hidden mb-3">
                    <div className="h-full w-full bg-black/80 animate-pulse"></div>
                  </div>
                  <span className="text-xs text-[#666] font-medium leading-tight">
                    Video → Text<br/>
                    <span className="text-black font-bold underline">Instant summaries</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4 - AI Tutor (1 row, full width on mobile) */}
            <div className="bento-item col-span-1 sm:col-span-2 bg-[#1a1a1a] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg group relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#A1FF62] blur-[80px] opacity-10 pointer-events-none"></div>
              <div className="p-6 h-full flex items-center gap-6 relative z-10">
                <div className="p-3 bg-[#A1FF62]/10 rounded-xl group-hover:bg-[#A1FF62]/20 transition-colors">
                  <MessageSquare size={28} className="text-[#A1FF62]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-white uppercase font-bold tracking-widest">AI Tutor</span>
                  <p className="text-white/50 text-sm mt-1">24/7 Learning Assistant</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#A1FF62] animate-pulse"></div>
                  <span className="text-[10px] text-[#A1FF62] font-mono">ONLINE</span>
                </div>
              </div>
            </div>

            {/* Card 5 - Community */}
            <div className="bento-item col-span-1 sm:col-span-2 bg-[#F5F0E6] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-lg group relative">
              <div className="p-6 h-full flex items-center justify-between relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Users size={24} className="text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-[#1a1a1a] leading-none">Join the Community</h3>
                    <div className="flex -space-x-2 pt-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#F5F0E6] flex items-center justify-center text-[8px] font-bold text-white
                          ${i === 0 ? 'bg-[#1a1a1a] z-50' : 
                            i === 1 ? 'bg-[#333] z-40' : 
                            i === 2 ? 'bg-[#555] z-30' : 
                            i === 3 ? 'bg-[#777] z-20' : 'bg-[#999] z-10'}`}
                        >
                          {String.fromCharCode(65+i)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-bold bg-black/5 px-3 py-1.5 rounded-full">12k+</div>
                  <Link to="/communities" className="px-4 py-2 bg-[#1a1a1a] text-white rounded-full text-xs font-bold inline-flex items-center gap-2 group-hover:bg-black transition-colors">
                    Explore <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TOOLKIT SECTION */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-[800px] mx-auto text-center mb-8 sm:mb-12 bg-[#F5F5F5]/90 backdrop-blur rounded-xl p-3 sm:p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#999]">Powered by Groq + Gemini</span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-[#1a1a1a] leading-tight mt-3 mb-4">
            Your complete AI learning<br />ecosystem
          </h2>
          <p className="text-sm text-[#666] mb-6">Everything you need to master any skill:</p>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#1a1a1a] text-white cursor-pointer">Roadmaps</span>
            <span className="px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] cursor-pointer transition-colors">Video Whisper</span>
            <span className="px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] cursor-pointer transition-colors">AI Tutor</span>
            <span className="px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] cursor-pointer transition-colors">Dashboard</span>
            <span className="px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] cursor-pointer transition-colors">Community</span>
          </div>
        </div>

        {/* TILTED CARDS */}
        <div ref={toolkitRef} className="relative flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 py-8 max-w-[1000px] mx-auto">
          
          {/* Purple Card - Community */}
          <div className="hidden md:block hover:scale-105 transition-all duration-500 z-10">
            <div className="w-[220px] h-[320px] bg-[#694EFF] rounded-3xl p-6 flex flex-col shadow-2xl">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                <Asterisk size={10} /> COMMUNITY
              </span>
              <h3 className="text-3xl font-black text-white mt-3 leading-[1.1]">
                Join<br/>the<br/>learners
              </h3>
              <div className="flex -space-x-2 mt-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#694EFF] flex items-center justify-center text-[10px] text-white font-bold">A</div>
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#694EFF] flex items-center justify-center text-[10px] text-white font-bold">B</div>
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#694EFF] flex items-center justify-center text-[10px] text-white font-bold">C</div>
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#694EFF] flex items-center justify-center">
                  <Users size={12} className="text-white/60" />
                </div>
              </div>
              <Link to="/communities" className="px-4 py-2.5 bg-[#1a1a1a] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 w-fit hover:bg-white hover:text-black transition-colors">
                Discover <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Center Dark Card - The Vault */}
          <div className="z-20 hover:scale-105 transition-all duration-500">
            <div className="w-[280px] md:w-[340px] h-[400px] md:h-[480px] bg-[#0a0a0a] rounded-3xl p-6 flex flex-col shadow-2xl border border-white/5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Part of the membership</span>
              
              <div className="flex items-center justify-center my-5">
                <Asterisk size={40} className="text-white" />
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-white text-center">Dashboard</h3>
              <p className="text-xs text-white/50 text-center mt-3 leading-relaxed">
                Track your learning journey with progress stats, streaks, and AI usage analytics.
              </p>
              
              {/* Mini preview */}
              <div className="mt-auto bg-[#181818] rounded-xl p-3 border border-white/5">
                <div className="flex gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="text-[9px] text-white/30 mb-1">EDUVERSE</div>
                <div className="h-16 bg-[#0a0a0a] rounded-lg flex items-center justify-center">
                  <Route size={24} className="text-white/20" />
                </div>
              </div>
              
              <Link to="/ai-roadmap" className="mt-5 px-6 py-2.5 bg-[#A1FF62] text-black rounded-full text-sm font-bold inline-flex items-center gap-1.5 w-fit mx-auto hover:bg-[#b8ff8a] transition-all shadow-lg shadow-[#A1FF62]/20">
                Discover <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Lime Card - Courses */}
          <div className="hidden md:block hover:scale-105 transition-all duration-500 z-10">
            <div className="w-[220px] h-[320px] bg-[#A1FF62] rounded-3xl p-6 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono uppercase tracking-widest text-black/50">AI Powered</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-black/50">2025</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Asterisk size={14} className="text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mt-2 leading-[1.1]">
                Smart<br/>Courses<br/>& Quizzes
              </h3>
              <p className="text-[10px] text-black/60 mt-2 leading-relaxed">
                AI-generated courses tailored to your learning style and goals.
              </p>
              <Link to="/ai-course" className="mt-auto px-4 py-2.5 bg-[#1a1a1a] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 w-fit hover:bg-white hover:text-black transition-colors">
                Discover <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBE + TESTIMONIAL (Trusted By Removed) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          
          {/* Globe */}
          <div className="relative w-[250px] sm:w-[300px] md:w-[380px] h-[320px] sm:h-[380px] md:h-[480px] mx-auto">
            <div className="absolute inset-0 bg-[#0a0a0a] rounded-[50%/40%] flex items-center justify-center overflow-hidden shadow-2xl">
              
              {/* Top Label */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10">
                <span className="text-[#A1FF62] text-sm font-medium">Connect</span>
                <br />
                <span className="text-white text-base font-bold">Worldwide</span>
              </div>
              
              {/* Tick marks ring */}
              <div className="absolute inset-10 rounded-full">
                {Array.from({length: 60}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-[2px] h-3 bg-white/40"
                    style={{
                      left: '50%',
                      top: '0',
                      transformOrigin: '50% 150px',
                      transform: `translateX(-50%) rotate(${i * 6}deg)`
                    }}
                  />
                ))}
              </div>

              {/* World Map SVG */}
              <svg viewBox="0 0 300 300" className="absolute w-[220px] h-[220px] md:w-[260px] md:h-[260px]">
                <ellipse cx="90" cy="60" rx="10" ry="6" fill="#3d3d3d" />
                <path d="M60,30 Q80,25 95,35 L85,55 L65,50 Z" fill="#3d3d3d" />
                <path d="M140,40 L155,30 L165,50 L155,80 L140,70 Z" fill="#3d3d3d" />
                <path d="M105,85 L118,80 L125,95 L120,115 L108,110 L102,95 Z" fill="#A1FF62" />
                <ellipse cx="92" cy="98" rx="10" ry="14" fill="#3d3d3d" />
                <path d="M115,120 L140,115 L150,145 L130,160 L110,145 Z" fill="#3d3d3d" />
                <path d="M95,150 L125,145 L130,180 L100,185 Z" fill="#3d3d3d" />
                <path d="M145,90 L180,85 L185,130 L150,135 Z" fill="#3d3d3d" />
                <path d="M150,140 L160,135 L175,175 L160,190 L145,170 Z" fill="#3d3d3d" />
                <path d="M185,70 L220,65 L230,130 L190,140 Z" fill="#3d3d3d" />
                <path d="M80,200 L220,190 L230,260 L90,270 Z" fill="#2a2a2a" />
              </svg>

              {/* Bottom Label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10">
                <span className="text-[#A1FF62] text-sm" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>EduVerse's Global</span>
                <br />
                <span className="text-[#A1FF62] text-sm" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Community</span>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="bg-[#694EFF] rounded-[32px] p-8 text-white shadow-2xl hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
              Groq's 45ms inference changed everything for learning.
            </h3>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              EduVerse generated a complete Frontend Developer roadmap in under 2 seconds. The AI tutor answers my questions instantly, video transcription makes every YouTube tutorial searchable, and auto-generated quizzes test my knowledge. Finally, a platform that combines speed, intelligence, and community.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <span className="text-xl">👨‍🎓</span>
              </div>
              <div>
                <span className="text-sm font-bold italic">Alex Rodriguez</span>
                <div className="flex gap-2 mt-1">
                  <span className="px-2.5 py-1 bg-white/20 rounded text-[10px] uppercase font-bold">Self-Taught Dev</span>
                  <span className="px-2.5 py-1 bg-[#A1FF62] text-black rounded text-[10px] uppercase font-bold">1.7K Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY EDUVERSE */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-[700px] mx-auto bg-[#F5F5F5]/90 backdrop-blur rounded-xl p-3 sm:p-4">
          <span className="text-[#FF6B6B] text-base sm:text-lg italic">Why EduVerse?</span>
          <h2 className="text-[clamp(1.25rem,3.5vw,2.5rem)] font-black text-[#1a1a1a] leading-[1.2] mt-3">
            Learn faster with AI that generates roadmaps in seconds, transcribes videos instantly, and tutors you in real-time. Join 1,700+ learners building their future.
          </h2>
        </div>
      </section>

      {/* Spacing at bottom */}
      <div className="h-20"></div>

    </div>
  );
};

export default Home;
