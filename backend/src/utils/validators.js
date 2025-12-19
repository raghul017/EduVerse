import { body, param } from 'express-validator';

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

export const aiRoadmapValidator = [
  body('role')
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters')
    .trim()
];

export const aiCourseValidator = [
  body('topic')
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic must be between 2 and 100 characters')
    .trim()
];

export const aiChatValidator = [
  body('message')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
    .trim(),
  body('context')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Context must be less than 500 characters')
    .trim()
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

