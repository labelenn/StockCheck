import type { Preset } from '../types';

interface PresetSwitchProps {
  value: Preset;
  onChange: (preset: Preset) => void;
}

const options: { value: Preset; label: string }[] = [
  { value: 'notes', label: 'Notes' },
  { value: 'messenger', label: 'Message' },
  { value: 'markdown', label: 'Markdown' },
];

export function PresetSwitch({ value, onChange }: PresetSwitchProps) {
  return (
    <div
      role="radiogroup"
      aria-label="List format"
      className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`min-h-9 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
              selected
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
