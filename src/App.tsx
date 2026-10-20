import { useEffect, useMemo, useState } from 'react';
import { categories } from './data/items';
import { STATE_TTL_DAYS, STORAGE_KEY } from './config';
import { usePersistentState } from './hooks/usePersistentState';
import { makeItemKey } from './types';
import type { Category, ExtraItem, ItemKey, Preset, ShoppingListCategory } from './types';
import { CategorySection } from './components/CategorySection';
import { ShoppingListView } from './components/ShoppingListView';
import { SendPanel } from './components/SendPanel';
import { Toast } from './components/Toast';

interface AppState {
  checked: Record<ItemKey, boolean>;
  extras: ExtraItem[];
  basketTicks: Record<ItemKey, boolean>;
  preset: Preset;
}

const initialState: AppState = {
  checked: {},
  extras: [],
  basketTicks: {},
  preset: 'notes',
};

const otherCategory: Category = { id: 'other', name: 'Other', icon: '🧩', items: [] };
const sectionCategories = [...categories, otherCategory];

function buildShoppingList(state: AppState): ShoppingListCategory[] {
  const result: ShoppingListCategory[] = [];

  for (const category of categories) {
    const entries: ShoppingListCategory['entries'] = [];
    for (const item of category.items) {
      const key = makeItemKey(category.id, item);
      if (!state.checked[key]) {
        entries.push({ key, categoryId: category.id, name: item, isExtra: false });
      }
    }
    for (const extra of state.extras.filter((e) => e.categoryId === category.id)) {
      entries.push({ key: extra.key, categoryId: category.id, name: extra.name, isExtra: true });
    }
    if (entries.length > 0) {
      result.push({ id: category.id, name: category.name, icon: category.icon, entries });
    }
  }

  const otherExtras = state.extras.filter((e) => e.categoryId === otherCategory.id);
  if (otherExtras.length > 0) {
    result.push({
      id: otherCategory.id,
      name: otherCategory.name,
      icon: otherCategory.icon,
      entries: otherExtras.map((e) => ({
        key: e.key,
        categoryId: otherCategory.id,
        name: e.name,
        isExtra: true,
      })),
    });
  }

  return result;
}

export default function App() {
  const [state, setState] = usePersistentState<AppState>(STORAGE_KEY, initialState, {
    ttlDays: STATE_TTL_DAYS,
    onExpire: (expired, initial) => ({ ...initial, preset: expired.preset }),
  });
  const [stage, setStage] = useState<'check' | 'shopping'>('check');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const totalEssentials = useMemo(() => categories.reduce((sum, c) => sum + c.items.length, 0), []);
  const checkedCount = useMemo(
    () => Object.values(state.checked).filter(Boolean).length,
    [state.checked],
  );

  const shoppingList = useMemo(() => buildShoppingList(state), [state]);
  const toBuyCount = useMemo(
    () => shoppingList.reduce((sum, c) => sum + c.entries.length, 0),
    [shoppingList],
  );

  function toggleChecked(key: ItemKey) {
    setState((prev) => ({ ...prev, checked: { ...prev.checked, [key]: !prev.checked[key] } }));
  }

  function toggleBasket(key: ItemKey) {
    setState((prev) => ({
      ...prev,
      basketTicks: { ...prev.basketTicks, [key]: !prev.basketTicks[key] },
    }));
  }

  function addExtra(categoryId: string, name: string) {
    const key = makeItemKey(categoryId, name);
    setState((prev) => {
      if (prev.extras.some((e) => e.key === key)) return prev;
      return { ...prev, extras: [...prev.extras, { key, categoryId, name }] };
    });
  }

  function removeExtra(key: ItemKey) {
    setState((prev) => ({
      ...prev,
      extras: prev.extras.filter((e) => e.key !== key),
      basketTicks: Object.fromEntries(Object.entries(prev.basketTicks).filter(([k]) => k !== key)),
    }));
  }

  function setPreset(preset: Preset) {
    setState((prev) => ({ ...prev, preset }));
  }

  function startNewWeek() {
    const confirmed = window.confirm(
      'Start a new week? This clears everything you\u2019ve checked off and any extra items you\u2019ve added.',
    );
    if (!confirmed) return;
    setState((prev) => ({ ...initialState, preset: prev.preset }));
    setStage('check');
    setToast('Started a new week');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="flex-shrink-0 text-2xl">
              🛒
            </span>
            <h1 className="truncate text-lg font-bold text-slate-800 dark:text-slate-100">
              StockCheck
            </h1>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <p
              aria-live="polite"
              className="whitespace-nowrap text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400"
            >
              {stage === 'check'
                ? `${checkedCount}/${totalEssentials} checked`
                : `${toBuyCount} to buy`}
            </p>
            <button
              type="button"
              onClick={startNewWeek}
              className="min-h-9 flex-shrink-0 whitespace-nowrap rounded-lg border border-slate-300 px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:px-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <span className="sm:hidden">New week</span>
              <span className="hidden sm:inline">Start new week</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-4 pb-28 sm:pb-6">
        {stage === 'check' ? (
          <div className="space-y-4">
            {sectionCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                checked={state.checked}
                onToggle={toggleChecked}
                extras={state.extras.filter((e) => e.categoryId === category.id)}
                onAddExtra={addExtra}
                onRemoveExtra={removeExtra}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <ShoppingListView
              list={shoppingList}
              basketTicks={state.basketTicks}
              onToggleBasket={toggleBasket}
              onRemoveExtra={removeExtra}
              onBack={() => setStage('check')}
            />
            {shoppingList.length > 0 && (
              <SendPanel
                list={shoppingList}
                preset={state.preset}
                onPresetChange={setPreset}
                onToast={setToast}
              />
            )}
          </div>
        )}
      </main>

      {stage === 'check' && (
        <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => setStage('shopping')}
              className="min-h-11 w-full rounded-lg bg-emerald-600 px-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Generate shopping list
            </button>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
