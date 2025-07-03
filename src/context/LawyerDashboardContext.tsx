'use client';

import type { Dispatch, SetStateAction} from 'react';
import { createContext, useState, useContext } from 'react';

interface LawyerDashboardContextType {
    page: string;
    setPage: Dispatch<SetStateAction<string>>;
}

const LawyerDashboardContext = createContext<LawyerDashboardContextType | undefined>(undefined);

export function LawyerDashboardProvider({ children }: { children: React.ReactNode }) {
    const [page, setPage] = useState('dashboard');
    return (
        <LawyerDashboardContext.Provider value={{ page, setPage }}>
            {children}
        </LawyerDashboardContext.Provider>
    );
}

export function useLawyerDashboard() {
    const context = useContext(LawyerDashboardContext);
    if (context === undefined) {
        throw new Error('useLawyerDashboard must be used within a LawyerDashboardProvider');
    }
    return context;
}
