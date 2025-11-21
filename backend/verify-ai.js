import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load env vars manually for this test script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'src', '.env') }); // Try src/.env first
dotenv.config({ path: path.join(__dirname, '.env') }); // Fallback to root .env

async function testAI() {
  console.log("Testing AI Configuration...");
  
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  console.log("Groq API Key present:", !!groqKey);
  console.log("Gemini API Key present:", !!geminiKey);

  // Test Groq
  if (groqKey) {
    try {
      console.log("\nTesting Groq (llama-3.3-70b-versatile)...");
      const groq = new Groq({ apiKey: groqKey });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: "Say 'Groq is working' in 3 words." }],
        model: "llama-3.3-70b-versatile",
      });
      console.log("✅ Groq Response:", completion.choices[0]?.message?.content);
    } catch (error) {
      console.error("❌ Groq Error:", error.message);
    }
  } else {
    console.log("⚠️ Skipping Groq test (No API Key)");
  }

  // Test Gemini
  if (geminiKey) {
    try {
      console.log("\nTesting Gemini (gemini-pro)...");
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Say 'Gemini is working' in 3 words.");
      const response = await result.response;
      console.log("✅ Gemini Response:", response.text());
    } catch (error) {
      console.error("❌ Gemini Error:", error.message);
    }
  } else {
    console.log("⚠️ Skipping Gemini test (No API Key)");
  }
}

testAI();
