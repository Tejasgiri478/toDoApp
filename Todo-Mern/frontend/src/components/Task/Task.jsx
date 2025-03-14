import React, { useState } from 'react';
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
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);

    const handleRemove = async (e) => {
        e.preventDefault();
        
        const result = await Swal.fire({
            title: 'Are you sure you want to delete this task?',
            text: 'This task will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
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
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Error deleting task',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }

    const handleEdit = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Update Task',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Title" value="${task.title}">` +
                `<textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${task.description}</textarea>` +
                `<select id="swal-input3" class="swal2-select mt-3">
                    <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>Personal</option>
                    <option value="work" ${task.category === 'work' ? 'selected' : ''}>Work</option>
                    <option value="shopping" ${task.category === 'shopping' ? 'selected' : ''}>Shopping</option>
                    <option value="others" ${task.category === 'others' ? 'selected' : ''}>Others</option>
                </select>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
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
                const response = await axios.put('/task/updateTask', 
                    {
                        id: task._id,
                        title: formValues.title,
                        description: formValues.description,
                        category: formValues.category
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    }
                );

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
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Error updating task',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }

    const handleMarkDone = async (e) => {
        try {
            const response = await axios.put('/task/markDone', 
                { id: task._id },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );

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
                title: 'Congratulations!',
                text: task.completed ? 'Task marked as incomplete' : 'Task marked as complete',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 1500
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error!',
                text: 'Error updating task status',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    const handleUpdateTask = async () => {
        try {
            const res = await axios.put(`/task/updateTask`, {
                id: task._id,
                title: editTitle,
                description: editDescription,
                category: task.category
            }, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
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
            
            setIsEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'Task updated successfully',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error updating task',
            });
        }
    };

    const handleCategoryChange = async (e) => {
        try {
            const response = await axios.put('/task/updateTask', 
                {
                    id: task._id,
                    title: task.title,
                    description: task.description,
                    category: e.target.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );

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
                title: 'Category updated!',
                text: 'Category updated successfully',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error!',
                text: 'Error updating category',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <div className={`relative bg-slate-300 py-4 px-3 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center justify-between md:justify-center gap-2 mb-3 overflow-hidden
            ${task.category === 'personal' ? 'border-l-4 border-purple-500' : ''}
            ${task.category === 'work' ? 'border-l-4 border-blue-500' : ''}
            ${task.category === 'shopping' ? 'border-l-4 border-green-500' : ''}
            ${task.category === 'others' ? 'border-l-4 border-gray-500' : ''}`}>
            <div className={`absolute top-0 left-0 w-full h-full opacity-10
                ${task.category === 'personal' ? 'bg-purple-500' : ''}
                ${task.category === 'work' ? 'bg-blue-500' : ''}
                ${task.category === 'shopping' ? 'bg-green-500' : ''}
                ${task.category === 'others' ? 'bg-gray-500' : ''}`}></div>
            
            <div className="flex items-start w-full md:w-auto">
                <div className="mark-done z-10 mr-3 mt-1">
                    <input type="checkbox" className="checkbox w-5 h-5" onChange={handleMarkDone} checked={task.completed} />
                </div>
                <div className="task-info text-slate-900 text-sm w-full md:w-auto z-10">
                    <h4 className="task-title text-lg capitalize">{task.title}</h4>
                    <p className="task-description">{task.description}</p>
                    <div className='italic opacity-60'>
                        {task?.createdAt ? (
                            <p>{moment(task.createdAt).fromNow()}</p>
                        ) : (
                            <p>just now</p>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="task-actions text-sm text-white flex flex-wrap md:flex-nowrap gap-2 z-10 w-full md:w-auto mt-3 md:mt-0">
                <select 
                    value={task.category} 
                    onChange={handleCategoryChange}
                    className={`form-select px-3 py-1.5 rounded-lg text-black font-medium shadow-sm
                        ${task.category === 'personal' ? 'bg-purple-100' : ''}
                        ${task.category === 'work' ? 'bg-blue-100' : ''}
                        ${task.category === 'shopping' ? 'bg-green-100' : ''}
                        ${task.category === 'others' ? 'bg-gray-100' : ''}
                        border border-gray-300 cursor-pointer hover:border-gray-400`}
                    style={{ minWidth: '120px' }}
                >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="shopping">Shopping</option>
                    <option value="others">Others</option>
                </select>
                <div className="flex gap-2 ml-auto md:ml-0">
                    <EditIcon
                        style={{ fontSize: 30, cursor: "pointer" }}
                        size="large"
                        onClick={handleEdit}
                        className="edit-task-btn bg-green-600 rounded-full border-2 shadow-2xl border-white p-1"
                    />
                    <DeleteIcon
                        style={{ fontSize: 30, cursor: "pointer" }}
                        size="large"
                        onClick={handleRemove}
                        className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1"
                    />
                </div>
            </div>
        </div>
    );
}

export default Task;