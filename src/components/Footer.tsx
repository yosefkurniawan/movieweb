'use client';

import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';

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
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: { xs: 'start', md: 'center' }, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} MovieWeb | Developed by 
          </Typography>
          <Link href="https://yosefkurniawan.dev/" target="_blank" passHref >
            <Typography variant="body2" sx={{ 
              ml: 0.5, 
              color: '#fff',
              '&:hover': {
                color: '#E50914'
              }
            }}>Yosef Kurniawan</Typography>
        </Link>
        </Box>
      </Container>
    </Box>
  );
}
