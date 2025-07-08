
'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Handshake, AlertTriangle, FileSignature, Download, CheckCircle, FileText } from "lucide-react";
import { useGlobalData } from "@/context/GlobalDataContext";
import type { Client, Agreement } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DocumentViewer } from "../document-viewer";

const getStatusBadgeVariant = (status: Agreement['status']) => {
    switch (status) {
        case 'Active':
        case 'Signed':
            return 'success';
        case 'Completed': return 'default';
        case 'Terminated': return 'destructive';
        case 'Pending Signature': return 'warning';
        default: return 'secondary';
    }
};

export function ClientAgreementsPage() {
    const { toast } = useToast();
    const { userProfile, updateClient } = useGlobalData();
    const client = userProfile as Client;
    
    const [viewingDocument, setViewingDocument] = useState<{ title: string; url?: string; } | null>(null);
    const [signingAgreement, setSigningAgreement] = useState<Agreement | null>(null);

    const handleSignAgreement = (agreementId: number) => {
        if (!client) return;
        const updatedAgreements = (client.agreements || []).map(a => 
            a.id === agreementId ? { ...a, status: 'Signed' as const } : a
        );
        updateClient({ ...client, agreements: updatedAgreements });
        setSigningAgreement(null);
        toast({
            title: "Agreement Signed",
            description: "Your lawyer has been notified that you have signed the agreement.",
        });
    };

    if (!client) {
        return (
            <Card>
                <CardHeader><CardTitle>Error</CardTitle></CardHeader>
                <CardContent><p className="text-destructive">Could not find client data.</p></CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full"><Handshake className="h-6 w-6 text-primary" /></div>
                    <div>
                        <h1 className="text-2xl font-bold font-headline text-foreground">My Agreements</h1>
                        <p className="text-muted-foreground">View and sign your service agreements with your legal team.</p>
                    </div>
                </div>

                {(client.agreements || []).length > 0 ? (client.agreements || []).map((agreement) => (
                    <Card key={agreement.id}>
                        <CardHeader className="flex-row justify-between items-start">
                             <div>
                                <CardTitle>{agreement.title}</CardTitle>
                                <CardDescription>Status: <span className="font-semibold">{agreement.status}</span></CardDescription>
                            </div>
                            <Badge variant={getStatusBadgeVariant(agreement.status)}>{agreement.status}</Badge>
                        </CardHeader>
                        <CardContent>
                             <p className="text-sm text-muted-foreground">This agreement was prepared on {format(new Date(agreement.dateSigned), 'PPP')}.</p>
                        </CardContent>
                        <CardFooter>
                            {agreement.status === 'Pending Signature' && (
                                <Button onClick={() => setSigningAgreement(agreement)}>
                                    <FileSignature className="mr-2 h-4 w-4" /> View & Sign
                                </Button>
                            )}
                             {(agreement.status === 'Signed' || agreement.status === 'Active' || agreement.status === 'Completed') && (
                                <Button variant="outline" onClick={() => setViewingDocument({ title: agreement.title, url: agreement.documentUrl })}>
                                    <FileText className="mr-2 h-4 w-4" /> View Signed Agreement
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )) : (
                    <Card>
                        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Agreements Found</h3>
                            <p className="text-muted-foreground">You do not have any service agreements yet.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={!!signingAgreement} onOpenChange={(isOpen) => !isOpen && setSigningAgreement(null)}>
                <DialogContent className="max-w-4xl h-[95vh] flex flex-col p-0">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Review & Sign: {signingAgreement?.title}</DialogTitle>
                        <DialogDescription>Please review the document below carefully before signing.</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                       <DocumentViewer
                           isOpen={!!signingAgreement}
                           onOpenChange={() => {}} // Controlled by parent Dialog
                           document={signingAgreement ? { title: signingAgreement.title, url: signingAgreement.documentUrl } : null}
                       />
                    </div>
                    <DialogFooter className="p-4 border-t">
                         <Button variant="outline" onClick={() => setSigningAgreement(null)}>Cancel</Button>
                         <Button onClick={() => handleSignAgreement(signingAgreement!.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Sign & Accept Agreement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <DocumentViewer
                isOpen={!!viewingDocument}
                onOpenChange={(isOpen) => !isOpen && setViewingDocument(null)}
                document={viewingDocument}
            />
        </>
    )
}
