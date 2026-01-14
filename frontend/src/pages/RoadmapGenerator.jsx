
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

// Memoized Node Card component - Skill Tree Design
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
      className={`w-full bg-[#1a1a1a]/90 backdrop-blur-sm p-5 border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group rounded-2xl ${
        isSelected
          ? "border-[#A1FF62] shadow-[0_0_30px_-5px_rgba(161,255,98,0.5)] bg-[#1a1a1a]"
          : isCompleted
          ? "border-[#A1FF62]/60 shadow-[0_0_20px_-10px_rgba(161,255,98,0.3)]"
          : "border-white/10 hover:border-[#A1FF62]/50 hover:shadow-[0_0_25px_-10px_rgba(161,255,98,0.3)]"
      }`}
      style={{ animationDelay: `${nodeIndex * 50}ms` }}
    >
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A1FF62]/0 to-[#A1FF62]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Progress Ring Indicator */}
      <div className="absolute top-3 right-3 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(node.id);
          }}
          className={`relative p-1 rounded-full transition-all duration-300 cursor-pointer ${
            isCompleted
              ? "scale-110"
              : "hover:scale-110"
          }`}
        >
          {/* Progress ring */}
          <svg className="w-8 h-8" viewBox="0 0 36 36">
            <circle
              className="text-white/10"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              r="15"
              cx="18"
              cy="18"
            />
            <circle
              className={`transition-all duration-500 ${isCompleted ? 'text-[#A1FF62]' : 'text-white/20'}`}
              strokeWidth="3"
              strokeDasharray={isCompleted ? "94" : "0"}
              strokeDashoffset="0"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="15"
              cx="18"
              cy="18"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${
            isCompleted ? "text-[#A1FF62]" : "text-white/40"
          }`}>
            {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
          </div>
        </button>
      </div>

      <h3 className={`font-bold text-lg mb-2 pr-10 relative z-10 transition-colors duration-200 ${
        isCompleted ? "text-[#A1FF62]" : "text-white"
      }`}>
        {node.label}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 relative z-10">
        {node.details}
      </p>
      
      {/* Bottom glow line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
        isCompleted 
          ? "bg-gradient-to-r from-transparent via-[#A1FF62] to-transparent" 
          : "bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#A1FF62]/50"
      }`} />
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
      <div className={`w-2 h-2 rounded-full ${visible ? 'bg-[#A1FF62] shadow-[0_0_10px_#A1FF62]' : 'bg-[#333]'}`} />
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
          <div className="w-16 h-16 bg-red-500/10 rounded-[16px] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Generation Failed</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/ai-roadmap")}
              className="px-4 py-2 text-slate-300 bg-white/5 hover:bg-white/10 rounded-[16px] transition-colors btn-beam border border-white/10"
            >
              Go Back
            </button>
            <button
              onClick={() => generateRoadmap(topic)}
              className="px-4 py-2 bg-[#A1FF62] text-white rounded-[16px] hover:bg-[#b8ff8a] transition-colors flex items-center gap-2 btn-beam"
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
      /* Main Content Area - Dark Theme - Full Screen (no navbar) */
      <div className="w-full flex overflow-hidden relative min-h-screen font-haffer" style={{ backgroundColor: '#0a0a0a' }}>
        
        {/* Resources Sidebar - Full Height Dark Theme */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[28rem] bg-[#111] border-l border-white/10 shadow-2xl z-40 overflow-hidden"
            >
              {/* Sidebar Header - Dark Theme */}
              <div className="p-6 border-b border-white/10 bg-[#0a0a0a]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-white font-mono uppercase tracking-tight">{selectedNode.label}</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 transition-colors rounded-full"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`px-5 py-2.5 font-mono text-[12px] uppercase tracking-wider transition-all rounded-full ${
                      activeTab === "resources"
                        ? "bg-[#A1FF62] text-black font-bold"
                        : "bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`px-5 py-2.5 font-mono text-[12px] uppercase tracking-wider transition-all rounded-full ${
                      activeTab === "chat"
                        ? "bg-[#A1FF62] text-black font-bold"
                        : "bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    AI Chat
                  </button>
                </div>
              </div>

              {/* Sidebar Content - Dark Theme - Isolated scroll */}
              <div 
                className="h-[calc(100%-140px)] overflow-y-auto overscroll-contain bg-[#0a0a0a]"
                onWheel={(e) => e.stopPropagation()}
              >
                {activeTab === "resources" && (
                  <div className="p-6 space-y-6">
                    {loadingResources ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-[#A1FF62] animate-spin mb-4" />
                        <p className="text-gray-500 text-[13px] font-mono">LOADING_RESOURCES...</p>
                      </div>
                    ) : nodeResources[selectedNode.id] ? (
                      <>
                        {/* Description */}
                        {nodeResources[selectedNode.id].description && (
                          <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl">
                            <p className="text-[13px] text-gray-400 leading-relaxed">
                              {nodeResources[selectedNode.id].description}
                            </p>
                          </div>
                        )}

                        {/* Free Resources - Dark Theme */}
                        {nodeResources[selectedNode.id].freeResources?.length > 0 && (
                          <div>
                            <h4 className="font-bold text-[#A1FF62] mb-3 flex items-center gap-2 text-[12px] font-mono uppercase tracking-wide">
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
                                  className="block p-4 bg-[#1a1a1a] border border-white/10 rounded-xl hover:border-[#A1FF62]/50 hover:shadow-[0_0_20px_rgba(161,255,98,0.1)] transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        {resource.type === "video" && <Video size={14} className="text-[#A1FF62]" />}
                                        {resource.type === "article" && <FileText size={14} className="text-[#A1FF62]" />}
                                        {resource.type === "course" && <Code size={14} className="text-[#A1FF62]" />}
                                        <h5 className="font-medium text-white text-[13px] group-hover:text-[#A1FF62] transition-colors">
                                          {resource.title}
                                        </h5>
                                      </div>
                                      <p className="text-[11px] text-gray-500 font-mono uppercase">{resource.platform}</p>
                                    </div>
                                    <ExternalLink size={14} className="text-gray-600 group-hover:text-[#A1FF62] transition-colors flex-shrink-0" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Premium Resources - Dark Theme */}
                        {nodeResources[selectedNode.id].premiumResources?.length > 0 && (
                          <div>
                            <h4 className="font-bold text-[#A1FF62] mb-3 flex items-center gap-2 text-[12px] font-mono uppercase tracking-wide">
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
                                  className="block p-4 bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border border-[#A1FF62]/20 rounded-xl hover:border-[#A1FF62]/50 hover:shadow-[0_0_25px_rgba(161,255,98,0.15)] transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        {resource.type === "video" && <Video size={14} className="text-[#A1FF62]" />}
                                        {resource.type === "article" && <FileText size={14} className="text-[#A1FF62]" />}
                                        {resource.type === "course" && <Code size={14} className="text-[#A1FF62]" />}
                                        <h5 className="font-medium text-white text-[13px] group-hover:text-[#A1FF62] transition-colors">
                                          {resource.title}
                                        </h5>
                                      </div>
                                      <p className="text-[11px] text-gray-500 font-mono uppercase">{resource.platform}</p>
                                    </div>
                                    <ExternalLink size={14} className="text-gray-600 group-hover:text-[#A1FF62] transition-colors flex-shrink-0" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-600 mb-4" />
                        <p className="text-gray-500 text-[13px] font-mono">NO_RESOURCES_FOUND</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="relative h-full bg-[#0a0a0a] overflow-hidden flex flex-col">
                    {/* Chat Messages Area */}
                    <div 
                      className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                          <div className="w-16 h-16 rounded-full bg-[#A1FF62]/10 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-[#A1FF62]" />
                          </div>
                          <h4 className="text-white text-lg font-bold mb-2">Ask AI Anything</h4>
                          <p className="text-gray-500 text-sm max-w-xs">
                            Get instant help about <span className="text-[#A1FF62]">{selectedNode.label}</span>
                          </p>
                        </div>
                      ) : (
                        <>
                          {chatMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex gap-3 ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                              }`}
                            >
                              {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-[#A1FF62]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                  <Sparkles size={14} className="text-[#A1FF62]" />
                                </div>
                              )}
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                  msg.role === "user"
                                    ? "bg-[#A1FF62] text-black ml-8"
                                    : "bg-[#1a1a1a] text-white border border-white/10 mr-4"
                                }`}
                              >
                                {msg.role === "assistant" ? (
                                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#000] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-p:my-1 prose-pre:my-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                                    <ReactMarkdown components={{
                                      code: ({node, inline, className, children, ...props}) => (
                                        <code className={`${className} ${inline ? 'bg-white/10 px-1.5 py-0.5 rounded text-[#A1FF62]' : 'block bg-[#000] p-3 rounded-xl border border-white/10 overflow-x-auto text-xs'}`} {...props}>
                                          {children}
                                        </code>
                                      )
                                    }}>
                                      {msg.content || ''}
                                    </ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="whitespace-pre-wrap">{msg.content}</p>
                                )}
                              </div>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex gap-3 justify-start">
                              <div className="w-8 h-8 rounded-full bg-[#A1FF62]/20 flex items-center justify-center flex-shrink-0">
                                <Loader2 size={14} className="text-[#A1FF62] animate-spin" />
                              </div>
                              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                  <span className="w-2 h-2 bg-[#A1FF62] rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                                  <span className="w-2 h-2 bg-[#A1FF62] rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                                  <span className="w-2 h-2 bg-[#A1FF62] rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-white/10 bg-[#111] p-4">
                      <PlaceholdersAndVanishInput 
                        placeholders={["Ask about " + selectedNode.label + "...", "Explain this concept...", "Give me examples..."]}
                        onChange={(e) => setChatInput(e.target.value)}
                        onSubmit={(e, val) => handleSendMessage(val)}
                        disabled={isChatLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area - Full width */}
        <div className={`relative w-full overflow-y-auto transition-all duration-300 ${selectedNode ? 'md:pr-[28rem]' : ''}`}>
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

            {/* Header Card - Dark Theme */}
            <div className="bg-[#111] rounded-[32px] shadow-2xl border border-white/10 p-8 mb-12 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#A1FF62]/10 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#A1FF62]/5 blur-[80px] pointer-events-none" />
              
              {/* Top Row: Back Button & Action Buttons */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <button
                  onClick={() => navigate("/ai-roadmap")}
                  className="flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>All Roadmaps</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-[#A1FF62] border border-[#A1FF62] rounded-full font-bold text-sm text-black hover:bg-[#b8ff8a] transition-all flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="px-4 py-2 bg-[#A1FF62] border border-[#A1FF62] rounded-full font-bold text-sm text-black hover:bg-[#b8ff8a] transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-[#A1FF62] border border-[#A1FF62] rounded-full font-bold text-sm text-black hover:bg-[#b8ff8a] transition-all flex items-center gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-4xl font-bold text-white mb-3 font-serif relative z-10">
                {roadmap?.title || `${topic} Learning Roadmap`}
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed relative z-10">
                {roadmap?.description || `Step by step guide to becoming a proficient ${topic} developer.`}
              </p>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-[#A1FF62]/20 border border-[#A1FF62]/30 rounded-full">
                      <span className="text-sm font-bold text-[#A1FF62]">
                        {Math.round((Object.values(completedNodes).filter(Boolean).length / (roadmap?.stages?.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0) || 1)) * 100)}% DONE
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Object.values(completedNodes).filter(Boolean).length} of {roadmap?.stages?.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0) || 0} Done
                    </span>
                  </div>
                  {roadmap?.fromCache && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle size={16} className="text-[#A1FF62]" />
                      <span>Loaded from cache</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Roadmap Content */}
            <div className="relative">

            {/* Central Spine Line - Glowing for dark theme */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2 z-0">
              <div className="w-full h-full bg-gradient-to-b from-[#A1FF62]/50 via-[#A1FF62]/20 to-transparent" />
            </div>

            {stages.map((stage, stageIndex) => (
              <div key={stage.id} className="mb-20 relative">
                {/* Stage Marker on Spine - Glowing */}
                <div className="absolute left-1/2 top-0 w-5 h-5 transform -translate-x-1/2 z-20">
                  <div className="w-full h-full bg-[#A1FF62] rounded-full shadow-[0_0_15px_rgba(161,255,98,0.6)]" />
                  <div className="absolute inset-0 bg-[#A1FF62] rounded-full animate-ping opacity-30" />
                </div>

                {/* Stage Title (Root of the Tree) */}
                <div className="flex justify-center mb-12 relative z-20">
                  <div className="bg-[#111] border-2 border-[#A1FF62]/30 px-8 py-4 rounded-full shadow-[0_0_30px_rgba(161,255,98,0.15)] relative group cursor-default hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(161,255,98,0.25)] transition-all duration-300">
                    <h2 className="text-xl font-bold text-white text-center uppercase tracking-wide">
                      {stage.label}
                    </h2>
                    {/* Connector to children */}
                    <div className="absolute left-1/2 bottom-0 w-px h-12 bg-gradient-to-b from-[#A1FF62]/40 to-transparent transform -translate-x-1/2 translate-y-full" />
                  </div>
                </div>

                {/* Nodes Tree Layout */}
                <div className="relative z-10">
                  {/* Horizontal Bar connecting branches */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#A1FF62]/30 to-transparent rounded-full hidden md:block" />
                  
                  <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-8 relative">
                    {stage.nodes?.map((node, nodeIndex) => {
                      const isCompleted = completedNodes[node.id];
                      const isSelected = selectedNode?.id === node.id;
                      
                      return (
                        <div key={node.id} className="relative flex flex-col items-center w-full md:w-72">
                          {/* Vertical Line from Horizontal Bar */}
                          <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-gradient-to-b from-[#A1FF62]/30 to-transparent transform -translate-x-1/2 hidden md:block" />
                          
                          {/* Node Card - Skill Tree Style */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: nodeIndex * 0.1 }}
                            whileHover={{ scale: 1.03, translateY: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNodeClick(node)}
                            className={`w-full bg-[#1a1a1a]/90 backdrop-blur-sm p-5 border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group rounded-2xl ${
                              isSelected
                                ? "border-[#A1FF62] shadow-[0_0_30px_-5px_rgba(161,255,98,0.5)] bg-[#1a1a1a]"
                                : isCompleted
                                ? "border-[#A1FF62]/60 shadow-[0_0_20px_-10px_rgba(161,255,98,0.3)]"
                                : "border-white/10 hover:border-[#A1FF62]/50 hover:shadow-[0_0_25px_-10px_rgba(161,255,98,0.3)]"
                            }`}
                          >
                            {/* Glassmorphic overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                            
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#A1FF62]/0 to-[#A1FF62]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Progress Ring Indicator */}
                            <div className="absolute top-3 right-3 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNodeCompletion(node.id);
                                }}
                                className={`relative p-1 rounded-full transition-all duration-300 cursor-pointer ${
                                  isCompleted ? "scale-110" : "hover:scale-110"
                                }`}
                              >
                                {/* Progress ring */}
                                <svg className="w-8 h-8" viewBox="0 0 36 36">
                                  <circle
                                    className="text-white/10"
                                    strokeWidth="3"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="15"
                                    cx="18"
                                    cy="18"
                                  />
                                  <circle
                                    className={`transition-all duration-500 ${isCompleted ? 'text-[#A1FF62]' : 'text-white/20'}`}
                                    strokeWidth="3"
                                    strokeDasharray={isCompleted ? "94" : "0"}
                                    strokeDashoffset="0"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="15"
                                    cx="18"
                                    cy="18"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                  />
                                </svg>
                                <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${
                                  isCompleted ? "text-[#A1FF62]" : "text-white/40"
                                }`}>
                                  {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                                </div>
                              </button>
                            </div>

                            <h3 className={`font-bold text-lg mb-2 pr-10 relative z-10 transition-colors duration-200 ${
                              isCompleted ? "text-[#A1FF62]" : "text-white"
                            }`}>
                              {node.label}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 relative z-10">
                              {node.details}
                            </p>
                            
                            {/* Bottom glow line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                              isCompleted 
                                ? "bg-gradient-to-r from-transparent via-[#A1FF62] to-transparent" 
                                : "bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#A1FF62]/50"
                            }`} />
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* End Marker - Success Badge */}
            <div className="flex justify-center pt-8 pb-16 relative z-20">
              <div className="bg-[#A1FF62]/20 text-[#A1FF62] px-8 py-3 rounded-full font-bold text-sm border border-[#A1FF62]/30 shadow-[0_0_30px_rgba(161,255,98,0.2)]">
                🚀 Goal Reached!
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

