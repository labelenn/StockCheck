import type { Preset, ShoppingListCategory } from '../types';

/** Formats today's date like "20 Oct 2026" for message headings. */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * The messenger preset has two header styles: plain (for Share/Copy/Telegram,
 * which render as plain text) and WhatsApp (which renders a leading/trailing
 * `*` as bold). `formatList` always returns the plain variant for a given
 * preset; callers that specifically need the WhatsApp-bold variant should
 * pass `whatsappBold: true`.
 */
export interface FormatOptions {
  whatsappBold?: boolean;
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
      return formatNotes(list);
    case 'messenger':
      return formatMessenger(list, options);
    case 'markdown':
      return formatMarkdown(list);
    default:
      return '';
  }
}

function formatNotes(list: ShoppingListCategory[]): string {
  const blocks = list.map((category) => {
    const lines = [category.name, ...category.entries.map((e) => e.name)];
    return lines.join('\n');
  });
  return blocks.join('\n\n');
}

function formatMessenger(list: ShoppingListCategory[], options: FormatOptions): string {
  const date = formatDate(options.now ?? new Date());
  const heading = `🛒 Shopping List - ${date}`;

  const blocks = list.map((category) => {
    const header = category.name.toUpperCase();
    const styledHeader = options.whatsappBold ? `*${header}*` : header;
    const lines = category.entries.map((e) => `☐ ${e.name}`);
    return [styledHeader, ...lines].join('\n');
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
