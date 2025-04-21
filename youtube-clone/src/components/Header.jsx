import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../store/videoSlice';
import { logout } from '../store/authSlice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Header = (props) => {
    const { isSidebarOpen, setIsSidebarOpen } = props;
    const [contentWrapped, setContentWrapped] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return (
        <header className="sticky top-0 z-50 flex justify-between items-center py-2 px-4 shadow-md bg-black">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-2xl text-white cursor-pointer"
                >
                    ☰
                </button>
                <Link to="/" className='flex'>
                    <FontAwesomeIcon icon={['fab', 'youtube']} className="text-4xl" color='red' />
                    <h1 className="text-2xl font-bold font-sans text-white">YouTube</h1>
                </Link>
            </div>
            <div className="justify-center">
                <input
                    type="text"
                    placeholder="Search videos..."
                    className="p-2 px-4 rounded-full w-48 border-1 border-gray-400 lg:w-150 focus:outline-none focus:ring-1 focus:ring-blue-700 cursor-pointer text-white"
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                />
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
            </div>
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex items-center gap-2 static">
                        <button className="h-10 w-10 rounded-full justify-center align-middle bg-blue-500 text-lg font-medium text-white cursor-pointer"
                            onClick={() => setContentWrapped(prev => !prev)}
                        >
                            {user.username[0].toUpperCase()}
                        </button>
                        {(contentWrapped && <div className={`flex flex-wrap absolute w-20 rounded-lg right-4 top-16 bg-white justify-center`}>
                            <Link to="/channel" className="text-red-700 cursor-pointer hover:underline mt-2"
                                onClick={() => setContentWrapped(prev => !prev)}
                            >Channel</Link>
                            <div
                                onClick={() => { dispatch(logout()); setContentWrapped(prev => !prev) }}
                                className="px-4 py-2 cursor-pointer text-black rounded hover:underline"
                            >
                                Logout
                            </div>
                        </div>)}
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="px-4 py-2 bg-red-700 cursor-pointer text-white rounded hover:bg-red-800 transition-colors">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </header>
    )
}
