import { useState } from "react";
import GeneratorLayout from "../components/ai/GeneratorLayout.jsx";
import { aiGenerate } from "../utils/api.js";

function AiTutor() {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("course");
  const [answerQuestions, setAnswerQuestions] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await aiGenerate(format, { topic, answerQuestions });
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "AI tutor is unavailable right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GeneratorLayout
      title="What can I help you learn?"
      subtitle="Enter a topic below to generate a personalized roadmap, guide, or course."
      topic={topic}
      setTopic={setTopic}
      placeholder="Enter a topic, e.g. Fullstack Web, Data Engineering, GenAI"
      formats={[
        { id: "course", label: "Course", icon: "📚" },
        { id: "guide", label: "Guide", icon: "📄" },
        { id: "roadmap", label: "Roadmap", icon: "🗺️" },
      ]}
      activeFormat={format}
      setActiveFormat={setFormat}
      answerQuestions={answerQuestions}
      setAnswerQuestions={setAnswerQuestions}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      {result && (
        <div className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold text-textPrimary">
            {result.title}
          </h2>
          {result.description && (
            <p className="text-textSecondary">{result.description}</p>
          )}
        </div>
      )}
    </GeneratorLayout>
  );
}

export default AiTutor;


