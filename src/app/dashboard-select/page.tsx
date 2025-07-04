
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function RedirectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get('role');

    useEffect(() => {
        let path = '/';
        switch (role) {
            case 'client':
                path = '/client/dashboard';
                break;
            case 'lawyer':
                path = '/lawyer/dashboard';
                break;
            case 'admin':
                path = '/admin/dashboard';
                break;
            default:
                path = '/'; // Fallback to homepage
        }
        router.replace(path);
    }, [role, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
             <Card>
                <CardContent className="flex flex-col justify-center items-center h-[200px] w-[300px] gap-4">
                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     <p className="text-muted-foreground">Redirecting...</p>
                </CardContent>
            </Card>
        </div>
    );
}
