
'use client';

import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
    clients as staticClients, 
    teamMembers as staticTeamMembers, 
    tasksData as staticTasks, 
    appointmentsData as staticAppointments, 
    invoicesData as staticInvoices,
    notifications as staticNotifications,
    leadsData as staticLeads,
    clientLeadsData as staticClientLeads,
    type Client, type TeamMember, type Task, type Invoice, type Appointment, type Notification, type IntakeForm, type Lead, type ClientLead,
    type ConnectionRequest
} from '@/lib/data';
import { auth, db, isFirebaseEnabled } from '@/lib/firebase';

// Define a unified UserProfile type
export type UserProfile = (Client | TeamMember) & { authRole: 'admin' | 'lawyer' | 'client' };

type ClientInvitation = {
    email: string;
    invitingLawyerId: number;
}

interface GlobalDataContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<UserProfile | null>;
    logout: () => Promise<void>;
    register: (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string, termsAgreed: boolean, marketingConsent?: boolean }, connectedLawyerId?: number | null) => Promise<UserProfile | null>;
    sendPasswordReset: (email: string) => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    teamMembers: TeamMember[];
    clients: Client[];
    tasks: Task[];
    appointments: Appointment[];
    invoicesData: Invoice[];
    notifications: Notification[];
    leads: Lead[];
    clientLeads: ClientLead[];
    addClientLead: (lead: ClientLead) => void;
    updateClientLead: (updatedLead: ClientLead) => void;
    addLead: (lead: Lead) => void;
    updateLead: (updatedLead: Lead) => void;
    convertLeadToFirm: (leadId: number) => void;
    updateTeamMember: (updatedMember: TeamMember) => void;
    addTeamMember: (member: TeamMember) => void;
    addClient: (client: Client) => void;
    updateClient: (updatedClient: Client) => void;
    addTask: (task: Task) => void;
    addNotification: (notification: Notification) => void;
    updateNotification: (id: number, updates: Partial<Notification>) => void;
    logos: { [key: string]: string };
    setWorkspaceLogo: (key: string, src: string | null) => void;
    isLoaded: boolean;
    theme: string;
    setTheme: (themeId: string) => void;
    sendClientInvitation: (invitation: ClientInvitation) => void;
    consumeClientInvitation: (email: string) => ClientInvitation | null;
    sendConnectionRequest: (clientId: number, request: ConnectionRequest) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'visafor-ui-prefs';

// This component isolates the useAuthState hook so it's only called when Firebase is enabled.
const AuthStateListener = ({ setAuthData }: { setAuthData: Function }) => {
    const [user, loading, error] = useAuthState(auth!);
    
    useEffect(() => {
        setAuthData({ user, loading, error });
    }, [user, loading, error, setAuthData]);

    return null;
}

