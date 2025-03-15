import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaListUl, FaSpinner, FaCheckCircle } from 'react-icons/fa';

function TaskIndicator() {
    return ( 
        <div className='flex-grow'>
            <nav>
                <ul className='flex gap-3 justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg'>
                    <li className='flex-1'>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `flex flex-col items-center py-2 px-3 rounded-md transition-all ${
                                    isActive 
                                        ? 'bg-white text-blue-700 shadow-md transform scale-105' 
                                        : 'text-white hover:bg-blue-400'
                                }`
                            }
                        >
                            <FaListUl className="mb-1" />
                            <span>All Tasks</span>
                        </NavLink>
                    </li>
                    <li className='flex-1'>
                        <NavLink 
                            to="/active" 
                            className={({ isActive }) => 
                                `flex flex-col items-center py-2 px-3 rounded-md transition-all ${
                                    isActive 
                                        ? 'bg-white text-blue-700 shadow-md transform scale-105' 
                                        : 'text-white hover:bg-blue-400'
                                }`
                            }
                        >
                            <FaSpinner className="mb-1" />
                            <span>Active</span>
                        </NavLink>
                    </li>
                    <li className='flex-1'>
                        <NavLink 
                            to="/completed" 
                            className={({ isActive }) => 
                                `flex flex-col items-center py-2 px-3 rounded-md transition-all ${
                                    isActive 
                                        ? 'bg-white text-blue-700 shadow-md transform scale-105' 
                                        : 'text-white hover:bg-blue-400'
                                }`
                            }
                        >
                            <FaCheckCircle className="mb-1" />
                            <span>Completed</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
     );
}

export default TaskIndicator;