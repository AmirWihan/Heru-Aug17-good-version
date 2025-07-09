
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGlobalData } from '@/context/GlobalDataContext';
import { leadsData, type Lead, type Client } from '@/lib/data';
import { PlusCircle, User, Building, Upload, Search, MoreHorizontal, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LeadDetailSheet } from './lead-detail-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
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

export function LeadsPage() {
    const { userProfile, addClient } = useGlobalData();
    const { toast } = useToast();
    const [leads, setLeads] = useState(leadsData);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [ownershipFilter, setOwnershipFilter] = useState('all');

    const handleConvertLead = (leadId: number) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;

        const newClient: Client = {
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
        setLeads(prev => prev.filter(l => l.id !== leadId));
        toast({
            title: 'Lead Converted!',
            description: `${lead.name} is now a client.`,
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
    
    const LeadsTable = ({ status }: { status?: Lead['status'] }) => {
        const filteredLeads = useMemo(() => {
            return leads.filter(lead => {
                const statusMatch = !status || lead.status === status;
                const searchMatch = searchTerm === '' || lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.company.toLowerCase().includes(searchTerm.toLowerCase());
                const ownerMatch = ownershipFilter === 'all' || (ownershipFilter === 'mine' && lead.owner.name === userProfile?.name);
                return statusMatch && searchMatch && ownerMatch;
            });
        }, [status, searchTerm, ownershipFilter, userProfile]);

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
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Lead Management</CardTitle>
                                <CardDescription>Manage your pipeline of potential new clients.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import Leads
                                </Button>
                                <Button>
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
                            <Input id="import-file" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Ensure your file has columns for 'name', 'company', 'email', and 'phone'.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                        <Button onClick={handleImportLeads}>Import Leads</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {selectedLead && <LeadDetailSheet lead={selectedLead} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} onConvert={handleConvertLead} />}
        </>
    );
}
