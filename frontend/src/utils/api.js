import axios from "axios";
import { getToken } from "./auth.js";

const envUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const baseURL = envUrl.endsWith("/api") ? envUrl : `${envUrl || ""}/api`;

const api = axios.create({
  baseURL,
  timeout: 300000, // 5 minutes for video uploads
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("eduverse_token");
      localStorage.removeItem("eduverse_user");
    }
    return Promise.reject(error);
  }
);

// Generic AI generator helper
export async function aiGenerate(type, payload) {
  const { topic } = payload;
  if (!topic || !topic.trim()) {
    throw new Error("Topic is required");
  }

  if (type === "course") {
    const { data } = await api.post("/paths/ai-course", { topic });
    return data.data;
  }

  if (type === "roadmap") {
    console.log("[Frontend API] Calling AI roadmap with role:", topic, "detail:", payload?.detailLevel);
    try {
      const { data } = await api.post("/paths/ai-roadmap", { 
        role: topic,
        forceRegenerate: payload?.forceRegenerate || false,
        detailLevel: payload?.detailLevel || "standard"
      });
      console.log("[Frontend API] AI roadmap response:", data);
      return data;
    } catch (error) {
      console.error("[Frontend API] AI roadmap error:", error.response?.data || error.message);
      throw error;
    }
  }

  // For guides we currently synthesize a simple guide from the course endpoint
  if (type === "guide") {
    const { data } = await api.post("/paths/ai-course", { topic });
    const course = data.data;
    const chapters =
      course.modules?.map((mod) => ({
        id: mod.id,
        title: mod.title,
        explanation: mod.summary,
        examples: [],
        exercises: [],
      })) || [];
    return {
      title: course.title || `${topic} Guide`,
      description:
        course.description ||
        "Generated guide based on the AI course outline for this topic.",
      chapters,
    };
  }

  throw new Error(`Unsupported AI generation type: ${type}`);
}

// Simple helpers for future reuse
export async function fetchFeed(page = 1) {
  const { data } = await api.get("/posts", { params: { page } });
  return data.data || [];
}

export async function fetchRoadmaps() {
  const { data } = await api.get("/paths");
  return data.data || [];
}

export default api;

