
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGlobalData } from "@/context/GlobalDataContext";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { SalesTeamPerformance } from "../admin-team-performance";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

export function AdminTeamManagementPage() {
    const { teamMembers } = useGlobalData();
    // Filter for internal team members only (sales, advisor, admin)
    const internalTeam = teamMembers.filter(member => member.type === 'sales' || member.type === 'advisor' || member.type === 'admin');

    const getRoleBadgeVariant = (role: string) => {
        if (role.toLowerCase().includes('admin')) return 'destructive';
        if (role.toLowerCase().includes('sales')) return 'success';
        if (role.toLowerCase().includes('advisor')) return 'warning';
        return 'secondary';
    };

    return (
        <div className="space-y-6">
            <SalesTeamPerformance />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Internal Team Roster</CardTitle>
                         <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Invite Staff Member
                        </Button>
                    </div>
                    <CardDescription>An overview of all internal VisaFor staff members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {internalTeam.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(member.role)}>{member.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Message User</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
