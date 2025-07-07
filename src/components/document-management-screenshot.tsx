'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Sparkles, Upload } from "lucide-react";

export function DocumentManagementScreenshot() {
    const documents = [
        { title: "Application for Work Permit (IMM 1295)", status: "Pending Client Review", isAiFilled: true },
        { title: "Employment Contract", status: "Approved", isAiFilled: false },
        { title: "Pay Stubs (3 months)", status: "Rejected", isAiFilled: false },
        { title: "Proof of Funds", status: "Requested", isAiFilled: false },
    ];

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Approved': return 'success' as const;
            case 'Pending Client Review': return 'info' as const;
            case 'Rejected': return 'destructive' as const;
            case 'Requested': return 'warning' as const;
            default: return 'secondary' as const;
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden">
             <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <CardHeader className="p-0 mb-4">
                    <CardTitle>Client Documents</CardTitle>
                    <CardDescription>Review, approve, and manage all documents for James Wilson.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {doc.title}
                                        {doc.isAiFilled && 
                                            <Badge variant="outline" className="ml-2 border-primary/50 text-primary">
                                                <Sparkles className="mr-1 h-3 w-3" /> AI Pre-filled
                                            </Badge>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {doc.status === 'Requested' ? (
                                            <Button size="sm"><Upload className="mr-2 h-4 w-4"/>Upload</Button>
                                        ) : (
                                            <>
                                                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </div>
        </Card>
    );
}
