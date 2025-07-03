import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, UserCog } from 'lucide-react';
import Link from 'next/link';

const roles = [
    {
        name: 'Client / Applicant',
        description: 'Check your eligibility, find a lawyer, and manage your application.',
        icon: User,
        href: '/dashboard-select?role=client',
    },
    {
        name: 'Lawyer / Team Member',
        description: 'Access your CRM to manage clients, cases, and team tasks.',
        icon: UserCog,
        href: '/dashboard-select?role=lawyer',
    },
];

export default function RoleSelectPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 relative">
             <div className="absolute top-6 left-6">
                <Link href="/dashboard-select?role=admin" passHref>
                    <div className="p-3 rounded-full hover:bg-muted cursor-pointer transition-colors" title="Super Admin Login">
                        <Shield className="h-6 w-6 text-muted-foreground" />
                    </div>
                </Link>
            </div>
            <div className="w-full max-w-lg space-y-8">
                <div className="text-center">
                    <HeruLogoIcon className="mx-auto h-12 w-12" />
                    <h1 className="mt-4 font-headline text-3xl font-bold">Welcome to Heru</h1>
                    <p className="mt-2 text-muted-foreground">Please select your role to continue.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                 <div className="text-center text-xs text-muted-foreground">
                    By continuing, you agree to Heru's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                </div>
            </div>
        </div>
    );
}
