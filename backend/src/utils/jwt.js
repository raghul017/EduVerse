import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

export const signToken = (payload, expiresIn = env.jwtExpire) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn });
