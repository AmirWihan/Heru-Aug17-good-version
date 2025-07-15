
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Briefcase, Shield, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import Link from 'next/link';

export default function RoleSelectionPage() {
    const { login } = useGlobalData();
    const router = useRouter();
    const { toast } = useToast();

    const handleAdminLogin = async () => {
        try {
            await login('admin@heru.com', 'password123');
            toast({ title: 'Admin Login Successful' });
            router.push('/dashboard-select');
        } catch (error) {
            toast({ title: 'Admin Login Failed', variant: 'destructive' });
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
             <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={handleAdminLogin} title="Super Admin Login">
                    <Shield className="h-6 w-6 text-muted-foreground" />
                </Button>
            </div>
            
            <div className="text-center mb-12">
                <DynamicLogoIcon className="h-16 w-16 mx-auto" />
                <h1 className="mt-6 text-4xl font-bold font-headline text-foreground">Welcome to VisaFor</h1>
                <p className="mt-2 text-lg text-muted-foreground">Please select your role to continue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Card asChild>
                    <Link href="/login?role=client" passHref className="text-center p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                        <CardHeader className="flex-1">
                            <User className="h-16 w-16 mx-auto text-primary" />
                            <CardTitle className="mt-4 text-2xl font-bold">I am an Applicant</CardTitle>
                            <CardDescription className="mt-2">Track your application, manage documents, and communicate with your legal team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                Proceed as Applicant <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Link>
                </Card>

                 <Card asChild>
                    <Link href="/login?role=lawyer" passHref className="text-center p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                        <CardHeader className="flex-1">
                            <Briefcase className="h-16 w-16 mx-auto text-primary" />
                            <CardTitle className="mt-4 text-2xl font-bold">I am a Lawyer</CardTitle>
                            <CardDescription className="mt-2">Manage your clients, streamline your workflow with AI tools, and grow your practice.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                Proceed as Lawyer <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            <footer className="absolute bottom-4 text-center text-xs text-muted-foreground">
                Designed & Empowered by VisaFor
            </footer>
        </div>
    );
}
