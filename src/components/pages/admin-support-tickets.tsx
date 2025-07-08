
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supportTicketsData as initialData, type Task } from '@/lib/data';
import { format, formatDistanceToNow } from 'date-fns';
import { LifeBuoy, X, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

type SupportTicket = typeof initialData[0];

export function AdminSupportTicketsPage() {
    const { addTask, teamMembers } = useGlobalData();
    const { toast } = useToast();
    const [tickets, setTickets] = useState(initialData);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Form state for assigning a task
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskAssignee, setTaskAssignee] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskPriority, setTaskPriority] = useState<Task['priority']>('Medium');
    
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open': return 'success';
            case 'in progress': return 'warning';
            case 'closed': return 'secondary';
            default: return 'default';
        }
    };
    
    const resetTaskForm = () => {
        setTaskTitle('');
        setTaskDescription('');
        setTaskAssignee('');
        setTaskDueDate('');
        setTaskPriority('Medium');
    };

    const handleTicketClick = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        // Pre-fill form based on ticket, but allow user to override
        setTaskTitle(ticket.subject);
        setTaskDescription(`Resolve support ticket ${ticket.id}:\n\n"${ticket.description}"`);
        setIsSheetOpen(true);
    };

    const handleStatusChange = (newStatus: SupportTicket['status']) => {
        if (!selectedTicket) return;
        const updatedTicket = { ...selectedTicket, status: newStatus, lastUpdated: new Date().toISOString() };
        setSelectedTicket(updatedTicket);
        setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        toast({ title: "Status Updated", description: `Ticket ${selectedTicket.id} is now ${newStatus}.` });
    };

     const handleAssignTask = () => {
        if (!taskTitle || !taskAssignee || !taskDueDate || !selectedTicket) {
            toast({ title: 'Error', description: 'Please fill out all required task fields.', variant: 'destructive' });
            return;
        }

        const assignee = teamMembers.find(m => m.id.toString() === taskAssignee);
        if (!assignee) {
             toast({ title: 'Error', description: 'Selected assignee not found.', variant: 'destructive' });
            return;
        }

        const newTask: Task = {
            id: Date.now(),
            title: taskTitle,
            description: taskDescription,
            // Associate task with user who submitted ticket for context, not a standard client
            client: { id: 0, name: `Support (${selectedTicket.user.name})`, avatar: selectedTicket.user.avatar },
            assignedTo: { name: assignee.name, avatar: assignee.avatar },
            dueDate: taskDueDate,
            priority: taskPriority,
            status: 'To Do',
        };

        addTask(newTask);
        handleStatusChange('In Progress');
        setIsSheetOpen(false);
        resetTaskForm();

        toast({ title: 'Task Assigned!', description: `A new task has been created and assigned to ${assignee.name}.` });
    };

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LifeBuoy className="h-5 w-5 text-primary" />
                            Support Tickets
                        </CardTitle>
                        <CardDescription>View and manage all user-submitted support tickets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket ID</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Submitted By</TableHead>
                                    <TableHead>Topic</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="cursor-pointer" onClick={() => handleTicketClick(ticket)}>
                                        <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={ticket.user.avatar} />
                                                    <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{ticket.user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{ticket.topic}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                                        </TableCell>
                                        <TableCell suppressHydrationWarning>
                                            {formatDistanceToNow(new Date(ticket.lastUpdated), { addSuffix: true })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Sheet open={isSheetOpen} onOpenChange={(isOpen) => { setIsSheetOpen(isOpen); if (!isOpen) resetTaskForm(); }}>
                <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
                    {selectedTicket && (
                        <>
                            <SheetHeader className="p-6 border-b">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1.5">
                                        <SheetTitle className="text-2xl font-bold">{selectedTicket.subject}</SheetTitle>
                                        <SheetDescription>
                                            Ticket <span className="font-mono">{selectedTicket.id}</span> from {selectedTicket.userType} - {selectedTicket.topic}
                                        </SheetDescription>
                                    </div>
                                    <SheetClose asChild>
                                        <Button variant="ghost" size="icon">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </SheetClose>
                                </div>
                            </SheetHeader>
                            <div className="overflow-y-auto flex-1 p-6 space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Ticket Details</CardTitle>
                                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>Submitted by {selectedTicket.user.name} - {format(new Date(selectedTicket.lastUpdated), "PPPp")}</p>
                                        </div>
                                        <Select value={selectedTicket.status} onValueChange={(value: SupportTicket['status']) => handleStatusChange(value)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Open">Open</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{selectedTicket.description}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Assign Task</CardTitle>
                                        <CardDescription>Create a task for a team member to resolve this ticket.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="task-title">Task Title</Label>
                                            <Input id="task-title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="task-description">Task Description</Label>
                                            <Textarea id="task-description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows={4} />
                                        </div>
                                         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="task-assignee">Assign To</Label>
                                                <Select value={taskAssignee} onValueChange={setTaskAssignee}>
                                                    <SelectTrigger id="task-assignee"><SelectValue placeholder="Select member" /></SelectTrigger>
                                                    <SelectContent>{teamMembers.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="task-due-date">Due Date</Label>
                                                <Input id="task-due-date" type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="task-priority">Priority</Label>
                                                <Select value={taskPriority} onValueChange={(v: Task['priority']) => setTaskPriority(v)}>
                                                    <SelectTrigger id="task-priority"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="High">High</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="Low">Low</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <SheetFooter className="p-6 border-t shrink-0">
                                <Button className="w-full" onClick={handleAssignTask}>
                                    Assign Task & Set to In Progress <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}
