'use client';
import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { LawyerDashboardProvider, useLawyerDashboard } from '@/context/LawyerDashboardContext';
import { Button } from '@/components/ui/button';
import { Rocket, X } from 'lucide-react';

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
    'support': 'Help & Support',
};

const BANNER_DISMISS_KEY = 'heru-upgrade-banner-dismissed-date';

function LawyerDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { page, setPage } = useLawyerDashboard();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isBannerOpen, setIsBannerOpen] = useState(false);

    useEffect(() => {
        const lastDismissedDateStr = localStorage.getItem(BANNER_DISMISS_KEY);
        if (lastDismissedDateStr) {
            const lastDismissedDate = new Date(lastDismissedDateStr);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (lastDismissedDate < thirtyDaysAgo) {
                // It's been more than 30 days, show the banner
                setIsBannerOpen(true);
            }
        } else {
            // Never dismissed, show the banner
            setIsBannerOpen(true);
        }
    }, []);

    const handleDismissBanner = () => {
        setIsBannerOpen(false);
        localStorage.setItem(BANNER_DISMISS_KEY, new Date().toISOString());
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-body">
            <AppSidebar activePage={page} setPage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex min-h-screen flex-col md:ml-64">
                <AppHeader pageTitle={pageTitles[page] || 'Dashboard'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-grow p-4 md:p-6 mb-16">
                    {children}
                </main>
                {isBannerOpen && (
                    <div className="fixed bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm text-primary-foreground p-3 shadow-lg z-40 border-t border-primary/50 transition-all md:left-64">
                        <div className="container mx-auto flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Rocket className="h-6 w-6" />
                                <div>
                                    <p className="font-semibold">Unlock Your Firm's Full Potential</p>
                                    <p className="text-sm text-primary-foreground/80 hidden sm:block">Upgrade to Pro for advanced AI, unlimited clients, and priority support.</p>
                                </div>
                            </div>
                            <div className="flex items-center flex-shrink-0 gap-2">
                                <Button size="sm" variant="secondary" onClick={() => { setPage('settings'); }}>Upgrade Now</Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismissBanner}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Dismiss</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
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
