
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Gift, Copy, Briefcase, FileText } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// AI Flows
import { assistWithWriting, WritingAssistantOutput } from '@/ai/flows/writing-assistant-flow';
import { buildResume, type BuildResumeOutput } from '@/ai/flows/resume-builder-flow';
import { buildCoverLetter, type BuildCoverLetterOutput } from '@/ai/schemas/cover-letter-schema';
import { type IntakeFormInput } from '@/ai/schemas/intake-form-schema';
import { Client } from '@/lib/data';

const WRITING_ASSISTANT_COST = 5;
const CAREER_TOOL_COST = 10;

function WritingAssistant() {
    const { userProfile, updateClient } = useGlobalData();
    const { toast } = useToast();
    const client = userProfile as Client | null;

    const [result, setResult] = useState<WritingAssistantOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [textToImprove, setTextToImprove] = useState('');
    const [instruction, setInstruction] = useState('');

    const hasSufficientCoins = (client?.coins ?? 0) >= WRITING_ASSISTANT_COST;
    const isDisabled = isLoading || !hasSufficientCoins;

    const handleUseCoins = (cost: number) => {
        if (!client) return;
        const newBalance = (client.coins || 0) - cost;
        updateClient({ ...client, coins: newBalance });
        toast({
            title: `You spent ${cost} coins!`,
            description: `Your new balance is ${newBalance}.`,
        });
    };

    const handleGenerate = async () => {
        if (!textToImprove || !instruction) {
            toast({ title: 'Input Required', description: 'Please provide text and an instruction.', variant: 'destructive' });
            return;
        }
        if (!hasSufficientCoins) {
            toast({ title: "Insufficient Coins", description: "You don't have enough coins to use this feature.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await assistWithWriting({ textToImprove, instruction });
            setResult(response);
            handleUseCoins(WRITING_ASSISTANT_COST);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to process text.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <CardDescription>Improve any text, such as emails to potential employers or clarifying questions for your lawyer. This costs <span className="font-bold text-primary">{WRITING_ASSISTANT_COST} coins</span>.</CardDescription>
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="client-text-to-improve">Original Text</Label>
                    <Textarea id="client-text-to-improve" value={textToImprove} onChange={e => setTextToImprove(e.target.value)} placeholder="Paste the text you want to improve here..." rows={4} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="client-instruction">Instruction</Label>
                    <Input id="client-instruction" value={instruction} onChange={e => setInstruction(e.target.value)} placeholder="e.g., make it more professional, check grammar." />
                </div>
            </div>
             <Button onClick={handleGenerate} disabled={isDisabled}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Improving...</> : <><Sparkles className="mr-2 h-4 w-4" /> Improve My Text</>}
            </Button>
            {!hasSufficientCoins && <p className="text-sm text-destructive mt-2">You do not have enough coins for this feature. Refer friends to earn more!</p>}
             {result && (
                 <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Improved Text:</h4>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result.improvedText)}>
                            <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                    </div>
                    <Textarea readOnly value={result.improvedText} rows={6} className="bg-background font-mono text-xs" />
                </div>
            )}
        </div>
    );
}

