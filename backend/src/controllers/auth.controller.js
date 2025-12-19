import { validationResult } from 'express-validator';
import { UserModel } from '../models/queries.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { signToken, verifyToken } from '../utils/jwt.js';
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
    // Include name and role in JWT for efficiency
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: 'student' });
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
    // Include name and role in JWT for efficiency
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role || 'student' });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        role: user.role || 'student'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  // With JWT, we can't invalidate tokens server-side without a blacklist
  // For now, just return success - the client should clear the token
  // TODO: Implement token blacklist with Redis for proper logout
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        role: user.role || 'student'
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
      const token = signToken({ id: user.id, type: 'password-reset' }, '1h');
      await emailService.sendPasswordReset(user.email, token);
    }
    // Always return success to prevent email enumeration
    res.json({ message: 'If that account exists, we sent instructions.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  
  try {
    // Verify the reset token
    const payload = verifyToken(token);
    
    if (!payload || payload.type !== 'password-reset') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Hash the new password and update
    const passwordHash = await hashPassword(password);
    await UserModel.updatePassword(payload.id, passwordHash);
    
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    next(error);
  }
};

