'use client';
import { useState } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { applicationsData as initialApplicationsData } from '@/lib/data';

export function ApplicationsPage() {
    const [applications, setApplications] = useState(initialApplicationsData);

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'under review': return 'info';
            case 'additional info requested': return 'destructive';
            default: return 'secondary';
        }
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            case 'low': return 'secondary';
            default: return 'default';
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline">All Applications</CardTitle>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Application
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Submitted On</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={app.client.avatar} alt={app.client.name} />
                                                <AvatarFallback>{app.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{app.client.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{app.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getPriorityBadgeVariant(app.priority)}>{app.priority}</Badge>
                                    </TableCell>
                                    <TableCell>{app.submitted}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Application</DropdownMenuItem>
                                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                                <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
