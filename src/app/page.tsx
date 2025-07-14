
'use client';

import { useState }from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CommandBox = ({ command, onCopy, hasCopied }: { command: string, onCopy: (cmd: string) => void, hasCopied: boolean }) => (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
        <span className="text-muted-foreground">$</span>
        <span className="flex-1 text-foreground">{command}</span>
        <Button size="icon" variant="ghost" onClick={() => onCopy(command)}>
            {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
    </div>
);

export default function DeploymentPage() {
    const { toast } = useToast();
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

    const handleCopy = (command: string) => {
        navigator.clipboard.writeText(command);
        setCopiedCommand(command);
        toast({
            title: "Command Copied!",
            description: "Paste it into the terminal to run.",
        });
        setTimeout(() => setCopiedCommand(null), 2000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
             <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <Rocket className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="font-headline text-3xl font-bold mt-4">Publish Your Application</CardTitle>
                    <CardDescription>
                        Your application has been fixed and is ready to go live. Follow these two simple steps.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                            <h3 className="text-lg font-semibold">Open the Terminal</h3>
                        </div>
                        <p className="text-muted-foreground pl-12">
                            In the top menu bar of the editor, click **Terminal &gt; New Terminal**. A command panel will open at the bottom of the screen.
                        </p>
                    </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                            <h3 className="text-lg font-semibold">Run the Deploy Commands</h3>
                        </div>
                        <div className="pl-12 space-y-4">
                            <p className="text-muted-foreground">
                                First, copy and paste this command into the terminal to log in to Firebase. Press Enter after pasting.
                            </p>
                            <CommandBox command="firebase login" onCopy={handleCopy} hasCopied={copiedCommand === "firebase login"} />
                            
                            <p className="text-muted-foreground">
                                After you have logged in, copy and paste this second command to deploy your app. Press Enter.
                            </p>
                            <CommandBox command="firebase deploy" onCopy={handleCopy} hasCopied={copiedCommand === "firebase deploy"} />
                        </div>
                    </div>

                     <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">Once the deployment is complete, the terminal will show you your live application URL.</p>
                        <p className="text-sm text-muted-foreground">To select a user role again, you can <Link href="/dashboard-select" className="underline hover:text-primary">go to the role selection page</Link>.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
