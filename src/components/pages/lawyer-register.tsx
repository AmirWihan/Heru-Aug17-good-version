
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const registerSchema = z.object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("A valid email is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export function LawyerRegister() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        setIsLoading(true);
        // Simulate API call for registration
        setTimeout(() => {
            toast({
                title: 'Account Created!',
                description: "Let's get your firm's details to complete your profile.",
            });
            setIsLoading(false);
            router.push('/lawyer/onboarding');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <DynamicLogoIcon className="mx-auto h-12 w-12" />
                    <h1 className="mt-4 font-headline text-3xl font-bold">Create a Professional Account</h1>
                    <p className="mt-2 text-muted-foreground">Start by creating your account credentials.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>This is the first step to joining the Heru platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Sarah Johnson" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="sarah.j@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isLoading ? 'Creating Account...' : 'Continue'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <div className="text-center text-sm text-muted-foreground">
                    <p>Already have an account? <Link href="/dashboard-select?role=lawyer" className="underline">Log In</Link></p>
                </div>
            </div>
        </div>
    );
}
