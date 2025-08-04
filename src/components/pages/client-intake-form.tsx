
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle, HelpCircle, Send, PlusCircle, Trash2, Flag, Save } from 'lucide-react';
import { useGlobalData } from '@/context/GlobalDataContext';
import { analyzeIntakeForm } from '@/ai/flows/intake-form-analyzer';
import { IntakeFormInputSchema } from '@/ai/schemas/intake-form-schema';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const familyMemberSchema = z.object({
    fullName: z.string().min(2, "Full name is required."),
    relationship: z.string(),
    dateOfBirth: z.string().nonempty("Date of birth is required."),
    countryOfBirth: z.string().min(2, "Country of birth is required."),
    currentAddress: z.string().min(5, "Address is required."),
    occupation: z.string().min(2, "Occupation is required."),
});

type IntakeFormValues = z.infer<typeof IntakeFormInputSchema>;

const steps = [
    { id: 'personal', name: 'Personal Details', fields: ['personal'] },
    { id: 'family', name: 'Family Details', fields: ['family'] },
    { id: 'education', name: 'Education History', fields: ['education'] },
    { id: 'study', name: 'Details of Intended Study', fields: ['studyDetails'] },
    { id: 'work', name: 'Work History', fields: ['workHistory'] },
    { id: 'language', name: 'Language Proficiency', fields: ['languageProficiency'] },
    { id: 'travel', name: 'Travel History', fields: ['travelHistory'] },
    { id: 'immigration', name: 'Immigration History', fields: ['immigrationHistory'] },
    { id: 'admissibility', name: 'Admissibility', fields: ['admissibility'] },
];

const HelpButtons = ({ fieldName, onFlag, isFlagged }: { fieldName: string; onFlag: () => void; isFlagged: boolean; }) => {
    const { toast } = useToast();
    return (
        <div className="flex items-center">
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
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={onFlag}>
                <Flag className={cn("h-4 w-4", isFlagged && "text-yellow-500 fill-current")} />
            </Button>
        </div>
    );
};


