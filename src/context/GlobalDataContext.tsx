
'use client';

import { teamMembers as initialTeamMembers, clients as initialClients, tasksData as initialTasksData, appointmentsData as initialAppointmentsData, invoicesData as initialInvoicesData, type Client, type TeamMember, type Task } from '@/lib/data';
import type { Dispatch, SetStateAction} from 'react';
import { createContext, useState, useContext, useCallback, useEffect } from 'react';

type Appointment = typeof initialAppointmentsData[0];
type Invoice = typeof initialInvoicesData[0];

interface GlobalDataContextType {
    teamMembers: TeamMember[];
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (updatedMember: TeamMember) => void;
    clients: Client[];
    addClient: (client: Client) => void;
    updateClient: (updatedClient: Client) => void;
    tasks: Task[];
    addTask: (task: Task) => void;
    appointments: Appointment[];
    invoicesData: Invoice[];
    logoSrc: string | null;
    setLogoSrc: (src: string | null) => void;
    isLoaded: boolean;
    theme: string;
    setTheme: (themeId: string) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

// A key for localStorage
const LOCAL_STORAGE_KEY = 'heru-app-data';

export function GlobalDataProvider({ children }: { children: React.ReactNode }) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => initialTeamMembers);
    const [clients, setClients] = useState<Client[]>(() => initialClients);
    const [tasks, setTasks] = useState<Task[]>(() => initialTasksData);
    const [appointments, setAppointments] = useState<Appointment[]>(() => initialAppointmentsData);
    const [invoicesData, setInvoicesData] = useState<Invoice[]>(() => initialInvoicesData);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setTheme] = useState('red');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load state from localStorage on initial client-side render
    useEffect(() => {
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                if (parsedData.teamMembers) setTeamMembers(parsedData.teamMembers);
                if (parsedData.clients) setClients(parsedData.clients);
                if (parsedData.tasks) setTasks(parsedData.tasks);
                if (parsedData.appointments) setAppointments(parsedData.appointments);
                if (parsedData.invoicesData) setInvoicesData(parsedData.invoicesData);
                if (parsedData.logoSrc) setLogoSrc(parsedData.logoSrc);
                if (parsedData.theme) setTheme(parsedData.theme);
            }
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) { 
            try {
                const dataToStore = JSON.stringify({ teamMembers, clients, tasks, appointments, invoicesData, logoSrc, theme });
                localStorage.setItem(LOCAL_STORAGE_KEY, dataToStore);
            } catch (error) {
                console.error("Failed to save data to localStorage", error);
            }
        }
    }, [teamMembers, clients, tasks, appointments, invoicesData, logoSrc, theme, isLoaded]);

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

    const handleSetTheme = useCallback((themeId: string) => {
        setTheme(themeId);
    }, []);


    return (
        <GlobalDataContext.Provider value={{ teamMembers, addTeamMember, updateTeamMember, clients, addClient, updateClient, tasks, addTask, appointments, invoicesData, logoSrc, setLogoSrc, isLoaded, theme, setTheme: handleSetTheme }}>
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
