
'use client';

import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.913,34.588,44,28.718,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const AppleIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19.18,9.75c-1.48-1.46-3.46-1.63-4.9-1.63c-1.8,0-3.03,.84-4.13,.84c-1.09,0-2.02-.79-3.56-.79c-2.3,0-4.32,1.63-5.38,4.01c-1.2,2.77-.31,6.55,1.16,8.81c.71,1.09,1.55,2.25,2.69,2.25c1.11,0,1.53-.73,3.03-.73c1.51,0,1.86,.73,3.09,.73c1.23,0,2.02-1.12,2.68-2.23c.82-1.34,1.14-2.65,1.16-2.69c0,0-.03-2.13-1.02-3.23c-.94-1.05-2.54-1.55-2.6-1.56c-.05,0-1.78-.17-1.78,1.44c0,0,0,1.88,2.75,1.38c-2.88,2.77,2.1,5.59,2.1,5.59c-2.59-4.38,1.86-7.39,1.93-7.46C20.59,12.21,20.67,11.21,19.18,9.75M16.19,3.53c.84-.99,1.44-2.33,1.3-3.53c-1.21,.06-2.61,.79-3.45,1.78c-.73,.86-1.5,2.2-1.36,3.41C13.9,6.4,15.34,5.65,16.19,3.53"></path>
    </svg>
);

const FacebookIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path fill="#1877F2" d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-1.5c-1,0-1.25.47-1.25,1.25V12h2.75l-.4,3H13.25v6.8C18.56,20.87,22,16.84,22,12Z"></path>
    </svg>
);

export default function LoginPage() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'client';
    const router = useRouter();
    const { toast } = useToast();
    const { teamMembers, clients, isLoaded } = useGlobalData();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getRedirectPath = () => {
        switch (role) {
            case 'client':
                return '/client/onboarding';
            case 'lawyer':
                return '/lawyer/register'; // Default new lawyers to registration
            case 'admin':
                return '/admin/dashboard';
            default:
                return '/';
        }
    };

    const getRoleName = () => {
         switch (role) {
            case 'client':
                return 'Client / Applicant';
            case 'lawyer':
                return 'Lawyer / Team Member';
            case 'admin':
                return 'Super Admin';
            default:
                return 'User';
        }
    }

    const redirectPath = getRedirectPath();
    const roleName = getRoleName();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const processedEmail = email.toLowerCase().trim();

        // 1. Check password first
        if (password !== 'password123') {
            toast({ title: 'Login Failed', description: 'Invalid email or password.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }

        // 2. Handle login based on role
        if (role === 'admin') {
            const user = teamMembers.find(m => m.type === 'admin' && m.email.toLowerCase().trim() === processedEmail);
            if (user?.status === 'Active') {
                toast({ title: 'Login Successful', description: `Welcome back, ${user.name}!` });
                router.push('/admin/dashboard');
                return; // Exit successfully
            }
        } else if (role === 'lawyer') {
            const user = teamMembers.find(m => m.type === 'legal' && m.email.toLowerCase().trim() === processedEmail);
            if (user) {
                if (user.status === 'Active') {
                    toast({ title: 'Login Successful', description: `Welcome back, ${user.name}!` });
                    router.push('/lawyer/dashboard');
                    return; // Exit successfully
                } else {
                    toast({ title: 'Account Not Active', description: `Your account status is: ${user.status}. Please wait for activation or contact support.`, variant: 'destructive' });
                    setIsLoading(false);
                    return; // Exit with specific error
                }
            }
        } else if (role === 'client') {
            const user = clients.find(c => c.email.toLowerCase().trim() === processedEmail);
            if (user) {
                toast({ title: 'Login Successful', description: `Welcome back, ${user.name}!` });
                router.push('/client/dashboard');
                return; // Exit successfully
            }
        }

        // 3. If we reach here, it means no user was found for the role, or they were inactive.
        toast({ title: 'Login Failed', description: 'Invalid credentials for the selected role.', variant: 'destructive' });
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <DynamicLogoIcon className="mx-auto h-12 w-12" />
                    <h1 className="mt-4 font-headline text-3xl font-bold">Log in as {roleName}</h1>
                    <p className="mt-2 text-muted-foreground">Your AI-Powered Immigration CRM</p>
                </div>
                { !isLoaded ? (
                    <Card>
                        <CardContent className="flex justify-center items-center h-[460px]">
                             <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </CardContent>
                    </Card>
                ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Choose your preferred method to continue.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full" variant="outline">
                            <GoogleIcon /> Continue with Google
                        </Button>
                        <Button className="w-full" variant="outline">
                            <FacebookIcon /> Continue with Facebook
                        </Button>
                         <Button className="w-full" variant="outline">
                            <AppleIcon /> Continue with Apple
                        </Button>
                        <div className="relative">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                                OR
                            </span>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <p className="text-xs text-muted-foreground">Hint: Use 'password123' for this prototype.</p>
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? 'Logging in...' : 'Continue with Email'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                )}
                <div className="text-center text-sm text-muted-foreground">
                     {role !== 'admin' && (
                        <p>New here? <Link href={redirectPath} className="underline">Create an account</Link></p>
                    )}
                    <Link href="/" className="underline mt-2 inline-block">Back to role selection</Link>
                </div>
            </div>
        </div>
    );
}
