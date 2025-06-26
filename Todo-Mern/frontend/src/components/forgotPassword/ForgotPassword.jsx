import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "../../Axios/axios.js";
import KeyIcon from '@mui/icons-material/Key';
//import { FaCheckCircle } from 'react-icons/fa';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            setMessage("");
            setError("");
            const res = await axios.post("/forgotPassword/forgotPassword", {email})
            console.log(res);
            setMessage(res.data.message);
            console.log(res.data.message);
        } catch (error) {
            setError(error.response.data.message)
            console.log(error);
            console.log(error.response.data.message);
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="inline-block p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-3 shadow-lg mx-auto">
                        <KeyIcon className="text-white text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
                            Password Recovery
                        </span>
                    </h2>
                    <p className="text-gray-500">Reset your password</p>
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
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Reset Password'}
                        </button>

                        <Link
                            to="/login"
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
