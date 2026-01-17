import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import React from 'react'

export interface NotificationProps {
  open: boolean
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void
  message: string
  severity?: 'success' | 'info' | 'warning' | 'error'
  autoHideDuration?: number
  onError?: () => void // Optional callback for error notifications
}

const Notification: React.FC<NotificationProps> = ({
  open,
  onClose,
  message,
  severity = 'info',
  autoHideDuration,
  onError,
}) => {
  React.useEffect(() => {
    if (open && severity === 'error' && onError) {
      onError()
    }
  }, [open, severity, onError])

  // Only pass autoHideDuration if defined, otherwise Snackbar will not auto-close
  const snackbarProps: any = {
    open,
    onClose,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
  }
  if (autoHideDuration !== undefined) {
    snackbarProps.autoHideDuration = autoHideDuration
  }
  return (
    <Snackbar {...snackbarProps}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
