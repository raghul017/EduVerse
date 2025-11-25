import { useState, useEffect, useRef } from "react";
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
  AlertTriangle,
  Send,
  User,
} from "lucide-react";
import { aiGenerate } from "../utils/api.js";
import api from "../utils/api.js";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

function RoadmapGenerator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
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
    if (roleParam && !hasGeneratedRef.current) {
      setTopic(roleParam);
      hasGeneratedRef.current = true;
      generateRoadmap(roleParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (activeTab === "chat" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading || !selectedNode) return;

    const userMessage = { role: "user", content: chatInput };
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

  const generateRoadmap = async (topicToGenerate, forceRegenerate = false) => {
    if (!topicToGenerate?.trim()) return;
    
    // Reset the flag when force regenerating
    if (forceRegenerate) {
      hasGeneratedRef.current = false;
    }
    setLoading(true);
    setError(null);
    setRoadmap(null);
    setCompletedNodes({});
    try {
      const data = await aiGenerate("roadmap", {
        topic: topicToGenerate,
        answerQuestions: false,
        forceRegenerate,
      });

      console.log("[Frontend API] AI roadmap response:", data);
      console.log("Generated roadmap:", data);

      if (data && data.stages) {
        setRoadmap(data);
        if (data.roadmapId) {
          setRoadmapId(data.roadmapId);
          // Always load progress when we have a roadmapId
          await loadProgress(data.roadmapId);
        } else {
          console.warn("No roadmapId returned from backend. Database might be offline.");
        }
      } else {
        throw new Error(
          "Invalid roadmap data received. Please try again."
        );
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setError(
        error.message || "Failed to generate roadmap. Please try again."
      );
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

  const toggleNodeProgress = (nodeId) => {
    setProgress((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
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
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="bg-white/5 p-12 rounded-[32px] shadow-2xl border border-white/10 text-center w-full max-w-2xl backdrop-blur-sm">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-serif">
            {roadmap?.fromCache ? "Loading Roadmap" : "Generating Roadmap"}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            {roadmap?.fromCache 
              ? `Retrieving your ${topic} roadmap...`
              : `AI is crafting a personalized learning path for ${topic}...`
            }
          </p>
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg inline-block">
            <p className="text-sm text-blue-300">
              {roadmap?.fromCache ? "This will only take a moment" : "This may take 10-20 seconds"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-white/5 p-8 rounded-[24px] shadow-xl text-center max-w-md w-full border-l-4 border-red-500 backdrop-blur-sm border-y border-r border-white/10">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Generation Failed</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/ai-roadmap")}
              className="px-4 py-2 text-slate-300 bg-white/5 hover:bg-white/10 rounded-full transition-colors btn-beam border border-white/10"
            >
              Go Back
            </button>
            <button
              onClick={() => generateRoadmap(topic)}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 btn-beam"
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
      <div className="w-full flex overflow-hidden relative bg-[#0a0a0a] min-h-[calc(100vh-70px)]">
        
        {/* Resources Sidebar - Slides in from right when node is selected */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-[70px] bottom-0 w-full md:w-[28rem] bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-40 overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activeTab === "resources"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activeTab === "chat"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    AI Chat
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="h-[calc(100%-180px)] overflow-y-auto">
                {activeTab === "resources" && (
                  <div className="p-6 space-y-6">
                    {loadingResources ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-400 text-sm">Loading resources...</p>
                      </div>
                    ) : nodeResources[selectedNode.id] ? (
                      <>
                        {/* Description */}
                        {nodeResources[selectedNode.id].description && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {nodeResources[selectedNode.id].description}
                            </p>
                          </div>
                        )}

                        {/* Free Resources */}
                        {nodeResources[selectedNode.id].freeResources?.length > 0 && (
                          <div>
                            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                              <BookOpen size={18} className="text-blue-400" />
                              Free Resources
                            </h4>
                            <div className="space-y-3">
                              {nodeResources[selectedNode.id].freeResources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        {resource.type === "video" && <Video size={16} className="text-purple-400" />}
                                        {resource.type === "article" && <FileText size={16} className="text-green-400" />}
                                        {resource.type === "course" && <Code size={16} className="text-blue-400" />}
                                        <h5 className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors">
                                          {resource.title}
                                        </h5>
                                      </div>
                                      <p className="text-xs text-slate-400">{resource.platform}</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Premium Resources */}
                        {nodeResources[selectedNode.id].premiumResources?.length > 0 && (
                          <div>
                            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                              <Sparkles size={18} className="text-yellow-400" />
                              Premium Resources
                            </h4>
                            <div className="space-y-3">
                              {nodeResources[selectedNode.id].premiumResources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/20 rounded-lg transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        {resource.type === "video" && <Video size={16} className="text-purple-400" />}
                                        {resource.type === "article" && <FileText size={16} className="text-green-400" />}
                                        {resource.type === "course" && <Code size={16} className="text-blue-400" />}
                                        <h5 className="font-medium text-white text-sm group-hover:text-yellow-400 transition-colors">
                                          {resource.title}
                                        </h5>
                                      </div>
                                      <p className="text-xs text-slate-400">{resource.platform}</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-500 group-hover:text-yellow-400 transition-colors flex-shrink-0" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 text-sm">No resources available yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="flex flex-col h-full">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
                          <p className="text-slate-400 text-sm mb-2">AI Tutor Ready</p>
                          <p className="text-slate-500 text-xs max-w-xs">
                            Ask me anything about {selectedNode.label}
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
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                  <Sparkles size={16} className="text-blue-400" />
                                </div>
                              )}
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                  msg.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/5 text-slate-300 border border-white/10"
                                }`}
                              >
                                {msg.role === "assistant" ? (
                                  <ReactMarkdown className="text-sm prose prose-invert prose-sm max-w-none">
                                    {msg.content}
                                  </ReactMarkdown>
                                ) : (
                                  <p className="text-sm">{msg.content}</p>
                                )}
                              </div>
                              {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                  <User size={16} className="text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex gap-3 justify-start">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Loader2 size={16} className="text-blue-400 animate-spin" />
                              </div>
                              <div className="bg-white/5 text-slate-400 border border-white/10 rounded-2xl px-4 py-3">
                                <p className="text-sm">Thinking...</p>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Ask about this topic..."
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                          disabled={isChatLoading}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim() || isChatLoading}
                          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Send size={18} />
                        </button>
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
            <div className="bg-white/5 rounded-[32px] shadow-lg border border-white/10 p-8 mb-12 backdrop-blur-sm">
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
                    className="px-4 py-2 bg-blue-600 border border-blue-500 rounded-full font-bold text-sm text-white hover:bg-blue-700 transition-all flex items-center gap-2 btn-beam"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="px-4 py-2 bg-blue-600 border border-blue-500 rounded-full font-bold text-sm text-white hover:bg-blue-700 transition-all flex items-center gap-2 btn-beam"
                  >
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-blue-600 border border-blue-500 rounded-full font-bold text-sm text-white hover:bg-blue-700 transition-all flex items-center gap-2 btn-beam"
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
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                      <span className="text-sm font-bold text-blue-400">
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
                <div className="absolute left-1/2 top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-[#0a0a0a] shadow-sm transform -translate-x-1/2 z-20"></div>

                {/* Stage Title (Root of the Tree) */}
                <div className="flex justify-center mb-12 relative z-20">
                  <div className="bg-[#0a0a0a] border border-white/20 px-8 py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative group cursor-default hover:-translate-y-1 transition-transform duration-200">
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
                  <div className="absolute top-0 left-4 right-4 h-0.5 bg-white/20 rounded-full hidden md:block"></div>
                  
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
                            className={`w-full bg-white/5 p-5 rounded-[24px] border cursor-pointer transition-all duration-300 relative overflow-hidden group backdrop-blur-sm ${
                              isSelected
                                ? "border-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
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
                                className={`p-1.5 rounded-full transition-all duration-300 cursor-pointer relative z-50 ${
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
              <div className="bg-green-500/10 text-green-400 px-6 py-2 rounded-full font-bold text-sm border border-green-500/20 shadow-sm backdrop-blur-sm">
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
