'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const clients = [
    { name: "Adebola Okonjo", email: "ade.okonjo@example.com", avatar: "https://i.pravatar.cc/150?u=adebola", caseType: "Permanent Residency", status: "Active" },
    { name: "Carlos Mendez", email: "carlos.m@example.com", avatar: "https://i.pravatar.cc/150?u=carlos", caseType: "Student Visa", status: "Active" },
    { name: "Li Wei", email: "li.wei@example.com", avatar: "https://i.pravatar.cc/150?u=liwei", caseType: "Work Permit", status: "On-hold" },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active': return 'success' as const;
        case 'on-hold': return 'warning' as const;
        default: return 'secondary' as const;
    }
}

export function ClientManagementScreenshot() {
    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden">
             <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <CardHeader className="p-0 mb-4">
                    <CardTitle>All Clients</CardTitle>
                    <CardDescription>Search, filter, and manage all your clients from a single view.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name..." className="pl-10 w-full" />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Case Type</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.email}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={client.avatar} alt={client.name} />
                                                <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{client.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{client.caseType}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
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
