// TMDB API configuration
const BASE_URL = 'https://api.themoviedb.org/3';
// const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${API_KEY}`
};

// Types for API responses
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
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
export const fetchPopularMovies = async (page = 1): Promise<MovieResponse> => {
  return apiRequest<MovieResponse>(`/movie/popular?page=${page}`);
};

export const fetchMovieDetails = async (id: number) => {
  return apiRequest(`/movie/${id}`);
};

export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  return apiRequest<MovieResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
};

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
