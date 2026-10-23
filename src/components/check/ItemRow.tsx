import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

interface ItemRowProps {
  id: string;
  label: string;
  /** "add" tiles the row into the shopping list; "remove" takes it back out. */
  action: 'add' | 'remove';
  onAction: () => void;
}

export function ItemRow({ id, label, action, onAction }: ItemRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch' }} data-item-id={id}>
      <ListItemButton onClick={onAction} sx={{ flex: 1, minHeight: 52, px: 2, borderRadius: 1 }}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          {action === 'add' ? (
            <AddCircleIcon color="primary" />
          ) : (
            <RemoveCircleIcon color="error" />
          )}
        </ListItemIcon>
        <ListItemText primary={label} slotProps={{ primary: { sx: { color: 'text.primary' } } }} />
      </ListItemButton>
    </Box>
  );
}
