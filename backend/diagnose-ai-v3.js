import dotenv from 'dotenv';
import { aiService } from './src/services/ai.service.js';

dotenv.config();

async function test() {
  console.log("Testing AI Service (v3 - Fallback & Stability)...");
  
  try {
    console.log("1. Generating Roadmap (Expect 'balanced' model)...");
    const start = Date.now();
    const result = await aiService.generateRoadmap("DevOps Engineer");
    const duration = (Date.now() - start) / 1000;
    
    if (result.error) {
        console.error("❌ AI Service returned error:", result.error);
    } else {
        console.log(`✅ Success! Generated in ${duration}s`);
        console.log(`Stages: ${result.stages?.length}`);
        console.log(`Title: ${result.title}`);
    }

  } catch (err) {
    console.error("❌ Crash:", err);
  }
}

test();
