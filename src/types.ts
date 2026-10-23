export interface Category {
  id: string;
  name: string;
  items: string[];
}

/** Stable identity for an item, derived from categoryId + item name. */
export type ItemKey = string;

export function makeItemKey(categoryId: string, itemName: string): ItemKey {
  return `${categoryId}::${itemName}`;
}

export interface ExtraItem {
  key: ItemKey;
  categoryId: string;
  name: string;
  note?: string;
}

export type Preset = 'notes' | 'markdown';

export interface ShoppingListEntry {
  key: ItemKey;
  categoryId: string;
  name: string;
  isExtra: boolean;
  note?: string;
  gotIt: boolean;
}

export interface ShoppingListCategory {
  id: string;
  name: string;
  entries: ShoppingListEntry[];
}

/** A match found while checking a typed name against existing items (for duplicate detection). */
export interface ItemMatch {
  key: ItemKey;
  categoryId: string;
  categoryName: string;
  name: string;
}
