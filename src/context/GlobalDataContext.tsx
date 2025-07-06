'use client';

import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, doc, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseEnabled } from '@/lib/firebase';
import { 
    clients as staticClients, 
    teamMembers as staticTeamMembers, 
    tasksData as staticTasks, 
    appointmentsData as staticAppointments, 
    invoicesData as staticInvoices,
    type Client, type TeamMember, type Task, type Invoice, type Appointment 
} from '@/lib/data';

interface UserProfile {
    uid: string;
    email: string;
    fullName: string;
    role: 'admin' | 'lawyer' | 'client';
    createdAt: string;
}

interface GlobalDataContextType {
    user: typeof auth.currentUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    teamMembers: TeamMember[];
    clients: Client[];
    tasks: Task[];
    appointments: Appointment[];
    invoicesData: Invoice[];
    addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
    updateTeamMember: (updatedMember: TeamMember) => Promise<void>;
    addClient: (client: Omit<Client, 'id'>) => Promise<void>;
    updateClient: (updatedClient: Client) => Promise<void>;
    addTask: (task: Omit<Task, 'id'>) => Promise<void>;
    logoSrc: string | null;
    setLogoSrc: (src: string | null) => void;
    isLoaded: boolean;
    theme: string;
    setTheme: (themeId: string) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'heru-ui-prefs';

// This provider uses the static data from data.ts as a fallback
const StaticDataProvider = ({ children }: { children: ReactNode }) => {
    const [clients, setClients] = useState<Client[]>(staticClients);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(staticTeamMembers);
    const [tasks, setTasks] = useState<Task[]>(staticTasks);
    const [appointments, setAppointments] = useState<Appointment[]>(staticAppointments);
    const [invoicesData] = useState<Invoice[]>(staticInvoices);
    
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setTheme] = useState('red');
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ logoSrc, theme }));
        }
    }, [logoSrc, theme, isLoaded]);
    
    useEffect(() => {
        try {
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                const { logoSrc, theme } = JSON.parse(storedPrefs);
                if (logoSrc) setLogoSrc(logoSrc);
                if (theme) setTheme(theme);
            }
        } finally {
            setIsLoaded(true);
        }
    }, []);

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

    return (
        <GlobalDataContext.Provider value={{
            user: null, userProfile: null, loading: false,
            teamMembers, clients, tasks, appointments, invoicesData,
            addTeamMember, updateTeamMember, addClient, updateClient, addTask,
            logoSrc, setLogoSrc, isLoaded, theme, setTheme,
        }}>
            {children}
        </GlobalDataContext.Provider>
    );
};

// This provider uses Firebase for live data
const FirebaseDataProvider = ({ children }: { children: ReactNode }) => {
    const [user, authLoading] = useAuthState(auth!);
    const [userProfile, profileLoading] = useDocumentData(user ? doc(db!, 'users', user.uid) : null);

    const [clientsCollection, clientsLoading] = useCollection(collection(db!, 'clients'));
    const [teamMembersCollection, teamMembersLoading] = useCollection(collection(db!, 'teamMembers'));
    const [tasksCollection, tasksLoading] = useCollection(collection(db!, 'tasks'));
    const [appointmentsCollection, appointmentsLoading] = useCollection(collection(db!, 'appointments'));
    const [invoicesDataCollection, invoicesLoading] = useCollection(collection(db!, 'invoices'));

    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setTheme] = useState('red');
    const [isLoaded, setIsLoaded] = useState(false);
    
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
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addTeamMember = useCallback(async (member: Omit<TeamMember, 'id'>) => { await addDoc(collection(db!, 'teamMembers'), member); }, []);
    const updateTeamMember = useCallback(async (updatedData: TeamMember) => { const { id, ...data } = updatedData; await updateDoc(doc(db!, 'teamMembers', String(id)), data); }, []);
    const addClient = useCallback(async (client: Omit<Client, 'id'>) => { await addDoc(collection(db!, 'clients'), client); }, []);
    const updateClient = useCallback(async (updatedData: Client) => { const { id, ...data } = updatedData; await updateDoc(doc(db!, 'clients', String(id)), data); }, []);
    const addTask = useCallback(async (task: Omit<Task, 'id'>) => { await addDoc(collection(db!, 'tasks'), task); }, []);
    
    const mappedClients = clientsCollection?.docs.map(d => ({ id: d.id, ...d.data() } as Client)) || [];
    const mappedTeamMembers = teamMembersCollection?.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember)) || [];
    const mappedTasks = tasksCollection?.docs.map(d => ({ id: d.id, ...d.data() } as Task)) || [];
    const mappedAppointments = appointmentsCollection?.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)) || [];
    const mappedInvoices = invoicesDataCollection?.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)) || [];
    
    return (
        <GlobalDataContext.Provider value={{
            user,
            userProfile: userProfile as UserProfile || null,
            loading: authLoading || profileLoading || clientsLoading || teamMembersLoading || tasksLoading || appointmentsLoading || invoicesLoading,
            teamMembers: mappedTeamMembers,
            clients: mappedClients,
            tasks: mappedTasks,
            appointments: mappedAppointments,
            invoicesData: mappedInvoices,
            addTeamMember, updateTeamMember, addClient, updateClient, addTask,
            logoSrc, setLogoSrc, isLoaded, theme, setTheme,
        }}>
            {children}
        </GlobalDataContext.Provider>
    );
};

export function GlobalDataProvider({ children }: { children: ReactNode }) {
    // If Firebase is configured, use the live data provider.
    if (isFirebaseEnabled) {
        return <FirebaseDataProvider>{children}</FirebaseDataProvider>;
    }
    // Otherwise, fall back to the static data provider for a seamless dev experience.
    return <StaticDataProvider>{children}</StaticDataProvider>;
}

export function useGlobalData() {
    const context = useContext(GlobalDataContext);
    if (context === undefined) {
        throw new Error('useGlobalData must be used within a GlobalDataProvider');
    }
    return context;
}
