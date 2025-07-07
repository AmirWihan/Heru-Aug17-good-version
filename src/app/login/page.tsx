'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { GmailIcon } from '@/components/icons/GmailIcon';
import { useGlobalData } from '@/context/GlobalDataContext';
import { LoginFeatureShowcase } from '@/components/login-feature-showcase';

const loginSchema = z.object({
  email: z.string().email("A valid email is required."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { login } = useGlobalData();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "emma.j@heru.com", password: "password123" },
    });

    const handleEmailLogin = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        const user = await login(values.email, values.password);
        if (user) {
            toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
            router.push('/dashboard-select');
        } else {
             toast({
                title: 'Login Failed',
                description: "Please check your credentials and try again.",
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        toast({
            title: 'Feature not available',
            description: "Google sign-in is not enabled in this demo.",
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            <div className="flex items-center justify-center bg-background p-4">
                 <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <DynamicLogoIcon className="mx-auto h-12 w-12" />
                        <h1 className="mt-4 font-headline text-3xl font-bold">Welcome Back</h1>
                        <p className="mt-2 text-muted-foreground">Sign in to access your dashboard.</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button className="w-full" type="submit" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Login
                                    </Button>
                                </form>
                            </Form>
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                                <GmailIcon className="mr-2 h-4 w-4" />
                                Sign in with Google
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Don't have an account? <Link href="/register" className="underline">Sign Up</Link></p>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex">
                 <LoginFeatureShowcase />
            </div>
        </div>
    );
}
