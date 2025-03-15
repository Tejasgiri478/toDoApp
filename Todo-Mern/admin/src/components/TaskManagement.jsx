import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import FilterListIcon from '@mui/icons-material/FilterList';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    userId: ''
  });

  useEffect(() => {
    // Fetch tasks and users
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Show loading indicator
        Swal.fire({
          title: 'loading data...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Fetch tasks and users in parallel
        const [tasksResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/admin/tasks', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setTasks(tasksResponse.data);
        setUsers(usersResponse.data);
        setLoading(false);
        Swal.close();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
        
        Swal.fire({
          icon: 'error',
          title: 'error!',
          text: 'error loading data',
          confirmButtonText: 'ok'
        });
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTask = () => {
    // Reset form data
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      userId: users[0]?._id || ''
    });
    setShowAddModal(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      userId: task.userId
    });
    setShowEditModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: 'are you sure?',
      text: 'this task cannot be restored after deletion!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'yes, delete!',
      cancelButtonText: 'cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Show loading indicator
          Swal.fire({
            title: 'task is being deleted...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          const token = localStorage.getItem('adminToken');
          
          if (!token) {
            throw new Error('Authentication token not found');
          }
          
          await axios.delete(`http://localhost:8000/api/admin/tasks/${taskId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Update tasks list
          setTasks(tasks.filter(task => task._id !== taskId));
          
          Swal.fire({
            icon: 'success',
            title: 'deleted!',
            text: 'task deleted successfully',
            confirmButtonText: 'ok'
          });
        } catch (error) {
          console.error('Error deleting task:', error);
          
          Swal.fire({
            icon: 'error',
            title: 'error!',
            text: 'error deleting task',
            confirmButtonText: 'ok'
          });
        }
      }
    });
  };

  const handleToggleStatus = async (taskId) => {
    try {
      // Show loading indicator
      Swal.fire({
        title: 'updating status...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.patch(`http://localhost:8000/api/admin/tasks/${taskId}/toggle-status`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update task in the list
      setTasks(tasks.map(task => {
        if (task._id === taskId) {
          return response.data;
        }
        return task;
      }));
      
      Swal.fire({
        icon: 'success',
        title: 'updated!',
        text: 'task status updated successfully',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'error!',
        text: 'error updating task status',
        confirmButtonText: 'ok'
      });
    }
  };

  const submitAddTask = async () => {
    if (!formData.title || !formData.userId) {
      Swal.fire({
        icon: 'error',
        title: 'incomplete form',
        text: 'please fill title and assigned user',
        confirmButtonText: 'ok'
      });
      return;
    }
    
    try {
      // Show loading indicator
      Swal.fire({
        title: 'adding task...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post('http://localhost:8000/api/admin/tasks', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Add new task to the list
      setTasks([...tasks, response.data]);
      setShowAddModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'success!',
        text: 'task added successfully',
        confirmButtonText: 'ok'
      });
    } catch (error) {
      console.error('Error adding task:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'error!',
        text: error.response?.data?.message || 'error adding task',
        confirmButtonText: 'ok'
      });
    }
  };

  const submitEditTask = async () => {
    if (!formData.title || !formData.userId) {
      Swal.fire({
        icon: 'error',
        title: 'incomplete form',
        text: 'please fill title and assigned user',
        confirmButtonText: 'ok'
      });
      return;
    }
    
    try {
      // Show loading indicator
      Swal.fire({
        title: 'updating task...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.put(`http://localhost:8000/api/admin/tasks/${currentTask._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update task in the list
      setTasks(tasks.map(task => {
        if (task._id === currentTask._id) {
          return response.data;
        }
        return task;
      }));
      
      setShowEditModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'success!',
        text: 'task updated successfully',
        confirmButtonText: 'ok'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'error!',
        text: error.response?.data?.message || 'error updating task',
        confirmButtonText: 'ok'
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUserName = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.name : 'Unknown User';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FilterListIcon className="mr-2" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button 
            onClick={handleAddTask}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
          >
            <AddTaskIcon className="mr-2" />
            Add Task
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs">{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{task.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getUserName(task.userId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleStatus(task._id)}
                      className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.completed ? (
                        <>
                          <CheckCircleIcon className="mr-1" fontSize="small" />
                          Completed
                        </>
                      ) : (
                        <>
                          <PendingIcon className="mr-1" fontSize="small" />
                          Pending
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(task.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Assign To</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={submitAddTask}
                className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Assign To</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={submitEditTask}
                className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement; 