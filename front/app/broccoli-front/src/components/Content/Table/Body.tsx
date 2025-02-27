import { LayoutProps } from '@src/utils/constants';
import React from 'react';

export const Body = ({ children}: LayoutProps) => {
    return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                    <th scope="col" className="ps-6 lg:ps-3 xl:pe-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Name
                            </span>
                        </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Category
                            </span>
                        </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Weight
                            </span>
                        </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Reps
                            </span>
                        </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Date
                            </span>
                        </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-end"></th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {children}
            </tbody>
        </table>
    );
};