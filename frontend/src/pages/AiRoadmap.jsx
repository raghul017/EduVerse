import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Map, ArrowLeft, Sparkles, Code, Database, Cloud, Smartphone, Shield, Globe, Cpu, Layout, Terminal } from "lucide-react";
import { motion } from "framer-motion";

function AiRoadmap() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const roleBasedRoadmaps = [
    { id: "frontend", title: "Frontend Developer", description: "Master HTML, CSS, React, and modern UI engineering", icon: Layout },
    { id: "backend", title: "Backend Developer", description: "Server-side logic, databases, and API design", icon: Database },
    { id: "fullstack", title: "Full Stack Developer", description: "Complete web mastery from client to server", icon: Globe },
    { id: "devops", title: "DevOps Engineer", description: "CI/CD, containerization, and cloud infrastructure", icon: Cloud },
    { id: "android", title: "Android Developer", description: "Native Android app development with Kotlin", icon: Smartphone },
    { id: "ios", title: "iOS Developer", description: "Native iOS app development with Swift", icon: Smartphone },
    { id: "postgresql", title: "PostgreSQL Expert", description: "Advanced relational database management", icon: Database },
    { id: "ai-engineer", title: "AI Engineer", description: "Machine learning models and neural networks", icon: Brain },
    { id: "data-scientist", title: "Data Scientist", description: "Analyze complex data to drive decision making", icon: BarChart },
    { id: "qa-engineer", title: "QA Engineer", description: "Ensure software quality through automated testing", icon: CheckCircle },
    { id: "cyber-security", title: "Cyber Security", description: "Protect systems from digital attacks", icon: Shield },
    { id: "blockchain", title: "Blockchain Developer", description: "Decentralized applications and smart contracts", icon: Link },
    { id: "game-dev", title: "Game Developer", description: "Create immersive interactive experiences", icon: Gamepad },
    { id: "ux-ui", title: "UX/UI Designer", description: "Design intuitive and beautiful user interfaces", icon: PenTool },
    { id: "product-manager", title: "Product Manager", description: "Lead product strategy and development", icon: Briefcase },
    { id: "technical-writer", title: "Technical Writer", description: "Create clear and effective documentation", icon: FileText },
    { id: "embedded", title: "Embedded Systems", description: "Programming for hardware and IoT devices", icon: Cpu },
    { id: "sre", title: "Site Reliability Eng.", description: "Ensure scalable and reliable software systems", icon: Server },
  ];

  const filteredRoadmaps = roleBasedRoadmaps.filter(
    (roadmap) =>
      roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoadmapSelect = (roadmap) => {
    navigate(`/roadmap?role=${roadmap.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fbf7f1] font-sans text-stone-900">
      {/* Minimal AI Usage Display */}
      <div className="w-full border-b border-stone-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
            <Sparkles size={14} className="text-stone-400" />
            <span>AI Usage Limit: 100,000 tokens/day</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-stone-800 w-[16%]"></div>
            </div>
            <span className="text-xs font-medium text-stone-600">16.6% Used</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          <div>
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-4"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-4">
              Role-Based Roadmaps
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl">
              Select a role to generate a personalized, AI-curated learning path tailored to your goals.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96 relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-800 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search roles (e.g. 'Frontend')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200 focus:border-stone-800 rounded-xl pl-12 pr-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredRoadmaps.map((roadmap, index) => (
            <motion.button
              key={roadmap.id}
              onClick={() => handleRoadmapSelect(roadmap)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group flex flex-col items-start p-6 bg-white border border-stone-200 hover:border-stone-800 rounded-xl text-left transition-all hover:shadow-md h-full"
            >
              <div className="p-3 bg-stone-50 rounded-lg mb-4 group-hover:bg-stone-100 transition-colors">
                <roadmap.icon size={24} className="text-stone-700" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg mb-2 group-hover:text-stone-700 transition-colors">
                {roadmap.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {roadmap.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* No Results */}
        {filteredRoadmaps.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 mb-4">
              <Search size={24} className="text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">No roles found</h3>
            <p className="text-stone-500">Try searching for something else like "Backend" or "Data".</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Icon imports helper (since we used some that might not be imported)
import { Brain, BarChart, CheckCircle, Link, Gamepad, PenTool, Briefcase, FileText, Server } from "lucide-react";

export default AiRoadmap;
