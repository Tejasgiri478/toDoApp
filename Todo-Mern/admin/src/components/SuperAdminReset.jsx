import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const SuperAdminReset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    secretKey: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.secretKey || !formData.newPassword || !formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        text: 'Please fill in all fields',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords Do Not Match',
        text: 'New password and confirmation password do not match',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    setLoading(true);
    
    // Show loading indicator
    Swal.fire({
      title: 'Resetting Super Admin...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      await axios.post('http://localhost:8000/api/admin/reset-superadmin', {
        email: formData.email,
        secretKey: formData.secretKey,
        newPassword: formData.newPassword
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Super Admin password has been reset successfully',
        confirmButtonText: 'Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } catch (error) {
      console.error('Error resetting super admin:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Error resetting Super Admin',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <AdminPanelSettingsIcon className="text-primary mx-auto h-12 w-12" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Super Admin Reset</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email, secret key, and new password to reset the Super Admin account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email Address"
              />
            </div>
            <div>
              <label htmlFor="secretKey" className="sr-only">Secret Key</label>
              <input
                id="secretKey"
                name="secretKey"
                type="password"
                required
                value={formData.secretKey}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Secret Key"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="sr-only">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="New Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockResetIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {loading ? 'Processing...' : 'Reset'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium text-primary hover:text-blue-700"
            >
              Back to Login Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminReset; 