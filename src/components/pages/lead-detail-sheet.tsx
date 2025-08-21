
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
import { IntakeScoreQuestionnaire } from "../intake-score-questionnaire";

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
        frenchClb: 'none'|'clb4'|'clb5'|'clb6'|'clb7'|'clb8'|'clb9'|'clb10';
        workYears: number | '';
        workInCanadaYears: number | '';
        jobOffer: boolean;
        relativesInCanada: boolean;
        maritalStatus: 'single'|'married';
        spouseLanguageClb: 'none'|'clb4'|'clb5'|'clb6'|'clb7'|'clb8'|'clb9'|'clb10';
        spouseEducation: 'high_school'|'diploma'|'bachelors'|'masters'|'phd'|'';
        address: string;
        citizenship: string;
        inCanada: boolean;
        visaStatus: 'none'|'visitor'|'study'|'work'|'pr'|'citizen';
        spouseName: string;
        spouseCitizenship: string;
        hasChildren: boolean;
        childrenCount: number | '';
    }>(() => {
        const d = (lead.intake?.data as any) || {};
        return {
            age: typeof d.age === 'number' ? d.age : '',
            education: (d.education as any) || 'bachelors',
            languageClb: (d.languageClb as any) || 'clb7',
            frenchClb: (d.frenchClb as any) || 'none',
            workYears: typeof d.workYears === 'number' ? d.workYears : '',
            workInCanadaYears: typeof d.workInCanadaYears === 'number' ? d.workInCanadaYears : '',
            jobOffer: Boolean(d.jobOffer ?? false),
            relativesInCanada: Boolean(d.relativesInCanada ?? false),
            maritalStatus: (d.maritalStatus as any) || 'single',
            spouseLanguageClb: (d.spouseLanguageClb as any) || 'none',
            spouseEducation: (d.spouseEducation as any) || '',
            address: (d.address as any) || '',
            citizenship: (d.citizenship as any) || '',
            inCanada: Boolean(d.inCanada ?? false),
            visaStatus: (d.visaStatus as any) || 'none',
            spouseName: (d.spouseName as any) || '',
            spouseCitizenship: (d.spouseCitizenship as any) || '',
            hasChildren: Boolean(d.hasChildren ?? false),
            childrenCount: typeof d.childrenCount === 'number' ? d.childrenCount : '',
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
    // Show initial screening questionnaire inline when there is no score yet, or when retake is requested
    const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(!Boolean(lead.intake?.score));
    
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
            frenchClb: (d.frenchClb as any) || 'none',
            workYears: typeof d.workYears === 'number' ? d.workYears : '',
            workInCanadaYears: typeof d.workInCanadaYears === 'number' ? d.workInCanadaYears : '',
            jobOffer: Boolean(d.jobOffer ?? false),
            relativesInCanada: Boolean(d.relativesInCanada ?? false),
            maritalStatus: (d.maritalStatus as any) || 'single',
            spouseLanguageClb: (d.spouseLanguageClb as any) || 'none',
            spouseEducation: (d.spouseEducation as any) || '',
            address: (d.address as any) || '',
            citizenship: (d.citizenship as any) || '',
            inCanada: Boolean(d.inCanada ?? false),
            visaStatus: (d.visaStatus as any) || 'none',
            spouseName: (d.spouseName as any) || '',
            spouseCitizenship: (d.spouseCitizenship as any) || '',
            hasChildren: Boolean(d.hasChildren ?? false),
            childrenCount: typeof d.childrenCount === 'number' ? d.childrenCount : '',
        });
        setIntakeScore(lead.intake?.score ?? '');
        setShowQuestionnaire(!Boolean(lead.intake?.score));
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
        // French bonus for CLB7+
        const frenchBonusMap: Record<typeof intakeAnswers.frenchClb, number> = { none: 0, clb4: 0, clb5: 0, clb6: 0, clb7: 10, clb8: 12, clb9: 15, clb10: 20 };
        const frenchPts = frenchBonusMap[intakeAnswers.frenchClb];
        const work = typeof intakeAnswers.workYears === 'number' ? intakeAnswers.workYears : 0;
        const workPts = work >= 6 ? 12 : work >= 4 ? 10 : work >= 2 ? 8 : work >= 1 ? 5 : 0;
        // Canadian work experience bonus
        const caWork = typeof intakeAnswers.workInCanadaYears === 'number' ? intakeAnswers.workInCanadaYears : 0;
        const caWorkPts = caWork >= 2 ? 10 : caWork >= 1 ? 5 : 0;
        const offerPts = intakeAnswers.jobOffer ? 10 : 0;
        const familyPts = intakeAnswers.relativesInCanada ? 5 : 0;
        const marriageBase = intakeAnswers.maritalStatus === 'married' ? 5 : 0;
        const spouseLangPtsMap: Record<string, number> = { none: 0, clb4: 1, clb5: 2, clb6: 3, clb7: 4, clb8: 5, clb9: 6, clb10: 7 };
        const spouseLangPts = intakeAnswers.maritalStatus === 'married' ? (spouseLangPtsMap[intakeAnswers.spouseLanguageClb] ?? 0) : 0;
        const spouseEduPtsMap: Record<string, number> = { high_school: 2, diploma: 3, bachelors: 5, masters: 6, phd: 8 };
        const spouseEduPts = intakeAnswers.maritalStatus === 'married' ? (spouseEduPtsMap[intakeAnswers.spouseEducation] || 0) : 0;
        const children = typeof intakeAnswers.childrenCount === 'number' ? intakeAnswers.childrenCount : 0;
        const childrenPts = intakeAnswers.hasChildren ? Math.min(children * 2, 6) : 0; // +2 per child, max +6
        setIntakeScore(agePts + eduPts + langPts + frenchPts + workPts + caWorkPts + offerPts + familyPts + marriageBase + spouseLangPts + spouseEduPts + childrenPts);
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
                    frenchClb: intakeAnswers.frenchClb,
                    workYears: typeof intakeAnswers.workYears === 'number' ? intakeAnswers.workYears : undefined,
                    workInCanadaYears: typeof intakeAnswers.workInCanadaYears === 'number' ? intakeAnswers.workInCanadaYears : undefined,
                    jobOffer: intakeAnswers.jobOffer,
                    relativesInCanada: intakeAnswers.relativesInCanada,
                    maritalStatus: intakeAnswers.maritalStatus,
                    spouseLanguageClb: intakeAnswers.spouseLanguageClb,
                    spouseEducation: intakeAnswers.spouseEducation || undefined,
                    address: intakeAnswers.address || undefined,
                    citizenship: intakeAnswers.citizenship || undefined,
                    inCanada: intakeAnswers.inCanada,
                    visaStatus: intakeAnswers.visaStatus,
                    spouseName: intakeAnswers.spouseName || undefined,
                    spouseCitizenship: intakeAnswers.spouseCitizenship || undefined,
                    hasChildren: intakeAnswers.hasChildren,
                    childrenCount: typeof intakeAnswers.childrenCount === 'number' ? intakeAnswers.childrenCount : undefined,
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
        frenchClb: (d.frenchClb as any) || 'none',
        workYears: typeof d.workYears === 'number' ? d.workYears : '',
        workInCanadaYears: typeof d.workInCanadaYears === 'number' ? d.workInCanadaYears : '',
        jobOffer: Boolean(d.jobOffer ?? false),
        relativesInCanada: Boolean(d.relativesInCanada ?? false),
        maritalStatus: (d.maritalStatus as any) || 'single',
        spouseLanguageClb: (d.spouseLanguageClb as any) || 'none',
        spouseEducation: (d.spouseEducation as any) || '',
        address: (d.address as any) || '',
        citizenship: (d.citizenship as any) || '',
        inCanada: Boolean(d.inCanada ?? false),
        visaStatus: (d.visaStatus as any) || 'none',
        spouseName: (d.spouseName as any) || '',
        spouseCitizenship: (d.spouseCitizenship as any) || '',
        hasChildren: Boolean(d.hasChildren ?? false),
        childrenCount: typeof d.childrenCount === 'number' ? d.childrenCount : '',
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
        <span className="mt-2 text-sm font-medium text-muted-foreground">Immigration Score</span>
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
              {typeof lead.intake?.score === 'number' && !showQuestionnaire && (
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => setShowQuestionnaire(true)}>Retake Screening</Button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
    {/* Intake edit form */}
    <div className="w-full mt-4">
      {!isEditingIntake && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditingIntake(true)}>Edit Intake</Button>
        </div>
      )}
      {isEditingIntake && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Marital Status</Label>
              <Select value={intakeAnswers.maritalStatus} onValueChange={(v: 'single'|'married') => setIntakeAnswers(a => ({...a, maritalStatus: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>French Language (CLB)</Label>
              <Select value={intakeAnswers.frenchClb} onValueChange={(v: any) => setIntakeAnswers(a => ({...a, frenchClb: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select"/></SelectTrigger>
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
            <div>
              <Label>Children</Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="has-children" checked={intakeAnswers.hasChildren} onCheckedChange={(v) => setIntakeAnswers(a => ({...a, hasChildren: Boolean(v), childrenCount: Boolean(v) ? (typeof a.childrenCount === 'number' ? a.childrenCount : 1) : ''}))} />
                  <Label htmlFor="has-children">Has Children</Label>
                </div>
                {intakeAnswers.hasChildren && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="children-count">Count</Label>
                    <Input id="children-count" type="number" min={1} max={10} className="w-24" value={typeof intakeAnswers.childrenCount === 'number' ? intakeAnswers.childrenCount : ''} onChange={(e) => {
                      const n = parseInt(e.target.value, 10);
                      setIntakeAnswers(a => ({...a, childrenCount: isNaN(n) ? '' : Math.max(1, Math.min(10, n)) }))
                    }} />
                    <span className="text-xs text-muted-foreground">(+2 each, max +6)</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>Canadian Work Experience (years)</Label>
              <Input className="mt-1" type="number" min={0} max={30} value={typeof intakeAnswers.workInCanadaYears === 'number' ? intakeAnswers.workInCanadaYears : ''} onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                setIntakeAnswers(a => ({...a, workInCanadaYears: isNaN(n) ? '' : Math.max(0, Math.min(30, n)) }));
              }} />
            </div>
          </div>
          {intakeAnswers.maritalStatus === 'married' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Spouse Name</Label>
                <Input className="mt-1" value={intakeAnswers.spouseName} onChange={e => setIntakeAnswers(a => ({...a, spouseName: e.target.value}))} placeholder="e.g., John Doe"/>
              </div>
              <div>
                <Label>Spouse Citizenship</Label>
                <Input className="mt-1" value={intakeAnswers.spouseCitizenship} onChange={e => setIntakeAnswers(a => ({...a, spouseCitizenship: e.target.value}))} placeholder="e.g., Canada"/>
              </div>
              <div>
                <Label>Spouse Language (CLB)</Label>
                <Select value={intakeAnswers.spouseLanguageClb} onValueChange={(v: any) => setIntakeAnswers(a => ({...a, spouseLanguageClb: v}))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select"/></SelectTrigger>
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
              <div>
                <Label>Spouse Education</Label>
                <Select value={intakeAnswers.spouseEducation} onValueChange={(v: any) => setIntakeAnswers(a => ({...a, spouseEducation: v}))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select"/></SelectTrigger>
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
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveIntake}>Save Intake</Button>
            <Button size="sm" variant="outline" onClick={handleCancelIntake}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
    </CardContent>
  </Card>
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
}
