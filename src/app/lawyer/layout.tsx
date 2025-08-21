
'use client';
import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { LawyerDashboardProvider, useLawyerDashboard } from '@/context/LawyerDashboardContext';
import { Button } from '@/components/ui/button';
import { Rocket, X } from 'lucide-react';
import { AuthWrapper } from '@/components/auth-wrapper';
import { IrccChatbot } from '@/components/ircc-chatbot';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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

const BANNER_DISMISS_KEY = 'visafor-upgrade-banner-dismissed-date';

function LawyerDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { page, setPage } = useLawyerDashboard();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isBannerOpen, setIsBannerOpen] = useState(false);
    const pathname = usePathname();
    const isLeadDetail = pathname?.startsWith('/lawyer/leads/') === true;

    // Ensure sidebar is open on lead detail pages (including mobile)
    useEffect(() => {
        if (isLeadDetail) setSidebarOpen(true);
    }, [isLeadDetail]);

    useEffect(() => {
        const lastDismissedDateStr = localStorage.getItem(BANNER_DISMISS_KEY);
        if (lastDismissedDateStr) {
            const lastDismissedDate = new Date(lastDismissedDateStr);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            if (lastDismissedDate < sevenDaysAgo) {
                // It's been more than 7 days, show the banner
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
        <AuthWrapper requiredRole="lawyer">
            <div className="min-h-screen bg-background text-foreground font-body">
                <AppSidebar activePage={page} setPage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} pinned={isLeadDetail} />
                <div className={cn("flex min-h-screen flex-col", isLeadDetail ? "ml-64" : "md:ml-64")}> 
                    <AppHeader pageTitle={pageTitles[page] || 'Dashboard'} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="flex flex-col flex-grow p-4 md:p-6 mb-16">
                        <div className="flex-grow">
                            {children}
                        </div>
                        <footer className="text-center text-xs text-muted-foreground pt-8">
                            Designed & Empowered by VisaFor
                        </footer>
                    </main>
                    {isBannerOpen && (
                        <div className={cn(
                            "fixed bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm text-primary-foreground p-3 shadow-lg z-40 border-t border-primary/50 transition-all",
                            isLeadDetail ? "left-64" : "md:left-64"
                        )}>
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
                    <IrccChatbot />
                </div>
            </div>
        </AuthWrapper>
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
