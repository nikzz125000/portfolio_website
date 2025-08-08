import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingSpinner: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} />
      <Typography variant="body1" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
}; 