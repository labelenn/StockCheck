import { useMemo } from 'react';
import type { Preset, ShoppingListCategory } from '../types';
import { formatList } from '../lib/format';
import { DEEP_LINK_MAX_CHARS } from '../config';
import { PresetSwitch } from './PresetSwitch';

interface SendPanelProps {
  list: ShoppingListCategory[];
  preset: Preset;
  onPresetChange: (preset: Preset) => void;
  onToast: (message: string) => void;
}

function canUseNativeShare(text: string, title: string): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare === 'function') {
    return navigator.canShare({ title, text });
  }
  return true;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy fallback
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function SendPanel({ list, preset, onPresetChange, onToast }: SendPanelProps) {
  const title = 'StockCheck shopping list';

  const text = useMemo(() => formatList(list, preset), [list, preset]);
  const whatsappText = useMemo(() => formatList(list, 'messenger', { whatsappBold: true }), [list]);

  const shareSupported = useMemo(() => canUseNativeShare(text, title), [text]);

  const whatsappEncoded = encodeURIComponent(whatsappText);
  const telegramEncoded = encodeURIComponent(text);
  const whatsappTooLong = whatsappEncoded.length > DEEP_LINK_MAX_CHARS;
  const telegramTooLong = telegramEncoded.length > DEEP_LINK_MAX_CHARS;

  async function handleShare() {
    try {
      await navigator.share({ title, text });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      onToast('Could not open the share sheet');
    }
  }

  async function handleCopy() {
    const ok = await copyText(text);
    onToast(ok ? 'Copied to clipboard' : 'Could not copy — select the text manually');
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${whatsappEncoded}`, '_blank', 'noopener,noreferrer');
  }

  function handleTelegram() {
    const appUrl = encodeURIComponent(window.location.origin);
    window.open(
      `https://t.me/share/url?url=${appUrl}&text=${telegramEncoded}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Send list</h2>
        <PresetSwitch value={preset} onChange={onPresetChange} />
      </div>

      <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {text}
      </pre>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Messenger (WhatsApp, Messenger, SMS, Telegram) is best reached via Share — it bolds category
        headers automatically. Facebook Messenger doesn't support a direct prefill link, so use
        Share to send there.
      </p>

      <div className="flex flex-wrap gap-2">
        {shareSupported && (
          <button
            type="button"
            onClick={handleShare}
            className="min-h-11 flex-1 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Share
          </button>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-11 flex-1 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={whatsappTooLong}
          title={
            whatsappTooLong ? 'List too long for a direct link — use Share or Copy' : undefined
          }
          className="min-h-11 flex-1 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:text-slate-200 dark:enabled:hover:bg-slate-800"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={handleTelegram}
          disabled={telegramTooLong}
          title={
            telegramTooLong ? 'List too long for a direct link — use Share or Copy' : undefined
          }
          className="min-h-11 flex-1 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:text-slate-200 dark:enabled:hover:bg-slate-800"
        >
          Telegram
        </button>
      </div>
    </div>
  );
}
