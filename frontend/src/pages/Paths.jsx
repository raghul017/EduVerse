import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { usePostStore, usePathStore } from "../state/store.js";
import PathCard from "../components/paths/PathCard.jsx";

function Paths() {
  const { posts, fetchFeed } = usePostStore();
  const { paths, fetchPaths } = usePathStore();
  const [form, setForm] = useState({
    title: "",
    subject: "",
    level: "",
    description: "",
  });
  const [lessons, setLessons] = useState([]); // { postId, resources }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!posts.length) {
      fetchFeed(true);
    }
    if (!paths.length) {
      fetchPaths();
    }
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAddLesson = (postId) => {
    if (lessons.find((lesson) => lesson.postId === postId)) return;
    setLessons([...lessons, { postId, resources: "" }]);
  };

  const handleRemoveLesson = (postId) => {
    setLessons(lessons.filter((lesson) => lesson.postId !== postId));
  };

  const handleResourcesChange = (postId, value) => {
    setLessons(
      lessons.map((lesson) =>
        lesson.postId === postId ? { ...lesson, resources: value } : lesson
      )
    );
  };

  const handleCreatePath = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.title.trim() || !lessons.length) {
      setError("Provide a title and at least one lesson.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        subject: form.subject.trim() || null,
        level: form.level.trim() || null,
        lessons: lessons.map((lesson) => ({
          postId: lesson.postId,
          resources: lesson.resources?.trim() || null,
        })),
      };
      await api.post("/paths", payload);
      setForm({ title: "", subject: "", level: "", description: "" });
      setLessons([]);
      setSuccess("Learning path created.");
      fetchPaths();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create learning path."
      );
    } finally {
      setSaving(false);
    }
  };

  const lessonsById = new Map(posts.map((post) => [post.id, post]));

  return (
    <div className="space-y-8">
      <section className="bg-card border border-border rounded-3xl p-8 shadow-card space-y-3">
        <p className="text-sm uppercase tracking-wide text-textSecondary">
          Roadmaps
        </p>
        <h1 className="text-3xl font-semibold text-textPrimary">
          Build structured learning paths.
        </h1>
        <p className="text-textSecondary text-base">
          Combine your videos into ordered paths and add recommended materials
          for each step.
        </p>
      </section>

      {paths.length > 0 && (
        <section className="bg-card border border-border rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-textSecondary">
                Existing paths
              </p>
              <h2 className="text-xl font-semibold text-textPrimary">
                Your learning roadmaps
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {paths.map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-[minmax(0,1.2fr),minmax(0,1.3fr)] gap-6 items-start">
        <form
          onSubmit={handleCreatePath}
          className="bg-card border border-border rounded-3xl p-6 shadow-card space-y-4"
        >
          <div>
            <p className="text-sm uppercase tracking-wide text-textSecondary">
              Create new path
            </p>
            <p className="text-textSecondary text-sm">
              Define the topic, level, and description, then pick lessons from
              your library.
            </p>
          </div>
          <label className="text-sm text-textSecondary space-y-1 block">
            Title
            <input
              className="ev-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Intro to Web Development"
            />
          </label>
          <label className="text-sm text-textSecondary space-y-1 block">
            Subject
            <input
              className="ev-input"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Programming"
            />
          </label>
          <label className="text-sm text-textSecondary space-y-1 block">
            Level
            <input
              className="ev-input"
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="Beginner / Intermediate / Advanced"
            />
          </label>
          <label className="text-sm text-textSecondary space-y-1 block">
            Description
            <textarea
              className="ev-input min-h-[120px]"
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will learners achieve by completing this path?"
            />
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          {success && <p className="text-sm text-success">{success}</p>}
          <button
            type="submit"
            className="ev-button ev-button--primary w-full"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create path"}
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-3xl p-4 shadow-card">
            <p className="text-sm font-semibold text-textPrimary mb-2">
              Available lessons
            </p>
            <p className="text-xs text-textSecondary mb-3">
              Add videos from your library into this path.
            </p>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-textPrimary line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-textSecondary">
                      {post.subject || "General"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs px-3 py-1 rounded-full border border-border text-textSecondary hover:border-accent"
                    onClick={() => handleAddLesson(post.id)}
                  >
                    Add
                  </button>
                </div>
              ))}
              {!posts.length && (
                <p className="text-xs text-textSecondary">
                  Upload some videos first to create a path.
                </p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-4 shadow-card">
            <p className="text-sm font-semibold text-textPrimary mb-2">
              Path outline
            </p>
            <p className="text-xs text-textSecondary mb-3">
              Set the order and add recommended materials for each step.
            </p>
            {lessons.length ? (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {lessons.map((lesson, index) => {
                  const post = lessonsById.get(lesson.postId);
                  return (
                    <div
                      key={lesson.postId}
                      className="border border-border rounded-2xl p-3 space-y-2 bg-surface"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase text-textSecondary">
                            Step {index + 1}
                          </p>
                          <p className="text-sm font-medium text-textPrimary line-clamp-1">
                            {post?.title || "Lesson"}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-danger"
                          onClick={() => handleRemoveLesson(lesson.postId)}
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        className="ev-input min-h-[64px]"
                        rows={2}
                        placeholder="Links or notes: e.g. article, docs, exercises for this step."
                        value={lesson.resources}
                        onChange={(event) =>
                          handleResourcesChange(
                            lesson.postId,
                            event.target.value
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-textSecondary">
                No lessons added yet. Use the list above to add videos.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Paths;
