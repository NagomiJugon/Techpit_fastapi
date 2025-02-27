import React, { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export const GridCols2 = ({ children }: LayoutProps) => {
    return (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {children}
        </div>
    );
};