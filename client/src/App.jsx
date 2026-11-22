import { useCallback, useEffect, useRef, useState } from 'react';
import ErrorState from './components/ErrorState';
import HistoryList from './components/HistoryList';
import LoadingState from './components/LoadingState';
import ResultCard from './components/ResultCard';
import UploadForm from './components/UploadForm';
import { analyzeResume, fetchResults } from './lib/api';
import { getUserId } from './lib/userId';

const DEV_STATES = ['idle', 'loading', 'done', 'error'];
const DEFAULT_ERROR_MESSAGE =
  'Something went wrong while reading your PDF. Please try again.';

export default function App() {
  const [userId] = useState(() => getUserId());
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const activeRequestIdRef = useRef(0);

  const loadHistory = useCallback(async () => {
    try {
      const items = await fetchResults(userId);
      setHistory(items);
    } catch {
      setHistory((current) => current);
    }
  }, [userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function handleAnalyze(file, targetRole) {
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;

    setErrorMessage('');
    setStatus('loading');

    try {
      const data = await analyzeResume(file, targetRole, userId);
      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      setResult(data);
      setStatus('done');
      loadHistory();
    } catch (error) {
      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : DEFAULT_ERROR_MESSAGE,
      );
      setStatus('error');
    }
  }

  function handleReset() {
    activeRequestIdRef.current += 1;
    setErrorMessage('');
    setStatus('idle');
  }

  function handleDevStateSelect(nextStatus) {
    if (nextStatus === 'done' && !result) {
      return;
    }

    activeRequestIdRef.current += 1;

    if (nextStatus === 'error') {
      setErrorMessage((current) => current || DEFAULT_ERROR_MESSAGE);
    }

    setStatus(nextStatus);
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-6 text-neutral-900 sm:py-12">
      <div className="mx-auto w-full max-w-[640px] space-y-6">
        <header className="space-y-1.5 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Resume Analyzer
          </h1>
          <p className="text-base text-neutral-600">
            Upload your PDF resume for instant role-focused feedback.
          </p>
        </header>

        <main className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/80 sm:p-8">
          {status === 'idle' && <UploadForm onSubmit={handleAnalyze} />}
          {status === 'loading' && <LoadingState />}
          {status === 'done' && result && (
            <ResultCard result={result} onReset={handleReset} />
          )}
          {status === 'error' && (
            <ErrorState
              message={errorMessage || DEFAULT_ERROR_MESSAGE}
              onRetry={handleReset}
            />
          )}
        </main>

        <HistoryList items={history} />

        {import.meta.env.DEV && (
          <aside
            aria-label="Development state switcher"
            className="flex flex-wrap items-center justify-center gap-2 pt-1"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Dev state:
            </span>
            {DEV_STATES.map((stateName) => {
              const isActive = status === stateName;
              const isDisabled = stateName === 'done' && !result;
              return (
                <button
                  key={stateName}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDevStateSelect(stateName)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    isActive
                      ? 'cursor-pointer bg-neutral-900 text-white'
                      : isDisabled
                        ? 'cursor-not-allowed bg-neutral-100 text-neutral-400 ring-1 ring-neutral-200'
                        : 'cursor-pointer bg-white text-neutral-600 ring-1 ring-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {stateName}
                </button>
              );
            })}
          </aside>
        )}
      </div>
    </div>
  );
}
