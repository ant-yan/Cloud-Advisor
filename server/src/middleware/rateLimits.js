const rateLimit = require('express-rate-limit');

function rateLimitResponse(res, windowMs, limit) {
  const retryAfterSec = Math.ceil(windowMs / 1000);
  res.status(429).json({
    error: 'Too many requests. Please slow down and try again shortly.',
    retryAfter: retryAfterSec,
  });
}

// Global guard — catches anything not covered by a more specific limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => rateLimitResponse(res, 15 * 60 * 1000, 150),
});

// /api/recommend  — runs OpenAI explanation on every call
const recommendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => rateLimitResponse(res, 15 * 60 * 1000, 8),
});

// /api/chat — streaming OpenAI call on every message, most expensive
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // SSE already started? send as SSE event instead of JSON
    const accept = req.headers.accept || '';
    if (accept.includes('text/event-stream')) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ token: '\n\n⚠️ Rate limit reached. You can send up to 20 messages per hour.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      rateLimitResponse(res, 60 * 60 * 1000, 20);
    }
  },
});

// /api/pricing — pure math, no OpenAI, but still guard it
const pricingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => rateLimitResponse(res, 60 * 1000, 60),
});

module.exports = { globalLimiter, recommendLimiter, chatLimiter, pricingLimiter };
