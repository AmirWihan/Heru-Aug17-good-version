
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

type UserProfile = (Client | TeamMember) & { authRole: 'admin' | 'lawyer' | 'client' };

interface GlobalDataContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<UserProfile | null>;
    logout: () => void;
    register: (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string }) => Promise<UserProfile | null>;
    teamMembers: TeamMember[];
    clients: Client[];
    tasks: Task[];
    appointments: Appointment[];
    invoicesData: Invoice[];
    notifications: Notification[];
    addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
    updateTeamMember: (updatedMember: TeamMember) => Promise<void>;
    addClient: (client: Omit<Client, 'id'>) => Promise<void>;
    updateClient: (updatedClient: Client) => Promise<void>;
    addTask: (task: Omit<Task, 'id'>) => Promise<void>;
    addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
    updateNotification: (id: number, updates: Partial<Notification>) => void;
    logoSrc: string | null;
    setLogoSrc: (src: string | null) => void;
    isLoaded: boolean;
    theme: string;
    setTheme: (themeId: string) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'heru-ui-prefs';
const AUTH_STORAGE_KEY = 'heru-auth-user';

// This provider uses the static data from data.ts and simulates auth
const StaticDataProvider = ({ children }: { children: ReactNode }) => {
    const [clients, setClients] = useState<Client[]>(staticClients);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(staticTeamMembers);
    const [tasks, setTasks] = useState<Task[]>(staticTasks);
    const [appointments, setAppointments] = useState<Appointment[]>(staticAppointments);
    const [invoicesData] = useState<Invoice[]>(staticInvoices);
    const [notifications, setNotifications] = useState<Notification[]>(staticNotifications);
    
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setTheme] = useState('sky');
    const [isLoaded, setIsLoaded] = useState(false);
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ logoSrc, theme }));
        }
    }, [logoSrc, theme, isLoaded]);
    
    useEffect(() => {
        try {
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                const { logoSrc: storedLogo, theme: storedTheme } = JSON.parse(storedPrefs);
                if (storedLogo) setLogoSrc(storedLogo);
                if (storedTheme) setTheme(storedTheme);
            }
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                setUserProfile(JSON.parse(storedUser));
            }
        } finally {
            setIsLoaded(true);
            setLoading(false);
        }
    }, []);

    const login = async (email: string, pass: string): Promise<UserProfile | null> => {
        const allUsers = [...teamMembers, ...clients];
        const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

        if (foundUser) {
            const authRole = 'caseType' in foundUser ? 'client' : (foundUser.type === 'admin' ? 'admin' : 'lawyer');
            const profile = { ...foundUser, authRole };
            setUserProfile(profile);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
            return profile;
        }
        return null;
    };

    const logout = () => {
        setUserProfile(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const register = async (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string }): Promise<UserProfile | null> => {
        const allUsers = [...teamMembers, ...clients];
        if (allUsers.some(u => u.email.toLowerCase() === details.email?.toLowerCase())) {
            return null; // User already exists
        }

        if (details.role === 'client') {
            const newClient: Client = {
                id: Date.now(),
                name: details.name || '',
                email: details.email || '',
                password: details.password || '',
                uid: `static-${Date.now()}`,
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
                activity: [],
                documents: [],
                tasks: [],
                agreements: [],
                intakeForm: { status: 'not_started' },
            };
            setClients(prev => [...prev, newClient]);
            return { ...newClient, authRole: 'client' };
        }
        // For lawyers, the full profile is created in the onboarding flow.
        // The register function here just creates the initial user record.
        const newLawyer: TeamMember = {
            id: Date.now(),
            name: details.name || '',
            email: details.email || '',
            password: details.password || '',
            uid: `static-${Date.now()}`,
            role: 'Awaiting Onboarding',
            avatar: `https://i.pravatar.cc/150?u=${details.email}`,
            type: 'legal',
            phone: '',
            accessLevel: 'Admin',
            status: 'Pending Activation',
            plan: 'Pro Team',
            location: '',
            yearsOfPractice: 0,
            successRate: 0,
            licenseNumber: '',
            registrationNumber: '',
            stats: [],
            specialties: [],
        };
        setTeamMembers(prev => [...prev, newLawyer]);
        return { ...newLawyer, authRole: 'lawyer' };
    };
    
    const updateClient = async (updatedClient: Client) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    };

    const updateTeamMember = async (updatedMember: TeamMember) => {
        setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    };
    
    const addTask = async (task: Omit<Task, 'id'>) => {
        const newTask = { ...task, id: Date.now() } as Task;
        setTasks(prev => [...prev, newTask]);
    };
    
    const addClient = async (client: Omit<Client, 'id'>) => {
        const newClient = { ...client, id: Date.now() } as Client;
        setClients(prev => [...prev, newClient]);
    };

    const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
        const newMember = { ...member, id: Date.now() } as TeamMember;
        setTeamMembers(prev => [...prev, newMember]);
    };

    const addNotification = async (notification: Omit<Notification, 'id'>) => {
        const newNotification = { ...notification, id: Date.now() } as Notification;
        setNotifications(prev => [newNotification, ...prev]);
    };

    const updateNotification = (id: number, updates: Partial<Notification>) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    return (
        <GlobalDataContext.Provider value={{
            userProfile, loading, login, logout, register,
            teamMembers, clients, tasks, appointments, invoicesData, notifications,
            addTeamMember, updateTeamMember, addClient, updateClient, addTask, addNotification, updateNotification,
            logoSrc, setLogoSrc, isLoaded, theme, setTheme,
        }}>
            {children}
        </GlobalDataContext.Provider>
    );
};


export function GlobalDataProvider({ children }: { children: ReactNode }) {
    // For this prototype, we are forcing the StaticDataProvider with simulated auth.
    return <StaticDataProvider>{children}</StaticDataProvider>;
}

export function useGlobalData() {
    const context = useContext(GlobalDataContext);
    if (context === undefined) {
        throw new Error('useGlobalData must be used within a GlobalDataProvider');
    }
    return context;
}
