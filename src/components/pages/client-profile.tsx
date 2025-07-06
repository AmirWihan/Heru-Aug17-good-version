'use client';
import { useState, useRef, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Client, Task, Agreement, IntakeForm, IntakeFormAnalysis } from "@/lib/data";
import { CalendarCheck, FileText, MessageSquare, Download, Eye, Upload, CheckSquare, Plus, FilePlus, Trash2, Phone, Mail, Users, Sparkles, BrainCircuit, Loader2, AlertTriangle, Handshake, Landmark, Edit, FileHeart, AlertCircle, Flag } from "lucide-react";
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
import { predictSuccess, SuccessPredictorOutput } from '@/ai/flows/success-predictor';
import { cn } from "@/lib/utils";
import { getCaseTimeline, type CaseTimelineOutput } from "@/ai/flows/case-timeline-flow";
import { CaseTimeline } from "@/components/case-timeline";

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
        case 'active':
        case 'active client': 
            return 'success';
        case 'work permit': return 'info';
        case 'pending review': return 'warning';
        case 'high': return 'destructive';
        case 'on-hold': return 'warning';
        case 'closed': return 'secondary';
        case 'blocked': return 'destructive';
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

const getInvoiceStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid': return 'success';
        case 'overdue': return 'destructive';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
};

interface ClientProfileProps {
    client: Client;
    onUpdateClient: (updatedClient: Client) => void;
}

