import { query } from "../config/database.js";
import { aiService } from "../services/ai.service.js";

export const listPaths = async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT lp.id,
              lp.title,
              lp.description,
              lp.subject,
              lp.level,
              lp.created_at,
              u.name AS creator_name,
              COUNT(lpp.post_id)::int AS lessons_count
       FROM learning_paths lp
       LEFT JOIN learning_path_posts lpp ON lpp.path_id = lp.id
       LEFT JOIN users u ON u.id = lp.creator_id
       GROUP BY lp.id, u.name
       ORDER BY lp.created_at DESC`
    ).then((result) => result.rows);

    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
};

export const aiRoadmap = async (req, res, next) => {
  try {
    const { role } = req.body;
    console.log(`[Path Controller] AI Roadmap request for role: ${role}`);
    console.log(`[Path Controller] Request body:`, JSON.stringify(req.body));
    console.log(`[Path Controller] User:`, req.user?.id || 'anonymous');
    
    if (!role || !role.trim()) {
      return res.status(400).json({ message: "Role is required." });
    }

    const roadmap = await aiService.generateRoadmap(role.trim());
    console.log(`[Path Controller] AI Roadmap result: ${roadmap ? 'success' : 'failed'}`);
    
    if (!roadmap) {
      console.log(`[Path Controller] Returning fallback roadmap for: ${role}`);
      const trimmed = role.trim();
      const fallback = {
        title: `${trimmed} Roadmap`,
        description:
          "AI provider is currently unavailable. This is a simple fallback outline. Please check your GROQ_API_KEY or GEMINI_API_KEY environment variables.",
        stages: [
          {
            id: "basics",
            label: "Foundations",
            summary: "Core fundamentals for this role.",
            nodes: [
              {
                id: "overview",
                label: `${trimmed} Overview`,
                details:
                  "Understand what this role does day to day. Read 1–2 high-level guides.",
                dependsOn: [],
              },
              {
                id: "core-concepts",
                label: "Core Concepts",
                details:
                  "List the main technologies and concepts required. Prioritize 3–5 that you want to learn first.",
                dependsOn: ["overview"],
              },
            ],
          },
          {
            id: "projects",
            label: "Projects",
            summary: "Build small projects to apply the basics.",
            nodes: [
              {
                id: "mini-project",
                label: "Mini Project",
                details:
                  "Pick a simple project idea related to this role. Break it into 3–5 tasks and complete them.",
                dependsOn: ["core-concepts"],
              },
            ],
          },
        ],
      };
      return res.json({ data: fallback });
    }

    res.json({ data: roadmap });
  } catch (error) {
    console.error("[Path Controller] AI Roadmap error:", error);
    next(error);
  }
};

export const aiCourse = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "Topic is required." });
    }

    const course = await aiService.generateCourse(topic);
    if (!course) {
      const trimmed = topic.trim();
      const fallback = {
        title: `${trimmed} course`,
        description:
          "AI provider is currently unavailable. This is a simple fallback course outline.",
        modules: [
          {
            id: "foundations",
            title: "Foundations",
            summary: "Core fundamentals you should start with.",
            lessons: [
              {
                id: "intro",
                title: `${trimmed} overview`,
                objective:
                  "Understand what this topic is about and common use cases.",
                suggestedResources: [],
              },
              {
                id: "basics",
                title: "Core concepts",
                objective:
                  "Identify 3–5 core concepts or tools to focus on first.",
                suggestedResources: [],
              },
            ],
          },
          {
            id: "projects",
            title: "Apply with a project",
            summary: "Build something small to apply what you learned.",
            lessons: [
              {
                id: "mini-project",
                title: "Mini project",
                objective:
                  "Plan and complete a simple project that uses the basics.",
                suggestedResources: [],
              },
            ],
          },
        ],
      };
      return res.json({ data: fallback });
    }

    res.json({ data: course });
  } catch (error) {
    next(error);
  }
};

export const getPath = async (req, res, next) => {
  try {
    const id = req.params.id;
    const path = await query(
      `SELECT lp.id,
              lp.title,
              lp.description,
              lp.subject,
              lp.level,
              lp.created_at,
              u.name AS creator_name
       FROM learning_paths lp
       LEFT JOIN users u ON u.id = lp.creator_id
       WHERE lp.id = $1`,
      [id]
    ).then((result) => result.rows[0]);

    if (!path)
      return res.status(404).json({ message: "Learning path not found" });

    const lessons = await query(
      `SELECT p.*,
              lpp.position,
              lpp.resources
       FROM learning_path_posts lpp
       JOIN posts p ON p.id = lpp.post_id
       WHERE lpp.path_id = $1
       ORDER BY lpp.position ASC`,
      [id]
    ).then((result) => result.rows);

    res.json({ data: { ...path, lessons } });
  } catch (error) {
    next(error);
  }
};

export const createPath = async (req, res, next) => {
  try {
    const creatorId = req.user.id;
    const { title, description, subject, level, lessons } = req.body;
    if (!title || !Array.isArray(lessons) || lessons.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and at least one lesson are required." });
    }

    await query("BEGIN");
    try {
      const createdPath = await query(
        `INSERT INTO learning_paths (creator_id, title, description, subject, level)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING id, title, description, subject, level, created_at`,
        [creatorId, title, description || null, subject || null, level || null]
      ).then((result) => result.rows[0]);

      const isObjectShape =
        Array.isArray(lessons) &&
        lessons.length > 0 &&
        typeof lessons[0] === "object" &&
        lessons[0] !== null;

      const values = [];
      const placeholders = [];

      lessons.forEach((lesson, index) => {
        const lessonId = isObjectShape ? lesson.postId : lesson;
        if (!lessonId) return;
        const resources = isObjectShape ? lesson.resources || null : null;
        values.push(createdPath.id, lessonId, index + 1, resources);
        const base = values.length - 3; // path_id, post_id, position, resources
        placeholders.push(
          `($${base}, $${base + 1}, $${base + 2}, $${base + 3})`
        );
      });

      if (values.length) {
        await query(
          `INSERT INTO learning_path_posts (path_id, post_id, position, resources)
           VALUES ${placeholders.join(",")}`,
          values
        );
      }

      await query("COMMIT");
      res.status(201).json({ data: createdPath });
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const getPathProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pathId = req.params.id;
    const progress = await query(
      `SELECT current_step, completed
       FROM user_path_progress
       WHERE user_id = $1 AND path_id = $2`,
      [userId, pathId]
    ).then((result) => result.rows[0]);

    res.json({ data: progress || { current_step: 0, completed: false } });
  } catch (error) {
    next(error);
  }
};

export const updatePathProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pathId = req.params.id;
    const { current_step, completed } = req.body;

    const updated = await query(
      `INSERT INTO user_path_progress (user_id, path_id, current_step, completed, updated_at)
       VALUES ($1,$2,$3,COALESCE($4,false), NOW())
       ON CONFLICT (user_id, path_id)
       DO UPDATE SET current_step = EXCLUDED.current_step,
                     completed = EXCLUDED.completed,
                     updated_at = NOW()
       RETURNING current_step, completed`,
      [userId, pathId, current_step || 0, completed]
    ).then((result) => result.rows[0]);

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
