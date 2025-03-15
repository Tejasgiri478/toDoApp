import React, { useState } from 'react';
import { useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from "../../Axios/axios.js"
import Swal from 'sweetalert2'
import "./createTask.css"
import { FaPlus } from 'react-icons/fa';

function CreateTask() {
    const { dispatch } = useContext(TaskContext)
    const {userToken} = useContext(TokenContext)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("others")
    
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/task/addTask", 
                {
                    title, 
                    description, 
                    category
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

            setTitle("");
            setDescription("");
            setCategory("others");
            
            Swal.fire({
                title: 'Success!',
                text: 'Your task has been added successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error!',
                text: 'Error while adding task',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-center mb-6 text-blue-700">Add New Task</h2>
            <form onSubmit={handleAdd}>
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-2 font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all'
                        placeholder="Enter task title"
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Description</label>
                    <textarea
                        rows={5}
                        name="description"
                        id="description"
                        value={description}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ resize: "none" }}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all'
                        placeholder="Enter task description"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="category" className="block mb-2 font-medium text-gray-700">Category</label>
                    <select
                        name="category" 
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} 
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all'
                    >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="shopping">Shopping</option>
                        <option value="others">Others</option>
                    </select>
                </div>

                <div className='flex justify-center'>
                    <button
                        type='submit'
                        className='flex items-center gap-2 bg-blue-600 rounded-lg text-white px-6 py-3 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105'
                    >
                        <FaPlus />
                        <span>Add</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTask;