'use client';
import { useState } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import { LawyerDashboardProvider, useLawyerDashboard } from '@/context/LawyerDashboardContext';

const pageTitles: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'clients': 'All Clients',
    'team': 'Team Management',
    'documents': 'Immigration Documents',
    'ai-tools': 'AI Tools',
    'applications': 'Applications',
    'appointments': 'Appointments',
    'tasks': 'Tasks',
    'messages': 'Messages',
    'billing': 'Billing & Invoices',
    'reports': 'Reports',
    'settings': 'Settings',
    'activity': 'Activity Log',
};

function LawyerDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { page, setPage } = useLawyerDashboard();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background text-foreground font-body">
            <AppSidebar activePage={page} setPage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex min-h-screen flex-col md:ml-64">
                <AppHeader pageTitle={pageTitles[page] || 'Dashboard'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-grow p-4 md:p-6">
                    {children}
                </main>
                <footer className="mt-auto border-t bg-card p-4 md:p-6">
                  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between md:flex-row">
                    <div className="mb-4 flex items-center md:mb-0">
                      <HeruLogoIcon className="mr-2 h-6 w-6" />
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

export default function LawyerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LawyerDashboardProvider>
            <LawyerDashboardLayoutContent>{children}</LawyerDashboardLayoutContent>
        </LawyerDashboardProvider>
    );
}
