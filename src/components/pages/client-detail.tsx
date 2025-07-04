
'use client';
import { useState, useRef } from "react";
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Client, Task } from "@/lib/data";
import { CalendarCheck, FileText, MessageSquare, X, Download, Eye, Upload, CheckSquare, Plus, FilePlus, Trash2, Phone, Mail, Users } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentCategories, documents as documentTemplates, activityTypes } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useGlobalData } from "@/context/GlobalDataContext";

const activityIcons: { [key: string]: React.ElementType } = {
    "Application Submitted": FileText,
    "New Message": MessageSquare,
    "Email Sent": Mail,
    "Appointment Completed": CalendarCheck,
    "New Task Created": CheckSquare,
    "Call": Phone,
    "Meeting": Users,
    "Note": MessageSquare,
    "Document Uploaded": Upload,
};

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active client': return 'success';
        case 'work permit': return 'info';
        case 'pending review': return 'warning';
        case 'high': return 'destructive';
        default: return 'secondary';
    }
};

const getDocumentStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'approved': return 'success' as const;
        case 'uploaded': return 'info' as const;
        case 'pending review': return 'warning' as const;
        case 'rejected': return 'destructive' as const;
        case 'requested': return 'secondary' as const;
        default: return 'secondary' as const;
    }
};

const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'high': return 'destructive' as const;
        case 'medium': return 'warning' as const;
        case 'low': return 'secondary' as const;
        default: return 'default' as const;
    }
};

const getTaskStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'success' as const;
        case 'in progress': return 'info' as const;
        case 'to do': return 'warning' as const;
        default: return 'secondary' as const;
    }
};

interface ClientDetailSheetProps {
    client: Client;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onUpdateClient: (updatedClient: Client) => void;
}

