import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Login as LoginIcon,
} from '@mui/icons-material';

export const Unauthorized: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      p={3}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400 }}>
        <SecurityIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom color="error">
          401 - Unauthorized
        </Typography>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You don't have permission to access this page.
        </Alert>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          color="primary"
          startIcon={<LoginIcon />}
          fullWidth
        >
          Go to Login
        </Button>
      </Paper>
    </Box>
  );
}; 