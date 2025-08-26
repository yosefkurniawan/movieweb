'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTVShowDetails } from '@/lib/hooks/useMovies';
import MediaDetail from '@/components/MediaDetail';
import RelatedMedia from '@/components/RelatedMedia';
import { Box, Container, Typography } from '@mui/material';

export default function TVShowDetailPage() {
  const { id } = useParams();
  const { data: tvShow, isLoading, error } = useTVShowDetails(id as string);

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading TV show details
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
        data={tvShow || { id: 0, name: '', overview: '', poster_path: null, backdrop_path: null, first_air_date: '', vote_average: 0, vote_count: 0 }} 
        mediaType="tv"
        isLoading={isLoading}
      />
      
      {/* Similar TV Shows Section */}
      {tvShow?.similar && tvShow.similar.results.length > 0 && (
        <RelatedMedia 
          items={tvShow.similar.results} 
          title="Similar TV Shows" 
          mediaType="tv" 
          isLoading={isLoading}
        />
      )}
    </Box>
  );
}
