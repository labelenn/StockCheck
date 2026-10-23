import { describe, expect, it } from 'vitest';
import { formatList } from './format';
import type { ShoppingListCategory } from '../types';

const sampleList: ShoppingListCategory[] = [
  {
    id: 'pantry',
    name: 'Pantry',
    entries: [
      { key: 'pantry::Rice', categoryId: 'pantry', name: 'Rice', isExtra: false, gotIt: false },
      { key: 'pantry::Pasta', categoryId: 'pantry', name: 'Pasta', isExtra: false, gotIt: false },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    entries: [
      {
        key: 'bathroom::Toilet paper',
        categoryId: 'bathroom',
        name: 'Toilet paper',
        isExtra: false,
        gotIt: false,
      },
    ],
  },
];

const fixedNow = new Date('2026-10-20T12:00:00Z');

describe('formatList', () => {
  describe('notes preset', () => {
    it('includes a heading with the date and uppercase category headers without checkbox glyphs', () => {
      const result = formatList(sampleList, 'notes', { now: fixedNow });
      expect(result.startsWith('🛒 Shopping List - 20 Oct 2026')).toBe(true);
      expect(result).toContain('PANTRY');
      expect(result).toContain('Rice');
      expect(result).toContain('Pasta');
      expect(result).toContain('BATHROOM');
      expect(result).toContain('Toilet paper');
      expect(result).not.toContain('☐');
    });

    it('is a single plain string with categories separated by blank lines', () => {
      const result = formatList(sampleList, 'notes', { now: fixedNow });
      const parts = result.split('\n\n');
      expect(parts.length).toBe(3); // heading + 2 categories
    });

    it('appends a note in parentheses when present', () => {
      const withNote: ShoppingListCategory[] = [
        {
          id: 'pantry',
          name: 'Pantry',
          entries: [
            {
              key: 'pantry::Milk',
              categoryId: 'pantry',
              name: 'Milk',
              isExtra: true,
              gotIt: false,
              note: '2 packs',
            },
          ],
        },
      ];
      const result = formatList(withNote, 'notes', { now: fixedNow });
      expect(result).toContain('Milk (2 packs)');
    });

    it('returns empty string for an empty list', () => {
      expect(formatList([], 'notes')).toBe('');
    });
  });

  describe('markdown preset', () => {
    it('outputs ## category headers and - [ ] item checklist lines', () => {
      const result = formatList(sampleList, 'markdown');
      expect(result).toBe('## Pantry\n- [ ] Rice\n- [ ] Pasta\n\n## Bathroom\n- [ ] Toilet paper');
    });

    it('returns empty string for an empty list', () => {
      expect(formatList([], 'markdown')).toBe('');
    });
  });
});
