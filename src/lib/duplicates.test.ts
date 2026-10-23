import { describe, expect, it } from 'vitest';
import { buildSuggestions, findExistingItem } from './duplicates';
import type { Category, ExtraItem } from '../types';

const categories: Category[] = [
  { id: 'pantry', name: 'Pantry', items: ['Rice', 'Sugar'] },
  { id: 'bathroom', name: 'Bathroom', items: ['Toilet paper'] },
];

describe('findExistingItem', () => {
  it('matches a hard-coded item case-insensitively and trims whitespace', () => {
    const match = findExistingItem('  rice  ', categories, []);
    expect(match).toEqual({
      key: 'pantry::Rice',
      categoryId: 'pantry',
      categoryName: 'Pantry',
      name: 'Rice',
    });
  });

  it('matches across categories, returning the item\u2019s own category', () => {
    const match = findExistingItem('Toilet Paper', categories, []);
    expect(match?.categoryId).toBe('bathroom');
  });

  it('matches a one-off extra', () => {
    const extras: ExtraItem[] = [{ key: 'pantry::Jam', categoryId: 'pantry', name: 'Jam' }];
    const match = findExistingItem('Jam', categories, extras);
    expect(match?.key).toBe('pantry::Jam');
  });

  it('returns null when nothing matches', () => {
    expect(findExistingItem('Nonexistent', categories, [])).toBeNull();
  });

  it('returns null for an empty or whitespace-only name', () => {
    expect(findExistingItem('   ', categories, [])).toBeNull();
  });
});

describe('buildSuggestions', () => {
  it('includes hard-coded items and one-off extras', () => {
    const extras: ExtraItem[] = [{ key: 'pantry::Jam', categoryId: 'pantry', name: 'Jam' }];
    const suggestions = buildSuggestions(categories, extras);
    const labels = suggestions.map((s) => s.label);
    expect(labels).toEqual(['Rice', 'Sugar', 'Toilet paper', 'Jam']);
  });

  it('de-duplicates case-insensitively', () => {
    const extras: ExtraItem[] = [{ key: 'pantry::rice', categoryId: 'pantry', name: 'rice' }];
    const suggestions = buildSuggestions(categories, extras);
    expect(suggestions.filter((s) => s.label.toLowerCase() === 'rice')).toHaveLength(1);
  });
});
