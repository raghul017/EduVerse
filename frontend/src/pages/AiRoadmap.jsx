import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, Sparkles, Star, Search, Command, ArrowRight, Settings2, ChevronDown, ChevronRight, Loader2, Trash2, Clock, Zap, Terminal } from 'lucide-react';
import api from '../utils/api.js';
import Loader from '../components/common/Loader';
import SpotlightCard from '../components/ui/SpotlightCard';
import PlaceholdersAndVanishInput from "../components/ui/PlaceholdersAndVanishInput.jsx";

// Animated input placeholders
const placeholders = [
  "Master React from scratch...",
  "Become a DevOps Engineer...",
  "Learn Machine Learning...",
  "Full Stack Development path...",
  "Data Science roadmap...",
];

function AiRoadmap() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  // Professional Design State
  const [detailLevel, setDetailLevel] = useState('standard');
  const [showSettings, setShowSettings] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [generatedRoadmaps, setGeneratedRoadmaps] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coldStartDetected, setColdStartDetected] = useState(false);

  // Extensive preset roadmaps - Roles
  const roleRoadmaps = [
    "Frontend Developer",
    "Backend Developer", 
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Mobile Developer",
    "Cloud Architect",
    "Security Engineer",
    "QA Engineer",
    "Product Manager",
    "UI/UX Designer"
  ];
  
  // Skill-based roadmaps
  const skillRoadmaps = [
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "Docker",
    "AWS",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
    "Next.js",
    "TensorFlow"
  ];

  // Topic-based roadmaps
  const topicRoadmaps = [
    "System Design",
    "Data Structures & Algorithms",
    "Computer Networks",
    "Operating Systems",
    "Database Design",
    "API Development"
  ];

  useEffect(() => {
    loadGeneratedRoadmaps();
  }, []);

  const loadGeneratedRoadmaps = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    
    // Show cold start message after 2 seconds
    const coldStartTimer = setTimeout(() => {
      setColdStartDetected(true);
    }, 2000);
    
    try {
      const { data } = await api.get("/paths/my-roadmaps");
      setGeneratedRoadmaps(data.data || []);
    } catch (err) {
      console.error("Failed to load roadmaps:", err);
    } finally {
      clearTimeout(coldStartTimer);
      const duration = Date.now() - startTime;
      console.log(`[AiRoadmap] Load completed in ${duration}ms`);
      setIsLoading(false);
      setColdStartDetected(false);
    }
  };

  const handleRoadmapClick = (roadmap, level = detailLevel) => {
    const encodedRole = encodeURIComponent(roadmap);
    navigate(`/roadmap?role=${encodedRole}&detail=${level}`);
  };

  const handleVanishSubmit = (e, value) => {
    if (!value?.trim()) return;
    handleRoadmapClick(value.trim());
  };

  const handleDeleteRoadmap = async (e, roadmapId) => {
    e.stopPropagation();
    try {
      await api.delete(`/paths/roadmaps/${roadmapId}`);
      setGeneratedRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // Check for exact match in presets
  const hasExactMatch = [...roleRoadmaps, ...skillRoadmaps, ...topicRoadmaps].some(
    r => r.toLowerCase() === searchQuery.toLowerCase()
  );
  const showCustomOption = searchQuery.trim().length >= 2 && !hasExactMatch;

  const detailLevels = [
    { id: "quick", label: "Quick", stages: "5-7", desc: "Fast overview" },
    { id: "standard", label: "Standard", stages: "8-12", desc: "Balanced depth" },
    { id: "comprehensive", label: "Comprehensive", stages: "15-20", desc: "In-depth path" }
  ];

  const suggestions = ["Frontend Developer", "Data Scientist", "AWS Cloud Engineer"];
  const loading = isGenerating; // Assuming isGenerating is the correct state for loading

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsGenerating(true); // Set generating state
    handleRoadmapClick(searchQuery.trim());
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans" style={{ backgroundColor: 'var(--page-bg-light)' }}>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#201D1D]/95 backdrop-blur-3xl flex items-center justify-center transition-all duration-700">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 border-t-2 border-[#A1FF62] rounded-full animate-spin"></div>
               <div className="absolute inset-2 border-r-2 border-[#694EFF] rounded-full animate-spin-slow"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-white animate-pulse" size={24} />
               </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter">INITIALIZING_NEURAL_LINK</h2>
            <p className="text-[#A1FF62] font-mono text-sm tracking-widest animate-pulse">ESTABLISHING CONNECTION...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 py-[var(--section-padding-y)] px-6">
        
        {/* Hero Section - Light BG, Dark Text */}
        <div className="text-center mb-12 sm:mb-24 max-w-[1200px] mx-auto relative px-2">
          
          <div className="inline-flex items-center gap-2 mb-8 sm:mb-12 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#201D1D] text-white">
            <span className="w-2 h-2 rounded-full bg-[#A1FF62] animate-pulse shadow-[0_0_10px_#A1FF62]" />
            <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.15em] sm:tracking-[0.2em]">INTELLIGENT_PATHWAY_GENERATOR</span>
          </div>
          
          {/* Hero Text */}
          <h1 
            className="font-bold mb-8 leading-[0.95]"
            style={{ 
              fontSize: 'var(--hero-font-size)',
              letterSpacing: 'var(--hero-letter-spacing)',
              color: '#201D1D'
            }}
          >
            MASTER ANY SKILL<br />
            WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A1FF62] to-[#694EFF]">AI</span>
          </h1>
          
          <p className="text-[#666666] text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-10 sm:mb-16 px-4">
            Construct personalized, adaptive learning architectures tailored to your specific career trajectory.
          </p>
        </div>
        
        {/* Dark Command Center Pod */}
        <div 
          className="max-w-4xl mx-auto mb-12 sm:mb-24 rounded-[20px] sm:rounded-[var(--container-radius)] p-4 sm:p-8 relative overflow-hidden mx-2 sm:mx-auto"
          style={{ backgroundColor: 'var(--pod-bg-dark)' }}
        >
          {/* Subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#A1FF62]/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            {/* Input Container */}
            <div className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#A1FF62] via-[#694EFF] to-[#A1FF62] rounded-[24px] sm:rounded-[32px] opacity-20 blur transition duration-500 group-hover:opacity-40 ${isFocused ? 'opacity-75 blur-md' : ''}`} />
              <div className="relative bg-[#0A0A0A] rounded-[22px] sm:rounded-[30px] p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 border border-white/10 shadow-2xl">
                <div className="hidden sm:block pl-6 pr-4 text-white/30">
                  <Command size={28} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="What do you want to learn?"
                  className="w-full bg-transparent text-white text-base sm:text-xl py-3 sm:py-6 px-4 sm:px-0 placeholder:text-white/20 focus:outline-none font-medium"
                />
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#A1FF62] text-black rounded-[16px] sm:rounded-[24px] font-bold hover:scale-105 active:scale-95 transition-all text-sm tracking-wide disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shrink-0"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "GENERATE"}
                </button>
              </div>
            </div>
            
            {/* Suggestions */}
            <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-[11px] font-mono text-white/30 pt-2 uppercase tracking-wider">Try:</span>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(s)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#A1FF62]/50 text-white/60 hover:text-white text-[10px] sm:text-xs transition-all hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections - Dark Pods in Light Background */}
        <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-16 px-2 sm:px-0">
          
          {/* Career Protocols - Dark Pod Container */}
          <section 
            className="rounded-[20px] sm:rounded-[var(--container-radius)] p-4 sm:p-10 relative overflow-hidden"
            style={{ backgroundColor: 'var(--pod-bg-dark)' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 pb-4 border-b border-white/10 gap-2">
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Terminal size={24} className="text-[#694EFF]" />
                Career Protocols
              </h3>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">SELECT_PATHWAY</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--grid-gap)]">
              {roleRoadmaps.slice(0, 6).map((role, i) => (
                 <div
                    key={i}
                    onClick={() => handleRoadmapClick(role)}
                    className="group bg-[#0A0A0A] border border-white/10 hover:border-[#694EFF]/50 rounded-[var(--card-radius)] cursor-pointer transition-all hover:-translate-y-1"
                 >
                    <div className="p-8 flex flex-col h-full">
                       <div className="w-14 h-14 rounded-2xl bg-[#694EFF]/10 flex items-center justify-center text-[#694EFF] mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Route strokeWidth={1.5} size={28} />
                       </div>
                       <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#694EFF] transition-colors">{role}</h4>
                       <p className="text-white/50 text-sm leading-relaxed mb-8 flex-1">
                         Comprehensive career track designed to take you from novice to mastery.
                       </p>
                       <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                          <span className="text-[10px] font-mono text-white/40 uppercase">FULL_STACK</span>
                          <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#A1FF62] group-hover:text-black transition-colors">
                            <ChevronRight size={14} />
                          </span>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
          </section>

          {/* Trending Skills - Dark Pod Container */}
          <section 
            className="rounded-[var(--container-radius)] p-10 relative overflow-hidden"
            style={{ backgroundColor: 'var(--pod-bg-dark)' }}
          >
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Sparkles size={24} className="text-[#A1FF62]" />
                Trending Skills
              </h3>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ACCELERATED_LEARNING</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skillRoadmaps.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => handleRoadmapClick(skill)}
                  className="group relative p-4 bg-[#0A0A0A] border border-white/10 rounded-[var(--card-radius)] hover:border-[#A1FF62]/50 transition-all hover:-translate-y-1 overflow-hidden text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A1FF62]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-[#A1FF62]/10 text-[#A1FF62] flex items-center justify-center mb-3">
                       <Zap size={16} fill="currentColor" />
                    </div>
                    <div className="font-bold text-white text-sm group-hover:text-[#A1FF62] transition-colors">{skill}</div>
                    <div className="text-[10px] text-white/40 mt-1">Start Path →</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* User Generated Section (If Exists) */}
          {generatedRoadmaps.length > 0 && (
             <section className="bg-surface/50 border border-white/5 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-purple/10 blur-[100px] rounded-full pointer-events-none" />
                <h3 className="text-2xl font-mono text-black mb-8 tracking-tight relative z-10">&gt;_ YOUR_GENERATED_ROADMAPS</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                  {generatedRoadmaps.map((roadmap) => (
                    <div
                      key={roadmap.id}
                      onClick={() => handleRoadmapClick(roadmap.role || roadmap.title, roadmap.detail_level)}
                      className="group relative p-6 bg-[#0A0A0A] border border-white/5 hover:border-accent-purple/50 cursor-pointer transition-all rounded-[20px] hover:shadow-2xl hover:shadow-accent-purple/5"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                          <Terminal size={18} />
                        </div>
                        <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/50 border border-white/5 uppercase">
                          {roadmap.detail_level || 'standard'}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent-purple transition-colors">{roadmap.title || roadmap.role}</h4>
                      <p className="text-sm text-textMuted mb-4">Generated on {new Date(roadmap.created_at).toLocaleDateString()}</p>
                      
                      <div className="flex items-center gap-2 text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                        <span>RESUME PROTOCOL</span>
                        <ChevronRight size={12} />
                      </div>

                      <button
                        onClick={(e) => handleDeleteRoadmap(e, roadmap.id)}
                        className="absolute bottom-6 right-6 p-2 text-white/20 hover:text-red-500 hover:bg-white/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
             </section>
          )}

        </div>

      </div>
    </div>
  );
}

export default AiRoadmap;
