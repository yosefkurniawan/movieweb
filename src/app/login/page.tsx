'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { User } from '@/types/user';

// Validation schema
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      try {
        // Get users from local storage
        const usersJson = localStorage.getItem('users') || '[]';
        const users = JSON.parse(usersJson);
        
        // Find user with matching email and password
        const user = users.find((u: User) => 
          u.email === values.email && u.password === values.password
        );
        
        if (user) {
          try {
            // Set current user to local storage
            localStorage.setItem('currentUser', JSON.stringify({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              gender: user.gender
            }));
            
            showAlert('Login successful! Redirecting to account page...', 'success');
            
            // Redirect to account page after a short delay
            setTimeout(() => {
              window.location.href = '/account';
            }, 1500);
          } catch (error) {
            console.error('Error storing user data:', error);
            showAlert('An error occurred during login. Please try again.', 'error');
          }
        } else {
          // Show error for invalid credentials
          showAlert('Invalid email or password. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred during login. Please try again.', 'error');
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#141414',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc88b/a3873901-5b2c-4e25-b4c4-c5eae1596286/US-en-20240722-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      py: 5
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ 
          p: 4, 
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          borderRadius: 2
        }}>
          <Typography variant="h4" component="h1" align="left" gutterBottom sx={{ 
            color: '#fff', 
            fontWeight: 'bold',
            mb: 4
          }}>
            Sign In
          </Typography>

          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mb: 3 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              FormHelperTextProps={{
                sx: { color: '#ff6d6d' }
              }}
              sx={{
                mb: 2,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#E50914' },
                  '&.Mui-error fieldset': { borderColor: '#ff6d6d' },
                },
                '& .MuiInputBase-input': { color: '#fff' },
                backgroundColor: '#333',
                borderRadius: 1
              }}
            />
            
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              FormHelperTextProps={{
                sx: { color: '#ff6d6d' }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#E50914' },
                  '&.Mui-error fieldset': { borderColor: '#ff6d6d' },
                },
                '& .MuiInputBase-input': { color: '#fff' },
                backgroundColor: '#333',
                borderRadius: 1
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                backgroundColor: '#E50914',
                '&:hover': {
                  backgroundColor: '#b2070f'
                },
                fontWeight: 'bold'
              }}
            >
              Sign In
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#b3b3b3' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  New to MovieWeb?
                </Typography>
                <Link href="/register" passHref >
                  <Typography sx={{ 
                    ml: 1, 
                    color: '#fff',
                    '&:hover': {
                      color: '#E50914'
                    }
                  }}>Sign up now</Typography>
              </Link>
              </Box>
              <Link href="#" passHref>
                <Typography 
                  sx={{ 
                    color: '#b3b3b3',
                    '&:hover': {
                      color: '#fff'
                    }
                  }}
                >
                  Need help?
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}