'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const team = [
    { name: "Emma Johnson", email: "emma.j@heru.com", role: "Senior Lawyer", avatar: "https://i.pravatar.cc/150?u=emma" },
    { name: "Michael Chen", email: "michael.c@heru.com", role: "Consultant", avatar: "https://i.pravatar.cc/150?u=michaelchen" },
    { name: "Sophia Williams", email: "sophia.w@heru.com", role: "Paralegal", avatar: "https://i.pravatar.cc/150?u=sophia" },
];

export function TeamManagementScreenshot() {
    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden" data-ai-hint="team collaboration">
            <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
             <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <CardHeader className="p-0 mb-4">
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage your team members and their performance.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {team.map((member) => (
                                <TableRow key={member.email}>
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
                                        <Badge variant="outline">{member.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </div>
        </Card>
    );
}
