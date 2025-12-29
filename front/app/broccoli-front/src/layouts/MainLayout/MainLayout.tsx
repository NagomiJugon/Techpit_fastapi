import React, { ReactNode } from 'react';
import { Header } from '@src/components/Header/Header';
import { Sidebar } from '@src/components/Sidebar/Sidebar';
import { LayoutProps } from '@src/utils/constants';

export const MainLayout = ({ children }: LayoutProps) => {
    return (
        <React.Fragment>
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main content wrapper */}
            <div className="w-full lg:ps-[260px]">
                {/* Header */}
                <Header />
                
                {/* Content area */}
                <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {children}
                </main>
            </div>
        </React.Fragment>
    );
};