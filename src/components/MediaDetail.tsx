'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Chip, 
  Skeleton,
  Rating,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { Movie, TVShow, Genre } from '@/types/media';
import { getImageUrl } from '@/lib/api/tmdb';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/navigation';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import MoviePlaceholder from './MoviePlaceholder';

// Styled components
const BackdropContainer = styled(Box)(({ theme }) => `
  position: relative;
  width: 100%;
  overflow: hidden;
  height: ${theme.breakpoints.down('md') ? '50vh' : '70vh'};
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(18,18,18,1) 0%, rgba(18,18,18,0.8) 50%, rgba(18,18,18,0.4) 100%);
  }
`);

const BackdropImage = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
});

const ContentContainer = styled(Box)(({ theme }) => `
  position: relative;
  z-index: 2;
  margin-top: -150px;
  ${theme.breakpoints.down('md')} {
    margin-top: -250px;
  }
`);

const PosterContainer = styled(Box)(({ theme }) => `
  width: 100%;
  max-width: 300px;
  border-radius: ${theme.shape.borderRadius}px;
  overflow: hidden;
  box-shadow: ${theme.shadows[8]};
  ${theme.breakpoints.down('md')} {
    max-width: 180px;
  }
  ${theme.breakpoints.down('sm')} {
    max-width: 80%;
    justify-self: center;
  }
`);

const InfoContainer = styled(Box)(({ theme }) => `
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  padding-bottom: ${theme.spacing(2)};
`);

// Add display names to styled components
BackdropContainer.displayName = 'BackdropContainer';
BackdropImage.displayName = 'BackdropImage';
ContentContainer.displayName = 'ContentContainer';
PosterContainer.displayName = 'PosterContainer';
InfoContainer.displayName = 'InfoContainer';

interface MediaDetailProps {
  data: Movie | TVShow;
  mediaType: 'movie' | 'tv';
  isLoading: boolean;
}

