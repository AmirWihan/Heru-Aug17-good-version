'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, LifeBuoy, Ticket, Send } from "lucide-react";

export function SupportPage() {
    const { toast } = useToast();
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmitTicket = () => {
        if (!subject || !topic || !description) {
            toast({
                title: 'Missing Information',
                description: 'Please fill out all fields to submit a ticket.',
                variant: 'destructive',
            });
            return;
        }

        const ticketId = `TKT-${Math.floor(Math.random() * 90000) + 10000}`;
        toast({
            title: 'Ticket Submitted!',
            description: `Your support ticket #${ticketId} has been created. We will get back to you shortly.`,
        });

        // Reset form
        setSubject('');
        setTopic('');
        setDescription('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <LifeBuoy className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">Help & Support</h1>
                    <p className="text-muted-foreground">Get help, report issues, and find answers to your questions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Live Chat
                        </CardTitle>
                        <CardDescription>Get instant help from our support team during business hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Our live chat is available from 9 AM to 5 PM EST, Monday to Friday.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => toast({ title: 'Live Chat', description: 'Connecting you to a support agent...' })}>
                            Start Chat
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-primary" />
                            Submit a Support Ticket
                        </CardTitle>
                        <CardDescription>Report an issue or request assistance. We'll get back to you within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Select value={topic} onValueChange={setTopic}>
                                    <SelectTrigger id="topic">
                                        <SelectValue placeholder="Select a topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="billing">Billing & Subscription</SelectItem>
                                        <SelectItem value="technical">Technical Issue</SelectItem>
                                        <SelectItem value="feature-request">Feature Request</SelectItem>
                                        <SelectItem value="general">General Question</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Unable to upload document" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please describe the issue in detail..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSubmitTicket}>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Ticket
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
