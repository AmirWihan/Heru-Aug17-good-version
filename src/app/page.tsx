
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Shield, User, Briefcase } from 'lucide-react';

const usersToLogin = [
    {
        name: 'Sarah Johnson',
        role: 'Immigration Lawyer',
        authRole: 'lawyer',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        email: 'sarah.j@heru.com',
        password: 'password123',
        icon: Briefcase,
    },
    {
        name: 'James Wilson',
        role: 'Client / Applicant',
        authRole: 'client',
        avatar: 'https://i.pravatar.cc/150?u=james',
        email: 'james.wilson@example.com',
        password: 'password123',
        icon: User,
    },
    {
        name: 'Super Admin',
        role: 'Platform Administrator',
        authRole: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=superadmin',
        email: 'admin@heru.com',
        password: 'password123',
        icon: Shield,
    },
];

export default function UserSelectPage() {
    const router = useRouter();
    const { login } = useGlobalData();
    const { toast } = useToast();
    const [loadingUser, setLoadingUser] = useState<string | null>(null);

    const handleLogin = async (user: typeof usersToLogin[0]) => {
        setLoadingUser(user.authRole);
        try {
            const loggedInUser = await login(user.email, user.password);
            if (loggedInUser) {
                toast({ title: "Login Successful", description: `Welcome, ${loggedInUser.name}!` });
                router.push('/dashboard-select');
            } else {
                toast({
                    title: 'Login Failed',
                    description: "Could not log in as the selected user.",
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
            setLoadingUser(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-muted/40 p-4">
            <main className="w-full max-w-4xl space-y-8">
                <div className="text-center">
                    <DynamicLogoIcon className="mx-auto h-16 w-16 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Welcome to Heru</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Select a user profile to start exploring.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {usersToLogin.map((user) => {
                        const Icon = user.icon;
                        return (
                            <Card key={user.authRole} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader className="items-center">
                                    <Avatar className="w-20 h-20 mb-4">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <CardTitle>{user.name}</CardTitle>
                                    <CardDescription>{user.role}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full" onClick={() => handleLogin(user)} disabled={!!loadingUser}>
                                        {loadingUser === user.authRole ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Icon className="mr-2 h-4 w-4" />
                                        )}
                                        Login as {user.authRole.charAt(0).toUpperCase() + user.authRole.slice(1)}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}
