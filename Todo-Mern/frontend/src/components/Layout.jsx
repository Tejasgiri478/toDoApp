import React from 'react';
import TaskIndicator from './TaskIndicator';
import CreateTask from './createTask/CreateTask';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div>
            <div className='flex flex-col md:flex-row md:justify-between'>
                <CreateTask />
                <div className='task-container w-auto mx-5 md:w-1/3 mt-3'>
                    <div className='indicator mb-4'>
                        <TaskIndicator />
                    </div>
                    <div className='outlet bg-white rounded-lg shadow-md p-3'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;