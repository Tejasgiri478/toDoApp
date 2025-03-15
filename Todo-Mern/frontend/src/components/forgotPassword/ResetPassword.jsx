import React, { useState } from 'react';
import { useSearchParams, Link } from "react-router-dom";
import axios from "../../Axios/axios.js";
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setMessage("");
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false)
        } else {
            try {
                const token = searchParams.get("token");
                const res = await axios.post("/forgotPassword/resetPassword", {token, password })
                setMessage(res.data.message);
            } catch (error) {
                setError(error.response.data.message)
            }finally{
                setIsLoading(false)
            }
           
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        <LockResetIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create new password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Your new password must be different from previously used passwords
                    </p>
                </div>
                
                {message && (
                    <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}
                
                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <input 
                                    id="password" 
                                    name="password" 
                                    type={showPassword ? "text" : "password"} 
                                    autoComplete="new-password" 
                                    required 
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 cursor-pointer"
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-4 relative">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    id="confirm-password" 
                                    name="confirm-password" 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    autoComplete="new-password" 
                                    required 
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 cursor-pointer"
                                >
                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button 
                            type="submit" 
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Reset Password'}
                        </button>
                        
                        <Link 
                            to="/login" 
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;