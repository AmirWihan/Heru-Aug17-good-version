'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, UserPlus, ShieldCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useGlobalData } from '@/context/GlobalDataContext';
import { type Client, type TeamMember } from '@/lib/data';
import { AdminUserDetailSheet } from './admin-user-detail';
import { ClientDetailSheet } from './client-detail';

export function UserManagementPage() {
    const { teamMembers, updateTeamMember, clients, updateClient } = useGlobalData();
    const { toast } = useToast();
    const [selectedUser, setSelectedUser] = useState<TeamMember | Client | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    // State for lawyer filters
    const [lawyerSearchTerm, setLawyerSearchTerm] = useState('');
    const [lawyerStatusFilter, setLawyerStatusFilter] = useState('all');
    const [lawyerPlanFilter, setLawyerPlanFilter] = useState('all');

    // State for client filters
    const [clientSearchTerm, setClientSearchTerm] = useState('');
    const [clientStatusFilter, setClientStatusFilter] = useState('all');

    const lawyerStatuses = ['all', ...Array.from(new Set(teamMembers.map(m => m.status)))];
    const lawyerPlans = ['all', ...Array.from(new Set(teamMembers.map(m => m.plan)))];
    const clientStatuses = ['all', ...Array.from(new Set(clients.map(c => c.status)))];

    const filteredLawyers = teamMembers.filter(member => {
        const searchMatch = member.name.toLowerCase().includes(lawyerSearchTerm.toLowerCase()) || member.email.toLowerCase().includes(lawyerSearchTerm.toLowerCase());
        const statusMatch = lawyerStatusFilter === 'all' || member.status === lawyerStatusFilter;
        const planMatch = lawyerPlanFilter === 'all' || member.plan === lawyerPlanFilter;
        return searchMatch && statusMatch && planMatch;
    });

    const filteredClients = clients.filter(client => {
        const searchMatch = client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) || client.email.toLowerCase().includes(clientSearchTerm.toLowerCase());
        const statusMatch = clientStatusFilter === 'all' || client.status === clientStatusFilter;
        return searchMatch && statusMatch;
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'success';
            case 'suspended': return 'destructive';
            case 'rejected': return 'destructive';
            case 'pending verification': return 'warning';
            case 'pending activation': return 'warning';
            case 'blocked': return 'destructive';
            default: return 'secondary';
        }
    };
    
    const handleViewDetails = (user: TeamMember | Client) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    const handleUpdateTeamMember = (updatedUser: TeamMember) => {
        updateTeamMember(updatedUser);
        setSelectedUser(updatedUser);
    };
    
    const handleUpdateClient = (updatedClient: Client) => {
        updateClient(updatedClient);
        setSelectedUser(updatedClient);
    };

    const handleBlockClient = (client: Client) => {
        updateClient({ ...client, status: 'Blocked' });
        toast({
            title: "Client Blocked",
            description: `${client.name}'s account has been blocked.`,
            variant: 'destructive',
        });
    };
    
    const isTeamMember = (user: any): user is TeamMember => {
        return user && 'accessLevel' in user;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View, manage, approve, or block user accounts.</CardDescription>
                        </div>
                         <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite User
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="lawyers">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="lawyers">Lawyers / Firms</TabsTrigger>
                            <TabsTrigger value="clients">Applicants / Clients</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="lawyers" className="mt-4">
                            <div className="flex items-center gap-4 mb-4 flex-wrap">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search by name or email..." className="pl-10" value={lawyerSearchTerm} onChange={e => setLawyerSearchTerm(e.target.value)} />
                                </div>
                                <Select value={lawyerStatusFilter} onValueChange={setLawyerStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lawyerStatuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                 <Select value={lawyerPlanFilter} onValueChange={setLawyerPlanFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lawyerPlans.map(plan => <SelectItem key={plan} value={plan}>{plan === 'all' ? 'All Plans' : plan}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Plan</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLawyers.map(member => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={member.avatar} />
                                                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{member.name}</div>
                                                            <div className="text-sm text-muted-foreground">{member.email}</div>
                                                             {member.status === 'Pending Activation' && (
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    Lic: {member.licenseNumber} / Reg: {member.registrationNumber}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{member.plan}</TableCell>
                                                <TableCell>
                                                     <Badge variant={getStatusBadgeVariant(member.status)}>{member.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                     <Button variant="outline" size="sm" onClick={() => handleViewDetails(member)}>
                                                         View Details
                                                     </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="clients" className="mt-4">
                            <div className="flex items-center gap-4 mb-4 flex-wrap">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search clients by name or email..." className="pl-10" value={clientSearchTerm} onChange={e => setClientSearchTerm(e.target.value)}/>
                                </div>
                                <Select value={clientStatusFilter} onValueChange={setClientStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clientStatuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Case Type</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredClients.map(client => (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                     <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={client.avatar} />
                                                            <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{client.name}</div>
                                                            <div className="text-sm text-muted-foreground">{client.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{client.caseType}</TableCell>
                                                <TableCell>{client.joined}</TableCell>
                                                <TableCell><Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge></TableCell>
                                                <TableCell className="text-right space-x-2">
                                                     <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleViewDetails(client)}>View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive" onClick={() => handleBlockClient(client)}>Block Account</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {selectedUser && isTeamMember(selectedUser) && (
                 <AdminUserDetailSheet
                    user={selectedUser}
                    isOpen={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    onUpdateUser={handleUpdateTeamMember}
                />
            )}
            {selectedUser && !isTeamMember(selectedUser) && (
                 <ClientDetailSheet
                    client={selectedUser}
                    isOpen={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    onUpdateClient={handleUpdateClient}
                />
            )}
        </>
    );
}
