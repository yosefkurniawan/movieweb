import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import AccountPage from '../page';
import '@testing-library/jest-dom';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock setTimeout
jest.useFakeTimers();

describe('AccountPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders account page with user data', async () => {
    // Set up a mock user in localStorage
    const mockUser = {
      id: '123',
      firstName: 'Yosef',
      lastName: 'Test',
      email: 'yosef.test@gmail.com',
      gender: 'male'
    };
    
    act(() => {
      window.localStorage.setItem('currentUser', JSON.stringify(mockUser));
    });
    
    await act(async () => {
      render(<AccountPage />);
    });
    
    // Wait for the component to load user data
    await waitFor(() => {
      expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument();
    });
    
    // Check if user data is displayed - use more specific queries to avoid multiple matches
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getAllByText(/yosef test/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/yosef\.test@gmail\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/male/i)).toBeInTheDocument();
    
    // Check if logout button is rendered
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('redirects to login if no user is logged in', async () => {
    // Clear localStorage to simulate no logged-in user
    act(() => {
      window.localStorage.clear();
    });
    
    await act(async () => {
      render(<AccountPage />);
    });
    
    // Check if router.push was called with '/login'
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('closes logout dialog when cancel button is clicked', async () => {
    // Set up a mock user in localStorage
    const mockUser = {
      id: '123',
      firstName: 'Yosef',
      lastName: 'Test',
      email: 'yosef.test@gmail.com',
      gender: 'male'
    };
    
    act(() => {
      window.localStorage.setItem('currentUser', JSON.stringify(mockUser));
    });
    
    await act(async () => {
      render(<AccountPage />);
    });
    
    // Wait for the component to load user data
    await waitFor(() => {
      expect(screen.queryByText(/loading\.\.\.$/i)).not.toBeInTheDocument();
    });
    
    // Open logout dialog
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    });
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText(/are you sure you want to log out of your account\?/i)).toBeInTheDocument();
    });
    
    // Click cancel button using id
    await act(async () => {
      const cancelButton = document.getElementById('cancel-logout-button');
      if (cancelButton) fireEvent.click(cancelButton);
    });
    
    // Wait for the dialog to close
    await waitFor(() => {
      expect(screen.queryByText(/are you sure you want to log out of your account\?/i)).not.toBeInTheDocument();
    });
    
    // Check if user is still logged in
    expect(window.localStorage.getItem('currentUser')).not.toBeNull();
  });

  test('logs out user when confirm button is clicked', async () => {
    // Set up a mock user in localStorage
    const mockUser = {
      id: '123',
      firstName: 'Yosef',
      lastName: 'Test',
      email: 'yosef.test@gmail.com',
      gender: 'male'
    };
    
    act(() => {
      window.localStorage.setItem('currentUser', JSON.stringify(mockUser));
    });
    
    await act(async () => {
      render(<AccountPage />);
    });
    
    // Wait for the component to load user data
    await waitFor(() => {
      expect(screen.queryByText(/loading\.\.\.$/i)).not.toBeInTheDocument();
    });
    
    // Open logout dialog
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    });
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText(/are you sure you want to log out of your account\?/i)).toBeInTheDocument();
    });
    
    // Find the logout button using id
    const logoutButton = document.getElementById('confirm-logout-button');
    
    // Click the logout button in the dialog
    await act(async () => {
      if (logoutButton) fireEvent.click(logoutButton);
    });
    
    // Wait for localStorage to be cleared by the component's confirmLogout function
    await waitFor(() => {
      expect(window.localStorage.getItem('currentUser')).toBeNull();
    }, { timeout: 3000 });
    
    // Check redirection after delay
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

});
