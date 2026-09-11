export function ErrorNotice({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="text-xl font-semibold text-text">Something went wrong</h1>
      <p className="max-w-md text-sm text-text/60">
        We hit an unexpected error. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
