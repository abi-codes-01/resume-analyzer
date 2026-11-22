import { z } from 'zod';

export const AnalysisSchema = z.object({
  score: z.number().describe('Whole number from 0 to 100'),
  skillsFound: z.array(z.string()),
  skillsMissing: z.array(z.string()),
  topFixes: z.array(z.string()).length(3),
});

export const AnalysisJsonSchema = {
  type: 'object',
  properties: {
    score: {
      type: 'number',
      description: 'Whole number from 0 to 100',
    },
    skillsFound: {
      type: 'array',
      items: { type: 'string' },
    },
    skillsMissing: {
      type: 'array',
      items: { type: 'string' },
    },
    topFixes: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ['score', 'skillsFound', 'skillsMissing', 'topFixes'],
};
