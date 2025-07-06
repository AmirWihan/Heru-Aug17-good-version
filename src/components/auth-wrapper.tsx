'use client';
import type { ReactNode } from "react";

interface AuthWrapperProps {
    children: ReactNode;
    requiredRole: 'admin' | 'lawyer' | 'client';
}

// Authentication is currently bypassed for development.
// To re-enable, restore the previous logic that uses useGlobalData and useRouter.
export function AuthWrapper({ children }: AuthWrapperProps) {
    return <>{children}</>;
}
