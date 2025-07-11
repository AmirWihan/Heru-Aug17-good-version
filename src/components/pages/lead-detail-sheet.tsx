
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetFooter } from "@/components/ui/sheet";
import type { ClientLead, Task } from "@/lib/data";
import { X, User, Building, Phone, Mail, FileText, Plus } from "lucide-react";
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
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b shrink-0">
                    <div className="flex justify-between items-start">
                         <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={lead.avatar} />
                                <AvatarFallback><User className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-2xl font-bold">{lead.name}</SheetTitle>
                                <SheetDescription className="flex items-center gap-2"><Building className="h-4 w-4" />{lead.company}</SheetDescription>
                            </div>
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
