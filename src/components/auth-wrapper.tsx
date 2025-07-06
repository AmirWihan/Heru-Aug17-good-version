'use client';
import { useGlobalData } from "@/context/GlobalDataContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthWrapperProps {
    children: React.ReactNode;
    requiredRole: 'admin' | 'lawyer' | 'client';
}

export function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
    const { user, userProfile, loading } = useGlobalData();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // If not logged in, redirect to login page
                router.replace('/login');
            } else if (userProfile && userProfile.role !== requiredRole) {
                // If logged in but wrong role, redirect to dashboard select
                // which will then redirect to the correct dashboard.
                router.replace('/dashboard-select');
            }
        }
    }, [user, userProfile, loading, requiredRole, router]);

    if (loading || !user || !userProfile || userProfile.role !== requiredRole) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
