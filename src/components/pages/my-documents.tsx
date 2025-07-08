
'use client';
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Upload, Eye, Download, FileText, Sparkles, MessageSquare, Send, X, CheckCheck, FilePlus2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useGlobalData } from "@/context/GlobalDataContext";
import type { Client, ClientDocument } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { documentCategories } from "@/lib/data";

const getStatusBadgeVariant = (status: ClientDocument['status']) => {
    switch (status) {
        case 'Approved': return 'success' as const;
        case 'Uploaded': return 'info' as const;
        case 'Pending Review': return 'secondary' as const;
        case 'Pending Client Review': return 'info' as const;
        case 'Requested': return 'warning' as const;
        case 'Rejected': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

const DocumentItem = ({ doc, onSelect, isSelected }: { doc: ClientDocument, onSelect: () => void, isSelected: boolean }) => {
    const { toast } = useToast();
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    return (
        <>
            <div
                onClick={onSelect}
                className={cn(
                    "flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all",
                    isSelected ? "bg-muted ring-2 ring-primary" : "hover:bg-muted/50"
                )}
            >
                <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                    <p className="font-semibold">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                        {doc.isAiFilled && (
                            <Badge variant="outline" className="text-primary border-primary/50">
                                <Sparkles className="h-3 w-3 mr-1.5" />
                                AI Pre-filled
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {(doc.status === 'Uploaded' || doc.status === 'Pending Review' || doc.status === 'Approved' || doc.status === 'Pending Client Review') && (
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setIsEditorOpen(true); }}><Eye className="h-4 w-4" /></Button>
                    )}
                    {doc.status !== 'Requested' && <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toast({ title: "Downloading...", description: `${doc.title}.pdf` })}}><Download className="h-4 w-4" /></Button>}
                    {doc.status === 'Requested' && <Button size="sm"><Upload className="mr-2 h-4 w-4" />Upload</Button>}
                </div>
            </div>
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="max-w-4xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Viewing: {doc.title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                        <p>Online document editor/viewer placeholder.</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function MyDocumentsPage() {
    const { userProfile, updateClient } = useGlobalData();
    const client = userProfile as Client; // We know this page is for clients
    const { toast } = useToast();
    
    const [selectedDocument, setSelectedDocument] = useState<ClientDocument | null>(null);
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState('');
    const [newDocType, setNewDocType] = useState<'form' | 'supporting'>('supporting');
    const [newDocCategory, setNewDocCategory] = useState('');

    useEffect(() => {
        if (client?.documents && client.documents.length > 0) {
            setSelectedDocument(client.documents[0]);
        }
    }, [client]);

    const handleUploadDocument = () => {
        if (!client || !newDocTitle || !newDocCategory) {
            toast({ title: "Error", description: "Title and category are required.", variant: 'destructive' });
            return;
        }

        const newDocument: ClientDocument = {
            id: Date.now(),
            title: newDocTitle,
            category: newDocCategory,
            type: newDocType,
            status: 'Uploaded',
            dateAdded: new Date().toISOString().split('T')[0],
        };

        const updatedClient: Client = {
            ...client,
            documents: [...(client.documents || []), newDocument]
        };
        updateClient(updatedClient);
        setUploadDialogOpen(false);
        setNewDocTitle('');
        setNewDocCategory('');
        toast({ title: "Document Uploaded", description: `"${newDocTitle}" has been added to your documents.` });
    };

    if (!client) {
        return <Card><CardContent className="p-6">Loading client data...</CardContent></Card>;
    }

    const officialForms = client.documents?.filter(d => d.type === 'form') || [];
    const supportingDocs = client.documents?.filter(d => d.type === 'supporting') || [];

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>My Documents</CardTitle>
                                    <CardDescription>Manage and track your application documents.</CardDescription>
                                </div>
                                <Button onClick={() => setUploadDialogOpen(true)}>
                                    <FilePlus2 className="mr-2 h-4 w-4" />
                                    Upload Ad-hoc Document
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="forms">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="forms">Official Forms</TabsTrigger>
                                    <TabsTrigger value="supporting">Supporting Documents</TabsTrigger>
                                </TabsList>
                                <TabsContent value="forms" className="mt-4 space-y-3">
                                    {officialForms.map(doc => (
                                        <DocumentItem key={doc.id} doc={doc} onSelect={() => setSelectedDocument(doc)} isSelected={selectedDocument?.id === doc.id} />
                                    ))}
                                </TabsContent>
                                <TabsContent value="supporting" className="mt-4 space-y-3">
                                    {supportingDocs.map(doc => (
                                        <DocumentItem key={doc.id} doc={doc} onSelect={() => setSelectedDocument(doc)} isSelected={selectedDocument?.id === doc.id} />
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-20 h-[calc(100vh-11rem)] flex flex-col">
                        <CardHeader className="flex-row items-center gap-2 border-b">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle className="text-lg">Comments</CardTitle>
                                <CardDescription className="truncate max-w-xs">{selectedDocument?.title || "Select a document"}</CardDescription>
                            </div>
                        </CardHeader>
                        {selectedDocument ? (
                            <>
                                <ScrollArea className="flex-1 p-4 bg-muted/20">
                                    <div className="space-y-4">
                                        {(selectedDocument.comments || []).map((comment) => (
                                            <div
                                                key={comment.id}
                                                className={cn(
                                                    'flex items-end gap-2 max-w-[90%]',
                                                    comment.author === client.name ? 'ml-auto flex-row-reverse' : 'mr-auto'
                                                )}
                                            >
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={comment.avatar} />
                                                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className={cn('p-2 rounded-lg',
                                                    comment.author === client.name
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-background border'
                                                )}>
                                                    <p className="text-sm">{comment.text}</p>
                                                    <div className={cn("flex items-center justify-end gap-1 text-xs mt-1",
                                                        comment.author === client.name ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                                    )}>
                                                        <span>{comment.timestamp}</span>
                                                        {comment.author === client.name && <CheckCheck className="h-3 w-3" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <CardContent className="p-4 border-t">
                                    <div className="relative">
                                        <Input placeholder="Type a comment..." className="pr-10" />
                                        <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                                <p>Select a document to view comments.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload a New Document</DialogTitle>
                        <DialogDescription>Add a document that was not requested by your lawyer.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-doc-title">Document Title</Label>
                            <Input id="new-doc-title" value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)} placeholder="e.g., Reference Letter" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-doc-category">Category</Label>
                            <Select value={newDocCategory} onValueChange={setNewDocCategory}>
                                <SelectTrigger id="new-doc-category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                                <SelectContent>{documentCategories.map(cat => (cat.name !== 'All Documents' && <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-doc-type">Type</Label>
                            <Select value={newDocType} onValueChange={(v: 'form' | 'supporting') => setNewDocType(v)}>
                                <SelectTrigger id="new-doc-type"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="supporting">Supporting Document</SelectItem>
                                    <SelectItem value="form">Official Form</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-doc-file">File</Label>
                            <Input id="new-doc-file" type="file" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUploadDocument}><Upload className="mr-2 h-4 w-4" />Upload Document</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
