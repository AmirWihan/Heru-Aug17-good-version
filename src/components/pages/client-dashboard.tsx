
'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { teamMembers, clients } from "@/lib/data";
import { ArrowRight, CheckCircle, FileText, MessageSquare, Search, UserCheck, FileStack, ClipboardList, CheckCircle2, ChevronRight, Users } from "lucide-react";
import { LawyerProfileCard } from "@/components/lawyer-profile-card";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const applicationStages = [
    { name: 'Profile Complete', icon: UserCheck, statuses: ['New'] },
    { name: 'Document Collection', icon: FileStack, statuses: ['Awaiting Documents', 'Additional Info Requested'] },
    { name: 'IRCC Review', icon: ClipboardList, statuses: ['Under Review', 'Pending Review', 'Submitted'] },
    { name: 'Decision Made', icon: CheckCircle2, statuses: ['Approved', 'Closed', 'Rejected'] }
];

export function ClientDashboard() {
    const { toast } = useToast();
    const [connectedLawyers, setConnectedLawyers] = useState<number[]>([]);
    
    // Use a mock client for demonstration purposes
    const client = clients[0];

    const currentStageIndex = applicationStages.findIndex(stage => stage.statuses.includes(client.caseSummary.currentStatus));

    const handleConnect = (lawyerId: number) => {
        if (!connectedLawyers.includes(lawyerId)) {
            setConnectedLawyers([...connectedLawyers, lawyerId]);
            toast({ title: "Successfully Connected!", description: `You are now connected with ${teamMembers.find(l => l.id === lawyerId)?.name}.` });
        }
    };
    
    const clientDocuments = [
        { id: 1, title: 'Passport Scan', status: 'Approved', date: '2023-05-20' },
        { id: 2, title: 'IELTS Score Report', status: 'Uploaded', date: '2023-06-10' },
        { id: 3, title: 'Proof of Funds', status: 'Requested', date: '2023-06-15' },
    ];

    return (
        <div className="space-y-6">
             <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 p-6">
                    <CardTitle className="font-headline">Welcome, {client.name}!</CardTitle>
                    <CardDescription>Here's a summary of your immigration application progress.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-4">Application Progress</h3>
                        <div className="flex justify-between items-center">
                            {applicationStages.map((stage, index) => {
                                const isCompleted = index < currentStageIndex;
                                const isCurrent = index === currentStageIndex;
                                const isUpcoming = index > currentStageIndex;
                                
                                return (
                                    <React.Fragment key={stage.name}>
                                        <div className="flex flex-col items-center text-center">
                                            <div className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors",
                                                isCompleted ? "bg-primary border-primary text-primary-foreground" : "",
                                                isCurrent ? "bg-primary/10 border-primary text-primary animate-pulse" : "",
                                                isUpcoming ? "bg-muted border-border text-muted-foreground" : ""
                                            )}>
                                                <stage.icon className="w-6 h-6" />
                                            </div>
                                            <p className={cn(
                                                "text-xs mt-2 font-medium w-24",
                                                isCurrent ? "text-primary" : "text-muted-foreground"
                                            )}>{stage.name}</p>
                                        </div>
                                        {index < applicationStages.length - 1 && <div className="flex-1 h-0.5 bg-border -mx-2 mb-8" />}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                    <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Status: <Badge variant={
                                client.caseSummary.currentStatus === 'Approved' ? 'success' :
                                client.caseSummary.currentStatus === 'Awaiting Documents' ? 'warning' : 'info'
                            }>{client.caseSummary.currentStatus}</Badge></p>
                            <p className="font-semibold mt-1">Next Step: {client.caseSummary.nextStep}</p>
                        </div>
                        <Button>
                            Upload Documents <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="find-lawyer">
                <TabsList>
                    <TabsTrigger value="find-lawyer">Find a Lawyer</TabsTrigger>
                    <TabsTrigger value="my-lawyers">My Lawyers</TabsTrigger>
                    <TabsTrigger value="documents">My Documents</TabsTrigger>
                </TabsList>
                <TabsContent value="find-lawyer" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Find an Immigration Professional</CardTitle>
                            <CardDescription>Browse and connect with experienced lawyers and consultants.</CardDescription>
                            <div className="relative pt-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by name or specialty..." className="pl-10" />
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamMembers.map(lawyer => (
                                <LawyerProfileCard key={lawyer.id} lawyer={lawyer} onConnect={handleConnect} />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="my-lawyers" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>My Connected Lawyers</CardTitle>
                             <CardDescription>Your dedicated legal team. Ready to help.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {connectedLawyers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teamMembers.filter(l => connectedLawyers.includes(l.id)).map(lawyer => (
                                    <LawyerProfileCard key={lawyer.id} lawyer={lawyer} onConnect={handleConnect} />
                                ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Users className="mx-auto h-12 w-12 mb-4" />
                                    <p className="font-semibold">You haven't connected with any lawyers yet.</p>
                                    <p className="text-sm">Go to the "Find a Lawyer" tab to get started.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="documents" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>My Documents</CardTitle>
                            <CardDescription>Manage and track your application documents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientDocuments.map(doc => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">{doc.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={doc.status === 'Approved' ? 'success' : doc.status === 'Requested' ? 'warning' : 'secondary'}>{doc.status}</Badge>
                                            </TableCell>
                                            <TableCell>{format(new Date(doc.date), 'PP')}</TableCell>
                                            <TableCell className="text-right">
                                                {doc.status === 'Requested' && <Button size="sm">Upload</Button>}
                                                {doc.status !== 'Requested' && <Button size="sm" variant="outline">View</Button>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