export function ClientProfile({ client, onUpdateClient }: ClientProfileProps) {
    const { toast } = useToast();
    const pathname = usePathname();
    const isAdminView = pathname.startsWith('/admin');
    const { teamMembers: allTeamMembers, addTask, invoicesData } = useGlobalData();

    const assignableMembers = isAdminView
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
    const [newActivityDate, setNewActivityDate] = useState("");
    const [createFollowUpTask, setCreateFollowUpTask] = useState(false);
    const [followUpTaskTitle, setFollowUpTaskTitle] = useState("");
    const [followUpTaskDescription, setFollowUpTaskDescription] = useState("");
    const [followUpTaskAssignee, setFollowUpTaskAssignee] = useState("");
    const [followUpTaskDueDate, setFollowUpTaskDueDate] = useState("");
    const [followUpTaskPriority, setFollowUpTaskPriority] = useState<Task['priority']>('Medium');
    
    const [isAgreementDialogOpen, setAgreementDialogOpen] = useState(false);
    const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);
    const [agreementTitle, setAgreementTitle] = useState('');
    const [agreementStatus, setAgreementStatus] = useState<Agreement['status']>('Active');
    const [agreementDate, setAgreementDate] = useState('');

    const [generatingDocs, setGeneratingDocs] = useState(false);
    const [generatedDocs, setGeneratedDocs] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SuccessPredictorOutput | null>(null);

    const communications = (client.activity || []).filter(item => item.title.includes("Message") || item.title.includes("Email"));

    const [timelineData, setTimelineData] = useState<CaseTimelineOutput['timeline'] | null>(null);
    const [isTimelineLoading, setIsTimelineLoading] = useState(true);
    const [timelineError, setTimelineError] = useState<string | null>(null);

    useEffect(() => {
        setAnalysisResult(client.analysis || null);
    }, [client]);

    useEffect(() => {
        async function fetchTimeline() {
            if (!client) return;
            setIsTimelineLoading(true);
            setTimelineError(null);
            try {
                const response = await getCaseTimeline({
                    visaType: client.caseSummary.caseType,
                    currentStage: client.caseSummary.currentStatus,
                    countryOfOrigin: client.countryOfOrigin,
                });
                setTimelineData(response.timeline);
            } catch (err) {
                console.error("Failed to fetch timeline:", err);
                setTimelineError("Could not generate the projected timeline. Please try again later.");
                toast({
                    title: "Timeline Error",
                    description: "Failed to generate the case timeline.",
                    variant: "destructive",
                });
            } finally {
                setIsTimelineLoading(false);
            }
        }
        fetchTimeline();
    }, [client, toast]);

    useEffect(() => {
        if (isLogActivityDialogOpen) {
            setNewActivityDate(format(new Date(), 'yyyy-MM-dd'));
        }
    }, [isLogActivityDialogOpen]);
    
    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await predictSuccess({
                visaType: client.caseSummary.caseType,
                countryOfOrigin: client.countryOfOrigin,
                age: client.age,
                educationLevel: client.educationLevel,
            });
            setAnalysisResult(result);
            onUpdateClient({ ...client, analysis: result });
        } catch (error) {
            console.error("Analysis failed:", error);
            toast({
                title: "Analysis Failed",
                description: "Could not get a prediction at this time. Please try again later.",
                variant: "destructive",
            });
        }
        setIsAnalyzing(false);
    };

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
                documents: (client.documents || []).map(doc => 
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
        
        addTask(newTask);

        const updatedClient: Client = {
            ...client,
            tasks: [...(client.tasks || []), newTask],
            activity: [
                {
                    id: Date.now(),
                    title: 'New Task Created',
                    description: `Task "${newTaskTitle}" assigned to ${assignee.name}.`,
                    timestamp: new Date().toISOString(),
                },
                ...(client.activity || []),
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
            documents: (client.documents || []).filter(doc => doc.id !== deletingDocId),
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

        const activityTimestamp = new Date(newActivityDate).toISOString();
        const newActivity = {
            id: Date.now(),
            title: activityTypes.find(t => t.id === newActivityType)?.label || "Activity",
            description: newActivityNotes,
            timestamp: activityTimestamp,
            teamMember: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
        };
        activitiesToAdd.push(newActivity);

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
                id: Date.now() + 1,
                title: followUpTaskTitle,
                description: followUpTaskDescription,
                client: { id: client.id, name: client.name, avatar: client.avatar },
                assignedTo: { name: assignee.name, avatar: assignee.avatar },
                dueDate: followUpTaskDueDate,
                priority: followUpTaskPriority,
                status: 'To Do',
            };
            
            addTask(newTask);
            
            const taskActivity = {
                id: Date.now() + 2,
                title: 'New Task Created',
                description: `Task "${newTask.title}" assigned to ${assignee.name}.`,
                timestamp: new Date().toISOString(),
                teamMember: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
            };
            
            updatedClient = {
                ...updatedClient,
                tasks: [...(updatedClient.tasks || []), newTask],
            };
            activitiesToAdd.push(taskActivity);
        }
        
        updatedClient = {
            ...updatedClient,
            activity: [...activitiesToAdd, ...(updatedClient.activity || [])],
        };

        onUpdateClient(updatedClient);
        
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
    
    const handleStatusChange = (newStatus: Client['status']) => {
        onUpdateClient({ ...client, status: newStatus });
        toast({ title: 'Status Updated', description: `${client.name}'s status is now ${newStatus}.` });
    };

    const handleOpenAgreementDialog = (agreement: Agreement | null) => {
        setEditingAgreement(agreement);
        if (agreement) {
            setAgreementTitle(agreement.title);
            setAgreementStatus(agreement.status);
            setAgreementDate(format(new Date(agreement.dateSigned), 'yyyy-MM-dd'));
        } else {
            setAgreementTitle('');
            setAgreementStatus('Active');
            setAgreementDate(format(new Date(), 'yyyy-MM-dd'));
        }
        setAgreementDialogOpen(true);
    };

    const handleSaveAgreement = () => {
        if (!agreementTitle || !agreementDate) {
            toast({ title: 'Error', description: 'Title and date are required.', variant: 'destructive' });
            return;
        }

        let updatedAgreements;
        if (editingAgreement) {
            updatedAgreements = (client.agreements || []).map(a =>
                a.id === editingAgreement.id
                    ? { ...a, title: agreementTitle, status: agreementStatus, dateSigned: agreementDate }
                    : a
            );
            toast({ title: 'Agreement Updated', description: `Agreement "${agreementTitle}" has been updated.` });
        } else {
            const newAgreement: Agreement = {
                id: Date.now(),
                title: agreementTitle,
                status: agreementStatus,
                dateSigned: agreementDate,
                relatedDocuments: [],
                relatedInvoiceIds: [],
            };
            updatedAgreements = [...(client.agreements || []), newAgreement];
            toast({ title: 'Agreement Added', description: `New agreement "${agreementTitle}" has been added.` });
        }

        onUpdateClient({ ...client, agreements: updatedAgreements });
        setAgreementDialogOpen(false);
        setEditingAgreement(null);
    };

    const handleAcceptAndGenerate = () => {
        setGeneratingDocs(true);
        setTimeout(() => {
            setGeneratedDocs([
                'Generic Application Form for Canada (IMM 0008)',
                'Additional Dependants/Declaration (IMM 0008DEP)',
                'Schedule A – Background/Declaration (IMM 5669)',
                'Additional Family Information (IMM 5406)',
                'Use of a Representative (IMM 5476)',
            ]);
            onUpdateClient({ ...client, intakeForm: { ...client.intakeForm!, status: 'reviewed' } });
            setGeneratingDocs(false);
            toast({ title: 'Documents Generated!', description: 'The official forms have been filled and are ready for review.' });
        }, 2000);
    };


    return (
        <>
            <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" />
            
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <h2 className="text-2xl font-bold">{client.name}</h2>
                        <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
                        <Badge variant={getStatusBadgeVariant(client.caseType)}>{client.caseType}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">{client.email} • {client.phone}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Country of Origin</p>
                            <p className="font-medium">{client.countryOfOrigin}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Current Location</p>
                            <p className="font-medium">{client.currentLocation}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Age</p>
                            <p className="font-medium">{client.age}</p>
                        </div>
                        <div>
                            <p suppressHydrationWarning className="text-muted-foreground">Joined</p>
                            <p suppressHydrationWarning className="font-medium">{format(new Date(client.joined), 'PP')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="mt-6">
                <div className="flex justify-between items-center border-b">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="agreements">Agreements</TabsTrigger>
                        <TabsTrigger value="intake-form">Intake Form</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="communications">Communications</TabsTrigger>
                        {isAdminView && <TabsTrigger value="manage">Manage Client</TabsTrigger>}
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
                                    <p className="text-muted-foreground">Education</p>
                                    <p className="font-semibold">{client.educationLevel}</p>
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
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BrainCircuit className="h-5 w-5 text-primary" />
                                        AI Success Predictor
                                    </CardTitle>
                                    <CardDescription>
                                        An AI-powered analysis of this profile based on current immigration trends.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isAnalyzing ? (
                                        <div className="flex items-center justify-center h-24">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <p className="ml-4 text-muted-foreground">Analyzing profile...</p>
                                        </div>
                                    ) : analysisResult ? (
                                        <div className="flex flex-col md:flex-row items-center gap-6 animate-fade">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-sm text-muted-foreground">Success Probability</p>
                                                <p className={cn(
                                                    "text-6xl font-bold",
                                                    analysisResult.scoreLabel === 'Green' && 'text-green-500',
                                                    analysisResult.scoreLabel === 'Yellow' && 'text-yellow-500',
                                                    analysisResult.scoreLabel === 'Red' && 'text-red-500'
                                                )}>
                                                    {analysisResult.successProbability}%
                                                </p>
                                                <Badge variant={
                                                    analysisResult.scoreLabel === 'Green' ? 'success' :
                                                    analysisResult.scoreLabel === 'Yellow' ? 'warning' :
                                                    'destructive'
                                                }>
                                                    {analysisResult.scoreLabel}
                                                </Badge>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <p className="font-semibold">Justification:</p>
                                                <p className="text-muted-foreground text-sm">{analysisResult.reason}</p>
                                                <p className="text-xs text-muted-foreground/80 pt-2 italic">Disclaimer: This is an AI-powered estimation and not a guarantee of success. It should be used for advisory purposes only.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-muted-foreground mb-4">Click to run an AI analysis on the client's profile to predict the application outcome.</p>
                                            <Button onClick={handleAnalyze}>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Analyze Success Probability
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {(client.activity || []).slice(0,2).map((item, index) => {
                                            const Icon = activityIcons[item.title] || FileText;
                                            return (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div className="bg-muted p-3 rounded-full">
                                                        <Icon className="h-5 w-5 text-primary"/>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold">{item.title}</p>
                                                            <p suppressHydrationWarning className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
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
                            {(client.documents || []).length > 0 ? (
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
                                        {(client.documents || []).map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">{doc.title}</TableCell>
                                                <TableCell>{doc.category}</TableCell>
                                                <TableCell suppressHydrationWarning>{format(new Date(doc.dateAdded), 'PP')}</TableCell>
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
                <TabsContent value="agreements" className="mt-4">
                     <Card>
                        <CardHeader className="flex-row justify-between items-center">
                            <div>
                                <CardTitle>Client Agreements</CardTitle>
                                <CardDescription>Manage retainer agreements and linked documents.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenAgreementDialog(null)}>
                                <FilePlus className="mr-2 h-4 w-4" />
                                Add New Agreement
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(client.agreements || []).length > 0 ? (
                                (client.agreements || []).map(agreement => (
                                    <Card key={agreement.id} className="overflow-hidden">
                                        <CardHeader className="bg-muted/50 flex-row justify-between items-center py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Handshake className="h-5 w-5 text-primary" />
                                                <div>
                                                    <h3 className="font-semibold">{agreement.title}</h3>
                                                    <p className="text-xs text-muted-foreground">Signed on {format(new Date(agreement.dateSigned), 'PP')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getStatusBadgeVariant(agreement.status)}>{agreement.status}</Badge>
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenAgreementDialog(agreement)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-4">
                                             <div>
                                                <h4 className="font-semibold text-sm mb-2">Related Documents</h4>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Document</TableHead>
                                                                <TableHead className="text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">Signed Agreement</TableCell>
                                                                <TableCell className="text-right space-x-1">
                                                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                                                </TableCell>
                                                            </TableRow>
                                                            {(agreement.relatedDocuments || []).map(doc => (
                                                                <TableRow key={doc.id}>
                                                                    <TableCell className="font-medium">{doc.title}</TableCell>
                                                                    <TableCell className="text-right space-x-1">
                                                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <Button variant="outline" className="w-full mt-2"><Upload className="mr-2 h-4 w-4"/> Upload Supporting Document</Button>
                                            </div>
                                             <div>
                                                <h4 className="font-semibold text-sm mb-2">Linked Invoices</h4>
                                                <div className="space-y-2">
                                                    {(agreement.relatedInvoiceIds || []).length > 0 ? agreement.relatedInvoiceIds.map(invoiceId => {
                                                        const invoice = invoicesData.find(i => i.invoiceNumber === invoiceId);
                                                        return invoice ? (
                                                            <div key={invoice.id} className="flex items-center justify-between p-2 rounded-lg border">
                                                                <div>
                                                                    <p className="font-medium text-sm">Invoice {invoice.invoiceNumber} - ${invoice.amount.toLocaleString()}</p>
                                                                </div>
                                                                <Badge variant={getInvoiceStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                                            </div>
                                                        ) : null
                                                    }) : (
                                                        <p className="text-center text-xs text-muted-foreground py-2">No invoices linked.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Handshake className="mx-auto h-8 w-8 mb-2" />
                                    <p>No agreements found for this client.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="intake-form" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileHeart className="h-5 w-5 text-primary" />Client Intake Form</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!client.intakeForm || client.intakeForm.status === 'not_started' ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>The client has not yet started their intake form.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                     { (client.intakeForm.flaggedQuestions?.length || 0) > 0 && (
                                        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                                                    <Flag className="h-5 w-5"/> Client-Flagged Questions
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                                                    {client.intakeForm.flaggedQuestions?.map(q => <li key={q}>The client flagged the question: <strong>{q}</strong></li>)}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                     )}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                                        <Card className="bg-muted/50">
                                            <CardContent className="p-4 space-y-4">
                                                <p><span className="font-semibold">Summary:</span> {(client.intakeForm.analysis?.summary || '')}</p>
                                                {client.intakeForm.analysis?.educationAnalysis && (
                                                    <div className="p-3 bg-background rounded-md border">
                                                        <h4 className="font-semibold text-sm">Education Equivalency Suggestion</h4>
                                                        <p className="text-primary font-bold text-base">{client.intakeForm.analysis.educationAnalysis.equivalencySuggestion}</p>
                                                        <p className="text-xs text-muted-foreground">{client.intakeForm.analysis.educationAnalysis.notes}</p>
                                                    </div>
                                                )}
                                                {(client.intakeForm.analysis?.flags || []).length > 0 ? (
                                                     <div>
                                                        <h4 className="font-semibold">Flags:</h4>
                                                        <div className="space-y-2 mt-2">
                                                        {(client.intakeForm.analysis?.flags || []).map((flag, i) => (
                                                            <div key={i} className="flex items-start gap-3 p-2 border-l-4 rounded-r-md bg-background" style={{ borderColor: flag.severity === 'high' ? 'hsl(var(--destructive))' : flag.severity === 'medium' ? 'hsl(var(--warning-color))' : 'hsl(var(--info-color))' }}>
                                                                <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: flag.severity === 'high' ? 'hsl(var(--destructive))' : flag.severity === 'medium' ? 'hsl(var(--warning-color))' : 'hsl(var(--info-color))' }}/>
                                                                <div>
                                                                    <p className="font-semibold text-sm">{flag.field}</p>
                                                                    <p className="text-sm text-muted-foreground">{flag.message}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        </div>
                                                    </div>
                                                ) : <p className="text-sm text-green-600">No flags identified by AI.</p>}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {client.intakeForm.status !== 'reviewed' ? (
                                        <div className="text-center border-t pt-6">
                                            <Button size="lg" onClick={handleAcceptAndGenerate} disabled={generatingDocs}>
                                                {generatingDocs ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Generating...</> : <><Sparkles className="mr-2 h-4 w-4"/>Accept & Generate Documents</>}
                                            </Button>
                                            <p className="text-xs text-muted-foreground mt-2">This will simulate filling official forms with the client's data.</p>
                                        </div>
                                    ) : (
                                        <div className="border-t pt-6">
                                            <h3 className="font-semibold text-lg mb-2">Generated Documents</h3>
                                            <div className="space-y-2">
                                                {generatedDocs.map((docName, i) => (
                                                    <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                                                        <p className="font-medium">{docName}.pdf</p>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm">Review</Button>
                                                            <Button variant="secondary" size="sm">Send for Signature</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                            {(client.tasks || []).length > 0 ? (
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
                                        {(client.tasks || []).map((task) => (
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
                                                <TableCell suppressHydrationWarning>{format(new Date(task.dueDate), 'PP')}</TableCell>
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
                             <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI-Powered Case Timeline
                            </CardTitle>
                            <CardDescription>A personalized, estimated timeline of the client's immigration journey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isTimelineLoading && (
                               <div className="flex items-center justify-center h-40">
                                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                   <p className="ml-4 text-muted-foreground">Generating projected timeline...</p>
                               </div>
                            )}
                            {timelineError && !isTimelineLoading && (
                               <div className="flex flex-col items-center justify-center h-40 text-center text-destructive">
                                   <AlertTriangle className="h-8 w-8 mb-2" />
                                   <p className="font-semibold">Timeline Generation Failed</p>
                                   <p className="text-sm">{timelineError}</p>
                               </div>
                            )}
                            {timelineData && !isTimelineLoading && <CaseTimeline timeline={timelineData} />}
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
                                                <p suppressHydrationWarning className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
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
                {isAdminView && (
                    <TabsContent value="manage" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Client</CardTitle>
                                <CardDescription>Update client status or block their account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Client Status</Label>
                                    <Select value={client.status} onValueChange={(value) => handleStatusChange(value as Client['status'])}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="On-hold">On-hold</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                                <Button variant="destructive" onClick={() => handleStatusChange('Blocked')}>Block Client Account</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>

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
                                    {(documentCategories || []).filter(c => c.name !== 'All Documents').map(cat => (
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
                                    {(documentTemplates || []).map(template => (
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

            <Dialog open={isAgreementDialogOpen} onOpenChange={setAgreementDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAgreement ? 'Edit Agreement' : 'Add New Agreement'}</DialogTitle>
                        <DialogDescription>
                            {editingAgreement ? `Update details for "${editingAgreement.title}".` : `Create a new agreement for ${client.name}.`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="agreement-title">Agreement Title</Label>
                            <Input id="agreement-title" value={agreementTitle} onChange={(e) => setAgreementTitle(e.target.value)} placeholder="e.g., Retainer for Express Entry" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="agreement-status">Status</Label>
                                <Select value={agreementStatus} onValueChange={(value: Agreement['status']) => setAgreementStatus(value)}>
                                    <SelectTrigger id="agreement-status"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Terminated">Terminated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agreement-date">Date Signed</Label>
                                <Input id="agreement-date" type="date" value={agreementDate} onChange={(e) => setAgreementDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAgreementDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveAgreement}>Save Agreement</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                    {(assignableMembers || []).map(member => (
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
                                        {(activityTypes || []).map(type => (
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
                                            {(assignableMembers || []).map(member => (
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the document
                            "{(client.documents || []).find(d => d.id === deletingDocId)?.title}" from the client's profile.
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
        </>
    );
}
