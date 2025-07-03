'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { checkEligibility, EligibilityOutput } from '@/ai/flows/eligibility-checker';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const eligibilitySchema = z.object({
    age: z.coerce.number().min(18, 'Must be at least 18').max(60, 'Must be 60 or younger'),
    educationLevel: z.string({ required_error: 'Please select an education level.' }),
    yearsOfExperience: z.coerce.number().min(0, 'Cannot be negative').max(20),
    ieltsScore: z.coerce.number().min(0, 'Score must be between 0 and 9').max(9),
});

const pathSchema = z.object({
    path: z.string({ required_error: 'Please select an immigration path.' }),
});

export function ClientOnboarding() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityOutput | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const eligibilityForm = useForm<z.infer<typeof eligibilitySchema>>({
        resolver: zodResolver(eligibilitySchema),
        defaultValues: { age: 30, yearsOfExperience: 5, ieltsScore: 7 },
    });

    const pathForm = useForm<z.infer<typeof pathSchema>>({
        resolver: zodResolver(pathSchema),
    });

    const onCheckEligibility = async (values: z.infer<typeof eligibilitySchema>) => {
        setIsLoading(true);
        try {
            const result = await checkEligibility(values);
            setEligibilityResult(result);
            setStep(2);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to check eligibility. Please try again.' });
        }
        setIsLoading(false);
    };

    const onSelectPath = (values: z.infer<typeof pathSchema>) => {
        setIsLoading(true);
        toast({ title: 'Onboarding Complete!', description: `You've selected the ${values.path} path. Redirecting to your dashboard.` });
        setTimeout(() => router.push('/client/dashboard'), 1000);
    };

    const progress = (step / 3) * 100;

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Canada Immigration Onboarding</CardTitle>
                    <CardDescription>Let's find the best immigration path for you.</CardDescription>
                    <div className="pt-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-xs text-muted-foreground mt-2">Step {step} of 3</p>
                    </div>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <Form {...eligibilityForm}>
                            <form onSubmit={eligibilityForm.handleSubmit(onCheckEligibility)} className="space-y-6 animate-fade">
                                <h3 className="text-lg font-semibold">Step 1: Eligibility Check</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="age" control={eligibilityForm.control} render={({ field }) => (
                                        <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="educationLevel" control={eligibilityForm.control} render={({ field }) => (
                                        <FormItem><FormLabel>Highest Education</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="Bachelors">Bachelor's Degree</SelectItem><SelectItem value="Masters">Master's Degree</SelectItem><SelectItem value="PhD">PhD</SelectItem><SelectItem value="Other">Other Diploma/Certificate</SelectItem></SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="yearsOfExperience" control={eligibilityForm.control} render={({ field }) => (
                                        <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="ieltsScore" control={eligibilityForm.control} render={({ field }) => (
                                        <FormItem><FormLabel>IELTS Score (Overall)</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Check My CRS Score
                                </Button>
                            </form>
                        </Form>
                    )}
                    {step === 2 && eligibilityResult && (
                        <div className="space-y-6 text-center animate-fade">
                            <h3 className="text-lg font-semibold">Step 2: Your Results</h3>
                            <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center ${eligibilityResult.isEligible ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                <p className={`font-bold text-4xl ${eligibilityResult.isEligible ? 'text-green-600' : 'text-yellow-600'}`}>{eligibilityResult.crsScore}</p>
                            </div>
                            <p className="font-bold text-xl">{eligibilityResult.isEligible ? "You're a strong candidate!" : "There's room for improvement."}</p>
                            <p className="text-muted-foreground">{eligibilityResult.feedback}</p>
                            <Button onClick={() => setStep(3)} className="w-full">
                                Continue to Next Step <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    {step === 3 && (
                        <Form {...pathForm}>
                             <form onSubmit={pathForm.handleSubmit(onSelectPath)} className="space-y-6 animate-fade">
                                <h3 className="text-lg font-semibold">Step 3: Choose Your Path</h3>
                                <FormField name="path" control={pathForm.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Which immigration path are you most interested in pursuing?</FormLabel>
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select your desired path" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Study Visa">Study Visa</SelectItem>
                                                <SelectItem value="Work Permit">Work Permit</SelectItem>
                                                <SelectItem value="Permanent Residency">Permanent Residency (Express Entry, PNP, etc.)</SelectItem>
                                                <SelectItem value="Family Sponsorship">Family Sponsorship</SelectItem>
                                                <SelectItem value="Not Sure">I'm not sure, I need advice</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Complete Onboarding'}
                                </Button>
                             </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
