'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Upload, Eye } from "lucide-react";
import { format } from 'date-fns';

const clientDocuments = [
    { id: 1, title: 'Passport Scan', status: 'Approved', date: '2023-05-20', category: 'Identification' },
    { id: 2, title: 'IELTS Score Report', status: 'Uploaded', date: '2023-06-10', category: 'Language' },
    { id: 3, title: 'Proof of Funds', status: 'Requested', date: '2023-06-15', category: 'Financial' },
    { id: 4, title: 'Educational Credential Assessment (ECA)', status: 'Requested', date: '2023-06-15', category: 'Education' },
    { id: 5, title: 'Job Offer Letter', status: 'Rejected', date: '2023-06-18', category: 'Employment' },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'approved': return 'success' as const;
        case 'uploaded': return 'info' as const;
        case 'requested': return 'warning' as const;
        case 'rejected': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

export function MyDocumentsPage() {
    return (
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
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientDocuments.map(doc => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">{doc.title}</TableCell>
                                <TableCell><Badge variant="outline">{doc.category}</Badge></TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                                </TableCell>
                                <TableCell>{format(new Date(doc.date), 'PP')}</TableCell>
                                <TableCell className="text-right">
                                    {doc.status === 'Requested' && <Button size="sm"><Upload className="mr-2 h-4 w-4"/>Upload</Button>}
                                    {doc.status === 'Rejected' && <Button size="sm" variant="destructive"><Upload className="mr-2 h-4 w-4"/>Re-upload</Button>}
                                    {doc.status !== 'Requested' && doc.status !== 'Rejected' && <Button size="sm" variant="outline"><Eye className="mr-2 h-4 w-4"/>View</Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
