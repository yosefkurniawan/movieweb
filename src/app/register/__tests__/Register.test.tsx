import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import RegisterPage from '../page';
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

describe('RegisterPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders register form correctly', async () => {
    await act(async () => {
      render(<RegisterPage />);
    });
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
    expect(screen.getByLabelText(/^gender$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    await act(async () => {
      render(<RegisterPage />);
    });
    
    // Submit form without filling required fields
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);
    });
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please select your gender/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    await act(async () => {
      render(<RegisterPage />);
    });
    
    // Fill in invalid email
    await act(async () => {
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    });
    
    // Submit form
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);
    });
    
    // Check email validation error
    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  test('validates password length', async () => {
    await act(async () => {
      render(<RegisterPage />);
    });
    
    // Fill in short password
    await act(async () => {
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: '123' } });
    });
    
    // Submit form
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);
    });
    
    // Check password validation error
    await waitFor(() => {
      expect(screen.getByText(/password should be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test('registers user successfully', async () => {
    await act(async () => {
      render(<RegisterPage />);
    });
    
    // Fill in form
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Yosef' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'yosef.test@gmail.com' } });
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });
    
    // Select gender
    await act(async () => {
      const genderSelect = screen.getByLabelText(/^gender$/i);
      fireEvent.mouseDown(genderSelect);
    });
    
    await act(async () => {
      const maleOption = screen.getByText('Male');
      fireEvent.click(maleOption);
    });
    
    // Submit form
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);
    });
    
    // Check if user is registered in localStorage
    await waitFor(() => {
      const users = JSON.parse(window.localStorage.getItem('users') || '[]');
      expect(users.length).toBe(1);
      expect(users[0].firstName).toBe('Yosef');
      expect(users[0].lastName).toBe('Test');
      expect(users[0].email).toBe('yosef.test@gmail.com');
      expect(users[0].gender).toBe('male');
      
      // Check if current user is set
      const currentUser = JSON.parse(window.localStorage.getItem('currentUser') || '{}');
      expect(currentUser.firstName).toBe('Yosef');
      expect(currentUser.email).toBe('yosef.test@gmail.com');
    });
    
    // Check success message
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    
    // Check redirection
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(window.location.href).toBe('/account');
  });

  test('shows error when email already exists', async () => {
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
      render(<RegisterPage />);
    });
    
    // Fill in form with existing email
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Yosef' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'yosef.test@gmail.com' } });
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });
    
    // Select gender
    await act(async () => {
      const genderSelect = screen.getByLabelText(/^gender$/i);
      fireEvent.mouseDown(genderSelect);
    });
    
    await act(async () => {
      const maleOption = screen.getByText('Male');
      fireEvent.click(maleOption);
    });
    
    // Submit form
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);
    });
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/this email is already registered/i)).toBeInTheDocument();
    });
    
    // Verify no new user was added
    const users = JSON.parse(window.localStorage.getItem('users') || '[]');
    expect(users.length).toBe(1);
  });
});
