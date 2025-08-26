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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Validation schema
const validationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name should be at least 2 characters')
    .max(50, 'First name should not exceed 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name should be at least 2 characters')
    .max(50, 'Last name should not exceed 50 characters'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password should be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  gender: yup
    .string()
    .required('Please select your gender')
});

export default function RegisterPage() {
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      try {
        // Get existing users or initialize empty array
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        const emailExists = existingUsers.some((user: any) => user.email === values.email);
        if (emailExists) {
          showAlert('This email is already registered. Please use a different email or login.', 'error');
          return;
        }
        
        const newUser = {
          id: Date.now().toString(),
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          gender: values.gender,
          createdAt: new Date().toISOString()
        };
        
        // Save updated users array
        localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
        
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify({
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        }));
        
        showAlert('Registration successful! Redirecting to account page...', 'success');
        
        formik.resetForm();
        
        // Redirect after a short delay to allow the user to see the success message
        setTimeout(() => {
          window.location.href = '/account';
        }, 1500);
      } catch (error) {
        console.error('Registration error:', error);
        showAlert('An error occurred during registration. Please try again.', 'error');
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
            Sign Up
          </Typography>

          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
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
              </Grid>
            </Grid>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
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

            <FormControl 
              fullWidth 
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              sx={{
                mb: 3,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#E50914' },
                  '&.Mui-error fieldset': { borderColor: '#ff6d6d' },
                },
                '& .MuiSelect-select': { color: '#fff' },
                backgroundColor: '#333',
                borderRadius: 1
              }}
            >
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formik.values.gender}
                label="Gender"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#333',
                      color: '#fff',
                    },
                  },
                }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
              </Select>
              {formik.touched.gender && formik.errors.gender && (
                <FormHelperText sx={{ color: '#ff6d6d' }}>{formik.errors.gender}</FormHelperText>
              )}
            </FormControl>

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
              Sign Up
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#b3b3b3' }}>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                Already have an account?
              </Typography>
              <Link href="/login" passHref >
                  <Typography sx={{ 
                    ml: 1, 
                    color: '#fff',
                    '&:hover': {
                      color: '#E50914'
                    }
                  }}>Sign in</Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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