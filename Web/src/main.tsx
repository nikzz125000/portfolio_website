import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './auth/AuthContext';
import { App } from './App';
import './index.css';
import APIProvider from './utils/ApiProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <APIProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
        </APIProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);