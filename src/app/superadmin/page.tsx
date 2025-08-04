// This is the entry point for the Owner (superadmin) portal
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Loader2 } from 'lucide-react';

export default function SuperadminPage() {
  const { userProfile, loading } = useGlobalData();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!userProfile) {
      router.replace('/login');
      return;
    }
    if (userProfile.authRole !== 'superadmin') {
      // Only allow Owner (superadmin) role to access this portal
      router.replace('/not-authorized');
      return;
    }
  }, [userProfile, loading, router]);

  if (loading || !userProfile || userProfile.authRole !== 'superadmin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to dashboard by default
  router.replace('/superadmin/dashboard');
  return null;
}
