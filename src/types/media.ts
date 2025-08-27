// Core media types for the application

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

// Base interface for both movies and TV shows
export interface BaseMediaItem {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  tagline?: string;
  media_type?: 'movie' | 'tv';
}

// Movie specific interface
export interface Movie extends BaseMediaItem {
  title: string;
  release_date: string;
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: ProductionCompany[];
}

// TV Show specific interface
export interface TVShow extends BaseMediaItem {
  name: string;
  first_air_date: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  created_by?: Creator[];
  networks?: Network[];
  seasons?: Season[];
  in_production?: boolean;
  last_air_date?: string;
}

// Extended interfaces for detailed views
export interface MovieDetails extends Movie {
  similar?: {
    results: Movie[];
  };
  videos?: {
    results: Video[];
  };
}

export interface TVShowDetails extends TVShow {
  similar?: {
    results: TVShow[];
  };
  videos?: {
    results: Video[];
  };
}

// Union type for items that could be either movies or TV shows
export type MediaItem = Movie | TVShow;

// Response interfaces for API results
export interface SearchResult {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}
