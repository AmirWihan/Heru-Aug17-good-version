'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { clients } from "@/lib/data";
import { ArrowRight, CheckCircle, FileText, MessageSquare, Search, UserCheck, FileStack, ClipboardList, CheckCircle2, ChevronRight, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const applicationSteps = [
    { name: 'Profile Created', icon: UserCheck, status: 'complete' },
    { name: 'Documents Uploaded', icon: FileStack, status: 'complete' },
    { name: 'IRCC Review', icon: ClipboardList, status: 'active' },
    { name: 'Biometrics', icon: CheckCircle2, status: 'incomplete' },
    { name: 'Decision', icon: CheckCircle, status: 'incomplete' },
];

export function ClientOverviewPage({ setPage }: { setPage: (page: string) => void }) {
    const { toast } = useToast();
    
    const client = clients[0];

    const activeStepIndex = applicationSteps.findIndex(step => step.status === 'active');
    const progressPercentage = (applicationSteps.filter(s => s.status === 'complete').length / (applicationSteps.length -1)) * 100;

    return (
        <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground shadow-lg">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">Welcome, {client.name}! 👋</h2>
                        <p className="text-primary-foreground/80 mt-1">
                            Your application status is currently: <span className="font-bold">{client.caseSummary.currentStatus}</span>.
                            <br/>
                            Next Step: <span className="font-bold">{client.caseSummary.nextStep}</span>.
                        </p>
                    </div>
                    <Button 
                        className="bg-white text-primary hover:bg-white/90 w-full md:w-auto"
                        onClick={() => setPage('documents')}>
                        View My Documents <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Application Progress</CardTitle>
                    <CardDescription>Track your immigration journey from start to finish.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                    <div className="flex justify-between">
                        {applicationSteps.map((step, index) => (
                            <div key={step.name} className="flex flex-col items-center w-1/5">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center border-2",
                                    step.status === 'complete' && "bg-primary border-primary text-primary-foreground",
                                    step.status === 'active' && "bg-accent border-accent text-accent-foreground animate-pulse",
                                    step.status === 'incomplete' && "bg-muted border-border text-muted-foreground"
                                )}>
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <p className={cn(
                                    "text-xs text-center mt-2",
                                    step.status === 'active' ? "font-bold text-accent-foreground" : "text-muted-foreground"
                                )}>{step.name}</p>
                            </div>
                        ))}
                    </div>
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
                        <Button variant="outline" className="w-full justify-start" onClick={() => setPage('find-lawyer')}><Search className="mr-2 h-4 w-4"/> Find a New Lawyer</Button>
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
