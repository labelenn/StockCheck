import { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { categories } from './data/items';
import { LEGACY_STORAGE_KEY_V1, STATE_TTL_DAYS, STORAGE_KEY } from './config';
import { usePersistentState } from './hooks/usePersistentState';
import { useThemeModePreference } from './hooks/useThemeModePreference';
import type { ThemeModePreference } from './hooks/useThemeModePreference';
import { createAppTheme } from './theme';
import { findExistingItem } from './lib/duplicates';
import { applyV2Expiry, migrateV1ToV2 } from './lib/migrateState';
import type { AppStateV1, AppStateV2 } from './lib/migrateState';
import { makeItemKey } from './types';
import type { ExtraItem, ItemKey, Preset, ShoppingListCategory } from './types';
import { CheckScreen } from './components/check/CheckScreen';
import type { CheckScreenItem } from './components/check/CheckScreen';
import { SendPanel } from './components/shopping/SendPanel';
import { ShoppingListScreen } from './components/shopping/ShoppingListScreen';
import { Toast } from './components/layout/Toast';
import type { ToastState } from './components/layout/Toast';

const themeModeOptions: {
  value: ThemeModePreference;
  label: string;
  Icon: typeof LightModeIcon;
}[] = [
  { value: 'light', label: 'Light', Icon: LightModeIcon },
  { value: 'dark', label: 'Dark', Icon: DarkModeIcon },
  { value: 'system', label: 'System', Icon: BrightnessAutoIcon },
];

type AppState = AppStateV2;

const baseState: AppState = {
  checked: {},
  extras: [],
  gotIt: {},
  categoryIndex: 0,
  preset: 'notes',
};

/** Reads v2 state if present; otherwise migrates a legacy v1 value once (and clears it). */
function computeInitialState(): AppState {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return baseState;
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY_V1);
    if (!legacyRaw) return baseState;
    const parsed = JSON.parse(legacyRaw);
    const v1: AppStateV1 = parsed.value ?? parsed;
    const migrated = migrateV1ToV2(v1, baseState);
    localStorage.removeItem(LEGACY_STORAGE_KEY_V1);
    return migrated;
  } catch {
    return baseState;
  }
}

type View = 'check' | 'shopping';

