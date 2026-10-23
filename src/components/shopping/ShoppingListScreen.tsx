import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SendIcon from '@mui/icons-material/Send';
import type { ItemKey, ShoppingListCategory } from '../../types';
import { ShoppingListRow } from './ShoppingListRow';
import { ScreenLayout } from '../layout/ScreenLayout';

interface ShoppingListScreenProps {
  topBar: ReactNode;
  list: ShoppingListCategory[];
  onToggleGotIt: (key: ItemKey) => void;
  onBack: () => void;
  totalCount: number;
  remainingCount: number;
  onOpenSend: () => void;
}

export function ShoppingListScreen({
  topBar,
  list,
  onToggleGotIt,
  onBack,
  totalCount,
  remainingCount,
  onOpenSend,
}: ShoppingListScreenProps) {
  const header = (
    <Box>
      {topBar}
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} size="small" sx={{ minHeight: 36 }}>
          Back to check
        </Button>
      </Box>
      <Divider />
    </Box>
  );

  const footer = (
    <Paper elevation={8} square sx={{ px: 2, pt: 1.5, pb: 1.5, bgcolor: 'background.paper' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
        {`${totalCount} item${totalCount === 1 ? '' : 's'} · ${remainingCount} remaining`}
      </Typography>
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<SendIcon />}
        onClick={onOpenSend}
        disabled={totalCount === 0}
        sx={{ minHeight: 48 }}
      >
        Send list
      </Button>
    </Paper>
  );

  return (
    <ScreenLayout header={header} footer={footer}>
      {list.length === 0 ? (
        <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', py: 8, px: 3 }}>
          <PlaylistAddIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Nothing ticked yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
            Go back and tick what you need, then come back here.
          </Typography>
          <Button variant="outlined" onClick={onBack} sx={{ minHeight: 44, mt: 1 }}>
            Back
          </Button>
        </Stack>
      ) : (
        list.map((category) => (
          <Box key={category.id}>
            <Typography
              variant="overline"
              sx={{ px: 2, pt: 2, display: 'block', fontWeight: 700, color: 'text.secondary' }}
            >
              {category.name}
            </Typography>
            <List disablePadding sx={{ bgcolor: 'background.paper' }}>
              {category.entries.map((entry, i) => (
                <Box key={entry.key}>
                  {i > 0 && <Divider component="li" />}
                  <ShoppingListRow
                    label={entry.note ? `${entry.name} · ${entry.note}` : entry.name}
                    gotIt={entry.gotIt}
                    onToggle={() => onToggleGotIt(entry.key)}
                  />
                </Box>
              ))}
            </List>
          </Box>
        ))
      )}
    </ScreenLayout>
  );
}
