
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { teamMembers as initialTeamMembers, activityLogData, activityTypes } from "@/lib/data";
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
import { TeamPerformance } from '../sales-team-performance';

const memberFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    role: z.string().min(2, "Role must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
});

export function TeamPage() {
    const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
    const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof memberFormSchema>>({
        resolver: zodResolver(memberFormSchema),
        defaultValues: {
            name: "",
            role: "",
            email: "",
            phone: "",
        },
    });

    function onSubmit(values: z.infer<typeof memberFormSchema>) {
        const newMember = {
            id: teamMembers.length + 1,
            name: values.name,
            role: values.role,
            email: values.email,
            phone: values.phone || '',
            avatar: `https://i.pravatar.cc/150?u=${values.email}`,
            accessLevel: 'Member',
            status: 'Active',
            plan: 'Pro Tier',
            location: 'Remote',
            yearsOfPractice: 0,
            successRate: 0,
            specialties: [],
            stats: [
                { label: 'Clients', value: '0' },
                { label: 'Success Rate', value: 'N/A' },
                { label: 'Active Cases', value: '0' },
                { label: 'Revenue', value: '$0' }
            ]
        };
        // @ts-ignore - This is a safe cast because newMember has all required fields
        setTeamMembers([newMember, ...teamMembers]);
        setAddMemberDialogOpen(false);
        form.reset();
        toast({
            title: "Team Member Added",
            description: `${values.name} has been successfully added to the team.`,
        });
    }

    const handleActionClick = (action: string, memberName: string, contact?: string) => {
        if (action === 'call' && contact) {
            window.location.href = `tel:${contact}`;
            toast({ title: `Calling ${memberName}` });
        } else if (action === 'email' && contact) {
            window.location.href = `mailto:${contact}`;
            toast({ title: `Emailing ${memberName}` });
        } else if (action === 'stats') {
            toast({
                title: `Viewing Stats for ${memberName}`,
                description: 'Detailed performance analytics would be shown here.',
            });
        }
    };
    
    const getIconForType = (type: string) => {
        const activityType = activityTypes.find(t => t.label === type);
        return activityType ? activityType.icon : null;
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

                <TeamPerformance />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">Team Members</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teamMembers.map(member => (
                                    <Card key={member.id} className="team-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
                                        <CardHeader className="flex-row items-center gap-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold">{member.name}</h4>
                                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-3 text-sm flex-grow">
                                            {member.stats.map(stat => (
                                                <div key={stat.label} className="bg-muted p-2 rounded text-center">
                                                    <p className="font-medium">{stat.value}</p>
                                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                        <CardFooter className="flex justify-around">
                                            <Button variant="ghost" size="sm" onClick={() => handleActionClick('call', member.name, member.phone)}><Phone className="mr-1 h-4 w-4" />Call</Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleActionClick('email', member.name, member.email)}><Mail className="mr-1 h-4 w-4" />Email</Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleActionClick('stats', member.name)}><LineChart className="mr-1 h-4 w-4" />Stats</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                     <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Recent Team Activity</CardTitle>
                            <CardDescription>A log of the most recent activities across the team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative pl-6 before:absolute before:inset-y-0 before:w-px before:bg-border before:left-0">
                                {activityLogData.slice(0, 5).map((activity) => {
                                    const Icon = getIconForType(activity.type);
                                    return (
                                    <div key={activity.id} className="relative pl-8 py-4">
                                        <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-card flex items-center justify-center">
                                            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                                {Icon && <Icon className="h-3 w-3 text-primary" />}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{activity.type} for {activity.client.name}</h4>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span >
                                        </div>
                                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                                            Logged by
                                            <Avatar className="h-4 w-4">
                                                <AvatarImage src={activity.teamMember.avatar} alt={activity.teamMember.name} />
                                                <AvatarFallback>{activity.teamMember.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {activity.teamMember.name}
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1-202-555-0105" {...field} />
                                        </FormControl>
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
