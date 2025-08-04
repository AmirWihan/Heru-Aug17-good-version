
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
  role: z.enum(['lawyer', 'client', 'admin'], { required_error: 'Please select your role.' }),
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("A valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
  marketingConsent: z.boolean().default(false).optional(),
  // Only basic firm name for lawyers during registration
  firmName: z.string().min(2, 'Firm name is required.').optional(),
});

export function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register, consumeClientInvitation } = useGlobalData();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const roleParam = searchParams.get('role');
    const refParam = searchParams.get('ref');
    const emailParam = searchParams.get('email');

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { 
            role: roleParam === 'lawyer' || roleParam === 'client' || roleParam === 'admin' ? roleParam : (refParam ? 'client' : undefined), 
            fullName: "", 
            email: emailParam ? decodeURIComponent(emailParam) : "", 
            password: "",
            firmName: "",
        },
    });

    useEffect(() => {
        if (roleParam === 'lawyer' || roleParam === 'client') {
            form.setValue('role', roleParam);
        } else if (refParam) {
            form.setValue('role', 'client');
        }
        if (emailParam) {
            form.setValue('email', decodeURIComponent(emailParam));
        }
    }, [roleParam, refParam, emailParam, form]);




const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        console.log('🔍 Registration form submitted with values:', values);
        setIsLoading(true);
        try {
            // Only validate basic fields for registration
            if (values.role === 'lawyer' && !values.firmName) {
                throw new Error("Firm name is required for lawyer registration.");
            }

            const lawyerId = refParam ? parseInt(refParam, 10) : null;
            if (lawyerId && values.role === 'client') {
                const invitation = consumeClientInvitation(values.email);
                if (!invitation || invitation.invitingLawyerId !== lawyerId) {
                    throw new Error("Invalid or expired invitation link.");
                }
            }

            const { role, ...rest } = values;
            const submitRole = role === 'admin' ? 'client' : role;
            console.log('📝 Calling register function with:', { ...rest, role: submitRole });
            
            const newUser = await register({ ...rest, role: submitRole }, lawyerId);
            console.log('📝 Register function returned:', newUser);

            if (!newUser) {
                 throw new Error("This email might already be in use.");
            }

            toast({
                title: 'Account Created!',
                description: "Let's get your profile started.",
            });

            // The /dashboard-select page will now handle routing to onboarding
            router.push('/dashboard-select');

        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.message || "An unknown error occurred.");
            toast({
                title: 'Registration Failed',
                description: error.message || "An unknown error occurred.",
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                console.error('Form validation errors:', errors);
                                toast({
                                    title: 'Validation Error',
                                    description: 'Please check all required fields.',
                                    variant: 'destructive',
                                });
                            })} className="space-y-4">
                                <FormField control={form.control} name="role" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>I am a...</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="admin" /></FormControl>
                                                    <FormLabel className="font-normal">Super Admin</FormLabel>
                                                </FormItem>
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

                                {/* Lawyer-specific firm name only */}
                                {form.watch('role') === 'lawyer' && (
                                  <FormField control={form.control} name="firmName" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Firm Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Your Law Firm Name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )} />
                                )}
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
                                {error && (
  <div className="text-red-500 text-sm mb-2">{error}</div>
)}
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
        </>
    );
}
