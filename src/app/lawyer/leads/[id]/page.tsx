"use client";
import { useGlobalData } from '@/context/GlobalDataContext';
import { PartyProfile, Party } from '@/components/pages/party-profile';
import { notFound, useParams } from 'next/navigation';

export default function LeadProfilePage() {
    const params = useParams();
    const { clientLeads, updateClientLead } = useGlobalData();
    const leadId = parseInt(params.id as string, 10);

    // Loading state: if leads are undefined/null, show loader
    if (!clientLeads) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="text-muted-foreground">Loading lead data...</span>
            </div>
        );
    }

    const lead = clientLeads.find(l => l.id === leadId);
    // Only show notFound if leads is loaded and lead is not found
    if (clientLeads.length > 0 && !lead) {
        notFound();
    }

    // Adapt lead to Party type
    const party: Party | undefined = lead ? ({ ...lead, partyType: 'lead' as const }) : undefined;

    return (
        party ? (
            <div className="min-h-screen w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-none">
                    <PartyProfile party={party} onUpdateParty={updated => updateClientLead(updated as any)} />
                </div>
            </div>
        ) : null
    );
}
