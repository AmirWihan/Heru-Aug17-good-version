'use client';
import { useGlobalData } from '@/context/GlobalDataContext';
import { ClientProfile } from '@/components/pages/client-profile';
import { notFound, useParams } from 'next/navigation';



export default function ClientProfilePage() {
    const params = useParams();
    const { clients, updateClient } = useGlobalData();
    const clientId = parseInt(params.id as string, 10);
    const client = clients.find(c => c.id === clientId);

    if (!client) {
        notFound();
    }

    return (
        <ClientProfile client={client} onUpdateClient={updateClient} />
    );
}
