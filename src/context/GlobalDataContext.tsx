
'use client';

import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { 
    clients as staticClients, 
    teamMembers as staticTeamMembers, 
    tasksData as staticTasks, 
    appointmentsData as staticAppointments, 
    invoicesData as staticInvoices,
    notifications as staticNotifications,
    type Client, type TeamMember, type Task, type Invoice, type Appointment, type Notification,
} from '@/lib/data';
import { auth, db, isFirebaseEnabled } from '@/lib/firebase';

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

// This component isolates the useAuthState hook so it's only called when Firebase is enabled.
const AuthStateListener = ({ setAuthData }: { setAuthData: Function }) => {
    const [user, loading, error] = useAuthState(auth!);
    
    useEffect(() => {
        setAuthData({ user, loading, error });
    }, [user, loading, error, setAuthData]);

    return null;
}

export function GlobalDataProvider({ children }: { children: ReactNode }) {
    const [authData, setAuthData] = useState<{user: User | null; loading: boolean; error: Error | undefined}>({
        user: null,
        loading: !isFirebaseEnabled, // If firebase is not enabled, we are not loading.
        error: undefined,
    });
    const { user, loading: authLoading, error: authError } = authData;

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Static data remains for now, will be replaced by Firestore queries later
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(staticTeamMembers);
    const [clients, setClients] = useState<Client[]>(staticClients);
    const [tasks, setTasks] = useState<Task[]>(staticTasks);
    const [appointments, setAppointments] = useState<Appointment[]>(staticAppointments);
    const [notifications, setNotifications] = useState<Notification[]>(staticNotifications);

    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setThemeState] = useState('blue');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (isFirebaseEnabled && user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                }
            } else if (!isFirebaseEnabled) {
                // In offline mode, login function sets the profile
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        };

        if (!authLoading) {
             loadUserProfile();
        }
       
    }, [user, authLoading]);

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
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                const { theme: storedTheme, logoSrc: storedLogo } = JSON.parse(storedPrefs);
                if (storedTheme) setThemeState(storedTheme);
                if (storedLogo) setLogoSrc(storedLogo);
            }
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const login = useCallback(async (email: string, pass: string): Promise<UserProfile | null> => {
        if (isFirebaseEnabled && auth) {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const profile = userDoc.data() as UserProfile
                setUserProfile(profile);
                return profile;
            }
            return null;
        } else {
             // Fallback to static data for prototype
            const allUsers = [...staticTeamMembers, ...staticClients];
            const foundUser = allUsers.find(
                (u) => u.email?.toLowerCase() === email.toLowerCase() && u.password === pass
            );
            if (foundUser) {
                const isTeamMember = 'accessLevel' in foundUser;
                const isAdmin = isTeamMember && (foundUser as TeamMember).type === 'admin';
                const authRole = isAdmin ? 'admin' : isTeamMember ? 'lawyer' : 'client';
                const profile = { ...foundUser, authRole };
                setUserProfile(profile);
                setLoading(false);
                return profile;
            }
            return null;
        }
    }, []);

    const logout = useCallback(async () => {
        if (isFirebaseEnabled && auth) {
            await signOut(auth);
        }
        setUserProfile(null);
    }, []);

    const register = useCallback(async (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string }): Promise<UserProfile | null> => {
        if (!isFirebaseEnabled || !auth) {
            console.warn("Firebase not configured. Registration is disabled.");
            return null;
        }

        const { email, password, role, fullName } = details;
        if (!email || !password || !role || !fullName) {
            throw new Error("Missing details for registration.");
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        let newProfile: UserProfile;

        if (role === 'client') {
            newProfile = {
                id: Date.now(),
                uid: user.uid,
                name: fullName,
                email: email,
                authRole: 'client',
                phone: '', caseType: 'Unassigned', status: 'Active', lastContact: new Date().toISOString().split('T')[0],
                avatar: `https://i.pravatar.cc/150?u=${email}`, countryOfOrigin: 'Unknown', currentLocation: 'Unknown',
                joined: new Date().toISOString().split('T')[0], age: 0, educationLevel: 'Unknown',
                caseSummary: { priority: 'Medium', caseType: 'Unassigned', currentStatus: 'New', nextStep: 'Onboarding', dueDate: '' },
                activity: [], documents: [], tasks: [], agreements: [],
            };
        } else { // Lawyer
            newProfile = {
                id: Date.now(),
                uid: user.uid,
                name: fullName,
                email: email,
                authRole: 'lawyer',
                role: 'Awaiting Onboarding',
                avatar: `https://i.pravatar.cc/150?u=${email}`,
                type: 'legal', phone: '', accessLevel: 'Admin', status: 'Pending Activation', plan: 'Pro Team',
                location: 'Unknown', yearsOfPractice: 0, successRate: 0, licenseNumber: '', registrationNumber: '',
                stats: [], specialties: ['Awaiting Activation'],
            };
        }

        await setDoc(doc(db, "users", user.uid), newProfile);
        return newProfile;
    }, []);


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
            userProfile, loading: loading || authLoading, login, logout, register,
            teamMembers, clients, tasks, appointments, notifications,
            updateTeamMember, addClient, updateClient, addTask, addNotification, updateNotification,
            logoSrc, setLogoSrc: setAndStoreLogo, isLoaded, theme, setTheme,
        }}>
            {isFirebaseEnabled && <AuthStateListener setAuthData={setAuthData} />}
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
