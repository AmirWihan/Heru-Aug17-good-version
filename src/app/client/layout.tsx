'use client';
import { useState } from 'react';
import { ClientSidebar } from '@/components/layout/client-sidebar';
import { ClientHeader } from '@/components/layout/client-header';
import { ClientDashboardProvider, useClientDashboard } from '@/context/ClientDashboardContext';

const pageTitles: { [key: string]: string } = {
    'overview': 'Dashboard Overview',
    'find-lawyer': 'Find a Lawyer',
    'my-lawyers': 'My Lawyers',
    'documents': 'My Documents',
    'agreements': 'My Agreements',
    'messages': 'Messages',
    'billing': 'Billing & Payments',
    'appointments': 'Appointments',
    'settings': 'Settings',
    'support': 'Help & Support',
};

function ClientDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { page, setPage } = useClientDashboard();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background text-foreground">
            <ClientSidebar page={page} setPage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex min-h-screen flex-col md:ml-64">
                <ClientHeader pageTitle={pageTitles[page] || 'Dashboard'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-grow p-4 md:p-6">
                    <div className="animate-fade">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}


export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClientDashboardProvider>
            <ClientDashboardLayoutContent>{children}</ClientDashboardLayoutContent>
        </ClientDashboardProvider>
    );
}
