'use client';
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Eye, Download, FileText, Sparkles, MessageSquare, Send, X, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useGlobalData } from "@/context/GlobalDataContext";
import type { Client, ClientDocument } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

// For this demo, we'll hardcode the client ID to 5 (James Wilson) to simulate a logged-in user
const CURRENT_CLIENT_ID = 5;

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
                        <Button variant="ghost" size="icon" onClick={() => setIsEditorOpen(true)}><Eye className="h-4 w-4" /></Button>
                    )}
                    {doc.status !== 'Requested' && <Button variant="ghost" size="icon" onClick={() => toast({ title: "Downloading...", description: `${doc.title}.pdf` })}><Download className="h-4 w-4" /></Button>}
                    {doc.status === 'Requested' && <Button size="sm"><Upload className="mr-2 h-4 w-4" />Upload</Button>}
                </div>
            </div>
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="max-w-4xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Editing: {doc.title}</DialogTitle>
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
    const { clients } = useGlobalData();
    const client = clients.find(c => c.id === CURRENT_CLIENT_ID);
    
    const [selectedDocument, setSelectedDocument] = useState<ClientDocument | null>(null);

    useEffect(() => {
        if (client?.documents && client.documents.length > 0) {
            setSelectedDocument(client.documents[0]);
        }
    }, [client]);

    if (!client) {
        return <Card><CardContent className="p-6">Error: Client data not found.</CardContent></Card>;
    }

    const officialForms = client.documents?.filter(d => d.type === 'form') || [];
    const supportingDocs = client.documents?.filter(d => d.type === 'supporting') || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>My Documents</CardTitle>
                        <CardDescription>Manage and track your application documents.</CardDescription>
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
    );
}
