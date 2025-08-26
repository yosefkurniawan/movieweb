import { useQuery } from '@tanstack/react-query';
import { 
  fetchTrendingMovies, 
  fetchTrendingTVShows, 
  fetchPopularMovies, 
  fetchPopularTVShows, 
  MovieResponse, 
  TVShowResponse,
  fetchTopRatedMovies,
  fetchMovieDetails,
  fetchTVShowDetails,
  MovieDetails,
  TVShowDetails
} from '@/lib/api/tmdb';

export function useTrendingMovies(page = 1, timeWindow: 'day' | 'week' = 'week') {
  return useQuery<MovieResponse>({
    queryKey: ['trendingMovies', page, timeWindow],
    queryFn: () => fetchTrendingMovies(page, timeWindow),
  });
}

export function useTrendingTVShows(page = 1, timeWindow: 'day' | 'week' = 'week') {
  return useQuery<TVShowResponse>({
    queryKey: ['trendingTVShows', page, timeWindow],
    queryFn: () => fetchTrendingTVShows(page, timeWindow),
  });
}

export function usePopularMovies(page = 1) {
  return useQuery<MovieResponse>({
    queryKey: ['popularMovies', page],
    queryFn: () => fetchPopularMovies(page),
  });
}

export function usePopularTVShows(page = 1) {
  return useQuery<TVShowResponse>({
    queryKey: ['popularTVShows', page],
    queryFn: () => fetchPopularTVShows(page),
  });
}

export function useTopRatedMovies(page = 1) {
  return useQuery<MovieResponse>({
    queryKey: ['topRatedMovies', page],
    queryFn: () => fetchTopRatedMovies(page),
  }); 
}

export function useMovieDetails(id: number | string) {
  const movieId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  return useQuery<MovieDetails>({
    queryKey: ['movieDetails', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !isNaN(movieId),
  });
}

export function useTVShowDetails(id: number | string) {
  const tvShowId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  return useQuery<TVShowDetails>({
    queryKey: ['tvShowDetails', tvShowId],
    queryFn: () => fetchTVShowDetails(tvShowId),
    enabled: !isNaN(tvShowId),
  });
}
