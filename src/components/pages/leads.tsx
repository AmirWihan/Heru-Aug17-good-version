
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGlobalData, type Lead, type Client } from '@/lib/data';
import { PlusCircle, MoreHorizontal, User, Building, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

const LeadCard = ({ lead, onConvert }: { lead: Lead, onConvert: (leadId: number) => void }) => {
    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
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
                    <Button className="w-full mt-3" size="sm" onClick={() => onConvert(lead.id)}>Convert to Client</Button>
                }
            </CardContent>
        </Card>
    )
}

const statusColumns: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Unqualified'];

export function LeadsPage() {
    const { leadsData, teamMembers, addClient } = useGlobalData();
    const { toast } = useToast();
    const [leads, setLeads] = useState(leadsData);

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
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Lead Management</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Lead
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statusColumns.map(status => (
                    <div key={status} className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-4 text-center">{status} ({leads.filter(l => l.status === status).length})</h3>
                        <div className="space-y-4">
                            {leads.filter(l => l.status === status).map(lead => (
                                <LeadCard key={lead.id} lead={lead} onConvert={handleConvertLead} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

    