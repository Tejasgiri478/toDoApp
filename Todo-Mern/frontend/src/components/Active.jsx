import React, { useContext } from 'react';
import Task from './Task/Task';
import TaskContext from '../context/TaskContext';

function Active() {
    const { tasks } = useContext(TaskContext);

    // Filter active (incomplete) tasks and reverse the order
    const activeTasks = tasks.filter(task => !task.completed).slice().reverse();

    return (
        <div>
            {activeTasks.length !== 0 ? (
                activeTasks.map((task, index) => (
                    <Task
                        key={activeTasks.length - 1 - index} // Ensuring unique keys
                        task={task}
                        id={activeTasks.length - 1 - index} // Reflecting original index
                    />
                ))
            ) : (
                <h1>No Task Found</h1>
            )}
        </div>
    );
}

export default Active;
