

'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { calculateCrsScore, CrsInputSchema, type CrsOutput } from '@/ai/flows/crs-calculator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useGlobalData } from '@/context/GlobalDataContext';


const crsSchema = CrsInputSchema.refine(data => {
    if (data.maritalStatus === 'married') {
        return !!data.spouse;
    }
    return true;
}, {
    message: 'Spouse details are required when marital status is "Married".',
    path: ['spouse'],
});

type CrsFormValues = z.infer<typeof crsSchema>;

const steps = [
    { id: '01', name: 'Personal Details', fields: ['maritalStatus', 'age'] },
    { id: '02', name: 'Education', fields: ['educationLevel', 'studiedInCanada'] },
    { id: '03', name: 'Work Experience', fields: ['canadianWorkExperience', 'foreignWorkExperience'] },
    { id: '04', name: 'Language Skills', fields: ['firstLanguage', 'englishScores', 'frenchScores'] },
    { id: '05', name: 'Spouse/Partner', fields: ['spouse'], condition: (data: CrsFormValues) => data.maritalStatus === 'married' },
    { id: '06', name: 'Additional Points', fields: ['hasJobOffer', 'hasProvincialNomination', 'hasSiblingInCanada'] },
];

interface ClientOnboardingProps {
    onOnboardingComplete: () => void;
}

