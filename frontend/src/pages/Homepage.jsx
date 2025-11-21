import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, BookOpen, TrendingUp } from 'lucide-react';
import { usePathStore } from "../store/pathStore.js";
import { useCommunityStore } from "../store/communityStore.js";
import { ROLE_BASED_ROADMAPS, SKILL_BASED_ROADMAPS } from "../utils/constants.js";
import Footer from "../components/common/Footer.jsx";
import Button from "../components/ui/Button.jsx";

const guides = [
  { title: "10 DevOps Deployment Tools for 2025", type: "Textual" },
  { title: "30 C++ Interview Questions and Answers", type: "Question" },
  { title: "Top 14 DevOps Testing Tools", type: "Textual" },
  { title: "Top 30 System Design Interview Questions", type: "Question" },
  { title: "Python vs JavaScript: The Ultimate Guide", type: "Textual" },
];

function Homepage() {
  const { paths, fetchPaths } = usePathStore();
  const { communities, fetchCommunities } = useCommunityStore();

  useEffect(() => {
    fetchPaths();
    fetchCommunities();
  }, []);

  const RoadmapCard = ({ title, isNew = false, index = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link
        to={`/ai-roadmap?role=${encodeURIComponent(title)}`}
        className="group relative flex items-center gap-3 p-5 bg-card border border-border rounded-xl hover:border-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-textPrimary font-semibold text-sm group-hover:text-accent transition-colors">
              {title}
            </span>
            {isNew && (
              <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded-full uppercase border border-accent/20">
                New
              </span>
            )}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-textSecondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );

  const GuideCard = ({ title, type, index = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link
        to={`/guide-generator?topic=${encodeURIComponent(title)}`}
        className="group flex items-center gap-3 p-5 bg-card border border-border rounded-xl hover:border-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
      >
        <div className="flex-1 min-w-0">
          <p className="text-textPrimary font-semibold text-sm group-hover:text-accent transition-colors">
            {title}
          </p>
          <p className="text-textSecondary text-xs mt-1 font-medium">{type}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-textSecondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 md:py-28 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning Platform
          </motion.div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-textPrimary mb-6 text-balance leading-tight">
            Learn, Grow, and Build Your
            <span className="block bg-gradient-to-r from-accent to-accentHover bg-clip-text text-transparent">
              Future with AI
            </span>
          </h1>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            A community-driven platform to learn, grow, and build your future
            using AI-powered learning roadmaps, courses, and guides.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/ai-tutor">
              <Button size="lg" className="text-base px-8 py-3">
                Start Learning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/videos">
              <Button variant="outline" size="lg" className="text-base px-8 py-3">
                Explore Videos
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Role-Based Roadmaps */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="py-16 border-t border-border"
      >
        <div className="max-w-layout mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-3">
              Role-Based Learning Roadmaps
            </h2>
            <p className="text-textSecondary text-lg max-w-2xl mx-auto">
              Structured learning paths tailored to your career goals
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ROLE_BASED_ROADMAPS.slice(0, 12).map((role, index) => (
              <RoadmapCard key={role} title={role} index={index} />
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Link
                to="/paths"
                className="group flex items-center justify-center gap-2 p-5 bg-card border-2 border-dashed border-border rounded-xl hover:border-accent hover:bg-surface/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <span className="text-textSecondary group-hover:text-accent font-semibold text-sm">
                  View All Roadmaps
                </span>
                <ArrowRight className="w-5 h-5 text-textSecondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Skill-Based Roadmaps */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="py-16 border-t border-border bg-surface/30"
      >
        <div className="max-w-layout mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-3">
              Skill-Based Learning Roadmaps
            </h2>
            <p className="text-textSecondary text-lg max-w-2xl mx-auto">
              Master specific technologies and skills with focused learning paths
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SKILL_BASED_ROADMAPS.slice(0, 12).map((skill, index) => (
              <RoadmapCard
                key={skill}
                title={skill}
                isNew={skill === "Shell / Bash" || skill === "Laravel"}
                index={index}
              />
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Link
                to="/paths"
                className="group flex items-center justify-center gap-2 p-5 bg-card border-2 border-dashed border-border rounded-xl hover:border-accent hover:bg-surface/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <span className="text-textSecondary group-hover:text-accent font-semibold text-sm">
                  View All Skills
                </span>
                <ArrowRight className="w-5 h-5 text-textSecondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Guides */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="py-16 border-t border-border"
      >
        <div className="max-w-layout mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-3 flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-accent" />
              Guides
            </h2>
            <p className="text-textSecondary text-lg max-w-2xl mx-auto">
              Comprehensive guides to help you master new skills
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide, index) => (
              <GuideCard key={guide.title} title={guide.title} type={guide.type} index={index} />
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Link
                to="/guide-generator"
                className="group flex items-center justify-center gap-2 p-5 bg-card border-2 border-dashed border-border rounded-xl hover:border-accent hover:bg-surface/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <span className="text-textSecondary group-hover:text-accent font-semibold text-sm">
                  View All Guides
                </span>
                <ArrowRight className="w-5 h-5 text-textSecondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Communities */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="py-16 border-y border-border bg-surface/30"
      >
        <div className="max-w-layout mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-3 flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-accent" />
              Actively Maintained Communities
            </h2>
            <p className="text-textSecondary text-lg max-w-2xl mx-auto">
              Join vibrant communities of learners and experts
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.slice(0, 3).map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <Link
                  to={`/communities?id=${community.id}`}
                  className="group flex items-center gap-3 p-5 bg-card border border-border rounded-xl hover:border-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accentHover flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-textPrimary font-semibold text-sm group-hover:text-accent transition-colors">
                      {community.name}
                    </p>
                    <p className="text-textSecondary text-xs mt-1">
                      {community.subject} · {community.member_count || 0} members
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-textSecondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1 }}
            >
              <Link
                to="/communities"
                className="group flex items-center justify-center gap-2 p-5 bg-card border-2 border-dashed border-border rounded-xl hover:border-accent hover:bg-surface/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <span className="text-textSecondary group-hover:text-accent font-semibold text-sm">
                  View All Communities
                </span>
                <ArrowRight className="w-5 h-5 text-textSecondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

export default Homepage;