import { useQuery } from '@tanstack/react-query';
import { 
  searchMovies, 
  searchTVShows, 
  searchMulti, 
  MovieResponse, 
  TVShowResponse, 
  MultiResponse 
} from '@/lib/api/tmdb';

type MediaType = 'movie' | 'tv' | 'multi';

export function useSearch(query: string, mediaType: MediaType = 'multi', page = 1) {
  return useQuery<MovieResponse | TVShowResponse | MultiResponse>({
    queryKey: ['search', mediaType, query, page],
    queryFn: () => {
      switch (mediaType) {
        case 'movie':
          return searchMovies(query, page);
        case 'tv':
          return searchTVShows(query, page);
        case 'multi':
        default:
          return searchMulti(query, page);
      }
    },
    enabled: !!query, // Only run the query if there's a search term
  });
}

// Keep the original function for backward compatibility
export function useSearchMovies(query: string, page = 1) {
  return useQuery<MovieResponse>({
    queryKey: ['searchMovies', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: !!query, // Only run the query if there's a search term
  });
}
