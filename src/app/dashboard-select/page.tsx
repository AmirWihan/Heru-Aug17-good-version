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
            return; // Wait for auth and profile to load
        }

        if (!user) {
            router.replace('/login');
            return;
        }

        if (userProfile) {
            let path = '/';
            switch (userProfile.role) {
                case 'client':
                    path = '/client/dashboard';
                    break;
                case 'lawyer':
                    path = '/lawyer/dashboard';
                    break;
                case 'admin':
                    path = '/admin/dashboard';
                    break;
                default:
                    path = '/login'; // Fallback if role is unknown
            }
            router.replace(path);
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
