import dotenv from 'dotenv';

dotenv.config();

export const env = {
  node: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5051),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  groqApiKey: process.env.GROQ_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

export const ensureEnv = () => {
  const missing = [];
  const warnings = [];

  // Critical - app won't work without these
  if (!env.databaseUrl) missing.push('DATABASE_URL');
  if (!env.jwtSecret) missing.push('JWT_SECRET');

  // Important - features will be broken
  if (!env.groqApiKey && !env.geminiApiKey) {
    warnings.push('Neither GROQ_API_KEY nor GEMINI_API_KEY is set. AI features will not work.');
  }
  
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    warnings.push('CLOUDINARY credentials missing. Video uploads will fail.');
  }

  // Show warnings
  warnings.forEach(w => console.warn(`[Env Warning] ${w}`));

  // Fail on missing critical vars
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.info(`[Env] Loaded successfully (${env.node} mode)`);
};

