import dotenv from 'dotenv';
import { aiService } from './src/services/ai.service.js';

dotenv.config();

async function test() {
  console.log("Testing AI Service (v4 - URL Validation)...");
  
  const testCases = [
    { input: "https://react.dev/learn", label: "Valid Direct Link" },
    { input: "https://some-random-blog.com/tutorial", label: "Unknown Domain (Should be allowed now)" },
    { input: "placeholder", label: "Placeholder (Should search)" },
    { input: "example.com", label: "Example (Should search)" },
    { input: "www.youtube.com/watch?v=123", label: "Missing Protocol (Should fix)" }
  ];

  testCases.forEach(tc => {
    const result = aiService.validateAndFixUrl(tc.input, "React");
    console.log(`[${tc.label}] Input: '${tc.input}' -> Output: '${result}'`);
  });
}

test();
