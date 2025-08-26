export interface BaseMediaItem {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
}

export interface MovieItem extends BaseMediaItem {
  title: string;
  release_date: string;
}

export interface TVShowItem extends BaseMediaItem {
  name: string;
  first_air_date: string;
}

export type MediaItem = MovieItem | TVShowItem;

export interface SearchResult {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}
