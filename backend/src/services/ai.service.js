import NodeCache from "node-cache";
import fetch from "node-fetch";
import { env } from "../config/environment.js";

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

class AIService {
  constructor() {
    this.groqRequestCount = 0;
    this.resetTime = Date.now() + 60 * 1000;
  }

  canUseGroq() {
    if (Date.now() > this.resetTime) {
      this.groqRequestCount = 0;
      this.resetTime = Date.now() + 60 * 1000;
    }
    if (this.groqRequestCount >= 30) {
      return false;
    }
    this.groqRequestCount += 1;
    return true;
  }

  async callGroq(prompt, priority = "fast") {
    const models = {
      fast: "llama-3.1-8b-instant",
      smart: "llama-3.1-70b-versatile",
      balanced: "mixtral-8x7b-32768",
    };
    const model = models[priority] || models.fast;
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.groqApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800,
          temperature: 0.7,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Groq error ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callGemini(prompt) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Gemini error ${response.status}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  async callAI(prompt, priority = "fast") {
    console.log(`[AI Service] Calling AI with priority: ${priority}, has Groq: ${!!env.groqApiKey}, has Gemini: ${!!env.geminiApiKey}`);
    
    if (env.groqApiKey && this.canUseGroq()) {
      try {
        const result = await this.callGroq(prompt, priority);
        console.log(`[AI Service] Groq success, response length: ${result?.length || 0}`);
        return result;
      } catch (error) {
        console.warn(`[AI Service] Groq failed: ${error.message}`, error);
      }
    }
    if (env.geminiApiKey) {
      try {
        const result = await this.callGemini(prompt);
        console.log(`[AI Service] Gemini success, response length: ${result?.length || 0}`);
        return result;
      } catch (error) {
        console.warn(`[AI Service] Gemini failed: ${error.message}`, error);
      }
    }
    throw new Error("No AI providers configured or all providers failed");
  }

  async summarize(postId, transcript) {
    const cacheKey = `summary_${postId}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);
    const prompt = `Summarize this educational content in 3 sentences:\n${transcript}`;
    const summary = await this.callAI(prompt, "fast");
    cache.set(cacheKey, summary);
    return summary;
  }

  async quiz(postId, transcript) {
    const cacheKey = `quiz_${postId}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);
    const prompt = `Create 3 JSON multiple choice questions using this content. Return [{"question":"...","options":["a","b","c","d"],"correct":0}]\n${transcript}`;
    let response;
    try {
      response = await this.callAI(prompt, "smart");
    } catch (error) {
      console.warn("AI quiz generation failed", error.message);
      return [];
    }
    try {
      const clean = response.replace(/```json|```/g, "").trim();
      const quiz = JSON.parse(clean);
      cache.set(cacheKey, quiz);
      return quiz;
    } catch (error) {
      console.warn("AI quiz JSON parse failed", error.message);
      return [];
    }
  }

