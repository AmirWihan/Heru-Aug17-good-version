'use client';

import type { Dispatch, SetStateAction} from 'react';
import { createContext, useState, useContext } from 'react';

interface AdminDashboardContextType {
    page: string;
    setPage: Dispatch<SetStateAction<string>>;
}

const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

export function AdminDashboardProvider({ children }: { children: React.ReactNode }) {
    const [page, setPage] = useState('overview'); // Default page is overview
    return (
        <AdminDashboardContext.Provider value={{ page, setPage }}>
            {children}
        </AdminDashboardContext.Provider>
    );
}

export function useAdminDashboard() {
    const context = useContext(AdminDashboardContext);
    if (context === undefined) {
        throw new Error('useAdminDashboard must be used within a AdminDashboardProvider');
    }
    return context;
}
