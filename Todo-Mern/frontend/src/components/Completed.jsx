import React, { useContext } from "react";
import TaskContext from "../context/TaskContext";
import CompletedTask from "./CompletedTask";

function Completed() {
    const { tasks } = useContext(TaskContext);

    // Filter completed tasks and reverse the order
    const completedTasks = tasks.filter(task => task.completed).slice().reverse();

    return (
        <div>
            {completedTasks.length !== 0 ? (
                completedTasks.map((task, index) => (
                    <CompletedTask
                        key={completedTasks.length - 1 - index} // Ensuring unique keys
                        task={task}
                        id={completedTasks.length - 1 - index} // Reflecting original index
                    />
                ))
            ) : (
                <h1>No Task Found</h1>
            )}
        </div>
    );
}

export default Completed;
