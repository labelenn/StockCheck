import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { Preset } from '../types';

interface PresetSwitchProps {
  value: Preset;
  onChange: (preset: Preset) => void;
}

const options: { value: Preset; label: string }[] = [
  { value: 'notes', label: 'Notes' },
  { value: 'appleNotes', label: 'iPhone Notes' },
  { value: 'messenger', label: 'Message' },
  { value: 'markdown', label: 'Markdown' },
];

export function PresetSwitch({ value, onChange }: PresetSwitchProps) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, next) => next && onChange(next)}
      aria-label="List format"
      sx={{
        bgcolor: 'action.hover',
        p: 0.5,
        borderRadius: 2,
        '& .MuiToggleButton-root': {
          border: 0,
          borderRadius: 1.5,
          minHeight: 36,
          px: 1.5,
          color: 'text.secondary',
          '&.Mui-selected': {
            bgcolor: 'background.paper',
            color: 'primary.main',
          },
        },
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value} aria-label={option.label}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
