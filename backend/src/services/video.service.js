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
        // No public_id: Cloudinary generates a unique one. Deriving it from
        // the filename let two users' "lecture.mp4" overwrite each other.
        resource_type: 'video',
        folder: 'eduverse',
        overwrite: false
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
    // No public_id: see uploadVideoBuffer. Unique IDs prevent overwrites.
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: 'eduverse',
      overwrite: false
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

