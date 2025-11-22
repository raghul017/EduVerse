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
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.response },
        ]);
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
  }

;

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
        console.error("[Progress] Error saving progress:",error.response?.data || error.message);
      }
    } else {
      console.warn("[Progress] No roadmapId - progress not saved!");
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
    if (confirm("Are you sure you want to generate a new roadmap? Current progress will be saved.")) {
      generateRoadmap(topic, true);
    }
  };

  const stages = roadmap?.stages || [];

  // NodeCard Component
  const NodeCard = ({
    node,
    progress,
    selectedNode,
    onNodeClick,
    onToggleProgress,
  }) => {
    const isCompleted = completedNodes[node.id];
    const isSelected = selectedNode?.id === node.id;

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNodeClick(node)}
        className={`relative group flex items-center justify-between w-64 p-4 rounded-lg border-2 text-left transition-all 
        ${
          isCompleted
            ? "bg-[#e6f4ea] border-green-700 shadow-[4px_4px_0px_0px_rgba(21,128,61,1)]"
            : isSelected
            ? "bg-[#fde047] border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] ring-1 ring-stone-900"
            : "bg-[#fffbeb] border-stone-400 hover:border-stone-900 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
        }`}
      >
        <span className={`font-bold text-sm ${isCompleted ? "text-green-900" : "text-gray-900"}`}>
          {node.label}
        </span>
        
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleProgress(node.id);
          }}
          className={`ml-3 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors border ${
            isCompleted 
              ? "bg-green-500 border-green-600 text-white" 
              : "bg-white border-gray-400 text-gray-300 group-hover:border-gray-600"
          }`}
        >
          {isCompleted ? <CheckCircle size={14} /> : <Circle size={14} />}
        </div>
      </motion.button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf7f1] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border-2 border-stone-200 text-center max-w-md w-full">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-yellow-500 animate-pulse" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-4 font-serif">
            {roadmap?.fromCache ? "Loading Roadmap" : "Generating Roadmap"}
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed">
            {roadmap?.fromCache 
              ? `Retrieving your ${topic} roadmap...`
              : `AI is crafting a personalized learning path for ${topic}...`
            }
          </p>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-stone-600">
              {roadmap?.fromCache ? "This will only take a moment" : "This may take 10-20 seconds"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-l-4 border-red-500">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/ai-roadmap")}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => generateRoadmap(topic)}
              className="px-4 py-2 bg-void text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
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
      <div className="h-[calc(100vh-140px)] w-full flex overflow-hidden relative rounded-2xl border border-stone-200 shadow-sm bg-[#fbf7f1]">
        {/* Main Content Area - Full width with controlled max-width */}
        <div className="relative w-full bg-[#fbf7f1] overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-stone-200 p-8 mb-12">
              {/* Top Row: Back Button & Action Buttons */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigate("/ai-roadmap")}
                  className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>All Roadmaps</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-yellow-400 border-2 border-yellow-500 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-all flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="px-4 py-2 bg-yellow-400 border-2 border-yellow-500 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-yellow-400 border-2 border-yellow-500 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-all flex items-center gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-4xl font-bold text-stone-900 mb-3 font-serif">
                {roadmap?.title || `${topic} Learning Roadmap`}
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                {roadmap?.description || `Step by step guide to becoming a proficient ${topic} developer.`}
              </p>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t-2 border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full">
                      <span className="text-sm font-bold text-yellow-900">
                        {Math.round((Object.values(completedNodes).filter(Boolean).length / (roadmap?.stages?.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0) || 1)) * 100)}% DONE
                      </span>
                    </div>
                    <span className="text-sm text-stone-600">
                      {Object.values(completedNodes).filter(Boolean).length} of {roadmap?.stages?.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0) || 0} Done
                    </span>
                  </div>
                  {roadmap?.fromCache && (
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Loaded from cache</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Roadmap Content */}
            <div className="relative">

            {/* Central Spine Line - Moved inside to grow with content */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-stone-400 transform -translate-x-1/2 z-0"></div>

            {stages.map((stage, stageIndex) => (
              <div key={stage.id} className="mb-16 relative">
                {/* Stage Marker on Spine */}
                <div className="absolute left-1/2 top-6 w-4 h-4 bg-yellow-400 rounded-full border-4 border-white shadow-sm transform -translate-x-1/2 z-20"></div>

                {/* Stage Title */}
                <div className="flex justify-center mb-10 relative z-20">
                  <div className="bg-white border-2 border-gray-800 px-8 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xl font-bold text-gray-900 text-center uppercase tracking-wide">
                      {stage.label}
                    </h2>
                  </div>
                </div>

                {/* Nodes Grid */}
                <div className="grid grid-cols-2 gap-x-24 gap-y-8 relative">
                  {stage.nodes?.map((node, nodeIndex) => {
                    const isLeft = nodeIndex % 2 === 0;
                    return (
                      <div
                        key={node.id}
                        className={`flex ${isLeft ? "justify-end" : "justify-start"} relative items-center`}
                      >
                        {/* Curved SVG Connector */}
                        <svg
                          className={`absolute top-1/2 w-24 h-12 pointer-events-none
                            ${isLeft ? "-right-24 -translate-y-1/2" : "-left-24 -translate-y-1/2"}
                          `}
                          style={{ overflow: 'visible' }}
                        >
                          <path
                            d={isLeft 
                              ? "M 96,24 C 48,24 48,24 0,24" // Right to Left curve
                              : "M 0,24 C 48,24 48,24 96,24"  // Left to Right curve
                            }
                            fill="none"
                            stroke="#a8a29e" // stone-400
                            strokeWidth="2"
                            strokeDasharray="6 4"
                          />
                          {/* Dot at spine connection */}
                          <circle cx={isLeft ? 96 : 0} cy="24" r="3" fill="#78716c" />
                        </svg>
                        
                        {/* Node */}
                        <NodeCard
                          node={node}
                          progress={completedNodes}
                          selectedNode={selectedNode}
                          onNodeClick={handleNodeClick}
                          onToggleProgress={toggleNodeCompletion}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* End Marker */}
            <div className="flex justify-center pt-8 pb-16 relative z-20">
              <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full font-bold text-sm border border-green-200 shadow-sm">
                Goal Reached! 🚀
              </div>
            </div>
          </div>
          {/* Closing Roadmap Content div */}
        </div>
        {/* Closing max-w-6xl div */}
      </div>
      {/* Closing overflow-y-auto div */}

        {/* Resources Sidebar */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[40%] max-w-[450px] min-w-[320px] bg-[#fbf7f1] border-l-2 border-stone-200 shadow-xl flex flex-col z-30 h-full flex-shrink-0"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b-2 border-stone-200 flex items-center justify-between bg-[#fbf7f1]">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab("resources")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "resources" 
                        ? "bg-stone-900 text-white" 
                        : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <BookOpen size={16} />
                    Resources
                  </button>
                  <button 
                    onClick={() => setActiveTab("chat")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "chat" 
                        ? "bg-stone-900 text-white" 
                        : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Sparkles size={16} />
                    AI Tutor
                    {activeTab !== "chat" && <span className="bg-yellow-400 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">New</span>}
                  </button>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <ArrowLeft size={20} className="rotate-180" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative">
                {activeTab === "resources" ? (
                  <>
                    {/* Title & Description */}
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {selectedNode.label}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {nodeResources[selectedNode.id]?.description ||
                      selectedNode.details ||
                      "Loading details..."}
                  </p>
                </div>

                {/* Loading State */}
                {loadingResources && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 size={32} className="animate-spin text-gray-900 mb-3" />
                    <p className="text-sm text-gray-500">Curating best resources...</p>
                  </div>
                )}

                {/* Resources List */}
                {!loadingResources && nodeResources[selectedNode.id] && (
                  <div className="space-y-8">
                    {/* Free Resources */}
                    {nodeResources[selectedNode.id].freeResources?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="px-3 py-1 rounded-full border border-green-500 text-green-700 text-xs font-bold bg-green-50 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> // Heart icon replacement
                            Free Resources
                          </span>
                          <div className="h-px bg-green-500 flex-1"></div>
                        </div>
                        
                        <div className="space-y-3">
                          {nodeResources[selectedNode.id].freeResources.map((resource, idx) => (
                            <div key={idx} className="flex items-start gap-3 group">
                              <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold mt-0.5 ${
                                resource.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-400 text-black'
                              }`}>
                                {resource.type === 'video' ? 'Video' : 'Article'}
                              </span>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 font-medium hover:text-blue-600 hover:underline leading-snug"
                              >
                                {resource.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Premium Resources */}
                    {nodeResources[selectedNode.id].premiumResources?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="px-3 py-1 rounded-full border border-purple-500 text-purple-700 text-xs font-bold bg-purple-50 flex items-center gap-1">
                            <Sparkles size={12} />
                            Premium Resources
                          </span>
                          <div className="h-px bg-purple-500 flex-1"></div>
                        </div>

                        <div className="space-y-3">
                          {nodeResources[selectedNode.id].premiumResources.map((resource, idx) => (
                            <div key={idx} className="flex items-start gap-3 group">
                              <span className="flex-shrink-0 px-2 py-0.5 bg-yellow-400 text-black rounded text-xs font-bold mt-0.5">
                                Course
                              </span>
                              {resource.discount && (
                                <span className="flex-shrink-0 px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs font-bold mt-0.5">
                                  {resource.discount}
                                </span>
                              )}
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 font-medium hover:text-blue-600 hover:underline leading-snug"
                              >
                                {resource.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer Box */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                      <button 
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        onClick={(e) => e.target.closest('div').style.display = 'none'}
                      >
                        <span className="sr-only">Close</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Note on Premium Resources</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        These are optional paid resources vetted by the roadmap team. 
                        If you purchase a resource, we may receive a small commission at no extra cost to you. 
                        This helps us offset the costs of running this site and keep it free for everyone.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Action Button */}
                <div className="pt-4">
                  <button
                    onClick={() => toggleNodeProgress(selectedNode.id)}
                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                      completedNodes[selectedNode.id]
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-white border-gray-200 text-gray-900 hover:border-gray-900"
                    }`}
                  >
                    {completedNodes[selectedNode.id] ? (
                      <>
                        <CheckCircle size={18} />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle size={18} />
                        Mark as Complete
                      </>
                    )}
                  </button>
                </div>
                  </>
                ) : (
                  /* Chat Interface */
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-6 pb-4">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-12 text-stone-500">
                          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles size={32} className="text-stone-400" />
                          </div>
                          <p className="text-lg font-serif font-medium text-stone-900 mb-2">Ask AI Tutor</p>
                          <p className="text-sm max-w-[200px] mx-auto leading-relaxed">
                            I can help you understand <span className="font-semibold text-stone-900">{selectedNode.label}</span> better. Ask me anything!
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              msg.role === "user" ? "bg-stone-900 text-white" : "bg-yellow-400 text-black"
                            }`}>
                              {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              msg.role === "user" 
                                ? "bg-stone-900 text-white rounded-tr-none" 
                                : "bg-white border border-stone-200 text-stone-800 rounded-tl-none"
                            }`}>
                              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-stone-900 prose-pre:text-stone-50">
                                <ReactMarkdown 
                                  components={{
                                    code({node, inline, className, children, ...props}) {
                                      return !inline ? (
                                        <div className="bg-stone-900 text-stone-50 p-3 rounded-lg my-2 overflow-x-auto text-xs font-mono">
                                          {children}
                                        </div>
                                      ) : (
                                        <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded font-mono text-xs" {...props}>
                                          {children}
                                        </code>
                                      )
                                    }
                                  }}
                                >
                                  {msg.content || ""}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      {isChatLoading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center flex-shrink-0">
                            <Sparkles size={14} />
                          </div>
                          <div className="bg-white border border-stone-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="sticky bottom-0 bg-[#fbf7f1] pt-4 border-t border-stone-200">
                      <div className="relative">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Ask a question..."
                          className="w-full bg-white border border-stone-300 rounded-xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 shadow-sm transition-all placeholder:text-stone-400"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim() || isChatLoading}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-900 text-white rounded-lg disabled:opacity-50 hover:bg-stone-800 transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}

export default RoadmapGenerator;
