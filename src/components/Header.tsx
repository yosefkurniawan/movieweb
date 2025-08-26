'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  InputBase, 
  IconButton, 
  Container, 
  Icon,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  ClickAwayListener
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { debounce } from '@/lib/utils/debounce';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '250px',
      '&:focus': {
        width: '300px',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const NavLink = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(3),
  color: 'white',
  cursor: 'pointer',
  '&:hover': {
    color: alpha(theme.palette.common.white, 0.7),
  },
}));
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    // Access localStorage only on the client side
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  // Create debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query && query.trim().length > 0) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }, 500),
    [router]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchClick = () => {
    if (isMobile) {
      setSearchActive(true);
    }
  };

  const handleSearchClose = () => {
    setSearchActive(false);
    setSearchQuery('');
  };
  
  // Clear search when navigating away from search page
  useEffect(() => {
    if (!pathname.includes('/search')) {
      setSearchQuery('');
    }
  }, [pathname]);

  const drawerContent = (
    <Box
      sx={{ width: 250, height: '100%', bgcolor: 'rgb(20, 20, 20)' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List>
        <Link href="/" passHref>
          <ListItem button>
            <ListItemText primary="Home" sx={{ color: 'white' }} />
          </ListItem>
        </Link>
        <Link href="/movies" passHref>
          <ListItem button>
            <ListItemText primary="Movies" sx={{ color: 'white' }} />
          </ListItem>
        </Link>
        <Link href="/tvshows" passHref>
          <ListItem button>
            <ListItemText primary="TV Shows" sx={{ color: 'white' }} />
          </ListItem>
        </Link>
      </List>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List>
        <ListItem>
          <Link href={userData ? '/account' : '/login'} passHref>
            <ListItemText primary={userData ? 'Account' : 'Login'} sx={{ color: 'white' }} />
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: isScrolled ? 'rgb(20, 20, 20)' : 'transparent',
          transition: 'background-color 0.3s ease',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
            {/* Left Section - Burger Menu (Mobile Only) */}
            {!searchActive ? (
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', width: { xs: '33%', sm: 'auto' } }}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : !searchActive && (
              <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '33%', sm: 'auto' } }} />
            )}
            
            {/* Center Section - Logo */}
            {!searchActive && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  width: { xs: '33%', md: 'auto' }
                }}
              >
                <Link href="/" passHref>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon 
                      sx={{ 
                        color: 'error.main', 
                        cursor: 'pointer',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '40px',
                        width: '40px',
                        display: 'flex',
                      }}
                    >
                      <LiveTvRoundedIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.6rem' }, marginTop: '-3px', color: 'primary.main' }}/>
                    </Icon>
                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold', 
                        fontSize: { xs: '1.2rem', sm: '1.6rem' },
                        cursor: 'pointer',
                        height: '40px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                      }}
                    >
                      Film Favorit
                    </Typography>
                  </Box>
                </Link>
              </Box>
            )}

            {/* Right Section - Navigation, Search, User */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                width: searchActive ? '100%' : { xs: '33%', sm: 'auto' },
                flexGrow: { xs: 0, sm: 1 },
                transition: 'width 0.3s ease',
                ml: { xs: 0, sm: 5 },
              }}
            >
              {/* Navigation Links (Desktop Only) */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Link href="/" passHref>
                  <NavLink variant="body1">Home</NavLink>
                </Link>
                <Link href="/movies" passHref>
                  <NavLink variant="body1">Movies</NavLink>
                </Link>
                <Link href="/tvshows" passHref>
                  <NavLink variant="body1">TV Shows</NavLink>
                </Link>
              </Box>

              {/* Search - Expandable on mobile */}
              <ClickAwayListener onClickAway={handleSearchClose}>
                <Box sx={{ position: 'relative' }} width={{ xs: searchActive ? '100%' : 'auto' }}>
                    <IconButton 
                      color="inherit" 
                      onClick={handleSearchClick}
                      sx={{ padding: 0, display: { xs: searchActive ? 'none' : 'flex', sm: 'none' } }}
                    >
                      <SearchIcon />
                    </IconButton>
                    <Search sx={{ mr: 1, width: searchActive ? '100%' : 'auto', display: { xs: searchActive ? 'flex' : 'none', sm: 'flex' } }}>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search movies, TV shows..."
                        inputProps={{ 'aria-label': 'search' }}
                        autoFocus={searchActive}
                        value={searchQuery || ''}
                        onChange={handleSearchChange}
                      />
                      <IconButton 
                        size="small" 
                        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                        onClick={handleSearchClose}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Search>
                </Box>
              </ClickAwayListener>

              {/* User - Hidden on small mobile and when search is active */}
              {!searchActive && (
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                  <Link href={userData ? '/account' : '/login'} passHref>
                    <IconButton size="large" aria-label="account of current user">
                      <AccountCircleOutlinedIcon sx={{ color: '#fff' }}/>
                    </IconButton>
                  </Link>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgb(20, 20, 20)',
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
