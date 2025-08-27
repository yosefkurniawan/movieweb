'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Skeleton,
  Pagination,
  Paper
} from '@mui/material';
import { usePopularTVShows } from '@/lib/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import { TVShow } from '@/types/media';

export default function TVShowsPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = usePopularTVShows(page);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Container sx={{ py: 4 }}>
        {/* Page header */}
        <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h1">
                Popular TV Shows
              </Typography>
              
              {data && (
                <Typography variant="body2" color="text.secondary">
                  Showing page {data.page} of {Math.min(data.total_pages, 500)}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Error message */}
        {error && (
          <Typography color="error" variant="h6">
            Error loading TV shows. Please try again.
          </Typography>
        )}

        {/* Results grid */}
        <Grid container spacing={3}>
          {isLoading
            ? Array.from(new Array(20)).map((_, index) => (
                <Grid item key={`skeleton-${index}`} xs={6} sm={4} md={3}>
                  <Box sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
                  </Box>
                </Grid>
              ))
            : data?.results.map((show) => (
                <Grid item key={show.id} xs={6} sm={4} md={3}>
                  <MovieCard
                    id={show.id}
                    title={(show as TVShow).name}
                    posterPath={show.poster_path}
                    backdrop_path={show.backdrop_path}
                    releaseDate={(show as TVShow).first_air_date}
                    voteAverage={show.vote_average}
                    overview={show.overview}
                    mediaType="tv"
                  />
                </Grid>
              ))}
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
            No TV shows found.
          </Typography>
        )}
      </Container>
    </>
  );
}
