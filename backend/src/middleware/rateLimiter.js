import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

// AI calls spend real Groq quota, so they get their own, tighter budget.
// Mounted AFTER authenticate, so it is keyed per user rather than per IP:
// a shared campus IP should not throttle everyone behind it.
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,
  message: { message: 'Too many AI requests. Please wait a minute and try again.' }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many auth attempts. Try again later.'
});
