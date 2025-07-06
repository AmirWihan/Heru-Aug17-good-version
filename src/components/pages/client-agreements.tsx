'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Handshake, FileText, Upload, Eye, Download, AlertTriangle } from "lucide-react";
import { useGlobalData } from "@/context/GlobalDataContext";

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active': return 'success';
        case 'completed': return 'default';
        case 'terminated': return 'destructive';
        default: return 'secondary';
    }
};

const getInvoiceStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid': return 'success';
        case 'overdue': return 'destructive';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
};

// For this demo, we'll hardcode the client ID to 5 (James Wilson)
const CURRENT_CLIENT_ID = 5;

export function ClientAgreementsPage() {
    const { toast } = useToast();
    const { clients, invoicesData } = useGlobalData();
    const client = clients.find(c => c.id === CURRENT_CLIENT_ID);

    if (!client) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive">Could not find client data.</p>
                </CardContent>
            </Card>
        );
    }
    
    const handleUpload = (agreementId: number) => {
        toast({
            title: 'File Upload',
            description: `File upload initiated for agreement ${agreementId}. This is a demo.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Handshake className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">My Agreements</h1>
                    <p className="text-muted-foreground">View your signed agreements and related financial documents.</p>
                </div>
            </div>

            {(client.agreements || []).length > 0 ? (client.agreements || []).map((agreement) => (
                <Card key={agreement.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{agreement.title}</CardTitle>
                                <CardDescription>Signed on {format(new Date(agreement.dateSigned), 'PP')}</CardDescription>
                            </div>
                            <Badge variant={getStatusBadgeVariant(agreement.status)}>{agreement.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="font-semibold mb-2">Related Documents</h4>
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document</TableHead>
                                            <TableHead>Date Added</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Signed Agreement</TableCell>
                                            <TableCell>{format(new Date(agreement.dateSigned), 'PP')}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                        {(agreement.relatedDocuments || []).map(doc => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">{doc.title}</TableCell>
                                                <TableCell>{format(new Date(doc.dateAdded), 'PP')}</TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <Button variant="outline" className="mt-4 w-full" onClick={() => handleUpload(agreement.id)}>
                                <Upload className="mr-2 h-4 w-4" /> Upload Proof of Payment or Other Document
                            </Button>
                        </div>

                         <div>
                            <h4 className="font-semibold mb-2">Linked Invoices</h4>
                            <div className="space-y-3">
                                {(agreement.relatedInvoiceIds || []).length > 0 ? (
                                    agreement.relatedInvoiceIds.map(invoiceId => {
                                        const invoice = invoicesData.find(inv => inv.invoiceNumber === invoiceId);
                                        return invoice ? (
                                            <div key={invoice.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Invoice {invoice.invoiceNumber}</p>
                                                    <p className="text-sm text-muted-foreground">Amount: ${invoice.amount.toLocaleString()}</p>
                                                </div>
                                                <Badge variant={getInvoiceStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                            </div>
                                        ) : null;
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No invoices linked to this agreement.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )) : (
                <Card>
                    <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No Agreements Found</h3>
                        <p className="text-muted-foreground">You do not have any active agreements with our firm yet.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
