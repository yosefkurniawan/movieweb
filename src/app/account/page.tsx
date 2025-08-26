 'use client';

import React from 'react';
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
  Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import MovieIcon from '@mui/icons-material/Movie';

// Dummy user data
const userData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  gender: 'Male',
  avatarUrl: 'https://i.pravatar.cc/300',
};

export default function AccountPage() {
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
                  src={userData.avatarUrl} 
                  alt={userData.fullName}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              </Box>

              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', my: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: '#E50914' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={userData.fullName} 
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
              </List>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    backgroundColor: '#E50914',
                    '&:hover': {
                      backgroundColor: '#b2070f'
                    }
                  }}
                >
                  Edit Profile
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
    </Box>
  );
}