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
  if (env.node === 'development') {
    return [/^http:\/\/localhost:\d+$/];
  }
  
  const origins = [env.frontendUrl];
  
  // Allow additional origins from env if specified (comma-separated)
  if (process.env.CORS_ALLOWED_ORIGINS) {
    const additional = process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim());
    origins.push(...additional);
  }
  
  // For Vercel deployments, allow specific project URLs (more secure than wildcards)
  // Format: https://project-name-*.vercel.app or exact URLs
  if (env.frontendUrl?.includes('vercel.app')) {
    // Extract project name from frontend URL and allow its variations
    const match = env.frontendUrl.match(/https:\/\/([^-]+)/);
    if (match) {
      const projectPrefix = match[1];
      origins.push(new RegExp(`^https://${projectPrefix}[a-z0-9-]*\\.vercel\\.app$`));
    }
  }
  
  return origins;
};

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/paths", pathRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
