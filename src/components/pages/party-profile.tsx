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

  const docs: ClientDocument[] = useMemo(() => {
    if (party.partyType === 'client') return ((party as Client).documents) || [];
    return leadDocs;
  }, [party, leadDocs]);

  const updateDocStatus = (docId: number, status: ClientDocument['status']) => {
    const updater = (arr: ClientDocument[]) => arr.map(d => d.id === docId ? { ...d, status } : d);
    if (party.partyType === 'client') {
      const updated = { ...(party as Client), documents: updater(((party as Client).documents) || []) } as Party;
      onUpdateParty(updated);
    } else {
      setLeadDocs(prev => updater(prev));
    }
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
            {/* Right-side actions differ per type; keep layout parity without showing client-only actions */}
            <div className="flex-shrink-0" />
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
      <Tabs defaultValue="overview" className="mt-6">
        <div className="flex justify-between items-center border-b">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            {party.partyType === 'client' && <TabsTrigger value="agreements">Agreements</TabsTrigger>}
            {party.partyType === 'lead' && <TabsTrigger value="convert">Convert</TabsTrigger>}
            <TabsTrigger value="intake-form">Intake Form</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
              {/* Intake Questionnaire for leads before AI Lead Score */}
              {party.partyType === 'lead' && !(party as any).intake?.score && (
                <IntakeScoreQuestionnaire
                  onScore={(score, answers) => {
                    const updated = { ...party, intake: { ...((party as any).intake || {}), score, answers } };
                    onUpdateParty(updated);
                  }}
                />
              )}
              {/* AI Lead Score Card, only after intake score is present */}
              {party.partyType === 'lead' && (party as any).intake?.score && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Lead Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-4">
                      <div className="relative h-28 w-28">
                        <svg viewBox="0 0 36 36" className="h-28 w-28">
                          <path className="text-muted stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-primary stroke-current" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" style={{ strokeDasharray: `${Math.min(Math.max((party as any).intake?.score || 0, 0), 100)}, 100` }} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{Math.round((party as any).intake?.score || 42)}%</div>
                            <div className="text-xs text-muted-foreground">score</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* End Intake/AI Lead Score logic */}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
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
                      {docs.map(doc => (
                        <TableRow key={doc.id} onClick={() => setSelectedDocId(doc.id)} className={cn("cursor-pointer", selectedDocId === doc.id && "bg-muted")}> 
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>{doc.category}</TableCell>
                          <TableCell><Badge variant={getDocumentStatusBadgeVariant(doc.status)}>{doc.status}</Badge></TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" title="View Document" onClick={(e) => { e.stopPropagation(); setViewingDocument(doc); }}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" title="Analyze with AI" onClick={(e) => { e.stopPropagation(); handleAnalyzeDocument(doc); }}><Sparkles className="h-4 w-4 text-primary" /></Button>
                            <Button variant="ghost" size="icon" title="Approve" onClick={(e) => { e.stopPropagation(); updateDocStatus(doc.id, 'Approved');}}><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                            <Button variant="ghost" size="icon" title="Reject" onClick={(e) => { e.stopPropagation(); updateDocStatus(doc.id, 'Rejected');}}><XCircle className="h-4 w-4 text-red-600" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
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

        {/* Intake Form */}
        <TabsContent value="intake-form" className="mt-4">
          {/* Intake UI (omitted) */}
        </TabsContent>

        {/* Tasks */}
        <TabsContent value="tasks" className="mt-4">
          {/* Tasks UI (omitted) */}
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="mt-4">
          {/* Timeline UI (omitted) */}
        </TabsContent>

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
  const [priority, setPriority] = React.useState<string>(() => {
    const score = (party as any).intake?.score as number | undefined;
    if (typeof score === "number") {
      if (score >= 80) return "High";
      if (score >= 50) return "Medium";
      return "Low";
    }
    return (party as any).priority || "";
  });
  const [caseType, setCaseType] = React.useState<string>((party as any).caseType || "");
  const [education, setEducation] = React.useState<string>((party as any).intake?.data?.education?.[0]?.degree || "");
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
        data: {
          ...((party as any).intake?.data || {}),
          education: education ? [{ ...((party as any).intake?.data?.education?.[0] || {}), degree: education }] : ((party as any).intake?.data?.education || []),
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
        <>
          <div>
            <p className="text-muted-foreground">Priority</p>
            <p className={priority ? "font-bold text-base" : "text-muted-foreground italic"}>{priority || "High"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Case Type</p>
            <p className={caseType ? "font-semibold" : "text-muted-foreground italic"}>{caseType || "Student visa"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Education</p>
            <p className={education ? "font-semibold" : "text-muted-foreground italic"}>{education || "Master"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current visa Status</p>
            <p className={visaStatus ? "font-semibold" : "text-muted-foreground italic"}>{visaStatus || "Tourist Visa"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last contact date</p>
            <p className="font-semibold">{(party as any).lastContacted || "—"}</p>
          </div>
        </>
      )}
    </div>
  );
};


