import React from 'react';

export const Logo = () => {
    return (
        <a className="flex-none rounded-md text-lg inline-block font-semibold focus:outline-none focus:opacity-80" href="#" aria-label="Broccoli">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="3" className="fill-green-500 dark:fill-green-400" />
                <circle cx="8" cy="8.5" r="2.5" className="fill-green-500 dark:fill-green-400" />
                <circle cx="16" cy="8.5" r="2.5" className="fill-green-500 dark:fill-green-400" />
                <circle cx="6" cy="12" r="2" className="fill-green-600 dark:fill-green-500" />
                <circle cx="18" cy="12" r="2" className="fill-green-600 dark:fill-green-500" />
                <path d="M12 9 Q8 12 8 16 Q8 18 12 19 Q16 18 16 16 Q16 12 12 9" className="fill-green-600 dark:fill-green-500" />
                <rect x="11" y="19" width="2" height="4" className="fill-green-700 dark:fill-green-600" />
            </svg>
        </a>
    );
};