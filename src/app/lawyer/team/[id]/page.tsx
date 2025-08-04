'use client';
import { useGlobalData } from '@/context/GlobalDataContext';
import { TeamMemberPerformancePage } from '@/components/pages/team-member-performance';
import { notFound, useParams } from 'next/navigation';



export default function TeamMemberPage() {
    const params = useParams();
    const { teamMembers } = useGlobalData();
    const memberId = parseInt(params.id as string, 10);
    const teamMember = teamMembers.find(m => m.id === memberId);

    if (!teamMember) {
        notFound();
    }

    return (
        <TeamMemberPerformancePage teamMember={teamMember} />
    );
}
