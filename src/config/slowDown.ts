import slowDown from 'express-slow-down';

export const slowDownOptions = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
  delayMs: 500, // Add 500ms delay after the limit is reached
  maxDelayMs: 5000, // Maximum delay of 5 seconds
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return `${req.ip}-${req.user?.id || 'anonymous'}`;
  },
  skip: (req) => {
    // Skip slow down for health checks
    return req.path === '/health';
  },
});
