import rateLimit from 'express-rate-limit';

const TEN_MINUTES_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export const analyzeRateLimit = rateLimit({
  windowMs: TEN_MINUTES_MS,
  limit: MAX_REQUESTS_PER_WINDOW,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a few minutes and try again.',
  },
});
