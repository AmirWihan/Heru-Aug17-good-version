'use client';
import { useState } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
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
