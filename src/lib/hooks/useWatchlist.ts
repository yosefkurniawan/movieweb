import { useState, useEffect } from 'react';
import { Movie, TVShow } from '@/lib/api/tmdb';

// Define a type for watchlist items that can be either movies or TV shows
export type WatchlistItem = {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: 'movie' | 'tv';
  addedAt: number; // timestamp
  overview: string;
  releaseDate?: string;
  voteAverage: number;
};

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const loadWatchlist = () => {
      try {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }
        
        setIsLoggedIn(true);
        
        // Get user ID from localStorage
        const userData = JSON.parse(currentUser);
        const userId = userData.id;
        
        // Get watchlist for this user
        const storedWatchlist = localStorage.getItem(`watchlist_${userId}`);
        if (storedWatchlist) {
          setWatchlist(JSON.parse(storedWatchlist));
        }
      } catch (error) {
        console.error('Error loading watchlist from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoggedIn || isLoading) return;
    
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return;
      
      const userData = JSON.parse(currentUser);
      const userId = userData.id;
      
      localStorage.setItem(`watchlist_${userId}`, JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error saving watchlist to localStorage:', error);
    }
  }, [watchlist, isLoggedIn, isLoading]);

  // Add item to watchlist
  const addToWatchlist = (item: Movie | TVShow, mediaType: 'movie' | 'tv') => {
    if (!isLoggedIn) return false;
    
    // Convert the item to a WatchlistItem
    const watchlistItem: WatchlistItem = {
      id: item.id,
      title: 'title' in item ? item.title : (item as TVShow).name,
      posterPath: item.poster_path,
      mediaType,
      addedAt: Date.now(),
      overview: item.overview,
      releaseDate: 'release_date' in item ? item.release_date : (item as TVShow).first_air_date,
      voteAverage: item.vote_average
    };
    
    // Check if item already exists in watchlist
    if (watchlist.some(existingItem => existingItem.id === item.id && existingItem.mediaType === mediaType)) {
      return false; // Item already in watchlist
    }
    
    setWatchlist(prev => [...prev, watchlistItem]);
    return true;
  };

  // Remove item from watchlist
  const removeFromWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
    if (!isLoggedIn) return false;
    
    setWatchlist(prev => prev.filter(item => !(item.id === id && item.mediaType === mediaType)));
    return true;
  };

  // Check if an item is in the watchlist
  const isInWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
    return watchlist.some(item => item.id === id && item.mediaType === mediaType);
  };

  // Clear the entire watchlist
  const clearWatchlist = () => {
    if (!isLoggedIn) return false;
    
    setWatchlist([]);
    return true;
  };

  return {
    watchlist,
    isLoading,
    isLoggedIn,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist
  };
};
