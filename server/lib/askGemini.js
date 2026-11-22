import { GoogleGenAI } from '@google/genai';
import { AnalysisJsonSchema, AnalysisSchema } from './analysisSchema.js';
import { analyzerRules } from './analyzerRules.js';
import { findPresetSkills } from './roles.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const MAX_OUTPUT_TOKENS = 1500;

function buildUserContent(text, targetRole) {
  const presetSkills = findPresetSkills(targetRole);
  const skillsLine = presetSkills
    ? `Core skills for this role: ${presetSkills.join(', ')}`
    : `Core skills for this role: evaluate against the standard entry-level core skills expected for a ${targetRole}.`;

  return `Target role: ${targetRole}\n${skillsLine}\n\n<resume>\n${text}\n</resume>`;
}

export async function askGemini(text, targetRole) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('[AI] Missing GEMINI_API_KEY in server/.env');
    error.isConfigError = true;
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const userContent = buildUserContent(text, targetRole);

  const response = await ai.models.generateContent({
    model,
    contents: userContent,
    config: {
      systemInstruction: analyzerRules,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      responseMimeType: 'application/json',
      responseJsonSchema: AnalysisJsonSchema,
    },
  });

  const usage = {
    inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
  };

  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason !== 'STOP') {
    const error = new Error(
      `[AI] Model stopped with finishReason: ${finishReason ?? 'UNKNOWN'}`,
    );
    error.usage = usage;
    throw error;
  }

  let parsed;
  try {
    parsed = JSON.parse(response.text ?? '');
  } catch (parseError) {
    const error = new Error(`[AI] Invalid JSON response: ${parseError.message}`);
    error.usage = usage;
    throw error;
  }

  const validation = AnalysisSchema.safeParse(parsed);
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    const issuePath = firstIssue?.path?.join('.') || 'root';
    const error = new Error(
      `[AI] Invalid analysis schema at ${issuePath}: ${firstIssue?.message ?? 'unknown error'}`,
    );
    error.usage = usage;
    throw error;
  }

  const clampedScore = Math.round(
    Math.min(100, Math.max(0, validation.data.score)),
  );

  return {
    analysis: { ...validation.data, score: clampedScore },
    usage,
  };
}
