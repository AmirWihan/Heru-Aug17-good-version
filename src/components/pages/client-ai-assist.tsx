
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, Briefcase, FileText, PencilRuler, Gift } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// AI Flows
import { buildResume, BuildResumeOutput } from '@/ai/flows/resume-builder-flow';
import { buildCoverLetter, BuildCoverLetterOutput } from '@/ai/flows/cover-letter-flow';
import { assistWithWriting } from '@/ai/flows/writing-assistant-flow';
import type { WritingAssistantOutput } from '@/ai/schemas/writing-assistant-schema';
import { Client, IntakeFormInput } from '@/ai/schemas/intake-form-schema';
import { Copy } from 'lucide-react';

const AI_FEATURE_COST = 5;

const AIToolTab = ({ 
    title, 
    description,
    cost,
    client,
    onGenerate,
    isLoading,
    children,
    buttonText,
    Icon,
    result
}: {
    title: string;
    description: string;
    cost: number;
    client: Client | null;
    onGenerate: () => Promise<void>;
    isLoading: boolean;
    children: React.ReactNode;
    buttonText: string;
    Icon: React.ElementType;
    result: any;
}) => {
    const hasSufficientCoins = (client?.coins ?? 0) >= cost;
    
    return (
        <CardContent className="space-y-4">
            <CardDescription>{description} It costs <span className="font-bold text-primary">{cost} coins</span>.</CardDescription>
            {children}
            <Button onClick={onGenerate} disabled={isLoading || !client?.intakeForm?.data || !hasSufficientCoins}>
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                    <><Icon className="mr-2 h-4 w-4" /> {buttonText}</>
                )}
            </Button>
            {!hasSufficientCoins && <p className="text-sm text-destructive mt-2">You do not have enough coins for this feature. Refer friends to earn more!</p>}
            {result && (
                 <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 animate-fade">
                    <h4 className="font-bold">Generated Result:</h4>
                    <Textarea readOnly value={result.resumeText || result.coverLetterText || result.improvedText} rows={15} className="bg-background font-mono text-xs" />
                </div>
            )}
        </CardContent>
    );
};


