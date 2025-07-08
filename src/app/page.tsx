
'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Shield, User, Briefcase, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Admin user details for direct login
const adminUser = {
    name: 'Super Admin',
    role: 'Platform Administrator',
    authRole: 'admin',
    email: 'admin@heru.com',
    password: 'password123',
    icon: Shield,
};

const RoleCard = ({
    className,
    icon: Icon,
    title,
    description,
    features,
    onClick,
}: {
    className?: string;
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    onClick: () => void;
}) => (
    <Card
        onClick={onClick}
        className={cn(
            'text-white p-8 rounded-2xl cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between min-h-[380px]',
            className
        )}
    >
        <div>
            <div className="bg-white/20 h-14 w-14 rounded-lg flex items-center justify-center mb-6">
                <Icon className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">{title}</h2>
            <p className="opacity-80 max-w-sm">{description}</p>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20">
            <ul className="space-y-3">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    </Card>
);


export default function UserSelectPage() {
    const router = useRouter();
    const { login } = useGlobalData();
    const { toast } = useToast();
    const [loadingAdmin, setLoadingAdmin] = useState(false);

    const handleAdminLogin = async () => {
        setLoadingAdmin(true);
        try {
            const loggedInUser = await login(adminUser.email, adminUser.password);
            if (loggedInUser) {
                toast({ title: "Admin Login Successful", description: `Welcome, ${loggedInUser.name}!` });
                router.push('/dashboard-select');
            } else {
                toast({
                    title: 'Login Failed',
                    description: "Could not log in as the admin user.",
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'An Error Occurred',
                description: "Something went wrong during login.",
                variant: 'destructive',
            });
        } finally {
            setLoadingAdmin(false);
        }
    };
    
    const handleRoleSelect = (role: 'lawyer' | 'client') => {
        router.push(`/register?role=${role}`);
    };

    return (
        <div className="relative flex flex-col min-h-screen items-center justify-center bg-muted/20 p-4 overflow-hidden">
             {/* Admin Login Button */}
            <div className="absolute top-4 right-4 z-20">
                <Button variant="ghost" size="icon" onClick={handleAdminLogin} disabled={loadingAdmin} title="Admin Login">
                    {loadingAdmin ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
                </Button>
            </div>
            
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-200 via-blue-100 to-transparent opacity-30 blur-3xl -translate-x-1/4"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-200 via-indigo-100 to-transparent opacity-30 blur-3xl translate-x-1/4"></div>
            
            <main className="w-full max-w-5xl space-y-8 z-10">
                <div className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Welcome to VisaFor</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Select your role to get started.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <RoleCard
                        className="bg-blue-600"
                        icon={User}
                        title="I'm a Client"
                        description="Looking for immigration services and want to connect with qualified lawyers."
                        features={['Find Lawyers', 'Case Tracking', 'Document Management']}
                        onClick={() => handleRoleSelect('client')}
                    />
                    <RoleCard
                        className="bg-gradient-to-br from-indigo-600 to-purple-700"
                        icon={Briefcase}
                        title="I'm a Lawyer"
                        description="Immigration lawyer managing my practice with comprehensive CRM tools."
                        features={['Complete CRM System', 'Team Management', 'Performance Analytics']}
                        onClick={() => handleRoleSelect('lawyer')}
                    />
                </div>
                <div className="text-center text-muted-foreground pt-4">
                    <p>Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Sign in here</Link></p>
                </div>
            </main>
        </div>
    );
}
