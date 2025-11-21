import cloudinary from '../config/cloudinary.js';
import { env } from '../config/environment.js';

const cloudinaryConfigured =
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret;

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
        public_id: filename,
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          duration: Math.round(result.duration),
          thumbnail: result.thumbnail_url
        });
      }
    );
    stream.end(buffer);
  });
};
