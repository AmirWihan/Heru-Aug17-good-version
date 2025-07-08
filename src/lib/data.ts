
import { FileText, Phone, Landmark, CalendarCheck, FileType, FileSignature, FileHeart, Briefcase, GraduationCap, Users, Home, MessageSquare, CheckSquare, Upload, Mail, Video, UserPlus, Zap, Target, Handshake, BriefcaseBusiness, Bell, LineChart, Newspaper, MapPin, Anchor, Heart, Mountain, Shield, FileArchive, Globe } from "lucide-react";
import type { SuccessPredictorOutput } from "@/ai/flows/success-predictor";
import type { IntakeFormAnalysis } from "@/ai/flows/intake-form-analyzer";

export type Task = {
    id: number;
    title: string;
    description?: string;
    client: {
        id: number;
        name: string;
        avatar: string;
    };
    assignedTo: {
        name: string;
        avatar: string;
    };
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'To Do' | 'In Progress' | 'Completed';
};

export type PlatformTask = {
    id: number;
    title: string;
    description?: string;
    assignedTo: {
        name: string;
        avatar: string;
    };
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'To Do' | 'In Progress' | 'Completed';
};

export type Notification = {
    id: number;
    date: string;
    title: string;
    message: string;
    target: 'All Users' | 'Lawyers' | 'Clients';
    isRead: boolean;
    isDeleted?: boolean;
};

export type ClientDocument = {
    id: number;
    title: string;
    category: string;
    dateAdded: string;
    status: 'Uploaded' | 'Pending Review' | 'Approved' | 'Rejected' | 'Requested' | 'Pending Client Review';
    type: 'form' | 'supporting';
    submissionGroup?: 'Main Form' | 'Supporting Document' | 'Additional Document';
    isAiFilled?: boolean;
    url?: string;
    comments?: {
        id: number;
        author: string;
        text: string;
        timestamp: string;
        avatar?: string;
    }[];
};

export type Agreement = {
    id: number;
    title: string;
    status: 'Active' | 'Completed' | 'Terminated' | 'Pending Signature' | 'Signed';
    dateSigned: string;
    documentUrl?: string; // Main agreement document
    relatedDocuments: {
        id: number;
        title: string;
        dateAdded: string;
        url?: string;
    }[];
    relatedInvoiceIds: string[];
}

type FamilyMember = {
    fullName: string;
    relationship: string;
    dateOfBirth: string;
    countryOfBirth: string;
    currentAddress: string;
    occupation: string;
};

export type IntakeFormData = {
  personal: {
    fullName: string;
    dateOfBirth: string;
    countryOfBirth: string;
    countryOfCitizenship: string;
    passportNumber: string;
    passportExpiry: string;
    height: string;
    eyeColor: string;
    contact: {
        email: string;
        phone: string;
        address: string;
    }
  };
  family: {
    maritalStatus: 'Single' | 'Married' | 'Common-Law' | 'Divorced' | 'Widowed';
    spouse?: FamilyMember;
    mother?: FamilyMember;
    father?: FamilyMember;
    children?: FamilyMember[];
    siblings?: FamilyMember[];
  };
  education: Array<{
    institution: string;
    degree: string;
    yearCompleted: string;
    countryOfStudy: string;
  }>;
  studyDetails?: {
    schoolName: string;
    programName: string;
    dliNumber: string;
    tuitionFee: string;
    livingExpenses: string;
  };
  workHistory: Array<{
    company: string;
    position: string;
    duration: string;
    country: string;
  }>;
  languageProficiency: {
    englishScores?: { listening: number; reading: number; writing: number; speaking: number; };
    frenchScores?: { listening: number; reading: number; writing: number; speaking: number; };
  };
  travelHistory: Array<{
    country: string;
    purpose: string;
    duration: string;
    year: string;
  }>;
  immigrationHistory: {
    previouslyApplied: 'yes' | 'no';
    previousApplicationDetails?: string;
    wasRefused: 'yes' | 'no';
    refusalDetails?: string;
  };
  admissibility: {
    hasCriminalRecord: 'yes' | 'no';
    criminalRecordDetails?: string;
    hasMedicalIssues: 'yes' | 'no';
    medicalIssuesDetails?: string;
    hasOverstayed: 'yes' | 'no';
    overstayDetails?: string;
  };
};

export type IntakeForm = {
    status: 'not_started' | 'in_progress' | 'submitted' | 'reviewed';
    data?: IntakeFormData;
    analysis?: IntakeFormAnalysis;
    flaggedQuestions?: string[];
};

export type Client = {
    id: number;
    name: string;
    email: string;
    phone: string;
    password?: string;
    uid?: string;
    caseType: string;
    status: 'Active' | 'On-hold' | 'Closed' | 'Blocked';
    lastContact: string;
    avatar: string;
    countryOfOrigin: string;
    currentLocation: string;
    joined: string;
    age: number;
    educationLevel: string;
    caseSummary: {
        priority: string;
        caseType: string;
        currentStatus: string;
        nextStep: string;
        dueDate: string;
    };
    activity: {
        id: number;
        title: string;
        description: string;
        timestamp: string;
        teamMember?: { name: string; avatar: string; };
    }[];
    documents: ClientDocument[];
    tasks: Task[];
    analysis?: SuccessPredictorOutput;
    agreements: Agreement[];
    intakeForm?: IntakeForm;
};

export type SocialLink = {
    platform: 'linkedin' | 'twitter' | 'website';
    url: string;
};

export type TeamMember = {
    id: number;
    name: string;
    role: string;
    avatar: string;
    type: 'legal' | 'sales' | 'advisor' | 'admin';
    email: string;
    password?: string;
    uid?: string;
    phone: string;
    accessLevel: 'Admin' | 'Member' | 'Viewer';
    status: 'Active' | 'Pending Activation' | 'Suspended' | 'Blocked' | 'Rejected';
    plan: 'Starter' | 'Pro Team' | 'Enterprise' | 'N/A';
    billingCycle?: 'monthly' | 'annually';
    location: string;
    yearsOfPractice: number;
    successRate: number;
    licenseNumber: string;
    registrationNumber: string;
    firmName?: string;
    firmAddress?: string;
    numEmployees?: number;
    firmWebsite?: string;
    stats: {
        label: string;
        value: string;
    }[];
    specialties: string[];
    gallery?: {
        id: number;
        src: string;
        alt: string;
        dataAiHint: string;
    }[];
    socials?: SocialLink[];
};

export type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified';
    source: string;
    owner: { name: string; avatar: string; };
    lastContacted: string;
    createdDate: string;
    avatar?: string;
    activity?: {
        id: number;
        type: 'Call' | 'Email' | 'Note';
        notes: string;
        date: string;
    }[];
};

