export default function ErrorState({ message, onRetry }) {
  return (
    <div className="space-y-6 py-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-neutral-950">
          Could not analyse your resume
        </h2>
        <p role="alert" className="text-base text-neutral-600">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="w-full cursor-pointer rounded-xl bg-[#D4F34A] px-5 py-3.5 text-base font-semibold text-neutral-950 shadow-xs transition hover:bg-[#c6e63c] active:scale-[0.99]"
      >
        Try again
      </button>
    </div>
  );
}
