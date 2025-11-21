import { body } from 'express-validator';

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
