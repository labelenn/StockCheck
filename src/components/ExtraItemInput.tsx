import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

interface ExtraItemInputProps {
  onAdd: (name: string) => void;
  placeholder?: string;
}

export function ExtraItemInput({ onAdd, placeholder = 'Add extra item' }: ExtraItemInputProps) {
  const [value, setValue] = useState('');

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5 }}
    >
      <TextField
        size="small"
        fullWidth
        label={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        slotProps={{ htmlInput: { style: { minHeight: 24 } } }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!value.trim()}
        startIcon={<AddIcon />}
        sx={{ minHeight: 44, flexShrink: 0 }}
      >
        Add
      </Button>
    </Box>
  );
}
