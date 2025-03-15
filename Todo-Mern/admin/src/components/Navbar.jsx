import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Dashboard, People, Task, Logout, Settings } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminName, setAdminName] = useState(() => {
    const admin = JSON.parse(localStorage.getItem('adminInfo'));
    return admin ? admin.name : 'Admin';
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear admin data from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager Admin
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/dashboard"
            startIcon={<Dashboard />}
          >
            Dashboard
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/users"
            startIcon={<People />}
          >
            Users
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/tasks"
            startIcon={<Task />}
          >
            Tasks
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/settings"
            startIcon={<Settings />}
          >
            Settings
          </Button>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                Signed in as <strong>{adminName}</strong>
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <Settings fontSize="small" sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 