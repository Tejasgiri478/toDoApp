import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Show loading indicator
        Swal.fire({
          title: 'users loading...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUsers(response.data);
        setLoading(false);
        Swal.close();
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
        setLoading(false);
        
        Swal.fire({
          icon: 'error',
          title: 'error!',
          text: 'error loading users',
          confirmButtonText: 'ok'
        });
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = () => {
    // Reset form data
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: ''
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: 'are you sure?',
      text: 'this user cannot be restored after deletion!',
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
            title: 'user is being deleted...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          const token = localStorage.getItem('adminToken');
          
          if (!token) {
            throw new Error('Authentication token not found');
          }
          
          await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Update users list
          setUsers(users.filter(user => user._id !== userId));
          
          Swal.fire({
            icon: 'success',
            title: 'deleted!',
            text: 'user deleted successfully',
            confirmButtonText: 'ok'
          });
        } catch (error) {
          console.error('Error deleting user:', error);
          
          Swal.fire({
            icon: 'error',
            title: 'error!',
            text: 'error deleting user',
            confirmButtonText: 'ok'
          });
        }
      }
    });
  };

  const submitAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'incomplete form',
        text: 'please fill all required fields',
        confirmButtonText: 'ok'
      });
      return;
    }
    
    try {
      // Show loading indicator
      Swal.fire({
        title: 'adding user...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post('http://localhost:8000/api/admin/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Add new user to the list
      setUsers([...users, response.data]);
      setShowAddModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'success!',
        text: 'user added successfully',
        confirmButtonText: 'ok'
      });
    } catch (error) {
      console.error('Error adding user:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'error!',
        text: error.response?.data?.message || 'error adding user',
        confirmButtonText: 'ok'
      });
    }
  };

  const submitEditUser = async () => {
    if (!formData.name || !formData.email) {
      Swal.fire({
        icon: 'error',
        title: 'incomplete form',
        text: 'please fill name and email fields',
        confirmButtonText: 'ok'
      });
      return;
    }
    
    try {
      // Show loading indicator
      Swal.fire({
        title: 'updating user...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.put(`http://localhost:8000/api/admin/users/${currentUser._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update user in the list
      setUsers(users.map(user => {
        if (user._id === currentUser._id) {
          return response.data;
        }
        return user;
      }));
      
      setShowEditModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'success!',
        text: 'user updated successfully',
        confirmButtonText: 'ok'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'error!',
        text: error.response?.data?.message || 'error updating user',
        confirmButtonText: 'ok'
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && users.length === 0) {
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
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={handleAddUser}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <PersonAddIcon className="mr-2" />
          Add User
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
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
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={submitAddUser}
                className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password (Leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={submitEditUser}
                className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 