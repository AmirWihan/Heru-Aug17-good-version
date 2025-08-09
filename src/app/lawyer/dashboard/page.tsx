
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
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { useState, useRef } from 'react';

console.log('RENDER: LawyerDashboard');
export default function LawyerDashboard() {
  const { userProfile, loading } = useGlobalData();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || loading) return; // Wait until client hydration
    if (!userProfile) {
      router.replace('/login');
      return;
    }
    if (userProfile.authRole !== 'lawyer') {
      router.replace('/not-authorized');
      return;
    }
  }, [userProfile, loading, router, hydrated]);

  if (!hydrated || loading) {
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

console.log('RENDER: LawyerDashboardContent');
function LawyerDashboardContent() {
  const pathname = usePathname();
  const { page, setPage } = useLawyerDashboard();
  const { userProfile } = useGlobalData();
  const router = useRouter();

  // Debugging logs
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[DEBUG] LawyerDashboardContent page:', page, 'userProfile:', userProfile);
  }

  // Check lawyer status and redirect if needed
  // Failsafe: Only allow one redirect per second
  const lastRedirectRef = useRef(0);

  useEffect(() => {
    if (!userProfile || userProfile.authRole !== 'lawyer') return;

    const lawyer = userProfile as any;
    // TEMPORARY OVERRIDE: Always treat billingSetUp as true for testing
    lawyer.billingSetUp = true;
    let target: string | null = null;

    // Normalize pathnames by removing trailing slashes
    const normalizedPathname = pathname.replace(/\/$/, '');
    const billingPaths = ['/lawyer/billing', '/lawyer/billing/'];
    const isOnBilling = billingPaths.includes(pathname) || billingPaths.includes(normalizedPathname);

    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] userProfile:', userProfile, 'lawyer.billingSetUp:', lawyer.billingSetUp, 'pathname:', pathname, 'normalizedPathname:', normalizedPathname, 'isOnBilling:', isOnBilling, 'redirectTarget:', target);
    }

    if (lawyer.status === 'awaiting_approval' && normalizedPathname !== '/lawyer/pending-approval') {
      target = '/lawyer/pending-approval';
    } else if (lawyer.status === 'Active' && lawyer.role === 'Awaiting Onboarding' && normalizedPathname !== '/lawyer/onboarding') {
      target = '/lawyer/onboarding';
    } else if (
      lawyer.status === 'Active' &&
      !lawyer.billingSetUp &&
      !isOnBilling
    ) {
      target = '/lawyer/billing';
    }

    const now = Date.now();
    if (target && target !== normalizedPathname) {
      if (now - lastRedirectRef.current > 1000) {
        lastRedirectRef.current = now;
        if (typeof window !== 'undefined') {
          console.log('[DEBUG] Calling router.replace(', target, ')');
        }
        router.replace(target); // Use replace to avoid history stack issues
      } else {
        if (typeof window !== 'undefined') {
          console.warn('[DEBUG] Skipping redirect to', target, 'due to cooldown');
        }
      }
    }
  }, [userProfile, router, pathname]);

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
    <div>
      <PageComponent setPage={setPage} />
    </div>
  );
}

    