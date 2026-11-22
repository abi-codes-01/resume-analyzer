const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ResultCard({ result, onReset }) {
  const isFallback = Boolean(result.fallback);
  const clampedScore =
    typeof result.score === 'number'
      ? Math.max(0, Math.min(100, result.score))
      : 0;
  const strokeDashoffset =
    RING_CIRCUMFERENCE - (clampedScore / 100) * RING_CIRCUMFERENCE;

  return (
    <div className="space-y-7">
      {isFallback ? (
        <div className="space-y-4 border-b border-neutral-200 pb-6">
          <div
            role="status"
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
          >
            Our AI is busy, so this is a basic skill match. Try again in a
            minute for your full score.
          </div>
          <div className="space-y-1.5">
            <p className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
              {result.targetRole}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              {result.verdict}
            </h2>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 border-b border-neutral-200 pb-6 text-center sm:flex-row sm:gap-6 sm:text-left">
          <div
            aria-label={`Score: ${clampedScore} out of 100`}
            className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 112 112"
              className="h-full w-full -rotate-90"
            >
              <circle
                cx="56"
                cy="56"
                r={RING_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-neutral-200"
              />
              <circle
                cx="56"
                cy="56"
                r={RING_RADIUS}
                fill="none"
                stroke="#171717"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold leading-none text-neutral-950">
                {clampedScore}
              </span>
              <span className="mt-1 text-xs font-medium text-neutral-500">
                / 100
              </span>
            </div>
          </div>

          <div className="min-w-0 space-y-1.5">
            <p className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
              {result.targetRole}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              {result.verdict}
            </h2>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-neutral-900">
          Skills found
        </h3>
        {result.skillsFound.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {result.skillsFound.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-medium text-emerald-800"
              >
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">
            None of the core skills were detected yet.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-neutral-900">
          Skills missing
        </h3>
        {result.skillsMissing.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {result.skillsMissing.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium text-red-800"
              >
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">
            All core skills for this role were found.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-neutral-900">
          Top 3 fixes
        </h3>
        <ol className="space-y-3">
          {result.topFixes.map((fix, index) => (
            <li
              key={`${index}-${fix}`}
              className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 text-base leading-relaxed text-neutral-800"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span>{fix}</span>
            </li>
          ))}
        </ol>
      </section>

      <button
        type="button"
        onClick={onReset}
        className="w-full cursor-pointer rounded-xl bg-[#D4F34A] px-5 py-3.5 text-base font-semibold text-neutral-950 shadow-xs transition hover:bg-[#c6e63c] active:scale-[0.99]"
      >
        Analyse another
      </button>
    </div>
  );
}
