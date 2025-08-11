
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetFooter } from "@/components/ui/sheet";
import type { ClientLead, Task } from "@/lib/data";
import { X, User, Building, Phone, Mail, FileText, Plus, MessageSquare, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGlobalData } from "@/context/GlobalDataContext";
import { activityTypes } from "@/lib/data";
import { Checkbox } from "../ui/checkbox";

interface LeadDetailSheetProps {
    lead: ClientLead;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConvert: (leadId: number) => void;
}

const activityIcons: { [key: string]: React.ElementType } = {
    "Call": Phone,
    "Email": Mail,
    "Note": FileText,
};

export function LeadDetailSheet({ lead, isOpen, onOpenChange, onConvert }: LeadDetailSheetProps) {
    const { toast } = useToast();
    const { teamMembers, addTask, updateClientLead } = useGlobalData();
    const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [statusDraft, setStatusDraft] = useState<LeadDetailSheetProps extends never ? never : ClientLead['status']>(lead.status);
    const [intakeSummary, setIntakeSummary] = useState(lead.intake?.summary || '');
    const [intakeScore, setIntakeScore] = useState<number | ''>(lead.intake?.score ?? '');
    const [intakeStatus, setIntakeStatus] = useState<NonNullable<ClientLead['intake']>['status']>(lead.intake?.status || 'not_started');
    const [whatsAppMessage, setWhatsAppMessage] = useState('');
    
    // State for new activity
    const [newActivityType, setNewActivityType] = useState("");
    const [newActivityNotes, setNewActivityNotes] = useState("");
    const [newActivityDate, setNewActivityDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // State for follow-up task
    const [createFollowUpTask, setCreateFollowUpTask] = useState(false);
    const [followUpTaskTitle, setFollowUpTaskTitle] = useState("");
    const [followUpTaskAssignee, setFollowUpTaskAssignee] = useState("");
    const [followUpTaskDueDate, setFollowUpTaskDueDate] = useState("");
    const [followUpTaskPriority, setFollowUpTaskPriority] = useState<Task['priority']>('Medium');

    const internalTeam = teamMembers.filter(member => member.type === 'legal');

    const handleUpdateStatus = () => {
        if (statusDraft === lead.status) return;
        const updatedLead: ClientLead = { ...lead, status: statusDraft };
        updateClientLead(updatedLead);
        toast({ title: 'Status Updated', description: `${lead.name} moved to ${statusDraft}.` });
    };

    const handleSaveIntake = () => {
        const updatedLead: ClientLead = {
            ...lead,
            intake: {
                status: intakeStatus,
                summary: intakeSummary || undefined,
                score: typeof intakeScore === 'number' ? intakeScore : undefined,
                submittedAt: lead.intake?.submittedAt || (intakeStatus === 'submitted' ? new Date().toISOString() : undefined),
                data: lead.intake?.data,
            },
        };
        updateClientLead(updatedLead);
        toast({ title: 'Intake saved', description: 'Lead intake details have been updated.' });
    };

    const openWhatsApp = () => {
        const phone = (lead.phone || '').replace(/[^\d+]/g, '');
        const url = `https://wa.me/${phone.startsWith('+') ? phone.substring(1) : phone}`;
        window.open(url, '_blank');
    };

    const logWhatsAppMessage = () => {
        if (!whatsAppMessage.trim()) return;
        const newActivity = {
            id: Date.now(),
            type: 'Note' as const,
            notes: `[WhatsApp] ${whatsAppMessage.trim()}`,
            date: new Date().toISOString(),
        };
        const updatedLead: ClientLead = {
            ...lead,
            activity: [...(lead.activity || []), newActivity],
            lastContacted: new Date().toISOString(),
        };
        updateClientLead(updatedLead);
        setWhatsAppMessage('');
        toast({ title: 'WhatsApp message logged', description: `Saved message for ${lead.name}.` });
    };

    const handleLogActivity = () => {
        if (!newActivityType || !newActivityNotes) {
            toast({ title: 'Error', description: 'Activity Type and Notes are required.', variant: 'destructive' });
            return;
        }

        const newActivity = {
            id: Date.now(),
            type: (activityTypes.find(t => t.id === newActivityType)?.label || 'Note') as 'Call' | 'Email' | 'Note',
            notes: newActivityNotes,
            date: new Date(newActivityDate).toISOString(),
        };

    

        let updatedActivities = [...(lead.activity || []), newActivity];

        if (createFollowUpTask) {
             if (!followUpTaskTitle || !followUpTaskAssignee || !followUpTaskDueDate) {
                toast({ title: 'Error', description: 'Please fill out all fields for the follow-up task.', variant: 'destructive' });
                return;
            }
            const assignee = internalTeam.find(m => m.id.toString() === followUpTaskAssignee);
            if (!assignee) {
                toast({ title: 'Error', description: 'Selected assignee not found for task.', variant: 'destructive' });
                return;
            }
            const newTask: Task = {
                id: Date.now() + 1,
                title: followUpTaskTitle,
                client: { id: lead.id, name: lead.name, avatar: lead.avatar || '' },
                assignedTo: { name: assignee.name, avatar: assignee.avatar },
                dueDate: followUpTaskDueDate,
                priority: followUpTaskPriority,
                status: 'To Do',
            };
            addTask(newTask); // Add to global tasks
        }

        const updatedLead: ClientLead = {
            ...lead,
            activity: updatedActivities,
            lastContacted: new Date().toISOString(),
        };

        updateClientLead(updatedLead);
        toast({ title: 'Activity Logged!', description: `A new ${newActivity.type} has been logged for ${lead.name}.` });
        
        // Reset form
        setIsLogActivityOpen(false);
        setNewActivityType('');
        setNewActivityNotes('');
        setNewActivityDate(format(new Date(), 'yyyy-MM-dd'));
        setCreateFollowUpTask(false);
        setFollowUpTaskTitle('');
        setFollowUpTaskAssignee('');
        setFollowUpTaskDueDate('');
        setFollowUpTaskPriority('Medium');
    };

    return (
        <Sheet open={isOpen} onOpenChange={(v) => { if (!v) setIsExpanded(false); onOpenChange(v); }}>
            <SheetContent className={`w-full ${isExpanded ? 'sm:max-w-full' : 'sm:max-w-2xl'} p-0 flex flex-col h-full`}
                side="right">
                <SheetHeader className="p-6 border-b shrink-0">
                    <div className="flex justify-between items-start">
                         <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={lead.avatar} />
                                <AvatarFallback><User className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-2xl font-bold">{lead.name}</SheetTitle>
                                {lead.company && <SheetDescription className="flex items-center gap-2"><Building className="h-4 w-4" />{lead.company}</SheetDescription>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsExpanded((s) => !s)}>
                                <ExternalLink className="h-4 w-4 mr-2" /> {isExpanded ? 'Shrink' : 'Expand'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={openWhatsApp}>
                                <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                            </Button>
                            <a href={`mailto:${lead.email}`} target="_blank" rel="noreferrer">
                                <Button variant="outline" size="sm"><Mail className="h-4 w-4 mr-2" /> Email</Button>
                            </a>
                            <a href={`tel:${lead.phone}`}>
                                <Button variant="outline" size="sm"><Phone className="h-4 w-4 mr-2" /> Call</Button>
                            </a>
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-5 w-5" />
                                </Button>
                            </SheetClose>
                        </div>
                    </div>
                </SheetHeader>
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Lead Stage</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Current Stage</p>
                                <Select value={statusDraft} onValueChange={(v) => setStatusDraft(v as ClientLead['status'])}>
                                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Contacted">Contacted</SelectItem>
                                        <SelectItem value="Qualified">Qualified</SelectItem>
                                        <SelectItem value="Unqualified">Unqualified</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleUpdateStatus}>Update Stage</Button>
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className={`px-2 py-1 rounded ${lead.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>New</span>
                                    <span className="w-6 h-[2px] bg-border"/>
                                    <span className={`px-2 py-1 rounded ${lead.status === 'Contacted' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>Contacted</span>
                                    <span className="w-6 h-[2px] bg-border"/>
                                    <span className={`px-2 py-1 rounded ${lead.status === 'Qualified' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>Qualified</span>
                                    <span className="w-6 h-[2px] bg-border"/>
                                    <span className={`px-2 py-1 rounded ${lead.status === 'Unqualified' ? 'bg-destructive/10 text-destructive' : 'bg-muted'}`}>Unqualified</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Lead Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Status</p><p><Badge>{lead.status}</Badge></p></div>
                            <div><p className="text-muted-foreground">Source</p><p>{lead.source}</p></div>
                            <div><p className="text-muted-foreground">Email</p><p className="truncate">{lead.email}</p></div>
                            <div><p className="text-muted-foreground">Phone</p><p>{lead.phone}</p></div>
                            <div><p className="text-muted-foreground">Owner</p><p>{lead.owner.name}</p></div>
                            <div><p className="text-muted-foreground">Created</p><p>{new Date(lead.createdDate).toLocaleDateString()}</p></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Initial Intake</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-muted-foreground">Intake Status</p>
                                    <div className="mt-1">
                                        <Select value={intakeStatus} onValueChange={(v) => setIntakeStatus(v as NonNullable<ClientLead['intake']>['status'])}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="not_started">Not Started</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="submitted">Submitted</SelectItem>
                                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Score</p>
                                    <Input type="number" placeholder="e.g., 78" value={intakeScore} onChange={(e) => setIntakeScore(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">Summary</p>
                                    <Textarea placeholder="Brief intake summary..." value={intakeSummary} onChange={(e) => setIntakeSummary(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleSaveIntake}>Save Intake</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Activity Log</CardTitle>
                                <Dialog open={isLogActivityOpen} onOpenChange={setIsLogActivityOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline"><Plus className="mr-2 h-4 w-4"/>Log Activity</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Log New Activity</DialogTitle>
                                            <DialogDescription>Record a new interaction with {lead.name}.</DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="activity-type">Activity Type</Label>
                                                    <Select value={newActivityType} onValueChange={setNewActivityType}>
                                                        <SelectTrigger id="activity-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                                                        <SelectContent>{activityTypes.map(type => (<SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>))}</SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="activity-date">Date</Label>
                                                    <Input id="activity-date" type="date" value={newActivityDate} onChange={(e) => setNewActivityDate(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="activity-notes">Notes</Label>
                                                <Textarea id="activity-notes" value={newActivityNotes} onChange={e => setNewActivityNotes(e.target.value)} placeholder="Enter details of the interaction..." />
                                            </div>
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Checkbox id="follow-up" checked={createFollowUpTask} onCheckedChange={(checked) => setCreateFollowUpTask(Boolean(checked))} />
                                                <Label htmlFor="follow-up" className="font-normal">Create a follow-up task</Label>
                                            </div>
                                            {createFollowUpTask && (
                                                <div className="space-y-4 pt-4 border-t animate-fade">
                                                    <h4 className="font-medium text-sm">New Follow-up Task</h4>
                                                    <div className="space-y-2"><Label htmlFor="follow-up-title">Task Title</Label><Input id="follow-up-title" value={followUpTaskTitle} onChange={(e) => setFollowUpTaskTitle(e.target.value)} placeholder="e.g., Follow up on pricing" /></div>
                                                    <div className="space-y-2"><Label htmlFor="follow-up-assignee">Assign To</Label><Select value={followUpTaskAssignee} onValueChange={setFollowUpTaskAssignee}><SelectTrigger id="follow-up-assignee"><SelectValue placeholder="Select a team member" /></SelectTrigger><SelectContent>{internalTeam.map(member => (<SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>))}</SelectContent></Select></div>
                                                    <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="follow-up-due-date">Due Date</Label><Input id="follow-up-due-date" type="date" value={followUpTaskDueDate} onChange={(e) => setFollowUpTaskDueDate(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="follow-up-priority">Priority</Label><Select value={followUpTaskPriority} onValueChange={(v: Task['priority']) => setFollowUpTaskPriority(v)}><SelectTrigger id="follow-up-priority"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select></div></div>
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsLogActivityOpen(false)}>Cancel</Button>
                                            <Button onClick={handleLogActivity}>Log Activity</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="rounded-md border p-3">
                               <div className="flex items-center justify-between gap-2 mb-2">
                                   <div className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="h-4 w-4"/> WhatsApp message</div>
                                   <Button size="sm" variant="outline" onClick={openWhatsApp}><ExternalLink className="h-3 w-3 mr-2"/>Open WhatsApp</Button>
                               </div>
                               <div className="flex gap-2">
                                   <Input placeholder="Type a message to log..." value={whatsAppMessage} onChange={(e) => setWhatsAppMessage(e.target.value)} />
                                   <Button onClick={logWhatsAppMessage}>Log</Button>
                               </div>
                           </div>
                           {(lead.activity || []).map((item) => {
                                const Icon = activityIcons[item.type] || FileText;
                                return (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="bg-muted p-2 rounded-full mt-1"><Icon className="h-4 w-4 text-primary"/></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Logged a "{item.type}"</p>
                                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                                            <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                                                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                );
                           })}
                           {(lead.activity || []).length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-4">No activities logged for this lead.</p>
                           )}
                        </CardContent>
                    </Card>
                </div>
                 <SheetFooter className="p-6 border-t shrink-0">
                    <Button className="w-full" size="lg" onClick={() => onConvert(lead.id)}>Convert to Client</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
