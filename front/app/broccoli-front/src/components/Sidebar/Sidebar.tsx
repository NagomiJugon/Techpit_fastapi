import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            ),
        },
        {
            label: 'Workout',
            path: '/workout',
            icon: <FontAwesomeIcon icon="dumbbell" className="size-4" />,
        },
        {
            label: 'Calendar',
            path: '/calendar',
            icon: (
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                </svg>
            ),
        },
        {
            label: 'Documentation',
            path: '/documentation',
            icon: (
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            ),
        },
    ];

    return (
        <div id="hs-application-sidebar" className="hs-overlay [--auto-close:lg]
        hs-overlay-open:translate-x-0
        -translate-x-full transition-all duration-300 transform
        w-[260px] h-full
        fixed inset-y-0 start-0 z-[60]
        bg-white border-e border-gray-200
        lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
        dark:bg-neutral-800 dark:border-neutral-700" role="dialog" aria-label="Sidebar">
            <div className="relative flex flex-col h-full">
                {/* Logo */}
                <div className="px-6 pt-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
                    <a className="flex items-center gap-3 text-lg font-semibold focus:outline-none focus:opacity-80" href="#"
                        aria-label="Broccoli">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Broccoli florets (main head) */}
                            <circle cx="12" cy="6" r="3" className="fill-green-500" />
                            <circle cx="8" cy="8.5" r="2.5" className="fill-green-500" />
                            <circle cx="16" cy="8.5" r="2.5" className="fill-green-500" />
                            <circle cx="6" cy="12" r="2" className="fill-green-600" />
                            <circle cx="18" cy="12" r="2" className="fill-green-600" />
                            {/* Main body */}
                            <path d="M12 9 Q8 12 8 16 Q8 18 12 19 Q16 18 16 16 Q16 12 12 9" className="fill-green-600" />
                            {/* Stem */}
                            <rect x="11" y="19" width="2" height="4" className="fill-green-700" />
                        </svg>
                        <span className="text-gray-800 dark:text-white">Broccoli</span>
                    </a>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    <nav className="p-3 w-full">
                        <ul className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none ${
                                            isActive(item.path)
                                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                                        }`}>
                                        {item.icon}
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            U
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-white">User</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">user@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};