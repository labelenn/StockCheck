import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import type { Category, ItemKey, ShoppingListCategory } from '../../types';
import { ItemRow } from './ItemRow';
import { CategoryChips } from './CategoryChips';
import { ScreenLayout } from '../layout/ScreenLayout';

export interface CheckScreenItem {
  key: ItemKey;
  label: string;
  checked: boolean;
}

interface CheckScreenProps {
  topBar: ReactNode;
  category: Category;
  items: CheckScreenItem[];
  shoppingList: ShoppingListCategory[];
  onToggle: (key: ItemKey) => void;
  onRemoveFromList: (key: ItemKey) => void;
  categories: Category[];
  currentCategoryIndex: number;
  countFor: (categoryId: string) => number;
  onSelectCategory: (index: number) => void;
  onAddItem: (name: string) => void;
  onGenerateList: () => void;
}

export function CheckScreen({
  topBar,
  category,
  items,
  shoppingList,
  onToggle,
  onRemoveFromList,
  categories,
  currentCategoryIndex,
  countFor,
  onSelectCategory,
  onAddItem,
  onGenerateList,
}: CheckScreenProps) {
  const [newItemName, setNewItemName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const shoppingListCount = shoppingList.reduce((sum, c) => sum + c.entries.length, 0);

  function submitNewItem() {
    const trimmed = newItemName.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    setNewItemName('');
    inputRef.current?.focus();
  }

  const header = (
    <Box>
      {topBar}
      <CategoryChips
        categories={categories}
        currentIndex={currentCategoryIndex}
        countFor={countFor}
        onSelect={onSelectCategory}
      />
      <Divider />
    </Box>
  );

  const footer = (
    <Paper elevation={8} square sx={{ px: 2, pt: 1.5, pb: 1.5, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <TextField
          inputRef={inputRef}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitNewItem();
            }
          }}
          placeholder="Add an item…"
          size="small"
          fullWidth
          sx={{ '& .MuiInputBase-root': { minHeight: 44 } }}
        />
        <IconButton
          aria-label="Add item"
          onClick={submitNewItem}
          disabled={!newItemName.trim()}
          color="primary"
          sx={{ width: 44, height: 44, flexShrink: 0 }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<PlaylistAddCheckIcon />}
        onClick={onGenerateList}
        sx={{ minHeight: 48 }}
      >
        View Full Shopping List
      </Button>
    </Paper>
  );

  return (
    <ScreenLayout header={header} footer={footer}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            pt: 2,
            pb: 1.5,
          }}
        >
          <Typography
            variant="overline"
            sx={{ display: 'block', fontWeight: 700, color: 'text.secondary', mb: 1, flexShrink: 0 }}
          >
            {category.name}
          </Typography>
          <Paper
            variant="outlined"
            sx={{ flex: 1, minHeight: 0, overflowY: 'auto', bgcolor: 'background.paper' }}
          >
            {items.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
                Nothing left to tick here.
              </Typography>
            ) : (
              <List disablePadding>
                {items.map((item, i) => (
                  <Box key={item.key}>
                    {i > 0 && <Divider component="li" />}
                    <ItemRow
                      id={item.key}
                      label={item.label}
                      action="add"
                      onAction={() => onToggle(item.key)}
                    />
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            borderTop: 8,
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          <Box
            sx={{
              px: 2,
              pt: 2,
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="overline"
              sx={{ fontWeight: 700, color: 'text.secondary' }}
            >
              Shopping list
            </Typography>
            {shoppingListCount > 0 && (
              <Chip
                label={shoppingListCount}
                size="small"
                color="primary"
                sx={{ height: 20, fontWeight: 700 }}
              />
            )}
          </Box>
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, pb: 2 }}>
            {shoppingList.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Nothing added yet.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {shoppingList.map((listCategory) => (
                  <Paper
                    key={listCategory.id}
                    variant="outlined"
                    sx={{ overflow: 'hidden', bgcolor: 'background.paper' }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        px: 2,
                        pt: 1,
                        pb: 0.5,
                        display: 'block',
                        fontWeight: 700,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {`${listCategory.name} · ${listCategory.entries.length}`}
                    </Typography>
                    <List disablePadding>
                      {listCategory.entries.map((entry, i) => (
                        <Box key={entry.key}>
                          {i > 0 && <Divider component="li" />}
                          <ItemRow
                            id={entry.key}
                            label={entry.note ? `${entry.name} · ${entry.note}` : entry.name}
                            action="remove"
                            onAction={() => onRemoveFromList(entry.key)}
                          />
                        </Box>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Box>
    </ScreenLayout>
  );
}
