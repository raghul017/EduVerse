
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  CheckCircle,
  Circle,
  ExternalLink,
  Video,
  FileText,
  Code,
  Sparkles,
  Loader2,
  Send,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import PlaceholdersAndVanishInput from "../components/ui/PlaceholdersAndVanishInput";
import { aiGenerate } from "../utils/api.js";
import api from "../utils/api.js";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import MultiStepLoader from "../components/ui/MultiStepLoader.jsx";

// Loading states for generating NEW roadmaps
const generatingStates = [
  { text: "Analyzing topic requirements..." },
  { text: "Building learning modules..." },
  { text: "Curating resources..." },
  { text: "Finalizing roadmap..." },
];

// Loading states for CACHED/retrieved roadmaps
const retrievingStates = [
  { text: "Retrieving from database..." },
];

// Memoized Node Card component to prevent unnecessary re-renders
const NodeCard = memo(function NodeCard({ 
  node, 
  isCompleted, 
  isSelected, 
  onNodeClick, 
  onToggleComplete,
  nodeIndex 
}) {
  return (
    <div
      onClick={() => onNodeClick(node)}
      className={`w-full bg-[#0f0f0f] p-5 border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
        isSelected
          ? "border-[#FF6B35] shadow-[0_0_30px_-10px_rgba(255,107,53,0.3)] bg-[#FF6B35]/5"
          : isCompleted
          ? "border-green-500/50 bg-green-500/5"
          : "border-[#2a2a2a] hover:border-[#FF6B35] hover:bg-[#161616]"
      }`}
      style={{ animationDelay: `${nodeIndex * 50}ms` }}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      {/* Progress Indicator */}
      <div className="absolute top-3 right-3 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(node.id);
          }}
          className={`p-1.5 rounded-none transition-all duration-200 cursor-pointer relative z-50 ${
            isCompleted
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 scale-110"
              : "bg-white/10 text-slate-500 hover:bg-white/20 hover:scale-110"
          }`}
        >
          {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
        </button>
      </div>

      <h3 className={`font-bold text-lg mb-2 pr-8 relative z-10 ${
        isCompleted ? "text-green-400" : "text-white"
      }`}>
        {node.label}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 relative z-10">
        {node.details}
      </p>
    </div>
  );
});

