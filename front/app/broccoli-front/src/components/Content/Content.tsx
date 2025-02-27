import React, { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export const Content = ({ children }: LayoutProps) => {
    return (
        <div className="w-full lg:ps-64">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {children}
            </div>
        </div>
    );
};