import React, { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export const GridCols4 = ({ children }: LayoutProps) => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {children}
        </div>
    );
};