interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:bottom-6"
    >
      {message && (
        <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition-opacity duration-200 ease-out-soft dark:bg-slate-100 dark:text-slate-900">
          {message}
        </div>
      )}
    </div>
  );
}
