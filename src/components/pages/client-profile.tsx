
'use client';
import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Client, Task, Agreement, IntakeForm, IntakeFormAnalysis, ClientDocument, TeamMember, ApplicationStatus } from "@/lib/data";
import { CalendarCheck, FileText, MessageSquare, Download, Eye, Upload, CheckSquare, Plus, FilePlus, Trash2, Phone, Mail, Users, Sparkles, BrainCircuit, Loader2, AlertTriangle, Handshake, Landmark, Edit, FileHeart, AlertCircle, Flag, Package, CheckCircle, XCircle, FileDown, UserCheck } from "lucide-react";
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
import { getCaseTimeline } from "@/ai/flows/case-timeline-flow";
import { CaseTimeline } from "@/components/case-timeline";
import { analyzeDocument, DocumentAnalysisOutput } from "@/ai/flows/document-analyzer";
import { DocumentViewer } from "@/components/document-viewer";
import { ApplicationProgress } from "@/components/application-progress";

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
        case 'pending client review': return 'info' as const;
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

const DocumentSection = ({ title, documents, onSelect, selectedDocId, onStatusChange, onAnalyze, onViewClick }: { title: string, documents: ClientDocument[], onSelect: (doc: ClientDocument) => void, selectedDocId: number | null, onStatusChange: (docId: number, status: ClientDocument['status']) => void, onAnalyze: (doc: ClientDocument) => void, onViewClick: (doc: ClientDocument) => void }) => {
    if (!documents || documents.length === 0) return null;
    return (
        <div className="space-y-3">
            <h4 className="font-semibold">{title}</h4>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map(doc => (
                            <TableRow key={doc.id} onClick={() => onSelect(doc)} className={cn("cursor-pointer", selectedDocId === doc.id && "bg-muted")}>
                                <TableCell className="font-medium">{doc.title}</TableCell>
                                <TableCell><Badge variant={getDocumentStatusBadgeVariant(doc.status)}>{doc.status}</TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="ghost" size="icon" title="View Document" onClick={(e) => { e.stopPropagation(); onViewClick(doc); }}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" title="Analyze with AI" onClick={(e) => { e.stopPropagation(); onAnalyze(doc); }}><Sparkles className="h-4 w-4 text-primary" /></Button>
                                    <Button variant="ghost" size="icon" title="Approve" onClick={(e) => { e.stopPropagation(); onStatusChange(doc.id, 'Approved')}}><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                                    <Button variant="ghost" size="icon" title="Reject" onClick={(e) => { e.stopPropagation(); onStatusChange(doc.id, 'Rejected')}}><XCircle className="h-4 w-4 text-red-600" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};


export const ClientProfile = React.memo(function ClientProfile({ client, onUpdateClient }: ClientProfileProps) {
    const { toast } = useToast();
    const pathname = usePathname();
    const isAdminView = pathname.startsWith('/admin');
    const { userProfile, teamMembers: allTeamMembers, addTask, invoicesData } = useGlobalData();
    const [selectedDocument, setSelectedDocument] = useState<ClientDocument | null>(null);
    const [relatedTasks, setRelatedTasks] = useState<Task[]>([]);
    
    const lawyerProfile = userProfile as TeamMember;
    const assignableMembers = lawyerProfile?.firmName 
        ? allTeamMembers.filter(member => member.firmName === lawyerProfile.firmName)
        : allTeamMembers.filter(member => member.type === 'legal' || member.type === 'admin');
        
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
    const [newTaskClient, setNewTaskClient] = useState("");
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

    const [isProfileAnalyzing, setIsProfileAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SuccessPredictorOutput | null>(null);

    const [isDocAnalyzing, setIsDocAnalyzing] = useState(false);
    const [docAnalysisResult, setDocAnalysisResult] = useState<DocumentAnalysisOutput | null>(null);
    const [analyzedDocTitle, setAnalyzedDocTitle] = useState('');
    const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<ClientDocument | null>(null);

    const communications = (client.activity || []).filter(item => item.title.includes("Message") || item.title.includes("Email") || item.title.includes("Call"));

    const [timelineData, setTimelineData] = useState<Awaited<ReturnType<typeof getCaseTimeline>>['timeline'] | null>(null);
    const [isTimelineLoading, setIsTimelineLoading] = useState(true);
    const [timelineError, setTimelineError] = useState<string | null>(null);
    
    const documentGroups = useMemo(() => {
        return (client.documents || []).reduce((acc, doc) => {
            const group = doc.submissionGroup || 'Additional Document';
            if (!acc[group]) acc[group] = [];
            acc[group].push(doc);
            return acc;
        }, {} as Record<string, ClientDocument[]>);
    }, [client.documents]);

    const visibleDocumentGroups = useMemo(() => {
        return Object.entries(documentGroups).filter(([, docs]) => docs.length > 0);
    }, [documentGroups]);

    useEffect(() => {
        setAnalysisResult(client.analysis || null);
    }, [client.analysis]);
    
    useEffect(() => {
        if (!selectedDocument) {
            setRelatedTasks([]);
            return;
        }
        const relevantTasks = (client.tasks || []).filter(task =>
            task.title.toLowerCase().includes(selectedDocument.title.toLowerCase()) ||
            selectedDocument.title.toLowerCase().includes(task.title.toLowerCase())
        );
        setRelatedTasks(relevantTasks);
    }, [selectedDocument, client.tasks]);

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
    
    const handleProfileAnalyze = async () => {
        setIsProfileAnalyzing(true);
        setAnalysisResult(null);
        try {
            const inputData = {
                visaType: client.caseSummary.caseType,
                countryOfOrigin: client.countryOfOrigin,
                age: client.age,
                educationLevel: client.educationLevel,
            };
            const result = await predictSuccess(inputData);
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
        setIsProfileAnalyzing(false);
    };

    const handleAnalyzeDocument = async (doc: ClientDocument) => {
        setIsDocAnalyzing(true);
        setDocAnalysisResult(null);
        setAnalyzedDocTitle(doc.title);
        setIsAnalysisDialogOpen(true);
        try {
            const result = await analyzeDocument({ title: doc.title, category: doc.category });
            setDocAnalysisResult(result);
        } catch (error) {
            console.error("Document analysis failed:", error);
            toast({
                title: "Analysis Failed",
                description: "Could not analyze the document at this time.",
                variant: "destructive",
            });
            setIsAnalysisDialogOpen(false);
        } finally {
            setIsDocAnalyzing(false);
        }
    };


    const handleAdHocUpload = () => {
        if (!newDocTitle || !newDocCategory) {
            toast({ title: 'Error', description: 'Please fill out all fields.', variant: 'destructive' });
            return;
        }

        const newDocument: ClientDocument = {
            id: Date.now(),
            title: newDocTitle,
            category: newDocCategory,
            dateAdded: new Date().toISOString().split('T')[0],
            status: 'Uploaded',
            type: 'supporting',
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
        const newDocument: ClientDocument = {
            id: Date.now(),
            title: template.title,
            category: template.category,
            dateAdded: new Date().toISOString().split('T')[0],
            status: 'Requested',
            type: 'form',
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
    
    const handleDocumentStatusChange = (docId: number, status: ClientDocument['status']) => {
        const docTitle = client.documents.find(d => d.id === docId)?.title;
        const updatedClient = {
            ...client,
            documents: (client.documents || []).map(doc =>
                doc.id === docId ? { ...doc, status } : doc
            ),
        };
        onUpdateClient(updatedClient);
        toast({ title: `Document "${docTitle}" status updated to ${status}.` });
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
            ...(userProfile && { teamMember: { name: userProfile.name, avatar: userProfile.avatar } }),
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
                priority: newTaskPriority,
                status: 'To Do',
            };
            
            addTask(newTask);
            
            const taskActivity = {
                id: Date.now() + 2,
                title: 'New Task Created',
                description: `Task "${newTask.title}" assigned to ${assignee.name}.`,
                timestamp: new Date().toISOString(),
                ...(userProfile && { teamMember: { name: userProfile.name, avatar: userProfile.avatar } }),
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

    const handleSendConnectionRequest = () => {
        if (!userProfile) return;
        onUpdateClient({ ...client, connectionRequestFromLawyerId: userProfile.id });
        toast({
            title: "Connection Request Sent!",
            description: `Your request to connect has been sent to ${client.name}.`
        });
    };

    const canSendRequest = !client.connectedLawyerId && !client.connectionRequestFromLawyerId;
    const isRequestPending = client.connectionRequestFromLawyerId === userProfile?.id;
    const isConnected = !!client.connectedLawyerId;

    return (
        <div className="animate-fade">
            <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" />
            
            <DocumentViewer
                isOpen={!!viewingDocument}
                onOpenChange={(isOpen) => !isOpen && setViewingDocument(null)}
                document={viewingDocument}
            />
            
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <h2 className="text-2xl font-bold">{client.name}</h2>
                                <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
                                <Badge variant={getStatusBadgeVariant(client.caseType)}>{client.caseType}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{client.email} • {client.phone}</p>
                        </div>
                         <div className="flex-shrink-0">
                            {canSendRequest && <Button onClick={handleSendConnectionRequest}><UserCheck className="mr-2 h-4 w-4"/>Send Connection Request</Button>}
                            {isRequestPending && <Button disabled>Request Sent</Button>}
                            {isConnected && <Button disabled variant="outline"><CheckCircle className="mr-2 h-4 w-4 text-green-500"/>Connected</Button>}
                        </div>
                    </div>
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
            {/* The rest of the component remains the same, so it's omitted for brevity */}
        </div>
    );
});
