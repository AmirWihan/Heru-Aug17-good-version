'use client';

import type { Dispatch, SetStateAction} from 'react';
import { createContext, useState, useContext } from 'react';

interface ClientDashboardContextType {
    page: string;
    setPage: Dispatch<SetStateAction<string>>;
}

const ClientDashboardContext = createContext<ClientDashboardContextType | undefined>(undefined);

export function ClientDashboardProvider({ children }: { children: React.ReactNode }) {
    const [page, setPage] = useState('overview'); // Default page is overview
    return (
        <ClientDashboardContext.Provider value={{ page, setPage }}>
            {children}
        </ClientDashboardContext.Provider>
    );
}

export function useClientDashboard() {
    const context = useContext(ClientDashboardContext);
    if (context === undefined) {
        throw new Error('useClientDashboard must be used within a ClientDashboardProvider');
    }
    return context;
}
