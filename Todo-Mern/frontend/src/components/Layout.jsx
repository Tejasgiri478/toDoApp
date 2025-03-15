import React, { useState, useEffect } from 'react';
import TaskIndicator from './TaskIndicator';
import CreateTask from './createTask/CreateTask';
import { Outlet, useLocation } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

function Layout() {
    // Get the initial state from localStorage or default to false
    const [showTaskList, setShowTaskList] = useState(() => {
        const savedState = localStorage.getItem('showTaskList');
        // If we're on a task route, default to showing tasks
        const location = window.location.pathname;
        if (location === '/' || location === '/active' || location === '/completed') {
            return savedState !== null ? JSON.parse(savedState) : true;
        }
        return savedState !== null ? JSON.parse(savedState) : false;
    });

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('showTaskList', JSON.stringify(showTaskList));
    }, [showTaskList]);

    return (
        <div className="container mx-auto px-4 py-6">
            {!showTaskList ? (
                <div className="flex flex-col">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-700">Add Task</h1>
                        <button 
                            onClick={() => setShowTaskList(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                        >
                            <FaClipboardList />
                            <span>View Tasks</span>
                        </button>
                    </div>
                    <div className="w-full max-w-2xl mx-auto">
                        <CreateTask />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-700">Your Tasks</h1>
                        <button 
                            onClick={() => setShowTaskList(false)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-105"
                        >
                            <span>+ Add New Task</span>
                        </button>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <div className='indicator mb-4 w-full md:w-3/4 lg:w-1/2'>
                            <TaskIndicator />
                        </div>
                        <div className='outlet bg-white rounded-lg shadow-md p-5 w-full md:w-3/4 lg:w-1/2'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Layout;