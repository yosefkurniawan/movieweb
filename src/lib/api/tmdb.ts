// TMDB API configuration
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
};

// Types for API responses
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

export interface MovieDetails extends Movie {
  similar?: {
    results: Movie[];
  };
  videos?: {
    results: Video[];
  };
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  production_companies?: ProductionCompany[];
  media_type?: 'movie' | 'tv';
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

export interface TVShowDetails extends TVShow {
  similar?: {
    results: TVShow[];
  };
  videos?: {
    results: Video[];
  };
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  created_by?: Creator[];
  networks?: Network[];
  seasons?: Season[];
  in_production?: boolean;
  last_air_date?: string;
  media_type?: 'movie' | 'tv';
}

export type MediaItem = Movie | TVShow;

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface TrendingResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export interface MultiResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

// Helper function to handle API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: defaultHeaders,
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// API functions

// Trending All
export const fetchTrendingAll = async (page = 1): Promise<TrendingResponse> => {
  return apiRequest<TrendingResponse>(`/trending/all/week?page=${page}`);
};

// Trending Movies
export const fetchTrendingMovies = async (page = 1, timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse> => {
  return apiRequest<MovieResponse>(`/trending/movie/${timeWindow}?page=${page}`);
};

// Trending TV Shows
export const fetchTrendingTVShows = async (page = 1, timeWindow: 'day' | 'week' = 'week'): Promise<TVShowResponse> => {
  return apiRequest<TVShowResponse>(`/trending/tv/${timeWindow}?page=${page}`);
};

// Popular Movies
export const fetchPopularMovies = async (page = 1): Promise<MovieResponse> => {
  return apiRequest<MovieResponse>(`/movie/popular?page=${page}`);
};

// Popular TV Shows
export const fetchPopularTVShows = async (page = 1): Promise<TVShowResponse> => {
  return apiRequest<TVShowResponse>(`/tv/popular?page=${page}`);
};

// Top Rated Movies
export const fetchTopRatedMovies = async (page = 1): Promise<MovieResponse> => {
  return apiRequest<MovieResponse>(`/movie/top_rated?page=${page}`);
};

// Movie Details
export const fetchMovieDetails = async (id: number): Promise<MovieDetails> => {
  return apiRequest<MovieDetails>(`/movie/${id}?append_to_response=credits,similar,videos`);
};

// TV Show Details
export const fetchTVShowDetails = async (id: number): Promise<TVShowDetails> => {
  return apiRequest<TVShowDetails>(`/tv/${id}?append_to_response=credits,similar,videos`);
};

// Search Movies
export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  return apiRequest<MovieResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
};

// Search TV Shows
export const searchTVShows = async (query: string, page = 1): Promise<TVShowResponse> => {
  return apiRequest<TVShowResponse>(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`);
};

// Search Multi (movies, TV shows)
export const searchMulti = async (query: string, page = 1): Promise<TrendingResponse> => {
  return apiRequest<TrendingResponse>(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
};

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
