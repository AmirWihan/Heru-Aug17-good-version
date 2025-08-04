
'use client';
import { useState } from 'react';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';
import { AdminDashboardProvider, useAdminDashboard } from '@/context/AdminDashboardContext';
import { AuthWrapper } from '@/components/auth-wrapper';
import LoginPage from '@/components/pages/login';
import { useGlobalData } from '@/context/GlobalDataContext';

const pageTitles: { [key: string]: string } = {
    'overview': 'Super Admin Dashboard',
    'users': 'User Management',
    'team': 'Platform Team Roster',
    'tasks': 'All Tasks',
    'documents': 'Document Library',
    'analytics': 'Platform Analytics',
    'payments': 'Payments & Subscriptions',
    'notifications': 'System Notifications',
    'support-tickets': 'Support Tickets',
    'settings': 'Platform Settings',
    'leads': 'Firm Leads',
    'ai-tools': 'AI Tools',
    'appointments': 'Appointments',
};

function AdminDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { page, setPage } = useAdminDashboard();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    // Use context to get userProfile
    const { userProfile, loading } = useGlobalData();
    if (loading) {
        return <div className="flex min-h-screen items-center justify-center"><div className="text-xl">Loading...</div></div>;
    }
    if (!userProfile) {
        // Not logged in: show login form
        return <LoginPage />;
    }
    if (userProfile.authRole !== 'admin') {
        // Logged in but not admin: show not authorized
        return <div className="flex min-h-screen items-center justify-center"><div className="text-xl">Not authorized to access the admin portal.</div></div>;
    }
    // Logged in as admin: show dashboard
    return (
        <div className="min-h-screen bg-background text-foreground">
            <AdminSidebar activePage={page} setActivePage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex min-h-screen flex-col md:ml-64">
                <AdminHeader pageTitle={pageTitles[page] || 'Super Admin'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-grow p-4 md:p-6 flex flex-col">
                    <div className="animate-fade flex-grow">
                        {children}
                    </div>
                    <footer className="text-center text-xs text-muted-foreground pt-8">
                        Designed & Empowered by VisaFor
                    </footer>
                </main>
            </div>
        </div>
    );
}


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminDashboardProvider>
            <AdminDashboardLayoutContent>{children}</AdminDashboardLayoutContent>
        </AdminDashboardProvider>
    );
}
