import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Video,
  Users,
  Brain,
  Map,
  Star,
  FileText,
  Zap,
  PlayCircle,
} from "lucide-react";
import Footer from "../components/common/Footer.jsx";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import LearningOrbit from "../components/home/LearningOrbit";
import { WorkflowBento } from "../components/home/WorkflowBento";
import { AIFeaturesBento } from "../components/home/AIFeaturesBento";
import "../styles/animations.css";

function Home() {
  return (
    <div className="min-h-screen text-white selection:bg-blue-500/30 relative overflow-x-hidden">
      
      {/* Hero Section - Full Screen with Spline Background */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Spline 3D Animation Background - Absolute inside hero */}
        <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
          <iframe
            src="https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW"
            frameBorder="0"
            width="100%"
            height="100%"
            id="aura-spline"
            title="3D Background Animation"
            style={{ pointerEvents: 'none' }}
          />
        </div>

        {/* Gradient Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent relative" style={{ zIndex: 10 }} />

        {/* Hero Content - Centered */}
        <div className="container mx-auto px-6 py-16 md:py-32 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* AI Badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600/10 border border-blue-500/30 text-xs font-light text-blue-300 backdrop-blur-sm">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-medium text-white">AI</span>
              <span>New: Studio-grade learning in one prompt</span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Compose your
              </span>
              {' '}
              <span className="text-white">
                learning journey in seconds
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-extralight tracking-wide">
              EduVerse turns your goals into personalized roadmaps. Describe your targets—our AI scores, plans and guides you through mastery.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link
                to="/ai-roadmap"
                className="inline-flex items-center justify-center gap-2 bg-white text-black font-light rounded-md px-6 py-3 hover:bg-opacity-90 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Generate Roadmap
              </Link>

              <Link
                to="/videos"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-blue-500/30 rounded-md px-6 py-3 hover:bg-blue-500/10 transition-all text-white font-light"
              >
                <PlayCircle className="w-5 h-5" />
                Watch demo
              </Link>
            </div>
            
            <p className="text-sm text-gray-400 font-extralight">
              No credit card required. Start learning immediately.
            </p>
          </div>

          {/* Gradient Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent my-16" />

          {/* Feature Cards - Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { icon: Map, title: "AI Roadmaps", desc: "Personalized learning paths", to: "/ai-roadmap" },
              { icon: Video, title: "Curated Videos", desc: "Expert-selected content", to: "/videos" },
              { icon: Users, title: "Communities", desc: "Connect with learners", to: "/communities" },
              { icon: Brain, title: "AI Tutor", desc: "24/7 intelligent help", to: "/ai-roadmap" },
            ].map((feature, i) => (
              <Link
                key={i}
                to={feature.to}
                className="group"
              >
                <p className="text-2xl font-light mb-1 tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </p>
                <p className="text-gray-400 font-extralight">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Workflow Bento Grid */}
      <WorkflowBento />

      {/* AI Features Bento Grid */}
      <AIFeaturesBento />

      {/* Featured Paths Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">Featured Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Link to="/ai-roadmap?role=frontend" className="group">
            <div className="space-y-4">
              <div className="h-64 bg-blue-500/10 border border-blue-500/20 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-full flex items-center justify-center">
                  <Brain size={80} className="text-blue-400 group-hover:scale-110 transition-all duration-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-white group-hover:text-blue-400 transition-colors">
                  Frontend Development Roadmap
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Comprehensive guide from basics to advanced React and modern frameworks.
                </p>
              </div>
            </div>
          </Link>

          <Link to="/ai-roadmap?role=backend" className="group">
            <div className="space-y-4">
              <div className="h-64 bg-purple-500/10 border border-purple-500/20 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-full flex items-center justify-center">
                  <Map size={80} className="text-purple-400 group-hover:scale-110 transition-all duration-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-white group-hover:text-purple-400 transition-colors">
                  Backend Engineering Path
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Master server-side development, databases, and scalable architecture.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Guides Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Star, title: "Getting Started", desc: "Your first steps in learning with EduVerse", color: "blue" },
            { icon: FileText, title: "Best Practices", desc: "Tips and tricks for effective learning", color: "purple" },
            { icon: Zap, title: "Quick Wins", desc: "Fast-track your progress with proven techniques", color: "emerald" },
          ].map((guide, i) => (
            <Link
              key={i}
              to="#"
              className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <guide.icon size={32} className={`text-${guide.color}-400 mb-4 transition-colors`} />
              <h3 className="text-xl font-medium text-white mb-2">{guide.title}</h3>
              <p className="text-slate-400 text-sm">{guide.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-12 md:p-20 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight text-white">
              Master any topic,<br />
              accelerate your learning
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              Our AI-powered platform adapts to your learning style, providing
              personalized roadmaps and resources to help you master complex
              topics faster than ever before.
            </p>
            <AnimatedButton
              variant="pulse"
              to="/ai-roadmap"
              icon={ArrowRight}
            >
              Start Learning
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
