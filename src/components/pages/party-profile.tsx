"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Client, ClientLead, Task, Agreement, IntakeForm, IntakeFormAnalysis, ClientDocument, TeamMember, ApplicationStatus } from "@/lib/data";
import { CalendarCheck, FileText, MessageSquare, Download, Eye, Upload, CheckSquare, Plus, FilePlus, Trash2, Phone, Mail, Users, Sparkles, BrainCircuit, Loader2, AlertTriangle, Handshake, Landmark, Edit, FileHeart, AlertCircle, Flag, Package, CheckCircle, XCircle, FileDown, UserCheck, Megaphone } from "lucide-react";
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
import { LeadStatusProgress } from "@/components/lead-status-progress";
import { IntakeScoreQuestionnaire } from "../intake-score-questionnaire";

// Discriminated union type for party
export type Party = (Client & { partyType: 'client' }) | (ClientLead & { partyType: 'lead' });

export interface PartyProfileProps {
  party: Party;
  onUpdateParty: (updated: Party) => void;
}

// Helper to get status badge variant for both types
const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'active client':
      return 'success';
    case 'work permit': return 'info';
    case 'pending review': return 'warning';
    case 'high': return 'destructive';
    case 'new': return 'default';
    case 'contacted': return 'info';
    case 'qualified': return 'success';
    case 'unqualified': return 'destructive';
    default: return 'secondary';
  }
};

// --- Begin full ClientProfile superset logic ---

