
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Wand2, PencilRuler, Send } from 'lucide-react';
import { composeMessage, ComposeMessageOutput } from '@/ai/flows/ai-assisted-messaging';
import { assistWithWriting, WritingAssistantOutput } from '@/ai/flows/writing-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function MessageComposer() {
    const [recipientName, setRecipientName] = useState('');
    const [messageContext, setMessageContext] = useState('');
    const [tone, setTone] = useState('Professional');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ComposeMessageOutput | null>(null);
    const { toast } = useToast();

    const handleCompose = async () => {
         if (!recipientName.trim() || !messageContext.trim()) {
            toast({ title: 'Error', description: 'Recipient Name and Context are required.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await composeMessage({ clientName: recipientName, messageContext, tone });
            setResult(response);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to compose the message. Please try again.', variant: 'destructive' });
        }
        setIsLoading(false);
    };
    
    return (
         <div className="space-y-4">
            <CardDescription>Compose professional outreach emails, announcements, or support responses.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recipient-name">Recipient Name / Group</Label>
                    <Input id="recipient-name" placeholder="e.g., Acme Corp Legal Team" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message-tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger id="message-tone"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="message-context">Message Context</Label>
                <Textarea id="message-context" placeholder="e.g., Follow up on demo request, announce new feature." rows={4} value={messageContext} onChange={(e) => setMessageContext(e.target.value)} />
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
            <CardDescription>Improve writing for marketing copy, support articles, or any other professional text.</CardDescription>
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

export function AdminAIToolsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">AI Tools for Platform Management</h1>
                    <p className="text-muted-foreground">Leverage generative AI to streamline your business communications.</p>
                </div>
            </div>
            <Card>
                <Tabs defaultValue="composer">
                    <TabsList className="grid w-full grid-cols-2 m-6 mb-0">
                        <TabsTrigger value="composer"><Send className="mr-2 h-4 w-4" />Message Composer</TabsTrigger>
                        <TabsTrigger value="writer"><PencilRuler className="mr-2 h-4 w-4"/>Writing Assistant</TabsTrigger>
                    </TabsList>
                    <TabsContent value="composer"><CardContent><MessageComposer/></CardContent></TabsContent>
                    <TabsContent value="writer"><CardContent><WritingAssistant/></CardContent></TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
