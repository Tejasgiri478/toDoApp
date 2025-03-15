import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  IconButton, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:8000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open dialog for creating a new user
  const handleOpenCreateDialog = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setOpenDialog(true);
  };

  // Open dialog for editing a user
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '' // Don't populate password for security reasons
    });
    setOpenDialog(true);
  };

  // Open dialog for deleting a user
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  // Close dialogs
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
  };

  // Create or update a user
  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      let response;
      
      if (selectedUser) {
        // Update existing user
        response = await axios.put(
          `${API_URL}/admin/users/${selectedUser._id}`,
          formData,
          { headers }
        );
        
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      } else {
        // Create new user
        response = await axios.post(
          `${API_URL}/admin/users`,
          formData,
          { headers }
        );
        
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success'
        });
      }
      
      // Close dialog and refresh user list
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save user',
        severity: 'error'
      });
    }
  };

  // Delete a user
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token || !selectedUser) {
        throw new Error('Authentication token or user not found');
      }
      
      await axios.delete(`${API_URL}/admin/users/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      
      // Close dialog and refresh user list
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete user',
        severity: 'error'
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Add User
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEditDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(user)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="password"
            label={selectedUser ? "New Password (leave blank to keep current)" : "Password"}
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            required={!selectedUser}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default Users; 