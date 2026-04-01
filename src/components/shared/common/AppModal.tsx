import { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

type AppModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
};

export const AppModal = ({ open, title, children, actions, onClose }: AppModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: 'white',
        },
      }}
    >
      <DialogTitle className="text-lg font-semibold text-blackout">{title}</DialogTitle>
      <DialogContent dividers className="space-y-4 pt-2 text-sm text-solid-matte-gray">
        {children}
      </DialogContent>
      {actions && (
        <DialogActions className="gap-2 px-6 py-4">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

