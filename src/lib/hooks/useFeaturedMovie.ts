import { useQuery } from '@tanstack/react-query';
import { fetchTrendingAll } from '@/lib/api/tmdb';

export function useFeaturedMovie() {
  return useQuery({
    queryKey: ['featuredMovie'],
    queryFn: async () => {
      const data = await fetchTrendingAll(1);
      // Return the most popular movie (first in the list)
      return data.results[0];
    },
  });
}
