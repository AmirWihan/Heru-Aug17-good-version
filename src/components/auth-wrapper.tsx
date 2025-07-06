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
        if (loading) return; // Wait until auth state is loaded

        if (!user) {
            router.replace('/login');
            return;
        }

        if (userProfile && userProfile.role !== requiredRole) {
            // User is logged in but trying to access the wrong dashboard
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
                    router.replace('/login'); // Fallback
            }
        }
    }, [user, userProfile, loading, router, requiredRole]);

    if (loading || !user || !userProfile || userProfile.role !== requiredRole) {
        // Show a loading screen while checking auth or redirecting
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
