import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import type { Preset, ShoppingListCategory } from '../types';
import { formatList } from '../lib/format';
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

  const shareSupported = useMemo(() => canUseNativeShare(text, title), [text]);

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

  return (
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
      </Box>
    </Stack>
  );
}
