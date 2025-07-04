'use client';

import { teamMembers as initialTeamMembers, clients as initialClients, type Client, type TeamMember } from '@/lib/data';
import type { Dispatch, SetStateAction} from 'react';
import { createContext, useState, useContext, useCallback } from 'react';

interface GlobalDataContextType {
    teamMembers: TeamMember[];
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (updatedMember: TeamMember) => void;
    clients: Client[];
    addClient: (client: Client) => void;
    updateClient: (updatedClient: Client) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

export function GlobalDataProvider({ children }: { children: React.ReactNode }) {
    const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
    const [clients, setClients] = useState(initialClients);

    const addTeamMember = useCallback((member: TeamMember) => {
        setTeamMembers(prev => [member, ...prev]);
    }, []);

    const updateTeamMember = useCallback((updatedMember: TeamMember) => {
        setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    }, []);

    const addClient = useCallback((client: Client) => {
        setClients(prev => [client, ...prev]);
    }, []);

    const updateClient = useCallback((updatedClient: Client) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    }, []);

    return (
        <GlobalDataContext.Provider value={{ teamMembers, addTeamMember, updateTeamMember, clients, addClient, updateClient }}>
            {children}
        </GlobalDataContext.Provider>
    );
}

export function useGlobalData() {
    const context = useContext(GlobalDataContext);
    if (context === undefined) {
        throw new Error('useGlobalData must be used within a GlobalDataProvider');
    }
    return context;
}
