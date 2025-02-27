import React from 'react';
import { Logo } from './Logo';
import { Search } from './Search';
import { Notification } from './Notification';
import { Activity } from './Activity';

export const Header = () => {
    return (
        <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 lg:ps-[260px] dark:bg-neutral-800 dark:border-neutral-700">
            <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
                <div className="me-5 lg:me-0 lg:hidden">
                    <Logo />
                </div>
                <div className="w-full flex items-center justify-end me-2">
                    <div className="flex flex-row items-center justify-end gap-1">
                        <Search />
                        <Notification />
                        <Activity />
                    </div>
                </div>
            </nav>
        </header>
    );
};