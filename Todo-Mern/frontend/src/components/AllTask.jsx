import React, { useContext } from 'react';
import Task from './Task/Task';
import TaskContext from '../context/TaskContext';

function AllTask() {
    const { tasks } = useContext(TaskContext);

    return (
        <div>
            {
                tasks.length !== 0 ? (
                    tasks.slice().reverse().map((task, index) => (
                        <Task
                            key={tasks.length - 1 - index} 
                            task={task}
                            id={tasks.length - 1 - index} 
                        />
                    ))
                ) : (
                    <h1>No Task Found</h1>
                )
            }
        </div>
    );
}

export default AllTask;
