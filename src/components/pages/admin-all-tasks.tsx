'use client';
import { useState } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGlobalData } from '@/context/GlobalDataContext';
import type { Task } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export function AdminAllTasksPage() {
    const { tasks, addTask, clients, teamMembers } = useGlobalData();
    const { toast } = useToast();
    
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskClient, setNewTaskClient] = useState("");
    const [newTaskAssignee, setNewTaskAssignee] = useState("");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('Medium');

    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [assigneeFilter, setAssigneeFilter] = useState('all');

    const salesTeam = teamMembers.filter(member => member.type === 'sales' || member.type === 'advisor');

    const handleAddTask = () => {
        if (!newTaskTitle || !newTaskClient || !newTaskAssignee || !newTaskDueDate) {
            toast({ title: 'Error', description: 'Please fill out all fields.', variant: 'destructive' });
            return;
        }

        const client = clients.find(c => c.id.toString() === newTaskClient);
        const assignee = teamMembers.find(m => m.id.toString() === newTaskAssignee);

        if (!client || !assignee) {
            toast({ title: 'Error', description: 'Selected client or assignee not found.', variant: 'destructive' });
            return;
        }

        const newTask: Task = {
            id: Date.now(),
            title: newTaskTitle,
            client: { id: client.id, name: client.name, avatar: client.avatar },
            assignedTo: { name: assignee.name, avatar: assignee.avatar },
            dueDate: newTaskDueDate,
            priority: newTaskPriority,
            status: 'To Do',
        };

        addTask(newTask);
        setAddDialogOpen(false);
        setNewTaskTitle('');
        setNewTaskClient('');
        setNewTaskAssignee('');
        setNewTaskDueDate('');
        setNewTaskPriority('Medium');
        toast({ title: 'Success', description: 'Task added successfully.' });
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            case 'low': return 'secondary';
            default: return 'default';
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'in progress': return 'info';
            case 'to do': return 'warning';
            default: return 'secondary';
        }
    };

    const filteredTasks = tasks.filter(task => {
        const statusMatch = statusFilter === 'all' || task.status.toLowerCase() === statusFilter.toLowerCase();
        const priorityMatch = priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
        const assigneeMatch = assigneeFilter === 'all' || task.assignedTo.name === assigneeFilter;
        return statusMatch && priorityMatch && assigneeMatch;
    });

    const assignees = ['all', ...teamMembers.map(m => m.name)];

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="font-headline">All Platform Tasks</CardTitle>
                            <CardDescription>Monitor and manage all tasks across the platform.</CardDescription>
                        </div>
                        <Button onClick={() => setAddDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </div>
                    <div className="flex gap-4 pt-4 flex-wrap">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                {assignees.map(assignee => (
                                    <SelectItem key={assignee} value={assignee}>{assignee === 'all' ? 'All Assignees' : assignee}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">{task.title}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={task.client.avatar} alt={task.client.name} />
                                                    <AvatarFallback>{task.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{task.client.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                                                    <AvatarFallback>{task.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{task.assignedTo.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{format(new Date(task.dueDate), 'PP')}</TableCell>
                                        <TableCell>
                                            <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Task</DropdownMenuItem>
                                                    <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                                                    <DropdownMenuItem>Reassign Task</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>Assign a new task to a team member.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="task-title">Task Title</Label>
                            <Input id="task-title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="e.g., Follow up on RFE" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="task-client">Client</Label>
                            <Select value={newTaskClient} onValueChange={setNewTaskClient}>
                                <SelectTrigger id="task-client"><SelectValue placeholder="Select a client" /></SelectTrigger>
                                <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="task-assignee">Assign To</Label>
                            <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                                <SelectTrigger id="task-assignee"><SelectValue placeholder="Select a sales team member" /></SelectTrigger>
                                <SelectContent>{salesTeam.map(member => (<SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="task-due-date">Due Date</Label>
                                <Input id="task-due-date" type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="task-priority">Priority</Label>
                                <Select value={newTaskPriority} onValueChange={(v: Task['priority']) => setNewTaskPriority(v)}>
                                    <SelectTrigger id="task-priority"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddTask}>Add Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
