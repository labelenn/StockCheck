import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Category, ExtraItem, ItemKey } from '../types';
import { makeItemKey } from '../types';
import { getCategoryStyle } from '../lib/categoryStyles';
import { ItemRow } from './ItemRow';
import { ExtraItemInput } from './ExtraItemInput';

interface CategorySectionProps {
  category: Category;
  checked: Record<ItemKey, boolean>;
  onToggle: (key: ItemKey) => void;
  extras: ExtraItem[];
  onAddExtra: (categoryId: string, name: string) => void;
  onRemoveExtra: (key: ItemKey) => void;
}

export function CategorySection({
  category,
  checked,
  onToggle,
  extras,
  onAddExtra,
  onRemoveExtra,
}: CategorySectionProps) {
  const { Icon, accent } = getCategoryStyle(category.id);
  const hasEssentials = category.items.length > 0;
  const checkedCount = category.items.filter(
    (item) => checked[makeItemKey(category.id, item)],
  ).length;
  const badgeText = hasEssentials
    ? `${checkedCount}/${category.items.length}`
    : extras.length > 0
      ? `${extras.length} extra item${extras.length > 1 ? 's' : ''}`
      : 'One-off items';

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      sx={{
        borderRadius: 0,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: 44,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 0.75,
            columnGap: 1.5,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: accent,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
            {category.name}
          </Typography>
        </Stack>
        <Chip
          label={badgeText}
          size="small"
          sx={{ bgcolor: accent, color: '#fff', fontWeight: 600, flexShrink: 0 }}
        />
      </AccordionSummary>

      <Divider />

      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          {category.items.map((item) => {
            const key = makeItemKey(category.id, item);
            return (
              <ItemRow
                key={key}
                id={key}
                label={item}
                checked={!!checked[key]}
                onChange={() => onToggle(key)}
              />
            );
          })}
          {extras.map((extra) => (
            <Box key={extra.key} sx={{ display: 'flex', alignItems: 'center' }}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'center', flex: 1, minHeight: 44, px: 2 }}
              >
                <AddCircleIcon fontSize="small" sx={{ color: accent }} />
                <Typography>{extra.name}</Typography>
              </Stack>
              <IconButton
                aria-label={`Remove ${extra.name}`}
                onClick={() => onRemoveExtra(extra.key)}
                sx={{ width: 44, flexShrink: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </List>
        <Divider />
        <ExtraItemInput
          placeholder={`Add extra ${category.name.toLowerCase()} item`}
          onAdd={(name) => onAddExtra(category.id, name)}
        />
      </AccordionDetails>
    </Accordion>
  );
}
