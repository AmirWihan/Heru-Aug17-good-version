
import { FileText, Phone, Landmark, CalendarCheck, FileType, FileSignature, FileHeart, Briefcase, GraduationCap, Users, Home, MessageSquare, CheckSquare, Upload, Mail, Video, UserPlus, Zap, Target } from "lucide-react";
import type { SuccessPredictorOutput } from "@/ai/flows/success-predictor";

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

export type Client = {
    id: number;
    name: string;
    email: string;
    phone: string;
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
    documents: {
        id: number;
        title: string;
        category: string;
        dateAdded: string;
        status: 'Uploaded' | 'Pending Review' | 'Approved' | 'Rejected' | 'Requested';
    }[];
    tasks: Task[];
    analysis?: SuccessPredictorOutput;
};

export const dashboardData = {
    recentApplications: [
        { id: 1, clientName: 'Adebola Okonjo', country: 'Nigeria', type: 'Permanent Residency', status: 'Pending', submitted: '3 days ago' },
        { id: 2, clientName: 'Carlos Mendez', country: 'Mexico', type: 'Student Visa', status: 'Approved', submitted: '2 weeks ago' },
        { id: 3, clientName: 'Li Wei', country: 'China', type: 'Work Permit', status: 'Under Review', submitted: '5 days ago' },
    ],
    recentMessages: [
        { id: 1, name: 'James Wilson', time: '2h ago', message: 'Hi, I was wondering about the status of my work permit application? Any updates from IRCC?', avatar: 'https://i.pravatar.cc/150?u=james' },
        { id: 2, name: 'Elena Rodriguez', time: '5h ago', message: 'Thank you for the consultation yesterday! I\'ll gather all the documents you mentioned.', avatar: 'https://i.pravatar.cc/150?u=elena' },
        { id: 3, name: 'Michael Brown', time: '1d ago', message: 'Can we schedule another call to discuss the PNP options? I have some new questions.', avatar: 'https://i.pravatar.cc/150?u=michael' },
    ],
    upcomingAppointments: [
        { id: 1, name: 'Elena Rodriguez', dateTime: '2024-07-24T14:00:00', type: 'Consultation', avatar: 'https://i.pravatar.cc/150?u=elena' },
        { id: 2, name: 'James Wilson', dateTime: '2024-07-25T10:30:00', type: 'Document Review', avatar: 'https://i.pravatar.cc/150?u=james' },
        { id: 3, name: 'Sophia Chen', dateTime: '2024-07-26T15:45:00', type: 'Follow-up', avatar: 'https://i.pravatar.cc/150?u=sophia' },
    ],
};

export type TeamMember = {
    id: number;
    name: string;
    role: string;
    avatar: string;
    type: 'legal' | 'sales' | 'advisor' | 'admin';
    email: string;
    phone: string;
    accessLevel: 'Admin' | 'Member' | 'Viewer';
    status: 'Active' | 'Pending Activation' | 'Suspended' | 'Blocked' | 'Rejected';
    plan: 'Starter' | 'Pro Team' | 'Enterprise' | 'N/A';
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
};

