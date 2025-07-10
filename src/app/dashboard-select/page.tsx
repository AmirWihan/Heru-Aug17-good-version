
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Client } from '@/lib/data';

export default function DashboardSelectPage() {
    const router = useRouter();
    const { userProfile, loading } = useGlobalData();

    useEffect(() => {
        if (loading) return; // Wait until loading is complete

        if (userProfile) {
            switch (userProfile.authRole) {
                case 'admin':
                    router.replace('/admin/dashboard');
                    break;
                case 'lawyer':
                    // In a real app, you might check for lawyer onboarding status too
                    router.replace('/lawyer/dashboard');
                    break;
                case 'client':
                    const clientProfile = userProfile as Client;
                    if (clientProfile.onboardingComplete) {
                        router.replace('/client/dashboard');
                    } else {
                        router.replace('/client/onboarding');
                    }
                    break;
                default:
                    router.replace('/login');
            }
        } else {
            // If no profile, wait a bit for it to load, then redirect to login if still nothing
            const timer = setTimeout(() => {
                router.replace('/login');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [userProfile, router, loading]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
             <Card>
                <CardContent className="flex flex-col justify-center items-center h-[200px] w-[300px] gap-4">
                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     <p className="text-muted-foreground">Redirecting...</p>
                </CardContent>
            </Card>
        </div>
    );
}
