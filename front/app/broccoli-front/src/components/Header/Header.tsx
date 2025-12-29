import React from 'react';
import { Logo } from './Logo';
import { Search } from './Search';
import { Notification } from './Notification';
import { Activity } from './Activity';

export const Header = () => {
    const [isDark, setIsDark] = React.useState(() => {
        return document.documentElement.classList.contains('dark');
    });

    const toggleDarkMode = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 shadow-sm">
            <nav className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
                {/* Left section - Logo for mobile */}
                <div className="flex items-center lg:hidden">
                    <Logo />
                </div>
                
                {/* Center section - Title */}
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Exercise Tracker
                    </h1>
                </div>
                
                {/* Right section - Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <Search />
                    <Notification />
                    <Activity />
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors focus:outline-none"
                        aria-label="Toggle dark mode">
                        {isDark ? (
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zm2.828 2.829a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zm2.828 2.829a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zM10 7a3 3 0 110 6 3 3 0 010-6zm-4.22-1.78a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415L5.78 5.22a1 1 0 010-1.415zm-2.829 2.829a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zM3 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm13 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.22 14.78a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zm2.829 2.829a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
};