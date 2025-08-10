
'use client';

import { useGlobalData } from '@/context/GlobalDataContext';
import Image from 'next/image';
import { HeruLogoIcon } from './HeruLogoIcon';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/data';

interface DynamicLogoIconProps {
  className?: string;
}

export function DynamicLogoIcon({ className }: DynamicLogoIconProps) {
  const { logos, userProfile } = useGlobalData();
  
  let logoKey: string | null = null;
  
  // Use firm-scoped logo for any firm team member (Admin, Standard User, Viewer).
  // Only use 'platform' for unauthenticated, clients, or superadmin contexts.
  if (userProfile && userProfile.authRole !== 'superadmin') {
    const maybeTeam = userProfile as Partial<TeamMember>;
    if (maybeTeam.firmName) {
      logoKey = maybeTeam.firmName;
    } else {
      logoKey = 'platform';
    }
  } else {
    logoKey = 'platform';
  }

  const logoSrc = logoKey ? logos[logoKey] : null;

  if (logoSrc) {
    // We can't know the aspect ratio, so we'll use fill and let the parent container size it.
    // The parent containers use h-8 w-8, h-12 w-12 etc. which works well.
    return (
        <div className={cn('relative', className)}>
            <Image 
                src={logoSrc} 
                alt="Workspace Logo" 
                fill
                sizes="48px" // Provide a hint for optimization
                className="object-contain"
            />
        </div>
    );
  }

  return <HeruLogoIcon className={className} />;
}
