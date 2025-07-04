'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { applicationsData, teamMembers } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

export function AdminAllCasesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [caseTypeFilter, setCaseTypeFilter] = useState('all');
    const [lawyerFilter, setLawyerFilter] = useState('all');

    const statuses = ['all', ...Array.from(new Set(applicationsData.map(a => a.status)))];
    const caseTypes = ['all', ...Array.from(new Set(applicationsData.map(a => a.type)))];
    const lawyers = ['all', ...teamMembers.map(m => m.name)];

    const filteredCases = applicationsData.filter(app => {
        const clientMatch = app.client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || app.status === statusFilter;
        const caseTypeMatch = caseTypeFilter === 'all' || app.type === caseTypeFilter;
        const lawyerMatch = lawyerFilter === 'all' || app.assignedTo.name === lawyerFilter;

        return clientMatch && statusMatch && caseTypeMatch && lawyerMatch;
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Cases</CardTitle>
                <CardDescription>View and manage all immigration cases across the platform.</CardDescription>
                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="relative w-full sm:w-auto sm:flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by client name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 w-full"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Case Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {caseTypes.map(type => <SelectItem key={type} value={type}>{type === 'all' ? 'All Case Types' : type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={lawyerFilter} onValueChange={setLawyerFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Lawyer" />
                        </SelectTrigger>
                        <SelectContent>
                             {lawyers.map(lawyer => <SelectItem key={lawyer} value={lawyer}>{lawyer === 'all' ? 'All Lawyers' : lawyer}</SelectItem>)}
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
                                <TableCell>{format(new Date(app.submitted), "PP")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
