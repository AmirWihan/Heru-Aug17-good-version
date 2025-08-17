
'use client';
import { Users, Award, CheckSquare, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { activityLogData, activityTypes, type TeamMember } from "@/lib/data";
import { PlusCircle, Phone, Mail, LineChart } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const memberFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    role: z.string().min(2, "Role must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    accessLevel: z.enum(['Admin', 'Standard User', 'Viewer']),
});

export function TeamPage() {
    const { userProfile, teamMembers, addTeamMember, updateTeamMember } = useGlobalData();
    const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const firmMembers = teamMembers.filter(m => m.firmName === (userProfile as TeamMember)?.firmName);

    const form = useForm<z.infer<typeof memberFormSchema>>({
        resolver: zodResolver(memberFormSchema),
        defaultValues: {
            name: "",
            role: "",
            email: "",
            phone: "",
            accessLevel: 'Standard User',
        },
    });

    function onSubmit(values: z.infer<typeof memberFormSchema>) {
        const newMember = {
            id: Date.now(),
            name: values.name,
            role: values.role,
            email: values.email,
            phone: values.phone || '',
            avatar: `https://i.pravatar.cc/150?u=${values.email}`,
            accessLevel: values.accessLevel,
            status: 'Active' as const,
            plan: (userProfile as TeamMember)?.plan || 'Pro Team',
            firmName: (userProfile as TeamMember)?.firmName,
            location: 'Remote',
            yearsOfPractice: 0,
            successRate: 0,
            licenseNumber: 'N/A',
            registrationNumber: 'N/A',
            type: 'legal' as const,
            stats: [
                { label: 'Clients', value: '0', icon: Users },
                { label: 'Success Rate', value: 'N/A', icon: Award },
                { label: 'Active Cases', value: '0', icon: CheckSquare },
                { label: 'Years Practicing', value: '0', icon: Briefcase }
            ],
            specialties: [],
            languages: [],
            consultationType: 'Free' as const
        };
        
        addTeamMember(newMember);
        setAddMemberDialogOpen(false);
        form.reset();
        toast({
            title: "Team Member Added",
            description: `${values.name} has been successfully added to the team.`,
        });
    }
    
    const handleAccessLevelChange = (memberId: number, newLevel: TeamMember['accessLevel']) => {
        const memberToUpdate = teamMembers.find(m => m.id === memberId);
        if (memberToUpdate) {
            updateTeamMember({ ...memberToUpdate, accessLevel: newLevel });
            toast({
                title: 'Access Level Updated',
                description: `${memberToUpdate.name}'s access level changed to ${newLevel}.`
            });
        }
    };


    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-headline text-foreground">Team Management</h1>
                    <Button onClick={() => setAddMemberDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Team Roster</CardTitle>
                        <CardDescription>Manage your firm's team members and their access levels.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Access Level</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {firmMembers.map(member => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <Link href={`/lawyer/team/${member.id}`} className="flex items-center gap-4 p-1 rounded hover:bg-muted/60 transition-colors" title={`View ${member.name}'s profile`}>
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={member.avatar} />
                                                        <AvatarFallback>{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold underline-offset-2 group-hover:underline">{member.name}</p>
                                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell>{member.role}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={member.accessLevel}
                                                    onValueChange={(value: TeamMember['accessLevel']) => handleAccessLevelChange(member.id, value)}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Standard User">Standard User</SelectItem>
                                                        <SelectItem value="Viewer">Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                 <Button variant="outline" size="sm" onClick={() => router.push(`/lawyer/team/${member.id}`)}>
                                                    <LineChart className="mr-2 h-4 w-4" /> Performance
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                       </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isAddMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Team Member</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new team member. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Alex Ray" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Case Manager" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="alex.ray@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="accessLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Access Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an access level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                                                <SelectItem value="Standard User">Standard User (Standard Access)</SelectItem>
                                                <SelectItem value="Viewer">Viewer (Read-only)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Member</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}
