import React from 'react';
import { NavLink } from 'react-router-dom';

function TaskIndicator() {
    return ( 
        <div className='flex-grow mt-4 mb-6'>
            <nav>
                <ul className='flex flex-wrap gap-2 sm:gap-3 justify-between p-3 bg-slate-400 rounded-lg shadow-lg'>
                    <li className='w-full sm:w-auto text-center'>
                        <NavLink 
                            to="/" 
                            className={({isActive}) => 
                                isActive 
                                    ? "block w-full px-4 py-2 bg-blue-600 text-white rounded-md" 
                                    : "block w-full px-4 py-2 hover:bg-slate-300 rounded-md transition-colors"
                            }
                            end
                        >
                            All Tasks
                        </NavLink>
                    </li>
                    <li className='w-full sm:w-auto text-center'>
                        <NavLink 
                            to="/active" 
                            className={({isActive}) => 
                                isActive 
                                    ? "block w-full px-4 py-2 bg-blue-600 text-white rounded-md" 
                                    : "block w-full px-4 py-2 hover:bg-slate-300 rounded-md transition-colors"
                            }
                        >
                            Active
                        </NavLink>
                    </li>
                    <li className='w-full sm:w-auto text-center'>
                        <NavLink 
                            to="/completed" 
                            className={({isActive}) => 
                                isActive 
                                    ? "block w-full px-4 py-2 bg-blue-600 text-white rounded-md" 
                                    : "block w-full px-4 py-2 hover:bg-slate-300 rounded-md transition-colors"
                            }
                        >
                            Completed
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
     );
}

export default TaskIndicator;