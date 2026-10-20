import { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { categories } from './data/items';
import { STATE_TTL_DAYS, STORAGE_KEY } from './config';
import { usePersistentState } from './hooks/usePersistentState';
import { useThemeModePreference } from './hooks/useThemeModePreference';
import type { ThemeModePreference } from './hooks/useThemeModePreference';
import { createAppTheme } from './theme';
import { makeItemKey } from './types';
import type { Category, ExtraItem, ItemKey, Preset, ShoppingListCategory } from './types';
import { CategorySection } from './components/CategorySection';
import { SendPanel } from './components/SendPanel';
import { Toast } from './components/Toast';
import type { ToastState } from './components/Toast';

const themeModeOptions: {
  value: ThemeModePreference;
  label: string;
  Icon: typeof LightModeIcon;
}[] = [
  { value: 'light', label: 'Light', Icon: LightModeIcon },
  { value: 'dark', label: 'Dark', Icon: DarkModeIcon },
  { value: 'system', label: 'System', Icon: BrightnessAutoIcon },
];

interface AppState {
  checked: Record<ItemKey, boolean>;
  extras: ExtraItem[];
  preset: Preset;
}

const initialState: AppState = {
  checked: {},
  extras: [],
  preset: 'notes',
};

const otherCategory: Category = { id: 'other', name: 'Other', items: [] };
const sectionCategories = [...categories, otherCategory];

function buildShoppingList(state: AppState): ShoppingListCategory[] {
  const result: ShoppingListCategory[] = [];

  for (const category of categories) {
    const entries: ShoppingListCategory['entries'] = [];
    for (const item of category.items) {
      const key = makeItemKey(category.id, item);
      if (!state.checked[key]) {
        entries.push({ key, categoryId: category.id, name: item, isExtra: false });
      }
    }
    for (const extra of state.extras.filter((e) => e.categoryId === category.id)) {
      entries.push({ key: extra.key, categoryId: category.id, name: extra.name, isExtra: true });
    }
    if (entries.length > 0) {
      result.push({ id: category.id, name: category.name, entries });
    }
  }

  const otherExtras = state.extras.filter((e) => e.categoryId === otherCategory.id);
  if (otherExtras.length > 0) {
    result.push({
      id: otherCategory.id,
      name: otherCategory.name,
      entries: otherExtras.map((e) => ({
        key: e.key,
        categoryId: otherCategory.id,
        name: e.name,
        isExtra: true,
      })),
    });
  }

  return result;
}

export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeModePreference, setThemeModePreference] = useThemeModePreference();
  const resolvedMode =
    themeModePreference === 'system' ? (prefersDark ? 'dark' : 'light') : themeModePreference;
  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);
  const ThemeModeIcon =
    themeModeOptions.find((option) => option.value === themeModePreference)?.Icon ??
    BrightnessAutoIcon;

  const [state, setState] = usePersistentState<AppState>(STORAGE_KEY, initialState, {
    ttlDays: STATE_TTL_DAYS,
    onExpire: (expired, initial) => ({ ...initial, preset: expired.preset }),
  });
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<HTMLElement | null>(null);
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const totalEssentials = useMemo(() => categories.reduce((sum, c) => sum + c.items.length, 0), []);
  const checkedCount = useMemo(
    () => Object.values(state.checked).filter(Boolean).length,
    [state.checked],
  );

  const shoppingList = useMemo(() => buildShoppingList(state), [state]);
  const toBuyCount = useMemo(
    () => shoppingList.reduce((sum, c) => sum + c.entries.length, 0),
    [shoppingList],
  );

  function toggleChecked(key: ItemKey) {
    setState((prev) => ({ ...prev, checked: { ...prev.checked, [key]: !prev.checked[key] } }));
  }

  function addExtra(categoryId: string, name: string) {
    const key = makeItemKey(categoryId, name);
    setState((prev) => {
      if (prev.extras.some((e) => e.key === key)) return prev;
      return { ...prev, extras: [...prev.extras, { key, categoryId, name }] };
    });
  }

  function removeExtra(key: ItemKey) {
    setState((prev) => ({
      ...prev,
      extras: prev.extras.filter((e) => e.key !== key),
    }));
  }

  function setPreset(preset: Preset) {
    setState((prev) => ({ ...prev, preset }));
  }

  function confirmStartNewWeek() {
    setState((prev) => ({ ...initialState, preset: prev.preset }));
    setShoppingOpen(false);
    setConfirmOpen(false);
    setToast({ message: 'Started a new week', severity: 'success' });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </Box>
            <Typography variant="h6" noWrap sx={{ color: 'text.primary', flex: 1 }}>
              StockCheck
            </Typography>
            <IconButton
              aria-label="Theme preference"
              aria-haspopup="true"
              onClick={(e) => setThemeMenuAnchor(e.currentTarget)}
              sx={{ width: 44, height: 44, flexShrink: 0 }}
            >
              <ThemeModeIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={themeMenuAnchor}
              open={Boolean(themeMenuAnchor)}
              onClose={() => setThemeMenuAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {themeModeOptions.map(({ value, label, Icon }) => (
                <MenuItem
                  key={value}
                  selected={value === themeModePreference}
                  onClick={() => {
                    setThemeModePreference(value);
                    setThemeMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{label}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ flex: 1, py: 2, pb: 12 }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography
              aria-live="polite"
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {`${checkedCount}/${totalEssentials} checked`}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setConfirmOpen(true)}
              sx={{ minHeight: 36, whiteSpace: 'nowrap' }}
            >
              Start new week
            </Button>
          </Stack>
          <Stack spacing={2}>
            {sectionCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                checked={state.checked}
                onToggle={toggleChecked}
                extras={state.extras.filter((e) => e.categoryId === category.id)}
                onAddExtra={addExtra}
                onRemoveExtra={removeExtra}
              />
            ))}
          </Stack>
        </Container>

        <Paper
          elevation={8}
          square
          sx={{
            position: { xs: 'sticky', sm: 'static' },
            bottom: 0,
            px: 2,
            py: 1.5,
            bgcolor: 'background.paper',
          }}
        >
          <Container maxWidth="sm" disableGutters>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => setShoppingOpen(true)}
              sx={{ minHeight: 48, fontSize: '1rem' }}
            >
              Generate shopping list
            </Button>
          </Container>
        </Paper>

        <Dialog
          open={shoppingOpen}
          onClose={() => setShoppingOpen(false)}
          fullScreen={fullScreenDialog}
          fullWidth
          maxWidth="sm"
          scroll="paper"
        >
          <DialogTitle
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            {`${toBuyCount} to buy`}
            <IconButton
              aria-label="Close shopping list"
              onClick={() => setShoppingOpen(false)}
              sx={{ width: 44, height: 44, flexShrink: 0 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 2 }}>
            {shoppingList.length === 0 ? (
              <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', py: 6 }}>
                <CelebrationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Nothing to buy!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
                  Everything&rsquo;s in stock.
                </Typography>
              </Stack>
            ) : (
              <SendPanel
                list={shoppingList}
                preset={state.preset}
                onPresetChange={setPreset}
                onToast={setToast}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Start a new week?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This clears everything you&rsquo;ve checked off and any extra items you&rsquo;ve
              added.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmStartNewWeek} variant="contained" color="error">
              Start new week
            </Button>
          </DialogActions>
        </Dialog>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </Box>
    </ThemeProvider>
  );
}
