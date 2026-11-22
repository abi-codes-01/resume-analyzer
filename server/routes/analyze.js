import { Router } from 'express';
import multer from 'multer';
import { analyzeResume } from '../lib/analyzeResume.js';
import { costInr } from '../lib/cost.js';
import { isUuid } from '../lib/isUuid.js';
import { readResume } from '../lib/readResume.js';
import { ROLES } from '../lib/roles.js';
import { spentTodayInr } from '../lib/spend.js';
import { analyzeRateLimit } from '../middleware/rateLimit.js';
import { Result } from '../models/Result.js';

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const MIN_TEXT_LENGTH = 100;
const MAX_TEXT_LENGTH = 20_000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

const router = Router();

router.post(
  '/api/analyze',
  analyzeRateLimit,
  upload.single('resume'),
  async (req, res) => {
    const targetRole = req.body?.targetRole;
    const userId = req.body?.userId;

    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Upload your resume as a PDF.' });
    }

    if (!targetRole || !Object.hasOwn(ROLES, targetRole)) {
      return res.status(400).json({ error: 'Pick a role from the list.' });
    }

    if (!isUuid(userId)) {
      return res.status(400).json({
        error: 'Missing or invalid userId. Refresh the page and try again.',
      });
    }

    let text;
    try {
      text = await readResume(req.file.buffer);
    } catch (error) {
      console.warn('[Server] failed to parse PDF:', error.message);
      return res
        .status(400)
        .json({ error: 'This PDF could not be read. Try exporting it again.' });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      const originalLength = text.length;
      text = text.slice(0, MAX_TEXT_LENGTH);
      console.warn(
        `[Server] truncated resume from ${originalLength} to ${MAX_TEXT_LENGTH} chars`,
      );
    }

    if (text.length < MIN_TEXT_LENGTH) {
      return res.status(422).json({
        error: 'We could not find any text in this PDF. Is it a scanned image?',
      });
    }

    if ((await spentTodayInr()) >= Number(process.env.DAILY_CAP_INR)) {
      console.warn('[Cost] daily cap reached');
      return res.status(503).json({
        error: "We've hit today's AI budget. Please try again tomorrow.",
      });
    }

    const startedAt = Date.now();
    const { usage, ...analysisResult } = await analyzeResume(text, targetRole);
    const elapsedMs = Date.now() - startedAt;

    const requestCostInr = costInr(usage);

    await Result.create({
      userId,
      targetRole,
      score: analysisResult.score,
      verdict: analysisResult.verdict,
      skillsFound: analysisResult.skillsFound,
      skillsMissing: analysisResult.skillsMissing,
      topFixes: analysisResult.topFixes,
      fallback: analysisResult.fallback,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      costInr: requestCostInr,
    });

    const totalTodayInr = await spentTodayInr();

    console.log(
      `[AI] analysed ${text.length} chars for ${targetRole} in ${elapsedMs} ms`,
    );
    console.log(
      `[Cost] ₹${requestCostInr.toFixed(4)} for this request, ₹${totalTodayInr.toFixed(4)} today`,
    );

    return res.status(200).json({
      targetRole,
      ...analysisResult,
      costInr: requestCostInr,
    });
  },
);

export default router;
