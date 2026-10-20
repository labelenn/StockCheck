import type { Category, ExtraItem, ItemKey } from '../types';
import { makeItemKey } from '../types';
import { getCategoryAccent } from '../lib/colors';
import { ItemRow } from './ItemRow';
import { ExtraItemInput } from './ExtraItemInput';

interface CategorySectionProps {
  category: Category;
  checked: Record<ItemKey, boolean>;
  onToggle: (key: ItemKey) => void;
  extras: ExtraItem[];
  onAddExtra: (categoryId: string, name: string) => void;
  onRemoveExtra: (key: ItemKey) => void;
}

export function CategorySection({
  category,
  checked,
  onToggle,
  extras,
  onAddExtra,
  onRemoveExtra,
}: CategorySectionProps) {
  const accent = getCategoryAccent(category.id);
  const hasEssentials = category.items.length > 0;
  const checkedCount = category.items.filter(
    (item) => checked[makeItemKey(category.id, item)],
  ).length;
  const badgeText = hasEssentials
    ? `${checkedCount}/${category.items.length} checked`
    : extras.length > 0
      ? `${extras.length} extra item${extras.length > 1 ? 's' : ''}`
      : 'One-off items';

  return (
    <details
      open
      className={`group overflow-hidden rounded-xl border-l-4 bg-white shadow-sm dark:bg-slate-900 ${accent.border}`}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
          <span aria-hidden="true">{category.icon}</span>
          {category.name}
        </span>
        <span className="flex items-center gap-2">
          <span className={`text-sm font-medium ${accent.text}`}>{badgeText}</span>
          <span
            aria-hidden="true"
            className="text-slate-400 transition-transform duration-200 ease-out-soft group-open:rotate-180"
          >
            ▾
          </span>
        </span>
      </summary>

      <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
        {category.items.map((item) => {
          const key = makeItemKey(category.id, item);
          return (
            <ItemRow
              key={key}
              id={key}
              label={item}
              checked={!!checked[key]}
              onChange={() => onToggle(key)}
            />
          );
        })}
        {extras.map((extra) => (
          <div key={extra.key} className="flex min-h-11 items-stretch">
            <div className="flex min-h-11 flex-1 items-center gap-3 px-4 py-2">
              <span
                aria-hidden="true"
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-sm"
                title="Extra item — always on the shopping list"
              >
                ➕
              </span>
              <span className="text-slate-800 dark:text-slate-100">{extra.name}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemoveExtra(extra.key)}
              aria-label={`Remove ${extra.name}`}
              className="flex w-11 flex-shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-slate-500 dark:hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800">
        <ExtraItemInput
          placeholder={`Add extra ${category.name.toLowerCase()} item`}
          onAdd={(name) => onAddExtra(category.id, name)}
        />
      </div>
    </details>
  );
}
