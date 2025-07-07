
'use client';

import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { 
    clients as staticClients, 
    teamMembers as staticTeamMembers, 
    tasksData as staticTasks, 
    appointmentsData as staticAppointments, 
    invoicesData as staticInvoices,
    notifications as staticNotifications,
    type Client, type TeamMember, type Task, type Invoice, type Appointment, type Notification,
} from '@/lib/data';

// Define a unified UserProfile type
type UserProfile = (Client | TeamMember) & { authRole: 'admin' | 'lawyer' | 'client' };

interface GlobalDataContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<UserProfile | null>;
    logout: () => Promise<void>;
    register: (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string }) => Promise<UserProfile | null>;
    teamMembers: TeamMember[];
    clients: Client[];
    tasks: Task[];
    appointments: Appointment[];
    notifications: Notification[];
    updateTeamMember: (updatedMember: TeamMember) => void;
    addClient: (client: Client) => void;
    updateClient: (updatedClient: Client) => void;
    addTask: (task: Task) => void;
    addNotification: (notification: Notification) => void;
    updateNotification: (id: number, updates: Partial<Notification>) => void;
    logoSrc: string | null;
    setLogoSrc: (src: string | null) => void;
    isLoaded: boolean;
    theme: string;
    setTheme: (themeId: string) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'heru-ui-prefs';

export function GlobalDataProvider({ children }: { children: ReactNode }) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(staticTeamMembers);
    const [clients, setClients] = useState<Client[]>(staticClients);
    const [tasks, setTasks] = useState<Task[]>(staticTasks);
    const [appointments, setAppointments] = useState<Appointment[]>(staticAppointments);
    const [notifications, setNotifications] = useState<Notification[]>(staticNotifications);

    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setThemeState] = useState('sky');
    const [isLoaded, setIsLoaded] = useState(false);

    const setTheme = useCallback((themeId: string) => {
        setThemeState(themeId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ theme: themeId, logoSrc }));
    }, [logoSrc]);
    
    const setAndStoreLogo = useCallback((src: string | null) => {
        setLogoSrc(src);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ theme, logoSrc: src }));
    }, [theme]);

    useEffect(() => {
        try {
            setLoading(true);
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                const { theme: storedTheme, logoSrc: storedLogo } = JSON.parse(storedPrefs);
                if (storedTheme) setThemeState(storedTheme);
                if (storedLogo) setLogoSrc(storedLogo);
            }
            // Simulate session persistence
            const sessionUser = sessionStorage.getItem('heru-user-profile');
            if (sessionUser) {
                setUserProfile(JSON.parse(sessionUser));
            }
        } finally {
            setIsLoaded(true);
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, pass: string): Promise<UserProfile | null> => {
        const allUsers = [...teamMembers, ...clients];
        const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
        
        if (foundUser) {
            let authRole: 'admin' | 'lawyer' | 'client' = 'client'; // Default
            if ('type' in foundUser) { // It's a TeamMember
                authRole = foundUser.type === 'admin' ? 'admin' : 'lawyer';
            }
            
            const profile: UserProfile = { ...foundUser, authRole };
            setUserProfile(profile);
            sessionStorage.setItem('heru-user-profile', JSON.stringify(profile));
            return profile;
        }
        return null;
    }, [teamMembers, clients]);

    const logout = useCallback(async () => {
        setUserProfile(null);
        sessionStorage.removeItem('heru-user-profile');
    }, []);

    const register = useCallback(async (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string }): Promise<UserProfile | null> => {
        const allUsers = [...teamMembers, ...clients];
        const emailExists = allUsers.some(u => u.email.toLowerCase() === details.email?.toLowerCase());
        
        if (emailExists) {
            throw new Error("An account with this email already exists.");
        }

        if (details.role === 'client') {
             const newClient: Client = {
                id: Date.now(),
                name: details.fullName!,
                email: details.email!,
                password: details.password!,
                phone: '',
                caseType: 'Unassigned',
                status: 'Active',
                lastContact: new Date().toISOString().split('T')[0],
                avatar: `https://i.pravatar.cc/150?u=${details.email}`,
                countryOfOrigin: 'Unknown',
                currentLocation: 'Unknown',
                joined: new Date().toISOString().split('T')[0],
                age: 0,
                educationLevel: 'Unknown',
                caseSummary: { priority: 'Medium', caseType: 'Unassigned', currentStatus: 'New', nextStep: 'Onboarding', dueDate: '' },
                activity: [], documents: [], tasks: [], agreements: [],
            };
            setClients(prev => [...prev, newClient]);
            const profile = { ...newClient, authRole: 'client' as const };
            setUserProfile(profile);
            sessionStorage.setItem('heru-user-profile', JSON.stringify(profile));
            return profile;
        } else { // Lawyer
            const newLawyer: TeamMember = {
                id: Date.now(),
                name: details.fullName!,
                email: details.email!,
                password: details.password!,
                role: 'Awaiting Onboarding',
                avatar: `https://i.pravatar.cc/150?u=${details.email}`,
                type: 'legal',
                phone: '',
                accessLevel: 'Admin',
                status: 'Pending Activation',
                plan: 'Pro Team',
                location: 'Unknown',
                yearsOfPractice: 0,
                successRate: 0,
                licenseNumber: '',
                registrationNumber: '',
                stats: [],
                specialties: ['Awaiting Activation'],
            };
            setTeamMembers(prev => [...prev, newLawyer]);
            const profile = { ...newLawyer, authRole: 'lawyer' as const };
            setUserProfile(profile);
            sessionStorage.setItem('heru-user-profile', JSON.stringify(profile));
            return profile;
        }
    }, [teamMembers, clients]);

    const addClient = useCallback((client: Client) => {
        setClients(prev => [...prev, client]);
    }, []);

    const updateClient = useCallback((updatedClient: Client) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    }, []);
    
    const updateTeamMember = useCallback((updatedMember: TeamMember) => {
        setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    }, []);

    const addTask = useCallback((task: Task) => {
        setTasks(prev => [task, ...prev]);
    }, []);

    const addNotification = useCallback((notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
    }, []);

    const updateNotification = useCallback((id: number, updates: Partial<Notification>) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    }, []);

    return (
        <GlobalDataContext.Provider value={{
            userProfile, loading, login, logout, register,
            teamMembers, clients, tasks, appointments, notifications,
            updateTeamMember, addClient, updateClient, addTask, addNotification, updateNotification,
            logoSrc, setLogoSrc: setAndStoreLogo, isLoaded, theme, setTheme,
        }}>
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
