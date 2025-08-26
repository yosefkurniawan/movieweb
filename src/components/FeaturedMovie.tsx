'use client';

import { Box, Button, Container, Typography, Skeleton, Rating } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useFeaturedMovie } from '@/lib/hooks/useFeaturedMovie';
import { getImageUrl } from '@/lib/api/tmdb';
import { MediaItem, Movie, TVShow } from '@/lib/api/tmdb';

// Type guards
const isMovie = (item: MediaItem): item is Movie => {
  return 'title' in item && 'release_date' in item;
};

const isTVShow = (item: MediaItem): item is TVShow => {
  return 'name' in item && 'first_air_date' in item;
};

export default function FeaturedMovie() {
  const { data: media, isLoading, error } = useFeaturedMovie();

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '80vh',
          width: '100%',
          bgcolor: 'grey.900',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Skeleton variant="rectangular" width="40%" height={60} sx={{ mb: 2, bgcolor: 'grey.800' }} />
          <Skeleton variant="rectangular" width="70%" height={30} sx={{ mb: 1, bgcolor: 'grey.800' }} />
          <Skeleton variant="rectangular" width="60%" height={120} sx={{ mb: 3, bgcolor: 'grey.800' }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" height={45} sx={{ bgcolor: 'grey.800' }} />
            <Skeleton variant="rectangular" height={45} sx={{ bgcolor: 'grey.800' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !media) {
    return null;
  }

  // Get the appropriate title and release date based on media type
  const title = isMovie(media) ? media.title : (isTVShow(media) ? media.name : '');
  const releaseDate = isMovie(media) ? media.release_date : (isTVShow(media) ? media.first_air_date : '');
  
  return (
    <Box
      sx={{
        height: '80vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${getImageUrl(isMovie(media) ? media.backdrop_path : (isTVShow(media) ? media.backdrop_path : ''), 'original')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
          zIndex: -1,
        },
      }}
    >
      <Container sx={{ zIndex: 1 }}>
        <Box sx={{ maxWidth: { xs: '100%', md: '50%' } }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating 
              value={media.vote_average / 2} 
              precision={0.5} 
              readOnly 
              sx={{
                "& .MuiRating-iconEmpty": {
                  color: "rgba(255, 255, 255, 0.5)"
                }
              }} 
            />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {media.vote_average.toFixed(1)}/10
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              {new Date(releaseDate).getFullYear()}
            </Typography>
          </Box>
          
          <Typography variant="body2" paragraph sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            {media.overview}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large" 
              startIcon={<PlayArrowIcon />}
              sx={{ px: 4, py: 1 }}
            >
              Play
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large" 
              startIcon={<InfoOutlinedIcon />}
              sx={{ px: 4, py: 1 }}
            >
              More Info
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
