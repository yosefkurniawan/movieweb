'use client';

import { Box, Container } from "@mui/material";
import FeaturedMovie from "@/components/FeaturedMovie";
import MovieList from "@/components/MovieList";
import { usePopularMovies, usePopularTVShows, useTrendingMovies, useTrendingTVShows, useTopRatedMovies } from "@/lib/hooks/useMovies";

export default function Home() {
  const { 
    data: trendingMoviesData, 
    isLoading: isLoadingMovies, 
    error: moviesError 
  } = useTrendingMovies();

  const { 
    data: trendingTVData, 
    isLoading: isLoadingTV, 
    error: tvError 
  } = useTrendingTVShows();

  const { 
    data: popularMoviesData, 
    isLoading: isLoadingPopularMovies, 
    error: popularMoviesError 
  } = usePopularMovies();

  const { 
    data: popularTVData, 
    isLoading: isLoadingPopularTV, 
    error: popularTVError 
  } = usePopularTVShows();

  const { 
    data: topRatedMoviesData, 
    isLoading: isLoadingTopRatedMovies, 
    error: topRatedMoviesError 
  } = useTopRatedMovies();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Featured Movie Section */}
      <FeaturedMovie />
      
      {/* Content Container */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Trending Movies Section */}
        <MovieList 
          title="This Week's Trending Movies"
          movies={trendingMoviesData?.results}
          isLoading={isLoadingMovies}
          error={moviesError}
          mediaType="movie"
        />
        
        {/* Trending TV Shows Section */}
        <MovieList 
          title="This Week's Trending TV Shows"
          movies={trendingTVData?.results}
          isLoading={isLoadingTV}
          error={tvError}
          mediaType="tv"
        />

        {/* Top Rated Movies Section */}
        <MovieList 
          title="Top Rated Movies"
          movies={topRatedMoviesData?.results}
          isLoading={isLoadingTopRatedMovies}
          error={topRatedMoviesError}
          mediaType="movie"
          isLandscape={true}
        />

        {/* Popular Movies Section */}
        <MovieList 
          title="Popular Movies"
          movies={popularMoviesData?.results}
          isLoading={isLoadingPopularMovies}
          error={popularMoviesError}
          mediaType="movie"
        />

        {/* Popular TV Shows Section */}
        <MovieList 
          title="Popular TV Shows"
          movies={popularTVData?.results}
          isLoading={isLoadingPopularTV}
          error={popularTVError}
          mediaType="tv"
        />
      </Container>
    </Box>
  );
}
