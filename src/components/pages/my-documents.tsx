'use client';
import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Upload, Eye, Edit, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialClientDocuments = [
    { id: 1, title: 'Passport Scan', status: 'Approved' as const, date: '2023-05-20', category: 'Identification' },
    { id: 2, title: 'IELTS Score Report', status: 'Uploaded' as const, date: '2023-06-10', category: 'Language' },
    { id: 3, title: 'Proof of Funds', status: 'Requested' as const, date: '2023-06-15', category: 'Financial' },
    { id: 4, title: 'Educational Credential Assessment (ECA)', status: 'Requested' as const, date: '2023-06-15', category: 'Education' },
    { id: 5, title: 'Job Offer Letter', status: 'Rejected' as const, date: '2023-06-18', category: 'Employment' },
];

type DocumentStatus = 'Approved' | 'Uploaded' | 'Requested' | 'Rejected';
type ClientDocument = { id: number; title: string; status: DocumentStatus; date: string; category: string; };

const getStatusBadgeVariant = (status: DocumentStatus) => {
    switch (status) {
        case 'Approved': return 'success' as const;
        case 'Uploaded': return 'info' as const;
        case 'Requested': return 'warning' as const;
        case 'Rejected': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

export function MyDocumentsPage() {
    const { toast } = useToast();
    const [documents, setDocuments] = useState<ClientDocument[]>(initialClientDocuments);
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && uploadTargetDocId !== null) {
            toast({
                title: 'File Selected',
                description: `${event.target.files[0].name} is ready for upload.`,
            });
            const updatedDocs = documents.map(doc => doc.id === uploadTargetDocId ? {...doc, status: 'Uploaded' as const, date: new Date().toISOString().split('T')[0]} : doc);
            setDocuments(updatedDocs);
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
            setDocuments(documents.map(doc =>
                doc.id === selectedDocument.id ? { ...doc, title: editedTitle } : doc
            ));
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
            setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
            toast({ title: 'Success', description: 'Document deleted.' });
            setDeleteAlertOpen(false);
            setSelectedDocument(null);
        }
    };

    return (
        <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Card>
                <CardHeader>
                    <CardTitle>My Documents</CardTitle>
                    <CardDescription>Manage and track your application documents. Please upload all requested items.</CardDescription>
                </CardHeader>
                <CardContent>
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
                                    <TableCell>{format(new Date(doc.date), 'PP')}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        {doc.status === 'Requested' && <Button size="sm" onClick={() => handleUploadClick(doc.id)}><Upload className="mr-2 h-4 w-4" />Upload</Button>}
                                        {doc.status === 'Rejected' && <Button size="sm" variant="destructive" onClick={() => handleUploadClick(doc.id)}><Upload className="mr-2 h-4 w-4" />Re-upload</Button>}
                                        {doc.status !== 'Requested' && doc.status !== 'Rejected' && <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>}
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(doc)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(doc)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                        <DialogDescription>
                            Make changes to your document details here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <Label htmlFor="doc-title">Document Title</Label>
                        <Input id="doc-title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Delete Alert Dialog */}
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