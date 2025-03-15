import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from "../Axios/axios.js"
import TokenContext from '../context/TokenContext.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { FaCheckCircle } from 'react-icons/fa';

function Register() {
    const [formData, setFormData] = useState({})
    const {userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
    const [error, setError] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await axios.post("/user/register", formData);
            setSuccess(true);
            
            // Delay to show success message before redirecting
            setTimeout(() => {
                tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
                userDispatch({ type: "SET_USER", payload: result.data.user });
                localStorage.setItem("authToken", JSON.stringify(result.data.token));
            }, 1000);
        } catch (error) {
            console.log(error);
            setError({ message: error.response.data.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {userToken && <Navigate to="/" />}
            <section className="register-container overflow-y-hidden h-screen">
                <div className="container px-6 py-6 h-full">
                    <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
                        <div className="md:w-8/12 lg:w-5/12 mb-4 md:mb-0 auth-image-container">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="w-full" alt="Phone" />
                        </div>
                        <div className="md:w-8/12 lg:w-6/12 lg:ml-10">
                            <div className="flex flex-col items-center mb-4">
                                <div className="inline-block p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-3 shadow-lg">
                                    <PersonAddIcon className="text-white text-4xl" />
                                </div>
                                <h2 className="text-2xl font-bold">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
                                        Create Account
                                    </span>
                                </h2>
                                <p className="text-gray-500">Start organizing your tasks today</p>
                            </div>
                            
                            <form method='post' onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md min-h-[400px]">
                                {error && (
                                    <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded mb-2 relative text-sm" role="alert">
                                        <ErrorIcon className="mr-1 text-sm" />
                                        <span className="block sm:inline">{error.message}</span>
                                    </div>
                                )}
                                
                                {success && (
                                    <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-2 py-1 rounded mb-2 relative text-sm" role="alert">
                                        <CheckCircleIcon className="mr-1 text-sm" />
                                        <span className="block sm:inline">Registration successful! Redirecting...</span>
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name='name'
                                        id="name"
                                        className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="Full Name"
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name='email'
                                        id="email"
                                        className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="Email Address"
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4 relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name='password'
                                            id="password"
                                            className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            placeholder="Password"
                                            onChange={handleChange} 
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-700 cursor-pointer"
                                        >
                                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="form-group form-check">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-green-600 checked:border-green-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                                            id="termsCheck" 
                                            required 
                                        />
                                        <label className="form-check-label inline-block text-gray-800 text-sm" htmlFor="termsCheck">
                                            I agree to the <a href="#!" className="text-green-600 hover:underline">Terms and Conditions</a>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`inline-block px-6 py-3 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full ${isLoading || success ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800'}`}
                                    disabled={isLoading || success}
                                >
                                    {isLoading ? 'Creating account...' : success ? 'Account created!' : 'Register'}
                                </button>
                                
                                <div className="flex items-center my-3 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                                    <p className="text-center font-semibold mx-4 mb-0 text-sm">Or</p>
                                </div>
                                
                                <Link
                                    to="/login"
                                    className="inline-block px-6 py-3 bg-transparent text-blue-600 font-medium text-sm leading-snug uppercase rounded hover:text-blue-700 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200 transition duration-150 ease-in-out w-full text-center border border-gray-300"
                                >
                                    Already have an account? Login
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Register;