export const teamMembers: TeamMember[] = [
    {
        id: 1, name: 'Sarah Johnson', role: 'Senior Immigration Lawyer', avatar: 'https://i.pravatar.cc/150?u=sarah', type: 'legal',
        email: 'sarah.j@heru.com', phone: '+1-202-555-0101', password: 'password123', uid: 'static-sarah', accessLevel: 'Admin', status: 'Active', plan: 'Pro Team', billingCycle: 'annually',
        location: 'Toronto, ON', yearsOfPractice: 12, successRate: 96, licenseNumber: 'LSO-P67890', registrationNumber: 'ICCRC-R45678',
        firmName: 'Johnson Legal',
        firmAddress: '789 Bay Street, Toronto, ON M5G 2C2',
        numEmployees: 8,
        firmWebsite: 'https://johnsonlegal.ca',
        stats: [{ label: 'Clients', value: '72' }, { label: 'Revenue', value: '$340k' }, { label: 'Success Rate', value: '96%' }, { label: 'Active Cases', value: '15' }],
        specialties: ['Express Entry', 'PNP', 'Family Sponsorship', 'Court Representation', 'Post-Landing Services'],
        gallery: [
            { id: 1, src: 'https://placehold.co/600x400.png', alt: 'Community workshop event', dataAiHint: 'community workshop' },
            { id: 2, src: 'https://placehold.co/600x400.png', alt: 'Team photo at a conference', dataAiHint: 'professional team' },
            { id: 3, src: 'https://placehold.co/600x400.png', alt: 'Client success celebration', dataAiHint: 'happy client' },
            { id: 4, src: 'https://placehold.co/600x400.png', alt: 'Charity run event', dataAiHint: 'charity event' },
        ],
        socials: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjohnson' },
            { platform: 'twitter', url: 'https://twitter.com/sjohnsonlegal' },
            { platform: 'website', url: 'https://johnsonlegal.ca' },
        ]
    },
    {
        id: 10,
        name: 'Super Admin',
        role: 'Super Admin',
        avatar: 'https://i.pravatar.cc/150?u=superadmin',
        type: 'admin',
        email: 'admin@heru.com',
        phone: '+1-555-0100',
        password: 'password123',
        uid: 'static-superadmin',
        accessLevel: 'Admin',
        status: 'Active',
        plan: 'Enterprise',
        location: 'Platform',
        yearsOfPractice: 0,
        successRate: 0,
        licenseNumber: 'N/A',
        registrationNumber: 'N/A',
        firmName: 'Heru Platform',
        firmAddress: '123 Cloud St, Internet',
        numEmployees: 1,
        firmWebsite: 'https://heru.com',
        stats: [],
        specialties: ['Platform Management']
    },
    {
        id: 9,
        name: 'Dr. Evelyn Reed',
        role: 'Awaiting Verification',
        avatar: 'https://i.pravatar.cc/150?u=evelynreed',
        type: 'legal',
        email: 'e.reed@innovatelegal.com',
        password: 'password123',
        uid: 'static-ereed',
        phone: '+1-555-0123',
        accessLevel: 'Admin',
        status: 'Pending Activation',
        plan: 'Enterprise',
        billingCycle: 'annually',
        location: 'Montreal, QC',
        yearsOfPractice: 15,
        successRate: 0,
        licenseNumber: 'LSM-E98765',
        registrationNumber: 'CICC-E54321',
        firmName: 'Innovate Legal',
        firmAddress: '456 Rue de la Gauchetière, Montréal, QC H2Z 1X5',
        numEmployees: 12,
        firmWebsite: 'https://innovatelegal.com',
        stats: [
            { label: 'Clients', value: '0' },
            { label: 'Revenue', value: '$0' },
            { label: 'Success Rate', value: 'N/A' },
            { label: 'Rating', value: 'N/A' }
        ],
        specialties: ['Awaiting Activation']
    },
    {
        id: 8,
        name: 'Test Lawyer Account',
        role: 'Awaiting Verification',
        avatar: 'https://i.pravatar.cc/150?u=testlawyer',
        type: 'legal',
        email: 'test.lawyer@example.com',
        password: 'password123',
        uid: 'static-testlawyer',
        phone: '+1-555-0199',
        accessLevel: 'Member',
        status: 'Pending Activation',
        plan: 'Pro Team',
        billingCycle: 'monthly',
        location: 'Ottawa, ON',
        yearsOfPractice: 0,
        successRate: 0,
        licenseNumber: 'LSO-T12345',
        registrationNumber: 'CICC-T54321',
        firmName: 'Test Firm LLP',
        firmAddress: '1 Test Street, Ottawa, ON',
        numEmployees: 1,
        firmWebsite: 'https://testfirm.com',
        stats: [
            { label: 'Clients', value: '0' },
            { label: 'Revenue', value: '$0' },
            { label: 'Success Rate', value: 'N/A' },
            { label: 'Rating', value: 'N/A' }
        ],
        specialties: ['Awaiting Activation']
    },
    {
        id: 2, name: 'Michael Chen', role: 'Immigration Consultant', avatar: 'https://i.pravatar.cc/150?u=michaelchen', type: 'legal',
        email: 'michael.c@heru.com', phone: '+1-202-555-0102', password: 'password123', uid: 'static-michael', accessLevel: 'Member', status: 'Active', plan: 'Pro Team', billingCycle: 'monthly',
        location: 'Vancouver, BC', yearsOfPractice: 8, successRate: 89, licenseNumber: 'BC-L-11223', registrationNumber: 'ICCRC-R56789',
        firmName: 'Chen & Associates',
        firmAddress: '1055 W Georgia St, Vancouver, BC V6E 3P3',
        numEmployees: 5,
        firmWebsite: 'https://chenassociates.com',
        stats: [{ label: 'Clients', value: '45' }, { label: 'Revenue', value: '$210k' }, { label: 'Success Rate', value: '89%' }, { label: 'Active Cases', value: '11' }],
        specialties: ['Student Visas', 'Work Permits', 'Visitor Visas', 'Post-Landing Services']
    },
    {
        id: 3, name: 'Sophia Williams', role: 'Immigration Paralegal', avatar: 'https://i.pravatar.cc/150?u=sophia', type: 'legal',
        email: 'sophia.w@heru.com', phone: '+1-202-555-0103', password: 'password123', uid: 'static-sophia', accessLevel: 'Member', status: 'Suspended', plan: 'Starter', billingCycle: 'monthly',
        firmName: 'Johnson Legal',
        firmAddress: '789 Bay Street, Toronto, ON M5G 2C2',
        numEmployees: 8,
        firmWebsite: 'https://johnsonlegal.ca',
        location: 'Toronto, ON', yearsOfPractice: 5, successRate: 92, licenseNumber: 'LSO-PL-33445', registrationNumber: 'ICCRC-R67890',
        stats: [{ label: 'Clients', value: '38' }, { label: 'Revenue', value: '$95k' }, { label: 'Success Rate', value: '92%' }, { label: 'Active Cases', value: '8' }],
        specialties: ['Document Review', 'Application Filing', 'Client Communication', 'Legal Aid']
    },
    {
        id: 4, name: 'David Rodriguez', role: 'Immigration Lawyer', avatar: 'https://i.pravatar.cc/150?u=david', type: 'legal',
        email: 'david.r@heru.com', phone: '+1-202-555-0104', password: 'password123', uid: 'static-david', accessLevel: 'Admin', status: 'Active', plan: 'Enterprise', billingCycle: 'annually',
        location: 'Calgary, AB', yearsOfPractice: 7, successRate: 94, licenseNumber: 'LSA-P12345', registrationNumber: 'ICCRC-R54321',
        firmName: 'Rodriguez Immigration Law',
        firmAddress: '333 7 Ave SW, Calgary, AB T2P 2Z1',
        numEmployees: 3,
        firmWebsite: 'https://rodriguezlaw.ca',
        stats: [{ label: 'Clients', value: '51' }, { label: 'Revenue', value: '$280k' }, { label: 'Success Rate', value: '94%' }, { label: 'Active Cases', value: '12' }],
        specialties: ['Case Management', 'Client Onboarding', 'Task Coordination', 'Business Immigration', 'Court Representation'],
        gallery: [
            { id: 1, src: 'https://placehold.co/600x400.png', alt: 'Networking event', dataAiHint: 'networking event' },
            { id: 2, src: 'https://placehold.co/600x400.png', alt: 'Legal seminar', dataAiHint: 'legal seminar' },
        ]
    },
    {
        id: 5, name: 'Jessica Miller', role: 'Sales Lead', avatar: 'https://i.pravatar.cc/150?u=jessica', type: 'sales',
        email: 'jessica.m@heru.com', phone: '+1-202-555-0105', password: 'password123', uid: 'static-jessica', accessLevel: 'Member', status: 'Active', plan: 'N/A', location: 'Remote',
        yearsOfPractice: 0, successRate: 0, licenseNumber: 'N/A', registrationNumber: 'N/A',
        stats: [], specialties: []
    },
    {
        id: 6, name: 'Chris Davis', role: 'Marketing Advisor', avatar: 'https://i.pravatar.cc/150?u=chris', type: 'advisor',
        email: 'chris.d@heru.com', phone: '+1-202-555-0106', password: 'password123', uid: 'static-chris', accessLevel: 'Member', status: 'Active', plan: 'N/A', location: 'Remote',
        yearsOfPractice: 0, successRate: 0, licenseNumber: 'N/A', registrationNumber: 'N/A',
        stats: [], specialties: []
    },
];

