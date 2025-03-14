import React, { useState } from 'react';
import { useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from "../../Axios/axios.js"
import Swal from 'sweetalert2'
import "./createTask.css"

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
                text: 'Error adding task',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <div className="addContainer md:w-1/3 md:mx-auto mx-3 mt-3 flex justify-center">
            <div className='w-11/12'>
                <form onSubmit={handleAdd}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-2">Description</label>
                        <textarea
                            rows={5}
                            name="description"
                            id="description"
                            value={description}
                            required
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ resize: "none" }}
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block mb-2">Category</label>
                        <select
                            name="category" 
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)} 
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
                            className='bg-blue-700 rounded-md text-white px-5 py-2 hover:bg-blue-600'
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTask;