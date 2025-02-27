import { ReactNode } from "react";

export const API_URL = 'http://localhost:8000';

export type LayoutProps = {
    children: ReactNode;
};

export enum ActionTypes {
    fetch = 'FETCHING',
    success = 'FETCH_SUCCESS',
    error = 'FETCH_ERROR'
};

export enum RequestStates {
    idle = 'IDLE',
    loading = 'LOADING',
    success = 'SUCCESS',
    error = 'ERROR'
};
