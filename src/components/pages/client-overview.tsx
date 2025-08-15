
'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, FileText, MessageSquare, Search, Sparkles, Loader2, AlertTriangle, Handshake, Check, X, User, Calendar, Target, TrendingUp, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCaseTimeline, type CaseTimelineOutput } from "@/ai/flows/case-timeline-flow";
import { CaseTimeline } from "@/components/case-timeline";
import { useGlobalData } from "@/context/GlobalDataContext";
import type { Client, TeamMember, ApplicationStatus } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ApplicationProgress } from "@/components/application-progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    const connectedLawyer = client?.connectedLawyerId 
        ? teamMembers.find(m => m.id === client.connectedLawyerId) 
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
                    const response = await getCaseTimeline(inputData);
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

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'In Review': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Awaiting Decision': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: ApplicationStatus) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="h-4 w-4" />;
            case 'Rejected': return <X className="h-4 w-4" />;
            case 'In Review': return <Clock className="h-4 w-4" />;
            case 'Pending Review': return <AlertCircle className="h-4 w-4" />;
            case 'Awaiting Decision': return <Target className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };
    
    if (loading || !client || client.authRole !== 'client') {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Welcome Banner */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-[#36d1c4] to-[#29b6f6]">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Welcome back, {client.name}! 👋
                            </h1>
                            <p className="text-gray-600 mb-4">
                                Here's the latest update on your immigration application journey.
                            </p>
                            <div className="flex items-center gap-4">
                                <Badge className={`${getStatusColor(client.caseSummary.currentStatus)} border`}>
                                    <span className="flex items-center gap-1">
                                        {getStatusIcon(client.caseSummary.currentStatus)}
                                        {client.caseSummary.currentStatus}
                                    </span>
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    {client.caseSummary.caseType} • {client.countryOfOrigin}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Next Step</p>
                            <p className="font-medium text-gray-900">{client.caseSummary.nextStep}</p>
                            {client.caseSummary.dueDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Due: {new Date(client.caseSummary.dueDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Connection Request */}
            {connectionRequestLawyer && (
                <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardHeader className="flex-row items-center gap-4 pb-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={connectionRequestLawyer.avatar} />
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <Handshake className="h-5 w-5" />
                                New Connection Request
                            </CardTitle>
                            <CardDescription className="text-blue-700">
                                {connectionRequestLawyer.name} wants to connect with you to help with your immigration case.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex gap-3">
                            <Button 
                                onClick={handleAcceptRequest}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Accept Request
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleDeclineRequest}
                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Decline
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Connected Lawyer Info */}
            {connectedLawyer && (
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-green-600" />
                            Your Legal Team
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={connectedLawyer.avatar} />
                                <AvatarFallback>{connectedLawyer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{connectedLawyer.name}</h3>
                                <p className="text-muted-foreground">{connectedLawyer.role}</p>
                                <p className="text-sm text-muted-foreground">
                                    {connectedLawyer.specialties.join(', ')}
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => setPage('messages')}
                                className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Application Progress - Full Length */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Application Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ApplicationProgress currentStatus={client.caseSummary.currentStatus} />
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-lg">
                            <span>Current Stage</span>
                            <span className="font-medium">{client.caseSummary.currentStatus}</span>
                        </div>
                        <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-lg">
                            <span>Priority</span>
                            <span className="font-medium">{client.caseSummary.priority}</span>
                        </div>
                        <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-lg">
                            <span>Case Type</span>
                            <span className="font-medium">{client.caseSummary.caseType}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-12"
                                onClick={() => setPage('documents')}
                            >
                                <FileText className="mr-3 h-4 w-4" />
                                View Documents
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-12"
                                onClick={() => setPage('messages')}
                            >
                                <MessageSquare className="mr-3 h-4 w-4" />
                                Message Lawyer
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-12"
                                onClick={() => setPage('ai-assist')}
                            >
                                <Sparkles className="mr-3 h-4 w-4" />
                                AI Assistant
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-12"
                                onClick={() => setPage('appointments')}
                            >
                                <Calendar className="mr-3 h-4 w-4" />
                                Schedule Meeting
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {client.activity.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{activity.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(activity.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Timeline - Collapsible Drawer */}
            <Collapsible open={isTimelineVisible} onOpenChange={setIsTimelineVisible}>
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-green-600" />
                                    <CardTitle>Your Immigration Journey Timeline</CardTitle>
                                </div>
                                <Button variant="ghost" size="sm">
                                    {isTimelineVisible ? 'Hide Timeline' : 'Show Timeline'}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CardDescription>
                            AI-powered timeline showing your personalized immigration journey and next steps.
                        </CardDescription>
                    </CardHeader>
                    <CollapsibleContent>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-40">
                                    <div className="text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                        <p className="text-muted-foreground">Generating your timeline...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-muted-foreground">{error}</p>
                                    <Button 
                                        variant="outline" 
                                        className="mt-4"
                                        onClick={() => window.location.reload()}
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            ) : timelineData ? (
                                <Tabs defaultValue="timeline" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                                        <TabsTrigger value="progress">Progress View</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="timeline" className="mt-6">
                                        <CaseTimeline timeline={timelineData} />
                                    </TabsContent>
                                    <TabsContent value="progress" className="mt-6">
                                        <div className="space-y-4">
                                            {timelineData.map((stage, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                        stage.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        {stage.status === 'Completed' ? <Check className="h-4 w-4" /> : index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{stage.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                                                        {stage.estimatedDuration && (
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Estimated: {stage.estimatedDuration}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {stage.status === 'Completed' && (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                            Completed
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            ) : null}
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        </div>
    );
}
