
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

const onboardingSchema = z.object({
    // Step 0
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("A valid email is required."),
    firmName: z.string().min(2, "Firm name is required."),
    firmAddress: z.string().min(10, "Firm address is required."),
    numEmployees: z.coerce.number().min(1, "At least one employee is required."),
    firmWebsite: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    // Step 1
    licenseNumber: z.string().min(5, "A valid license number is required."),
    registrationNumber: z.string().min(5, "A valid registration number is required."),
    governmentId: z.any().refine(file => file instanceof File, "Government ID is required."),
    // Step 2
    selectedPlan: z.enum(['starter', 'pro', 'enterprise']),
    cardName: z.string().min(2, "Name on card is required."),
    cardNumber: z.string().refine((val) => /^\d{16}$/.test(val.replace(/\s/g, '')), "Invalid card number."),
    expiryDate: z.string().refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), "Invalid expiry date (MM/YY)."),
    cvc: z.string().refine((val) => /^\d{3,4}$/.test(val), "Invalid CVC."),
});


const steps = [
    { name: 'Firm & Personal Details', icon: Building, fields: ['fullName', 'email', 'firmName', 'firmAddress', 'numEmployees', 'firmWebsite'] as const },
    { name: 'License & Verification', icon: Award, fields: ['licenseNumber', 'registrationNumber', 'governmentId'] as const },
    { name: 'Subscription & Payment', icon: CreditCard, fields: ['selectedPlan', 'cardName', 'cardNumber', 'expiryDate', 'cvc'] as const },
];

const plans = [
    { id: 'starter', name: 'Starter', price: 49, userLimit: 2, clientLimit: 50, features: ['Up to 2 users', 'Up to 50 clients', 'Basic AI Tools', 'Standard Support'] },
    { id: 'pro', name: 'Pro Team', price: 99, userLimit: 10, clientLimit: 500, features: ['Up to 10 users', 'Up to 500 clients', 'Advanced AI Tools', 'Team Collaboration Features', 'Priority Email Support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', userLimit: 'Unlimited', clientLimit: 'Unlimited', features: ['Unlimited users & clients', 'Dedicated Support & Onboarding', 'Custom Integrations', 'Advanced Security & Compliance'] }
];

export function LawyerOnboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            fullName: "",
            email: "",
            firmName: "",
            firmAddress: "",
            numEmployees: 1,
            firmWebsite: '',
            licenseNumber: "",
            registrationNumber: "",
            governmentId: undefined,
            selectedPlan: 'pro',
            cardName: "",
            cardNumber: "",
            expiryDate: "",
            cvc: "",
        }
    });

    const selectedPlanId = form.watch('selectedPlan');

    async function processSubmit(data: z.infer<typeof onboardingSchema>) {
        console.log("Form Submitted:", data);
        // In a real app, this would send data to the backend.
        // We add a new user to data.ts to simulate this for the prototype.
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
                         <Button className="w-full" onClick={() => router.push('/')}>
                            Back to Homepage
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-8">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Welcome! Let's Set Up Your Account.</CardTitle>
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
                        <CardContent className="min-h-[380px]">
                            {currentStep === 0 && (
                                <div className="space-y-4 animate-fade">
                                    <h3 className="font-semibold text-lg flex items-center"><Building className="mr-2 h-5 w-5"/>Firm & Personal Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="fullName" render={({ field }) => (
                                            <FormItem><FormLabel>Your Full Name</FormLabel><FormControl><Input placeholder="e.g., Sarah Johnson" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="sarah.j@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="firmName" render={({ field }) => (
                                        <FormItem><FormLabel>Firm Name</FormLabel><FormControl><Input placeholder="e.g., Heru Immigration Services" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="firmAddress" render={({ field }) => (
                                        <FormItem><FormLabel>Firm Address</FormLabel><FormControl><Textarea placeholder="123 Main Street, Suite 400, Toronto, ON M5H 2N2" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="numEmployees" render={({ field }) => (
                                            <FormItem><FormLabel>Number of Employees</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="firmWebsite" render={({ field }) => (
                                            <FormItem><FormLabel>Firm Website</FormLabel><FormControl><Input type="url" placeholder="https://www.yourfirm.com" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>
                            )}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg flex items-center"><Award className="mr-2 h-5 w-5"/>License & Verification</h3>
                                    <p className="text-sm text-muted-foreground">Please provide your professional credentials for verification.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                                            <FormItem><FormLabel>Law Society License #</FormLabel><FormControl><Input placeholder="e.g., LSO-P12345" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                                            <FormItem><FormLabel>ICCRC / CICC Registration #</FormLabel><FormControl><Input placeholder="e.g., R543210" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="governmentId" render={({ field: { onChange, value, ...rest } }) => (
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
                                                    <Input id="id-upload" type="file" className="hidden" accept="image/png, image/jpeg, application/pdf" onChange={(e) => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            onChange(e.target.files[0]);
                                                            setFileName(e.target.files[0].name);
                                                        }
                                                    }} {...rest} />
                                                </label>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg flex items-center"><CreditCard className="mr-2 h-5 w-5"/>Subscription & Payment</h3>
                                    <p className="text-sm text-muted-foreground">Choose a plan. You will only be charged upon account activation.</p>
                                    <FormField control={form.control} name="selectedPlan" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
                                                    {plans.map((plan) => (
                                                        <Card key={plan.id} onClick={() => field.onChange(plan.id)} className={cn('cursor-pointer flex flex-col', selectedPlanId === plan.id ? 'border-primary ring-2 ring-primary' : 'hover:shadow-md')}>
                                                            <CardHeader>
                                                                <CardTitle>{plan.name}</CardTitle>
                                                                <CardDescription>
                                                                    {typeof plan.price === 'number' ?
                                                                        <><span className="text-3xl font-bold text-foreground">${plan.price}</span> / user / month</> :
                                                                        <span className="text-3xl font-bold text-foreground">Contact Us</span>
                                                                    }
                                                                </CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="flex-grow space-y-2 text-sm text-left">
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
                                    <div className="space-y-4 pt-6 border-t">
                                        <FormField control={form.control} name="cardName" render={({ field }) => (
                                            <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                            <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                                <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="cvc" render={({ field }) => (
                                                <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    </div>
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
