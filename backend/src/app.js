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

const allowedOrigins =
  env.node === "development" ? [/^http:\/\/localhost:\d+$/] : [env.frontendUrl];

app.use(
  cors({
    origin: allowedOrigins,
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/paths", pathRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
