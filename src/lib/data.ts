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
    { id: 1, invoiceNumber: 'INV-2023-0456', service: 'Work Permit', client: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' }, date: 'Jun 10, 2023', dueDate: 'Jun 24, 2023', amount: 3250, status: 'Overdue' },
    { id: 2, invoiceNumber: 'INV-2023-0452', service: 'PR Application', client: { name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?u=michael' }, date: 'Jun 5, 2023', dueDate: 'Jun 19, 2023', amount: 4500, status: 'Paid' },
    { id: 3, invoiceNumber: 'INV-2023-0448', service: 'Visitor Visa', client: { name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?u=elena' }, date: 'May 28, 2023', dueDate: 'Jun 11, 2023', amount: 1850, status: 'Pending' },
    { id: 4, invoiceNumber: 'INV-2023-0440', service: 'Student Visa', client: { name: 'Sophia Chen', avatar: 'https://i.pravatar.cc/150?u=sophia' }, date: 'May 15, 2023', dueDate: 'May 29, 2023', amount: 2750, status: 'Paid' },
];

export const paymentsData = [
    { id: 1, paymentNumber: 'PAY-2023-0452', date: 'Jun 12, 2023', client: { name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?u=michael' }, invoiceNumber: 'INV-2023-0452', method: 'Credit Card', amount: 4500, status: 'Completed' },
    { id: 2, paymentNumber: 'PAY-2023-0440', date: 'May 28, 2023', client: { name: 'Sophia Chen', avatar: 'https://i.pravatar.cc/150?u=sophia' }, invoiceNumber: 'INV-2023-0440', method: 'Bank Transfer', amount: 2750, status: 'Completed' },
    { id: 3, paymentNumber: 'PAY-2023-0438', date: 'May 18, 2023', client: { name: 'Sophia Williams', avatar: 'https://i.pravatar.cc/150?u=sophiaw' }, invoiceNumber: 'INV-2023-0438', method: 'PayPal', amount: 3150, status: 'Completed' },
];

export const paymentMethodsData = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '08/2025', isPrimary: true },
    { id: 2, type: 'Mastercard', last4: '0021', expiry: '11/2024', isPrimary: false },
    { id: 3, type: 'PayPal', last4: 'n/a', expiry: 'sarah@heru.com', isPrimary: false },
]
