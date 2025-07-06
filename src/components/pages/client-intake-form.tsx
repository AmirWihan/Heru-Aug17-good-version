
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle, HelpCircle, MessageSquare, PlusCircle, Trash2, Send } from 'lucide-react';
import { useGlobalData } from '@/context/GlobalDataContext';
import { analyzeIntakeForm } from '@/ai/flows/intake-form-analyzer';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const CURRENT_CLIENT_ID = 5;

const intakeFormSchema = z.object({
  personal: z.object({
    fullName: z.string().min(2, "Full name is required."),
    dateOfBirth: z.string().nonempty("Date of birth is required."),
    countryOfBirth: z.string().min(2, "Country of birth is required."),
    countryOfCitizenship: z.string().min(2, "Country of citizenship is required."),
  }),
  family: z.object({
    maritalStatus: z.enum(['Single', 'Married', 'Common-Law', 'Divorced', 'Widowed']),
    hasChildren: z.enum(['yes', 'no']),
  }),
  education: z.array(z.object({
    institution: z.string().min(2, "Institution name is required."),
    degree: z.string().min(2, "Degree/Diploma is required."),
    yearCompleted: z.string().min(4, "Year must be 4 digits."),
  })),
  workHistory: z.array(z.object({
    company: z.string().min(2, "Company name is required."),
    position: z.string().min(2, "Position is required."),
    duration: z.string().min(1, "Duration is required."),
  })),
  admissibility: z.object({
    hasCriminalRecord: z.enum(['yes', 'no']),
    hasMedicalIssues: z.enum(['yes', 'no']),
  }),
});

type IntakeFormValues = z.infer<typeof intakeFormSchema>;

const steps = [
    { name: 'Personal Details', fields: ['personal'] },
    { name: 'Family Details', fields: ['family'] },
    { name: 'Education History', fields: ['education'] },
    { name: 'Work History', fields: ['workHistory'] },
    { name: 'Admissibility', fields: ['admissibility'] },
];

