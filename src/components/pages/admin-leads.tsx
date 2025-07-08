
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalData } from '@/context/GlobalDataContext';
import { type Lead } from '@/lib/data';
import { PlusCircle, User, Building, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AdminLeadDetailSheet } from './admin-lead-detail-sheet';


const LeadCard = ({ lead, onConvert, onView }: { lead: Lead, onConvert: (leadId: number) => void, onView: () => void }) => {
    return (
        <Card className="mb-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onView}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={lead.avatar} />
                        <AvatarFallback><Building className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold">{lead.company}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><User className="h-3 w-3"/>{lead.name}</p>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center">Source: <Badge variant="secondary" className="ml-2">{lead.source}</Badge></div>
                    <p>Owner: {lead.owner.name}</p>
                    <p>Last Contacted: {new Date(lead.lastContacted).toLocaleDateString()}</p>
                </div>
                {lead.status === 'Qualified' &&
                    <Button className="w-full mt-3" size="sm" onClick={(e) => { e.stopPropagation(); onConvert(lead.id); }}>Convert to Firm</Button>
                }
            </CardContent>
        </Card>
    )
}

const statusColumns: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Unqualified'];

export function AdminLeadsPage() {
    const { leads, convertLeadToFirm, setLeads } = useGlobalData();
    const { toast } = useToast();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

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

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-headline text-foreground">Law Firm Leads</h1>
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
