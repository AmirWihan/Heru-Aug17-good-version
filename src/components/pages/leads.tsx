
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGlobalData } from '@/context/GlobalDataContext';
import { leadsData, type Lead, type Client } from '@/lib/data';
import { PlusCircle, User, Building, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LeadDetailSheet } from './lead-detail-sheet';


const LeadCard = ({ lead, onConvert, onView }: { lead: Lead, onConvert: (leadId: number) => void, onView: () => void }) => {
    return (
        <Card className="mb-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onView}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={lead.avatar} />
                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold">{lead.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Building className="h-3 w-3"/>{lead.company}</p>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>Source: <Badge variant="secondary">{lead.source}</Badge></p>
                    <p>Owner: {lead.owner.name}</p>
                    <p>Last Contacted: {new Date(lead.lastContacted).toLocaleDateString()}</p>
                </div>
                {lead.status === 'Qualified' &&
                    <Button className="w-full mt-3" size="sm" onClick={(e) => { e.stopPropagation(); onConvert(lead.id); }}>Convert to Client</Button>
                }
            </CardContent>
        </Card>
    )
}

const statusColumns: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Unqualified'];

export function LeadsPage() {
    const { addClient } = useGlobalData();
    const { toast } = useToast();
    const [leads, setLeads] = useState(leadsData);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

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

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-headline text-foreground">Lead Management</h1>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statusColumns.map(status => (
                        <div key={status} className="bg-muted/50 rounded-lg p-4">
                            <h3 className="font-semibold mb-4 text-center">{status} ({leads.filter(l => l.status === status).length})</h3>
                            <div className="space-y-4">
                                {leads.filter(l => l.status === status).map(lead => (
                                    <LeadCard key={lead.id} lead={lead} onConvert={handleConvertLead} onView={() => handleViewLead(lead)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
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
