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
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      gender: e.target.value
    });
  };

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

          <Box component="form" sx={{ mb: 3 }}>
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
                  value={formData.firstName}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#333' },
                      '&:hover fieldset': { borderColor: '#666' },
                      '&.Mui-focused fieldset': { borderColor: '#E50914' },
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
                  value={formData.lastName}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#333' },
                      '&:hover fieldset': { borderColor: '#666' },
                      '&.Mui-focused fieldset': { borderColor: '#E50914' },
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
              value={formData.email}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#E50914' },
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
              value={formData.password}
              onChange={handleChange}
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
                },
                '& .MuiInputBase-input': { color: '#fff' },
                backgroundColor: '#333',
                borderRadius: 1
              }}
            />

            <FormControl 
              fullWidth 
              sx={{
                mb: 3,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#E50914' },
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
                value={formData.gender}
                label="Gender"
                onChange={handleSelectChange}
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
            </FormControl>

            <Button
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
              <Link href="/login" passHref>
                <MuiLink 
                  underline="hover" 
                  sx={{ 
                    ml: 1, 
                    color: '#fff',
                    '&:hover': {
                      color: '#E50914'
                    }
                  }}
                >
                  Sign in
                </MuiLink>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}