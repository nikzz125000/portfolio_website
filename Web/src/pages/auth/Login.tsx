/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/auth/Login.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../hooks/useAuthActions';
import { FormField } from '../../components/FormField';
import { Button, Box, Typography, Alert, Paper, Link } from '@mui/material';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormData>({
    mode: 'onBlur',
  });

  const { login } = useAuthActions();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data.email, data.password);
      console.log(result)
      if (result.success) {
        // Redirect to admin dashboard after successful login
        navigate('/admin/dashboard');
      } else {
        setError('root', {
          message: result.error || 'Login failed. Please try again.',
        });
      }
    } catch (error) {
      setError('root', {
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errors.root && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.root.message}
            </Alert>
          )}

          <FormField
            label="Email"
            required
            error={errors.email}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            type="email"
            autoComplete="email"
            placeholder="Email address"
            disabled={isSubmitting}
          />

          <FormField
            label="Password"
            required
            error={errors.password}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long'
              }
            })}
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Link 
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{ textDecoration: 'none' }}
          >
            Back to Home
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;