
'use client';

import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
// Firebase is completely disabled in offline mode
// All Firebase logic removed. Only offline logic remains.

import {
    clients as staticClients,
    teamMembers as staticTeamMembers,
    tasksData as staticTasks,
    appointmentsData as staticAppointments,
    invoicesData as staticInvoices,
    notifications as staticNotifications,
    leadsData as staticLeads,
    clientLeadsData as staticClientLeads,
    type Client,
    type TeamMember,
    type Task,
    type Appointment,
    type Invoice,
    type Notification,
    type Lead,
    type ClientLead,
    type ConnectionRequest
} from '@/lib/data';

// Type for User when Firebase is disabled
type User = any;

// Define a unified UserProfile type
export type UserProfile = (Client | TeamMember) & { authRole: 'admin' | 'lawyer' | 'client' | 'superadmin' };

type ClientInvitation = {
    email: string;
    invitingLawyerId: number;
}

interface GlobalDataContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<UserProfile | null>;
    logout: () => Promise<void>;
    register: (details: {
    role: 'client' | 'lawyer',
    password?: string,
    fullName?: string,
    email?: string,
    termsAgreed: boolean,
    marketingConsent?: boolean,
    firmName?: string,
    firmAction?: 'register' | 'activation' | 'request_activation',
    serviceLanguages?: string[],
    address?: string,
    website?: string,
    numberOfEmployees?: string,
    idCardUrl?: string,
    idCard?: any
}, connectedLawyerId?: number | null) => Promise<UserProfile | null>;
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

// This component is disabled in offline mode
const AuthStateListener = ({ setAuthData }: { setAuthData: Function }) => {
    useEffect(() => {
        // In offline mode, set default values
        setAuthData({ user: null, loading: false, error: undefined });
    }, [setAuthData]);

    return null;
}

