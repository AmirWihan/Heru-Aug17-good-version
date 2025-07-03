'use client';
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Client } from "@/lib/data";
import { CalendarCheck, FileText, MessageSquare, X, Download, Eye, Upload } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const activityIcons: { [key: string]: React.ElementType } = {
    "Application Submitted": FileText,
    "New Message": MessageSquare,
    "Appointment Completed": CalendarCheck,
    "Email Sent": MessageSquare,
};

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active client': return 'success';
        case 'work permit': return 'info';
        case 'pending review': return 'warning';
        case 'high': return 'destructive';
        default: return 'secondary';
    }
};

const getDocumentStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'approved': return 'success' as const;
        case 'uploaded': return 'info' as const;
        case 'pending review': return 'warning' as const;
        case 'rejected': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};


interface ClientDetailSheetProps {
    client: Client;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onUpdateClient: (updatedClient: Client) => void;
}

export function ClientDetailSheet({ client, isOpen, onOpenChange, onUpdateClient }: ClientDetailSheetProps) {
    const { toast } = useToast();
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState("");
    const [newDocCategory, setNewDocCategory] = useState("");

    const communications = client.activity.filter(item => item.title.includes("Message") || item.title.includes("Email"));

    const handleUpload = () => {
        if (!newDocTitle || !newDocCategory) {
            toast({ title: 'Error', description: 'Please fill out all fields.', variant: 'destructive' });
            return;
        }

        const newDocument = {
            id: Date.now(),
            title: newDocTitle,
            category: newDocCategory,
            dateAdded: new Date().toISOString().split('T')[0],
            status: 'Uploaded' as const,
        };

        const updatedClient = {
            ...client,
            documents: [...(client.documents || []), newDocument],
        };

        onUpdateClient(updatedClient);
        setUploadDialogOpen(false);
        setNewDocTitle("");
        setNewDocCategory("");
        toast({ title: 'Success', description: 'Document uploaded successfully.' });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-3xl p-0">
                <SheetHeader className="p-6 border-b">
                    <div className="flex justify-between items-start">
                         <SheetTitle className="text-2xl font-bold">Client Details</SheetTitle>
                         <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>
                <div className="p-6 overflow-y-auto h-[calc(100vh-73px)]">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                            <AvatarImage src={client.avatar} alt={client.name} />
                            <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <h2 className="text-2xl font-bold">{client.name}</h2>
                                <Badge variant={getStatusBadgeVariant('active client')}>Active Client</Badge>
                                <Badge variant={getStatusBadgeVariant('work permit')}>{client.caseType}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{client.email} • {client.phone}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Country of Origin</p>
                                    <p className="font-medium">{client.countryOfOrigin}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Current Location</p>
                                    <p className="font-medium">{client.currentLocation}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Joined</p>
                                    <p className="font-medium">{format(new Date(client.joined), 'PP')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="mt-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="communications">Communications</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Case Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Priority</p>
                                            <p className="font-bold text-base">{client.caseSummary.priority}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Case Type</p>
                                            <p className="font-semibold">{client.caseSummary.caseType}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Current Status</p>
                                            <Badge variant={getStatusBadgeVariant(client.caseSummary.currentStatus)}>{client.caseSummary.currentStatus}</Badge>
                                        </div>
                                         <div>
                                            <p className="text-muted-foreground">Next Step</p>
                                            <p className="font-semibold">{client.caseSummary.nextStep}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Due Date</p>
                                            <p className="font-semibold">{client.caseSummary.dueDate}</p>
                                        </div>
                                        <Button className="w-full">View Full Application</Button>
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2">
                                     <CardHeader>
                                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {client.activity.slice(0,3).map((item, index) => {
                                                const Icon = activityIcons[item.title] || FileText;
                                                return (
                                                    <div key={index} className="flex items-start gap-4">
                                                        <div className="bg-muted p-3 rounded-full">
                                                            <Icon className="h-5 w-5 text-primary"/>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <p className="font-semibold">{item.title}</p>
                                                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                            <Button variant="link" className="p-0 h-auto text-sm">
                                                                View {item.title.split(' ')[0]}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Button variant="outline" className="w-full mt-6">View All Activity</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                         <TabsContent value="documents" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg">Client Documents</CardTitle>
                                            <CardDescription>All documents uploaded by or for the client.</CardDescription>
                                        </div>
                                        <Button onClick={() => setUploadDialogOpen(true)}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload Document
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {client.documents && client.documents.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Document Title</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Date Added</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {client.documents.map((doc) => (
                                                    <TableRow key={doc.id}>
                                                        <TableCell className="font-medium">{doc.title}</TableCell>
                                                        <TableCell>{doc.category}</TableCell>
                                                        <TableCell>{format(new Date(doc.dateAdded), 'PP')}</TableCell>
                                                        <TableCell><Badge variant={getDocumentStatusBadgeVariant(doc.status)}>{doc.status}</Badge></TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                            <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FileText className="mx-auto h-8 w-8 mb-2" />
                                            <p>No documents uploaded yet.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="timeline" className="mt-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Case Timeline</CardTitle>
                                    <CardDescription>A chronological history of all activities related to this case.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative pl-6 before:absolute before:inset-y-0 before:w-px before:bg-border before:left-0">
                                        {client.activity.map((item, index) => {
                                            const Icon = activityIcons[item.title] || FileText;
                                            return (
                                                <div key={index} className="relative pl-8 py-4 first:pt-0 last:pb-0">
                                                    <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background flex items-center justify-center">
                                                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                                            <Icon className="h-3 w-3 text-primary" />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className="font-medium">{item.title}</h4>
                                                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="communications" className="mt-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Communication Log</CardTitle>
                                    <CardDescription>A record of all messages and emails with the client.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {communications.length > 0 ? (
                                        communications.map((item, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                                                <div className="bg-muted p-3 rounded-full">
                                                    <MessageSquare className="h-5 w-5 text-primary"/>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-semibold">{item.title}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                                            <p>No communications logged yet.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                            <DialogDescription>Add a new document to {client.name}'s profile.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="doc-title">Document Title</Label>
                                <Input id="doc-title" value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} placeholder="e.g., Passport Bio Page" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doc-category">Category</Label>
                                <Select value={newDocCategory} onValueChange={setNewDocCategory}>
                                    <SelectTrigger id="doc-category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {documentCategories.filter(c => c.name !== 'All Documents').map(cat => (
                                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doc-file">File</Label>
                                <Input id="doc-file" type="file" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpload}>Upload</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SheetContent>
        </Sheet>
    );
}
