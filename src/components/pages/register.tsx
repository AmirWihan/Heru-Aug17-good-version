
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
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Checkbox } from '../ui/checkbox';

const registerSchema = z.object({
  role: z.enum(['lawyer', 'client'], { required_error: 'Please select your role.' }),
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("A valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
  marketingConsent: z.boolean().default(false).optional(),
});

export function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register } = useGlobalData();
    const [isLoading, setIsLoading] = useState(false);

    const roleParam = searchParams.get('role');

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { 
            role: roleParam === 'lawyer' || roleParam === 'client' ? roleParam : undefined, 
            fullName: "", 
            email: "", 
            password: "" 
        },
    });

    useEffect(() => {
        if (roleParam === 'lawyer' || roleParam === 'client') {
            form.setValue('role', roleParam);
        }
    }, [roleParam, form]);


    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        setIsLoading(true);
        try {
            const newUser = await register(values);

            if (!newUser) {
                 throw new Error("This email might already be in use.");
            }

            toast({
                title: 'Account Created!',
                description: "Let's get your profile started.",
            });

            // Redirect based on role
            if (values.role === 'lawyer') {
                router.push('/lawyer/onboarding');
            } else {
                router.push('/client/onboarding');
            }

        } catch (error: any) {
            toast({
                title: 'Registration Failed',
                description: error.message || "An unknown error occurred.",
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <DynamicLogoIcon className="mx-auto h-12 w-12" />
                    <h1 className="mt-4 font-headline text-3xl font-bold">Create an Account</h1>
                    <p className="mt-2 text-muted-foreground">Join VisaFor to streamline your immigration journey.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="role" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>I am a...</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="lawyer" /></FormControl>
                                                    <FormLabel className="font-normal">Lawyer / Professional</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="client" /></FormControl>
                                                    <FormLabel className="font-normal">Client / Applicant</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
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
                                 <FormField
                                    control={form.control}
                                    name="termsAgreed"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm">
                                                    I agree to the <Link href="/terms" target="_blank" className="underline hover:text-primary">Terms and Conditions</Link>.
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="marketingConsent"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm">
                                                   I would like to receive news and marketing emails from VisaFor.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <div className="text-center text-sm text-muted-foreground">
                    <p>Already have an account? <Link href="/login" className="underline">Log In</Link></p>
                </div>
            </div>
        </div>
    );
}
