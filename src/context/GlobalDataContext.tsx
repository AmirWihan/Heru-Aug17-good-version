
'use client';

import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { isFirebaseEnabled, auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User as FirebaseAuthUser } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, writeBatch, Unsubscribe } from 'firebase/firestore';

import type { Client, TeamMember, Task, Invoice, Appointment, Notification } from '@/lib/data';

// Define a unified UserProfile type
type UserProfile = (Client | TeamMember) & { authRole: 'admin' | 'lawyer' | 'client' };

interface GlobalDataContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<FirebaseAuthUser | null>;
    logout: () => Promise<void>;
    register: (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string }) => Promise<FirebaseAuthUser | null>;
    teamMembers: TeamMember[];
    clients: Client[];
    tasks: Task[];
    appointments: Appointment[];
    notifications: Notification[];
    updateTeamMember: (updatedMember: TeamMember) => Promise<void>;
    addClient: (client: Omit<Client, 'id' | 'password' | 'uid' | 'avatar'>) => Promise<void>;
    updateClient: (updatedClient: Client) => Promise<void>;
    addTask: (task: Omit<Task, 'id'>) => Promise<void>;
    addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
    updateNotification: (id: number | string, updates: Partial<Notification>) => Promise<void>;
    logoSrc: string | null;
    setLogoSrc: (src: string | null) => void;
    isLoaded: boolean;
    theme: string;
    setTheme: (themeId: string) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'heru-ui-prefs';

const FirebaseProvider = ({ children }: { children: ReactNode }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [theme, setThemeState] = useState('sky');
    const [isLoaded, setIsLoaded] = useState(false);

    const setTheme = useCallback((themeId: string) => {
        setThemeState(themeId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ theme: themeId }));
    }, []);

    useEffect(() => {
        try {
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                const { theme: storedTheme } = JSON.parse(storedPrefs);
                if (storedTheme) setThemeState(storedTheme);
            }
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isFirebaseEnabled) {
            setLoading(false);
            console.error("Firebase is not configured. App will not function correctly.");
            return;
        }

        const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const authRole = userData.role as 'admin' | 'lawyer' | 'client';
                    
                    let profileCollectionName = '';
                    if (authRole === 'admin' || authRole === 'lawyer') {
                        profileCollectionName = 'teamMembers';
                    } else {
                        profileCollectionName = 'clients';
                    }

                    const profileDocRef = doc(db, profileCollectionName, user.uid);
                    const profileDoc = await getDoc(profileDocRef);

                    if(profileDoc.exists()) {
                         setUserProfile({ ...profileDoc.data() as any, authRole, uid: user.uid });
                    } else {
                        // Handle case where user exists in auth but not in profile collections
                        setUserProfile(null);
                    }
                } else {
                     setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        
        const unsubscribers: Unsubscribe[] = [];
        if(isFirebaseEnabled) {
            unsubscribers.push(onSnapshot(collection(db, 'teamMembers'), snapshot => setTeamMembers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TeamMember)))));
            unsubscribers.push(onSnapshot(collection(db, 'clients'), snapshot => setClients(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client)))));
            unsubscribers.push(onSnapshot(collection(db, 'tasks'), snapshot => setTasks(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task)))));
            unsubscribers.push(onSnapshot(collection(db, 'appointments'), snapshot => setAppointments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment)))));
            unsubscribers.push(onSnapshot(collection(db, 'notifications'), snapshot => setNotifications(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Notification)))));
        }

        return () => {
            authUnsubscribe();
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    const login = async (email: string, pass: string) => {
        if (!isFirebaseEnabled) return null;
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    };

    const logout = async () => {
        if (!isFirebaseEnabled) return;
        await signOut(auth);
        setUserProfile(null);
    };

    const register = async (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string }) => {
        if (!isFirebaseEnabled || !details.email || !details.password || !details.fullName) return null;
        
        const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
        const user = userCredential.user;
        
        const batch = writeBatch(db);

        // Create base user document
        const userDocRef = doc(db, "users", user.uid);
        batch.set(userDocRef, {
            uid: user.uid,
            email: details.email,
            fullName: details.fullName,
            role: details.role
        });

        // Create role-specific profile document
        if (details.role === 'client') {
            const clientDocRef = doc(db, "clients", user.uid);
            const newClient: Omit<Client, 'id'> = {
                uid: user.uid,
                name: details.fullName,
                email: details.email,
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
                intakeForm: { status: 'not_started' },
            };
            batch.set(clientDocRef, newClient);
        } else { // lawyer
            const lawyerDocRef = doc(db, "teamMembers", user.uid);
            const newLawyer: Omit<TeamMember, 'id'> = {
                uid: user.uid,
                name: details.fullName,
                email: details.email,
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
             batch.set(lawyerDocRef, newLawyer);
        }
        
        await batch.commit();
        return user;
    };
    
    const updateClient = async (updatedClient: Client) => {
        if (!isFirebaseEnabled) return;
        const clientRef = doc(db, 'clients', updatedClient.uid as string);
        await updateDoc(clientRef, { ...updatedClient });
    };

    const updateTeamMember = async (updatedMember: TeamMember) => {
        if (!isFirebaseEnabled) return;
        const memberRef = doc(db, 'teamMembers', updatedMember.uid as string);
        await updateDoc(memberRef, { ...updatedMember });
    };
    
    const addTask = async (task: Omit<Task, 'id'>) => {
        if (!isFirebaseEnabled) return;
        await addDoc(collection(db, 'tasks'), task);
    };
    
    const addClient = async (client: Omit<Client, 'id' | 'password' | 'uid' | 'avatar'>) => {
        if (!isFirebaseEnabled) return;
        await addDoc(collection(db, 'clients'), client);
    };

    const addNotification = async (notification: Omit<Notification, 'id'>) => {
        if (!isFirebaseEnabled) return;
        await addDoc(collection(db, 'notifications'), notification);
    };

    const updateNotification = async (id: number | string, updates: Partial<Notification>) => {
        if (!isFirebaseEnabled) return;
        const notifRef = doc(db, 'notifications', id.toString());
        await updateDoc(notifRef, updates);
    };


    return (
        <GlobalDataContext.Provider value={{
            userProfile, loading, login, logout, register,
            teamMembers, clients, tasks, appointments, notifications,
            updateTeamMember, addClient, updateClient, addTask, addNotification, updateNotification,
            logoSrc, setLogoSrc, isLoaded, theme, setTheme,
        }}>
            {children}
        </GlobalDataContext.Provider>
    );
};


export function GlobalDataProvider({ children }: { children: ReactNode }) {
    return <FirebaseProvider>{children}</FirebaseProvider>;
}

export function useGlobalData() {
    const context = useContext(GlobalDataContext);
    if (context === undefined) {
        throw new Error('useGlobalData must be used within a GlobalDataProvider');
    }
    return context;
}
