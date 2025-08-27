'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Skeleton,
  Container,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieCard from './MovieCard';
import { MediaItem, Movie, TVShow } from '@/types/media';

// Styled components
const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE and Edge
  gap: theme.spacing(2),
  position: 'relative',
  padding: theme.spacing(1, 0),
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

// Define a type for the CardWrapper props
interface CardWrapperProps {
  isLandscape?: boolean;
}

const CardWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLandscape',
})<CardWrapperProps>(({ theme, isLandscape }) => ({
  flex: '0 0 auto',
  width: '280px',
  [theme.breakpoints.down('sm')]: {
    width: '220px',
    ...(isLandscape && {
      width: '85%',
    }),
  },
  ...(isLandscape && {
    width: '35%',
  }),
}));

interface MovieListProps {
  title: string;
  movies?: MediaItem[];
  isLoading: boolean;
  error?: Error | unknown;
  mediaType?: 'movie' | 'tv';
  isLandscape?: boolean;
}

// Type guard to check if an item is a Movie
const isMovie = (item: MediaItem): item is Movie => {
  return 'title' in item && 'release_date' in item;
};

// Type guard to check if an item is a TVShow
const isTVShow = (item: MediaItem): item is TVShow => {
  return 'name' in item && 'first_air_date' in item;
};

// Add display names to styled components
ScrollContainer.displayName = 'ScrollContainer';
ScrollButton.displayName = 'ScrollButton';
CardWrapper.displayName = 'CardWrapper';

export default function MovieList({ 
  title, 
  movies = [], 
  isLoading, 
  error,
  mediaType = 'movie',
  isLandscape = false
}: MovieListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h5" sx={{ my: 4 }}>
          Error loading content. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ px: 3, fontWeight: 'bold' }}>
        {title}
      </Typography>
      
      <Box sx={{ position: 'relative' }}>
        {!isMobile && showLeftButton && (
          <ScrollButton 
            onClick={() => scroll('left')} 
            sx={{ left: 8 }}
            size="small"
          >
            <ChevronLeftIcon />
          </ScrollButton>
        )}
        
        <ScrollContainer ref={scrollContainerRef}>
          {isLoading
            ? Array.from(new Array(8)).map((_, index) => (
                <CardWrapper key={`skeleton-${index}`} isLandscape={isLandscape}>
                  <Box sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" sx={{ height: { xs: !isLandscape ? 350 : 250, md: !isLandscape ? 400 : 300, borderRadius: 12 } }} />
                  </Box>
                </CardWrapper>
              ))
            : movies?.map((item) => {
                // Determine title and release date based on item type
                const itemTitle = isMovie(item) ? item.title : (isTVShow(item) ? item.name : '');
                const itemReleaseDate = isMovie(item) ? item.release_date : (isTVShow(item) ? item.first_air_date : '');
                const itemMediaType = item.media_type || mediaType;
                
                return (
                  <CardWrapper key={item.id} isLandscape={isLandscape}>
                    <MovieCard
                      id={item.id}
                      title={itemTitle}
                      posterPath={item.poster_path}
                      backdrop_path={item.backdrop_path}
                      releaseDate={itemReleaseDate}
                      voteAverage={item.vote_average}
                      overview={item.overview}
                      mediaType={itemMediaType}
                      isLandscape={isLandscape}
                    />
                  </CardWrapper>
                );
              })}
        </ScrollContainer>
        
        {!isMobile && showRightButton && (
          <ScrollButton 
            onClick={() => scroll('right')} 
            sx={{ right: 8 }}
            size="small"
          >
            <ChevronRightIcon />
          </ScrollButton>
        )}
      </Box>
    </Box>
  );
}
