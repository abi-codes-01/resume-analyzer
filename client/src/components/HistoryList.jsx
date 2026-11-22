function formatDateDmy(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function HistoryList({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Past analyses"
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/80 sm:p-6"
    >
      <h2 className="text-base font-semibold text-neutral-900">
        Recent analyses
      </h2>

      <ul className="mt-3 divide-y divide-neutral-100">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {item.targetRole}
              </p>
              <p className="text-xs text-neutral-500">
                {formatDateDmy(item.createdAt)}
              </p>
            </div>

            {item.fallback ? (
              <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                skill match
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-900">
                {item.score} / 100
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
