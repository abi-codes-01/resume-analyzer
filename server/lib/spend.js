import { Result } from '../models/Result.js';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export function todayKeyIst(now = new Date()) {
  const istDate = new Date(now.getTime() + IST_OFFSET_MS);
  return istDate.toISOString().slice(0, 10);
}

export function startOfTodayIst(now = new Date()) {
  return new Date(`${todayKeyIst(now)}T00:00:00+05:30`);
}

export async function spentTodayInr() {
  const [summary] = await Result.aggregate([
    { $match: { createdAt: { $gte: startOfTodayIst() } } },
    { $group: { _id: null, total: { $sum: '$costInr' } } },
  ]);

  return Number((summary?.total ?? 0).toFixed(4));
}
