import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

/**
 * Soft, light-blue-led palette rather than a bold primary-color scheme.
 * Light and dark variants both stay muted.
 */
export function createAppTheme(mode: PaletteMode) {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? '#6FA8DC' : '#8EC6F0',
        light: isLight ? '#A8CBEA' : '#B8DCF5',
        dark: isLight ? '#4A84B8' : '#6FA8DC',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#E8A0BF' : '#F0B8D1',
      },
      background: {
        default: isLight ? '#F6FAFD' : '#1B222C',
        paper: isLight ? '#FFFFFF' : '#232B38',
      },
      text: {
        primary: isLight ? '#33404F' : '#E8EEF5',
        secondary: isLight ? '#67748A' : '#A9B6C7',
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: [
        '"Inter"',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(8px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            '&:before': { display: 'none' },
          },
        },
      },
    },
  });
}
