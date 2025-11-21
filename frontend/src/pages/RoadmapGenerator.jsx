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
} from "lucide-react";
import { aiGenerate } from "../utils/api.js";
import api from "../utils/api.js";

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
      setError(
        err.response?.data?.message || "AI roadmap generator is unavailable."
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

      console.log("Parsed resources:", resources);

      setNodeResources((prev) => ({
        ...prev,
        [node.id]: resources,
      }));
    } catch (err) {
      console.error("Failed to generate resources:", err);
      console.error("Error details:", err.response?.data || err.message);

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
            {
              type: "course",
              title: `Learn ${node.label}`,
              platform: "freeCodeCamp",
              url: `https://www.freecodecamp.org/news/search?query=${searchQuery}`,
            },
          ],
          premiumResources: [
            {
              type: "course",
              title: `${node.label} Courses`,
              platform: "Udemy",
              url: `https://www.udemy.com/courses/search/?q=${searchQuery}`,
            },
          ],
        },
      }));
    } finally {
      setLoadingResources(false);
    }
  };

  const handleNodeClick = async (node) => {
    console.log("Node clicked:", node.label, "ID:", node.id);
    console.log("Existing resources:", nodeResources[node.id]);

    // Set selected node first to open the panel
    setSelectedNode(node);

    // Generate resources if they don't exist
    if (!nodeResources[node.id]) {
      await generateNodeResources(node);
    }
  };

  const handleDownload = () => {
    // Convert roadmap to downloadable format
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
      <button
        onClick={() => onNodeClick(node)}
        className={`relative px-6 py-4 rounded-xl border-2 transition-all text-center min-w-[200px] max-w-[280px] shadow-md hover:shadow-xl ${
          isCompleted
            ? "bg-green-50 border-green-500"
            : isSelected
            ? "bg-yellow-300 border-yellow-500"
            : "bg-yellow-100 border-yellow-400 hover:border-yellow-500"
        }`}
      >
        {/* Progress Indicator */}
        <div className="absolute -top-2 -right-2">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleProgress(node.id);
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isCompleted ? "bg-green-600" : "bg-white border-2 border-gray-300"
            }`}
          >
            {isCompleted && <CheckCircle size={16} className="text-white" />}
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-sm">{node.label}</h3>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-void mx-auto mb-4"></div>
          <p className="text-textSecondary text-lg">
            Generating your personalized roadmap...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-textPrimary mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-textSecondary mb-6">{error}</p>
          <button
            onClick={() => navigate("/ai-roadmap")}
            className="px-6 py-3 bg-void text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-textSecondary text-lg">No roadmap generated yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {roadmap.title || `${topic} Developer`}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {roadmap.description ||
                    "Step-by-step guide to becoming a professional"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download size={18} />
                <span className="text-sm font-medium">Download</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="flex gap-0">
        {/* Main Roadmap Canvas */}
        <div
          className={`flex-1 overflow-x-auto overflow-y-auto transition-all duration-300 ${
            selectedNode ? "mr-0" : ""
          }`}
        >
          <div className="min-w-[1000px] bg-gray-50 p-8" ref={roadmapRef}>
            {/* Flowchart Style Roadmap */}
            <div className="relative flex flex-col items-center space-y-12">
              {stages.map((stage, stageIndex) => (
                <div key={stage.id} className="w-full max-w-6xl">
                  {/* Stage Header Card */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-void to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg">
                      <h2 className="text-2xl font-bold text-center">
                        {stage.label}
                      </h2>
                      {stage.summary && (
                        <p className="text-sm text-white/90 text-center mt-1">
                          {stage.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nodes in Flowchart Layout */}
                  <div className="relative">
                    {/* Draw connecting lines */}
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      style={{ width: "100%", height: "100%", zIndex: 0 }}
                    >
                      {stage.nodes?.map((node, idx) => {
                        if (idx < stage.nodes.length - 1) {
                          return (
                            <line
                              key={`line-${node.id}`}
                              x1="50%"
                              y1={`${idx * 100 + 50}px`}
                              x2="50%"
                              y2={`${(idx + 1) * 100 + 50}px`}
                              stroke="#e5e7eb"
                              strokeWidth="2"
                              strokeDasharray="5,5"
                            />
                          );
                        }
                        return null;
                      })}
                    </svg>

                    {/* Nodes */}
                    <div className="space-y-8 relative z-10">
                      {stage.nodes?.map((node, nodeIndex) => {
                        const isEven = nodeIndex % 2 === 0;
                        const hasMultipleInRow =
                          stage.nodes.length > 3 &&
                          nodeIndex < stage.nodes.length - 1;

                        return (
                          <div
                            key={node.id}
                            className="flex justify-center items-center gap-4"
                          >
                            {/* Show multiple nodes in a row occasionally */}
                            {hasMultipleInRow &&
                            isEven &&
                            stage.nodes[nodeIndex + 1] ? (
                              <>
                                <NodeCard
                                  node={node}
                                  progress={progress}
                                  selectedNode={selectedNode}
                                  onNodeClick={handleNodeClick}
                                  onToggleProgress={toggleNodeProgress}
                                />
                                <NodeCard
                                  node={stage.nodes[nodeIndex + 1]}
                                  progress={progress}
                                  selectedNode={selectedNode}
                                  onNodeClick={handleNodeClick}
                                  onToggleProgress={toggleNodeProgress}
                                />
                              </>
                            ) : !hasMultipleInRow || !isEven ? (
                              <NodeCard
                                node={node}
                                progress={progress}
                                selectedNode={selectedNode}
                                onNodeClick={handleNodeClick}
                                onToggleProgress={toggleNodeProgress}
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Connection Arrow to Next Stage */}
                  {stageIndex < stages.length - 1 && (
                    <div className="flex justify-center my-12">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-12 bg-gradient-to-b from-purple-400 to-void"></div>
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-void"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel for Resources */}
        {selectedNode && (
          <div className="w-[480px] h-screen sticky top-0 bg-white border-l border-gray-200 shadow-2xl overflow-y-auto flex-shrink-0">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedNode.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Learn everything you need to know
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Description */}
              {(nodeResources[selectedNode.id]?.description ||
                selectedNode.details) && (
                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-gray-900">
                    How does {selectedNode.label} work?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {nodeResources[selectedNode.id]?.description ||
                      selectedNode.details}
                  </p>
                </div>
              )}

              {/* Prerequisites */}
              {selectedNode.dependsOn?.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Code size={16} />
                    Prerequisites
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {selectedNode.dependsOn.map((dep, idx) => (
                      <li key={idx}>• {dep}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources Section */}
              {loadingResources ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2
                      size={32}
                      className="animate-spin text-void mx-auto mb-3"
                    />
                    <p className="text-gray-600 text-sm flex items-center gap-2 justify-center">
                      <Sparkles size={16} className="text-void" />
                      AI is curating resources...
                    </p>
                  </div>
                </div>
              ) : nodeResources[selectedNode.id] ? (
                <div className="space-y-6">
                  {/* Free Resources */}
                  {nodeResources[selectedNode.id].freeResources?.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-green-600" />
                        <h4 className="text-base font-semibold text-gray-900">
                          Free Resources
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {nodeResources[selectedNode.id].freeResources.map(
                          (resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
                            >
                              <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                                {resource.type === "video" ? (
                                  <Video size={16} className="text-green-600" />
                                ) : resource.type === "course" ? (
                                  <BookOpen
                                    size={16}
                                    className="text-green-600"
                                  />
                                ) : (
                                  <FileText
                                    size={16}
                                    className="text-green-600"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm group-hover:text-void transition-colors">
                                  {resource.title}
                                </p>
                                {resource.platform && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {resource.platform}
                                  </p>
                                )}
                              </div>
                              <ExternalLink
                                size={14}
                                className="text-gray-400 group-hover:text-void transition-colors flex-shrink-0 mt-1"
                              />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Premium Resources */}
                  {nodeResources[selectedNode.id].premiumResources?.length >
                    0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={18} className="text-yellow-600" />
                          <h4 className="text-base font-semibold text-gray-900">
                            Premium Resources
                          </h4>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                          PAID
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Optional premium resources for in-depth learning
                      </p>
                      <div className="space-y-2">
                        {nodeResources[selectedNode.id].premiumResources.map(
                          (resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors group"
                            >
                              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                                {resource.type === "video" ? (
                                  <Video
                                    size={16}
                                    className="text-yellow-600"
                                  />
                                ) : resource.type === "course" ? (
                                  <BookOpen
                                    size={16}
                                    className="text-yellow-600"
                                  />
                                ) : (
                                  <FileText
                                    size={16}
                                    className="text-yellow-600"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm group-hover:text-void transition-colors">
                                  {resource.title}
                                </p>
                                {resource.platform && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {resource.platform}
                                  </p>
                                )}
                                {resource.discount && (
                                  <p className="text-xs text-green-600 mt-1 font-medium">
                                    {resource.discount}
                                  </p>
                                )}
                              </div>
                              <ExternalLink
                                size={14}
                                className="text-gray-400 group-hover:text-void transition-colors flex-shrink-0 mt-1"
                              />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Mark Complete Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleNodeProgress(selectedNode.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    progress[selectedNode.id]
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-void text-white hover:bg-opacity-90"
                  }`}
                >
                  {progress[selectedNode.id] ? (
                    <>
                      <CheckCircle size={18} />
                      Mark as Incomplete
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
          </div>
        )}
      </div>
    </div>
  );
}

export default RoadmapGenerator;
