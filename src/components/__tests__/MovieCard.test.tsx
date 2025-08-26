import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieCard from '../MovieCard';
import { getImageUrl } from '@/lib/api/tmdb';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the getImageUrl function
jest.mock('@/lib/api/tmdb', () => ({
  getImageUrl: jest.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
}));

describe('MovieCard', () => {
  // sample data
  const defaultProps = {
    id: 123,
    title: 'Test Movie',
    posterPath: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    releaseDate: '2023-01-01',
    voteAverage: 7.5,
    overview: 'This is a test movie description',
    mediaType: 'movie' as const,
  };

  it('renders movie card with correct title', () => {
    render(<MovieCard {...defaultProps} />);
    
    // The title is displayed
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('renders movie card with correct rating', () => {
    render(<MovieCard {...defaultProps} />);
    
    // Check if rating is displayed
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('renders movie card with correct media type chip', () => {
    render(<MovieCard {...defaultProps} />);
    
    // Check if media type chip is displayed
    expect(screen.getByText('Movie')).toBeInTheDocument();
  });

  it('renders TV show with correct media type chip', () => {
    render(<MovieCard {...defaultProps} mediaType="tv" />);
    
    // Check if media type chip is displayed as TV
    expect(screen.getByText('TV')).toBeInTheDocument();
  });

  it('renders movie card with correct release year', () => {
    render(<MovieCard {...defaultProps} />);
    
    // Check if release year is displayed
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('renders movie card with correct image', () => {
    render(<MovieCard {...defaultProps} />);
    
    // Check if image is displayed with correct src
    const image = screen.getByAltText('Test Movie');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/test-poster.jpg');
  });

  it('renders movie card with backdrop image when in landscape mode', () => {
    render(<MovieCard {...defaultProps} isLandscape={true} />);
    
    // Check if backdrop image is used instead of poster
    const image = screen.getByAltText('Test Movie');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/test-backdrop.jpg');
  });

  it('renders movie card with correct link', () => {
    render(<MovieCard {...defaultProps} />);
    
    // Check if link has correct href
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/123');
  });

  it('renders movie card with overview text', () => {
    render(<MovieCard {...defaultProps} />);
    
    // Check if overview is displayed
    expect(screen.getByText('This is a test movie description')).toBeInTheDocument();
  });

  it('renders movie card with Play and More Info buttons', () => {
    render(<MovieCard {...defaultProps} />);
    
    // Check if buttons are displayed
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByText('More Info')).toBeInTheDocument();
  });
});
