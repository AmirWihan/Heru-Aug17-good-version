
'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, FileText, MessageSquare, Search, Sparkles, Loader2, AlertTriangle, Handshake, Check, X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCaseTimeline, type CaseTimelineOutput } from "@/ai/flows/case-timeline-flow";
import { CaseTimeline } from "@/components/case-timeline";
import { useGlobalData } from "@/context/GlobalDataContext";
import type { Client, TeamMember, ApplicationStatus } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ApplicationProgress } from "@/components/application-progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function ClientOverviewPage({ setPage }: { setPage: (page: string) => void }) {
    const { toast } = useToast();
    const { userProfile, loading, updateClient, teamMembers } = useGlobalData();
    const client = userProfile as Client;
    
    const [timelineData, setTimelineData] = useState<CaseTimelineOutput['timeline'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTimelineVisible, setIsTimelineVisible] = useState(false);

    const connectionRequestLawyer = client?.connectionRequestFromLawyerId 
        ? teamMembers.find(m => m.id === client.connectionRequestFromLawyerId) 
        : null;

    useEffect(() => {
        if (client && client.authRole === 'client') {
            async function fetchTimeline() {
                try {
                    const inputData = {
                        visaType: client.caseSummary.caseType,
                        currentStage: client.caseSummary.currentStatus,
                        countryOfOrigin: client.countryOfOrigin,
                    };
                    const jsonString = JSON.stringify(inputData);
                    const response = await getCaseTimeline(jsonString);
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
        } else {
            setIsLoading(false);
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
                <Collapsible open={isTimelineVisible} onOpenChange={setIsTimelineVisible}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Case Progress</CardTitle>
                            <CardDescription>A high-level overview of your application status.</CardDescription>
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" title="Toggle AI Timeline">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <span className="sr-only">Toggle AI Timeline</span>
                            </Button>
                        </CollapsibleTrigger>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ApplicationProgress currentStatus={client.caseSummary.currentStatus as ApplicationStatus} />
                        
                        <CollapsibleContent className="space-y-4 animate-accordion-down">
                           <div className="border-t pt-4">
                                {isLoading && (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="ml-4 text-muted-foreground">Generating AI timeline...</p>
                                    </div>
                                )}
                                {error && !isLoading && (
                                    <div className="text-center text-destructive">
                                        <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                                        <p>{error}</p>
                                    </div>
                                )}
                                {timelineData && !isLoading && (
                                    <>
                                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            AI-Powered Detailed Timeline
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Here is an estimated, step-by-step projection of your case based on your profile and current processing trends.
                                        </p>
                                        <CaseTimeline timeline={timelineData} />
                                    </>
                                )}
                           </div>
                        </CollapsibleContent>
                    </CardContent>
                </Collapsible>
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
