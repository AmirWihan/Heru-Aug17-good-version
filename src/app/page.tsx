
import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, User } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectionPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-slate-900 p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <HeruLogoIcon className="mx-auto h-16 w-16" />
                    <h1 className="mt-6 font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                        Welcome to Heru
                    </h1>
                    <p className="mt-3 text-lg text-muted-foreground">Your AI-Powered Immigration CRM. Please select your role to continue.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Link href="/dashboard-select?role=client">
                        <Card className="group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                            <CardHeader className="flex flex-col items-center text-center p-8">
                                <div className="mb-6 rounded-full bg-primary/10 p-5 text-primary">
                                    <User className="h-12 w-12" />
                                </div>
                                <CardTitle className="font-headline text-2xl font-bold">I'm an Applicant</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground px-8 pb-8">
                                <p>Start your immigration journey, track your application progress, and connect seamlessly with legal experts.</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/dashboard-select?role=lawyer">
                         <Card className="group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20">
                            <CardHeader className="flex flex-col items-center text-center p-8">
                                <div className="mb-6 rounded-full bg-accent/10 p-5 text-accent">
                                    <Briefcase className="h-12 w-12" />
                                </div>
                                <CardTitle className="font-headline text-2xl font-bold">I'm a Legal Professional</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground px-8 pb-8">
                                <p>Manage your clients, streamline your cases, and leverage powerful AI tools to enhance your practice.</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
             <div className="absolute bottom-6 text-center text-sm text-muted-foreground">
                © 2024 MAAT Technologies. All rights reserved. <Link href="/dashboard-select?role=admin" className="underline hover:text-primary">Admin Login</Link>
            </div>
        </div>
    );
}