export function ClientOnboarding({ onOnboardingComplete }: ClientOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CrsOutput | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const { updateUserProfile } = useGlobalData();

    const form = useForm<CrsFormValues>({
        resolver: zodResolver(crsSchema),
        defaultValues: {
            maritalStatus: 'single',
            age: 30,
            educationLevel: "Bachelor's degree",
            studiedInCanada: 'no',
            canadianWorkExperience: 1,
            foreignWorkExperience: 3,
            firstLanguage: 'english',
            englishScores: { listening: 7.5, reading: 7, writing: 7, speaking: 7 },
            frenchScores: { listening: 0, reading: 0, writing: 0, speaking: 0 },
            spouse: {
                educationLevel: "Bachelor's degree",
                canadianWorkExperience: 0,
                firstLanguageScores: { listening: 0, reading: 0, writing: 0, speaking: 0 },
            },
            hasJobOffer: 'no',
            hasProvincialNomination: 'no',
            hasSiblingInCanada: 'no',
        },
    });

    const processForm = async (data: CrsFormValues) => {
        setIsLoading(true);
        setResult(null);

        try {
            const jsonString = JSON.stringify(data);
            const response = await calculateCrsScore(jsonString);
            setResult(response);
            setCurrentStep(steps.length);
            
            // Mark onboarding as complete
            await updateUserProfile({ onboardingComplete: true });

            onOnboardingComplete(); // Trigger the redirect from the parent page
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to calculate your score. Please try again.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const next = async () => {
        const fields = steps[currentStep].fields;
        const output = await form.trigger(fields as any, { shouldFocus: true });

        if (!output) return;

        let nextStep = currentStep + 1;
        const maritalStatus = form.getValues('maritalStatus');

        if (steps[currentStep].id === '04' && maritalStatus !== 'married') {
            nextStep++; // Skip spouse step
        }
        
        if (nextStep >= steps.length) {
            await form.handleSubmit(processForm)();
        } else {
            setCurrentStep(nextStep);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            let prevStep = currentStep - 1;
            const maritalStatus = form.getValues('maritalStatus');
            if (steps[prevStep].id === '05' && maritalStatus !== 'married') {
                prevStep--;
            }
            setCurrentStep(prevStep);
        }
    };

    const progress = result ? 100 : (currentStep / (steps.length-1)) * 100;
    const watchMaritalStatus = form.watch('maritalStatus');

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-8">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">CRS Score Calculator</CardTitle>
                    <CardDescription>Estimate your Comprehensive Ranking System score for Canadian Express Entry.</CardDescription>
                    <div className="pt-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-xs text-muted-foreground mt-2">
                            {result ? 'Calculation Complete' : `Step ${currentStep + 1} of ${steps.filter(s => s.condition ? s.condition(form.getValues()) : true).length}`}
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(processForm)} className="space-y-6">
                            {currentStep === 0 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg">Personal Details</h3>
                                    <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                                        <FormItem><FormLabel>What is your marital status?</FormLabel>
                                            <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                                <FormItem><FormControl><RadioGroupItem value="single" id="single" /></FormControl><Label htmlFor="single" className="ml-2">Single</Label></FormItem>
                                                <FormItem><FormControl><RadioGroupItem value="married" id="married" /></FormControl><Label htmlFor="married" className="ml-2">Married / Common-law</Label></FormItem>
                                            </RadioGroup></FormControl><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="age" render={({ field }) => (
                                        <FormItem><FormLabel>What is your age?</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            )}

                             {currentStep === 1 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg">Education History</h3>
                                    <FormField control={form.control} name="educationLevel" render={({ field }) => (
                                        <FormItem><FormLabel>What is your highest level of education?</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PhD">Doctoral degree (PhD)</SelectItem>
                                                    <SelectItem value="Master's degree">Master's degree</SelectItem>
                                                    <SelectItem value="Two or more post-secondary credentials">Two or more post-secondary credentials</SelectItem>
                                                    <SelectItem value="Bachelor's degree">Bachelor's degree (three or more years)</SelectItem>
                                                    <SelectItem value="Two-year post-secondary credential">Two-year post-secondary credential</SelectItem>
                                                    <SelectItem value="One-year post-secondary credential">One-year post-secondary credential</SelectItem>
                                                    <SelectItem value="Secondary school (high school)">Secondary school (high school)</SelectItem>
                                                </SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="studiedInCanada" render={({ field }) => (
                                        <FormItem><FormLabel>Did you study in Canada for a post-secondary degree/diploma?</FormLabel>
                                            <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                                <FormItem><FormControl><RadioGroupItem value="yes" id="study-yes" /></FormControl><Label htmlFor="study-yes" className="ml-2">Yes</Label></FormItem>
                                                <FormItem><FormControl><RadioGroupItem value="no" id="study-no" /></FormControl><Label htmlFor="study-no" className="ml-2">No</Label></FormItem>
                                            </RadioGroup></FormControl><FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}

                             {currentStep === 2 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg">Work Experience</h3>
                                    <FormField control={form.control} name="canadianWorkExperience" render={({ field }) => (
                                        <FormItem><FormLabel>Years of skilled work experience in Canada</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                                <SelectContent>{[0,1,2,3,4,5].map(y => <SelectItem key={y} value={String(y)}>{y}{y===5?'+':''} year{y!==1?'s':''}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={form.control} name="foreignWorkExperience" render={({ field }) => (
                                        <FormItem><FormLabel>Years of skilled foreign work experience (outside Canada)</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                                <SelectContent>{[0,1,2,3].map(y => <SelectItem key={y} value={String(y)}>{y}{y===3?'+':''} year{y!==1?'s':''}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}

                             {currentStep === 3 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg">Language Proficiency</h3>
                                    <FormField control={form.control} name="firstLanguage" render={({ field }) => (
                                        <FormItem><FormLabel>Which is your first official language?</FormLabel>
                                            <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                                <FormItem><FormControl><RadioGroupItem value="english" id="lang-en" /></FormControl><Label htmlFor="lang-en" className="ml-2">English</Label></FormItem>
                                                <FormItem><FormControl><RadioGroupItem value="french" id="lang-fr" /></FormControl><Label htmlFor="lang-fr" className="ml-2">French</Label></FormItem>
                                            </RadioGroup></FormControl><FormMessage />
                                        </FormItem>
                                    )} />
                                    <Separator />
                                    <h4 className="font-medium">English Test Scores (IELTS General)</h4>
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField control={form.control} name="englishScores.listening" render={({ field }) => (<FormItem><FormLabel>Listening</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="englishScores.reading" render={({ field }) => (<FormItem><FormLabel>Reading</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="englishScores.writing" render={({ field }) => (<FormItem><FormLabel>Writing</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="englishScores.speaking" render={({ field }) => (<FormItem><FormLabel>Speaking</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                    <Separator />
                                    <h4 className="font-medium">French Test Scores (TEF)</h4>
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField control={form.control} name="frenchScores.listening" render={({ field }) => (<FormItem><FormLabel>Listening</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="frenchScores.reading" render={({ field }) => (<FormItem><FormLabel>Reading</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="frenchScores.writing" render={({ field }) => (<FormItem><FormLabel>Writing</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="frenchScores.speaking" render={({ field }) => (<FormItem><FormLabel>Speaking</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </div>
                            )}
                            
                            {currentStep === 4 && watchMaritalStatus === 'married' && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg">Spouse/Partner Information</h3>
                                    <FormField control={form.control} name="spouse.educationLevel" render={({ field }) => (
                                        <FormItem><FormLabel>Spouse's highest level of education?</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PhD">Doctoral degree (PhD)</SelectItem>
                                                    <SelectItem value="Master's degree">Master's degree</SelectItem>
                                                    <SelectItem value="Two or more post-secondary credentials">Two or more post-secondary credentials</SelectItem>
                                                    <SelectItem value="Bachelor's degree">Bachelor's degree (three or more years)</SelectItem>
                                                    <SelectItem value="Two-year post-secondary credential">Two-year post-secondary credential</SelectItem>
                                                    <SelectItem value="One-year post-secondary credential">One-year post-secondary credential</SelectItem>
                                                    <SelectItem value="Secondary school (high school)">Secondary school (high school)</SelectItem>
                                                </SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="spouse.canadianWorkExperience" render={({ field }) => (
                                        <FormItem><FormLabel>Spouse's years of skilled work experience in Canada</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                                <SelectContent>{[0,1,2,3,4,5].map(y => <SelectItem key={y} value={String(y)}>{y}{y===5?'+':''} year{y!==1?'s':''}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <h4 className="font-medium">Spouse's First Language Test Scores (IELTS)</h4>
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField control={form.control} name="spouse.firstLanguageScores.listening" render={({ field }) => (<FormItem><FormLabel>Listening</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="spouse.firstLanguageScores.reading" render={({ field }) => (<FormItem><FormLabel>Reading</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="spouse.firstLanguageScores.writing" render={({ field }) => (<FormItem><FormLabel>Writing</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="spouse.firstLanguageScores.speaking" render={({ field }) => (<FormItem><FormLabel>Speaking</FormLabel><FormControl><Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </div>
                            )}

                             {currentStep === 5 && (
                                <div className="space-y-6 animate-fade">
                                    <h3 className="font-semibold text-lg">Additional Factors</h3>
                                    <FormField control={form.control} name="hasProvincialNomination" render={({ field }) => (<FormItem><FormLabel>Do you have a nomination from a province or territory?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem><FormControl><RadioGroupItem value="yes" id="pnp-yes" /></FormControl><Label htmlFor="pnp-yes" className="ml-2">Yes</Label></FormItem><FormItem><FormControl><RadioGroupItem value="no" id="pnp-no" /></FormControl><Label htmlFor="pnp-no" className="ml-2">No</Label></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="hasJobOffer" render={({ field }) => (<FormItem><FormLabel>Do you have a valid job offer from a Canadian employer?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem><FormControl><RadioGroupItem value="yes" id="job-yes" /></FormControl><Label htmlFor="job-yes" className="ml-2">Yes</Label></FormItem><FormItem><FormControl><RadioGroupItem value="no" id="job-no" /></FormControl><Label htmlFor="job-no" className="ml-2">No</Label></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="hasSiblingInCanada" render={({ field }) => (<FormItem><FormLabel>Do you have a sibling in Canada who is a citizen or PR?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem><FormControl><RadioGroupItem value="yes" id="sib-yes" /></FormControl><Label htmlFor="sib-yes" className="ml-2">Yes</Label></FormItem><FormItem><FormControl><RadioGroupItem value="no" id="sib-no" /></FormControl><Label htmlFor="sib-no" className="ml-2">No</Label></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                                </div>
                            )}
                            
                             {result && (
                                <div className="space-y-6 text-center animate-fade">
                                    <h3 className="font-semibold text-lg">Your Estimated CRS Score</h3>
                                    <div className={cn('mx-auto w-40 h-40 rounded-full flex items-center justify-center border-8', result.isEligible ? 'border-green-100' : 'border-yellow-100')}>
                                        <p className={cn('font-bold text-5xl', result.isEligible ? 'text-green-600' : 'text-yellow-600')}>{result.totalScore}</p>
                                    </div>
                                    <Card className="text-left">
                                        <CardHeader><CardTitle className="text-lg font-semibold">Score Breakdown</CardTitle></CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center"><span className="text-muted-foreground">Core / Human Capital</span><span className="font-medium">{result.breakdown.coreHumanCapital} pts</span></div>
                                            <div className="flex justify-between items-center"><span className="text-muted-foreground">Spouse Factors</span><span className="font-medium">{result.breakdown.spouseFactors} pts</span></div>
                                            <div className="flex justify-between items-center"><span className="text-muted-foreground">Skill Transferability</span><span className="font-medium">{result.breakdown.skillTransferability} pts</span></div>
                                            <div className="flex justify-between items-center"><span className="text-muted-foreground">Additional Points</span><span className="font-medium">{result.breakdown.additionalPoints} pts</span></div>
                                        </CardContent>
                                    </Card>
                                    <Card className="text-left bg-muted/50">
                                        <CardHeader><CardTitle className="text-lg font-semibold">Summary & Recommendations</CardTitle></CardHeader>
                                        <CardContent><p className="text-muted-foreground">{result.feedback}</p></CardContent>
                                    </Card>
                                     <Button onClick={() => router.push('/client/dashboard')} className="w-full">
                                        Proceed to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>

                {!result && (
                     <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="ghost" onClick={prev} disabled={currentStep === 0}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                        </Button>
                        <Button onClick={next} disabled={isLoading}>
                            {isLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)
                               : currentStep >= steps.length -1 ? (<Sparkles className="mr-2 h-4 w-4" />)
                               : null}
                            {isLoading ? 'Calculating...' : currentStep >= steps.length - 1 || (currentStep === steps.length - 2 && watchMaritalStatus !== 'married') ? 'Calculate My Score' : 'Next Step'}
                            {currentStep < steps.length - 2 && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
