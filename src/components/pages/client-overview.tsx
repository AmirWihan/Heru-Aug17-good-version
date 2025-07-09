
'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, FileText, MessageSquare, Search, Sparkles, Loader2, AlertTriangle, Handshake, Check, X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCaseTimeline, type CaseTimelineOutput } from "@/ai/flows/case-timeline-flow";
import { CaseTimeline } from "@/components/case-timeline";
import { useGlobalData } from "@/context/GlobalDataContext";
import type { Client, TeamMember } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ClientOverviewPage({ setPage }: { setPage: (page: string) => void }) {
    const { toast } = useToast();
    const { userProfile, loading, updateClient, teamMembers } = useGlobalData();
    const client = userProfile as Client;
    
    const [timelineData, setTimelineData] = useState<CaseTimelineOutput['timeline'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const connectionRequestLawyer = client?.connectionRequestFromLawyerId 
        ? teamMembers.find(m => m.id === client.connectionRequestFromLawyerId) 
        : null;

    useEffect(() => {
        if (client && client.authRole === 'client') {
            async function fetchTimeline() {
                try {
                    const response = await getCaseTimeline({
                        visaType: client.caseSummary.caseType,
                        currentStage: client.caseSummary.currentStatus,
                        countryOfOrigin: client.countryOfOrigin,
                    });
                    setTimelineData(response.timeline);
                } catch (err) {
                    console.error("Failed to fetch timeline:", err);
                    setError("Could not generate your personalized timeline at this moment. Please try again later.");
                    toast({
                        title: "Timeline Error",
                        description: "Failed to generate the case timeline.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            }
            fetchTimeline();
        }
    }, [client, toast]);

    const handleAcceptRequest = () => {
        if (!client || !connectionRequestLawyer) return;
        updateClient({
            ...client,
            connectedLawyerId: connectionRequestLawyer.id,
            connectionRequestFromLawyerId: null,
        });
        toast({
            title: "Connection Accepted!",
            description: `You are now connected with ${connectionRequestLawyer.name}.`
        });
    };
    
    const handleDeclineRequest = () => {
        if (!client || !connectionRequestLawyer) return;
        updateClient({
            ...client,
            connectionRequestFromLawyerId: null,
        });
        toast({
            title: "Connection Declined",
            description: `You have declined the connection request from ${connectionRequestLawyer.name}.`,
            variant: "destructive"
        });
    };
    
    if (loading || !client || client.authRole !== 'client') {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            {connectionRequestLawyer && (
                <Card className="border-primary bg-primary/5">
                    <CardHeader className="flex-row items-center gap-4">
                         <Avatar className="h-12 w-12">
                            <AvatarImage src={connectionRequestLawyer.avatar} />
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div>
                             <CardTitle className="flex items-center gap-2">
                                <Handshake className="h-5 w-5 text-primary" />
                                Connection Request
                            </CardTitle>
                            <CardDescription>
                                <span className="font-semibold">{connectionRequestLawyer.name}</span> from <span className="font-semibold">{connectionRequestLawyer.firmName}</span> wants to connect with you.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter className="gap-2">
                        <Button onClick={handleAcceptRequest}><Check className="mr-2 h-4 w-4"/> Accept & Connect</Button>
                        <Button variant="ghost" onClick={handleDeclineRequest}><X className="mr-2 h-4 w-4"/>Decline</Button>
                    </CardFooter>
                </Card>
            )}
            <Card className="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent to-primary text-primary-foreground shadow-lg">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">Welcome, {client.name}! 👋</h2>
                        <p className="text-primary-foreground/90 mt-1">
                            Your application status is currently: <span className="font-bold">{client.caseSummary.currentStatus}</span>.
                            <br/>
                            Next Step: <span className="font-bold">{client.caseSummary.nextStep}</span>.
                        </p>
                    </div>
                    <Button 
                        className="bg-primary-foreground/90 text-primary hover:bg-primary-foreground w-full md:w-auto"
                        onClick={() => setPage('documents')}>
                        View My Documents <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI-Powered Case Timeline
                    </CardTitle>
                    <CardDescription>A personalized estimate of your immigration journey's next steps and timelines.</CardDescription>
                </CardHeader>
                <CardContent>
                   {isLoading && (
                       <div className="flex items-center justify-center h-40">
                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
                           <p className="ml-4 text-muted-foreground">Generating your personalized timeline...</p>
                       </div>
                   )}
                   {error && !isLoading && (
                       <div className="flex flex-col items-center justify-center h-40 text-center text-destructive">
                           <AlertTriangle className="h-8 w-8 mb-2" />
                           <p className="font-semibold">Timeline Generation Failed</p>
                           <p className="text-sm">{error}</p>
                       </div>
                   )}
                   {timelineData && !isLoading && <CaseTimeline timeline={timelineData} />}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" onClick={() => setPage('documents')}><FileText className="mr-2 h-4 w-4"/> View Required Documents</Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => setPage('messages')}><MessageSquare className="mr-2 h-4 w-4"/> Message Your Lawyer</Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => setPage('find-lawyer')} disabled={!!client.connectedLawyerId}><Search className="mr-2 h-4 w-4"/> Find a New Lawyer</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Next Appointment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="bg-muted text-primary rounded-lg p-3 flex flex-col items-center">
                                <span className="text-sm font-bold">JUL</span>
                                <span className="text-2xl font-bold">28</span>
                            </div>
                            <div>
                                <p className="font-semibold">Follow-up Call with Emma Johnson</p>
                                <p className="text-sm text-muted-foreground">Sunday, July 28, 2024 at 2:00 PM</p>
                            </div>
                        </div>
                         <Button className="w-full mt-4" onClick={() => setPage('appointments')}>View All Appointments</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
