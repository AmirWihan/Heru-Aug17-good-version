
'use client';
import { ClientOnboarding } from "@/components/pages/client-onboarding";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientOnboardingPage() {
    const router = useRouter();

    const handleOnboardingComplete = () => {
        // Redirect to the dashboard after a short delay to allow user to see their score
        setTimeout(() => {
            router.push('/client/dashboard');
        }, 3000);
    };

    return <ClientOnboarding onOnboardingComplete={handleOnboardingComplete} />;
}
