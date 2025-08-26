'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  return (
    <Box
      component="main"
      sx={{
        paddingTop: isHomePage ? 0 : '64px', // Add padding only for non-home pages
        minHeight: 'calc(100vh - 64px)'
      }}
    >
      {children}
    </Box>
  );
}
