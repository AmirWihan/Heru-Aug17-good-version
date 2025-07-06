
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
import { Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle, HelpCircle, Send, PlusCircle, Trash2 } from 'lucide-react';
import { useGlobalData } from '@/context/GlobalDataContext';
import { analyzeIntakeForm, type IntakeFormInput } from '@/ai/flows/intake-form-analyzer';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const CURRENT_CLIENT_ID = 5;

const intakeFormSchema = z.object({
  personal: z.object({
    fullName: z.string().min(2, "Full name is required."),
    dateOfBirth: z.string().nonempty("Date of birth is required."),
    countryOfBirth: z.string().min(2, "Country of birth is required."),
    countryOfCitizenship: z.string().min(2, "Country of citizenship is required."),
    passportNumber: z.string().min(6, "Valid passport number is required."),
    passportExpiry: z.string().nonempty("Passport expiry date is required."),
  }),
  family: z.object({
    maritalStatus: z.enum(['Single', 'Married', 'Common-Law', 'Divorced', 'Widowed']),
    hasChildren: z.enum(['yes', 'no']),
    childrenCount: z.coerce.number().optional(),
  }).refine(data => data.hasChildren === 'no' || (data.hasChildren === 'yes' && data.childrenCount !== undefined && data.childrenCount > 0), {
    message: "Please specify the number of children.",
    path: ["childrenCount"],
  }),
  education: z.array(z.object({
    institution: z.string().min(2, "Institution name is required."),
    degree: z.string().min(2, "Degree/Diploma is required."),
    yearCompleted: z.string().min(4, "Year must be 4 digits.").max(4),
    countryOfStudy: z.string().min(2, "Country of study is required."),
  })).min(1, "At least one education entry is required."),
  workHistory: z.array(z.object({
    company: z.string().min(2, "Company name is required."),
    position: z.string().min(2, "Position is required."),
    duration: z.string().min(1, "Duration is required."),
    country: z.string().min(2, "Country is required."),
  })).min(1, "At least one work history entry is required."),
  languageProficiency: z.object({
    englishScores: z.object({
      listening: z.coerce.number().min(0).max(9),
      reading: z.coerce.number().min(0).max(9),
      writing: z.coerce.number().min(0).max(9),
      speaking: z.coerce.number().min(0).max(9),
    }).optional(),
    frenchScores: z.object({
      listening: z.coerce.number().min(0).max(9),
      reading: z.coerce.number().min(0).max(9),
      writing: z.coerce.number().min(0).max(9),
      speaking: z.coerce.number().min(0).max(9),
    }).optional(),
  }),
  travelHistory: z.array(z.object({
    country: z.string().min(2, "Country is required."),
    purpose: z.string().min(2, "Purpose of visit is required."),
    duration: z.string().min(1, "Duration is required."),
    year: z.string().min(4, "Year must be 4 digits.").max(4),
  })),
  immigrationHistory: z.object({
    previouslyApplied: z.enum(['yes', 'no']),
    previousApplicationDetails: z.string().optional(),
    wasRefused: z.enum(['yes', 'no']),
    refusalDetails: z.string().optional(),
  }).refine(data => data.previouslyApplied === 'no' || (data.previouslyApplied === 'yes' && data.previousApplicationDetails), {
    message: "Please provide details of your previous application.", path: ["previousApplicationDetails"]
  }).refine(data => data.wasRefused === 'no' || (data.wasRefused === 'yes' && data.refusalDetails), {
    message: "Please provide details of the refusal.", path: ["refusalDetails"]
  }),
  admissibility: z.object({
    hasCriminalRecord: z.enum(['yes', 'no']),
    criminalRecordDetails: z.string().optional(),
    hasMedicalIssues: z.enum(['yes', 'no']),
    medicalIssuesDetails: z.string().optional(),
  }).refine(data => data.hasCriminalRecord === 'no' || (data.hasCriminalRecord === 'yes' && data.criminalRecordDetails), {
    message: "Please provide details of your criminal record.", path: ["criminalRecordDetails"]
  }).refine(data => data.hasMedicalIssues === 'no' || (data.hasMedicalIssues === 'yes' && data.medicalIssuesDetails), {
    message: "Please provide details of your medical issues.", path: ["medicalIssuesDetails"]
  }),
});

type IntakeFormValues = z.infer<typeof intakeFormSchema>;

