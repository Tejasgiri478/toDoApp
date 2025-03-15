import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <NotificationsIcon />
            <span className="absolute top-0 right-0 h-4 w-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-2">
            <AccountCircleIcon className="text-gray-600" />
            <span className="font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 