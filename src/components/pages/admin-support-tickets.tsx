'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supportTicketsData } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { LifeBuoy } from 'lucide-react';

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'open': return 'success';
        case 'in progress': return 'warning';
        case 'closed': return 'secondary';
        default: return 'default';
    }
};

export function AdminSupportTicketsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LifeBuoy className="h-5 w-5 text-primary" />
                        Support Tickets
                    </CardTitle>
                    <CardDescription>View and manage all user-submitted support tickets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket ID</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {supportTicketsData.map((ticket) => (
                                <TableRow key={ticket.id} className="cursor-pointer">
                                    <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell>{ticket.topic}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                                    </TableCell>
                                    <TableCell suppressHydrationWarning>
                                        {formatDistanceToNow(new Date(ticket.lastUpdated), { addSuffix: true })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
