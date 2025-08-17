
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentCategories, documents as allDocumentTemplates, clients as allClients, type DocumentTemplate } from "@/lib/data";
import { FileText, UserPlus, FilePlus2, Edit, Trash2, DownloadCloud, FolderPlus, Search, Plus, ArrowLeft, Eye } from "lucide-react";
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';
import { DocumentViewer } from '../document-viewer';

export function DocumentsPage() {
    const { clients, updateClient } = useGlobalData();
    const { toast } = useToast();

    const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>(allDocumentTemplates);
    const [categories, setCategories] = useState(documentCategories);
    const [activeCategory, setActiveCategory] = useState('Permanent Residency');
    
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [isNewCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
    const [isEditCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
    
    const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
    const [deletingTemplate, setDeletingTemplate] = useState<DocumentTemplate | null>(null);
    const [selectedClient, setSelectedClient] = useState('');
    const [viewingTemplate, setViewingTemplate] = useState<DocumentTemplate | null>(null);

    const [newTemplateTitle, setNewTemplateTitle] = useState('');
    const [newTemplateDescription, setNewTemplateDescription] = useState('');
    const [newTemplateCategory, setNewTemplateCategory] = useState('');
    const [newTemplateFile, setNewTemplateFile] = useState<File | null>(null);
    
    // State for the new category dialog
    const [newCategoryName, setNewCategoryName] = useState('');
    const [templatesForNewCategory, setTemplatesForNewCategory] = useState<DocumentTemplate[]>([]);
    const [newCategorySearchTerm, setNewCategorySearchTerm] = useState('');

    // State for editing existing category
    const [editCategorySearchTerm, setEditCategorySearchTerm] = useState('');
    const currentCategoryTemplates = documentTemplates.filter(t => t.category === activeCategory);
    const availableTemplatesForEdit = documentTemplates.filter(t => t.category !== activeCategory && t.title.toLowerCase().includes(editCategorySearchTerm.toLowerCase()));
    const [templatesForEditCategory, setTemplatesForEditCategory] = useState<DocumentTemplate[]>([]);

    const handleOpenEditCategoryDialog = () => {
        // Initialize with current category templates
        setTemplatesForEditCategory(currentCategoryTemplates);
        setEditCategorySearchTerm('');
        setEditCategoryDialogOpen(true);
    };

    const addTemplateToEditCategory = (template: DocumentTemplate) => {
        if (!templatesForEditCategory.some(t => t.id === template.id)) {
            setTemplatesForEditCategory(prev => [...prev, template]);
        }
    };

    const removeTemplateFromEditCategory = (templateId: number) => {
        setTemplatesForEditCategory(prev => prev.filter(t => t.id !== templateId));
    };

    const ensureUncategorizedCategory = () => {
        if (!categories.some(c => c.name === 'Uncategorized')) {
            setCategories(prev => [...prev, { name: 'Uncategorized', icon: FileText }]);
        }
    };

    const handleSaveEditCategory = () => {
        // Determine which templates were removed or added compared to original set
        const originalIds = new Set(currentCategoryTemplates.map(t => t.id));
        const editedIds = new Set(templatesForEditCategory.map(t => t.id));

        const removedIds: number[] = [];
        originalIds.forEach(id => { if (!editedIds.has(id)) removedIds.push(id as number); });

        const addedIds: number[] = [];
        editedIds.forEach(id => { if (!originalIds.has(id)) addedIds.push(id as number); });

        // Move removed templates to 'Uncategorized'
        if (removedIds.length > 0) ensureUncategorizedCategory();

        setDocumentTemplates(prev => prev.map(t => {
            if (removedIds.includes(t.id) && t.category === activeCategory) {
                return { ...t, category: 'Uncategorized' };
            }
            if (addedIds.includes(t.id)) {
                return { ...t, category: activeCategory };
            }
            return t;
        }));

        setEditCategoryDialogOpen(false);
        toast({ title: 'Category Updated', description: `Updated templates for "${activeCategory}". Added ${addedIds.length}, removed ${removedIds.length}.` });
    };

    const filteredDocuments = documentTemplates.filter(doc => doc.category === activeCategory);

    const handleAssignCategory = () => {
        if (!selectedClient) {
            toast({ title: 'Error', description: 'Please select a client.', variant: 'destructive' });
            return;
        }

        const clientToUpdate = allClients.find(c => c.id.toString() === selectedClient);
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
                type: 'form' as const,
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
    
    const humanFileSize = (bytes: number) => {
        const thresh = 1024;
        if (Math.abs(bytes) < thresh) return bytes + ' B';
        const units = ['KB','MB','GB','TB'];
        let u = -1;
        do { bytes /= thresh; ++u; } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    };

    const handleSaveTemplate = () => {
        if (!newTemplateTitle || !newTemplateCategory) {
            toast({ title: 'Error', description: 'Title and category are required.', variant: 'destructive' });
            return;
        }

        if (editingTemplate) {
            const updated = documentTemplates.map(t => {
                if (t.id !== editingTemplate.id) return t;
                const next = { ...t, title: newTemplateTitle, description: newTemplateDescription, category: newTemplateCategory } as any;
                if (newTemplateFile) {
                    const url = URL.createObjectURL(newTemplateFile);
                    next.sourceUrl = url;
                    next.size = humanFileSize(newTemplateFile.size);
                    next.format = newTemplateFile.type || 'File';
                }
                return next;
            });
            setDocumentTemplates(updated);
            toast({ title: 'Template Updated', description: `"${newTemplateTitle}" has been updated.` });
        } else {
            const newTemplate: DocumentTemplate = {
                id: Date.now(),
                title: newTemplateTitle,
                description: newTemplateDescription,
                category: newTemplateCategory,
                format: newTemplateFile?.type || 'Template',
                size: newTemplateFile ? humanFileSize(newTemplateFile.size) : 'Template',
            };
            if (newTemplateFile) {
                // Store a blob URL for preview/download in this session.
                (newTemplate as any).sourceUrl = URL.createObjectURL(newTemplateFile);
            }
            setDocumentTemplates([...documentTemplates, newTemplate]);
            toast({ title: 'Template Created', description: `"${newTemplate.title}" has been added.` });
        }
        
        setTemplateModalOpen(false);
        setEditingTemplate(null);
        setNewTemplateTitle('');
        setNewTemplateDescription('');
        setNewTemplateCategory('');
        setNewTemplateFile(null);
    };

    const handleOpenNewTemplateDialog = () => {
        setEditingTemplate(null);
        setNewTemplateTitle('');
        setNewTemplateDescription('');
        setNewTemplateCategory(activeCategory);
        setNewTemplateFile(null);
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

    const categoriesWithCounts = categories
        .filter(c => c.name !== 'All Documents')
        .map(category => ({
            ...category,
            count: documentTemplates.filter(doc => doc.category === category.name).length,
        }));
    
    // Functions for New Category Dialog
    const handleOpenNewCategoryDialog = () => {
        setNewCategoryName('');
        setTemplatesForNewCategory([]);
        setNewCategorySearchTerm('');
        setNewCategoryDialogOpen(true);
    };

    const addTemplateToNewCategory = (template: DocumentTemplate) => {
        if (!templatesForNewCategory.some(t => t.id === template.id)) {
            setTemplatesForNewCategory(prev => [...prev, template]);
        }
    };

    const removeTemplateFromNewCategory = (templateId: number) => {
        setTemplatesForNewCategory(prev => prev.filter(t => t.id !== templateId));
    };

    const handleCreateCategory = () => {
        if (!newCategoryName.trim()) {
            toast({ title: "Category Name Required", description: "Please enter a name for the new category.", variant: 'destructive'});
            return;
        }
        
        // Update the main templates list if any were selected
        if (templatesForNewCategory.length > 0) {
            setDocumentTemplates(prevTemplates => 
                prevTemplates.map(t => {
                    const isInNewCategory = templatesForNewCategory.some(newT => newT.id === t.id);
                    return isInNewCategory ? { ...t, category: newCategoryName } : t;
                })
            );
        }
        
        // Add new category to the list if it doesn't exist
        if (!categories.some(cat => cat.name === newCategoryName)) {
            setCategories(prev => [...prev, { name: newCategoryName, icon: FileText }]);
        }
        
        setNewCategoryDialogOpen(false);
        setActiveCategory(newCategoryName);
        toast({ title: "Category Created!", description: `Successfully created "${newCategoryName}"${templatesForNewCategory.length ? ` with ${templatesForNewCategory.length} template(s)` : ''}.`});
    };

    const availableTemplatesForNewCategory = documentTemplates.filter(t => 
        t.title.toLowerCase().includes(newCategorySearchTerm.toLowerCase())
    );

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-headline text-foreground">Document Library</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleOpenNewCategoryDialog}>
                        <FolderPlus className="mr-2 h-4 w-4" /> New Category
                    </Button>
                    <Button onClick={handleOpenNewTemplateDialog}>
                        <FilePlus2 className="mr-2 h-4 w-4" /> New Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                        <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
                        <CardContent className="max-h-[60vh] md:max-h-[70vh] overflow-auto">
                            <div className="flex flex-col gap-1.5">
                                {categoriesWithCounts.map(cat => (
                                    <Button
                                        key={cat.name}
                                        variant={activeCategory === cat.name ? 'default' : 'ghost'}
                                        className="w-full justify-start items-start gap-2 md:gap-3 min-w-0 overflow-hidden py-2.5 md:py-3 rounded-md hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none border border-transparent data-[state=open]:border-border"
                                        onClick={() => setActiveCategory(cat.name)}
                                    >
                                        <cat.icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                        <span className="flex-1 text-left whitespace-normal break-words leading-snug sm:leading-tight line-clamp-2 pr-2 text-[13px] sm:text-sm md:text-base" title={cat.name}>{cat.name}</span>
                                        <Badge variant={activeCategory === cat.name ? 'secondary' : 'outline'} className="shrink-0 text-[11px] md:text-xs px-1.5 py-0.5">
                                            {cat.count}
                                        </Badge>
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
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={handleOpenNewTemplateDialog}><FilePlus2 className="mr-2 h-4 w-4" /> Upload Document</Button>
                                    <Button variant="outline" onClick={handleOpenEditCategoryDialog}><Edit className="mr-2 h-4 w-4" /> Edit Category</Button>
                                    {filteredDocuments.length > 0 && (
                                        <Button onClick={() => setAssignModalOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Assign Category to Client</Button>
                                    )}
                                </div>
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
                                                <Button variant="ghost" size="icon" title="Preview Template" onClick={() => setViewingTemplate(doc)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {doc.sourceUrl && ( <Link href={doc.sourceUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="icon" title="Download from Source"><DownloadCloud className="h-4 w-4" /></Button></Link> )}
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditTemplateDialog(doc)}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteTemplate(doc)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : ( <div className="text-center py-12 text-muted-foreground"><p>No document templates found in this category.</p><Button variant="link" onClick={handleOpenNewTemplateDialog}>Create a new template</Button></div> )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DocumentViewer
                isOpen={!!viewingTemplate}
                onOpenChange={(isOpen) => !isOpen && setViewingTemplate(null)}
                document={viewingTemplate ? { title: viewingTemplate.title, url: 'https://unpkg.com/pdfjs-dist@3.4.120/web/compressed.tracemonkey-pldi-09.pdf' } : null}
            />

            <Dialog open={isNewCategoryDialogOpen} onOpenChange={setNewCategoryDialogOpen}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>Build a new document category by selecting from your existing templates.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
                        {/* Left Panel */}
                        <div className="flex flex-col border-r pr-6">
                            <h3 className="text-lg font-semibold mb-2">Available Templates</h3>
                            <div className="relative mb-4">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search templates..." className="pl-8" value={newCategorySearchTerm} onChange={e => setNewCategorySearchTerm(e.target.value)} />
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="space-y-2">
                                    {availableTemplatesForNewCategory.map(template => (
                                        <div key={template.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                            <div>
                                                <p className="font-medium text-sm">{template.title}</p>
                                                <p className="text-xs text-muted-foreground">{template.category}</p>
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => addTemplateToNewCategory(template)}>
                                                <Plus className="h-4 w-4 mr-1" /> Add
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                        {/* Right Panel */}
                        <div className="flex flex-col">
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="new-category-name">New Category Name</Label>
                                <Input id="new-category-name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g., Post-Graduation Work Permit" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Templates in this Category ({templatesForNewCategory.length})</h3>
                            <ScrollArea className="flex-1 border rounded-lg p-2">
                                {templatesForNewCategory.length > 0 ? (
                                    <div className="space-y-2">
                                        {templatesForNewCategory.map(template => (
                                            <div key={template.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                 <p className="font-medium text-sm">{template.title}</p>
                                                <Button size="sm" variant="ghost" onClick={() => removeTemplateFromNewCategory(template.id)}>
                                                    <ArrowLeft className="h-4 w-4 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                                        <p>Add templates from the left panel.</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateCategory}>Create Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Existing Category Dialog */}
            <Dialog open={isEditCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Category: {activeCategory}</DialogTitle>
                        <DialogDescription>Add or remove templates that belong to this category.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
                        {/* Left Panel: Available templates to add */}
                        <div className="flex flex-col border-r pr-6">
                            <h3 className="text-lg font-semibold mb-2">Available Templates</h3>
                            <div className="relative mb-4">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search templates..." className="pl-8" value={editCategorySearchTerm} onChange={e => setEditCategorySearchTerm(e.target.value)} />
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="space-y-2">
                                    {availableTemplatesForEdit.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No templates found.</p>
                                    ) : (
                                        availableTemplatesForEdit.map(template => (
                                            <div key={template.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                                <div>
                                                    <p className="font-medium text-sm">{template.title}</p>
                                                    <p className="text-xs text-muted-foreground">{template.category}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => addTemplateToEditCategory(template)}>
                                                    <Plus className="h-4 w-4 mr-1" /> Add
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                        {/* Right Panel: Templates in category */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold mb-2">Templates in this Category ({templatesForEditCategory.length})</h3>
                            <ScrollArea className="flex-1 border rounded-lg p-2">
                                {templatesForEditCategory.length > 0 ? (
                                    <div className="space-y-2">
                                        {templatesForEditCategory.map(template => (
                                            <div key={template.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <p className="font-medium text-sm">{template.title}</p>
                                                <Button size="sm" variant="ghost" onClick={() => removeTemplateFromEditCategory(template.id)}>
                                                    <ArrowLeft className="h-4 w-4 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                                        <p>No templates in this category yet.</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEditCategory}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAssignModalOpen} onOpenChange={setAssignModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign Category: {activeCategory}</DialogTitle>
                        <DialogDescription>Request all documents in this category from a client.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4"><div className="space-y-2"><Label htmlFor="client-select">Client</Label><Select value={selectedClient} onValueChange={setSelectedClient}><SelectTrigger id="client-select"><SelectValue placeholder="Select a client" /></SelectTrigger><SelectContent>{allClients.map(client => (<SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>))}</SelectContent></Select></div></div>
                    <DialogFooter><Button variant="outline" onClick={() => setAssignModalOpen(false)}>Cancel</Button><Button onClick={handleAssignCategory}>Assign & Request</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isTemplateModalOpen} onOpenChange={setTemplateModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingTemplate ? 'Edit' : 'Create'} Document Template</DialogTitle><DialogDescription>{editingTemplate ? 'Update the details for this template.' : 'Add a new reusable document to your library.'}</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label htmlFor="template-title">Template Title</Label><Input id="template-title" value={newTemplateTitle} onChange={(e) => setNewTemplateTitle(e.target.value)} placeholder="e.g., Proof of Work Experience" /></div>
                        <div className="space-y-2"><Label htmlFor="template-description">Description</Label><Textarea id="template-description" value={newTemplateDescription} onChange={(e) => setNewTemplateDescription(e.target.value)} placeholder="A short description of what this document is." /></div>
                        <div className="space-y-2"><Label htmlFor="template-category">Category</Label><Select value={newTemplateCategory} onValueChange={setNewTemplateCategory}><SelectTrigger id="template-category"><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent>{categories.filter(c => c.name !== 'All Documents').map(cat => (<SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2">
                            <Label htmlFor="template-file">Upload File (optional)</Label>
                            <Input id="template-file" type="file" onChange={(e) => setNewTemplateFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                            <p className="text-xs text-muted-foreground">You can upload a file to associate with this template for preview/download.</p>
                        </div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setTemplateModalOpen(false)}>Cancel</Button><Button onClick={handleSaveTemplate}>Save Template</Button></DialogFooter>
                </DialogContent>
            </Dialog>

             <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the template: "{deletingTemplate?.title}".</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel onClick={() => setDeletingTemplate(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Template</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
