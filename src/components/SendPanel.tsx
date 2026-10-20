import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import type { Preset, ShoppingListCategory } from '../types';
import { formatList } from '../lib/format';
import { DEEP_LINK_MAX_CHARS } from '../config';
import type { ToastState } from './Toast';
import { PresetSwitch } from './PresetSwitch';

interface SendPanelProps {
  list: ShoppingListCategory[];
  preset: Preset;
  onPresetChange: (preset: Preset) => void;
  onToast: (toast: ToastState) => void;
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
      onToast({ message: 'Could not open the share sheet', severity: 'error' });
    }
  }

  async function handleCopy() {
    const ok = await copyText(text);
    onToast(
      ok
        ? { message: 'Copied to clipboard', severity: 'success' }
        : { message: 'Could not copy — select the text manually', severity: 'error' },
    );
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
    <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Send list
          </Typography>
          <PresetSwitch value={preset} onChange={onPresetChange} />
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            maxHeight: 192,
            overflow: 'auto',
            p: 1.5,
            bgcolor: 'action.hover',
            borderRadius: 2,
          }}
        >
          <Typography
            component="pre"
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}
          >
            {text}
          </Typography>
        </Paper>

        <Typography variant="caption" color="text.secondary">
          For the iPhone Notes app: pick &ldquo;iPhone Notes&rdquo; above, then tap Share and choose
          Notes — it&rsquo;ll create a new note with checkboxes and categories already formatted in.
          Messenger (WhatsApp, Messenger, SMS, Telegram) is best reached via Share too — it bolds
          category headers automatically. Facebook Messenger doesn&rsquo;t support a direct prefill
          link, so use Share to send there.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {shareSupported && (
            <Button
              variant="contained"
              onClick={handleShare}
              startIcon={<ShareIcon />}
              sx={{ minHeight: 44, flex: 1 }}
            >
              Share
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
            sx={{ minHeight: 44, flex: 1 }}
          >
            Copy
          </Button>
          <Tooltip
            title={whatsappTooLong ? 'List too long for a direct link — use Share or Copy' : ''}
          >
            <span style={{ flex: 1 }}>
              <Button
                variant="outlined"
                onClick={handleWhatsApp}
                disabled={whatsappTooLong}
                startIcon={<WhatsAppIcon />}
                fullWidth
                sx={{ minHeight: 44 }}
              >
                WhatsApp
              </Button>
            </span>
          </Tooltip>
          <Tooltip
            title={telegramTooLong ? 'List too long for a direct link — use Share or Copy' : ''}
          >
            <span style={{ flex: 1 }}>
              <Button
                variant="outlined"
                onClick={handleTelegram}
                disabled={telegramTooLong}
                startIcon={<TelegramIcon />}
                fullWidth
                sx={{ minHeight: 44 }}
              >
                Telegram
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Stack>
    </Card>
  );
}