export const tasksData: Task[] = [
    {
        id: 1,
        title: 'Follow up on document submission',
        description: 'Client Adebola Okonjo has submitted documents. Please review for completeness and accuracy.',
        client: { id: 1, name: 'Adebola Okonjo', avatar: 'https://i.pravatar.cc/150?u=adebola' },
        assignedTo: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        dueDate: '2024-07-25',
        priority: 'High',
        status: 'To Do',
    },
    {
        id: 2,
        title: 'Prepare for initial consultation',
        description: 'Gather all preliminary information for the initial consultation with Carlos Mendez.',
        client: { id: 2, name: 'Carlos Mendez', avatar: 'https://i.pravatar.cc/150?u=carlos' },
        assignedTo: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michaelchen' },
        dueDate: '2024-07-26',
        priority: 'Medium',
        status: 'To Do',
    },
    {
        id: 3,
        title: 'Review updated offer letter',
        description: 'The offer letter for Li Wei has been updated by the employer. Review and confirm it meets requirements.',
        client: { id: 3, name: 'Li Wei', avatar: 'https://i.pravatar.cc/150?u=liwei' },
        assignedTo: { name: 'Sophia Williams', avatar: 'https://i.pravatar.cc/150?u=sophia' },
        dueDate: '2024-07-28',
        priority: 'Medium',
        status: 'In Progress',
    },
    {
        id: 4,
        title: 'Draft submission cover letter',
        description: 'Draft the cover letter for James Wilson\'s work permit extension application.',
        client: { id: 5, name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' },
        assignedTo: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        dueDate: '2024-07-24',
        priority: 'High',
        status: 'To Do',
    },
    {
        id: 5,
        title: 'Send pre-arrival checklist',
        description: 'Carlos Mendez\'s student visa was approved. Send the standard pre-arrival checklist.',
        client: { id: 2, name: 'Carlos Mendez', avatar: 'https://i.pravatar.cc/150?u=carlos' },
        assignedTo: { name: 'David Rodriguez', avatar: 'https://i.pravatar.cc/150?u=david' },
        dueDate: '2024-07-22',
        priority: 'Low',
        status: 'Completed',
    }
];

export const platformTasksData: PlatformTask[] = [
    {
        id: 1,
        title: 'Review new lawyer sign-ups',
        description: 'Verify credentials for all users with status "Pending Activation".',
        assignedTo: { name: 'Super Admin', avatar: 'https://i.pravatar.cc/150?u=superadmin' },
        dueDate: '2024-07-25',
        priority: 'High',
        status: 'To Do',
    },
    {
        id: 2,
        title: 'Prepare Q3 Marketing Report',
        description: 'Analyze lead sources and conversion rates for the third quarter.',
        assignedTo: { name: 'Chris Davis', avatar: 'https://i.pravatar.cc/150?u=chris' },
        dueDate: '2024-08-01',
        priority: 'Medium',
        status: 'In Progress',
    },
    {
        id: 3,
        title: 'Follow up with Enterprise leads',
        description: 'Contact all new enterprise-level leads from the past month.',
        assignedTo: { name: 'Jessica Miller', avatar: 'https://i.pravatar.cc/150?u=jessica' },
        dueDate: '2024-07-28',
        priority: 'High',
        status: 'To Do',
    },
];

export const clients: Client[] = [
    { 
        id: 1, name: 'Adebola Okonjo', email: 'ade.okonjo@example.com', password: 'password123', uid: 'static-adebola', phone: '+1-202-555-0176', caseType: 'Permanent Residency', status: 'Active', lastContact: '2023-06-12', avatar: 'https://i.pravatar.cc/150?u=adebola',
        countryOfOrigin: 'Nigeria', currentLocation: 'Calgary, AB', joined: '2022-08-20', age: 29, educationLevel: "Master's degree",
        caseSummary: {
            priority: 'High', caseType: 'Permanent Residency (PNP)', currentStatus: 'Awaiting Documents', nextStep: 'Submit provincial nomination docs', dueDate: '2023-07-01',
        },
        activity: [
            { id: 1, title: 'New Message', description: 'Client confirmed receipt of document checklist.', timestamp: '2024-07-20T12:00:00.000Z', teamMember: teamMembers[0] },
            { id: 2, title: 'Appointment Completed', description: 'Initial consultation and strategy session.', timestamp: '2024-07-18T12:00:00.000Z', teamMember: teamMembers[0] },
            { id: 3, title: 'Application Submitted', description: 'PNP application submitted.', timestamp: '2024-07-13T12:00:00.000Z', teamMember: teamMembers[2] },
        ],
        documents: [],
        tasks: [tasksData[0]],
        agreements: [],
        intakeForm: { status: 'not_started', flaggedQuestions: [] },
    },
    { 
        id: 2, name: 'Carlos Mendez', email: 'carlos.m@example.com', password: 'password123', uid: 'static-carlos', phone: '+1-202-555-0129', caseType: 'Student Visa', status: 'Active', lastContact: '2023-06-10', avatar: 'https://i.pravatar.cc/150?u=carlos',
        countryOfOrigin: 'Mexico', currentLocation: 'Vancouver, BC', joined: '2023-01-10', age: 22, educationLevel: "Bachelor's degree",
        caseSummary: {
            priority: 'Medium', caseType: 'Student Visa', currentStatus: 'Approved', nextStep: 'Advise on arrival procedures', dueDate: 'N/A',
        },
        activity: [
            { id: 4, title: 'Application Submitted', description: 'Student visa application submitted to IRCC portal.', timestamp: '2024-07-13T12:00:00.000Z', teamMember: teamMembers[1] },
            { id: 5, title: 'Email Sent', description: 'Sent pre-arrival checklist to client.', timestamp: '2024-07-21T12:00:00.000Z', teamMember: teamMembers[3] },
        ],
        documents: [],
        tasks: [tasksData[1], tasksData[4]],
        agreements: [],
        intakeForm: { status: 'not_started', flaggedQuestions: [] },
    },
    { 
        id: 3, name: 'Li Wei', email: 'li.wei@example.com', password: 'password123', uid: 'static-liwei', phone: '+1-202-555-0153', caseType: 'Work Permit', status: 'On-hold', lastContact: '2023-05-28', avatar: 'https://i.pravatar.cc/150?u=liwei',
        countryOfOrigin: 'China', currentLocation: 'Toronto, ON', joined: '2021-11-05', age: 35, educationLevel: "PhD",
        caseSummary: {
            priority: 'Low', caseType: 'Work Permit Renewal', currentStatus: 'On Hold', nextStep: 'Awaiting updated offer letter from employer', dueDate: '2023-08-15',
        },
        activity: [
             { id: 6, title: 'New Message', description: 'Client requested to put case on hold.', timestamp: '2024-07-11T12:00:00.000Z', teamMember: teamMembers[2] },
        ],
        documents: [],
        tasks: [tasksData[2]],
        agreements: [],
        intakeForm: { status: 'not_started', flaggedQuestions: [] },
    },
    { 
        id: 4, name: 'Ananya Sharma', email: 'ananya.s@example.com', password: 'password123', uid: 'static-ananya', phone: '+1-202-555-0198', caseType: 'Family Sponsorship', status: 'Closed', lastContact: '2023-04-15', avatar: 'https://i.pravatar.cc/150?u=ananya',
        countryOfOrigin: 'India', currentLocation: 'Mississauga, ON', joined: '2020-02-18', age: 42, educationLevel: "Bachelor's degree",
        caseSummary: {
            priority: 'N/A', caseType: 'Family Sponsorship', currentStatus: 'Closed', nextStep: 'Case closed successfully', dueDate: 'N/A',
        },
        activity: [],
        documents: [],
        tasks: [],
        agreements: [],
        intakeForm: { status: 'not_started', flaggedQuestions: [] },
    },
    { 
        id: 5, name: 'James Wilson', email: 'james.wilson@example.com', password: 'password123', uid: 'static-james', phone: '+1 (416) 555-0182', caseType: 'Work Permit', status: 'Active', lastContact: '2023-06-13', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        countryOfOrigin: 'United Kingdom', currentLocation: 'Toronto, Canada', joined: '2022-05-15', age: 31, educationLevel: "Two or more post-secondary credentials",
        caseSummary: {
            priority: 'High', caseType: 'Work Permit Extension', currentStatus: 'Pending Review', nextStep: 'Submit additional documents', dueDate: '2023-06-15',
        },
        activity: [
            { id: 7, title: 'Application Submitted', description: 'Work permit extension application was submitted to IRCC', timestamp: '2024-07-23T10:00:00.000Z', teamMember: teamMembers[0] },
            { id: 8, title: 'New Message', description: 'Client asked about processing times for work permit extensions', timestamp: '2024-07-22T12:00:00.000Z', teamMember: teamMembers[0] },
            { id: 9, title: 'Appointment Completed', description: 'Reviewed all documents before submission', timestamp: '2024-07-20T12:00:00.000Z', teamMember: teamMembers[1] },
        ],
        documents: [
            { id: 101, type: 'form', submissionGroup: 'Main Form', title: 'Application for Work Permit Made Outside of Canada (IMM 1295)', category: 'Official Forms', dateAdded: '2023-06-10', status: 'Pending Client Review', isAiFilled: true, url: 'https://unpkg.com/pdfjs-dist@3.4.120/web/compressed.tracemonkey-pldi-09.pdf', comments: [{ id: 1, author: 'Sarah Johnson', text: 'Hi James, the form is pre-filled with your intake data. Please review Section B, Question 3 carefully.', timestamp: '2h ago', avatar: 'https://i.pravatar.cc/150?u=sarah' }] },
            { id: 102, type: 'form', submissionGroup: 'Main Form', title: 'Family Information Form (IMM 5707)', category: 'Official Forms', dateAdded: '2023-06-10', status: 'Pending Client Review', isAiFilled: true },
            { id: 103, type: 'supporting', submissionGroup: 'Supporting Document', title: 'Employment Contract', category: 'Employment', dateAdded: '2022-05-20', status: 'Approved' },
            { id: 104, type: 'supporting', submissionGroup: 'Supporting Document', title: 'LMIA Application', category: 'Employment', dateAdded: '2023-06-05', status: 'Uploaded' },
            { id: 105, type: 'supporting', submissionGroup: 'Supporting Document', title: 'Pay Stubs (3 months)', category: 'Financial', dateAdded: '2023-06-05', status: 'Rejected', comments: [{id: 2, author: 'Sarah Johnson', text: 'Hi James, the submitted pay stubs were for the wrong period. Please upload stubs for March, April, and May 2023.', timestamp: '1d ago', avatar: 'https://i.pravatar.cc/150?u=sarah' }] },
            { id: 106, type: 'supporting', submissionGroup: 'Additional Document', title: 'Proof of Funds', status: 'Requested' as const, dateAdded: '2023-06-15', category: 'Financial' },
        ],
        tasks: [tasksData[3], {id: 6, title: 'Review LMIA Application', client: {id: 5, name: 'James Wilson', avatar: '...'}, assignedTo: {name: 'Sarah Johnson', avatar: '...'}, dueDate: '2024-07-30', priority: 'High', status: 'To Do'}],
        agreements: [
            {
                id: 1,
                title: 'Retainer Agreement - Work Permit Extension',
                status: 'Pending Signature',
                dateSigned: '2022-05-15',
                documentUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/web/compressed.tracemonkey-pldi-09.pdf',
                relatedDocuments: [],
                relatedInvoiceIds: ['INV-2023-0456']
            }
        ],
        intakeForm: { status: 'not_started', flaggedQuestions: [] },
    },
];

export const teamPerformance = {
    newClients: 24,
    successRate: 92,
    revenue: 58420,
    satisfaction: 4.8
};

export const activityTypes = [
    { id: 'call', label: 'Call', icon: Phone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'meeting', label: 'Meeting', icon: Users },
    { id: 'note', label: 'Note', icon: MessageSquare },
    { id: 'task', label: 'Task Completed', icon: CheckSquare },
    { id: 'document', label: 'Document Uploaded', icon: Upload },
];

export const activityLogData = [
    {
      id: 1,
      type: 'Call',
      description: 'Discussed work permit extension options.',
      client: clients[4],
      teamMember: teamMembers[0],
      timestamp: '2024-07-23T11:30:00.000Z',
    },
    {
      id: 2,
      type: 'Email',
      description: 'Sent follow-up email with document checklist.',
      client: clients[0],
      teamMember: teamMembers[1],
      timestamp: '2024-07-23T10:00:00.000Z',
    },
    {
      id: 3,
      type: 'Meeting',
      description: 'Initial consultation and strategy session.',
      client: clients[1],
      teamMember: teamMembers[0],
      timestamp: '2024-07-22T12:00:00.000Z',
    },
    {
      id: 4,
      type: 'Task Completed',
      description: 'Drafted submission cover letter for James Wilson.',
      client: clients[4],
      teamMember: teamMembers[2],
      timestamp: '2024-07-21T12:00:00.000Z',
    },
    {
      id: 5,
      type: 'Document Uploaded',
      description: 'Uploaded "Proof of Funds" for Adebola Okonjo.',
      client: clients[0],
      teamMember: teamMembers[3],
      timestamp: '2024-07-20T12:00:00.000Z',
    },
     {
      id: 6,
      type: 'Note',
      description: 'Client is waiting for a reference letter from their previous employer.',
      client: clients[2],
      teamMember: teamMembers[2],
      timestamp: '2024-07-19T12:00:00.000Z',
    },
];

export const documentCategories = [
    { name: 'Express Entry (EE)', icon: Briefcase },
    { name: 'Provincial Nominee Program (PNP)', icon: MapPin },
    { name: 'Study Permit / Study Visa', icon: GraduationCap },
    { name: 'Work Permit / Temporary Work Visa', icon: Briefcase },
    { name: 'Business Immigration Programs', icon: Landmark },
    { name: 'Family Sponsorship', icon: Users },
    { name: 'Atlantic Immigration Program (AIP)', icon: Anchor },
    { name: 'Caregiver Program', icon: Heart },
    { name: 'Rural and Northern Immigration Pilot (RNIP)', icon: Mountain },
    { name: 'Refugee and Asylum Claims', icon: Shield },
    { name: 'General Supporting Documents', icon: FileArchive },
];


export type DocumentTemplate = {
    id: number;
    title: string;
    description: string;
    category: string;
    format: string;
    size: string;
    sourceUrl?: string;
};

export const documents: DocumentTemplate[] = [
    // 1. Express Entry
    { id: 101, title: 'IMM 0008 - Generic Application Form for Canada', description: 'Main application form for permanent residence.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/generic-application-form-canada.html' },
    { id: 102, title: 'IMM 5622 - Authorization to Release Personal Information', description: 'Authorize IRCC to release information.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/application-release-information-designated-individual.html' },
    { id: 103, title: 'IMM 5406 - Family Information', description: 'Information about your family members.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/additional-family-information.html' },
    { id: 104, title: 'IMM 5407 - Additional Dependants/Declaration', description: 'For applicants with more than five dependants.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/generic-application-form-canada.html' },
    { id: 105, title: 'IMM 5708 - Document Checklist for Express Entry', description: 'Checklist to ensure all required documents are included.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/apply-permanent-residence/documents.html' },
    { id: 1101, title: 'IMM 5669 - Use of a Representative', description: 'Appoint or cancel a representative.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/use-representative.html' },
    { id: 106, title: 'Passport/travel document', description: 'Clear copy of the biodata page.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },
    { id: 107, title: 'Language test results (IELTS, CELPIP, TEF)', description: 'Official language test scores.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },
    { id: 108, title: 'Educational Credential Assessment (ECA) report', description: 'Report from a designated organization like WES.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },
    { id: 109, title: 'Proof of funds', description: 'Bank statements for the last 6 months.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },
    { id: 110, title: 'Police clearance certificates', description: 'From all countries lived in for 6+ months since age 18.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },
    { id: 111, title: 'Medical exam confirmation', description: 'Upfront medical exam confirmation from a panel physician.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },
    { id: 112, title: 'Employment reference letters', description: 'Letters detailing job duties, hours, and duration.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },
    { id: 113, title: 'Marriage/divorce/birth certificates', description: 'For dependents and to prove relationship status.', category: 'Express Entry (EE)', format: 'PDF', size: 'Template' },

    // 2. Provincial Nominee Program (PNP)
    { id: 201, title: 'IMM 5269 - Provincial Nomination Confirmation', description: 'Official confirmation of nomination from a province.', category: 'Provincial Nominee Program (PNP)', format: 'PDF', size: 'Template' },
    { id: 202, title: 'IMM 5707 - Document Checklist for PNP', description: 'Document checklist for Provincial Nominee Program applicants.', category: 'Provincial Nominee Program (PNP)', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/application-provincial-nominee.html' },
    { id: 203, title: 'Job offer (if required)', description: 'A valid job offer from an employer in the nominating province.', category: 'Provincial Nominee Program (PNP)', format: 'PDF', size: 'Template' },
    { id: 204, title: 'Proof of settlement intent in the province', description: 'Documents showing intent to reside in the province.', category: 'Provincial Nominee Program (PNP)', format: 'PDF', size: 'Template' },
    { id: 205, title: 'Proof of ties to the province', description: 'E.g., job offer, family, previous study or work.', category: 'Provincial Nominee Program (PNP)', format: 'PDF', size: 'Template' },

    // 3. Study Permit
    { id: 301, title: 'IMM 1294 - Application for Study Permit', description: 'Main application form for study permits.', category: 'Study Permit / Study Visa', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/application-study-permit-outside-canada.html' },
    { id: 302, title: 'IMM 5409 - Declaration of True Copy', description: 'Used if applying outside Canada.', category: 'Study Permit / Study Visa', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/statutory-declaration-common-law-union.html' },
    { id: 303, title: 'IMM 5483 - Biometric Request', description: 'Used if biometrics are required.', category: 'Study Permit / Study Visa', format: 'PDF', size: 'Template' },
    { id: 304, title: 'Letter of acceptance from DLI school', description: 'Official acceptance letter from a Designated Learning Institution (DLI).', category: 'Study Permit / Study Visa', format: 'PDF', size: 'Template' },
    { id: 305, title: 'Proof of financial support', description: 'GIC, bank statements, scholarship letters.', category: 'Study Permit / Study Visa', format: 'PDF', size: 'Template' },
    { id: 306, title: 'Statement of purpose', description: 'A letter explaining why you want to study in Canada.', category: 'Study Permit / Study Visa', format: 'PDF', size: 'Template' },

    // 4. Work Permit
    { id: 401, title: 'IMM 1295 - Work Permit Application', description: 'Application for Work Permit.', category: 'Work Permit / Temporary Work Visa', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/application-work-permit-outside-canada.html' },
    { id: 402, title: 'IMM 5723 - Offer to Employ Foreign National', description: 'Employer form for job offers.', category: 'Work Permit / Temporary Work Visa', format: 'PDF', size: 'Template' },
    { id: 403, title: 'IMM 5424 - Employer Questionnaire', description: 'Questionnaire for employers.', category: 'Work Permit / Temporary Work Visa', format: 'PDF', size: 'Template' },
    { id: 404, 'title': 'Labour Market Impact Assessment (LMIA) or LMIA-exempt letter', description: 'Positive or neutral LMIA from ESDC, if required.', category: 'Work Permit / Temporary Work Visa', format: 'PDF', size: 'Template' },
    { id: 405, 'title': 'Proof of qualifications', description: 'Degree, diploma, or trade license.', category: 'Work Permit / Temporary Work Visa', format: 'PDF', size: 'Template' },

    // 5. Business Immigration
    { id: 501, title: 'IMM 5270 - Business Immigration Questionnaire', description: 'Questionnaire for business applicants.', category: 'Business Immigration Programs', format: 'PDF', size: 'Template' },
    { id: 502, title: 'IMM 5425 - Business Plan Submission', description: 'Official submission form for business plan.', category: 'Business Immigration Programs', format: 'PDF', size: 'Template' },
    { id: 503, title: 'Business plan', description: 'A comprehensive plan for your proposed business in Canada.', category: 'Business Immigration Programs', format: 'PDF', size: 'Template' },
    { id: 504, title: 'Investment proof', description: 'Documents showing the source and availability of investment funds.', category: 'Business Immigration Programs', format: 'PDF', size: 'Template' },

    // 6. Family Sponsorship
    { id: 601, title: 'IMM 1344 - Undertaking and Sponsorship Agreement', description: 'Agreement to sponsor a family member.', category: 'Family Sponsorship', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/application-sponsor-spouse-partner-child.html' },
    { id: 602, title: 'IMM 1345 - Sponsor Questionnaire', description: 'Questionnaire for the sponsor.', category: 'Family Sponsorship', format: 'PDF', size: 'Template' },
    { id: 603, title: 'IMM 5540 - Sponsorship Evaluation Report', description: 'Evaluation report for the sponsor.', category: 'Family Sponsorship', format: 'PDF', size: 'Template' },
    { id: 604, title: 'Proof of relationship', description: 'Marriage certificate, birth certificate, etc.', category: 'Family Sponsorship', format: 'PDF', size: 'Template' },
    { id: 605, title: 'Proof of income (NOA, pay stubs)', description: 'Notice of Assessment from the CRA for the sponsor.', category: 'Family Sponsorship', format: 'PDF', size: 'Template' },
    
    // 7. AIP
    { id: 701, title: 'IMM 5491 - AIP Candidate Information Form', description: 'Information form for AIP candidates.', category: 'Atlantic Immigration Program (AIP)', format: 'PDF', size: 'Template' },
    { id: 702, title: 'Job offer from AIP-designated employer', description: 'A valid job offer from a designated employer in an Atlantic province.', category: 'Atlantic Immigration Program (AIP)', format: 'PDF', size: 'Template' },
    { id: 703, title: 'Settlement plan', description: 'A plan created with a designated settlement service provider.', category: 'Atlantic Immigration Program (AIP)', format: 'PDF', size: 'Template' },
    
    // 8. Caregiver Program
    { id: 801, title: 'IMM 5913 - Caregiver Employment Verification', description: 'Verification of caregiver employment.', category: 'Caregiver Program', format: 'PDF', size: 'Template' },
    { id: 802, title: 'Proof of work experience (as caregiver)', description: 'Reference letters confirming at least 24 months of experience.', category: 'Caregiver Program', format: 'PDF', size: 'Template' },
    { id: 803, title: 'NOC code matching job duties', description: 'Job offer must match the duties of an eligible NOC.', category: 'Caregiver Program', format: 'PDF', size: 'Template' },
    
    // 9. RNIP
    { id: 901, title: 'IMM 5492 - RNIP Community Recommendation Form', description: 'Recommendation from a participating community.', category: 'Rural and Northern Immigration Pilot (RNIP)', format: 'PDF', size: 'Template' },
    { id: 902, title: 'Job offer in participating community', description: 'A genuine, full-time, non-seasonal job offer.', category: 'Rural and Northern Immigration Pilot (RNIP)', format: 'PDF', size: 'Template' },
    { id: 903, title: 'Proof of ties to the community', description: 'Documents showing established ties to the community.', category: 'Rural and Northern Immigration Pilot (RNIP)', format: 'PDF', size: 'Template' },
    
    // 10. Refugee and Asylum Claims
    { id: 1001, title: 'IRB/IRCC Referral Form', description: 'For inland refugee claims.', category: 'Refugee and Asylum Claims', format: 'PDF', size: 'Template' },
    { id: 1002, title: 'IMM 5047 - Basis of Claim (BOC) Form', description: 'The most important document for a refugee claim.', category: 'Refugee and Asylum Claims', format: 'PDF', size: 'Template', sourceUrl: 'https://irb.gc.ca/en/forms/Pages/boc-sif.aspx' },
    { id: 1003, title: 'IMM 5288 - Refugee Claimant Instructions', description: 'Instructions for refugee claimants.', category: 'Refugee and Asylum Claims', format: 'PDF', size: 'Template' },
    { id: 1004, 'title': 'Evidence of persecution or danger', description: 'Documents, photos, or witness statements.', category: 'Refugee and Asylum Claims', format: 'PDF', size: 'Template' },
    
    // General Supporting Docs
    { id: 1102, title: 'Passport', description: 'Valid travel document.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1103, title: 'Language Test Results (General)', description: 'IELTS, CELPIP, TEF, TEFAQ.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1104, title: 'ECA Report', description: 'From WES, IQAS, or other recognized agency.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1105, title: 'Proof of Funds (General)', description: 'Bank statement, GIC receipt.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1106, title: 'Medical Exam (General)', description: 'From IRCC-approved panel physician.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1107, title: 'Police Clearance Certificate (General)', description: 'From all countries lived >6 months in past 10 years.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1108, title: 'Birth/Marriage Certificates', description: 'For all family members included in the application.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1109, title: 'Employment References (General)', description: 'Signed letters showing job history.', category: 'General Supporting Documents', format: 'PDF', size: 'Template' },
    { id: 1110, title: 'Use of a Representative (IMM 5669)', description: 'Appoint or cancel a representative.', category: 'General Supporting Documents', format: 'PDF', size: 'Template', sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/use-representative.html' },
];


export const messagesData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      lastMessage: 'Hi James, I just checked the portal. It\'s still showing as "under review". I will follow up with them next week if there\'s no change.',
      time: '1h ago',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'James Wilson', text: 'Hi Sarah, hope you\'re well.', timestamp: '10:30 AM' },
        { id: 2, sender: 'James Wilson', text: 'Hi, I was wondering about the status of my work permit application? Any updates from IRCC?', timestamp: '10:32 AM' },
        { id: 3, sender: 'me', text: 'Hi James, I just checked the portal. It\'s still showing as "under review". I will follow up with them next week if there\'s no change.', timestamp: '11:15 AM' },
      ],
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michaelchen',
      lastMessage: 'Let\'s schedule a call to discuss the documents.',
      time: '5h ago',
      unreadCount: 1,
      messages: [
         { id: 1, sender: 'me', text: 'Hi Michael, I\'ve uploaded the documents we discussed.', timestamp: 'Yesterday, 4:30 PM' },
         { id: 2, sender: 'Michael Chen', text: 'Thanks, James. I see them. Let\'s schedule a call to discuss the documents.', timestamp: '5h ago' },
      ],
    },
];

  export const billingSummary = {
    totalRevenue: 64820,
    outstanding: 12450,
    overdueInvoices: 7,
    thisMonth: 24580,
    collected: 18240,
    avgPayment: 1250,
};

export type Invoice = {
    id: number;
    invoiceNumber: string;
    service: string;
    client: { id: number; name: string; avatar: string; };
    date: string;
    dueDate: string;
    amount: number;
    status: 'Paid' | 'Overdue' | 'Pending' | 'Draft';
};

export const invoicesData: Invoice[] = [
    { id: 1, invoiceNumber: 'INV-2023-0456', service: 'Work Permit', client: { id: 5, name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' }, date: 'Jun 10, 2023', dueDate: 'Jun 24, 2023', amount: 3250, status: 'Overdue' },
    { id: 2, invoiceNumber: 'INV-2023-0452', service: 'PR Application', client: { id: 1, name: 'Adebola Okonjo', avatar: 'https://i.pravatar.cc/150?u=adebola' }, date: 'Jun 5, 2023', dueDate: 'Jun 19, 2023', amount: 4500, status: 'Paid' },
    { id: 3, invoiceNumber: 'INV-2023-0448', service: 'Visitor Visa', client: { id: 2, name: 'Carlos Mendez', avatar: 'https://i.pravatar.cc/150?u=carlos' }, date: 'May 28, 2023', dueDate: 'Jun 11, 2023', amount: 1850, status: 'Pending' },
    { id: 4, invoiceNumber: 'INV-2023-0440', service: 'Student Visa', client: { id: 3, name: 'Li Wei', avatar: 'https://i.pravatar.cc/150?u=liwei' }, date: 'May 15, 2023', dueDate: 'May 29, 2023', amount: 2750, status: 'Paid' },
    { id: 5, invoiceNumber: 'INV-2022-0101', service: 'Initial Retainer', client: { id: 5, name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' }, date: 'May 16, 2022', dueDate: 'May 30, 2022', amount: 1500, status: 'Paid' },

];

export const paymentsData = [
    { id: 1, paymentNumber: 'PAY-2023-0452', date: 'Jun 12, 2023', client: { id: 1, name: 'Adebola Okonjo', avatar: 'https://i.pravatar.cc/150?u=adebola' }, invoiceNumber: 'INV-2023-0452', method: 'Credit Card', amount: 4500, status: 'Completed' },
    { id: 2, paymentNumber: 'PAY-2023-0440', date: 'May 28, 2023', client: { id: 3, name: 'Li Wei', avatar: 'https://i.pravatar.cc/150?u=liwei' }, invoiceNumber: 'INV-2023-0440', method: 'Bank Transfer', amount: 2750, status: 'Completed' },
    { id: 3, paymentNumber: 'PAY-2023-0438', date: 'May 18, 2023', client: { id: 4, name: 'Ananya Sharma', avatar: 'https://i.pravatar.cc/150?u=ananya' }, invoiceNumber: 'INV-2023-0438', method: 'PayPal', amount: 3150, status: 'Completed' },
];

export const paymentMethodsData = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '08/2025', isPrimary: true },
    { id: 2, type: 'Mastercard', last4: '0021', expiry: '11/2024', isPrimary: false },
    { id: 3, type: 'PayPal', last4: 'n/a', expiry: 'sarah@heru.com', isPrimary: false },
];

export const applicationsData = [
    { id: 1, client: { name: 'Adebola Okonjo', avatar: 'https://i.pravatar.cc/150?u=adebola' }, type: 'Permanent Residency', status: 'Pending', submitted: '2023-06-10', priority: 'High', assignedTo: teamMembers[0] },
    { id: 2, client: { name: 'Carlos Mendez', avatar: 'https://i.pravatar.cc/150?u=carlos' }, type: 'Student Visa', status: 'Approved', submitted: '2023-05-28', priority: 'Low', assignedTo: teamMembers[1] },
    { id: 3, client: { name: 'Li Wei', avatar: 'https://i.pravatar.cc/150?u=liwei' }, type: 'Work Permit', status: 'Under Review', submitted: '2023-06-08', priority: 'Medium', assignedTo: teamMembers[2] },
    { id: 4, client: { name: 'Ananya Sharma', avatar: 'https://i.pravatar.cc/150?u=ananya' }, type: 'Family Sponsorship', status: 'Submitted', submitted: '2023-06-01', priority: 'Medium', assignedTo: teamMembers[0] },
    { id: 5, client: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' }, type: 'Work Permit', status: 'Additional Info Requested', submitted: '2023-05-20', priority: 'High', assignedTo: teamMembers[3] },
    { id: 6, client: { name: 'Sophia Chen', avatar: 'https://i.pravatar.cc/150?u=sophia' }, type: 'Student Visa', status: 'Approved', submitted: '2023-04-15', priority: 'Low', assignedTo: teamMembers[1] },
];

export type Appointment = {
    id: number;
    clientId: number;
    name: string;
    dateTime: string;
    type: string;
    avatar: string;
    status: 'Upcoming' | 'Completed';
}

export const appointmentsData: Appointment[] = [
    { id: 1, clientId: 2, name: 'Elena Rodriguez', dateTime: '2024-07-24T14:00:00', type: 'Consultation', avatar: 'https://i.pravatar.cc/150?u=elena', status: 'Upcoming' },
    { id: 2, clientId: 5, name: 'James Wilson', dateTime: '2024-07-25T10:30:00', type: 'Document Review', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'Upcoming' },
    { id: 3, clientId: 3, name: 'Sophia Chen', dateTime: '2024-07-26T15:45:00', type: 'Follow-up', avatar: 'https://i.pravatar.cc/150?u=sophia', status: 'Upcoming' },
    { id: 4, clientId: 1, name: 'Michael Brown', dateTime: '2024-07-22T09:00:00', type: 'Initial Meeting', avatar: 'https://i.pravatar.cc/150?u=michael', status: 'Completed' },
    { id: 5, clientId: 5, name: 'James Wilson', dateTime: '2024-07-21T11:00:00', type: 'Strategy Session', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'Completed' },
];

export const reportsData = {
    clientGrowth: [
        { month: 'Jan', clients: 4 },
        { month: 'Feb', clients: 3 },
        { month: 'Mar', clients: 5 },
        { month: 'Apr', clients: 7 },
        { month: 'May', clients: 6 },
        { month: 'Jun', clients: 8 },
    ],
    userGrowth: [
        { month: 'Jan', lawyers: 1, clients: 4 },
        { month: 'Feb', lawyers: 1, clients: 3 },
        { month: 'Mar', lawyers: 2, clients: 5 },
        { month: 'Apr', lawyers: 2, clients: 7 },
        { month: 'May', lawyers: 3, clients: 6 },
        { month: 'Jun', lawyers: 8, clients: 8 },
    ],
    revenueByCaseType: [
        { name: 'PR', value: 40000 },
        { name: 'Work Permit', value: 30000 },
        { name: 'Student Visa', value: 20000 },
        { name: 'Sponsorship', value: 15000 },
        { name: 'Other', value: 5000 },
    ],
    quarterlyRevenue: [
        { quarter: 'Q1', revenue: 75000 },
        { quarter: 'Q2', revenue: 98000 },
        { quarter: 'Q3', revenue: 112000 },
        { quarter: 'Q4', revenue: 130000 },
    ],
    applicationStatus: [
        { name: 'Approved', value: 65, fill: 'hsl(var(--chart-2))' },
        { name: 'Pending', value: 20, fill: 'hsl(var(--chart-4))' },
        { name: 'Rejected', value: 5, fill: 'hsl(var(--destructive))' },
        { name: 'In Review', value: 10, fill: 'hsl(var(--chart-5))' },
    ]
};

export const subscriptionsData = [
  { id: 1, firmName: 'Heru Immigration Services', plan: 'Pro Team', users: 4, status: 'Active', nextBilling: '2024-08-01', amount: 396 },
  { id: 2, firmName: 'Chen & Associates', plan: 'Starter', users: 2, status: 'Active', nextBilling: '2024-08-05', amount: 98 },
  { id: 3, firmName: 'Williams Legal', plan: 'Pro Team', users: 5, status: 'Active', nextBilling: '2024-08-12', amount: 495 },
  { id: 4, firmName: 'Global-Pathways Inc.', plan: 'Enterprise', users: 15, status: 'Active', nextBilling: '2024-08-15', amount: 1200 },
  { id: 5, firmName: 'Bridge Immigration', plan: 'Starter', users: 1, status: 'Canceled', nextBilling: 'N/A', amount: 49 },
];

export const salesPerformanceData = {
    stats: [
        { title: "New Leads", value: "84", change: "+20%", icon: UserPlus },
        { title: "Conversion Rate", value: "15.2%", change: "+1.8%", icon: Zap },
        { title: "Marketing Engagement", value: "32%", change: "+5%", icon: Target },
    ],
    topPerformers: [
        { id: 5, name: "Jessica Miller", avatar: 'https://i.pravatar.cc/150?u=jessica', performance: "35 leads • 18% conversion", isTop: true },
        { id: 6, name: "Chris Davis", avatar: 'https://i.pravatar.cc/150?u=chris', performance: "28 leads • 14% conversion", isTop: false },
    ]
};

export const leadsData: Lead[] = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@acmecorp.com',
        phone: '+1-555-0101',
        company: 'Acme Corp Immigration',
        status: 'New',
        source: 'Website Form',
        owner: teamMembers[4], // Jessica Miller
        lastContacted: '2024-07-20T10:00:00Z',
        createdDate: '2024-07-20T10:00:00Z',
        avatar: 'https://i.pravatar.cc/150?u=johnsmith',
        activity: [
            { id: 1, type: 'Note', notes: 'Initial inquiry about corporate packages.', date: '2024-07-20T10:00:00Z' }
        ]
    },
    {
        id: 2,
        name: 'Maria Garcia',
        email: 'maria.g@globex.legal',
        phone: '+1-555-0102',
        company: 'Globex Legal Services',
        status: 'Contacted',
        source: 'Referral',
        owner: teamMembers[5], // Chris Davis
        lastContacted: '2024-07-22T14:30:00Z',
        createdDate: '2024-07-18T09:00:00Z',
        avatar: 'https://i.pravatar.cc/150?u=mariagarcia',
        activity: [
             { id: 1, type: 'Call', notes: 'Initial introductory call. Sent follow-up email.', date: '2024-07-22T14:30:00Z' }
        ]
    },
    {
        id: 3,
        name: 'Chen Wang',
        email: 'chen.wang@waystar.ca',
        phone: '+1-555-0103',
        company: 'Waystar Immigration',
        status: 'Qualified',
        source: 'LinkedIn',
        owner: teamMembers[4], // Jessica Miller
        lastContacted: '2024-07-23T11:00:00Z',
        createdDate: '2024-07-15T15:00:00Z',
        avatar: 'https://i.pravatar.cc/150?u=chenwang',
        activity: [
             { id: 1, type: 'Email', notes: 'Replied to pricing inquiry. Scheduled a demo.', date: '2024-07-23T11:00:00Z' }
        ]
    },
    {
        id: 4,
        name: 'Aisha Khan',
        email: 'aisha.k@khanconsulting.org',
        phone: '+1-555-0104',
        company: 'Khan Consulting',
        status: 'Unqualified',
        source: 'Cold Call',
        owner: teamMembers[5], // Chris Davis
        lastContacted: '2024-07-19T16:00:00Z',
        createdDate: '2024-07-19T14:00:00Z',
        avatar: 'https://i.pravatar.cc/150?u=aishakhan',
         activity: [
             { id: 1, type: 'Note', notes: 'Not a good fit. Looking for a different type of software.', date: '2024-07-19T16:00:00Z' }
        ]
    },
    {
        id: 5,
        name: 'David Miller',
        email: 'david.m@stark-industries.net',
        phone: '+1-555-0105',
        company: 'Stark Industries Legal',
        status: 'New',
        source: 'Website Form',
        owner: teamMembers[4], // Jessica Miller
        lastContacted: '2024-07-24T09:00:00Z',
        createdDate: '2024-07-24T09:00:00Z',
        avatar: 'https://i.pravatar.cc/150?u=davidmiller',
        activity: []
    }
];

export const teamMembersWithStats = [
  ...teamMembers,
  {
      id: 7, name: 'Olivia Martinez', role: 'Case Manager', avatar: 'https://i.pravatar.cc/150?u=olivia',
      stats: [{ label: 'Clients', value: '25' }, { label: 'Revenue', value: '$45k' }],
      email: 'olivia.m@example.com', phone: '+1-202-555-0107'
  }
];

export const plans = [
    { id: 'starter' as const, name: 'Starter', description: "For solo practitioners and small teams getting started.", price: { monthly: 49, annually: 490 }, userLimit: '2', clientLimit: '50', features: ['Basic AI Tools', 'Standard Support', 'Client Portal'] },
    { id: 'pro' as const, name: 'Pro Team', description: "For growing firms that need more power and collaboration.", price: { monthly: 99, annually: 990 }, userLimit: '10', clientLimit: '500', features: ['Advanced AI Tools', 'Lead Connection Tools', 'Team Collaboration Features', 'Reporting & Analytics', 'Priority Email Support'] },
    { id: 'enterprise' as const, name: 'Enterprise', description: "For large firms with complex needs and compliance requirements.", price: 'Custom' as const, userLimit: 'Unlimited', clientLimit: 'Unlimited', features: ['Dedicated Support & Onboarding', 'Lead Connection Tools', 'Custom Integrations', 'Advanced Security & Compliance', 'API Access'] }
];

export const testimonials = [
    {
        role: 'lawyer',
        quote: "Heru has transformed my practice. The AI risk alerts have saved me from potentially critical errors multiple times. I'm spending less time on admin and more time winning cases for my clients.",
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    {
        role: 'client',
        quote: "The entire immigration process felt overwhelming until I used this platform. The AI timeline showed me exactly what to expect, and being able to securely share documents with my lawyer gave me complete peace of mind.",
        name: 'James Wilson',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    }
];

export const faqs = [
    {
        for: 'lawyer',
        question: "Is my client data secure?",
        answer: "Yes, security is our top priority. All data is encrypted in transit and at rest. Our platform is built with industry-standard security practices to ensure your firm's and your clients' data is always protected."
    },
    {
        for: 'lawyer',
        question: "Can I import my existing client data?",
        answer: "Absolutely. We offer data import tools to help you migrate from your existing spreadsheets or other CRM software. You can find this in the Settings -> Data Management section of your dashboard."
    },
    {
        for: 'lawyer',
        question: "How does the AI work?",
        answer: "Our AI is powered by leading large language models. It's trained to understand the context of immigration case management, allowing it to assist with tasks like summarizing legal documents, checking applications for errors, and drafting professional communications."
    },
    {
        for: 'lawyer',
        question: "What kind of support do you offer?",
        answer: "All plans come with email support. Our Pro Team plan includes priority email support, and our Enterprise plan includes a dedicated account manager and onboarding assistance."
    },
];

export const supportTicketsData = [
    { id: 'TKT-84321', user: clients[4], userType: 'Client' as const, subject: 'Unable to upload passport PDF', topic: 'Technical Issue', status: 'In Progress' as const, lastUpdated: '2024-07-22T10:00:00Z', description: 'I am trying to upload my passport PDF in the documents section for my Work Permit Extension, but I keep getting an "Upload Failed" error. The file is only 2MB and is a valid PDF. Could you please check?' },
    { id: 'TKT-84320', user: teamMembers[1], userType: 'Lawyer' as const, subject: 'Question about annual billing', topic: 'Billing & Subscription', status: 'Closed' as const, lastUpdated: '2024-07-18T15:30:00Z', description: 'One of my clients was asking about the cost savings for the annual plan vs the monthly one. Can you confirm the current discount percentage?' },
    { id: 'TKT-84319', user: teamMembers[0], userType: 'Lawyer' as const, subject: 'Suggestion for AI Tools page', topic: 'Feature Request', status: 'Open' as const, lastUpdated: '2024-07-23T11:45:00Z', description: 'It would be great if the AI Application Checker could also check for specific formatting required by different visa offices. For example, some require dates in DD-MM-YYYY format.' },
    { id: 'TKT-84318', user: clients[2], userType: 'Client' as const, subject: 'Cannot access messages', topic: 'Technical Issue', status: 'Open' as const, lastUpdated: '2024-07-24T09:00:00Z', description: 'When I click on the messages tab in my dashboard, it shows a blank page. I have tried clearing my cache and using a different browser. My lawyer is Michael Chen.' },
];

export const themes = [
    { name: 'Canada Red', id: 'red', colors: { primary: 'hsl(0 84.2% 60.2%)', accent: 'hsl(215.4 16.3% 46.9%)' } },
    { name: 'Heru Green', id: 'green', colors: { primary: 'hsl(142.1 76.2% 36.3%)', accent: 'hsl(262.1 83.3% 57.8%)' } },
    { name: 'Ocean Blue', id: 'blue', colors: { primary: 'hsl(217.2 91.2% 59.8%)', accent: 'hsl(45 93% 58%)' } },
    { name: 'Graphite', id: 'graphite', colors: { primary: 'hsl(221.2 83.2% 53.3%)', accent: 'hsl(215 27.9% 46.9%)' } },
    { name: 'Cool Sky', id: 'sky', colors: { primary: 'hsl(243 43% 45%)', accent: 'hsl(46 93% 70%)' } },
    { name: 'Warm Coral', id: 'coral', colors: { primary: 'hsl(357 98% 79%)', accent: 'hsl(14 98% 79%)' } },
    { name: 'Vivid Synth', id: 'synth', colors: { primary: 'hsl(333 94% 57%)', accent: 'hsl(279 89% 60%)' } },
];

export const notifications: Notification[] = [
    {
        id: 1,
        date: '2024-07-23T10:00:00Z',
        title: 'Platform Maintenance',
        message: 'The platform will be undergoing scheduled maintenance on July 25th from 2 AM to 3 AM EST. Access may be intermittent.',
        target: 'All Users',
        isRead: false,
    },
    {
        id: 2,
        date: '2024-07-22T14:00:00Z',
        title: 'New Feature: AI Assist',
        message: 'We have launched a new AI Assist page for clients to help with resume and cover letter generation. Check it out!',
        target: 'Clients',
        isRead: false,
    },
    {
        id: 3,
        date: '2024-07-21T09:00:00Z',
        title: 'Policy Update: PNP Processing',
        message: 'Please be aware of recent updates to the Provincial Nominee Program processing guidelines. See internal docs for details.',
        target: 'Lawyers',
        isRead: true,
    }
];

export const irccNewsData = [
    {
        id: 1,
        title: "New Instructions for Spousal Open Work Permits",
        description: "Updated instructions have been issued for spouses and common-law partners applying for an open work permit.",
        date: "July 7, 2024",
        link: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html"
    },
    {
        id: 2,
        title: "Express Entry Draw #298 Results: 3,500 ITAs Issued",
        description: "Canada invites 3,500 candidates in the latest all-program Express Entry draw. Minimum CRS score was 505.",
        date: "July 6, 2024",
        link: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html"
    },
    {
        id: 3,
        title: "Update to Biometrics Requirements for In-Canada Applicants",
        description: "A temporary public policy exempts certain in-Canada temporary residence applicants from providing biometrics.",
        date: "July 5, 2024",
        link: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html"
    }
];

// Sidebar navigation items
export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'leads', label: 'Leads', icon: BriefcaseBusiness },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'team', label: 'Team Management', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'applications', label: 'Applications', icon: FileText, badge: '24' },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '3' },
  { id: 'messages', label: 'Messages', icon: Mail, badge: '5', badgeVariant: 'destructive' as 'destructive' },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'activity', label: 'Activity Log', icon: FileText },
  { id: 'billing', label: 'Billing', icon: Landmark },
  { id: 'reports', label: 'Reports', icon: LineChart },
  { id: 'ai-tools', label: 'AI Tools', icon: Zap },
  { id: 'settings', label: 'Settings', icon: Handshake },
  { id: 'support', label: 'Help & Support', icon: Phone },
];

export const dashboardData = {
    recentApplications: applicationsData.slice(0, 5).map(app => {
        const client = clients.find(c => c.name === app.client.name);
        return {
            id: app.id,
            clientName: app.client.name,
            country: client?.countryOfOrigin || 'Unknown',
            type: app.type,
            status: app.status,
            submitted: app.submitted
        }
    }),
    upcomingAppointments: appointmentsData
        .filter(a => a.status === 'Upcoming')
        .slice(0, 3),
    recentMessages: [
        { id: 1, avatar: clients[0].avatar, name: clients[0].name, message: 'Can you please check on my PNP application?', time: '2m ago'},
        { id: 2, avatar: clients[1].avatar, name: clients[1].name, message: 'Thank you for the pre-arrival checklist!', time: '1h ago'},
        { id: 3, avatar: clients[2].avatar, name: clients[2].name, message: 'I need to put my application on hold.', time: '3h ago'},
    ]
};
