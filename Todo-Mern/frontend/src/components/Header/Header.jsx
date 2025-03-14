import React, { useState } from 'react';
import { useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import TokenContext from '../../context/TokenContext.js';
import "./header.css"

function Header() {
    const token = localStorage.getItem("authToken");
    const { user } = useContext(TokenContext);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const logout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    }
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <div>
            <nav className='header bg-slate-200 flex flex-wrap justify-between items-center'>
                <div className="logo w-1/4 text-center">
                    <NavLink to="/">Todo App</NavLink>
                </div>
                
                {/* Mobile menu button */}
                <button 
                    className="md:hidden px-2 py-1 mr-2 rounded border border-gray-400"
                    onClick={toggleMenu}
                >
                    Menu
                </button>
                
                <div className={`${menuOpen ? 'block' : 'hidden'} md:flex w-full md:w-auto md:flex-grow-0`}>
                    {
                        token ? (
                            <div className='flex flex-col md:flex-row items-center justify-center'>
                                <p className='mr-5'>welcome, <span className='text-xl text-blue-800 capitalize'>{user.name}</span></p>
                                <button onClick={logout} className="logout mr-4 mt-2 md:mt-0">Logout</button>
                            </div>
                        ) : (
                            <ul className='flex flex-col md:flex-row justify-end gap-3 w-full md:w-3/4 pr-6'>
                                <li className="my-2 md:my-0">
                                    <NavLink to="/login">Login</NavLink>
                                </li>
                                <li className="my-2 md:my-0">
                                    <NavLink to="/register">Register</NavLink>
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