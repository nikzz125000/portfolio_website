import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  List as ListIcon,
} from '@mui/icons-material';

export default function AdminPanel() {
  const { user } = useAuth();

  

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      
      {user && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admin Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="body1">
                      <strong>Name:</strong> {user.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="primary" />
                    <Typography variant="body1">
                      <strong>Email:</strong> {user.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="body1">
                      <strong>Role:</strong> 
                      <Chip 
                        label={user.role} 
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Admin Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PeopleIcon />}
                  fullWidth
                >
                  Manage Users
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SettingsIcon />}
                  fullWidth
                >
                  System Settings
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<ListIcon />}
                  fullWidth
                >
                  View Logs
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}