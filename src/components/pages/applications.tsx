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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { teamMembers } from '@/lib/data';

export function ApplicationsPage() {
    const [applications, setApplications] = useState(initialApplicationsData);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState('');
    const [assigneeToUpdate, setAssigneeToUpdate] = useState<any | null>(null);

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
        <>
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
                                <TableHead>Assigned To</TableHead>
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
                                        {app.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={app.assignedTo.avatar} alt={app.assignedTo.name} />
                                                    <AvatarFallback>{app.assignedTo.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <span>{app.assignedTo.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setSelectedApp(app); setIsViewOpen(true); }}>View Application</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setSelectedApp(app); setStatusToUpdate(app.status); setIsStatusOpen(true); }}>Update Status</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setSelectedApp(app); setAssigneeToUpdate(app.assignedTo || null); setIsAssignOpen(true); }}>Assign to Team</DropdownMenuItem>
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

        {/* View Application Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                </DialogHeader>
                {selectedApp && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={selectedApp.client.avatar} alt={selectedApp.client.name} />
                                <AvatarFallback>{selectedApp.client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-bold text-lg">{selectedApp.client.name}</div>
                                <div className="text-muted-foreground text-sm">{selectedApp.type}</div>
                            </div>
                        </div>
                        <div>Status: <Badge variant={getStatusBadgeVariant(selectedApp.status)}>{selectedApp.status}</Badge></div>
                        <div>Priority: <Badge variant={getPriorityBadgeVariant(selectedApp.priority)}>{selectedApp.priority}</Badge></div>
                        <div>Submitted: {selectedApp.submitted}</div>
                        <div>Description: {selectedApp.description || 'No description.'}</div>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={() => setIsViewOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Update Status Modal */}
        <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Application Status</DialogTitle>
                </DialogHeader>
                {selectedApp && (
                    <div className="space-y-4">
                        <Select value={statusToUpdate} onValueChange={setStatusToUpdate}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Profile Setup">Profile Setup</SelectItem>
                                <SelectItem value="Awaiting Documents">Awaiting Documents</SelectItem>
                                <SelectItem value="Pending Review">Pending Review</SelectItem>
                                <SelectItem value="In Review">In Review</SelectItem>
                                <SelectItem value="Biometrics Required">Biometrics Required</SelectItem>
                                <SelectItem value="Awaiting Decision">Awaiting Decision</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setApplications(apps => apps.map(a => a.id === selectedApp.id ? { ...a, status: statusToUpdate } : a));
                        setIsStatusOpen(false);
                    }}>Update Status</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Assign to Team Modal */}
        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign to Team Member</DialogTitle>
                </DialogHeader>
                {selectedApp && (
                    <div className="space-y-4">
                        <Select value={assigneeToUpdate?.id?.toString() || ''} onValueChange={(id) => setAssigneeToUpdate(teamMembers.find(m => m.id.toString() === id) || null)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                                {teamMembers.map(member => (
    <SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>
))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setApplications(apps => apps.map(a => a.id === selectedApp.id ? { ...a, assignedTo: assigneeToUpdate } : a));
                        setIsAssignOpen(false);
                    }}>Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}

