'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Skeleton,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Paper
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import { useSearch } from '@/lib/hooks/useSearch';
import { Movie, TVShow } from '@/types/media';
import MovieCard from '@/components/MovieCard';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'multi';
  
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'multi'>(initialType as 'movie' | 'tv' | 'multi');

  const { data, error, isLoading } = useSearch(searchTerm, mediaType, page);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMediaTypeChange = (event: React.MouseEvent<HTMLElement>, newMediaType: 'movie' | 'tv' | 'multi' | null) => {
    if (newMediaType !== null) {
      setMediaType(newMediaType);
      setPage(1);
      // Re-run search with new media type
      if (searchTerm) {
        // Update URL query params
        const url = new URL(window.location.href);
        url.searchParams.set('type', newMediaType);
        window.history.pushState({}, '', url);
      }
    }
  };

  // Effect to update search term when URL changes
  useEffect(() => {
    const newQuery = searchParams.get('q') || '';
    const newType = searchParams.get('type') || 'multi';
    
    setSearchTerm(newQuery);
    setMediaType(newType as 'movie' | 'tv' | 'multi');
  }, [searchParams]);

  return (
    <Container sx={{ py: 4 }}>
      {/* Results header with filter */}
      <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h6" component="h2">
              {searchTerm ? `Results for "${searchTerm}"` : 'Search Results'}
            </Typography>
            
            {data && (
              <Typography variant="body2" color="text.secondary">
                Found {data.total_results.toLocaleString()} results
              </Typography>
            )}
          </Box>
          
          {/* Media type filter */}
          <ToggleButtonGroup
            value={mediaType}
            exclusive
            onChange={handleMediaTypeChange}
            aria-label="media type filter"
            size="small"
          >
            <ToggleButton value="multi" aria-label="all media types">
              All
            </ToggleButton>
            <ToggleButton value="movie" aria-label="movies only">
              <MovieIcon sx={{ mr: 0.5 }} fontSize="small" /> Movies
            </ToggleButton>
            <ToggleButton value="tv" aria-label="tv shows only">
              <TvIcon sx={{ mr: 0.5 }} fontSize="small" /> TV Shows
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Error message */}
      {error && (
        <Typography color="error" variant="h6">
          Error loading search results. Please try again.
        </Typography>
      )}

      {/* Results grid */}
      <Grid container spacing={3}>
        {isLoading
          ? Array.from(new Array(8)).map((_, index) => (
              <Grid item key={`skeleton-${index}`} xs={6} sm={4} md={3}>
                <Box sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
                </Box>
              </Grid>
            ))
          : data?.results.map((item) => {
              // Determine if it's a movie or TV show
              const isMovie = 'title' in item;
              const title = isMovie ? (item as Movie).title : (item as TVShow).name;
              const releaseDate = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date;
              const mediaType = item.media_type || (isMovie ? 'movie' : 'tv');
              
              return (
                <Grid item key={item.id} xs={6} sm={4} md={3}>
                  <MovieCard
                    id={item.id}
                    title={title}
                    posterPath={item.poster_path}
                    backdrop_path={item.backdrop_path}
                    releaseDate={releaseDate}
                    voteAverage={item.vote_average}
                    overview={item.overview}
                    mediaType={mediaType as 'movie' | 'tv'}
                  />
                </Grid>
              );
            })}
      </Grid>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={Math.min(data.total_pages, 500)} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No results message */}
      {data && data.results.length === 0 && !isLoading && (
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          No results found for &quot;{searchTerm}&quot;. Try a different search term.
        </Typography>
      )}
    </Container>
  );
}
