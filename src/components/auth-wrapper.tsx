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

    // Bypassing auth check for development
    return <>{children}</>;
}
