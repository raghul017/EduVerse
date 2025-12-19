import NodeCache from "node-cache";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/environment.js";

// Cache for AI responses (24 hours) and usage tracking (25 hours to persist across day boundary)
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });
const usageCache = new NodeCache({ stdTTL: 60 * 60 * 25 }); // 25 hours to persist

class AIService {
  constructor() {
    this.groq = env.groqApiKey ? new Groq({ apiKey: env.groqApiKey }) : null;
    this.genAI = env.geminiApiKey
      ? new GoogleGenerativeAI(env.geminiApiKey)
      : null;

    // Rate limiting (per minute)
    this.groqRequestCount = 0;
    this.resetTime = Date.now() + 60 * 1000;

    // Daily usage tracking
    this.dailyUsage = {
      date: new Date().toDateString(),
      tokensUsed: 0,
      requestsCount: 0,
      roadmapsGenerated: 0,
      coursesGenerated: 0,
      resourcesGenerated: 0,
    };

    // Daily limits (Groq free tier)
    this.dailyLimits = {
      maxTokens: 100000, // 100K tokens per day
      maxRequests: 1000, // Generous request limit
      estimatedTokensPerRoadmap: 3000,
      estimatedTokensPerCourse: 2000,
      estimatedTokensPerResource: 500,
    };

    this.loadUsageFromCache();
  }

  loadUsageFromCache() {
    const cached = usageCache.get("daily_usage");
    if (cached && cached.date === new Date().toDateString()) {
      this.dailyUsage = cached;
      console.log(
        `[AI Service] Loaded usage from cache: ${cached.tokensUsed} tokens, ${cached.requestsCount} requests`
      );
    } else {
      console.log("[AI Service] Starting fresh usage tracking for today");
    }
  }

  saveUsageToCache() {
    usageCache.set("daily_usage", this.dailyUsage, 60 * 60 * 25); // 25 hours
    console.log(
      `[AI Service] Saved usage to cache: ${this.dailyUsage.tokensUsed} tokens`
    );
  }

  resetDailyUsageIfNeeded() {
    const today = new Date().toDateString();
    if (this.dailyUsage.date !== today) {
      console.log("[AI Service] Resetting daily usage for new day");
      this.dailyUsage = {
        date: today,
        tokensUsed: 0,
        requestsCount: 0,
        roadmapsGenerated: 0,
        coursesGenerated: 0,
        resourcesGenerated: 0,
      };
      this.saveUsageToCache();
    }
  }

  trackUsage(type, actualTokens) {
    this.resetDailyUsageIfNeeded();
    this.dailyUsage.tokensUsed += actualTokens;
    this.dailyUsage.requestsCount += 1;

    if (type === "roadmap") this.dailyUsage.roadmapsGenerated += 1;
    if (type === "course") this.dailyUsage.coursesGenerated += 1;
    if (type === "resource") this.dailyUsage.resourcesGenerated += 1;

    console.log(
      `[AI Service] Tracked ${actualTokens} tokens for ${type}. Total today: ${this.dailyUsage.tokensUsed}`
    );
    this.saveUsageToCache();
  }

  getUsageStats() {
    this.resetDailyUsageIfNeeded();

    const tokenLimit = this.dailyLimits.maxTokens;
    const tokensUsed = this.dailyUsage.tokensUsed;
    const tokensRemaining = Math.max(0, tokenLimit - tokensUsed);
    const percentageUsed = Math.min(100, (tokensUsed / tokenLimit) * 100);

    // Estimate remaining generations
    const roadmapsRemaining = Math.floor(
      tokensRemaining / this.dailyLimits.estimatedTokensPerRoadmap
    );
    const coursesRemaining = Math.floor(
      tokensRemaining / this.dailyLimits.estimatedTokensPerCourse
    );
    const resourcesRemaining = Math.floor(
      tokensRemaining / this.dailyLimits.estimatedTokensPerResource
    );

    // Calculate human-readable reset time
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hoursUntilReset = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntilReset = Math.floor(
      (diff % (1000 * 60 * 60)) / (1000 * 60)
    );
    const resetTimeString =
      hoursUntilReset > 0
        ? `${hoursUntilReset}h ${minutesUntilReset}m`
        : `${minutesUntilReset}m`;

    return {
      tokensUsed,
      dailyLimit: tokenLimit,
      remainingTokens: tokensRemaining,
      requestsCount: this.dailyUsage.requestsCount,
      roadmapsGenerated: this.dailyUsage.roadmapsGenerated,
      coursesGenerated: this.dailyUsage.coursesGenerated,
      resourcesGenerated: this.dailyUsage.resourcesGenerated,
      canGenerate: {
        roadmaps: roadmapsRemaining,
        courses: coursesRemaining,
        resources: resourcesRemaining,
      },
      resetTime: resetTimeString,
      percentageUsed: Math.round(percentageUsed * 10) / 10,
      status:
        percentageUsed >= 100
          ? "limit_reached"
          : percentageUsed >= 80
          ? "warning"
          : "ok",
    };
  }

  getNextResetTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }

  canMakeRequest(estimatedTokens = 1000) {
    this.resetDailyUsageIfNeeded();
    const remaining = this.dailyLimits.maxTokens - this.dailyUsage.tokensUsed;
    return remaining >= estimatedTokens;
  }

  canUseGroq() {
    const now = Date.now();
    if (now > this.resetTime) {
      console.log("[AI Service] Groq rate limit window reset");
      this.groqRequestCount = 0;
      this.resetTime = now + 60 * 1000;
    }
    // Groq free tier: 1000 RPM (requests per minute), using 500 to be safe
    if (this.groqRequestCount >= 500) {
      const secondsUntilReset = Math.ceil((this.resetTime - now) / 1000);
      console.log(
        `[AI Service] Groq rate limit reached (${this.groqRequestCount}/500 requests). Resets in ${secondsUntilReset}s`
      );
      return false;
    }
    this.groqRequestCount += 1;
    console.log(
      `[AI Service] Groq request ${this.groqRequestCount}/500 in current minute`
    );
    return true;
  }

  async callGroq(prompt, priority = "fast") {
    if (!this.groq) throw new Error("Groq API key not configured");

    const models = {
      fast: "llama-3.1-8b-instant", // 560 T/sec, cheaper
      smart: "llama-3.3-70b-versatile", // 280 T/sec, better quality
      balanced: "llama-3.1-8b-instant", // Fast and efficient
    };
    const model = models[priority] || models.fast;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: model,
        temperature: 0.7,
        max_tokens: 4096, // Reduced to stay under rate limits
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error("No choices returned from Groq");
      }

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty content returned from Groq");
      }

      // Track actual token usage from API response
      const tokensUsed = completion.usage?.total_tokens || 0;
      if (tokensUsed > 0) {
        console.log(`[AI Service] Groq API used ${tokensUsed} tokens`);
      }

      return { content, tokensUsed };
    } catch (error) {
      // Check if it's a rate limit error
      if (error.message && error.message.includes("rate_limit_exceeded")) {
        throw new Error(
          "Groq rate limit exceeded. Please try again in a few minutes."
        );
      }
      console.error("[AI Service] Groq error:", error.message);
      throw new Error(`Groq error: ${error.message}`);
    }
  }

  async callGemini(prompt) {
    if (!this.genAI) throw new Error("Gemini API key not configured");

    try {
      // Note: Google AI SDK currently uses v1beta endpoint which has limited model availability
      // If this fails, Groq will be used as the primary provider
      // You can get Gemini working by using the REST API directly or waiting for SDK updates

      const models = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"];

      let lastError = null;
      for (const modelName of models) {
        try {
          const model = this.genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          if (text && text.trim().length > 0) {
            console.log(`[AI Service] Gemini success with model: ${modelName}`);
            return text;
          }
        } catch (err) {
          lastError = err;
          // Only log error for the last model to reduce noise
          if (modelName === models[models.length - 1]) {
            console.warn(
              `[AI Service] All Gemini models failed. This is expected - Groq will be used instead.`
            );
          }
          continue;
        }
      }
      throw (
        lastError ||
        new Error(
          "Gemini models not available on v1beta endpoint. Using Groq as primary provider."
        )
      );
    } catch (error) {
      // Don't log as error since Groq is working fine
      throw new Error(`Gemini unavailable (v1beta API limitation)`);
    }
  }

  async callAI(prompt, priority = "fast") {
    console.log(`[AI Service] Calling AI with priority: ${priority}`);
    console.log(
      `[AI Service] Groq Key Present: ${!!this.groq}, Request Count: ${
        this.groqRequestCount
      }`
    );

    let groqError = null;
    let geminiError = null;

    // Try Groq first
    if (this.groq) {
      if (!this.canUseGroq()) {
        groqError =
          "Rate limit reached (100 requests/minute). Please wait a moment.";
        console.warn(`[AI Service] ${groqError}`);
      } else {
        try {
          const result = await this.callGroq(prompt, priority);
          if (result && result.content && result.content.trim().length > 0) {
            console.log(`[AI Service] Groq success`);
            return { content: result.content, tokensUsed: result.tokensUsed };
          }
          throw new Error("Empty response from Groq");
        } catch (error) {
          console.warn(
            `[AI Service] Groq failed: ${error.message}. Falling back to Gemini...`
          );
          groqError = error.message;
        }
      }
    } else {
      groqError = "Groq API key not configured";
    }

    // Fallback to Gemini
    if (this.genAI) {
      try {
        const result = await this.callGemini(prompt);
        if (result && result.trim().length > 0) {
          console.log(`[AI Service] Gemini success`);
          // Gemini doesn't provide token usage, estimate it
          const estimatedTokens = Math.ceil(result.length / 4);
          return { content: result, tokensUsed: estimatedTokens };
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

  async callAIWithRetry(prompt, priority = "fast", retries = 2) {
    let currentPriority = priority;
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await this.callAI(prompt, currentPriority);
      } catch (error) {
        if (i === retries) throw error;
        
        // Downgrade priority on retry to increase success chance
        if (currentPriority === "smart") currentPriority = "balanced";
        else if (currentPriority === "balanced") currentPriority = "fast";
        
        console.warn(
          `[AI Service] Attempt ${i + 1} failed. Retrying with ${currentPriority} model... (${error.message})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  validateAndFixUrl(url, topic) {
    // List of known valid resource domains
    const validDomains = [
      'youtube.com', 'youtu.be',
      'developer.mozilla.org', 'mdn.io',
      'freecodecamp.org', 'codecademy.com',
      'w3schools.com', 'geeksforgeeks.org',
      'stackoverflow.com', 'github.com',
      'medium.com', 'dev.to', 'hashnode.com',
      'udemy.com', 'coursera.org', 'edx.org',
      'pluralsight.com', 'skillshare.com',
      'khanacademy.org', 'brilliant.org',
      'learn.microsoft.com', 'docs.oracle.com',
      'reactjs.org', 'react.dev', 'vuejs.org', 'angular.io',
      'nodejs.org', 'python.org', 'rust-lang.org', 'go.dev',
      'digitalocean.com/community',
      'tutorialspoint.com', 'javatpoint.com',
      'roadmap.sh', 'leetcode.com', 'hackerrank.com'
    ];
    
    // Check if URL is valid and from a known domain
    if (url && typeof url === 'string' && url.startsWith('http')) {
      // Reject obviously fake URLs
      if (url.includes('example.com') || url === '#' || url.includes('placeholder')) {
        // Fall through to search generation
      } else {
        // Check if it's from a known valid domain
        const isValidDomain = validDomains.some(domain => url.includes(domain));
        if (isValidDomain) {
          return url; // Keep the real URL!
        }
        
        // Even if domain is unknown, if it looks like a real URL, keep it
        try {
          const parsed = new URL(url);
          if (parsed.hostname && parsed.hostname !== 'example.com') {
            return url; // Looks like a real URL
          }
        } catch {
          // Invalid URL, fall through
        }
      }
    }
    
    // Generate intelligent search URL as fallback
    const searchQuery = encodeURIComponent(topic);
    
    // If original URL mentioned video/YouTube, use YouTube search
    if (url && (url.includes('youtube') || url.includes('video'))) {
      return `https://www.youtube.com/results?search_query=${searchQuery}`;
    }
    
    // If it mentioned a course platform, use that platform's search
    if (url && url.includes('udemy')) {
      return `https://www.udemy.com/courses/search/?q=${searchQuery}`;
    }
    if (url && url.includes('coursera')) {
      return `https://www.coursera.org/search?query=${searchQuery}`;
    }
    
    // For documentation, try MDN first for web topics
    const webTopics = ['javascript', 'html', 'css', 'dom', 'web'];
    if (webTopics.some(t => topic.toLowerCase().includes(t))) {
      return `https://developer.mozilla.org/en-US/search?q=${searchQuery}`;
    }
    
    // Default: DuckDuckGo search (no tracking, cleaner)
    return `https://duckduckgo.com/?q=${searchQuery}+tutorial`;
  }

  async summarize(postId, transcript) {
    const cacheKey = `summary_${postId}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);

    const prompt = `Summarize this educational content in 3 clear sentences:\n\n${transcript.substring(
      0,
      3000
    )}`;

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
    const prompt = `Answer this question clearly for a beginner:\n\nQuestion: ${question}\n\nContext: ${context.substring(
      0,
      1500
    )}`;

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

    const prompt = `Generate a detailed learning roadmap for becoming a "${role}".

Return ONLY valid JSON with this structure:
{
  "title": "${role} Learning Roadmap",
  "description": "Brief overview of the roadmap.",
  "stages": [
    {
      "id": "stage-1",
      "label": "Stage Name",
      "summary": "Short, concise summary of this stage.",
      "nodes": [
        {
          "id": "node-1-1",
          "label": "Specific Topic/Skill",
          "details": "Concise explanation (max 1 sentence)."
        }
      ]
    }
  ]
}

Requirements:
1. Create 8-10 stages covering key areas (beginner to advanced).
2. Each stage MUST have 4-6 nodes.
3. Keep descriptions concise (max 10-15 words).
4. No markdown formatting or code blocks in the JSON output.
5. Mention exact technologies and tools where relevant.
6. Add logical dependencies between nodes if applicable.
7. IMPORTANT: For any external links/resources, use Google Search or YouTube Search URLs if you are not 100% sure of the direct link. Example: "https://www.google.com/search?q=topic"`;

    try {
      const aiResponse = await this.callAIWithRetry(prompt, "balanced");
      const actualTokens = aiResponse.tokensUsed || 0;
      const responseText = aiResponse.content;

      console.log(
        `[AI Service] Raw roadmap response length: ${responseText.length}, tokens: ${actualTokens}`
      );

      let parsed;
      try {
        // Clean up markdown if present
        let cleanResponse = responseText.replace(/```json|```/g, "").trim();
        // Find the first { and last } to extract JSON
        const firstBrace = cleanResponse.indexOf("{");
        const lastBrace = cleanResponse.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
          throw new Error("No JSON object found in response");
        }

        const jsonStr = cleanResponse.substring(firstBrace, lastBrace + 1);
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error(`[AI Service] JSON parse error: ${parseError.message}`);
        console.error(
          `[AI Service] Raw response (first 500): ${responseText.substring(
            0,
            500
          )}`
        );
        throw new Error(`Failed to parse AI response: ${parseError.message}`);
      }

      if (!parsed?.title || !parsed?.stages || !Array.isArray(parsed.stages)) {
        console.error(`[AI Service] Invalid roadmap structure`);
        throw new Error("Invalid roadmap structure received from AI");
      }

      console.log(
        `[AI Service] Successfully generated roadmap with ${parsed.stages.length} stages`
      );
      cache.set(cacheKey, parsed);
      this.trackUsage(
        "roadmap",
        actualTokens || this.dailyLimits.estimatedTokensPerRoadmap
      );
      return parsed;
    } catch (error) {
      console.error(`[AI Service] Roadmap generation error: ${error.message}`);
      // Don't cache errors - return error object so controller can display it
      // Clear any existing cache for this key to allow retry
      cache.del(cacheKey);
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
      const aiResponse = await this.callAIWithRetry(prompt, "balanced");
      const actualTokens = aiResponse.tokensUsed || 0;
      const responseText = aiResponse.content;

      let cleanResponse = responseText.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : cleanResponse;
      const parsed = JSON.parse(jsonStr);

      if (!parsed?.modules || !Array.isArray(parsed.modules)) {
        return null;
      }

      cache.set(cacheKey, parsed);
      this.trackUsage(
        "course",
        actualTokens || this.dailyLimits.estimatedTokensPerCourse
      );
      return parsed;
    } catch (error) {
      console.error(`[AI Service] Course generation error: ${error.message}`);
      return null;
    }
  }

  async chatWithTutor(message, context) {
    console.log(`[AI Service] Chat request: "${message}" (Context: ${context?.substring(0, 50)}...)`);
    try {
      if (!this.groq) {
        throw new Error("Groq API key not configured");
      }

      const prompt = `
        You are an expert AI Tutor. The user is asking a question about: "${context}".
        
        User Question: "${message}"
        
        Provide a helpful, concise, and encouraging answer. 
        Keep it under 150 words. 
        Use markdown for formatting.
      `;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content || "I couldn't generate a response.";
      console.log(`[AI Service] Chat response length: ${response.length}`);
      this.trackUsage("chat", completion.usage?.total_tokens || 0);
      
      return { response };
    } catch (error) {
      console.error("[AI Service] Chat failed:", error);
      return { error: "Failed to get response from AI Tutor." };
    }
  }

  async generateResources(topic, context = "") {
    const key = `${topic}-${context}`.trim().toLowerCase();
    const cacheKey = `resources_${key}`;
    if (cache.get(cacheKey)) return cache.get(cacheKey);

    const prompt = `You are an expert educational resource curator. Provide the BEST learning resources for: "${topic}"
${context ? `Additional context: ${context}` : ""}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "description": "A brief 2-3 sentence overview of what ${topic} is and why it's important",
  "freeResources": [
    {
      "type": "article|video|course",
      "title": "Specific resource name",
      "platform": "Platform/Website name",
      "url": "https://example.com/actual-path"
    }
  ],
  "premiumResources": [
    {
      "type": "article|video|course",
      "title": "Specific resource name",
      "platform": "Platform name",
      "url": "https://example.com/actual-path",
      "discount": "Check website for current discounts"
    }
  ]
}

Requirements:
- Include 4-6 FREE resources (documentation, articles, YouTube videos, free courses)
- Include 2-3 PREMIUM resources if applicable
- Use REAL URLs when you know them (e.g., https://developer.mozilla.org/en-US/docs/Web/JavaScript, https://www.freecodecamp.org/, https://www.youtube.com/)
- For YouTube, use https://www.youtube.com/results?search_query=${topic.replace(
      / /g,
      "+"
    )}
- For freeCodeCamp, use https://www.freecodecamp.org/learn or https://www.freecodecamp.org/news/search?query=${topic.replace(
      / /g,
      "+"
    )}
- For MDN, use https://developer.mozilla.org/en-US/docs/Web/ (with appropriate path)
- For Udemy, use https://www.udemy.com/courses/search/?q=${topic.replace(
      / /g,
      "+"
    )}
