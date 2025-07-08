

'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle, Building, Award, CreditCard, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useGlobalData, UserProfile } from '@/context/GlobalDataContext';
import { plans, type TeamMember } from '@/lib/data';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';

const onboardingSchema = z.object({
    // Step 0 - This data might already exist from registration, but we collect it here for completeness
    firmName: z.string().min(2, "Firm name is required."),
    firmAddress: z.string().min(10, "Firm address is required."),
    numEmployees: z.coerce.number().min(1, "At least one employee is required."),
    firmWebsite: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    // Step 1
    licenseNumber: z.string().min(5, "A valid license number is required."),
    registrationNumber: z.string().min(5, "A valid registration number is required."),
    governmentId: z.any().refine(file => file?.name, "Government ID is required."),
    // Step 2
    selectedPlan: z.enum(['starter', 'pro', 'enterprise']),
    billingCycle: z.enum(['monthly', 'annually']).default('monthly'),
});


const steps = [
    { name: 'Firm Details', icon: Building, fields: ['firmName', 'firmAddress', 'numEmployees', 'firmWebsite'] as const },
    { name: 'License & Verification', icon: Award, fields: ['licenseNumber', 'registrationNumber', 'governmentId'] as const },
    { name: 'Subscription Plan', icon: CreditCard, fields: ['selectedPlan', 'billingCycle'] as const },
];

