
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Wand2, Briefcase, FileText, PencilRuler } from 'lucide-react';

import { applicationChecker, ApplicationCheckerOutput } from '@/ai/flows/application-checker';
import { summarizeDocument, SummarizeDocumentOutput } from '@/ai/flows/document-summarization';
import { composeMessage, ComposeMessageOutput } from '@/ai/flows/ai-assisted-messaging';
import { buildResume } from '@/ai/flows/resume-builder-flow';
import type { BuildResumeOutput } from '@/ai/flows/resume-builder-flow';
import { buildCoverLetter } from '@/ai/flows/cover-letter-flow';
import type { BuildCoverLetterOutput } from '@/ai/schemas/cover-letter-schema';
import { assistWithWriting } from '@/ai/flows/writing-assistant-flow';
import type { WritingAssistantOutput } from '@/ai/schemas/writing-assistant-schema';
import { useToast } from '@/hooks/use-toast';
import { useGlobalData } from '@/context/GlobalDataContext';
import { IntakeFormInput } from '@/ai/schemas/intake-form-schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function ApplicationChecker() {
    const [documentText, setDocumentText] = useState('');
    const [applicationType, setApplicationType] = useState('Permanent Residency');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ApplicationCheckerOutput | null>(null);
    const { toast } = useToast();

    const handleCheck = async () => {
        if (!documentText.trim()) {
            toast({ title: 'Error', description: 'Document content cannot be empty.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await applicationChecker({ documentText, applicationType });
            setResult(response);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to check the application. Please try again.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    return (
         <div className="space-y-4">
            <CardDescription>Analyze application documents for missing information, errors, or inconsistencies.</CardDescription>
            <div className="space-y-2">
                <Label htmlFor="app-type">Application Type</Label>
                <Select value={applicationType} onValueChange={setApplicationType}>
                    <SelectTrigger id="app-type">
                        <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Permanent Residency">Permanent Residency</SelectItem>
                        <SelectItem value="Student Visa">Student Visa</SelectItem>
                        <SelectItem value="Work Permit">Work Permit</SelectItem>
                        <SelectItem value="Family Sponsorship">Family Sponsorship</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="app-doc-text">Document Text</Label>
                <Textarea id="app-doc-text" placeholder="Paste the content of the application document here." rows={8} value={documentText} onChange={(e) => setDocumentText(e.target.value)} />
            </div>
            <Button onClick={handleCheck} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Application
            </Button>
            {result && (
                <div className="mt-4 space-y-4 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Analysis Results:</h4>
                    <p><span className="font-semibold">Summary:</span> {result.summary}</p>
                    {result.errors.length > 0 && (
                        <div>
                            <h5 className="font-semibold">Errors Found:</h5>
                            <ul className="list-disc pl-5 text-sm text-destructive">
                                {result.errors.map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                        </div>
                    )}
                    {result.missingInformation.length > 0 && (
                         <div>
                            <h5 className="font-semibold">Missing Information:</h5>
                            <ul className="list-disc pl-5 text-sm text-yellow-600">
                                {result.missingInformation.map((info, i) => <li key={i}>{info}</li>)}
                            </ul>
                        </div>
                    )}
                    {result.inconsistencies.length > 0 && (
                         <div>
                            <h5 className="font-semibold">Inconsistencies Found:</h5>
                            <ul className="list-disc pl-5 text-sm text-blue-600">
                                {result.inconsistencies.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DocumentSummarizer() {
    const [documentText, setDocumentText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SummarizeDocumentOutput | null>(null);
    const { toast } = useToast();

    const handleSummarize = async () => {
        if (!documentText.trim()) {
            toast({ title: 'Error', description: 'Document content cannot be empty.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await summarizeDocument({ documentText });
            setResult(response);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to summarize the document. Please try again.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <CardDescription>Generate a concise summary of any legal or client document.</CardDescription>
            <div className="space-y-2">
                <Label htmlFor="summary-doc-text">Document Text</Label>
                <Textarea id="summary-doc-text" placeholder="Paste document text here to get a summary." rows={8} value={documentText} onChange={(e) => setDocumentText(e.target.value)} />
            </div>
            <Button onClick={handleSummarize} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Summarize Document
            </Button>
            {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Summary:</h4>
                    <p>{result.summary}</p>
                </div>
            )}
        </div>
    );
}

function MessageComposer() {
    const [clientName, setClientName] = useState('');
    const [messageContext, setMessageContext] = useState('');
    const [tone, setTone] = useState('Formal');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ComposeMessageOutput | null>(null);
    const { toast } = useToast();

    const handleCompose = async () => {
         if (!clientName.trim() || !messageContext.trim()) {
            toast({ title: 'Error', description: 'Client Name and Context are required.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await composeMessage({ clientName, messageContext, tone });
            setResult(response);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to compose the message. Please try again.', variant: 'destructive' });
        }
        setIsLoading(false);
    };
    
    return (
         <div className="space-y-4">
            <CardDescription>Compose professional, personalized messages for client communication.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name</Label>
                    <Input id="client-name" placeholder="e.g., John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message-tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger id="message-tone">
                            <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Informal">Informal</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="message-context">Message Context</Label>
                <Textarea id="message-context" placeholder="e.g., Update on PR application status, request for additional documents." rows={4} value={messageContext} onChange={(e) => setMessageContext(e.target.value)} />
            </div>
            <Button onClick={handleCompose} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Message
            </Button>
             {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Generated Message:</h4>
                    <Textarea readOnly value={result.message} rows={6} className="bg-white" />
                </div>
            )}
        </div>
    )
}

function ResumeBuilder() {
    const { clients } = useGlobalData();
    const { toast } = useToast();
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BuildResumeOutput | null>(null);

    const handleGenerate = async () => {
        const client = clients.find(c => c.id.toString() === selectedClientId);
        if (!client || !client.intakeForm?.data) {
            toast({ title: 'Error', description: 'Selected client has not completed their intake form.', variant: 'destructive' });
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
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate the resume. Please try again.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <CardDescription>Generate a resume for a client based on their intake form information, formatted for the Canadian job market.</CardDescription>
            <div className="space-y-2">
                <Label htmlFor="client-select-resume">Select Client</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger id="client-select-resume">
                        <SelectValue placeholder="Select a client to generate a resume for" />
                    </SelectTrigger>
                    <SelectContent>
                        {clients.map(client => (
                            <SelectItem key={client.id} value={client.id.toString()} disabled={!client.intakeForm?.data}>
                                {client.name} {!client.intakeForm?.data && '(No intake form)'}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading || !selectedClientId}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Resume
            </Button>
            {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Generated Resume (Markdown):</h4>
                    <Textarea readOnly value={result.resumeText} rows={15} className="bg-white font-mono text-xs" />
                </div>
            )}
        </div>
    );
}

function CoverLetterBuilder() {
    const { clients } = useGlobalData();
    const { toast } = useToast();
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BuildCoverLetterOutput | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleGenerate = async () => {
        const client = clients.find(c => c.id.toString() === selectedClientId);
        if (!client || !client.intakeForm?.data) {
            toast({ title: 'Error', description: 'Selected client has not completed their intake form.', variant: 'destructive' });
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
        <div className="space-y-4">
            <CardDescription>Generate a tailored cover letter for a client based on their profile and a job description.</CardDescription>
            <div className="space-y-2">
                <Label htmlFor="client-select-cover-letter">Select Client</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger id="client-select-cover-letter">
                        <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                        {clients.map(client => (
                            <SelectItem key={client.id} value={client.id.toString()} disabled={!client.intakeForm?.data}>
                                {client.name} {!client.intakeForm?.data && '(No intake form)'}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="lawyer-job-title">Job Title</Label>
                    <Input id="lawyer-job-title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Software Engineer" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="lawyer-company-name">Company Name</Label>
                    <Input id="lawyer-company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g., Tech Solutions Inc." />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="lawyer-job-desc">Job Description</Label>
                <Textarea id="lawyer-job-desc" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={4} />
            </div>
             <Button onClick={handleGenerate} disabled={isLoading || !selectedClientId}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Cover Letter
            </Button>
            {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Generated Cover Letter:</h4>
                    <Textarea readOnly value={result.coverLetterText} rows={10} className="bg-white font-mono text-xs" />
                </div>
            )}
        </div>
    );
}

function WritingAssistant() {
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
        <div className="space-y-4">
            <CardDescription>Improve writing for emails, summaries, or any other professional text.</CardDescription>
            <div className="space-y-1">
                <Label htmlFor="lawyer-text-to-improve">Original Text</Label>
                <Textarea id="lawyer-text-to-improve" value={textToImprove} onChange={e => setTextToImprove(e.target.value)} placeholder="Paste the text you want to improve here..." rows={4} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="lawyer-instruction">Instruction</Label>
                <Input id="lawyer-instruction" value={instruction} onChange={e => setInstruction(e.target.value)} placeholder="e.g., Make this more professional, shorten it, check for grammar errors." />
            </div>
             <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Improve Text
            </Button>
            {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Improved Text:</h4>
                    <Textarea readOnly value={result.improvedText} rows={4} className="bg-white" />
                </div>
            )}
        </div>
    );
}

export function AIToolsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">AI Tools</h1>
                    <p className="text-muted-foreground">Leverage generative AI to streamline your immigration case management.</p>
                </div>
            </div>
            <Tabs defaultValue="case-management">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="case-management">Case Management Tools</TabsTrigger>
                    <TabsTrigger value="client-assistance">Client Assistance Tools</TabsTrigger>
                </TabsList>
                <TabsContent value="case-management" className="space-y-6 mt-4">
                    <Card>
                        <CardHeader><CardTitle>Document Summarizer</CardTitle></CardHeader>
                        <CardContent><DocumentSummarizer/></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Application Checker</CardTitle></CardHeader>
                        <CardContent><ApplicationChecker/></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>AI-Assisted Messaging</CardTitle></CardHeader>
                        <CardContent><MessageComposer/></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="client-assistance" className="space-y-6 mt-4">
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Canadian Resume Builder</CardTitle></CardHeader>
                        <CardContent><ResumeBuilder/></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Cover Letter Generator</CardTitle></CardHeader>
                        <CardContent><CoverLetterBuilder/></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><PencilRuler className="h-5 w-5"/> Writing Assistant</CardTitle></CardHeader>
                        <CardContent><WritingAssistant/></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
