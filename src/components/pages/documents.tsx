
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentCategories, documents as allDocumentTemplates, clients, type DocumentTemplate } from "@/lib/data";
import { FileText, PlusCircle, UserPlus, FilePlus2, Edit, Trash2 } from "lucide-react";
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

export function DocumentsPage() {
    const { clients, updateClient } = useGlobalData();
    const { toast } = useToast();

    const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>(allDocumentTemplates);
    const [activeCategory, setActiveCategory] = useState('Permanent Residency');
    
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

    const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
    const [deletingTemplate, setDeletingTemplate] = useState<DocumentTemplate | null>(null);
    const [selectedClient, setSelectedClient] = useState('');

    const [newTemplateTitle, setNewTemplateTitle] = useState('');
    const [newTemplateDescription, setNewTemplateDescription] = useState('');
    const [newTemplateCategory, setNewTemplateCategory] = useState('');

    const filteredDocuments = documentTemplates.filter(doc => doc.category === activeCategory);

    const handleAssignCategory = () => {
        if (!selectedClient) {
            toast({ title: 'Error', description: 'Please select a client.', variant: 'destructive' });
            return;
        }

        const clientToUpdate = clients.find(c => c.id.toString() === selectedClient);
        if (!clientToUpdate) {
            toast({ title: 'Error', description: 'Client not found.', variant: 'destructive' });
            return;
        }

        const newDocsForClient = filteredDocuments
            .filter(template => !clientToUpdate.documents.some(d => d.title === template.title))
            .map(template => ({
                id: Date.now() + Math.random(),
                title: template.title,
                category: template.category,
                dateAdded: new Date().toISOString().split('T')[0],
                status: 'Requested' as const,
            }));
        
        if (newDocsForClient.length === 0) {
            toast({ title: 'No new documents to assign.', description: `All documents in the "${activeCategory}" category are already assigned to ${clientToUpdate.name}.` });
            return;
        }

        const updatedClient = {
            ...clientToUpdate,
            documents: [...clientToUpdate.documents, ...newDocsForClient],
        };

        updateClient(updatedClient);
        setAssignModalOpen(false);
        setSelectedClient('');
        toast({ title: 'Success', description: `${newDocsForClient.length} document(s) from "${activeCategory}" have been requested from ${clientToUpdate.name}.` });
    };

    const handleSaveTemplate = () => {
        if (!newTemplateTitle || !newTemplateCategory) {
            toast({ title: 'Error', description: 'Title and category are required.', variant: 'destructive' });
            return;
        }

        if (editingTemplate) {
            // Update existing template
            setDocumentTemplates(documentTemplates.map(t => t.id === editingTemplate.id ? { ...t, title: newTemplateTitle, description: newTemplateDescription, category: newTemplateCategory } : t));
            toast({ title: 'Template Updated', description: `"${newTemplateTitle}" has been updated.` });
        } else {
            // Create new template
            const newTemplate = {
                id: Date.now(),
                title: newTemplateTitle,
                description: newTemplateDescription,
                category: newTemplateCategory,
                format: 'PDF',
                size: 'Template',
            };
            setDocumentTemplates([...documentTemplates, newTemplate]);
            toast({ title: 'Template Created', description: `"${newTemplate.title}" has been added.` });
        }
        
        setTemplateModalOpen(false);
        setEditingTemplate(null);
        setNewTemplateTitle('');
        setNewTemplateDescription('');
        setNewTemplateCategory('');
    };

    const handleOpenNewTemplateDialog = () => {
        setEditingTemplate(null);
        setNewTemplateTitle('');
        setNewTemplateDescription('');
        setNewTemplateCategory(activeCategory);
        setTemplateModalOpen(true);
    };

    const handleOpenEditTemplateDialog = (template: DocumentTemplate) => {
        setEditingTemplate(template);
        setNewTemplateTitle(template.title);
        setNewTemplateDescription(template.description);
        setNewTemplateCategory(template.category);
        setTemplateModalOpen(true);
    };

    const handleDeleteTemplate = (template: DocumentTemplate) => {
        setDeletingTemplate(template);
        setDeleteAlertOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingTemplate) {
            setDocumentTemplates(documentTemplates.filter(t => t.id !== deletingTemplate.id));
            toast({ title: 'Template Deleted', description: `"${deletingTemplate.title}" has been removed.` });
        }
        setDeleteAlertOpen(false);
        setDeletingTemplate(null);
    };

    const categoriesWithCounts = documentCategories
        .filter(c => c.name !== 'All Documents')
        .map(category => ({
            ...category,
            count: documentTemplates.filter(doc => doc.category === category.name).length,
        }));

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-headline text-foreground">Document Library</h1>
                <Button onClick={handleOpenNewTemplateDialog}>
                    <FilePlus2 className="mr-2 h-4 w-4" /> New Template
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                {categoriesWithCounts.map(cat => (
                                    <Button
                                        key={cat.name}
                                        variant={activeCategory === cat.name ? 'default' : 'ghost'}
                                        className="w-full justify-start gap-3"
                                        onClick={() => setActiveCategory(cat.name)}
                                    >
                                        <cat.icon className="h-4 w-4 text-muted-foreground" />
                                        <span className="flex-1 text-left">{cat.name}</span>
                                        <span className="text-xs text-muted-foreground">{cat.count}</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{activeCategory}</CardTitle>
                                {filteredDocuments.length > 0 &&
                                    <Button onClick={() => setAssignModalOpen(true)}>
                                        <UserPlus className="mr-2 h-4 w-4" /> Assign Category to Client
                                    </Button>
                                }
                            </div>
                            <CardDescription>A collection of required documents for the {activeCategory.toLowerCase()} process.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredDocuments.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredDocuments.map((doc) => (
                                        <div key={doc.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <div className="flex-1">
                                                <p className="font-semibold">{doc.title}</p>
                                                <p className="text-sm text-muted-foreground">{doc.description}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditTemplateDialog(doc)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteTemplate(doc)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No document templates found in this category.</p>
                                    <Button variant="link" onClick={handleOpenNewTemplateDialog}>Create a new template</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isAssignModalOpen} onOpenChange={setAssignModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign Category: {activeCategory}</DialogTitle>
                        <DialogDescription>Request all documents in this category from a client.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="client-select">Client</Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger id="client-select">
                                    <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(client => (
                                        <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignCategory}>Assign & Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isTemplateModalOpen} onOpenChange={setTemplateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTemplate ? 'Edit' : 'Create'} Document Template</DialogTitle>
                        <DialogDescription>{editingTemplate ? 'Update the details for this template.' : 'Add a new reusable document to your library.'}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="template-title">Template Title</Label>
                            <Input id="template-title" value={newTemplateTitle} onChange={(e) => setNewTemplateTitle(e.target.value)} placeholder="e.g., Proof of Work Experience" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="template-description">Description</Label>
                            <Textarea id="template-description" value={newTemplateDescription} onChange={(e) => setNewTemplateDescription(e.target.value)} placeholder="A short description of what this document is." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="template-category">Category</Label>
                            <Select value={newTemplateCategory} onValueChange={setNewTemplateCategory}>
                                <SelectTrigger id="template-category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                                <SelectContent>
                                    {documentCategories.filter(c => c.name !== 'All Documents').map(cat => (
                                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTemplateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveTemplate}>Save Template</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the template: "{deletingTemplate?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingTemplate(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Template
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
