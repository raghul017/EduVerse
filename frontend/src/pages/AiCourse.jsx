import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { 
  Play, BookOpen, ChevronDown, ChevronRight, ExternalLink, 
  Clock, FileText, Video, Sparkles, MonitorPlay, 
  ArrowLeft, Share2, MoreVertical, Link as LinkIcon, Home 
} from "lucide-react";
import MultiStepLoader from "../components/ui/MultiStepLoader.jsx";
import PlaceholdersAndVanishInput from "../components/ui/PlaceholdersAndVanishInput.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const courseLoadingStates = [
  { text: "Analyzing your topic..." },
  { text: "Structuring content..." },
  { text: "Creating modules..." },
  { text: "Finalizing course..." },
];

const presetTopics = [
  "Frontend Development", "Backend Development", "Fullstack Web",
  "Data Science", "Machine Learning", "Mobile Development"
];

const inputPlaceholders = [
  "Learn React from scratch...",
  "Master Python for Data Science...",
  "Become a DevOps Engineer...",
  "Understanding Blockchain...",
  "Intro to System Design..."
];

function AiCourse() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedModule, setExpandedModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (course?.modules?.[0]?.lessons?.[0]) {
      setActiveLesson(course.modules[0].lessons[0]);
    }
  }, [course]);

  const handleGenerate = async (e, topicValue) => {
    if (e && e.preventDefault) e.preventDefault();
    const topicToUse = typeof topicValue === 'string' ? topicValue : topic;
    
    if (!topicToUse?.trim()) return;
    
    setLoading(true);
    setError(null);
    setCourse(null);
    setTopic(topicToUse);
    
    try {
      const { data } = await api.post("/paths/ai-course", { topic: topicToUse });
      setCourse(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "AI service is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const modules = course?.modules || [];

  if (loading) {
    return (
      <MultiStepLoader 
        loadingStates={courseLoadingStates} 
        loading={loading} 
        duration={1000}
        loop={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-haffer text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#A1FF62]/5 to-transparent pointer-events-none" />

      {/* Home Navigation Button (Absolute Top Left) */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 p-2 bg-[#1a1a1a] border border-white/10 rounded-full hover:bg-white/10 hover:border-[#A1FF62]/50 transition-all group"
        title="Go Home"
      >
        <Home size={20} className="text-gray-400 group-hover:text-[#A1FF62] transition-colors" />
      </button>
      
      {!course ? (
        <div className="relative z-10 container mx-auto px-6 py-20 min-h-screen flex flex-col items-center justify-center">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 relative"
          >
            <div className="inline-flex items-center gap-2 text-[11px] text-[#A1FF62] mb-6 tracking-[0.2em] font-mono uppercase bg-[#A1FF62]/10 px-4 py-1.5 rounded-full border border-[#A1FF62]/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#A1FF62] rounded-full animate-pulse shadow-[0_0_10px_rgba(161,255,98,0.5)]"></span>
              AI COURSE GENERATOR
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Master any skill<br />
              <span className="text-[#888]">in minutes.</span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
              Generate comprehensive, structured courses with theory, articles, and resources instantly.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-2xl mb-20"
          >
             <div className="p-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent">
              <div className="bg-[#111] rounded-[28px] overflow-hidden border border-white/5 p-6">
                 <PlaceholdersAndVanishInput
                   placeholders={inputPlaceholders}
                   onChange={(e) => setTopic(e.target.value)}
                   onSubmit={(e, val) => handleGenerate(e, val)}
                 />
              </div>
             </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono rounded-xl flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                ERROR: {error}
              </div>
            )}
          </motion.div>

          {/* Preset Topics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
               <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/10"></div>
               <h2 className="text-[12px] font-mono text-[#666] tracking-[0.2em]">POPULAR TOPICS</h2>
               <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/10"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {presetTopics.map((t, i) => (
                <SpotlightCard
                  key={i}
                  as="button"
                  onClick={(e) => handleGenerate(e, t)}
                  className="group !bg-[#111] border-white/5 hover:border-[#A1FF62]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#A1FF62]/10 flex items-center justify-center group-hover:bg-[#A1FF62]/20 transition-colors">
                      <Sparkles size={14} className="text-[#A1FF62]" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-400 group-hover:text-white transition-colors">{t}</span>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        /* Course Layout */
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Syllabus */}
          <div className="w-[350px] flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full z-20">
             {/* Sidebar Header */}
             <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => setCourse(null)}
                    className="text-[12px] text-gray-500 hover:text-white flex items-center gap-2 transition-colors group px-3 py-1.5 rounded-full hover:bg-white/5"
                  >
                     <ArrowLeft size={14} className="text-[#A1FF62] group-hover:-translate-x-1 transition-transform" />
                     <span className="font-mono tracking-wide">RETURN</span>
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="p-1.5 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                  >
                    <Home size={16} />
                  </button>
                </div>
                
                <h1 className="text-xl font-bold text-white leading-tight mb-2">{course.title}</h1>
                <div className="flex items-center gap-3">
                   <div className="px-2 py-0.5 bg-[#A1FF62]/10 border border-[#A1FF62]/20 rounded text-[10px] text-[#A1FF62] font-mono tracking-wider">
                     AI GENERATED
                   </div>
                   <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-mono tracking-wider flex items-center gap-1">
                     <Clock size={10} /> {course.estimated_duration || "SELF-PACED"}
                   </div>
                </div>
             </div>

             {/* Module List */}
             <div className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
                {modules.map((module, idx) => (
                   <div key={idx} className="rounded-xl overflow-hidden border border-white/5 bg-[#111]">
                      <button
                        onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                        className={`w-full p-4 flex items-start text-left transition-colors ${expandedModule === idx ? 'bg-white/5' : 'hover:bg-white/5'}`}
                      >
                         <div className="mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center bg-[#A1FF62]/10 text-[10px] font-mono text-[#A1FF62]">
                            {idx + 1}
                         </div>
                         <div className="flex-1">
                            <h3 className={`text-[13px] font-bold transition-colors ${expandedModule === idx ? 'text-white' : 'text-gray-400'}`}>
                               {module.title}
                            </h3>
                         </div>
                         <ChevronDown size={14} className={`text-gray-600 transition-transform duration-300 ${expandedModule === idx ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {expandedModule === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#0f0f0f]"
                          >
                             <div className="p-2 space-y-1">
                                {module.lessons?.map((lesson, lIdx) => (
                                   <button
                                     key={lIdx}
                                     onClick={() => setActiveLesson(lesson)}
                                     className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                                        activeLesson === lesson 
                                          ? 'bg-[#A1FF62] text-black shadow-[0_0_20px_rgba(161,255,98,0.3)]' 
                                          : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                     }`}
                                   >
                                      {activeLesson === lesson ? (
                                        <Play size={10} fill="currentColor" />
                                      ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                      )}
                                      <span className="text-[12px] font-medium line-clamp-1">
                                         {lesson.title || lesson}
                                      </span>
                                   </button>
                                ))}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                ))}
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full bg-[#050505] relative overflow-hidden">
             {/* Content Header */}
             <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-mono text-sm uppercase tracking-wide">
                     MODULE {modules.findIndex(m => m.lessons.includes(activeLesson)) + 1} / LESSON
                  </span>
                  <div className="h-4 w-px bg-white/10" />
                  <h2 className="text-white font-bold text-sm truncate max-w-md">
                    {activeLesson?.title || "Select a lesson"}
                  </h2>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-2">
                      <Share2 size={12} /> Share
                   </button>
                </div>
             </div>

             {/* Content Scroll Area */}
             <div className="flex-1 overflow-y-auto p-8">
               {activeLesson ? (
                 <div className="max-w-5xl mx-auto space-y-8 pb-20">
                   
                   {/* Theory Section */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-8 h-8 rounded-full bg-[#A1FF62]/10 flex items-center justify-center">
                            <BookOpen size={16} className="text-[#A1FF62]" />
                         </div>
                         <h3 className="text-lg font-bold text-white">Theory & Concepts</h3>
                      </div>
                      <SpotlightCard className="!bg-[#111] border-white/5 p-8 min-h-[200px]">
                         <article className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-strong:text-[#A1FF62] prose-ul:text-gray-400 hover:prose-a:text-[#A1FF62] max-w-none">
                            {activeLesson.theory ? (
                              <ReactMarkdown>{activeLesson.theory}</ReactMarkdown>
                            ) : (
                               <div className="text-gray-500 italic">
                                 <p className="mb-4">Content is generating...</p>
                                 <p>{activeLesson.description || "Select a lesson to view its content."}</p>
                               </div>
                            )}
                         </article>
                      </SpotlightCard>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                     {/* Articles Section */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <FileText size={16} className="text-blue-400" />
                           </div>
                           <h3 className="text-lg font-bold text-white">Recommended Articles</h3>
                        </div>
                        <div className="space-y-3">
                           {activeLesson.articles && activeLesson.articles.length > 0 ? (
                             activeLesson.articles.map((article, i) => (
                               <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                                 <SpotlightCard className="!bg-[#111] border-white/5 p-4 group cursor-pointer hover:border-blue-500/30 transition-colors">
                                    <div className="flex justify-between items-start gap-4">
                                       <div>
                                          <h5 className="font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">
                                            {article.title}
                                          </h5>
                                          <p className="text-[12px] text-gray-500">{article.platform || "Article"} • Read Now</p>
                                       </div>
                                       <ExternalLink size={14} className="text-gray-600 group-hover:text-blue-400" />
                                    </div>
                                 </SpotlightCard>
                               </a>
                             ))
                           ) : (
                             // Fallback if no articles
                             <SpotlightCard className="!bg-[#111] border-white/5 p-4 opacity-50">
                                <p className="text-sm text-gray-500">No specific articles found for this lesson.</p>
                             </SpotlightCard>
                           )}
                        </div>
                     </div>

                     {/* Links/Resources Section */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <LinkIcon size={16} className="text-purple-400" />
                           </div>
                           <h3 className="text-lg font-bold text-white">Useful Links</h3>
                        </div>
                        <div className="space-y-3">
                           {activeLesson.links && activeLesson.links.length > 0 ? (
                             activeLesson.links.map((link, i) => (
                               <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                                 <SpotlightCard className="!bg-[#111] border-white/5 p-4 group cursor-pointer hover:border-purple-500/30 transition-colors">
                                      <div className="flex justify-between items-start gap-4">
                                         <div>
                                            <h5 className="font-bold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors">
                                              {link.title}
                                            </h5>
                                            <p className="text-[12px] text-gray-500">Resource</p>
                                         </div>
                                         <ExternalLink size={14} className="text-gray-600 group-hover:text-purple-400" />
                                      </div>
                                 </SpotlightCard>
                               </a>
                             ))
                           ) : (
                             <SpotlightCard className="!bg-[#111] border-white/5 p-4 group cursor-pointer hover:border-purple-500/30 transition-colors">
                                <div className="flex justify-between items-start gap-4">
                                   <div>
                                      <h5 className="font-bold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors">
                                        Search on Google
                                      </h5>
                                      <p className="text-[12px] text-gray-500">Find more resources</p>
                                   </div>
                                   <ExternalLink size={14} className="text-gray-600 group-hover:text-purple-400" />
                                </div>
                             </SpotlightCard>
                           )}
                        </div>
                     </div>
                   </div>

                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center pb-20">
                    <div className="w-20 h-20 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-6">
                       <MonitorPlay size={32} className="text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Learn?</h3>
                    <p className="text-gray-500 max-w-md">Select a lesson from the syllabus sidebar to access the course content.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiCourse;
