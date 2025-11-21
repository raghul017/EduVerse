import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Map, Play, Users, Brain, Flame, ArrowRight } from "lucide-react";

function Home() {
  const features = [
    {
      icon: Map,
      title: "AI Roadmaps",
      description: "Get personalized learning paths powered by AI for any tech role or skill",
      link: "/ai-roadmap",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Play,
      title: "Learning Videos",
      description: "Explore educational content from our community of creators",
      link: "/videos",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Users,
      title: "Communities",
      description: "Join communities and connect with learners sharing your interests",
      link: "/communities",
      color: "from-green-400 to-teal-500"
    },
    {
      icon: Brain,
      title: "AI Tutor",
      description: "Get instant answers and explanations for any learning topic",
      link: "/ai-tutor",
      color: "from-purple-400 to-pink-500"
    },
  ];

  const steps = [
    "Choose a learning roadmap or browse videos",
    "Follow the structured path or explore freely",
    "Join communities to connect with peers",
    "Track your progress and stay motivated"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-void text-white text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> AI-Powered Learning Platform
          </div>
          
          <h1 className="text-6xl md:text-7xl font-heading font-bold text-textPrimary mb-6 leading-tight">
            Master Any Skill with
            <br />
            <span className="bg-gradient-to-r from-void to-accent bg-clip-text text-transparent">
              EduVerse
            </span>
          </h1>
          
          <p className="text-xl text-textSecondary max-w-3xl mx-auto mb-10 leading-relaxed">
            Your AI-powered learning companion. Get personalized roadmaps, explore quality content, and connect with a community of learners.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/ai-roadmap"
              className="px-8 py-4 bg-void hover:bg-black text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Start Learning <ArrowRight size={20} />
            </Link>
            <Link
              to="/videos"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-textPrimary rounded-xl font-bold border-2 border-border transition-all"
            >
              Browse Videos
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold text-textPrimary mb-12 text-center">
          Everything You Need to Learn
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={feature.link}
                className="group block p-8 bg-white border-2 border-border rounded-xl hover:border-void hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-textPrimary mb-2 group-hover:text-void transition-colors">
                  {feature.title}
                </h3>
                <p className="text-textSecondary leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-void font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={18} className="ml-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-void to-black rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-heading font-bold mb-4 flex items-center gap-3">
            <Flame size={32} className="text-yellow-400" />
            How EduVerse Works
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Your journey to mastery in 4 simple steps:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-white/90 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-heading font-bold text-textPrimary mb-6">
          Ready to Start Learning?
        </h2>
        <p className="text-textSecondary text-lg mb-8">
          Choose your first roadmap and begin your journey today
        </p>
        <Link
          to="/ai-roadmap"
          className="inline-flex items-center gap-2 px-10 py-5 bg-void hover:bg-black text-white rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl"
        >
         <Sparkles size={24} /> Generate My Roadmap
        </Link>
      </div>
    </div>
  );
}

export default Home;
