import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  BookOpen,
  CheckCircle,
  Circle,
  ExternalLink,
  Video,
  FileText,
  Code,
  Sparkles,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { aiGenerate } from "../utils/api.js";
import api from "../utils/api.js";
import { motion, AnimatePresence } from "framer-motion";

function RoadmapGenerator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [progress, setProgress] = useState({});
  const [nodeResources, setNodeResources] = useState({});
  const [loadingResources, setLoadingResources] = useState(false);
  const roadmapRef = useRef(null);

  // Auto-generate roadmap when role query parameter is present
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setTopic(roleParam);
      generateRoadmap(roleParam);
    }
  }, [searchParams]);

  const generateRoadmap = async (topicToGenerate) => {
    if (!topicToGenerate?.trim()) return;
    setLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      const data = await aiGenerate("roadmap", {
        topic: topicToGenerate,
        answerQuestions: false,
      });

      // Ensure all nodes have valid IDs
      if (data?.stages) {
        data.stages.forEach((stage, stageIdx) => {
          if (!stage.id) stage.id = `stage-${stageIdx}`;
          if (stage.nodes) {
            stage.nodes.forEach((node, nodeIdx) => {
              if (!node.id) {
                node.id = `${stage.id}-node-${nodeIdx}`;
              }
            });
          }
        });
      }

      console.log("Generated roadmap:", data);
      setRoadmap(data);
    } catch (err) {
      console.error("Roadmap generation error:", err);
      setError(
        err.response?.data?.message ||
          "AI service is currently unavailable. Please try again."
      );
    } finally {
      setLoading(false);
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
    const roadmapText = JSON.stringify(roadmap, null, 2);
    const blob = new Blob([roadmapText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic}-roadmap.json`;
    a.click();
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
    const isCompleted = progress[node.id];
    const isSelected = selectedNode?.id === node.id;

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNodeClick(node)}
        className={`relative group flex items-center justify-between w-64 p-4 rounded-lg border-2 text-left transition-all 
        ${
          isCompleted
            ? "bg-green-100 border-green-600 shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]"
            : isSelected
            ? "bg-yellow-300 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black"
            : "bg-[#fffae5] border-gray-400 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-void border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-void animate-pulse" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Roadmap</h2>
          <p className="text-gray-600">
            AI is crafting a personalized learning path for <span className="font-semibold text-void">{topic}</span>...
          </p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 z-20 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/ai-roadmap")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {roadmap.title || `${topic} Developer`}
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">AI Generated</span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {roadmap.description || "Step-by-step guide to becoming a professional"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Roadmap Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8f9fa] relative custom-scrollbar">
          <div className="max-w-4xl mx-auto px-4 py-12 relative z-10 min-h-full">
            {/* Central Spine Line - Moved inside to grow with content */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-blue-300 transform -translate-x-1/2 z-0"></div>

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
                            stroke="#93c5fd" // blue-300
                            strokeWidth="2"
                            strokeDasharray="6 4"
                          />
                          {/* Dot at spine connection */}
                          <circle cx={isLeft ? 96 : 0} cy="24" r="3" fill="#3b82f6" />
                        </svg>
                        
                        {/* Node */}
                        <NodeCard
                          node={node}
                          progress={progress}
                          selectedNode={selectedNode}
                          onNodeClick={handleNodeClick}
                          onToggleProgress={toggleNodeProgress}
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
        </div>

        {/* Resources Sidebar */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[450px] bg-white border-l border-gray-200 shadow-2xl flex flex-col z-30 h-full flex-shrink-0"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-md text-sm font-medium">
                    <BookOpen size={16} />
                    Resources
                  </button>
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50">
                    <Sparkles size={16} />
                    AI Tutor
                    <span className="bg-yellow-400 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">New</span>
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
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
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
                      progress[selectedNode.id]
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-white border-gray-200 text-gray-900 hover:border-gray-900"
                    }`}
                  >
                    {progress[selectedNode.id] ? (
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RoadmapGenerator;
