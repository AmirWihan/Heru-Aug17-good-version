
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email("A valid email is required."),
});

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const { sendPasswordReset } = useGlobalData();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const handlePasswordReset = async (values: z.infer<typeof forgotPasswordSchema>) => {
        setIsLoading(true);
        try {
            await sendPasswordReset(values.email);
            setIsSubmitted(true);
        } catch (error: any) {
            toast({
                title: 'Request Failed',
                description: error.message || "Could not send password reset email. Please try again.",
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
             <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <DynamicLogoIcon className="mx-auto h-12 w-12" />
                    <CardTitle className="font-headline text-3xl font-bold mt-4">
                        {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
                    </CardTitle>
                    <CardDescription>
                         {isSubmitted 
                            ? `We've sent a password reset link to ${form.getValues('email')}. Please follow the instructions in the email.`
                            : "Enter your email address and we'll send you a link to reset your password."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                         <div className="text-center">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <Link href="/login" passHref>
                                <Button className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