export default function MediaDetail({ data, mediaType, isLoading }: MediaDetailProps) {
  const router = useRouter();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, isLoggedIn } = useWatchlist();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('success');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Helper function to determine if data is a Movie or TVShow
  const isMovie = (data: Movie | TVShow): data is Movie => {
    return mediaType === 'movie';
  };
  
  // Extract common and media-specific properties
  const title = isMovie(data) ? data.title : data.name;
  const releaseDate = isMovie(data) ? data.release_date : data.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const runtime = isMovie(data) 
    ? data.runtime 
    : data.episode_run_time?.[0];
  
  // Format runtime as hours and minutes
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ''} ${mins > 0 ? `${mins}m` : ''}`;
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <>
        <Box sx={{ width: '100%', height: { xs: '50vh', md: '70vh' } }}>
        </Box>
        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ mt: -45, position: 'relative', zIndex: 2 }}>
            <Grid item xs={12} md={3}>
              <Skeleton variant="rectangular" width="100%" height={450} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} md={9}>
              <Skeleton variant="text" width="60%" height={60} />
              <Skeleton variant="text" width="40%" height={30} sx={{ mt: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
              </Box>
              <Skeleton variant="text" width="100%" height={120} sx={{ mt: 3 }} />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <BackdropContainer>
        {data.backdrop_path ? (
          <BackdropImage>
            <Image 
              src={getImageUrl(data.backdrop_path, 'original')}
              alt={title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </BackdropImage>
        ) : (
          <Box sx={{ width: '100%', height: '100%' }}>
            <MoviePlaceholder isLandscape={true} mediaType={mediaType} />
          </Box>
        )}
      </BackdropContainer>

      {/* Content */}
      <Container maxWidth="xl">
        <ContentContainer>
          <Grid container spacing={4}>
            {/* Poster */}
            <Grid item xs={12} sm={4} md={3}>
              <PosterContainer>
                {data.poster_path ? (
                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '2/3' }}>
                    <Image 
                      src={getImageUrl(data.poster_path, 'w500')}
                      alt={title}
                      fill
                      sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ aspectRatio: '2/3' }}>
                    <MoviePlaceholder mediaType={mediaType} />
                  </Box>
                )}
              </PosterContainer>
            </Grid>

            {/* Info */}
            <Grid item xs={12} sm={8} md={9}>
              <InfoContainer>
                {/* Title and Tagline */}
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  {title} {releaseYear && `(${releaseYear})`}
                </Typography>
                
                {data.tagline && (
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
                    {data.tagline}
                  </Typography>
                )}

                {/* Facts row */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
                  {/* Release date */}
                  {releaseDate && (
                    <Typography variant="body2">
                      {new Date(releaseDate).toLocaleDateString()}
                    </Typography>
                  )}
                  
                  {/* Runtime */}
                  {runtime && (
                    <>
                      <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                      <Typography variant="body2">
                        {formatRuntime(runtime)}
                      </Typography>
                    </>
                  )}
                  
                  {/* Status */}
                  {data.status && (
                    <>
                      <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                      <Typography variant="body2">
                        {data.status}
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Genres */}
                {data.genres && data.genres.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {data.genres.map((genre: Genre) => (
                      <Chip 
                        key={genre.id} 
                        label={genre.name} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                        }} 
                      />
                    ))}
                  </Box>
                )}

                {/* Rating */}
                {data.vote_average > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Rating 
                      value={data.vote_average / 2} 
                      precision={0.5} 
                      readOnly 
                      icon={<StarIcon fontSize="inherit" />}
                      emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {(data.vote_average / 2).toFixed(1)}/5 ({data.vote_count.toLocaleString()} votes)
                    </Typography>
                  </Box>
                )}

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PlayArrowIcon />}
                    sx={{ borderRadius: 8 }}
                  >
                    Watch Trailer
                  </Button>
                  {isInWatchlist(data.id, mediaType) ? (
                    <Button 
                      variant="outlined" 
                      startIcon={<RemoveIcon />}
                      sx={{ borderRadius: 8 }}
                      onClick={() => handleWatchlistAction('remove')}
                    >
                      Remove from Watchlist
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: 8 }}
                      onClick={() => handleWatchlistAction('add')}
                    >
                      Add to Watchlist
                    </Button>
                  )}
                </Box>

                {/* Overview */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>Overview</Typography>
                  <Typography variant="body1">
                    {data.overview || 'No overview available.'}
                  </Typography>
                </Box>

                {/* Media specific information */}
                <Grid container spacing={3}>
                  {/* Movie specific info */}
                  {isMovie(data) && (
                    <>
                      {data.budget && data.budget > 0 ? (
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="text.secondary">Budget</Typography>
                          <Typography variant="body1">
                            ${data.budget.toLocaleString()}
                          </Typography>
                        </Grid>
                      ) : null}
                      
                      {data.revenue && data.revenue > 0 ? (
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="text.secondary">Revenue</Typography>
                          <Typography variant="body1">
                            ${data.revenue.toLocaleString()}
                          </Typography>
                        </Grid>
                      ) : null}
                    </>
                  )}

                  {/* TV Show specific info */}
                  {!isMovie(data) && (
                    <>
                      {data.number_of_seasons && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="text.secondary">Seasons</Typography>
                          <Typography variant="body1">
                            {data.number_of_seasons}
                          </Typography>
                        </Grid>
                      )}
                      
                      {data.number_of_episodes && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="text.secondary">Episodes</Typography>
                          <Typography variant="body1">
                            {data.number_of_episodes}
                          </Typography>
                        </Grid>
                      )}
                      
                      {data.last_air_date && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="text.secondary">Last Air Date</Typography>
                          <Typography variant="body1">
                            {new Date(data.last_air_date).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </InfoContainer>
            </Grid>
          </Grid>
        </ContentContainer>
      </Container>
      {/* Alert Snackbar */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1f1f1f',
            color: '#fff',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: '#E50914' }}>
          Login Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)' }}>
            You need to be logged in to add items to your watchlist.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setLoginDialogOpen(false)} 
            sx={{ color: '#fff' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setLoginDialogOpen(false);
              router.push('/login');
            }} 
            variant="contained"
            sx={{ 
              backgroundColor: '#E50914',
              '&:hover': {
                backgroundColor: '#b2070f'
              }
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Handle watchlist actions
  function handleWatchlistAction(action: 'add' | 'remove') {
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }

    if (action === 'add') {
      const success = addToWatchlist(data, mediaType);
      if (success) {
        setAlertMessage('Added to your watchlist');
        setAlertSeverity('success');
      } else {
        setAlertMessage('Already in your watchlist');
        setAlertSeverity('info');
      }
    } else {
      const success = removeFromWatchlist(data.id, mediaType);
      if (success) {
        setAlertMessage('Removed from your watchlist');
        setAlertSeverity('success');
      }
    }
    
    setAlertOpen(true);
  }
}
