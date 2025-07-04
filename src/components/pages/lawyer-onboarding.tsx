'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle, Building, Award, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const steps = [
    { name: 'Firm & Personal Details', icon: Building },
    { name: 'License Information', icon: Award },
    { name: 'Subscription & Payment', icon: CreditCard },
];

export function LawyerOnboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Final step: process payment and show completion
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
            <Card className="w-full max-w-2xl">
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
                <CardContent className="min-h-[250px]">
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
                        <div className="space-y-4 animate-fade">
                             <h3 className="font-semibold text-lg flex items-center"><Award className="mr-2 h-5 w-5"/>License Information</h3>
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
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div className="space-y-4 animate-fade">
                             <h3 className="font-semibold text-lg flex items-center"><CreditCard className="mr-2 h-5 w-5"/>Subscription & Payment</h3>
                            <p className="text-sm text-muted-foreground">Choose a plan and enter your payment details. You will only be charged upon account activation.</p>
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
