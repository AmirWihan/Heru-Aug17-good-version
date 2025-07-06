'use client';

import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Client, TeamMember, Task, Agreement, Invoice, Appointment } from '@/lib/data';

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
    addTeamMember: (member: Omit<TeamMember, 'id' | 'uid'>) => Promise<void>;
    updateTeamMember: (id: string, updatedMember: Partial<TeamMember>) => Promise<void>;
    addClient: (client: Omit<Client, 'id' | 'uid'>) => Promise<void>;
    updateClient: (id: string, updatedClient: Partial<Client>) => Promise<void>;
    addTask: (task: Omit<Task, 'id'>) => Promise<void>;
    logoSrc: string | null;
    setLogoSrc: (src: string | null) => void;
    isLoaded: boolean;
    theme: string;
    setTheme: (themeId: string) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'heru-ui-prefs';

export function GlobalDataProvider({ children }: { children: ReactNode }) {
    const [user, authLoading] = useAuthState(auth);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const [clients, clientsLoading, clientsError] = useCollection(collection(db, 'clients'));
    const [teamMembers, teamMembersLoading, teamMembersError] = useCollection(collection(db, 'teamMembers'));
    const [tasks, tasksLoading, tasksError] = useCollection(collection(db, 'tasks'));
    const [appointments, appointmentsLoading, appointmentsError] = useCollection(collection(db, 'appointments'));
    const [invoicesData, invoicesLoading, invoicesError] = useCollection(collection(db, 'invoices'));

    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setTheme] = useState('red');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            const fetchUserProfile = async () => {
                setProfileLoading(true);
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserProfile(userDocSnap.data() as UserProfile);
                } else {
                    // Handle case where user exists in Auth but not Firestore
                    setUserProfile(null);
                }
                setProfileLoading(false);
            };
            fetchUserProfile();
        } else if (!authLoading && !user) {
            setUserProfile(null);
            setProfileLoading(false);
        }
    }, [user, authLoading]);

    useEffect(() => {
        try {
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                const { logoSrc, theme } = JSON.parse(storedPrefs);
                if (logoSrc) setLogoSrc(logoSrc);
                if (theme) setTheme(theme);
            }
        } catch (error) {
            console.error("Failed to load UI preferences from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded) {
            try {
                const prefsToStore = JSON.stringify({ logoSrc, theme });
                localStorage.setItem(LOCAL_STORAGE_KEY, prefsToStore);
            } catch (error) {
                console.error("Failed to save UI preferences to localStorage", error);
            }
        }
    }, [logoSrc, theme, isLoaded]);

    const addTeamMember = useCallback(async (member: Omit<TeamMember, 'id'>) => {
        await addDoc(collection(db, 'teamMembers'), member);
    }, []);
    const updateTeamMember = useCallback(async (id: string, updatedData: Partial<TeamMember>) => {
        await updateDoc(doc(db, 'teamMembers', id), updatedData);
    }, []);
    const addClient = useCallback(async (client: Omit<Client, 'id'>) => {
        await addDoc(collection(db, 'clients'), client);
    }, []);
    const updateClient = useCallback(async (id: string, updatedData: Partial<Client>) => {
        await updateDoc(doc(db, 'clients', id), updatedData);
    }, []);
    const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
        await addDoc(collection(db, 'tasks'), task);
    }, []);

    const handleSetTheme = useCallback((themeId: string) => {
        setTheme(themeId);
    }, []);

    const mappedClients = clients?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)) || [];
    const mappedTeamMembers = teamMembers?.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)) || [];
    const mappedTasks = tasks?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)) || [];
    const mappedAppointments = appointments?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)) || [];
    const mappedInvoices = invoicesData?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice)) || [];

    return (
        <GlobalDataContext.Provider value={{
            user,
            userProfile,
            loading: authLoading || profileLoading || clientsLoading || teamMembersLoading,
            teamMembers: mappedTeamMembers,
            clients: mappedClients,
            tasks: mappedTasks,
            appointments: mappedAppointments,
            invoicesData: mappedInvoices,
            addTeamMember,
            updateTeamMember,
            addClient,
            updateClient,
            addTask,
            logoSrc,
            setLogoSrc,
            isLoaded,
            theme,
            setTheme: handleSetTheme,
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
