import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Video, Users, Brain } from "lucide-react";

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
            AI <span className="italic">research</span> and <br />
            <span className="underline decoration-2 decoration-stone-300 underline-offset-8">products</span> that put <br />
            safety at the frontier
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-600 max-w-2xl leading-relaxed mb-12">
            EduVerse is a public benefit corporation dedicated to securing the benefits of AI for everyone through personalized learning paths.
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

      {/* Feature Grid (Anthropic Style) */}
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

      {/* "Reading the mind of an AI" Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-[#fbf7f1]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="relative p-12 md:p-24 max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-serif font-medium mb-8 leading-tight">
              Reading the <br />
              <span className="text-yellow-500">mind</span> of an AI
            </h2>
            <p className="text-xl text-stone-300 mb-12 leading-relaxed">
              We're building tools to help you understand how AI models think and learn. 
              Our roadmap generator visualizes the knowledge graph of any topic.
            </p>
            <Link
              to="/ai-roadmap"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#fbf7f1] text-stone-900 rounded-lg font-medium hover:bg-white transition-colors"
            >
              <BookOpen size={20} />
              Read the Research
            </Link>
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
