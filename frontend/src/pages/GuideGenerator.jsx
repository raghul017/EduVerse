import { useState } from "react";
import GeneratorLayout from "../components/ai/GeneratorLayout.jsx";
import { aiGenerate } from "../utils/api.js";

function GuideGenerator() {
  const [topic, setTopic] = useState("");
  const [answerQuestions, setAnswerQuestions] = useState(false);
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setGuide(null);
    try {
      const data = await aiGenerate("guide", { topic, answerQuestions });
      setGuide(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "AI guide generator is unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  const chapters = guide?.chapters || [];

  return (
    <GeneratorLayout
      title="AI Guide Generator"
      subtitle="Generate a structured learning guide with chapters, explanations, and exercises."
      topic={topic}
      setTopic={setTopic}
      placeholder="e.g. Intro to Databases, Getting started with React"
      formats={[{ id: "guide", label: "Guide", icon: "📄" }]}
      activeFormat="guide"
      setActiveFormat={() => {}}
      answerQuestions={answerQuestions}
      setAnswerQuestions={setAnswerQuestions}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      {guide && (
        <div className="mt-10 space-y-6">
          <div className="bg-white/5 border border-white/10  p-6 space-y-2 ">
            <h2 className="text-2xl font-semibold text-white">
              {guide.title}
            </h2>
            {guide.description && (
              <p className="text-slate-400">{guide.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white/5 border border-white/10  p-4 space-y-2 "
              >
                <h3 className="text-sm font-semibold text-white">
                  {chapter.title}
                </h3>
                {chapter.explanation && (
                  <p className="text-sm text-slate-400">
                    {chapter.explanation}
                  </p>
                )}
                {chapter.examples?.length > 0 && (
                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-400">Examples</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {chapter.examples.map((ex, idx) => (
                        <li key={idx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {chapter.exercises?.length > 0 && (
                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-400">Exercises</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {chapter.exercises.map((ex, idx) => (
                        <li key={idx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </GeneratorLayout>
  );
}

export default GuideGenerator;