export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeModePreference, setThemeModePreference] = useThemeModePreference();
  const resolvedMode =
    themeModePreference === 'system' ? (prefersDark ? 'dark' : 'light') : themeModePreference;
  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);
  const ThemeModeIcon =
    themeModeOptions.find((option) => option.value === themeModePreference)?.Icon ??
    BrightnessAutoIcon;

  const [state, setState] = usePersistentState<AppState>(STORAGE_KEY, computeInitialState(), {
    ttlDays: STATE_TTL_DAYS,
    onExpire: applyV2Expiry,
  });

  const [view, setView] = useState<View>('check');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendOnlyRemaining, setSendOnlyRemaining] = useState(false);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<HTMLElement | null>(null);
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const categoryIndex = Math.min(
    Math.max(state.categoryIndex || 0, 0),
    categories.length - 1,
  );
  const currentCategory = categories[categoryIndex];

  function extrasFor(categoryId: string): ExtraItem[] {
    return state.extras.filter((e) => e.categoryId === categoryId);
  }

  /** Ticked-item count per category — drives the jump-chip badges and footer total. */
  function countFor(categoryId: string): number {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return 0;
    let count = 0;
    for (const item of category.items) {
      if (state.checked[makeItemKey(categoryId, item)]) count++;
    }
    for (const extra of extrasFor(categoryId)) {
      if (state.checked[extra.key]) count++;
    }
    return count;
  }

  const totalToBuy = useMemo(
    () => categories.reduce((sum, c) => sum + countFor(c.id), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.checked, state.extras],
  );

  const shoppingList = useMemo<ShoppingListCategory[]>(() => {
    const result: ShoppingListCategory[] = [];
    for (const category of categories) {
      const entries: ShoppingListCategory['entries'] = [];
      for (const item of category.items) {
        const key = makeItemKey(category.id, item);
        if (state.checked[key]) {
          entries.push({
            key,
            categoryId: category.id,
            name: item,
            isExtra: false,
            gotIt: !!state.gotIt[key],
          });
        }
      }
      for (const extra of extrasFor(category.id)) {
        if (state.checked[extra.key]) {
          entries.push({
            key: extra.key,
            categoryId: category.id,
            name: extra.name,
            note: extra.note,
            isExtra: true,
            gotIt: !!state.gotIt[extra.key],
          });
        }
      }
      // Got-it items sink to the bottom of their category.
      entries.sort((a, b) => Number(a.gotIt) - Number(b.gotIt));
      if (entries.length > 0) {
        result.push({ id: category.id, name: category.name, entries });
      }
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.checked, state.gotIt, state.extras]);

  const remainingCount = useMemo(
    () => shoppingList.reduce((sum, c) => sum + c.entries.filter((e) => !e.gotIt).length, 0),
    [shoppingList],
  );

  const sendList = useMemo<ShoppingListCategory[]>(() => {
    if (!sendOnlyRemaining) return shoppingList;
    return shoppingList
      .map((category) => ({ ...category, entries: category.entries.filter((e) => !e.gotIt) }))
      .filter((category) => category.entries.length > 0);
  }, [shoppingList, sendOnlyRemaining]);

  function toggleChecked(key: ItemKey) {
    setState((prev) => ({ ...prev, checked: { ...prev.checked, [key]: !prev.checked[key] } }));
  }

  /**
   * Removing from the shopping list: hard-coded items just get unchecked (so
   * they reappear in the top section). One-off manually added items have no
   * "hard-coded" slot to return to, so they're deleted instead.
   */
  function removeFromShoppingList(key: ItemKey) {
    const isOneOff = state.extras.some((e) => e.key === key);
    setState((prev) => ({
      ...prev,
      extras: isOneOff ? prev.extras.filter((e) => e.key !== key) : prev.extras,
      checked: { ...prev.checked, [key]: false },
    }));
  }

  function toggleGotIt(key: ItemKey) {
    setState((prev) => ({ ...prev, gotIt: { ...prev.gotIt, [key]: !prev.gotIt[key] } }));
  }

  function addItem(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const categoryId = currentCategory.id;
    const existing = findExistingItem(trimmed, categories, state.extras);
    if (existing) {
      setState((prev) => ({ ...prev, checked: { ...prev.checked, [existing.key]: true } }));
      setToast({
        message:
          existing.categoryId !== categoryId
            ? `Ticked in ${existing.categoryName}`
            : `Ticked ${existing.name}`,
        severity: 'success',
      });
      return;
    }

    const key = makeItemKey(categoryId, trimmed);
    const newExtra: ExtraItem = { key, categoryId, name: trimmed };
    setState((prev) => ({
      ...prev,
      extras: [...prev.extras, newExtra],
      checked: { ...prev.checked, [key]: true },
    }));
    setToast({
      message: `Added ${trimmed}`,
      severity: 'success',
      onUndo: () => {
        setState((prev) => ({
          ...prev,
          extras: prev.extras.filter((e) => e.key !== key),
          checked: { ...prev.checked, [key]: false },
        }));
      },
    });
  }

  function setPreset(preset: Preset) {
    setState((prev) => ({ ...prev, preset }));
  }

  function goToCategory(index: number) {
    setState((prev) => ({
      ...prev,
      categoryIndex: Math.max(0, Math.min(index, categories.length - 1)),
    }));
  }

  function confirmStartNewWeek() {
    setState((prev) => ({ ...baseState, preset: prev.preset }));
    setView('check');
    setConfirmOpen(false);
    setToast({ message: 'Started a new week', severity: 'success' });
  }

  const checkItems: CheckScreenItem[] = [
    ...currentCategory.items.map((name) => {
      const key = makeItemKey(currentCategory.id, name);
      return { key, label: name, checked: !!state.checked[key] };
    }),
    ...extrasFor(currentCategory.id).map((extra) => ({
      key: extra.key,
      label: extra.note ? `${extra.name} · ${extra.note}` : extra.name,
      checked: !!state.checked[extra.key],
    })),
  ].filter((item) => !item.checked);

  const topBar = (
    <AppBar
      position="static"
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
        <Button
          variant="outlined"
          size="small"
          onClick={() => setConfirmOpen(true)}
          sx={{ minHeight: 36, whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Reset
        </Button>
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
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default' }}>
        {view === 'check' ? (
          <CheckScreen
            topBar={topBar}
            category={currentCategory}
            items={checkItems}
            shoppingList={shoppingList}
            onToggle={toggleChecked}
            onRemoveFromList={removeFromShoppingList}
            categories={categories}
            currentCategoryIndex={categoryIndex}
            countFor={countFor}
            onSelectCategory={goToCategory}
            onAddItem={addItem}
            onGenerateList={() => setView('shopping')}
          />
        ) : (
          <ShoppingListScreen
            topBar={topBar}
            list={shoppingList}
            onToggleGotIt={toggleGotIt}
            onBack={() => setView('check')}
            totalCount={totalToBuy}
            remainingCount={remainingCount}
            onOpenSend={() => setSendOpen(true)}
          />
        )}

        <Dialog
          open={sendOpen}
          onClose={() => setSendOpen(false)}
          fullScreen={fullScreenDialog}
          fullWidth
          maxWidth="sm"
          scroll="paper"
        >
          <DialogTitle
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            {`${sendList.reduce((sum, c) => sum + c.entries.length, 0)} to send`}
            <IconButton
              aria-label="Close send list"
              onClick={() => setSendOpen(false)}
              sx={{ width: 44, height: 44, flexShrink: 0 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 2 }}>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={sendOnlyRemaining}
                    onChange={(e) => setSendOnlyRemaining(e.target.checked)}
                  />
                }
                label="Only items not yet Got it"
              />
              <SendPanel
                list={sendList}
                preset={state.preset}
                onPresetChange={setPreset}
                onToast={setToast}
              />
            </Stack>
          </DialogContent>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Start a new week?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This clears everything you&rsquo;ve ticked, any one-off items you&rsquo;ve added, and
              Got-it marks. Your list format stays as it is.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmStartNewWeek} variant="contained" color="error">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </Box>
    </ThemeProvider>
  );
}
