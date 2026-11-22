import { askGemini } from '../lib/askGemini.js';
import { verdictFor } from '../lib/verdict.js';

const SAMPLE_ROLE = 'Full-stack developer';
const SAMPLE_RESUME = `
Alex Rivera
Final-Year B.S. Computer Science Student

Skills: JavaScript, React, Node.js, Express, MongoDB, REST APIs, Git, HTML, CSS

Projects:
- StudySync: Built a real-time study room web app using React, Node.js, Express, and MongoDB with JWT login and REST APIs.
- BudgetTrack: Personal expense tracker deployed on Vercel with CSV export and chart summaries.

Education:
State University — B.S. Computer Science, Expected May 2027 (GPA 3.7/4.0)
`.trim();

try {
  const startedAt = Date.now();
  const { analysis, usage } = await askGemini(SAMPLE_RESUME, SAMPLE_ROLE);
  const elapsedMs = Date.now() - startedAt;
  const result = {
    targetRole: SAMPLE_ROLE,
    ...analysis,
    verdict: verdictFor(analysis.score),
  };

  console.log(`[AI] test passed in ${elapsedMs} ms`);
  console.log(JSON.stringify({ result, usage }, null, 2));
} catch (error) {
  const status = error?.status ?? error?.code;
  const details = status ? `status=${status} ` : '';
  console.error(`[AI] test failed: ${details}${error.message}`);
  if (error?.usage) {
    console.error('[AI] token usage before failure:', JSON.stringify(error.usage));
  }
  process.exitCode = 1;
}
