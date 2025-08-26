import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieList from '../MovieList';
import { MediaItem } from '@/lib/api/tmdb';

// Mock the MovieCard component
jest.mock('../MovieCard', () => {
  return function MockMovieCard(props: any) {
    return (
      <div data-testid={`movie-card-${props.id}`}>
        <div>Title: {props.title}</div>
        <div>Media Type: {props.mediaType}</div>
      </div>
    );
  };
});

describe('MovieList', () => {
  // Sample movie data
  const mockMovies: MediaItem[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      poster_path: '/poster1.jpg',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
      vote_count: 100,
      genre_ids: [28, 12, 14],
      overview: 'Test overview 1',
      media_type: 'movie',
    },
    {
      id: 2,
      title: 'Test Movie 2',
      poster_path: '/poster2.jpg',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2023-02-01',
      vote_average: 7.5,
      vote_count: 80,
      genre_ids: [35, 18],
      overview: 'Test overview 2',
      media_type: 'movie',
    },
  ];

  // Sample TV show data
  const mockTVShows: MediaItem[] = [
    {
      id: 3,
      name: 'Test TV Show 1',
      poster_path: '/poster3.jpg',
      backdrop_path: '/backdrop3.jpg',
      first_air_date: '2023-03-01',
      vote_average: 9.0,
      vote_count: 120,
      genre_ids: [10765, 18],
      overview: 'Test overview 3',
      media_type: 'tv',
    },
    {
      id: 4,
      name: 'Test TV Show 2',
      poster_path: '/poster4.jpg',
      backdrop_path: '/backdrop4.jpg',
      first_air_date: '2023-04-01',
      vote_average: 6.5,
      vote_count: 65,
      genre_ids: [10759, 80],
      overview: 'Test overview 4',
      media_type: 'tv',
    },
  ];

  it('renders the section title correctly', () => {
    render(<MovieList title="Popular Movies" movies={[]} isLoading={false} />);
    expect(screen.getByText('Popular Movies')).toBeInTheDocument();
  });

  it('renders loading skeletons when isLoading is true', () => {
    render(<MovieList title="Popular Movies" isLoading={true} />);
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders movie cards when data is loaded', () => {
    render(<MovieList title="Popular Movies" movies={mockMovies} isLoading={false} />);
    
    // Check if movie cards are rendered
    expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
    expect(screen.getByText('Title: Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Title: Test Movie 2')).toBeInTheDocument();
  });

  it('renders TV show cards correctly', () => {
    render(<MovieList title="Popular TV Shows" movies={mockTVShows} isLoading={false} mediaType="tv" />);
    
    // Check if TV show cards are rendered
    expect(screen.getByTestId('movie-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-4')).toBeInTheDocument();
    expect(screen.getByText('Title: Test TV Show 1')).toBeInTheDocument();
    expect(screen.getByText('Title: Test TV Show 2')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    render(<MovieList title="Popular Movies" isLoading={false} error="Failed to fetch" />);
    
    // Check if error message is displayed
    expect(screen.getByText('Error loading content. Please try again later.')).toBeInTheDocument();
  });
});
