'use client';
import { useState } from 'react';
import { ClientSidebar } from '@/components/layout/client-sidebar';
import { ClientHeader } from '@/components/layout/client-header';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background text-foreground">
            <ClientSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex min-h-screen flex-col md:ml-64">
                <ClientHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-grow p-4 md:p-6">
                    <div className="animate-fade">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
