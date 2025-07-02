
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';

import { applicationChecker, ApplicationCheckerOutput } from '@/ai/flows/application-checker';
import { summarizeDocument, SummarizeDocumentOutput } from '@/ai/flows/document-summarization';
import { composeMessage, ComposeMessageOutput } from '@/ai/flows/ai-assisted-messaging';
import { useToast } from '@/hooks/use-toast';

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
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Application Checker</CardTitle>
                <CardDescription>Analyze application documents for missing information, errors, or inconsistencies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
        </Card>
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
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Document Summarizer</CardTitle>
                <CardDescription>Generate a concise summary of any legal or client document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
        </Card>
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
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">AI-Assisted Messaging</CardTitle>
                <CardDescription>Compose professional, personalized messages for client communication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
        </Card>
    )
}

export function AIToolsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">AI Tools</h1>
                    <p className="text-muted-foreground">Leverage generative AI to streamline your immigration case management.</p>
                </div>
            </div>
            <div className="space-y-6">
                <DocumentSummarizer />
                <ApplicationChecker />
                <MessageComposer />
            </div>
        </div>
    );
}