export const teamMembers: TeamMember[] = [
    {
        id: 10,
        name: 'Super Admin',
        role: 'Super Admin',
        avatar: 'https://i.pravatar.cc/150?u=superadmin',
        type: 'admin',
        email: 'admin@heru.com',
        phone: '+1-555-0100',
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
        phone: '+1-555-0123',
        accessLevel: 'Admin',
        status: 'Pending Activation',
        plan: 'Enterprise',
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
        phone: '+1-555-0199',
        accessLevel: 'Member',
        status: 'Pending Activation',
        plan: 'Pro Team',
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
        id: 1, name: 'Emma Johnson', role: 'Senior Immigration Lawyer', avatar: 'https://i.pravatar.cc/150?u=emma', type: 'legal',
        email: 'emma.j@heru.com', phone: '+1-202-555-0101', accessLevel: 'Admin', status: 'Active', plan: 'Pro Team',
        location: 'Toronto, ON', yearsOfPractice: 12, successRate: 96, licenseNumber: 'LSO-P67890', registrationNumber: 'ICCRC-R45678',
        firmName: 'Johnson Legal',
        firmAddress: '789 Bay Street, Toronto, ON M5G 2C2',
        numEmployees: 8,
        firmWebsite: 'https://johnsonlegal.ca',
        stats: [{ label: 'Clients', value: '72' }, { label: 'Revenue', value: '$120k' }, { label: 'Success Rate', value: '96%' }, { label: 'Rating', value: '4.9/5' }],
        specialties: ['Express Entry', 'PNP', 'Family Sponsorship']
    },
    {
        id: 2, name: 'Michael Chen', role: 'Immigration Consultant', avatar: 'https://i.pravatar.cc/150?u=michaelchen', type: 'legal',
        email: 'michael.c@heru.com', phone: '+1-202-555-0102', accessLevel: 'Member', status: 'Active', plan: 'Pro Team',
        location: 'Vancouver, BC', yearsOfPractice: 8, successRate: 89, licenseNumber: 'BC-L-11223', registrationNumber: 'ICCRC-R56789',
        firmName: 'Chen & Associates',
        firmAddress: '1055 W Georgia St, Vancouver, BC V6E 3P3',
        numEmployees: 5,
        firmWebsite: 'https://chenassociates.com',
        stats: [{ label: 'Clients', value: '45' }, { label: 'Revenue', value: '$85k' }, { label: 'Success Rate', value: '89%' }, { label: 'Rating', value: '4.7/5' }],
        specialties: ['Student Visas', 'Work Permits', 'Visitor Visas']
    },
    {
        id: 3, name: 'Sophia Williams', role: 'Immigration Paralegal', avatar: 'https://i.pravatar.cc/150?u=sophia', type: 'legal',
        email: 'sophia.w@heru.com', phone: '+1-202-555-0103', accessLevel: 'Member', status: 'Suspended', plan: 'Starter',
        location: 'Toronto, ON', yearsOfPractice: 5, successRate: 92, licenseNumber: 'LSO-PL-33445', registrationNumber: 'ICCRC-R67890',
        firmName: 'Johnson Legal',
        firmAddress: '789 Bay Street, Toronto, ON M5G 2C2',
        numEmployees: 8,
        firmWebsite: 'https://johnsonlegal.ca',
        stats: [{ label: 'Clients', value: '38' }, { label: 'Revenue', value: '$50k' }, { label: 'Success Rate', value: '92%' }, { label: 'Rating', value: '4.8/5' }],
        specialties: ['Document Review', 'Application Filing', 'Client Communication']
    },
    {
        id: 4, name: 'David Rodriguez', role: 'Immigration Lawyer', avatar: 'https://i.pravatar.cc/150?u=david', type: 'legal',
        email: 'david.r@heru.com', phone: '+1-202-555-0104', accessLevel: 'Admin', status: 'Active', plan: 'Pro Team',
        location: 'Calgary, AB', yearsOfPractice: 7, successRate: 94, licenseNumber: 'LSA-P12345', registrationNumber: 'ICCRC-R54321',
        firmName: 'Rodriguez Immigration Law',
        firmAddress: '333 7 Ave SW, Calgary, AB T2P 2Z1',
        numEmployees: 3,
        firmWebsite: 'https://rodriguezlaw.ca',
        stats: [{ label: 'Clients', value: '51' }, { label: 'Revenue', value: '$75k' }, { label: 'Success Rate', value: '94%' }, { label: 'Rating', value: '4.6/5' }],
        specialties: ['Case Management', 'Client Onboarding', 'Task Coordination']
    },
    {
        id: 5, name: 'Jessica Miller', role: 'Sales Lead', avatar: 'https://i.pravatar.cc/150?u=jessica', type: 'sales',
        email: 'jessica.m@heru.com', phone: '+1-202-555-0105', accessLevel: 'Member', status: 'Active', plan: 'N/A', location: 'Remote',
        yearsOfPractice: 0, successRate: 0, licenseNumber: 'N/A', registrationNumber: 'N/A',
        stats: [], specialties: []
    },
    {
        id: 6, name: 'Chris Davis', role: 'Marketing Advisor', avatar: 'https://i.pravatar.cc/150?u=chris', type: 'advisor',
        email: 'chris.d@heru.com', phone: '+1-202-555-0106', accessLevel: 'Member', status: 'Active', plan: 'N/A', location: 'Remote',
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
        assignedTo: { name: 'Emma Johnson', avatar: 'https://i.pravatar.cc/150?u=emma' },
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
        client: { id: 5, name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        assignedTo: { name: 'Emma Johnson', avatar: 'https://i.pravatar.cc/150?u=emma' },
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

export const clients: Client[] = [
    { 
        id: 1, name: 'Adebola Okonjo', email: 'ade.okonjo@example.com', phone: '+1-202-555-0176', caseType: 'Permanent Residency', status: 'Active', lastContact: '2023-06-12', avatar: 'https://i.pravatar.cc/150?u=adebola',
        countryOfOrigin: 'Nigeria', currentLocation: 'Calgary, AB', joined: '2022-08-20', age: 29, educationLevel: "Master's degree",
        caseSummary: {
            priority: 'High', caseType: 'Permanent Residency (PNP)', currentStatus: 'Awaiting Documents', nextStep: 'Submit provincial nomination docs', dueDate: '2023-07-01',
        },
        activity: [
            { id: 1, title: 'New Message', description: 'Client confirmed receipt of document checklist.', timestamp: '2024-07-20T12:00:00.000Z', teamMember: teamMembers[0] },
            { id: 2, title: 'Appointment Completed', description: 'Initial consultation and strategy session.', timestamp: '2024-07-18T12:00:00.000Z', teamMember: teamMembers[0] },
            { id: 3, title: 'Application Submitted', description: 'PNP application submitted.', timestamp: '2024-07-13T12:00:00.000Z', teamMember: teamMembers[2] },
        ],
        documents: [
            { id: 1, title: 'Passport Scan', category: 'Identification', dateAdded: '2022-08-25', status: 'Approved' },
            { id: 2, title: 'Proof of Funds', category: 'Financial', dateAdded: '2023-06-01', status: 'Pending Review' },
            { id: 3, title: 'IELTS Results', category: 'Language Test', dateAdded: '2023-05-15', status: 'Approved' },
        ],
        tasks: [tasksData[0]]
    },
    { 
        id: 2, name: 'Carlos Mendez', email: 'carlos.m@example.com', phone: '+1-202-555-0129', caseType: 'Student Visa', status: 'Active', lastContact: '2023-06-10', avatar: 'https://i.pravatar.cc/150?u=carlos',
        countryOfOrigin: 'Mexico', currentLocation: 'Vancouver, BC', joined: '2023-01-10', age: 22, educationLevel: "Bachelor's degree",
        caseSummary: {
            priority: 'Medium', caseType: 'Student Visa', currentStatus: 'Approved', nextStep: 'Advise on arrival procedures', dueDate: 'N/A',
        },
        activity: [
            { id: 4, title: 'Application Submitted', description: 'Student visa application submitted to IRCC portal.', timestamp: '2024-07-13T12:00:00.000Z', teamMember: teamMembers[1] },
            { id: 5, title: 'Email Sent', description: 'Sent pre-arrival checklist to client.', timestamp: '2024-07-21T12:00:00.000Z', teamMember: teamMembers[3] },
        ],
        documents: [
            { id: 1, title: 'Letter of Acceptance', category: 'Education', dateAdded: '2023-01-15', status: 'Approved' },
            { id: 2, title: 'Tuition Fee Receipt', category: 'Financial', dateAdded: '2023-01-20', status: 'Approved' },
        ],
        tasks: [tasksData[1], tasksData[4]]
    },
    { 
        id: 3, name: 'Li Wei', email: 'li.wei@example.com', phone: '+1-202-555-0153', caseType: 'Work Permit', status: 'On-hold', lastContact: '2023-05-28', avatar: 'https://i.pravatar.cc/150?u=liwei',
        countryOfOrigin: 'China', currentLocation: 'Toronto, ON', joined: '2021-11-05', age: 35, educationLevel: "PhD",
        caseSummary: {
            priority: 'Low', caseType: 'Work Permit Renewal', currentStatus: 'On Hold', nextStep: 'Awaiting updated offer letter from employer', dueDate: '2023-08-15',
        },
        activity: [
             { id: 6, title: 'New Message', description: 'Client requested to put case on hold.', timestamp: '2024-07-11T12:00:00.000Z', teamMember: teamMembers[2] },
        ],
        documents: [
            { id: 1, title: 'Current Work Permit', category: 'Immigration', dateAdded: '2021-11-10', status: 'Approved' },
            { id: 2, title: 'Updated Offer Letter', category: 'Employment', dateAdded: '2023-05-20', status: 'Pending Review' },
        ],
        tasks: [tasksData[2]]
    },
    { 
        id: 4, name: 'Ananya Sharma', email: 'ananya.s@example.com', phone: '+1-202-555-0198', caseType: 'Family Sponsorship', status: 'Closed', lastContact: '2023-04-15', avatar: 'https://i.pravatar.cc/150?u=ananya',
        countryOfOrigin: 'India', currentLocation: 'Mississauga, ON', joined: '2020-02-18', age: 42, educationLevel: "Bachelor's degree",
        caseSummary: {
            priority: 'N/A', caseType: 'Family Sponsorship', currentStatus: 'Closed', nextStep: 'Case closed successfully', dueDate: 'N/A',
        },
        activity: [],
        documents: [
            { id: 1, title: 'Marriage Certificate', category: 'Sponsorship', dateAdded: '2020-03-01', status: 'Approved' },
        ],
        tasks: []
    },
    { 
        id: 5, name: 'James Wilson', email: 'james.wilson@example.com', phone: '+1 (416) 555-0182', caseType: 'Work Permit', status: 'Active', lastContact: '2023-06-13', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        countryOfOrigin: 'United Kingdom', currentLocation: 'Toronto, Canada', joined: '2022-05-15', age: 31, educationLevel: "Two or more post-secondary credentials",
        caseSummary: {
            priority: 'High', caseType: 'Work Permit Extension', currentStatus: 'Pending Review', nextStep: 'Submit additional documents', dueDate: 'June 15, 2023',
        },
        activity: [
            { id: 7, title: 'Application Submitted', description: 'Work permit extension application was submitted to IRCC', timestamp: '2024-07-23T10:00:00.000Z', teamMember: teamMembers[0] },
            { id: 8, title: 'New Message', description: 'Client asked about processing times for work permit extensions', timestamp: '2024-07-22T12:00:00.000Z', teamMember: teamMembers[0] },
            { id: 9, title: 'Appointment Completed', description: 'Reviewed all documents before submission', timestamp: '2024-07-20T12:00:00.000Z', teamMember: teamMembers[1] },
        ],
        documents: [
            { id: 1, title: 'Employment Contract', category: 'Employment', dateAdded: '2022-05-20', status: 'Approved' },
            { id: 2, title: 'LMIA Application', category: 'Employment', dateAdded: '2023-06-05', status: 'Uploaded' },
            { id: 3, title: 'Pay Stubs (3 months)', category: 'Financial', dateAdded: '2023-06-05', status: 'Rejected' },
        ],
        tasks: [tasksData[3]]
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
    { name: 'All Documents', icon: FileText },
    { name: 'Permanent Residency', icon: Home },
    { name: 'Work Permits', icon: Briefcase },
    { name: 'Student Visas', icon: GraduationCap },
    { name: 'Visitor Visas', icon: FileText },
    { name: 'Citizenship', icon: FileSignature },
    { name: 'Family Sponsorship', icon: Users },
    { name: 'Health', icon: FileHeart },
    { name: 'Identification', icon: FileText },
    { name: 'Financial', icon: Landmark },
    { name: 'Language Test', icon: MessageSquare },
    { name: 'Education', icon: GraduationCap },
    { name: 'Employment', icon: Briefcase },
    { name: 'Sponsorship', icon: Users },
    { name: 'Immigration', icon: FileType },
];

export type DocumentTemplate = {
    id: number;
    title: string;
    description: string;
    category: string;
    format: string;
    size: string;
};

export const documents: DocumentTemplate[] = [
    // PR
    { id: 1, title: 'Express Entry Profile Submission', description: 'Confirmation of profile submission.', category: 'Permanent Residency', format: 'PDF', size: 'Template' },
    { id: 7, title: 'Proof of Funds', description: 'Bank statements for the last 6 months.', category: 'Permanent Residency', format: 'PDF', size: 'Template' },
    { id: 8, title: 'Educational Credential Assessment (ECA)', description: 'Report from a designated organization like WES.', category: 'Permanent Residency', format: 'PDF', size: 'Template' },
    { id: 9, title: 'Police Certificates', description: 'From every country lived in for more than 6 months since age 18.', category: 'Permanent Residency', format: 'PDF', size: 'Template' },
    // Work Permits
    { id: 2, title: 'Work Permit Application (IMM 1295)', description: 'Main application form for temporary work permits.', category: 'Work Permits', format: 'PDF', size: 'Template' },
    { id: 10, title: 'Job Offer Letter', description: 'A formal job offer from a Canadian employer.', category: 'Work Permits', format: 'PDF', size: 'Template' },
    { id: 11, title: 'LMIA (if applicable)', description: 'Labour Market Impact Assessment document.', category: 'Work Permits', format: 'PDF', size: 'Template' },
    // Student Visas
    { id: 3, title: 'Student Visa Application (IMM 1294)', description: 'Main application form for study permits.', category: 'Student Visas', format: 'PDF', size: 'Template' },
    { id: 12, title: 'Letter of Acceptance (LOA)', description: 'Official acceptance letter from a Designated Learning Institution (DLI).', category: 'Student Visas', format: 'PDF', size: 'Template' },
    { id: 13, title: 'Guaranteed Investment Certificate (GIC)', description: 'Proof of funds for students, often required for SDS stream.', category: 'Student Visas', format: 'PDF', size: 'Template' },
    // Visitor Visas
    { id: 4, title: 'Invitation Letter Template', description: 'For temporary resident visa applications.', category: 'Visitor Visas', format: 'DOCX', size: 'Template' },
    { id: 14, title: 'Proof of Ties to Home Country', description: 'Documents showing intent to return, e.g., property, job.', category: 'Visitor Visas', format: 'PDF', size: 'Template' },
    // Citizenship
    { id: 5, title: 'Citizenship Application (CIT 0002)', description: 'Form CIT 0002 for adult applications.', category: 'Citizenship', format: 'PDF', size: 'Template' },
    { id: 15, title: 'Residency Calculation', description: 'Physical presence calculation for citizenship.', category: 'Citizenship', format: 'PDF', size: 'Template' },
    // Health
    { id: 6, title: 'Medical Examination Form (IMM 1017)', description: 'Form provided by the panel physician after your exam.', category: 'Health', format: 'PDF', size: 'Template' },
];

export const messagesData = [
    {
      id: 1,
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?u=james',
      lastMessage: 'Hi, I was wondering about the status of my work permit application? Any updates from IRCC?',
      time: '2h ago',
      unreadCount: 1,
      messages: [
        { id: 1, sender: 'James Wilson', text: 'Hi Sarah, hope you\'re well.', timestamp: '10:30 AM' },
        { id: 2, sender: 'James Wilson', text: 'Hi, I was wondering about the status of my work permit application? Any updates from IRCC?', timestamp: '10:32 AM' },
        { id: 3, sender: 'me', text: 'Hi James, I just checked the portal. It\'s still showing as "under review". I will follow up with them next week if there\'s no change.', timestamp: '11:15 AM' },
      ],
    },
    {
      id: 2,
      name: 'Elena Rodriguez',
      avatar: 'https://i.pravatar.cc/150?u=elena',
      lastMessage: 'Thank you for the consultation yesterday! I\'ll gather all the documents you mentioned.',
      time: '5h ago',
      unreadCount: 0,
      messages: [
         { id: 1, sender: 'me', text: 'It was a pleasure speaking with you, Elena. Let me know if you have any questions while preparing the documents.', timestamp: 'Yesterday, 4:30 PM' },
         { id: 2, sender: 'Elena Rodriguez', text: 'Thank you for the consultation yesterday! I\'ll gather all the documents you mentioned.', timestamp: '5h ago' },
      ],
    },
    {
      id: 3,
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?u=michael',
      lastMessage: 'Can we schedule another call to discuss the PNP options? I have some new questions.',
      time: '1d ago',
      unreadCount: 0,
      messages: [
         { id: 1, sender: 'Michael Brown', text: 'Can we schedule another call to discuss the PNP options? I have some new questions.', timestamp: '1d ago' },
      ],
    },
    {
      id: 4,
      name: 'Ananya Sharma',
      avatar: 'https://i.pravatar.cc/150?u=ananya',
      lastMessage: 'All documents have been uploaded to the portal.',
      time: '3d ago',
      unreadCount: 0,
      messages: [
         { id: 1, sender: 'Ananya Sharma', text: 'All documents have been uploaded to the portal.', timestamp: '3d ago' },
         { id: 2, sender: 'me', text: 'Great, thank you Ananya. I will review them and let you know if anything else is needed.', timestamp: '3d ago' },
      ],
    },
    {
      id: 5,
      name: 'Internal - Legal Team',
      avatar: 'https://i.pravatar.cc/150?u=team',
      lastMessage: 'Michael: Can someone take a look at the new policy update for spousal sponsorships?',
      time: '4d ago',
      unreadCount: 0,
      isGroup: true,
      messages: [
         { id: 1, sender: 'Michael Chen', text: 'Can someone take a look at the new policy update for spousal sponsorships?', timestamp: '4d ago' },
         { id: 2, sender: 'Emma Johnson', text: 'I\'m on it. Will share a summary by EOD.', timestamp: '4d ago' },
      ],
    }
  ];

  export const billingSummary = {
    totalRevenue: 64820,
    outstanding: 12450,
    overdueInvoices: 7,
    thisMonth: 24580,
    collected: 18240,
    avgPayment: 1250,
};

export const invoicesData = [
    { id: 1, invoiceNumber: 'INV-2023-0456', service: 'Work Permit', client: { id: 5, name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' }, date: 'Jun 10, 2023', dueDate: 'Jun 24, 2023', amount: 3250, status: 'Overdue' },
    { id: 2, invoiceNumber: 'INV-2023-0452', service: 'PR Application', client: { id: 1, name: 'Adebola Okonjo', avatar: 'https://i.pravatar.cc/150?u=adebola' }, date: 'Jun 5, 2023', dueDate: 'Jun 19, 2023', amount: 4500, status: 'Paid' },
    { id: 3, invoiceNumber: 'INV-2023-0448', service: 'Visitor Visa', client: { id: 2, name: 'Carlos Mendez', avatar: 'https://i.pravatar.cc/150?u=carlos' }, date: 'May 28, 2023', dueDate: 'Jun 11, 2023', amount: 1850, status: 'Pending' },
    { id: 4, invoiceNumber: 'INV-2023-0440', service: 'Student Visa', client: { id: 3, name: 'Li Wei', avatar: 'https://i.pravatar.cc/150?u=liwei' }, date: 'May 15, 2023', dueDate: 'May 29, 2023', amount: 2750, status: 'Paid' },
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

export const appointmentsData = [
    { id: 1, name: 'Elena Rodriguez', dateTime: '2024-07-24T14:00:00', type: 'Consultation', avatar: 'https://i.pravatar.cc/150?u=elena', status: 'Upcoming' },
    { id: 2, name: 'James Wilson', dateTime: '2024-07-25T10:30:00', type: 'Document Review', avatar: 'https://i.pravatar.cc/150?u=james', status: 'Upcoming' },
    { id: 3, name: 'Sophia Chen', dateTime: '2024-07-26T15:45:00', type: 'Follow-up', avatar: 'https://i.pravatar.cc/150?u=sophia', status: 'Upcoming' },
    { id: 4, name: 'Michael Brown', dateTime: '2024-07-22T09:00:00', type: 'Initial Meeting', avatar: 'https://i.pravatar.cc/150?u=michael', status: 'Completed' },
    { id: 5, name: 'Li Wei', dateTime: '2024-07-21T11:00:00', type: 'Strategy Session', avatar: 'https://i.pravatar.cc/150?u=liwei', status: 'Completed' },
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
        { month: 'Jun', lawyers: 4, clients: 8 },
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
        { id: 5, name: "Jessica Miller", avatar: "https://i.pravatar.cc/150?u=jessica", performance: "35 leads • 18% conversion", isTop: true },
        { id: 6, name: "Chris Davis", avatar: "https://i.pravatar.cc/150?u=chris", performance: "28 leads • 14% conversion", isTop: false },
    ]
};

export const leadsData = [
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
        createdDate: '2024-07-20T10:00:00Z'
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
        createdDate: '2024-07-18T09:00:00Z'
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
        createdDate: '2024-07-15T15:00:00Z'
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
        createdDate: '2024-07-19T14:00:00Z'
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
        createdDate: '2024-07-24T09:00:00Z'
    }
];

export type Lead = typeof leadsData[0];


export const teamMembersWithStats = [
  ...teamMembers,
  {
      id: 7, name: 'Olivia Martinez', role: 'Case Manager', avatar: 'https://i.pravatar.cc/150?u=olivia',
      stats: [{ label: 'Clients', value: '25' }, { label: 'Revenue', value: '$45k' }],
      email: 'olivia.m@example.com', phone: '+1-202-555-0107'
  }
];
