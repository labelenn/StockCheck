/** Per-category accent colors (Tailwind classes), light + dark mode aware. */
export interface CategoryAccent {
  border: string;
  dot: string;
  text: string;
}

const palette: Record<string, CategoryAccent> = {
  bathroom: {
    border: 'border-cyan-400 dark:border-cyan-500',
    dot: 'bg-cyan-500',
    text: 'text-cyan-700 dark:text-cyan-300',
  },
  laundry: {
    border: 'border-indigo-400 dark:border-indigo-500',
    dot: 'bg-indigo-500',
    text: 'text-indigo-700 dark:text-indigo-300',
  },
  pantry: {
    border: 'border-amber-400 dark:border-amber-500',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
  },
  refrigerator: {
    border: 'border-blue-400 dark:border-blue-500',
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
  },
  freezer: {
    border: 'border-sky-400 dark:border-sky-500',
    dot: 'bg-sky-500',
    text: 'text-sky-700 dark:text-sky-300',
  },
  'household-cleaning': {
    border: 'border-emerald-400 dark:border-emerald-500',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  toiletries: {
    border: 'border-pink-400 dark:border-pink-500',
    dot: 'bg-pink-500',
    text: 'text-pink-700 dark:text-pink-300',
  },
  'kitchen-supplies': {
    border: 'border-orange-400 dark:border-orange-500',
    dot: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
  },
  other: {
    border: 'border-slate-400 dark:border-slate-500',
    dot: 'bg-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
};

const fallback: CategoryAccent = palette.other;

export function getCategoryAccent(categoryId: string): CategoryAccent {
  return palette[categoryId] ?? fallback;
}
