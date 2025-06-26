import React from 'react';
import moment from 'moment';
import "./task.css";
import { useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import axios from '../../Axios/axios.js';

function Task({ task, id }) {
    const { dispatch } = useContext(TaskContext);
    const { userToken } = useContext(TokenContext);
    // const [isEditing, setIsEditing] = useState(false);
    // const [editTitle, setEditTitle] = useState(task.title);
    // const [editDescription, setEditDescription] = useState(task.description);

    const handleRemove = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This task will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F87171',
            cancelButtonColor: '#60A5FA',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#fff',
            borderRadius: '15px',
            customClass: {
                title: 'text-xl font-bold text-gray-800',
                content: 'text-gray-700',
                confirmButton: 'px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg',
                cancelButton: 'px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg',
                popup: 'rounded-xl border-t-4 border-pink-500 shadow-2xl'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.delete('/task/removeTask', {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    },
                    data: { id: task._id }
                });

                // Force a refresh of all tasks to ensure UI is in sync with backend
                const allTasksResponse = await axios.get('/task/getTask', {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                dispatch({
                    type: "SET_TASK",
                    payload: allTasksResponse.data
                });

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your task has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 1500,
                    timerProgressBar: true,
                    background: '#fff',
                    customClass: {
                        title: 'text-xl font-bold text-gray-800',
                        content: 'text-gray-700',
                        confirmButton: 'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg',
                        popup: 'rounded-xl border-t-4 border-green-500 shadow-2xl'
                    }
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Error deleting task',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    background: '#fff',
                    customClass: {
                        title: 'text-xl font-bold text-gray-800',
                        content: 'text-gray-700',
                        confirmButton: 'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg',
                        popup: 'rounded-xl border-t-4 border-red-500 shadow-2xl'
                    }
                });
            }
        }
    }

    const handleEdit = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Update Task',
            html: `
                <div class="p-2">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 text-left" for="swal-input1">
                            Title
                        </label>
                        <input id="swal-input1" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-all duration-300" placeholder="Task title" value="${task.title}">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 text-left" for="swal-input2">
                            Description
                        </label>
                        <textarea id="swal-input2" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-all duration-300 h-24" placeholder="Task description">${task.description}</textarea>
                    </div>
                    <div class="mb-2">
                        <label class="block text-gray-700 text-sm font-bold mb-2 text-left" for="swal-input3">
                            Category
                        </label>
                        <select id="swal-input3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-all duration-300">
                            <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>Personal</option>
                            <option value="work" ${task.category === 'work' ? 'selected' : ''}>Work</option>
                            <option value="shopping" ${task.category === 'shopping' ? 'selected' : ''}>Shopping</option>
                            <option value="others" ${task.category === 'others' ? 'selected' : ''}>Others</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            background: '#fff',
            width: '32em',
            customClass: {
                title: 'text-xl font-bold text-gray-800',
                confirmButton: 'px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg',
                cancelButton: 'px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg',
                popup: 'rounded-xl border-t-4 border-blue-500 shadow-2xl'
            },
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-input1').value,
                    description: document.getElementById('swal-input2').value,
                    category: document.getElementById('swal-input3').value
                }
            }
        });

        if (formValues) {
            try {
                // const response = await axios.put('/task/updateTask',
                //     {
                //         id: task._id,
                //         title: formValues.title,
                //         description: formValues.description,
                //         category: formValues.category
                //     },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${userToken}`
                //         }
                //     }
                // );

                // Force a refresh of all tasks to ensure UI is in sync with backend
                const allTasksResponse = await axios.get('/task/getTask', {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                dispatch({
                    type: "SET_TASK",
                    payload: allTasksResponse.data
                });

                Swal.fire({
                    title: 'Updated!',
                    text: 'Your task has been updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 1500,
                    timerProgressBar: true,
                    background: '#fff',
                    customClass: {
                        title: 'text-xl font-bold text-gray-800',
                        content: 'text-gray-700',
                        confirmButton: 'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg',
                        popup: 'rounded-xl border-t-4 border-green-500 shadow-2xl'
                    }
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Error updating task',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    background: '#fff',
                    customClass: {
                        title: 'text-xl font-bold text-gray-800',
                        content: 'text-gray-700',
                        confirmButton: 'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg',
                        popup: 'rounded-xl border-t-4 border-red-500 shadow-2xl'
                    }
                });
            }
        }
    }

    const handleMarkDone = async (e) => {
        try {
            // const response = await axios.put('/task/markDone',
            //     { id: task._id },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${userToken}`
            //         }
            //     }
            // );

            // Force a refresh of all tasks to ensure UI is in sync with backend
            const allTasksResponse = await axios.get('/task/getTask', {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            dispatch({
                type: "SET_TASK",
                payload: allTasksResponse.data
            });

            Swal.fire({
                title: 'Success!',
                text: task.completed ? 'Task marked as incomplete' : 'Task marked as complete',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 1500,
                timerProgressBar: true,
                background: '#fff',
                customClass: {
                    title: 'text-xl font-bold text-gray-800',
                    content: 'text-gray-700',
                    confirmButton: 'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg',
                    popup: 'rounded-xl border-t-4 border-green-500 shadow-2xl'
                }
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error!',
                text: 'Error updating task status',
                icon: 'error',
                confirmButtonText: 'OK',
                background: '#fff',
                customClass: {
                    title: 'text-xl font-bold text-gray-800',
                    content: 'text-gray-700',
                    confirmButton: 'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg',
                    popup: 'rounded-xl border-t-4 border-red-500 shadow-2xl'
                }
            });
        }
    }

    // Get category color
    const getCategoryColor = (category) => {
        switch(category) {
            case 'personal': return 'purple';
            case 'work': return 'blue';
            case 'shopping': return 'green';
            case 'others': return 'gray';
            default: return 'gray';
        }
    };

    // Get category icon
    const getCategoryIcon = (category) => {
        switch(category) {
            case 'personal': return '👤';
            case 'work': return '💼';
            case 'shopping': return '🛒';
            case 'others': return '📌';
            default: return '📌';
        }
    };

    const color = getCategoryColor(task.category);
    const icon = getCategoryIcon(task.category);

    return (
        <div className={`relative bg-white py-4 px-5 rounded-lg shadow-md mb-4 overflow-hidden
            border-l-4 border-${color}-500 hover:shadow-lg transition-all duration-200`}>
            <div className={`absolute top-0 left-0 w-full h-full opacity-5 bg-${color}-500`}></div>

            <div className="flex items-start">
                {/* Checkbox */}
                <div className="mark-done z-10 mt-1 mr-3">
                    <input
                        type="checkbox"
                        className={`h-5 w-5 rounded-md border-2 border-${color}-400 text-${color}-600 focus:ring-${color}-500 cursor-pointer transition-all duration-300 hover:shadow-md`}
                        onChange={handleMarkDone}
                        checked={task.completed}
                    />
                </div>

                {/* Task Content */}
                <div className="task-info text-gray-800 flex-grow z-10">
                    <h4 className={`task-title text-lg font-medium capitalize ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </h4>
                    <p className={`task-description mt-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                        {task.description}
                    </p>
                    <div className='flex items-center justify-between mt-3'>
                        <div className='text-xs text-gray-500 italic'>
                            {task?.createdAt ? (
                                <p>{moment(task.createdAt).fromNow()}</p>
                            ) : (
                                <p>just now</p>
                            )}
                        </div>

                        {/* Category Badge */}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 shadow-sm`}>
                            <span className="mr-1">{icon}</span>
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="task-actions flex items-center gap-3 z-10 ml-3">
                    <button
                        onClick={handleEdit}
                        className="p-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-full hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                        title="Edit task"
                    >
                        <EditIcon style={{ fontSize: 18 }} className="animate-pulse" />
                    </button>

                    <button
                        onClick={handleRemove}
                        className="p-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                        title="Delete task"
                    >
                        <DeleteIcon style={{ fontSize: 18 }} className="animate-pulse" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Task;