export function LawyerOnboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const { userProfile, updateUserProfile } = useGlobalData();

    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            firmName: "",
            firmAddress: "",
            numEmployees: 1,
            firmWebsite: '',
            licenseNumber: "",
            registrationNumber: "",
            governmentId: undefined,
            selectedPlan: 'pro',
            billingCycle: 'monthly',
        }
    });

    const selectedPlanId = form.watch('selectedPlan');
    const billingCycle = form.watch('billingCycle');

    async function processSubmit(data: z.infer<typeof onboardingSchema>) {
        if (!userProfile) {
            toast({ title: "Error", description: "You must be logged in to complete onboarding.", variant: "destructive" });
            router.push('/login');
            return;
        }

        const planName = data.selectedPlan === 'pro' ? 'Pro Team' : data.selectedPlan.charAt(0).toUpperCase() + data.selectedPlan.slice(1) as 'Starter' | 'Enterprise';
        
        const updates: Partial<UserProfile> = {
            role: 'Awaiting Verification',
            status: 'Pending Activation',
            plan: planName,
            billingCycle: data.billingCycle,
            licenseNumber: data.licenseNumber,
            registrationNumber: data.registrationNumber,
            firmName: data.firmName,
            firmAddress: data.firmAddress,
            numEmployees: data.numEmployees,
            firmWebsite: data.firmWebsite,
        };

        // In a real app, you would upload the file to Firebase Storage here
        // and save the URL in the 'updates' object.
        // For now, we'll just proceed.

        await updateUserProfile(updates);

        setIsComplete(true);
        toast({
            title: 'Request Submitted!',
            description: 'Your account is now pending activation. We will review your credentials shortly.',
        });
    }

    const nextStep = async () => {
        const fields = steps[currentStep].fields;
        const output = await form.trigger(fields, { shouldFocus: true });
        
        if (!output) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await form.handleSubmit(processSubmit)();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const progress = isComplete ? 100 : ((currentStep + 1) / (steps.length + 1)) * 100;
    
    if (isComplete) {
        return (
             <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-8">
                <Card className="w-full max-w-2xl text-center animate-fade">
                    <CardHeader>
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                        <CardTitle className="font-headline text-2xl">Setup Complete!</CardTitle>
                        <CardDescription>Your request for activation has been submitted.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Our team will review your license and registration information. You will receive an email notification once your account is activated. This typically takes 1-2 business days.
                        </p>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" onClick={() => router.push('/login')}>
                            Back to Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-8">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Welcome! Let's Set Up Your Firm.</CardTitle>
                    <CardDescription>Complete these steps to activate your professional account.</CardDescription>
                     <div className="pt-4">
                        <Progress value={progress} className="w-full" />
                        <div className="flex justify-between mt-2">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex-1 text-center">
                                    <p className={`text-sm ${index === currentStep ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                                        {step.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <Form {...form}>
                    <form>
                        <CardContent className="min-h-[420px]">
                            {currentStep === 0 && (
                                <div className="space-y-4 animate-fade">
                                    <h3 className="font-semibold text-lg flex items-center"><Building className="mr-2 h-5 w-5"/>Firm Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <FormField control={form.control} name="firmName" render={({ field }) => (
                                            <FormItem><FormLabel>Firm Name</FormLabel><FormControl><Input placeholder="e.g., Heru Immigration Services" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                         <FormField control={form.control} name="firmWebsite" render={({ field }) => (
                                            <FormItem><FormLabel>Firm Website (Optional)</FormLabel><FormControl><Input type="url" placeholder="https://www.yourfirm.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="firmAddress" render={({ field }) => (
                                        <FormItem><FormLabel>Firm Address</FormLabel><FormControl><Textarea placeholder="123 Main Street, Suite 400, Toronto, ON M5H 2N2" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="numEmployees" render={({ field }) => (
                                        <FormItem className="max-w-xs"><FormLabel>Number of Employees</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            )}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg flex items-center"><Award className="mr-2 h-5 w-5"/>License & Verification</h3>
                                    <p className="text-sm text-muted-foreground">Please provide your professional credentials for verification.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                                            <FormItem><FormLabel>Law Society License #</FormLabel><FormControl><Input placeholder="e.g., LSO-P12345" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                                            <FormItem><FormLabel>ICCRC / CICC Registration #</FormLabel><FormControl><Input placeholder="e.g., R543210" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormMessage>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="governmentId" render={({ field: { onChange, onBlur, name, ref } }) => (
                                        <FormItem>
                                            <FormLabel>Government-Issued ID</FormLabel>
                                            <FormControl>
                                                <label htmlFor="id-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        {fileName ? (
                                                            <>
                                                                <CheckCircle className="w-8 h-8 mb-4 text-green-500" />
                                                                <p className="text-sm text-muted-foreground"><span className="font-semibold">{fileName}</span> uploaded</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 5MB)</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <Input 
                                                        id="id-upload" 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/png, image/jpeg, application/pdf"
                                                        onBlur={onBlur}
                                                        name={name}
                                                        ref={ref}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            onChange(file);
                                                            if (file) {
                                                                setFileName(file.name);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg flex items-center"><CreditCard className="mr-2 h-5 w-5"/>Subscription Plan</h3>
                                     <FormField control={form.control} name="billingCycle" render={({ field }) => (
                                        <FormItem className="flex items-center justify-center gap-2 pt-2">
                                            <FormLabel className={cn('transition-colors', field.value === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground')}>Monthly</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value === 'annually'}
                                                    onCheckedChange={(checked) => field.onChange(checked ? 'annually' : 'monthly')}
                                                />
                                            </FormControl>
                                            <FormLabel className={cn('transition-colors', field.value === 'annually' ? 'text-foreground font-medium' : 'text-muted-foreground')}>Annually</FormLabel>
                                            <Badge variant="success">Save 17%</Badge>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="selectedPlan" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
                                                    {plans.map((plan) => (
                                                        <Card key={plan.id} onClick={() => field.onChange(plan.id)} className={cn('cursor-pointer flex flex-col', selectedPlanId === plan.id ? 'border-primary ring-2 ring-primary' : 'hover:shadow-md')}>
                                                            <CardHeader>
                                                                <CardTitle>{plan.name}</CardTitle>
                                                                <CardDescription className="min-h-[60px]">
                                                                    {typeof plan.price === 'object' ?
                                                                        <>
                                                                            <span className="text-3xl font-bold text-foreground">${billingCycle === 'annually' ? Math.floor(plan.price.annually / 12) : plan.price.monthly}</span>
                                                                            <span className="text-muted-foreground">/mo</span>
                                                                            {billingCycle === 'annually' && <p className="text-xs text-primary">Billed as ${plan.price.annually} annually</p>}
                                                                        </>
                                                                        : <span className="text-3xl font-bold text-foreground">Contact Us</span>
                                                                    }
                                                                </CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="flex-grow space-y-2 text-sm text-left">
                                                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>Up to {plan.userLimit} users</span></div>
                                                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>Up to {plan.clientLimit} clients</span></div>
                                                                {plan.features.map(feature => (
                                                                    <div key={feature} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>{feature}</span></div>
                                                                ))}
                                                            </CardContent>
                                                            <CardFooter>
                                                                <Button className="w-full" type="button" variant={selectedPlanId === plan.id ? 'default' : 'outline'}>
                                                                    {selectedPlanId === plan.id ? 'Selected' : 'Choose Plan'}
                                                                </Button>
                                                            </CardFooter>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                            )}
                        </CardContent>
                    </form>
                </Form>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep}>
                        {currentStep === steps.length - 1 ? 'Finish & Request Activation' : 'Next Step'}
                        {currentStep < steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
