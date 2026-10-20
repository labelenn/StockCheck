import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export interface ToastState {
  message: string;
  severity: 'success' | 'error';
}

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 88, sm: 24 } }}
    >
      <Alert
        onClose={onClose}
        severity={toast?.severity ?? 'success'}
        variant="filled"
        sx={{ borderRadius: 3 }}
      >
        {toast?.message}
      </Alert>
    </Snackbar>
  );
}
