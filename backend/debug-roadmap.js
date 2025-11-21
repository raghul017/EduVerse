import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function debugRoadmap() {
  console.log("🚀 Starting Roadmap Debug...");
  
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const role = "Frontend Developer";
  
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
    console.log("📡 Sending request to Groq (llama-3.3-70b-versatile)...");
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096, // Increased token limit for debug
    });

    const content = completion.choices[0]?.message?.content;
    console.log("\n📄 Raw Response Length:", content.length);
    console.log("\n⬇️ RAW RESPONSE START ⬇️");
    console.log(content);
    console.log("⬆️ RAW RESPONSE END ⬆️\n");

    // Test Parsing Logic
    console.log("🔍 Testing Parsing Logic...");
    try {
      let cleanResponse = content.replace(/```json|```/g, "").trim();
      const firstBrace = cleanResponse.indexOf('{');
      const lastBrace = cleanResponse.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON object found");
      }
      
      const jsonStr = cleanResponse.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonStr);
      
      console.log("✅ JSON Parse Success!");
      console.log("Stages found:", parsed.stages?.length);
      
      if (!parsed.stages || !Array.isArray(parsed.stages)) {
        console.error("❌ Invalid structure: 'stages' array missing");
      } else {
        console.log("✅ Structure Valid");
      }
    } catch (e) {
      console.error("❌ Parsing Failed:", e.message);
    }

  } catch (error) {
    console.error("❌ Request Failed:", error.message);
  }
}

debugRoadmap();
