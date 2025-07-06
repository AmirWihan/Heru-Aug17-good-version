'use client';
import type { ReactNode } from "react";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
    children: ReactNode;
    requiredRole: 'admin' | 'lawyer' | 'client';
}

export function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
    const { userProfile, loading } = useGlobalData();
    const router = useRouter();

    useEffect(() => {
        if (loading) return; // Wait until user data is loaded

        if (!userProfile) {
            router.replace('/login');
            return;
        }

        if (userProfile.role !== requiredRole) {
            // If roles don't match, redirect them to their correct dashboard
            router.replace('/dashboard-select');
        }

    }, [userProfile, requiredRole, router, loading]);

    if (loading || !userProfile || userProfile.role !== requiredRole) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return <>{children}</>;
}
