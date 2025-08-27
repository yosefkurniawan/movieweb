'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useMovieDetails } from '@/lib/hooks/useMovies';
import MediaDetail from '@/components/MediaDetail';
import RelatedMedia from '@/components/RelatedMedia';
import { Box, Container, Typography } from '@mui/material';

export default function MovieDetailPage() {
  const { id } = useParams();
  const { data: movie, isLoading, error } = useMovieDetails(id as string);

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading movie details
        </Typography>
        <Typography variant="body1">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </Typography>
      </Container>
    );
  }

  return (
    <Box component="main">
      <MediaDetail 
        data={movie || { id: 0, title: '', overview: '', poster_path: null, backdrop_path: null, release_date: '', vote_average: 0, vote_count: 0 }} 
        mediaType="movie"
        isLoading={isLoading}
      />
      
      <RelatedMedia 
        items={movie?.similar?.results || []} 
        title="Similar Movies" 
        mediaType="movie" 
        isLoading={isLoading}
      />
    </Box>
  );
}
