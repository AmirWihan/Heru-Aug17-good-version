
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGlobalData } from '@/context/GlobalDataContext';
import { type Lead } from '@/lib/data';
import { PlusCircle, Building, Upload, Search, MoreHorizontal, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AdminLeadDetailSheet } from './admin-lead-detail-sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';


const statusTabs: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Unqualified'];

const getStatusBadgeVariant = (status: Lead['status']) => {
    switch (status) {
        case 'New': return 'info';
        case 'Contacted': return 'secondary';
        case 'Qualified': return 'success';
        case 'Unqualified': return 'destructive';
        default: return 'default';
    }
};

export function AdminLeadsPage() {
    const { leads, addLead, convertLeadToFirm, teamMembers } = useGlobalData();
    const { toast } = useToast();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [ownerFilter, setOwnerFilter] = useState('all');

    // Form state for adding a lead
    const [newLeadName, setNewLeadName] = useState('');
    const [newLeadCompany, setNewLeadCompany] = useState('');
    const [newLeadEmail, setNewLeadEmail] = useState('');
    const [newLeadPhone, setNewLeadPhone] = useState('');
    const [newLeadSource, setNewLeadSource] = useState('');

    const salesTeam = teamMembers.filter(m => m.type === 'sales' || m.type === 'advisor' || m.type === 'admin');

    const handleConvertLead = (leadId: number) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;

        convertLeadToFirm(leadId);
        
        toast({
            title: 'Lead Converted!',
            description: `${lead.company} is now a law firm on the platform, pending activation.`,
        });
        setIsSheetOpen(false);
    }
    
    const handleViewLead = (lead: Lead) => {
        setSelectedLead(lead);
        setIsSheetOpen(true);
    };
    
    const handleImportLeads = () => {
        toast({
            title: 'Import Successful',
            description: 'Your leads have been imported. This is a demo.',
        });
        setIsImportOpen(false);
    };

    const handleAddLead = () => {
        if (!newLeadCompany || !newLeadName || !newLeadEmail) {
            toast({ title: "Validation Error", description: "Company, Name, and Email are required.", variant: 'destructive' });
            return;
        }

        const newLead: Lead = {
            id: Date.now(),
            name: newLeadName,
            company: newLeadCompany,
            email: newLeadEmail,
            phone: newLeadPhone,
            status: 'New',
            source: newLeadSource || 'Manual Entry',
            owner: salesTeam[0] || { name: 'Admin', avatar: '' }, // Assign to first sales member or admin
            lastContacted: new Date().toISOString(),
            createdDate: new Date().toISOString(),
            activity: [],
        };
        
        addLead(newLead);
        
        toast({ title: "Lead Added!", description: `${newLeadCompany} has been added to your leads.` });
        
        // Reset form and close dialog
        setIsAddLeadOpen(false);
        setNewLeadName('');
        setNewLeadCompany('');
        setNewLeadEmail('');
        setNewLeadPhone('');
        setNewLeadSource('');
    };

    const LeadsTable = ({ status }: { status?: Lead['status'] }) => {
        const filteredLeads = useMemo(() => {
            return leads.filter(lead => {
                const statusMatch = !status || lead.status === status;
                const searchMatch = searchTerm === '' || lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.company.toLowerCase().includes(searchTerm.toLowerCase());
                const ownerMatch = ownerFilter === 'all' || lead.owner.name === ownerFilter;
                return statusMatch && searchMatch && ownerMatch;
            });
        }, [status, searchTerm, ownerFilter, leads]);

        return (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Firm Name</TableHead>
                            <TableHead>Contact Person</TableHead>
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
                                            <AvatarFallback><Building className="h-4 w-4"/></AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{lead.company}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{lead.name}</TableCell>
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
                                            {lead.status === 'Qualified' && <DropdownMenuItem onClick={() => handleConvertLead(lead.id)}>Convert to Firm</DropdownMenuItem>}
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
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Law Firm Leads</CardTitle>
                                <CardDescription>Manage and track potential law firm partnerships.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import Leads
                                </Button>
                                <Button onClick={() => setIsAddLeadOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Lead
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-4 flex-wrap">
                            <div className="relative flex-1 min-w-[240px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by firm or contact..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                             <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by owner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Owners</SelectItem>
                                    {Array.from(new Set(leads.map(l => l.owner.name))).map(name => (
                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => { setSearchTerm(''); setOwnerFilter('all'); }}>
                                <Filter className="mr-2 h-4 w-4" /> Reset Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <Tabs defaultValue="all">
                            <TabsList>
                                <TabsTrigger value="all">All ({leads.length})</TabsTrigger>
                                {statusTabs.map(status => (
                                    <TabsTrigger key={status} value={status}>{status} ({leads.filter(l => l.status === status).length})</TabsTrigger>
                                ))}
                            </TabsList>
                            <TabsContent value="all" className="mt-4"><LeadsTable /></TabsContent>
                            {statusTabs.map(status => (
                                <TabsContent key={status} value={status} className="mt-4"><LeadsTable status={status} /></TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

             <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Firm Lead</DialogTitle>
                        <DialogDescription>Manually enter the details for a new law firm lead.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2"><Label htmlFor="lead-company">Firm Name</Label><Input id="lead-company" value={newLeadCompany} onChange={(e) => setNewLeadCompany(e.target.value)} placeholder="e.g., Innovate Legal" /></div>
                        <div className="space-y-2"><Label htmlFor="lead-name">Contact Person</Label><Input id="lead-name" value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} placeholder="e.g., Dr. Evelyn Reed" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="lead-email">Email</Label><Input id="lead-email" type="email" value={newLeadEmail} onChange={(e) => setNewLeadEmail(e.target.value)} placeholder="e.g., e.reed@innovatelegal.com" /></div>
                            <div className="space-y-2"><Label htmlFor="lead-phone">Phone</Label><Input id="lead-phone" type="tel" value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="lead-source">Lead Source</Label>
                            <Select value={newLeadSource} onValueChange={setNewLeadSource}>
                                <SelectTrigger><SelectValue placeholder="Select a source" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Website Form">Website Form</SelectItem>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                                    <SelectItem value="Manual Entry">Manual Entry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddLead}>Add Lead</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Firm Leads</DialogTitle>
                        <DialogDescription>
                            Upload a CSV or Excel file to bulk import new law firm leads.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="import-file">Upload File (.csv, .xlsx)</Label>
                            <Input id="import-file" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Ensure your file has columns for 'Firm Name', 'Contact Person', 'Email', and 'Phone'.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                        <Button onClick={handleImportLeads}>Import Leads</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {selectedLead && <AdminLeadDetailSheet lead={selectedLead} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} onConvert={handleConvertLead} />}
        </>
    );
}