export function ClientIntakeFormPage() {
    const { toast } = useToast();
    const { userProfile, updateUserProfile } = useGlobalData();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>(
        userProfile && 'intakeForm' in userProfile && userProfile.intakeForm?.flaggedQuestions ? userProfile.intakeForm.flaggedQuestions : []
    );
    const [applicationType, setApplicationType] = useState<string>('work');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const form = useForm<IntakeFormValues>({
        resolver: zodResolver(IntakeFormInputSchema),
        defaultValues: (userProfile && 'intakeForm' in userProfile && userProfile.intakeForm?.data) ? userProfile.intakeForm.data : {
            personal: { fullName: userProfile?.name || '', dateOfBirth: '', countryOfBirth: '', countryOfCitizenship: '', passportNumber: '', passportExpiry: '', height: '', eyeColor: '', contact: { email: userProfile?.email || '', phone: '', address: '' } },
            family: { maritalStatus: 'Single' },
            education: [{ institution: '', degree: '', yearCompleted: '', countryOfStudy: '' }],
            workHistory: [{ company: '', position: '', duration: '', country: '' }],
            languageProficiency: { englishScores: { listening: 0, reading: 0, writing: 0, speaking: 0 }, frenchScores: { listening: 0, reading: 0, writing: 0, speaking: 0 } },
            travelHistory: [],
            immigrationHistory: { previouslyApplied: 'no', wasRefused: 'no' },
            admissibility: { hasCriminalRecord: 'no', hasMedicalIssues: 'no', hasOverstayed: 'no' },
        },
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
    const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({ control: form.control, name: "workHistory" });
    const { fields: travelFields, append: appendTravel, remove: removeTravel } = useFieldArray({ control: form.control, name: "travelHistory" });
    const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({ control: form.control, name: "family.children" });
    const { fields: siblingFields, append: appendSibling, remove: removeSibling } = useFieldArray({ control: form.control, name: "family.siblings" });
    
    const handleFlagQuestion = (fieldName: string) => {
        setFlaggedQuestions(prev => 
            prev.includes(fieldName) ? prev.filter(f => f !== fieldName) : [...prev, fieldName]
        );
    };

    const processAndSave = async () => {
        if (!userProfile) return;
        setIsLoading(true);
        const data = form.getValues();
        try {
            const analysis = await analyzeIntakeForm(data);
            // Ensure maritalStatus is always a valid union value
            if (data.family && typeof data.family.maritalStatus === 'string') {
                const allowed = ['Single', 'Married', 'Common-Law', 'Divorced', 'Widowed'] as const;
                if (!allowed.includes(data.family.maritalStatus as any)) {
                    data.family.maritalStatus = 'Single';
                }
                // Explicitly cast as the union type so TypeScript is satisfied
                data.family.maritalStatus = data.family.maritalStatus as (typeof allowed)[number];
            }
            // Type assertion for IntakeForm compatibility
            const intakeForm = { status: 'in_progress' as const, data: { ...data, family: { ...data.family, maritalStatus: data.family.maritalStatus as 'Single' | 'Married' | 'Common-Law' | 'Divorced' | 'Widowed' } } as import('@/lib/data').IntakeFormData, analysis, flaggedQuestions };

            // Only pass the data portion as IntakeFormData to any schema-validated functions
            await updateUserProfile({ intakeForm });
            setLastSaved(new Date());

            toast({ title: "Progress Saved!", description: "Your intake form has been updated." });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to save your progress. Please try again.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const next = async () => {
        const stepId = steps[currentStep].id;
        let fieldsToValidate = steps[currentStep].fields;

        if (stepId === 'family' && form.getValues('family.maritalStatus') !== 'Married' && form.getValues('family.maritalStatus') !== 'Common-Law') {
            // @ts-ignore
            fieldsToValidate = fieldsToValidate.filter(f => f !== 'family.spouse');
        }

        const output = await form.trigger(fieldsToValidate as any, { shouldFocus: true });
        if (!output) return;

        if (currentStep < steps.length - 1) {
            let nextStepIndex = currentStep + 1;
            if (steps[nextStepIndex].id === 'study' && applicationType !== 'student') {
                nextStepIndex++;
            }
            setCurrentStep(nextStepIndex);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            let prevStepIndex = currentStep - 1;
            if (steps[prevStepIndex].id === 'study' && applicationType !== 'student') {
                prevStepIndex--;
            }
            setCurrentStep(prevStepIndex);
        }
    };

    if (!userProfile) return <p>Loading...</p>;

    const progress = ((currentStep + 1) / steps.length) * 100;
    const watchMaritalStatus = form.watch('family.maritalStatus');
    const watchPreviouslyApplied = form.watch('immigrationHistory.previouslyApplied');
    const watchWasRefused = form.watch('immigrationHistory.wasRefused');
    const watchHasCriminalRecord = form.watch('admissibility.hasCriminalRecord');
    const watchHasMedicalIssues = form.watch('admissibility.hasMedicalIssues');
    const watchHasOverstayed = form.watch('admissibility.hasOverstayed');

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-2xl">Smart Intake Form</CardTitle>
                        <CardDescription>Please complete all sections accurately. Your information is saved as you go.</CardDescription>
                    </div>
                     {lastSaved && <p className="text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</p>}
                </div>
                <div className="pt-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground mt-2">Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}</p>
                </div>
            </CardHeader>
            <Form {...form}>
                <form>
                    <CardContent className="min-h-[400px]">
                        {currentStep === 0 && (
                            <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Personal Details</h3>
                                <FormField name="personal.fullName" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Full Name (as on passport) <HelpButtons fieldName="Full Name" onFlag={() => handleFlagQuestion('personal.fullName')} isFlagged={flaggedQuestions.includes('personal.fullName')}/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="personal.dateOfBirth" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Date of Birth <HelpButtons fieldName="Date of Birth" onFlag={() => handleFlagQuestion('personal.dateOfBirth')} isFlagged={flaggedQuestions.includes('personal.dateOfBirth')}/></FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.countryOfBirth" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Country of Birth <HelpButtons fieldName="Country of Birth" onFlag={() => handleFlagQuestion('personal.countryOfBirth')} isFlagged={flaggedQuestions.includes('personal.countryOfBirth')}/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="personal.countryOfCitizenship" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Country of Citizenship <HelpButtons fieldName="Country of Citizenship" onFlag={() => handleFlagQuestion('personal.countryOfCitizenship')} isFlagged={flaggedQuestions.includes('personal.countryOfCitizenship')}/></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.passportNumber" control={form.control} render={({ field }) => <FormItem><FormLabel>Passport Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField name="personal.passportExpiry" control={form.control} render={({ field }) => <FormItem><FormLabel>Passport Expiry</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.height" control={form.control} render={({ field }) => <FormItem><FormLabel>Height</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField name="personal.eyeColor" control={form.control} render={({ field }) => <FormItem><FormLabel>Eye Color</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                </div>
                                <h3 className="font-semibold pt-4 border-t">Contact Information</h3>
                                <FormField name="personal.contact.email" control={form.control} render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField name="personal.contact.phone" control={form.control} render={({ field }) => <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField name="personal.contact.address" control={form.control} render={({ field }) => <FormItem><FormLabel>Full Residential Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                            </div>
                        )}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Family Details</h3>
                                <FormField name="family.maritalStatus" control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Marital Status<HelpButtons fieldName="Marital Status" onFlag={() => handleFlagQuestion('family.maritalStatus')} isFlagged={flaggedQuestions.includes('family.maritalStatus')}/></FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{['Single', 'Married', 'Common-Law', 'Divorced', 'Widowed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
                                
                                { (watchMaritalStatus === "Married" || watchMaritalStatus === "Common-Law") && <FamilyMemberForm section="family.spouse" title="Spouse / Common-Law Partner" control={form.control} onFlag={handleFlagQuestion} flaggedQuestions={flaggedQuestions} />}
                                <FamilyMemberForm section="family.mother" title="Mother" control={form.control} onFlag={handleFlagQuestion} flaggedQuestions={flaggedQuestions}/>
                                <FamilyMemberForm section="family.father" title="Father" control={form.control} onFlag={handleFlagQuestion} flaggedQuestions={flaggedQuestions}/>
                                
                                <FieldArrayForm section="family.children" title="Children" fields={childrenFields} append={appendChild} remove={removeChild} control={form.control} onFlag={handleFlagQuestion} flaggedQuestions={flaggedQuestions}/>
                                <FieldArrayForm section="family.siblings" title="Siblings" fields={siblingFields} append={appendSibling} remove={removeSibling} control={form.control} onFlag={handleFlagQuestion} flaggedQuestions={flaggedQuestions}/>
                            </div>
                        )}
                         {currentStep === 2 && (
                            <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Education History</h3>
                                {eduFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField name={`education.${index}.institution`} control={form.control} render={({ field }) => <FormItem><FormLabel className="flex items-center">Institution <HelpButtons fieldName={`Education ${index+1} Institution`} onFlag={() => handleFlagQuestion(`education.${index}.institution`)} isFlagged={flaggedQuestions.includes(`education.${index}.institution`)} /></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
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
                        {currentStep === 3 && applicationType === 'student' && (
                             <div className="space-y-4 animate-fade">
                                <h3 className="font-semibold">Details of Intended Study in Canada</h3>
                                {/* <FormField name="studyDetails.schoolName" control={form.control} render={({ field }) => <FormItem><FormLabel>Name of School</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /> */}
                                {/* <FormField name="studyDetails.programName" control={form.control} render={({ field }) => <FormItem><FormLabel>Program / Level of Study</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /> */}
                                {/* <FormField name="studyDetails.dliNumber" control={form.control} render={({ field }) => <FormItem><FormLabel>Designated Learning Institution (DLI) #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /> */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* <FormField name="studyDetails.tuitionFee" control={form.control} render={({ field }) => <FormItem><FormLabel>Tuition Fee ($ CAD)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} /> */}
                                    {/* <FormField name="studyDetails.livingExpenses" control={form.control} render={({ field }) => <FormItem><FormLabel>Living Expenses ($ CAD)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} /> */}
                                </div>
                            </div>
                        )}
                        {currentStep === 4 && (
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
                        {currentStep === 5 && (
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
                        {currentStep === 6 && (
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
                         {currentStep === 7 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Immigration History</h3>
                                <FormField control={form.control} name="immigrationHistory.previouslyApplied" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you previously applied for any Canadian visa?<HelpButtons fieldName="Previous Applications" onFlag={() => handleFlagQuestion('immigrationHistory.previouslyApplied')} isFlagged={flaggedQuestions.includes('immigrationHistory.previouslyApplied')}/></FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="pa-yes" /></FormControl><Label htmlFor="pa-yes">Yes</Label></FormItem>
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="pa-no" /></FormControl><Label htmlFor="pa-no">No</Label></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {watchPreviouslyApplied === 'yes' && <FormField name="immigrationHistory.previousApplicationDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details (type of application, year, etc.)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                                
                                <FormField control={form.control} name="immigrationHistory.wasRefused" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you ever been refused a visa for Canada or any other country?<HelpButtons fieldName="Visa Refusals" onFlag={() => handleFlagQuestion('immigrationHistory.wasRefused')} isFlagged={flaggedQuestions.includes('immigrationHistory.wasRefused')}/></FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                 <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="wr-yes" /></FormControl><Label htmlFor="wr-yes">Yes</Label></FormItem>
                                                 <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="wr-no" /></FormControl><Label htmlFor="wr-no">No</Label></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {watchWasRefused === 'yes' && <FormField name="immigrationHistory.refusalDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details of the refusal</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                            </div>
                        )}
                         {currentStep === 8 && (
                            <div className="space-y-6 animate-fade">
                                <h3 className="font-semibold">Admissibility</h3>
                                <FormField control={form.control} name="admissibility.hasCriminalRecord" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you ever been arrested for, or convicted of, any criminal offence in any country?<HelpButtons fieldName="Criminal Record" onFlag={() => handleFlagQuestion('admissibility.hasCriminalRecord')} isFlagged={flaggedQuestions.includes('admissibility.hasCriminalRecord')}/></FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="cr-yes" /></FormControl><Label htmlFor="cr-yes">Yes</Label></FormItem>
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="cr-no" /></FormControl><Label htmlFor="cr-no">No</Label></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {watchHasCriminalRecord === 'yes' && <FormField name="admissibility.criminalRecordDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}

                                <FormField control={form.control} name="admissibility.hasMedicalIssues" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you had any serious medical conditions?<HelpButtons fieldName="Medical Issues" onFlag={() => handleFlagQuestion('admissibility.hasMedicalIssues')} isFlagged={flaggedQuestions.includes('admissibility.hasMedicalIssues')}/></FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="mi-yes" /></FormControl><Label htmlFor="mi-yes">Yes</Label></FormItem>
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="mi-no" /></FormControl><Label htmlFor="mi-no">No</Label></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {watchHasMedicalIssues === 'yes' && <FormField name="admissibility.medicalIssuesDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                                
                                <FormField control={form.control} name="admissibility.hasOverstayed" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="flex items-center">Have you ever overstayed your visa status in any country?<HelpButtons fieldName="Visa Overstay" onFlag={() => handleFlagQuestion('admissibility.hasOverstayed')} isFlagged={flaggedQuestions.includes('admissibility.hasOverstayed')}/></FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="os-yes" /></FormControl><Label htmlFor="os-yes">Yes</Label></FormItem>
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="os-no" /></FormControl><Label htmlFor="os-no">No</Label></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {watchHasOverstayed === 'yes' && <FormField name="admissibility.overstayDetails" control={form.control} render={({ field }) => <FormItem><FormLabel>Please provide details</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="ghost" onClick={prev} disabled={currentStep === 0} type="button"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={processAndSave} disabled={isLoading} type="button">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                                Save Progress
                            </Button>
                            <Button onClick={next} type="button">
                                {currentStep >= steps.length - 1 ? <><CheckCircle className="mr-2 h-4 w-4" />Finish & Submit</> : <>Next Step <ArrowRight className="ml-2 h-4 w-4" /></>}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

const FamilyMemberForm = ({ section, title, control, onFlag, flaggedQuestions }: { section: 'family.spouse' | 'family.mother' | 'family.father', title: string, control: any, onFlag: (name: string) => void, flaggedQuestions: string[] }) => (
    <div className="p-4 border rounded-lg space-y-4">
        <h4 className="font-medium flex items-center">{title} <HelpButtons fieldName={title} onFlag={() => onFlag(section)} isFlagged={flaggedQuestions.includes(section)} /></h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name={`${section}.fullName`} control={control} render={({ field }) => <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name={`${section}.dateOfBirth`} control={control} render={({ field }) => <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name={`${section}.countryOfBirth`} control={control} render={({ field }) => <FormItem><FormLabel>Country of Birth</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name={`${section}.occupation`} control={control} render={({ field }) => <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
        </div>
        <FormField name={`${section}.currentAddress`} control={control} render={({ field }) => <FormItem><FormLabel>Current Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
    </div>
);

const FieldArrayForm = ({ section, title, fields, append, remove, control, onFlag, flaggedQuestions }: { section: 'family.children' | 'family.siblings', title: string, fields: any[], append: (obj: any) => void, remove: (index: number) => void, control: any, onFlag: (name: string) => void, flaggedQuestions: string[] }) => (
    <div className="space-y-4">
        <h3 className="font-semibold">{title}</h3>
        {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                 <h4 className="font-medium flex items-center">{title.slice(0,-1)} #{index + 1} <HelpButtons fieldName={`${title.slice(0,-1)} #${index + 1}`} onFlag={() => onFlag(`${section}.${index}`)} isFlagged={flaggedQuestions.includes(`${section}.${index}`)} /></h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name={`${section}.${index}.fullName`} control={control} render={({ field }) => <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField name={`${section}.${index}.dateOfBirth`} control={control} render={({ field }) => <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name={`${section}.${index}.countryOfBirth`} control={control} render={({ field }) => <FormItem><FormLabel>Country of Birth</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField name={`${section}.${index}.occupation`} control={control} render={({ field }) => <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                </div>
                 <FormField name={`${section}.${index}.currentAddress`} control={control} render={({ field }) => <FormItem><FormLabel>Current Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
            </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ fullName: '', relationship: title.slice(0,-1), dateOfBirth: '', countryOfBirth: '', currentAddress: '', occupation: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add {title.slice(0,-1)}
        </Button>
    </div>
);
