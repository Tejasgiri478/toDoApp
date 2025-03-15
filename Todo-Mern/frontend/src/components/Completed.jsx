import React, { useContext } from "react";
import Task from './Task/Task';
import TaskContext from "../context/TaskContext";
import { FaCheckCircle } from 'react-icons/fa';

function Completed() {
    const { tasks } = useContext(TaskContext);
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div>
            {
                completedTasks.length !== 0 ? (
                    completedTasks.slice().reverse().map((task, index) => (
                        <Task
                            key={index}
                            task={task}
                            id={index}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <FaCheckCircle className="text-5xl mb-4 text-blue-400" />
                        <h1 className="text-xl font-medium">No Completed Tasks</h1>
                        <p className="mt-2 text-sm">Complete some tasks to see them here</p>
                    </div>
                )
            }
        </div>
    );
}

export default Completed;
