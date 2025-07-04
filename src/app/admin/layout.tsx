'use client';
import { useState } from 'react';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';
import { AdminDashboardProvider, useAdminDashboard } from '@/context/AdminDashboardContext';

const pageTitles: { [key: string]: string } = {
    'overview': 'Super Admin Dashboard',
    'users': 'User Management',
    'cases': 'All Cases',
    'analytics': 'Platform Analytics',
    'payments': 'Payments & Subscriptions',
    'notifications': 'System Notifications',
    'settings': 'Platform Settings',
};

function AdminDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { page, setPage } = useAdminDashboard();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background text-foreground">
            <AdminSidebar activePage={page} setActivePage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex min-h-screen flex-col md:ml-64">
                <AdminHeader pageTitle={pageTitles[page] || 'Super Admin'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-grow p-4 md:p-6">
                    <div className="animate-fade">
                        {children}
                    </div>
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
