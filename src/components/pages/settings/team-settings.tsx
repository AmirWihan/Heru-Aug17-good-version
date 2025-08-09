
'use client';

import { teamMembers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useGlobalData } from "@/context/GlobalDataContext";
import { useState } from "react";

export function TeamSettings() {
    const { teamMembers, updateTeamMember } = useGlobalData();
    const [localMembers, setLocalMembers] = useState(teamMembers.map(m => ({ ...m })));
    const { toast } = useToast();

    const handleRoleChange = (id: string | number, newRole: string) => {
        setLocalMembers(members => members.map(m => String(m.id) === String(id) ? { ...m, accessLevel: newRole } : m));
    };

    const handleSave = () => {
        localMembers.forEach(m => {
            updateTeamMember(m);
        });
        toast({ title: "Changes Saved", description: "User roles and permissions have been updated." });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Users & Teams</CardTitle>
                    <CardDescription>Manage who has access to your workspace.</CardDescription>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Invite User
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Access Level</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {localMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-muted-foreground">{member.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell className="text-right">
                                     <Select value={member.accessLevel} onValueChange={val => handleRoleChange(member.id, val)}>
                                        <SelectTrigger className="w-[140px] ml-auto">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Standard User">Standard User</SelectItem>
                                            <SelectItem value="Viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Permissions Matrix */}
                <div className="mt-8">
                  <CardTitle>Permissions Matrix</CardTitle>
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Standard User</TableHead>
                        <TableHead>Viewer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>View/Manage Team</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>View only</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Financial Results</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>❌</TableCell>
                        <TableCell>❌</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Delete/Export Accounts</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>❌</TableCell>
                        <TableCell>❌</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Settings & Reports (High Level)</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>❌</TableCell>
                        <TableCell>❌</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Edit Firm/Case Data</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>❌</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>View Firm/Case Data</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>✔️</TableCell>
                        <TableCell>✔️</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
            </CardContent>
             <CardFooter className="border-t pt-6 flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
        </Card>
    )
}