function ResumeBuilder() {
    const { userProfile, updateClient } = useGlobalData();
    const client = userProfile as Client;
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BuildResumeOutput | null>(null);

    const hasSufficientCoins = (client?.coins ?? 0) >= CAREER_TOOL_COST;
    const isDisabled = isLoading || !hasSufficientCoins || !client?.intakeForm?.data;

    const handleUseCoins = (cost: number) => {
        const newBalance = (client.coins || 0) - cost;
        updateClient({ ...client, coins: newBalance });
        toast({ title: `You spent ${cost} coins!`, description: `Your new balance is ${newBalance}.` });
    };

    const handleGenerate = async () => {
        if (!client?.intakeForm?.data) {
            toast({ title: 'Error', description: 'Please complete your intake form before generating a resume.', variant: 'destructive' });
            return;
        }
        if (!hasSufficientCoins) {
            toast({ title: "Insufficient Coins", description: "You don't have enough coins for this feature.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setResult(null);

        try {
            const response = await buildResume(client.intakeForm.data as IntakeFormInput);
            setResult(response);
            handleUseCoins(CAREER_TOOL_COST);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate the resume. Please try again.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <CardDescription>Generate a resume based on your intake form information, formatted for the Canadian job market. This costs <span className="font-bold text-primary">{CAREER_TOOL_COST} coins</span>.</CardDescription>
            <Button onClick={handleGenerate} disabled={isDisabled}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Resume
            </Button>
             {!client?.intakeForm?.data && <p className="text-sm text-destructive mt-2">You must complete your intake form to use this feature.</p>}
            {!hasSufficientCoins && <p className="text-sm text-destructive mt-2">You do not have enough coins for this feature.</p>}
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
    const { userProfile, updateClient } = useGlobalData();
    const client = userProfile as Client;
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BuildCoverLetterOutput | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const hasSufficientCoins = (client?.coins ?? 0) >= CAREER_TOOL_COST;
    const isDisabled = isLoading || !hasSufficientCoins || !client?.intakeForm?.data;
    
    const handleUseCoins = (cost: number) => {
        const newBalance = (client.coins || 0) - cost;
        updateClient({ ...client, coins: newBalance });
        toast({ title: `You spent ${cost} coins!`, description: `Your new balance is ${newBalance}.` });
    };

    const handleGenerate = async () => {
        if (!client?.intakeForm?.data) {
            toast({ title: 'Error', description: 'Please complete your intake form first.', variant: 'destructive' });
            return;
        }
        if (!jobTitle || !companyName || !jobDescription) {
            toast({ title: 'Job Details Required', description: 'Please fill in all job details.', variant: 'destructive' });
            return;
        }
        if (!hasSufficientCoins) {
            toast({ title: "Insufficient Coins", description: "You don't have enough coins for this feature.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setResult(null);

         try {
             const apiInput = {
              clientData: client.intakeForm.data as IntakeFormInput,
              jobTitle,
              companyName,
              jobDescription,
            };
            const response = await buildCoverLetter(apiInput);
            setResult(response);
            handleUseCoins(CAREER_TOOL_COST);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate cover letter.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
            <CardDescription>Generate a tailored cover letter based on your profile and a job description. This costs <span className="font-bold text-primary">{CAREER_TOOL_COST} coins</span>.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="client-job-title">Job Title</Label>
                    <Input id="client-job-title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Software Engineer" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="client-company-name">Company Name</Label>
                    <Input id="client-company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g., Tech Solutions Inc." />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="client-job-desc">Job Description</Label>
                <Textarea id="client-job-desc" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={4} />
            </div>
             <Button onClick={handleGenerate} disabled={isDisabled}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Cover Letter
            </Button>
            {!client?.intakeForm?.data && <p className="text-sm text-destructive mt-2">You must complete your intake form to use this feature.</p>}
            {!hasSufficientCoins && <p className="text-sm text-destructive mt-2">You do not have enough coins for this feature.</p>}
            {result && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Generated Cover Letter:</h4>
                    <Textarea readOnly value={result.coverLetterText} rows={10} className="bg-white font-mono text-xs" />
                </div>
            )}
        </div>
    );
}


export function ClientAiAssistPage() {
    const { userProfile, updateClient } = useGlobalData();
    const { toast } = useToast();
    const client = userProfile as Client | null;

    const copyReferralLink = () => {
        navigator.clipboard.writeText(`https://visafor.com/register?ref=${client?.id || 'user'}`);
        toast({ title: "Copied to clipboard!", description: "Share your referral link with friends." });
    };
    
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">AI Assist</h1>
                    <p className="text-muted-foreground">Use your coins to access AI-powered tools for your job search.</p>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-tr from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/20 dark:via-amber-950/20 dark:to-orange-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-amber-600"/>Refer & Earn Coins</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">Share your unique link with friends. When they register, you both get 5 bonus coins!</p>
                        <div className="flex items-center space-x-2">
                             <Input type="text" readOnly value={`https://visafor.com/register?ref=${client?.id || 'user'}`} />
                             <Button variant="outline" size="icon" onClick={copyReferralLink}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <Tabs defaultValue="writing">
                    <TabsList className="grid w-full grid-cols-3 m-6 mb-0">
                        <TabsTrigger value="writing"><FileText className="mr-2 h-4 w-4" />Writing Assistant</TabsTrigger>
                        <TabsTrigger value="resume"><Briefcase className="mr-2 h-4 w-4"/>Resume Builder</TabsTrigger>
                        <TabsTrigger value="cover-letter"><FileText className="mr-2 h-4 w-4"/>Cover Letter Generator</TabsTrigger>
                    </TabsList>
                    <TabsContent value="writing"><CardContent><WritingAssistant/></CardContent></TabsContent>
                    <TabsContent value="resume"><CardContent><ResumeBuilder/></CardContent></TabsContent>
                    <TabsContent value="cover-letter"><CardContent><CoverLetterBuilder/></CardContent></TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
