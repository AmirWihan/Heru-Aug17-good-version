
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import { useRouter } from 'next/navigation';
import { Shield, Rocket } from 'lucide-react';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function MarketingHeader() {
  const router = useRouter();
  const { toast } = useToast();

  const handleDeploy = () => {
    toast({
        title: "Deployment Initiated",
        description: "Your app is being deployed. This is a simulated action for demonstration purposes.",
    });
    // In a real scenario, this would trigger a backend process or CI/CD pipeline.
    // Since we can't execute commands, we show a success message.
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <DynamicLogoIcon className="h-8 w-8" />
          <span className="font-bold font-headline text-xl">VisaFor</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/for-lawyers" className="transition-colors hover:text-foreground/80 text-foreground/60">
            For Lawyers
          </Link>
          <Link href="/for-clients" className="transition-colors hover:text-foreground/80 text-foreground/60">
            For Applicants
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDeploy}>
            <Rocket className="mr-2 h-4 w-4" />
            Deploy to Firebase
          </Button>
          <Button variant="ghost" onClick={() => router.push('/login')}>
            Login
          </Button>
          <Button onClick={() => router.push('/register')}>Sign Up Free</Button>
        </div>
      </div>
    </header>
  );
}
