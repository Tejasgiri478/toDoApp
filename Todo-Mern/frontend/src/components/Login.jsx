import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from "../Axios/axios.js"
import TokenContext from '../context/TokenContext.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function Login() {
    const [formData, setFormData] = useState({})
    const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
    const [error, setError] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [resetMessage, setResetMessage] = useState(null);

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
            const result = await axios.post("/user/login", formData);
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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setResetMessage({ type: 'error', text: 'Please enter your email address' });
            return;
        }
        
        try {
            await axios.post("/forgotPassword/forgotPassword", { email });
            setResetMessage({ type: 'success', text: 'Password reset link sent to your email' });
        } catch (error) {
            console.error("Forgot password error:", error);
            setResetMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send reset link' });
        }
    }

    return (
        <div>
            {userToken && <Navigate to="/" />}
            <section className="login-container overflow-y-hidden h-screen">
                <div className="container px-6 py-6 h-full">
                    <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
                        <div className="md:w-8/12 lg:w-5/12 mb-4 md:mb-0 auth-image-container">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="w-full" alt="Phone" />
                        </div>
                        <div className="md:w-8/12 lg:w-6/12 lg:ml-10">
                            {!showForgotPassword ? (
                                <>
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3 shadow-lg">
                                            <TaskAltIcon className="text-white text-4xl" />
                                        </div>
                                        <h2 className="text-2xl font-bold">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                                TaskMaster
                                            </span>
                                        </h2>
                                        <p className="text-gray-500">Log in to manage your tasks</p>
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
                                                <span className="block sm:inline">Login successful! Redirecting...</span>
                                </div>
                                        )}
                                        
                                        <div className="mb-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                                type="email"
                                        name='email'
                                                id="email"
                                                className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                                    className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                </div>

                                        <div className="flex justify-between items-center mb-4">
                                    <div className="form-group form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                                    id="rememberMe" 
                                                />
                                                <label className="form-check-label inline-block text-gray-800 text-sm" htmlFor="rememberMe">
                                                    Remember me
                                                </label>
                                    </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setShowForgotPassword(true)}
                                                className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
                                            >
                                                Forgot password?
                                            </button>
                                </div>
                                        
                                    <button
                                        type="submit"
                                            className={`inline-block px-6 py-3 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full ${isLoading || success ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800'}`}
                                            disabled={isLoading || success}
                                        >
                                            {isLoading ? 'Logging in...' : success ? 'Login Successful!' : 'Login'}
                                    </button>
                                        
                                        <div className="flex items-center my-3 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                                            <p className="text-center font-semibold mx-4 mb-0 text-sm">Or</p>
                                        </div>
                                        
                                        <Link
                                            to="/register"
                                            className="inline-block px-6 py-3 bg-transparent text-green-600 font-medium text-sm leading-snug uppercase rounded hover:text-green-700 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200 transition duration-150 ease-in-out w-full text-center border border-gray-300"
                                        >
                                            Create new account
                                        </Link>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3 shadow-lg">
                                            <LockOpenIcon className="text-white text-4xl" />
                                        </div>
                                        <h2 className="text-2xl font-bold">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                                Reset Password
                                            </span>
                                        </h2>
                                        <p className="text-gray-500">Enter your email to reset your password</p>
                                    </div>

                                    <form onSubmit={handleForgotPassword} className="bg-white p-5 rounded-lg shadow-md min-h-[400px]">
                                        {resetMessage && (
                                            <div className={`flex items-center ${resetMessage.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border px-2 py-1 rounded mb-2 relative text-sm`} role="alert">
                                                {resetMessage.type === 'success' ? <CheckCircleIcon className="mr-1 text-sm" /> : <ErrorIcon className="mr-1 text-sm" />}
                                                <span className="block sm:inline">{resetMessage.text}</span>
                                            </div>
                                        )}
                                        
                                        <div className="mb-4">
                                            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                id="reset-email"
                                                className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Email Address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                                        >
                                            Send Reset Link
                                        </button>
                                        
                                        <button 
                                            type="button" 
                                            onClick={() => setShowForgotPassword(false)}
                                            className="inline-block px-6 py-3 bg-transparent text-blue-600 font-medium text-sm leading-snug uppercase rounded hover:text-blue-700 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200 transition duration-150 ease-in-out w-full text-center border border-gray-300 mb-4"
                                        >
                                            Back to Login
                                        </button>
                                        
                                        <div className="mt-6">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-blue-800 mb-2">Password Reset Information</h3>
                                                <ul className="list-disc pl-5 text-xs text-blue-700 space-y-1">
                                                    <li>Enter your registered email address</li>
                                                    <li>We will send you a password reset link</li>
                                                    <li>Click on the link provided in the email</li>
                                                    <li>Set your new password</li>
                                                </ul>
                                                <p className="text-xs text-blue-600 mt-2">If you don't receive the email, please check your spam folder or contact support.</p>
                                            </div>
                                </div>
                            </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;