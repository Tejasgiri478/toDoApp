import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  IconButton, Snackbar, Alert, CircularProgress, MenuItem, Select, FormControl, InputLabel, Chip
} from '@mui/material';
import { Edit, Delete, Add, CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:8000/api';

// Task categories
const TASK_CATEGORIES = ['personal', 'work', 'shopping', 'others'];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    userId: '',
    completed: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch tasks and users on component mount
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.get(`${API_URL}/admin/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching users:', error);
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

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Open dialog for creating a new task
  const handleOpenCreateDialog = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      userId: users.length > 0 ? users[0]._id : '',
      completed: false
    });
    setOpenDialog(true);
  };

  // Open dialog for editing a task
  const handleOpenEditDialog = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category || 'others',
      userId: task.userId?._id || task.userId,
      completed: task.completed
    });
    setOpenDialog(true);
  };

  // Open dialog for deleting a task
  const handleOpenDeleteDialog = (task) => {
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };

  // Close dialogs
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
  };

  // Create or update a task
  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      let response;
      
      if (selectedTask) {
        // Update existing task
        response = await axios.put(
          `${API_URL}/admin/tasks/${selectedTask._id}`,
          formData,
          { headers }
        );
        
        setSnackbar({
          open: true,
          message: 'Task updated successfully',
          severity: 'success'
        });
      } else {
        // Create new task
        response = await axios.post(
          `${API_URL}/admin/tasks`,
          formData,
          { headers }
        );
        
        setSnackbar({
          open: true,
          message: 'Task created successfully',
          severity: 'success'
        });
      }
      
      // Close dialog and refresh task list
      handleCloseDialog();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save task',
        severity: 'error'
      });
    }
  };

  // Delete a task
  const handleDeleteTask = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token || !selectedTask) {
        throw new Error('Authentication token or task not found');
      }
      
      await axios.delete(`${API_URL}/admin/tasks/${selectedTask._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
      
      // Close dialog and refresh task list
      handleCloseDialog();
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete task',
        severity: 'error'
      });
    }
  };

  // Toggle task completion status
  const handleToggleStatus = async (task) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      await axios.patch(
        `${API_URL}/admin/tasks/${task._id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSnackbar({
        open: true,
        message: `Task marked as ${task.completed ? 'pending' : 'completed'}`,
        severity: 'success'
      });
      
      // Refresh task list
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update task status',
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

  // Get user name by ID
  const getUserName = (userId) => {
    if (!userId) return 'Unknown';
    
    if (typeof userId === 'object' && userId.name) {
      return userId.name;
    }
    
    const user = users.find(user => user._id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks Management</h1>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Add Task
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
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={task.category || 'others'} 
                        color={
                          task.category === 'personal' ? 'primary' :
                          task.category === 'work' ? 'secondary' :
                          task.category === 'shopping' ? 'success' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{getUserName(task.userId)}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={task.completed ? <CheckCircle /> : <Cancel />}
                        label={task.completed ? 'Completed' : 'Pending'}
                        color={task.completed ? 'success' : 'warning'}
                        size="small"
                        onClick={() => handleToggleStatus(task)}
                      />
                    </TableCell>
                    <TableCell>{formatDate(task.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEditDialog(task)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(task)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleInputChange}
            >
              {TASK_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="user-label">User</InputLabel>
            <Select
              labelId="user-label"
              name="userId"
              value={formData.userId}
              label="User"
              onChange={handleInputChange}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="completed"
              value={formData.completed}
              label="Status"
              onChange={handleInputChange}
            >
              <MenuItem value={false}>Pending</MenuItem>
              <MenuItem value={true}>Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Task Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the task "{selectedTask?.title}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteTask} variant="contained" color="error">
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

export default Tasks; 