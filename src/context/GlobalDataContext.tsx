
'use client';

import { teamMembers as initialTeamMembers, clients as initialClients, tasksData as initialTasksData, type Client, type TeamMember, type Task } from '@/lib/data';
import type { Dispatch, SetStateAction} from 'react';
import { createContext, useState, useContext, useCallback } from 'react';

interface GlobalDataContextType {
    teamMembers: TeamMember[];
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (updatedMember: TeamMember) => void;
    clients: Client[];
    addClient: (client: Client) => void;
    updateClient: (updatedClient: Client) => void;
    tasks: Task[];
    addTask: (task: Task) => void;
    logoSrc: string | null;
    setLogoSrc: (src: string | null) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

export function GlobalDataProvider({ children }: { children: React.ReactNode }) {
    const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
    const [clients, setClients] = useState(initialClients);
    const [tasks, setTasks] = useState(initialTasksData);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);

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

    const addTask = useCallback((task: Task) => {
        setTasks(prev => [task, ...prev]);
    }, []);

    return (
        <GlobalDataContext.Provider value={{ teamMembers, addTeamMember, updateTeamMember, clients, addClient, updateClient, tasks, addTask, logoSrc, setLogoSrc }}>
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
