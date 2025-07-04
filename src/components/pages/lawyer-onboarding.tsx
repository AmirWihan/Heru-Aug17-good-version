'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle, Building, Award, CreditCard, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const steps = [
    { name: 'Firm & Personal Details', icon: Building },
    { name: 'License & Verification', icon: Award },
    { name: 'Subscription & Payment', icon: CreditCard },
];

const plans = [
    { id: 'starter', name: 'Starter', price: 49, userLimit: 2, clientLimit: 50, features: ['Up to 2 users', 'Up to 50 clients', 'Basic AI Tools', 'Standard Support'] },
    { id: 'pro', name: 'Pro Team', price: 99, userLimit: 10, clientLimit: 500, features: ['Up to 10 users', 'Up to 500 clients', 'Advanced AI Tools', 'Team Collaboration Features', 'Priority Email Support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', userLimit: 'Unlimited', clientLimit: 'Unlimited', features: ['Unlimited users & clients', 'Dedicated Support & Onboarding', 'Custom Integrations', 'Advanced Security & Compliance'] }
];

export function LawyerOnboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [fileName, setFileName] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
            toast({
                title: 'Request Submitted!',
                description: 'Your account is now pending activation. We will review your credentials shortly.',
            });
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        } else {
            setFileName(null);
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
                <CardContent className="min-h-[350px]">
                    {currentStep === 0 && (
                        <div className="space-y-4 animate-fade">
                            <h3 className="font-semibold text-lg flex items-center"><Building className="mr-2 h-5 w-5"/>Firm & Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="firm-name">Firm Name</Label>
                                    <Input id="firm-name" placeholder="e.g., Heru Immigration Services" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="your-name">Your Full Name</Label>
                                    <Input id="your-name" placeholder="e.g., Sarah Johnson" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="sarah.j@example.com" />
                            </div>
                        </div>
                    )}
                     {currentStep === 1 && (
                        <div className="space-y-6 animate-fade">
                             <h3 className="font-semibold text-lg flex items-center"><Award className="mr-2 h-5 w-5"/>License & Verification</h3>
                            <p className="text-sm text-muted-foreground">Please provide your professional credentials for verification.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="license-number">Law Society License #</Label>
                                    <Input id="license-number" placeholder="e.g., LSO-P12345" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="registration-number">ICCRC / CICC Registration #</Label>
                                    <Input id="registration-number" placeholder="e.g., R543210" />
                                </div>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="id-upload">Government-Issued ID</Label>
                                <div className="flex items-center justify-center w-full">
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
                                        <Input id="id-upload" type="file" className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div> 
                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fade">
                             <h3 className="font-semibold text-lg flex items-center"><CreditCard className="mr-2 h-5 w-5"/>Subscription & Payment</h3>
                            <p className="text-sm text-muted-foreground">Choose a plan and enter your payment details. You will only be charged upon account activation.</p>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
                                {plans.map((plan) => (
                                    <Card key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={cn('cursor-pointer flex flex-col', selectedPlan === plan.id ? 'border-primary ring-2 ring-primary' : 'hover:shadow-md')}>
                                        <CardHeader>
                                            <CardTitle>{plan.name}</CardTitle>
                                            <CardDescription>
                                                {typeof plan.price === 'number' ?
                                                    <><span className="text-3xl font-bold text-foreground">${plan.price}</span> / user / month</> :
                                                    <span className="text-3xl font-bold text-foreground">Contact Us</span>
                                                }
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow space-y-2 text-sm">
                                            {plan.features.map(feature => (
                                                <div key={feature} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>{feature}</span></div>
                                            ))}
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant={selectedPlan === plan.id ? 'default' : 'outline'}>
                                                {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t">
                                <div className="space-y-1">
                                    <Label htmlFor="card-name">Name on Card</Label>
                                    <Input id="card-name" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
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
