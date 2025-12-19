export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging (but not in test environment)
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Error]', {
      message: err.message,
      status: err.status,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  if (res.headersSent) return next(err);
  
  const status = err.status || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // In production, hide internal error details for 500 errors
  const message = status === 500 && !isDevelopment
    ? 'Internal server error'
    : err.message || 'Internal server error';
  
  res.status(status).json({
    message,
    ...(isDevelopment && { stack: err.stack })
  });
};
