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

                dispatch({
                    type: "REMOVE_TASK",
                    id: task._id
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
                    text: 'Error in deleting task',
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
                `<textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${task.description}</textarea>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-input1').value,
                    description: document.getElementById('swal-input2').value
                }
            }
        });

        if (formValues) {
            try {
                const response = await axios.put('/task/updateTask', 
                    {
                        id: task._id,
                        title: formValues.title,
                        description: formValues.description
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    }
                );

                dispatch({
                    type: "UPDATE_TASK",
                    id: task._id,
                    title: formValues.title,
                    description: formValues.description
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
                    text: 'Error in updating task',
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

            dispatch({
                type: "MARK_DONE",
                id: task._id
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
                text: 'Error in updating task status',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <div className='bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3'>
            <div className="mark-done">
                <input type="checkbox" className="checkbox" onChange={handleMarkDone} checked={task.completed} />
            </div>
            <div className="task-info text-slate-900 text-sm w-10/12">
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
            <div className="task-actions text-sm text-white flex gap-2">
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
    );
}

export default Task;