import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Users', icon: <PeopleIcon />, path: '/users' },
    { name: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Do you want to logout?',
      text: 'You will be logged out',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4a6ee0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading indicator
        Swal.fire({
          title: 'Logging out...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Clear localStorage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // Redirect to login page after a short delay to show the loading indicator
        setTimeout(() => {
          navigate('/login');
          
          // Show success message after redirect
          Swal.fire({
            icon: 'success',
            title: 'Logout Successful',
            text: 'You have been logged out successfully',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1000);
      }
    });
  };

  return (
    <div className={`bg-dark text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 rounded-md hover:bg-gray-700"
        >
          <MenuIcon />
        </button>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-3 ${
                  location.pathname === item.path ? 'bg-primary' : 'hover:bg-gray-700'
                } rounded-md mx-2 transition-colors`}
              >
                <span className="mr-4">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <button 
          onClick={handleLogout}
          className="flex items-center p-3 hover:bg-gray-700 rounded-md"
        >
          <span className="mr-4"><LogoutIcon /></span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 