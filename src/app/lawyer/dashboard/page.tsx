
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

export default function LawyerDashboard() {
  const { page, setPage } = useLawyerDashboard();

  const pageComponents: { [key: string]: React.ComponentType<any> } = {
    dashboard: DashboardPage,
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
