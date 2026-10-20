import type { ItemKey, ShoppingListCategory } from '../types';
import { getCategoryAccent } from '../lib/colors';
import { ItemRow } from './ItemRow';

interface ShoppingListViewProps {
  list: ShoppingListCategory[];
  basketTicks: Record<ItemKey, boolean>;
  onToggleBasket: (key: ItemKey) => void;
  onRemoveExtra: (key: ItemKey) => void;
  onBack: () => void;
}

export function ShoppingListView({
  list,
  basketTicks,
  onToggleBasket,
  onRemoveExtra,
  onBack,
}: ShoppingListViewProps) {
  const totalCount = list.reduce((sum, c) => sum + c.entries.length, 0);
  const inBasketCount = list.reduce(
    (sum, c) => sum + c.entries.filter((e) => basketTicks[e.key]).length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 rounded-lg px-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-950"
        >
          ← Back to check
        </button>
        {totalCount > 0 && (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {inBasketCount}/{totalCount} in basket
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <span aria-hidden="true" className="text-4xl">
            🎉
          </span>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Nothing to buy!
          </p>
          <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Everything's in stock. Head back to the check stage if you need to update anything.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((category) => {
            const accent = getCategoryAccent(category.id);
            return (
              <section
                key={category.id}
                className={`overflow-hidden rounded-xl border-l-4 bg-white shadow-sm dark:bg-slate-900 ${accent.border}`}
                aria-labelledby={`shopping-${category.id}-heading`}
              >
                <h2
                  id={`shopping-${category.id}-heading`}
                  className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-slate-800 dark:text-slate-100"
                >
                  <span aria-hidden="true">{category.icon}</span>
                  {category.name}
                </h2>
                <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
                  {category.entries.map((entry) => (
                    <ItemRow
                      key={entry.key}
                      id={`shop-${entry.key}`}
                      label={entry.name}
                      checked={!!basketTicks[entry.key]}
                      onChange={() => onToggleBasket(entry.key)}
                      strikeThrough
                      onRemove={entry.isExtra ? () => onRemoveExtra(entry.key) : undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
