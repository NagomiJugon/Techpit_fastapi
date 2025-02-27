import React, { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export const GridColSpan2 = ({ children }: LayoutProps) => {
    return (
        <div className="col-span-2">
            {children}
        </div>
    );
};