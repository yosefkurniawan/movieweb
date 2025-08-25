import { useQuery } from '@tanstack/react-query';
import { fetchPopularMovies, MovieResponse } from '@/lib/api/tmdb';

export function usePopularMovies(page = 1) {
  return useQuery<MovieResponse>({
    queryKey: ['popularMovies', page],
    queryFn: () => fetchPopularMovies(page),
  });
}
