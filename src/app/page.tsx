
'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Shield, User, Briefcase, Rocket } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const adminUser = {
    name: 'Super Admin',
    role: 'Platform Administrator',
    authRole: 'admin',
    email: 'admin@heru.com',
    password: 'password123',
    icon: Shield,
};

const lawyerUser = {
    name: 'Sarah Johnson',
    role: 'Lawyer / Professional',
    authRole: 'lawyer',
    email: 'sarah.j@heru.com',
    password: 'password123',
    icon: Briefcase,
};

const clientUser = {
    name: 'James Wilson',
    role: 'Client / Applicant',
    authRole: 'client',
    email: 'james.wilson@example.com',
    password: 'password123',
    icon: User,
}

const RoleCard = ({
    className,
    icon: Icon,
    title,
    description,
    onClick,
    isLoading,
}: {
    className?: string;
    icon: React.ElementType;
    title: string;
    description: string;
    onClick: () => void;
    isLoading: boolean;
}) => (
    <Card
        className={cn(
            'text-white p-8 rounded-2xl flex flex-col justify-between shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1',
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
        <div className="mt-8">
            <Button onClick={onClick} disabled={isLoading} className="w-full bg-white/90 text-black hover:bg-white text-base py-6">
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 View as {title}
            </Button>
        </div>
    </Card>
);


export default function UserSelectPage() {
    const router = useRouter();
    const { login } = useGlobalData();
    const { toast } = useToast();
    const [loadingRole, setLoadingRole] = useState<'lawyer' | 'client' | 'admin' | null>(null);

    const handleLogin = async (role: 'lawyer' | 'client' | 'admin') => {
        setLoadingRole(role);
        
        let userToLogin;
        if (role === 'admin') userToLogin = adminUser;
        else if (role === 'lawyer') userToLogin = lawyerUser;
        else userToLogin = clientUser;

        try {
            const loggedInUser = await login(userToLogin.email, userToLogin.password);
            if (loggedInUser) {
                toast({ title: `${userToLogin.role} Login Successful`, description: `Welcome, ${loggedInUser.name}!` });
                router.push('/dashboard-select');
            } else {
                toast({
                    title: 'Login Failed',
                    description: `Could not log in as the ${role} user.`,
                    variant: 'destructive',
                });
                 setLoadingRole(null);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'An Error Occurred',
                description: "Something went wrong during login.",
                variant: 'destructive',
            });
            setLoadingRole(null);
        }
    };

    const handleDeploy = () => {
        toast({
            title: "Deployment Initiated",
            description: "Your app is being deployed. This is a simulated action for demonstration purposes.",
        });
    };

    return (
        <div className="relative flex flex-col min-h-screen items-center justify-center bg-muted/20 p-4 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-200 via-blue-100 to-transparent opacity-30 blur-3xl -translate-x-1/4"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-200 via-indigo-100 to-transparent opacity-30 blur-3xl translate-x-1/4"></div>
            
            <div className="absolute top-6 right-6 z-20 flex gap-2">
                 <Button variant="outline" onClick={handleDeploy}>
                    <Rocket className="mr-2 h-4 w-4" />
                    Deploy to Firebase
                </Button>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleLogin('admin')}
                                disabled={loadingRole === 'admin'}
                                className="bg-background/50 backdrop-blur-sm"
                            >
                                {loadingRole === 'admin' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Super Admin Login</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <main className="w-full max-w-4xl space-y-8 z-10">
                <div className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Welcome to VisaFor</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Select a role to view the platform.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <RoleCard
                        className="bg-blue-600"
                        icon={clientUser.icon}
                        title="Client"
                        description="Applicant seeking immigration services and managing their case."
                        onClick={() => handleLogin('client')}
                        isLoading={loadingRole === 'client'}
                    />
                    <RoleCard
                        className="bg-gradient-to-br from-indigo-600 to-purple-700"
                        icon={lawyerUser.icon}
                        title="Lawyer"
                        description="Professional managing clients, cases, and their team within the CRM."
                         onClick={() => handleLogin('lawyer')}
                         isLoading={loadingRole === 'lawyer'}
                    />
                </div>
                 <div className="text-center text-muted-foreground pt-4 text-sm">
                    <p>Or, <Link href="/login" className="font-semibold text-primary hover:underline">sign in manually</Link>.</p>
                </div>
            </main>
        </div>
    );
}
