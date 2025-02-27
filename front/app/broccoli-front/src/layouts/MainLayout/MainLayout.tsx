import React, { ReactNode } from 'react';
import { Header } from '@src/components/Header/Header';
import { Sidebar } from '@src/components/Sidebar/Sidebar';
import { LayoutProps } from '@src/utils/constants';

export const MainLayout = ({ children }: LayoutProps) => {
    return (
        <React.Fragment>
            <Header />
            <Sidebar />
            {children}
        </React.Fragment>
    );
};