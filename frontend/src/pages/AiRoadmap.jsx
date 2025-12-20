import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Clock, Trash2, Loader2, Route, Star, Play, ChevronDown, Settings2 } from "lucide-react";
import api from "../utils/api.js";
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
  const [detailLevel, setDetailLevel] = useState("standard");
  const [showSettings, setShowSettings] = useState(false);
  const [generatedRoadmaps, setGeneratedRoadmaps] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

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
    try {
      const { data } = await api.get("/paths/my-roadmaps");
      setGeneratedRoadmaps(data.data || []);
    } catch (err) {
      console.error("Failed to load roadmaps:", err);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] py-12 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
            <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            [ AI ROADMAP GENERATOR ]
          </div>
          <h1 className="text-[48px] font-bold text-white mb-4 leading-tight">
            AI Roadmap Generator
          </h1>
          <p className="text-[#666] text-[16px] max-w-xl mx-auto">
            Choose a role/skill or <span className="text-[#FF6B35]">enter any topic</span> to generate a personalized learning roadmap
          </p>
        </div>

        {/* Animated Search Bar */}
        <div className="max-w-[700px] mx-auto mb-6">
          <div className="bg-[#111] border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
              <code className="text-[12px] text-[#555] tracking-wide font-mono">USER@EDUVERSE:~/ROADMAP</code>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
              </div>
            </div>
            <div className="p-4">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSubmit={handleVanishSubmit}
                disabled={isGenerating}
              />
            </div>
          </div>
          
          {/* Custom topic hint */}
          {showCustomOption && (
            <div className="mt-3 flex items-center justify-center gap-2 text-[#666] text-[13px]">
              <ArrowRight size={14} />
              <span>Press <kbd className="px-2 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[11px] font-mono">Enter</kbd> to create roadmap for "<span className="text-[#FF6B35]">{searchQuery}</span>"</span>
            </div>
          )}
        </div>

        {/* Detail Level Selector */}
        <div className="max-w-[700px] mx-auto mb-12">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-[13px] text-[#666] hover:text-white mx-auto mb-3 transition-colors"
          >
            <Settings2 size={14} />
            Detail Level: <span className="text-[#FF6B35] font-semibold uppercase">{detailLevel}</span>
            <ChevronDown size={14} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>
          
          {showSettings && (
            <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-4 mt-3">
              <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-3 text-center font-mono">SELECT DETAIL LEVEL</p>
              <div className="grid grid-cols-3 gap-3">
                {detailLevels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => { setDetailLevel(level.id); setShowSettings(false); }}
                    className={`p-4 border text-left transition-all ${
                      detailLevel === level.id
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                        : 'border-[#2a2a2a] hover:border-[#444]'
                    }`}
                  >
                    <div className="text-[14px] font-semibold text-white">{level.label}</div>
                    <div className="text-[12px] text-[#555]">{level.stages} stages</div>
                    <div className="text-[11px] text-[#444] mt-1">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Roadmaps */}
        <div className="mb-10">
          <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ ROLE_ROADMAPS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {roleRoadmaps.map((role, i) => (
              <button
                key={i}
                onClick={() => handleRoadmapClick(role)}
                className="p-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] transition-all text-left group"
              >
                <Route size={18} className="text-[#FF6B35] mb-2" />
                <div className="text-[13px] font-semibold text-white group-hover:text-[#FF6B35] transition-colors">
                  {role}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skill Roadmaps */}
        <div className="mb-10">
          <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ SKILL_ROADMAPS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {skillRoadmaps.map((skill, i) => (
              <button
                key={i}
                onClick={() => handleRoadmapClick(skill)}
                className="p-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] transition-all text-left group"
              >
                <Sparkles size={18} className="text-[#FF6B35] mb-2" />
                <div className="text-[13px] font-semibold text-white group-hover:text-[#FF6B35] transition-colors">
                  {skill}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Topic Roadmaps */}
        <div className="mb-10">
          <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ TOPIC_ROADMAPS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topicRoadmaps.map((topic, i) => (
              <button
                key={i}
                onClick={() => handleRoadmapClick(topic)}
                className="p-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] transition-all text-left group"
              >
                <Star size={18} className="text-[#FF6B35] mb-2" />
                <div className="text-[13px] font-semibold text-white group-hover:text-[#FF6B35] transition-colors">
                  {topic}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Generated Roadmaps */}
        {generatedRoadmaps.length > 0 && (
          <div>
            <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ YOUR_GENERATED_ROADMAPS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  onClick={() => handleRoadmapClick(roadmap.role || roadmap.title, roadmap.detail_level)}
                  className="relative p-5 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#333] cursor-pointer transition-all group"
                >
                  <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-[#FF6B35]"></div>
                  <div className="flex items-start justify-between pl-3">
                    <div>
                      <h3 className="font-bold text-white text-[15px] mb-1 group-hover:text-[#FF6B35] transition-colors">
                        {roadmap.title || roadmap.role}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-[#555]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(roadmap.created_at).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-0.5 bg-[#1a1a1a] text-[#FF6B35] uppercase font-mono">
                          {roadmap.detail_level || 'standard'}
                        </span>
                      </div>
                      {roadmap.stages_count && (
                        <div className="text-[11px] text-[#444] mt-2">
                          {roadmap.stages_count} stages • {roadmap.completed_count || 0} completed
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteRoadmap(e, roadmap.id)}
                      className="p-2 text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for User Roadmaps */}
        {generatedRoadmaps.length === 0 && (
          <div className="text-center py-12 bg-[#0f0f0f] border border-[#1f1f1f]">
            <Route size={40} className="text-[#333] mx-auto mb-4" />
            <p className="text-[#555] text-[14px] mb-2">No generated roadmaps yet</p>
            <p className="text-[#444] text-[12px]">Your personalized roadmaps will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiRoadmap;
