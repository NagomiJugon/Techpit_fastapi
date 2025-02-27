import React from 'react';

export const Header = () => {
    return (
        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Workout Record
                </h2>
            </div>
        </div>
    );
};