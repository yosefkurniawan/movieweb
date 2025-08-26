 'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import MovieIcon from '@mui/icons-material/Movie';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

// User data interface
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Redirect to login if user data is invalid
        router.push('/login');
      }
    } else {
      // Redirect to login if no user is logged in
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('currentUser');
    
    setLogoutDialogOpen(false);
    showAlert('Logged out successfully', 'success');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  const cancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  // Show loading state while checking authentication
  if (!userData) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#141414'
      }}>
        <Typography variant="h5" sx={{ color: '#fff' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      pt: 10, // Add padding top to account for the header
      pb: 5,
      backgroundColor: '#141414'
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: '#fff', 
          fontWeight: 'bold',
          mb: 4
        }}>
          My Account
        </Typography>

        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              backgroundColor: '#1f1f1f',
              color: '#fff',
              borderRadius: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 3
              }}>
                <Avatar 
                  src={`https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=E50914&color=fff&size=200`}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" component="h2" sx={{ textAlign: 'center' }}>
                  {userData.firstName} {userData.lastName}
                </Typography>
              </Box>

              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', my: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: '#E50914' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={`${userData.firstName} ${userData.lastName}`} 
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon sx={{ color: '#E50914' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={userData.email}
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                </ListItem>
                {userData.gender && (
                  <ListItem>
                    <ListItemIcon>
                      <WcIcon sx={{ color: '#E50914' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Gender" 
                      secondary={userData.gender}
                      secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                  </ListItem>
                )}
              </List>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ 
                    borderColor: '#E50914',
                    color: '#E50914',
                    width: '100%',
                    maxWidth: '200px',
                    '&:hover': {
                      borderColor: '#b2070f',
                      backgroundColor: 'rgba(229, 9, 20, 0.1)'
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              backgroundColor: '#1f1f1f',
              color: '#fff',
              borderRadius: 2,
              mb: 4
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FavoriteIcon sx={{ color: '#E50914', mr: 1 }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  My Favorites
                </Typography>
              </Box>
              
              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
              
              {/* Dummy favorite movies */}
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={12} sm={6} key={item}>
                    <Card sx={{ 
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      display: 'flex',
                      height: 120
                    }}>
                      <Box sx={{ width: 80, height: 120, backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MovieIcon sx={{ fontSize: 40, color: '#E50914' }} />
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          Favorite Movie {item}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                          Action, Adventure • 2023
                        </Typography>
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Button size="small" sx={{ color: '#E50914', p: 0 }}>
                            View Details
                          </Button>
                          <Button size="small" sx={{ color: '#E50914', p: 0, ml: 2 }}>
                            Remove
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  sx={{ 
                    borderColor: '#E50914',
                    color: '#E50914',
                    '&:hover': {
                      borderColor: '#b2070f',
                      backgroundColor: 'rgba(229, 9, 20, 0.1)'
                    }
                  }}
                >
                  View All Favorites
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={cancelLogout}
        id="logout-dialog"
        PaperProps={{
          sx: {
            backgroundColor: '#1f1f1f',
            color: '#fff',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: '#E50914' }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={cancelLogout} 
            id="cancel-logout-button"
            sx={{ color: '#fff' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmLogout} 
            variant="contained"
            id="confirm-logout-button"
            sx={{ 
              backgroundColor: '#E50914',
              '&:hover': {
                backgroundColor: '#b2070f'
              }
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
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