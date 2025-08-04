// Superadmin Client (Lawyer Firm) Info Page - Reusing Lawyer CRM UI
'use client';
import { useParams } from 'next/navigation';
import { ClientProfile } from '@/components/pages/client-profile';
import type { Client, Agreement, IntakeForm } from '@/lib/data';



const PLACEHOLDER_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'Waystar Law',
    email: 'info@waystar.com',
    phone: '+1-555-1000',
    avatar: 'https://i.pravatar.cc/150?u=waystar',
    password: 'static',
    uid: 'static-waystar',
    caseType: 'Firm Onboarding',
    status: 'Active',
    portalStatus: 'Active',
    lastContact: '2025-07-01',
    countryOfOrigin: 'USA',
    currentLocation: 'New York, NY',
    joined: '2025-06-20',
    age: 42,
    educationLevel: "N/A",
    coins: 0,
    onboardingComplete: true,
    caseSummary: {
      priority: 'High',
      caseType: 'Firm Onboarding',
      currentStatus: 'Approved',
      nextStep: 'Welcome Call',
      dueDate: '2025-07-30',
    },
    activity: [
      {
        id: 1,
        title: 'Onboarding Call',
        description: 'Initial onboarding call completed.',
        timestamp: '2025-07-21',
        teamMember: { name: 'Jessica Miller', avatar: 'https://i.pravatar.cc/150?u=jessica' },
      },
    ],
    documents: [],
    tasks: [],
    analysis: undefined,
    agreements: [],
    intakeForm: { status: 'not_started' },
    connectedLawyerId: null,
    connectionRequestFromLawyerId: null,
  },
  {
    id: 2,
    name: 'Acme Legal',
    email: 'contact@acmelegal.com',
    phone: '+1-555-2000',
    avatar: 'https://i.pravatar.cc/150?u=acmelegal',
    password: 'static',
    uid: 'static-acmelegal',
    caseType: 'Firm Onboarding',
    status: 'Active',
    portalStatus: 'Active',
    lastContact: '2025-07-02',
    countryOfOrigin: 'USA',
    currentLocation: 'Los Angeles, CA',
    joined: '2025-05-11',
    age: 37,
    educationLevel: "N/A",
    coins: 0,
    onboardingComplete: true,
    caseSummary: {
      priority: 'Medium',
      caseType: 'Firm Onboarding',
      currentStatus: 'Approved',
      nextStep: 'Docs Review',
      dueDate: '2025-07-29',
    },
    activity: [
      {
        id: 2,
        title: 'Docs Sent',
        description: 'Sent onboarding docs.',
        timestamp: '2025-07-22',
        teamMember: { name: 'Evelyn Reed', avatar: 'https://i.pravatar.cc/150?u=evelyn' },
      },
    ],
    documents: [],
    tasks: [],
    analysis: undefined,
    agreements: [],
    intakeForm: { status: 'reviewed' },
    connectedLawyerId: null,
    connectionRequestFromLawyerId: null,
  },
];

export default function ClientInfoPage() {
  const params = useParams();
  const clientId = parseInt(params.id as string, 10);
  const client = PLACEHOLDER_CLIENTS.find(c => c.id === clientId);
  if (!client) return <div className="p-8">Client not found.</div>;
  return <ClientProfile client={client} onUpdateClient={() => {}} />;
}
