'use client';
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Upload, Eye, Edit, Trash2, FileText, AlertTriangle } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalData } from "@/context/GlobalDataContext";
import type { Client } from '@/lib/data';

// For this demo, we'll hardcode the client ID to 5 (James Wilson) to simulate a logged-in user
const CURRENT_CLIENT_ID = 5;

type DocumentStatus = 'Approved' | 'Uploaded' | 'Pending Review' | 'Requested' | 'Rejected';
type ClientDocument = { id: number; title: string; status: DocumentStatus; date: string; category: string; };

const getStatusBadgeVariant = (status: DocumentStatus) => {
    switch (status) {
        case 'Approved': return 'success' as const;
        case 'Uploaded': return 'info' as const;
        case 'Pending Review': return 'secondary' as const;
        case 'Requested': return 'warning' as const;
        case 'Rejected': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

export function MyDocumentsPage() {
    const { toast } = useToast();
    const { clients, updateClient } = useGlobalData();

    const client = clients.find(c => c.id === CURRENT_CLIENT_ID);
    const [documents, setDocuments] = useState<ClientDocument[]>([]);

    useEffect(() => {
        if (client) {
            const clientDocs = (client.documents || []).map(doc => ({ ...doc, date: doc.dateAdded }));
            setDocuments(clientDocs);
        }
    }, [client]);

    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<ClientDocument | null>(null);
    const [editedTitle, setEditedTitle] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadTargetDocId, setUploadTargetDocId] = useState<number | null>(null);

    const handleUploadClick = (docId: number) => {
        setUploadTargetDocId(docId);
        fileInputRef.current?.click();
    };
    
    const updateClientDocuments = (newDocs: Client['documents']) => {
        if (client) {
            updateClient({ ...client, documents: newDocs });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && uploadTargetDocId !== null) {
            toast({
                title: 'File Selected',
                description: `${event.target.files[0].name} is ready for upload.`,
            });
            const updatedDocs = (client?.documents || []).map(doc => 
                doc.id === uploadTargetDocId 
                ? { ...doc, status: 'Uploaded' as const, dateAdded: new Date().toISOString().split('T')[0] } 
                : doc
            );
            updateClientDocuments(updatedDocs);
        }
        setUploadTargetDocId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleEditClick = (doc: ClientDocument) => {
        setSelectedDocument(doc);
        setEditedTitle(doc.title);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (selectedDocument && editedTitle.trim()) {
            const updatedDocs = (client?.documents || []).map(doc =>
                doc.id === selectedDocument.id ? { ...doc, title: editedTitle } : doc
            );
            updateClientDocuments(updatedDocs);
            toast({ title: 'Success', description: 'Document title updated.' });
            setEditDialogOpen(false);
            setSelectedDocument(null);
        }
    };

    const handleDeleteClick = (doc: ClientDocument) => {
        setSelectedDocument(doc);
        setDeleteAlertOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedDocument) {
            const updatedDocs = (client?.documents || []).filter(doc => doc.id !== selectedDocument.id);
            updateClientDocuments(updatedDocs);
            toast({ title: 'Success', description: 'Document deleted.' });
            setDeleteAlertOpen(false);
            setSelectedDocument(null);
        }
    };

    if (!client) {
        return <Card><CardContent className="p-6">Error: Client data not found.</CardContent></Card>;
    }

    return (
        <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Card>
                <CardHeader>
                    <CardTitle>My Documents</CardTitle>
                    <CardDescription>Manage and track your application documents. Please upload all requested items.</CardDescription>
                </CardHeader>
                <CardContent>
                    {documents.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map(doc => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.title}</TableCell>
                                        <TableCell><Badge variant="outline">{doc.category}</Badge></TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                                        </TableCell>
                                        <TableCell suppressHydrationWarning>{format(new Date(doc.date), 'PP')}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            {doc.status === 'Requested' && <Button size="sm" onClick={() => handleUploadClick(doc.id)}><Upload className="mr-2 h-4 w-4" />Upload</Button>}
                                            {doc.status === 'Rejected' && <Button size="sm" variant="destructive" onClick={() => handleUploadClick(doc.id)}><Upload className="mr-2 h-4 w-4" />Re-upload</Button>}
                                            {doc.status !== 'Requested' && doc.status !== 'Rejected' && <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>}
                                            {doc.status !== 'Approved' && doc.status !== 'Requested' && (
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(doc)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                             <FileText className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">No Documents Found</h3>
                            <p>You have no documents requested or uploaded at this time.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the document "{selectedDocument?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedDocument(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
