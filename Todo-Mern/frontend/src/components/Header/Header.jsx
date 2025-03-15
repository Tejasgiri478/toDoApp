import React from 'react';
import { useContext } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import TokenContext from '../../context/TokenContext.js';
import "./header.css"
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function Header() {
    const token = localStorage.getItem("authToken");
    const { user } = useContext(TokenContext);
    const navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    }

    const handleLogoClick = () => {
        if (token) {
            // If user is logged in, toggle to add task screen
            const currentShowTaskList = localStorage.getItem('showTaskList');
            localStorage.setItem('showTaskList', 'false');
            navigate('/');
        } else {
            // If user is not logged in, go to login screen
            navigate('/login');
        }
    }

    return (
        <div>
            <nav className='header bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex justify-between items-center relative overflow-hidden'>
                {/* Background animation element */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-70 animate-pulse"></div>
                
                <div 
                    className="logo w-1/4 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 z-10"
                    onClick={handleLogoClick}
                >
                    <div className="flex items-center justify-center py-3 px-4">
                        <div className="mr-2 text-white text-2xl">
                            <TaskAltIcon className="inline-block mr-2 text-yellow-300" fontSize="large" />
                            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
                                TaskMaster
                            </span>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between z-10'>
                    {
                        token ? (
                            <div className='flex items-center justify-center'>
                                <p className='mr-5 text-white'>Welcome, <span className='text-xl text-yellow-300 capitalize font-semibold'>{user?.name || 'User'}</span></p>
                                <button onClick={logout} className="logout mr-4 px-4 py-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <ul className='flex justify-end gap-3 w-3/4 pr-6'>
                                <li>
                                    <NavLink 
                                        to="/login"
                                        className={({isActive}) => 
                                            isActive 
                                                ? "block py-2 px-4 text-yellow-300 font-medium" 
                                                : "block py-2 px-4 text-white hover:text-yellow-300 transition-colors"
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink 
                                        to="/register"
                                        className={({isActive}) => 
                                            isActive 
                                                ? "block py-2 px-4 text-yellow-300 font-medium" 
                                                : "block py-2 px-4 text-white hover:text-yellow-300 transition-colors"
                                        }
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </ul>
                        )
                    }
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default Header;