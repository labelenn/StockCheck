import { useId, useState } from 'react';

interface ExtraItemInputProps {
  onAdd: (name: string) => void;
  placeholder?: string;
}

export function ExtraItemInput({ onAdd, placeholder = 'Add extra item' }: ExtraItemInputProps) {
  const [value, setValue] = useState('');
  const inputId = useId();

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  }

  return (
    <form
      className="flex items-center gap-2 px-4 py-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="min-h-11 flex-shrink-0 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors enabled:hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
      >
        Add
      </button>
    </form>
  );
}
