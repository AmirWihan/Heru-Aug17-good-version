'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { applicationsData, teamMembers } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, FileText, CheckCircle, Clock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

export function AdminAllCasesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [caseTypeFilter, setCaseTypeFilter] = useState('all');
    const [lawyerFilter, setLawyerFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const statuses = ['all', ...Array.from(new Set(applicationsData.map(a => a.status)))];
    const caseTypes = ['all', ...Array.from(new Set(applicationsData.map(a => a.type)))];
    const lawyers = ['all', ...teamMembers.map(m => m.name)];
    const priorities = ['all', ...Array.from(new Set(applicationsData.map(a => a.priority)))];

    const filteredCases = applicationsData.filter(app => {
        const clientMatch = app.client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || app.status === statusFilter;
        const caseTypeMatch = caseTypeFilter === 'all' || app.type === caseTypeFilter;
        const lawyerMatch = lawyerFilter === 'all' || app.assignedTo.name === lawyerFilter;
        const priorityMatch = priorityFilter === 'all' || app.priority === priorityFilter;

        return clientMatch && statusMatch && caseTypeMatch && lawyerMatch && priorityMatch;
    });

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
        }
    };

    return (
        <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicationsData.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Cases</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicationsData.filter(c => c.status === 'Approved').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicationsData.filter(c => c.status === 'Under Review' || c.status === 'Pending').length}</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Cases</CardTitle>
                    <CardDescription>View and manage all immigration cases across the platform.</CardDescription>
                     <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                        <div className="relative w-full sm:w-auto flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by client name..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Case Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {caseTypes.map(type => <SelectItem key={type} value={type}>{type === 'all' ? 'All Case Types' : type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={lawyerFilter} onValueChange={setLawyerFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Lawyer" />
                            </SelectTrigger>
                            <SelectContent>
                                 {lawyers.map(lawyer => <SelectItem key={lawyer} value={lawyer}>{lawyer === 'all' ? 'All Lawyers' : lawyer}</SelectItem>)}
                            </SelectContent>
                        </Select>
                         <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                 {priorities.map(p => <SelectItem key={p} value={p}>{p === 'all' ? 'All Priorities' : p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Case Type</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCases.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={app.client.avatar} alt={app.client.name} />
                                                <AvatarFallback>{app.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{app.client.name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{app.type}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={app.assignedTo.avatar} alt={app.assignedTo.name} />
                                                <AvatarFallback>{app.assignedTo.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{app.assignedTo.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getPriorityBadgeVariant(app.priority)}>{app.priority}</Badge>
                                    </TableCell>
                                    <TableCell suppressHydrationWarning>{format(new Date(app.submitted), "PP")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
