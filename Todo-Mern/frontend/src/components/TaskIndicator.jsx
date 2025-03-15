import React from 'react';
import { NavLink } from 'react-router-dom';

function TaskIndicator() {
    return ( 
        <div className='flex-grow'>
            <nav>
                <ul className='flex gap-3 justify-between p-3 bg-slate-400 rounded-lg shadow-2xl'>
                    <li className='flex-1 text-center'>
                        <NavLink to="/">All Task</NavLink>
                    </li>
                    <li className='flex-1 text-center'>
                        <NavLink to="/active">Active</NavLink>
                    </li>
                    <li className='flex-1 text-center'>
                        <NavLink to="/completed">Completed</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
     );
}

export default TaskIndicator;