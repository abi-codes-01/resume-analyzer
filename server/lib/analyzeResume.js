import { askGemini } from './askGemini.js';
import { fallbackAnalysis } from './fallbackAnalysis.js';
import { verdictFor } from './verdict.js';

const MAX_ATTEMPTS = 2;
const CONFIG_ERROR_STATUSES = new Set([400, 401, 403]);

function isConfigError(error) {
  if (!error) {
    return false;
  }

  if (error.isConfigError === true) {
    return true;
  }

  if (CONFIG_ERROR_STATUSES.has(Number(error.status))) {
    return true;
  }

  return (
    typeof error.message === 'string' &&
    error.message.toLowerCase().includes('api key not valid')
  );
}

function addUsage(totals, usage) {
  if (!usage) {
    return;
  }

  totals.inputTokens += usage.inputTokens ?? 0;
  totals.outputTokens += usage.outputTokens ?? 0;
}

export async function analyzeResume(text, targetRole, ask = askGemini) {
  const totals = { inputTokens: 0, outputTokens: 0 };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const { analysis, usage } = await ask(text, targetRole);
      addUsage(totals, usage);

      return {
        ...analysis,
        verdict: verdictFor(analysis.score),
        fallback: false,
        usage: totals,
      };
    } catch (error) {
      addUsage(totals, error?.usage);

      if (isConfigError(error)) {
        console.error(`[AI] config error: ${error.message}`);
        throw error;
      }

      console.warn(`[AI] attempt ${attempt} failed: ${error.message}`);
    }
  }

  return {
    ...fallbackAnalysis(text, targetRole),
    usage: totals,
  };
}
