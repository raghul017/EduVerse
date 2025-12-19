import multer from 'multer';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

// Configuration
const MAX_FILE_SIZE_MB = 100; // 100MB max (reduced from 500MB for safety)
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Use disk storage to avoid memory issues with large files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Use system temp directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/mpeg'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`), false);
  }
};

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1 // Only allow one file
  },
  fileFilter
}).single('video');

// Middleware to handle multer errors gracefully
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB` 
      });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

