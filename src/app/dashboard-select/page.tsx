import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, UserCog } from 'lucide-react';
import Link from 'next/link';

const roles = [
    {
        name: 'Client / Applicant',
        description: 'Check your eligibility, find a lawyer, and manage your application.',
        icon: User,
        href: '/client/onboarding',
    },
    {
        name: 'Lawyer / Team Member',
        description: 'Access your CRM to manage clients, cases, and team tasks.',
        icon: UserCog,
        href: '/lawyer/dashboard',
    },
    {
        name: 'Super Admin',
        description: 'Manage the entire platform, view analytics, and control settings.',
        icon: Shield,
        href: '/admin/dashboard',
    },
];

export default function DashboardSelectPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center">
                    <HeruLogoIcon className="mx-auto h-12 w-12" />
                    <h1 className="mt-4 font-headline text-3xl font-bold">Choose Your Dashboard</h1>
                    <p className="mt-2 text-muted-foreground">Select your role to proceed to the correct dashboard.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {roles.map((role) => (
                        <Link key={role.name} href={role.href} passHref>
                            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader className="items-center text-center">
                                    <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                        <role.icon className="h-8 w-8" />
                                    </div>
                                    <CardTitle>{role.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardDescription>{role.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
