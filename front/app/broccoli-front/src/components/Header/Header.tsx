import React from 'react';
import { Logo } from './Logo';
import { Search } from './Search';
import { Notification } from './Notification';
import { Activity } from './Activity';

export const Header = () => {
    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 shadow-sm">
            <nav className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Left section - Logo for mobile */}
                <div className="flex items-center lg:hidden">
                    <Logo />
                </div>
                
                {/* Center section - Title */}
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Exercise Tracker
                    </h1>
                </div>
                
                {/* Right section - Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Search />
                    <Notification />
                    <Activity />
                </div>
            </nav>
        </header>
    );
};