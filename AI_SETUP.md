# AI Service Setup Guide

## Overview

EduVerse uses AI services (Groq and Google Gemini) for generating roadmaps, courses, and learning resources. This guide will help you set up and troubleshoot AI providers.

## API Providers

### 1. Groq (Recommended - Fast & Free)

Groq offers fast inference with generous free tier.

**Setup:**

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Add to your `.env` file:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

**Rate Limits:**

- Free tier: Developer Plan with generous limits
- Production Models:
  - `llama-3.1-8b-instant` - 560 T/sec, 250K TPM, 1K RPM (Fast, default)
  - `llama-3.3-70b-versatile` - 280 T/sec, 300K TPM, 1K RPM (Best Quality)
  - `openai/gpt-oss-120b` - 500 T/sec, 250K TPM (OpenAI's flagship)
- If you hit rate limits, the system will automatically fallback to Gemini

### 2. Google Gemini (Fallback)

Google's Gemini is used as a fallback when Groq is unavailable.

**Setup:**

1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Add to your `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

**Supported Models (in order of preference):**

- `gemini-1.5-pro` (Best quality, multimodal)
- `gemini-1.5-flash` (Fast & efficient)
- `gemini-pro` (Stable fallback)

## Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# AI Providers (at least one required)
GROQ_API_KEY=gsk_your_groq_key
GEMINI_API_KEY=your_gemini_key
```

### Testing AI Services

Run the verification script:

```bash
cd backend
node verify-ai.js
```

This will test both Groq and Gemini connections.

## Troubleshooting

### Error: "Rate limit exceeded"

**Solution:**

- Wait for the rate limit window to reset (usually 24 hours for daily limits)
- Configure the fallback provider (Gemini)
- Consider upgrading to Groq's paid tier for higher limits

### Error: "models/gemini-1.5-flash is not found"

**Solution:**

- The Gemini model version has changed
- The system will automatically try multiple model versions
- Make sure your GEMINI_API_KEY is valid

### Error: "AI provider is currently unavailable"

**Solution:**

1. Check that at least one API key is configured
2. Verify API keys are valid (not expired)
3. Check rate limits on provider dashboards
4. The system will use cached responses and fallback templates

### No AI keys configured

**Result:**

- System will work with fallback templates
- Basic roadmaps and resources will still be available
- Users will see a message about AI being unavailable

## Best Practices

1. **Use Both Providers**: Configure both Groq and Gemini for redundancy
2. **Monitor Usage**: Check your usage on provider dashboards
3. **Caching**: The system automatically caches responses for 24 hours
4. **Rate Limiting**: The app implements smart rate limiting to prevent hitting limits

## Cost Management

### Free Tiers (as of Nov 2025)

- **Groq**: 100,000 tokens/day (free)
- **Gemini**: 60 requests/minute, 1M tokens/day (free)

### Tips to Stay Within Free Limits

1. Leverage caching (enabled by default)
2. Implement user rate limiting
3. Use shorter prompts when possible
4. Monitor usage regularly

## Advanced Configuration

### Adjusting Token Limits

Edit `backend/src/services/ai.service.js`:

```javascript
max_tokens: 4096, // Adjust based on your needs
```

Lower values = fewer tokens used = stay under limits longer

### Custom Models

You can add custom models in the `models` object:

```javascript
const models = {
  fast: "llama-3.3-70b-versatile",
  smart: "llama-3.3-70b-versatile",
  balanced: "mixtral-8x7b-32768",
};
```

## Support

If you continue to experience issues:

1. Check the backend logs: `backend/logs/`
2. Review the [Groq Documentation](https://console.groq.com/docs)
3. Review the [Gemini Documentation](https://ai.google.dev/docs)
