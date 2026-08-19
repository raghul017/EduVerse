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
        console.error("[Warm-up] Database error code:", error.code);
        if (error.code === "XX000") {
            console.error(
                "[Warm-up] Check Render DATABASE_URL. Supabase returned 'Tenant or user not found', which usually means the host, username, or pooler connection string is wrong.",
            );
        }
        console.error("[Warm-up] First requests may be slow while DB wakes up");
        serverReadyState.dbReady = false;

        if (env.node === "production") {
            console.error(
                "[Warm-up] Exiting because the production database connection is not usable.",
            );
            server.close(() => process.exit(1));
            return;
        }
    }

    serverReadyState.bootTime = Date.now();
    serverReadyState.ready = true;
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
