import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Divider, 
  Snackbar, 
  Alert, 
  CircularProgress,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// API base URL
const API_URL = 'http://localhost:8000/api';

const Settings = () => {
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: ''
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);
  
  // Fetch admin profile from API
  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.get(`${API_URL}/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProfile({
        name: response.data.name,
        email: response.data.email
      });
      
      setError('');
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to load admin profile');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Update admin profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setProfileLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      await axios.put(
        `${API_URL}/admin/profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update admin info in localStorage
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      if (adminInfo) {
        adminInfo.name = profile.name;
        adminInfo.email = profile.email;
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
      }
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setProfileLoading(false);
    }
  };
  
  // Change admin password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New password and confirm password do not match',
        severity: 'error'
      });
      return;
    }
    
    try {
      setPasswordLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      await axios.put(
        `${API_URL}/admin/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSnackbar({
        open: true,
        message: 'Password changed successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to change password',
        severity: 'error'
      });
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = (field) => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  return (
    <div className="p-6">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Profile Settings */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} className="p-6">
              <Typography variant="h6" component="h2" gutterBottom>
                Profile Settings
              </Typography>
              <Divider className="mb-4" />
              
              <form onSubmit={handleUpdateProfile}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  margin="normal"
                  required
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </form>
            </Paper>
          </Grid>
          
          {/* Password Settings */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} className="p-6">
              <Typography variant="h6" component="h2" gutterBottom>
                Change Password
              </Typography>
              <Divider className="mb-4" />
              
              <form onSubmit={handleChangePassword}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                  error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                  helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Settings; 