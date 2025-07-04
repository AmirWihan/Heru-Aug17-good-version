'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clients, teamMembers } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function UserManagementPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View, manage, approve, or block user accounts.</CardDescription>
                    </div>
                     <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Admin
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
                                <Input placeholder="Search lawyers by name or email..." className="pl-10" />
                            </div>
                            <Button variant="outline">Filter</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Team Member</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Access Level</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamMembers.map(member => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div className="font-medium">{member.name}</div>
                                                <div className="text-sm text-muted-foreground">{member.email}</div>
                                            </TableCell>
                                            <TableCell>{member.role}</TableCell>
                                            <TableCell>
                                                 <Select defaultValue={member.accessLevel}>
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Member">Member</SelectItem>
                                                        <SelectItem value="Viewer">Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm">View Activity</Button>
                                                <Button variant="destructive" size="sm">Deactivate</Button>
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
                            <Button variant="outline">Filter</Button>
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
                                                <div className="font-medium">{client.name}</div>
                                                <div className="text-sm text-muted-foreground">{client.email}</div>
                                            </TableCell>
                                            <TableCell>{client.caseType}</TableCell>
                                            <TableCell>{client.joined}</TableCell>
                                            <TableCell><Badge variant={client.status === 'Active' ? 'success' : 'secondary'}>{client.status}</Badge></TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm">View Cases</Button>
                                                <Button variant="destructive" size="sm">Block</Button>
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
    );
}
