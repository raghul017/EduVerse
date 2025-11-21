import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import GeneratorLayout from "../components/ai/GeneratorLayout.jsx";
import { aiGenerate } from "../utils/api.js";

function RoadmapGenerator() {
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState("");
  const [answerQuestions, setAnswerQuestions] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const data = await aiGenerate("roadmap", { topic: topicToGenerate, answerQuestions });
      setRoadmap(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "AI roadmap generator is unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    generateRoadmap(topic);
  };

  const stages = roadmap?.stages || [];

  return (
    <GeneratorLayout
      title="AI Roadmap Generator"
      subtitle="Generate a step-by-step learning roadmap from beginner to advanced."
      topic={topic}
      setTopic={setTopic}
      placeholder="e.g. DevOps Engineer, Mobile Developer, Data Engineer"
      formats={[{ id: "roadmap", label: "Roadmap", icon: "🗺️" }]}
      activeFormat="roadmap"
      setActiveFormat={() => {}}
      answerQuestions={answerQuestions}
      setAnswerQuestions={setAnswerQuestions}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      {roadmap && (
        <div className="mt-10 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-2">
            <h2 className="text-2xl font-semibold text-textPrimary">
              {roadmap.title}
            </h2>
            {roadmap.description && (
              <p className="text-textSecondary">{roadmap.description}</p>
            )}
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-full">
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="flex-1 min-w-[220px] bg-card border border-border rounded-lg p-4 space-y-3"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-textSecondary mb-1">
                      Stage {index + 1}
                    </p>
                    <h3 className="text-sm font-semibold text-textPrimary">
                      {stage.label}
                    </h3>
                    {stage.summary && (
                      <p className="text-xs text-textSecondary mt-1">
                        {stage.summary}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {stage.nodes?.map((node) => (
                      <div
                        key={node.id}
                        className="border border-border rounded-md p-3 bg-surface space-y-1"
                      >
                        <p className="text-sm font-semibold text-textPrimary">
                          {node.label}
                        </p>
                        {node.details && (
                          <p className="text-xs text-textSecondary whitespace-pre-wrap">
                            {node.details}
                          </p>
                        )}
                        {node.dependsOn?.length > 0 && (
                          <p className="text-[10px] text-textSecondary mt-1">
                            Depends on: {node.dependsOn.join(", ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </GeneratorLayout>
  );
}

export default RoadmapGenerator;
