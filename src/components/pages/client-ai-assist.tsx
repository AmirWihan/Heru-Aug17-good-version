
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, Briefcase, FileText, PencilRuler } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// AI Flows
import { buildResume, BuildResumeOutput } from '@/ai/flows/resume-builder-flow';
import { buildCoverLetter, BuildCoverLetterOutput } from '@/ai/flows/cover-letter-flow';
import { assistWithWriting } from '@/ai/flows/writing-assistant-flow';
import type { WritingAssistantOutput } from '@/ai/schemas/writing-assistant-schema';
import { IntakeFormInput } from '@/ai/schemas/intake-form-schema';

const CURRENT_CLIENT_ID = 5;

function ResumeBuilderTab() {
    const { clients } = useGlobalData();
    const { toast } = useToast();
    const client = clients.find(c => c.id === CURRENT_CLIENT_ID);
    
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BuildResumeOutput | null>(null);

    const handleGenerate = async () => {
        if (!client || !client.intakeForm?.data) {
            toast({
                title: 'Intake Form Required',
                description: 'Please complete your intake form before generating a resume.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
             const apiInput: IntakeFormInput = {
              ...client.intakeForm.data,
              admissibility: {
                ...client.intakeForm.data.admissibility,
                hasCriminalRecord: client.intakeForm.data.admissibility.hasCriminalRecord === 'yes',
                hasMedicalIssues: client.intakeForm.data.admissibility.hasMedicalIssues === 'yes',
                hasOverstayed: client.intakeForm.data.admissibility.hasOverstayed === 'yes',
              },
              immigrationHistory: {
                  ...client.intakeForm.data.immigrationHistory,
                  previouslyApplied: client.intakeForm.data.immigrationHistory.previouslyApplied === 'yes',
                  wasRefused: client.intakeForm.data.immigrationHistory.wasRefused === 'yes',
              },
            };
            const response = await buildResume(apiInput);
            setResult(response);
            toast({
                title: 'Resume Generated!',
                description: 'Your new resume is ready to be reviewed.',
            });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate your resume. Please try again.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CardContent className="space-y-4">
            <CardDescription>Generate a professional resume based on your intake form information, formatted for the Canadian job market.</CardDescription>
            { !client?.intakeForm?.data ? (
                <div className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted/50 rounded-lg">
                    <AlertTriangle className="h-8 w-8 mb-2" />
                    <p>You must complete your intake form before using this tool.</p>
                </div>
            ) : (
                <>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate My Resume</>
                        )}
                    </Button>
                    {result && (
                        <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                            <h4 className="font-bold">Generated Resume (Markdown):</h4>
                            <Textarea readOnly value={result.resumeText} rows={15} className="bg-background font-mono text-xs" />
                        </div>
                    )}
                </>
            )}
        </CardContent>
    );
}

function CoverLetterTab() {
    const { clients } = useGlobalData();
    const { toast } = useToast();
    const client = clients.find(c => c.id === CURRENT_CLIENT_ID);

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BuildCoverLetterOutput | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleGenerate = async () => {
         if (!client || !client.intakeForm?.data) {
            toast({ title: 'Intake Form Required', variant: 'destructive' });
            return;
        }
        if (!jobTitle || !companyName || !jobDescription) {
            toast({ title: 'Job Details Required', description: 'Please fill in all job details.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setResult(null);

         try {
             const apiInput = {
              ...client.intakeForm.data,
              jobTitle,
              companyName,
              jobDescription,
              admissibility: {
                ...client.intakeForm.data.admissibility,
                hasCriminalRecord: client.intakeForm.data.admissibility.hasCriminalRecord === 'yes',
                hasMedicalIssues: client.intakeForm.data.admissibility.hasMedicalIssues === 'yes',
                hasOverstayed: client.intakeForm.data.admissibility.hasOverstayed === 'yes',
              },
              immigrationHistory: {
                  ...client.intakeForm.data.immigrationHistory,
                  previouslyApplied: client.intakeForm.data.immigrationHistory.previouslyApplied === 'yes',
                  wasRefused: client.intakeForm.data.immigrationHistory.wasRefused === 'yes',
              },
            };
            const response = await buildCoverLetter(apiInput);
            setResult(response);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate cover letter.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <CardContent className="space-y-4">
            <CardDescription>Generate a tailored cover letter for a specific job application.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Software Engineer" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g., Tech Solutions Inc." />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="job-desc">Job Description</Label>
                <Textarea id="job-desc" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={6} />
            </div>
             <Button onClick={handleGenerate} disabled={isLoading || !client?.intakeForm?.data}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Cover Letter
            </Button>
            {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Generated Cover Letter:</h4>
                    <Textarea readOnly value={result.coverLetterText} rows={15} className="bg-background font-mono text-xs" />
                </div>
            )}
        </CardContent>
    );
}

function WritingAssistantTab() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<WritingAssistantOutput | null>(null);
    const [textToImprove, setTextToImprove] = useState('');
    const [instruction, setInstruction] = useState('');

    const handleGenerate = async () => {
        if (!textToImprove || !instruction) {
            toast({ title: 'Input Required', description: 'Please provide text and an instruction.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await assistWithWriting({ textToImprove, instruction });
            setResult(response);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to process text.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CardContent className="space-y-4">
            <CardDescription>Improve your writing for emails, summaries, or any other text.</CardDescription>
            <div className="space-y-1">
                <Label htmlFor="text-to-improve">Your Text</Label>
                <Textarea id="text-to-improve" value={textToImprove} onChange={e => setTextToImprove(e.target.value)} placeholder="Paste the text you want to improve here..." rows={6} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="instruction">Instruction</Label>
                <Input id="instruction" value={instruction} onChange={e => setInstruction(e.target.value)} placeholder="e.g., Make this more professional, shorten it to 3 sentences, check for grammar errors." />
            </div>
             <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Improve Text
            </Button>
            {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Improved Text:</h4>
                    <Textarea readOnly value={result.improvedText} rows={6} className="bg-background" />
                </div>
            )}
        </CardContent>
    );
}


export function ClientAiAssistPage() {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">AI Assist</h1>
                    <p className="text-muted-foreground">AI-powered tools to help you with your job search and professional writing.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>AI Career Tools</CardTitle>
                </CardHeader>
                <Tabs defaultValue="resume">
                    <TabsList className="grid w-full grid-cols-3 mb-4 px-6">
                        <TabsTrigger value="resume"><Briefcase className="mr-2 h-4 w-4" />Resume Builder</TabsTrigger>
                        <TabsTrigger value="cover-letter"><FileText className="mr-2 h-4 w-4" />Cover Letter</TabsTrigger>
                        <TabsTrigger value="writing-assistant"><PencilRuler className="mr-2 h-4 w-4"/>Writing Assistant</TabsTrigger>
                    </TabsList>
                    <TabsContent value="resume"><ResumeBuilderTab /></TabsContent>
                    <TabsContent value="cover-letter"><CoverLetterTab /></TabsContent>
                    <TabsContent value="writing-assistant"><WritingAssistantTab /></TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
