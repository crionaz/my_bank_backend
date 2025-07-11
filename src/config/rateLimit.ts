import { Options } from 'express-rate-limit';

export const rateLimitOptions: Partial<Options> = {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Store in memory (for production, consider Redis)
  // store: new MemoryStore(),
  keyGenerator: (req) => {
    // Use IP address and user ID (if authenticated) for more granular rate limiting
    return `${req.ip}-${req.user?.id || 'anonymous'}`;
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: Math.ceil((Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000),
    });
  },
};
