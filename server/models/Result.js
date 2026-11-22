import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    targetRole: { type: String, required: true },
    score: { type: Number, default: null },
    verdict: { type: String, required: true },
    skillsFound: { type: [String], default: [] },
    skillsMissing: { type: [String], default: [] },
    topFixes: { type: [String], default: [] },
    fallback: { type: Boolean, required: true },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    costInr: { type: Number, default: 0 },
  },
  { timestamps: true },
);

resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ createdAt: 1 });

export const Result = mongoose.model('Result', resultSchema);
