import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api.js";

const presetRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
];

function AiRoadmap() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const [role, setRole] = useState(roleParam || "Frontend Developer");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStages, setExpandedStages] = useState(new Set());
  const [completedNodes, setCompletedNodes] = useState(new Set());

  useEffect(() => {
    if (roleParam && roleParam !== role) {
      setRole(roleParam);
    }
  }, [roleParam]);

  useEffect(() => {
    // Auto-generate if role param is present and we don't have a roadmap yet
    if (roleParam && roleParam.trim() && !roadmap && !loading) {
      const generate = async () => {
        setLoading(true);
        setError(null);
        setRoadmap(null);
        setExpandedStages(new Set());
        setCompletedNodes(new Set());
        try {
          const { data } = await api.post("/paths/ai-roadmap", {
            role: roleParam,
          });
          setRoadmap(data.data);
          if (data.data?.stages?.[0]?.id) {
            setExpandedStages(new Set([data.data.stages[0].id]));
          }
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "AI roadmap is unavailable right now."
          );
        } finally {
          setLoading(false);
        }
      };
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleParam]);

  const handleGenerate = async (event, roleToUse = null) => {
    if (event) event.preventDefault();
    const targetRole = roleToUse || role;
    if (!targetRole.trim()) return;
    setLoading(true);
    setError(null);
    setRoadmap(null);
    setExpandedStages(new Set());
    setCompletedNodes(new Set());
    try {
      const { data } = await api.post("/paths/ai-roadmap", {
        role: targetRole,
      });
      console.log("AI roadmap response", data.data);
      setRoadmap(data.data);
      // Auto-expand first stage
      if (data.data?.stages?.[0]?.id) {
        setExpandedStages(new Set([data.data.stages[0].id]));
      }
    } catch (err) {
      console.error("AI roadmap error:", err);
      setError(
        err.response?.data?.message || "AI roadmap is unavailable right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleStage = (stageId) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  const toggleNodeComplete = (nodeId) => {
    const newCompleted = new Set(completedNodes);
    if (newCompleted.has(nodeId)) {
      newCompleted.delete(nodeId);
    } else {
      newCompleted.add(nodeId);
    }
    setCompletedNodes(newCompleted);
  };

  const stages = roadmap?.stages || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="ev-card p-8 space-y-4 animate-slide-up">
        <p className="text-sm uppercase tracking-wide text-accent">
          AI Roadmap Generator
        </p>
        <h1 className="text-3xl font-semibold text-textPrimary">
          {roadmap ? roadmap.title : "Generate a learning roadmap with AI"}
        </h1>
        <p className="text-textSecondary text-base">
          Pick a role and let the AI draft a step-by-step roadmap, grouped into
          stages, similar to roadmap.sh.
        </p>
        <form onSubmit={handleGenerate} className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {presetRoles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                  role === r
                    ? "bg-accent text-background border-accent"
                    : "bg-card border-border text-textSecondary hover:border-accent"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Enter any role, e.g. DevOps Engineer or Mobile Developer"
              className="flex-1 min-w-[220px] ev-input rounded-full px-4 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="ev-button ev-button--primary px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate roadmap"}
            </button>
          </div>
        </form>
        {error && <p className="text-sm text-danger mt-2">{error}</p>}
      </section>

      {roadmap && (
        <section className="space-y-6">
          {roadmap.description && (
            <div className="ev-card p-6 space-y-2">
              <p className="text-sm text-textSecondary">
                {roadmap.description}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {stages.map((stage, stageIndex) => {
              const isExpanded = expandedStages.has(stage.id);
              const stageNodes = stage.nodes || [];
              const completedInStage = stageNodes.filter((n) =>
                completedNodes.has(n.id)
              ).length;
              const progressPercent =
                stageNodes.length > 0
                  ? (completedInStage / stageNodes.length) * 100
                  : 0;

              return (
                <div
                  key={stage.id}
                  className="ev-card p-6 space-y-4 hover-lift transition-smooth animate-slide-up"
                  style={{ animationDelay: `${stageIndex * 0.1}s` }}
                >
                  <button
                    type="button"
                    onClick={() => toggleStage(stage.id)}
                    className="w-full flex items-center justify-between text-left transition-smooth hover:opacity-80"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs uppercase tracking-wide text-accent">
                          Stage {stageIndex + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-textPrimary">
                          {stage.label}
                        </h3>
                      </div>
                      {stage.summary && (
                        <p className="text-sm text-textSecondary">
                          {stage.summary}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-textSecondary">
                          {completedInStage}/{stageNodes.length}
                        </span>
                      </div>
                    </div>
                    <div className="text-textSecondary text-xl">
                      {isExpanded ? "−" : "+"}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 pt-2 border-t border-border">
                      {stageNodes.map((node, nodeIndex) => {
                        const isCompleted = completedNodes.has(node.id);
                        const dependenciesMet =
                          !node.dependsOn ||
                          node.dependsOn.length === 0 ||
                          node.dependsOn.every((depId) =>
                            completedNodes.has(depId)
                          );

                        return (
                          <div
                            key={node.id}
                            className={`border rounded-lg p-4 space-y-2 transition-smooth hover-lift ${
                              isCompleted
                                ? "border-success bg-success/5"
                                : dependenciesMet
                                ? "border-border bg-card hover:border-accent"
                                : "border-border/50 bg-surface/50 opacity-60"
                            }`}
                            style={{ animationDelay: `${nodeIndex * 0.05}s` }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleNodeComplete(node.id)}
                                    disabled={!dependenciesMet}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth animate-scale-in ${
                                      isCompleted
                                        ? "border-success bg-success text-background"
                                        : dependenciesMet
                                        ? "border-border hover:border-accent hover:scale-110"
                                        : "border-border/50 cursor-not-allowed"
                                    }`}
                                  >
                                    {isCompleted && "✓"}
                                  </button>
                                  <p className="text-sm font-semibold text-textPrimary">
                                    {node.label}
                                  </p>
                                </div>
                                {node.details && (
                                  <p className="text-xs text-textSecondary whitespace-pre-wrap ml-7">
                                    {node.details}
                                  </p>
                                )}
                                {node.dependsOn?.length > 0 && (
                                  <p className="text-[10px] text-textSecondary mt-2 ml-7">
                                    Depends on: {node.dependsOn.join(", ")}
                                    {!dependenciesMet &&
                                      " (Complete prerequisites first)"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {stageNodes.length === 0 && (
                        <p className="text-sm text-textSecondary text-center py-4">
                          No nodes in this stage
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {!stages.length && (
              <div className="ev-card p-6 text-center">
                <p className="text-sm text-textSecondary">
                  AI returned an empty roadmap.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default AiRoadmap;
