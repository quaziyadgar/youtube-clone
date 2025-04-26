import React from 'react'
import { Link } from 'react-router-dom'

const contents = [{ "home": "/" }, { "subscription": "/subscription" }, { "trending": "/trending" }, { "create Channel": "/create-channel" }];

export const Sidebar = (props) => {
    const { isSidebarOpen, setIsSidebarOpen } = props;

    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return (
        isSidebarOpen && <aside
            className="fixed top-16 left-0 w-64 p-4 border-r border-gray-700 h-[calc(100vh-4rem)] overflow-y-auto hidden md:block">
            <ul className="space-y-2">
                {contents.map((content, index) => (
                    <li key={index} className="p-2 rounded text-white hover:bg-gray-200 hover:text-black">
                        <Link to={Object.values(content)[0]} onClick={() => setIsSidebarOpen(false)}>
                            {toTitleCase(Object.keys(content)[0])}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