export function ClientAiAssistPage() {
    const { userProfile, updateClient } = useGlobalData();
    const { toast } = useToast();
    const client = userProfile as Client | null;

    const [resumeResult, setResumeResult] = useState<BuildResumeOutput | null>(null);
    const [coverLetterResult, setCoverLetterResult] = useState<BuildCoverLetterOutput | null>(null);
    const [writingResult, setWritingResult] = useState<WritingAssistantOutput | null>(null);
    
    const [isResumeLoading, setIsResumeLoading] = useState(false);
    const [isCoverLoading, setIsCoverLoading] = useState(false);
    const [isWritingLoading, setIsWritingLoading] = useState(false);

    // Cover letter specific state
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    // Writing assistant specific state
    const [textToImprove, setTextToImprove] = useState('');
    const [instruction, setInstruction] = useState('');
    
    const handleUseCoins = (cost: number) => {
        if (!client) return;
        const newBalance = (client.coins || 0) - cost;
        updateClient({ ...client, coins: newBalance });
        toast({
            title: `You spent ${cost} coins!`,
            description: `Your new balance is ${newBalance}.`,
        });
    };
    
    const handleReferral = () => {
        if (!client) return;
        const newBalance = (client.coins || 0) + 5;
        updateClient({ ...client, coins: newBalance });
        toast({
            title: "Referral Success!",
            description: "You've earned 5 coins! Your new balance is " + newBalance,
        });
    };
    
    const copyReferralLink = () => {
        navigator.clipboard.writeText(`https://visafor.com/register?ref=${client?.id || 'user'}`);
        toast({ title: "Copied to clipboard!", description: "Share your referral link with friends." });
    };

    const handleGenerateResume = async () => {
        if (!client || !client.intakeForm?.data) return;
        setIsResumeLoading(true);
        setResumeResult(null);
        try {
            const apiInput: IntakeFormInput = { ...client.intakeForm.data, admissibility: { hasCriminalRecord: false, hasMedicalIssues: false }, immigrationHistory: { previouslyApplied: false, wasRefused: false } };
            const response = await buildResume(apiInput);
            setResumeResult(response);
            handleUseCoins(AI_FEATURE_COST);
        } catch (error) { toast({ title: 'Error', description: 'Failed to generate resume.', variant: 'destructive' }); }
        setIsResumeLoading(false);
    };

    const handleGenerateCoverLetter = async () => {
        if (!client || !client.intakeForm?.data) return;
        if (!jobTitle || !companyName || !jobDescription) { toast({ title: 'Job Details Required', variant: 'destructive' }); return; }
        setIsCoverLoading(true);
        setCoverLetterResult(null);
        try {
            const apiInput = { ...client.intakeForm.data, jobTitle, companyName, jobDescription, admissibility: { hasCriminalRecord: false, hasMedicalIssues: false }, immigrationHistory: { previouslyApplied: false, wasRefused: false } };
            const response = await buildCoverLetter(apiInput);
            setCoverLetterResult(response);
            handleUseCoins(AI_FEATURE_COST);
        } catch (error) { toast({ title: 'Error', description: 'Failed to generate cover letter.', variant: 'destructive' }); }
        setIsCoverLoading(false);
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
                        <Button onClick={handleReferral}>Simulate a Friend Signing Up</Button>
                    </CardContent>
                </Card>
                 { !client?.intakeForm?.data && (
                    <Card className="flex items-center justify-center text-center border-dashed">
                        <div className="p-6 text-muted-foreground">
                            <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-amber-500" />
                            <h3 className="font-semibold text-foreground">Complete Your Intake Form</h3>
                            <p className="text-sm">You must complete your intake form before using the AI career tools.</p>
                        </div>
                    </Card>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>AI Career Tools</CardTitle>
                </CardHeader>
                <Tabs defaultValue="resume">
                    <TabsList className="grid w-full grid-cols-3 mb-4 px-6">
                        <TabsTrigger value="resume" disabled={!client?.intakeForm?.data}><Briefcase className="mr-2 h-4 w-4" />Resume Builder</TabsTrigger>
                        <TabsTrigger value="cover-letter" disabled={!client?.intakeForm?.data}><FileText className="mr-2 h-4 w-4" />Cover Letter</TabsTrigger>
                        <TabsTrigger value="writing-assistant"><PencilRuler className="mr-2 h-4 w-4"/>Writing Assistant</TabsTrigger>
                    </TabsList>
                    <TabsContent value="resume">
                         <AIToolTab 
                            title="Resume Builder"
                            description="Generate a professional resume based on your intake form information, formatted for the Canadian job market."
                            cost={AI_FEATURE_COST}
                            client={client}
                            onGenerate={handleGenerateResume}
                            isLoading={isResumeLoading}
                            buttonText="Generate My Resume"
                            Icon={Sparkles}
                            result={resumeResult}
                         >
                            <p className="text-sm text-muted-foreground">This tool will use the data from your completed intake form. Make sure it's up-to-date for the best results.</p>
                         </AIToolTab>
                    </TabsContent>
                    <TabsContent value="cover-letter">
                         <AIToolTab 
                            title="Cover Letter"
                            description="Generate a tailored cover letter for a specific job application."
                            cost={AI_FEATURE_COST}
                            client={client}
                            onGenerate={handleGenerateCoverLetter}
                            isLoading={isCoverLoading}
                            buttonText="Generate Cover Letter"
                            Icon={Sparkles}
                            result={coverLetterResult}
                         >
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
                         </AIToolTab>
                    </TabsContent>
                    <TabsContent value="writing-assistant">
                        {/* Placeholder for Writing Assistant, can be implemented similarly */}
                        <CardContent>
                             <p className="text-center text-muted-foreground p-8">The Writing Assistant feature is coming soon!</p>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