export function GlobalDataProvider({ children }: { children: ReactNode }) {
    const [authData, setAuthData] = useState<{user: User | null | undefined; loading: boolean; error: Error | undefined}>({
        user: undefined,
        loading: false, // Offline mode, no loading from Firebase
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
    console.log('🔄 Loading state:', { authLoading, loadingProfile, loading });

    useEffect(() => {
        const loadUserProfile = async () => {
            console.log('🔄 Loading user profile...', { user: !!user, authLoading });
            
            // In offline mode, login function sets the profile
            console.log('📱 Offline mode - login function will set profile');
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
        console.log('🔧 Login function called with:', { email, pass });
        
        // Simulate auth for static data
        const lowerCaseEmail = email.toLowerCase();
        console.log('🔍 Searching for email:', lowerCaseEmail);
        console.log('👥 Available clients:', clients.map(c => c.email));
        console.log('👨‍💼 Available team members:', teamMembers.map(t => t.email));
        
        // Prioritize finding the user by email first, regardless of array order
        const foundClient = clients.find(u => u.email.toLowerCase() === lowerCaseEmail);
        if (foundClient) {
            console.log('✅ Found client:', foundClient.name);
            if (foundClient.password === pass || pass === 'password123') {
                const profile = { ...foundClient, authRole: 'client' as const };
                console.log('🎉 Client login successful:', profile);
                setUserProfile(profile);
                setLoadingProfile(false);
                console.log('✅ Loading profile set to false for client');
                return profile;
            } else {
                console.log('❌ Client password mismatch');
                throw new Error("Invalid credentials.");
            }
        }

        const foundTeamMember = teamMembers.find(u => u.email.toLowerCase() === lowerCaseEmail);
        if (foundTeamMember) {
            console.log('✅ Found team member:', foundTeamMember.name);
            if (foundTeamMember.password === pass || pass === 'password123') {
                let authRole: 'admin' | 'lawyer' | 'superadmin';
                
                // Check for super admin by email
                if (foundTeamMember.email === 'admin@heru.com') {
                    authRole = 'superadmin';
                } else if (foundTeamMember.type === 'admin') {
                    authRole = 'admin';
                } else {
                    authRole = 'lawyer';
                }
                
                const profile = { ...foundTeamMember, authRole };
                console.log('🎉 Team member login successful:', profile);
                setUserProfile(profile);
                setLoadingProfile(false);
                console.log('✅ Loading profile set to false for team member');
                return profile;
            } else {
                console.log('❌ Team member password mismatch');
                 throw new Error("Invalid credentials.");
            }
        }

        console.log('❌ No user found with email:', lowerCaseEmail);
        throw new Error("Invalid credentials.");
    }, [clients, teamMembers]);

    const logout = useCallback(async () => {
        setUserProfile(null);
    }, []);

    const sendPasswordReset = useCallback(async (email: string) => {
        console.warn("Firebase not configured. Password reset is disabled.");
        // Simulate success in offline mode for UI testing
        return Promise.resolve();
    }, []);

    const register = useCallback(async (details: Omit<Partial<UserProfile>, 'authRole'> & { role: 'client' | 'lawyer', password?: string, fullName?: string, email?: string, termsAgreed: boolean, marketingConsent?: boolean }, connectedLawyerId: number | null = null): Promise<UserProfile | null> => {
        console.log('🔍 Register function called with details:', details);
        const { email, password, role, fullName, termsAgreed, marketingConsent } = details;
        if (!email || !password || !role || !fullName) {
            console.error('❌ Missing details for registration:', { email, password, role, fullName });
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
                id: commonData.id,
                name: commonData.name,
                email: commonData.email,
                password: commonData.password,
                authRole: 'lawyer',
                role: 'Awaiting Onboarding',
                avatar: `https://i.pravatar.cc/150?u=${email}`,
                type: 'legal', phone: '', accessLevel: 'Admin', status: 'awaiting_approval', plan: 'Pro Team',
                location: 'Unknown', yearsOfPractice: 0, successRate: 0, licenseNumber: '', registrationNumber: '',
                firmName: (details as any).firmName || 'Unknown Firm',
                firmAction: (details as any).firmAction || 'register',
                serviceLanguages: (details as any).serviceLanguages || [],
                stats: [], specialties: ['Awaiting Activation'],
                languages: (details as any).serviceLanguages || [],
                consultationType: 'Paid',
                idCardUrl: (details as any).idCardUrl || undefined
            } as TeamMember & { authRole: 'lawyer' };
            setTeamMembers(prev => [...prev, newProfile as TeamMember]);
        }
        
        // Simulate login after registration
        console.log('📝 Setting user profile:', newProfile);
        setUserProfile(newProfile);
        
        return newProfile;
    }, []);

    const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
        setUserProfile(currentProfile => {
            if (!currentProfile) return null;
            const updatedProfile = { ...currentProfile, ...updates } as UserProfile;
            
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
                    // Firebase is disabled - no team member updates
    }, []);

    const addClient = useCallback((client: Client) => {
        setClients(prev => [...prev, client]);
    }, []);

    const updateClient = useCallback((updatedClient: Client) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
        setUserProfile(currentProfile => {
            if (currentProfile && currentProfile.id === updatedClient.id) {
                // Only merge if currentProfile is a Client or TeamMember
                let merged = { ...currentProfile, ...updatedClient };
                // Ensure status is only set to allowed values for both Client and TeamMember
                const allowedStatus = ['Active', 'Blocked', 'On-hold', 'Closed'];
                if (
                    (currentProfile as any).status !== undefined &&
                    !allowedStatus.includes(updatedClient.status as string)
                ) {
                    merged.status = 'Active'; // fallback to a safe default
                }
                // Remove superadmin from authRole if present
                if (merged.authRole === 'superadmin') {
                    merged.authRole = currentProfile.authRole;
                }
                return merged as UserProfile;
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
            languages: [],
            consultationType: 'Paid',
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
            {/* AuthStateListener is removed as Firebase is disabled */}
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
