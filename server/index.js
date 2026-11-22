import cors from 'cors';
import express from 'express';
import { connectDb } from './db.js';
import { checkCostConfig } from './lib/cost.js';
import { errorHandler } from './middleware/errors.js';
import analyzeRouter from './routes/analyze.js';
import resultsRouter from './routes/results.js';

checkCostConfig();
await connectDb();

const app = express();
const port = process.env.PORT || 4000;
const clientOrigin = (
  process.env.CLIENT_ORIGIN || 'http://localhost:5173'
).replace(/\/$/, '');

app.set('trust proxy', 1);
app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(analyzeRouter);
app.use(resultsRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[Server] listening on http://localhost:${port}`);
});
