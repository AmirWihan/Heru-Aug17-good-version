'use client';
import { useGlobalData } from '@/context/GlobalDataContext';
import { ClientProfile } from '@/components/pages/client-profile';
import { notFound, useParams } from 'next/navigation';
// Removed PartyProfile to ensure full-page matches modal exactly



export default function ClientProfilePage() {
    const params = useParams();
    const { clients, updateClient } = useGlobalData();
    const clientId = parseInt(params.id as string, 10);

    if (!clients) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="text-muted-foreground">Loading client data...</span>
            </div>
        );
    }

    const client = clients.find(c => c.id === clientId);
    if (clients.length > 0 && !client) {
        notFound();
    }

    return (
        client ? (
            <div className="min-h-screen">
                <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl">
                    <ClientProfile client={client} onUpdateClient={updateClient} />
                </div>
            </div>
        ) : null
    );
}
