const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(400).json({ error: 'Duplicate entry found' });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({ error: 'Referenced record not found' });
  }

  if (err.code === '23502') { // Not null violation
    return res.status(400).json({ error: 'Required field missing' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Default error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
};

module.exports = { errorHandler };