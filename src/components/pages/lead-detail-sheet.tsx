
'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetFooter } from "@/components/ui/sheet";
import type { ClientLead, Task } from "@/lib/data";
import { X, User, Building, Phone, Mail, FileText, Plus, MessageSquare, ExternalLink, CheckCircle2, XCircle, PhoneCall, CircleDot, Maximize2, Minimize2, Heart, MapPin, Globe, CalendarDays, Megaphone } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        try {
            return localStorage.getItem('lead:panel:expanded') === '1';
        } catch {
            return false;
        }
    });
    const [isFollowing, setIsFollowing] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(`lead:follow:${lead.id}`) === '1';
    });
    const [statusLocal, setStatusLocal] = useState<ClientLead['status']>(lead.status);
    const [intakeSummary, setIntakeSummary] = useState(lead.intake?.summary || '');
    const [intakeScore, setIntakeScore] = useState<number | ''>(lead.intake?.score ?? '');
    const [isEditingIntake, setIsEditingIntake] = useState<boolean>(!(lead.intake?.data));
    const [intakeAnswers, setIntakeAnswers] = useState<{
        age: number | '';
        education: 'high_school'|'diploma'|'bachelors'|'masters'|'phd';
        languageClb: 'clb4'|'clb5'|'clb6'|'clb7'|'clb8'|'clb9'|'clb10';
        workYears: number | '';
        jobOffer: boolean;
        relativesInCanada: boolean;
        maritalStatus: 'single'|'married';
        spouseLanguageClb: 'none'|'clb4'|'clb5'|'clb6'|'clb7'|'clb8'|'clb9'|'clb10';
        address: string;
        citizenship: string;
        inCanada: boolean;
        visaStatus: 'none'|'visitor'|'study'|'work'|'pr'|'citizen';
        spouseName: string;
        spouseCitizenship: string;
    }>(() => {
        const d = (lead.intake?.data as any) || {};
        return {
            age: typeof d.age === 'number' ? d.age : '',
            education: (d.education as any) || 'bachelors',
            languageClb: (d.languageClb as any) || 'clb7',
            workYears: typeof d.workYears === 'number' ? d.workYears : '',
            jobOffer: Boolean(d.jobOffer ?? false),
            relativesInCanada: Boolean(d.relativesInCanada ?? false),
            maritalStatus: (d.maritalStatus as any) || 'single',
            spouseLanguageClb: (d.spouseLanguageClb as any) || 'none',
            address: (d.address as any) || '',
            citizenship: (d.citizenship as any) || '',
            inCanada: Boolean(d.inCanada ?? false),
            visaStatus: (d.visaStatus as any) || 'none',
            spouseName: (d.spouseName as any) || '',
            spouseCitizenship: (d.spouseCitizenship as any) || '',
        };
    });
    const [intakeStatus, setIntakeStatus] = useState<NonNullable<ClientLead['intake']>['status']>(lead.intake?.status || 'not_started');
    const [whatsAppMessage, setWhatsAppMessage] = useState('');
    type LeadActivity = { id: number; type: 'Call' | 'Email' | 'Note'; notes: string; date: string };
    const [activities, setActivities] = useState<LeadActivity[]>(() => ([...(lead.activity || [])] as LeadActivity[]).sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime()));
    const [activeActivity, setActiveActivity] = useState<LeadActivity | null>(null);
    const [activityRange, setActivityRange] = useState<'2m'|'1m'|'all'>('2m');
    const [activityKind, setActivityKind] = useState<'all'|'Call'|'Email'|'Note'>('all');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isOwnerOpen, setIsOwnerOpen] = useState(false);
    const [editName, setEditName] = useState(lead.name);
    const [editCompany, setEditCompany] = useState(lead.company || '');
    const [editEmail, setEditEmail] = useState(lead.email || '');
    const [editPhone, setEditPhone] = useState(lead.phone || '');
    const [editSource, setEditSource] = useState(lead.source || '');
    const [editOwnerName, setEditOwnerName] = useState<string>(lead.owner?.name || teamMembers[0]?.name || '');
    const [showAllTasks, setShowAllTasks] = useState(false);
    
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
    const leadTasks = (useGlobalData().tasks || []).filter(t => t.client?.id === lead.id);
    const now = new Date();
    const upcomingTasks = leadTasks.filter(t => t.dueDate && new Date(t.dueDate) >= now).sort((a,b)=> new Date(a.dueDate||'').getTime() - new Date(b.dueDate||'').getTime());
    const overdueTasks = leadTasks.filter(t => t.dueDate && new Date(t.dueDate) < now).sort((a,b)=> new Date(b.dueDate||'').getTime() - new Date(a.dueDate||'').getTime());

    // Rehydrate activities when lead changes
    useEffect(() => {
        setActivities((lead.activity || []) as LeadActivity[]);
    }, [lead.id]);

    // Compute filtered activities for the Activity timeline from local state
    const allActivities: LeadActivity[] = activities
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const cutoffDate: Date | null = (() => {
        if (activityRange === 'all') return null;
        const d = new Date();
        if (activityRange === '2m') {
            d.setMonth(d.getMonth() - 2);
            return d;
        }
        if (activityRange === '1m') {
            d.setMonth(d.getMonth() - 1);
            return d;
        }
        return null;
    })();

    const filteredActivities: LeadActivity[] = allActivities.filter(a => {
        const kindOk = activityKind === 'all' || a.type === activityKind;
        const rangeOk = !cutoffDate || new Date(a.date) >= cutoffDate;
        return kindOk && rangeOk;
    });

    // Reinitialize intake edit state on lead change
    useEffect(() => {
        setIsEditingIntake(!(lead.intake?.data));
        const d = (lead.intake?.data as any) || {};
        setIntakeAnswers({
            age: typeof d.age === 'number' ? d.age : '',
            education: (d.education as any) || 'bachelors',
            languageClb: (d.languageClb as any) || 'clb7',
            workYears: typeof d.workYears === 'number' ? d.workYears : '',
            jobOffer: Boolean(d.jobOffer ?? false),
            relativesInCanada: Boolean(d.relativesInCanada ?? false),
            maritalStatus: (d.maritalStatus as any) || 'single',
            spouseLanguageClb: (d.spouseLanguageClb as any) || 'none',
            address: (d.address as any) || '',
            citizenship: (d.citizenship as any) || '',
            inCanada: Boolean(d.inCanada ?? false),
            visaStatus: (d.visaStatus as any) || 'none',
            spouseName: (d.spouseName as any) || '',
            spouseCitizenship: (d.spouseCitizenship as any) || '',
        });
        setIntakeScore(lead.intake?.score ?? '');
    }, [lead.id]);

    // Calculate Canada immigration score only while editing (live preview)
    useEffect(() => {
        if (!isEditingIntake) return;
        const agePts = (() => {
            const a = typeof intakeAnswers.age === 'number' ? intakeAnswers.age : 0;
            if (a >= 18 && a <= 35) return 12;
            if (a >= 36 && a <= 45) return 8;
            if (a >= 46 && a <= 50) return 4;
            return 0;
        })();
        const eduPts = ({ high_school: 5, diploma: 7, bachelors: 10, masters: 12, phd: 15 } as const)[intakeAnswers.education];
        const langPts = ({ clb4: 0, clb5: 2, clb6: 4, clb7: 6, clb8: 8, clb9: 10, clb10: 12 } as const)[intakeAnswers.languageClb];
        const work = typeof intakeAnswers.workYears === 'number' ? intakeAnswers.workYears : 0;
        const workPts = work >= 6 ? 12 : work >= 4 ? 10 : work >= 2 ? 8 : work >= 1 ? 5 : 0;
        const offerPts = intakeAnswers.jobOffer ? 10 : 0;
        const familyPts = intakeAnswers.relativesInCanada ? 5 : 0;
        const marriageBase = intakeAnswers.maritalStatus === 'married' ? 5 : 0;
        const spouseLangPtsMap: Record<string, number> = { none: 0, clb4: 1, clb5: 2, clb6: 3, clb7: 4, clb8: 5, clb9: 6, clb10: 7 };
        const spouseLangPts = intakeAnswers.maritalStatus === 'married' ? (spouseLangPtsMap[intakeAnswers.spouseLanguageClb] ?? 0) : 0;
        setIntakeScore(agePts + eduPts + langPts + workPts + offerPts + familyPts + marriageBase + spouseLangPts);
    }, [intakeAnswers, isEditingIntake]);

    // Persist follow toggle
    if (typeof window !== 'undefined') {
        try { localStorage.setItem(`lead:follow:${lead.id}`, isFollowing ? '1' : '0'); } catch {}
    }

    // Persist expanded state
    useEffect(() => {
        try { localStorage.setItem('lead:panel:expanded', isExpanded ? '1' : '0'); } catch {}
    }, [isExpanded]);

    useEffect(() => {
        setStatusLocal(lead.status);
    }, [lead.id, lead.status]);

    // Friendly UI helpers
    const getStatusClasses = (status: ClientLead['status']) => {
        switch (status) {
            case 'New':
                return 'bg-sky-100 text-sky-700 border border-sky-200';
            case 'Contacted':
                return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'Qualified':
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'Unqualified':
                return 'bg-rose-100 text-rose-700 border border-rose-200';
            default:
                return '';
        }
    };

    const getVisaBadgeClasses = (status: string | undefined) => {
        switch ((status || 'none').toLowerCase()) {
            case 'visitor':
                return 'bg-sky-100 text-sky-700 border border-sky-200';
            case 'study':
                return 'bg-violet-100 text-violet-700 border border-violet-200';
            case 'work':
                return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'pr':
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'citizen':
                return 'bg-emerald-200 text-emerald-800 border border-emerald-300';
            default:
                return 'bg-muted text-muted-foreground border';
        }
    };

    const getScoreBadgeClasses = (score?: number) => {
        if (typeof score !== 'number') return 'bg-muted text-muted-foreground border';
        if (score >= 45) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
        if (score >= 25) return 'bg-amber-100 text-amber-700 border border-amber-200';
        return 'bg-rose-100 text-rose-700 border border-rose-200';
    };

    const getScoreRingClasses = (score?: number) => {
        if (typeof score !== 'number') return 'ring-muted-200';
        if (score >= 45) return 'ring-emerald-300';
        if (score >= 25) return 'ring-amber-300';
        return 'ring-rose-300';
    };

    const getMaritalBadgeClasses = (marital?: string) => {
        switch ((marital || '').toLowerCase()) {
            case 'married':
                return 'bg-violet-100 text-violet-700 border border-violet-200';
            case 'single':
                return 'bg-slate-100 text-slate-700 border border-slate-200';
            default:
                return 'bg-muted text-muted-foreground border';
        }
    };

    const setStage = (stage: ClientLead['status']) => {
        setStatusLocal(stage); // immediate UI feedback
        const updatedLead: ClientLead = { ...lead, status: stage };
        updateClientLead(updatedLead);
        toast({ title: 'Stage updated', description: `${lead.name} moved to ${stage}.` });
    };

    const handleSaveIntake = () => {
        const updatedLead: ClientLead = {
            ...lead,
            intake: {
                status: intakeStatus,
                summary: intakeSummary || undefined,
                score: typeof intakeScore === 'number' ? intakeScore : undefined,
                submittedAt: lead.intake?.submittedAt || (intakeStatus === 'submitted' ? new Date().toISOString() : undefined),
                data: {
                    ...((lead.intake?.data as any) || {}),
                    age: typeof intakeAnswers.age === 'number' ? intakeAnswers.age : undefined,
                    education: intakeAnswers.education,
                    languageClb: intakeAnswers.languageClb,
                    workYears: typeof intakeAnswers.workYears === 'number' ? intakeAnswers.workYears : undefined,
                    jobOffer: intakeAnswers.jobOffer,
                    relativesInCanada: intakeAnswers.relativesInCanada,
                    maritalStatus: intakeAnswers.maritalStatus,
                    spouseLanguageClb: intakeAnswers.spouseLanguageClb,
                    address: intakeAnswers.address || undefined,
                    citizenship: intakeAnswers.citizenship || undefined,
                    inCanada: intakeAnswers.inCanada,
                    visaStatus: intakeAnswers.visaStatus,
                    spouseName: intakeAnswers.spouseName || undefined,
                    spouseCitizenship: intakeAnswers.spouseCitizenship || undefined,
                },
            },
        };
        updateClientLead(updatedLead);
        toast({ title: 'Intake saved', description: 'Lead intake details have been updated.' });
        setIsEditingIntake(false);
    };

    const handleCancelIntake = () => {
        const d = (lead.intake?.data as any) || {};
        setIntakeAnswers({
            age: typeof d.age === 'number' ? d.age : '',
            education: (d.education as any) || 'bachelors',
            languageClb: (d.languageClb as any) || 'clb7',
            workYears: typeof d.workYears === 'number' ? d.workYears : '',
            jobOffer: Boolean(d.jobOffer ?? false),
            relativesInCanada: Boolean(d.relativesInCanada ?? false),
            maritalStatus: (d.maritalStatus as any) || 'single',
            spouseLanguageClb: (d.spouseLanguageClb as any) || 'none',
            address: (d.address as any) || '',
            citizenship: (d.citizenship as any) || '',
            inCanada: Boolean(d.inCanada ?? false),
            visaStatus: (d.visaStatus as any) || 'none',
            spouseName: (d.spouseName as any) || '',
            spouseCitizenship: (d.spouseCitizenship as any) || '',
        });
        setIntakeScore(lead.intake?.score ?? '');
        setIsEditingIntake(false);
    };

    const openWhatsApp = () => {
        const phone = (lead.phone || '').replace(/[^\d+]/g, '');
        const url = `https://wa.me/${phone.startsWith('+') ? phone.substring(1) : phone}`;
        window.open(url, '_blank');
    };

    const handleEditSave = () => {
        const owner = teamMembers.find(m => m.name === editOwnerName);
        const updated: ClientLead = {
            ...lead,
            name: editName.trim() || lead.name,
            company: editCompany.trim(),
            email: editEmail.trim(),
            phone: editPhone.trim(),
            source: editSource.trim(),
            owner: owner ? { name: owner.name, avatar: owner.avatar } : lead.owner,
        };
        updateClientLead(updated);
        setIsEditOpen(false);
        toast({ title: 'Lead updated', description: `${updated.name} details saved.` });
    };

    const handleOwnerSave = () => {
        const owner = teamMembers.find(m => m.name === editOwnerName);
        if (!owner) {
            toast({ title: 'Error', description: 'Please select an owner.', variant: 'destructive' });
            return;
        }
        const updated: ClientLead = { ...lead, owner: { name: owner.name, avatar: owner.avatar } } as ClientLead;
        updateClientLead(updated);
        setIsOwnerOpen(false);
        toast({ title: 'Owner changed', description: `${lead.name} is now owned by ${owner.name}.` });
    };

    const logWhatsAppMessage = () => {
        if (!whatsAppMessage.trim()) return;
        const newActivity = {
            id: Date.now(),
            type: 'Note' as const,
            notes: `[WhatsApp] ${whatsAppMessage.trim()}`,
            date: new Date().toISOString(),
        };
        setActivities(prev => [...prev, newActivity]);
        const updatedLead: ClientLead = { ...lead, activity: [...(lead.activity || []), newActivity], lastContacted: new Date().toISOString() };
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
        setActivities(prev => [...prev, newActivity]);

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
  <div className="flex h-full">
    {/* Sidebar - always visible, styled like HubSpot */}
    <aside className="w-[320px] min-w-[260px] max-w-xs flex-shrink-0 border-r bg-white/95 p-6 flex flex-col gap-4 shadow-sm z-10">
      <div className="flex flex-col items-center gap-3">
        <Avatar className={`w-20 h-20 ring-2 ${getScoreRingClasses(lead.intake?.score)} rounded-full`}>
          <AvatarImage src={lead.avatar} />
          <AvatarFallback><User className="h-10 w-10 text-muted-foreground"/></AvatarFallback>
        </Avatar>
        <div className="text-center">
          <div className="text-lg font-semibold">{lead.name}</div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Badge className={getStatusClasses(statusLocal)}>{statusLocal}</Badge>
            {typeof (lead.intake?.score) === 'number' && (
              <Badge className={getScoreBadgeClasses(lead.intake?.score)}>Score: {lead.intake?.score}</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4"/><span className="font-medium">Owner:</span><span>{lead.owner?.name || teamMembers[0]?.name || '—'}</span></div>
        <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4"/><span className="font-medium">Phone:</span><span>{lead.phone || '—'}</span></div>
        <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4"/><span className="font-medium">Email:</span><span className="truncate max-w-[140px]">{lead.email || '—'}</span></div>
        <div className="flex items-center gap-2 text-sm"><Megaphone className="h-4 w-4"/><span className="font-medium">Source:</span><span>{lead.source || '—'}</span></div>
        <div className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4"/><span className="font-medium">Created:</span><span>{new Date(lead.createdDate).toLocaleDateString()}</span></div>
        {(lead.intake?.data as any)?.address && (
          <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4"/><span className="font-medium">Address:</span><span className="truncate max-w-[140px]">{(lead.intake?.data as any)?.address}</span></div>
        )}
        {(lead.intake?.data as any)?.citizenship && (
          <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4"/><span className="font-medium">Citizenship:</span><span>{(lead.intake?.data as any)?.citizenship}</span></div>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {/* Actions: Edit, Follow, WhatsApp, etc. */}
        <Button variant="outline" onClick={() => setIsEditOpen(true)} size="sm" className="w-full">Edit Lead</Button>
        <Button variant={isFollowing ? "default" : "outline"} onClick={() => setIsFollowing(f => !f)} size="sm" className="w-full">{isFollowing ? "Following" : "Follow"}</Button>
        <Button variant="outline" onClick={openWhatsApp} size="sm" className="w-full">WhatsApp</Button>
        <Button variant="outline" onClick={() => setIsOwnerOpen(true)} size="sm" className="w-full">Change Owner</Button>
        <Button variant="outline" onClick={() => onConvert(lead.id)} size="sm" className="w-full">Convert to Client</Button>
      </div>
    </aside>
    {/* Main Content */}
    <main className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50">
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
        {/* Data Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Data Highlights</CardTitle></CardHeader>
            <CardContent>
              {/* Place summary cards/data here as needed */}
              <div className="flex flex-col gap-2">
                <div><span className="font-medium">Lifecycle Stage:</span> Lead</div>
                <div><span className="font-medium">Last Activity Date:</span> {lead.lastContacted ? new Date(lead.lastContacted).toLocaleString() : '—'}</div>
                <div><span className="font-medium">Created:</span> {new Date(lead.createdDate).toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          {/* Intake/Score summary, etc. */}
          <Card>
  <CardHeader><CardTitle>Intake & Score</CardTitle></CardHeader>
  <CardContent>
    {/* Beautiful color-coded score ring */}
    <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
      {/* Score Ring */}
      <div className="flex flex-col items-center justify-center">
        <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-8 
          ${typeof lead.intake?.score === 'number' && lead.intake.score >= 45 ? 'border-emerald-400' :
            typeof lead.intake?.score === 'number' && lead.intake.score >= 25 ? 'border-amber-400' :
            'border-rose-400'}
          bg-white shadow-inner`}
        >
          <span className="text-3xl font-bold">
            {typeof lead.intake?.score === 'number' ? lead.intake.score : '--'}
          </span>
        </div>
        <span className="mt-2 text-sm font-medium text-muted-foreground">Score</span>
      </div>
      {/* AI Possibility Calculator */}
      <div className="flex flex-col items-center">
        {(() => {
          let aiLabel = 'Unknown';
          let aiColor = 'bg-muted text-muted-foreground';
          let aiPercent = '--';
          if (typeof lead.intake?.score === 'number') {
            if (lead.intake.score >= 45) {
              aiLabel = 'High Possibility';
              aiColor = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
              aiPercent = '80%';
            } else if (lead.intake.score >= 25) {
              aiLabel = 'Medium Possibility';
              aiColor = 'bg-amber-100 text-amber-800 border border-amber-300';
              aiPercent = '40%';
            } else {
              aiLabel = 'Low Possibility';
              aiColor = 'bg-rose-100 text-rose-800 border border-rose-300';
              aiPercent = '10%';
            }
          }
          return (
            <div className="flex flex-col items-center">
              <span className={`px-4 py-2 rounded-full text-lg font-semibold mb-1 ${aiColor}`}>{aiLabel}</span>
              <span className="text-2xl font-bold">{aiPercent}</span>
              <span className="text-xs text-muted-foreground">AI Conversion Probability</span>
            </div>
          );
        })()}
      </div>
    </div>
    {/* ...existing intake UI... */}
  </CardContent>
</Card>
        </section>
        {/* Activities Section */}
        <section>
          <Card>
            <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
            <CardContent>
              {/* Timeline/feed UI here (reuse your activities logic/components) */}
              {/* ...existing activities UI... */}
            </CardContent>
          </Card>
        </section>
        {/* Other sections (tasks, notes, etc.) can be added below as needed, using Card for each */}
        {/* ...preserve all interactive and data features... */}
      </div>
    </main>
  </div>
);
                                )}
                            </Button>
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-5 w-5" />
                                </Button>
                            </SheetClose>
                        </div>
                    </div>
                </SheetHeader>
                {/* Edit Lead Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Lead</DialogTitle>
                            <DialogDescription>Update lead details and owner.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-2">
                            <div className="space-y-1">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input id="edit-name" value={editName} onChange={(e)=> setEditName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit-company">Company</Label>
                                    <Input id="edit-company" value={editCompany} onChange={(e)=> setEditCompany(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit-source">Source</Label>
                                    <Input id="edit-source" value={editSource} onChange={(e)=> setEditSource(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input id="edit-email" type="email" value={editEmail} onChange={(e)=> setEditEmail(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input id="edit-phone" value={editPhone} onChange={(e)=> setEditPhone(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Owner</Label>
                                <Select value={editOwnerName} onValueChange={setEditOwnerName}>
                                    <SelectTrigger><SelectValue placeholder="Select owner"/></SelectTrigger>
                                    <SelectContent>
                                        {teamMembers.map(tm => (
                                            <SelectItem key={tm.name} value={tm.name}>{tm.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={()=> setIsEditOpen(false)}>Cancel</Button>
                            <Button onClick={handleEditSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Change Owner Dialog */}
                <Dialog open={isOwnerOpen} onOpenChange={setIsOwnerOpen}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Change Owner</DialogTitle>
                            <DialogDescription>Select a new account owner for this lead.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label>Owner</Label>
                            <Select value={editOwnerName} onValueChange={setEditOwnerName}>
                                <SelectTrigger><SelectValue placeholder="Select owner"/></SelectTrigger>
                                <SelectContent>
                                    {teamMembers.map(tm => (
                                        <SelectItem key={tm.name} value={tm.name}>{tm.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={()=> setIsOwnerOpen(false)}>Cancel</Button>
                            <Button onClick={handleOwnerSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <div className={`overflow-y-auto flex-1 p-4 md:p-6`}>
                    {isExpanded ? (
                        <div className="p-6 grid grid-cols-12 gap-6">
                            {/* Lead Stage moved to header */}
                

                            {/* Left: Intake (Details moved to header) */}
                            <div className="col-span-12 lg:col-span-8 space-y-6">
                                <Card className="border-t-4 border-violet-200">
                                    <CardHeader>
                                        <div className="flex items-center justify-between gap-2">
                                            <CardTitle className="text-lg">Initial Intake</CardTitle>
                                            <Badge className={`${(typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? 0)) >= 45 ? 'bg-green-100 text-green-700' : (typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? 0)) >= 25 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>Score: {typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? '')}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-muted-foreground">Intake Status</p>
                                                <div className="mt-1">
                                                    <Select value={intakeStatus} onValueChange={(v) => setIntakeStatus(v as NonNullable<ClientLead['intake']>['status'])} disabled={!isEditingIntake}>
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
                                                <p className="text-muted-foreground">Age</p>
                                                <Input type="number" min={16} max={60} placeholder="e.g., 30" value={intakeAnswers.age} onChange={(e)=> setIntakeAnswers(a=> ({...a, age: e.target.value === '' ? '' : Number(e.target.value)}))} disabled={!isEditingIntake} />
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Education</p>
                                                <div className="mt-1">
                                                    <Select value={intakeAnswers.education} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, education: v as any}))} disabled={!isEditingIntake}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="high_school">High School</SelectItem>
                                                            <SelectItem value="diploma">Diploma</SelectItem>
                                                            <SelectItem value="bachelors">Bachelor's</SelectItem>
                                                            <SelectItem value="masters">Master's</SelectItem>
                                                            <SelectItem value="phd">PhD</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Language (CLB)</p>
                                                <div className="mt-1">
                                                    <Select value={intakeAnswers.languageClb} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, languageClb: v as any}))} disabled={!isEditingIntake}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="clb4">CLB 4</SelectItem>
                                                            <SelectItem value="clb5">CLB 5</SelectItem>
                                                            <SelectItem value="clb6">CLB 6</SelectItem>
                                                            <SelectItem value="clb7">CLB 7</SelectItem>
                                                            <SelectItem value="clb8">CLB 8</SelectItem>
                                                            <SelectItem value="clb9">CLB 9</SelectItem>
                                                            <SelectItem value="clb10">CLB 10</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Marital Status</p>
                                                <div className="mt-1">
                                                    <Select value={intakeAnswers.maritalStatus} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, maritalStatus: v as any}))} disabled={!isEditingIntake}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="single">Single</SelectItem>
                                                            <SelectItem value="married">Married</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            {intakeAnswers.maritalStatus === 'married' && (
                                                <div>
                                                    <p className="text-muted-foreground">Spouse Language (CLB)</p>
                                                    <div className="mt-1">
                                                        <Select value={intakeAnswers.spouseLanguageClb} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, spouseLanguageClb: v as any}))} disabled={!isEditingIntake}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">None</SelectItem>
                                                                <SelectItem value="clb4">CLB 4</SelectItem>
                                                                <SelectItem value="clb5">CLB 5</SelectItem>
                                                                <SelectItem value="clb6">CLB 6</SelectItem>
                                                                <SelectItem value="clb7">CLB 7</SelectItem>
                                                                <SelectItem value="clb8">CLB 8</SelectItem>
                                                                <SelectItem value="clb9">CLB 9</SelectItem>
                                                                <SelectItem value="clb10">CLB 10</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-muted-foreground">Canadian/Relevant Work (years)</p>
                                                <Input type="number" min={0} max={40} placeholder="e.g., 4" value={intakeAnswers.workYears} onChange={(e)=> setIntakeAnswers(a=> ({...a, workYears: e.target.value === '' ? '' : Number(e.target.value)}))} disabled={!isEditingIntake} />
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Valid Job Offer</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Checkbox id="jobOffer" checked={intakeAnswers.jobOffer} onCheckedChange={(v)=> setIntakeAnswers(a=> ({...a, jobOffer: Boolean(v)}))} disabled={!isEditingIntake} />
                                                    <Label htmlFor="jobOffer">LMIA-backed or eligible job offer</Label>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Relatives in Canada</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Checkbox id="relatives" checked={intakeAnswers.relativesInCanada} onCheckedChange={(v)=> setIntakeAnswers(a=> ({...a, relativesInCanada: Boolean(v)}))} disabled={!isEditingIntake} />
                                                    <Label htmlFor="relatives">Close family living in Canada</Label>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground">Auto Score</p>
                                                <Input value={typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? '')} readOnly />
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground">Summary</p>
                                                <Textarea placeholder="Brief intake summary..." value={intakeSummary} onChange={(e) => setIntakeSummary(e.target.value)} disabled={!isEditingIntake} />
                                            </div>
                                            <Separator className="col-span-2" />
                                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <p className="text-muted-foreground">Current Address</p>
                                                    <Input placeholder="Street, City, Province/State, Country" value={intakeAnswers.address} onChange={(e)=> setIntakeAnswers(a=> ({...a, address: e.target.value}))} disabled={!isEditingIntake} />
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Citizenship</p>
                                                    <Input placeholder="e.g., Indonesia" value={intakeAnswers.citizenship} onChange={(e)=> setIntakeAnswers(a=> ({...a, citizenship: e.target.value}))} disabled={!isEditingIntake} />
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Currently in Canada?</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Checkbox id="inCanada" checked={intakeAnswers.inCanada} onCheckedChange={(v)=> setIntakeAnswers(a=> ({...a, inCanada: Boolean(v)}))} disabled={!isEditingIntake} />
                                                        <Label htmlFor="inCanada">Yes</Label>
                                                    </div>
                                                </div>
                                                {intakeAnswers.inCanada && (
                                                    <div>
                                                        <p className="text-muted-foreground">Existing Status in Canada</p>
                                                        <div className="mt-1">
                                                            <Select value={intakeAnswers.visaStatus} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, visaStatus: v as any}))} disabled={!isEditingIntake}>
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="none">None</SelectItem>
                                                                    <SelectItem value="visitor">Visitor</SelectItem>
                                                                    <SelectItem value="study">Study Permit</SelectItem>
                                                                    <SelectItem value="work">Work Permit</SelectItem>
                                                                    <SelectItem value="pr">Permanent Resident</SelectItem>
                                                                    <SelectItem value="citizen">Citizen</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="col-span-2">
                                                    <p className="text-muted-foreground">Spouse Name</p>
                                                    <Input placeholder="Full name" value={intakeAnswers.spouseName} onChange={(e)=> setIntakeAnswers(a=> ({...a, spouseName: e.target.value}))} disabled={!isEditingIntake} />
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Spouse Citizenship</p>
                                                    <Input placeholder="e.g., Canada" value={intakeAnswers.spouseCitizenship} onChange={(e)=> setIntakeAnswers(a=> ({...a, spouseCitizenship: e.target.value}))} disabled={!isEditingIntake} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            {!isEditingIntake ? (
                                                <Button onClick={()=> setIsEditingIntake(true)}>Edit Intake</Button>
                                            ) : (
                                                <>
                                                    <Button variant="outline" onClick={handleCancelIntake}>Cancel</Button>
                                                    <Button onClick={handleSaveIntake}>Save Intake</Button>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right: Activity */}
                            <div className="col-span-12 lg:col-span-4 space-y-4">
                                <Card className="border-t-4 border-emerald-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <CardTitle className="text-lg">Activity</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Select value={activityRange} onValueChange={(v)=> setActivityRange(v as any)}>
                                                    <SelectTrigger className="h-8 w-[130px]"><SelectValue placeholder="Range"/></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="2m">Within 2 months</SelectItem>
                                                        <SelectItem value="1m">Within 1 month</SelectItem>
                                                        <SelectItem value="all">All time</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select value={activityKind} onValueChange={(v)=> setActivityKind(v as any)}>
                                                    <SelectTrigger className="h-8 w-[120px]"><SelectValue placeholder="Type"/></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All types</SelectItem>
                                                        <SelectItem value="Call">Call</SelectItem>
                                                        <SelectItem value="Email">Email</SelectItem>
                                                        <SelectItem value="Note">Note</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Button size="icon" variant="outline" className="h-8 w-8" title="Email" onClick={() => {
                                                if (lead.email) window.open(`mailto:${lead.email}`, '_blank'); else toast({ title: 'No email', description: 'This lead has no email on file.', variant: 'destructive' });
                                            }}><Mail className="h-4 w-4"/></Button>
                                            <Button size="icon" variant="outline" className="h-8 w-8" title="Call" onClick={() => {
                                                if (lead.phone) window.open(`tel:${lead.phone}`); else toast({ title: 'No phone number', description: 'This lead has no phone on file.', variant: 'destructive' });
                                            }}><PhoneCall className="h-4 w-4"/></Button>
                                            <Dialog open={isLogActivityOpen} onOpenChange={setIsLogActivityOpen}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="gap-2"><Plus className="h-4 w-4"/> Log Activity</Button>
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
                                                            <div className="space-y-4 pt-4 border-t">
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

                                        {/* WhatsApp quick log */}
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

                                        {/* Timeline */}
                                        <div className="space-y-4">
                                            {filteredActivities.length === 0 && (
                                                <p className="text-center text-sm text-muted-foreground py-4">No activities logged.</p>
                                            )}
                                            {filteredActivities.map((item) => {
                                                const Icon = activityIcons[item.type] || FileText;
                                                return (
                                                    <button key={item.id} className="flex items-start gap-3 w-full text-left hover:bg-accent/40 rounded-md p-2 -m-2" onClick={() => setActiveActivity(item)}>
                                                        <div className="bg-muted p-2 rounded-full mt-1"><Icon className="h-4 w-4 text-primary"/></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm"><span className="font-medium">{item.type}</span> • <span className="text-muted-foreground">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</span></p>
                                                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Upcoming & Overdue */}
                                <Card className="border-t-4 border-amber-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">Upcoming & Overdue</CardTitle>
                                            <div className="text-xs text-muted-foreground space-x-3">
                                                <button className="hover:underline" onClick={() => toast({ title: 'Tasks refreshed' })}>Refresh</button>
                                                <button className="hover:underline" onClick={() => setShowAllTasks(s => !s)}>{showAllTasks ? 'Collapse' : 'View All'}</button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        {upcomingTasks.length === 0 && overdueTasks.length === 0 && (
                                            <p className="text-muted-foreground">No tasks for this lead.</p>
                                        )}
                                        {upcomingTasks.length > 0 && (
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">Upcoming</p>
                                                <Separator className="my-2"/>
                                                <div className="space-y-2">
                                                    {(showAllTasks ? upcomingTasks : upcomingTasks.slice(0,5)).map(t => (
                                                        <div key={t.id} className="flex items-start gap-3">
                                                            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>
                                                            <div className="flex-1">
                                                                <p className="font-medium">{t.title}</p>
                                                                <p className="text-xs text-muted-foreground">Due {t.dueDate ? formatDistanceToNow(new Date(t.dueDate), { addSuffix: true }) : '—'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {overdueTasks.length > 0 && (
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">Overdue</p>
                                                <Separator className="my-2"/>
                                                <div className="space-y-2">
                                                    {(showAllTasks ? overdueTasks : overdueTasks.slice(0,5)).map(t => (
                                                        <div key={t.id} className="flex items-start gap-3">
                                                            <div className="mt-1 h-2 w-2 rounded-full bg-red-500"/>
                                                            <div className="flex-1">
                                                                <p className="font-medium">{t.title}</p>
                                                                <p className="text-xs text-muted-foreground">Was due {t.dueDate ? formatDistanceToNow(new Date(t.dueDate), { addSuffix: true }) : '—'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="p-0">
                            <Tabs defaultValue="details">
                                <TabsList>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                    <TabsTrigger value="summary">Summary</TabsTrigger>
                                    <TabsTrigger value="history">History</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="space-y-6 mt-4">
                                    {/* Lead Stage controls moved to header row below title? Keep stage buttons in Details for now if desired. Removing Details block as requested. */}
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between gap-2">
                                                <CardTitle className="text-lg">Initial Intake</CardTitle>
                                                <Badge className={`${(typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? 0)) >= 45 ? 'bg-green-100 text-green-700' : (typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? 0)) >= 25 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>Score: {typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? '')}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4 text-sm">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-muted-foreground">Intake Status</p>
                                                    <div className="mt-1">
                                                        <Select value={intakeStatus} onValueChange={(v) => setIntakeStatus(v as NonNullable<ClientLead['intake']>['status'])} disabled={!isEditingIntake}>
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
                                                    <p className="text-muted-foreground">Age</p>
                                                    <Input type="number" min={16} max={60} placeholder="e.g., 30" value={intakeAnswers.age} onChange={(e)=> setIntakeAnswers(a=> ({...a, age: e.target.value === '' ? '' : Number(e.target.value)}))} disabled={!isEditingIntake} />
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Education</p>
                                                    <div className="mt-1">
                                                        <Select value={intakeAnswers.education} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, education: v as any}))} disabled={!isEditingIntake}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="high_school">High School</SelectItem>
                                                                <SelectItem value="diploma">Diploma</SelectItem>
                                                                <SelectItem value="bachelors">Bachelor's</SelectItem>
                                                                <SelectItem value="masters">Master's</SelectItem>
                                                                <SelectItem value="phd">PhD</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Language (CLB)</p>
                                                    <div className="mt-1">
                                                        <Select value={intakeAnswers.languageClb} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, languageClb: v as any}))} disabled={!isEditingIntake}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="clb4">CLB 4</SelectItem>
                                                                <SelectItem value="clb5">CLB 5</SelectItem>
                                                                <SelectItem value="clb6">CLB 6</SelectItem>
                                                                <SelectItem value="clb7">CLB 7</SelectItem>
                                                                <SelectItem value="clb8">CLB 8</SelectItem>
                                                                <SelectItem value="clb9">CLB 9</SelectItem>
                                                                <SelectItem value="clb10">CLB 10</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Marital Status</p>
                                                    <div className="mt-1">
                                                        <Select value={intakeAnswers.maritalStatus} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, maritalStatus: v as any}))} disabled={!isEditingIntake}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="single">Single</SelectItem>
                                                                <SelectItem value="married">Married</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                {intakeAnswers.maritalStatus === 'married' && (
                                                    <div>
                                                        <p className="text-muted-foreground">Spouse Language (CLB)</p>
                                                        <div className="mt-1">
                                                            <Select value={intakeAnswers.spouseLanguageClb} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, spouseLanguageClb: v as any}))} disabled={!isEditingIntake}>
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="none">None</SelectItem>
                                                                    <SelectItem value="clb4">CLB 4</SelectItem>
                                                                    <SelectItem value="clb5">CLB 5</SelectItem>
                                                                    <SelectItem value="clb6">CLB 6</SelectItem>
                                                                    <SelectItem value="clb7">CLB 7</SelectItem>
                                                                    <SelectItem value="clb8">CLB 8</SelectItem>
                                                                    <SelectItem value="clb9">CLB 9</SelectItem>
                                                                    <SelectItem value="clb10">CLB 10</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-muted-foreground">Canadian/Relevant Work (years)</p>
                                                    <Input type="number" min={0} max={40} placeholder="e.g., 4" value={intakeAnswers.workYears} onChange={(e)=> setIntakeAnswers(a=> ({...a, workYears: e.target.value === '' ? '' : Number(e.target.value)}))} disabled={!isEditingIntake} />
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Valid Job Offer</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Checkbox id="jobOffer2" checked={intakeAnswers.jobOffer} onCheckedChange={(v)=> setIntakeAnswers(a=> ({...a, jobOffer: Boolean(v)}))} disabled={!isEditingIntake} />
                                                        <Label htmlFor="jobOffer2">LMIA-backed or eligible job offer</Label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Relatives in Canada</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Checkbox id="relatives2" checked={intakeAnswers.relativesInCanada} onCheckedChange={(v)=> setIntakeAnswers(a=> ({...a, relativesInCanada: Boolean(v)}))} disabled={!isEditingIntake} />
                                                        <Label htmlFor="relatives2">Close family living in Canada</Label>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-muted-foreground">Auto Score</p>
                                                    <Input value={typeof intakeScore === 'number' ? intakeScore : (lead.intake?.score ?? '')} readOnly />
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-muted-foreground">Summary</p>
                                                    <Textarea placeholder="Brief intake summary..." value={intakeSummary} onChange={(e) => setIntakeSummary(e.target.value)} disabled={!isEditingIntake} />
                                                </div>
                                                <Separator className="col-span-2" />
                                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <p className="text-muted-foreground">Current Address</p>
                                                        <Input placeholder="Street, City, Province/State, Country" value={intakeAnswers.address} onChange={(e)=> setIntakeAnswers(a=> ({...a, address: e.target.value}))} disabled={!isEditingIntake} />
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Citizenship</p>
                                                        <Input placeholder="e.g., Indonesia" value={intakeAnswers.citizenship} onChange={(e)=> setIntakeAnswers(a=> ({...a, citizenship: e.target.value}))} disabled={!isEditingIntake} />
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Currently in Canada?</p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <Checkbox id="inCanada2" checked={intakeAnswers.inCanada} onCheckedChange={(v)=> setIntakeAnswers(a=> ({...a, inCanada: Boolean(v)}))} disabled={!isEditingIntake} />
                                                            <Label htmlFor="inCanada2">Yes</Label>
                                                        </div>
                                                    </div>
                                                    {intakeAnswers.inCanada && (
                                                        <div>
                                                            <p className="text-muted-foreground">Existing Status in Canada</p>
                                                            <div className="mt-1">
                                                                <Select value={intakeAnswers.visaStatus} onValueChange={(v)=> setIntakeAnswers(a=> ({...a, visaStatus: v as any}))} disabled={!isEditingIntake}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="none">None</SelectItem>
                                                                        <SelectItem value="visitor">Visitor</SelectItem>
                                                                        <SelectItem value="study">Study Permit</SelectItem>
                                                                        <SelectItem value="work">Work Permit</SelectItem>
                                                                        <SelectItem value="pr">Permanent Resident</SelectItem>
                                                                        <SelectItem value="citizen">Citizen</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="col-span-2">
                                                        <p className="text-muted-foreground">Spouse Name</p>
                                                        <Input placeholder="Full name" value={intakeAnswers.spouseName} onChange={(e)=> setIntakeAnswers(a=> ({...a, spouseName: e.target.value}))} disabled={!isEditingIntake} />
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Spouse Citizenship</p>
                                                        <Input placeholder="e.g., Canada" value={intakeAnswers.spouseCitizenship} onChange={(e)=> setIntakeAnswers(a=> ({...a, spouseCitizenship: e.target.value}))} disabled={!isEditingIntake} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                {!isEditingIntake ? (
                                                    <Button onClick={()=> setIsEditingIntake(true)}>Edit Intake</Button>
                                                ) : (
                                                    <>
                                                        <Button variant="outline" onClick={handleCancelIntake}>Cancel</Button>
                                                        <Button onClick={handleSaveIntake}>Save Intake</Button>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                
                                <TabsContent value="summary" className="space-y-6 mt-4">
                                    <Card>
                                        <CardHeader className="pb-3"><CardTitle className="text-lg">Additional Information</CardTitle></CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                            <div><p className="text-muted-foreground">Last Activity Date</p><p>{lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString() : '—'}</p></div>
                                            <div><p className="text-muted-foreground">Open Opportunities</p><p>$0.00</p></div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="history" className="space-y-6 mt-4">
                                    <Card>
                                        <CardHeader className="pb-3"><CardTitle className="text-lg">Account History</CardTitle></CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">No history available.</CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="activity" className="mt-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <CardTitle className="text-lg">Activity</CardTitle>
                                                <div className="flex items-center gap-2">
                                                    <Select value={activityRange} onValueChange={(v)=> setActivityRange(v as any)}>
                                                        <SelectTrigger className="h-8 w-[130px]"><SelectValue placeholder="Range"/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="2m">Within 2 months</SelectItem>
                                                            <SelectItem value="1m">Within 1 month</SelectItem>
                                                            <SelectItem value="all">All time</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={activityKind} onValueChange={(v)=> setActivityKind(v as any)}>
                                                        <SelectTrigger className="h-8 w-[120px]"><SelectValue placeholder="Type"/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All types</SelectItem>
                                                            <SelectItem value="Call">Call</SelectItem>
                                                            <SelectItem value="Email">Email</SelectItem>
                                                            <SelectItem value="Note">Note</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                <Button size="icon" variant="outline" className="h-8 w-8" title="Email"><Mail className="h-4 w-4"/></Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8" title="Call"><PhoneCall className="h-4 w-4"/></Button>
                                                <Button size="sm" variant="outline" onClick={() => setIsLogActivityOpen(true)} className="gap-2"><Plus className="h-4 w-4"/> Log Activity</Button>
                                            </div>
                                            <div className="space-y-4">
                                                {filteredActivities.length === 0 && (
                                                    <p className="text-center text-sm text-muted-foreground py-4">No activities logged.</p>
                                                )}
                                                {filteredActivities.map((item) => {
                                                    const Icon = activityIcons[item.type] || FileText;
                                                    return (
                                                        <button key={item.id} className="flex items-start gap-3 w-full text-left hover:bg-accent/40 rounded-md p-2 -m-2" onClick={() => setActiveActivity(item)}>
                                                            <div className="bg-muted p-2 rounded-full mt-1"><Icon className="h-4 w-4 text-primary"/></div>
                                                            <div className="flex-1">
                                                                <p className="text-sm"><span className="font-medium">{item.type}</span> • <span className="text-muted-foreground">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</span></p>
                                                                <p className="text-sm text-muted-foreground">{item.notes}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
                {/* Global Activity Detail Dialog */}
                <Dialog open={!!activeActivity} onOpenChange={(open)=> !open && setActiveActivity(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Activity Details</DialogTitle>
                            <DialogDescription>Full log information for this activity.</DialogDescription>
                        </DialogHeader>
                        {activeActivity && (
                            <div className="space-y-3 py-2 text-sm">
                                <div className="flex items-center gap-2"><Badge>{activeActivity.type}</Badge><span className="text-muted-foreground">{format(new Date(activeActivity.date), 'PPpp')} ({formatDistanceToNow(new Date(activeActivity.date), { addSuffix: true })})</span></div>
                                <Separator />
                                <div>
                                    <p className="font-medium mb-1">Notes</p>
                                    <p className="whitespace-pre-wrap break-words">{activeActivity.notes}</p>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setActiveActivity(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                 <SheetFooter className="p-6 border-t shrink-0">
                    <Button className="w-full" size="lg" onClick={() => onConvert(lead.id)}>Convert to Client</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
