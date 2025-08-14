
'use client';
import * as XLSX from 'xlsx';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGlobalData } from '@/context/GlobalDataContext';
import { type ClientLead, type Client } from '@/lib/data';
import { PlusCircle, User, Upload, Search, MoreHorizontal, Filter, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PartyProfile, Party } from './party-profile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const statusTabs: ClientLead['status'][] = ['New', 'Contacted', 'Qualified', 'Unqualified'];

const getStatusBadgeVariant = (status: ClientLead['status']) => {
    switch (status) {
        case 'New': return 'info';
        case 'Contacted': return 'secondary';
        case 'Qualified': return 'success';
        case 'Unqualified': return 'destructive';
        default: return 'default';
    }
};

export function LeadsPage() {
    const { userProfile, clientLeads, addClientLead, addClient, updateClientLead } = useGlobalData();
    const { toast } = useToast();
    const [selectedLead, setSelectedLead] = useState<ClientLead | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [newLeadName, setNewLeadName] = useState('');
    const [newLeadCompany, setNewLeadCompany] = useState('');
    const [newLeadEmail, setNewLeadEmail] = useState('');
    const [newLeadPhone, setNewLeadPhone] = useState('');
    const [newLeadSource, setNewLeadSource] = useState('Manual Entry');
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [ownershipFilter, setOwnershipFilter] = useState('all');

    const handleConvertLead = (leadId: number) => {
        const lead = clientLeads.find(l => l.id === leadId);
        if (!lead) return;

        const newClient: Client = {
            portalStatus: 'Invited',
            onboardingComplete: false,
            id: Date.now(),
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            caseType: 'Unassigned',
            status: 'Active',
            lastContact: new Date().toISOString().split('T')[0],
            avatar: `https://i.pravatar.cc/150?u=${lead.email}`,
            countryOfOrigin: 'Unknown',
            currentLocation: 'Unknown',
            joined: new Date().toISOString().split('T')[0],
            age: 0,
            educationLevel: 'Unknown',
            caseSummary: {
                priority: 'Medium',
                caseType: 'Unassigned',
                currentStatus: 'New',
                nextStep: 'Initial Consultation',
                dueDate: '',
            },
            activity: [{
                id: Date.now(),
                title: 'Lead Converted',
                description: `Converted from lead, originally from ${lead.source}.`,
                timestamp: new Date().toISOString(),
                teamMember: lead.owner,
            }],
            documents: [],
            tasks: [],
            agreements: [],
            intakeForm: { status: 'not_started' },
            coins: 0,
            connectedLawyerId: null,
            connectionRequestFromLawyerId: null
        };
        addClient(newClient);
        // In a real app, you would also remove the lead from the database
        toast({
            title: 'Lead Converted!',
            description: `${lead.name} is now a client.`,
        });
        setIsSheetOpen(false);
    }
    
    const handleAddLead = () => {
        if (!newLeadName || !newLeadEmail) {
            toast({ title: 'Validation Error', description: 'Name and Email are required.', variant: 'destructive' });
            return;
        }
        const owner = userProfile ? { name: userProfile.name, avatar: (userProfile as any).avatar || '' } : { name: 'Owner', avatar: '' };
        const lead: ClientLead = {
            id: Date.now(),
            name: newLeadName,
            company: newLeadCompany || '',
            email: newLeadEmail,
            phone: newLeadPhone || '',
            status: 'New',
            source: newLeadSource as any,
            owner,
            lastContacted: new Date().toISOString(),
            createdDate: new Date().toISOString(),
            avatar: `https://i.pravatar.cc/150?u=${newLeadEmail}`,
            activity: [],
        } as any;
        addClientLead(lead);
        toast({ title: 'Lead Added', description: `${lead.name} has been added.` });
        setIsAddOpen(false);
        setNewLeadName(''); setNewLeadCompany(''); setNewLeadEmail(''); setNewLeadPhone(''); setNewLeadSource('Manual Entry');
    };
    
    const handleViewLead = (lead: ClientLead) => {
        setSelectedLead(lead);
        setIsSheetOpen(true);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImportFile(file);
    };

    const parseCsv = (text: string): Array<Record<string, string>> => {
        const rows: string[] = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const next = text[i + 1];
            if (c === '"') {
                if (inQuotes && next === '"') { cur += '"'; i++; }
                else { inQuotes = !inQuotes; }
            } else if (c === '\n' && !inQuotes) {
                rows.push(cur); cur = '';
            } else if (c === '\r') {
                // ignore CR, handled by LF
            } else {
                cur += c;
            }
        }
        if (cur) rows.push(cur);
        const splitRow = (row: string) => {
            const out: string[] = [];
            let field = '';
            let q = false;
            for (let i = 0; i < row.length; i++) {
                const ch = row[i];
                const next = row[i + 1];
                if (ch === '"') {
                    if (q && next === '"') { field += '"'; i++; }
                    else { q = !q; }
                } else if (ch === ',' && !q) {
                    out.push(field); field = '';
                } else {
                    field += ch;
                }
            }
            out.push(field);
            return out;
        };
        const header = rows.shift()?.split(',').map(h => h.trim().toLowerCase()) ?? [];
        return rows.filter(r => r.trim() !== '').map(r => {
            const cols = splitRow(r);
            const obj: Record<string, string> = {};
            header.forEach((h, idx) => { obj[h] = (cols[idx] ?? '').trim(); });
            return obj;
        });
    };

    const handleImportLeads = async () => {
        if (!importFile) {
            toast({ title: 'No file selected', description: 'Choose a .csv file to import.', variant: 'destructive' });
            return;
        }
        try {
            const ext = importFile.name.split('.').pop()?.toLowerCase();
            let records: Array<Record<string, string>> = [];
            if (ext === 'csv') {
                const text = await importFile.text();
                records = parseCsv(text);
            } else if (ext === 'xlsx') {
                const buf = await importFile.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });
                const sheetName = wb.SheetNames[0];
                const ws = wb.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
                records = json.map(row => {
                    const obj: Record<string, string> = {};
                    Object.keys(row).forEach(k => {
                        obj[k.toLowerCase()] = String(row[k] ?? '').trim();
                    });
                    return obj;
                });
            } else {
                toast({ title: 'Unsupported file', description: 'Use .csv or .xlsx.', variant: 'destructive' });
                return;
            }
            if (!records.length) {
                toast({ title: 'Empty file', description: 'No rows found.' });
                return;
            }
            let created = 0;
            records.forEach(r => {
                const name = r['name'] || '';
                const email = r['email'] || '';
                const company = r['company'] || '';
                const phone = r['phone'] || '';
                if (!name || !email) return;
                const owner = userProfile ? { name: userProfile.name, avatar: (userProfile as any).avatar || '' } : { name: 'Owner', avatar: '' };
                const lead: ClientLead = {
                    id: Date.now() + Math.floor(Math.random()*1000),
                    name, company, email, phone,
                    status: 'New', source: 'Import' as any,
                    owner,
                    lastContacted: new Date().toISOString(),
                    createdDate: new Date().toISOString(),
                    avatar: `https://i.pravatar.cc/150?u=${email}`,
                    activity: [],
                } as any;
                addClientLead(lead);
                created++;
            });
            toast({ title: 'Import Complete', description: `Imported ${created} lead(s).` });
            setIsImportOpen(false);
            setImportFile(null);
        } catch (e: any) {
            toast({ title: 'Import failed', description: e?.message || 'Could not parse the file.', variant: 'destructive' });
        }
    };

    const handleDownloadSample = () => {
        const headers = ['name','company','email','phone'];
        const sampleRows = [
            ['Jane Doe','Acme Corp','jane.doe@example.com','+1-202-555-0134'],
            ['John Smith','Globex','john.smith@globex.com','+1-202-555-0172']
        ];
        const csv = [headers.join(','), ...sampleRows.map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'client-leads-sample.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const LeadsTable = ({ status }: { status?: ClientLead['status'] }) => {
        const filteredLeads = useMemo(() => {
            return clientLeads.filter(lead => {
                const statusMatch = !status || lead.status === status;
                const searchMatch = searchTerm === '' || lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || (lead.company || '').toLowerCase().includes(searchTerm.toLowerCase());
                const ownerMatch = ownershipFilter === 'all' || (ownershipFilter === 'mine' && lead.owner.name === userProfile?.name);
                return statusMatch && searchMatch && ownerMatch;
            });
        }, [status, searchTerm, ownershipFilter, userProfile, clientLeads]);

        return (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Last Contacted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredLeads.map(lead => (
                    <TableRow key={lead.id} className="cursor-pointer" onClick={() => handleViewLead(lead)}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={lead.avatar} />
                                    <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{lead.name}</div>
                            </div>
                        </TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell><Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge></TableCell>
                        <TableCell>{lead.owner.name}</TableCell>
                        <TableCell suppressHydrationWarning>{format(new Date(lead.lastContacted), 'PP')}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleViewLead(lead)}>View Details</DropdownMenuItem>
                                    {lead.status === 'Qualified' && <DropdownMenuItem onClick={() => handleConvertLead(lead.id)}>Convert to Client</DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {filteredLeads.length === 0 && <p className="text-center text-muted-foreground py-8">No leads match the current filters.</p>}
    </div>
);
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Client Leads</h1>
                        <p className="text-muted-foreground">Manage your pipeline of potential new clients.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Import Leads
                        </Button>
                        <Button onClick={() => setIsAddOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Lead
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 pt-4 flex-wrap">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name or company..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <RadioGroup defaultValue="all" onValueChange={(v) => setOwnershipFilter(v as 'all' | 'mine')} className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All Leads</Label>
                        <RadioGroupItem value="mine" id="mine" />
                        <Label htmlFor="mine">My Leads</Label>
                    </RadioGroup>
                    <Button variant="outline" onClick={() => { setSearchTerm(''); setOwnershipFilter('all'); }}>
                        <Filter className="mr-2 h-4 w-4" /> Reset Filters
                    </Button>
                </div>
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All ({clientLeads.length})</TabsTrigger>
                        {statusTabs.map(status => (
                            <TabsTrigger key={status} value={status}>{status} ({clientLeads.filter(l => l.status === status).length})</TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="all" className="mt-4"><LeadsTable /></TabsContent>
                    {statusTabs.map(status => (
                        <TabsContent key={status} value={status} className="mt-4"><LeadsTable status={status} /></TabsContent>
                    ))}
                </Tabs>
            </div>
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Leads</DialogTitle>
                        <DialogDescription>
                            Upload a CSV or Excel file to bulk import new leads.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="import-file">Upload File (.csv, .xlsx)</Label>
                            <Input id="import-file" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Ensure your file has columns for 'name', 'company', 'email', and 'phone'.
                        </p>
                        <Button type="button" variant="outline" onClick={handleDownloadSample}>
                            <Download className="mr-2 h-4 w-4" /> Download Sample Template
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                        <Button onClick={handleImportLeads}>Import Leads</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {selectedLead && (
                <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <DialogContent className="w-screen max-w-[100vw] h-[100vh] sm:max-w-[96vw] sm:h-[96vh] p-0 overflow-hidden" aria-describedby="lead-detail-description">
                        <p id="lead-detail-description" className="sr-only">Lead details and actions</p>
                        <div className="p-6 h-full overflow-auto">
                            <PartyProfile
                                party={{ ...selectedLead, partyType: 'lead' } as Party}
                                onUpdateParty={updated => updateClientLead(updated as any)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Lead</DialogTitle>
                        <DialogDescription>Enter basic details to add a new lead.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2"><Label htmlFor="lead-name">Name</Label><Input id="lead-name" value={newLeadName} onChange={e => setNewLeadName(e.target.value)} placeholder="e.g., Jane Doe" /></div>
                        <div className="space-y-2"><Label htmlFor="lead-company">Company</Label><Input id="lead-company" value={newLeadCompany} onChange={e => setNewLeadCompany(e.target.value)} placeholder="e.g., Acme Corp" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="lead-email">Email</Label><Input id="lead-email" type="email" value={newLeadEmail} onChange={e => setNewLeadEmail(e.target.value)} placeholder="e.g., jane.doe@example.com" /></div>
                            <div className="space-y-2"><Label htmlFor="lead-phone">Phone</Label><Input id="lead-phone" type="tel" value={newLeadPhone} onChange={e => setNewLeadPhone(e.target.value)} placeholder="+1-202-555-0134" /></div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddLead}>Add Lead</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
