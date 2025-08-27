'use client';

import React from 'react';
import { 
  Typography, 
  Grid, 
  Container,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Movie, TVShow } from '@/types/media';
import MovieCard from './MovieCard';

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 'bold',
}));

// Add display name to styled component
SectionTitle.displayName = 'SectionTitle';

interface RelatedMediaProps {
  items: (Movie | TVShow)[];
  title: string;
  mediaType: 'movie' | 'tv';
  isLoading: boolean;
}

export default function RelatedMedia({ items, title, mediaType, isLoading }: RelatedMediaProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
        <SectionTitle variant="h5">{title}</SectionTitle>
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // No items to display
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
      <SectionTitle variant="h5">{title}</SectionTitle>
      <Grid container spacing={2}>
        {items.slice(0, 6).map((item) => {
          // Convert TV show to expected format for MovieCard
          if (mediaType === 'tv') {
            // For TV shows, map name to title and first_air_date to releaseDate
            const tvShow = item as TVShow;
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                <MovieCard 
                  id={tvShow.id}
                  title={tvShow.name}
                  posterPath={tvShow.poster_path}
                  backdrop_path={tvShow.backdrop_path}
                  releaseDate={tvShow.first_air_date}
                  voteAverage={tvShow.vote_average}
                  overview={tvShow.overview}
                  mediaType="tv"
                />
              </Grid>
            );
          } else {
            // For movies, use properties directly
            const movie = item as Movie;
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                <MovieCard 
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  backdrop_path={movie.backdrop_path}
                  releaseDate={movie.release_date}
                  voteAverage={movie.vote_average}
                  overview={movie.overview}
                  mediaType="movie"
                />
              </Grid>
            );
          }
        })}
      </Grid>
    </Container>
  );
}
