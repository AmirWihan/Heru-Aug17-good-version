'use client';
import type { ReactNode } from "react";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
    children: ReactNode;
    requiredRole: 'admin' | 'lawyer' | 'client' | 'superadmin';
}

export function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
    const { userProfile, loading } = useGlobalData();
    const router = useRouter();

    useEffect(() => {
        if (loading) return; // Wait until auth state is confirmed

        if (!userProfile) {
            router.replace('/login');
            return;
        }

        if (userProfile.authRole !== requiredRole) {
            // If roles don't match, redirect them to their correct dashboard
            if (userProfile.authRole === 'superadmin') {
                router.replace('/superadmin'); // Change this to your superadmin dashboard route
            } else if (userProfile.authRole === 'admin') {
                router.replace('/admin');
            } else if (userProfile.authRole === 'lawyer') {
                router.replace('/lawyer/dashboard');
            } else if (userProfile.authRole === 'client') {
                router.replace('/client/dashboard');
            } else {
                router.replace('/dashboard-select');
            }
        }

    }, [userProfile, requiredRole, router, loading]);

    // Show a loader while auth state is being determined, or if the user is not the correct role yet
    if (loading || !userProfile || userProfile.authRole !== requiredRole) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return <>{children}</>;
}