const steps = [
    { name: 'Personal Details', fields: ['personal'] },
    { name: 'Family Details', fields: ['family'] },
    { name: 'Education History', fields: ['education'] },
    { name: 'Work History', fields: ['workHistory'] },
    { name: 'Language Proficiency', fields: ['languageProficiency'] },
    { name: 'Travel History', fields: ['travelHistory'] },
    { name: 'Immigration History', fields: ['immigrationHistory'] },
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
            personal: { fullName: '', dateOfBirth: '', countryOfBirth: '', countryOfCitizenship: '', passportNumber: '', passportExpiry: '' },
            family: { maritalStatus: 'Single', hasChildren: 'no' },
            education: [{ institution: '', degree: '', yearCompleted: '', countryOfStudy: '' }],
            workHistory: [{ company: '', position: '', duration: '', country: '' }],
            languageProficiency: { englishScores: { listening: 0, reading: 0, writing: 0, speaking: 0 }, frenchScores: { listening: 0, reading: 0, writing: 0, speaking: 0 } },
            travelHistory: [],
            immigrationHistory: { previouslyApplied: 'no', wasRefused: 'no' },
            admissibility: { hasCriminalRecord: 'no', hasMedicalIssues: 'no' },
        },
    });
    
    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
    const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({ control: form.control, name: "workHistory" });
    const { fields: travelFields, append: appendTravel, remove: removeTravel } = useFieldArray({ control: form.control, name: "travelHistory" });

    const processForm = async (data: IntakeFormValues) => {
        if (!client) return;
        setIsLoading(true);
        try {
            const apiInput: IntakeFormInput = {
              ...data,
              family: {
                  ...data.family,
                  hasChildren: data.family.hasChildren === 'yes',
              },
              immigrationHistory: {
                  ...data.immigrationHistory,
                  previouslyApplied: data.immigrationHistory.previouslyApplied === 'yes',
                  wasRefused: data.immigrationHistory.wasRefused === 'yes',
              },
              admissibility: {
                hasCriminalRecord: data.admissibility.hasCriminalRecord === 'yes',
                hasMedicalIssues: data.admissibility.hasMedicalIssues === 'yes',
                criminalRecordDetails: data.admissibility.criminalRecordDetails,
                medicalIssuesDetails: data.admissibility.medicalIssuesDetails,
              },
            };
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
    const watchHasChildren = form.watch('family.hasChildren');
    const watchPreviouslyApplied = form.watch('immigrationHistory.previouslyApplied');
    const watchWasRefused = form.watch('immigrationHistory.wasRefused');
    const watchHasCriminalRecord = form.watch('admissibility.hasCriminalRecord');
    const watchHasMedicalIssues = form.watch('admissibility.hasMedicalIssues');

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
                                <FormField name="personal.fullName" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Full Name (as it appears on your passport) <HelpDialog fieldName="Full Name"/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="personal.dateOfBirth" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Date of Birth <HelpDialog fieldName="Date of Birth"/></FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.countryOfBirth" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Country of Birth <HelpDialog fieldName="Country of Birth"/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField name="personal.countryOfCitizenship" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Country of Citizenship <HelpDialog fieldName="Country of Citizenship"/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.passportNumber" control={form.control} render={({ field }) => <FormItem><FormLabel>Passport Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.passportExpiry" control={form.control} render={({ field }) => <FormItem><FormLabel>Passport Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
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
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                            </RadioGroup>
                                        </FormControl><FormMessage />
                                    </FormItem>
                                )} />
                                {watchHasChildren === 'yes' && (
                                     <FormField name="family.childrenCount" control={form.control} render={({ field }) => <FormItem><FormLabel>Number of children</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                                )}
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Education History</h3>
                                {eduFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField name={`education.${index}.institution`} control={form.control} render={({ field }) => <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`education.${index}.degree`} control={form.control} render={({ field }) => <FormItem><FormLabel>Degree/Diploma</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`education.${index}.countryOfStudy`} control={form.control} render={({ field }) => <FormItem><FormLabel>Country of Study</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`education.${index}.yearCompleted`} control={form.control} render={({ field }) => <FormItem><FormLabel>Year Completed</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                                        </div>
                                        {eduFields.length > 1 && <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4"/></Button>}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendEdu({ institution: '', degree: '', yearCompleted: '', countryOfStudy: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
                            </div>
                        )}
                        {currentStep === 3 && (
                             <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Work History</h3>
                                {workFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField name={`workHistory.${index}.company`} control={form.control} render={({ field }) => <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`workHistory.${index}.position`} control={form.control} render={({ field }) => <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`workHistory.${index}.country`} control={form.control} render={({ field }) => <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`workHistory.${index}.duration`} control={form.control} render={({ field }) => <FormItem><FormLabel>Duration (e.g., 2 years)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                        </div>
                                        {workFields.length > 1 && <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeWork(index)}><Trash2 className="h-4 w-4"/></Button>}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendWork({ company: '', position: '', duration: '', country: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Work Experience</Button>
                            </div>
                        )}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Language Proficiency</h3>
                                <div className="p-4 border rounded-lg space-y-4">
                                    <h4 className="font-medium">English Test Scores (IELTS General)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField control={form.control} name="languageProficiency.englishScores.listening" render={({ field }) => (<FormItem><FormLabel>Listening</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="languageProficiency.englishScores.reading" render={({ field }) => (<FormItem><FormLabel>Reading</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="languageProficiency.englishScores.writing" render={({ field }) => (<FormItem><FormLabel>Writing</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="languageProficiency.englishScores.speaking" render={({ field }) => (<FormItem><FormLabel>Speaking</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg space-y-4">
                                    <h4 className="font-medium">French Test Scores (TEF)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField control={form.control} name="languageProficiency.frenchScores.listening" render={({ field }) => (<FormItem><FormLabel>Listening</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="languageProficiency.frenchScores.reading" render={({ field }) => (<FormItem><FormLabel>Reading</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="languageProficiency.frenchScores.writing" render={({ field }) => (<FormItem><FormLabel>Writing</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="languageProficiency.frenchScores.speaking" render={({ field }) => (<FormItem><FormLabel>Speaking</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStep === 5 && (
                            <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Travel History (Last 10 Years)</h3>
                                {travelFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField name={`travelHistory.${index}.country`} control={form.control} render={({ field }) => <FormItem><FormLabel>Country Visited</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`travelHistory.${index}.purpose`} control={form.control} render={({ field }) => <FormItem><FormLabel>Purpose of Visit</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`travelHistory.${index}.duration`} control={form.control} render={({ field }) => <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <FormField name={`travelHistory.${index}.year`} control={form.control} render={({ field }) => <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                                        </div>
                                        <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeTravel(index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendTravel({ country: '', purpose: '', duration: '', year: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Travel</Button>
                            </div>
                        )}
                         {currentStep === 6 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Immigration History</h3>
                                <FormField control={form.control} name="immigrationHistory.previouslyApplied" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you previously applied to come to Canada?<HelpDialog fieldName="Previous Applications"/></FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                        </RadioGroup></FormControl><FormMessage />
                                    </FormItem>
                                )}/>
                                {watchPreviouslyApplied === 'yes' && <FormField name="immigrationHistory.previousApplicationDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details (type of application, year, etc.)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                                <FormField control={form.control} name="immigrationHistory.wasRefused" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you ever been refused a visa or permit for Canada or any other country?<HelpDialog fieldName="Visa Refusals"/></FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                        </RadioGroup></FormControl><FormMessage />
                                    </FormItem>
                                )}/>
                                {watchWasRefused === 'yes' && <FormField name="immigrationHistory.refusalDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details of the refusal</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                            </div>
                        )}
                         {currentStep === 7 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Admissibility</h3>
                                <FormField control={form.control} name="admissibility.hasCriminalRecord" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you ever been arrested for, or convicted of, any criminal offence in any country?<HelpDialog fieldName="Criminal Record"/></FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                        </RadioGroup></FormControl><FormMessage />
                                    </FormItem>
                                )}/>
                                {watchHasCriminalRecord === 'yes' && <FormField name="admissibility.criminalRecordDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                                <FormField control={form.control} name="admissibility.hasMedicalIssues" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you had any serious medical conditions?<HelpDialog fieldName="Medical Issues"/></FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                        </RadioGroup></FormControl><FormMessage />
                                    </FormItem>
                                )}/>
                                {watchHasMedicalIssues === 'yes' && <FormField name="admissibility.medicalIssuesDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
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
