import { body, param, validationResult } from 'express-validator';

// Runs after a validator chain and rejects the request with the first error.
// Without this, a validator chain only records errors and lets the request
// through, which is how the AI validators below sat unused.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  next();
};

export const signupValidator = [
  body('name').isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars')
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty()
];

export const postValidator = [
  body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Description must be at least 4 characters when provided'),
  body('subject').notEmpty().withMessage('Subject is required')
];

export const communityValidator = [
  body('name').isLength({ min: 3 }).withMessage('Community name must be at least 3 characters'),
  body('subject').isLength({ min: 3 }).withMessage('Subject must be at least 3 characters'),
  body('description')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters')
];

// AI endpoint validators
export const aiExplainValidator = [
  param('id').isUUID().withMessage('Invalid post ID'),
  body('question')
    .isLength({ min: 2, max: 500 })
    .withMessage('Question must be between 2 and 500 characters')
    .trim()
    .escape()
];

// trim() runs BEFORE the length check, so "  a  " is rejected as too short.
export const aiRoadmapValidator = [
  body('role')
    .isString()
    .withMessage('Role is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),
  body('detailLevel')
    .optional()
    .isIn(['quick', 'standard', 'comprehensive'])
    .withMessage('detailLevel must be quick, standard or comprehensive')
];

export const aiCourseValidator = [
  body('topic')
    .isString()
    .withMessage('Topic is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic must be between 2 and 100 characters')
];

// context carries recent chat history from the AI Tutor, so it needs more
// room than a single message. The client trims it to fit.
export const aiChatValidator = [
  body('message')
    .isString()
    .withMessage('Message is required')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('context')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 4000 })
    .withMessage('Context must be less than 4000 characters')
];

export const aiResourcesValidator = [
  body('topic')
    .isString()
    .withMessage('Topic is required')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Topic must be between 2 and 200 characters'),
  body('context')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Context must be less than 1000 characters')
];

// Sanitization helper for AI prompts - removes potentially harmful patterns
export const sanitizeForAI = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Remove common prompt injection patterns
  let sanitized = text
    .replace(/ignore\s*(previous|above|all)\s*instructions?/gi, '')
    .replace(/disregard\s*(previous|above|all)\s*instructions?/gi, '')
    .replace(/forget\s*(previous|above|all|everything)/gi, '')
    .replace(/you\s*are\s*now/gi, '')
    .replace(/new\s*instructions?:/gi, '')
    .replace(/system\s*prompt:/gi, '')
    .replace(/```[\s\S]*?```/g, '[code block removed]')  // Remove code blocks
    .trim();
  
  // Limit length
  return sanitized.substring(0, 2000);
};

