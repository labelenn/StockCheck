import type { Preset, ShoppingListCategory } from '../types';

/** Formats today's date like "20 Oct 2026" for message headings. */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export interface FormatOptions {
  /** Injectable for deterministic tests; defaults to `new Date()`. */
  now?: Date;
}

export function formatList(
  list: ShoppingListCategory[],
  preset: Preset,
  options: FormatOptions = {},
): string {
  switch (preset) {
    case 'notes':
      return formatNotes(list, options);
    case 'markdown':
      return formatMarkdown(list);
    default:
      return '';
  }
}

/**
 * Checkbox-style list with a date heading and ALL CAPS category headers —
 * reads well in Notes, Messages, WhatsApp, and other plain-text share targets.
 */
function formatNotes(list: ShoppingListCategory[], options: FormatOptions): string {
  if (list.length === 0) return '';

  const date = formatDate(options.now ?? new Date());
  const heading = `🛒 Shopping List - ${date}`;

  const blocks = list.map((category) => {
    const header = category.name.toUpperCase();
    const lines = category.entries.map((e) => `☐ ${e.name}`);
    return [header, ...lines].join('\n');
  });

  return [heading, ...blocks].join('\n\n');
}

function formatMarkdown(list: ShoppingListCategory[]): string {
  const blocks = list.map((category) => {
    const lines = [`## ${category.name}`, ...category.entries.map((e) => `- [ ] ${e.name}`)];
    return lines.join('\n');
  });
  return blocks.join('\n\n');
}
