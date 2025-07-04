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

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'success';
            case 'suspended': return 'destructive';
            case 'pending verification': return 'warning';
            case 'pending activation': return 'warning';
            case 'blocked': return 'destructive';
            default: return 'secondary';
        }
    };

    const handleActivateAccount = (memberId: number) => {
        const memberToUpdate = teamMembers.find(m => m.id === memberId);
        if (memberToUpdate) {
            updateTeamMember({ ...memberToUpdate, status: 'Active', role: 'Immigration Lawyer' });
            toast({
                title: "Account Activated",
                description: "The lawyer's account has been successfully activated.",
            });
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
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search by name or email..." className="pl-10" />
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="pending verification">Pending Verification</SelectItem>
                                        <SelectItem value="pending activation">Pending Activation</SelectItem>
                                    </SelectContent>
                                </Select>
                                 <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Plans</SelectItem>
                                        <SelectItem value="pro">Pro Tier</SelectItem>
                                        <SelectItem value="basic">Basic Tier</SelectItem>
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
                                        {teamMembers.map(member => (
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
                                                    {member.status === 'Pending Activation' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(member)}>View Details</Button>
                                                            <Button size="sm" onClick={() => handleActivateAccount(member.id)}>
                                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                                Activate
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem onClick={() => handleViewDetails(member)}>View Details</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="clients" className="mt-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search clients by name or email..." className="pl-10" />
                                </div>
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
                                        {clients.map(client => (
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
                                                            <DropdownMenuItem className="text-destructive">Block Account</DropdownMenuItem>
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
