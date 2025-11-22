import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Video, Users, Brain, Map, Star, FileText, Zap, Cloud, BarChart, Layout, Shield } from "lucide-react";
import Footer from "../components/common/Footer.jsx";

function Home() {
  return (
    <div className="min-h-screen bg-[#fbf7f1] text-stone-900 font-sans selection:bg-stone-200">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-medium leading-[0.95] tracking-tight mb-12">
            Master your <span className="italic">future</span> with <br />
            <span className="underline decoration-2 decoration-stone-300 underline-offset-8">AI-powered</span> learning <br />
            paths for everyone
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-600 max-w-2xl leading-relaxed mb-12">
            EduVerse provides personalized roadmaps, intelligent tutoring, and a supportive community to help you master any skill efficiently.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/ai-roadmap"
              className="px-8 py-4 bg-stone-900 text-[#fbf7f1] rounded-lg font-medium text-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
              <Sparkles size={20} />
              Generate Roadmap
            </Link>
            <Link
              to="/videos"
              className="px-8 py-4 bg-white border border-stone-200 text-stone-900 rounded-lg font-medium text-lg hover:bg-stone-50 transition-colors flex items-center gap-2"
            >
              <Video size={20} />
              Browse Content
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-[#e6e4dd] rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/ai-roadmap" className="group block space-y-4">
              <div className="h-48 bg-[#dcdad4] rounded-xl flex items-center justify-center group-hover:bg-[#d4d2cc] transition-colors">
                <Map size={64} className="text-stone-600" />
              </div>
              <h3 className="text-2xl font-serif font-medium">AI-Generated Roadmaps</h3>
              <p className="text-stone-600 leading-relaxed">Personalized learning paths tailored to your goals and experience level.</p>
            </Link>

            <Link to="/videos" className="group block space-y-4">
              <div className="h-48 bg-[#dcdad4] rounded-xl flex items-center justify-center group-hover:bg-[#d4d2cc] transition-colors">
                <Video size={64} className="text-stone-600" />
              </div>
              <h3 className="text-2xl font-serif font-medium">Curated Videos</h3>
              <p className="text-stone-600 leading-relaxed">Expert-selected educational content to accelerate your learning journey.</p>
            </Link>

            <Link to="/communities" className="group block space-y-4">
              <div className="h-48 bg-[#dcdad4] rounded-xl flex items-center justify-center group-hover:bg-[#d4d2cc] transition-colors">
                <Users size={64} className="text-stone-600" />
              </div>
              <h3 className="text-2xl font-serif font-medium">Learning Communities</h3>
              <p className="text-stone-600 leading-relaxed">Connect with fellow learners and share your progress together.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-8">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Link to="/ai-roadmap?role=frontend" className="group">
            <div className="space-y-4">
              <div className="h-64 bg-stone-200 rounded-2xl overflow-hidden">
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-100">
                  <Brain size={80} className="text-stone-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-medium group-hover:text-stone-600 transition-colors">Frontend Development Roadmap</h3>
                <p className="text-stone-500 leading-relaxed">Comprehensive guide from basics to advanced React and modern frameworks.</p>
              </div>
            </div>
          </Link>

          <Link to="/ai-roadmap?role=backend" className="group">
            <div className="space-y-4">
              <div className="h-64 bg-stone-200 rounded-2xl overflow-hidden">
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-100">
                  <Layout size={80} className="text-stone-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-medium group-hover:text-stone-600 transition-colors">Backend Engineering Path</h3>
                <p className="text-stone-500 leading-relaxed">Master server-side development, databases, and scalable architecture.</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Guides Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-8">Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Star, title: "Getting Started", desc: "Your first steps in learning with EduVerse" },
            { icon: FileText, title: "Best Practices", desc: "Tips and tricks for effective learning" },
            { icon: Zap, title: "Quick Wins", desc: "Fast-track your progress with proven techniques" },
          ].map((guide, i) => (
            <Link 
              key={i}
              to="#"
              className="group p-8 bg-white border border-stone-200 rounded-2xl hover:border-stone-300 hover:shadow-lg transition-all"
            >
              <guide.icon size={32} className="text-stone-600 mb-4" />
              <h3 className="text-xl font-serif font-medium mb-2">{guide.title}</h3>
              <p className="text-stone-500 text-sm">{guide.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Understand Any Topic Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-stone-100 rounded-3xl p-12 md:p-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 leading-tight">
              Understand any topic, accelerate your learning
            </h2>
            <p className="text-xl text-stone-600 leading-relaxed mb-8">
              Our AI-powered platform adapts to your learning style, providing personalized roadmaps and resources to help you master complex topics faster than ever before.
            </p>
            <Link
              to="/ai-roadmap"
              className="inline-flex items-center gap-2 text-stone-900 font-medium text-lg group"
            >
              Start Learning <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