  async flashcards(postId, transcript) {
    const cacheKey = `flashcards_${postId}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);
    const prompt = `Create 5 flashcards from this educational content. Return ONLY valid JSON array: [{"front":"question","back":"answer"}]\\n${transcript}`;
    let response;
    try {
      response = await this.callAI(prompt, "smart");
    } catch (error) {
      console.warn("AI flashcards generation failed", error.message);
      return [];
    }
    try {
      const clean = response.replace(/```json|```/g, "").trim();
      const cards = JSON.parse(clean);
      cache.set(cacheKey, cards);
      return cards;
    } catch (error) {
      console.warn("AI flashcards JSON parse failed", error.message);
      return [];
    }
  }

  async explain(question, context) {
    const prompt = `Explain the following question for a beginner.\nQuestion: ${question}\nContext:${context}`;
    return this.callAI(prompt, "fast");
  }

  async generateRoadmap(role) {
    const key = role.trim().toLowerCase();
    const cacheKey = `roadmap_${key}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`[AI Service] Returning cached roadmap for: ${role}`);
      return cached;
    }

    console.log(`[AI Service] Generating roadmap for role: ${role}`);
    const prompt = `You are an expert curriculum designer. Design a concise learning roadmap as JSON for the role: "${role}".

Return ONLY STRICT, VALID JSON in this exact shape (no commentary, no markdown, no extra keys):
{
  "title": "string",
  "description": "short overview of the role roadmap",
  "stages": [
    {
      "id": "string",
      "label": "string",
      "summary": "short description",
      "nodes": [
        {
          "id": "string",
          "label": "string",
          "details": "short single-line description (no line breaks, no bullet points)",
          "dependsOn": ["id", "id"]
        }
      ]
    }
  ]
}

IMPORTANT:
- Use double quotes for all keys and string values.
- Escape all internal double quotes as \", and all line breaks as \n.
- Do NOT include any markdown, backticks, or text before/after the JSON.
- Return ONLY the JSON object, nothing else.

Keep it under 6 stages and under 5 nodes per stage.`;

    let response;
    try {
      response = await this.callAI(prompt, "fast");
      console.log(`[AI Service] Raw AI response received, length: ${response?.length || 0}`);
      if (!response || typeof response !== "string") {
        console.warn("[AI Service] AI roadmap returned empty or non-string response");
        return null;
      }
    } catch (error) {
      console.error(`[AI Service] AI roadmap generation failed: ${error.message}`, error);
      return null;
    }

    try {
      const clean = response.replace(/```json|```/g, "").trim();
      console.log("[AI Service] Cleaned response (first 500 chars):", clean.slice(0, 500));
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      const jsonString = (jsonMatch ? jsonMatch[0] : clean).trim();
      console.log("[AI Service] Extracted JSON string (first 500 chars):", jsonString.slice(0, 500));
      
      const roadmap = JSON.parse(jsonString);
      console.log(`[AI Service] Successfully parsed roadmap with ${roadmap.stages?.length || 0} stages`);
      
      // Validate structure
      if (!roadmap.title || !roadmap.stages || !Array.isArray(roadmap.stages)) {
        console.warn("[AI Service] Invalid roadmap structure from AI");
        return null;
      }
      
      cache.set(cacheKey, roadmap);
      return roadmap;
    } catch (error) {
      console.error(`[AI Service] AI roadmap JSON parse failed: ${error.message}`, error);
      console.error("[AI Service] Response that failed to parse:", response?.slice(0, 1000));
      return null;
    }
  }

  async generateCourse(topic) {
    const key = topic.trim().toLowerCase();
    const cacheKey = `course_${key}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);

    const prompt = `You are an expert curriculum designer. Design a concise learning course as JSON for the topic: "${topic}".

Return ONLY STRICT, VALID JSON in this exact shape (no commentary, no markdown, no extra keys):
{
  "title": "string",
  "description": "short overview of the course",
  "modules": [
    {
      "id": "string",
      "title": "string",
      "summary": "short description",
      "lessons": [
        {
          "id": "string",
          "title": "string",
          "objective": "short single-line objective (no line breaks)",
          "suggestedResources": [
            {
              "type": "video | article | docs | exercise",
              "title": "string",
              "url": "string URL or empty string"
            }
          ]
        }
      ]
    }
  ]
}

IMPORTANT:
- Use double quotes for all keys and string values.
- Escape all internal double quotes as \", and all line breaks as \n.
- Do NOT include any markdown, backticks, or text before/after the JSON.

Keep it under 8 modules and under 6 lessons per module.`;

    let response;
    try {
      response = await this.callAI(prompt, "fast");
      if (!response || typeof response !== "string") {
        console.warn("AI course returned empty or non-string response");
        return null;
      }
    } catch (error) {
      console.warn("AI course generation failed", error.message);
      return null;
    }

    try {
      const clean = response.replace(/```json|```/g, "").trim();
      console.log("AI course raw response (trimmed)", clean.slice(0, 800));
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      const jsonString = (jsonMatch ? jsonMatch[0] : clean).trim();
      console.log(
        "AI course JSON string to parse (trimmed)",
        jsonString.slice(0, 800)
      );
      const course = JSON.parse(jsonString);
      cache.set(cacheKey, course);
      return course;
    } catch (error) {
      console.warn("AI course JSON parse failed", error.message);
      return null;
    }
  }

  getStatus() {
    return {
      groq: {
        canUse: this.canUseGroq(),
        resetIn: Math.max(0, this.resetTime - Date.now()),
      },
    };
  }
}

export const aiService = new AIService();
