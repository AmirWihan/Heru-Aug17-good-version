import { FileText, Phone, Landmark, CalendarCheck, FileType, FileSignature, FileHeart } from "lucide-react";

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
        { id: 1, name: 'Elena Rodriguez', dateTime: 'Today, 2:00 PM', type: 'Consultation', avatar: 'https://i.pravatar.cc/150?u=elena' },
        { id: 2, name: 'James Wilson', dateTime: 'Tomorrow, 10:30 AM', type: 'Document Review', avatar: 'https://i.pravatar.cc/150?u=james' },
        { id: 3, name: 'Sophia Chen', dateTime: 'Jun 15, 3:45 PM', type: 'Follow-up', avatar: 'https://i.pravatar.cc/150?u=sophia' },
    ],
};

export const clients = [
    { id: 1, name: 'Adebola Okonjo', email: 'ade.okonjo@example.com', phone: '+1-202-555-0176', caseType: 'Permanent Residency', status: 'Active', lastContact: '2023-06-12', avatar: 'https://i.pravatar.cc/150?u=adebola' },
    { id: 2, name: 'Carlos Mendez', email: 'carlos.m@example.com', phone: '+1-202-555-0129', caseType: 'Student Visa', status: 'Active', lastContact: '2023-06-10', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 3, name: 'Li Wei', email: 'li.wei@example.com', phone: '+1-202-555-0153', caseType: 'Work Permit', status: 'On-hold', lastContact: '2023-05-28', avatar: 'https://i.pravatar.cc/150?u=liwei' },
    { id: 4, name: 'Ananya Sharma', email: 'ananya.s@example.com', phone: '+1-202-555-0198', caseType: 'Family Sponsorship', status: 'Closed', lastContact: '2023-04-15', avatar: 'https://i.pravatar.cc/150?u=ananya' },
    { id: 5, name: 'James Wilson', email: 'j.wilson@example.com', phone: '+1-202-555-0111', caseType: 'Work Permit', status: 'Active', lastContact: '2023-06-13', avatar: 'https://i.pravatar.cc/150?u=james' },
];

export const teamPerformance = {
    newClients: 24,
    successRate: 92,
    revenue: 58420,
    satisfaction: 4.8
};

export const teamMembers = [
    {
        id: 1, name: 'Emma Johnson', role: 'Senior Immigration Lawyer', avatar: 'https://i.pravatar.cc/150?u=emma',
        email: 'emma.j@immassist.com', phone: '+1-202-555-0101',
        stats: [{ label: 'Clients', value: '24' }, { label: 'Revenue', value: '$18,240' }, { label: 'Success Rate', value: '96%' }, { label: 'Rating', value: '4.9' }]
    },
    {
        id: 2, name: 'Michael Chen', role: 'Immigration Consultant', avatar: 'https://i.pravatar.cc/150?u=michaelchen',
        email: 'michael.c@immassist.com', phone: '+1-202-555-0102',
        stats: [{ label: 'Clients', value: '18' }, { label: 'Revenue', value: '$14,580' }, { label: 'Success Rate', value: '89%' }, { label: 'Rating', value: '4.7' }]
    },
    {
        id: 3, name: 'Sophia Williams', role: 'Immigration Paralegal', avatar: 'https://i.pravatar.cc/150?u=sophia',
        email: 'sophia.w@immassist.com', phone: '+1-202-555-0103',
        stats: [{ label: 'Clients', value: '16' }, { label: 'Revenue', value: '$12,320' }, { label: 'Success Rate', value: '92%' }, { label: 'Rating', value: '4.8' }]
    },
    {
        id: 4, name: 'David Rodriguez', role: 'Case Manager', avatar: 'https://i.pravatar.cc/150?u=david',
        email: 'david.r@immassist.com', phone: '+1-202-555-0104',
        stats: [{ label: 'Clients', value: '22' }, { label: 'Revenue', value: '$13,280' }, { label: 'Success Rate', value: '94%' }, { label: 'Rating', value: '4.8' }]
    },
];

export const teamActivity = [
    { icon: Phone, title: 'Client Call - James Wilson', time: 'Today, 10:30 AM', description: 'Emma Johnson discussed work permit extension options', details: { label: 'Duration', value: '25 minutes' } },
    { icon: FileText, title: 'Application Submitted', time: 'Yesterday, 3:15 PM', description: 'Michael Chen submitted PR application for Elena Rodriguez', details: { label: 'Case ID', value: 'PR-2023-0456' } },
    { icon: Landmark, title: 'Payment Received', time: 'Jun 12, 2023', description: 'Sophia Williams received payment from Michael Brown', details: { label: 'Amount', value: '$3,200' } },
    { icon: CalendarCheck, title: 'Client Meeting', time: 'Jun 10, 2023', description: 'David Rodriguez met with Li Wei to review documents', details: { label: 'Duration', value: '45 minutes' } },
];

export const documentCategories = [
    { name: 'All Documents', icon: FileText },
    { name: 'Permanent Residency', icon: FileText },
    { name: 'Work Permits', icon: FileType },
    { name: 'Student Visas', icon: FileText },
    { name: 'Visitor Visas', icon: FileText },
    { name: 'Citizenship', icon: FileSignature },
    { name: 'Family Sponsorship', icon: FileText },
    { name: 'Health', icon: FileHeart },
];

export const documents = [
    { id: 1, title: 'Express Entry Profile', description: 'Required for all Express Entry applications', category: 'Permanent Residency', format: 'PDF', size: '120KB' },
    { id: 2, title: 'Work Permit Application', description: 'Form for temporary work permits', category: 'Work Permits', format: 'DOCX', size: '85KB' },
    { id: 3, title: 'Student Visa Checklist', description: 'Required documents for student visa applications', category: 'Student Visas', format: 'PDF', size: '210KB' },
    { id: 4, title: 'Invitation Letter Template', description: 'For temporary resident visa applications', category: 'Visitor Visas', format: 'DOCX', size: '75KB' },
    { id: 5, title: 'Citizenship Application', description: 'Form CIT 0002 for adult applications', category: 'Citizenship', format: 'PDF', size: '310KB' },
    { id: 6, title: 'Medical Examination Form', description: 'Required for immigration medical exams', category: 'Health', format: 'PDF', size: '180KB' },
];
