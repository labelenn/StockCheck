import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface ShoppingListRowProps {
  label: string;
  gotIt: boolean;
  onToggle: () => void;
}

/** Tap anywhere on the row to mark an item "Got it" — a different icon from the check-screen tick. */
export function ShoppingListRow({ label, gotIt, onToggle }: ShoppingListRowProps) {
  return (
    <ListItemButton onClick={onToggle} sx={{ minHeight: 56, px: 2 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        {gotIt ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon color="action" />}
      </ListItemIcon>
      <ListItemText
        primary={label}
        slotProps={{
          primary: {
            sx: gotIt
              ? { textDecoration: 'line-through', color: 'text.disabled' }
              : { color: 'text.primary' },
          },
        }}
      />
    </ListItemButton>
  );
}
