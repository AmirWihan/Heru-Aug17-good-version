
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff, Shield, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { GmailIcon } from '@/components/icons/GmailIcon';
import { useGlobalData } from '@/context/GlobalDataContext';
import { LoginFeatureShowcase } from '@/components/login-feature-showcase';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

function LoginPageInner() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useGlobalData();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "password123" },
    });

    useEffect(() => {
        const role = searchParams.get('role');
        if (role === 'lawyer') {
            form.setValue('email', 'sarah.johnson@example.com');
        } else if (role === 'client') {
            form.setValue('email', 'james.wilson@example.com');
        }
    }, [searchParams, form]);

    const handleEmailLogin = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        try {
            console.log('🔍 Login attempt:', { email: values.email, password: values.password });
            const user = await login(values.email, values.password);
            console.log('✅ Login result:', user);
            if (user) {
                toast({ 
                    title: "Login Successful", 
                    description: `Welcome back, ${user.name}! Redirecting to your dashboard...` 
                });
                console.log('🎯 Redirecting to:', user.authRole);
                if (user.authRole === 'superadmin') {
                    router.push('/superadmin');
                } else if (user.authRole === 'admin') {
                    router.push('/admin');
                } else if (user.authRole === 'lawyer') {
                    router.push('/lawyer/dashboard');
                } else if (user.authRole === 'client') {
                    router.push('/client/dashboard');
                } else {
                    router.push('/dashboard-select');
                }
            } else {
                console.log('❌ Login failed: No user returned');
                toast({
                    title: 'Login Failed',
                    description: "Please check your credentials and try again.",
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            console.log('💥 Login error:', error);
            toast({
                title: 'Login Failed',
                description: error.message || "An unknown error occurred.",
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        toast({
            title: 'Feature Coming Soon',
            description: "Google sign-in will be available in the next update.",
        });
    };

    const role = searchParams.get('role');
    const isLawyer = role === 'lawyer';
    const isClient = role === 'client';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="flex items-center justify-center p-8">
                 <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <DynamicLogoIcon className="h-16 w-16" />
                        </div>
                        <h1 className="text-3xl font-bold font-headline bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {isLawyer && "Sign in to access your legal practice dashboard."}
                            {isClient && "Sign in to track your immigration application."}
                            {!isLawyer && !isClient && "Sign in to access your VisaFor dashboard."}
                        </p>
                        
                        {/* Role Indicator */}
                        {(isLawyer || isClient) && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/20">
                                {isLawyer ? (
                                    <>
                                        <Briefcase className="h-4 w-4 text-indigo-600" />
                                        <span className="text-sm font-medium text-indigo-600">Legal Professional</span>
                                    </>
                                ) : (
                                    <>
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-600">Applicant</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl">Sign In</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email" 
                                                    placeholder="you@example.com" 
                                                    className="h-11"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel className="text-sm font-medium">Password</FormLabel>
                                                <Link href="/forgot-password" passHref>
                                                    <Button variant="link" type="button" className="text-xs h-auto p-0 text-blue-600 hover:text-blue-700">
                                                        Forgot Password?
                                                    </Button>
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        type={showPassword ? "text" : "password"} 
                                                        placeholder="••••••••" 
                                                        className="h-11 pr-10"
                                                        {...field} 
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    
                                    <Button 
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium" 
                                        type="submit" 
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isLoading ? "Signing In..." : "Sign In"}
                                    </Button>
                                </form>
                            </Form>
                            
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/80 px-4 text-muted-foreground font-medium">Or continue with</span>
                                </div>
                            </div>
                            
                            <Button 
                                variant="outline" 
                                className="w-full h-11 border-gray-200 hover:bg-gray-50" 
                                onClick={handleGoogleLogin} 
                                disabled={isLoading}
                            >
                                <GmailIcon className="mr-2 h-4 w-4" />
                                Sign in with Google
                            </Button>
                        </CardContent>
                    </Card>
                    
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700 underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                    
                    {/* Security Notice */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        <span>Your data is protected with enterprise-grade security</span>
                    </div>
                </div>
            </div>
            
            <div className="hidden lg:flex">
                 <LoginFeatureShowcase />
            </div>
        </div>
    );
}

import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <Suspense>
            <LoginPageInner />
        </Suspense>
    );
}
