export const PRICES_USD_PER_MILLION = {
  'gemini-3.5-flash-lite': { input: 0.3, output: 2.5 },
};

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

function isValidNonNegativeNumber(raw) {
  if (raw === undefined || raw.trim() === '') {
    return false;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0;
}

export function costInr(
  { inputTokens = 0, outputTokens = 0 } = {},
  model = process.env.GEMINI_MODEL || DEFAULT_MODEL,
) {
  const price = PRICES_USD_PER_MILLION[model];
  if (!price) {
    throw new Error(`[Cost] No pricing configured for model "${model}"`);
  }

  const usd =
    (inputTokens * price.input + outputTokens * price.output) / 1_000_000;
  const inr = usd * Number(process.env.USD_INR);
  return Number(inr.toFixed(4));
}

export function checkCostConfig() {
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!Object.hasOwn(PRICES_USD_PER_MILLION, model)) {
    console.error(
      `[Cost] Unknown GEMINI_MODEL "${model}". Add its rate to PRICES_USD_PER_MILLION.`,
    );
    process.exit(1);
  }

  if (!isValidNonNegativeNumber(process.env.USD_INR)) {
    console.error(
      '[Cost] USD_INR is missing or not a valid non-negative number.',
    );
    process.exit(1);
  }

  if (!isValidNonNegativeNumber(process.env.DAILY_CAP_INR)) {
    console.error(
      '[Cost] DAILY_CAP_INR is missing or not a valid non-negative number.',
    );
    process.exit(1);
  }
}