export function GlobalDataProvider({ children }: { children: ReactNode }) {
    const [authData, setAuthData] = useState<{user: User | null | undefined; loading: boolean; error: Error | undefined}>({
        user: undefined,
        loading: isFirebaseEnabled,
        error: undefined,
    });
    const { user, loading: authLoading } = authData;

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Static data remains for now, will be replaced by Firestore queries later
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(staticTeamMembers);
    const [clients, setClients] = useState<Client[]>(staticClients);
    const [tasks, setTasks] = useState<Task[]>(staticTasks);
    const [appointments, setAppointments] = useState<Appointment[]>(staticAppointments);
    const [invoicesData, setInvoicesData] = useState<Invoice[]>(staticInvoices);
    const [notifications, setNotifications] = useState<Notification[]>(staticNotifications);
    const [leads, setLeads] = useState<Lead[]>(staticLeads);
    const [clientLeads, setClientLeads] = useState<ClientLead[]>(staticClientLeads);
    const [invitations, setInvitations] = useState<ClientInvitation[]>([]);

    const [logos, setLogos] = useState<{ [key: string]: string }>({});
    const [theme, setThemeState] = useState('blue');
    const [isLoaded, setIsLoaded] = useState(false);
    
    const loading = authLoading || loadingProfile;

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
             setLoadingProfile(false);
        };

        if (!authLoading) {
             loadUserProfile();
        }
       
    }, [user, authLoading]);

    const setTheme = useCallback((themeId: string) => {
        setThemeState(themeId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ theme: themeId, logos }));
    }, [logos]);
    
    const setWorkspaceLogo = useCallback((key: string, src: string | null) => {
        setLogos(currentLogos => {
            const newLogos = { ...currentLogos };
            if (src === null) {
                delete newLogos[key];
            } else {
                newLogos[key] = src;
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ theme, logos: newLogos }));
            return newLogos;
        });
    }, [theme]);

    useEffect(() => {
        try {
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                const { theme: storedTheme, logos: storedLogos } = JSON.parse(storedPrefs);
                if (storedTheme) setThemeState(storedTheme);
                if (storedLogos) setLogos(storedLogos);
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
            // Simulate auth for static data
            const lowerCaseEmail = email.toLowerCase();
            let foundProfile: UserProfile | null = null;

            // Prioritize checking for TeamMember (Lawyer/Admin) first
            const foundTeamMember = teamMembers.find(u => u.email.toLowerCase() === lowerCaseEmail);
            if (foundTeamMember && (foundTeamMember.password === pass || pass === 'password123')) {
                const authRole = foundTeamMember.type === 'admin' ? 'admin' : 'lawyer';
                foundProfile = { ...foundTeamMember, authRole };
            }

            // If no lawyer/admin found, check for a Client
            if (!foundProfile) {
                 const foundClient = clients.find(u => u.email.toLowerCase() === lowerCaseEmail);
                 if (foundClient && (foundClient.password === pass || pass === 'password123')) {
                    foundProfile = { ...foundClient, authRole: 'client' };
                }
            }

            if (foundProfile) {
                setUserProfile(foundProfile);
                setLoadingProfile(false);
                return foundProfile;
            }

            // If neither is found, return null
            throw new Error("Invalid credentials.");
        }
    }, [clients, teamMembers]);

    const logout = useCallback(async () => {
        if (isFirebaseEnabled && auth) {
            await signOut(auth);
        }
        setUserProfile(null);
    }, []);

    const sendPasswordReset = useCallback(async (email: string) => {
        if (isFirebaseEnabled && auth) {
            await sendPasswordResetEmail(auth, email);
        } else {
            console.warn("Firebase not configured. Password reset is disabled.");
            // Simulate success in offline mode for UI testing
            return Promise.resolve();
        }
    }, []);

    const register = useCallback(async (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string, termsAgreed: boolean, marketingConsent?: boolean }, connectedLawyerId: number | null = null): Promise<UserProfile | null> => {
        const { email, password, role, fullName, termsAgreed, marketingConsent } = details;
        if (!email || !password || !role || !fullName) {
            throw new Error("Missing details for registration.");
        }
        
        let newProfile: UserProfile;

        const commonData = {
            id: Date.now(),
            name: fullName,
            email: email,
            password: password,
            termsAgreed: termsAgreed,
            marketingConsent: !!marketingConsent,
        };

        if (role === 'client') {
            newProfile = {
                ...commonData,
                authRole: 'client',
                phone: '', caseType: 'Unassigned', status: 'Active', portalStatus: 'Active', lastContact: new Date().toISOString().split('T')[0],
                avatar: `https://i.pravatar.cc/150?u=${email}`, countryOfOrigin: 'Unknown', currentLocation: 'Unknown',
                joined: new Date().toISOString().split('T')[0], age: 0, educationLevel: 'Unknown',
                coins: 25, // Welcome bonus
                onboardingComplete: false, // <-- New flag
                connectedLawyerId: connectedLawyerId,
                connectionRequestFromLawyerId: null,
                caseSummary: { priority: 'Medium', caseType: 'Unassigned', currentStatus: 'New', nextStep: 'Onboarding', dueDate: '' },
                activity: [], documents: [], tasks: [], agreements: [],
                intakeForm: { status: 'not_started' },
            };
            setClients(prev => [...prev, newProfile as Client]);
        } else { // Lawyer
            newProfile = {
                ...commonData,
                authRole: 'lawyer',
                role: 'Awaiting Onboarding',
                avatar: `https://i.pravatar.cc/150?u=${email}`,
                type: 'legal', phone: '', accessLevel: 'Admin', status: 'Pending Activation', plan: 'Pro Team',
                location: 'Unknown', yearsOfPractice: 0, successRate: 0, licenseNumber: '', registrationNumber: '',
                firmName: 'Unknown Firm',
                stats: [], specialties: ['Awaiting Activation'],
                languages: [],
                consultationType: 'Paid'
            };
            setTeamMembers(prev => [...prev, newProfile as TeamMember]);
        }
        
        // Simulate login after registration
        setUserProfile(newProfile);
        
        if (isFirebaseEnabled && auth) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), { ...newProfile, uid: userCredential.user.uid });
        }

        return newProfile;
    }, []);

    const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
        setUserProfile(currentProfile => {
            if (!currentProfile) return null;
            const updatedProfile = { ...currentProfile, ...updates } as UserProfile;
            
            if (isFirebaseEnabled && currentProfile.uid) {
                const userDocRef = doc(db, 'users', currentProfile.uid);
                updateDoc(userDocRef, updates).catch(console.error);
            }
            
            return updatedProfile;
        });
    }, []);

    const addLead = useCallback((lead: Lead) => {
        setLeads(prev => [lead, ...prev]);
    }, []);

    const updateLead = useCallback((updatedLead: Lead) => {
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    }, []);

    const addClientLead = useCallback((lead: ClientLead) => {
        setClientLeads(prev => [lead, ...prev]);
    }, []);

    const updateClientLead = useCallback((updatedLead: ClientLead) => {
        setClientLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    }, []);

    const addTeamMember = useCallback((member: TeamMember) => {
        setTeamMembers(prev => [...prev, member]);
    }, []);

    const addClient = useCallback((client: Client) => {
        setClients(prev => [...prev, client]);
    }, []);

    const updateClient = useCallback((updatedClient: Client) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
        setUserProfile(currentProfile => {
            if (currentProfile && currentProfile.id === updatedClient.id) {
                return { ...currentProfile, ...updatedClient };
            }
            return currentProfile;
        });
    }, []);
    
    const updateTeamMember = useCallback((updatedMember: TeamMember) => {
        setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
        if (userProfile && userProfile.id === updatedMember.id) {
             updateUserProfile(updatedMember as UserProfile);
        }
    }, [userProfile, updateUserProfile]);

    const addTask = useCallback((task: Task) => {
        setTasks(prev => [task, ...prev]);
    }, []);

    const addNotification = useCallback((notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
    }, []);

    const updateNotification = useCallback((id: number, updates: Partial<Notification>) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    }, []);

    const convertLeadToFirm = useCallback((leadId: number) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;

        const newFirm: TeamMember = {
            id: Date.now(),
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            password: 'password123',
            authRole: 'lawyer',
            role: 'Awaiting Verification',
            avatar: lead.avatar || `https://i.pravatar.cc/150?u=${lead.email}`,
            type: 'legal',
            accessLevel: 'Admin',
            status: 'Pending Activation',
            plan: 'Pro Team',
            location: 'Unknown',
            yearsOfPractice: 0,
            successRate: 0,
            licenseNumber: '',
            registrationNumber: '',
            firmName: lead.company,
            stats: [],
            specialties: []
        };

        setTeamMembers(prev => [...prev, newFirm]);
        setLeads(prev => prev.filter(l => l.id !== leadId));
    }, [leads]);
    
    const sendClientInvitation = useCallback((invitation: ClientInvitation) => {
        setInvitations(prev => [...prev, invitation]);
    }, []);
    
    const consumeClientInvitation = useCallback((email: string): ClientInvitation | null => {
        const invitation = invitations.find(inv => inv.email === email);
        if (invitation) {
            setInvitations(prev => prev.filter(inv => inv.email !== email));
            return invitation;
        }
        return null;
    }, [invitations]);

    const sendConnectionRequest = useCallback((clientId: number, request: ConnectionRequest) => {
        const client = clients.find(c => c.id === clientId);
        const lawyer = teamMembers.find(t => t.id === request.lawyerId);

        if (!client || !lawyer) {
            console.error("Client or Lawyer not found for connection request");
            return;
        }

        const newClientLead: ClientLead = {
            id: Date.now(),
            name: client.name,
            email: client.email,
            phone: client.phone,
            status: 'New',
            source: 'Platform Directory',
            owner: { name: lawyer.name, avatar: lawyer.avatar },
            lastContacted: new Date().toISOString(),
            createdDate: new Date().toISOString(),
            avatar: client.avatar,
            activity: [{
                id: Date.now(),
                type: 'Note',
                notes: `Connection request from client. Message: "${request.message}". Proposed meeting: ${request.proposedDate} at ${request.proposedTime}.`,
                date: new Date().toISOString(),
            }]
        };
        setClientLeads(prev => [newClientLead, ...prev]);
        
    }, [clients, teamMembers]);

    return (
        <GlobalDataContext.Provider value={{
            userProfile, loading, login, logout, register, sendPasswordReset, updateUserProfile,
            teamMembers, clients, tasks, appointments, invoicesData, notifications, leads, clientLeads, addClientLead, updateClientLead,
            addLead, updateLead, convertLeadToFirm,
            updateTeamMember, addTeamMember, addClient, updateClient, addTask, addNotification, updateNotification,
            logos, setWorkspaceLogo, isLoaded, theme, setTheme,
            sendClientInvitation, consumeClientInvitation, sendConnectionRequest,
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
