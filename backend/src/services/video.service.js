import cloudinary from '../config/cloudinary.js';
import { env } from '../config/environment.js';
import fs from 'fs';

const cloudinaryConfigured =
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret;

/**
 * Upload video from buffer (legacy support)
 */
export const uploadVideoBuffer = async (buffer, filename, mimetype) => {
  if (!cloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend .env.'
    );
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'eduverse',
        public_id: filename.replace(/\.[^.]+$/, ''), // Remove extension
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          duration: Math.round(result.duration || 0),
          thumbnail: result.thumbnail_url || result.secure_url.replace(/\.[^.]+$/, '.jpg')
        });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Upload video from file path (disk storage) - preferred method
 */
export const uploadVideoFile = async (filePath, originalName) => {
  if (!cloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend .env.'
    );
  }
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: 'eduverse',
      public_id: originalName.replace(/\.[^.]+$/, ''), // Remove extension
      overwrite: true
    });
    
    return {
      url: result.secure_url,
      duration: Math.round(result.duration || 0),
      thumbnail: result.thumbnail_url || result.secure_url.replace(/\.[^.]+$/, '.jpg')
    };
  } finally {
    // Clean up temp file
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupErr) {
      console.warn('[Video Service] Failed to clean up temp file:', cleanupErr.message);
    }
  }
};

