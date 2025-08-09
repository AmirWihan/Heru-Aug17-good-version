'use client';
import { BillingSubscription } from '@/components/pages/billing-subscription';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGlobalData } from '@/context/GlobalDataContext';

console.log('[DEBUG] LawyerBillingPage mounted');

export default function LawyerBillingPage() {
  const pathname = usePathname();
  const { userProfile, loading } = useGlobalData();
  console.log('[DEBUG] LawyerBillingPage pathname:', pathname, 'userProfile:', userProfile, 'loading:', loading);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    // Check for card on file using only localStorage
    const cardOnFile = typeof window !== 'undefined' && localStorage.getItem('cardOnFile') === 'true';
    if (cardOnFile) {
      router.replace('/lawyer/dashboard');
    }
  }, [loading, router]);

  // Only render BillingSubscription if no card on file
  const cardOnFile = typeof window !== 'undefined' && localStorage.getItem('cardOnFile') === 'true';
  if (cardOnFile) return null;
  return <BillingSubscription />;
}