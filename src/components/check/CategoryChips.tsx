import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { Category } from '../../types';

interface CategoryChipsProps {
  categories: Category[];
  currentIndex: number;
  countFor: (categoryId: string) => number;
  onSelect: (index: number) => void;
}

/** Horizontally scrollable jump control — tap any category to go straight to it. */
export function CategoryChips({
  categories,
  currentIndex,
  countFor,
  onSelect,
}: CategoryChipsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        pt: 1.5,
        px: 2,
        pb: 1.5,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {categories.map((category, index) => {
        const count = countFor(category.id);
        const selected = index === currentIndex;
        return (
          <Chip
            key={category.id}
            label={count > 0 ? `${category.name} · ${count}` : category.name}
            color={selected ? 'primary' : 'default'}
            variant={selected ? 'filled' : 'outlined'}
            onClick={() => onSelect(index)}
            sx={{ flexShrink: 0, fontWeight: 600, minHeight: 36 }}
          />
        );
      })}
    </Box>
  );
}