- For generic search, use the actual domain with /search or /learn paths
- NEVER use "#" as a URL - always provide a working link

Be specific and provide REAL, CLICKABLE URLs!`;

    try {
      const aiResponse = await this.callAIWithRetry(prompt, "fast");
      const actualTokens = aiResponse.tokensUsed || 0;
      const responseText = aiResponse.content;

      let cleanResponse = responseText.replace(/```json|```/g, "").trim();

      // Find the first { and last } to extract JSON
      const firstBrace = cleanResponse.indexOf("{");
      const lastBrace = cleanResponse.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON object found in response");
      }

      const jsonStr = cleanResponse.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonStr);

      if (!parsed?.description) {
        parsed.description = `Learn ${topic} to enhance your development skills.`;
      }
      
      // Validate and fix URLs
      if (parsed?.freeResources) {
        parsed.freeResources = parsed.freeResources.map(r => ({
          ...r,
          url: this.validateAndFixUrl(r.url, `${topic} ${r.title}`)
        }));
      } else {
        parsed.freeResources = [];
      }

      if (parsed?.premiumResources) {
        parsed.premiumResources = parsed.premiumResources.map(r => ({
          ...r,
          url: this.validateAndFixUrl(r.url, `${topic} ${r.title}`)
        }));
      } else {
        parsed.premiumResources = [];
      }

      cache.set(cacheKey, parsed);
      this.trackUsage(
        "resource",
        actualTokens || this.dailyLimits.estimatedTokensPerResource
      );
      return parsed;
    } catch (error) {
      console.error(
        `[AI Service] Resources generation error: ${error.message}`
      );
      // Return fallback resources with working search URLs
      const searchQuery = encodeURIComponent(topic);
      return {
        description: `Learn ${topic} to enhance your development skills.`,
        freeResources: [
          {
            type: "article",
            title: `${topic} Documentation`,
            platform: "MDN Web Docs",
            url: `https://developer.mozilla.org/en-US/search?q=${searchQuery}`,
          },
          {
            type: "video",
            title: `${topic} Tutorial for Beginners`,
            platform: "YouTube",
            url: `https://www.youtube.com/results?search_query=${searchQuery}+tutorial`,
          },
          {
            type: "course",
            title: `Learn ${topic}`,
            platform: "freeCodeCamp",
            url: `https://www.freecodecamp.org/news/search?query=${searchQuery}`,
          },
        ],
        premiumResources: [
          {
            type: "course",
            title: `${topic} Courses`,
            platform: "Udemy",
            url: `https://www.udemy.com/courses/search/?q=${searchQuery}`,
          },
        ],
      };
    }
  }
}

export const aiService = new AIService();
