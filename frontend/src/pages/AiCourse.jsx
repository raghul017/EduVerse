import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { Play, BookOpen, ChevronDown, ChevronRight, ExternalLink, Clock, FileText, Video } from "lucide-react";
import MultiStepLoader from "../components/ui/MultiStepLoader.jsx";
import PlaceholdersAndVanishInput from "../components/ui/PlaceholdersAndVanishInput.jsx";

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
  const [expandedModule, setExpandedModule] = useState(null);

  const handleGenerate = async (e, topicValue) => {
    // If e is an event object (from form submit), protect it
    if (e && e.preventDefault) e.preventDefault();
    
    // Determine the actual string value to use
    const topicToUse = typeof topicValue === 'string' ? topicValue : topic;
    
    if (!topicToUse?.trim()) return;
    
    setLoading(true);
    setError(null);
    setCourse(null);
    setTopic(topicToUse); // Sync state if triggered via preset
    
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
    <div className="min-h-screen bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {!course ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
                <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
                [ AI COURSE GENERATOR ]
              </div>
              <h1 className="text-[48px] font-bold text-white mb-4 leading-tight">
                AI Course Generator
              </h1>
              <p className="text-[#666] text-[16px] max-w-xl mx-auto">
                Enter a topic to generate a comprehensive course with modules and resources
              </p>
            </div>

            {/* Terminal Input Box */}
            <div className="max-w-[700px] mx-auto mb-12">
              <div className="bg-[#111] border border-[#2a2a2a]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
                  <code className="text-[12px] text-[#555] tracking-wide font-mono">USER@EDUVERSE:~/COURSE</code>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                  </div>
                </div>
                <div className="p-4">
                  <PlaceholdersAndVanishInput
                    placeholders={inputPlaceholders}
                    onChange={(e) => setTopic(e.target.value)}
                    onSubmit={(e, val) => handleGenerate(e, val)}
                  />
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
                  &gt; ERROR: {error}
                </div>
              )}
            </div>

            {/* Quick Select */}
            <div>
              <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ POPULAR_TOPICS</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {presetTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleGenerate(e, t)}
                    className="p-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] transition-all text-left group"
                  >
                    <BookOpen size={18} className="text-[#FF6B35] mb-2" />
                    <div className="text-[13px] font-semibold text-white group-hover:text-[#FF6B35] transition-colors">
                      {t}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Course Display */
          <div>
            {/* Course Header */}
            <div className="mb-8">
              <button 
                onClick={() => setCourse(null)}
                className="text-[#FF6B35] text-[13px] font-mono mb-4 hover:underline"
              >
                ← BACK TO GENERATOR
              </button>
              <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
                <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
                [ GENERATED COURSE ]
              </div>
              <h1 className="text-[40px] font-bold text-white mb-3">{course.title}</h1>
              <p className="text-[#666] text-[15px] max-w-2xl">{course.description}</p>
              
              <div className="flex items-center gap-4 mt-4 text-[12px] text-[#555]">
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {modules.length} modules
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {course.estimated_duration || "Self-paced"}
                </span>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-3">
              <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ COURSE_MODULES</h2>
              {modules.map((module, idx) => (
                <div key={idx} className="bg-[#0f0f0f] border border-[#1f1f1f]">
                  <button
                    onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-[#151515] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#FF6B35] font-mono text-[13px]">{String(idx + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="text-white font-semibold text-[15px]">{module.title}</h3>
                        <p className="text-[#555] text-[13px] mt-1">{module.description}</p>
                      </div>
                    </div>
                    {expandedModule === idx ? (
                      <ChevronDown size={18} className="text-[#555]" />
                    ) : (
                      <ChevronRight size={18} className="text-[#555]" />
                    )}
                  </button>
                  
                  {expandedModule === idx && (
                    <div className="border-t border-[#1f1f1f] p-5 bg-[#0a0a0a]">
                      {/* Lessons / Content */}
                      <div className="space-y-3">
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="flex items-center justify-between p-3 bg-[#111] border border-[#1f1f1f]">
                              <div className="flex items-center gap-3">
                                <span className="text-[#555] font-mono text-[11px]">{idx + 1}.{lIdx + 1}</span>
                                <span className="text-white text-[14px]">{lesson.title || lesson}</span>
                              </div>
                              {lesson.url && (
                                <a 
                                  href={lesson.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#FF6B35] hover:text-[#ff7a4a] flex items-center gap-1 text-[12px] font-mono"
                                >
                                  OPEN <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-[13px] text-[#555] italic">No detailed lessons available for this module.</div>
                        )}
                        
                        {/* Resources Section - Was reported missing */}
                        {module.resources && module.resources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
                            <h4 className="text-[11px] font-mono text-[#555] uppercase tracking-wide mb-3">RESOURCES</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {module.resources.map((res, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-start gap-3 p-3 bg-[#111] border border-[#1f1f1f] hover:border-[#FF6B35] transition-colors group"
                                >
                                  <div className="mt-0.5 text-[#FF6B35]">
                                    {res.type === 'video' ? <Video size={14} /> : <FileText size={14} />}
                                  </div>
                                  <div>
                                    <div className="text-[13px] font-medium text-white group-hover:text-[#FF6B35] transition-colors">
                                      {res.title}
                                    </div>
                                    <div className="text-[11px] text-[#555] mt-1 flex items-center gap-1">
                                      {res.type} <ExternalLink size={10} />
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiCourse;