export const PartyProfile: React.FC<PartyProfileProps> = ({ party, onUpdateParty }) => {
  // All state and handlers from ClientProfile, adapted for party
  // ... (snip: all state variables, hooks, and handlers)
  // For brevity, this is a placeholder for the full migration, including:
  // - Document upload/assignment
  // - Activity, tasks, agreements, intake, timeline, dialogs, etc.
  // - Conditional logic for client/lead differences
  //
  // Key differences:
  // - Status: use correct status set
  // - Owner: show owner for leads, connected lawyer for clients
  // - Convert to client: show button/dialog for leads only

  // Document status badge variant (copied from ClientProfile)
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

  // Local docs state for leads (clients use their own docs)
  const [leadDocs, setLeadDocs] = useState<ClientDocument[]>(() => (party as any).documents || []);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [viewingDocument, setViewingDocument] = useState<ClientDocument | null>(null);
  const [isDocAnalyzing, setIsDocAnalyzing] = useState(false);
  const [docAnalysisResult, setDocAnalysisResult] = useState<DocumentAnalysisOutput | null>(null);
  const [analyzedDocTitle, setAnalyzedDocTitle] = useState('');
  // Tabs state (controlled) to allow switching to Convert programmatically
  const [tabsValue, setTabsValue] = useState<string>('overview');

  // Tasks state for leads (clients use their own tasks on the party object)
  const [leadTasks, setLeadTasks] = useState<Task[]>(() => (party as any).tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('Medium');
  const { userProfile } = useGlobalData?.() || ({} as any);

  // Lead activity log form state
  const [newActivityType, setNewActivityType] = useState<'Call' | 'Email' | 'Note'>('Email');
  const [newActivityNotes, setNewActivityNotes] = useState('');
  const addLeadActivity = () => {
    if (party.partyType !== 'lead') return;
    if (!newActivityNotes.trim()) return;
    const next = {
      id: Date.now(),
      type: newActivityType,
      notes: newActivityNotes.trim(),
      date: format(new Date(), 'yyyy-MM-dd HH:mm')
    };
    const updated = { ...party, activity: ([...(party as any).activity || [], next]) } as Party;
    onUpdateParty(updated);
    setNewActivityNotes('');
    setNewActivityType('Email');
  };

  const docs: ClientDocument[] = useMemo(() => {
    if (party.partyType === 'client') return ((party as Client).documents) || [];
    return leadDocs;
  }, [party, leadDocs]);

  const tasks: Task[] = useMemo(() => {
    if (party.partyType === 'client') return ((party as Client).tasks) || [];
    return leadTasks;
  }, [party, leadTasks]);

  const updateDocStatus = (docId: number, status: ClientDocument['status']) => {
    const updater = (arr: ClientDocument[]) => arr.map(d => d.id === docId ? { ...d, status } : d);
    if (party.partyType === 'client') {
      const updated = { ...(party as Client), documents: updater(((party as Client).documents) || []) } as Party;
      onUpdateParty(updated);
    } else {
      setLeadDocs(prev => updater(prev));
    }
  };

  // Lead-only: document CRUD helpers
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('');
  const [newDocType, setNewDocType] = useState<'form' | 'supporting'>('supporting');
  const [newDocUrl, setNewDocUrl] = useState('');

  const addLeadDocument = () => {
    if (party.partyType !== 'lead') return;
    if (!newDocTitle.trim()) return;
    const newDoc: ClientDocument = {
      id: Date.now(),
      title: newDocTitle.trim(),
      category: newDocCategory || 'General',
      dateAdded: format(new Date(), 'yyyy-MM-dd'),
      status: 'Uploaded',
      type: newDocType,
      url: newDocUrl || undefined,
    };
    setLeadDocs(prev => [newDoc, ...prev]);
    setNewDocTitle('');
    setNewDocCategory('');
    setNewDocType('supporting');
    setNewDocUrl('');
  };

  const [editingDocId, setEditingDocId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<'form' | 'supporting'>('supporting');
  const [editUrl, setEditUrl] = useState('');
  const [editStatus, setEditStatus] = useState<ClientDocument['status']>('Uploaded');

  const startEditDoc = (doc: ClientDocument) => {
    setEditingDocId(doc.id);
    setEditTitle(doc.title);
    setEditCategory(doc.category);
    setEditType(doc.type);
    setEditUrl(doc.url || '');
    setEditStatus(doc.status);
  };
  const cancelEditDoc = () => {
    setEditingDocId(null);
  };
  const saveEditDoc = () => {
    if (party.partyType !== 'lead' || editingDocId == null) return;
    setLeadDocs(prev => prev.map(d => d.id === editingDocId ? {
      ...d,
      title: editTitle,
      category: editCategory || d.category,
      type: editType,
      url: editUrl || undefined,
      status: editStatus,
    } : d));
    setEditingDocId(null);
  };
  const deleteDoc = (docId: number) => {
    if (party.partyType !== 'lead') return;
    setLeadDocs(prev => prev.filter(d => d.id !== docId));
    if (selectedDocId === docId) setSelectedDocId(null);
  };

  const handleAnalyzeDocument = async (doc: ClientDocument) => {
    setIsDocAnalyzing(true);
    setDocAnalysisResult(null);
    setAnalyzedDocTitle(doc.title);
    try {
      const result = await analyzeDocument({ title: doc.title, category: doc.category });
      setDocAnalysisResult(result);
    } finally {
      setIsDocAnalyzing(false);
    }
  };

  // Local toggle to show questionnaire even if a score exists
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  return (
    <div className="animate-fade">
      {/* Hero Header — mirror ClientProfile */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar className="w-24 h-24 border-2 border-primary">
          <AvatarImage src={party.avatar || (party.partyType === 'lead' ? party.owner?.avatar : undefined)} alt={party.name} />
          <AvatarFallback>{party.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="text-2xl font-bold">{party.name}</h2>
                <Badge variant={getStatusBadgeVariant(party.status)}>{party.status}</Badge>
                {party.partyType === 'client' ? (
                  <Badge variant={getStatusBadgeVariant((party as any).caseType || '')}>{(party as any).caseType}</Badge>
                ) : (
                  <Badge variant="secondary">{party.source || 'Lead'}</Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{party.email} • {party.phone}</p>
            </div>
            {/* Right-side actions */}
            <div className="flex-shrink-0">
              {party.partyType === 'lead' && (
                <Button onClick={() => setTabsValue('convert')} className="font-bold">Convert to Client</Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            {party.partyType === 'client' ? (
              <>
                <div>
                  <p className="text-muted-foreground">Country of Origin</p>
                  <p className="font-medium">{(party as any).countryOfOrigin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Location</p>
                  <p className="font-medium">{(party as any).currentLocation}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{(party as any).age}</p>
                </div>
                <div>
                  <p suppressHydrationWarning className="text-muted-foreground">Joined</p>
                  <p suppressHydrationWarning className="font-medium">{(party as any).joined}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-muted-foreground">Owner</p>
                  <p className="font-medium">{party.owner?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Source</p>
                  <p className="font-medium">{party.source || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Contact</p>
                  <p className="font-medium">{(party as any).lastContacted || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{(party as any).createdDate || '—'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs — mirror ClientProfile ordering */}
      <Tabs value={tabsValue} onValueChange={setTabsValue} className="mt-6">
        <div className="flex justify-between items-center border-b">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            {party.partyType === 'client' && <TabsTrigger value="agreements">Agreements</TabsTrigger>}
            {party.partyType === 'client' && <TabsTrigger value="intake-form">Intake Form</TabsTrigger>}
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            {party.partyType === 'client' && <TabsTrigger value="timeline">Timeline</TabsTrigger>}
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview TabContent — unified grid */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{party.partyType === 'lead' ? 'Lead Summary' : 'Case Summary'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {party.partyType === 'lead' ? (
                    <LeadSummaryEditable
                      party={party}
                      onUpdateParty={onUpdateParty}
                    />
                  ) : (
                    <>
                      <div>
                        <p className="text-muted-foreground">Priority</p>
                        <p className="font-bold text-base">{(party as any).caseSummary?.priority}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Case Type</p>
                        <p className="font-semibold">{(party as any).caseSummary?.caseType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Education</p>
                        <p className="font-semibold">{(party as any).educationLevel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Status</p>
                        <Badge variant={getStatusBadgeVariant((party as any).caseSummary?.currentStatus)}>{(party as any).caseSummary?.currentStatus}</Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Lead Progress tracker — clickable stages */}
              {party.partyType === 'lead' && (
                <LeadStatusProgress
                  currentStatus={(party as any).status as any}
                  onChange={(next) => {
                    const updated = { ...party, status: next } as Party;
                    onUpdateParty(updated);
                  }}
                />
              )}
              {/* Intake Questionnaire for leads before AI Lead Score */}
              {party.partyType === 'lead' && (!(party as any).intake?.score || showQuestionnaire) && (
                <IntakeScoreQuestionnaire
                  onScore={(score, answers) => {
                    const updated = { ...party, intake: { ...((party as any).intake || {}), score, answers } };
                    onUpdateParty(updated);
                    setShowQuestionnaire(false);
                  }}
                />
              )}
              {/* Score + Tasks row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Lead Score Card, only after intake score is present */}
                {party.partyType === 'lead' && (party as any).intake?.score && !showQuestionnaire && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <CardTitle>AI Lead Score</CardTitle>
                        <Button size="sm" onClick={() => setShowQuestionnaire(true)}>Retake Screening</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center gap-6 py-2">
                        {/* Immigration Score Ring */}
                        <div className="flex flex-col items-center justify-center">
                          <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-8 ${((party as any).intake?.score ?? 0) >= 45 ? 'border-emerald-400' : ((party as any).intake?.score ?? 0) >= 25 ? 'border-amber-400' : 'border-rose-400'} bg-white shadow-inner`}>
                            <span className="text-3xl font-bold">{typeof (party as any).intake?.score === 'number' ? (party as any).intake?.score : '--'}</span>
                          </div>
                          <span className="mt-2 text-sm font-medium text-muted-foreground">Immigration Score</span>
                        </div>
                        {/* AI Probability */}
                        <div className="flex flex-col items-center">
                          {(() => {
                            const score = (party as any).intake?.score as number | undefined;
                            let aiLabel = 'Unknown';
                            let aiColor = 'bg-muted text-muted-foreground';
                            let aiPercent: string | number = '--';
                            if (typeof score === 'number') {
                              if (score >= 45) { aiLabel = 'High Possibility'; aiColor = 'bg-emerald-100 text-emerald-800 border border-emerald-300'; aiPercent = '80%'; }
                              else if (score >= 25) { aiLabel = 'Medium Possibility'; aiColor = 'bg-amber-100 text-amber-800 border border-amber-300'; aiPercent = '40%'; }
                              else { aiLabel = 'Low Possibility'; aiColor = 'bg-rose-100 text-rose-800 border border-rose-300'; aiPercent = '10%'; }
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
                    </CardContent>
                  </Card>
                )}

                {/* Lead Overview Tasks block */}
                {party.partyType === 'lead' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tasks</CardTitle>
                      <CardDescription>Quickly add and manage tasks right from the overview.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 grid gap-3 md:grid-cols-5">
                        <Input
                          placeholder="Task title"
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          className="md:col-span-2"
                        />
                        <Input
                          type="date"
                          value={newTaskDue}
                          onChange={e => setNewTaskDue(e.target.value)}
                          title="Due date"
                        />
                        <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as Task['priority'])}>
                          <SelectTrigger className="w-full"><SelectValue placeholder="Priority" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="md:col-span-5 flex justify-end">
                          <Button size="sm" onClick={() => {
                            if (!newTaskTitle.trim()) return;
                            const task: Task = {
                              id: Date.now(),
                              title: newTaskTitle.trim(),
                              description: undefined,
                              client: { id: (party as any).id, name: party.name, avatar: (party as any).avatar || '' },
                              assignedTo: userProfile ? { name: userProfile.name, avatar: (userProfile as any).avatar || '' } : { name: 'Owner', avatar: '' },
                              dueDate: newTaskDue || format(new Date(), 'yyyy-MM-dd'),
                              priority: newTaskPriority,
                              status: 'To Do',
                            };
                            setLeadTasks(prev => [task, ...prev]);
                            setNewTaskTitle('');
                            setNewTaskDue('');
                            setNewTaskPriority('Medium');
                          }}>Add Task</Button>
                        </div>
                      </div>

                      {(!tasks || tasks.length === 0) ? (
                        <div className="text-center py-6 text-muted-foreground">No tasks yet.</div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Due</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tasks.slice(0, 5).map(t => (
                                <TableRow key={t.id}>
                                  <TableCell className="font-medium">{t.title}</TableCell>
                                  <TableCell>{t.dueDate}</TableCell>
                                  <TableCell>
                                    <Badge variant={t.priority === 'High' ? 'destructive' : t.priority === 'Medium' ? 'warning' : 'secondary'}>{t.priority}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={t.status}
                                      onValueChange={(v) => setLeadTasks(prev => prev.map(x => x.id === t.id ? { ...x, status: v as Task['status'] } : x))}
                                    >
                                      <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="To Do">To Do</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" title="Delete" onClick={() => setLeadTasks(prev => prev.filter(x => x.id !== t.id))}>
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              {/* End Intake/AI Lead Score logic */}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {party.partyType === 'lead' && (
                    <div className="mb-4 grid gap-3 md:grid-cols-5">
                      <Select value={newActivityType} onValueChange={(v) => setNewActivityType(v as 'Call' | 'Email' | 'Note')}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Call">Call</SelectItem>
                          <SelectItem value="Note">Note</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Notes (e.g., discussed pricing, sent follow-up, chat recap)"
                        value={newActivityNotes}
                        onChange={e => setNewActivityNotes(e.target.value)}
                        className="md:col-span-3"
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={addLeadActivity}>Log Activity</Button>
                      </div>
                    </div>
                  )}
                  {!(party as any).activity?.length ? (
                    <div className="text-center py-10 text-muted-foreground">No activity logged yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {(party as any).activity.map((a: any) => (
                        <div key={a.id} className="flex items-start justify-between border rounded-md p-3">
                          <div>
                            <div className="font-medium">{a.type}</div>
                            <div className="text-sm text-muted-foreground">{a.notes}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{a.date}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Documents TabContent — mirrors ClientProfile minimal parity */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>Manage and review documents for this {party.partyType}.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Lead-only upload form */}
              {party.partyType === 'lead' && (
                <div className="mb-4 grid gap-3 md:grid-cols-5">
                  <Input placeholder="Document title" value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)} className="md:col-span-2" />
                  <Select value={newDocCategory} onValueChange={setNewDocCategory}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      {documentCategories?.map((c: any) => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newDocType} onValueChange={(v) => setNewDocType(v as 'form' | 'supporting')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supporting">Supporting</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="URL (optional)" value={newDocUrl} onChange={e => setNewDocUrl(e.target.value)} />
                  <div className="md:col-span-5 flex justify-end">
                    <Button size="sm" onClick={addLeadDocument}>Upload</Button>
                  </div>
                </div>
              )}

              {(!docs || docs.length === 0) ? (
                <div className="text-center py-10 text-muted-foreground">No documents yet.</div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {docs.map(doc => {
                        const isEditing = party.partyType === 'lead' && editingDocId === doc.id;
                        return (
                          <TableRow key={doc.id} onClick={() => setSelectedDocId(doc.id)} className={cn("cursor-pointer", selectedDocId === doc.id && "bg-muted")}>
                            <TableCell className="font-medium">
                              {isEditing ? (
                                <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                              ) : (
                                doc.title
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Select value={editCategory} onValueChange={setEditCategory}>
                                  <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
                                  <SelectContent>
                                    {documentCategories?.map((c: any) => (
                                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                    ))}
                                    <SelectItem value="General">General</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                doc.category
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Select value={editStatus} onValueChange={(v) => setEditStatus(v as ClientDocument['status'])}>
                                  <SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
                                  <SelectContent>
                                    {(['Uploaded','Pending Review','Approved','Rejected','Requested','Pending Client Review'] as const).map(s => (
                                      <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge variant={getDocumentStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              {isEditing ? (
                                <>
                                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); cancelEditDoc(); }}>Cancel</Button>
                                  <Button variant="default" size="sm" onClick={(e) => { e.stopPropagation(); saveEditDoc(); }}>Save</Button>
                                </>
                              ) : (
                                <>
                                  <Button variant="ghost" size="icon" title="View Document" onClick={(e) => { e.stopPropagation(); setViewingDocument(doc); }}><Eye className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" title="Analyze with AI" onClick={(e) => { e.stopPropagation(); handleAnalyzeDocument(doc); }}><Sparkles className="h-4 w-4 text-primary" /></Button>
                                  <Button variant="ghost" size="icon" title="Approve" onClick={(e) => { e.stopPropagation(); updateDocStatus(doc.id, 'Approved');}}><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                                  <Button variant="ghost" size="icon" title="Reject" onClick={(e) => { e.stopPropagation(); updateDocStatus(doc.id, 'Rejected');}}><XCircle className="h-4 w-4 text-red-600" /></Button>
                                  {party.partyType === 'lead' && (
                                    <>
                                      <Button variant="ghost" size="icon" title="Edit" onClick={(e) => { e.stopPropagation(); startEditDoc(doc); }}><Edit className="h-4 w-4" /></Button>
                                      <Button variant="ghost" size="icon" title="Delete" onClick={(e) => { e.stopPropagation(); deleteDoc(doc.id); }}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                                    </>
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fullscreen Viewer */}
          <DocumentViewer
            isOpen={!!viewingDocument}
            onOpenChange={(open) => { if (!open) setViewingDocument(null); }}
            document={viewingDocument ? { title: viewingDocument.title, url: viewingDocument.url } : null}
          />
        </TabsContent>

        {/* Agreements / Convert */}
        {party.partyType === 'client' && (
          <TabsContent value="agreements" className="mt-4">
            {/* Agreements UI (omitted) */}
          </TabsContent>
        )}
        {party.partyType === 'lead' && (
          <TabsContent value="convert" className="mt-4">
            <Button size="lg" onClick={() => { /* conversion logic */ }}>Convert to Client</Button>
          </TabsContent>
        )}

        {/* Intake Form (clients only) */}
        {party.partyType === 'client' && (
          <TabsContent value="intake-form" className="mt-4">
            {/* Intake UI (omitted) */}
          </TabsContent>
        )}

        {/* Tasks */}
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasks</CardTitle>
              <CardDescription>Track tasks for this {party.partyType}.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Lead-only task add form */}
              {party.partyType === 'lead' && (
                <div className="mb-4 grid gap-3 md:grid-cols-5">
                  <Input
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    className="md:col-span-2"
                  />
                  <Input
                    type="date"
                    value={newTaskDue}
                    onChange={e => setNewTaskDue(e.target.value)}
                    title="Due date"
                  />
                  <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as Task['priority'])}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="md:col-span-5 flex justify-end">
                    <Button size="sm" onClick={() => {
                      if (!newTaskTitle.trim()) return;
                      const task: Task = {
                        id: Date.now(),
                        title: newTaskTitle.trim(),
                        description: undefined,
                        client: { id: (party as any).id, name: party.name, avatar: (party as any).avatar || '' },
                        assignedTo: userProfile ? { name: userProfile.name, avatar: (userProfile as any).avatar || '' } : { name: 'Owner', avatar: '' },
                        dueDate: newTaskDue || format(new Date(), 'yyyy-MM-dd'),
                        priority: newTaskPriority,
                        status: 'To Do',
                      };
                      setLeadTasks(prev => [task, ...prev]);
                      setNewTaskTitle('');
                      setNewTaskDue('');
                      setNewTaskPriority('Medium');
                    }}>Add Task</Button>
                  </div>
                </div>
              )}

              {(!tasks || tasks.length === 0) ? (
                <div className="text-center py-10 text-muted-foreground">No tasks yet.</div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.title}</TableCell>
                          <TableCell>{t.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={t.priority === 'High' ? 'destructive' : t.priority === 'Medium' ? 'warning' : 'secondary'}>{t.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            {party.partyType === 'lead' ? (
                              <Select
                                value={t.status}
                                onValueChange={(v) => setLeadTasks(prev => prev.map(x => x.id === t.id ? { ...x, status: v as Task['status'] } : x))}
                              >
                                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="To Do">To Do</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'info' : 'secondary'}>{t.status}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            {party.partyType === 'lead' && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => setLeadTasks(prev => prev.map(x => x.id === t.id ? { ...x, status: 'Completed' } : x))}>Mark Done</Button>
                                <Button variant="ghost" size="icon" title="Delete" onClick={() => setLeadTasks(prev => prev.filter(x => x.id !== t.id))}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline (clients only) */}
        {party.partyType === 'client' && (
          <TabsContent value="timeline" className="mt-4">
            {/* Timeline UI (omitted) */}
          </TabsContent>
        )}

        {/* Communications — placeholder for parity */}
        <TabsContent value="communications" className="mt-4">
          <div className="text-sm text-muted-foreground">No communications yet.</div>
        </TabsContent>
      </Tabs>

      {/* Dialogs and popups shared with ClientProfile would be implemented here */}
    </div>
  );
};
// --- End full ClientProfile superset logic ---

// --- Editable Lead Summary for left panel ---
import { Pencil } from "lucide-react";

const LeadSummaryEditable: React.FC<{ party: Party; onUpdateParty: (updated: Party) => void }> = ({ party, onUpdateParty }) => {
  const [editing, setEditing] = React.useState(false);
  const answers = (party as any).intake?.answers || {};
  const score = (party as any).intake?.score as number | undefined;
  const [priority, setPriority] = React.useState<string>(() => {
    if (typeof score === "number") {
      if (score >= 70) return "High";
      if (score >= 50) return "Medium";
      return "Low";
    }
    return (party as any).priority || "";
  });
  const [caseType, setCaseType] = React.useState<string>((party as any).caseType || "");
  const [education, setEducation] = React.useState<string>(answers.education || "");
  const [visaStatus, setVisaStatus] = React.useState<string>((party as any).currentVisaStatus || "");

  const [saving, setSaving] = React.useState(false);

  const handleSave = () => {
    setSaving(true);
    // Compose new party object minimally
    const updated = {
      ...party,
      priority,
      caseType,
      currentVisaStatus: visaStatus,
      intake: {
        ...(party as any).intake,
        answers: {
          ...answers,
          education: education || answers.education,
        },
      },
    };
    onUpdateParty(updated as Party);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="relative">
      {!editing && (
        <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={() => setEditing(true)} title="Edit lead info">
          <Pencil className="w-4 h-4" />
        </Button>
      )}
      {editing ? (
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caseType">Case Type</Label>
            <Input id="caseType" value={caseType} onChange={e => setCaseType(e.target.value)} placeholder="e.g. Student visa" />
          </div>
          <div>
            <Label htmlFor="education">Education</Label>
            <Input id="education" value={education} onChange={e => setEducation(e.target.value)} placeholder="e.g. Master" />
          </div>
          <div>
            <Label htmlFor="visaStatus">Current visa Status</Label>
            <Input id="visaStatus" value={visaStatus} onChange={e => setVisaStatus(e.target.value)} placeholder="e.g. Tourist Visa" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {/* Top row: Priority, Case Type, Visa, Last Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground">Priority</p>
              <div className="flex items-center gap-2">
                <Badge variant={priority === 'High' ? 'destructive' : priority === 'Medium' ? 'warning' : 'secondary'}>{priority || '—'}</Badge>
                {typeof score === 'number' && (
                  <span className="text-xs text-muted-foreground">Score: {score}</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Case Type</p>
              <p className={caseType ? "font-semibold" : "text-muted-foreground italic"}>{caseType || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Visa Status</p>
              <p className={visaStatus ? "font-semibold" : "text-muted-foreground italic"}>{visaStatus || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Contact</p>
              <p className="font-semibold">{(party as any).lastContacted || "—"}</p>
            </div>
          </div>

          {/* Divider-like spacing */}
          <div className="h-px bg-muted/60" />

          {/* Screening Answers Summary — connected to intake.answers */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Screening Summary</p>
            <div className="grid grid-cols-2 gap-2">
              <SummaryItem label="Age" value={answers.age ?? '—'} />
              <SummaryItem label="Education" value={answers.education || '—'} />
              <SummaryItem label="English (CLB)" value={answers.englishClb || '—'} />
              <SummaryItem label="French (CLB)" value={answers.frenchClb || '—'} />
              <SummaryItem label="Work (yrs)" value={answers.work ?? '—'} />
              <SummaryItem label="Canadian Work (yrs)" value={answers.canadianWorkYears ?? '—'} />
              <SummaryItem label="Job Offer" value={answers.jobOffer === true || answers.jobOffer === 'Yes' ? 'Yes' : answers.jobOffer === false ? 'No' : '—'} />
              <SummaryItem label="Canadian Study" value={answers.canadianStudy === true || answers.canadianStudy === 'Yes' ? 'Yes' : answers.canadianStudy === false ? 'No' : '—'} />
              <SummaryItem label="PNP" value={answers.provincialNomination === true || answers.provincialNomination === 'Yes' ? 'Yes' : answers.provincialNomination === false ? 'No' : '—'} />
              <SummaryItem label="Relatives in Canada" value={answers.adaptability || '—'} />
              <SummaryItem label="Marital Status" value={answers.maritalStatus || '—'} />
              {(answers.maritalStatus === 'Married') && (
                <>
                  <SummaryItem label="Spouse Education" value={answers.spouseEducation || '—'} />
                  <SummaryItem label="Spouse English (CLB)" value={answers.spouseEnglishClb || '—'} />
                  <SummaryItem label="Spouse French (CLB)" value={answers.spouseFrenchClb || '—'} />
                </>
              )}
              <SummaryItem label="Has Children" value={answers.hasChildren === true ? 'Yes' : answers.hasChildren === false ? 'No' : '—'} />
              {answers.hasChildren && (
                <SummaryItem label="Children Count" value={answers.childrenCount ?? '—'} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Small helper component for summary chips
const SummaryItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium px-2 py-1 rounded-md bg-muted/60 inline-block mt-1">{String(value)}</span>
  </div>
);

