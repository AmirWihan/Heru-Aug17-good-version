'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalData } from '@/context/GlobalDataContext';

export default function DashboardSelectPage() {
    const router = useRouter();
    const { user, userProfile, loading } = useGlobalData();

    useEffect(() => {
        if (loading) {
            // Wait until user profile is loaded
            return;
        }

        if (!user) {
            // Not logged in, go to login
            router.replace('/login');
            return;
        }

        if (userProfile) {
            // User profile is loaded, redirect based on role
            switch (userProfile.role) {
                case 'admin':
                    router.replace('/admin/dashboard');
                    break;
                case 'lawyer':
                    router.replace('/lawyer/dashboard');
                    break;
                case 'client':
                    router.replace('/client/dashboard');
                    break;
                default:
                    // Fallback, maybe to login or an error page
                    router.replace('/login');
                    break;
            }
        }
    }, [user, userProfile, loading, router]);

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
