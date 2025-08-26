'use client';

import { Box, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';

interface MoviePlaceholderProps {
  isLandscape?: boolean;
  mediaType?: 'movie' | 'tv';
}

export default function MoviePlaceholder({ 
  isLandscape = false,
  mediaType = 'movie'
}: MoviePlaceholderProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        padding: 2,
        borderRadius: 1
      }}
    >
      {mediaType === 'movie' ? (
        <MovieIcon sx={{ fontSize: isLandscape ? 80 : 60, mb: 2 }} />
      ) : (
        <LiveTvIcon sx={{ fontSize: isLandscape ? 80 : 60, mb: 2 }} />
      )}
      
      <Typography variant="body1" align="center">
        {isLandscape ? 'No Backdrop Available' : 'No Poster Available'}
      </Typography>
    </Box>
  );
}
