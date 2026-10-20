interface ItemRowProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Show the label struck-through when checked (used in the shopping list view). */
  strikeThrough?: boolean;
  /** When provided, renders a remove button for one-off extras. */
  onRemove?: () => void;
}

export function ItemRow({ id, label, checked, onChange, strikeThrough, onRemove }: ItemRowProps) {
  return (
    <div className="flex min-h-11 items-stretch">
      <label
        htmlFor={id}
        className="flex min-h-11 flex-1 cursor-pointer select-none items-center gap-3 px-4 py-2 transition-colors active:bg-slate-100 dark:active:bg-slate-800"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 flex-shrink-0 rounded border-2 border-slate-300 text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:bg-slate-800"
        />
        <span
          className={
            strikeThrough && checked
              ? 'text-slate-400 line-through dark:text-slate-500'
              : 'text-slate-800 dark:text-slate-100'
          }
        >
          {label}
        </span>
      </label>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="flex w-11 flex-shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-slate-500 dark:hover:text-red-400"
        >
          ✕
        </button>
      )}
    </div>
  );
}
