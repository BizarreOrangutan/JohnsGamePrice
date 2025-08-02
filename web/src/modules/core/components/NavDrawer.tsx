import { Box, Drawer, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import type { JSX } from '@emotion/react/jsx-runtime';

import ErrorBoundary from '../../error/ErrorBoundary';
import { routes } from '../utils/routes';

const NavDrawer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    if (typeof path == 'string') {
      navigate(path);
      setOpen(false);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navLinks: (JSX.Element | null)[] = Object.entries(routes).map(([path, element], index) => {
    if (path == '*') return null;
    return (
      <ErrorBoundary key={index} fallback="Error">
        <Box key={index} sx={{ display: { xs: 'none', md: 'flex', mr: 1000, padding: 10 } }}>
          {/* <Link key={index} to={path ?? "/"}>
                    {element.type.name}
                </Link> */}
          <Button key={index} variant="contained" onClick={() => handleLinkClick(path)} fullWidth>
            {element.type.name}
          </Button>
        </Box>
      </ErrorBoundary>
    );
  });

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  return (
    <div>
      <Button variant="text" color="inherit" onClick={toggleDrawer(true)} sx={{ p: 2 }}>
        <MenuIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Button
          variant="text"
          color="inherit"
          onClick={handleDrawerClose}
          sx={{ p: 3, borderRadius: 0 }}
        >
          <ArrowBackIosIcon />
        </Button>
        {navLinks}
      </Drawer>
    </div>
  );
};

export default NavDrawer;
