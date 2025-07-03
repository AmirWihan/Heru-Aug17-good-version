'use client';
import { useState } from 'react';
import type { FC } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { DashboardPage } from '@/components/pages/dashboard';
import { ClientsPage } from '@/components/pages/clients';
import { TeamPage } from '@/components/pages/team';
import { DocumentsPage } from '@/components/pages/documents';
import { AIToolsPage } from '@/components/pages/ai-tools';
import { MessagesPage } from '@/components/pages/messages';
import { Facebook, Linkedin, Stamp, Twitter } from 'lucide-react';
import { Card } from '@/components/ui/card';

const PlaceholderPage: FC<{ title: string }> = ({ title }) => (
  <Card className="m-6 p-6">
    <h1 className="font-headline text-2xl font-bold">{title}</h1>
    <p className="mt-4 text-muted-foreground">This page is under construction.</p>
  </Card>
);

export default function Home() {
  const [page, setPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const pageComponents: { [key: string]: React.ComponentType<any> } = {
    dashboard: DashboardPage,
    clients: ClientsPage,
    team: TeamPage,
    documents: DocumentsPage,
    'ai-tools': AIToolsPage,
    applications: () => <PlaceholderPage title="Applications" />,
    appointments: () => <PlaceholderPage title="Appointments" />,
    messages: MessagesPage,
    billing: () => <PlaceholderPage title="Billing" />,
    reports: () => <PlaceholderPage title="Reports" />,
    settings: () => <PlaceholderPage title="Settings" />,
  };

  const PageComponent = pageComponents[page] || DashboardPage;
  const pageTitles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'clients': 'All Clients',
      'team': 'Team Management',
      'documents': 'Immigration Documents',
      'ai-tools': 'AI Tools',
      'applications': 'Applications',
      'appointments': 'Appointments',
      'messages': 'Messages',
      'billing': 'Billing',
      'reports': 'Reports',
      'settings': 'Settings',
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <AppSidebar activePage={page} setPage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-screen flex-col md:ml-64">
        <AppHeader pageTitle={pageTitles[page] || 'Dashboard'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6">
          <div className="animate-fade">
            <PageComponent setPage={setPage} />
          </div>
        </main>
        <footer className="mt-auto border-t bg-card p-4 md:p-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center md:mb-0">
              <Stamp className="mr-2 h-6 w-6 text-primary" />
              <span className="font-headline font-bold text-primary">Heru</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 MAAT Technologies. All rights reserved.
            </div>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
