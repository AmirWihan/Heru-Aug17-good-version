
'use client';
import { useLawyerDashboard } from '@/context/LawyerDashboardContext';
import type { FC } from 'react';
import { DashboardPage } from '@/components/pages/dashboard';
import { ClientsPage } from '@/components/pages/clients';
import { TeamPage } from '@/components/pages/team';
import { DocumentsPage } from '@/components/pages/documents';
import { AIToolsPage } from '@/components/pages/ai-tools';
import { MessagesPage } from '@/components/pages/messages';
import { BillingPage } from '@/components/pages/billing';
import { ApplicationsPage } from '@/components/pages/applications';
import { AppointmentsPage } from '@/components/pages/appointments';
import { ReportsPage } from '@/components/pages/reports';
import { SettingsPage } from '@/components/pages/settings';
import { TasksPage } from '@/components/pages/tasks';
import { ActivityLogPage } from '@/components/pages/activity';
import { SupportPage } from '@/components/pages/support';
import { NotificationsPage } from '@/components/pages/notifications';
import { LeadsPage } from '@/components/pages/leads';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LawyerDashboard() {
  const { userProfile, loading } = useGlobalData();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    
    if (!userProfile) {
      router.replace('/login');
      return;
    }
    
    if (userProfile.authRole !== 'lawyer') {
      router.replace('/not-authorized');
      return;
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile || userProfile.authRole !== 'lawyer') {
    return null; // Will redirect
  }

  return <LawyerDashboardContent />;
}

function LawyerDashboardContent() {
  const { page, setPage } = useLawyerDashboard();
  const { userProfile } = useGlobalData();
  const router = useRouter();

  // Check lawyer status and redirect if needed
  useEffect(() => {
    if (userProfile && userProfile.authRole === 'lawyer') {
      const lawyer = userProfile as any;
      
      // If lawyer is awaiting approval, redirect to pending page
      if (lawyer.status === 'awaiting_approval') {
        router.push('/lawyer/pending-approval');
        return;
      }
      
      // If lawyer needs onboarding, redirect to onboarding
      if (lawyer.status === 'Active' && lawyer.role === 'Awaiting Onboarding') {
        router.push('/lawyer/onboarding');
        return;
      }
      
      // If lawyer needs to set up billing, redirect to billing
      if (lawyer.status === 'Active' && !lawyer.billingSetUp) {
        router.push('/lawyer/billing');
        return;
      }
    }
  }, [userProfile, router]);

  // Gating logic can be refined here if needed, but DashboardPage already handles status
  const pageComponents: { [key: string]: React.ComponentType<any> } = {
    dashboard: DashboardPage,
    leads: LeadsPage,
    clients: ClientsPage,
    team: TeamPage,
    documents: DocumentsPage,
    'ai-tools': AIToolsPage,
    applications: ApplicationsPage,
    appointments: AppointmentsPage,
    tasks: TasksPage,
    messages: MessagesPage,
    billing: BillingPage,
    reports: ReportsPage,
    settings: SettingsPage,
    activity: ActivityLogPage,
    support: SupportPage,
    notifications: NotificationsPage,
  };
  const PageComponent = pageComponents[page] || DashboardPage;

  return (
    <div className="animate-fade">
      <PageComponent setPage={setPage} />
    </div>
  );
}

    