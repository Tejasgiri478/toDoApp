import React from 'react';
import { useContext } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import TokenContext from '../../context/TokenContext.js';
import "./header.css"

function Header() {
    const token = localStorage.getItem("authToken");
    const { user } = useContext(TokenContext);
    console.log("user", user);
    const logout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    }

    return (
        <div>
            <nav className='header bg-slate-200 flex justify-between items-center'>
                <div className="logo w-1/4 text-center">
                    <Link 
                        to="/" 
                        className="block py-2 px-4 text-gray-800 font-medium"
                    >
                        Todo App
                    </Link>
                </div>
                <div className='flex justify-between'>
                    {
                        token ? (
                            <div className='flex items-center justify-center'>
                                <p className='mr-5'>welcome, <span className='text-xl text-blue-800 capitalize'>{user?.name || 'User'}</span></p>
                                <button onClick={logout} className="logout mr-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
                            </div>
                        ) : (
                            <ul className='flex justify-end gap-3 w-3/4 pr-6'>
                                <li>
                                    <NavLink 
                                        to="/login"
                                        className={({isActive}) => 
                                            isActive 
                                                ? "block py-2 px-4 text-blue-700 font-medium" 
                                                : "block py-2 px-4 hover:text-blue-700"
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink 
                                        to="/register"
                                        className={({isActive}) => 
                                            isActive 
                                                ? "block py-2 px-4 text-blue-700 font-medium" 
                                                : "block py-2 px-4 hover:text-blue-700"
                                        }
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </ul>
                        )
                    }
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default Header;