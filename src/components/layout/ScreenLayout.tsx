import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface ScreenLayoutProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

/**
 * Three-part screen shell used by every top-level screen: a fixed header,
 * a scrollable middle (the only region that scrolls), and a fixed footer
 * that respects the iOS home-indicator safe area. Uses 100dvh so mobile
 * browser toolbars don't cause the page itself to scroll.
 */
export function ScreenLayout({ header, footer, children }: ScreenLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>{header}</Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </Box>
      <Box sx={{ flexShrink: 0, pb: 'env(safe-area-inset-bottom)' }}>{footer}</Box>
    </Box>
  );
}
