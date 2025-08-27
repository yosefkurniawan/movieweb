# MovieWeb

## About

MovieWeb is a modern web application built with Next.js that allows users to browse, search, and manage their favorite movies and TV shows. The application provides a Netflix-like experience with a sleek dark UI, detailed information about movies and TV shows, and user authentication features.

## API

The application uses the TMDB API to fetch movie and TV show data. The API key is stored in the environment variables.
[Documentation](https://developer.themoviedb.org/reference/intro/getting-started)

## Features

### Movie & TV Show Browsing
- Featured movie showcase on homepage
- Browse popular movies and TV shows
- View detailed information about movies and TV shows
- Search functionality to find specific content

### User Authentication
- User registration with email validation
- Login with secure password handling
- User account management
- Logout functionality with confirmation
- No API integration for user data. For simulation, user data stored in localStorage for persistent sessions

### Watchlist Management
- Add movies and TV shows to personal watchlist
- Remove items from watchlist
- View all watchlisted items in account page
- Clear entire watchlist with one click
- No API integration for watchlist data. For simulation, watchlist data stored in localStorage for persistence across sessions

### UI/UX
- Responsive design for all screen sizes
- Netflix-inspired dark theme
- Material UI components for a modern look and feel

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **UI Library**: Material UI
- **Data Fetching**: React Query (Tanstack Query)
- **Authentication**: Client-side with localStorage
- **Testing**: Jest, React Testing Library
- **Form Validation**: Formik, Yup

## Getting Started

### Prerequisites

- Node.js (v22 or later)
- Yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yosefkurniawan/movieweb.git
   cd movieweb
   ```

2. Install dependencies
   ```bash
   yarn install
   ```

3. Set environment variables
   ```bash
   NEXT_PUBLIC_TMDB_API_KEY==eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MzA5YTY0ODAxYzgzMTM4Y2VhYmQzZGU3NjYyZGVmNiIsIm5iZiI6MTc1NjEyNjMwMi45NzUwMDAxLCJzdWIiOiI2OGFjNWM1ZWM5ODU2ZDExMmE5ZGI0NWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9IoHI170Sy-lJIeF3b6dERKq-MW2HMwGbQ0PC4Da31A
   ```
   For local, put the API key in the .env.local file.

4. Run the development server
   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

To run in production mode, use

```bash
yarn build
yarn start
```

## Testing

The project includes comprehensive unit tests for components and functionality.

### Running All Tests

```bash
yarn test
```

### Running Specific Test Suites

```bash
# Run authentication-related tests only
yarn test:auth

# Run login tests only
yarn test:login

# Run register tests only
yarn test:register

# Run account/logout tests only
yarn test:account
```

### Test Coverage

To generate a test coverage report:

```bash
yarn test --coverage
```

## Project Structure

```
/src
  /app             # Next.js App Router pages
  /components      # Reusable React components
  /lib
    /api           # API integration and data fetching
    /hooks         # Custom React hooks
    /providers     # Context providers
  /types           # TypeScript type definitions
  /public          # Static assets
```
