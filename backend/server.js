import "dotenv/config"; // Load .env before anything else

import app from "./src/app.js";
import { env } from "./src/config/environment.js";
import { pool } from "./src/config/database.js";
import { serverReadyState } from "./src/app.js";

const server = app.listen(env.port, async () => {
    console.log(`EduVerse API running on port ${env.port}`);

    // Warm up the database connection pool on boot
    // This pre-establishes a connection so the first user request isn't slow
    try {
        const start = Date.now();
        await pool.query("SELECT 1");
        const duration = Date.now() - start;
        console.log(
            `[Warm-up] Database connection established in ${duration}ms`,
        );
        serverReadyState.dbReady = true;
    } catch (error) {
        console.error("[Warm-up] Database connection failed:", error.message);
        console.error("[Warm-up] First requests may be slow while DB wakes up");
        serverReadyState.dbReady = false;
    }

    serverReadyState.bootTime = Date.now();
    serverReadyState.ready = true;
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
