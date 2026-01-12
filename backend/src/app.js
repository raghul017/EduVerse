import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import { env, ensureEnv } from "./config/environment.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import communityRoutes from "./routes/community.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import pathRoutes from "./routes/path.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

ensureEnv();

const app = express();
const logger = pino({ level: env.node === "development" ? "debug" : "info" });

const getAllowedOrigins = () => {
  const origins = [];
  
  // Development: allow all localhost ports
  if (env.node === 'development') {
    return [/^http:\/\/localhost:\d+$/];
  }
  
  // Production: explicit URLs
  // Add exact frontend URL from env
  if (env.frontendUrl) {
    origins.push(env.frontendUrl);
  }
  
  // Explicitly add Vercel production URL
  origins.push('https://edu-verse-ebon.vercel.app');
  
  // Allow additional origins from env if specified
  if (process.env.CORS_ALLOWED_ORIGINS) {
    const additional = process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim());
    origins.push(...additional);
  }
  
  // Allow Vercel preview deployments (with regex)
  origins.push(/^https:\/\/edu-verse-[a-z0-9-]+\.vercel\.app$/);
  
  console.log('[CORS] Allowed origins:', origins);
  return origins;
};

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();
      
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // Check if origin matches any allowed origin
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json({ limit: "100mb" })); // Increased for video uploads
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(pinoHttp({ logger }));
app.use(apiLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

import { query, getDebugInfo } from "./config/database.js";
app.get("/health/db", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json({ 
      status: "ok", 
      time: result.rows[0].now,
      debug: getDebugInfo()
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: error.message,
      code: error.code,
      debug: getDebugInfo()
    });
  }
});

// API health endpoint for cron ping (prevents Render cold starts)
app.get("/api/health", async (req, res) => {
  try {
    const start = Date.now();
    await query("SELECT 1");
    const dbLatency = Date.now() - start;
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      dbLatency: `${dbLatency}ms`,
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/paths", pathRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