// Memoized Loading Step component
const LoadingStep = memo(function LoadingStep({ label, delay }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`flex items-center gap-4 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
      <div className={`w-2 h-2 rounded-full ${visible ? 'bg-[#FF6B35] shadow-[0_0_10px_#FF6B35]' : 'bg-[#333]'}`} />
      <span className={`text-[13px] font-mono tracking-wide ${visible ? 'text-white' : 'text-[#666]'}`}>{label}</span>
    </div>
  );
});

function RoadmapGenerator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState("resources");
  const [resources, setResources] = useState(null);
  const [nodeResources, setNodeResources] = useState({});
  const [loadingResources, setLoadingResources] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [roadmapId, setRoadmapId] = useState(null);
  const [completedNodes, setCompletedNodes] = useState({});
  const roadmapRef = useRef(null);
  const chatEndRef = useRef(null);
  const hasGeneratedRef = useRef(false);

  // Auto-generate roadmap when role query parameter is present
  useEffect(() => {
    const roleParam = searchParams.get("role");
    const detailParam = searchParams.get("detail") || "standard";
    if (roleParam && !hasGeneratedRef.current) {
      setTopic(roleParam);
      hasGeneratedRef.current = true;
      generateRoadmap(roleParam, false, detailParam);
    }
  }, [searchParams]);



  useEffect(() => {
    if (activeTab === "chat" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatMessages.length, activeTab]);

  const handleSendMessage = async (text) => {
    // If text is event object (from keypress) or undefined, use chatInput
    const messageContent = (typeof text === 'string' ? text : chatInput);
    
    if (!messageContent?.trim() || isChatLoading || !selectedNode) return;

    const userMessage = { role: "user", content: messageContent };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await api.post("/paths/ai-chat", {
        message: userMessage.content,
        context: `Topic: ${selectedNode?.label || "General"}. Details: ${selectedNode?.details || ""}`,
      });

      if (response.data.response) {
        console.log("[Chat] Received response:", response.data.response);
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.response },
        ]);
      } else {
        console.warn("[Chat] Empty response received");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't generate a response. Please try again." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const generateRoadmap = async (topicToGenerate, forceRegenerate = false, detailLevel = "standard") => {
    if (!topicToGenerate?.trim()) return;
    
    // Reset the flag when force regenerating
    if (forceRegenerate) {
      hasGeneratedRef.current = false;
    }
    setLoading(true);
    setIsFromCache(false);
    setError(null);
    setRoadmap(null);
    setCompletedNodes({});
    
    const startTime = Date.now();
    
    try {
      const data = await aiGenerate("roadmap", {
        topic: topicToGenerate,
        answerQuestions: false,
        forceRegenerate,
        detailLevel,
      });

      console.log("[Frontend API] AI roadmap response:", data);
      
      // Check if response was from cache (fast response = cached)
      const elapsed = Date.now() - startTime;
      const isCached = data?.fromCache || elapsed < 500;
      setIsFromCache(isCached);
      
      if (isCached) {
        // Brief delay for cached to show "Retrieving" message
        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        // For new generation, show animation for at least 4 seconds
        const minLoadingTime = 4000;
        if (elapsed < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
        }
      }

      if (data && data.stages) {
        setRoadmap(data);
        if (data.roadmapId) {
          setRoadmapId(data.roadmapId);
          await loadProgress(data.roadmapId);
        } else {
          console.warn("No roadmapId returned from backend. Database might be offline.");
        }
      } else {
        throw new Error("Invalid roadmap data received. Please try again.");
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setError(error.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load progress from backend
  const loadProgress = async (id) => {
    if (!id) {
      console.warn("[Progress] loadProgress called without roadmapId");
      return;
    }
    console.log("[Progress] Loading progress for roadmapId:", id);
    try {
      const response = await api.get(`/paths/roadmap/${id}/progress`);
      console.log("[Progress] Loaded progress data:", response.data);
      const progressData = {};
      response.data.data.forEach((item) => {
        progressData[item.node_id] = item.completed;
      });
      setCompletedNodes(progressData);
      console.log("[Progress] Set completed nodes:", progressData);
    } catch (error) {
      console.error("[Progress] Error loading progress:", error.response?.data || error.message);
    }
  };

  // Toggle node completion and save to backend
  const toggleNodeCompletion = async (nodeId) => {
    // Optimistic update
    const newCompleted = !completedNodes[nodeId];
    setCompletedNodes(prev => ({ ...prev, [nodeId]: newCompleted }));
    
    console.log("[Progress] Toggling node:", nodeId, "to", newCompleted);
    console.log("[Progress] Current roadmapId:", roadmapId);
    
    if (roadmapId) {
      try {
        const response = await api.post("/paths/roadmap/progress", {
          roadmapId,
          nodeId,
          completed: newCompleted,
        });
        console.log("[Progress] Saved successfully:", response.data);
      } catch (error) {
        console.error("[Progress] Error saving progress:", error.response?.data || error.message);
        // Revert on error
        setCompletedNodes(prev => ({ ...prev, [nodeId]: !newCompleted }));
        alert("Failed to save progress to database. Please check your connection.");
      }
    } else {
      const token = localStorage.getItem("eduverse_token");
      if (!token) {
        alert("Please login to save your progress.");
      } else {
        console.warn("[Progress] No roadmapId - progress not saved! (Is the roadmap generated?)");
        alert("Cannot save progress: Roadmap was not saved to database. Please try regenerating.");
      }
    }
  };

  const generateNodeResources = async (node) => {
    if (nodeResources[node.id]) {
      return; // Already have resources for this node
    }

    setLoadingResources(true);
    try {
      console.log("Fetching resources for:", node.label);
      const response = await api.post("/paths/ai-resources", {
        topic: node.label,
        context: node.details || "",
      });

      console.log("Resources response:", response.data);

      const resources = {
        freeResources:
          response.data.resources || response.data.freeResources || [],
        premiumResources: response.data.premiumResources || [],
        description: response.data.description || node.details,
      };

      setNodeResources((prev) => ({
        ...prev,
        [node.id]: resources,
      }));
    } catch (err) {
      console.error("Failed to generate resources:", err);
      
      // Fallback resources with working search URLs
      const searchQuery = encodeURIComponent(node.label);
      setNodeResources((prev) => ({
        ...prev,
        [node.id]: {
          description:
            node.details || `Learn ${node.label} to enhance your skills.`,
          freeResources: [
            {
              type: "article",
              title: `${node.label} Documentation`,
              platform: "MDN Web Docs",
              url: `https://developer.mozilla.org/en-US/search?q=${searchQuery}`,
            },
            {
              type: "video",
              title: `${node.label} Tutorial`,
              platform: "YouTube",
              url: `https://www.youtube.com/results?search_query=${searchQuery}+tutorial`,
            },
          ],
          premiumResources: [],
        },
      }));
    } finally {
      setLoadingResources(false);
    }
  };

  const handleNodeClick = async (node) => {
    setSelectedNode(node);
    if (!nodeResources[node.id]) {
      await generateNodeResources(node);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const content = JSON.stringify(roadmap, null, 2);
    const file = new Blob([content], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${topic}-roadmap.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerate = () => {
    if (confirm("Are you sure you want to generate a new roadmap? Current progress will be lost if not saved.")) {
      generateRoadmap(topic, true);
    }
  };

  const stages = roadmap?.stages || [];

  if (loading) {
    return (
      <MultiStepLoader 
        loadingStates={isFromCache ? retrievingStates : generatingStates} 
        loading={loading} 
        duration={isFromCache ? 500 : 1000}
        loop={false}
      />
    );
  }



  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-white/5 p-8  shadow-xl text-center max-w-md w-full border-l-4 border-red-500  border-y border-r border-white/10">
          <div className="w-16 h-16 bg-red-500/10 rounded-none flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Generation Failed</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/ai-roadmap")}
              className="px-4 py-2 text-slate-300 bg-white/5 hover:bg-white/10 rounded-none transition-colors btn-beam border border-white/10"
            >
              Go Back
            </button>
            <button
              onClick={() => generateRoadmap(topic)}
              className="px-4 py-2 bg-[#FF6B35] text-white rounded-none hover:bg-[#ff7a4a] transition-colors flex items-center gap-2 btn-beam"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return null;
  }

  return (
      /* Main Content Area */
      <div className="w-full flex overflow-hidden relative bg-[#0a0a0a] min-h-[calc(100vh-70px)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        
        {/* Resources Sidebar - Slides in from right when node is selected */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-[70px] bottom-0 w-full md:w-[28rem] bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-[#FF6B35]/20 shadow-[-20px_0_50px_0px_rgba(0,0,0,0.5)] z-40 overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-[#2a2a2a] bg-[#111]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-white font-mono uppercase tracking-tight">{selectedNode.label}</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 text-[#555] hover:text-[#FF6B35] hover:bg-[#1a1a1a] transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`px-4 py-2 font-mono text-[12px] uppercase tracking-wider transition-all border ${
                      activeTab === "resources"
                        ? "bg-[#FF6B35] text-black border-[#FF6B35] font-bold"
                        : "bg-transparent text-[#555] border-[#2a2a2a] hover:border-[#444] hover:text-white"
                    }`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`px-4 py-2 font-mono text-[12px] uppercase tracking-wider transition-all border ${
                      activeTab === "chat"
                        ? "bg-[#FF6B35] text-black border-[#FF6B35] font-bold"
                        : "bg-transparent text-[#555] border-[#2a2a2a] hover:border-[#444] hover:text-white"
                    }`}
                  >
                    AI Chat
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="h-[calc(100%-180px)] overflow-y-auto bg-[#0a0a0a]">
                {activeTab === "resources" && (
                  <div className="p-6 space-y-6">
                    {loadingResources ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin mb-4" />
                        <p className="text-[#555] text-[13px] font-mono">LOADING_RESOURCES...</p>
                      </div>
                    ) : nodeResources[selectedNode.id] ? (
                      <>
                        {/* Description */}
                        {nodeResources[selectedNode.id].description && (
                          <div className="bg-[#111] border border-[#2a2a2a] p-4">
                            <p className="text-[13px] text-[#999] leading-relaxed font-mono">
                              {nodeResources[selectedNode.id].description}
                            </p>
                          </div>
                        )}

                        {/* Free Resources */}
                        {nodeResources[selectedNode.id].freeResources?.length > 0 && (
                          <div>
                            <h4 className="font-bold text-[#FF6B35] mb-3 flex items-center gap-2 text-[12px] font-mono uppercase tracking-wide">
                              <BookOpen size={14} />
                              Free Resources
                            </h4>
                            <div className="space-y-3">
                              {nodeResources[selectedNode.id].freeResources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-4 bg-[#111] border border-[#2a2a2a] hover:border-[#FF6B35] transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        {resource.type === "video" && <Video size={14} className="text-[#FF6B35]" />}
                                        {resource.type === "article" && <FileText size={14} className="text-[#FF6B35]" />}
                                        {resource.type === "course" && <Code size={14} className="text-[#FF6B35]" />}
                                        <h5 className="font-medium text-white text-[13px] group-hover:text-[#FF6B35] transition-colors">
                                          {resource.title}
                                        </h5>
                                      </div>
                                      <p className="text-[11px] text-[#555] font-mono uppercase">{resource.platform}</p>
                                    </div>
                                    <ExternalLink size={14} className="text-[#444] group-hover:text-[#FF6B35] transition-colors flex-shrink-0" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Premium Resources */}
                        {nodeResources[selectedNode.id].premiumResources?.length > 0 && (
                          <div>
                            <h4 className="font-bold text-[#FF6B35] mb-3 flex items-center gap-2 text-[12px] font-mono uppercase tracking-wide">
                              <Sparkles size={14} />
                              Premium Resources
                            </h4>
                            <div className="space-y-3">
                              {nodeResources[selectedNode.id].premiumResources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-4 bg-[#111] border border-[#2a2a2a] hover:border-[#FF6B35] transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        {resource.type === "video" && <Video size={14} className="text-[#FF6B35]" />}
                                        {resource.type === "article" && <FileText size={14} className="text-[#FF6B35]" />}
                                        {resource.type === "course" && <Code size={14} className="text-[#FF6B35]" />}
                                        <h5 className="font-medium text-white text-[13px] group-hover:text-[#FF6B35] transition-colors">
                                          {resource.title}
                                        </h5>
                                      </div>
                                      <p className="text-[11px] text-[#555] font-mono uppercase">{resource.platform}</p>
                                    </div>
                                    <ExternalLink size={14} className="text-[#444] group-hover:text-[#FF6B35] transition-colors flex-shrink-0" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="w-12 h-12 text-[#333] mb-4" />
                        <p className="text-[#555] text-[13px] font-mono">NO_RESOURCES_FOUND</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="relative h-full bg-[#0a0a0a] overflow-hidden">
                    {/* Chat Messages - Absolute positioning for perfect scroll area */}
                    <div className="absolute top-0 left-0 right-0 bottom-[72px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                          <Sparkles className="w-12 h-12 text-[#FF6B35] mb-4 opacity-50" />
                          <p className="text-[#666] text-[13px] mb-2 font-mono uppercase tracking-widest">AI Tutor Ready</p>
                          <p className="text-[#444] text-[12px] max-w-xs font-mono">
                            Target: {selectedNode.label}
                          </p>
                        </div>
                      ) : (
                        <>
                          {chatMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex gap-3 text-[13px] ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                              }`}
                            >
                              {msg.role === "assistant" && (
                                <div className="w-6 h-6 rounded-none border border-[#FF6B35]/30 flex items-center justify-center flex-shrink-0 mt-1 bg-[#FF6B35]/5 text-[#FF6B35] font-mono text-[10px]">
                                  AI
                                </div>
                              )}
                              <div
                                className={`max-w-[85%] rounded-md px-4 py-3 leading-relaxed font-mono border ${
                                  msg.role === "user"
                                    ? "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20 ml-12"
                                    : "bg-[#111] text-[#ccc] border-[#2a2a2a] mr-8 shadow-sm"
                                }`}
                              >
                                {msg.role === "assistant" ? (
                                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#000] prose-pre:border prose-pre:border-[#333] prose-p:my-1 prose-pre:my-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                                    <ReactMarkdown components={{
                                      code: ({node, inline, className, children, ...props}) => (
                                        <code className={`${className} ${inline ? 'bg-[#222] px-1 py-0.5 rounded text-[#FF6B35]' : 'block bg-[#000] p-3 rounded border border-[#333] overflow-x-auto text-xs'}`} {...props}>
                                          {children}
                                        </code>
                                      )
                                    }}>
                                      {msg.content || ''}
                                    </ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="whitespace-pre-wrap font-mono">{msg.content}</p>
                                )}
                              </div>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex gap-3 justify-start animate-pulse">
                              <div className="w-6 h-6 rounded-none border border-[#FF6B35]/30 flex items-center justify-center flex-shrink-0 mt-1">
                                <Loader2 size={12} className="text-[#FF6B35] animate-spin" />
                              </div>
                              <div className="bg-[#111] text-[#555] border border-[#2a2a2a] rounded-md px-4 py-2">
                                <p className="text-[12px] font-mono">PROCESSING_QUERY...</p>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </>
                      )}
                    </div>

                    {/* Chat Input - Pinned to bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[72px] border-t border-[#2a2a2a] bg-[#111] flex flex-col justify-end">
                      <div className="px-3 pb-3">
                        <PlaceholdersAndVanishInput 
                          placeholders={["Ask specific questions...", "Explain this topic...", "Give me examples..."]}
                          onChange={(e) => setChatInput(e.target.value)}
                          onSubmit={(e, val) => handleSendMessage(val)}
                          disabled={isChatLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area - Full width */}
        <div className={`relative w-full bg-[#0a0a0a] overflow-y-auto transition-all duration-300 ${selectedNode ? 'md:pr-[28rem]' : ''}`}>
          <div className="w-full px-6 py-8">
            
            {/* Offline Warning Banner */}
            {roadmap?.isOffline && (
              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-200">
                      <span className="font-bold">Database Offline:</span> Your roadmap was generated successfully, but progress cannot be saved right now.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Header Card */}
            <div className="bg-white/5 rounded-[32px] shadow-lg border border-white/10 p-8 mb-12 ">
              {/* Top Row: Back Button & Action Buttons */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigate("/ai-roadmap")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>All Roadmaps</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-[#FF6B35] border border-[#FF6B35] rounded-none font-bold text-sm text-white hover:bg-[#ff7a4a] transition-all flex items-center gap-2 btn-beam"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="px-4 py-2 bg-[#FF6B35] border border-[#FF6B35] rounded-none font-bold text-sm text-white hover:bg-[#ff7a4a] transition-all flex items-center gap-2 btn-beam"
                  >
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-[#FF6B35] border border-[#FF6B35] rounded-none font-bold text-sm text-white hover:bg-[#ff7a4a] transition-all flex items-center gap-2 btn-beam"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-4xl font-bold text-white mb-3 font-serif">
                {roadmap?.title || `${topic} Learning Roadmap`}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                {roadmap?.description || `Step by step guide to becoming a proficient ${topic} developer.`}
              </p>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-none">
                      <span className="text-sm font-bold text-[#FF6B35]">
                        {Math.round((Object.values(completedNodes).filter(Boolean).length / (roadmap?.stages?.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0) || 1)) * 100)}% DONE
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {Object.values(completedNodes).filter(Boolean).length} of {roadmap?.stages?.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0) || 0} Done
                    </span>
                  </div>
                  {roadmap?.fromCache && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CheckCircle size={16} className="text-green-400" />
                      <span>Loaded from cache</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Roadmap Content */}
            <div className="relative">

            {/* Central Spine Line - Moved inside to grow with content */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-white/20 transform -translate-x-1/2 z-0"></div>

            {stages.map((stage, stageIndex) => (
              <div key={stage.id} className="mb-20 relative">
                {/* Stage Marker on Spine */}
                <div className="absolute left-1/2 top-0 w-4 h-4 bg-[#FF6B35] rounded-none border-4 border-[#0a0a0a] shadow-sm transform -translate-x-1/2 z-20"></div>

                {/* Stage Title (Root of the Tree) */}
                <div className="flex justify-center mb-12 relative z-20">
                  <div className="bg-[#0a0a0a] border border-white/20 px-8 py-4 rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative group cursor-default hover:-translate-y-1 transition-transform duration-200">
                    <h2 className="text-xl font-bold text-white text-center uppercase tracking-wide">
                      {stage.label}
                    </h2>
                    {/* Connector to children */}
                    <div className="absolute left-1/2 bottom-0 w-0.5 h-12 bg-white/20 transform -translate-x-1/2 translate-y-full"></div>
                  </div>
                </div>

                {/* Nodes Tree Layout */}
                <div className="relative z-10">
                  {/* Horizontal Bar connecting branches */}
                  <div className="absolute top-0 left-4 right-4 h-0.5 bg-white/20 rounded-none hidden md:block"></div>
                  
                  <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-8 relative">
                    {stage.nodes?.map((node, nodeIndex) => {
                      const isCompleted = completedNodes[node.id];
                      const isSelected = selectedNode?.id === node.id;
                      
                      return (
                        <div key={node.id} className="relative flex flex-col items-center w-full md:w-64">
                          {/* Vertical Line from Horizontal Bar */}
                          <div className="absolute top-[-32px] left-1/2 w-0.5 h-8 bg-white/20 transform -translate-x-1/2 hidden md:block"></div>
                          
                          {/* Node Card */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: nodeIndex * 0.1 }}
                            whileHover={{ scale: 1.03, translateY: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNodeClick(node)}
                            className={`w-full bg-white/5 p-5  border cursor-pointer transition-all duration-300 relative overflow-hidden group  ${
                              isSelected
                                ? "border-[#FF6B35] shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                                : isCompleted
                                ? "border-green-500/50 shadow-sm bg-green-500/5"
                                : "border-white/10 hover:border-white/30 shadow-sm hover:shadow-xl hover:bg-white/10"
                            }`}
                          >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                            {/* Progress Indicator */}
                            <div className="absolute top-3 right-3 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNodeCompletion(node.id);
                                }}
                                className={`p-1.5 rounded-none transition-all duration-300 cursor-pointer relative z-50 ${
                                  isCompleted
                                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 scale-110"
                                    : "bg-white/10 text-slate-500 hover:bg-white/20 hover:scale-110"
                                }`}
                              >
                                {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                              </button>
                            </div>

                            <h3 className={`font-bold text-lg mb-2 pr-8 relative z-10 ${
                              isCompleted ? "text-green-400" : "text-white"
                            }`}>
                              {node.label}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 relative z-10">
                              {node.details}
                            </p>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* End Marker */}
            <div className="flex justify-center pt-8 pb-16 relative z-20">
              <div className="bg-green-500/10 text-green-400 px-6 py-2 rounded-none font-bold text-sm border border-green-500/20 shadow-sm ">
                Goal Reached! 🚀
              </div>
            </div>
          </div>
          {/* Closing Roadmap Content div */}
        </div>
        {/* Closing w-full px-6 py-8 div */}
      </div>
      {/* Closing relative w-full bg-[#0a0a0a] overflow-y-auto div */}
    </div>
  );
}

export default RoadmapGenerator;

