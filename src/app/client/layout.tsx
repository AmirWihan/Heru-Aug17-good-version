
'use client';
import { useState } from 'react';
import { ClientSidebar } from '@/components/layout/client-sidebar';
import { ClientHeader } from '@/components/layout/client-header';
import { ClientDashboardProvider, useClientDashboard } from '@/context/ClientDashboardContext';
import { AuthWrapper } from '@/components/auth-wrapper';

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
    'ai-assist': 'AI Assist',
    'intake-form': 'Intake Form'
};

function ClientDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { page, setPage } = useClientDashboard();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <AuthWrapper requiredRole="client">
            <div className="min-h-screen bg-background text-foreground">
                <ClientSidebar page={page} setPage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex min-h-screen flex-col md:ml-64">
                    <ClientHeader pageTitle={pageTitles[page] || 'Dashboard'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="flex-grow p-4 md:p-6 flex flex-col">
                        <div className="animate-fade flex-grow">
                            {children}
                        </div>
                        <footer className="text-center text-xs text-muted-foreground pt-8">
                            Designed & Empowered by Heru
                        </footer>
                    </main>
                </div>
            </div>
        </AuthWrapper>
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
