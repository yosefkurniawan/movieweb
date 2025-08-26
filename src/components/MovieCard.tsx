'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { getImageUrl } from '@/lib/api/tmdb';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoviePlaceholder from './MoviePlaceholder';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.02)',
    '& .card-content-hidden': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

const RatingBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  zIndex: 2,
}));

const MediaTypeChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  left: 10,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '0.7rem',
  zIndex: 2,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  opacity: 0,
  transform: 'translateY(100%)',
  transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
  '& .MuiTypography-root': {
    color: theme.palette.common.white,
  },
  '& .MuiTypography-colorTextSecondary': {
    color: 'rgba(255, 255, 255, 0.7)',
  }
}));

export interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  backdrop_path: string | null;
  releaseDate?: string;
  voteAverage?: number;
  overview?: string;
  mediaType: 'movie' | 'tv';
  isLandscape?: boolean;
}

export default function MovieCard({ 
  id, 
  title, 
  posterPath, 
  backdrop_path,
  releaseDate, 
  voteAverage = 0,
  overview,
  mediaType,
  isLandscape = false,
}: MovieCardProps) {
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const linkHref = `/${mediaType}/${id}`;
  const mediaTypeLabel = mediaType === 'movie' ? 'Movie' : 'TV';
  
  return (
    <Link href={linkHref} passHref style={{ textDecoration: 'none' }}>
      <StyledCard>
        <Box sx={{ position: 'relative' }}>
          {((!isLandscape && posterPath) || (isLandscape && backdrop_path)) ? (
            <CardMedia
              component="img"
              sx={{ height: { xs: !isLandscape ? 350 : 250, md: !isLandscape ? 400 : 300 } }}
              image={!isLandscape ? getImageUrl(posterPath!) : getImageUrl(backdrop_path!)}
              alt={title}
            />
          ) : (
            <Box sx={{ height: { xs: !isLandscape ? 350 : 250, md: !isLandscape ? 400 : 300 } }}>
              <MoviePlaceholder isLandscape={isLandscape} mediaType={mediaType} />
            </Box>
          )}
          {voteAverage > 0 && (
            <RatingBadge sx={{ color: voteAverage > 8 ? 'success.main' : voteAverage > 6 ? 'warning.main' : '#fff' }}>
              {voteAverage.toFixed(1)}
            </RatingBadge>
          )}
          <MediaTypeChip 
            label={mediaTypeLabel}
            size="small"
          />
          {isLandscape && (
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
            }}>
              <Typography gutterBottom variant="h5" component="h3" noWrap fontWeight="bold" color="#fff" px={2} py={1}>
                {title}
              </Typography>
            </Box>
          )}
          <StyledCardContent className="card-content-hidden">
            <Typography gutterBottom variant="subtitle1" component="h3" noWrap fontWeight="bold">
              {title}
            </Typography>
            {releaseYear && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }} mb={0.5}>
                {releaseYear}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{
              display: "-webkit-box",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 6,
              maxWidth: 300,
              fontSize: '0.8rem'
            }}>
              {overview}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                size="small" 
                startIcon={<PlayArrowIcon />}
                sx={{ fontSize: '0.8rem' }}
              >
                Play
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="small" 
                startIcon={<InfoOutlinedIcon />}
                sx={{ fontSize: '0.8rem' }}
              >
                More Info
              </Button>
            </Box>
          </StyledCardContent>
        </Box>
      </StyledCard>
    </Link>
  );
}
