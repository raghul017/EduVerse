import dotenv from 'dotenv';
import { aiService } from './src/services/ai.service.js';

dotenv.config();

async function test() {
  console.log("Testing AI Service (v2)...");
  
  try {
    console.log("Attempting to generate roadmap for 'Full Stack Developer'...");
    const start = Date.now();
    const result = await aiService.generateRoadmap("Full Stack Developer");
    const duration = (Date.now() - start) / 1000;
    
    if (result.error) {
        console.error("❌ AI Service returned error:", result.error);
    } else {
        console.log(`✅ Success! Generated in ${duration}s`);
        console.log(`Stages: ${result.stages?.length} (Target: 8-10)`);
        
        if (result.stages?.length < 6) {
            console.warn("⚠️ Warning: Roadmap is still too short!");
        }
        
        // Check first stage nodes
        const firstStage = result.stages[0];
        console.log(`Stage 1 (${firstStage.label}) nodes: ${firstStage.nodes?.length}`);
        console.log("Sample Node Description:", firstStage.nodes[0]?.details);
    }

    // Test URL Validation logic (mock test)
    console.log("\nTesting URL Validation:");
    const badUrl = "http://some-random-site.com/tutorial";
    const fixedBad = aiService.validateAndFixUrl(badUrl, "React");
    console.log(`Bad URL '${badUrl}' -> '${fixedBad}'`);
    
    const goodUrl = "https://react.dev/learn";
    const fixedGood = aiService.validateAndFixUrl(goodUrl, "React");
    console.log(`Good URL '${goodUrl}' -> '${fixedGood}'`);

  } catch (err) {
    console.error("❌ Crash:", err);
  }
}

test();
