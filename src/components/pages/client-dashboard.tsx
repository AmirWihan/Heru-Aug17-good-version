
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

export function ClientDashboard() {
    const { toast } = useToast();
    const [connectedLawyers, setConnectedLawyers] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState("find-lawyer");
    
    // Use a mock client for demonstration purposes
    const client = clients[0];

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
                        onClick={() => setActiveTab('documents')}>
                        View My Documents <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="find-lawyer">
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
