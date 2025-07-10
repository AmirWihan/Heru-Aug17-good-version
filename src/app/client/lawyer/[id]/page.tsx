
'use client';
import { useGlobalData } from '@/context/GlobalDataContext';
import { LawyerProfileDetail } from '@/components/pages/lawyer-profile-detail';
import { notFound, useParams } from 'next/navigation';

export default function LawyerProfilePage() {
    const params = useParams();
    const { teamMembers } = useGlobalData();
    const lawyerId = parseInt(params.id as string, 10);
    const lawyer = teamMembers.find(l => l.id === lawyerId);

    if (!lawyer) {
        notFound();
    }

    return (
        <LawyerProfileDetail lawyer={lawyer} />
    );
}
