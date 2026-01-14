import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';
import type { ReactNode } from 'react';
import type { NotificationProps } from '../components/Notification';

interface NotificationContextType {
  showNotification: (
    message: string,
    severity?: NotificationProps['severity'],
    autoHideDuration?: number
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<NotificationProps['severity']>('info');
  const [autoHideDuration, setAutoHideDuration] = useState<number | undefined>(4000);

  const showNotification = useCallback((msg: string, sev: NotificationProps['severity'] = 'info', duration?: number) => {
    setMessage(msg);
    setSeverity(sev);
    setAutoHideDuration(duration ?? 4000);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        open={open}
        onClose={handleClose}
        message={message}
        severity={severity}
        autoHideDuration={autoHideDuration}
      />
    </NotificationContext.Provider>
  );
};
