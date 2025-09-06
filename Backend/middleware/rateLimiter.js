const rateLimit = require('express-rate-limit');

// Rate limiting for API endpoints
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for batch endpoints
      return req.path.includes('/batch');
    }
  });
};

// Specific rate limiters
const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
const apiLimiter = createRateLimiter(1 * 60 * 1000, 200); // 200 requests per minute (more lenient)
const strictLimiter = createRateLimiter(60 * 1000, 50); // 50 requests per minute
const timerLimiter = createRateLimiter(1 * 60 * 1000, 100); // 100 timer requests per minute

module.exports = { authLimiter, apiLimiter, strictLimiter, timerLimiter };