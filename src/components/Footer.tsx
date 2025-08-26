'use client';

import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgb(20, 20, 20)',
        color: 'grey.500',
      }}
    >
      <Container maxWidth="lg">
        <Box>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Film Favorit
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
