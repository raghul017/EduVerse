import { validationResult } from 'express-validator';
import { UserModel } from '../models/queries.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { signToken } from '../utils/jwt.js';
import { emailService } from '../services/email.service.js';

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  try {
    const existing = await UserModel.findByEmail(req.body.email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const passwordHash = await hashPassword(req.body.password);
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      bio: req.body.bio || '',
      interests: req.body.interests || []
    });
    const token = signToken({ id: user.id, email: user.email });
    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  try {
    const user = await UserModel.findByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await comparePassword(req.body.password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken({ id: user.id, email: user.email });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        interests: user.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        interests: user.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await UserModel.findByEmail(req.body.email);
    if (user) {
      const token = signToken({ id: user.id }, '1h');
      await emailService.sendPasswordReset(user.email, token);
    }
    res.json({ message: 'If that account exists, we sent instructions.' });
  } catch (error) {
    next(error);
  }
};
