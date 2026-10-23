import type { Category, ExtraItem, ItemMatch } from '../types';
import { makeItemKey } from '../types';

/**
 * Case-insensitive, trimmed lookup for an existing item with this name,
 * across hard-coded essentials and this week's one-off extras — in that
 * priority order. Used to avoid creating duplicates when the typed name
 * already exists somewhere (possibly in a different category).
 */
export function findExistingItem(
  name: string,
  categories: Category[],
  extras: ExtraItem[],
): ItemMatch | null {
  const target = name.trim().toLowerCase();
  if (!target) return null;

  function categoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? categoryId;
  }

  for (const category of categories) {
    for (const item of category.items) {
      if (item.toLowerCase() === target) {
        return {
          key: makeItemKey(category.id, item),
          categoryId: category.id,
          categoryName: category.name,
          name: item,
        };
      }
    }
  }

  for (const extra of extras) {
    if (extra.name.toLowerCase() === target) {
      return {
        key: extra.key,
        categoryId: extra.categoryId,
        categoryName: categoryName(extra.categoryId),
        name: extra.name,
      };
    }
  }

  return null;
}

export interface ItemSuggestion {
  label: string;
  categoryId: string;
}

/** Flat, de-duplicated (case-insensitive) list of every known item name, for autocomplete. */
export function buildSuggestions(categories: Category[], extras: ExtraItem[]): ItemSuggestion[] {
  const seen = new Set<string>();
  const out: ItemSuggestion[] = [];

  function add(label: string, categoryId: string) {
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label, categoryId });
  }

  for (const category of categories) {
    for (const item of category.items) add(item, category.id);
  }
  for (const extra of extras) add(extra.name, extra.categoryId);

  return out;
}
