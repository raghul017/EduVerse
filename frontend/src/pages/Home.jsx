import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Video, Users, Brain, Map, Star, FileText, Zap, Cloud, BarChart, Layout, Shield } from "lucide-react";

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
                <MapIcon className="w-16 h-16 text-stone-700" />
              </div>
              <h3 className="text-2xl font-serif font-medium flex items-center gap-2">
                AI Roadmaps <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Generate personalized learning paths for any role or skill.
              </p>
            </Link>

            <Link to="/ai-tutor" className="group block space-y-4">
              <div className="h-48 bg-[#dcdad4] rounded-xl flex items-center justify-center group-hover:bg-[#d4d2cc] transition-colors">
                <Brain className="w-16 h-16 text-stone-700" />
              </div>
              <h3 className="text-2xl font-serif font-medium flex items-center gap-2">
                AI Tutor <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Get instant answers and deep explanations for any topic.
              </p>
            </Link>

            <Link to="/communities" className="group block space-y-4">
              <div className="h-48 bg-[#dcdad4] rounded-xl flex items-center justify-center group-hover:bg-[#d4d2cc] transition-colors">
                <Users className="w-16 h-16 text-stone-700" />
              </div>
              <h3 className="text-2xl font-serif font-medium flex items-center gap-2">
                Communities <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Connect with other learners and share your progress.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section (Anthropic Style) */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-serif font-medium mb-6">Featured</h2>
          </div>
          <div className="lg:col-span-8 space-y-8">
            {[
              { title: "Introducing EduVerse 2.0", category: "Announcements", date: "Oct 15, 2025" },
              { title: "The Future of AI Learning", category: "Research", date: "Sep 29, 2025" },
              { title: "Community Guidelines Update", category: "Policy", date: "Sep 15, 2025" },
              { title: "New AI Tutor Capabilities", category: "Product", date: "Aug 05, 2025" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-stone-200 group cursor-pointer">
                <h3 className="text-lg font-medium group-hover:text-stone-600 transition-colors">{item.title}</h3>
                <div className="flex items-center gap-8 text-sm text-stone-500">
                  <span className="hidden md:block">{item.category}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-4xl font-serif font-medium mb-12">Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Full Stack Developer Guide", icon: Zap },
            { title: "DevOps Engineering Handbook", icon: Cloud },
            { title: "Data Science Fundamentals", icon: BarChart },
            { title: "Machine Learning Basics", icon: Brain },
            { title: "System Design Primer", icon: Layout },
            { title: "Cybersecurity Essentials", icon: Shield },
          ].map((guide, i) => (
            <Link key={i} to="/ai-roadmap" className="group p-6 bg-white border border-stone-200 rounded-xl hover:border-stone-800 transition-all hover:shadow-md flex items-center gap-4">
              <div className="p-3 bg-stone-50 rounded-lg group-hover:bg-stone-100 transition-colors">
                <guide.icon size={24} className="text-stone-700" />
              </div>
              <span className="font-bold text-stone-900 group-hover:text-stone-700 transition-colors">{guide.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* "Understand Any Topic" Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-[#fbf7f1]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="relative p-12 md:p-24 max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-serif font-medium mb-8 leading-tight">
              Understand <br />
              <span className="text-yellow-500">any topic</span> deeply
            </h2>
            <p className="text-xl text-stone-300 mb-12 leading-relaxed">
              We're building tools to help you understand how concepts connect. 
              Our roadmap generator visualizes the knowledge graph of any topic.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[#fbf7f1] text-stone-900 rounded-lg font-bold hover:bg-white transition-colors">
                See open roles
              </button>
              <button className="px-6 py-3 border border-stone-500 text-[#fbf7f1] rounded-lg font-bold hover:bg-stone-800 transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MapIcon({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
      <path d="M9 4v13" />
      <path d="M15 7v13" />
    </svg>
  );
}

export default Home;
