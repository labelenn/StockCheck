import { describe, expect, it } from 'vitest';
import { formatList } from './format';
import type { ShoppingListCategory } from '../types';

const sampleList: ShoppingListCategory[] = [
  {
    id: 'pantry',
    name: 'Pantry',
    icon: '🥫',
    entries: [
      { key: 'pantry::Rice', categoryId: 'pantry', name: 'Rice', isExtra: false },
      { key: 'pantry::Pasta', categoryId: 'pantry', name: 'Pasta', isExtra: false },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: '🛁',
    entries: [
      {
        key: 'bathroom::Toilet paper',
        categoryId: 'bathroom',
        name: 'Toilet paper',
        isExtra: false,
      },
    ],
  },
];

const fixedNow = new Date('2026-10-20T12:00:00Z');

describe('formatList', () => {
  describe('notes preset', () => {
    it('outputs category name then plain item lines, blank line between categories', () => {
      const result = formatList(sampleList, 'notes');
      expect(result).toBe('Pantry\nRice\nPasta\n\nBathroom\nToilet paper');
    });

    it('has no bullets or symbols', () => {
      const result = formatList(sampleList, 'notes');
      expect(result).not.toMatch(/[-*☐•]/);
    });

    it('returns empty string for an empty list', () => {
      expect(formatList([], 'notes')).toBe('');
    });
  });

  describe('messenger preset', () => {
    it('includes a heading with the date and uppercase category headers with checkbox lines', () => {
      const result = formatList(sampleList, 'messenger', { now: fixedNow });
      expect(result.startsWith('🛒 Shopping List - 20 Oct 2026')).toBe(true);
      expect(result).toContain('PANTRY');
      expect(result).toContain('☐ Rice');
      expect(result).toContain('☐ Pasta');
      expect(result).toContain('BATHROOM');
      expect(result).toContain('☐ Toilet paper');
    });

    it('bolds headers with asterisks when whatsappBold is set', () => {
      const result = formatList(sampleList, 'messenger', { now: fixedNow, whatsappBold: true });
      expect(result).toContain('*PANTRY*');
      expect(result).toContain('*BATHROOM*');
    });

    it('does not bold headers by default', () => {
      const result = formatList(sampleList, 'messenger', { now: fixedNow });
      expect(result).not.toContain('*PANTRY*');
    });

    it('is a single plain string with categories separated by blank lines', () => {
      const result = formatList(sampleList, 'messenger', { now: fixedNow });
      const parts = result.split('\n\n');
      expect(parts.length).toBe(3); // heading + 2 categories
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
