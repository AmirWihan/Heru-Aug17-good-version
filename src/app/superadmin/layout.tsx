// Superadmin Portal Layout - matches Lawyer CRM UI
'use client';
import { ReactNode, useState, useEffect } from 'react';
import { SuperadminSidebar } from '@/components/layout/superadmin-sidebar';
import { SuperadminHeader } from '@/components/layout/superadmin-header';
import { Button } from '@/components/ui/button';
import { Rocket, X } from 'lucide-react';

const BANNER_DISMISS_KEY = 'superadmin-upgrade-banner-dismissed-date';

export default function SuperadminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  useEffect(() => {
    const lastDismissedDateStr = localStorage.getItem(BANNER_DISMISS_KEY);
    if (lastDismissedDateStr) {
      const lastDismissedDate = new Date(lastDismissedDateStr);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (lastDismissedDate < thirtyDaysAgo) {
        setIsBannerOpen(true);
      }
    } else {
      setIsBannerOpen(true);
    }
  }, []);

  const handleDismissBanner = () => {
    setIsBannerOpen(false);
    localStorage.setItem(BANNER_DISMISS_KEY, new Date().toISOString());
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <SuperadminSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-screen flex-col md:ml-64">
        <SuperadminHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex flex-col flex-grow p-4 md:p-6 mb-16">
          <div className="flex-grow">
            {children}
          </div>
          <footer className="text-center text-xs text-muted-foreground pt-8">
            Designed & Empowered by VisaFor
          </footer>
        </main>
        {isBannerOpen && (
          <div className="fixed bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm text-primary-foreground p-3 shadow-lg z-40 border-t border-primary/50 transition-all md:left-64">
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Rocket className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Platform Analytics & Insights</p>
                  <p className="text-sm text-primary-foreground/80 hidden sm:block">Upgrade to Enterprise for advanced analytics, unlimited users, and priority support.</p>
                </div>
              </div>
              <div className="flex items-center flex-shrink-0 gap-2">
                <Button size="sm" variant="secondary" onClick={() => { /* Navigate to settings */ }}>Upgrade Now</Button>
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
