import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoginPage from '../page';
import '@testing-library/jest-dom';

// Mock window.location.href
Object.defineProperty(window, 'location', {
  value: {
    href: jest.fn(),
  },
  writable: true,
});

// Mock setTimeout
jest.useFakeTimers();

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  test('validates form inputs', async () => {
    await act(async () => {
      render(<LoginPage />);
    });
    
    // Submit form without filling required fields
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);
    });
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    await act(async () => {
      render(<LoginPage />);
    });
    
    // Fill in invalid email
    await act(async () => {
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    });
    
    // Fill in password
    await act(async () => {
      const passwordInput = screen.getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });
    
    // Submit form
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);
    });
    
    // Check email validation error
    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  test('shows error for invalid credentials', async () => {
    // Pre-populate localStorage with a user
    const existingUser = {
      id: '123',
      firstName: 'Yosef',
      lastName: 'Test',
      email: 'yosef.test@gmail.com',
      password: 'password123',
      gender: 'male',
      createdAt: new Date().toISOString()
    };
    window.localStorage.setItem('users', JSON.stringify([existingUser]));
    
    await act(async () => {
      render(<LoginPage />);
    });
    
    // Fill in form with wrong password
    await act(async () => {
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'yosef.test@gmail.com' } });
      
      const passwordInput = screen.getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    });
    
    // Submit form
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);
    });
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
    
    // Verify no user is logged in
    expect(window.localStorage.getItem('currentUser')).toBeNull();
  });

  test('logs in user successfully', async () => {
    // Pre-populate localStorage with a user
    const existingUser = {
      id: '123',
      firstName: 'Yosef',
      lastName: 'Test',
      email: 'yosef.test@gmail.com',
      password: 'password123',
      gender: 'male',
      createdAt: new Date().toISOString()
    };
    window.localStorage.setItem('users', JSON.stringify([existingUser]));
    
    await act(async () => {
      render(<LoginPage />);
    });
    
    // Fill in form with correct credentials
    await act(async () => {
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'yosef.test@gmail.com' } });
      
      const passwordInput = screen.getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });
    
    // Submit form
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);
    });
    
    // Check success message
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
    
    // Check if user is logged in
    const currentUser = JSON.parse(window.localStorage.getItem('currentUser') || '{}');
    expect(currentUser.email).toBe('yosef.test@gmail.com');
    
    // Check redirection
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(window.location.href).toBe('/account');
  });
});
