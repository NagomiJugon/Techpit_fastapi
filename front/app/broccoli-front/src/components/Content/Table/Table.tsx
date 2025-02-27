import React from 'react';
import { LayoutProps } from '@src/utils/constants';

export const Table = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};