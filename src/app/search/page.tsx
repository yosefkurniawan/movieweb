import React, { Suspense } from 'react';
import { Container, CircularProgress } from '@mui/material';

import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    }>
      <SearchClient />
    </Suspense>
  );
}
