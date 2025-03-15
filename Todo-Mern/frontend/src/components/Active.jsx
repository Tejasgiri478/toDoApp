import React, { useContext } from 'react';
import Task from './Task/Task';
import TaskContext from '../context/TaskContext';
import { FaSpinner } from 'react-icons/fa';

function Active() {
    const { tasks } = useContext(TaskContext);
    const activeTasks = tasks.filter(task => !task.completed);

    return (
        <div>
            {
                activeTasks.length !== 0 ? (
                    activeTasks.slice().reverse().map((task, index) => (
                        <Task
                            key={index}
                            task={task}
                            id={index}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <FaSpinner className="text-5xl mb-4 text-blue-400" />
                        <h1 className="text-xl font-medium">No Active Tasks</h1>
                        <p className="mt-2 text-sm">All your tasks are completed!</p>
                    </div>
                )
            }
        </div>
    );
}

export default Active;