const HelpDialog = ({ fieldName }: { fieldName: string }) => {
    const { toast } = useToast();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-muted-foreground"><HelpCircle className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ask a Question</DialogTitle>
                    <DialogDescription>Your question about "{fieldName}" will be sent to your lawyer.</DialogDescription>
                </DialogHeader>
                <Textarea placeholder="Type your question here..." />
                <DialogFooter>
                    <Button onClick={() => toast({ title: 'Question Sent!', description: 'Your lawyer has been notified of your question.' })}><Send className="mr-2 h-4 w-4" /> Send</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export function ClientIntakeFormPage() {
    const { toast } = useToast();
    const { clients, updateClient } = useGlobalData();
    const client = clients.find(c => c.id === CURRENT_CLIENT_ID);
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<IntakeFormValues>({
        resolver: zodResolver(intakeFormSchema),
        defaultValues: client?.intakeForm?.data || {
            personal: { fullName: '', dateOfBirth: '', countryOfBirth: '', countryOfCitizenship: '' },
            family: { maritalStatus: 'Single', hasChildren: 'no' },
            education: [{ institution: '', degree: '', yearCompleted: '' }],
            workHistory: [{ company: '', position: '', duration: '' }],
            admissibility: { hasCriminalRecord: 'no', hasMedicalIssues: 'no' },
        },
    });
    
    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
    const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({ control: form.control, name: "workHistory" });

    const processForm = async (data: IntakeFormValues) => {
        if (!client) return;
        setIsLoading(true);
        try {
            const apiInput = { ...data, admissibility: { hasCriminalRecord: data.admissibility.hasCriminalRecord === 'yes', hasMedicalIssues: data.admissibility.hasMedicalIssues === 'yes' }};
            const analysis = await analyzeIntakeForm(apiInput);
            updateClient({ ...client, intakeForm: { status: 'submitted', data, analysis } });
            toast({ title: "Form Submitted!", description: "Your intake form has been submitted for review." });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to submit the form. Please try again.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const next = async () => {
        const fields = steps[currentStep].fields as (keyof IntakeFormValues)[];
        const output = await form.trigger(fields, { shouldFocus: true });
        if (!output) return;
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        else await form.handleSubmit(processForm)();
    };

    const prev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    if (!client) return <p>Loading...</p>;

    if (client.intakeForm?.status === 'submitted' || client.intakeForm?.status === 'reviewed') {
        return (
             <Card className="w-full max-w-4xl animate-fade">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <CardTitle className="font-headline text-2xl mt-4">Intake Form Submitted</CardTitle>
                    <CardDescription>Thank you for completing your intake form. Your lawyer will review your submission shortly.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <p className="text-center text-muted-foreground">You can now proceed to other sections of your dashboard.</p>
                </CardContent>
            </Card>
        )
    }

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Smart Intake Form</CardTitle>
                <CardDescription>Please complete all sections accurately. This information will be used to prepare your official immigration forms.</CardDescription>
                <div className="pt-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground mt-2">Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}</p>
                </div>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)}>
                    <CardContent className="min-h-[400px]">
                        {currentStep === 0 && (
                            <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Personal Details</h3>
                                <FormField name="personal.fullName" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Full Name <HelpDialog fieldName="Full Name"/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField name="personal.dateOfBirth" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Date of Birth <HelpDialog fieldName="Date of Birth"/></FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.countryOfBirth" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Country of Birth <HelpDialog fieldName="Country of Birth"/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.countryOfCitizenship" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Country of Citizenship <HelpDialog fieldName="Country of Citizenship"/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                </div>
                            </div>
                        )}
                         {currentStep === 1 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Family Details</h3>
                                <FormField name="family.maritalStatus" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Marital Status<HelpDialog fieldName="Marital Status"/></FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{['Single', 'Married', 'Common-Law', 'Divorced', 'Widowed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="family.hasChildren" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Do you have children?<HelpDialog fieldName="Children"/></FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-row space-x-4"
                                            >
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="yes" /></FormControl>
                                                    <FormLabel className="font-normal">Yes</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="no" /></FormControl>
                                                    <FormLabel className="font-normal">No</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Education History</h3>
                                {eduFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField name={`education.${index}.institution`} control={form.control} render={({ field }) => <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`education.${index}.degree`} control={form.control} render={({ field }) => <FormItem><FormLabel>Degree/Diploma</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`education.${index}.yearCompleted`} control={form.control} render={({ field }) => <FormItem><FormLabel>Year Completed</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                                        </div>
                                        <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendEdu({ institution: '', degree: '', yearCompleted: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
                            </div>
                        )}
                        {currentStep === 3 && (
                             <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Work History</h3>
                                {workFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField name={`workHistory.${index}.company`} control={form.control} render={({ field }) => <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`workHistory.${index}.position`} control={form.control} render={({ field }) => <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`workHistory.${index}.duration`} control={form.control} render={({ field }) => <FormItem><FormLabel>Duration (e.g., 2 years)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                        </div>
                                        <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeWork(index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendWork({ company: '', position: '', duration: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Work Experience</Button>
                            </div>
                        )}
                         {currentStep === 4 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Admissibility</h3>
                                <FormField control={form.control} name="admissibility.hasCriminalRecord" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you ever been arrested for, or convicted of, any criminal offence in any country?<HelpDialog fieldName="Criminal Record"/></FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="yes" /></FormControl>
                                                    <FormLabel className="font-normal">Yes</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="no" /></FormControl>
                                                    <FormLabel className="font-normal">No</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="admissibility.hasMedicalIssues" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you had any serious medical conditions?<HelpDialog fieldName="Medical Issues"/></FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="yes" /></FormControl>
                                                    <FormLabel className="font-normal">Yes</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="no" /></FormControl>
                                                    <FormLabel className="font-normal">No</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="ghost" onClick={prev} disabled={currentStep === 0} type="button"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button onClick={next} disabled={isLoading} type="button">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {currentStep === steps.length - 1 ? <><Sparkles className="mr-2 h-4 w-4"/>Submit for Review</> : <>Next Step <ArrowRight className="ml-2 h-4 w-4" /></>}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