export function ClientDetailSheet({ client, isOpen, onOpenChange, onUpdateClient }: ClientDetailSheetProps) {
    const { toast } = useToast();
    const pathname = usePathname();
    const { teamMembers: allTeamMembers } = useGlobalData();

    const assignableMembers = pathname.startsWith('/admin')
        ? allTeamMembers.filter(member => member.type === 'sales' || member.type === 'advisor')
        : allTeamMembers.filter(member => member.type === 'legal');
        
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [isAssignDialogOpen, setAssignDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingDocId, setDeletingDocId] = useState<number | null>(null);
    const [isLogActivityDialogOpen, setLogActivityDialogOpen] = useState(false);
    
    const [newDocTitle, setNewDocTitle] = useState("");
    const [newDocCategory, setNewDocCategory] = useState("");
    const [assignedDocTemplate, setAssignedDocTemplate] = useState("");

    const [isAddTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskAssignee, setNewTaskAssignee] = useState("");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('Medium');

    const [newActivityType, setNewActivityType] = useState("");
    const [newActivityNotes, setNewActivityNotes] = useState("");
    const [newActivityDate, setNewActivityDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [createFollowUpTask, setCreateFollowUpTask] = useState(false);
    const [followUpTaskTitle, setFollowUpTaskTitle] = useState("");
    const [followUpTaskDescription, setFollowUpTaskDescription] = useState("");
    const [followUpTaskAssignee, setFollowUpTaskAssignee] = useState("");
    const [followUpTaskDueDate, setFollowUpTaskDueDate] = useState("");
    const [followUpTaskPriority, setFollowUpTaskPriority] = useState<Task['priority']>('Medium');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);

    const communications = client.activity.filter(item => item.title.includes("Message") || item.title.includes("Email"));

    const handleAdHocUpload = () => {
        if (!newDocTitle || !newDocCategory) {
            toast({ title: 'Error', description: 'Please fill out all fields.', variant: 'destructive' });
            return;
        }

        const newDocument = {
            id: Date.now(),
            title: newDocTitle,
            category: newDocCategory,
            dateAdded: new Date().toISOString().split('T')[0],
            status: 'Uploaded' as const,
        };

        const updatedClient = {
            ...client,
            documents: [...(client.documents || []), newDocument],
        };

        onUpdateClient(updatedClient);
        setUploadDialogOpen(false);
        setNewDocTitle("");
        setNewDocCategory("");
        toast({ title: 'Success', description: 'Document uploaded successfully.' });
    };

    const handleAssignDocument = () => {
        if (!assignedDocTemplate) {
            toast({ title: 'Error', description: 'Please select a document template.', variant: 'destructive' });
            return;
        }
        const template = documentTemplates.find(t => t.id.toString() === assignedDocTemplate);
        if (!template) {
             toast({ title: 'Error', description: 'Selected template not found.', variant: 'destructive' });
            return;
        }
        const newDocument = {
            id: Date.now(),
            title: template.title,
            category: template.category,
            dateAdded: new Date().toISOString().split('T')[0],
            status: 'Requested' as const,
        };
         const updatedClient = {
            ...client,
            documents: [...(client.documents || []), newDocument],
        };
        onUpdateClient(updatedClient);
        setAssignDialogOpen(false);
        setAssignedDocTemplate("");
        toast({ title: 'Success', description: `"${template.title}" has been requested from the client.` });
    };
    
    const handleUploadActionClick = (docId: number) => {
        setUploadingDocId(docId);
        fileInputRef.current?.click();
    };

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && uploadingDocId) {
            const file = event.target.files[0];
            const updatedClient = {
                ...client,
                documents: client.documents.map(doc => 
                    doc.id === uploadingDocId 
                    ? { ...doc, status: 'Uploaded' as const, dateAdded: new Date().toISOString().split('T')[0] }
                    : doc
                )
            };
            onUpdateClient(updatedClient);
            toast({ title: 'Upload Successful', description: `${file.name} has been uploaded.` });
        }
        setUploadingDocId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

     const handleAddTask = () => {
        if (!newTaskTitle || !newTaskAssignee || !newTaskDueDate) {
            toast({ title: 'Error', description: 'Please fill out all fields.', variant: 'destructive' });
            return;
        }

        const assignee = allTeamMembers.find(m => m.id.toString() === newTaskAssignee);

        if (!assignee) {
             toast({ title: 'Error', description: 'Selected assignee not found.', variant: 'destructive' });
            return;
        }

        const newTask: Task = {
            id: Date.now(),
            title: newTaskTitle,
            description: newTaskDescription,
            client: { id: client.id, name: client.name, avatar: client.avatar },
            assignedTo: { name: assignee.name, avatar: assignee.avatar },
            dueDate: newTaskDueDate,
            priority: newTaskPriority,
            status: 'To Do',
        };

        const updatedClient: Client = {
            ...client,
            tasks: [...client.tasks, newTask],
            activity: [
                {
                    id: Date.now(),
                    title: 'New Task Created',
                    description: `Task "${newTaskTitle}" assigned to ${assignee.name}.`,
                    timestamp: new Date().toISOString(),
                },
                ...client.activity,
            ],
        };

        onUpdateClient(updatedClient);
        setAddTaskDialogOpen(false);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskAssignee('');
        setNewTaskDueDate('');
        setNewTaskPriority('Medium');
        toast({ title: 'Success', description: 'Task added successfully.' });
    };

    const handleDeleteClick = (docId: number) => {
        setDeletingDocId(docId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deletingDocId) return;

        const updatedClient = {
            ...client,
            documents: client.documents.filter(doc => doc.id !== deletingDocId),
        };

        onUpdateClient(updatedClient);
        setDeleteDialogOpen(false);
        setDeletingDocId(null);
        toast({ title: 'Success', description: 'Document deleted successfully.' });
    };

    const handleLogActivity = () => {
        if (!newActivityType || !newActivityNotes) {
            toast({ title: 'Error', description: 'Please select an activity type and enter notes.', variant: 'destructive' });
            return;
        }

        let updatedClient = { ...client };
        const activitiesToAdd = [];

        // Create main activity
        const activityTimestamp = new Date(newActivityDate).toISOString();
        const newActivity = {
            id: Date.now(),
            title: activityTypes.find(t => t.id === newActivityType)?.label || "Activity",
            description: newActivityNotes,
            timestamp: activityTimestamp,
            teamMember: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
        };
        activitiesToAdd.push(newActivity);

        // Handle follow-up task creation
        if (createFollowUpTask) {
            if (!followUpTaskTitle || !followUpTaskAssignee || !followUpTaskDueDate) {
                toast({ title: 'Error', description: 'Please fill out all fields for the follow-up task.', variant: 'destructive' });
                return;
            }
            const assignee = allTeamMembers.find(m => m.id.toString() === followUpTaskAssignee);
            if (!assignee) {
                toast({ title: 'Error', description: 'Selected assignee not found for task.', variant: 'destructive' });
                return;
            }

            const newTask: Task = {
                id: Date.now() + 1, // ensure unique id
                title: followUpTaskTitle,
                description: followUpTaskDescription,
                client: { id: client.id, name: client.name, avatar: client.avatar },
                assignedTo: { name: assignee.name, avatar: assignee.avatar },
                dueDate: followUpTaskDueDate,
                priority: followUpTaskPriority,
                status: 'To Do',
            };
            
            const taskActivity = {
                id: Date.now() + 2,
                title: 'New Task Created',
                description: `Task "${newTask.title}" assigned to ${assignee.name}.`,
                timestamp: new Date().toISOString(),
                teamMember: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
            };
            
            updatedClient = {
                ...updatedClient,
                tasks: [...updatedClient.tasks, newTask],
            };
            activitiesToAdd.push(taskActivity);
        }
        
        updatedClient = {
            ...updatedClient,
            activity: [...activitiesToAdd, ...updatedClient.activity],
        };

        onUpdateClient(updatedClient);
        
        // Reset state and close dialog
        setLogActivityDialogOpen(false);
        setNewActivityType("");
        setNewActivityNotes("");
        setNewActivityDate(format(new Date(), 'yyyy-MM-dd'));
        setCreateFollowUpTask(false);
        setFollowUpTaskTitle("");
        setFollowUpTaskDescription("");
        setFollowUpTaskAssignee("");
        setFollowUpTaskDueDate("");
        setFollowUpTaskPriority("Medium");

        toast({ title: 'Success', description: 'Activity logged successfully.' });
    };


    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-3xl p-0">
                <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" />
                <SheetHeader className="p-6 border-b">
                    <div className="flex justify-between items-start">
                         <SheetTitle className="text-2xl font-bold">Client Details</SheetTitle>
                         <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>
                <div className="p-6 overflow-y-auto h-[calc(100vh-73px)]">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                            <AvatarImage src={client.avatar} alt={client.name} />
                            <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <h2 className="text-2xl font-bold">{client.name}</h2>
                                <Badge variant={getStatusBadgeVariant('active client')}>Active Client</Badge>
                                <Badge variant={getStatusBadgeVariant('work permit')}>{client.caseType}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{client.email} • {client.phone}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Country of Origin</p>
                                    <p className="font-medium">{client.countryOfOrigin}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Current Location</p>
                                    <p className="font-medium">{client.currentLocation}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Joined</p>
                                    <p className="font-medium">{format(new Date(client.joined), 'PP')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="mt-6">
                        <div className="flex justify-between items-center border-b">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                <TabsTrigger value="communications">Communications</TabsTrigger>
                            </TabsList>
                            <Button variant="outline" size="sm" onClick={() => setLogActivityDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Log Activity
                            </Button>
                        </div>
                        <TabsContent value="overview" className="mt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Case Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Priority</p>
                                            <p className="font-bold text-base">{client.caseSummary.priority}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Case Type</p>
                                            <p className="font-semibold">{client.caseSummary.caseType}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Current Status</p>
                                            <Badge variant={getStatusBadgeVariant(client.caseSummary.currentStatus)}>{client.caseSummary.currentStatus}</Badge>
                                        </div>
                                         <div>
                                            <p className="text-muted-foreground">Next Step</p>
                                            <p className="font-semibold">{client.caseSummary.nextStep}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Due Date</p>
                                            <p className="font-semibold">{client.caseSummary.dueDate}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2">
                                     <CardHeader>
                                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {client.activity.slice(0,3).map((item, index) => {
                                                const Icon = activityIcons[item.title] || FileText;
                                                return (
                                                    <div key={index} className="flex items-start gap-4">
                                                        <div className="bg-muted p-3 rounded-full">
                                                            <Icon className="h-5 w-5 text-primary"/>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <p className="font-semibold">{item.title}</p>
                                                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                            <Button variant="link" className="p-0 h-auto text-sm">
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Button variant="outline" className="w-full mt-6">View All Activity</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                         <TabsContent value="documents" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg">Client Documents</CardTitle>
                                            <CardDescription>All documents uploaded by or for the client.</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setAssignDialogOpen(true)}>
                                                <FilePlus className="mr-2 h-4 w-4" /> Assign Document
                                            </Button>
                                            <Button onClick={() => setUploadDialogOpen(true)}>
                                                <Upload className="mr-2 h-4 w-4" /> Upload Document
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {client.documents && client.documents.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Document Title</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Date Added</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {client.documents.map((doc) => (
                                                    <TableRow key={doc.id}>
                                                        <TableCell className="font-medium">{doc.title}</TableCell>
                                                        <TableCell>{doc.category}</TableCell>
                                                        <TableCell>{format(new Date(doc.dateAdded), 'PP')}</TableCell>
                                                        <TableCell><Badge variant={getDocumentStatusBadgeVariant(doc.status)}>{doc.status}</Badge></TableCell>
                                                        <TableCell className="text-right space-x-1">
                                                             {doc.status === 'Requested' ? (
                                                                <Button size="sm" onClick={() => handleUploadActionClick(doc.id)}>
                                                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                                                </>
                                                            )}
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(doc.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FileText className="mx-auto h-8 w-8 mb-2" />
                                            <p>No documents uploaded yet.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="tasks" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg">Client Tasks</CardTitle>
                                            <CardDescription>All tasks associated with {client.name}.</CardDescription>
                                        </div>
                                        <Button onClick={() => setAddTaskDialogOpen(true)}>
                                            <Plus className="mr-2 h-4 w-4" /> Add Task
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {client.tasks && client.tasks.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Task</TableHead>
                                                    <TableHead>Assigned To</TableHead>
                                                    <TableHead>Due Date</TableHead>
                                                    <TableHead>Priority</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {client.tasks.map((task) => (
                                                    <TableRow key={task.id}>
                                                        <TableCell>
                                                            <div className="font-medium">{task.title}</div>
                                                            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={task.assignedTo.avatar} />
                                                                    <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                {task.assignedTo.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{format(new Date(task.dueDate), 'PP')}</TableCell>
                                                        <TableCell><Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge></TableCell>
                                                        <TableCell><Badge variant={getTaskStatusBadgeVariant(task.status)}>{task.status}</Badge></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <CheckSquare className="mx-auto h-8 w-8 mb-2" />
                                            <p>No tasks assigned for this client yet.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="timeline" className="mt-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Case Timeline</CardTitle>
                                    <CardDescription>A chronological history of all activities related to this case.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative pl-6 before:absolute before:inset-y-0 before:w-px before:bg-border before:left-0">
                                        {client.activity.map((item, index) => {
                                            const Icon = activityIcons[item.title] || FileText;
                                            return (
                                                <div key={item.id} className="relative pl-8 py-4 first:pt-0 last:pb-0">
                                                    <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background flex items-center justify-center">
                                                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                                            <Icon className="h-3 w-3 text-primary" />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className="font-medium">{item.title}</h4>
                                                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    {item.teamMember && (
                                                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                                                            Logged by
                                                            <Avatar className="h-4 w-4">
                                                                <AvatarImage src={item.teamMember.avatar} alt={item.teamMember.name} />
                                                                <AvatarFallback>{item.teamMember.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {item.teamMember.name}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="communications" className="mt-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Communication Log</CardTitle>
                                    <CardDescription>A record of all messages and emails with the client.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {communications.length > 0 ? (
                                        communications.map((item, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                                                <div className="bg-muted p-3 rounded-full">
                                                    <MessageSquare className="h-5 w-5 text-primary"/>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-semibold">{item.title}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                                            <p>No communications logged yet.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Ad-hoc Upload Dialog */}
                <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                            <DialogDescription>Add a new document to {client.name}'s profile.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="doc-title">Document Title</Label>
                                <Input id="doc-title" value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} placeholder="e.g., Passport Bio Page" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doc-category">Category</Label>
                                <Select value={newDocCategory} onValueChange={setNewDocCategory}>
                                    <SelectTrigger id="doc-category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {documentCategories.filter(c => c.name !== 'All Documents').map(cat => (
                                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doc-file">File</Label>
                                <Input id="doc-file" type="file" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdHocUpload}>Upload</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Assign Document Dialog */}
                <Dialog open={isAssignDialogOpen} onOpenChange={setAssignDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Assign Document</DialogTitle>
                            <DialogDescription>Request a document from {client.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="doc-template">Document Template</Label>
                                <Select value={assignedDocTemplate} onValueChange={setAssignedDocTemplate}>
                                    <SelectTrigger id="doc-template">
                                        <SelectValue placeholder="Select a document template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {documentTemplates.map(template => (
                                            <SelectItem key={template.id} value={template.id.toString()}>{template.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doc-notes">Notes for Client (Optional)</Label>
                                <Input id="doc-notes" placeholder="e.g., Please provide all pages" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAssignDocument}>Assign & Request</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Task Dialog */}
                <Dialog open={isAddTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>Assign a new task for {client.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="task-title">Task Title</Label>
                                <Input id="task-title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="e.g., Follow up on RFE" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="task-description">Description (Optional)</Label>
                                <Textarea id="task-description" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} placeholder="Add more details about the task..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="task-assignee">Assign To</Label>
                                <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                                    <SelectTrigger id="task-assignee">
                                        <SelectValue placeholder="Select a team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignableMembers.map(member => (
                                            <SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>
                                        ))}
                                    </SelectContent>
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
                                        <SelectTrigger id="task-priority">
                                            <SelectValue />
                                        </SelectTrigger>
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
                            <Button variant="outline" onClick={() => setAddTaskDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddTask}>Add Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Log Activity Dialog */}
                <Dialog open={isLogActivityDialogOpen} onOpenChange={setLogActivityDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Log Activity</DialogTitle>
                            <DialogDescription>Log an activity for {client.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="activity-type">Activity Type</Label>
                                    <Select value={newActivityType} onValueChange={setNewActivityType}>
                                        <SelectTrigger id="activity-type">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activityTypes.map(type => (
                                                <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="activity-date">Date</Label>
                                    <Input id="activity-date" type="date" value={newActivityDate} onChange={(e) => setNewActivityDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activity-notes">Notes</Label>
                                <Textarea id="activity-notes" value={newActivityNotes} onChange={(e) => setNewActivityNotes(e.target.value)} placeholder="Add notes about the activity..." />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id="follow-up" checked={createFollowUpTask} onCheckedChange={(checked) => setCreateFollowUpTask(Boolean(checked))} />
                                <Label htmlFor="follow-up" className="font-normal">Create a follow-up task</Label>
                            </div>
                            {createFollowUpTask && (
                                <div className="space-y-4 pt-4 border-t animate-fade">
                                    <h4 className="font-medium text-sm">New Follow-up Task</h4>
                                     <div className="space-y-2">
                                        <Label htmlFor="follow-up-title">Task Title</Label>
                                        <Input id="follow-up-title" value={followUpTaskTitle} onChange={(e) => setFollowUpTaskTitle(e.target.value)} placeholder="e.g., Follow up on RFE" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="follow-up-description">Description (Optional)</Label>
                                        <Textarea id="follow-up-description" value={followUpTaskDescription} onChange={(e) => setFollowUpTaskDescription(e.target.value)} placeholder="Add more details..." />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="follow-up-assignee">Assign To</Label>
                                        <Select value={followUpTaskAssignee} onValueChange={setFollowUpTaskAssignee}>
                                            <SelectTrigger id="follow-up-assignee">
                                                <SelectValue placeholder="Select a team member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {assignableMembers.map(member => (
                                                    <SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="follow-up-due-date">Due Date</Label>
                                            <Input id="follow-up-due-date" type="date" value={followUpTaskDueDate} onChange={(e) => setFollowUpTaskDueDate(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                             <Label htmlFor="follow-up-priority">Priority</Label>
                                            <Select value={followUpTaskPriority} onValueChange={(v: Task['priority']) => setFollowUpTaskPriority(v)}>
                                                <SelectTrigger id="follow-up-priority">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="High">High</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="Low">Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setLogActivityDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleLogActivity}>Log Activity</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the document
                                "{client.documents.find(d => d.id === deletingDocId)?.title}" from the client's profile.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeletingDocId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </SheetContent>
        </Sheet>
    );
}
