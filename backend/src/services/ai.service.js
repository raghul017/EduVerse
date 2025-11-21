import NodeCache from "node-cache";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/environment.js";

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

class AIService {
  constructor() {
    this.groq = env.groqApiKey ? new Groq({ apiKey: env.groqApiKey }) : null;
    this.genAI = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;
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
    if (!this.groq) throw new Error("Groq API key not configured");

    const models = {
      fast: "llama-3.3-70b-versatile", // Updated to latest supported model
      smart: "llama-3.3-70b-versatile",
      balanced: "mixtral-8x7b-32768",
    };
    const model = models[priority] || models.fast;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: model,
        temperature: 0.7,
        max_tokens: 8192, // Increased to handle large roadmap JSON
      });
      
      if (!completion.choices || completion.choices.length === 0) {
        throw new Error("No choices returned from Groq");
      }
      
      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty content returned from Groq");
      }
      
      return content;
    } catch (error) {
      console.error("[AI Service] Groq error:", error.message);
      throw new Error(`Groq error: ${error.message}`);
    }
  }

  async callGemini(prompt) {
    if (!this.genAI) throw new Error("Gemini API key not configured");

    try {
      // Fallback to gemini-1.5-flash
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("[AI Service] Gemini error:", error.message);
      throw new Error(`Gemini error: ${error.message}`);
    }
  }

  async callAI(prompt, priority = "fast") {
    console.log(`[AI Service] Calling AI with priority: ${priority}`);
    console.log(`[AI Service] Groq Key Present: ${!!this.groq}, Request Count: ${this.groqRequestCount}`);
    
    let groqError = null;
    let geminiError = null;

    // Try Groq first
    if (this.groq && this.canUseGroq()) {
      try {
        const result = await this.callGroq(prompt, priority);
        if (result && result.trim().length > 0) {
          console.log(`[AI Service] Groq success`);
          return result;
        }
        throw new Error("Empty response from Groq");
      } catch (error) {
        console.warn(`[AI Service] Groq failed: ${error.message}. Falling back to Gemini...`);
        groqError = error.message;
      }
    } else if (!this.groq) {
      groqError = "Groq API key not configured";
    }

    // Fallback to Gemini
    if (this.genAI) {
      try {
        const result = await this.callGemini(prompt);
        if (result && result.trim().length > 0) {
          console.log(`[AI Service] Gemini success`);
          return result;
        }
        throw new Error("Empty response from Gemini");
      } catch (error) {
        console.warn(`[AI Service] Gemini failed: ${error.message}`);
        geminiError = error.message;
      }
    } else {
      geminiError = "Gemini API key not configured";
    }

    const errorMsg = `All AI providers failed. Groq: ${groqError}, Gemini: ${geminiError}`;
    console.error(`[AI Service] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  async summarize(postId, transcript) {
    const cacheKey = `summary_${postId}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);
    
    const prompt = `Summarize this educational content in 3 clear sentences:\n\n${transcript.substring(0, 3000)}`;
    
    try {
      const summary = await this.callAI(prompt, "fast");
      cache.set(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error("[AI Service] Summarize error:", error.message);
      return "AI summary is currently unavailable.";
    }
  }

  async quiz(postId, transcript) {
    const cacheKey = `quiz_${postId}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);
    
    const prompt = `Create a 3-question multiple choice quiz based on this content. Return ONLY valid JSON (no markdown):
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]

Content: ${transcript.substring(0, 2000)}`;

    try {
      const text = await this.callAI(prompt, "fast");
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const quiz = JSON.parse(jsonStr);
      cache.set(cacheKey, quiz);
      return Array.isArray(quiz) ? quiz : [];
    } catch (error) {
      console.warn("AI quiz parse failed", error.message);
      return [];
    }
  }

  async flashcards(postId, transcript) {
    const cacheKey = `flashcards_${postId}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);
    
    const prompt = `Create 5 flashcards from this content. Return ONLY valid JSON (no markdown):
[
  {
    "front": "Question or term",
    "back": "Answer or definition"
  }
]

Content: ${transcript.substring(0, 2000)}`;

    try {
      const text = await this.callAI(prompt, "fast");
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const flashcards = JSON.parse(jsonStr);
      cache.set(cacheKey, flashcards);
      return Array.isArray(flashcards) ? flashcards : [];
    } catch (error) {
      console.warn("AI flashcards parse failed", error.message);
      return [];
    }
  }

  async explain(question, context) {
    const prompt = `Answer this question clearly for a beginner:\n\nQuestion: ${question}\n\nContext: ${context.substring(0, 1500)}`;
    
    try {
      return await this.callAI(prompt, "fast");
    } catch (error) {
      return "AI explanation is currently unavailable.";
    }
  }

  async generateRoadmap(role) {
    const key = role.trim().toLowerCase();
    const cacheKey = `roadmap_${key}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`[AI Service] Returning cached roadmap for: ${role}`);
      return cached;
    }

    console.log(`[AI Service] Generating detailed roadmap for role: ${role}`);
    
    const prompt = `You are an expert career advisor. Create a COMPREHENSIVE learning roadmap for becoming a ${role}, similar to roadmap.sh quality.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "${role} Learning Roadmap",
  "description": "A comprehensive path to master ${role}",
  "stages": [
    {
      "id": "unique-id",
      "label": "Stage Name",
      "summary": "What you'll learn in this stage",
      "nodes": [
        {
          "id": "node-id",
          "label": "Specific Topic/Skill",
          "details": "What to learn, recommended resources, estimated time",
          "dependsOn": []
        }
      ]
    }
  ]
}

