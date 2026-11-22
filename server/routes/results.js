import { Router } from 'express';
import { isUuid } from '../lib/isUuid.js';
import { Result } from '../models/Result.js';

const HISTORY_LIMIT = 10;

const router = Router();

router.get('/api/results', async (req, res) => {
  const userId = req.query?.userId;

  if (!isUuid(userId)) {
    return res.status(400).json({
      error: 'Missing or invalid userId. Refresh the page and try again.',
    });
  }

  const results = await Result.find({ userId })
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .select('_id targetRole score verdict fallback createdAt')
    .lean();

  return res.status(200).json({ results });
});

export default router;
