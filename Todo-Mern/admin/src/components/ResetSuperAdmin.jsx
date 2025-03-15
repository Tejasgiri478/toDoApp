import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Snackbar, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:8000/api';

const ResetSuperAdmin = () => {
  // Form state
  const [formData, setFormData] = useState({
    secretKey: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  // Reset super admin password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New password and confirm password do not match',
        severity: 'error'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_URL}/admin/reset-superadmin`,
        {
          secretKey: formData.secretKey,
          newPassword: formData.newPassword
        }
      );
      
      // Reset form
      setFormData({
        secretKey: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSnackbar({
        open: true,
        message: response.data.message || 'Super admin password reset successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error resetting super admin password:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to reset super admin password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{ backgroundColor: '#f5f5f5' }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 500,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reset Super Admin Password
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph align="center">
          This page allows you to reset the super admin password using the secret key.
          Please use this feature only if you have forgotten the super admin password.
        </Typography>
        
        <form onSubmit={handleResetPassword}>
          <TextField
            fullWidth
            label="Secret Key"
            name="secretKey"
            type="password"
            value={formData.secretKey}
            onChange={handleInputChange}
            margin="normal"
            required
            autoComplete="off"
          />
          
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleInputChange}
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
            value={formData.confirmPassword}
            onChange={handleInputChange}
            margin="normal"
            required
            error={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''}
            helperText={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
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
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            href="/login"
          >
            Back to Login
          </Button>
        </form>
      </Paper>
      
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
    </Box>
  );
};

export default ResetSuperAdmin; 