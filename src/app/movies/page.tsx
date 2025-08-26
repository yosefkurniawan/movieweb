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
import { usePopularMovies } from '@/lib/hooks/useMovies';
import MovieCard from '@/components/MovieCard';

export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = usePopularMovies(page);

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
                Popular Movies
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
            Error loading movies. Please try again.
          </Typography>
        )}

        {/* Results grid */}
        <Grid container spacing={3}>
          {isLoading
            ? Array.from(new Array(20)).map((_, index) => (
                <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={3}>
                  <Box sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
                  </Box>
                </Grid>
              ))
            : data?.results.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={3}>
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
            No movies found.
          </Typography>
        )}
      </Container>
    </>
  );
}
