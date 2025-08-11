// Step 1: Create NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode, ComponentProps } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide
} from '@mui/material';

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  title?: string;
}

interface NotificationContextType {
  showNotification: (
    message: string, 
    severity?: 'success' | 'error' | 'warning' | 'info', 
    title?: string
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Custom transition - using ComponentProps to get the correct type
const SlideTransition = (props: ComponentProps<typeof Slide>) => {
  return <Slide {...props} direction="left" />;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info' = 'success',
    title?: string
  ) => {
    setNotification({
      open: true,
      message,
      severity,
      title
    });
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Make showNotification globally available for axios interceptors
  React.useEffect(() => {
    (window as any).showNotification = showNotification;
    return () => {
      delete (window as any).showNotification;
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert 
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: 3,
            minWidth: 300,
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            }
          }}
        >
          {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};