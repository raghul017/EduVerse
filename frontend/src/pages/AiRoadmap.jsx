import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search, ArrowRight, Clock, Loader2, Zap } from "lucide-react";
import api from "../utils/api.js";

function AiRoadmap() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmaps, setGeneratedRoadmaps] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Role-based roadmaps
  const roleRoadmaps = [
    "Frontend", "Backend", "Full Stack",
    "DevOps", "Data Analyst", "AI Engineer",
    "AI and Data Scientist", "Data Engineer", "Android",
    "Machine Learning", "PostgreSQL", "iOS",
    "Blockchain", "QA", "Software Architect",
    "Cyber Security", "UX Design", "Technical Writer",
    "Game Developer", "Server Side Game Developer", "MLOps",
    "Product Manager", "Engineering Manager", "Developer Relations",
    "BI Analyst"
  ];

  // Skill-based roadmaps  
  const skillRoadmaps = [
    "SQL", "Computer Science", "React",
    "Vue", "Angular", "JavaScript",
    "TypeScript", "Node.js", "Python",
    "System Design", "Java", "ASP.NET Core",
    "API Design", "Spring Boot", "Flutter",
    "C++", "Rust", "Go",
    "Software Design and Architecture", "GraphQL", "React Native",
    "Design System", "Prompt Engineering", "MongoDB",
    "Linux", "Kubernetes", "Docker",
    "AWS", "Terraform", "Data Structures & Algorithms",
    "Redis", "Git and GitHub", "PHP",
    "Cloudflare", "AI Red Teaming", "AI Agents",
    "Next.js", "Code Review", "Kotlin",
    "HTML", "CSS", "Swift & Swift UI",
    "Shell / Bash", "Laravel", "Elasticsearch"
  ];

  // Load user's generated roadmaps
  useEffect(() => {
    const loadGeneratedRoadmaps = async () => {
      try {
        const response = await api.get("/paths/my-roadmaps");
        if (response.data.data) {
          setGeneratedRoadmaps(response.data.data);
        }
      } catch (error) {
        console.log("No saved roadmaps or not logged in");
      } finally {
        setLoadingHistory(false);
      }
    };
    loadGeneratedRoadmaps();
  }, []);

  const filteredRoleRoadmaps = roleRoadmaps.filter(role =>
    role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSkillRoadmaps = skillRoadmaps.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoadmapClick = (roadmap) => {
    navigate(`/roadmap?role=${encodeURIComponent(roadmap.toLowerCase())}`);
  };

  const handleCustomGenerate = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim() || isGenerating) return;
    
    setIsGenerating(true);
    // Navigate directly - the roadmap page will handle generation
    navigate(`/roadmap?role=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleCustomGenerate(e);
    }
  };

  // Check if search matches any predefined roadmap
  const hasExactMatch = [...roleRoadmaps, ...skillRoadmaps].some(
    r => r.toLowerCase() === searchQuery.toLowerCase()
  );

  const showCustomOption = searchQuery.trim().length >= 2 && !hasExactMatch;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 font-serif flex items-center justify-center gap-3">
            <Sparkles className="text-blue-500" size={40} />
            AI Roadmap Generator
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose a role/skill or <span className="text-blue-400 font-medium">enter any topic</span> to generate a personalized learning roadmap
          </p>
        </div>

        {/* Search Bar with Generate Button */}
        <div className="mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleCustomGenerate} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search or enter any topic to generate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-32 py-4 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none text-lg bg-white/5 text-white placeholder:text-slate-600 shadow-sm transition-all"
              disabled={isGenerating}
            />
            {searchQuery.trim() && (
              <button
                type="submit"
                disabled={isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Generate
                  </>
                )}
              </button>
            )}
          </form>
          
          {/* Custom topic hint */}
          {showCustomOption && (
            <div className="mt-3 flex items-center justify-center gap-2 text-slate-400 text-sm">
              <ArrowRight size={14} />
              <span>Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> or click Generate to create a custom roadmap for "<span className="text-blue-400">{searchQuery}</span>"</span>
            </div>
          )}
        </div>

        {/* Previously Generated Roadmaps */}
        {generatedRoadmaps.length > 0 && (
          <section className="mb-16">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Clock size={14} />
              YOUR GENERATED ROADMAPS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {generatedRoadmaps.slice(0, 6).map((roadmap) => (
                <button
                  key={roadmap.id}
                  onClick={() => navigate(`/roadmap?role=${encodeURIComponent(roadmap.role)}`)}
                  className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-blue-400 transition-colors capitalize">
                    {roadmap.role}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Generated {new Date(roadmap.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Loading History Skeleton */}
        {loadingHistory && (
          <section className="mb-16">
            <div className="h-4 w-48 bg-white/5 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          </section>
        )}

        {/* Role-Based Roadmaps */}
        {(!searchQuery || filteredRoleRoadmaps.length > 0) && (
          <section className="mb-16">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
              ROLE-BASED ROADMAPS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredRoleRoadmaps.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoadmapClick(role)}
                  className="group bg-white/5 border border-white/10 rounded-full p-5 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {role}
                  </h3>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Skill-Based Roadmaps */}
        {(!searchQuery || filteredSkillRoadmaps.length > 0) && (
          <section>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
              SKILL-BASED ROADMAPS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredSkillRoadmaps.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleRoadmapClick(skill)}
                  className="group bg-white/5 border border-white/10 rounded-full p-5 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {skill}
                  </h3>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* No Results - Show Generate Option */}
        {searchQuery && filteredRoleRoadmaps.length === 0 && filteredSkillRoadmaps.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-slate-400 mb-4">No preset roadmaps for "{searchQuery}"</p>
            <button
              onClick={handleCustomGenerate}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Custom Roadmap...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Custom Roadmap for "{searchQuery}"
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiRoadmap;

