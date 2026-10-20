import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

interface ItemRowProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Show the label struck-through when checked (used in the shopping list view). */
  strikeThrough?: boolean;
  /** When provided, renders a remove button for one-off extras. */
  onRemove?: () => void;
}

export function ItemRow({ id, label, checked, onChange, strikeThrough, onRemove }: ItemRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
      <FormControlLabel
        htmlFor={id}
        sx={{
          flex: 1,
          minHeight: 44,
          m: 0,
          px: 2,
          py: 0.5,
          borderRadius: 2,
          '&:active': { bgcolor: 'action.selected' },
        }}
        control={
          <Checkbox id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
        }
        label={
          <Typography
            sx={
              strikeThrough && checked
                ? { textDecoration: 'line-through', color: 'text.disabled' }
                : { color: 'text.primary' }
            }
          >
            {label}
          </Typography>
        }
      />
      {onRemove && (
        <IconButton
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          sx={{ width: 44, flexShrink: 0 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
