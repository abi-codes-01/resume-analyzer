import { useState } from 'react';

const PRESET_ROLES = [
  'Frontend developer',
  'Backend developer',
  'Full-stack developer',
  'AI engineer',
];

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const MIN_ROLE_LENGTH = 2;
const MAX_ROLE_LENGTH = 80;

function validatePdfFile(file) {
  if (!file) {
    return 'Please choose a PDF file.';
  }

  const isPdfMime = file.type === 'application/pdf';
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  const isPdf = isPdfMime || (file.type === '' && isPdfExtension);

  if (!isPdf) {
    return 'Only PDF files are supported. Please choose a .pdf file.';
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File is too large. Please upload a PDF under 4 MB.';
  }

  return '';
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadForm({ onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [validationError, setValidationError] = useState('');

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (!file) {
      setValidationError('');
      return;
    }

    setValidationError(validatePdfFile(file));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fileError = validatePdfFile(selectedFile);
    if (fileError) {
      setValidationError(fileError);
      return;
    }

    const trimmedRole = targetRole.trim();
    if (
      trimmedRole.length < MIN_ROLE_LENGTH ||
      trimmedRole.length > MAX_ROLE_LENGTH
    ) {
      setValidationError('Please enter a target role (2–80 characters).');
      return;
    }

    setValidationError('');
    onSubmit(selectedFile, trimmedRole);
  }

  const trimmedRole = targetRole.trim();
  const isSubmitDisabled =
    !selectedFile ||
    Boolean(validationError) ||
    trimmedRole.length < MIN_ROLE_LENGTH;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="resume-file"
          className="block text-base font-semibold text-neutral-900"
        >
          Resume (PDF, under 4 MB)
        </label>

        <label
          htmlFor="resume-file"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-7 text-center transition hover:border-neutral-400 hover:bg-neutral-100/70 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/15"
        >
          <input
            id="resume-file"
            name="resume"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="sr-only"
          />

          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="mb-3 h-9 w-9 text-neutral-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            />
          </svg>

          {selectedFile ? (
            <div className="w-full min-w-0 space-y-1">
              <p className="truncate text-base font-semibold text-neutral-900">
                {selectedFile.name}
              </p>
              <p className="text-sm text-neutral-500">
                {formatFileSize(selectedFile.size)} &middot; Tap to replace
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-base font-semibold text-neutral-900">
                Choose a PDF file
              </p>
              <p className="text-sm text-neutral-500">
                PDF only, maximum size 4 MB
              </p>
            </div>
          )}
        </label>
      </div>

      <div className="space-y-2.5">
        <label
          htmlFor="target-role"
          className="block text-base font-semibold text-neutral-900"
        >
          Target role
        </label>

        <input
          id="target-role"
          name="targetRole"
          type="text"
          required
          maxLength={MAX_ROLE_LENGTH}
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
          placeholder="e.g., Java Backend Developer, Frontend Engineer, Data Analyst"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 shadow-xs transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
        />

        <div className="flex flex-wrap gap-2" aria-label="Popular target roles">
          {PRESET_ROLES.map((role) => {
            const isSelected =
              trimmedRole.toLowerCase() === role.toLowerCase();
            return (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-neutral-900 text-white'
                    : 'border border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full cursor-pointer rounded-xl bg-[#D4F34A] px-5 py-3.5 text-base font-semibold text-neutral-950 shadow-xs transition hover:bg-[#c6e63c] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
        >
          Analyse my resume
        </button>

        {validationError && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {validationError}
          </p>
        )}
      </div>
    </form>
  );
}
