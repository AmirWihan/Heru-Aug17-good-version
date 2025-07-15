
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGlobalData } from "@/context/GlobalDataContext";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { AdminTeamPerformance } from "../admin-team-performance";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const memberFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("A valid email address is required."),
    role: z.enum(['sales', 'advisor', 'admin'], { required_error: "Please select a role." }),
});

export function AdminTeamManagementPage() {
    const { teamMembers, addTeamMember } = useGlobalData();
    const { toast } = useToast();
    const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    
    const internalTeam = teamMembers.filter(member => member.type === 'sales' || member.type === 'advisor' || member.type === 'admin');

    const form = useForm<z.infer<typeof memberFormSchema>>({
        resolver: zodResolver(memberFormSchema),
        defaultValues: { name: "", email: "", role: undefined },
    });

    const onSubmit = (values: z.infer<typeof memberFormSchema>) => {
        addTeamMember({
            id: Date.now(),
            name: values.name,
            email: values.email,
            role: values.role.charAt(0).toUpperCase() + values.role.slice(1),
            avatar: `https://i.pravatar.cc/150?u=${values.email}`,
            type: values.role,
            phone: '',
            accessLevel: 'Member',
            status: 'Active',
            plan: 'N/A',
            location: 'Remote',
            yearsOfPractice: 0,
            successRate: 0,
            licenseNumber: 'N/A',
            registrationNumber: 'N/A',
            stats: [],
            specialties: []
        });

        toast({
            title: "Member Invited",
            description: `${values.name} has been added to the internal team.`,
        });

        setAddMemberDialogOpen(false);
        form.reset();
    };

    const getRoleBadgeVariant = (role: string) => {
        if (role.toLowerCase().includes('admin')) return 'destructive';
        if (role.toLowerCase().includes('sales')) return 'success';
        if (role.toLowerCase().includes('advisor')) return 'warning';
        return 'secondary';
    };

    return (
        <>
            <div className="space-y-6">
                <AdminTeamPerformance />
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Internal Team Roster</CardTitle>
                            <Button onClick={() => setAddMemberDialogOpen(true)}>
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
            
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite New Staff Member</DialogTitle>
                        <DialogDescription>Add a new member to your internal platform team.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                             <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Alex Doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="alex@visafor.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem><FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="sales">Sales</SelectItem>
                                        <SelectItem value="advisor">Advisor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Send Invite</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}
