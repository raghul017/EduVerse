import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search } from "lucide-react";

function AiRoadmap() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredRoleRoadmaps = roleRoadmaps.filter(role =>
    role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSkillRoadmaps = skillRoadmaps.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoadmapClick = (roadmap) => {
    navigate(`/roadmap?role=${encodeURIComponent(roadmap.toLowerCase())}`);
  };

  return (
    <div className="min-h-screen bg-[#fbf7f1] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-stone-900 mb-4 font-serif flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-500" size={40} />
            AI Roadmap Generator
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Choose a role or skill to generate a personalized learning roadmap powered by AI
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-stone-200 focus:border-yellow-400 focus:outline-none text-lg bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Role-Based Roadmaps */}
        {(!searchQuery || filteredRoleRoadmaps.length > 0) && (
          <section className="mb-16">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-6">
              ROLE-BASED ROADMAPS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredRoleRoadmaps.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoadmapClick(role)}
                  className="group bg-white border-2 border-stone-200 rounded-xl p-5 hover:border-yellow-400 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <h3 className="text-lg font-semibold text-stone-900 group-hover:text-yellow-600 transition-colors">
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
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-6">
              SKILL-BASED ROADMAPS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredSkillRoadmaps.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleRoadmapClick(skill)}
                  className="group bg-white border-2 border-stone-200 rounded-xl p-5 hover:border-yellow-400 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <h3 className="text-lg font-semibold text-stone-900 group-hover:text-yellow-600 transition-colors">
                    {skill}
                  </h3>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {searchQuery && filteredRoleRoadmaps.length === 0 && filteredSkillRoadmaps.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-stone-500">No roadmaps found for "{searchQuery}"</p>
            <p className="text-stone-400 mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiRoadmap;
