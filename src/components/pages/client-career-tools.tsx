'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, Briefcase } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { buildResume, BuildResumeOutput } from '@/ai/flows/resume-builder-flow';
import { IntakeFormInput } from '@/ai/flows/intake-form-analyzer';

const CURRENT_CLIENT_ID = 5;

export function ClientCareerToolsPage() {
    const { clients } = useGlobalData();
    const { toast } = useToast();
    const client = clients.find(c => c.id === CURRENT_CLIENT_ID);
    
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BuildResumeOutput | null>(null);

    const handleGenerateResume = async () => {
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
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">Career Tools</h1>
                    <p className="text-muted-foreground">AI-powered tools to help you prepare for your job search in Canada.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">AI Resume Builder</CardTitle>
                    <CardDescription>Generate a professional resume based on your intake form information, formatted for the Canadian job market.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    { !client?.intakeForm?.data ? (
                        <div className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted/50 rounded-lg">
                            <AlertTriangle className="h-8 w-8 mb-2" />
                            <p>You must complete your intake form before using this tool.</p>
                        </div>
                    ) : (
                        <>
                            <Button onClick={handleGenerateResume} disabled={isLoading}>
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
            </Card>
        </div>
    );
}
