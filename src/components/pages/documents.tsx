'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentCategories, documents, clients } from "@/lib/data";
import { Download, FileText, PlusCircle, Share2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DocumentsPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<{ title: string } | null>(null);
    const [activeCategory, setActiveCategory] = useState('All Documents');

    const handleAssignClick = (doc: { title: string }) => {
        setSelectedDoc(doc);
        setModalOpen(true);
    };

    const getIconForCategory = (category: string) => {
        const cat = documentCategories.find(c => c.name === category);
        return cat?.icon || FileText;
    };

    const filteredDocuments = activeCategory === 'All Documents' 
        ? documents 
        : documents.filter(doc => doc.category === activeCategory);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Immigration Documents</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Document
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Document Categories</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {documentCategories.map(cat => (
                        <Button 
                            key={cat.name} 
                            variant={activeCategory === cat.name ? 'default' : 'outline'}
                            onClick={() => setActiveCategory(cat.name)}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => {
                    const Icon = getIconForCategory(doc.category);
                    return (
                        <Card key={doc.id} className="document-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
                            <CardHeader className="flex-row items-start gap-4">
                                <div className="bg-muted p-3 rounded-full">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-base font-bold">{doc.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <Badge variant="secondary">{doc.category}</Badge>
                                    <span className="text-xs text-muted-foreground">{doc.format} • {doc.size}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-2">
                                <Button variant="ghost" size="sm"><Download className="mr-2 h-4 w-4" />Download</Button>
                                <Button variant="outline" size="sm" onClick={() => handleAssignClick(doc)}><UserPlus className="mr-2 h-4 w-4" />Assign</Button>
                                <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign: {selectedDoc?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="client" className="text-right">Client</Label>
                            <Select>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(client => (
                                        <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="due-date" className="text-right">Due Date</Label>
                            <Input id="due-date" type="date" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">Notes</Label>
                            <Textarea id="notes" placeholder="Add instructions for the client" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Assign Document</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
