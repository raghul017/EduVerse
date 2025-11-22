import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Map, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AIUsageStats from "../components/ai/AIUsageStats.jsx";

function AiRoadmap() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const roleBasedRoadmaps = [
    {
      id: "frontend",
      title: "Frontend Developer",
      description: "Master HTML, CSS, JavaScript, and modern frameworks",
    },
    {
      id: "backend",
      title: "Backend Developer",
      description: "Build scalable server-side applications",
    },
    {
      id: "fullstack",
      title: "Full Stack Developer",
      description: "Complete web development mastery",
    },
    {
      id: "devops",
      title: "DevOps Engineer",
      description: "Automation, CI/CD, and cloud infrastructure",
    },
    {
      id: "mobile",
      title: "Mobile Developer",
      description: "iOS and Android app development",
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      description: "Machine learning and data analysis",
    },
    {
      id: "ml-engineer",
      title: "ML Engineer",
      description: "Build and deploy ML models at scale",
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity Specialist",
      description: "Protect systems and networks",
    },
    {
      id: "cloud-architect",
      title: "Cloud Architect",
      description: "Design scalable cloud solutions",
    },
    {
      id: "qa-engineer",
      title: "QA Engineer",
      description: "Testing and quality assurance",
    },
    {
      id: "game-dev",
      title: "Game Developer",
      description: "Create immersive gaming experiences",
    },
    {
      id: "blockchain",
      title: "Blockchain Developer",
      description: "Decentralized apps and smart contracts",
    },
    {
      id: "ar-vr",
      title: "AR/VR Developer",
      description: "Augmented and Virtual Reality",
    },
    {
      id: "embedded",
      title: "Embedded Systems",
      description: "Hardware-software integration",
    },
  ];

  const skillBasedRoadmaps = [
    {
      id: "react",
      title: "React",
      description: "Modern UI library for web apps",
    },
    {
      id: "nodejs",
      title: "Node.js",
      description: "JavaScript runtime for backend",
    },
    {
      id: "python",
      title: "Python",
      description: "Versatile programming language",
    },
    {
      id: "typescript",
      title: "TypeScript",
      description: "Typed JavaScript at scale",
    },
    { id: "aws", title: "AWS", description: "Amazon cloud services" },
    { id: "docker", title: "Docker", description: "Containerization platform" },
    {
      id: "kubernetes",
      title: "Kubernetes",
      description: "Container orchestration",
    },
    {
      id: "postgresql",
      title: "PostgreSQL",
      description: "Relational database",
    },
    { id: "mongodb", title: "MongoDB", description: "NoSQL document database" },
    { id: "graphql", title: "GraphQL", description: "API query language" },
  ];

  const allRoadmaps = [...roleBasedRoadmaps, ...skillBasedRoadmaps];

  const filteredRoadmaps = allRoadmaps.filter(
    (roadmap) =>
      roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoadmapSelect = (roadmap) => {
    navigate(`/roadmap?role=${roadmap.id}`);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {/* Minimal AI Usage Display */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between bg-white border border-stone-200 rounded-lg px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-100 rounded-md">
              <Sparkles size={18} className="text-stone-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">AI Usage Limit</p>
              <p className="text-xs text-stone-500">100,000 tokens / day</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-stone-800 w-[16%]"></div>
            </div>
            <span className="text-sm font-medium text-stone-600">16.6% Used</span>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto pt-12 pb-8 text-center px-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-textSecondary" />
          </button>
          <div>
            <h1 className="text-4xl font-heading font-bold text-textPrimary flex items-center gap-3">
              <Sparkles size={32} className="text-void" />
              AI Roadmap Generator
            </h1>
            <p className="text-textSecondary text-lg mt-2">
              Choose a role or skill to generate your personalized learning
              roadmap
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted"
            size={20}
          />
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-border focus:border-void rounded-xl px-12 py-3 text-textPrimary placeholder-textMuted focus:outline-none transition-all"
          />
        </div>



        {/* Role-Based Roadmaps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-textPrimary flex items-center gap-2">
            <Map size={24} className="text-void" />
            Role-Based Roadmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRoadmaps
              .filter((r) => roleBasedRoadmaps.some((rb) => rb.id === r.id))
              .map((roadmap, index) => (
                <motion.button
                  key={roadmap.id}
                  onClick={() => handleRoadmapSelect(roadmap)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-5 bg-white border-2 border-border hover:border-void rounded-xl text-left transition-all hover:shadow-lg"
                >
                  <h3 className="font-bold text-textPrimary text-lg mb-2 group-hover:text-void transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-textSecondary text-sm leading-relaxed">
                    {roadmap.description}
                  </p>
                </motion.button>
              ))}
          </div>
        </div>

        {/* Skill-Based Roadmaps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-textPrimary flex items-center gap-2">
            <Sparkles size={24} className="text-void" />
            Skill-Based Roadmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredRoadmaps
              .filter((r) => skillBasedRoadmaps.some((sb) => sb.id === r.id))
              .map((roadmap, index) => (
                <motion.button
                  key={roadmap.id}
                  onClick={() => handleRoadmapSelect(roadmap)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-5 bg-white border-2 border-border hover:border-void rounded-xl text-left transition-all hover:shadow-lg"
                >
                  <h3 className="font-bold text-textPrimary text-lg mb-2 group-hover:text-void transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-textSecondary text-sm leading-relaxed">
                    {roadmap.description}
                  </p>
                </motion.button>
              ))}
          </div>
        </div>

        {/* No Results */}
        {filteredRoadmaps.length === 0 && (
          <div className="text-center py-16">
            <p className="text-textMuted text-lg">
              No roadmaps found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiRoadmap;
