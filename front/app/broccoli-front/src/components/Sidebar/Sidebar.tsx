import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';

const STORAGE_KEY = 'sidebar-expanded-menu';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
            icon: <FontAwesomeIcon icon="dumbbell" className="size-4 text-current" />,
        },
        {
            label: 'History',
            path: '/history',
            icon: (
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M3 3v5h5" />
                    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                    <path d="M12 7v5l4 2" />
                </svg>
            ),
        },
        {
            label: 'Settings',
            path: '#',
            icon: (
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24M19.78 19.78l-4.24-4.24m-5.08-5.08l-4.24-4.24" />
                </svg>
            ),
            children: [
                {
                    label: 'Categories',
                    path: '/categories',
                },
                {
                    label: 'Exercises',
                    path: '/exercises',
                },
            ],
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

    // 現在のパスがどのメニューの子要素かを判定
    const findParentMenu = (currentPath: string) => {
        for (const item of navItems) {
            if (item.children) {
                const hasChild = item.children.some(child => child.path === currentPath);
                if (hasChild) return item.label;
            }
        }
        return null;
    };

    // sessionStorageから初期状態を取得、または現在のパスから判定
    const getInitialExpandedMenu = () => {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) return stored;
        return findParentMenu(location.pathname);
    };

    const [expandedMenu, setExpandedMenu] = useState<string | null>(getInitialExpandedMenu);

    // expandedMenuが変更されたらsessionStorageに保存
    useEffect(() => {
        if (expandedMenu) {
            sessionStorage.setItem(STORAGE_KEY, expandedMenu);
        } else {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, [expandedMenu]);

    // ページ遷移時、子要素のページにいる場合は親メニューを開く
    useEffect(() => {
        const parentMenu = findParentMenu(location.pathname);
        if (parentMenu && expandedMenu !== parentMenu) {
            setExpandedMenu(parentMenu);
        }
    }, [location.pathname]);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const toggleMenu = (label: string) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

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
                                    {item.children ? (
                                        <div>
                                            <button
                                                onClick={() => toggleMenu(item.label)}
                                                className="w-full flex items-center justify-between gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700">
                                                <span className="flex items-center gap-2.5">
                                                    {item.icon}
                                                    {item.label}
                                                </span>
                                                <svg
                                                    className={`shrink-0 size-3 transition-transform duration-200 ${
                                                        expandedMenu === item.label ? 'rotate-180' : ''
                                                    }`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round">
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </button>
                                            {expandedMenu === item.label && (
                                                <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 dark:border-neutral-700">
                                                    {item.children.map((child) => (
                                                        <li key={child.path}>
                                                            <button
                                                                onClick={() => navigate(child.path)}
                                                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors focus:outline-none ${
                                                                    isActive(child.path)
                                                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                                        : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                                                }`}>
                                                                {child.label}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none ${
                                                isActive(item.path)
                                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                    : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700'
                                            }`}>
                                            {item.icon}
                                            {item.label}
                                        </button>
                                    )}
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