Requirements:
- Create AT LEAST 6-8 stages covering: Fundamentals, Core Skills, Tools & Environment, Frameworks/Libraries, Testing, Deployment, Best Practices, Advanced Topics
- Each stage should have 5-8 VERY SPECIFIC nodes
- Mention exact technologies, tools, frameworks, courses
- Include time estimates (e.g., "2-3 weeks", "1 month")
- Add logical dependencies between nodes
- Make it as detailed as roadmap.sh - cover EVERYTHING needed

Be very specific and comprehensive!`;

    try {
      const aiResponse = await this.callAI(prompt, "smart");
      console.log(`[AI Service] Raw roadmap response length: ${aiResponse.length}`);
      
      let parsed;
      try {
        // Clean up markdown if present
        let cleanResponse = aiResponse.replace(/```json|```/g, "").trim();
        // Find the first { and last } to extract JSON
        const firstBrace = cleanResponse.indexOf('{');
        const lastBrace = cleanResponse.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
          throw new Error("No JSON object found in response");
        }
        
        const jsonStr = cleanResponse.substring(firstBrace, lastBrace + 1);
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error(`[AI Service] JSON parse error: ${parseError.message}`);
        console.error(`[AI Service] Raw response (first 500): ${aiResponse.substring(0, 500)}`);
        throw new Error(`Failed to parse AI response: ${parseError.message}`);
      }

      if (!parsed?.title || !parsed?.stages || !Array.isArray(parsed.stages)) {
        console.error(`[AI Service] Invalid roadmap structure`);
        throw new Error("Invalid roadmap structure received from AI");
      }

      console.log(`[AI Service] Successfully generated roadmap with ${parsed.stages.length} stages`);
      cache.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error(`[AI Service] Roadmap generation error: ${error.message}`);
      // Return the error object so the controller can display it
      return { error: error.message };
    }
  }

  async generateCourse(topic) {
    const key = topic.trim().toLowerCase();
    const cacheKey = `course_${key}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);

    const prompt = `Create a detailed course outline for: ${topic}

Return ONLY valid JSON (no markdown) with this structure:
{
  "title": "Course Title",
  "description": "Course description",
  "modules": [
    {
      "id": "module-id",
      "title": "Module Title",
      "description": "What this module covers",
      "lessons": [
        {
          "id": "lesson-id",
          "title": "Lesson Title",
          "description": "Lesson content",
          "duration": "30 min"
        }
      ]
    }
  ]
}

Make it comprehensive with 5-8 modules, each with 4-6 lessons.`;

    try {
      const aiResponse = await this.callAI(prompt, "smart");
      let cleanResponse = aiResponse.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : cleanResponse;
      const parsed = JSON.parse(jsonStr);
      
      if (!parsed?.modules || !Array.isArray(parsed.modules)) {
        return null;
      }
      
      cache.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error(`[AI Service] Course generation error: ${error.message}`);
      return null;
    }
  }

  async generateResources(topic, role) {
    const key = `${topic}-${role}`.trim().toLowerCase();
    const cacheKey = `resources_${key}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);

    const prompt = `Provide 5 high-quality, free learning resources for "${topic}" in the context of "${role}".
Return ONLY valid JSON (no markdown) with this structure:
{
  "resources": [
    {
      "title": "Resource Title",
      "type": "Article" | "Video" | "Course" | "Documentation",
      "url": "URL if known, otherwise empty string",
      "description": "Brief description of why this is useful"
    }
  ]
}
Prioritize official documentation, high-quality articles (e.g. MDN, web.dev, freeCodeCamp), and popular YouTube tutorials.`;

    try {
      const aiResponse = await this.callAI(prompt, "fast");
      let cleanResponse = aiResponse.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : cleanResponse;
      const parsed = JSON.parse(jsonStr);
      
      if (!parsed?.resources || !Array.isArray(parsed.resources)) {
        return { resources: [] };
      }
      
      cache.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error(`[AI Service] Resources generation error: ${error.message}`);
      return { resources: [] };
    }
  }
}

export const aiService = new AIService();
