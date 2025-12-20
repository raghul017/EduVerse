import { useState } from "react";
import GeneratorLayout from "../components/ai/GeneratorLayout.jsx";
import { aiGenerate } from "../utils/api.js";

function CourseGenerator() {
  const [topic, setTopic] = useState("");
  const [answerQuestions, setAnswerQuestions] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setCourse(null);
    try {
      const data = await aiGenerate("course", { topic, answerQuestions });
      setCourse(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "AI course generator is unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  const modules = course?.modules || [];

  return (
    <GeneratorLayout
      title="AI Course Generator"
      subtitle="Generate a complete course with modules, lessons, and resources."
      topic={topic}
      setTopic={setTopic}
      placeholder="e.g. React from Zero to Hero, Intro to Machine Learning"
      formats={[{ id: "course", label: "Course", icon: "📚" }]}
      activeFormat="course"
      setActiveFormat={() => {}}
      answerQuestions={answerQuestions}
      setAnswerQuestions={setAnswerQuestions}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      {course && (
        <div className="mt-10 space-y-6">
          <div className="bg-white/5 border border-white/10  p-6 space-y-2 ">
            <h2 className="text-2xl font-semibold text-white">
              {course.title}
            </h2>
            {course.description && (
              <p className="text-slate-400">{course.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white/5 border border-white/10  p-4 space-y-3 "
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Module
                  </p>
                  <h3 className="text-sm font-semibold text-white">
                    {mod.title}
                  </h3>
                  {mod.summary && (
                    <p className="text-xs text-slate-400 mt-1">
                      {mod.summary}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  {mod.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="border border-white/10  p-3 bg-white/5 space-y-1"
                    >
                      <p className="text-sm font-semibold text-white">
                        {lesson.title}
                      </p>
                      {lesson.objective && (
                        <p className="text-xs text-slate-400">
                          {lesson.objective}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GeneratorLayout>
  );
}

export default CourseGenerator;


