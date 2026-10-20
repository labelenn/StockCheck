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
}

export type Preset = 'notes' | 'appleNotes' | 'messenger' | 'markdown';

export interface ShoppingListEntry {
  key: ItemKey;
  categoryId: string;
  name: string;
  isExtra: boolean;
}

export interface ShoppingListCategory {
  id: string;
  name: string;
  entries: ShoppingListEntry[];
}
