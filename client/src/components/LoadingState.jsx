export default function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div
        aria-hidden="true"
        className="mb-5 h-14 w-14 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900"
      />
      <p className="text-lg font-semibold text-neutral-900">
        Reading your resume like a recruiter would...
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        Checking role fit, key skills, and the highest-impact fixes.
      </p>
    </div>
  );
}
