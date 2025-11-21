#!/usr/bin/env node

/**
 * AI Service Verification Script
 * Tests Groq and Gemini API connections
 */

import { aiService } from "./src/services/ai.service.js";

console.log("🔍 EduVerse AI Service Verification\n");
console.log("=".repeat(50));

async function testGroq() {
  console.log("\n📡 Testing Groq API...");
  try {
    if (!aiService.groq) {
      console.log("❌ Groq API key not configured");
      return false;
    }

    const result = await aiService.callGroq(
      'Say "Groq is working!" in 5 words or less',
      "fast"
    );
    if (result && result.length > 0) {
      console.log("✅ Groq API: WORKING");
      console.log(`   Response: ${result.substring(0, 100)}`);
      return true;
    }
    console.log("❌ Groq API: Empty response");
    return false;
  } catch (error) {
    console.log("❌ Groq API: FAILED");
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testGemini() {
  console.log("\n📡 Testing Gemini API...");
  try {
    if (!aiService.genAI) {
      console.log("❌ Gemini API key not configured");
      return false;
    }

    const result = await aiService.callGemini(
      'Say "Gemini is working!" in 5 words or less'
    );
    if (result && result.length > 0) {
      console.log("✅ Gemini API: WORKING");
      console.log(`   Response: ${result.substring(0, 100)}`);
      return true;
    }
    console.log("❌ Gemini API: Empty response");
    return false;
  } catch (error) {
    console.log("❌ Gemini API: FAILED");
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testFallback() {
  console.log("\n📡 Testing Fallback System...");
  try {
    const result = await aiService.callAI(
      'Say "Fallback working!" in 5 words or less',
      "fast"
    );
    if (result && result.length > 0) {
      console.log("✅ Fallback System: WORKING");
      return true;
    }
    console.log("❌ Fallback System: Empty response");
    return false;
  } catch (error) {
    console.log("❌ Fallback System: FAILED");
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  const groqWorking = await testGroq();
  const geminiWorking = await testGemini();
  const fallbackWorking = await testFallback();

  console.log("\n" + "=".repeat(50));
  console.log("\n📊 Summary:");
  console.log(`   Groq:     ${groqWorking ? "✅ Working" : "❌ Not Working"}`);
  console.log(
    `   Gemini:   ${geminiWorking ? "✅ Working" : "❌ Not Working"}`
  );
  console.log(
    `   Fallback: ${fallbackWorking ? "✅ Working" : "❌ Not Working"}`
  );

  if (!groqWorking && !geminiWorking) {
    console.log("\n⚠️  WARNING: No AI providers are configured!");
    console.log("   The app will use fallback templates only.");
    console.log("   See AI_SETUP.md for configuration instructions.");
  } else if (groqWorking && geminiWorking) {
    console.log("\n🎉 Perfect! Both AI providers are working!");
  } else {
    console.log("\n✅ At least one AI provider is working.");
    console.log("   Consider configuring both for redundancy.");
  }

  console.log("\n" + "=".repeat(50));
}

main().catch(console.error);
